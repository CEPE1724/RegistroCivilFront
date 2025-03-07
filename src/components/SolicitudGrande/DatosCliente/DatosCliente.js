
export function DatosCliente() {
  const fields = [
    {
      label: "Nacionalidad",
      name: "Nacionalidad",
      type: "select",
      options: [
        { value: 0, label: "ECUATORIANO" },
        { value: 1, label: "JAMAICANO" },
        { value: 2, label: "PERUANO" },
        { value: 3, label: "MEXICANO" },
        { value: 4, label: "FILIPINO" },
      ],
    },
    { label: "Fecha Nacimiento", name: "FechaNacimiento", type: "date" },
    {
      label: "Género",
      name: "Genero",
      type: "select",
      options: [
        { value: 0, label: "FEMENINO" },
        { value: 1, label: "MASCULINO" },
      ],
    },
    {
      label: "Provincia Nacimiento",
      name: "ProvinciaNacimiento",
      type: "select",
      options: [
        { value: 0, label: "AZUAL" },
        { value: 1, label: "BOLIVAR" },
        { value: 1, label: "EL ORO" },
      ],
    },
    {
      label: "Canton Nacimiento",
      name: "CantonNacimiento",
      type: "select",
      options: [
        { value: 0, label: "CALUMA" },
        { value: 1, label: "CHILANES" },
        { value: 1, label: "CHIMBO" },
      ],
    },
    {
      label: "Estado Civil",
      name: "EstadoCivil",
      type: "select",
      options: [
        { value: 0, label: "SOLTERO" },
        { value: 1, label: "CASADO" },
      ],
    },
    { label: "Dependientes", name: "Dependientes", type: "number" },
    {
      label: "Nivel Educacion",
      name: "NivelEducacion",
      type: "select",
      options: [
        { value: 0, label: "POSGRADOS" },
        { value: 1, label: "SIN TITULO" },
      ],
    },
    {
      label: "Profesion",
      name: "Profesion",
      type: "select",
      options: [
        { value: 0, label: "ARQUITECTOS Y AFINES" },
        { value: 1, label: "CIENCIAS ADMINISTRATIVAS" },
      ],
    },
    {
      label: "Situacion Laboral",
      name: "SituacionLaboral",
      type: "select",
      options: [
        { value: 0, label: "DEPENDIENTE" },
        { value: 1, label: "INDEPENDIENTE FORMAL" },
        { value: 1, label: "INDEPENDIENTE INFORMAL" },
      ],
    },
    {
      label: "Actividad Economica",
      name: "ActividadEconomica",
      type: "select",
      options: [
        { value: 0, label: "EMPLEADO PRIVADO" },
        { value: 1, label: "EMPLEADO PUBLICO" },
        { value: 1, label: "JUBILADO" },
      ],
    },
    {
      label: "Obserbacion Actividad Economica",
      name: "ActividadEconomica",
      type: "select",
      options: [
        { value: 0, label: "EMPLEADO PRIVADO" },
        { value: 1, label: "EMPLEADO PUBLICO" },
        { value: 1, label: "JUBILADO" },
      ],
    },
  ];

  const fields1 = [
    {
      label: "Provincia",
      name: "Provincia",
      type: "select",
      options: [
        { value: 0, label: "BOLIVAR" },
        { value: 1, label: "AZUAY" },
      ],
    },
    {
      label: "Canton",
      name: "Canton",
      type: "select",
      options: [
        { value: 0, label: "ECUATORIANO" },
        { value: 1, label: "JAMAICANO" },
      ],
    },
    {
      label: "Parroquia",
      name: "Parroquia",
      type: "select",
      options: [
        { value: 0, label: "ECUATORIANO" },
        { value: 1, label: "JAMAICANO" },
      ],
    },
    {
      label: "Barrio",
      name: "Barrio",
      type: "select",
      options: [
        { value: 0, label: "ECUATORIANO" },
        { value: 1, label: "JAMAICANO" },
      ],
    },

    { label: "Calle Principal", name: "CallePrincipal", type: "text" },
    { label: "Numero Casa", name: "NumeroCasa", type: "text" },
    { label: "Calle Secundaria", name: "CalleSecundaria", type: "text" },
	{ label: "Ubicacion Domicilio", name: "ubicacionDomicilio", type: "button" },
	{
		label: "Referencia Ubicacion",
		name: "ReferenciaUbicacion",
		type: "text",
	  },
	  { label: "Telefono Casa", name: "TelefonoCasa", type: "text" },
  ];

  const fields2 = [
    {
      label: "Tipo Vivienda",
      name: "TipoVivienda",
      type: "select",
      options: [
        { value: 0, label: "ECUATORIANO" },
        { value: 1, label: "JAMAICANO" },
      ],
    },
    {
      label: "Tiempo Vivenda",
      name: "TiempoVivenda",
      type: "select",
      options: [
        { value: 0, label: "ECUATORIANO" },
        { value: 1, label: "JAMAICANO" },
      ],
    },
    { label: "Nombre Arrendador", name: "NombreArrendador", type: "text" },
    { label: "Telf Arrendador", name: "TelfArrendador", type: "text" },
    { label: "Celular Arrendador", name: "CelularArrendador", type: "text" },
    {
      label: "Inmueble",
      name: "Inmueble",
      type: "select",
      options: [
        { value: 0, label: "ECUATORIANO" },
        { value: 1, label: "JAMAICANO" },
      ],
    },
    {
      label: "Ciudad Inmueble",
      name: "CiudadInmueble",
      type: "select",
      options: [
        { value: 0, label: "ECUATORIANO" },
        { value: 1, label: "JAMAICANO" },
      ],
    },
    { label: "Valor Inmueble", name: "ValorInmueble", type: "text" },
  ];

  return (
    <>
      <div className="py-2 w-full">
        <form className="grid gap-4 grid-cols-5 md:grid-cols-5">
          {fields.map((field, index) => (
            <div key={index} className="col-span-1">
              <label className="block text-sm font-medium">{field.label}</label>
              {field.type === "select" ? (
                <select className="block bg-[#F9FAFB] w-full max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm">
                  {field.options.map((option, idx) => (
                    <option key={idx} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  className="block bg-[#F9FAFB] w-full max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                />
              )}
            </div>
          ))}
        </form>
      </div>

      <div className="py-2 w-full">
        <form className="grid gap-4 grid-cols-4 md:grid-cols-4">
          {fields1.map((field, index) => (
            <div key={index} className="col-span-1">
              <label className="block text-sm font-medium">{field.label}</label>
              {field.type === "select" ? (
                <select className="block bg-[#F9FAFB] w-full max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm">
                  {field.options.map((option, idx) => (
                    <option key={idx} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : field.type === "button" ? ( 
                <button
                  type="button"
                  className="rounded-full hover:shadow-md transition duration-300 ease-in-out group bg-primaryBlue text-white border border-white hover:bg-white hover:text-primaryBlue hover:border-primaryBlue text-xs px-6 py-2.5 mb-4"
                >
                  {field.label}
                </button>
              ) : (
                <input
                  type={field.type}
                  className="block bg-[#F9FAFB] w-full max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                />
              )}
            </div>
          ))}
        </form>
      </div>

      <div className="py-2 w-full">
        <form className="grid gap-4 grid-cols-4 md:grid-cols-4">
          {fields2.map((field, index) => (
            <div key={index} className="col-span-1">
              <label className="block text-sm font-medium">{field.label}</label>
              {field.type === "select" ? (
                <select className="block bg-[#F9FAFB] w-full max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm">
                  {field.options.map((option, idx) => (
                    <option key={idx} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  className="block bg-[#F9FAFB] w-full max-w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                />
              )}
            </div>
          ))}
        </form>
      </div>
    </>
  );
}
