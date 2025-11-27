/**
 * Submission Feedback API Routes
 *
 * @swagger
 * /api/v1/submissions/{id}/feedback:
 *   post:
 *     tags:
 *       - Feedback
 *     summary: Create feedback on submission
 *     description: |
 *       Creates structured feedback on a submission.
 *       At least one of works_well, to_improve, or question must be provided.
 *       Requires authentication.
 *     operationId: createFeedback
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Submission ID
 *         schema:
 *           type: string
 *         example: "submission123"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               works_well:
 *                 type: string
 *                 maxLength: 5000
 *                 nullable: true
 *                 description: What works well in the design
 *               to_improve:
 *                 type: string
 *                 maxLength: 5000
 *                 nullable: true
 *                 description: Areas for improvement
 *               question:
 *                 type: string
 *                 maxLength: 2000
 *                 nullable: true
 *                 description: Questions for the designer
 *               is_anonymous:
 *                 type: boolean
 *                 default: false
 *                 description: Whether to hide author identity
 *     responses:
 *       201:
 *         description: Feedback created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Feedback'
 *       400:
 *         description: Validation error - at least one feedback field required
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
 *       - Feedback
 *     summary: Get all feedback for a submission
 *     description: |
 *       Returns all feedback entries for a specific submission.
 *       Results are sorted by creation date (newest first).
 *     operationId: getFeedbackBySubmission
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Submission ID
 *         schema:
 *           type: string
 *         example: "submission123"
 *     responses:
 *       200:
 *         description: List of feedback entries
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Feedback'
 *       404:
 *         description: Submission not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

import { NextRequest } from 'next/server';
import {
  createFeedback,
  getFeedbackBySubmission,
  getSubmission,
} from '@/lib/api';
import { CreateFeedbackSchema } from '@/lib/validation';
import {
  APIErrorHandler,
  APIResponse,
  RequestValidator,
  AuthMiddleware,
} from '@/lib/api-utils';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: submissionId } = await params;

    // Require authentication
    const authResult = await AuthMiddleware.requireAuth(request);

    if (!authResult.success) {
      return APIErrorHandler.unauthorized(authResult.error);
    }

    // Get submission to retrieve sprint_id
    const submission = await getSubmission(submissionId);

    // Validate request body
    const body = await RequestValidator.validateBody(
      request,
      CreateFeedbackSchema
    );

    // Create feedback with sprint_id from submission
    const feedback = await createFeedback(submission.sprint_id, submissionId, {
      works_well: body.works_well ?? undefined,
      to_improve: body.to_improve ?? undefined,
      question: body.question ?? undefined,
      is_anonymous: body.is_anonymous,
    });

    return APIResponse.created(feedback);
  } catch (error) {
    return APIErrorHandler.handleError(error);
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: submissionId } = await params;

    // Verify submission exists
    await getSubmission(submissionId);

    // Get all feedback for this submission
    const feedbackList = await getFeedbackBySubmission(submissionId);

    return APIResponse.success({ data: feedbackList });
  } catch (error) {
    return APIErrorHandler.handleError(error);
  }
}
