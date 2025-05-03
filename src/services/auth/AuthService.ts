import { User, Role } from './types';

const mockUsers: Record<string, { password: string; role: Role }> = {
  admin: { password: 'admin123', role: 'Administrator' },
  user: { password: 'user123', role: 'User' },
  auditor: { password: 'audit123', role: 'Auditor' },
};

const STORAGE_KEY = 'auth_user';

export const AuthService = {
  login: async (username: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = mockUsers[username];
        if (!user || user.password !== password) {
          return reject(new Error('Invalid username or password'));
        }
        const authUser: User = { username, role: user.role };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
        resolve(authUser);
      }, 500);
    });
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
  },

  getCurrentUser: (): User | null => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(STORAGE_KEY);
  },
};
