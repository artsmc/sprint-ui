/**
 * Skills API Routes
 *
 * @swagger
 * /api/v1/skills:
 *   get:
 *     tags:
 *       - Skills
 *     summary: List all skills
 *     description: |
 *       Returns all available design skills.
 *       This is public reference data and cached for 1 hour.
 *       Skills are sorted alphabetically by name.
 *     operationId: listSkills
 *     responses:
 *       200:
 *         description: List of all available skills
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
 *                 $ref: '#/components/schemas/Skill'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * components:
 *   schemas:
 *     Skill:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique skill identifier
 *           example: "skill123"
 *         name:
 *           type: string
 *           description: Display name of the skill
 *           example: "Visual Design"
 *         slug:
 *           type: string
 *           description: URL-friendly identifier
 *           example: "visual-design"
 *         description:
 *           type: string
 *           description: Detailed description of the skill
 *           example: "Creating aesthetically pleasing and effective visual compositions"
 *         icon:
 *           type: string
 *           description: Icon identifier or emoji for the skill
 *           example: "palette"
 *         created:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the skill was created
 *         updated:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the skill was last updated
 */

import { listSkills } from '@/lib/api';
import { APIErrorHandler, APIResponse } from '@/lib/api-utils';

export async function GET() {
  try {
    const skills = await listSkills();
    return APIResponse.withCache(skills, 3600);
  } catch (error) {
    return APIErrorHandler.handleError(error);
  }
}
