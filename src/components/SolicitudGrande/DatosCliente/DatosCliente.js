


export function DatosCliente() {

	const fields = [
		{label: "Nacionalidad", name: "Nacionalidad", type: "select", options: [{value: 0, label: "ECUATORIANO"}, {value: 1, label: "JAMAICANO"}, {value: 2, label: "PERUANO"}, {value: 3, label: "MEXICANO"}, {value: 4, label: "FILIPINO"}]},
		{label: "Fecha Nacimiento", name: "FechaNacimiento", type: "date"},
		{label: "Sexo", name: "Sexo", type: "select", options: [{value: 0, label: "FEMENINO"}, {value: 1, label: "MASCULINO"}]},
		{label: "Provincia Nacimiento", name: "ProvinciaNacimiento", type: "select", options: [{value: 0, label: "AZUAL"}, {value: 1, label: "BOLIVAR"}, {value: 1, label: "EL ORO"}]},
		{label: "Canton Nacimiento", name: "CantonNacimiento", type: "select", options: [{value: 0, label: "CALUMA"}, {value: 1, label: "CHILANES"}, {value: 1, label: "CHIMBO"}]},
		{label: "Estado Civil", name: "EstadoCivil", type: "select", options: [{value: 0, label: "SOLTERO"}, {value: 1, label: "CASADO"}]},
		{label: "Dependientes", name: "Dependientes", type: "number"},
		{label: "Nivel Educacion", name: "NivelEducacion", type: "select", options: [{value: 0, label: "POSGRADOS"}, {value: 1, label: "SIN TITULO"}]},
		{label: "Profesion", name: "Profesion", type: "select", options: [{value: 0, label: "ARQUITECTOS Y AFINES"}, {value: 1, label: "CIENCIAS ADMINISTRATIVAS"}]},
		{label: "Situacion Laboral", name: "SituacionLaboral", type: "select", options: [{value: 0, label: "DEPENDIENTE"}, {value: 1, label: "INDEPENDIENTE FORMAL"}, {value: 1, label: "INDEPENDIENTE INFORMAL"}]},
		{label: "Actividad Economica", name: "ActividadEconomica", type: "select", options: [{value: 0, label: "EMPLEADO PRIVADO"}, {value: 1, label: "EMPLEADO PUBLICO"}, {value: 1, label: "JUBILADO"}]}
	  ];

	const initialValues = {
		Nacionalidad : "",
		FechaNacimiento: "",
		Sexo: "",
		ProvinciaNacimiento: "",
		CantonNacimiento: "",
		EstadoCivil: "",
		Dependientes: "",
		NivelEducacion: "",
		Profesion: "",
		SituacionLaboral: "",
		ActividadEconomica: "",
		ObserbacionActividadEconomica: "",
	  };

	const fields1 = [
		{label: "Provincia", name: "Provincia", type: "select", options: [{value: 0, label: "BOLIVAR"}, {value: 1, label: "AZUAY"}]},
		{label: "Canton", name: "Canton", type: "select", options: [{value: 0, label: "ECUATORIANO"}, {value: 1, label: "JAMAICANO"}]},
		{label: "Parroquia", name: "Parroquia", type: "select", options: [{value: 0, label: "ECUATORIANO"}, {value: 1, label: "JAMAICANO"}]},
		{label: "Barrio", name: "Barrio", type: "select", options: [{value: 0, label: "ECUATORIANO"}, {value: 1, label: "JAMAICANO"}]},
		{label: "Email", name: "Email", type: "email"},
		{label: "Ubicacion-Trabajo", name: "UbicacionTrabajo", type: "button"},
		{label: "Ubicacion-Domicilio", name: "UbicacionDomicilio", type: "button"},
		{label: "Calle Principal", name: "CallePrincipal", type: "text"},
		{label: "Numero Casa", name: "NumeroCasa", type: "text"},
		{label: "Calle Secundaria", name: "CalleSecundaria", type: "text"},
		{label: "Referencia Ubicacion", name: "ReferenciaUbicacion", type: "text"},
		{label: "Telefono Casa 1", name: "TelefonoCasa1", type: "text"},
		{label: "Telefono Casa 2", name: "TelefonoCasa2", type: "text"},
		{label: "Celular CLiente", name: "CelularCLiente", type: "text"},
		{label: "Tipo Vivienda", name: "TipoVivienda", type: "select", options: [{value: 0, label: "ECUATORIANO"}, {value: 1, label: "JAMAICANO"}]},
		{label: "Tiempo Vivenda", name: "TiempoVivenda", type: "select", options: [{value: 0, label: "ECUATORIANO"}, {value: 1, label: "JAMAICANO"}]},
		{label: "Nombre Arrendador", name: "NombreArrendador", type: "text"},
		{label: "Telf Arrendador", name: "TelfArrendador", type: "text"},
		{label: "Celular Arrendador", name: "CelularArrendador", type: "text"},
		{label: "Inmueble", name: "Inmueble", type: "select", options: [{value: 0, label: "ECUATORIANO"}, {value: 1, label: "JAMAICANO"}]},
		{label: "Ciudad Inmueble", name: "CiudadInmueble", type: "select", options: [{value: 0, label: "ECUATORIANO"}, {value: 1, label: "JAMAICANO"}]},
		{label: "Valor Inmueble", name: "ValorInmueble", type: "text"}
];

	const initialValues1 = {
		Provincia: "",
		Canton: "",
		Parroquia: "",
		Barrio: "",
		Email: "",
		CallePrincipal: "",
		NumeroCasa: "",
		CalleSecundaria: "",
		ReferenciaUbicacion: "",
		TelefonoCasa1: "",
		TelefonoCasa2: "",
		CelularCLiente: "",
		TipoVivienda: "",
		TiempoVivenda: "",
		NombreArrendador: "",
		TelefArrendador: "",
		CelularArrendador: "",
		Inmueble: "",
		CiudadInmueble: "",
		ValorInmueble: "",
	};
  

	return (
		<>

		<div className="py-2 w-full">
		  <form className="grid gap-4 grid-cols-1 md:grid-cols-4">
			{fields.map((field, index) => (
			  <div key={index} className="col-span-1">
				<label className="block text-sm font-medium">{field.label}</label>
				{field.type === "select" ? (
				  <select className="block bg-[#F9FAFB] w-64 max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm">
					{field.options.map((option, idx) => (
			
					  <option key={idx} value={option.value}>
						{option.label}
					  </option>
					))}
				  </select>
				) : (
				  <input type={field.type} className="block bg-[#F9FAFB] w-64 max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm" />
				)}
			  </div>
			))}
		  </form>
		</div>
		
		<div className="py-2 w-full">
		<form className="grid gap-4 grid-cols-1 md:grid-cols-4">
		  {fields1.map((field, index) => (
			<div key={index} className="col-span-1">
			  <label className="block text-sm font-medium">{field.label}</label>
			  {field.type === "select" ? (
				<select className="block bg-[#F9FAFB] w-64 max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm">
				  {field.options.map((option, idx) => (
		  
					<option key={idx} value={option.value}>
					  {option.label}
					</option>
				  ))}
				</select>
			  ) : (
				<input type={field.type} className="block bg-[#F9FAFB] w-64 max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm" />
			  )}
			</div>
		  ))}
		</form>
	  </div>

		</>
	  );
}
