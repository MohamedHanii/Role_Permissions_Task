export type RoleId = string;
export type PermissionId = string;

export type Permission = {
  id: PermissionId;
  name: string;
};

export type Role = {
  id: RoleId;
  name: string;
  permissions: Permission[];
};