import React from 'react';

// This component will accept props: label, icon, value, onChange, readOnly.
export function InputField ({ label, icon, value, onChange, readOnly, type = "text" })  {
  return (
    <div className="flex flex-col">
      <label className="text-xs font-medium mb-1 flex items-center">
        {icon && <div className="mr-2 text-primaryBlue">{icon}</div>}
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="solcitudgrande-style"
        readOnly={readOnly}
      />
    </div>
  );
};

