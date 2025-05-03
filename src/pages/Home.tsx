import React, { useEffect, useState } from 'react';
import RoleList from '../components/Role/RoleList';
import { MockRoleService } from '../services/Role/MockRoleService';
import { Permission, Role } from '../types/role';
import { toast } from 'react-toastify';
import EditPermissionsModal from '../components/Role/EditPermissionsModal';
import NavBar from '../components/layouts/Navbar';

const Dashboard: React.FC = () => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const roleService = new MockRoleService();
  
    useEffect(() => {
      // Fetch roles and permissions in parallel
      Promise.all([roleService.getRoles(), roleService.getPermissions()])
        .then(([fetchedRoles, fetchedPermissions]) => {
          setRoles(fetchedRoles);
          setPermissions(fetchedPermissions);
        })
        .catch(err => {
          toast.error(err.message || 'Failed to load data');
        })
        .finally(() => setLoading(false));
    }, []);
  
    const handleEdit = (role: Role) => {
      setSelectedRole(role);
      setIsModalOpen(true);
    };
  
    const handleSave = (updatedPermissions: Permission[]) => {
      if (!selectedRole) return;
      roleService.setPermissionsForRole(selectedRole.id, updatedPermissions)
        .then(updatedRole => {
          setRoles(prev => prev.map(r => r.id === updatedRole.id ? updatedRole : r));
          toast.success(`Permissions updated for ${updatedRole.name}`);
        })
        .catch(err => toast.error(err.message || 'Failed to update permissions'))
        .finally(() => {
          setIsModalOpen(false);
          setSelectedRole(null);
        });
    };
  
    if (loading) return <p className="p-6 text-center">Loading roles…</p>;
  
    return (
        <div>
            <NavBar />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Roles & Permissions</h1>
                <RoleList roles={roles} onEdit={handleEdit} />
                    {selectedRole && (
                    <EditPermissionsModal
                    isOpen={isModalOpen}
                    role={selectedRole}
                    allPermissions={permissions}
                    onClose={() => { setIsModalOpen(false); setSelectedRole(null); }}
                    onSave={handleSave}
                />
                )}
            </div>
        </div>
    );
  };
  
  export default Dashboard;
  
