import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import {
  fetchNivelEducacion, fetchProfesion, fetchProvincias,
  fetchCantones, fetchParroquias, fetchBarrios
} from "./apisFetch";
import { fields, fields1, fields2 } from "./fieldsData";

export function DatosCliente() {

  const { enqueueSnackbar } = useSnackbar();

  const [datosSolicitud, setDatosSolicitud] = useState({
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
      <div className="py-2 w-full">
        <form className="grid gap-4 grid-cols-5 md:grid-cols-5">
          {fields(datosSolicitud.nivelEducacion, datosSolicitud.profesion).map((field, index) => (
            <div key={index} className="col-span-1">
              <label className="block text-sm font-medium">{field.label}</label>
              {field.type === "select" ? (
                <select className="solcitudgrande-style">
                  <option value="">Seleccione una opción</option>
                  {field.options.map((option, idx) => (
                    <option key={idx} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  className="solcitudgrande-style"
                />
              )}
            </div>
          ))}
        </form>
      </div>

      <div className="py-2 w-full">
        <form className="grid gap-4 grid-cols-4 md:grid-cols-4">
          {fields1(datosSolicitud.provincia, datosSolicitud.cantones, datosSolicitud.parroquias, datosSolicitud.barrios).map((field, index) => (
            <div key={index} className="col-span-1">
              <label className="block text-sm font-medium">{field.label}</label>
              {field.type === "select" ? (
                <select className="solcitudgrande-style"
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
                  {field.label}
                </button>
              ) : (
                <input
                  type={field.type}
                  className="solcitudgrande-style"
                />
              )}
            </div>
          ))}
        </form>
      </div>

      <div className="py-2 w-full">
        <form className="grid gap-4 grid-cols-4 md:grid-cols-4">
          {fields2.map((field, index) => (
            <div key={index} className="col-span-1">
              <label className="block text-sm font-medium">{field.label}</label>
              {field.type === "select" ? (
                <select className="solcitudgrande-style">
                  {field.options.map((option, idx) => (
                    <option key={idx} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  className="solcitudgrande-style"
                />
              )}
            </div>
          ))}
        </form>
      </div>
    </>
  );
}
