/**
 * Badges API Routes
 *
 * @swagger
 * /api/v1/badges:
 *   get:
 *     tags:
 *       - Badges
 *     summary: List all badges
 *     description: |
 *       Returns all available achievement badges.
 *       This is public reference data and cached for 1 hour.
 *       Badges are sorted alphabetically by name.
 *     operationId: listBadges
 *     responses:
 *       200:
 *         description: List of all available badges
 *         headers:
 *           Cache-Control:
 *             description: Caching directive
 *             schema:
 *               type: string
 *               example: "public, max-age=3600, stale-while-revalidate=7200"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Badge'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * components:
 *   schemas:
 *     Badge:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique badge identifier
 *           example: "badge123"
 *         name:
 *           type: string
 *           description: Display name of the badge
 *           example: "First Submission"
 *         slug:
 *           type: string
 *           description: URL-friendly identifier
 *           example: "first-submission"
 *         description:
 *           type: string
 *           description: Detailed description of how to earn the badge
 *           example: "Awarded for submitting your first design"
 *         icon:
 *           type: string
 *           description: Icon identifier or emoji for the badge
 *           example: "trophy"
 *         xp_value:
 *           type: integer
 *           description: XP points awarded when earning this badge
 *           example: 100
 *         created:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the badge was created
 *         updated:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the badge was last updated
 */

import { listBadges } from '@/lib/api';
import { APIErrorHandler, APIResponse } from '@/lib/api-utils';

export async function GET() {
  try {
    const badges = await listBadges();
    return APIResponse.withCache(badges, 3600);
  } catch (error) {
    return APIErrorHandler.handleError(error);
  }
}
