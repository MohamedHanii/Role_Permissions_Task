import { MockAuthService } from '../../services/auth/MockAuthService';
import { User } from '../../types/user';

jest.mock('../../utils/delayed', () => ({
  delayedRandomlyRejectingPromise: (fn: () => any) => {
    try {
      return Promise.resolve(fn());
    } catch (error) {
      return Promise.reject(error);
    }
  },
}));

describe('MockAuthService', () => {
  let authService: MockAuthService;

  beforeEach(() => {
    authService = new MockAuthService();
  });

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      const expectedUser: User = {
        username: 'admin',
        role: '346a3cce-49d4-4e3c-bade-a16ed44b98bb',
      };

      const user = await authService.login('admin', 'admin123');
      expect(user).toEqual(expectedUser);
      expect(authService.isAuthenticated()).toBe(true);
    });

    it('should throw error with invalid credentials', async () => {
      try {
        await authService.login('admin', 'wrongpassword');
        fail('Expected login to throw an error');
      } catch (error: any) {
        expect(error.message).toBe('Invalid username or password');
        expect(authService.isAuthenticated()).toBe(false);
      }
    });

    it('should throw error with non-existent user', async () => {
      try {
        await authService.login('nonexistent', 'password');
        fail('Expected login to throw an error');
      } catch (error: any) {
        expect(error.message).toBe('Invalid username or password');
        expect(authService.isAuthenticated()).toBe(false);
      }
    });
  });

  describe('logout', () => {
    it('should successfully logout authenticated user', async () => {
      await authService.login('admin', 'admin123');
      expect(authService.isAuthenticated()).toBe(true);

      await authService.logout();
      expect(authService.isAuthenticated()).toBe(false);
    });

    it('should work even if no user is logged in', async () => {
      expect(authService.isAuthenticated()).toBe(false);
      await authService.logout();
      expect(authService.isAuthenticated()).toBe(false);
    });
  });

  describe('getCurrentUser', () => {
    it('should return null when no user is logged in', async () => {
      const user = await authService.getCurrentUser();
      expect(user).toBeNull();
    });

    it('should return current user when logged in', async () => {
      const expectedUser: User = {
        username: 'user',
        role: '9faaf9ba-464e-4c68-a901-630fc4de123bb',
      };

      await authService.login('user', 'user123');
      const currentUser = await authService.getCurrentUser();
      expect(currentUser).toEqual(expectedUser);
    });
  });

  describe('isAuthenticated', () => {
    it('should return false when no user is logged in', () => {
      expect(authService.isAuthenticated()).toBe(false);
    });

    it('should return true when user is logged in', async () => {
      await authService.login('auditor', 'audit123');
      expect(authService.isAuthenticated()).toBe(true);
    });

    it('should return false after logout', async () => {
      await authService.login('auditor', 'audit123');
      expect(authService.isAuthenticated()).toBe(true);
      
      await authService.logout();
      expect(authService.isAuthenticated()).toBe(false);
    });
  });
}); 