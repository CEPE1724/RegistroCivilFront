import React, { useState, useEffect, useCallback, forwardRef, useImperativeHandle, use } from "react";
import { useSnackbar } from "notistack";
import {
    fetchNacionalidad, fecthGenero, fecthEstadoCivil, fetchNivelEducacion, fetchProfesion, fetchSituacionLaboral,
    fetchProvincias, fetchCantones, fetchParroquias, fetchBarrios, fetchActividadEconomina
} from "../apisFetch";
import { FaCalendarAlt, FaStore, FaUserAlt, FaUser, FaMapMarkerAlt, FaCog, FaPhoneAlt, FaTransgender, FaChild, FaUserGraduate, FaUserSecret, FaToolbox } from "react-icons/fa";
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import { SelectField } from "../../../Utils";

const Datos = forwardRef((props, ref) => {
    const { enqueueSnackbar } = useSnackbar();
    const { data } = props;
    const [formErrors, setFormErrors] = useState({});
    const [nacionalidad, setNacionalidad] = useState([]);
    const [genero, setGenero] = useState([]);
    const [provinciaNacimiento, setProvinciaNacimiento] = useState([]);
    const [cantonNacimiento, setCantonNacimiento] = useState([]);
    const [estadoCivil, setEstadoCivil] = useState([]);
    const [nivelEducacion, setNivelEducacion] = useState([]);
    const [profesion, setProfesion] = useState([]);
    const [situacionLaboral, setSituacionLaboral] = useState([]);
    const [actividadEconomica, setActividadEconomica] = useState([]);

    const [formData, setFormData] = useState({
        nacionalidad: data?.idNacionalidad || '',
        fechaNacimiento: data?.FechaNacimiento || '',
        genero: data?.idGenero || '',
        provinciaNacimiento: data?.idProvinciaNacimiento || '',
        cantonNacimiento: data?.idCantonNacimiento || '',
        estadoCivil: data?.idEdoCivil || '',
        dependientes: data?.NumeroHijos || 0,
        nivelEducacion: data?.idNivelEducacion || '',
        profesion: data?.idProfesion || '',
        situacionLaboral: data.idSituacionLaboral || '',
        actividadEconomica: data.idActEconomica || '',
        observacionActividadEconomica: data?.ObservacionesActividadEconomica || '',
    });

    useEffect(() => {
        // Cargar los datos de las opciones del formulario
        fetchNacionalidad(enqueueSnackbar, setNacionalidad);
        fecthGenero(enqueueSnackbar, setGenero);
        fecthEstadoCivil(enqueueSnackbar, setEstadoCivil);
        fetchProvincias(enqueueSnackbar, setProvinciaNacimiento);
        fetchNivelEducacion(enqueueSnackbar, setNivelEducacion);
        fetchProfesion(enqueueSnackbar, setProfesion);
        fetchSituacionLaboral(enqueueSnackbar, setSituacionLaboral);

    }, [enqueueSnackbar]);

    useEffect(() => {
        if (formData.provinciaNacimiento) {
            fetchCantones(formData.provinciaNacimiento, enqueueSnackbar, setCantonNacimiento);
        }
    }, [formData.provinciaNacimiento, enqueueSnackbar]);

    useEffect(() => {
        if (formData.situacionLaboral) {
            // Asegurarnos de que el valor de 'situacionLaboral' esté listo y hacer la solicitud para actualizar la actividad económica
            fetchActividadEconomina(enqueueSnackbar, formData.situacionLaboral, setActividadEconomica);
        } else {
            // Si no hay situación laboral seleccionada, podemos resetear o limpiar las actividades económicas
            setActividadEconomica([]);
        }
    }, [formData.situacionLaboral, enqueueSnackbar]);

    // Función que maneja los cambios en los campos del formulario
    const handleFormChange = useCallback((e) => {
        const { name, value } = e.target;
        // Eliminar caracteres no permitidos
        const invalidCharsRegex = /[<>'"\\;{}()[\]`~!@#$%^&*=+|/?]/g;
        if (invalidCharsRegex.test(value)) {
            const cleanedValue = value.replace(invalidCharsRegex, '');
            setFormData((prevState) => ({
                ...prevState,
                [name]: cleanedValue,
            }));

            setFormErrors((prevErrors) => ({
                ...prevErrors,
                [name]: 'Este campo contiene caracteres no permitidos bernave',
            }));
            return;
        }

        // Actualizar el estado con el valor limpio
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        // Eliminar los errores anteriores para este campo
        if (formErrors[name]) {
            setFormErrors((prevErrors) => {
                const newErrors = { ...prevErrors };
                delete newErrors[name];
                return newErrors;
            });
        }

        // Cargar actividad económica si cambia la situación laboral
        if (name === 'situacionLaboral' && value) {
            fetchActividadEconomina(enqueueSnackbar, value, setActividadEconomica);
        }
    }, [formErrors, enqueueSnackbar]);

    // Validación del formulario
    const validateForm = useCallback(() => {
        const requiredFieldMessages = {
            nacionalidad: 'Por favor, selecciona tu nacionalidad',
            fechaNacimiento: 'Ingresa tu fecha de nacimiento (formato YYYY-MM-DD)',
            genero: 'Por favor, selecciona tu género',
           //provinciaNacimiento: 'Selecciona la provincia donde naciste',
            //cantonNacimiento: 'Selecciona el cantón donde naciste',
            estadoCivil: 'Por favor, indica tu estado civil',
           // dependientes: 'Ingresa el número de personas dependientes (0 si no tienes)',
            nivelEducacion: 'Selecciona tu nivel de educación',
            profesion: 'Indica tu profesión actual',
            situacionLaboral: 'Selecciona tu situación laboral actual',
            actividadEconomica: 'Selecciona tu actividad económica', // Asegúrate de incluir este campo
            observacionActividadEconomica: 'Describe brevemente tu actividad económica',
        };
        if (formData.nacionalidad == 54) {
            requiredFieldMessages.provinciaNacimiento= 'Selecciona la provincia donde naciste';
            requiredFieldMessages.cantonNacimiento = 'Selecciona el cantón donde naciste';
        }

        const errors = {};

        // Validación de campos obligatorios
        for (const field in formData) {
            if (field === 'provinciaNacimiento' && formData.nacionalidad !== 54) {
                continue;
            }
            if (field === 'cantonNacimiento' && formData.nacionalidad !== 54) {
                continue;
            }
            if (field === 'dependientes' && formData.dependientes === 0) {
                continue;
            }
            if (!formData[field]) {
                errors[field] = requiredFieldMessages[field] || `Este campo es obligatorio`;
            }
        }

        // Validación de campos numéricos (máximo 10 dígitos y solo números)
        const numericFields = ['dependientes'];
        numericFields.forEach(field => {
            if (formData[field] && !/^\d+$/.test(formData[field])) {
                errors[field] = 'Este campo solo debe contener números';
            }
            if (formData[field] && formData[field].length > 10) {
                errors[field] = 'Este campo no debe exceder los 10 dígitos';
            }
        });

        // Validación de campos de texto (no caracteres especiales)
        const textFields = [
            'observacionActividadEconomica'
        ];
        textFields.forEach(field => {
            if (formData[field] && /[<>'"\\;{}()[\]`~!@#$%^&*=+|/?]/g.test(formData[field])) {
                errors[field] = 'Este campo contiene caracteres no permitidos';
                formData[field] = formData[field].replace(/[<>'"\\;{}()[\]`~!@#$%^&*=+|/?]/g, ''); // Limpiar caracteres no permitidos
            }
        });

        // Validación de fecha de nacimiento
        if (formData.fechaNacimiento && !/^\d{4}-\d{2}-\d{2}$/.test(formData.fechaNacimiento)) {
            errors.fechaNacimiento = 'Formato de fecha inválido';
        }

        if (formData.actividadEconomica === '' || formData.actividadEconomica === null || formData.actividadEconomica === undefined || formData.actividadEconomica === 0) {
            errors.actividadEconomica = 'Selecciona tu actividad económica';
        }     // Si hay errores, los devolvemos y evitamos el envío
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return false;
        }

        return true;
    }, [formData]);


    useImperativeHandle(ref, () => ({
        validateForm,
        getFormData: () => formData
    }));

    return (
        <div className="py-2 w-full">
            <div className="mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Nacionalidad */}
                    <SelectField
                        label="Nacionalidad (*)"
                        icon={<FaStore />}
                        value={formData.nacionalidad}
                        onChange={handleFormChange}
                        options={nacionalidad}
                        name="nacionalidad"
                        error={formErrors.nacionalidad}
                        readOnly={data.idNacionalidad !== undefined && data.idNacionalidad !== null && data.idNacionalidad !== "" && data.idNacionalidad > 0}
                    />

                    {/* Fecha Nacimiento */}
                    <div className="col-span-1">
                        <label className="text-xs font-medium mb-1 flex items-center">
                            <FaCalendarAlt className="mr-2 text-primaryBlue" />
                            Fecha Nacimiento (*)
                        </label>
                        <input
                            type="date"
                            value={formData.fechaNacimiento}
                            className="solcitudgrande-style"
                            name="fechaNacimiento"
                            onChange={handleFormChange}
                            readOnly={data.FechaNacimiento !== undefined && data.FechaNacimiento !== null && data.FechaNacimiento !== "" && data.FechaNacimiento.length > 0}
                        />
                        {formErrors.fechaNacimiento && (
                            <p className="mt-1 text-sm text-red-500 border-red-500">
                                {formErrors.fechaNacimiento}
                            </p>
                        )}
                    </div>

                    {/* Género */}
                    <div className="col-span-1">
                        <SelectField
                            label="Género (*)"
                            icon={<FaTransgender />}
                            value={formData.genero}
                            onChange={handleFormChange}
                            options={genero}
                            name="genero"
                            error={formErrors.genero}
                            readOnly={data.idGenero !== undefined && data.idGenero !== null && data.idGenero !== "" && data.idGenero > 0}
                        />
                    </div>

                    {/* Estado Civil */}
                    <div className="col-span-1">
                        <SelectField
                            label="Estado Civil (*)"
                            icon={<FaCog />}
                            value={formData.estadoCivil}
                            onChange={handleFormChange}
                            options={estadoCivil}
                            name="estadoCivil"
                            error={formErrors.estadoCivil}
                            readOnly={data.idEdoCivil !== undefined && data.idEdoCivil !== null && data.idEdoCivil !== "" && data.idEdoCivil > 0}
                        />
                    </div>

                    {/* Dependientes */}
                    <div className="col-span-1">
                        <label className="text-xs font-medium mb-1 flex items-center">
                            <FaChild className="mr-2 text-primaryBlue" />
                            Dependientes (*)
                        </label>
                        <input
                            type="number"
                            className="solcitudgrande-style"
                            name="dependientes"
                            onChange={handleFormChange}
                            value={formData.dependientes || 0}
                            min="0"
                            max="12"
                        />
                        {formErrors.dependientes && (
                            <p className="mt-1 text-sm text-red-500 border-red-500">
                                {formErrors.dependientes}
                            </p>
                        )}
                    </div>

                    {/* Nivel de Educación */}
                    <div className="col-span-1">
                        <SelectField
                            label="Nivel Educación (*)"
                            icon={<FaUserGraduate />}
                            value={formData.nivelEducacion}
                            onChange={handleFormChange}
                            options={nivelEducacion}
                            name="nivelEducacion"
                            error={formErrors.nivelEducacion}
                        />
                    </div>
                    <div className="col-span-1">
                        <SelectField
                            label="Profesión (*)"
                            icon={<FaUserSecret />}
                            value={formData.profesion}
                            onChange={handleFormChange}
                            options={profesion}
                            name="profesion"
                            error={formErrors.profesion}
                        />
                    </div>
                    <div className="mb-6">
                        <SelectField
                            label="Situación Laboral (*)"
                            icon={<FaToolbox />}
                            value={formData.situacionLaboral}
                            onChange={handleFormChange}
                            options={situacionLaboral}
                            name="situacionLaboral"
                            error={formErrors.situacionLaboral}
                            readOnly={data.idSituacionLaboral !== undefined && data.idSituacionLaboral !== null && data.idSituacionLaboral !== "" && data.idSituacionLaboral > 0}
                        />
                    </div>
                    <div className="mb-6">
                        <SelectField
                            label="Actividad Económica (*)"
                            icon={<FaMapMarkerAlt />}
                            value={formData.actividadEconomica}
                            onChange={handleFormChange}
                            options={actividadEconomica}
                            name="actividadEconomica"
                            error={formErrors.actividadEconomica}
                            readOnly={data.idActEconomica !== undefined && data.idActEconomica !== null && data.idActEconomica !== "" && data.idActEconomica > 0}
                        />
                    </div>
                    { data.idNacionalidad == 54 && (
                        <>
                    <div className="mb-6">
                        <SelectField
                            label="Provincia Nacimiento (*)"
                            icon={<FaMapMarkerAlt />}
                            value={formData.provinciaNacimiento}
                            onChange={handleFormChange}
                            options={provinciaNacimiento}
                            name="provinciaNacimiento"
                            error={formErrors.provinciaNacimiento}
                            readOnly={data.idProvinciaNacimiento !== undefined && data.idProvinciaNacimiento !== null && data.idProvinciaNacimiento !== "" && data.idProvinciaNacimiento > 0}
                        />
                    </div>
                    <div className="mb-6">
                        <SelectField
                            label="Cantón Nacimiento (*)"
                            icon={<FaMapMarkerAlt />}
                            value={formData.cantonNacimiento}
                            onChange={handleFormChange}
                            options={cantonNacimiento}
                            name="cantonNacimiento"
                            error={formErrors.cantonNacimiento}
                            readOnly={data.idCantonNacimiento !== undefined && data.idCantonNacimiento !== null && data.idCantonNacimiento !== "" && data.idCantonNacimiento > 0}
                        />
                    </div>
                    <div className="mb-6">
                        <label className="text-xs font-medium mb-1 flex items-center">
                            <FingerprintIcon sx={{ fontSize: 15 }} className="mr-2 text-primaryBlue" />
                            Código Dactilar (*)
                        </label>
                        <input
                            type="text"
                            className="solcitudgrande-style"
                            name="codigoDactilar"
                            //onChange={handleFormChange}
                            value={formData.codigoDactilar || ''}
                            //readOnly={data.codigoDactilar !== undefined && data.codigoDactilar !== null && data.codigoDactilar !== "" && data.codigoDactilar.length > 0}
                        />
                        {formErrors.codigoDactilar && (
                            <p className="mt-1 text-sm text-red-500 border-red-500">
                                {formErrors.codigoDactilar}
                            </p>
                        )}
                    </div>                
                    </>
                    )}
                    <div className="mb-6">

                        <label className="text-xs font-medium mb-1 flex items-center">
                            <FaChild className="mr-2 text-primaryBlue" />
                            Actividad Económica (*)
                        </label>
                        <textarea
                            className="form-input"
                            name="observacionActividadEconomica"
                            onChange={handleFormChange}
                            value={formData.observacionActividadEconomica}
                        />
                        {formErrors.observacionActividadEconomica && (
                            <p className="mt-1 text-sm text-red-500">{formErrors.observacionActividadEconomica}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
});

export default Datos;