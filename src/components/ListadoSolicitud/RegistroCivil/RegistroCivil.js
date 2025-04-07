import React, { useEffect, useState } from "react";
import axios from "../../../configApi/axiosConfig";
import { CircularProgress, Alert } from "@mui/material";


export function  RegistroCivil  ({ cedula, dactilar }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const hanldeResetInputs = () => {
    setError(null);
  };

  const handleQuery = async () => {

    try {
        const token = localStorage.getItem("token");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

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
          const postResponse = await axios.post(
            "dactilar/consulta",
            { cedula, dactilar },
            config
          );

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
          const errorObject = JSON.parse(
            errorMessage.replace("Error en la consulta: ", "")
          );
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
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen overflow-auto">
      {/* Foto solo si existe */}
      {error && (
        <div className="mt-4 sm:m-8 md:m-12 lg:m-12 flex flex-col lg:flex-row justify-center gap-6">
          <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
            {error}
          </Alert>
        </div>
      )}

      {data ? (
        <div className="sm:m-8 md:m-12 lg:m-12 flex flex-col lg:flex-row justify-center gap-6">
          {/* Mostrar solo la foto */}
          {data.FOTO && (
            <div className="flex flex-col items-center">
              <img
                className="rounded-md object-cover w-2/3 h-3/3"
                src={`data:image/jpeg;base64,${data.FOTO}`}
                alt="Foto"
              />
            </div>
          )}
        </div>
      ) : (
        <div className="flex justify-center items-center">
          <CircularProgress />
        </div>
      )}
    </div>
  );
};

