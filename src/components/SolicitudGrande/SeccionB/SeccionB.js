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
    <div className="py-2 w-full">
      <form
        className="grid gap-4 grid-cols-1 md:grid-cols-4"
        onSubmit={handleSubmit}
      >
        <div className="col-span-1">
          <label className="block text-sm font-medium">Empresa</label>
          <input
            type="text"
            name="empresa"
            value={formData.empresa}
            onChange={handleInputChange}
            className="block w-full solcitudgrande-style"
          />
          {errors.empresa && (
            <span className="text-red-500 text-xs">{errors.empresa}</span>
          )}
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium">Tipo Empresa</label>
          <select
            name="tipoEmpresa"
            value={formData.tipoEmpresa}
            onChange={handleInputChange}
            className="block w-full solcitudgrande-style"
          >
            <option value="Selecciona una opción">Selecciona una opción</option>
          </select>
          {errors.tipoEmpresa && (
            <span className="text-red-500 text-xs">{errors.tipoEmpresa}</span>
          )}
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium">Fecha Ingreso</label>
          <input
            type="date"
            name="fechaIngreso"
            value={formData.fechaIngreso}
            onChange={handleInputChange}
            className="block w-full solcitudgrande-style"
          />
          {errors.fechaIngreso && (
            <span className="text-red-500 text-xs">{errors.fechaIngreso}</span>
          )}
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium">Ingresos</label>
          <input
            type="number"
            name="ingresos"
            value={formData.ingresos}
            onChange={handleInputChange}
            className="block w-full solcitudgrande-style"
          />
          {errors.ingresos && (
            <span className="text-red-500 text-xs">{errors.ingresos}</span>
          )}
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium">Gastos</label>
          <input
            type="number"
            name="gastos"
            value={formData.gastos}
            onChange={handleInputChange}
            className="block w-full solcitudgrande-style"
          />
          {errors.gastos && (
            <span className="text-red-500 text-xs">{errors.gastos}</span>
          )}
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium">Tipo Contrato</label>
          <select
            name="tipoContrato"
            value={formData.tipoContrato}
            onChange={handleInputChange}
            className="block w-full solcitudgrande-style"
          >
            <option value="Selecciona una opcion">Selecciona una opcion</option>
          </select>
          {errors.tipoContrato && (
            <span className="text-red-500 text-xs">{errors.tipoContrato}</span>
          )}
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium">Tipo Sueldo</label>
          <select
            name="tipoSueldo"
            value={formData.tipoSueldo}
            onChange={handleInputChange}
            className="block w-full solcitudgrande-style"
          >
            <option value="Selecciona una opcion">Selecciona una opcion</option>
          </select>
          {errors.tipoSueldo && (
            <span className="text-red-500 text-xs">{errors.tipoSueldo}</span>
          )}
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium">Departamento</label>
          <input
            type="text"
            name="departamento"
            value={formData.departamento}
            onChange={handleInputChange}
            className="block w-full solcitudgrande-style"
          />
          {errors.departamento && (
            <span className="text-red-500 text-xs">{errors.departamento}</span>
          )}
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium">Cargo</label>
          <select
            name="cargo"
            value={formData.cargo}
            onChange={handleInputChange}
            className="block w-full solcitudgrande-style"
          >
            <option value="Selecciona una opcion">Selecciona una opcion</option>
          </select>
          {errors.cargo && (
            <span className="text-red-500 text-xs">{errors.cargo}</span>
          )}
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium">Dias Pago</label>
          <input
            type="number"
            name="diasPago"
            value={formData.diasPago}
            onChange={handleInputChange}
            className="block w-full solcitudgrande-style"
          />
          {errors.diasPago && (
            <span className="text-red-500 text-xs">{errors.diasPago}</span>
          )}
        </div>

        <div className="col-span-1 flex flex-col items-center">
  <label className="text-sm font-medium mb-2">Afiliado IESS</label>
  <label className="flex items-center space-x-2 cursor-pointer">
    <input
      type="checkbox"
      name="afilado"
      checked={formData.afilado}
      onChange={handleInputChange}
      className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
    />
    <span className="text-sm">Sí</span>
  </label>
  {errors.afilado && <span className="text-red-500 text-xs mt-1">{errors.afilado}</span>}
