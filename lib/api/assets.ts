/**
 * Assets API Service
 *
 * API service for submission asset operations.
 * Handles file uploads, retrieval, deletion, and reordering of submission assets.
 */

import pb from '@/lib/pocketbase';
import type { SubmissionAsset, AssetType } from '@/lib/types';
import { Collections } from '@/lib/types';

// =============================================================================
// Constants
// =============================================================================

/** Maximum file size in bytes (20MB) */
export const MAX_FILE_SIZE = 20 * 1024 * 1024;

/** Allowed MIME types for asset uploads */
export const ALLOWED_MIME_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  pdf: ['application/pdf'],
  zip: ['application/zip'],
} as const;

/** All allowed MIME types as a flat array */
export const ALL_ALLOWED_MIME_TYPES = [
  ...ALLOWED_MIME_TYPES.image,
  ...ALLOWED_MIME_TYPES.pdf,
  ...ALLOWED_MIME_TYPES.zip,
] as const;

// =============================================================================
// Types
// =============================================================================

/**
 * Result of asset type detection from MIME type.
 */
export interface AssetTypeDetectionResult {
  type: AssetType | null;
  isValid: boolean;
}

/**
 * Options for thumbnail URL generation.
 */
export interface ThumbnailOptions {
  /** Thumbnail size (e.g., '100x100', '200x200', '0x300') */
  size?: string;
}

/**
 * Asset validation result.
 */
export interface AssetValidationResult {
  isValid: boolean;
  error?: string;
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Detect the asset type from a file's MIME type.
 *
 * @param mimeType - The MIME type of the file
 * @returns Detection result with the asset type and validity flag
 *
 * @example
 * const result = detectAssetType('image/png');
 * // { type: 'image', isValid: true }
 *
 * @example
 * const result = detectAssetType('text/plain');
 * // { type: null, isValid: false }
 */
export function detectAssetType(mimeType: string): AssetTypeDetectionResult {
  if (ALLOWED_MIME_TYPES.image.includes(mimeType as typeof ALLOWED_MIME_TYPES.image[number])) {
    return { type: 'image', isValid: true };
  }

  if (ALLOWED_MIME_TYPES.pdf.includes(mimeType as typeof ALLOWED_MIME_TYPES.pdf[number])) {
    return { type: 'pdf', isValid: true };
  }

  if (ALLOWED_MIME_TYPES.zip.includes(mimeType as typeof ALLOWED_MIME_TYPES.zip[number])) {
    return { type: 'zip', isValid: true };
  }

  return { type: null, isValid: false };
}

/**
 * Validate an asset file before upload.
 *
 * @param file - The file to validate
 * @returns Validation result with any error message
 *
 * @example
 * const validation = validateAssetFile(file);
 * if (!validation.isValid) {
 *   console.error(validation.error);
 * }
 */
export function validateAssetFile(file: File): AssetValidationResult {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
    };
  }

  // Check MIME type
  const typeDetection = detectAssetType(file.type);
  if (!typeDetection.isValid) {
    return {
      isValid: false,
      error: `File type "${file.type}" is not allowed. Allowed types: ${ALL_ALLOWED_MIME_TYPES.join(', ')}`,
    };
  }

  return { isValid: true };
}

// =============================================================================
// Asset Upload Functions
// =============================================================================

/**
 * Upload an asset file to a submission.
 *
 * @param submissionId - The ID of the submission to attach the asset to
 * @param file - The file to upload
 * @param type - The asset type (image, pdf, zip). If not provided, will be auto-detected from MIME type
 * @param sortOrder - Optional sort order for the asset (defaults to next available order)
 * @returns The created submission asset record
 * @throws Error if file validation fails or upload fails
 *
 * @example
 * const asset = await uploadAsset(submissionId, imageFile, 'image');
 *
 * @example
 * // Auto-detect type from file
 * const asset = await uploadAsset(submissionId, file);
 */
export async function uploadAsset(
  submissionId: string,
  file: File,
  type?: AssetType,
  sortOrder?: number
): Promise<SubmissionAsset> {
  // Validate file
  const validation = validateAssetFile(file);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  // Determine asset type
  let assetType = type;
  if (!assetType) {
    const detection = detectAssetType(file.type);
    if (!detection.isValid || !detection.type) {
      throw new Error(`Unable to determine asset type for MIME type: ${file.type}`);
    }
    assetType = detection.type;
  }

  // Determine sort order if not provided
  let order = sortOrder;
  if (order === undefined) {
    const existingAssets = await getAssets(submissionId);
    order = existingAssets.length > 0
      ? Math.max(...existingAssets.map((a) => a.sort_order)) + 1
      : 0;
  }

  // Build form data for upload
  const formData = new FormData();
  formData.append('submission_id', submissionId);
  formData.append('asset_type', assetType);
  formData.append('file', file);
  formData.append('sort_order', order.toString());

  return pb
    .collection(Collections.SUBMISSION_ASSETS)
    .create<SubmissionAsset>(formData);
}

