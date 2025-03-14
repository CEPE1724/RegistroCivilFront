import axios from "axios";
import { APIURL } from "../../../configApi/apiConfig";

// fetchs de primera seccion de formulario
export const fetchNacionalidad = async (enqueueSnackbar, setNacionalidad) => {
  try {
    const response = await axios.get(APIURL.get_creNacionalidad(), {
      headers: { method: "GET", cache: "no-store" },
    });
    console.log(response);
    setNacionalidad(
      response.data.map((item) => ({
        value: item.idNacionalidad,
        label: item.Nombre,
      }))
    );
  } catch (error) {
    console.error("Error al obtener nacionalidad", error);
    enqueueSnackbar("Error al cargar nacionalidad", {
      variant: "error",
      preventDuplicate: true,
    });
    setNacionalidad([]);
  }
};

export const fecthGenero = async (enqueueSnackbar, setGenero) => {
  try {
    const response = await axios.get(APIURL.getTiposexo(), {
      headers: { method: "GET", cache: "no-store" },
    });
    setGenero(
      response.data.map((item) => ({
        value: item.idSexo,
        label: item.Nombre,
      }))
    );
  } catch (error) {
    console.error("Error al obtener genero", error);
    enqueueSnackbar("Error al cargar genero", {
      variant: "error",
      preventDuplicate: true,
    });
    setGenero([]);
  }
};

export const fecthEstadoCivil = async (enqueueSnackbar, setEstadoCivil) => {
  try {
    const response = await axios.get(APIURL.get_estadoCivil(), {
      headers: { method: "GET", cache: "no-store" },
    });
    setEstadoCivil(
      response.data.map((item) => ({
        value: item.idEstadoCivil,
        label: item.Nombre,
      }))
    );
  } catch (error) {
    console.error("Error al obtener estado civil", error);
    enqueueSnackbar("Error al cargar estado civil", {
      variant: "error",
      preventDuplicate: true,
    });
    setEstadoCivil([]);
  }
};

export const fetchNivelEducacion = async (
  enqueueSnackbar,
  setNivelEducacion
) => {
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

export const fetchSituacionLaboral = async (enqueueSnackbar, setSituacionLaboral) => {
    try {
      const response = await axios.get(APIURL.getTipoTrabajo());
      if (response.status === 200) {
        setSituacionLaboral(
          response.data.map((item) => ({
            value: item.idTipoTrabajo,
            label: item.Tipo,
          }))
        );
      } else {
        throw new Error("Error en la respuesta del servidor");
      }
    } catch (error) {
      console.error("Error al obtener situacion laboral:", error);
      enqueueSnackbar("No se pudo cargar Situacion Laboral", {
        variant: "error",
      });
	  setSituacionLaboral([]);
    }
  };

export const fetchActividadEconomina = async (enqueueSnackbar, idSituacionLaboral, setActividadLaboral, ) => {
    try {
		console.log(idSituacionLaboral);
      const response = await axios.get(APIURL.get_cre_actividadeconomina(idSituacionLaboral), {
        headers: { method: "GET", cache: "no-store" },
      });
      setActividadLaboral(
        response.data.map((item) => ({
          value: item.idActEconomica,
          label: item.Nombre,
        }))
      );
    } catch (error) {
      console.error("Error al obtener actividad laboral", error);
	  enqueueSnackbar("Error al cargar actividad laboral", {
		variant: "error",
		preventDuplicate: true,
		});				
      setActividadLaboral([]);
    }
  };

// fetchs de segunda seccion de formulario
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

export const fetchCantones = async (
  idProvincia,
  enqueueSnackbar,
  setCantones
) => {
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

export const fetchParroquias = async (
  idCanton,
  enqueueSnackbar,
  setParroquias
) => {
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

export const fetchBarrios = async (
  idParroquia,
  enqueueSnackbar,
  setBarrios
) => {
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

export const fecthInmueble = async (enqueueSnackbar, setInmueble) => {
	  try {
	const response = await axios.get(APIURL.get_cre_inmueble(), {
	  headers: { method: "GET", cache: "no-store" },
	});
	setInmueble(
	  response.data.map((item) => ({
		value: item.idInmueble,
		label: item.Nombre,
	  }))
	);
  } catch (error) {
	console.error("Error al obtener inmueble", error);
	enqueueSnackbar("Error al cargar inmueble", {
	  variant: "error",
	  preventDuplicate: true,
	});
	setInmueble([]);
  }
}

export const fecthCiudadInmueble = async (enqueueSnackbar, setCiudadInmueble) => {
	  try {
	const response = await axios.get(APIURL.get_cre_CiudadInmueble(), {
	  headers: { method: "GET", cache: "no-store" },
	});
	setCiudadInmueble(
	  response.data.map((item) => ({
		value: item.idCanton,
		label: item.Nombre,
	  }))
	);
  } catch (error) {
	console.error("Error al obtener ciudad inmueble", error);
	enqueueSnackbar("Error al cargar ciudad inmueble", {
	  variant: "error",
	  preventDuplicate: true,
	});
	setCiudadInmueble([]);
  }
}

export const fecthTipoVivienda = async (enqueueSnackbar, setTipoVivienda) => {
	  try {
	const response = await axios.get(APIURL.get_cre_tipoVivienda(), {
	  headers: { method: "GET", cache: "no-store" },
	});
	setTipoVivienda(
	  response.data.map((item) => ({
		value: item.idCanton,
		label: item.Nombre,
	  }))
	);
  } catch (error) {
	console.error("Error al obtener tipo vivienda", error);
	enqueueSnackbar("Error al cargar tipo vivienda", {
	  variant: "error",
	  preventDuplicate: true,
	});
	setTipoVivienda([]);
  }
}

export const fetchTiempoVivienda = async (enqueueSnackbar, setTiempoVivienda) => {
	  try {
	const response = await axios.get(APIURL.get_cre_tiempoVivienda(), {
	  headers: { method: "GET", cache: "no-store" },
	});
	setTiempoVivienda(
	  response.data.map((item) => ({
		value: item.idCre_Tiempo,
		label: item.Descripcion,
	  }))
	);
  } catch (error) {
	console.error("Error al obtener tiempo vivienda", error);
	enqueueSnackbar("Error al cargar tiempo vivienda", {
	  variant: "error",
	  preventDuplicate: true,
	});
	setTiempoVivienda([]);
  }
}
