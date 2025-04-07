import React, { useEffect, useState } from "react";
import axios from "../../../configApi/axiosConfig";
import { CircularProgress, Alert, Button } from "@mui/material";

export function RegistroCivil({ cedula, dactilar, imagenSubida, onAceptar, onRechazar }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const hanldeResetInputs = () => setError(null);

  const handleQuery = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      try {
        const getResponse = await axios.get(`dactilar/${cedula}`, config);
        if (getResponse.data.statusCode === 200 && getResponse.data.data) {
          setData(getResponse.data.data);
          hanldeResetInputs();
        } else {
          throw new Error("Data not found for the provided cedula.");
        }
      } catch (err) {
        if (err.response && err.response.status === 500) {
          const postResponse = await axios.post("dactilar/consulta", { cedula, dactilar }, config);
          if (postResponse.data.data) {
            setData(postResponse.data.data);
            hanldeResetInputs();
          } else {
            throw new Error("Data query failed");
          }
        } else {
          throw new Error("Error fetching data: " + err.message);
        }
      }
    } catch (err) {
      if (err.response && err.response.status === 500) {
        const errorMessage = err.response.data.message;
        let parsedMessage;
        try {
          const errorObject = JSON.parse(errorMessage.replace("Error en la consulta: ", ""));
          parsedMessage = errorObject.mensaje?.mensaje;
        } catch (parseError) {
          parsedMessage = "Error desconocido";
        }
        setError(parsedMessage);
        setData(null);
      } else {
        console.error("Error fetching data:", err.message);
      }
    }
  };

  useEffect(() => {
    if (cedula && dactilar) {
      handleQuery();
    }
  }, [cedula, dactilar]);

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      {error && (
        <div className="flex justify-center my-4">
          <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>
        </div>
      )}

      {data ? (
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-col lg:flex-row justify-center gap-6">
            {/* Imagen subida */}
            {imagenSubida && (
              <div className="flex flex-col items-center">
                <p className="mb-2 font-semibold">Imagen subida</p>
                <img
                  src={imagenSubida}
                  alt="Subida"
                  className="rounded-md object-cover w-64 h-64 border border-gray-300"
                />
              </div>
            )}

            {/* Imagen Registro Civil */}
            {data.FOTO && (
              <div className="flex flex-col items-center">
                <p className="mb-2 font-semibold">Imagen del Registro Civil</p>
                <img
                  src={`data:image/jpeg;base64,${data.FOTO}`}
                  alt="RC"
                  className="rounded-md object-cover w-64 h-64 border border-gray-300"
                />
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="mt-6 flex gap-4">
            <Button
              variant="contained"
              color="success"
              onClick={onAceptar}
            >
              Aceptar
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={onRechazar}
            >
              Rechazar
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center py-12">
          <CircularProgress />
        </div>
      )}
    </div>
  );
}
