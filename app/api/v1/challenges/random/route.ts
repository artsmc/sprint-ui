/**
 * Random Challenge API Route
 *
 * @swagger
 * /api/v1/challenges/random:
 *   get:
 *     tags:
 *       - Challenges
 *     summary: Get a random challenge
 *     description: |
 *       Returns a single randomly selected challenge.
 *       Useful for "surprise me" or random challenge selection features.
 *       Each call may return a different challenge.
 *     operationId: getRandomChallenge
 *     responses:
 *       200:
 *         description: A random challenge
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Challenge'
 *       404:
 *         description: No challenges available
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error:
 *                 code: "NOT_FOUND"
 *                 message: "No challenges available"
 *                 status: 404
 */

import { getRandomChallenge } from '@/lib/api';
import { APIErrorHandler, APIResponse } from '@/lib/api-utils';

export async function GET() {
  try {
    // Call service function
    const challenge = await getRandomChallenge();

    return APIResponse.success(challenge);
  } catch (error) {
    return APIErrorHandler.handleError(error);
  }
}
