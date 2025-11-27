/**
 * Submission Votes API Routes
 *
 * @swagger
 * /api/v1/submissions/{id}/votes:
 *   post:
 *     tags:
 *       - Votes
 *     summary: Create or update vote on submission
 *     description: |
 *       Creates a new vote or updates an existing vote on a submission.
 *       Requires authentication. Cannot vote on own submission.
 *       If the user has already voted, the existing vote will be updated.
 *     operationId: createOrUpdateVote
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
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating_clarity
 *               - rating_usability
 *               - rating_visual_craft
 *               - rating_originality
 *             properties:
 *               rating_clarity:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Rating for design clarity (1-5)
 *                 example: 4
 *               rating_usability:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Rating for usability (1-5)
 *                 example: 5
 *               rating_visual_craft:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Rating for visual craft (1-5)
 *                 example: 4
 *               rating_originality:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Rating for originality (1-5)
 *                 example: 3
 *     responses:
 *       200:
 *         description: Vote updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 vote:
 *                   $ref: '#/components/schemas/Vote'
 *                 action:
 *                   type: string
 *                   enum: [updated]
 *                   example: updated
 *       201:
 *         description: Vote created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 vote:
 *                   $ref: '#/components/schemas/Vote'
 *                 action:
 *                   type: string
 *                   enum: [created]
 *                   example: created
 *       400:
 *         description: Cannot vote on own submission
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Authentication required
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
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *   get:
 *     tags:
 *       - Votes
 *     summary: Get votes and statistics for a submission
 *     description: |
 *       Returns all votes for a submission along with aggregated statistics.
 *       Statistics include average ratings for each category and overall.
 *     operationId: getSubmissionVotes
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
 *         description: Votes and statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 votes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Vote'
 *                 stats:
 *                   type: object
 *                   properties:
 *                     submission_id:
 *                       type: string
 *                       example: "submission123"
 *                     total_votes:
 *                       type: integer
 *                       example: 15
 *                     avg_clarity:
 *                       type: number
 *                       format: float
 *                       example: 4.2
 *                     avg_usability:
 *                       type: number
 *                       format: float
 *                       example: 3.8
 *                     avg_visual_craft:
 *                       type: number
 *                       format: float
 *                       example: 4.5
 *                     avg_originality:
 *                       type: number
 *                       format: float
 *                       example: 3.9
 *                     avg_overall:
 *                       type: number
 *                       format: float
 *                       example: 4.1
 *       404:
 *         description: Submission not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

import { NextRequest } from 'next/server';
import {
  createVote,
  updateVote,
  getVotesBySubmission,
  getUserVote,
  getVoteStats,
  getSubmission,
} from '@/lib/api';
import { VoteRatingsSchema } from '@/lib/validation';
import {
  APIErrorHandler,
  APIResponse,
  RequestValidator,
  AuthMiddleware,
} from '@/lib/api-utils';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/v1/submissions/[id]/votes
 * Create or update a vote on a submission
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: submissionId } = await params;

    // Require authentication
    const authResult = await AuthMiddleware.requireAuth(request);

    if (!authResult.success) {
      return APIErrorHandler.unauthorized(authResult.error);
    }

    const { user } = authResult.context;

    // Validate request body
    const ratings = await RequestValidator.validateBody(
      request,
      VoteRatingsSchema
    );

    // Get the submission to check owner and sprint
    const submission = await getSubmission(submissionId);

    // Check if user is trying to vote on their own submission
    if (submission.user_id === user.id) {
      return APIErrorHandler.badRequest('Cannot vote on your own submission');
    }

    // Check if user already has a vote on this submission
    const existingVote = await getUserVote(submissionId, user.id);

    if (existingVote) {
      // Update existing vote
      const updatedVote = await updateVote(existingVote.id, ratings);

      return APIResponse.success({
        vote: updatedVote,
        action: 'updated',
      });
    }

    // Create new vote
    const newVote = await createVote(submission.sprint_id, submissionId, ratings);

    return APIResponse.created({
      vote: newVote,
      action: 'created',
    });
  } catch (error) {
    return APIErrorHandler.handleError(error);
  }
}

/**
 * GET /api/v1/submissions/[id]/votes
 * Get all votes and statistics for a submission
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: submissionId } = await params;

    // Verify submission exists (will throw 404 if not found)
    await getSubmission(submissionId);

    // Get all votes and statistics in parallel
    const [votes, stats] = await Promise.all([
      getVotesBySubmission(submissionId),
      getVoteStats(submissionId),
    ]);

    return APIResponse.success({
      votes,
      stats,
    });
  } catch (error) {
    return APIErrorHandler.handleError(error);
  }
}
