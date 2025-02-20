import { useEffect, useState } from "react";
import ReusableForm from "../../FormField";
import * as Yup from "yup";
import { APIURL } from "../../../configApi/apiConfig";
import axios from 'axios';

export default function CreditoForm() {
  const [actividadLaboral, setActividadLaboral] = useState([]);
  const [estabilidadLaboral, setEstabilidadLaboral] = useState([]);

  const handleActividadLaboralSelect = async (e) => {
    const selectedValue = e;
    console.log(selectedValue);
  };
  const handleEstabilidadLaboralSelect = async (e) => {
	const selectedValue = e;
	console.log(selectedValue);
  };

  const handleProcudctoSelect = async (e) => {
	const selectedValue = e;
	console.log(selectedValue);
  };

  const fetchEstabilidadLaboral = async () => {
    try {
      const response = await axios.get(APIURL.getEstabilidadLaboral(), {
        headers: { method: "GET", cache: "no-store" },
      });
	  console.log(response.data);
      setEstabilidadLaboral(
        response.data.map((item) => ({ value: item.idCre_Tiempo, label: item.Descripcion }))
      );
    } catch (error) {
      console.error("Error al obtener estabilidad laboral", error);
      setEstabilidadLaboral([]);
    }
  };

  const fetchActividadLaboral = async () => {
    try {
      const response = await axios.get(APIURL.getActividadEconomina(), {
        headers: { method: "GET", cache: "no-store" },
      });
      setActividadLaboral(
        response.data.map((item) => ({ value: item.idActEconomica, label: item.Nombre }))
      );
    } catch (error) {
      console.error("Error al obtener actividad laboral", error);
      setActividadLaboral([]);
    }
  };

  useEffect(() => {
    fetchEstabilidadLaboral();
    fetchActividadLaboral();
  }, []);

  if (!actividadLaboral || actividadLaboral.length === 0) {
    return <p>No se pudo cargar la actividad laboral...</p>;
  } else {
    console.log(actividadLaboral);
  }

  const formConfig = [
    {
      label: "Tipo de Consulta",
      name: "tipoConsulta",
      type: "select",
      options: [
        { value: "credito", label: "Crédito" },
        { value: "prestamo", label: "Préstamo" },
      ],
    },
    { label: "Identificación", name: "identificacion", type: "text" },
    { label: "Código Dactilar", name: "codigoDactilar", type: "text" },
    { label: "Nombres", name: "nombres", type: "text" },
    { label: "Apellidos", name: "apellidos", type: "text" },
    { label: "Celular", name: "celular", type: "text" },
    { label: "Email", name: "email", type: "email" },
	{ label: "", name: "foto", type: "file" },
    {
      label: "Actividad Laboral",
      name: "actividadLaboral",
      type: "select",
      options: actividadLaboral,
      onchange: (e) => handleEstabilidadLaboralSelect(e),
    },
    {
      label: "Estabilidad Laboral",
      name: "estabilidadLaboral",
      type: "select",
      options: estabilidadLaboral,
      onchange: (e) => handleActividadLaboralSelect(e),
    },
    { label: "Estado", name: "estado", type: "text" },
    {
		label: "Producto",
		name: "producto",
		type: "select",
		options: [
		  { value: "celular", label: "Celular" },
		  { value: "otro", label: "Otro" }
		],
		onchange: (e) => handleProcudctoSelect(e)
	  },
    { label: "Código", name: "codigo", type: "text" },
    { label: "Validación", name: "validacion", type: "text" },
	{ label: "Afiliado", name: "afiliado", type: "switch" },
    { label: "Tiene RUC?", name: "tieneRUC", type: "switch" },
  ];

  const validationSchema = Yup.object().shape({
    identificacion: Yup.string()
      .matches(/^\d{10}$/, "Debe ser un número de 10 dígitos")
      .required("Campo requerido"),
    codigoDactilar: Yup.string().required("Campo requerido"),
    nombres: Yup.string()
      .min(2, "Debe tener al menos 2 caracteres")
      .required("Campo requerido"),
	  apellidos: Yup.string()
      .min(2, "Debe tener al menos 2 caracteres")
      .required("Campo requerido"),
    email: Yup.string().email("Correo inválido").required("Campo requerido"),
    celular: Yup.string()
      .matches(/^\d{10}$/, "Debe ser un número de 10 dígitos")
      .required("Campo requerido"),
    actividadLaboral: Yup.string().required("Campo requerido"),
    estabilidadLaboral: Yup.string().required("Campo requerido"),
	afiliado: Yup.boolean().required("Campo requerido"),
    tieneRUC: Yup.boolean().required("Campo requerido"),
    estado: Yup.string().required("Campo requerido"),
    producto: Yup.string().required("Campo requerido"),
    codigo: Yup.string().required("Campo requerido"),
    validacion: Yup.string().required("Campo requerido"),
    foto: Yup.mixed().required("Campo requerido"),
  });               

  const initialValues = {
    identificacion: "",
    nombres: "",
    apellidos: "",
    email: "",
    celular: "",
    actividadLaboral: "",
    estabilidadLaboral: "",
    afiliado: false,
    tieneRUC: false,
    estado: "",
    producto: "",
    codigo: "",
    validacion: "",
    foto: "",
	acceptance: false,
  };

  const handleCancel = () => {
    console.log("Formulario cancelado");
  };

  const handleSubmit = (values) => {
    console.log("Valores enviados:", values);
    // const result = WEB_Crear_Solicitud(values);

    // if (!result) {
    //   console.error("Error al enviar la solicitud");
    // }
    // alert("Solicitud enviada con exito");
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
      />
    </div>
  );
}