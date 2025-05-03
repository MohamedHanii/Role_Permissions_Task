import { Role } from './role';

export type User = {
  id: string;
  username: string;
  password: string;
  role: Role;
};