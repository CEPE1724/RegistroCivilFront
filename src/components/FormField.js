// fromfield

import React, { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import OTPModal from '../components/SolicitudCredito/SolicitudCreditoForm/OTPModal';
import { APIURL } from "../configApi/apiConfig";
import axios from "axios";

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

  if (hidden) {
    return null;
  }

  const handleFileChange = (event) => {
	console.log(event.target.files);
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

  const handleInputChange = (e) => {
    let { name, value } = e.target;

    if (name === "Cedula" || name === "Celular") {
      value = value.replace(/\D/g, "");
      value = value.slice(0, 10);
    }

    if (name === "ApellidoMaterno" || name === "ApellidoPaterno" || name === "PrimerNombre" || name === "SegundoNombre") {
      value = value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, "").toUpperCase();
    }

    if (name === "CodDactilar") {
      value = value.toUpperCase();
      value = value.slice(0, 10);
    }

    formik.setFieldValue(name, value);
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
  loading = false,
  onCancel,
  columns = 1,
  formStatus,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false); // Estado para controlar la apertura del modal de OTP
  const [isOtpVerified, setIsOtpVerified] = useState(false); // Estado para verificar si el OTP es válido
  const { enqueueSnackbar } = useSnackbar();

  // Inicializar valores por defecto para campos select
  const selectDefaults = Object.fromEntries(
    formConfig
      .filter((field) => field.type === "select")
      .map((field) => [field.name, ""])
  );

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema,
    onSubmit: async (values) => {
		console.log(values);
    //   if (isOtpVerified) {
        // setIsSubmitting(true);
        // try {
        //   await onSubmit(values);
		//   console.log(values);
        // } catch (error) {
        //   enqueueSnackbar("Error al enviar el formulario", { variant: "error" });
        //   console.error("Error en envío:", error);
        // } finally {
        //   setIsSubmitting(false);
        // }
    //   } else {
        // Si el OTP no es verificado, muestra el modal

       requestOtp();
        //setIsOtpModalOpen(true);
    //   }
    },
  });

  
  const requestOtp = async () => {
    try {
      const url = APIURL.generateOTP();
      const response = await axios.post(url, {
        phoneNumber: formik.values.Celular,
      });

      if (response.data.success) {
        setIsOtpModalOpen(true);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error(error);
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

const handleOtpVerification = async (isVerified) => {
	if (isVerified) {
	  setIsSubmitting(true);
	  try {
		await onSubmit(formik.values);
		console.log("Datos enviados:", formik.values);
	
		formik.resetForm();
		setPreviewUrl(null);
	  } catch (error) {
		enqueueSnackbar("Error al enviar el formulario", { variant: "error" });
		console.error("Error en envío:", error);
	  } finally {
		setIsSubmitting(false);
	  }
	}
	setIsOtpModalOpen(false);
	setIsOtpVerified(isVerified);
  };

  // Separar el campo de archivo y otros campos
  const fileField = formConfig.find((field) => field.type === "file");
  const otherFields = formConfig.filter((field) => field.type !== "file");

  return (
    <form
      className="w-full bg-white p-4 rounded-lg grid"
      onSubmit={(e) => {
        e.preventDefault();
        // Validar y mostrar el primer error si hay alguno
        formik.validateForm().then(errors => {
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
            <label
              htmlFor="bTerminosYCondiciones"
              className="text-lightGrey text-xs"
            >
              Acepto los{" "}
              <a
                href="/terminos-y-condiciones"
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
                href="/politicas-de-privacidad"
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

      {includeButtons && (
        <div className="py-2 flex justify-center gap-2">
          <button
            type="submit"
            className="rounded-full hover:shadow-md transition duration-300 ease-in-out group bg-primaryBlue text-white border border-white hover:bg-white hover:text-primaryBlue hover:border-primaryBlue text-xs px-6 py-2.5"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enviando..." : submitButtonText}
          </button>
          <button
            type="button"
            className="rounded-full hover:shadow-md transition duration-300 ease-in-out group bg-gray-400 text-white border border-white hover:bg-white hover:text-gray-400 hover:border-gray-400 text-xs px-6 py-2.5"
            onClick={handleCancel}
            disabled={isCanceling}
          >
            {isCanceling ? "Cancelando..." : cancelButtonText}
          </button>
        </div>
      )}
      {<OTPModal
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
        onVerifyOtp={handleOtpVerification}
        phoneNumberOTP = {formik.values.Celular}
      />}
    </form>
  );
};

export default ReusableForm;