import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Role, Permission } from '../../types/role';

export interface EditPermissionsModalProps {
  isOpen: boolean;
  role: Role;
  allPermissions: Permission[];
  onClose: () => void;
  onSave: (updated: Permission[]) => void;
}

const backdrop = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const modal = {
  hidden: { opacity: 0, y: '-100vh' },
  visible: { opacity: 1, y: '0', transition: { delay: 0.2 } },
};

const EditPermissionsModal: React.FC<EditPermissionsModalProps> = ({
  isOpen,
  role,
  allPermissions,
  onClose,
  onSave,
}) => {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    const initial = new Set(role.permissions.map(p => p.id));
    setSelected(initial);
  }, [role]);

  const toggle = (id: string) => {
    setSelected(prev => {
      const copy = new Set(prev);
      copy.has(id) ? copy.delete(id) : copy.add(id);
      return copy;
    });
  };

  const handleSave = () => {
    const updated = allPermissions.filter(p => selected.has(p.id));
    onSave(updated);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 w-full h-full bg-gray-500/50 flex items-center justify-center z-50"
      variants={backdrop}
      initial="hidden"
      animate="visible"
      exit="hidden"
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-lg shadow-lg w-full max-w-md p-6"
        variants={modal}
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">Edit Permissions for {role.name}</h2>

        <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
          {allPermissions.map(permission => (
            <label key={permission.id} className="flex items-center p-2 hover:bg-gray-100 rounded">
              <input
                type="checkbox"
                checked={selected.has(permission.id)}
                onChange={() => toggle(permission.id)}
                className="mr-2 h-5 w-5"
              />
              <span>{permission.name}</span>
            </label>
          ))}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Save
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EditPermissionsModal;
