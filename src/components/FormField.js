import React, { useState } from "react";
import { useFormik } from "formik";

const FormField = ({
  label,
  name,
  type = "text",
  formik,
  component: Component,
  options = [],
  onchange,
  ...props
}) => {
  const [preview, setPreview] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    formik.setFieldValue(name, file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

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
            Seleccionar archivo
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
          {preview && (
            <div className="mt-4 flex justify-center">
              <div className="w-40 h-45">
                <img 
                  src={preview} 
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
        <Component {...props} onLocationSelect={(location) => formik.setFieldValue(name, location)} />
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
          <option value="" disabled>
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
          onChange={formik.handleChange}
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
}) => {
  const formik = useFormik({ initialValues, validationSchema, onSubmit });

  const fileField = formConfig.find((field) => field.type === "file");
  const otherFields = formConfig.filter((field) => field.type !== "file");

  return (
    <form
      className="w-full bg-white p-4 rounded-lg grid"
      onSubmit={(e) => {
        e.preventDefault();
        console.log("Formik errors:", formik.errors);
        console.log("Formik values:", formik.values);
        formik.handleSubmit(e);
      }}
    >
      <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
        {fileField && (
          <div className="md:col-span-1 order-2 md:order-1">
            <div className="w-30">
              <FormField key={fileField.name} {...fileField} formik={formik} />
            </div>
          </div>
        )}

        <div
          className={`grid gap-4 order-1 md:order-2 ${
            fileField ? "md:col-span-3" : "md:col-span-4"
          } ${
            columns === 2
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
        <div className="py-2 w-full flex flex-col items-center">
          <label className="text-lightGrey text-xs text-center">
            <input
              type="checkbox"
              name="acceptance"
              id="acceptance"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              checked={formik.values.acceptance}
              className="text-fontRed accent-fontRed rounded"
            />{" "}
            Acepto los{" "}
            <a
              href="/terminos-y-condiciones"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              términos y condiciones
            </a>{" "}
            y las{" "}
            <a
              href="/politicas-de-privacidad"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              políticas de privacidad
            </a>
          </label>
          {formik.errors.acceptance && formik.touched.acceptance && (
            <p className="text-red-500 text-xs mt-1 text-center">
              {formik.errors.acceptance}
            </p>
          )}
        </div>
      )}

      {/* Botones */}
      {includeButtons && (
  <div className="py-2 flex flex-col md:flex-row justify-center gap-2">
    <button
      type="submit"
      className="rounded-full hover:shadow-md transition duration-300 ease-in-out group bg-primaryBlue text-white border border-white hover:bg-white hover:text-primaryBlue hover:border-primaryBlue transition-colors text-xs px-6 py-2.5"
      disabled={loading}
    >
      {loading ? "Enviando..." : submitButtonText}
    </button>
    <button
      type="button"
      className="rounded-full hover:shadow-md transition duration-300 ease-in-out group bg-gray-400 text-white border border-white hover:bg-white hover:text-gray-400 hover:border-gray-400 transition-colors text-xs px-6 py-2.5"
      onClick={onCancel}
    >
      {cancelButtonText}
    </button>
  </div>
)}

    </form>
  );
};

export default ReusableForm;