import { User } from "../../types/user";

export interface AuthService {
    login(username: string, password: string): Promise<User>;
    logout(): void;
    getCurrentUser(): Promise<User | null>;
  }