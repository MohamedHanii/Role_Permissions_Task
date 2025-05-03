import React from 'react';
import { Role } from '../../types/role';
import { motion } from 'framer-motion';
import { Edit2 } from 'lucide-react';

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
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
      }}
      className="space-y-4"
    >
      {roles.map(role => (
        <motion.div
          key={role.id}
          className="p-4 bg-white shadow-lg rounded-2xl flex justify-between items-center hover:shadow-2xl transition-shadow"
          whileHover={{ scale: 1.02 }}
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        >
          <div>
            <h2 className="text-xl font-semibold mb-1">{role.name}</h2>
            <p className="text-gray-600 text-sm">
              Permissions:{' '}
              {role.permissions.length > 0
                ? role.permissions.map(p => p.name).join(', ')
                : 'None'}
            </p>
          </div>
          <button
            onClick={() => onEdit(role)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition"
          >
            <Edit2 size={16} />
            <span>Edit</span>
          </button>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default RoleList;
