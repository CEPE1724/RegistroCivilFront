import { useEffect, useState } from "react";
import ReusableForm from "../../FormField";
import * as Yup from "yup";
import { APIURL } from "../../../configApi/apiConfig";
import axios from "../../../configApi/axiosConfig";
import { useSnackbar } from "notistack";
import useBodegaUsuario from "../../../hooks/useBodegaUsuario";
import uploadFile from "../../../hooks/uploadFile";
import { useAuth } from "../../AuthContext/AuthContext";

export default function CreditoForm() {
  const { userData, userUsuario } = useAuth();
  const { data, fetchBodegaUsuario } = useBodegaUsuario();
  const { enqueueSnackbar } = useSnackbar();
  const [formStatus, setFormStatus] = useState(null);
  const [urlCloudstorage, setUrlCloudstorage] = useState(null);
  const [dataRecibir, setDataRecibir] = useState(null);
  const [loading, setLoading] = useState(false);  // Estado para mostrar el loading
  const [cedula, setCedula] = useState("");  // Estado para la cédula

  const IdVendedor = userUsuario?.idPersonal;
  const [actividadLaboral, setActividadLaboral] = useState([]);
  const [estabilidadLaboral, setEstabilidadLaboral] = useState([]);
  const [tiempoVivienda, setTiempoVivienda] = useState([]);
  const [tipoConsulta, setTipoConsulta] = useState([]);
  const [dataBodega, setDataBodega] = useState([]);
  const [ActEconomina, setActEconomina] = useState([]);
  ///


 



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
      const response = await axios.get(APIURL.getActividadEconominasituacionLaboral(), {
        headers: { method: "GET", cache: "no-store" },
      });
      setActividadLaboral(
        response.data.map((item) => ({
          value: item.idSituacionLaboral,
          label: item.Descripcion,
        }))
      );
    } catch (error) {
      console.error("Error al obtener actividad laboral", error);
      setActividadLaboral([]);
    }
  };

  const fetchActEconomina = async (idSituacionLaboral) => {
    try {
      if (!idSituacionLaboral) return; // Si no hay idSituacionLaboral, no hacer la consulta.
      const response = await axios.get(APIURL.get_cre_actividadeconomina(idSituacionLaboral), {
        headers: { method: "GET", cache: "no-store" },
      });
      setActEconomina(
        response.data.map((item) => ({
          value: item.idActEconomica,
          label: item.Nombre,
        }))
      );
    } catch (error) {
      console.error("Error al obtener actividad económica", error);
      setActEconomina([]);
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
    if (dataRecibir) {
      console.log(dataRecibir); // Para verificar qué datos estamos recibiendo
  
      setInitialValues((prevValues) => ({
        // Actualizamos los valores desde dataRecibir si existen, de lo contrario, usamos prevValues
        PrimerNombre: dataRecibir.primerNombre || prevValues.PrimerNombre || '',
        SegundoNombre: dataRecibir.segundoNombre || prevValues.SegundoNombre || '',
        ApellidoPaterno: dataRecibir.apellidoPaterno || prevValues.ApellidoPaterno || '',
        ApellidoMaterno: dataRecibir.apellidoMaterno || prevValues.ApellidoMaterno || '',
        FechaNacimeinto: dataRecibir.fechaNacimiento || prevValues.FechaNacimeinto || '',  // Fecha de nacimiento
        Edad: dataRecibir.edad || prevValues.Edad || '',  // Edad
        Cedula: dataRecibir.identificacion || prevValues.Cedula || '',  // Edad
        // Los siguientes valores siempre se toman de prevValues ya que no vienen de dataRecibir
        NumeroSolicitud: prevValues.NumeroSolicitud || '',  // Mantener el valor previo
        Bodega: prevValues.Bodega || '',  // Mantener el valor previo
  
        // Estos valores se mantienen con los valores previos si no se actualizan desde dataRecibir
        idVendedor: prevValues.idVendedor || null,  // Si no vienen de dataRecibir, mantenemos prevValues
        idCompraEncuesta: prevValues.idCompraEncuesta || null,  // Siempre tomar el valor previo
        // CodDactilar: prevValues.CodDactilar || '',  // Siempre tomar el valor previo
        Celular: prevValues.Celular || '',  // Siempre tomar el valor previo
        Email: prevValues.Email || '',  // Siempre tomar el valor previo
        idSituacionLaboral: prevValues.idSituacionLaboral || null,  // Siempre tomar el valor previo
        idActEconomina: prevValues.idActEconomina || null,  // Siempre tomar el valor previo
        idCre_Tiempo: prevValues.idCre_Tiempo || null,  // Siempre tomar el valor previo
        bAfiliado: prevValues.bAfiliado || false,  // Siempre tomar el valor previo
        bTieneRuc: prevValues.bTieneRuc || false,  // Siempre tomar el valor previo
        Foto: prevValues.Foto || '',  // Siempre tomar el valor previo
        bTerminosYCondiciones: prevValues.bTerminosYCondiciones || false,  // Siempre tomar el valor previo
        bPoliticas: prevValues.bPoliticas || false,  // Siempre tomar el valor previo
        idProductos: prevValues.idProductos || null,  // Siempre tomar el valor previo
        idCre_TiempoVivienda: prevValues.idCre_TiempoVivienda || null,  // Siempre tomar el valor previo
        otp_code: prevValues.otp_code || '',  // Siempre tomar el valor previo
      }));
    }
  }, [dataRecibir]);  // Este useEffect se ejecuta cada vez que `dataRecibir` cambia
  
  const handleSituacionLaboralChange = (selectedOption) => {
    fetchActEconomina(selectedOption);  // Realizamos la llamada para obtener la actividad económica
  };

  useEffect(() => {
    if (data && data.length > 0) {
      setDataBodega(
        data.map((item) => ({
          value: item.b_Bodega,
          label: item.b_Nombre,
        }))
      );
    }
  }, [data]);

  const handleCedulaChange = async (event) => {
    const cedula = event.target.value.trim();
    if (cedula.length === 10) {
      setLoading(true);  // Activamos el loading
  
      try {
        const datosCogno = await fecthDatosCogno(cedula);
        
        if (datosCogno.codigo === "OK") {
          setDataRecibir(datosCogno);  // Actualizamos el estado con los datos recibidos
        } else {
          enqueueSnackbar("Datos no encontrados o error en la respuesta", { variant: "warning" });
        }
      } catch (error) {
        console.error("Error al obtener datos de Cogno:", error);
        enqueueSnackbar("Error al obtener datos de Cogno", { variant: "error" });
      } finally {
        setLoading(false);  // Desactivamos el loading después de la llamada
      }
    } else {
      setDataRecibir(null);  // Limpiamos el estado si la cédula no tiene el formato correcto
    }
  };
  

  const [initialValues, setInitialValues] = useState({
    // Estado inicial para los valores del formulario
    NumeroSolicitud: "12345",
    Bodega: null,
    idVendedor: IdVendedor || null,
    idCompraEncuesta: null,
    Cedula: "",
    // CodDactilar: "",
    ApellidoPaterno: "",
    ApellidoMaterno: "",
    PrimerNombre: "",
    SegundoNombre: "",
    Celular: "",
    Email: "",
    idSituacionLaboral: null,
    idActEconomina: null,
    idCre_Tiempo: null,
    bAfiliado: false,
    bTieneRuc: false,
    Foto: "",
    bTerminosYCondiciones: false,
    bPoliticas: false,
    idProductos: null,
    idCre_TiempoVivienda: null,
    otp_code: "",
    FechaNacimeinto: "",
    Edad:"",
  });



  const formConfig = [
    {
      label: "Número de Solicitud",
      name: "NumeroSolicitud",
      type: "number",
      disabled: true,
      hidden: true,
    },
    
    {
      label: "ID Vendedor",
      name: "idVendedor",
      type: "number",
      disabled: true,
      hidden: true,
    },
    {
      label: "Cédula", name: "Cedula", type: "text",
      onBlur: handleCedulaChange, // Llama a la función al perder el foco
    },

    { label: "Apellido Paterno", name: "ApellidoPaterno", type: "text" },
    { label: "Apellido Materno", name: "ApellidoMaterno", type: "text" },
    { label: "Primer Nombre", name: "PrimerNombre", type: "text" },
    { label: "Segundo Nombre", name: "SegundoNombre", type: "text" },
    // { label: "Código Dactilar", name: "CodDactilar", type: "text" },
    {
      label: "Bodega",
      name: "Bodega",
      type: "select",
      options: dataBodega,
    },
    {
      label: "Tipo de Consulta",
      name: "idCompraEncuesta",
      type: "select",
      options: tipoConsulta,
    },
    { label: "Fecha Nacimiento", name: "FechaNacimeinto", type: "text", disabled: true },
    { label: "Edad", name: "Edad", type: "text", disabled: true },
    { label: "Celular", name: "Celular", type: "text" },
    { label: "Email", name: "Email", type: "email" },
    {
      label: "Situacion Laboral",
      name: "idSituacionLaboral",
      type: "select",
      options: actividadLaboral,
      onchange: handleSituacionLaboralChange,
    },
    {
      label: "Actividad Economica",
      name: "idActEconomina",
      type: "select",
      options: ActEconomina,
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
        { value: 1, label: "COMBOS" },
        { value: 2, label: "LAVADORA" },
        { value: 3, label: "MOVILIDAD" },
        { value: 4, label: "PORTATIL" },
        { value: 5, label: "REFRIGERADOR " },
        { value: 6, label: "TELEVISOR" },
      ],
    },
    { label: "Afiliado", name: "bAfiliado", type: "switch" },
    { label: "Tiene RUC?", name: "bTieneRuc", type: "switch" },
    // { label: "Subir foto", name: "Foto", type: "file" },
  ];


  const comprobTelf = async (telefono) => {
    try {
      const url = APIURL.validarTelefono(telefono);
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error("Error al validar el teléfono:", error);
      return false;
    }
  };
  
  const validationSchema = Yup.object()
    .shape({
      NumeroSolicitud: Yup.number()
        .positive()
        .integer()
        .required("Número de solicitud requerido"),
      Bodega: Yup.number()
        .nullable()
        .positive()
        .integer()
        .required("Selecciona por favor una bodega"),
      idVendedor: Yup.number().positive().integer().required("ID Vendedor requerido"),
      idCompraEncuesta: Yup.number()
        .nullable()
        .positive()
        .integer()
        .required("Debes seleccionar un Tipo de Consulta."),

      Cedula: Yup.string()
        .matches(/^\d{10}$/, "Debe ser un número de 10 dígitos")
        .required("Ingresa 10 digitos de la cedula"),
      // CodDactilar: Yup.string()
      //   .transform((value) => value.toUpperCase())
      //   .matches(
      //     /^[A-Z]\d{4}[A-Z]\d{4}$/,
      //     "El primer y sexto carácter deben ser letras"
      //   )
      //   .min(8, "Debe tener al menos 8 caracteres")
      //   .required("Revisa y coloca correctamente el código dactilar"),
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
      .trim()
      .test(
        "not-blacklisted",
        "El número ${value} se encuentra en la lista negra",
        async (value) => {
          if (!value) return false;            // ya cubierto por .required()
          const res = await comprobTelf(value);
          return res !== 1;                    // false → lanza el mensaje
        }
      ),


      Email: Yup.string().email("Correo inválido").required("Ingresa un correo válido"),

      idSituacionLaboral: Yup.number()
        .nullable()
        .positive()
        .integer()
        .required("Selecciona por favor la situación laboral"),
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

  const fetchActualizaSolicitud = async (idSolicitud, data) => {
    try {
      const url = APIURL.putUpdatesolicitud(idSolicitud);  // URL para actualizar la solicitud
      const response = await axios.put(url, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;  // Retornar datos actualizados si es necesario
    } catch (error) {
      console.error("Error al actualizar la solicitud:", error.message);
      throw error;  // Re-lanzar error para manejarlo más tarde
    }
  };

  const fecthDatosCogno = async (cedula) => {
    try {
      const url = APIURL.validarCedulaCognos(cedula);  // URL para obtener datos de Cogno
      const response = await axios.get(url);
      if (response.data) {
        return response.data;  // Devuelve los datos si la respuesta es exitosa
      }
      throw new Error("No se encontraron datos para la cédula proporcionada");
    } catch (error) {
      console.error("Error al obtener datos de Cogno:", error.message);
      throw error;  // Lanzar el error para manejarlo más tarde
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
      idSituacionLaboral: Number(values.idSituacionLaboral),
      idActEconomina: Number(values.idActEconomina),
      idCre_Tiempo: Number(values.idCre_Tiempo),
      idProductos: Number(values.idProductos),
      ApellidoMaterno: values.ApellidoMaterno?.trim().toUpperCase(),
      ApellidoPaterno: values.ApellidoPaterno?.trim().toUpperCase(),
      PrimerNombre: values.PrimerNombre?.trim().toUpperCase(),
      SegundoNombre: values.SegundoNombre?.trim().toUpperCase(),
      // CodDactilar: values.CodDactilar?.toUpperCase(),
      idCompraEncuesta: Number(values.idCompraEncuesta),
      idCre_TiempoVivienda: Number(values.idCre_TiempoVivienda),
      idEstadoVerificacionDocumental: 1,
      Usuario: userData?.Nombre
    };
    delete formattedValues.FechaNacimeinto;
    delete formattedValues.Edad;

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
            solicitudData.NumeroSolicitud,
            "FOTO",
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
      {loading && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center">
            <div className="mr-4">
              <div className="animate-spin rounded-full border-t-4 border-blue-500 w-12 h-12"></div>
            </div>
            <span className="text-lg font-semibold">Consultando cédula...</span>
          </div>
        </div>
      )}
      <ReusableForm
        formConfig={formConfig}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        includeButtons={true}
        columns={4}
        includeTermsAndConditions={true}
        formStatus={formStatus}
        enableReinitialize={true}
      />
    </div>
  );
}
