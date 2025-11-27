/**
 * Form Validation Utilities
 *
 * Reusable validation functions for form fields.
 * Extracted for testability and reuse across forms.
 */

export interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
}

/**
 * Validates registration form fields.
 *
 * @param name - User's full name
 * @param email - User's email address
 * @param password - User's password
 * @returns Object containing error messages for invalid fields
 */
export function validateForm(name: string, email: string, password: string): FormErrors {
  const errors: FormErrors = {};

  // Name validation
  if (!name.trim()) {
    errors.name = 'Name is required';
  } else if (name.trim().length > 100) {
    errors.name = 'Name must be at most 100 characters';
  }

  // Email validation
  if (!email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Invalid email address';
  }

  // Password validation
  if (!password) {
    errors.password = 'Password is required';
  } else if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  } else if (password.length > 72) {
    errors.password = 'Password must be at most 72 characters';
  }

  return errors;
}
