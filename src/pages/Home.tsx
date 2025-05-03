import React, { useEffect, useState } from 'react';
import RoleList from '../components/Role/RoleList';
import EditPermissionsModal from '../components/Role/EditPermissionsModal';
import NavBar from '../components/layouts/Navbar';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import {
  fetchRoles,
  fetchPermissions,
  savePermissions as updateRolePermissions,
} from '../store/rolesSlice';
import { Role, Permission } from '../types/role';

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { roles, permissions, loading, error } = useSelector((state: RootState) => state.roles);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Initial fetch
  useEffect(() => {
    dispatch(fetchRoles());
    dispatch(fetchPermissions());
  }, [dispatch]);

  // Show errors
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handleEdit = (role: Role) => {  
    console.log(permissions);

    setSelectedRoleId(role.id);
    setIsModalOpen(true);
  };

  const handleSave = (updated: Permission[]) => {
    if (!selectedRoleId) return;
    dispatch(updateRolePermissions({ roleId: selectedRoleId, permissions: updated }))
      .unwrap()
      .then(() => toast.success('Permissions updated'))
      .catch(e => toast.error(e.message));

    setIsModalOpen(false);
    setSelectedRoleId(null);
  };

  if (loading) return <p className="p-6 text-center">Loading roles…</p>;

  return (
    <div>
      <NavBar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Roles & Permissions</h1>
        <RoleList roles={roles} onEdit={handleEdit} />
        {selectedRoleId && (
          <EditPermissionsModal
            isOpen={isModalOpen}
            role={roles.find(r => r.id === selectedRoleId)!}
            allPermissions={permissions}
            onClose={() => { setIsModalOpen(false); setSelectedRoleId(null); }}
            onSave={handleSave}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
