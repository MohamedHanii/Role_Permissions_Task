import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { MockRoleService } from '../services/Role/MockRoleService';
import type { Role, Permission } from '../types/role';

let service: MockRoleService;

export const initializeService = (roleService: MockRoleService) => {
  service = roleService;
};

export const fetchRoles = createAsyncThunk('roles/fetch', () => {
  if (!service) throw new Error('Service not initialized');
  return service.getRoles();
});

export const fetchPermissions = createAsyncThunk('roles/fetchPerms', () => {
  if (!service) throw new Error('Service not initialized');
  return service.getPermissions();
});

export const savePermissions = createAsyncThunk(
  'roles/savePerms',
  async ({ roleId, permissions }: { roleId: string; permissions: Permission[] }) => {
    if (!service) throw new Error('Service not initialized');
    return service.setPermissionsForRole(roleId, permissions);
  }
);

interface State {
  roles: Role[];
  permissions: Permission[];
  loading: boolean;
  error: string | null;
}
const initialState: State = { roles: [], permissions: [], loading: false, error: null };

const slice = createSlice({
  name: 'roles',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchRoles.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchRoles.fulfilled, (s, a) => { s.roles = a.payload; s.loading = false; })
      .addCase(fetchRoles.rejected, (s, a) => { s.loading = false; s.error = a.error.message!; })
      .addCase(fetchPermissions.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchPermissions.fulfilled, (s, a) => { s.permissions = a.payload; s.loading = false; })
      .addCase(fetchPermissions.rejected, (s, a) => { s.loading = false; s.error = a.error.message!; })
      .addCase(savePermissions.fulfilled, (s, a) => {
        s.roles = s.roles.map(r => r.id === a.payload.id ? a.payload : r);
      })
      .addCase(savePermissions.rejected, (s, a) => { s.error = a.error.message!; })
  }
});

export default slice.reducer;
