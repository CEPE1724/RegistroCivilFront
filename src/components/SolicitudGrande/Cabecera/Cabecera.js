import React, { useState } from "react";
import SaveIcon from "@mui/icons-material/Save";
import PrintIcon from "@mui/icons-material/Print";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import LogoutIcon from "@mui/icons-material/Logout";
import { DatosCliente } from "../DatosCliente";
import { DatosConyuge } from "../DatosConyuge";
import { Referencias } from "../Referencia";
import { SeccionB } from "../SeccionB";
import { SeccionA } from "../SeccionA";

export function Cabecera() {
  const [activeTab, setActiveTab] = useState("Datos Cliente");

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
        return <SeccionA />;
      case "Sección B- Dependiente":
        return <SeccionB />;
      // Agrega más casos para las otras pestañas aquí
      default:
        return <div>Contenido no disponible</div>;
    }
  };
  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-xl font-bold mb-4">Cuerpo Solicitud</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 grid-rows-2 gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Fecha</label>
            <input
              type="date"
              className="block bg-[#F9FAFB] w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm h-10"
              defaultValue={currentDate}
              readOnly
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Cedula</label>
            <input
              type="text"
              className="block bg-[#F9FAFB] w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm h-10"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Local</label>
            <select className="block bg-[#F9FAFB] w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm h-10"></select>
          </div>
          <div className="flex items-center mt-2 justify-center space-x-6">
            <div className="flex items-center space-x-2">
              <input type="checkbox" className="w-4 h-4" id="garante" />
              <label htmlFor="garante" className="text-sm font-semibold">
                Garante
              </label>
            </div>

            <button className="w-[150px] min-w-[120px] rounded-full hover:shadow-md transition duration-300 ease-in-out group bg-primaryBlue text-white border border-white hover:bg-white hover:text-primaryBlue hover:border-primaryBlue transition-colors text-xs px-8 py-2.5 focus:shadow-none">
              Garante
            </button>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">
              Apellido Paterno
            </label>
            <input
              type="text"
              className="block bg-[#F9FAFB] w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm h-10"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">
              Apellido Materno
            </label>
            <input
              type="text"
              className="block bg-[#F9FAFB] w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm h-10"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1"> Primer Nombre</label>
            <input
              type="text"
              className="block bg-[#F9FAFB] w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm h-10"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">
              {" "}
              Segundo Nombre
            </label>
            <input
              type="text"
              className="block bg-[#F9FAFB] w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm h-10"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1"> Email</label>
            <input
              type="text"
              className="block bg-[#F9FAFB] w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm h-10"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1"> Celular</label>
            <input
              type="text"
              className="block bg-[#F9FAFB] w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm h-10"
            />
          </div>

          
        </div>
      </div>
      <div className="mt-6 border-b">
        <ul className="flex flex-wrap space-x-4">
          {tabs.map((tab) => (
            <li
              key={tab}
              className={`cursor-pointer p-2 ${
                activeTab === tab
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

      {/* Aquí se renderiza el contenido según la pestaña activa */}
      <div className="mt-6">
        {renderTabContent()}
    
      </div>

      <div className="flex flex-wrap sm:flex-nowrap justify-start mt-6 gap-4">
  {[
    { Icon: SaveIcon, text: "Guardar" },
    { Icon: PrintIcon, text: "Imprimir" },
    { Icon: ManageSearchIcon, text: "Buscar" },
    { Icon: LogoutIcon, text: "Salir" },
  ].map(({ Icon, text }, index) => (
    <button
      key={index}
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
