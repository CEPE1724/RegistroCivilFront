import React, { useState, useEffect, forwardRef } from "react";
import { useSnackbar } from "notistack";

import axios from "axios";
import { APIURL } from "../../../configApi/apiConfig";
import {
  FaUserFriends, FaUser, FaMapMarkerAlt, FaMobileAlt,
  FaPlus, FaTimes, FaPhoneAlt, FaCog, FaCommentDots
} from "react-icons/fa";
import { useAuth } from "../../AuthContext/AuthContext";
const Referencias = forwardRef((props, ref) => {
  const { userData, userUsuario } = useAuth();
  const { data } = props;
  const { enqueueSnackbar } = useSnackbar();
  const [datoParentesco, setDatoParentesco] = useState([]);  //estado parentesco
  const [datoProvincia, setDatoProvincia] = useState([]);    //estado provincias
  const [datoCanton, setDatoCanton] = useState([]);          //estado cantones
  const [idToTextMap, setIdToTextMap] = useState({});   //estado para mapear IDs a textos de api parentesco
  const [idToTextMapProvincia, setIdToTextMapProvincia] = useState({});   //IDs a textos provincias
  const [idToTextMapCanton, setIdToTextMapCanton] = useState({});   //IDs a textos cantones
  const [selectedRow, setSelectedRow] = useState(null);
  const [tablaModal, setTablaModal] = useState([]);   //estado datos tabla modal
  const [datoEstado, setDatoEstado] = useState([]);  //estado para api estado
  const [idToTextMapEstado, setIdToTextMapEstado] = useState({});   //estado para mapear IDs a textos de api estado
  const [referencias, setReferencias] = useState([]);  //estado para almacenar referencias
  //almacenar datos del formulario
  const [formData, setFormData] = useState({
    parentesco: "",
    apellidoPaterno: "",
    primerNombre: "",
    segundoNombre: "",
    provincia: "",
    canton: "",
    celular: "",
  });

  //almacenar datos modal
  const [formDataModal, setFormDataModal] = useState({
    contactoEfectivo: "",
    estado: "",
    observaciones: "",
  });

  const SearchData = async (id) => {
    try {
      const url = APIURL.get_cre_referenciasclientesweb_id(id);
      const response = await axios.get(url);
      setReferencias(response.data);
    } catch (error) {
      console.error("Error al buscar los datos:", error);
    }
  };
  //api parentesco
  useEffect(() => {
    if (data.idCre_SolicitudWeb) {
      SearchData(data.idCre_SolicitudWeb);
    }
    fetchDato();
    fetchDatoProvincia();

  }, [data.idCre_SolicitudWeb]);

  const fetchDato = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = APIURL.getParentesco();
      const response = await axios.get(url,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDatoParentesco(response.data);

      //objeto para mapear IDs a textos
      const idToTextMap = {};
      response.data.forEach(item => {
        idToTextMap[item.idParentesco] = item.Nombre;
      });
      setIdToTextMap(idToTextMap); // Guardar el objeto en el estado
    } catch (error) {
      enqueueSnackbar("Error fetching Dato: " + error.message, {
        variant: "error",
      });
    }
  };



  const fetchDatoProvincia = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = APIURL.getProvincias();
      const response = await axios.get(url,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDatoProvincia(response.data);
      //objeto para mapear IDs a textos
      const idToTextMapProvincia = {};
      response.data.forEach(item => {
        idToTextMapProvincia[item.idProvincia] = item.Nombre;
      });
      setIdToTextMapProvincia(idToTextMapProvincia); // Guardar el objeto en el estado
    } catch (error) {
      enqueueSnackbar("Error fetching Dato: " + error.message, {
        variant: "error",
      });
    }
  }

  //api cantones
  useEffect(() => {
    if (formData.provincia) {
      fetchDatoCanton(formData.provincia);
    }
  }, [formData.provincia]);  // Dependencia

  const fetchDatoCanton = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const url = APIURL.getCantones(id);
      const response = await axios.get(url,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDatoCanton(response.data);
      //objeto para mapear IDs a textos
      const newMapping = { ...idToTextMapCanton };
      response.data.forEach(item => {
        newMapping[item.idCanton] = item.Nombre;
      });
      setIdToTextMapCanton(newMapping); // Guardar el objeto en el estado
    } catch (error) {
      enqueueSnackbar("Error fetching Dato: " + error.message, {
        variant: "error",
      });
    }
  }

  //api estado
  useEffect(() => {
    fetchDatoEstado();
  }, []);

  const fetchDatoEstado = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = APIURL.getEstadoReferencia();
      const response = await axios.get(url,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDatoEstado(response.data);
      //objeto para mapear IDs a textos
      const idToTextMapEstado = {};
      response.data.forEach(item => {
        idToTextMapEstado[item.idEstadoGestns] = item.DESCRIPCION;
      });
      setIdToTextMapEstado(idToTextMapEstado); // Guardar el objeto en el estado
    } catch (error) {
      enqueueSnackbar("Error fetching Dato: " + error.message, {
        variant: "error",
      });
    }
  }

  //api enviar datos modal


  //almacenar datos tabla
  const [tablaDatos, setTablaDatos] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "provincia") {
      setFormData(prev => ({
        ...prev,
        provincia: value,
        canton: ""  // Resetear cantón al cambiar provincia
      }));
      return;
    }

    if (name === "apellidoPaterno" || name === "primerNombre" || name === "segundoNombre") {
      // Solo letras
      const filteredValue = value.replace(/[^A-Za-z]/g, '');
      setFormData({ ...formData, [name]: filteredValue });
    } else if (name === "celular") {
      // Solo números
      const filteredValue = value.replace(/\D/g, ''); // Eliminar caracteres no numéricos
      setFormData({ ...formData, [name]: filteredValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };


  const handleLimpiar = () => {
    setFormData({
      parentesco: "",
      apellidoPaterno: "",
      primerNombre: "",
      segundoNombre: "",
      provincia: "",
      canton: "",
      celular: "",
    });
  };

  const handleLimpiarModal = () => {
    setFormDataModal({
      contactoEfectivo: "",
      estado: "",
      observaciones: "",
    });
  };

  const handleAgregar = () => {
    // Validar campos
    if (formData.parentesco === "") {
      enqueueSnackbar("Parentesco es requerido", { variant: "error" });
      return;
    }
    if (formData.apellidoPaterno.length < 3) {
      enqueueSnackbar("Apellido Paterno es requerido", { variant: "error" });
      return;
    }
    if (formData.primerNombre.length < 3) {
      enqueueSnackbar("Primer Nombre es requerido", { variant: "error" });
      return;
    }
    if (formData.provincia === "") {
      enqueueSnackbar("Provincia es requerido", { variant: "error" });
      return;
    }
    if (formData.canton === "") {
      enqueueSnackbar("Cantón es requerido", { variant: "error" });
      return;
    }
    if (formData.celular.length < 10) {
      enqueueSnackbar("Celular debe tener 10 dígitos", { variant: "error" });
      return;
    }
    const celularExistente = tablaDatos.some((row) => row.celular === formData.celular);
    if (celularExistente) {
      enqueueSnackbar("El celular ya existe", { variant: "error" });
      return;
    }
    const newReferencia = { ...formData };
    fecthSave(newReferencia);
    setTablaDatos(prevDatos => [...prevDatos, newReferencia]);
    const currentCantonId = formData.canton;
    const currentProvinciaId = formData.provincia;
    setFormData({
      parentesco: "",
      apellidoPaterno: "",
      primerNombre: "",
      segundoNombre: "",
      provincia: "",
      canton: "",
      celular: "",
    });
    if (currentProvinciaId) {
      fetchDatoCanton(currentProvinciaId);
    }

    fetchInsertarDatos(); // Llamar a la función para insertar datos

    //setTablaDatos([...tablaDatos, formData]);
    enqueueSnackbar("Datos Guardados", { variant: "success" });
    
    //handleLimpiar();  Limpia el formulario para agregar otro registro
  };

  const fetchInsertarDatos = async () => {
    try {
      const url = APIURL.post_createtiemposolicitudeswebDto();

      await axios.post(url, {

        idCre_SolicitudWeb: data.idCre_SolicitudWeb,
        Tipo: 1,
        idEstadoVerificacionDocumental: 5,
        Usuario: userData.Nombre,
      });
    } catch (error) {
      console.error("Error al guardar los datos del cliente", error);
    }
  };

  const fecthSave = async (formData) => {
    try {
      const url = APIURL.post_cre_referenciasclientesweb();
      console.log("URL:", url);
      const getParsedValue = (value) => (value ? parseInt(value) : null);

      const response = await axios.post(
        url,
        {
          idCre_SolicitudWeb: data.idCre_SolicitudWeb,
          idParentesco: getParsedValue(formData.parentesco),
          ApellidoPaterno: formData.apellidoPaterno,
          PrimerNombre: formData.primerNombre,
          idProvincia: getParsedValue(formData.provincia),
          idCanton: getParsedValue(formData.canton),
          Celular: formData.celular,
          Usuario: "Usuario"

        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Datos de nacimiento guardados correctamente:", response.data);

      // Si todo sale bien
      enqueueSnackbar("Datos de nacimiento guardados correctamente.", { variant: "success" });
    } catch (error) {
      // Si ocurre algún error
      enqueueSnackbar("Error al guardar los datos de nacimiento.", { variant: "error" });
      console.error("Error al guardar los datos de nacimiento", error);
    }
  };



  // Obtener fecha y hora actual
  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`; // Formato YYYY-MM-DD HH:mm:ss
  };

  const handleGuardarModal = () => {
    if (formDataModal.contactoEfectivo.length < 5) {
      enqueueSnackbar("Contacto Efectivo es requerido", { variant: "error" });
      return;
    }
    if (!formDataModal.estado) {
      enqueueSnackbar("Estado es requerido", { variant: "error" });
      return;
    }
    if (formDataModal.observaciones.length < 10) {
      enqueueSnackbar("Observaciones son requeridas (Mínimo 10 caracteres)", { variant: "error" });
      return;
    }
    //objeto de datos que se enviará a la API
    const datosParaEnviar = {
      Fecha: getCurrentDateTime(), // Fecha 
      Telefono: selectedRow.celular, // Celular 
      Contacto: formDataModal.contactoEfectivo, // Contacto efectivo
      idParentesco: Number(selectedRow.parentesco), // parentesco/referencia
      idEstadoGestns: Number(formDataModal.estado), // estado
      Observaciones: formDataModal.observaciones, // Observaciones
      ClienteGarante: false, // Valor por defecto
      Origen: 1, // Valor por defecto
      idCre_Solicitud: 1, // Valor por defecto 
      Estado: true, // Valor por defecto
      NotasDelSistema: "Notas del sistema", // Valor por defecto
      Usuario: "Usuario", // Valor por defecto
      Indice: 1, // Valor por defecto
      Web: 1, // Valor por defecto
    };
    console.log("Datos a enviar:", datosParaEnviar);


    // Guardar el registro para mostrar los datos en la tabla del modal
    const nuevoRegistro = {
      fecha: datosParaEnviar.Fecha,
      celularMod: datosParaEnviar.Telefono,
      contactoEfectivo: datosParaEnviar.Contacto,
      referencia: idToTextMap[selectedRow.parentesco],
      estado: datosParaEnviar.idEstadoGestns,
      observaciones: formDataModal.observaciones,
    };

    setTablaModal([...tablaModal, nuevoRegistro]);
    enqueueSnackbar("Registro Guardado", { variant: "success" });
    handleLimpiarModal();
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {/* Parentesco */}
        <div className="flex flex-col">
          <label className="text-xs font-medium mb-1 flex items-center">
            <FaUserFriends className="mr-2 text-primaryBlue" />
            Parentesco(*)
          </label>
          <select
            name="parentesco"
            className="solcitudgrande-style"
            value={formData.parentesco}
            onChange={handleChange}
          >
            <option value="">Seleccione una opción</option>
            {datoParentesco.map((opcion) => (
              <option key={opcion.idParentesco} value={opcion.idParentesco}>
                {opcion.Nombre}
              </option>
            ))}
          </select>
        </div>
        {/* Apellido Paterno */}
        <div className="flex flex-col">
          <label className="text-xs font-medium mb-1 flex items-center">
            <FaUser className="mr-2 text-primaryBlue" />
            Apellido Paterno(*)
          </label>
          <input
            type="text"
            name="apellidoPaterno"
            autoComplete="off"
            placeholder="Apellido Paterno"
            className="solcitudgrande-style"
            value={formData.apellidoPaterno}
            onChange={handleChange}
            pattern="[A-Za-z]+"
            title="Solo se permiten letras"
          />
        </div>
        {/* Primer Nombre */}
        <div className="flex flex-col">
          <label className="text-xs font-medium mb-1 flex items-center">
            <FaUser className="mr-2 text-primaryBlue" />
            Primer Nombre(*)
          </label>
          <input
            type="text"
            name="primerNombre"
            autoComplete="off"
            placeholder="Primer Nombre"
            className="solcitudgrande-style"
            value={formData.primerNombre}
            onChange={handleChange}
          />
        </div>
        {/* Segundo Nombre */}
        <div className="flex flex-col">
          <label className="text-xs font-medium mb-1 flex items-center">
            <FaUser className="mr-2 text-primaryBlue" />
            Segundo Nombre
          </label>
          <input
            type="text"
            name="segundoNombre"
            autoComplete="off"
            placeholder="Segundo Nombre"
            className="solcitudgrande-style"
            value={formData.segundoNombre}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Segunda fila */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {/* Provincia */}
        <div className="flex flex-col">
          <label className="text-xs font-medium mb-1 flex items-center">
            <FaMapMarkerAlt className="mr-2 text-primaryBlue" />
            Provincia(*)
          </label>
          <select
            name="provincia"
            className="solcitudgrande-style"
            value={formData.provincia}
            onChange={handleChange}
          >
            <option value="">Seleccione una opción</option>
            {datoProvincia.map((opcion) => (
              <option key={opcion.idProvincia} value={opcion.idProvincia}>
                {opcion.Nombre}
              </option>
            ))}
          </select>
        </div>
        {/* Cantón */}
        <div className="flex flex-col">
          <label className="text-xs font-medium mb-1 flex items-center">
            <FaMapMarkerAlt className="mr-2 text-primaryBlue" />
            Cantón(*)
          </label>
          <select
            name="canton"
            className="solcitudgrande-style"
            value={formData.canton}
            onChange={handleChange}
          >
            <option value="">Seleccione una opción</option>
            {datoCanton.map((opcion) => (
              <option key={opcion.idCanton} value={opcion.idCanton}>
                {opcion.Nombre}
              </option>
            ))}
          </select>
        </div>
        {/* Celular */}
        <div className="flex flex-col">
          <label className="text-xs font-medium mb-1 flex items-center">
            <FaMobileAlt className="mr-2 text-primaryBlue" />
            Celular(*)
          </label>
          <input
            type="text"
            name="celular"
            autoComplete="off"
            placeholder="Celular"
            className="solcitudgrande-style"
            value={formData.celular}
            onChange={handleChange}
            maxLength="10"
            pattern="\d{10}"
          />
        </div>
        {/* Botones */}
        <div className="flex items-center justify-center space-x-2">
          <button onClick={handleAgregar} className="rounded-full hover:shadow-md transition duration-300 ease-in-out group bg-primaryBlue text-white border border-white hover:bg-white hover:text-primaryBlue hover:border-primaryBlue text-xs px-6 py-2.5 flex intems-center">
            <FaPlus className="mr-1" />
            Agregar
          </button>
          <button onClick={handleLimpiar} className="rounded-full hover:shadow-md transition duration-300 ease-in-out group bg-primaryBlue text-white border border-white hover:bg-white hover:text-primaryBlue hover:border-primaryBlue text-xs px-6 py-2.5 flex intems-center">
            <FaTimes className="mr-1" />
            Limpiar
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="p-6 bg-gray-50 min-h-screen overflow-auto">
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg border border-gray-300">
          <table className="min-w-full table-auto">
            <thead className="bg-primaryBlue">
              <tr>
                <th className="px-4 py-2 text-center font-bold text-white">Parentesco</th>
                <th className="px-4 py-2 text-center font-bold text-white">Apellido Paterno</th>
                <th className="px-4 py-2 text-center font-bold text-white">Primer Nombre</th>
                <th className="px-4 py-2 text-center font-bold text-white">Segundo Nombre</th>
                <th className="px-4 py-2 text-center font-bold text-white">Provincia</th>
                <th className="px-4 py-2 text-center font-bold text-white">Cantón</th>
                <th className="px-4 py-2 text-center font-bold text-white">Celular</th>
              </tr>
            </thead>
            <tbody>
              {referencias.map((referencia) => (
                <tr key={referencia.idReferenciasClientesWeb}>
                  <td className="border px-4 py-2 text-center">{idToTextMap[referencia.idParentesco]}</td>
                  <td className="border px-4 py-2 text-center">{referencia.ApellidoPaterno}</td>
                  <td className="border px-4 py-2 text-center">{referencia.PrimerNombre}</td>
                  <td className="border px-4 py-2 text-center">{referencia.SegundoNombre}</td>
                  <td className="border px-4 py-2 text-center">{idToTextMapProvincia[referencia.idProvincia]}</td>
                  <td className="border px-4 py-2 text-center">{idToTextMapCanton[referencia.idCanton]}</td>
                  <td className="border px-4 py-2 text-center">{referencia.Celular}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


    </div>
  );
});
export default Referencias;
