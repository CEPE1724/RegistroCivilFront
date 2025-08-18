import React, { useState, useEffect, useCallback, forwardRef, useImperativeHandle, use, useRef } from "react";
import { useSnackbar } from "notistack";
import { APIURL } from "../../../../configApi/apiConfig";
import axios from "../../../../configApi/axiosConfig";
import {
    fetchNacionalidad, fecthGenero, fecthEstadoCivil, fetchNivelEducacion, fetchProfesion, fetchSituacionLaboral,
    fetchProvincias, fetchCantones, fetchParroquias, fetchBarrios, fetchActividadEconomina
} from "../apisFetch";
import uploadFile from "../../../../hooks/uploadFile";
import { FaCalendarAlt, FaStore, FaUserAlt, FaUser, FaMapMarkerAlt, FaCog, FaPhoneAlt, FaTransgender, FaChild, FaUserGraduate, FaUserSecret, FaToolbox, FaFacebook } from "react-icons/fa";
import { Button, Dialog, DialogTitle, DialogContent, } from "@mui/material";
import CapturarCamara from "../../../CapturarCamara/CapturarCamara";
import FingerprintIcon from '@mui/icons-material/Fingerprint';

import { SelectField } from "../../../Utils";
import { Facebook } from "@mui/icons-material";

