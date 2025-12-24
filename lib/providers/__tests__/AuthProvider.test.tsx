/**
 * Unit Tests for AuthProvider
 */

import { render, waitFor } from '@testing-library/react';
import { AuthProvider } from '../AuthProvider';
import pb from '@/lib/pocketbase';
import { useAuthStore } from '@/lib/stores/auth';

// Mock dependencies
jest.mock('@/lib/pocketbase', () => ({
  __esModule: true,
  default: {
    authStore: {
      isValid: false,
      token: '',
      record: null,
      save: jest.fn(),
      clear: jest.fn(),
      loadFromCookie: jest.fn(),
      onChange: jest.fn(() => jest.fn()), // Returns unsubscribe function
    },
  },
}));

jest.mock('@/lib/stores/auth', () => ({
  useAuthStore: {
    getState: jest.fn(() => ({
      setAuth: jest.fn(),
      clearAuth: jest.fn(),
    })),
  },
}));

// Mock document.cookie
Object.defineProperty(document, 'cookie', {
  writable: true,
  value: '',
});

describe('AuthProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.cookie = '';
    pb.authStore.isValid = false;
    pb.authStore.token = '';
    pb.authStore.record = null;
  });

  describe('initialization', () => {
    it('should render children', () => {
      const { getByText } = render(
        <AuthProvider>
          <div>Test Child</div>
        </AuthProvider>
      );

      expect(getByText('Test Child')).toBeInTheDocument();
    });

    it('should call loadFromCookie on mount', () => {
      render(
        <AuthProvider>
          <div>Test</div>
        </AuthProvider>
      );

      expect(pb.authStore.loadFromCookie).toHaveBeenCalledWith(document.cookie);
    });

    it('should sync with Zustand store when auth is valid', async () => {
      const mockUser = { id: 'user-123', name: 'Test User', email: 'test@example.com' };
      const mockToken = 'test-token';

      pb.authStore.isValid = true;
      pb.authStore.token = mockToken;
      pb.authStore.record = mockUser;

      const mockSetAuth = jest.fn();
      (useAuthStore.getState as jest.Mock).mockReturnValue({
        setAuth: mockSetAuth,
        clearAuth: jest.fn(),
      });

      render(
        <AuthProvider>
          <div>Test</div>
        </AuthProvider>
      );

      await waitFor(() => {
        expect(mockSetAuth).toHaveBeenCalledWith(mockUser, mockToken);
      });
    });

    it('should clear Zustand store when auth is invalid', async () => {
      pb.authStore.isValid = false;

      const mockClearAuth = jest.fn();
      (useAuthStore.getState as jest.Mock).mockReturnValue({
        setAuth: jest.fn(),
        clearAuth: mockClearAuth,
      });

      render(
        <AuthProvider>
          <div>Test</div>
        </AuthProvider>
      );

      await waitFor(() => {
        expect(mockClearAuth).toHaveBeenCalled();
      });
    });
  });

  describe('auth state changes', () => {
    it('should subscribe to PocketBase auth changes', () => {
      render(
        <AuthProvider>
          <div>Test</div>
        </AuthProvider>
      );

      expect(pb.authStore.onChange).toHaveBeenCalled();
    });

    it('should sync auth changes to Zustand store', async () => {
      const mockUser = { id: 'user-456', name: 'New User', email: 'new@example.com' };
      const mockToken = 'new-token';

      let onChangeCallback: (token: string, record: any) => void;

      (pb.authStore.onChange as jest.Mock).mockImplementation((callback) => {
        onChangeCallback = callback;
        return jest.fn(); // Return unsubscribe function
      });

      const mockSetAuth = jest.fn();
      (useAuthStore.getState as jest.Mock).mockReturnValue({
        setAuth: mockSetAuth,
        clearAuth: jest.fn(),
      });

      render(
        <AuthProvider>
          <div>Test</div>
        </AuthProvider>
      );

      // Simulate auth change
      await waitFor(() => {
        expect(onChangeCallback!).toBeDefined();
      });

      onChangeCallback!(mockToken, mockUser);

      expect(mockSetAuth).toHaveBeenCalledWith(mockUser, mockToken);
    });

    it('should clear auth when token is removed', async () => {
      let onChangeCallback: (token: string, record: any) => void;

      (pb.authStore.onChange as jest.Mock).mockImplementation((callback) => {
        onChangeCallback = callback;
        return jest.fn();
      });

      const mockClearAuth = jest.fn();
      (useAuthStore.getState as jest.Mock).mockReturnValue({
        setAuth: jest.fn(),
        clearAuth: mockClearAuth,
      });

      render(
        <AuthProvider>
          <div>Test</div>
        </AuthProvider>
      );

      await waitFor(() => {
        expect(onChangeCallback!).toBeDefined();
      });

      // Simulate auth cleared
      onChangeCallback!('', null);

      expect(mockClearAuth).toHaveBeenCalled();
    });
  });

  describe('cleanup', () => {
    it('should unsubscribe from auth changes on unmount', () => {
      const mockUnsubscribe = jest.fn();

      (pb.authStore.onChange as jest.Mock).mockReturnValue(mockUnsubscribe);

      const { unmount } = render(
        <AuthProvider>
          <div>Test</div>
        </AuthProvider>
      );

      unmount();

      expect(mockUnsubscribe).toHaveBeenCalled();
    });
  });
});
