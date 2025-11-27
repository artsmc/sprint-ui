/**
 * Feedback Helpful Mark API Routes
 *
 * @swagger
 * /api/v1/feedback/{id}/helpful:
 *   post:
 *     tags:
 *       - Feedback
 *     summary: Mark feedback as helpful
 *     description: |
 *       Marks a feedback entry as helpful for the current user.
 *       Each user can only mark feedback as helpful once.
 *       Requires authentication.
 *     operationId: markFeedbackHelpful
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Feedback ID
 *         schema:
 *           type: string
 *         example: "feedback123"
 *     responses:
 *       201:
 *         description: Feedback marked as helpful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: Helpful mark ID
 *                 feedback_id:
 *                   type: string
 *                   description: The feedback that was marked
 *                 marked_by_id:
 *                   type: string
 *                   description: User who marked the feedback
 *                 created:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Feedback already marked as helpful
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
 *         description: Feedback not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *   delete:
 *     tags:
 *       - Feedback
 *     summary: Unmark feedback as helpful
 *     description: |
 *       Removes the helpful mark from a feedback entry for the current user.
 *       Requires authentication.
 *     operationId: unmarkFeedbackHelpful
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Feedback ID
 *         schema:
 *           type: string
 *         example: "feedback123"
 *     responses:
 *       204:
 *         description: Helpful mark removed successfully
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Helpful mark not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

import { NextRequest } from 'next/server';
import {
  markFeedbackHelpful,
  unmarkFeedbackHelpful,
} from '@/lib/api';
import {
  APIErrorHandler,
  APIResponse,
  AuthMiddleware,
} from '@/lib/api-utils';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: feedbackId } = await params;

    // Require authentication
    const authResult = await AuthMiddleware.requireAuth(request);

    if (!authResult.success) {
      return APIErrorHandler.unauthorized(authResult.error);
    }

    // Mark feedback as helpful
    const helpfulMark = await markFeedbackHelpful(feedbackId);

    return APIResponse.created(helpfulMark);
  } catch (error) {
    // Handle already marked error
    if (
      error instanceof Error &&
      error.message.includes('already marked as helpful')
    ) {
      return APIErrorHandler.badRequest(error.message);
    }
    return APIErrorHandler.handleError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: feedbackId } = await params;

    // Require authentication
    const authResult = await AuthMiddleware.requireAuth(request);

    if (!authResult.success) {
      return APIErrorHandler.unauthorized(authResult.error);
    }

    // Unmark feedback as helpful
    await unmarkFeedbackHelpful(feedbackId);

    return APIResponse.noContent();
  } catch (error) {
    // Handle not found error
    if (
      error instanceof Error &&
      error.message.includes('Helpful mark not found')
    ) {
      return APIErrorHandler.notFound(error.message);
    }
    return APIErrorHandler.handleError(error);
  }
}
