import axios from "axios";
import { APIURL } from "../../../configApi/apiConfig";

export const fetchNivelEducacion = async (enqueueSnackbar,setNivelEducacion) => {
  try {
    const response = await axios.get(APIURL.get_cre_niveleducacion(), {
      headers: { method: "GET", cache: "no-store" },
    });
    setNivelEducacion(
      response.data.map((item) => ({
        value: item.idNivelEducacion,
        label: item.Nombre,
      }))
    );
  } catch (error) {
    console.error("Error al obtener nivel educacion", error);
    enqueueSnackbar("Error al cargar nivel educacion ", {
      variant: "error",
      preventDuplicate: true,
    });
    setNivelEducacion([]);
  }
};

export const fetchProfesion = async (enqueueSnackbar, setProfesion) => {
  try {
    const response = await axios.get(APIURL.get_cre_profesion(), {
      headers: { method: "GET", cache: "no-store" },
    });
    setProfesion(
      response.data.map((item) => ({
        value: item.idProfesion,
        label: item.Nombre,
      }))
    );
  } catch (error) {
    console.error("Error al obtener Profesion", error);
    enqueueSnackbar("Error al cargar Profesion", {
      variant: "error",
      preventDuplicate: true,
    });
    setProfesion([]);
  }
};

export const fetchProvincias = async (enqueueSnackbar, setProvincia) => {
  try {
    const response = await axios.get(APIURL.getProvincias(), {
      headers: { method: "GET", cache: "no-store" },
    });
    setProvincia(
      response.data.map((item) => ({
        value: item.idProvincia,
        label: item.Nombre,
      }))
    );
  } catch (error) {
    console.error("Error al obtener Provincia", error);
    enqueueSnackbar("Error al cargar Provincia", {
      variant: "error",
      preventDuplicate: true,
    });
    setProvincia([]);
  }
};

export const fetchCantones = async (idProvincia, enqueueSnackbar, setCantones) => {
	try {
	  const response = await axios.get(APIURL.getCantones(idProvincia), {
		headers: { method: "GET", cache: "no-store" },
	  });
	  setCantones(
		response.data.map((item) => ({
		  value: item.idCanton,
		  label: item.Nombre,
		}))
	  );
	} catch (error) {
	  console.error("Error al obtener Canton", error);
	  enqueueSnackbar("Error al cargar Canton", {
		variant: "error",
		preventDuplicate: true,
	  });
	  setCantones([]);
	}
};

export const fetchParroquias = async (idCanton, enqueueSnackbar, setParroquias) => {
  try {
    const response = await axios.get(APIURL.getParroquias(idCanton), {
      headers: { method: "GET", cache: "no-store" },
    });
    setParroquias(
      response.data.map((item) => ({
        value: item.idParroquia,
        label: item.Nombre,
      }))
    );
  } catch (error) {
    console.error("Error al obtener parroquias", error);
    setParroquias([]);
  }
};

export const fetchBarrios = async (idParroquia, enqueueSnackbar, setBarrios) => {
  try {
    const response = await axios.get(APIURL.getBarrios(idParroquia), {
      headers: { method: "GET", cache: "no-store" },
    });
    setBarrios(
      response.data.map((item) => ({
        value: item.idBarrio,
        label: item.Nombre,
      }))
    );
  } catch (error) {
    console.error("Error al obtener barrios", error);
    setBarrios([]);
  }
};
