import {
  Permission,
  Role,
  RoleId,
} from "../../types/role";

export interface RoleService {
  getRoles(): Promise<Role[]>;
  getPermissions(): Promise<Permission[]>;
  setPermissionsForRole(
    roleId: RoleId,
    permissions: Permission[]
  ): Promise<Role>;
}