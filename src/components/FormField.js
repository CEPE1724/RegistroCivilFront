import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import { useAuth } from "./AuthContext/AuthContext";
import OTPModal from '../components/SolicitudCredito/SolicitudCreditoForm/OTPModal';
import { APIURL } from "../configApi/apiConfig";
import axios from "../configApi/axiosConfig";
import { useNavigate } from "react-router-dom";
import { Loader } from "../components/Utils/Loader";
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import { MotivoContinuidad } from "../components/ListadoSolicitud";
import { SolicitudExitosa } from "./MensajeSolicitudExitosa/SolicitudExitosa";

const FormField = ({
  label,
  name,
  type = "text",
  formik,
  component: Component,
  options = [],
  onchange,
  hidden,
  previewUrl,
  setPreviewUrl,
  ...props
}) => {

  const { enqueueSnackbar } = useSnackbar();

  const [isBlacklisted, setIsBlacklisted] = useState(false);
  const [mensajeExitoso, setMensajeExitoso] = useState(false);
  const [soliExistente, setSoliExistente] = useState(null)

  if (hidden) {
    return null;
  }

  const handleFileChange = (event) => {

    try {
      const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];
      const file = event.target.files ? event.target.files[0] : null;

      if (!file) return;

      if (!SUPPORTED_FORMATS.includes(file.type)) {
        throw new Error("El archivo debe ser una imagen (JPG, PNG)");
      }

      formik.setFieldValue(name, file);
      setPreviewUrl(URL.createObjectURL(file));
    } catch (error) {
      formik.setFieldError(name, error.message);
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  const comprobTelf = async (telefono) => {
    try {
      const url = APIURL.validarTelefono(telefono);
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error("Error al validar el teléfono:", error);
      return false;
    }
  };

  const comprobcedula = async (cedula) => {
    try {
      const url = APIURL.validarCedula(cedula);
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error("Error al validar el cedula:", error);
      return false;
    }
  };

  const comprobEmail = async (email) => {
    try {
      const url = APIURL.validarEmail(email);
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error("Error al validar el email:", error);
      return false;
    }
  };

  const handleInputChange = async (e) => {
    let { name, value } = e.target;
  

    if (name === "Cedula" || name === "Celular") {
      value = value.replace(/\D/g, "");
      value = value.slice(0, 10);
    }

    if (name === "ApellidoMaterno" || name === "ApellidoPaterno" || name === "PrimerNombre" || name === "SegundoNombre") {
      value = value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, "").toUpperCase();
    }

    // if (name === "CodDactilar") {
    //   value = value.toUpperCase();
    //   value = value.slice(0, 10);
    // }

    if (name === "Celular" && value.length === 10) {
      const existe = await comprobTelf(value);


      if (existe === 1) {
        enqueueSnackbar(`El número ${value} se encuentra en la lista negra`, {
          variant: 'warning'
        });
        setIsBlacklisted(true);
        return;
      } else {
        setIsBlacklisted(false);
      }
    }

    if (name === "Cedula" && value.length === 10) {
      const existe = await comprobcedula(value);

      if (existe === 1) {
        enqueueSnackbar(`La cédula ${value} se encuentra en la lista negra`, {
          variant: 'warning'
        });
        setIsBlacklisted(true);
        return;
      } else {
        // Aquí validamos además la combinación cédula + bodega
        const bodega = formik.values.Bodega; // Asegúrate que este campo exista y se llame así
        if (bodega) {
          const existeCombo = await verificarCedulaBodega(value);
          if (existeCombo) {
           /* enqueueSnackbar(`Ya existe una solicitud con la cédula ${value}`, {
              variant: 'warning'
            });*/
            setMensajeExitoso(true)
            setIsBlacklisted(true);
            return;
          }
        }

        setIsBlacklisted(false);
      }
    }

    // Agregar validación para email
    if (name === "Email" && value.includes('@')) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(value)) {
        const existe = await comprobEmail(value);

        if (existe === 1) {
          enqueueSnackbar(`El email ${value} se encuentra en la lista negra`, {
            variant: 'warning'
          });
          setIsBlacklisted(true);
          return;
        } else {
          setIsBlacklisted(false);
        }
      }
    }

    formik.setFieldValue(name, value);
  };
  const verificarCedulaBodega = async (cedula) => {
    try {
      const response = await axios.get(APIURL.verificarRegistroSolicitud(cedula), {
      });
      setSoliExistente(response.data.solicitud)

      return response.data.existe === true;
    } catch (error) {
      console.error("Error al verificar existencia de solicitud:", error);
      return false; // por defecto, asumir que no existe para no bloquear
    }
  };




  if (type === "button") {
    return (
      <div className="w-full place-items-center mt-8">
        <button
          type="button"
          className="rounded-full hover:shadow-md transition duration-300 ease-in-out group bg-gray-400 text-white border border-white hover:bg-white hover:text-gray-400 hover:border-gray-400 text-xs px-6 py-2.5"
          onClick={props.onClick}
        >
          {label}
        </button>
      </div>
    );
  }



  // Si es un campo de tipo archivo, renderizamos una estructura diferente
  if (type === "file") {
    return (
      <div className="flex flex-col h-full">
        <label htmlFor={name} className="text-sm mb-1">
          {label}
        </label>
        <div className="flex flex-col h-full">
          <label
            htmlFor={name}
            className="rounded-full hover:shadow-md transition duration-300 ease-in-out group bg-primaryBlue text-white border border-white hover:bg-white hover:text-primaryBlue hover:border-primaryBlue text-xs px-6 py-2.5 cursor-pointer inline-block text-center w-full"
          >
            Seleccionar foto
            <input
              id={name}
              name={name}
              type="file"
              onChange={handleFileChange}
              onBlur={formik.handleBlur}
              className="hidden"
              accept="image/*"
              {...props}
            />
          </label>
          {previewUrl && (
            <div className="mt-4 flex justify-center">
              <div className="w-40 h-45">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-md border"
                />
              </div>
            </div>
          )}
        </div>
        {formik.errors[name] && formik.touched[name] && (
          <p className="text-red-500 text-xs mt-1">{formik.errors[name]}</p>
        )}
      </div>
    );
  }

  return (

    <div className="py-2 w-full">

      <label htmlFor={name} className="text-sm block mb-1">
        {label}
      </label>


      {Component ? (
        <Component
          {...props}
          onLocationSelect={(location) => formik.setFieldValue(name, location)}
        />
      ) : type === "select" ? (
        <select
          id={name}
          name={name}
          onChange={(e) => {
            formik.handleChange(e);
            if (onchange) onchange(e.target.value);
          }}
          onBlur={formik.handleBlur}
          value={formik.values[name]}
          className="block bg-[#F9FAFB] w-64 max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
          {...props}
        >
          <option value="">
            Selecciona una opción
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : type === "checkbox" ? (
        <input
          id={name}
          name={name}
          type="checkbox"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          checked={formik.values[name]}
          className="mr-2"
          {...props}
        />
      ) : type === "switch" ? (
        <div className="flex items-center gap-2">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              id={name}
              name={name}
              type="checkbox"
              className="sr-only peer"
              onChange={(e) => formik.setFieldValue(name, e.target.checked)}
              onBlur={formik.handleBlur}
              checked={formik.values[name]}
              {...props}
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          onChange={handleInputChange}
          onBlur={formik.handleBlur}
          value={formik.values[name]}
          className="block bg-[#F9FAFB] w-64 max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
          {...props}
        />
      )}

      {formik.errors[name] && formik.touched[name] && (
        <p className="text-red-500 text-xs mt-1">{formik.errors[name]}</p>
      )}

      <SolicitudExitosa
        isOpen={mensajeExitoso}
        onClose={() => setMensajeExitoso(false)}
        titulo={`¡TIENES UNA SOLICITUD DE CRÉDITO ACTIVA!`}
        subtitulo={`Por favor completa la solicitud de crédito que el cliente ya tiene activa.`}
        li1={`Cliente ${`${soliExistente?.PrimerNombre} ${soliExistente?.ApellidoPaterno}`} con cedula ${soliExistente?.Cedula}`}
        li2={`Números de solicitud: ${soliExistente?.NumeroSolicitud} `}
        color={'bg-red-100'}
        ruta={`/solicitud`}
      />
    </div>
  );
};

