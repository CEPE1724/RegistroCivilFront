import { useEffect, useState } from "react";
import ReusableForm from "../../FormField";
import * as Yup from "yup";
import { APIURL } from "../../../configApi/apiConfig";
import axios from "axios";
import { useSnackbar } from "notistack";
import useBodegaUsuario from "../../../hooks/useBodegaUsuario";
import uploadFile from "../../../hooks/uploadFile";
import { useAuth } from "../../AuthContext/AuthContext";
export default function CreditoForm() {
  const { userData } = useAuth(); 
  console.log("Usuario:", userData);
  const { data, loading, error, fetchBodegaUsuario } = useBodegaUsuario();

  const [actividadLaboral, setActividadLaboral] = useState([]);
  const [estabilidadLaboral, setEstabilidadLaboral] = useState([]);
  const [tiempoVivienda, setTiempoVivienda] = useState([]);
  const [tipoConsulta, setTipoConsulta] = useState([]);
  const [dataBodega, setDataBodega] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [prevErrors, setPrevErrors] = useState({});
  const [formStatus, setFormStatus] = useState(null);
  const [ urlCloudstorage, setUrlCloudstorage] = useState(null);
  const [dataRecibir, setDataRecibir] = useState(null);
  const fetchBodega = async () => {
    const userId = userData?.idUsuario;
    const idTipoFactura = 43;
    const fecha = new Date().toISOString();
    const recibeConsignacion = true;

    try {
      // Llamada a la función del hook que obtiene los datos
      await fetchBodegaUsuario(userId, idTipoFactura, fecha, recibeConsignacion);
    } catch (err) {
      console.error("Error al obtener datos de la bodega:", err);
      enqueueSnackbar("Error al cargar los datos de bodega", { variant: "error", preventDuplicate: true });
    }
  };

  const fetchEstabilidadLaboral = async () => {
    try {
      const response = await axios.get(APIURL.getEstabilidadLaboral(), {
        headers: { method: "GET", cache: "no-store" },
      });
      setEstabilidadLaboral(
        response.data.map((item) => ({
          value: item.idCre_Tiempo,
          label: item.Descripcion,
        }))
      );
      setTiempoVivienda(
        response.data.map((item) => ({
          value: item.idCre_Tiempo,
          label: item.Descripcion,
        }))
      );
    } catch (error) {
      console.error("Error al obtener estabilidad laboral", error);
      enqueueSnackbar("Error al cargar estabilidad laboral", { variant: "error", preventDuplicate: true });
      setEstabilidadLaboral([]);
      setTiempoVivienda([]);
    }
  };

  const fetchActividadLaboral = async () => {
    try {
      const response = await axios.get(APIURL.getActividadEconomina(), {
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
      setActividadLaboral([]);
    }
  };

  const fetchTipoConsulta = async () => {
    try {
      const token = '';
      const response = await axios.get(APIURL.get_TipoConsulta(), {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Cache": "no-store",
        },
      });
      setTipoConsulta(
        response.data.map((item) => ({
          value: item.idCompraEncuesta,
          label: item.Descripcion,
        }))
      );
    } catch (error) {
      console.error("Error al obtener tipo de consulta laboral", error);
      setActividadLaboral([]);
    }
  };

  useEffect(() => {
    fetchEstabilidadLaboral();
    fetchActividadLaboral();
    fetchTipoConsulta();
    fetchBodega();  
  }, []);  

  useEffect(() => {
    if (data && data.length > 0) {
      setDataBodega(
        data.map((item) => ({
          value: item.b_Bodega,
          label: item.b_Nombre,
        }))
      );
    }
  }, [data]); // Este efecto se ejecuta cuando 'data' cambia


  if (!actividadLaboral || actividadLaboral.length === 0) {
    return <p>No se pudo cargar la actividad laboral...</p>;
  }


  const initialValues = {
    Fecha:
      new Date(new Date().toLocaleString("en-US", { timeZone: "America/Guayaquil" })).toISOString().split("T")[0] + "T00:00:00Z",
    NumeroSolicitud: "12345",
    Bodega: 1,
    idVendedor: 123,
    idCompraEncuesta: null,
    Cedula: "",
    CodDactilar: "",
    ApellidoPaterno: "",
    ApellidoMaterno: "",
    PrimerNombre: "",
    SegundoNombre: "",
    Celular: "",
    Email: "",
    idActEconomina: null,
    idCre_Tiempo: null,
    bAfiliado: false,
    bTieneRuc: false,
    Foto: "",
    bTerminosYCondiciones: false,
    bPoliticas: false,
    idProductos: null,
    idCre_TiempoVivienda : null,
  };

  const formConfig = [
    { label: "Fecha", name: "Fecha", type: "text", hidden: true },
    {
      label: "Número de Solicitud",
      name: "NumeroSolicitud",
      type: "number",
      disabled: true,
      hidden: true,
    },
    {
      label: "Bodega",
      name: "Bodega",
      type: "number",
      type: "select",
      options: dataBodega,
     
    },
    {
      label: "ID Vendedor",
      name: "idVendedor",
      type: "number",
      disabled: true,
      hidden: true,
    },
    {
      label: "Tipo de Consulta",
      name: "idCompraEncuesta",
      type: "select",
      options: tipoConsulta,
    },

    { label: "Cédula", name: "Cedula", type: "text" },
    { label: "Código Dactilar", name: "CodDactilar", type: "text" },
    { label: "Apellido Paterno", name: "ApellidoPaterno", type: "text" },
    { label: "Apellido Materno", name: "ApellidoMaterno", type: "text" },
    { label: "Primer Nombre", name: "PrimerNombre", type: "text" },
    { label: "Segundo Nombre", name: "SegundoNombre", type: "text" },
    { label: "Celular", name: "Celular", type: "text" },
    { label: "Email", name: "Email", type: "email" },

    {
      label: "Actividad Laboral",
      name: "idActEconomina",
      type: "select",
      options: actividadLaboral,
    },
    {
      label: "Estabilidad Laboral",
      name: "idCre_Tiempo",
      type: "select",
      options: estabilidadLaboral,
    },
    {
      label: "Tiempo de Vivienda",
      name: "idCre_TiempoVivienda",
      type: "select",
      options: tiempoVivienda,

    },
    {
      label: "Producto",
      name: "idProductos",
      type: "select",
      options: [
        { value: 789, label: "CELULAR" },
        { value: 2, label: "OTRO" },
      ],
    },

    { label: "Afiliado", name: "bAfiliado", type: "switch" },
    { label: "Tiene RUC?", name: "bTieneRuc", type: "switch" },

    { label: "Subir foto", name: "Foto", type: "file"},
    


  ];

  const validationSchema = Yup.object()
    .shape({
      Fecha: Yup.string().required("Campo requerido"),
      NumeroSolicitud: Yup.number()
        .positive()
        .integer()
        .required("Campo requerido"),
      Bodega: Yup.number().positive().integer().required("Campo requerido"),
      idVendedor: Yup.number().positive().integer().required("Campo requerido"),
      idCompraEncuesta: Yup.number()
        .nullable()
        .positive()
        .integer()
        .required("Debes seleccionar un Tipo de Consulta."),

      Cedula: Yup.string()
        .matches(/^\d{10}$/, "Debe ser un número de 10 dígitos")
        .required("Ingresa 10 digitos de la cedula"),
      CodDactilar: Yup.string()
        .transform((value) => value.toUpperCase())
        .matches(
          /^[A-Z]\d{4}[A-Z]\d{4}$/,
          "El primer y sexto carácter deben ser letras"
        )
        .min(8, "Debe tener al menos 8 caracteres")
        .required("Revisa y coloca correctamente el código dactilar"),
      ApellidoPaterno: Yup.string()
        .trim()
        .min(3, "Debe tener al menos 3 caracteres")
        .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, "Solo se permiten letras y espacios")
        .test("no-espacios", "No puede estar vacío", (value) => value && value.trim() !== "")
        .required("Revisa el apellido debe tener al menos 2 caracteres"),
      ApellidoMaterno: Yup.string()
        .trim()
        .min(3, "Debe tener al menos 3 caracteres o dejar en blanco")
        .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, "Solo se permiten letras y espacios"),
        // .test("no-espacios", "No puede estar vacío", (value) => value && value.trim() !== "")
        // .required("Revisa el apellido debe tener al menos 2 caracteres"),
      PrimerNombre: Yup.string()
        .trim()
        .min(3, "Debe tener al menos 3 caracteres")
        .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, "Solo se permiten letras y espacios")
        .test("no-espacios", "No puede estar vacío", (value) => value && value.trim() !== "")
        .required("Revisa el nombre debe tener al menos 2 caracteres"),
      SegundoNombre: Yup.string()
        .trim()
        .min(3, "Debe tener al menos 3 caracteres o dejar en blanco")
        .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, "Solo se permiten letras y espacios"),
        // .test("no-espacios", "No puede estar vacío", (value) => value && value.trim() !== ""),
        // .required("Revisa el nombre debe tener al menos 2 caracteres"),
      Celular: Yup.string()
        .matches(/^\d{10}$/, "Debe ser un número de 10 dígitos")
        .required("El celular debe tener 10 dígitos")
        .trim(),
      Email: Yup.string().email("Correo inválido").required("Ingresa un correo válido"),

      idActEconomina: Yup.number()
        .nullable()
        .positive()
        .integer()
        .required("Selecciona por favor la actividad economica"),
      idCre_Tiempo: Yup.number()
        .positive("Debe ser un número positivo")
        .integer("Debe ser un número entero")
        .required("Debes seleccionar una opción en Estabilidad Laboral."),
      idCre_TiempoVivienda: Yup.number()
        .positive("Debe ser un número positivo")
        .integer("Debe ser un número entero")
        .required("Debes seleccionar una opción en Tiempo de Vivienda."),

      bAfiliado: Yup.boolean(),
      bTieneRuc: Yup.boolean(),
      Foto: Yup.string().min(5, "Debe tener al menos 5 caracteres").required("Por favor sube una foto"),

      bTerminosYCondiciones: Yup.boolean().oneOf([true], "Debes aceptar los términos y condiciones.").required(),

      bPoliticas: Yup.boolean().oneOf([true], "Debes aceptar las políticas.").required(),

      idProductos: Yup.number()
        .nullable()
        .positive("Debe ser un número positivo")
        .integer()
        .required("Por favor selecciona un producto"),
    })
    .test(
      "at-least-one-switch",
      "Debe seleccionar al menos una opción (Afiliado o Tiene RUC)",
      function (values) {
        return values.bAfiliado || values.bTieneRuc;
      },
    );

  const handleCancel = () => {
    console.log("Formulario cancelado");
  };

  const showFormErrors = (errors) => {
    if (Object.keys(errors).length > 0) {
      enqueueSnackbar('Por favor, revisa el campo nombre y todos los demás campos para que puedan funcionar correctamente.', {
        variant: "error",
        preventDuplicate: true,
        autoHideDuration: 6000
      });
    }

    Object.keys(errors).forEach(fieldName => {
      if (!prevErrors[fieldName] || prevErrors[fieldName] !== errors[fieldName]) {
        const fieldConfig = formConfig.find(f => f.name === fieldName);
        const fieldLabel = fieldConfig ? fieldConfig.label : fieldName;

        enqueueSnackbar(`Error en ${fieldLabel}: ${errors[fieldName]}`, {
          variant: "error",
          preventDuplicate: true,
          autoHideDuration: 4000
        });
      }
    });
    setPrevErrors(errors);
  };

  const fetchActualizaSolicitud = async (idSolicitud, data) => {
  try {
    console.log("Actualizando solicitud con ID:", idSolicitud, "con los datos:", data);
    const url = APIURL.putUpdatesolicitud(idSolicitud);  // URL para actualizar la solicitud
    const response = await axios.put(url, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log("Solicitud actualizada con éxito:", response.data);
    return response.data;  // Retornar datos actualizados si es necesario
  } catch (error) {
    console.error("Error al actualizar la solicitud:", error.message);
    throw error;  // Re-lanzar error para manejarlo más tarde
  }
};

const fetchConsultaSolicitud = async (idSolicitud) => {
  try {
    const url = APIURL.getConsultaCre_solicitud_web(idSolicitud);
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log("Solicitud consultada con éxito:", response.data);
    setDataRecibir(response.data);  // Almacenar los datos de la solicitud
    return response.data;  // Devolver los datos consultados
  } catch (error) {
    console.error("Error al consultar la solicitud:", error.message);
    throw error;  // Re-lanzar error para manejarlo más tarde
  }
};

const handleSubmit = async (values) => {
  const fotourl = values.Foto; // URL de la foto que deseas cargar

  // Formatear los valores para la API, con conversiones necesarias
  const formattedValues = {
    ...values,
    Foto: 'prueba',  // Valor temporal de la foto mientras se maneja la carga
    Bodega: Number(values.Bodega),
    idActEconomina: Number(values.idActEconomina),
    idCre_Tiempo: Number(values.idCre_Tiempo),
    idProductos: Number(values.idProductos),
    ApellidoMaterno: values.ApellidoMaterno?.trim().toUpperCase(),
    ApellidoPaterno: values.ApellidoPaterno?.trim().toUpperCase(),
    PrimerNombre: values.PrimerNombre?.trim().toUpperCase(),
    SegundoNombre: values.SegundoNombre?.trim().toUpperCase(),
    CodDactilar: values.CodDactilar?.toUpperCase(),
    idCompraEncuesta: Number(values.idCompraEncuesta),
    idCre_TiempoVivienda: Number(values.idCre_TiempoVivienda),
  };



  try {
    // 1. Crear la solicitud
    const url = APIURL.post_cre_solicitud_web();
    const createResponse = await axios.post(url, formattedValues, {
      headers: { method: "POST", cache: "no-store" },
    });

    // 2. Consultar la solicitud recién creada
    if (createResponse.data.idCre_SolicitudWeb) {
      const solicitudData = await fetchConsultaSolicitud(createResponse.data.idCre_SolicitudWeb);
   
      // 3. Subir archivo si existe una foto
      if (fotourl && solicitudData) {
        const file = fotourl;  // El archivo completo, no solo el nombre

        // 4. Subir la foto
        const fileUploadResponse = await uploadFile(
          file,
          values.Bodega,
          values.Cedula,
          solicitudData.NumeroSolicitud
        );

        // 5. Si la subida fue exitosa, almacenar la URL de la foto
        if (fileUploadResponse) {
          setUrlCloudstorage(fileUploadResponse.url);  // Guardar URL del archivo subido

          // 6. Actualizar la solicitud con la URL de la foto
          const updatedData = {
            Foto: fileUploadResponse.url,  // Usamos la URL obtenida del archivo subido
          };
          const updatedSolicitud = await fetchActualizaSolicitud(solicitudData.idCre_SolicitudWeb, updatedData);
        }
      }
    }

    // Mensaje de éxito y cambio de estado del formulario
    enqueueSnackbar("Solicitud guardada con éxito", { variant: "success", preventDuplicate: true });
    setFormStatus("success");

  } catch (error) {
    // Manejo de errores
    console.error("Error al enviar los datos:", error);
    enqueueSnackbar("Error al enviar los datos. Por favor, intenta de nuevo más tarde", {
      variant: "error",
      preventDuplicate: true,
    });
    setFormStatus("error");
  }
};


  return (
    <div>
      <ReusableForm
        formConfig={formConfig}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        includeButtons={true}
        columns={3}
        includeTermsAndConditions={true}
        formStatus={formStatus}
      />
    </div>
  );
}
