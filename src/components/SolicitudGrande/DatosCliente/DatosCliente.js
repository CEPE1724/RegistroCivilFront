import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import { fetchNivelEducacion, fetchProfesion, fetchProvincias,
	fetchCantones, fetchParroquias, fetchBarrios } from "./apisFetch";
import { fields, fields1, fields2 } from "./fieldsData";

export function DatosCliente() {

	const { enqueueSnackbar } = useSnackbar();

	const [datosSolicitud , setDatosSolicitud ] = useState({
		nivelEducacion: [],
		profesion: [],
		provincia: [],
		cantones: [],
		parroquias: [],
		barrios: [],
	  });

	  const updateDatosSolicitud = (key, value) => {
		setDatosSolicitud(prevState => ({
		  ...prevState,
		  [key]: value
		}));
	  };

	  useEffect(() => {
		fetchNivelEducacion(enqueueSnackbar, (data) => updateDatosSolicitud('nivelEducacion', data));
		fetchProfesion(enqueueSnackbar, (data) => updateDatosSolicitud('profesion', data));
		fetchProvincias(enqueueSnackbar, (data) => updateDatosSolicitud('provincia', data));
	  }, []);

	  const handleProvinciaChange = (e) => {
		const idProvincia = e.target.value;
		if (idProvincia) {
		  fetchCantones(idProvincia, enqueueSnackbar, (data) => updateDatosSolicitud('cantones', data));
		  // Reset a los demas select
		  updateDatosSolicitud('cantones', []);
		  updateDatosSolicitud('parroquias', []);
		  updateDatosSolicitud('barrios', []);
		}
	  };

	  const handleCantonChange = (e) => {
		const cantonId = e.target.value;
		if (cantonId) {
		  fetchParroquias(cantonId, enqueueSnackbar, (data) => updateDatosSolicitud('parroquias', data));
		  // Reset barrios
		  updateDatosSolicitud('barrios', []);
		}
	  };
	
	  const handleParroquiaChange = (e) => {
		const idParroquia = e.target.value;
		if (idParroquia) {
		  fetchBarrios(idParroquia, enqueueSnackbar, (data) => updateDatosSolicitud('barrios', data));
		}
	  };


  return (
    <>
      {/* Formulario Completo Combinado con Secciones Separadas */}
      <div className="py-2 w-full">
        <form className="grid gap-4 grid-cols-5 md:grid-cols-5">
          {fields(datosSolicitud.nivelEducacion, datosSolicitud.profesion).map((field, index) => (
            <div key={index} className="col-span-1">
              <label className="block text-sm font-medium">{field.label}</label>
              {field.type === "select" ? (
                <select className="block bg-[#F9FAFB] w-full max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm">
                  <option value="">Seleccione una opción</option>
				  {field.options.map((option, idx) => (
                    <option key={idx} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dependientes */}
              <div className="col-span-1">
                <label className="block text-sm font-medium">
                  Dependientes
                </label>
                <input
                  type={field.type}
                  className="block bg-[#F9FAFB] w-full max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                />
              </div>

              {/* Nivel Educacion */}
              <div className="col-span-1">
                <label className="block text-sm font-medium">
                  Nivel Educacion
                </label>
                <select
                  className="block bg-[#F9FAFB] w-full max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                  onChange={handleNivelEducacionChange}
                >
                  <option value="">Seleccione una opción</option>
                  {nivelEducacion.map((option, idx) => (
                    <option key={idx} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Profesion */}
              <div className="col-span-1">
                <label className="block text-sm font-medium">Profesion</label>
                <select
                  className="block bg-[#F9FAFB] w-full max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                  onChange={handleProfesionChange}
                >
                  <option value="">Seleccione una opción</option>
                  {profesion.map((option, idx) => (
                    <option key={idx} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Situacion Laboral */}
              <div className="col-span-1">
                <label className="block text-sm font-medium">
                  Situacion Laboral
                </label>
                <select
                  className="block bg-[#F9FAFB] w-full max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                  onChange={handleSituacionLaboralChange}
                >
                  <option value="">Seleccione una opción</option>
                  {sitacionLaboral.map((option, idx) => (
                    <option key={idx} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Actividad Economica */}
              <div className="col-span-1">
                <label className="block text-sm font-medium">
                  Actividad Economica
                </label>
                <select
                  className="block bg-[#F9FAFB] w-full max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                  onChange={handleActividadEconomicaChange}
                >
                  <option value="">Seleccione una opción</option>
                  {actividadEconomica.map((option, idx) => (
                    <option key={idx} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Obserbacion Actividad Economica */}
              <div className="col-span-1">
                <label className="block text-sm font-medium">
                  Obserbacion Actividad Economica
                </label>
                <textarea
                  className="block bg-[#F9FAFB] w-full max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                  rows="4"
                  placeholder="Ingresa tu observación aquí"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Segunda seccion - Información de Domicilio */}
          <div className="py-2 w-full mb-6">
            <h2 className="text-lg font-semibold mb-4">
              Información de Domicilio
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:grid-cols-4">
              {/* Provincia */}
              <div className="col-span-1">
                <label className="block text-sm font-medium">Provincia</label>
                <select
                  className="block bg-[#F9FAFB] w-full max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                  onChange={handleProvinciaChange}
                >
                  <option value="">Seleccione una opción</option>
                  {provincia.map((option, idx) => (
                    <option key={idx} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Canton */}
              <div className="col-span-1">
                <label className="block text-sm font-medium">Canton</label>
                <select
                  className="block bg-[#F9FAFB] w-full max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                  onChange={handleCantonChange}
                >
                  <option value="">Seleccione una opción</option>
                  {cantones.map((option, idx) => (
                    <option key={idx} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Parroquia */}
              <div className="col-span-1">
                <label className="block text-sm font-medium">Parroquia</label>
                <select
                  className="block bg-[#F9FAFB] w-full max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                  onChange={handleParroquiaChange}
                >
                  <option value="">Seleccione una opción</option>
                  {parroquias.map((option, idx) => (
                    <option key={idx} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

      <div className="py-2 w-full">
        <form className="grid gap-4 grid-cols-4 md:grid-cols-4">
          {fields1(datosSolicitud.provincia, datosSolicitud.cantones, datosSolicitud.parroquias, datosSolicitud.barrios).map((field, index) => (
            <div key={index} className="col-span-1">
              <label className="block text-sm font-medium">{field.label}</label>
              {field.type === "select" ? (
                <select className="block bg-[#F9FAFB] w-full max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
				onChange={field.name === "Provincia" ? handleProvinciaChange : 
							field.name === "Canton" ? handleCantonChange :
							field.name === "Parroquia" ? handleParroquiaChange : null
						}>
					<option value="">Seleccione una opción</option>
                  {field.options.map((option, idx) => (
                    <option key={idx} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : field.type === "button" ? ( 
                <button
                  type="button"
                  className="rounded-full hover:shadow-md transition duration-300 ease-in-out group bg-primaryBlue text-white border border-white hover:bg-white hover:text-primaryBlue hover:border-primaryBlue text-xs px-6 py-2.5 mb-4"
                >
                  Ubicacion Domicilio
                </button>
              </div>

              {/* Referencia Ubicacion */}
              <div className="col-span-1">
                <label className="block text-sm font-medium">
                  Referencia Ubicacion
                </label>
                <input
                  type="text"
                  className="block bg-[#F9FAFB] w-full max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                />
              </div>

              {/* Telefono Casa */}
              <div className="col-span-1">
                <label className="block text-sm font-medium">
                  Telefono Casa
                </label>
                <input
                  type={field.type}
                  className="block bg-[#F9FAFB] w-full max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Tercera seccion - Información de Vivienda */}
          <div className="py-2 w-full">
            <h2 className="text-lg font-semibold mb-4">
              Información de Vivienda
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:grid-cols-4">
              {/* Tipo Vivienda */}
              <div className="col-span-1">
                <label className="block text-sm font-medium">
                  Tipo Vivienda
                </label>
                <select
                  className="block bg-[#F9FAFB] w-full max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                  onChange={handleTipoViviendaChange}
                >
                  <option value="">Seleccione una opción</option>
                  {tipoVivienda.map((option, idx) => (
                    <option key={idx} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tiempo Vivenda */}
              <div className="col-span-1">
                <label className="block text-sm font-medium">
                  Tiempo Vivenda
                </label>
                <select
                  className="block bg-[#F9FAFB] w-full max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                  onChange={handleTiempoVivendaChange}
                >
                  <option value="">Seleccione una opción</option>
                  {tiempoVivenda.map((option, idx) => (
                    <option key={idx} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Nombre Arrendador */}
              <div className="col-span-1">
                <label className="block text-sm font-medium">
                  Nombre Arrendador
                </label>
                <input
                  type="text"
                  className="block bg-[#F9FAFB] w-full max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                />
              </div>

              {/* Telf Arrendador */}
              <div className="col-span-1">
                <label className="block text-sm font-medium">
                  Telf Arrendador
                </label>
                <input
                  type="text"
                  className="block bg-[#F9FAFB] w-full max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                />
              </div>

              {/* Celular Arrendador */}
              <div className="col-span-1">
                <label className="block text-sm font-medium">
                  Celular Arrendador
                </label>
                <input
                  type="text"
                  className="block bg-[#F9FAFB] w-full max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                />
              </div>

              {/* Inmueble */}
              <div className="col-span-1">
                <label className="block text-sm font-medium">Inmueble</label>
                <select
                  className="block bg-[#F9FAFB] w-full max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                  onChange={handleInmuebleChange}
                >
                  <option value="">Seleccione una opción</option>
                  {Inmueble.map((option, idx) => (
                    <option key={idx} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

      <div className="py-2 w-full">
        <form className="grid gap-4 grid-cols-4 md:grid-cols-4">
          {fields2.map((field, index) => (
            <div key={index} className="col-span-1">
              <label className="block text-sm font-medium">{field.label}</label>
              {field.type === "select" ? (
                <select className="block bg-[#F9FAFB] w-full max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm">
                  {field.options.map((option, idx) => (
                    <option key={idx} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Valor Inmueble */}
              <div className="col-span-1">
                <label className="block text-sm font-medium">
                  Valor Inmueble
                </label>
                <input
                  type={field.type}
                  className="block bg-[#F9FAFB] w-full max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              className="rounded-full hover:shadow-md transition duration-300 ease-in-out bg-gray-200 text-gray-800 border border-gray-300 hover:bg-gray-300 text-xs px-6 py-2.5"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-full hover:shadow-md transition duration-300 ease-in-out bg-primaryBlue text-white border border-white hover:bg-blue-600 text-xs px-6 py-2.5"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </>
  );
}