const ReusableForm = ({
  initialValues,
  formConfig,
  validationSchema,
  onSubmit,
  includeTermsAndConditions = false,
  includeButtons = false,
  submitButtonText = "Enviar",
  cancelButtonText = "Cancelar",
  returnButtonText = "Regresar",
  loading = false,
  onCancel,
  columns = 1,
  formStatus,
  onExternalUpdate,
  soliGrande,
  creSoliWeb
}) => {

  const navigate = useNavigate();
  const { userData } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false); // Estado para controlar la apertura del modal de OTP
  const [isOtpVerified, setIsOtpVerified] = useState(false); // Estado para verificar si el OTP es válido
  const [dataMotivos, setDataMotivos] = useState([]);
  const [dataInforme, setDataInforme] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const [isOpenMotivo, setIsOpenMotivo] = useState(false);
  // captura a valores de inicialValues
  // Inicializar valores por defecto para campos select
  const selectDefaults = Object.fromEntries(
    formConfig
      .filter((field) => field.type === "select")
      .map((field) => [field.name, ""])
  );
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [mensajeExitoso, setMensajeExitoso] = useState(false)




  useEffect(() => {
    if (initialValues) {
      if (initialValues.idVendedor) {
        verificarMotivosPendientes(initialValues.idVendedor);
      }
    }

  }, [initialValues, isOpenMotivo]);

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      //   if (isOtpVerified) {
      // setIsSubmitting(true);
      // try {
      //   await onSubmit(values);
      // } catch (error) {
      //   enqueueSnackbar("Error al enviar el formulario", { variant: "error" });
      //   console.error("Error en envío:", error);
      // } finally {
      //   setIsSubmitting(false);
      // }
      //   } else {
      // Si el OTP no es verificado, muestra el modal

      setIsButtonDisabled(true)
      //requestOtp();
      handleOtpVerification(true);
      //setIsOtpModalOpen(true);
      //   }
    },
  });

  useEffect(() => {
    if (onExternalUpdate) {
      onExternalUpdate(formik);
    }
  }, [onExternalUpdate]);

  const requestOtp = async () => {
    if (isButtonDisabled) return;
    try {
      const url = APIURL.generateOTP();
      const response = await axios.post(url, {
        phoneNumber: formik.values.Celular,
        email: formik.values.Email,
        nombreCompleto: `${formik.values.PrimerNombre || ''} ${formik.values.SegundoNombre || ''} ${formik.values.ApellidoPaterno || ''} ${formik.values.ApellidoMaterno || ''}`.trim(),
        cedula: formik.values.Cedula,
        bodega: formik.values.Bodega
      });

      if (response.data.success) {
        setIsOtpModalOpen(true);
      } else {
        setIsButtonDisabled(false)
        alert(response.data.message || "No se pudo generar el OTP");
      }
    } catch (error) {
      console.error(error);
      setIsButtonDisabled(false)
      alert('Hubo un error al generar el OTP');
    }
  };


  // Sistema unificado para mostrar el primer error en el submit
  const showFirstError = () => {
    const errorKeys = Object.keys(formik.errors);

    if (errorKeys.length > 0) {
      const firstErrorKey = errorKeys[0];
      const errorMessage = formik.errors[firstErrorKey];

      enqueueSnackbar(errorMessage, {
        variant: "error",
        preventDuplicate: true
      });

      // Marcar como tocado para que se muestre visualmente
      formik.setFieldTouched(firstErrorKey, true);
    }
  };

  //   Reset del formulario cuando status es success
  //   useEffect(() => {
  //     formik.resetForm();
  //   }, [isOtpVerified]);

  const handleCancel = () => {
    setIsCanceling(true);
    formik.resetForm();
    setPreviewUrl(null);
    if (onCancel) onCancel();
    setTimeout(() => setIsCanceling(false), 1000);
  };

  //   const handleOtpVerification = (isVerified) => {
  //     setIsOtpVerified(isVerified);
  //     setIsOtpModalOpen(false); // Cerrar el modal después de la verificación del OTP
  //   };

  const handleOtpVerification = async (isVerified, otpCode = null) => {
    if (isVerified) {
      //   let otpCodeString = String(otpCode);
      //   // Se asigna el OTP al objeto de Formik
      //   formik.values.otp_code = otpCodeString;

      if (otpCode) {
        formik.values.otp_code = String(otpCode);
      }

      setIsSubmitting(true);
      try {
        await onSubmit(formik.values);
        // Espera 2 segundos para que el loader se muestre
        await new Promise((resolve) => setTimeout(resolve, 2000));
        formik.resetForm();
        setPreviewUrl(null);
        setMensajeExitoso(true)
        // setTimeout(() => {
        // 	navigate("/ListadoSolicitud", { replace: true });
        // }, 20000);

      } catch (error) {
        enqueueSnackbar("Error al enviar el formulario", { variant: "error" });
        console.error("Error en envío:", error);
        setIsButtonDisabled(false)
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsButtonDisabled(false)
    }
    setIsOtpModalOpen(false);
    setIsOtpVerified(isVerified);
  };

  const verificarMotivosPendientes = async (vendedor) => {
    try {
      const response = await axios.get(APIURL.get_Count_get_motivosContinuidad(vendedor));
      const { totalCount, data } = response.data;
      if (totalCount > 0) {

        setDataMotivos(response.data);
      } else {

        setDataMotivos({
          totalCount: 0,
          data: []
        });

      }
    } catch (error) {
      console.error("Error al verificar motivos pendientes:", error);
      enqueueSnackbar("Error al verificar motivos pendientes", { variant: "error" });
      setDataMotivos({
        totalCount: 0,
        data: []
      });
    }
  };


  // Separar el campo de archivo y otros campos
  const fileField = formConfig.find((field) => field.type === "file");
  const otherFields = formConfig.filter((field) => field.type !== "file");
  return (
    <div className="relative">
      {isSubmitting && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75">
          <Loader />
        </div>
      )}

      {parseInt(dataMotivos.totalCount) > 0 && (
        <>
          <label className="text-lg font-semibold text-primaryBlue mb-4">
            <span className="text-red-500 ml-2">
              Pendientes de Ingresar el motivo de continuidad {dataMotivos.totalCount} motivo(s) pendiente(s)
            </span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {dataMotivos.data && dataMotivos.data.map((motivo, idx) => (
              <div key={idx} className="bg-white shadow-md rounded-lg p-4 mb-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                      {motivo.NumeroSolicitud}
                    </span>
                    <span className="text-gray-500 text-sm">({new Date(motivo.Fecha).toLocaleDateString()})</span>
                  </div>
                  <div className="text-xs text-gray-400">🕒 {new Date(motivo.Fecha).toLocaleTimeString()}</div>
                </div>

                <div className="flex items-center gap-3">

                  <div className="text-sm text-gray-800">
                    <div><strong>Cédula:</strong> {motivo.Cedula}</div>
                  </div>
                  <button
                    onClick={() => {
                      setIsOpenMotivo(true);
                      setDataInforme({
                        id: motivo.idCre_SolicitudWeb,
                        PrimerNombre: motivo.PrimerNombre,
                        SegundoNombre: motivo.SegundoNombre,
                        ApellidoPaterno: motivo.ApellidoPaterno,
                        ApellidoMaterno: motivo.ApellidoMaterno,
                        cedula: motivo.Cedula,
                        NumeroSolicitud: motivo.NumeroSolicitud,
                        Fecha: motivo.Fecha,
                      });
                    }}
                    className="bg-pink-100 text-pink-800 hover:bg-pink-200 hover:text-pink-900 transition-all duration-200 rounded-full p-2"
                  >
                    <NoteAltIcon className="text-pink-800" />
                  </button>
                </div>
              </div>

            ))}
          </div>
        </>
      )}
      {Number(dataMotivos?.totalCount) === 0 && (
        <form
          className="w-full bg-white p-4 rounded-lg grid"
          onSubmit={(e) => {
            e.preventDefault();
            // Validar y mostrar el primer error si hay alguno
            formik.validateForm().then((errors) => {
              if (Object.keys(errors).length > 0) {
                formik.setTouched(
                  Object.keys(errors).reduce((acc, key) => ({ ...acc, [key]: true }), {}),
                  false
                );
                showFirstError();
              } else {
                formik.handleSubmit(e);
              }
            });
          }}
        >
          <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
            {fileField && (
              <div className="md:col-span-1 order-2 md:order-1">
                <div className="w-30">
                  <FormField
                    key={fileField.name}
                    {...fileField}
                    formik={formik}
                    previewUrl={previewUrl}
                    setPreviewUrl={setPreviewUrl}
                  />
                </div>
              </div>
            )}

            <div
              className={`grid gap-4 order-1 md:order-2 ${fileField ? "md:col-span-3" : "md:col-span-4"
                } ${columns === 2
                  ? "grid-cols-1 md:grid-cols-2"
                  : columns === 3
                    ? "grid-cols-1 md:grid-cols-3"
                    : columns === 4
                      ? "grid-cols-1 md:grid-cols-4"
                      : "grid-cols-1"
                }`}
            >
              {otherFields.map((field) => (
                <FormField key={field.name} {...field} formik={formik} />
              ))}
            </div>
          </div>

          {/* Términos y condiciones */}
          {includeTermsAndConditions && (
            <div className="flex justify-center gap-4 mt-4 mb-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="bTerminosYCondiciones"
                  id="bTerminosYCondiciones"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  checked={formik.values.bTerminosYCondiciones}
                  className="text-fontRed accent-fontRed rounded"
                />
                <label htmlFor="bTerminosYCondiciones" className="text-lightGrey text-xs">
                  Acepto los{" "}
                  <a
                    href="https://point.com.ec/terminos-y-condiciones"
                    className="underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    términos y condiciones
                  </a>
                </label>
              </div>
              {formik.errors.bTerminosYCondiciones &&
                formik.touched.bTerminosYCondiciones && (
                  <p className="text-red-500 text-xs mt-1 text-center">
                    {formik.errors.bTerminosYCondiciones}
                  </p>
                )}

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="bPoliticas"
                  id="bPoliticas"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  checked={formik.values.bPoliticas}
                  className="text-fontRed accent-fontRed rounded"
                />
                <label htmlFor="bPoliticas" className="text-lightGrey text-xs">
                  Acepto las{" "}
                  <a
                    href="https://point.com.ec/politicas-de-privacidad"
                    className="underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    políticas de privacidad
                  </a>
                </label>
              </div>
              {formik.errors.bPoliticas && formik.touched.bPoliticas && (
                <p className="text-red-500 text-xs mt-1 text-center">
                  {formik.errors.bPoliticas}
                </p>
              )}
            </div>
          )}

          {/*boton enviar */}
          {includeButtons && (
            <div className="py-2 flex justify-center gap-2">
              <button
                type="submit"
                className="rounded-full hover:shadow-md transition duration-300 ease-in-out group bg-primaryBlue text-white border border-white hover:bg-white hover:text-primaryBlue hover:border-primaryBlue text-xs px-6 py-2.5"
                disabled={isButtonDisabled}
              >
                {isSubmitting ? <Loader /> : submitButtonText}
              </button>
              <button
                type="button"
                className="rounded-full hover:shadow-md transition duration-300 ease-in-out group bg-gray-400 text-white border border-white hover:bg-white hover:text-gray-400 hover:border-gray-400 text-xs px-6 py-2.5"
                onClick={handleCancel}
                disabled={isCanceling}
              >
                {isCanceling ? "Cancelando..." : cancelButtonText}
              </button>
              <button
                type="submit"
                className="rounded-full hover:shadow-md transition duration-300 ease-in-out group bg-primaryBlue text-white border border-white hover:bg-white hover:text-primaryBlue hover:border-primaryBlue text-xs px-6 py-2.5"
                onClick={() => navigate("/ListadoSolicitud", { replace: true })}
              >
                {returnButtonText}
              </button>
            </div>
          )}
          {
            <OTPModal
              isOpen={isOtpModalOpen}
              onClose={() => { setIsOtpModalOpen(false); setIsButtonDisabled(false) }}
              onVerifyOtp={handleOtpVerification}
              phoneNumberOTP={formik.values.Celular}
            />
          }
        </form>
      )}


      <MotivoContinuidad isOpen={isOpenMotivo} onClose={() => setIsOpenMotivo(false)} data={dataInforme} userData={userData} />

      <SolicitudExitosa
        isOpen={mensajeExitoso}
        onClose={() => setMensajeExitoso(false)}
        soliGrande={soliGrande}
        creSoliWeb={creSoliWeb}
        titulo={`¡TU SOLICITUD DE CRÉDITO HA SIDO CREADA CON ÉXITO!`}
        subtitulo={`Ahora puedes revisar el estado de tu solicitud de crédito.`}
        color={creSoliWeb?.Estado == 1 ? 'bg-green-100' : 'bg-gray-100'}
        li1={creSoliWeb?.Estado == 1 ? `Cliente ${`${creSoliWeb?.PrimerNombre} ${creSoliWeb?.ApellidoPaterno}`} con cedula ${creSoliWeb?.Cedula}` : ''}
        li2={creSoliWeb?.Estado == 1 ? `Numero de solicitud: ${soliGrande?.data.NumeroSolicitud}` : ''}
        li3={creSoliWeb?.Estado == 1 ? `Cuota:${soliGrande?.data.CuotaAsignada} y Cupo: ${soliGrande?.data.Cupo}` : ''}
        ruta={'/ListadoSolicitud'}
      />

    </div>

  );

};

export default ReusableForm;