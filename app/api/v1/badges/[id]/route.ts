/**
 * Badge by ID API Routes
 *
 * @swagger
 * /api/v1/badges/{id}:
 *   get:
 *     tags:
 *       - Badges
 *     summary: Get a badge by ID
 *     description: |
 *       Returns a single badge by its unique identifier.
 *       This is public reference data and cached for 1 hour.
 *     operationId: getBadge
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique badge identifier
 *         example: "badge123"
 *     responses:
 *       200:
 *         description: Badge details
 *         headers:
 *           Cache-Control:
 *             description: Caching directive
 *             schema:
 *               type: string
 *               example: "public, max-age=3600, stale-while-revalidate=7200"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Badge'
 *       404:
 *         description: Badge not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

import { NextRequest } from 'next/server';
import { getBadge } from '@/lib/api';
import { APIErrorHandler, APIResponse } from '@/lib/api-utils';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const badge = await getBadge(id);
    return APIResponse.withCache(badge, 3600);
  } catch (error) {
    return APIErrorHandler.handleError(error);
  }
}
