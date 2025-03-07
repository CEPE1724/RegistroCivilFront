// hooks/useBodegaUsuario.js
import { useState } from "react";
import axios from "axios";
import { APIURL } from "../configApi/apiConfig";

const useBodegaUsuario = () => {
  const [data, setData] = useState(null);  
  const [loading, setLoading] = useState(false);  
  const [error, setError] = useState(null);  
  const fetchBodegaUsuario = async (userId, idTipoFactura, fecha, recibeConsignacion) => {
    setLoading(true);  
    setError(null);    
    try {
      const params = { userId, idTipoFactura, fecha, recibeConsignacion };

      const response = await axios.get(APIURL.getUsuarioBodega(), { params });

      setData(response.data);
    } catch (err) {

      console.error("Error fetching data:", err);
      setError("Hubo un error al obtener los datos.");
    } finally {
      setLoading(false);  
    }
  };

  return {
    data,
    loading,
    error,
    fetchBodegaUsuario,  
  };
};

export default useBodegaUsuario;
