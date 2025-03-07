export const fields = (nivelEducacion, profesion) => [
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
    options: nivelEducacion,
  },
  {
    label: "Profesion",
    name: "Profesion",
    type: "select",
    options: profesion,
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

export const fields1 = (provincia , cantones, parroquias, barrios) => [
  {
    label: "Provincia",
    name: "Provincia",
    type: "select",
    options: provincia,
  },
  {
    label: "Canton",
    name: "Canton",
    type: "select",
    options: cantones,
  },
  {
    label: "Parroquia",
    name: "Parroquia",
    type: "select",
    options: parroquias,
  },
  {
    label: "Barrio",
    name: "Barrio",
    type: "select",
    options: barrios,
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

export const fields2 = [
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