// =============================================================================
// Asset Retrieval Functions
// =============================================================================

/**
 * Get all assets for a submission.
 *
 * @param submissionId - The ID of the submission
 * @returns Array of submission assets sorted by sort_order
 *
 * @example
 * const assets = await getAssets(submissionId);
 * assets.forEach(asset => console.log(getAssetUrl(asset)));
 */
export async function getAssets(submissionId: string): Promise<SubmissionAsset[]> {
  return pb
    .collection(Collections.SUBMISSION_ASSETS)
    .getFullList<SubmissionAsset>({
      filter: `submission_id = "${submissionId}"`,
      sort: 'sort_order',
    });
}

/**
 * Get a single asset by its ID.
 *
 * @param id - The asset ID
 * @returns The submission asset record
 * @throws Error if asset not found
 *
 * @example
 * const asset = await getAsset(assetId);
 */
export async function getAsset(id: string): Promise<SubmissionAsset> {
  return pb.collection(Collections.SUBMISSION_ASSETS).getOne<SubmissionAsset>(id);
}

/**
 * Get the count of assets for a submission.
 *
 * @param submissionId - The ID of the submission
 * @returns The number of assets attached to the submission
 *
 * @example
 * const count = await getAssetCount(submissionId);
 * console.log(`Submission has ${count} assets`);
 */
export async function getAssetCount(submissionId: string): Promise<number> {
  const result = await pb
    .collection(Collections.SUBMISSION_ASSETS)
    .getList<SubmissionAsset>(1, 1, {
      filter: `submission_id = "${submissionId}"`,
    });

  return result.totalItems;
}

// =============================================================================
// Asset URL Functions
// =============================================================================

/**
 * Get the file URL for an asset.
 *
 * @param asset - The submission asset record
 * @returns The full URL to the asset file
 *
 * @example
 * const url = getAssetUrl(asset);
 * // Returns: http://localhost:8090/api/files/submission_assets/{id}/{filename}
 */
export function getAssetUrl(asset: SubmissionAsset): string {
  if (!asset.file) {
    return '';
  }

  return pb.files.getURL(asset, asset.file);
}

/**
 * Get a thumbnail URL for an image asset.
 *
 * @param asset - The submission asset record
 * @param size - Optional thumbnail size (e.g., '100x100', '200x200', '0x300' for height-only)
 * @returns The thumbnail URL, or empty string if not an image or no file
 *
 * @example
 * // Get 200x200 thumbnail
 * const thumbUrl = getAssetThumbnailUrl(asset, '200x200');
 *
 * @example
 * // Get thumbnail with auto-width, 300px height
 * const thumbUrl = getAssetThumbnailUrl(asset, '0x300');
 */
export function getAssetThumbnailUrl(
  asset: SubmissionAsset,
  size?: string
): string {
  // Only images support thumbnails
  if (asset.asset_type !== 'image' || !asset.file) {
    return '';
  }

  const thumbSize = size || '100x100';
  return pb.files.getURL(asset, asset.file, { thumb: thumbSize });
}

// =============================================================================
// Asset Management Functions
// =============================================================================

/**
 * Delete an asset by its ID.
 *
 * @param id - The asset ID to delete
 * @returns True if deletion was successful
 * @throws Error if deletion fails
 *
 * @example
 * await deleteAsset(assetId);
 */
export async function deleteAsset(id: string): Promise<boolean> {
  await pb.collection(Collections.SUBMISSION_ASSETS).delete(id);
  return true;
}

/**
 * Reorder assets for a submission.
 *
 * Updates the sort_order of assets to match the order of the provided asset IDs array.
 *
 * @param submissionId - The ID of the submission
 * @param assetIds - Array of asset IDs in the desired order
 * @returns Array of updated submission asset records
 * @throws Error if any asset ID doesn't belong to the submission
 *
 * @example
 * // Reorder assets to: [asset3, asset1, asset2]
 * const reordered = await reorderAssets(submissionId, [asset3Id, asset1Id, asset2Id]);
 */
export async function reorderAssets(
  submissionId: string,
  assetIds: string[]
): Promise<SubmissionAsset[]> {
  // Verify all asset IDs belong to this submission
  const existingAssets = await getAssets(submissionId);
  const existingAssetIds = new Set(existingAssets.map((a) => a.id));

  for (const assetId of assetIds) {
    if (!existingAssetIds.has(assetId)) {
      throw new Error(
        `Asset ${assetId} does not belong to submission ${submissionId}`
      );
    }
  }

  // Update sort_order for each asset
  const updatePromises = assetIds.map((assetId, index) =>
    pb
      .collection(Collections.SUBMISSION_ASSETS)
      .update<SubmissionAsset>(assetId, { sort_order: index })
  );

  const updatedAssets = await Promise.all(updatePromises);

  // Return sorted by new sort_order
  return updatedAssets.sort((a, b) => a.sort_order - b.sort_order);
}
