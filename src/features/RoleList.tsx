import React from 'react';
import { Role } from '../services/types';

export interface RoleListProps {
  /** Array of roles to display */
  roles: Role[];
  /** Callback when user clicks Edit on a role */
  onEdit: (role: Role) => void;
}

const RoleList: React.FC<RoleListProps> = ({ roles, onEdit }) => {
  return (
    <div className="space-y-4">
      {roles.map((role) => (
        <div
          key={role.id}
          className="p-4 bg-white shadow rounded-lg flex justify-between items-center"
        >
          <div>
            <h2 className="text-lg font-semibold">{role.name}</h2>
            <p className="text-gray-600">
              Permissions:{' '}
              {role.permissions.length > 0
                ? role.permissions.map((p) => p.name).join(', ')
                : 'None'}
            </p>
          </div>
          <button
            onClick={() => onEdit(role)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit
          </button>
        </div>
      ))}
    </div>
  );
};

export default RoleList;
