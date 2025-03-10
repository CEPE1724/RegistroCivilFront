import React, { useState } from "react";

export function SeccionB() {
  // Estado para manejar los valores de los campos
  const [formData, setFormData] = useState({
    empresa: "",
    tipoEmpresa: "",
    fechaIngreso: "",
    ingresos: "",
    gastos: "",
    tipoContrato: "",
    tipoSueldo: "",
    departamento: "",
    cargo: "",
    diasPago: "",
    afiliado: false,
    provincia: "",
    canton: "",
    parroquia: "",
    barrio: "",
    callePrincipal: "",
    numeroCasa: "",
    calleSecundaria: "",
    telefono: "",
    ext: "",
    celular: "",
    referenciaUbicacion: "",
  });

  // Estado para manejar los errores de validación
  const [errors, setErrors] = useState({});

  const fields = [
    { label: "Empresa", name: "empresa", type: "text" },
    { label: "Tipo Empresa", name: "tipoEmpresa", type: "select", options: ["Selecciona una opción"] },
    { label: "Fecha Ingreso", name: "fechaIngreso", type: "date" },
    { label: "Ingresos", name: "ingresos", type: "number" },
    { label: "Gastos", name: "gastos", type: "number" },
    { label: "Tipo Contrato", name: "tipoContrato", type: "select", options: ["Selecciona una opcion"] },
    { label: "Tipo Sueldo", name: "tipoSueldo", type: "select", options: ["Selecciona una opcion"] },
    { label: "Departamento", name: "departamento", type: "text" },
    { label: "Cargo", name: "cargo", type: "select", options: ["Selecciona una opcion"] },
    { label: "Dias Pago", name: "diasPago", type: "number" },
    { label: "Afiliado IESS", name: "afilado", type: "check" },
    { label: "Provincia", name: "provincia", type: "select", options: ["Selecciona una opcion"] },
    { label: "Canton", name: "canton", type: "select", options: ["Selecciona una opcion"] },
    { label: "Parroquia", name: "parroquia", type: "select", options: ["Selecciona una opcion"] },
    { label: "Barrio", name: "barrio", type: "select", options: ["Selecciona una opcion"] },
    { label: "Calle Principal", name: "callePrincipal", type: "text" },
    { label: "Numero casa", name: "numeroCasa", type: "text" },
    { label: "Calle Secundaria", name: "calleSecundaria", type: "text" },
    { label: "Telefono", name: "telefono", type: "text" },
    { label: "Ext", name: "ext", type: "text" },
    { label: "Celular", name: "celular", type: "text" },
    { label: "Referencia Ubicacion", name: "referenciaUbicacion", type: "text" },
  ];

  // Maneja el cambio de valor de los campos
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Función de verificación para el teléfono o celular
  const handleVerify = (fieldName) => {
    console.log(`Verificando ${fieldName}: ${formData[fieldName]}`);
    // Aquí podrías agregar la lógica de verificación
  };

  // Función de validación de campos
  const validateForm = () => {
    const newErrors = {};
    if (!formData.empresa) newErrors.empresa = "Este campo es obligatorio";
    if (!formData.ingresos) newErrors.ingresos = "Este campo es obligatorio";
    if (!formData.gastos) newErrors.gastos = "Este campo es obligatorio";
    // Puedes agregar más validaciones aquí

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejo del envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Formulario enviado con éxito", formData);
    } else {
      console.log("Errores en el formulario", errors);
    }
  };

  return (
    <>
      <div className="py-2 w-full">
        <form className="grid gap-4 grid-cols-1 md:grid-cols-4" onSubmit={handleSubmit}>
          {fields.map((field) => (
            <div key={field.name} className="col-span-1">
              <label className="block text-sm font-medium">{field.label}</label>
              {field.name === "telefono" || field.name === "celular" ? (
                // Input y botón para Telefono y Celular
                <div className="flex items-center gap-2">
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    className="block solcitudgrande-style"
                  />
                  <button
                    type="button"
                    onClick={() => handleVerify(field.name)}
                    className="w-14 h-14 bg-blue-500 text-white rounded-md flex justify-center items-center shadow-sm p-2"
                  >
                    <span className="text-xs">verificar</span>
                  </button>
                </div>
              ) : field.type === "select" ? (
                <select
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  className="block solcitudgrande-style"
                >
                  {field.options.map((option, idx) => (
                    <option key={idx} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : field.type === "check" ? (
                <input
                  type={field.type}
                  name={field.name}
                  checked={formData[field.name]}
                  onChange={handleInputChange}
                  className="block solcitudgrande-style"
                />
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  className="block solcitudgrande-style"
                />
              )}
              {errors[field.name] && <span className="text-red-500 text-xs">{errors[field.name]}</span>}
            </div>
          ))}
          <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded">
            Enviar
          </button>
        </form>
      </div>
    </>
  );
}
