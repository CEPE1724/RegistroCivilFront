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
          className="block bg-[#F9FAFB] w-full rounded-md border-gray-300 px-4 py-2 shadow-sm"
          {...props}
        >
          <option value="" disabled>
            Selecciona una opción
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      ) : type === "file" ? (
        <div>
          <input
            id={name}
            name={name}
            type="file"
            onChange={handleFileChange}
            onBlur={formik.handleBlur}
            className="block w-full bg-[#F9FAFB] rounded-md border-gray-300 px-4 py-2 shadow-sm"
            accept="image/*"
            {...props}
          />
          {preview && (
            <div className="mt-2">
              <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-md border" />
            </div>
          )}
        </div>
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
              onChange={formik.handleChange}
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
          className="block bg-[#F9FAFB] w-full rounded-md border-gray-300 px-4 py-2 shadow-sm"
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

  return (
    // <form
    //   onSubmit={formik.handleSubmit}
    //   className={`w-full bg-white p-4 rounded-lg ${columns === 2 ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "flex flex-col"}`}
    // >
    <form
      className={`w-full bg-white p-4 rounded-lg ${
        columns === 2
          ? "grid grid-cols-1 md:grid-cols-2 gap-4"
          : "flex flex-col"
      }`}
      onSubmit={(e) => {
        e.preventDefault();
        console.log("Formik errors:", formik.errors);
        console.log("Formik values:", formik.values);
        formik.handleSubmit(e);
      }}
    >
      {formConfig.map((field) => (
        <FormField key={field.name} {...field} formik={formik} />
      ))}

      {includeTermsAndConditions && (
        <div className="py-2 w-full flex flex-col md:col-span-2">
          <label className="text-lightGrey text-xs">
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
            <p className="text-red-500 text-xs mt-1">
              {formik.errors.acceptance}
            </p>
          )}
        </div>
      )}

      {includeButtons && (
        <div className="py-2 flex flex-col md:flex-row justify-normal gap-2 md:col-span-2">
          <button
            type="submit"
            className="rounded-full bg-blue-600 text-white px-6 py-2.5 hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Enviando..." : submitButtonText}
          </button>
          <button
            type="button"
            className="rounded-full bg-gray-400 text-white px-6 py-2.5 hover:bg-gray-500 transition"
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
