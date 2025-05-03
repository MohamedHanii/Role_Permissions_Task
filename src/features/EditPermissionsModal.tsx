import React, { useState, useEffect } from 'react';
import { Role, Permission } from '../services/types';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export interface EditPermissionsModalProps {
  isOpen: boolean;
  role: Role;
  allPermissions: Permission[];
  onClose: () => void;
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
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const initial = new Set<string>(role.permissions.map(p => p.id));
    setSelectedPermissions(initial);
    setSearchQuery('');
  }, [role]);

  const togglePermission = (permId: string) => {
    setSelectedPermissions(prev => {
      const copy = new Set(prev);
      if (copy.has(permId)) copy.delete(permId);
      else copy.add(permId);
      return copy;
    });
  };

  const handleSave = () => {
    const updated = allPermissions.filter(p => selectedPermissions.has(p.id));
    onSave(updated);
  };

  if (!isOpen) return null;

  // Filter permissions by search
  const visiblePermissions = allPermissions.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 bg-gray-500/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6 relative"
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <X size={20} />
        </button>
        <h2 className="text-2xl font-semibold mb-4">Edit Permissions for <span className="text-blue-600">{role.name}</span></h2>

        <input
          type="text"
          placeholder="Search permissions..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto mb-6">
          {visiblePermissions.length ? (
            visiblePermissions.map(permission => (
              <label
                key={permission.id}
                className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-blue-600"
                  checked={selectedPermissions.has(permission.id)}
                  onChange={() => togglePermission(permission.id)}
                />
                <span className="text-gray-700">{permission.name}</span>
              </label>
            ))
          ) : (
            <p className="text-gray-500 col-span-2 text-center">No permissions found</p>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-2xl border border-gray-300 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default EditPermissionsModal;