/**
 * API Error Mapper Tests
 *
 * Unit tests for the mapApiError function used in registration.
 * Tests error mapping for different PocketBase API error scenarios.
 */

import { mapApiError, type RegisterError } from '@/lib/utils/apiErrorMapper';

describe('mapApiError', () => {
  // =============================================================================
  // 400 Error Tests (Duplicate Email)
  // =============================================================================
  describe('400 status errors (duplicate email)', () => {
    it('should map 400 error to duplicate email field error', () => {
      const error = { status: 400 };
      const result = mapApiError(error);

      expect(result.type).toBe('field');
      expect(result.fields?.email).toEqual([
        'An account with this email already exists. Please sign in.',
      ]);
      expect(result.fields?.name).toBeUndefined();
      expect(result.fields?.password).toBeUndefined();
      expect(result.message).toBeUndefined();
    });

    it('should map 400 error with additional data to duplicate email error', () => {
      const error = {
        status: 400,
        data: { data: { email: { message: 'Email already exists' } } },
      };
      const result = mapApiError(error);

      // 400 always maps to our custom duplicate email message
      expect(result.type).toBe('field');
      expect(result.fields?.email).toEqual([
        'An account with this email already exists. Please sign in.',
      ]);
    });
  });

  // =============================================================================
  // 422 Error Tests (Validation Errors)
  // =============================================================================
  describe('422 status errors (validation errors)', () => {
    it('should map 422 error with email field to email error', () => {
      const error = {
        status: 422,
        data: {
          data: {
            email: { message: 'Invalid email format' },
          },
        },
      };
      const result = mapApiError(error);

      expect(result.type).toBe('field');
      expect(result.fields?.email).toEqual(['Invalid email format']);
      expect(result.fields?.name).toBeUndefined();
      expect(result.fields?.password).toBeUndefined();
    });

    it('should map 422 error with password field to password error', () => {
      const error = {
        status: 422,
        data: {
          data: {
            password: { message: 'Password too weak' },
          },
        },
      };
      const result = mapApiError(error);

      expect(result.type).toBe('field');
      expect(result.fields?.password).toEqual(['Password too weak']);
      expect(result.fields?.email).toBeUndefined();
      expect(result.fields?.name).toBeUndefined();
    });

    it('should map 422 error with name field to name error', () => {
      const error = {
        status: 422,
        data: {
          data: {
            name: { message: 'Name is required' },
          },
        },
      };
      const result = mapApiError(error);

      expect(result.type).toBe('field');
      expect(result.fields?.name).toEqual(['Name is required']);
      expect(result.fields?.email).toBeUndefined();
      expect(result.fields?.password).toBeUndefined();
    });

    it('should map 422 error with multiple fields to respective field errors', () => {
      const error = {
        status: 422,
        data: {
          data: {
            email: { message: 'Email is invalid' },
            password: { message: 'Password is too short' },
            name: { message: 'Name cannot be empty' },
          },
        },
      };
      const result = mapApiError(error);

      expect(result.type).toBe('field');
      expect(result.fields?.email).toEqual(['Email is invalid']);
      expect(result.fields?.password).toEqual(['Password is too short']);
      expect(result.fields?.name).toEqual(['Name cannot be empty']);
    });

    it('should ignore unrecognized fields in 422 error', () => {
      const error = {
        status: 422,
        data: {
          data: {
            email: { message: 'Email error' },
            unknownField: { message: 'Unknown error' },
          },
        },
      };
      const result = mapApiError(error);

      expect(result.type).toBe('field');
      expect(result.fields?.email).toEqual(['Email error']);
      expect(Object.keys(result.fields || {})).not.toContain('unknownField');
    });

    it('should return general error for 422 without data.data', () => {
      const error = {
        status: 422,
        data: {},
      };
      const result = mapApiError(error);

      expect(result.type).toBe('general');
      expect(result.message).toBe('Something went wrong. Please try again.');
    });
  });

  // =============================================================================
  // Other Error Tests (Generic Errors)
  // =============================================================================
  describe('other errors (generic errors)', () => {
    it('should map 500 error to general error', () => {
      const error = { status: 500 };
      const result = mapApiError(error);

      expect(result.type).toBe('general');
      expect(result.message).toBe('Something went wrong. Please try again.');
      expect(result.fields).toBeUndefined();
    });

    it('should map 503 error to general error', () => {
      const error = { status: 503 };
      const result = mapApiError(error);

      expect(result.type).toBe('general');
      expect(result.message).toBe('Something went wrong. Please try again.');
    });

    it('should map 401 error to general error', () => {
      const error = { status: 401 };
      const result = mapApiError(error);

      expect(result.type).toBe('general');
      expect(result.message).toBe('Something went wrong. Please try again.');
    });

    it('should map 403 error to general error', () => {
      const error = { status: 403 };
      const result = mapApiError(error);

      expect(result.type).toBe('general');
      expect(result.message).toBe('Something went wrong. Please try again.');
    });

    it('should map 404 error to general error', () => {
      const error = { status: 404 };
      const result = mapApiError(error);

      expect(result.type).toBe('general');
      expect(result.message).toBe('Something went wrong. Please try again.');
    });

    it('should map null to general error', () => {
      const result = mapApiError(null);

      expect(result.type).toBe('general');
      expect(result.message).toBe('Something went wrong. Please try again.');
    });

    it('should map undefined to general error', () => {
      const result = mapApiError(undefined);

      expect(result.type).toBe('general');
      expect(result.message).toBe('Something went wrong. Please try again.');
    });

    it('should map string error to general error', () => {
      const result = mapApiError('Network error');

      expect(result.type).toBe('general');
      expect(result.message).toBe('Something went wrong. Please try again.');
    });

    it('should map Error object to general error', () => {
      const result = mapApiError(new Error('Something failed'));

      expect(result.type).toBe('general');
      expect(result.message).toBe('Something went wrong. Please try again.');
    });

    it('should map object without status to general error', () => {
      const result = mapApiError({ message: 'Some error' });

      expect(result.type).toBe('general');
      expect(result.message).toBe('Something went wrong. Please try again.');
    });
  });

  // =============================================================================
  // Type Safety Tests
  // =============================================================================
  describe('type safety', () => {
    it('should return correct RegisterError type for field errors', () => {
      const error = { status: 400 };
      const result: RegisterError = mapApiError(error);

      expect(result.type).toBe('field');
    });

    it('should return correct RegisterError type for general errors', () => {
      const error = { status: 500 };
      const result: RegisterError = mapApiError(error);

      expect(result.type).toBe('general');
    });
  });
});
