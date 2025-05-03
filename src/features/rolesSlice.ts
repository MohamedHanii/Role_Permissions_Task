import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MockRoleService } from '../services/RoleService';
import { Role, Permission } from '../services/types';

const roleService = new MockRoleService();

// Async thunks
export const fetchRoles = createAsyncThunk('roles/fetchRoles', async () => {
  return await roleService.getRoles();
});

export const fetchPermissions = createAsyncThunk(
  'roles/fetchPermissions',
  async () => {
    return await roleService.getPermissions();
  }
);

export const updateRolePermissions = createAsyncThunk(
  'roles/updateRolePermissions',
  async ({ roleId, permissions }: { roleId: string; permissions: Permission[] }) => {
    return await roleService.setPermissionsForRole(roleId, permissions);
  }
);

// Slice
interface RolesState {
  roles: Role[];
  permissions: Permission[];
  loading: boolean;
  error: string | null;
}

const initialState: RolesState = {
  roles: [],
  permissions: [],
  loading: false,
  error: null,
};

const rolesSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchRoles
      .addCase(fetchRoles.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchRoles.fulfilled, (state, action: PayloadAction<Role[]>) => {
        state.roles = action.payload; state.loading = false;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false; state.error = action.error.message ?? 'Fetch roles failed';
      })
      // fetchPermissions
      .addCase(fetchPermissions.fulfilled, (state, action: PayloadAction<Permission[]>) => {
        state.permissions = action.payload;
      })
      .addCase(fetchPermissions.rejected, (state, action) => {
        state.error = action.error.message ?? 'Fetch permissions failed';
      })
      // updateRolePermissions
      .addCase(updateRolePermissions.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateRolePermissions.fulfilled, (state, action: PayloadAction<Role>) => {
        state.roles = state.roles.map(r => r.id === action.payload.id ? action.payload : r);
        state.loading = false;
      })
      .addCase(updateRolePermissions.rejected, (state, action) => {
        state.loading = false; state.error = action.error.message ?? 'Update failed';
      });
  },
});

export default rolesSlice.reducer;