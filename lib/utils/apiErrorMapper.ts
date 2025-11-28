/**
 * API Error Mapper
 *
 * Maps PocketBase API errors to form-friendly error format.
 * Extracted for testability and reuse.
 */

export interface RegisterError {
  type: 'field' | 'general';
  message?: string;
  fields?: {
    name?: string[];
    email?: string[];
    password?: string[];
  };
}

/**
 * Maps PocketBase API errors to form-friendly error format.
 *
 * Error handling:
 * - 400 status: Duplicate email error
 * - 422 status: Field validation errors from server
 * - Other errors: Generic server error
 *
 * @param error - The error thrown by the API call
 * @returns Formatted error object for form display
 */
export function mapApiError(error: unknown): RegisterError {
  // Handle PocketBase ClientResponseError
  if (error && typeof error === 'object' && 'status' in error) {
    const pbError = error as { status: number; data?: { data?: Record<string, { message: string }> } };

    // Duplicate email (400)
    if (pbError.status === 400) {
      return {
        type: 'field',
        fields: {
          email: ['An account with this email already exists. Please sign in.'],
        },
      };
    }

    // Validation error (422)
    if (pbError.status === 422 && pbError.data?.data) {
      const fields: RegisterError['fields'] = {};

      // Map PocketBase validation errors to fields
      Object.entries(pbError.data.data).forEach(([field, value]) => {
        if (field === 'email' || field === 'password' || field === 'name') {
          fields[field] = [value.message];
        }
      });

      return {
        type: 'field',
        fields,
      };
    }
  }

  // Generic server error
  return {
    type: 'general',
    message: 'Something went wrong. Please try again.',
  };
}

export interface LoginError {
  type: 'field' | 'general';
  message?: string;
  fields?: {
    email?: string[];
    password?: string[];
  };
}

/**
 * Maps PocketBase login errors to form-friendly error format.
 *
 * Error handling:
 * - 401 status: Generic "Invalid email or password" (security: prevents account enumeration)
 * - 422 status: Field validation errors from server
 * - Other errors: Generic server error
 *
 * Security note: For 401 errors, we intentionally use a generic message
 * to prevent attackers from determining which field is incorrect.
 *
 * @param error - The error thrown by the API call
 * @returns Formatted error object for form display
 */
export function mapLoginError(error: unknown): LoginError {
  // Handle PocketBase ClientResponseError
  if (error && typeof error === 'object' && 'status' in error) {
    const pbError = error as { status: number; data?: { data?: Record<string, { message: string }> } };

    // Unauthorized - invalid credentials (401)
    // Security: Use generic message to prevent account enumeration
    if (pbError.status === 401) {
      return {
        type: 'general',
        message: 'Invalid email or password',
      };
    }

    // Validation error (422)
    if (pbError.status === 422 && pbError.data?.data) {
      const fields: LoginError['fields'] = {};

      // Map PocketBase validation errors to fields
      Object.entries(pbError.data.data).forEach(([field, value]) => {
        if (field === 'email' || field === 'password') {
          fields[field] = [value.message];
        }
      });

      return {
        type: 'field',
        fields,
      };
    }
  }

  // Generic server error (network issues, 500s, etc.)
  return {
    type: 'general',
    message: 'Something went wrong. Please try again.',
  };
}
