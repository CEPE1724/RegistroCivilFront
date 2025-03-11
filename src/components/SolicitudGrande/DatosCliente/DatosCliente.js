import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import { fetchNacionalidad, fecthGenero, fecthEstadoCivil, fetchNivelEducacion, fetchProfesion, fetchSituacionLaboral,
	fecthInmueble, fecthCiudadInmueble, fetchActividadEconomina, fecthTipoVivienda, fetchTiempoVivienda,
	fetchProvincias, fetchCantones, fetchParroquias, fetchBarrios } from "./apisFetch";

export function DatosCliente() {
  const { enqueueSnackbar } = useSnackbar();

  const [formErrors, setFormErrors] = useState({});

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
	fechaNacimiento: '',
	genero: '',
	provinciaNacimiento: '',
	cantonNacimiento: '',
	estadoCivil: '',
	dependientes: '',
	nivelEducacion: '',
	profesion: '',
	situacionLaboral: '',
	actividadEconomica: '',
	observacionActividadEconomica: '',
	provincia: '',
	canton: '',
	parroquia: '',
	barrio: '',
	callePrincipal: '',
	numeroCasa: '',
	calleSecundaria: '',
	ubicacionDomicilio: '',
	referenciaUbicacion: '',
	telefonoCasa: '',
	tipoVivienda: '',
	tiempoVivienda: '',
	nombreArrendador: '',
	telfArrendador: '',
	celularArrendador: '',
	inmueble: '',
	ciudadInmueble: '',
	valorInmueble: ''
  });
  

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

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

	if (name === 'nacionalidad') {
		console.log('nacionalidad');
		console.log(value);
  	};

	if (name === 'fechaNacimiento') {
		console.log('fechaNacimiento');
		console.log(value);
	};

	if (name === 'genero') {
		console.log('genero');
		console.log(value);
	};

	if (name === 'provinciaNacimiento' && value) {
		fetchCantones(value, enqueueSnackbar, setCantonNacimiento);
		setCantonNacimiento([]);
		console.log('provinciaNacimiento');
		console.log(value);

		setFormData(prev => ({ ...prev, cantonNacimiento }));
	}

	if (name === 'cantonNacimiento' && value) {
		console.log('cantonNacimiento');
		console.log(value);
	}

	if (name === 'estadoCivil') {
		console.log('estadoCivil');
		console.log(value);
	}

	if (name === 'dependientes') {
		console.log('dependientes');
		console.log(value);

		setFormData(prev => ({ ...prev, dependientes: value }));
	}

	if (name === 'nivelEducacion') {
		console.log('nivelEducacion');
		console.log(value);
	}

	if (name === 'profesion') {
		console.log('profesion');
		console.log(value);
	}

	if (name === 'situacionLaboral' && value) {
		fetchActividadEconomina(enqueueSnackbar, value, setActividadEconomica);
	}

	if (name === 'actividadEconomica') {
		console.log('actividadEconomica');
		console.log(value);
	}

	if (name === 'observacionActividadEconomica') {
		console.log('observacionActividadEconomica');
		console.log(value);
	}
	//

	if (name === 'provincia' && value) {
		fetchCantones(value, enqueueSnackbar, setCantones);
		setCantones([]);
		setParroquias([]);
		setBarrios([]);
		console.log('provincia');
		console.log(value);

		setFormData(prev => ({ ...prev, cantones: '', parroquias: '', barrios: '' }));
	}

	if (name === 'canton' && value) {
		fetchParroquias(value, enqueueSnackbar, setParroquias);
		setParroquias([]);
		setBarrios([]);
		console.log('canton');
		console.log(value);


		setFormData(prev => ({ ...prev, parroquias: '', barrios: '' }));
	}

	if (name === 'parroquia' && value) {
		fetchBarrios(value, enqueueSnackbar, setBarrios);
		setBarrios([]);
		console.log('parroquia');
		console.log(value);

		setFormData(prev => ({ ...prev, barrios }));
	}

	if (name === 'barrios') {
		console.log(value)
	}

	if (name === 'callePrincipal') {
		console.log('callePrincipal');
		console.log(value);
	}

	if (name === 'numeroCasa') {
		console.log('numeroCasa');
		console.log(value);
	}

	if (name === 'calleSecundaria') {
		console.log('callePrincipal');
		console.log(value);
	}

	if (name === 'ubicacionDomicilio') {
		console.log('ubicacionDomicilio');
		console.log(value);
	}

	if (name === 'referenciaUbicacion') {
		console.log('referenciaUbicacion');
		console.log(value);
	}

	if (name === 'telefonoCasa') {
		console.log('telefonoCasa');
		console.log(value);
	}

	//

	if (name === 'tipoVivienda') {
		console.log('tipoVivienda');
		console.log(value);
	}

	if (name === 'tiempoVivienda') {
		console.log('tiempoVivienda');
		console.log(value);
	}

	//

	if (name === 'tipoVivienda') {
		console.log('tipoVivienda');
		console.log(value);
	}

	if (name === 'tiempoVivienda') {
		console.log('tiempoVivienda');
		console.log(value);
	}

	if (name === 'nombreArrendador') {
		console.log('nombreArrendador');
		console.log(value);
	}

	if (name === 'telfArrendador') {
		console.log('telfArrendador');
		console.log(value);
	}

	if (name === 'celularArrendador') {
		console.log('celularArrendador');
		console.log(value);
	}

	if (name === 'inmueble') {
		console.log('inmueble');
		console.log(value);
	}

	if (name === 'ciudadInmueble') {
		console.log('ciudadInmueble');
		console.log(value);
	}

	if (name === 'valorInmueble') {
		console.log('valorInmueble');
		console.log(value);
	}
		
  };

  const handleSubmit = (e) => {
	e.preventDefault();

	const requiredFieldMessages = {
		nacionalidad: 'Por favor, selecciona tu nacionalidad',
		fechaNacimiento: 'Ingresa tu fecha de nacimiento (formato YYYY-MM-DD)',
		genero: 'Por favor, selecciona tu género',
		provinciaNacimiento: 'Selecciona la provincia donde naciste',
		cantonNacimiento: 'Selecciona el cantón donde naciste',
		estadoCivil: 'Por favor, indica tu estado civil',
		dependientes: 'Ingresa el número de personas dependientes (0 si no tienes)',
		nivelEducacion: 'Selecciona tu nivel de educación',
		profesion: 'Indica tu profesión actual',
		situacionLaboral: 'Selecciona tu situación laboral actual',
		observacionActividadEconomica: 'Describe brevemente tu actividad económica',
		provincia: 'Selecciona la provincia de residencia',
		canton: 'Selecciona el cantón de residencia',
		parroquia: 'Selecciona la parroquia de residencia',
		barrio: 'Selecciona el barrio donde vives',
		callePrincipal: 'Ingresa el nombre de la calle principal de tu domicilio',
		numeroCasa: 'Ingresa el número de casa o apartamento',
		calleSecundaria: 'Ingresa la calle secundaria o intersección',
		ubicacionDomicilio: 'Describe la ubicación de tu domicilio',
		referenciaUbicacion: 'Proporciona referencias para ubicar tu domicilio',
		telefonoCasa: 'Ingresa tu número de teléfono fijo (solo números)',
		tipoVivienda: 'Selecciona el tipo de vivienda',
		tiempoVivienda: 'Indica cuánto tiempo llevas viviendo en esta dirección',
		nombreArrendador: 'Si alquilas, ingresa el nombre del arrendador',
		telfArrendador: 'Ingresa el teléfono fijo del arrendador (solo números)',
		celularArrendador: 'Ingresa el celular del arrendador (solo números)',
		inmueble: 'Selecciona el tipo de inmueble',
		ciudadInmueble: 'Selecciona la ciudad donde se encuentra el inmueble',
		valorInmueble: 'Ingresa el valor estimado del inmueble (solo números)'
	  };
	
	// Limpiar errores previos
	setFormErrors({});
	
	// Objeto para almacenar los errores de validación
	const errors = {};
	
	// Validación de campos obligatorios (todos excepto actividadEconomica)
	for (const field in formData) {
		if (field !== 'actividadEconomica' && !formData[field]) {
		  // Usa el mensaje personalizado si existe, o un mensaje genérico si no
		  errors[field] = requiredFieldMessages[field] || `Este campo es obligatorio`;
		  
		}
	}
	
	// Validación de campos numéricos (máximo 10 dígitos y solo números)
	const numericFields = ['dependientes', 'numeroCasa', 'telefonoCasa', 'telfArrendador', 'celularArrendador', 'valorInmueble'];
	numericFields.forEach(field => {
	  if (formData[field]) {
		// Verificar si contiene solo números
		if (!/^\d+$/.test(formData[field])) {
		  errors[field] = 'Este campo solo debe contener números';
		}
		// Verificar longitud máxima
		if (formData[field].length > 10) {
		  errors[field] = 'Este campo no debe exceder los 10 dígitos';
		}
	  }
	});
	
	// Validación de campos de texto (no caracteres especiales)
	const textFields = [
	  'nacionalidad', 'genero', 'provinciaNacimiento', 'cantonNacimiento', 
	  'estadoCivil', 'nivelEducacion', 'profesion', 'situacionLaboral',
	  'observacionActividadEconomica', 'provincia', 'canton', 'parroquia', 
	  'barrio', 'callePrincipal', 'calleSecundaria', 'ubicacionDomicilio',
	  'referenciaUbicacion', 'tipoVivienda', 'tiempoVivienda', 'nombreArrendador',
	  'inmueble', 'ciudadInmueble'
	];
	
	textFields.forEach(field => {
	  if (formData[field]) {
		// Validar contra caracteres especiales potencialmente peligrosos
		if (/[<>'"\\;{}()]/g.test(formData[field])) {
		  errors[field] = 'Este campo contiene caracteres no permitidos';
		}
	  }
	});
	
	// Validación de fecha
	if (formData.fechaNacimiento) {
	  const fechaPattern = /^\d{4}-\d{2}-\d{2}$/; // formato YYYY-MM-DD
	  if (!fechaPattern.test(formData.fechaNacimiento)) {
		errors.fechaNacimiento = 'Formato de fecha inválido';
	  }
	}
	
	// Si hay errores, mostrarlos y detener el envío
	if (Object.keys(errors).length > 0) {
	  // Establecer los errores para mostrarlos bajo cada campo
	  setFormErrors(errors);
	  
	  // Mostrar mensaje en snackbar
	  enqueueSnackbar('Por favor, corrige los errores en el formulario', { 
		variant: 'error',
	  });
	  
	  // Desplázate al primer campo con error
	  const firstErrorField = Object.keys(errors)[0];
	  const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
	  if (errorElement) {
		errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
		errorElement.focus();
	  }
	  
	  return;
	}
	
	console.log('Formulario válido:', formData);
	
  }

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
                  onChange={handleFormChange}
                  name="nacionalidad"
                >
                  <option value="">Seleccione una opción</option>
                  {nacionalidad.map((option, idx) => (
                    <option key={idx} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
				{formErrors.nacionalidad && (
                  <p className="mt-1 text-sm text-red-500 border-red-500">
                    {formErrors.nacionalidad}
                  </p>
                )}
              </div>

              {/* Fecha Nacimiento */}
              <div className="col-span-1">
                <label className="block text-sm font-medium">
                  Fecha Nacimiento
                </label>
                <input
                  type="date"
                  className="block bg-[#F9FAFB] w-full max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                  name="fechaNacimiento"
                  onChange={handleFormChange}
                />
				{formErrors.fechaNacimiento && (
                  <p className="mt-1 text-sm text-red-500 border-red-500">
                    {formErrors.fechaNacimiento}
                  </p>
                )}
              </div>

              {/* Género */}
              <div className="col-span-1">
                <label className="block text-sm font-medium">Género</label>
                <select
                  className="block bg-[#F9FAFB] w-full max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                  name="genero"
                  onChange={handleFormChange}
                >
                  <option value="">Seleccione una opción</option>
                  {genero.map((option, idx) => (
                    <option key={idx} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
				{formErrors.genero && (
                  <p className="mt-1 text-sm text-red-500 border-red-500">
                    {formErrors.genero}
                  </p>
                )}
              </div>

              {/* Provincia Nacimiento */}
              <div className="col-span-1">
                <label className="block text-sm font-medium">
                  Provincia Nacimiento
                </label>
                <select
                  className="block bg-[#F9FAFB] w-full max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                  onChange={handleFormChange}
                  name="provinciaNacimiento"
                >
                  <option value="">Seleccione una opción</option>
                  {privinciaNacimiento.map((option, idx) => (
                    <option key={idx} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
				{formErrors.provinciaNacimiento && (
                  <p className="mt-1 text-sm text-red-500 border-red-500">
                    {formErrors.provinciaNacimiento}
                  </p>
                )}
              </div>

              {/* Canton Nacimiento */}
              <div className="col-span-1">
                <label className="block text-sm font-medium">
                  Canton Nacimiento
                </label>
                <select
                  className="block bg-[#F9FAFB] w-full max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                  onChange={handleFormChange}
                  name="cantonNacimiento"
                >
                  <option value="">Seleccione una opción</option>
                  {cantonNacimiento.map((option, idx) => (
                    <option key={idx} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
				{formErrors.cantonNacimiento && (
                  <p className="mt-1 text-sm text-red-500 border-red-500">
                    {formErrors.cantonNacimiento}
                  </p>
                )}
              </div>

              {/* Estado Civil */}
              <div className="col-span-1">
                <label className="block text-sm font-medium">
                  Estado Civil
                </label>
                <select
                  className="block bg-[#F9FAFB] w-full max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                  onChange={handleFormChange}
                  name="estadoCivil"
                >
                  <option value="">Seleccione una opción</option>
                  {estadoCivil.map((option, idx) => (
                    <option key={idx} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
				{formErrors.estadoCivil && (
                  <p className="mt-1 text-sm text-red-500 border-red-500">
                    {formErrors.estadoCivil}
                  </p>
                )}
              </div>

              {/* Dependientes */}
              <div className="col-span-1">
                <label className="block text-sm font-medium">
                  Dependientes
                </label>
                <input
                  type="number"
                  className="block bg-[#F9FAFB] w-full max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                  name="dependientes"
                  onChange={handleFormChange}
                />
				{formErrors.dependientes && (
                  <p className="mt-1 text-sm text-red-500 border-red-500">
                    {formErrors.dependientes}
                  </p>
                )}
              </div>

              {/* Nivel Educacion */}
              <div className="col-span-1">
                <label className="block text-sm font-medium">
                  Nivel Educacion
                </label>
                <select
                  className="block bg-[#F9FAFB] w-full max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                  onChange={handleFormChange}
                  name="nivelEducacion"
                >
                  <option value="">Seleccione una opción</option>
                  {nivelEducacion.map((option, idx) => (
                    <option key={idx} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
				{formErrors.nivelEducacion && (
                  <p className="mt-1 text-sm text-red-500 border-red-500">
                    {formErrors.nivelEducacion}
                  </p>
                )}
              </div>

              {/* Profesion */}
              <div className="col-span-1">
                <label className="block text-sm font-medium">Profesion</label>
                <select
                  className="block bg-[#F9FAFB] w-full max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                  onChange={handleFormChange}
                  name="profesion"
                >
                  <option value="">Seleccione una opción</option>
                  {profesion.map((option, idx) => (
                    <option key={idx} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
				{formErrors.profesion && (
                  <p className="mt-1 text-sm text-red-500 border-red-500">
                    {formErrors.profesion}
                  </p>
                )}
              </div>

              {/* Situacion Laboral */}
              <div className="col-span-1">
                <label className="block text-sm font-medium">
                  Situacion Laboral
                </label>
                <select
                  className="block bg-[#F9FAFB] w-full max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                  onChange={handleFormChange}
                  name="situacionLaboral"
                >
                  <option value="">Seleccione una opción</option>
                  {sitacionLaboral.map((option, idx) => (
                    <option key={idx} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
				{formErrors.situacionLaboral && (
                  <p className="mt-1 text-sm text-red-500 border-red-500">
                    {formErrors.situacionLaboral}
                  </p>
                )}
              </div>

              {/* Actividad Economica */}
              <div className="col-span-1">
                <label className="block text-sm font-medium">
                  Actividad Economica
                </label>
                <select
                  className="block bg-[#F9FAFB] w-full max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                  onChange={handleFormChange}
                  name="actividadEconomica"
                >
                  <option value="">Seleccione una opción</option>
                  {actividadEconomica.map((option, idx) => (
                    <option key={idx} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
				{formErrors.actividadEconomica && (
                  <p className="mt-1 text-sm text-red-500 border-red-500">
                    {formErrors.actividadEconomica}
                  </p>
                )}
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
                  name="observacionActividadEconomica"
                  onChange={handleFormChange}
                ></textarea>
				{formErrors.observacionActividadEconomica && (
                  <p className="mt-1 text-sm text-red-500 border-red-500">
                    {formErrors.observacionActividadEconomica}
                  </p>
                )}
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
                  onChange={handleFormChange}
                  name="provincia"
                >
                  <option value="">Seleccione una opción</option>
                  {provincia.map((option, idx) => (
                    <option key={idx} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
				{formErrors.provincia && (
                  <p className="mt-1 text-sm text-red-500 border-red-500">
                    {formErrors.provincia}
                  </p>
                )}
              </div>

              {/* Canton */}
              <div className="col-span-1">
                <label className="block text-sm font-medium">Canton</label>
                <select
                  className="block bg-[#F9FAFB] w-full max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                  onChange={handleFormChange}
                  name="canton"
                >
                  <option value="">Seleccione una opción</option>
                  {cantones.map((option, idx) => (
                    <option key={idx} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
				{formErrors.canton && (
                  <p className="mt-1 text-sm text-red-500 border-red-500">
                    {formErrors.canton}
                  </p>
                )}
              </div>

              {/* Parroquia */}
              <div className="col-span-1">
                <label className="block text-sm font-medium">Parroquia</label>
                <select
                  className="block bg-[#F9FAFB] w-full max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                  onChange={handleFormChange}
                  name="parroquia"
                >
                  <option value="">Seleccione una opción</option>
                  {parroquias.map((option, idx) => (
                    <option key={idx} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
				{formErrors.parroquia && (
                  <p className="mt-1 text-sm text-red-500 border-red-500">
                    {formErrors.parroquia}
                  </p>
                )}
              </div>

              {/* Barrio */}
              <div className="col-span-1">
                <label className="block text-sm font-medium">Barrio</label>
                <select
                  className="block bg-[#F9FAFB] w-full max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                  onChange={handleFormChange}
                  name="barrios"
                >
                  <option value="">Seleccione una opción</option>
                  {barrios.map((option, idx) => (
                    <option key={idx} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {formErrors.barrio && (
                  <p className="mt-1 text-sm text-red-500 border-red-500">
                    {formErrors.barrio}
                  </p>
                )}
              </div>

              {/* Calle Principal */}
              <div className="col-span-1">
                <label className="block text-sm font-medium">
                  Calle Principal
                </label>
                <input
                  type="text"
                  className="block bg-[#F9FAFB] w-full max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                  name="callePrincipal"
                  onChange={handleFormChange}
                />
				{formErrors.callePrincipal && (
                  <p className="mt-1 text-sm text-red-500 border-red-500">
                    {formErrors.callePrincipal}
                  </p>
                )}
              </div>

              {/* Numero Casa */}
              <div className="col-span-1">
                <label className="block text-sm font-medium">Numero Casa</label>
                <input
                  type="text"
                  className="block bg-[#F9FAFB] w-full max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                  name="numeroCasa"
                  onChange={handleFormChange}
                />
				{formErrors.numeroCasa && (
                  <p className="mt-1 text-sm text-red-500 border-red-500">
                    {formErrors.numeroCasa}
                  </p>
                )}
              </div>

              {/* Calle Secundaria */}
              <div className="col-span-1">
                <label className="block text-sm font-medium">
                  Calle Secundaria
                </label>
                <input
                  type="text"
                  className="block bg-[#F9FAFB] w-full max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                  name="calleSecundaria"
                  onChange={handleFormChange}
                />
				{formErrors.calleSecundaria && (
                  <p className="mt-1 text-sm text-red-500 border-red-500">
                    {formErrors.calleSecundaria}
                  </p>
                )}
              </div>

              {/* Ubicacion Domicilio */}
              <div className="col-span-1">
                <label className="block text-sm font-medium">
                  Ubicacion Domicilio
                </label>
                <button
                  type="button"
                  className="rounded-full hover:shadow-md transition duration-300 ease-in-out group bg-primaryBlue text-white border border-white hover:bg-white hover:text-primaryBlue hover:border-primaryBlue text-xs px-6 py-2.5 mb-4"
                  name="ubicacionDomicilio"
                  onClick={handleFormChange}
                >
                  Ubicacion Domicilio
                </button>
				{formErrors.ubicacionDomicilio && (
                  <p className="mt-1 text-sm text-red-500 border-red-500">
                    {formErrors.ubicacionDomicilio}
                  </p>
                )}
              </div>

              {/* Referencia Ubicacion */}
              <div className="col-span-1">
                <label className="block text-sm font-medium">
                  Referencia Ubicacion
                </label>
                <input
                  type="text"
                  className="block bg-[#F9FAFB] w-full max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                  name="referenciaUbicacion"
                  onChange={handleFormChange}
                />
				{formErrors.referenciaUbicacion && (
                  <p className="mt-1 text-sm text-red-500 border-red-500">
                    {formErrors.referenciaUbicacion}
                  </p>
                )}
              </div>

              {/* Telefono Casa */}
              <div className="col-span-1">
                <label className="block text-sm font-medium">
                  Telefono Casa
                </label>
                <input
                  type="text"
                  className="block bg-[#F9FAFB] w-full max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                  name="telefonoCasa"
                  onChange={handleFormChange}
                />
				{formErrors.telefonoCasa && (
                  <p className="mt-1 text-sm text-red-500 border-red-500">
                    {formErrors.telefonoCasa}
                  </p>
                )}
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
                  name="tipoVivienda"
                  onChange={handleFormChange}
                >
                  <option value="">Seleccione una opción</option>
                  {tipoVivienda.map((option, idx) => (
                    <option key={idx} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
				{formErrors.tipoVivienda && (
                  <p className="mt-1 text-sm text-red-500 border-red-500">
                    {formErrors.tipoVivienda}
                  </p>
                )}
              </div>

              {/* Tiempo Vivenda */}
              <div className="col-span-1">
                <label className="block text-sm font-medium">
                  Tiempo Vivenda
                </label>
                <select
                  className="block bg-[#F9FAFB] w-full max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                  onChange={handleFormChange}
                  name="tiempoVivienda"
                >
                  <option value="">Seleccione una opción</option>
                  {tiempoVivenda.map((option, idx) => (
                    <option key={idx} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
				{formErrors.tiempoVivienda && (
                  <p className="mt-1 text-sm text-red-500 border-red-500">
                    {formErrors.tiempoVivienda}
                  </p>
                )}
              </div>

              {/* Nombre Arrendador */}
              <div className="col-span-1">
                <label className="block text-sm font-medium">
                  Nombre Arrendador
                </label>
                <input
                  type="text"
                  className="block bg-[#F9FAFB] w-full max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                  name="nombreArrendador"
                  onChange={handleFormChange}
                />
				{formErrors.nombreArrendador && (
                  <p className="mt-1 text-sm text-red-500 border-red-500">
                    {formErrors.nombreArrendador}
                  </p>
                )}
              </div>

              {/* Telf Arrendador */}
              <div className="col-span-1">
                <label className="block text-sm font-medium">
                  Telf Arrendador
                </label>
                <input
                  type="text"
                  className="block bg-[#F9FAFB] w-full max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                  name="telfArrendador"
                  onChange={handleFormChange}
                />
				{formErrors.telfArrendador && (
                  <p className="mt-1 text-sm text-red-500 border-red-500">
                    {formErrors.telfArrendador}
                  </p>
                )}
              </div>

              {/* Celular Arrendador */}
              <div className="col-span-1">
                <label className="block text-sm font-medium">
                  Celular Arrendador
                </label>
                <input
                  type="text"
                  className="block bg-[#F9FAFB] w-full max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                  name="celularArrendador"
                  onChange={handleFormChange}
                />
				{formErrors.celularArrendador && (
                  <p className="mt-1 text-sm text-red-500 border-red-500">
                    {formErrors.celularArrendador}
                  </p>
                )}
              </div>

              {/* Inmueble */}
              <div className="col-span-1">
                <label className="block text-sm font-medium">Inmueble</label>
                <select
                  className="block bg-[#F9FAFB] w-full max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                  name="inmueble"
                  onChange={handleFormChange}
                >
                  <option value="">Seleccione una opción</option>
                  {Inmueble.map((option, idx) => (
                    <option key={idx} value={option.value}>
                      {option.label}
                    </option>
                  ))}
				  {formErrors.inmueble && (
                  <p className="mt-1 text-sm text-red-500 border-red-500">
                    {formErrors.inmueble}
                  </p>
                )}
                </select>
              </div>

              {/* Ciudad Inmueble */}
              <div className="col-span-1">
                <label className="block text-sm font-medium">
                  Ciudad Inmueble
                </label>
                <select
                  className="block bg-[#F9FAFB] w-full max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                  name="ciudadInmueble"
                  onChange={handleFormChange}
                >
                  <option value="">Seleccione una opción</option>
                  {ciudadInmueble.map((option, idx) => (
                    <option key={idx} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
				{formErrors.ciudadInmueble && (
                  <p className="mt-1 text-sm text-red-500 border-red-500">
                    {formErrors.ciudadInmueble}
                  </p>
                )}
              </div>

              {/* Valor Inmueble */}
              <div className="col-span-1">
                <label className="block text-sm font-medium">
                  Valor Inmueble
                </label>
                <input
                  type="text"
                  name="valorInmueble"
                  onChange={handleFormChange}
                  className="block bg-[#F9FAFB] w-full max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                />
				{formErrors.ciudadInmueble && (
                  <p className="mt-1 text-sm text-red-500 border-red-500">
                    {formErrors.ciudadInmueble}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Botones */}
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
              onClick={handleSubmit}
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </>
  );
}