</div>


        <div className="col-span-1">
          <label className="block text-sm font-medium">Provincia</label>
          <select
            name="provincia"
            value={formData.provincia}
            onChange={handleInputChange}
            className="block w-full solcitudgrande-style"
          >
            <option value="Selecciona una opcion">Selecciona una opcion</option>
          </select>
          {errors.provincia && (
            <span className="text-red-500 text-xs">{errors.provincia}</span>
          )}
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium">Canton</label>
          <select
            name="canton"
            value={formData.canton}
            onChange={handleInputChange}
            className="block w-full solcitudgrande-style"
          >
            <option value="Selecciona una opcion">Selecciona una opcion</option>
          </select>
          {errors.canton && (
            <span className="text-red-500 text-xs">{errors.canton}</span>
          )}
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium">Parroquia</label>
          <select
            name="parroquia"
            value={formData.parroquia}
            onChange={handleInputChange}
            className="block w-full solcitudgrande-style"
          >
            <option value="Selecciona una opcion">Selecciona una opcion</option>
          </select>
          {errors.parroquia && (
            <span className="text-red-500 text-xs">{errors.parroquia}</span>
          )}
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium">Barrio</label>
          <select
            name="barrio"
            value={formData.barrio}
            onChange={handleInputChange}
            className="block w-full solcitudgrande-style"
          >
            <option value="Selecciona una opcion">Selecciona una opcion</option>
          </select>
          {errors.barrio && (
            <span className="text-red-500 text-xs">{errors.barrio}</span>
          )}
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium">Calle Principal</label>
          <input
            type="text"
            name="callePrincipal"
            value={formData.callePrincipal}
            onChange={handleInputChange}
            className="block w-full solcitudgrande-style"
          />
          {errors.callePrincipal && (
            <span className="text-red-500 text-xs">
              {errors.callePrincipal}
            </span>
          )}
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium">Numero casa</label>
          <input
            type="text"
            name="numeroCasa"
            value={formData.numeroCasa}
            onChange={handleInputChange}
            className="block w-full solcitudgrande-style"
          />
          {errors.numeroCasa && (
            <span className="text-red-500 text-xs">{errors.numeroCasa}</span>
          )}
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium">Calle Secundaria</label>
          <input
            type="text"
            name="calleSecundaria"
            value={formData.calleSecundaria}
            onChange={handleInputChange}
            className="block w-full solcitudgrande-style"
          />
          {errors.calleSecundaria && (
            <span className="text-red-500 text-xs">
              {errors.calleSecundaria}
            </span>
          )}
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium">Telefono</label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <input
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              className="block w-full solcitudgrande-style"
            />
            <button
              type="button"
              onClick={() => handleVerify("telefono")}
              className="rounded-full hover:shadow-md transition duration-300 ease-in-out group bg-primaryBlue text-white border border-white hover:bg-white hover:text-primaryBlue hover:border-primaryBlue text-xs px-6 py-2.5"
            >
              <span className="text-xs">verificar</span>
            </button>
          </div>
          {errors.telefono && (
            <span className="text-red-500 text-xs">{errors.telefono}</span>
          )}
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium">Ext</label>
          <input
            type="text"
            name="ext"
            value={formData.ext}
            onChange={handleInputChange}
            className="block w-full solcitudgrande-style"
          />
          {errors.ext && (
            <span className="text-red-500 text-xs">{errors.ext}</span>
          )}
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium">Celular</label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <input
              type="text"
              name="celular"
              value={formData.celular}
              onChange={handleInputChange}
              className="block w-full solcitudgrande-style"
            />
            <button
              type="button"
              onClick={() => handleVerify("celular")}
              className="rounded-full hover:shadow-md transition duration-300 ease-in-out group bg-primaryBlue text-white border border-white hover:bg-white hover:text-primaryBlue hover:border-primaryBlue text-xs px-6 py-2.5"
            >
              <span className="text-xs">verificar</span>
            </button>
          </div>
          {errors.celular && (
            <span className="text-red-500 text-xs">{errors.celular}</span>
          )}
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium">
            Referencia Ubicacion
          </label>
          <input
            type="text"
            name="referenciaUbicacion"
            value={formData.referenciaUbicacion}
            onChange={handleInputChange}
            className="block w-full solcitudgrande-style"
          />
          {errors.referenciaUbicacion && (
            <span className="text-red-500 text-xs">
              {errors.referenciaUbicacion}
            </span>
          )}
        </div>

        <div className="col-span-1 md:col-span-4">
          <button
            type="submit"
            className="rounded-full hover:shadow-md transition duration-300 ease-in-out group bg-primaryBlue text-white border border-white hover:bg-white hover:text-primaryBlue hover:border-primaryBlue text-xs px-6 py-2.5"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
}
