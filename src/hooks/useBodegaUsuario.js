// hooks/useBodegaUsuario.js
import { useState } from "react";
import axios from "axios";
import { APIURL } from "../configApi/apiConfig";

const useBodegaUsuario = () => {
  const [data, setData] = useState(null);
  const [vendedor, setVendedor] = useState(null);
  const [analista, setAnalista] = useState(null);
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


      setError("Hubo un error al obtener los datos.");
    } finally {
      setLoading(false);  
    }
  };

  const listaVendedoresporBodega = async (fecha, bodega, nivel) => {
    console.log("fecha", fecha);
    setLoading(true);  
    setError(null);    
    try {
      const params = { fecha, bodega, nivel };

      const response = await axios.get(APIURL.listaVendedoresporBodega(fecha, bodega, nivel));

      setVendedor(response.data);
    } catch (err) {
      setError("Hubo un error al obtener los datos.");
    } finally {
      setLoading(false);  
    }
  };

   const listadoAnalista = async () => {
      try {
        const url = APIURL.analistacredito();
        const response = await axios.get(url);
        setAnalista(response.data);
      } catch (err) {
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
    listaVendedoresporBodega,
    vendedor,
    analista,
    listadoAnalista,
  };
};

export default useBodegaUsuario;
