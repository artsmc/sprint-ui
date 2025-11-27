/**
 * Form Validation Tests
 *
 * Unit tests for the validateForm function used in registration.
 * Tests all validation rules for name, email, and password fields.
 */

import { validateForm } from '@/lib/validation/formValidation';

describe('validateForm', () => {
  // =============================================================================
  // Name Validation Tests
  // =============================================================================
  describe('name validation', () => {
    it('should return error when name is empty', () => {
      const errors = validateForm('', 'test@example.com', 'password123');
      expect(errors.name).toBe('Name is required');
    });

    it('should return error when name is only whitespace', () => {
      const errors = validateForm('   ', 'test@example.com', 'password123');
      expect(errors.name).toBe('Name is required');
    });

    it('should return error when name exceeds 100 characters', () => {
      const longName = 'a'.repeat(101);
      const errors = validateForm(longName, 'test@example.com', 'password123');
      expect(errors.name).toBe('Name must be at most 100 characters');
    });

    it('should accept name with exactly 100 characters', () => {
      const maxName = 'a'.repeat(100);
      const errors = validateForm(maxName, 'test@example.com', 'password123');
      expect(errors.name).toBeUndefined();
    });

    it('should accept valid name with leading/trailing spaces (trimmed)', () => {
      const errors = validateForm('  John Doe  ', 'test@example.com', 'password123');
      expect(errors.name).toBeUndefined();
    });
  });

  // =============================================================================
  // Email Validation Tests
  // =============================================================================
  describe('email validation', () => {
    it('should return error when email is empty', () => {
      const errors = validateForm('John Doe', '', 'password123');
      expect(errors.email).toBe('Email is required');
    });

    it('should return error when email is only whitespace', () => {
      const errors = validateForm('John Doe', '   ', 'password123');
      expect(errors.email).toBe('Email is required');
    });

    it('should return error for invalid email format - missing @', () => {
      const errors = validateForm('John Doe', 'testexample.com', 'password123');
      expect(errors.email).toBe('Invalid email address');
    });

    it('should return error for invalid email format - missing domain', () => {
      const errors = validateForm('John Doe', 'test@', 'password123');
      expect(errors.email).toBe('Invalid email address');
    });

    it('should return error for invalid email format - missing TLD', () => {
      const errors = validateForm('John Doe', 'test@example', 'password123');
      expect(errors.email).toBe('Invalid email address');
    });

    it('should return error for invalid email format - spaces in email', () => {
      const errors = validateForm('John Doe', 'test @example.com', 'password123');
      expect(errors.email).toBe('Invalid email address');
    });

    it('should accept valid email address', () => {
      const errors = validateForm('John Doe', 'test@example.com', 'password123');
      expect(errors.email).toBeUndefined();
    });

    it('should accept email with subdomain', () => {
      const errors = validateForm('John Doe', 'test@mail.example.com', 'password123');
      expect(errors.email).toBeUndefined();
    });

    it('should accept email with plus sign', () => {
      const errors = validateForm('John Doe', 'test+tag@example.com', 'password123');
      expect(errors.email).toBeUndefined();
    });
  });

  // =============================================================================
  // Password Validation Tests
  // =============================================================================
  describe('password validation', () => {
    it('should return error when password is empty', () => {
      const errors = validateForm('John Doe', 'test@example.com', '');
      expect(errors.password).toBe('Password is required');
    });

    it('should return error when password is less than 8 characters', () => {
      const errors = validateForm('John Doe', 'test@example.com', '1234567');
      expect(errors.password).toBe('Password must be at least 8 characters');
    });

    it('should accept password with exactly 8 characters', () => {
      const errors = validateForm('John Doe', 'test@example.com', '12345678');
      expect(errors.password).toBeUndefined();
    });

    it('should return error when password exceeds 72 characters', () => {
      const longPassword = 'a'.repeat(73);
      const errors = validateForm('John Doe', 'test@example.com', longPassword);
      expect(errors.password).toBe('Password must be at most 72 characters');
    });

    it('should accept password with exactly 72 characters', () => {
      const maxPassword = 'a'.repeat(72);
      const errors = validateForm('John Doe', 'test@example.com', maxPassword);
      expect(errors.password).toBeUndefined();
    });

    it('should accept password with special characters', () => {
      const errors = validateForm('John Doe', 'test@example.com', 'P@ssw0rd!#$%');
      expect(errors.password).toBeUndefined();
    });
  });

  // =============================================================================
  // Combined Validation Tests
  // =============================================================================
  describe('combined validation', () => {
    it('should return no errors for valid inputs', () => {
      const errors = validateForm('John Doe', 'test@example.com', 'password123');
      expect(errors).toEqual({});
    });

    it('should return multiple errors when multiple fields are invalid', () => {
      const errors = validateForm('', 'invalid-email', 'short');
      expect(errors.name).toBe('Name is required');
      expect(errors.email).toBe('Invalid email address');
      expect(errors.password).toBe('Password must be at least 8 characters');
    });

    it('should return all three errors when all fields are empty', () => {
      const errors = validateForm('', '', '');
      expect(Object.keys(errors)).toHaveLength(3);
      expect(errors.name).toBeDefined();
      expect(errors.email).toBeDefined();
      expect(errors.password).toBeDefined();
    });
  });
});
