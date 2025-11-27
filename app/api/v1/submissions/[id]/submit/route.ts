/**
 * Submit Design API Route
 *
 * @swagger
 * /api/v1/submissions/{id}/submit:
 *   post:
 *     tags:
 *       - Submissions
 *     summary: Submit a design
 *     description: |
 *       Finalizes a draft submission by changing its status to 'submitted'.
 *       Sets the submitted_at timestamp to the current time.
 *       Only the submission owner can submit.
 *       Requires authentication.
 *     operationId: submitDesign
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
 *     responses:
 *       200:
 *         description: Design submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Submission'
 *       400:
 *         description: Design has already been submitted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error:
 *                 code: "BAD_REQUEST"
 *                 message: "Design has already been submitted"
 *                 status: 400
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Not the owner of this submission
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
 */

import { NextRequest } from 'next/server';
import { submitDesign } from '@/lib/api';
import { APIErrorHandler, APIResponse, AuthMiddleware } from '@/lib/api-utils';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Require authentication
    const authResult = await AuthMiddleware.requireAuth(request);

    if (!authResult.success) {
      return APIErrorHandler.unauthorized(authResult.error);
    }

    // Call service function (handles ownership validation)
    const submission = await submitDesign(id);

    return APIResponse.success(submission);
  } catch (error) {
    // Handle ownership error
    if (
      error instanceof Error &&
      error.message.includes('only submit your own')
    ) {
      return APIErrorHandler.forbidden(error.message);
    }
    // Handle already submitted error
    if (
      error instanceof Error &&
      error.message.includes('already been submitted')
    ) {
      return APIErrorHandler.badRequest(error.message);
    }
    return APIErrorHandler.handleError(error);
  }
}
