import React, {
  useState,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useSnackbar } from "notistack";
import {
  fetchNacionalidad,
  fecthGenero,
  fecthEstadoCivil,
  fetchNivelEducacion,
  fetchProfesion,
  fetchSituacionLaboral,
  fetchProvincias,
  fetchCantones,
  fetchParroquias,
  fetchBarrios,
  fetchActividadEconomina,
  fetchTiempoVivienda,
  fecthTipoVivienda,
  fecthInmueble,
  fecthCiudadInmueble,
} from "../apisFetch";
import {
  FaCalendarAlt,
  FaStore,
  FaUserAlt,
  FaUser,
  FaMapMarkerAlt,
  FaCog,
  FaPhoneAlt,
  FaTransgender,
  FaChild,
  FaUserGraduate,
  FaUserSecret,
  FaToolbox,
} from "react-icons/fa";
import { SelectField } from "../../../Utils";
import { InputField } from "../../../Utils";
import { LocationModal } from "../../LocationModal";
import { useAuth } from "../../../AuthContext/AuthContext";
import axios from "../../../../configApi/axiosConfig";
import { APIURL } from "../../../../configApi/apiConfig";
import { useLocation } from "react-router-dom";
const Domicilio = forwardRef((props, ref) => {
  const { userData, userUsuario } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const { data } = props;
  const location = useLocation();
  const [clientInfo, setClientInfo] = useState(null);
  const [ubicacionError, setUbicacionError] = useState(false);

  useEffect(() => {
    if (location.state) {
      // Si hay datos en `location.state`, los guardamos en localStorage
      localStorage.setItem("clientInfo", JSON.stringify(location.state));
      setClientInfo(location.state);
    } else {
      // Si no hay datos en `location.state`, intentamos recuperar de localStorage
      const savedClientInfo = localStorage.getItem("clientInfo");
      if (savedClientInfo) {
        setClientInfo(JSON.parse(savedClientInfo));
      }
    }
  }, [location.state]);

  const [formErrors, setFormErrors] = useState({});
  const [provincia, setProvincia] = useState([]);
  const [cantones, setCantones] = useState([]);
  const [parroquias, setParroquias] = useState([]);
  const [barrios, setBarrios] = useState([]);
  const [tiempoVivienda, setTiempoVivienda] = useState([]);
  const [tipoVivienda, setTipoVivienda] = useState([]);
  const [openLocationModal, setOpenLocationModal] = useState(false);

  const [inmueble, setInmueble] = useState([]);
  const [ciudadInmueble, setCiudadInmueble] = useState([]);
  const [formData, setFormData] = useState({
    provincia: data.idProvinciaDomicilio || 0,
    canton: data.idCantonDomicilio || 0,
    parroquia: data.idParroquiaDomicilio || 0,
    barrio: data.idBarrioDomicilio || 0,
    callePrincipal: data.CallePrincipal || "",
    numeroCasa: data.NumeroCasa || "",
    calleSecundaria: data.CalleSecundaria || "",
    ubicacionDomicilio: "",
    referenciaUbicacion: data.ReferenciaUbicacion || "",
    telefonoCasa: data.TelefonoDomicilio || "",
    telefonoCasa2: data.TelefonoDomiliarDos || "",
    celular: data.Celular || "",
    tipoVivienda: data.idTipoVivienda || 0,
    tiempoVivienda: data.idCre_Tiempo || 0,
    nombreArrendador: data.NombreArrendador || "",
    telfArrendador: data.TelefonoArrendador || "",
    celularArrendador: data.CelularArrendador || "",
    inmueble: data.idInmueble || 0,
    ciudadInmueble: data.idCantonInmueble || 0,
    valorInmueble: data.ValorInmmueble || 0,
  });

  useEffect(() => {
    fetchProvincias(enqueueSnackbar, setProvincia);
    fetchTiempoVivienda(enqueueSnackbar, setTiempoVivienda);
    fecthTipoVivienda(enqueueSnackbar, setTipoVivienda);
    fecthInmueble(enqueueSnackbar, setInmueble);
    fecthCiudadInmueble(enqueueSnackbar, setCiudadInmueble);
  }, []);

  useEffect(() => {
    if (formData.provincia) {
      fetchCantones(formData.provincia, enqueueSnackbar, setCantones);
    }
  }, [formData.provincia, enqueueSnackbar]);

  useEffect(() => {
    if (formData.canton) {
      fetchParroquias(formData.canton, enqueueSnackbar, setParroquias);
    }
  }, [formData.canton, enqueueSnackbar]);

  useEffect(() => {
    if (formData.parroquia) {
      fetchBarrios(formData.parroquia, enqueueSnackbar, setBarrios);
    }
  }, [formData.parroquia, enqueueSnackbar]);

  const handleFormChange = async (e) => {
    const { name, value } = e.target;

    // Validación para campos de teléfono
  if (name === 'telefonoCasa' || name === 'telefonoCasa2' || name === 'celular' || 
    name === 'telfArrendador' || name === 'celularArrendador') {
  // Solo validar si el campo tiene valor y tiene la longitud correcta
  if (value && (value.length === 9 || value.length === 10)) {
    const existe = await props.comprobTelf(value); 
    if (existe === 1) {
      enqueueSnackbar(`El número ${value} se encuentra en la lista negra`, {
        variant: 'warning'
      });
      // Puedes decidir si quieres limpiar el campo o marcar como error
      setFormErrors(prev => ({
        ...prev,
        [name]: `El número ${value} se encuentra en la lista negra`
      }));
      return;
    }
  }
}
    // Expresión regular para detectar caracteres no permitidos
    const invalidCharsRegex = /[<>'"\\;{}()[\]`~!@#$%^&*=+|/?]/g;

    if (invalidCharsRegex.test(value)) {
      // Si hay caracteres no permitidos, los eliminamos y actualizamos formData y formErrors
      const cleanedValue = value.replace(invalidCharsRegex, "");

      setFormData((prevState) => ({
        ...prevState,
        [name]: cleanedValue,
      }));

      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "Este campo contiene caracteres no permitidos",
      }));

      return;
    }

    // Si el valor es válido, actualizar normalmente
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Limpiar el error si el valor es válido
    if (formErrors[name]) {
      setFormErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }

    if (name === "provincia" && value) {
      fetchCantones(value, enqueueSnackbar, setCantones);
      setCantones([]);
      setParroquias([]);
      setBarrios([]);
      setFormData((prev) => ({
        ...prev,
        canton: "",
        parroquia: "",
        barrio: "",
      }));
    }

    if (name === "canton" && value) {
      fetchParroquias(value, enqueueSnackbar, setParroquias);
      setParroquias([]);
      setBarrios([]);
      setFormData((prev) => ({ ...prev, parroquia: "", barrio: "" }));
    }

    if (name === "parroquia" && value) {
      fetchBarrios(value, enqueueSnackbar, setBarrios);
      setBarrios([]);
      setFormData((prev) => ({ ...prev, barrio: "" }));
    }
  };

  const handleOpenModal = async (externo = false) => {
    const camposBase = [
      "provincia",
      "canton",
      "parroquia",
      "barrio",
      "callePrincipal",
      "numeroCasa",
      "calleSecundaria",
      "referenciaUbicacion",
      "celular",
      "tipoVivienda",
      "tiempoVivienda",
    ];

    // Campos condicionales
    if (formData.tipoVivienda == 1) {
      camposBase.push(
        "nombreArrendador",
        "telfArrendador",
        "celularArrendador"
      );
    }

    if (formData.tipoVivienda == 3 || formData.tipoVivienda == 4) {
      camposBase.push("inmueble", "ciudadInmueble", "valorInmueble");
    }

    const camposInvalidos = camposBase.filter(
      (campo) =>
        formData[campo] === null ||
        formData[campo] === undefined ||
        formData[campo] === "" ||
        formData[campo] === 0
    );

    if (camposInvalidos.length > 0) {
      enqueueSnackbar(
        "Para seleccionar la ubicación, primero debes completar y guardar correctamente los datos del domicilio.",
        {
          variant: "warning",
        }
      );
      return;
    }

    const coordenadas = await fecthValidaDomicilio();
    if (!coordenadas.exists) {
      setUbicacionError(true);
    } else {
      setUbicacionError(false);
    }

    setOpenLocationModal((prev) => !prev);
  };



  const fecthValidaDomicilio = async () => {
    try {
      const idCre_SolicitudWeb = data.idCre_SolicitudWeb;
      const url = APIURL.getCoordenadasprefacturaPorId(idCre_SolicitudWeb, 1);
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.data) {
        return response.data; // Return the fetched data
      } else {
        console.error("No se encontraron datos para la solicitud.");
        return null; // Return null if no data is found
      }
    } catch (error) {
      console.error("Error al obtener los datos del cliente", error);
      return null; // Return null in case of an error
    }
  };
  const validateForm = useCallback(() => {
    const requiredFieldMessages = {
      provincia: "Provincia es requerida",
      canton: "Canton es requerido",
      parroquia: "Parroquia es requerida",
      barrio: "Barrio es requerido",
      callePrincipal: "Calle Principal es requerida",
      numeroCasa: "Número Casa es requerido",
      calleSecundaria: "Calle Secundaria es requerida",
      referenciaUbicacion: "Referencia Ubicacion es requerida",
      // telefonoCasa: 'Telefono Casa es requerido',
      //telefonoCasa2: 'Telefono Casa 2 es requerido',
      celular: "Celular es requerido",
      tipoVivienda: "Tipo Vivienda es requerido",
      tiempoVivienda: "Tiempo Vivienda es requerido",
    };


    // Validación condicional para arrendador (si tipoVivienda es 1)
    if (formData.tipoVivienda == 1) {
      requiredFieldMessages.nombreArrendador = "Nombre Arrendador es requerido";
      requiredFieldMessages.telfArrendador = "Telefono Arrendador es requerido";
      requiredFieldMessages.celularArrendador =
        "Celular Arrendador es requerido";
    }

    // Validación condicional para inmueble (si tipoVivienda es 3 o 4)
    if (formData.tipoVivienda == 3 || formData.tipoVivienda == 4) {
      requiredFieldMessages.inmueble = "Inmueble es requerido";
      requiredFieldMessages.ciudadInmueble = "Ciudad Inmueble es requerido";
      requiredFieldMessages.valorInmueble = "Valor Inmueble es requerido";
    }

    const newFormErrors = {};
    let isValid = true;

    // Verificamos todos los campos requeridos en formData
    for (const [key, value] of Object.entries(formData)) {
      if (
        (value === "" || value === null || value == 0) &&
        requiredFieldMessages[key]
      ) {
        newFormErrors[key] = requiredFieldMessages[key];
        isValid = false;
      }
    }

    // Validar longitud de teléfono y celular
    if (formData.telefonoCasa) {
      if (formData.telefonoCasa && formData.telefonoCasa.length !== 9) {
        newFormErrors.telefonoCasa = "El telefono debe tener 9 digitos";
        isValid = false;
      }
    }

    if (formData.telefonoCasa2) {
      if (formData.telefonoCasa2 && formData.telefonoCasa2.length !== 9) {
        newFormErrors.telefonoCasa2 = "El telefono debe tener 9 digitos";
        isValid = false;
      }
    }

    if (formData.celular && formData.celular.length !== 10) {
      newFormErrors.celular = "El celular debe tener 10 digitos";
      isValid = false;
    }

    if (formData.tipoVivienda == 0) {
      newFormErrors.telfArrendador = "Tipo Vivienda es requerido";
      isValid = false;
    }

    if (formData.tiempoVivienda == 0) {
      newFormErrors.telfArrendador = "Tiempo Vivienda es requerido";
      isValid = false;
    }

    // Validar teléfono/celular del arrendador si tipoVivienda es 1
    if (formData.tipoVivienda == 1) {
      if (
        formData.telfArrendador &&
        !(
          formData.telfArrendador.length === 9 ||
          formData.telfArrendador.length === 10
        )
      ) {
        newFormErrors.telfArrendador =
          "El Telefono/Celular debe tener 9 o 10 digitos";
        isValid = false;
      }
    }
    setFormErrors(newFormErrors);
    return isValid;
  }, [formData]);

  useImperativeHandle(ref, () => ({
    validateForm,
    // getFormData: () => formData,
    getFormData: () => ({
      ...formData,
      valorInmueble:
        formData.valorInmueble != null
          ? Number(formData.valorInmueble).toFixed(2)
          : undefined,
    }),
  }));

  return (
    <div className="py-2 w-full">
      <div className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <SelectField
            label="Provincia"
            icon={<FaStore />}
            value={formData.provincia}
            onChange={handleFormChange}
            options={provincia}
            name="provincia"
            error={formErrors.provincia}
          />
          <div className="col-span-1">
            <SelectField
              label="Canton"
              icon={<FaStore />}
              value={formData.canton}
              onChange={handleFormChange}
              options={cantones}
              name="canton"
              error={formErrors.canton}
            />
          </div>
          <div className="col-span-1">
            <SelectField
              label="Parroquia"
              icon={<FaStore />}
              value={formData.parroquia}
              onChange={handleFormChange}
              options={parroquias}
              name="parroquia"
              error={formErrors.parroquia}
            />
          </div>
          <div className="col-span-1">
            <SelectField
              label="Barrio"
              icon={<FaStore />}
              value={formData.barrio}
              onChange={handleFormChange}
              options={barrios}
              name="barrio"
              error={formErrors.barrio}
            />
          </div>
          <div className="col-span-1">
            <label className="text-xs font-medium mb-1 flex items-center">
              <FaUserAlt className="mr-2 text-primaryBlue" />
              Calle Principal
            </label>

            <input
              type="text"
              className="solcitudgrande-style"
              name="callePrincipal"
              onChange={handleFormChange}
              value={formData.callePrincipal}
            />
            {formErrors.callePrincipal && (
              <p className="mt-1 text-sm text-red-500 border-red-500">
                {formErrors.callePrincipal}
              </p>
            )}
          </div>
          <div className="col-span-1">
            <label className="text-xs font-medium mb-1 flex items-center">
              <FaUserAlt className="mr-2 text-primaryBlue" />
              Número Casa
            </label>
            <input
              type="text"
              className="solcitudgrande-style"
              name="numeroCasa"
              onChange={handleFormChange}
              value={formData.numeroCasa}
            />
            {formErrors.numeroCasa && (
              <p className="mt-1 text-sm text-red-500 border-red-500">
                {formErrors.numeroCasa}
              </p>
            )}
          </div>
          <div className="col-span-1">
            <label className="text-xs font-medium mb-1 flex items-center">
              <FaUserAlt className="mr-2 text-primaryBlue" />
              Calle Secundaria
            </label>
            <input
              type="text"
              className="solcitudgrande-style"
              name="calleSecundaria"
              onChange={handleFormChange}
              value={formData.calleSecundaria}
            />
            {formErrors.calleSecundaria && (
              <p className="mt-1 text-sm text-red-500 border-red-500">
                {formErrors.calleSecundaria}
              </p>
            )}
          </div>

          
            <div className="col-span-1">
              <label className="text-xs font-medium mb-1 flex items-center">
                <FaMapMarkerAlt className="mr-2 text-primaryBlue" />
                Ubicacion Domicilio
              </label>
              <button
                type="button"
                className="rounded-full hover:shadow-md transition duration-300 ease-in-out group bg-primaryBlue text-white border border-white hover:bg-white hover:text-primaryBlue hover:border-primaryBlue text-xs px-6 py-2.5 mb-4"
                name="ubicacionDomicilio"
                onClick={() => handleOpenModal("ubicacionDomicilio")}
              >
                Ubicacion Domicilio
              </button>
              {ubicacionError && (
                <p className="mt-1 text-sm text-red-500 border-red-500">
                  No se han registrado coordenadas para este domicilio.
                </p>
              )}
            </div>
        

          <div className="col-span-1">
            <label className="text-xs font-medium mb-1 flex items-center">
              <FaMapMarkerAlt className="mr-2 text-primaryBlue" />
              Referencia Ubicacion
            </label>
            <input
              type="text"
              className="solcitudgrande-style"
              name="referenciaUbicacion"
              onChange={handleFormChange}
              value={formData.referenciaUbicacion}
            />
            {formErrors.referenciaUbicacion && (
              <p className="mt-1 text-sm text-red-500 border-red-500">
                {formErrors.referenciaUbicacion}
              </p>
            )}
          </div>
          <div className="col-span-1">
            <label className="text-xs font-medium mb-1 flex items-center">
              <FaPhoneAlt className="mr-2 text-primaryBlue" />
              Telefono Casa
            </label>
            <input
              type="text"
              className="solcitudgrande-style"
              name="telefonoCasa"
              onChange={handleFormChange}
              value={formData.telefonoCasa}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
              }}
              maxLength={10}
            />
            {formErrors.telefonoCasa && (
              <p className="mt-1 text-sm text-red-500 border-red-500">
                {formErrors.telefonoCasa}
              </p>
            )}
          </div>

          <div className="col-span-1">
            <label className="text-xs font-medium mb-1 flex items-center">
              <FaPhoneAlt className="mr-2 text-primaryBlue" />
              Telefono Casa 2
            </label>
            <input
              type="text"
              className="solcitudgrande-style"
              name="telefonoCasa2"
              onChange={handleFormChange}
              value={formData.telefonoCasa2}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
              }}
              maxLength={10}
            />
            {formErrors.telefonoCasa2 && (
              <p className="mt-1 text-sm text-red-500 border-red-500">
                {formErrors.telefonoCasa2}
              </p>
            )}
          </div>
          <div className="col-span-1">
            <label className="text-xs font-medium mb-1 flex items-center">
              <FaUserAlt className="mr-2 text-primaryBlue" />
              Celular Cliente
            </label>
            <input
              type="text"
              className="solcitudgrande-style"
              name="celular"
              onChange={handleFormChange}
              value={formData.celular}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
              }}
              maxLength={10}
            />
            {formErrors.celular && (
              <p className="mt-1 text-sm text-red-500 border-red-500">
                {formErrors.celular}
              </p>
            )}
          </div>
          <div className="col-span-1">
            <SelectField
              label="Tipo Vivienda"
              icon={<FaStore />}
              value={formData.tipoVivienda}
              onChange={handleFormChange}
              options={tipoVivienda}
              name="tipoVivienda"
              error={formErrors.tipoVivienda}
            />
          </div>
          <div className="col-span-1">
            <SelectField
              label="Tiempo Vivienda"
              icon={<FaStore />}
              value={formData.tiempoVivienda}
              onChange={handleFormChange}
              options={tiempoVivienda}
              name="tiempoVivienda"
              error={formErrors.tiempoVivienda}
            />
          </div>
          {formData.tipoVivienda == 1 && (
            <>
              <div className="col-span-1">
                <label className="text-xs font-medium mb-1 flex items-center">
                  <FaUserAlt className="mr-2 text-primaryBlue" />
                  Nombre Arrendador
                </label>
                <input
                  type="text"
                  className="solcitudgrande-style"
                  name="nombreArrendador"
                  onChange={handleFormChange}
                  value={formData.nombreArrendador}
                />
                {formErrors.nombreArrendador && (
                  <p className="mt-1 text-sm text-red-500 border-red-500">
                    {formErrors.nombreArrendador}
                  </p>
                )}
              </div>
              <div className="col-span-1">
                <label className="text-xs font-medium mb-1 flex items-center">
                  <FaPhoneAlt className="mr-2 text-primaryBlue" />
                  Telefono Arrendador
                </label>
                <input
                  type="text"
                  className="solcitudgrande-style"
                  name="telfArrendador"
                  onChange={handleFormChange}
                  value={formData.telfArrendador}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  }}
                  maxLength={10}
                />
                {formErrors.telfArrendador && (
                  <p className="mt-1 text-sm text-red-500 border-red-500">
                    {formErrors.telfArrendador}
                  </p>
                )}
              </div>
              <div className="col-span-1">
                <label className="text-xs font-medium mb-1 flex items-center">
                  <FaPhoneAlt className="mr-2 text-primaryBlue" />
                  Celular Arrendador
                </label>
                <input
                  type="text"
                  className="solcitudgrande-style"
                  name="celularArrendador"
                  onChange={handleFormChange}
                  value={formData.celularArrendador}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  }}
                  maxLength={10}
                />
                {formErrors.celularArrendador && (
                  <p className="mt-1 text-sm text-red-500 border-red-500">
                    {formErrors.celularArrendador}
                  </p>
                )}
              </div>
            </>
          )}
          {(formData.tipoVivienda == 3 || formData.tipoVivienda == 4) && (
            <>
              <div className="col-span-1">
                <SelectField
                  label="Inmueble"
                  icon={<FaStore />}
                  value={formData.inmueble}
                  onChange={handleFormChange}
                  options={inmueble}
                  name="inmueble"
                  error={formErrors.inmueble}
                />
              </div>
              <div className="col-span-1">
                <SelectField
                  label="Ciudad Inmueble"
                  icon={<FaStore />}
                  value={formData.ciudadInmueble}
                  onChange={handleFormChange}
                  options={ciudadInmueble}
                  name="ciudadInmueble"
                  error={formErrors.ciudadInmueble}
                />
              </div>
              <div className="col-span-1">
                <label className="text-xs font-medium mb-1 flex items-center">
                  <FaStore className="mr-2 text-primaryBlue" />
                  Valor Inmueble
                </label>
                <input
                  type="number"
                  className="solcitudgrande-style"
                  name="valorInmueble"
                  onChange={handleFormChange}
                  value={formData.valorInmueble}
                />
                {formErrors.valorInmueble && (
                  <p className="mt-1 text-sm text-red-500 border-red-500">
                    {formErrors.valorInmueble}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <LocationModal
        isOpen={() => handleOpenModal()}
        openLocationModal={openLocationModal}
        locationType={null}
        locationData={null}
        onLocationChange={null}
        userSolicitudData={data}
        tipo={1}
        userData={userData}
      />
    </div>
  );
});

export default Domicilio;
