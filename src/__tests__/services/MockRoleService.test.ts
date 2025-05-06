import { MockRoleService } from '../../services/Role/MockRoleService';
import type { Permission } from '../../types/role';

// Helper function to retry operations that might randomly fail
async function retry<T>(operation: () => Promise<T>, maxAttempts = 5): Promise<T> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (error instanceof Error && error.message === 'random error' && attempt < maxAttempts) {
        continue;
      }
      throw error;
    }
  }
  throw new Error('Max retry attempts reached');
}

describe('MockRoleService', () => {
  let service: MockRoleService;

  beforeEach(() => {
    service = new MockRoleService();
  });

  describe('getRoles', () => {
    it('should return demo roles', async () => {
      const roles = await retry(() => service.getRoles());
      
      expect(roles).toHaveLength(3);
      expect(roles).toEqual(expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          permissions: expect.any(Array)
        })
      ]));
    });

    it('should return a copy of roles to prevent direct state mutation', async () => {
      const firstResult = await retry(() => service.getRoles());
      const secondResult = await retry(() => service.getRoles());

      expect(firstResult).not.toBe(secondResult);
      expect(firstResult).toEqual(secondResult);
    });
  });

  describe('getPermissions', () => {
    it('should return demo permissions', async () => {
      const permissions = await retry(() => service.getPermissions());
      
      expect(permissions).toHaveLength(3);
      expect(permissions).toEqual(expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String)
        })
      ]));
    });

    it('should return a copy of permissions to prevent direct state mutation', async () => {
      const firstResult = await retry(() => service.getPermissions());
      const secondResult = await retry(() => service.getPermissions());

      expect(firstResult).not.toBe(secondResult);
      expect(firstResult).toEqual(secondResult);
    });
  });

  describe('setPermissionsForRole', () => {
    let testPermissions: Permission[];

    beforeEach(async () => {
      testPermissions = await retry(() => service.getPermissions());
    });

    it('should update role permissions successfully', async () => {
      const roles = await retry(() => service.getRoles());
      const roleToUpdate = roles[0];
      const newPermissions = [testPermissions[0]];

      const updatedRole = await retry(() => 
        service.setPermissionsForRole(roleToUpdate.id, newPermissions)
      );

      expect(updatedRole.permissions).toEqual(newPermissions);
      
      // Verify the state was actually updated
      const rolesAfterUpdate = await retry(() => service.getRoles());
      const updatedRoleInList = rolesAfterUpdate.find(r => r.id === roleToUpdate.id);
      expect(updatedRoleInList?.permissions).toEqual(newPermissions);
    });

    it('should throw error for non-existent role ID', async () => {
      const nonExistentId = 'non-existent-id';
      
      let error: Error | null = null;
      try {
        await retry(() => service.setPermissionsForRole(nonExistentId, [testPermissions[0]]));
      } catch (e) {
        error = e as Error;
      }
      expect(error?.message).toBe('role not found');
    });

    it('should throw error for invalid permission IDs', async () => {
      const roles = await retry(() => service.getRoles());
      const roleToUpdate = roles[0];
      const invalidPermission = { id: 'invalid-id', name: 'Invalid' };

      let error: Error | null = null;
      try {
        await retry(() => service.setPermissionsForRole(roleToUpdate.id, [invalidPermission]));
      } catch (e) {
        error = e as Error;
      }
      expect(error?.message).toBe('invalid permissions');
    });

    it('should allow setting empty permissions array', async () => {
      const roles = await retry(() => service.getRoles());
      const roleToUpdate = roles[0];

      const updatedRole = await retry(() => 
        service.setPermissionsForRole(roleToUpdate.id, [])
      );

      expect(updatedRole.permissions).toEqual([]);
    });

    it('should allow setting multiple permissions', async () => {
      const roles = await retry(() => service.getRoles());
      const roleToUpdate = roles[0];

      const updatedRole = await retry(() => 
        service.setPermissionsForRole(roleToUpdate.id, testPermissions)
      );

      expect(updatedRole.permissions).toEqual(testPermissions);
    });
  });

  describe('Service behavior', () => {
    it('should handle concurrent operations correctly', async () => {
      const roles = await retry(() => service.getRoles());
      const roleToUpdate = roles[0];
      const [permission1, permission2] = await retry(() => service.getPermissions());

      // Start two concurrent updates
      const update1 = retry(() => 
        service.setPermissionsForRole(roleToUpdate.id, [permission1])
      );
      const update2 = retry(() => 
        service.setPermissionsForRole(roleToUpdate.id, [permission2])
      );

      // Wait for both updates
      await Promise.all([update1, update2]);

      // Check final state
      const finalRoles = await retry(() => service.getRoles());
      const finalRole = finalRoles.find(r => r.id === roleToUpdate.id);
      
      // One of the updates should have won, role should have either permission1 or permission2
      expect(finalRole?.permissions).toBeTruthy();
      expect(finalRole?.permissions.length).toBe(1);
      expect(
        [permission1.id, permission2.id].includes(finalRole!.permissions[0].id)
      ).toBe(true);
    });
  });
}); 