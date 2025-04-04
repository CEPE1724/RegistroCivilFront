import React from "react";
import { FaCalendarAlt, FaIdCard, FaStore, FaUserAlt, FaEnvelope, FaPhoneAlt, FaCog, FaUser } from "react-icons/fa";
import { InputField } from "../../Utils";


export function CabeceraDatosSolicitud({ datosConsulta, data, setData, handleInputChange }) {
  // Esta función evalúa si el campo ya tiene datos al principio
  const isReadOnly = (field) => {
    return field !== undefined && field !== null && field !== "" && field.length > 0;
  };

  console.log('cabecera edison,', data);
  console.log(datosConsulta);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 grid-rows-2 gap-4">
      {/* Fecha */}
      <InputField
        label="Fecha"
        icon={<FaCalendarAlt />}
        value={data.fecha}
        onChange={handleInputChange(setData.setFecha)}
        readOnly={isReadOnly(datosConsulta?.fecha)}
      />

      {/* Cédula */}
      <InputField
        label="Cédula"
        icon={<FaIdCard />}
        value={data.cedula}
        onChange={handleInputChange(setData.setCedula)}
        readOnly={isReadOnly(datosConsulta?.cedula)}
      />

      {/* Local */}
      <InputField
        label="Local"
        icon={<FaStore />}
        value={data.local}
        onChange={handleInputChange(setData.setLocal)}
        readOnly={isReadOnly(datosConsulta?.almacen)}
      />

      
      {/* Apellido Paterno */}
      <InputField
        label="Apellido Paterno"
        icon={<FaUserAlt />}
        value={data.apellidoPaterno}
        onChange={handleInputChange(setData.setApellidoPaterno)}
        readOnly={isReadOnly(datosConsulta?.ApellidoPaterno)}
      />

      {/* Apellido Materno */}
      <InputField
        label="Apellido Materno"
        icon={<FaUserAlt />}
        value={data.segundoApellido}
        onChange={handleInputChange(setData.setSegundoApellido)}
        readOnly={isReadOnly(datosConsulta?.ApellidoMaterno)}
      />

      {/* Primer Nombre */}
      <InputField
        label="Primer Nombre"
        icon={<FaUser />}
        value={data.primerNombre}
        onChange={handleInputChange(setData.setPrimerNombre)}
        readOnly={isReadOnly(datosConsulta?.PrimerNombre)}
      />

      {/* Segundo Nombre */}
      <InputField
        label="Segundo Nombre"
        icon={<FaUser />}
        value={data.segundoNombre}
        onChange={handleInputChange(setData.setSegundoNombre)}
        readOnly={isReadOnly(datosConsulta?.SegundoNombre)}
      />

      {/* Email */}
      <InputField
        label="Email"
        icon={<FaEnvelope />}
        value={data.email}
        onChange={handleInputChange(setData.setEmail)}
        readOnly={isReadOnly(datosConsulta?.email)}
      />

      {/* Celular */}
      <InputField
        label="Celular"
        icon={<FaPhoneAlt />}
        value={data.celular}
        onChange={handleInputChange(setData.setCelular)}
        readOnly={isReadOnly(datosConsulta?.celular)}
      />

      {/* Estado */}
      <InputField
        label="Estado"
        icon={<FaCog />}
        value={data.estado}
        onChange={handleInputChange(setData.setEstado)}
        readOnly={isReadOnly(datosConsulta?.estado)}
      />
      <div className="flex items-center mt-2 justify-center space-x-6">
        <text className="text-xs text-gray-400">{datosConsulta.NumeroSolicitud}</text>
      </div>

    </div>
  );
}
