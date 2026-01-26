import React from 'react';

/**
 * RoleTabs Component
 * Displays role selection tabs (Admin, Teacher, Student)
 * Matches the design with active state highlighting
 */
const RoleTabs = ({ selectedRole, onRoleChange }) => {
  const roles = [
    { id: 'admin', label: 'Admin' },
    { id: 'teacher', label: 'Teacher' },
    { id: 'student', label: 'Student' },
  ];

  return (
    <div className="flex gap-2 bg-dark-200/30 p-1.5 rounded-xl border border-dark-300/30">
      {roles.map((role) => (
        <button
          key={role.id}
          type="button"
          onClick={() => onRoleChange(role.id)}
          className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
            selectedRole === role.id
              ? 'bg-gradient-to-r from-gold via-[#FFE55C] to-gold text-dark shadow-lg shadow-gold/30 transform scale-105'
              : 'text-gray-400 hover:text-white hover:bg-dark-200/50'
          }`}
        >
          {role.label}
        </button>
      ))}
    </div>
  );
};

export default RoleTabs;
