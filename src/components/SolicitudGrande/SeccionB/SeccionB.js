import React from "react";


export function SeccionB() {

	const fields = [
		{ label: "Empresa", name: "empresa", type: "text" },
		{ label: "Tipo Empresa", name: "tipoEmpresa", type: "select", options: ["Selecciona una opción"] },
		{ label: "Fecha Ingreso", name: "fechaIngreso", type: "date" },
		{ label: "Ingresos", name: "ingresos", type: "number" },
		{ label: "Gastos", name: "gastos", type: "number" },
		{ label: "Tipo Contrato", name: "tipoContrato", type: "select", options: ["Selecciona una opcion"] },
		{label: "Tipo Sueldo", name: "tipoSueldo", type: "select", options: ["Selecciona una opcion"]},
		{label: "Departamento", name: "departamento", type: "text"},
		{label: "Cargo", name: "cargo", type: "select", options: ["Selecciona una opcion"]},
		{label: "Dias Pago", name: "diasPago", type: "number"},
		{label: "Afiliado IESS", name: "afilado", type: "check"},
		{label: "Provincia", name: "provincia", type: "select", options: ["Selecciona una opcion"]},
		{label: "Canton", name: "canton", type: "select", options: ["Selecciona una opcion"]},
		{label: "Parroquia", name: "parroquia", type: "select", options: ["Selecciona una opcion"]},
		{label: "Barrio", name: "barrio", type: "select", options: ["Selecciona una opcion"]},
		{label: "Calle Principal", name: "callePrincipal", type: "text"},
		{label: "Numero casa", name: "numeroCasa", type: "text"},
		{label: "Calle Secundaria", name: "calleSecundaria", type: "text"},
		{label: "Telefono", name: "telefono", type: "text"},
		{label: "Ext", name: "ext", type: "text"},
		{label: "Celular", name: "celular", type: "text"},
		{label: "Referencia Ubicacion", name: "text-area", type: "text"},
	  ];

  return (
    <>
      <div className="py-2 w-full">
        <form className="grid gap-4 grid-cols-1 md:grid-cols-4">
          {fields.map((field, index) => (
            <div key={index} className="col-span-1">
              <label className="block text-sm font-medium">{field.label}</label>
              {field.name === "telefono" || field.name === "celular" ? (
                // Input y botón para Telefono y Celular
                <div className="flex items-center gap-2">
                  <input
                    type={field.type}
                    className="block bg-[#F9FAFB] w-64 max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                  />
                  <button
                    type="button"
                    className="w-14 h-14 bg-blue-500 text-white rounded-md flex justify-center items-center shadow-sm p-2"
                  >
                    <span className="text-xs">verificar</span>
                  </button>
                </div>
              ) : field.type === "select" ? (
                <select className="block bg-[#F9FAFB] w-64 max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm">
                  {field.options.map((option, idx) => (
                    <option key={idx}>{option}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  className="block bg-[#F9FAFB] w-64 max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                />
              )}
            </div>
          ))}
        </form>
      </div>
    </>
  );
};
