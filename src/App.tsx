import React, { useEffect, useState } from 'react';
import RoleList from './features/RoleList';
import EditPermissionsModal from './features/EditPermissionsModal';
import { MockRoleService } from './services/RoleService';
import { Role, Permission } from './services/types';
import { Toaster } from 'react-hot-toast';

const roleService = new MockRoleService();

const App: React.FC = () => {
  // State
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial data
  useEffect(() => {
    roleService.getRoles()
      .then(setRoles)
      .catch(err => setError(err.message));

    roleService.getPermissions()
      .then(setPermissions)
      .catch(err => setError(err.message));
  }, []);

  // Handler to open modal
  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    setIsModalOpen(true);
  };

  // Handler for saving updated permissions
  const handleSave = (updatedPermissions: Permission[]) => {
    if (!selectedRole) return;
    roleService.setPermissionsForRole(selectedRole.id, updatedPermissions)
      .then(updatedRole => {
        setRoles(prev =>
          prev.map(r => (r.id === updatedRole.id ? updatedRole : r))
        );
        setIsModalOpen(false);
        setSelectedRole(null);
      })
      .catch(err => setError(err.message));
  };

  return (
    
    <div className="p-6">
      <Toaster position="top-right" />
      <h1 className="text-2xl font-bold mb-4">Roles & Permissions</h1>

      <RoleList roles={roles} onEdit={handleEdit} />

      {selectedRole && (
        <EditPermissionsModal
          isOpen={isModalOpen}
          role={selectedRole}
          allPermissions={permissions}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default App;
