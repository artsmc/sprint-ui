/**
 * Submission Assets API Routes
 *
 * @swagger
 * /api/v1/submissions/{id}/assets:
 *   get:
 *     tags:
 *       - Submission Assets
 *     summary: Get submission assets
 *     description: |
 *       Returns all assets attached to a submission.
 *       Assets are sorted by sort_order.
 *     operationId: getSubmissionAssets
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Submission ID
 *         example: "submission123"
 *     responses:
 *       200:
 *         description: List of assets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SubmissionAsset'
 *       404:
 *         description: Submission not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *   post:
 *     tags:
 *       - Submission Assets
 *     summary: Upload an asset
 *     description: |
 *       Uploads a new asset file to a submission.
 *       Only the submission owner can upload assets.
 *       Requires authentication.
 *
 *       Allowed file types:
 *       - Images: JPEG, PNG, GIF, WebP
 *       - PDF documents
 *       - ZIP archives
 *
 *       Maximum file size: 20MB
 *     operationId: uploadAsset
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Submission ID
 *         example: "submission123"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The asset file to upload
 *     responses:
 *       201:
 *         description: Asset uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubmissionAsset'
 *       400:
 *         description: Invalid file type or size
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error:
 *                 code: "BAD_REQUEST"
 *                 message: "File type \"text/plain\" is not allowed"
 *                 status: 400
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Not the owner of this submission
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Submission not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       413:
 *         description: File size exceeds maximum allowed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * components:
 *   schemas:
 *     SubmissionAsset:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "asset123"
 *         submission_id:
 *           type: string
 *           example: "submission123"
 *         file:
 *           type: string
 *           description: Filename of the uploaded asset
 *           example: "design_v1.png"
 *         asset_type:
 *           type: string
 *           enum: [image, pdf, zip]
 *           example: "image"
 *         sort_order:
 *           type: integer
 *           example: 0
 *         created:
 *           type: string
 *           format: date-time
 *         updated:
 *           type: string
 *           format: date-time
 */

import { NextRequest } from 'next/server';
import {
  getAssets,
  uploadAsset,
  getSubmission,
  validateAssetFile,
  MAX_FILE_SIZE,
} from '@/lib/api';
import { APIErrorHandler, APIResponse, AuthMiddleware } from '@/lib/api-utils';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: submissionId } = await params;

    // Get assets for submission
    const assets = await getAssets(submissionId);

    return APIResponse.success(assets);
  } catch (error) {
    return APIErrorHandler.handleError(error);
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: submissionId } = await params;

    // Require authentication
    const authResult = await AuthMiddleware.requireAuth(request);

    if (!authResult.success) {
      return APIErrorHandler.unauthorized(authResult.error);
    }

    // Verify ownership of submission
    const submission = await getSubmission(submissionId);
    if (submission.user_id !== authResult.context.user.id) {
      return APIErrorHandler.forbidden(
        'You can only upload assets to your own submissions'
      );
    }

    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return APIErrorHandler.badRequest('No file provided');
    }

    // Validate file
    const validation = validateAssetFile(file);
    if (!validation.isValid) {
      // Check if it's a size error
      if (validation.error?.includes('size exceeds')) {
        return new Response(
          JSON.stringify({
            error: {
              code: 'PAYLOAD_TOO_LARGE',
              message: validation.error,
              status: 413,
            },
          }),
          {
            status: 413,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
      return APIErrorHandler.badRequest(validation.error || 'Invalid file');
    }

    // Upload asset
    const asset = await uploadAsset(submissionId, file);

    return APIResponse.created(asset);
  } catch (error) {
    return APIErrorHandler.handleError(error);
  }
}
