/**
 * API Utilities Barrel Export
 *
 * Central export point for all API route utilities.
 *
 * @example
 * import {
 *   APIErrorHandler,
 *   APIResponse,
 *   RequestValidator,
 *   AuthMiddleware,
 *   PaginationQuerySchema,
 * } from '@/lib/api-utils';
 */

// Error handling
export {
  APIErrorHandler,
  ErrorCodes,
  type APIError,
  type ErrorCode,
} from './error-handler';

// Response formatting
export {
  APIResponse,
  type PaginatedResponse,
} from './response';

// Request validation
export {
  RequestValidator,
  PaginationQuerySchema,
  IdParamSchema,
  type PaginationQuery,
  type IdParam,
} from './validation';

// Authentication
export {
  AuthMiddleware,
  type AuthContext,
  type AuthResult,
} from './auth-middleware';
