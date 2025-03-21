import React from "react";

export function SelectField ({ label, icon, value, onChange, options, name, error, readOnly })  {
  return (
   
    <div className="flex flex-col">
      <label className="text-xs font-medium mb-1 flex items-center">
        {icon && <div className="mr-2 text-primaryBlue">{icon}</div>}
        {label}
      </label>
      <select
        className="solcitudgrande-style"
        value={value}
        onChange={onChange}
        name={name}
        disabled={readOnly}
      >
        <option value="">Seleccione una opción</option>
        {options.map((option, idx) => (
          <option key={idx} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-500 border-red-500">{error}</p>}
    </div>
  );
};

