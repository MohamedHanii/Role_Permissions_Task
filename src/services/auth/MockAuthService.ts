import { User } from "../../types/user";
import { delayedRandomlyRejectingPromise } from "../../utils/delayed";
import { AuthService } from "./AuthService";

const demoUsers = [
  {
    username: "admin",
    password: "admin123",
    roleId: "346a3cce-49d4-4e3c-bade-a16ed44b98bb"
  },
  {
    username: "user",
    password: "user123",
    roleId: "9faaf9ba-464e-4c68-a901-630fc4de123bb"
  },
  {
    username: "auditor",
    password: "audit123",
    roleId: "6f25f789-72f3-41e2-9561-b30ca19aa225"
  },
];

export class MockAuthService implements AuthService {
  private currentUser: User | null = null;

  login(username: string, password: string): Promise<User> {
    return delayedRandomlyRejectingPromise(() => {
      const user = demoUsers.find(
        (u) => u.username === username && u.password === password
      );
      if (!user) throw new Error("Invalid username or password");

      this.currentUser = {
        username: user.username,
        role: user.roleId,
      };
      return this.currentUser;
    });
  }

  logout(): Promise<void> {
    return delayedRandomlyRejectingPromise(() => {
      this.currentUser = null;
    });
  }

  getCurrentUser(): Promise<User | null> {
    return delayedRandomlyRejectingPromise(() => this.currentUser);
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }
}
