import { useEffect, useState } from "react";
import ReusableForm from "../../FormField";
import * as Yup from "yup";
import { APIURL } from "../../../configApi/apiConfig";
import axios from "axios";
import { useSnackbar } from "notistack";
import { set } from "react-hook-form";

export default function CreditoForm() {
  const [actividadLaboral, setActividadLaboral] = useState([]);
  const [estabilidadLaboral, setEstabilidadLaboral] = useState([]);
  const [tipoConsulta, setTipoConsulta] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [prevErrors, setPrevErrors] = useState({});
  const [formStatus, setFormStatus] = useState(null);


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
    } catch (error) {
      console.error("Error al obtener estabilidad laboral", error);
	  enqueueSnackbar("Error al cargar estabilidad laboral", { variant: "error", preventDuplicate: true });
      setEstabilidadLaboral([]);
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
      const response = await axios.get(APIURL.get_TipoConsulta(), {
        headers: { method: "GET", cache: "no-store" },
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
  }, []);

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
    Apellidos: "",
    Nombres: "",
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
      label: "Tipo de Consulta",
      name: "idCompraEncuesta",
      type: "select",
      options: tipoConsulta,
    },

    { label: "Cédula", name: "Cedula", type: "text" },
    { label: "Código Dactilar", name: "CodDactilar", type: "text" },
    { label: "Apellidos", name: "Apellidos", type: "text" },
    { label: "Nombres", name: "Nombres", type: "text" },
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

    { label: "Afiliado", name: "bAfiliado", type: "switch" },
    { label: "Tiene RUC?", name: "bTieneRuc", type: "switch" },

    { label: "Foto", name: "Foto", type: "file" },

    {
      label: "Producto",
      name: "idProductos",
      type: "select",
      options: [
        { value: 789, label: "CELULAR" },
        { value: 2, label: "OTRO" },
      ],
    },
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
        .required("Campo requerido"),

      Cedula: Yup.string()
        .matches(/^\d{10}$/, "Debe ser un número de 10 dígitos")
        .required("Campo requerido"),
      CodDactilar: Yup.string()
        .matches(
          /^[A-Z]\d{4}[A-Z]\d{4}$/,
          "El primer y sexto carácter deben ser letras"
        )
        .min(8, "Debe tener al menos 8 caracteres")
        .required("Campo requerido"),
		Apellidos: Yup.string()
		.trim()
		.min(2, "Debe tener al menos 2 caracteres")
		.matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, "Solo se permiten letras y espacios")
		.test("no-espacios", "No puede estar vacío", (value) => value && value.trim() !== "")
		.required("Campo requerido"),
	  Nombres: Yup.string()
		.trim()
		.min(2, "Debe tener al menos 2 caracteres")
		.matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, "Solo se permiten letras y espacios")
		.test("no-espacios", "No puede estar vacío", (value) => value && value.trim() !== "")
		.required("Campo requerido"),
      Celular: Yup.string()
        .matches(/^\d{10}$/, "Debe ser un número de 10 dígitos")
        .required("Campo requerido")
        .trim(),
      Email: Yup.string().email("Correo inválido").required("Campo requerido"),

      idActEconomina: Yup.number()
        .nullable()
        .positive("Debe ser un número positivo")
        .integer("Debe ser un número entero")
        .required("Campo requerido"),
      idCre_Tiempo: Yup.number()
        .positive("Debe ser un número positivo")
        .integer("Debe ser un número entero")
        .required("Campo requerido"),

      bAfiliado: Yup.boolean(),
      bTieneRuc: Yup.boolean(),
      Foto: Yup.string().min(5, "Debe tener al menos 5 caracteres").required("Campo requerido"),

      bTerminosYCondiciones: Yup.boolean().required(),
    
      bPoliticas: Yup.boolean().required(),

      idProductos: Yup.number()
        .nullable()
        .positive("Debe ser un número positivo")
        .integer()
        .required("Campo requerido"),
    })
    .test(
      "at-least-one-switch",
      "Debe seleccionar al menos una opción (Afiliado o Tiene RUC)",
      function (values) {
        return values.bAfiliado || values.bTieneRuc;
      }
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

  const handleSubmit = async (values) => {
	
    const formattedValues = {
      ...values,
      idActEconomina: Number(values.idActEconomina),
      idCre_Tiempo: Number(values.idCre_Tiempo),
      idProductos: Number(values.idProductos),
      Nombres: values.Nombres?.trim().toUpperCase(),
      Apellidos: values.Apellidos?.trim().toUpperCase(),
      CodDactilar: values.CodDactilar?.toUpperCase(),
      idCompraEncuesta: Number(values.idCompraEncuesta),
    };
    console.log(formattedValues);

    try {
      const response = await axios.post(
        APIURL.post_cre_solicitud_web(),
        formattedValues,
        {
          headers: { method: "POST", cache: "no-store" },
        }
      );

      const response_cogno = await axios.post(
        APIURL.post_cogno_Token(formattedValues.Cedula?.trim()),
        {},
        {
          headers: { method: "POST", cache: "no-store" },
        }
      );
	  enqueueSnackbar("Solicitud guardada con exito", { variant: "success", preventDuplicate: true });
	  setFormStatus("success");
    } catch (error) {
      console.error("Error al enviar los datos:", error);
	  enqueueSnackbar(`Error al enviar los datos. Por favor revisa que todos los campos sean correctos`, { 
		variant: "error",
		preventDuplicate: true
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
