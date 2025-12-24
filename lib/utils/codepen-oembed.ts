/**
 * CodePen oEmbed API integration
 * Documentation: https://blog.codepen.io/documentation/oembed/
 */

export interface CodePenOEmbedResponse {
  success: boolean;
  type: string;
  version: string;
  provider_name: string;
  provider_url: string;
  title: string;
  author_name: string;
  author_url: string;
  height: number;
  width: number;
  thumbnail_url: string;
  thumbnail_width: number;
  thumbnail_height: number;
  html: string;
}

/**
 * Validates if a URL is a valid CodePen URL
 */
export function isValidCodePenUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname === 'codepen.io';
  } catch {
    return false;
  }
}

/**
 * Fetches oEmbed data for a CodePen URL
 * @param url - The CodePen pen URL
 * @param height - Optional custom height for the embed
 * @returns Promise with oEmbed response data
 */
export async function fetchCodePenOEmbed(
  url: string,
  height?: number
): Promise<CodePenOEmbedResponse> {
  if (!isValidCodePenUrl(url)) {
    throw new Error('Invalid CodePen URL');
  }

  const apiUrl = new URL('https://codepen.io/api/oembed');
  apiUrl.searchParams.set('format', 'json');
  apiUrl.searchParams.set('url', url);

  if (height) {
    apiUrl.searchParams.set('height', height.toString());
  }

  const response = await fetch(apiUrl.toString());

  if (!response.ok) {
    throw new Error(`Failed to fetch CodePen oEmbed data: ${response.statusText}`);
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error('CodePen oEmbed request was not successful');
  }

  return data as CodePenOEmbedResponse;
}

/**
 * Extracts the embed HTML from CodePen oEmbed response
 */
export function getCodePenEmbedHtml(oembedData: CodePenOEmbedResponse): string {
  return oembedData.html;
}

/**
 * Gets the thumbnail URL from CodePen oEmbed response
 */
export function getCodePenThumbnail(oembedData: CodePenOEmbedResponse): string {
  return oembedData.thumbnail_url;
}