const Datos = forwardRef((props, ref) => {
    const { enqueueSnackbar } = useSnackbar();
    const { data, cresolicitud } = props;
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

    const [openCameraModal, setOpenCameraModal] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [imagenCapturada, setImagenCapturada] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(cresolicitud?.imagen || null);
    const [fileToUpload, setFileToUpload] = useState(null);
    const [urlCloudstorage, setUrlCloudstorage] = useState(null);
	const inputFileRef = useRef(null); 

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
        situacionLaboral: data?.idSituacionLaboral || '',
        actividadEconomica: data?.idActEconomica || '',
        observacionActividadEconomica: data?.ObservacionesActividadEconomica || '',
        Facebook: data?.Facebook || '',
        codigoDactilar: cresolicitud?.CodigoDactilar || '',
       
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
        if (name !== 'Facebook' && invalidCharsRegex.test(value)) {
            const cleanedValue = value.replace(invalidCharsRegex, '');
            setFormData((prevState) => ({
                ...prevState,
                [name]: cleanedValue,
            }));

            setFormErrors((prevErrors) => ({
                ...prevErrors,
                [name]: 'Este campo contiene caracteres no permitidos.',
            }));
            return;
        }

        if (name === 'codigoDactilar') {
            const upperValue = value.toUpperCase();
            setFormData((prevState) => ({
                ...prevState,
                [name]: upperValue,
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

	function validarCodigoDactilar(codigo) {
    if (!codigo || codigo.length !== 10) return false;

    const esLetra = (char) => /^[A-Z]$/.test(char);
    const esNumero = (char) => /^[0-9]$/.test(char);

    // Validar primero y quinto caracteres como letras obligatorias
    if (!esLetra(codigo[0]) || !esLetra(codigo[5])) return false;

    // grupo 2–4: números y solo una letra
    const grupo1 = codigo.slice(1, 4);
    const letrasGrupo1 = [...grupo1].filter(c => esLetra(c)).length;
    if (letrasGrupo1 > 1) return false;

    // grupo 6–10:números y solo una letra
    const grupo2 = codigo.slice(6, 10);
    const letrasGrupo2 = [...grupo2].filter(c => esLetra(c)).length;
    if (letrasGrupo2 > 1) return false;

    // Todos los caracteres deben ser números o letras
    if (![...codigo].every(c => esLetra(c) || esNumero(c))) return false;

    return true;
}


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
            codigoDactilar: 'Ingresa tu código dactilar (formato A0000A0000)',
        };
        if (formData.nacionalidad == 54) {
            requiredFieldMessages.provinciaNacimiento = 'Selecciona la provincia donde naciste';
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
            // si el campo es facebook y no tiene valor no lo validamos
            if (field === 'Facebook' && formData.Facebook === '') {
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

        if (formData.codigoDactilar && !validarCodigoDactilar(formData.codigoDactilar.toUpperCase())) {
            errors.codigoDactilar = 'Formato de codigo dactilar invalido';
        }

        if (formData.actividadEconomica === '' || formData.actividadEconomica === null || formData.actividadEconomica === undefined || formData.actividadEconomica === 0) {
            errors.actividadEconomica = 'Selecciona tu actividad económica';
        }     // Si hay errores, los devolvemos y evitamos el envío
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return false;
        }


        // validra Facebook si escribio algo minimo 3 caracteres y maximo 20 caracteres
        if (formData.Facebook && (formData.Facebook.length < 3 || formData.Facebook.length > 20)) {
            errors.Facebook = 'El campo Facebook debe tener entre 3 y 20 caracteres';
            setFormErrors(errors);
            return false;
        }
        return true;
    }, [formData]);


    useImperativeHandle(ref, () => ({
        validateForm,
        getFormData: () => formData
    }));

    const fetchActualizaSolicitud = async (idSolicitud, data) => {
        try {
            const url = APIURL.putUpdatesolicitud(idSolicitud); // URL para actualizar la solicitud
            const response = await axios.put(url, data, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            return response.data; // Retornar datos actualizados si es necesario
        } catch (error) {
            console.error("Error al actualizar la solicitud:", error.message);
            throw error; // Re-lanzar error para manejarlo más tarde
        }
    };

    const handleUploadClick = async () => {
        if (!fileToUpload) {
            alert("Primero selecciona una imagen");
            return;
        }
        try {
            let updatedUrl = "";
            const fileUploadResponse = await uploadFile(
                fileToUpload,
                data.Bodega,
                data.Cedula,
                data.NumeroSolicitud,
                "Foto"
            );
		
            if (fileUploadResponse) {
                updatedUrl = fileUploadResponse.url;
                // Actualizar en backend
                const updatedData = { Foto: updatedUrl };
                await fetchActualizaSolicitud(data.idCre_SolicitudWeb, updatedData);
                setUrlCloudstorage();
                setFileToUpload(null);
                enqueueSnackbar("Foto subida correctamente", {
                    variant: "success",
                });
            }
        } catch (error) {
            alert(error.message);
        }
    };

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (!file) return;
	
		const extension = file.name.split('.').pop().toLowerCase();
		if (extension !== "jpeg" && extension !== "jpg" && extension !== "png") {
		  enqueueSnackbar("Solo archivos con extensión .jpeg son permitidos", { variant: "error" });
		  e.target.value = null; // reset input
		  setFileToUpload(null);
		  setPreviewUrl(null);
		  return;
		}
	
		setFileToUpload(file);
		const localUrl = URL.createObjectURL(file);
		setPreviewUrl(localUrl);
	  };

    return (
        <div className="py-2 w-full">
            <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Primera columna */}
                    <div className="col-span-1 lg:col-span-1 min-w-0">
                        <div className="h-full border rounded p-4 bg-gray-50">

                            <div className="w-full flex flex-col items-center space-y-4">
                                {/* Contenedor de la imagen */}
                                <div className="w-full h-48 sm:h-56 md:h-64 border-2 border-dashed border-gray-400 rounded-xl overflow-hidden flex items-center justify-center bg-gray-100 shadow-inner">
                                    {!previewUrl || previewUrl === "prueba" ?
                                        (<div className="w-full h-full flex items-center justify-center bg-gray-100 border-4 border-gray-300 rounded-lg">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-24 w-24 text-gray-400"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M5.121 17.804A9 9 0 0112 15a9 9 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                            </svg>
                                        </div>) : (
                                            <img
                                                src={urlCloudstorage === "prueba" || urlCloudstorage === null ? previewUrl : urlCloudstorage}  //urlCloudstorage === "prueba" || urlCloudstorage === null ? previewUrl : urlCloudstorage
                                                alt="Foto del cliente"
                                                className="w-full h-full object-cover border-4 border-gray-300 rounded-lg"
                                            />
                                        )
                                    }
                                </div>
                                {/* Botones debajo de la imagen */}
                                <div className="flex flex-col sm:flex-row justify-center items-center gap-2 w-full">
                                    {/* Botón subir imagen */}

                                    <div className="flex flex-col sm:flex-row gap-2 w-full">
                                        <Button onClick={() => setOpenCameraModal(true)} >
                                            Tomar Foto
                                        </Button>
                                        <button
                                            onClick={handleUploadClick}
                                            disabled={!fileToUpload}
                                            className={`w-full sm:flex-1 py-2 px-2 sm:px-4 text-sm rounded-lg font-semibold shadow-md transition duration-300 ${fileToUpload
										    ? "bg-green-600 hover:bg-green-700 text-white cursor-pointer"
										    : "bg-gray-300 text-gray-500 cursor-not-allowed"
											} }`}
                                        >
                                        	Guardar Foto
                                        </button>
										<input
                      					  type="file"
                      					  accept="image/jpeg, image/png"
                      					  onChange={handleFileChange}
                      					  ref={inputFileRef}
                      					  style={{ display: "none" }}
                      					/>
										<Button onClick={() => inputFileRef.current.click()}>
										  Cargar foto
										</Button>
										
                                    </div>

                                </div>
                            </div>
                            <Dialog
                                open={openCameraModal}
                                onClose={() => setOpenCameraModal(false)}
                                maxWidth="sm"
                                fullWidth
                            >
                                <DialogTitle>Captura de foto 😀</DialogTitle>
                                <DialogContent>
                                    <CapturarCamara
                                        onCapture={(imgBase64) => {
                                            setImagenCapturada(imgBase64);
                                            setPreviewUrl(imgBase64);
                                            setOpenCameraModal(false);
                                            // Convertir base64 a objeto File para permitir subir
                                            const blob = fetch(imgBase64)
                                                .then((res) => res.blob())
                                                .then((blobData) => {
                                                    const file = new File([blobData], "captura.jpg", {
                                                        type: "image/jpeg",
                                                    });
                                                    setFileToUpload(file); // ✅ Esto habilita el botón de "Subir imagen"
                                                });
                                        }}
                                    />
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                    {/* segunda columnda */}
                    <div className="md:col-span-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {/* Nacionalidad */}
                            <SelectField
                                label="Nacionalidad (*)"
                                icon={<FaStore />}
                                value={formData.nacionalidad}
                                onChange={handleFormChange}
                                options={nacionalidad}
                                name="nacionalidad"
                                error={formErrors.nacionalidad}
                                readOnly={data?.idNacionalidad !== undefined && data?.idNacionalidad !== null && data?.idNacionalidad !== "" && data?.idNacionalidad > 0}
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
                                   // readOnly={data.idActEconomica !== undefined && data.idActEconomica !== null && data.idActEconomica !== "" && data.idActEconomica > 0}
                                />
                            </div>
                            {data.idNacionalidad == 54 && (
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
                                   
                                </>

                            )}

                             <div className="mb-6">
                                        <label className="text-xs font-medium mb-1 flex items-center">
                                            <FingerprintIcon sx={{ fontSize: 15 }} className="mr-2 text-primaryBlue" />
                                            Código Dactilar (*)
                                        </label>
                                        <input
                                            type="text"
                                            className="solcitudgrande-style"
                                            name="codigoDactilar"
                                            value={formData.codigoDactilar}
                                            onChange={handleFormChange}
                                            autoComplete="off"
                                        />

                                        {formErrors.codigoDactilar && (
                                            <p className="mt-1 text-sm text-red-500 border-red-500">
                                                {formErrors.codigoDactilar}
                                            </p>
                                        )}
                                    </div>
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

                            <div className="col-span-1">
                                <label className="text-xs font-medium mb-1 flex items-center">
                                    <FaFacebook className="mr-2 text-primaryBlue" />
                                    Facebook
                                </label>
                                <input
                                    type="text"
                                    className="solcitudgrande-style"
                                    name="Facebook"
                                    onChange={handleFormChange}
                                    value={formData.Facebook || ''}
                                />
                                {formErrors.Facebook && (
                                    <p className="mt-1 text-sm text-red-500 border-red-500">
                                        {formErrors.Facebook}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default Datos;