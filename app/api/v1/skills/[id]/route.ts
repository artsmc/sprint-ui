/**
 * Skill by ID API Routes
 *
 * @swagger
 * /api/v1/skills/{id}:
 *   get:
 *     tags:
 *       - Skills
 *     summary: Get a skill by ID
 *     description: |
 *       Returns a single skill by its unique identifier.
 *       This is public reference data and cached for 1 hour.
 *     operationId: getSkill
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique skill identifier
 *         example: "skill123"
 *     responses:
 *       200:
 *         description: Skill details
 *         headers:
 *           Cache-Control:
 *             description: Caching directive
 *             schema:
 *               type: string
 *               example: "public, max-age=3600, stale-while-revalidate=7200"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Skill'
 *       404:
 *         description: Skill not found
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
import { getSkill } from '@/lib/api';
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
    const skill = await getSkill(id);
    return APIResponse.withCache(skill, 3600);
  } catch (error) {
    return APIErrorHandler.handleError(error);
  }
}
