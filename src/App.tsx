import React, { useEffect } from 'react';
import RoleList from './components/RoleList/RoleList';
import EditPermissionsModal from './components/RoleList/EditPermissionsModal';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from './store';
import {
  fetchRoles,
  fetchPermissions,
  updateRolePermissions,
} from './features/rolesSlice';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { roles, permissions, loading, error } = useSelector((state: RootState) => state.roles);
  const [selectedRole, setSelectedRole] = React.useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchRoles());
    dispatch(fetchPermissions());
  }, [dispatch]);

  const handleEdit = (roleId: string) => {
    // Prevent opening modal before permissions are loaded
    if (permissions.length === 0 && !loading) {
      dispatch(fetchPermissions());
    }
    setSelectedRole(roleId);
  };

  const handleSave = (updated: typeof permissions) => {
    if (selectedRole) dispatch(updateRolePermissions({ roleId: selectedRole, permissions: updated }));
    setSelectedRole(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Roles & Permissions</h1>
      <RoleList roles={roles} onEdit={(r) => handleEdit(r.id)} />

      {/* Show modal only when permissions are available or indicate loading */}
      {selectedRole && (
        permissions.length > 0 ? (
          <EditPermissionsModal
            isOpen={!!selectedRole}
            role={roles.find(r => r.id === selectedRole)!}
            allPermissions={permissions}
            onClose={() => setSelectedRole(null)}
            onSave={handleSave}
          />
        ) : (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <p className="text-white">Loading permissions...</p>
          </div>
        )
      )}
    </div>
  );
};

export default App;