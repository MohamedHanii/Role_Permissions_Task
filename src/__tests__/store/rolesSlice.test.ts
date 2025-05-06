import { configureStore } from '@reduxjs/toolkit';
import rolesReducer, {
  initializeService,
  fetchRoles,
  fetchPermissions,
  savePermissions,
} from '../../store/rolesSlice';
import { MockRoleService } from '../../services/Role/MockRoleService';
import type { Role, Permission } from '../../types/role';

jest.mock('../../services/Role/MockRoleService');

interface RootState {
  roles: {
    roles: Role[];
    permissions: Permission[];
    loading: boolean;
    error: string | null;
  };
}

describe('rolesSlice', () => {
  let store: ReturnType<typeof configureStore<{ roles: ReturnType<typeof rolesReducer> }>>;
  let mockService: jest.Mocked<MockRoleService>;

  const mockRoles: Role[] = [
    {
      id: 'role1',
      name: 'Admin',
      permissions: [
        { id: 'perm1', name: 'Create' },
        { id: 'perm2', name: 'Delete' },
      ],
    },
  ];

  const mockPermissions: Permission[] = [
    { id: 'perm1', name: 'Create' },
    { id: 'perm2', name: 'Delete' },
    { id: 'perm3', name: 'Update' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    mockService = new MockRoleService() as jest.Mocked<MockRoleService>;
    mockService.getRoles = jest.fn().mockResolvedValue(mockRoles);
    mockService.getPermissions = jest.fn().mockResolvedValue(mockPermissions);
    mockService.setPermissionsForRole = jest.fn().mockImplementation(
      (roleId, permissions) => Promise.resolve({
        ...mockRoles[0],
        id: roleId,
        permissions,
      })
    );

    initializeService(mockService);

    store = configureStore({
      reducer: {
        roles: rolesReducer,
      },
    });
  });

  describe('fetchRoles', () => {
    it('should fetch roles successfully', async () => {
      const result = await store.dispatch(fetchRoles());
      expect(result.type).toBe('roles/fetch/fulfilled');
      
      const state = store.getState().roles;
      expect(state.roles).toEqual(mockRoles);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(mockService.getRoles).toHaveBeenCalledTimes(1);
    });

    it('should handle fetch roles error', async () => {
      const errorMessage = 'Failed to fetch roles';
      mockService.getRoles.mockRejectedValueOnce(new Error(errorMessage));

      const result = await store.dispatch(fetchRoles());
      expect(result.type).toBe('roles/fetch/rejected');
      
      const state = store.getState().roles;
      expect(state.roles).toEqual([]);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('fetchPermissions', () => {
    it('should fetch permissions successfully', async () => {
      const result = await store.dispatch(fetchPermissions());
      expect(result.type).toBe('roles/fetchPerms/fulfilled');
      
      const state = store.getState().roles;
      expect(state.permissions).toEqual(mockPermissions);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(mockService.getPermissions).toHaveBeenCalledTimes(1);
    });

    it('should handle fetch permissions error', async () => {
      const errorMessage = 'Failed to fetch permissions';
      mockService.getPermissions.mockRejectedValueOnce(new Error(errorMessage));

      const result = await store.dispatch(fetchPermissions());
      expect(result.type).toBe('roles/fetchPerms/rejected');
      
      const state = store.getState().roles;
      expect(state.permissions).toEqual([]);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('service initialization', () => {
    it('should throw error when service is not initialized', async () => {
      initializeService(undefined as any);

      const result = await store.dispatch(fetchRoles());
      expect(result.type).toBe('roles/fetch/rejected');
      
      const state = store.getState().roles;
      expect(state.error).toBe('Service not initialized');
    });
  });
}); 