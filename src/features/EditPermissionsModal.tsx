import React, { useState, useEffect } from 'react';
import { Role, Permission } from '../services/types';

export interface EditPermissionsModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Role to edit */
  role: Role;
  /** All available permissions */
  allPermissions: Permission[];
  /** Close handler */
  onClose: () => void;
  /** Save handler with updated permissions */
  onSave: (updatedPermissions: Permission[]) => void;
}

const EditPermissionsModal: React.FC<EditPermissionsModalProps> = ({
  isOpen,
  role,
  allPermissions,
  onClose,
  onSave,
}) => {
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());

  // Initialize selection when role changes
  useEffect(() => {
    const initial = new Set<string>(role.permissions.map(p => p.id));
    setSelectedPermissions(initial);
  }, [role]);

  // Toggle checkbox
  const togglePermission = (permId: string) => {
    setSelectedPermissions(prev => {
      const copy = new Set(prev);
      if (copy.has(permId)) {
        copy.delete(permId);
      } else {
        copy.add(permId);
      }
      return copy;
    });
  };

  // Handle Save click
  const handleSave = () => {
    const updated = allPermissions.filter(p => selectedPermissions.has(p.id));
    onSave(updated);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">Edit Permissions for {role.name}</h2>
        <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
          {allPermissions.map(permission => (
            <label key={permission.id} className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedPermissions.has(permission.id)}
                onChange={() => togglePermission(permission.id)}
              />
              <span>{permission.name}</span>
            </label>
          ))}
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPermissionsModal;
