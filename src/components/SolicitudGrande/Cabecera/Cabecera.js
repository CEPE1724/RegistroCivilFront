import React, { useState, useRef } from "react";
import SaveIcon from "@mui/icons-material/Save";
import PrintIcon from "@mui/icons-material/Print";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import LogoutIcon from "@mui/icons-material/Logout";
import { DatosCliente } from "../DatosCliente/DatosCliente";
import { DatosConyuge } from "../DatosConyuge";
import { Referencias } from "../Referencia";
import { SeccionB } from "../SeccionB";
import { SeccionA } from "../SeccionA";
import { FactoresCredito } from "../FactoresCredito";
import { useSnackbar } from 'notistack';
import { Verificacion } from "../Verificacion/Verificacion";
import { InformacionCredito } from "../InformacionCredito";
export function Cabecera() {
  const [activeTab, setActiveTab] = useState("Datos Cliente");
  const [cedula, setCedula] = useState("");
  const [local, setLocal] = useState("");
  const [apellidoPaterno, setApellidoPaterno] = useState("");
  const [primerNombre, setPrimerNombre] = useState("");
  const [email, setEmail] = useState("");
  const [celular, setCelular] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  ////const seccionARef = useRef(null);
  const seccionRef = useRef(null);  // Creas la referencia

  const handleSave = () => {
    // Llamas la validación desde el componente hijo cuando se presiona el botón guardar
    if (seccionRef.current) {
      seccionRef.current.handleSubmit(); // Llamada a la función expuesta de SeccionA
    }
  };

  const currentDate = new Date().toISOString().split("T")[0];

  const tabs = [
    "Datos Cliente",
    "Datos Conyuge",
    "Referencias",
    "Sección A- Negocio",
    "Sección B- Dependiente",
    "Información de Crédito",
    "Factores de Crédito",
    "Verificación",

  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "Datos Cliente":
        return <DatosCliente />;
      case "Datos Conyuge":
        return <DatosConyuge />;
      case "Referencias":
        return <Referencias />;
      case "Sección A- Negocio":
        return <SeccionA ref={seccionRef} />;
      case "Sección B- Dependiente":
        return <SeccionB />;
      case "Factores de Crédito":
        return <FactoresCredito ref={seccionRef} />;
      case "Verificación":
        return <Verificacion />;
      case "Información de Crédito":
        return <InformacionCredito />;
      default:
        return <div>Contenido no disponible</div>;
    }
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      enqueueSnackbar("Formulario enviado con éxito.", { variant: "success" });
    }
  };

  const validateForm = () => {
    // Validación Cedula
    if (!/^\d{10}$/.test(cedula)) {
      enqueueSnackbar("La cédula debe ser un número de 10 dígitos.", { variant: "error" });
      return false;
    }

    // Validación Local
    if (!local) {
      enqueueSnackbar("Debe seleccionar un local.", { variant: "error" });
      return false;
    }

    // Validación Apellido Paterno y Nombre
    if (apellidoPaterno.length < 5 || primerNombre.length < 5) {
      enqueueSnackbar("El apellido paterno y el primer nombre deben tener al menos 5 caracteres.", { variant: "error" });
      return false;
    }

    // Validación Email
    if (!/\S+@\S+\.\S+/.test(email)) {
      enqueueSnackbar("El email no tiene un formato válido.", { variant: "error" });
      return false;
    }

    // Validación Celular
    if (!/^\d{10}$/.test(celular)) {
      enqueueSnackbar("El celular debe ser un número de 10 dígitos.", { variant: "error" });
      return false;
    }

    return true;
  };



  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 grid-rows-2 gap-4">
          <div className="flex flex-col">
            <label className="text-xs font-medium mb-1">Fecha</label>
            <input
              type="date"
              className="solcitudgrande-style"
              defaultValue={currentDate}
              readOnly
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-medium mb-1">Cedula</label>
            <input
              type="text"
              value={cedula}
              onChange={handleInputChange(setCedula)}
              className="solcitudgrande-style"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-medium mb-1">Local</label>
            <select
              value={local}
              onChange={(e) => setLocal(e.target.value)}
              className="solcitudgrande-style"
            >
              <option value="">Seleccione...</option>
              <option value="Local 1">Local 1</option>
              <option value="Local 2">Local 2</option>
            </select>
          </div>

          <div className="flex items-center mt-2 justify-center space-x-6">
            <div className="flex items-center space-x-2">
              <input type="checkbox" className="w-4 h-4" id="garante" />
              <label htmlFor="garante" className="text-sm font-semibold">
                Garante
              </label>
            </div>

            <button
              onClick={handleSubmit}
              className="w-[150px] min-w-[120px] rounded-full hover:shadow-md transition duration-300 ease-in-out group bg-primaryBlue text-white border border-white hover:bg-white hover:text-primaryBlue hover:border-primaryBlue transition-colors text-xs px-8 py-2.5 focus:shadow-none"
            >
              Garante
            </button>
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-medium mb-1">Apellido Paterno</label>
            <input
              type="text"
              value={apellidoPaterno}
              onChange={handleInputChange(setApellidoPaterno)}
              className="solcitudgrande-style"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-medium mb-1">Apellido Materno</label>
            <input
              type="text"
              className="solcitudgrande-style"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-medium mb-1">Primer Nombre</label>
            <input
              type="text"
              value={primerNombre}
              onChange={handleInputChange(setPrimerNombre)}
              className="solcitudgrande-style"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-medium mb-1">Segundo Nombre</label>
            <input
              type="text"
              className="solcitudgrande-style"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-medium mb-1">Email</label>
            <input
              type="text"
              value={email}
              onChange={handleInputChange(setEmail)}
              className="solcitudgrande-style"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-medium mb-1">Celular</label>
            <input
              type="text"
              value={celular}
              onChange={handleInputChange(setCelular)}
              className="solcitudgrande-style"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 border-b">
        <ul className="flex flex-wrap space-x-4">
          {tabs.map((tab) => (
            <li
              key={tab}
              className={`cursor-pointer p-2 ${activeTab === tab
                ? "border-b-2 border-blue-500 font-bold"
                : "text-gray-500"
                }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 mt-0">
        {renderTabContent()}
      </div>

      <div className="flex flex-wrap sm:flex-nowrap justify-start mt-6 gap-4">
        {[
          { Icon: SaveIcon, text: "Guardar", onClick: handleSave },
          { Icon: PrintIcon, text: "Imprimir" },
          { Icon: ManageSearchIcon, text: "Buscar" },
          { Icon: LogoutIcon, text: "Salir" },
        ].map(({ Icon, text, onClick }, index) => (
          <button
            key={index}
            onClick={onClick}
            className="w-[150px] min-w-[120px] rounded-full hover:shadow-md transition duration-300 ease-in-out group bg-primaryBlue text-white border border-white hover:bg-white hover:text-primaryBlue hover:border-primaryBlue transition-colors text-xs px-8 py-2.5 focus:shadow-none flex items-center justify-center space-x-2"
          >
            <Icon className="w-5 h-5 transition-colors group-hover:text-primaryBlue" />
            <span>{text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}