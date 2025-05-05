import React from 'react';
import { Role } from '../../types/role';

export interface RoleListProps {
  roles: Role[];
  onEdit: (role: Role) => void;
}

const RoleList: React.FC<RoleListProps> = ({ roles, onEdit }) => {
  if (roles.length === 0) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
        <p className="text-yellow-800">No roles found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {roles.map((role) => (
        <div
          key={role.id}
          className="p-4 bg-white border rounded-lg flex justify-between items-center"
        >
          <div>
            <h2 className="text-xl font-semibold mb-1">{role.name}</h2>
            <p className="text-gray-600 text-sm">
              Permissions:{' '}
              {role.permissions.length > 0
                ? role.permissions.map((p) => p.name).join(', ')
                : 'None'}
            </p>
          </div>
          <button
            onClick={() => onEdit(role)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Edit
          </button>
        </div>
      ))}
    </div>
  );
};

export default RoleList;
