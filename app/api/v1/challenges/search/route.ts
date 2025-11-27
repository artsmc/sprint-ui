/**
 * Challenge Search API Route
 *
 * @swagger
 * /api/v1/challenges/search:
 *   get:
 *     tags:
 *       - Challenges
 *     summary: Search challenges
 *     description: |
 *       Search for challenges by title or brief content.
 *       Returns paginated results matching the search query.
 *     operationId: searchChallenges
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *         description: Search query string
 *         example: "dashboard"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number (1-indexed)
 *       - in: query
 *         name: perPage
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Paginated search results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 perPage:
 *                   type: integer
 *                   example: 20
 *                 totalItems:
 *                   type: integer
 *                   example: 5
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Challenge'
 *       422:
 *         description: Validation error (missing or invalid query)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error:
 *                 code: "VALIDATION_ERROR"
 *                 message: "Validation failed"
 *                 status: 422
 *                 details:
 *                   - field: "q"
 *                     message: "Search query is required"
 */

import { NextRequest } from 'next/server';
import { searchChallenges } from '@/lib/api';
import { SearchChallengeQuerySchema } from '@/lib/validation';
import {
  APIErrorHandler,
  APIResponse,
  RequestValidator,
} from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    // Validate query parameters
    const query = RequestValidator.validateQuery(
      request,
      SearchChallengeQuerySchema
    );

    // Call service function
    const result = await searchChallenges(query.q, query.page, query.perPage);

    // Return paginated response
    return APIResponse.success({
      page: result.page,
      perPage: result.perPage,
      totalItems: result.totalItems,
      totalPages: result.totalPages,
      items: result.items,
    });
  } catch (error) {
    return APIErrorHandler.handleError(error);
  }
}
