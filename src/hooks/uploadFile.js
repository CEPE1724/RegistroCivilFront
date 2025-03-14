import axios from "axios";
import { APIURL } from "../configApi/apiConfig";
const uploadFile = async (file, almacen, cedula, numeroSolicitud, Tipo) => {
  console.log("file", file);
  console.log("almacen", almacen);
  console.log("cedula", cedula);
  console.log("numeroSolicitud", numeroSolicitud);
  const formData = new FormData();
  formData.append("file", file);
  formData.append("almacen", almacen);
  formData.append("cedula", cedula);
  formData.append("numerosolicitud", numeroSolicitud);
  formData.append("Tipo", Tipo);

  try {
    // Realizar la solicitud POST
    const url = APIURL.postFileupload();
    console.log("url", url);
    const response = await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Si la respuesta es exitosa
    return response.data;
  } catch (err) {
    // Si ocurre un error, lo lanzamos para que sea manejado donde sea llamado
    throw new Error("Error al subir el archivo. Inténtalo de nuevo.");
  }
};

export default uploadFile;