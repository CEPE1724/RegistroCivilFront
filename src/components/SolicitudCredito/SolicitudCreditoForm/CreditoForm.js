import { useEffect, useState } from "react";
import ReusableForm from "../../FormField";
// import WEB_ActividadLaboral from "./services";
import * as Yup from "yup";

export default function CreditoForm() {

	const [actividadLaboral, setActividadLaboral] = useState([]);	

	const handleActividadLaboralSelect = async (e) => {
		const selectedValue = e.target.value;
		console.log(selectedValue);
	  }

	  const fectchActividadLaboral = async () => {
		// const result = await WEB_ActividadLaboral();
		const result = [
			{
				"idSituacionLaboral": 1,
				"Descripcion": "DEPENDIENTE"
			},
			{
				"idSituacionLaboral": 2,
				"Descripcion": "INDEPENDIENTE INFORMAL"
			},
			{
				"idSituacionLaboral": 5,
				"Descripcion": "INDEPENDIENTE FORMAL"
			}
		];

		if (!result) {
		  console.error("Error al obtener la actividad laboral");
		}
		const actividadL = result.map((option) => ({
		  value: option.idSituacionLaboral,
		  label: option.Descripcion,
		}));
	
		setActividadLaboral(actividadL);
	
	  };

	  useEffect(() => {
		fectchActividadLaboral();
	  }, []);
	
	  if (!actividadLaboral) {
		return <p>No se pudo cargar la actividad laboral...</p>;
	  } else {
		console.log(actividadLaboral);
	  }

	const formConfig = [
    {
      label: "Tipo de Consulta",
      name: "tipoConsulta",
      type: "select",
      options: ["consulta", "consulta", "consulta"],
    },
    { label: "Identificación", name: "identificacion", type: "text" },
    { label: "Codigo Dactilar", name: "codigoDactilar", type: "text" },
    { label: "Nombre Completo", name: "nombreCompleto", type: "text" },
    { label: "Nombres", name: "nombres", type: "text" },
	{ label: "Apellidos", name: "apellidos", type: "text" },
	{ label: "Celular", name: "celular", type: "text" },
    { label: "Email", name: "email", type: "email" },
    {
      label: "Actividad Laboral",
      name: "actividadLaboral",
      type: "select",
      options: actividadLaboral,
      onchange: (e) => handleActividadLaboralSelect(e),
    },
	{ label: "Estabilidad Laboral",
		name: "estabilidadLaboral",
		type: "text",
		options: ["1", "2", "3"]
	},
	{ label: "Afiliado", name: "afiliado", type: "switch" },
    { label: "Tiene RUC?", name: "tieneRUC", type: "switch" },
	{ label: "Estado", name: "estado", type: "int" },
	{ label: "Producto",
		name: "producto",
		type: "text",
		options: ["Celular", "Otros"]
	},
	{ label: "Codigo", name: "codigo", type: "text" },
	{ label: "Validacion", name: "validacion", type: "text" },
  ];

  const validationSchema = Yup.object().shape({
    identificacion: Yup.string()
      .matches(/^\d{10}$/, "Debe ser un número de 10 dígitos")
      .required("Campo requerido"),
    nombreCompleto: Yup.string().required("Campo requerido"),
    email: Yup.string().email("Correo inválido").required("Campo requerido"),
    telefono: Yup.string()
      .matches(/^\d{10}$/, "Debe ser un número de 10 dígitos")
      .required("Campo requerido"),
    actividadLaboral: Yup.string().required("Campo requerido"),
    estabilidadLaboral: Yup.string().required("Campo requerido"),
  });

  const initialValues = {
    identificacion: "",
    nombreCompleto: "",
    email: "",
    telefono: "",
    tieneIESS: false,
    tieneRUC: false,
    actividadLaboral: "",
    estabilidadLaboral: ""
  };

  const handleSubmit = (values) => {
    console.log("Datos enviados:", values);
	// const result = WEB_Crear_Solicitud(values);

	// if (!result) {
	//   console.error("Error al enviar la solicitud");
	// }
	// alert("Solicitud enviada con exito");
  };

  const handleCancel = () => {
    console.log("Formulario cancelado");
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
			columns={2}
			includeTermsAndConditions={true}
			/>
		</div>
	);
}