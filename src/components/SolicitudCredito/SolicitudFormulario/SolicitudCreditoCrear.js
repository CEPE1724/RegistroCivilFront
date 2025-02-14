import React, { useState, useEffect } from "react";
import { TextField, Button, Checkbox, FormControlLabel, FormHelperText } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete"; // Icono de borrar
import { APIURL } from "../../../configApi/apiConfig";
import { useSnackbar } from "notistack";
export const SolicitudCreditoCrear = () => {
    const [cedula, setCedula] = useState("");
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [codigoDactilar, setCodigoDactilar] = useState("");
    const [telefonoCelular, setTelefonoCelular] = useState("");
    const [errorCedula, setErrorCedula] = useState("");
    const [errorCodigo, setErrorCodigo] = useState("");
    const [errorTelefonoCelular , setErrorTelefonoCelular] = useState("");
    const [errorNombre, setErrorNombre] = useState("");
    const [errorApellido, setErrorApellido] = useState("");
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [errorTerms, setErrorTerms] = useState("");
    const [photo, setPhoto] = useState(null); // Estado para la foto
    const [photoPreview, setPhotoPreview] = useState(null); // Estado para la vista previa de la foto
    const [isFormValid, setIsFormValid] = useState(false); // Estado para verificar la validez del formulario
    const [showPreview, setShowPreview] = useState(false); // Estado para mostrar la vista previa de los datos
    const [formData, setFormData] = useState(null); // Estado para almacenar los datos del formulario cuando se actualiza
    const [userIP, setUserIP] = useState(""); // Estado para almacenar la IP del usuario
     const { enqueueSnackbar } = useSnackbar();
     const [isLoading, setIsLoading] = useState(false); // Controlar el estado de carga

    // Función para obtener la IP del usuario
    const fetchUserIP = async () => {
        try {
            const response = await fetch("https://api.ipify.org?format=json");
            const data = await response.json();
            setUserIP(data.ip); // Guardar la IP del usuario
        } catch (error) {
            console.error("Error al obtener la IP:", error);
        }
    };

    useEffect(() => {
        fetchUserIP(); // Obtener la IP del usuario al cargar el componente
    }, []);

    // Función para validar cédula
    const validateCedula = (value) => {
        // Expresión regular para validar que la cédula tenga exactamente 10 dígitos numéricos
        const cedulaRegex = /^[0-9]{10}$/;
    
        // Comprobar si el valor de la cédula cumple con el formato de 10 dígitos
        if (cedulaRegex.test(value)) {
            // Extraemos los primeros dos dígitos y el tercer dígito
            const firstTwoDigits = parseInt(value.slice(0, 2), 10);
            const thirdDigit = parseInt(value.charAt(2), 10);
    
            // Validación adicional para los primeros dos dígitos (pueden representar una provincia o código específico)
            if (firstTwoDigits >= 0 && firstTwoDigits <= 24) {
                // Validación del tercer dígito, que debe estar en el rango de 1 a 6
                if (thirdDigit >= 0 && thirdDigit <= 6) {
                    setErrorCedula(""); // Cédula válida
                } else {
                    setErrorCedula("El tercer dígito debe estar entre 1 y 6.");
                }
            } else {
                setErrorCedula("El primer segmento de la cédula debe estar entre 00 y 24.");
            }
        } else {
            setErrorCedula("La cédula debe tener 10 dígitos numéricos.");
        }
    };
    

    // Función para validar nombre
    const validateNombre = (value) => {
        if (!value.trim()) {
            setErrorNombre("El nombre es obligatorio");
        } else {
            setErrorNombre("");
        }
    };

    // Función para validar apellido
    const validateApellido = (value) => {
        if (!value.trim()) {
            setErrorApellido("El apellido es obligatorio");
        } else {
            setErrorApellido("");
        }
    };

    // Función para validar código dactilar
    const validateCodigoDactilar = (value) => {
        const regex = /^[A-Z]{1}[0-9]{4}[A-Z]{1}[0-9]{4}$/;
        if (regex.test(value)) {
            setErrorCodigo(""); // Código válido
        } else {
            setErrorCodigo("Código dactilar no válido. Formato: A1234B5678");
        }
    };

    const validateTelefonoCelular = (value) => {
        const regex = /^09[1-9]{1}[0-9]{7}$/; // Valida que el número comience con "09" y luego tenga un dígito entre 1-9 seguido de 7 dígitos
        if (regex.test(value)) {
            setErrorTelefonoCelular(""); // Código válido
        } else {
            setErrorTelefonoCelular("Número de celular no válido. Formato: 09XXXXXXXX");
        }
    };
    

    // Funciones para manejar cambios en los campos
    const handleCedulaChange = (e) => {
        const value = e.target.value;
        setCedula(value);
        validateCedula(value); // Validar cédula
    };

    const handleNombreChange = (e) => {
        const value = e.target.value;
        setNombre(value);
        validateNombre(value); // Validar nombre
    };

    const handleApellidoChange = (e) => {
        const value = e.target.value;
        setApellido(value);
        validateApellido(value); // Validar apellido
    };

    const handleCodigoDactilarChange = (e) => {
        const value = e.target.value.toUpperCase(); // Convertir a mayúsculas
        setCodigoDactilar(value);
        validateCodigoDactilar(value); // Validar código dactilar
    };

    const handleTelefonoCelularChange = (e) => {
        const value = e.target.value;
        setTelefonoCelular(value);
        validateTelefonoCelular(value); // Validar telefono celular
    };

    const handleCheckboxChange = (e) => {
        setAcceptedTerms(e.target.checked);
        if (e.target.checked) {
            setErrorTerms(""); // Limpiar error si acepta los términos
        }
    };

    // Función para manejar la carga de la foto
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhoto(file);
            setPhotoPreview(URL.createObjectURL(file)); // Crear la vista previa de la imagen
        }
    };

    // Función para eliminar la foto cargada
    const handleDeletePhoto = () => {
        setPhoto(null);
        setPhotoPreview(null);
    };

    // Función para validar el formulario y activar el botón
    useEffect(() => {
        if (
            cedula &&
            nombre &&
            apellido &&
            codigoDactilar &&
            telefonoCelular &&
            !errorCedula &&
            !errorNombre &&
            !errorApellido &&
            !errorCodigo &&
            !errorTelefonoCelular &&
            photo &&
            acceptedTerms
        ) {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        }
    }, [cedula, nombre, apellido, codigoDactilar,telefonoCelular , errorCedula, errorNombre, errorApellido, errorCodigo, photo, acceptedTerms, errorTelefonoCelular]);

    // Función para manejar la actualización de la vista previa
    const handleUpdateClick = () => {
        setFormData({
            cedula,
            nombre,
            apellido,
            codigoDactilar,
            photoPreview,
            userIP,
            telefonoCelular
        });
        setShowPreview(true); // Mostrar la vista previa
    };

    // Función para subir la imagen
    const subirImg = async () => {
        // Verificar si se ha seleccionado una imagen
        if (!photo) {
            alert('Por favor, selecciona una imagen antes de subir.');
            return;
        }
    
        // Asegurarse de que 'cedula' esté definido
        if (!cedula) {
            alert('Por favor, ingresa una cédula válida.');
            return;
        }
    
        // Verificar que el 'docName' (nombre_del_archivo) también esté disponible
        const docName = "ProteccionDatos";  // Aquí se usa un nombre de archivo fijo, puedes cambiarlo si es necesario
    
        // Obtener la URL del API (debe retornar la URL correcta de tu servidor)
        const url = `${APIURL.putUploadPdf()}`;
        // Crear un objeto FormData para enviar la imagen como archivo
        const formData = new FormData();
        formData.append("cedula", cedula);  // Asegúrate de tener la cédula definida
        formData.append("nombre_del_archivo", docName);  // El nombre del archivo
        formData.append("file", photo);  // El archivo de imagen
        formData.append("Celular", telefonoCelular);  // La IP del usuario
    
        try {
            // Enviar la solicitud de subida de la imagen
            const response = await fetch(url, {
                method: "PUT",
                body: formData, // Enviar el FormData directamente
            });
    
            if (response.ok) {
                const data = await response.json(); // Parsear la respuesta JSON
                // Retornar la respuesta completa, lo que puedes usar para manejar la URL del archivo
                return data;  // Esto retorna la URL de la imagen subida
            } else {
                alert("Hubo un error al subir la imagen. Por favor intente de nuevo.");
    
                // Retornar un mensaje de error en caso de que no sea exitosa la subida
                return { message: "Error al subir la imagen" };
            }
        } catch (error) {
            alert("Error al procesar la solicitud.");
            // Retornar el error en caso de excepción
            return { message: "Error al procesar la solicitud", error: error.message };
        }
    };
    

    // Función para manejar la aceptación del formulario
    const handleAccept = async () => {
        // Primero, subir la imagen y obtener la URL
        setIsLoading(true);
        const data = await subirImg();
        // Si la imagen fue subida con éxito, continuar con el envío del formulario
        if (data.url) {
            const url = `${APIURL.postinst()}`;

            try {
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json", // Establecer Content-Type para JSON
                        "Accept": "application/json", // Indicar que aceptamos una respuesta en formato JSON
                    },
                    body: JSON.stringify({
                        Cedula: cedula,
                        Nombre: nombre,
                        Apellido: apellido,
                        CodigoDactilar: codigoDactilar,
                        IpWeb: userIP,
                        UrlImagen: data.url, // Utilizar la URL de la imagen subida
                        Celular : telefonoCelular
                    }),
                });

                if (response.ok) {
                    const formData = await response.json();
                    //alert("Formulario enviado con éxito.");

                    enqueueSnackbar("Formulario enviado con éxito.", {
                        variant: "success",
                        autoHideDuration: 4000,
                      });
                    setShowPreview(false); // Ocultar la vista previa

                    // Resetear el formulario si es necesario
                    setCedula("");
                    setNombre("");
                    setApellido("");
                    setCodigoDactilar("");
                    setTelefonoCelular("");
                    setPhoto(null);
                    setPhotoPreview(null);
                    setAcceptedTerms(false);
                    setIsLoading(false);
                } else {
                    console.error("Error al enviar el formulario", response.statusText);
                    alert("Hubo un error al enviar el formulario. Por favor intente de nuevo.");
                    setIsLoading(false);
                }
            } catch (error) {
                console.error("Error al enviar el formulario:", error);
                alert("Error al procesar la solicitud.");
                setIsLoading(false);
            }
        } else {
            // Si la imagen no se subió correctamente, mostrar el mensaje de error
            alert("No se pudo subir la imagen. Por favor intente de nuevo.");
            setIsLoading(false);
        }
    };


    const handleCancel = () => {
        setShowPreview(false); // Volver al formulario sin guardar
    };

    return (
        <>
            <section className="mt-3 flex justify-center items-center min-h-screen bg-gray-100">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl flex flex-col lg:flex-row">
                    {/* Formulario de SolicitudCreditoCrear */}
                    <div className="w-full max-w-md mr-0 lg:mr-4 mb-6 lg:mb-0">
                        <h2 className="text-xl font-semibold mb-4 text-center">Solicitud de crédito</h2>
                        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                            {/* Campo Cédula */}
                            <div>
                                <TextField
                                    label="Cédula"
                                    variant="outlined"
                                    fullWidth
                                    value={cedula}
                                    onChange={handleCedulaChange}
                                    inputProps={{ maxLength: 10 }} // Solo 10 dígitos
                                    error={Boolean(errorCedula)}
                                    helperText={errorCedula || "Ingresa solo números"}
                                />
                            </div>

                            {/* Campo Nombre */}
                            <div>
                                <TextField
                                    label="Nombre"
                                    variant="outlined"
                                    fullWidth
                                    value={nombre}
                                    onChange={handleNombreChange}
                                    error={Boolean(errorNombre)}
                                    helperText={errorNombre || "Ingresa tu nombre"}
                                />
                            </div>

                            {/* Campo Apellido */}
                            <div>
                                <TextField
                                    label="Apellido"
                                    variant="outlined"
                                    fullWidth
                                    value={apellido}
                                    onChange={handleApellidoChange}
                                    error={Boolean(errorApellido)}
                                    helperText={errorApellido || "Ingresa tu apellido"}
                                />
                            </div>

                            {/* Campo Código Dactilar */}
                            <div>
                                <TextField
                                    label="Código Dactilar"
                                    variant="outlined"
                                    fullWidth
                                    value={codigoDactilar}
                                    onChange={handleCodigoDactilarChange}
                                    error={Boolean(errorCodigo)}
                                    helperText={errorCodigo || "Formato: A1234B5678"}
                                />
                            </div>

                            <div>
                                <TextField
                                    label="Telefono Celular"
                                    variant="outlined"
                                    fullWidth
                                    value={telefonoCelular}
                                    onChange={handleTelefonoCelularChange}
                                    error={Boolean(errorTelefonoCelular)}
                                    helperText={errorTelefonoCelular || "Formato: 0903375199"}
                                />
                            </div>

                            {/* Campo Foto */}
                            <div>
                                <input type="file" onChange={handleFileChange} />
                            </div>

                            {/* Checkbox de aceptación de términos */}
                            <div className="flex items-center">
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={acceptedTerms}
                                            onChange={handleCheckboxChange}
                                            name="acceptedTerms"
                                            color="primary"
                                        />
                                    }
                                    label={
                                        <>
                                            Al dar click en autorizar usted habrá aceptado los{" "}
                                            <a
                                                href="https://point.com.ec/terminos-y-condiciones"
                                                target="_blank"
                                                className="font-bold text-blue-600 hover:underline"
                                            >
                                                términos y condiciones
                                            </a>{" "}
                                            y las{" "}
                                            <a
                                                href="https://point.com.ec/politicas-de-privacidad"
                                                target="_blank"
                                                className="font-bold text-blue-600 hover:underline"
                                            >
                                                políticas de privacidad
                                            </a>.
                                        </>
                                    }
                                />
                            </div>
                            {errorTerms && <FormHelperText error>{errorTerms}</FormHelperText>}

                            {/* Botón de actualizar */}
                            <div className="flex justify-center">
                                <Button
                                    type="button"
                                    variant="contained"
                                    color="primary"
                                    className="w-full"
                                    onClick={handleUpdateClick}
                                    disabled={!isFormValid}
                                >
                                    AUTORIZAR
                                </Button>
                            </div>
                        </form>
                    </div>

                    {/* Recuadro con la foto */}
                    <div className="w-full max-w-sm">
                        <div className="border-2 border-gray-300 p-4 rounded-lg flex justify-center items-center">
                            {!photoPreview ? (
                                <span className="text-gray-500">Vista previa de la foto</span>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        onClick={handleDeletePhoto}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <DeleteIcon />
                                    </button>
                                    <img
                                        src={photoPreview}
                                        alt="Vista previa de la foto"
                                        className="max-w-full h-auto rounded-lg"
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Vista previa con botones Aceptar / Cancelar */}
            {showPreview && (
              <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex justify-center items-center z-50">
              <div className="bg-morado p-8 rounded-lg shadow-2xl w-96 max-w-lg">
                  <h3 className="text-2xl text-white font-semibold mb-6 text-center">Point Technology</h3>
          
                  <div className="space-y-4 text-white">
                      <p className="text-lg"><strong>Cédula:</strong> {formData?.cedula}</p>
                      <p className="text-lg"><strong>Nombre:</strong> {formData?.nombre}</p>
                      <p className="text-lg"><strong>Apellido:</strong> {formData?.apellido}</p>
                      <p className="text-lg"><strong>Código Dactilar:</strong> {formData?.codigoDactilar}</p>
                      <p className="text-lg"><strong>Telefono Celular:</strong> {formData?.telefonoCelular}</p>
                      
                      {formData?.photoPreview && (
                          <div className="flex justify-center mt-4">
                              <img
                                  src={formData?.photoPreview}
                                  alt="Vista previa"
                                  className="w-32 h-32 object-cover rounded-full border-4 border-white"
                              />
                          </div>
                      )}
                  </div>
          
                  <p className="mt-4 text-center text-white font-semibold text-sm">
                      <span className="font-bold text-yellow-300">¡Atención!</span> 
                      Esta información se está enviando en cumplimiento con la Ley de Protección de Datos Personales. 
                      ¿Está seguro de proceder con la acción?
                  </p>
          
                  <div className="flex justify-between mt-6">
                      <Button
                          variant="contained"
                          color="primary"
                          className="bg-teal-500 hover:bg-teal-600 text-white w-full sm:w-auto"
                          onClick={handleAccept}
                          disabled={isLoading} 
                      >
                          {isLoading ? 'Cargando...' : 'Aceptar'}
                      </Button>
                      <Button
                          variant="outlined"
                          color="secondary"
                          className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white w-full sm:w-auto mt-4 sm:mt-0"
                          onClick={handleCancel}
                          disabled={isLoading} 
                      >
                          Cancelar
                      </Button>
                  </div>
              </div>
          </div>            )}

            <footer className="py-4 bg-morado text-white text-center">
                <div className="container mx-auto">
                    <p className="text-sm">&copy; Todos los derechos reservados® POINT 2025.</p>
                </div>
            </footer>
        </>
    );
};

