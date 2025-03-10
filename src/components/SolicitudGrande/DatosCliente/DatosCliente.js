import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import { fetchNacionalidad, fecthGenero, fecthEstadoCivil, fetchNivelEducacion, fetchProfesion, fetchSituacionLaboral,
	fecthInmueble, fecthCiudadInmueble, fetchActividadEconomina, fecthTipoVivienda, fetchTiempoVivienda,
	fetchProvincias, fetchCantones, fetchParroquias, fetchBarrios } from "./apisFetch";

export function DatosCliente() {
  const { enqueueSnackbar } = useSnackbar();

  const [nacionalidad, setNacionalidad] = useState([]);
  const [genero, setGenero] = useState([]);
  const [privinciaNacimiento, setProvinciaNacimiento] = useState([]);
  const [cantonNacimiento, setCantonNacimiento] = useState([]);
  const [estadoCivil, setEstadoCivil] = useState([]);
  const [nivelEducacion, setNivelEducacion] = useState([]);
  const [profesion, setProfesion] = useState([]);
  const [sitacionLaboral, setSituacionLaboral] = useState([]);
  const [actividadEconomica, setActividadEconomica] = useState([]);

  const [provincia, setProvincia] = useState([]);
  const [cantones, setCantones] = useState([]);
  const [parroquias, setParroquias] = useState([]);
  const [barrios, setBarrios] = useState([]);
  const [Inmueble, setInmueble] = useState([]);
  const [ciudadInmueble, setCiudadInmueble] = useState([]);
  const [tipoVivienda, setTipoVivienda] = useState([]);
  const [tiempoVivenda, setTiempoVivenda] = useState([]);

  const [formData, setFormData] = useState({
    nacionalidad: '',
    genero: '',
    provinciaNacimiento: '',
    cantonNacimiento: '',
    estadoCivil: '',
    nivelEducacion: '',
    profesion: '',
    situacionLaboral: '',
    actividadEconomica: '',
    provincia: '',
    canton: '',
    parroquia: '',
    barrio: '',
    inmueble: '',
    ciudadInmueble: '',
    tipoVivienda: '',
    tiempoVivienda: ''
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  useEffect(() => {
	fetchNacionalidad(enqueueSnackbar, setNacionalidad);
	fecthGenero(enqueueSnackbar, setGenero);
	fecthEstadoCivil(enqueueSnackbar, setEstadoCivil);
	fetchProvincias(enqueueSnackbar, setProvinciaNacimiento);
    fetchNivelEducacion(enqueueSnackbar, setNivelEducacion);
    fetchProfesion(enqueueSnackbar, setProfesion);
	fetchSituacionLaboral(enqueueSnackbar, setSituacionLaboral);
    fetchProvincias(enqueueSnackbar, setProvincia);
	fecthInmueble(enqueueSnackbar, setInmueble);
	fecthCiudadInmueble(enqueueSnackbar, setCiudadInmueble);
	fecthTipoVivienda(enqueueSnackbar, setTipoVivienda);
	fetchTiempoVivienda(enqueueSnackbar, setTiempoVivenda);
  }, []);

  const handleNacionalidadChange = (e) => {
	const idNacionalidad = e.target.value;
	};

	const handleGeneroChange = (e) => {
	const idGenero = e.target.value;
	};

	const handleEstadoCivilChange = (e) => {
		const idEstadoCivil = e.target.value;
	};

	const handleNivelEducacionChange = (e) => {
		const idNivelEducacion = e.target.value;
	};

	const handleProfesionChange = (e) => {
		const idProfesion = e.target.value;
	};

	const handleSituacionLaboralChange = (e) => {
		const idSituacionLaboral = e.target.value;
		console.log(idSituacionLaboral);
		if (idSituacionLaboral) fetchActividadEconomina(enqueueSnackbar, idSituacionLaboral, setActividadEconomica);
		setActividadEconomica([]);
	};

	const handleActividadEconomicaChange = (e) => {
		const idActividadEconomica = e.target.value;
	};

  const handleProvinciaNacimientoChange = (e) => {
    const idProvincia = e.target.value;
    if (idProvincia) fetchCantones(idProvincia, enqueueSnackbar, setCantonNacimiento);
	setCantonNacimiento([]);
  };

  const handleProvinciaChange = (e) => {
    const idProvincia = e.target.value;
    if (idProvincia) fetchCantones(idProvincia, enqueueSnackbar, setCantones);
	setCantones([]);
	setParroquias([]);
	setBarrios([]);
  };

  const handleCantonChange = (e) => {
    const cantonId = e.target.value;
    if (cantonId) fetchParroquias(cantonId, enqueueSnackbar, setParroquias);
	setParroquias([]);
	setBarrios([]);
  };
  
  const handleParroquiaChange = (e) => {
    const idParroquia = e.target.value;
    if (idParroquia) fetchBarrios(idParroquia, enqueueSnackbar, setBarrios);
	setBarrios([]);
  };

  const handleInmuebleChange = (e) => {
	const idInmueble = e.target.value;
	  };

	const handleCiudadInmuebleChange = (e) => {
	const idCiudadInmueble = e.target.value;
	};

	const handleTipoViviendaChange = (e) => {
	 const idTipoVivienda = e.target.value;
	};

	const handleTiempoVivendaChange = (e) => {
	const idTiempoVivenda = e.target.value;
	};

  return (
    <>
      {/* Formulario Completo Combinado con Secciones Separadas */}
      <div className="py-2 w-full">
        <form>
          {/* Primera seccion - Información Personal */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Información Personal</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:grid-cols-5">
              {/* Nacionalidad */}
              <div className="col-span-1">
                <label className="block text-sm font-medium">
                  Nacionalidad
                </label>
                <select
                  className="block bg-[#F9FAFB] w-full max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                  onChange={handleNacionalidadChange}
                >
                  <option value="">Seleccione una opción</option>
                  {nacionalidad.map((option, idx) => (
                    <option key={idx} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fecha Nacimiento */}
              <div className="col-span-1">
                <label className="block text-sm font-medium">
                  Fecha Nacimiento
                </label>
                <input
                  type="date"
                  className="block bg-[#F9FAFB] w-full max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                />
              </div>

              {/* Género */}
              <div className="col-span-1">
                <label className="block text-sm font-medium">Género</label>
                <select
                  className="block bg-[#F9FAFB] w-full max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                  onChange={handleGeneroChange}
                >
                  <option value="">Seleccione una opción</option>
                  {genero.map((option, idx) => (
                    <option key={idx} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Provincia Nacimiento */}
              <div className="col-span-1">
                <label className="block text-sm font-medium">
                  Provincia Nacimiento
                </label>
                <select
                  className="block bg-[#F9FAFB] w-full max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                  onChange={handleProvinciaNacimientoChange}
                >
                  <option value="">Seleccione una opción</option>
                  {privinciaNacimiento.map((option, idx) => (
                    <option key={idx} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Canton Nacimiento */}
              <div className="col-span-1">
                <label className="block text-sm font-medium">
                  Canton Nacimiento
                </label>
                <select
                  className="block bg-[#F9FAFB] w-full max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                  onChange={handleCantonChange}
                >
                  <option value="">Seleccione una opción</option>
                  {cantonNacimiento.map((option, idx) => (
                    <option key={idx} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Estado Civil */}
              <div className="col-span-1">
                <label className="block text-sm font-medium">
                  Estado Civil
                </label>
                <select
                  className="block bg-[#F9FAFB] w-full max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                  onChange={handleEstadoCivilChange}
                >
                  <option value="">Seleccione una opción</option>
                  {estadoCivil.map((option, idx) => (
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
                  type="number"
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

              {/* Barrio */}
              <div className="col-span-1">
                <label className="block text-sm font-medium">Barrio</label>
                <select className="block bg-[#F9FAFB] w-full max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm">
                  <option value="">Seleccione una opción</option>
                  {barrios.map((option, idx) => (
                    <option key={idx} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Calle Principal */}
              <div className="col-span-1">
                <label className="block text-sm font-medium">
                  Calle Principal
                </label>
                <input
                  type="text"
                  className="block bg-[#F9FAFB] w-full max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                />
              </div>

              {/* Numero Casa */}
              <div className="col-span-1">
                <label className="block text-sm font-medium">Numero Casa</label>
                <input
                  type="text"
                  className="block bg-[#F9FAFB] w-full max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                />
              </div>

              {/* Calle Secundaria */}
              <div className="col-span-1">
                <label className="block text-sm font-medium">
                  Calle Secundaria
                </label>
                <input
                  type="text"
                  className="block bg-[#F9FAFB] w-full max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                />
              </div>

              {/* Ubicacion Domicilio */}
              <div className="col-span-1">
                <label className="block text-sm font-medium">
                  Ubicacion Domicilio
                </label>
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
                  type="text"
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

              {/* Ciudad Inmueble */}
              <div className="col-span-1">
                <label className="block text-sm font-medium">
                  Ciudad Inmueble
                </label>
                <select
                  className="block bg-[#F9FAFB] w-full max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                  onChange={handleCiudadInmuebleChange}
                >
                  <option value="">Seleccione una opción</option>
                  {ciudadInmueble.map((option, idx) => (
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
                  type="text"
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