import React, { useRef, useImperativeHandle } from "react";
import Datos from "../DatosCliente/Datos/Datos";
import Domicilio from "./Domicilio/Domicilio";

// Exponer `handleValidate` al componente padre (Cabecera)
const DatosCliente = React.forwardRef((props, ref) => {
  const { data } = props;
  const datosRef = useRef(); // Referencia al componente Datos
  const domicilioRef = useRef(); // Referencia al componente Domicilio

  // Función para manejar la validación
  const handleValidate = () => {
    const isDatosValid = datosRef.current.validateForm(); // Llamamos a validateForm del componente Datos
    const isDomicilioValid = domicilioRef.current.validateForm(); // Llamamos a validateForm del componente Domicilio

    return isDatosValid && isDomicilioValid; // Retorna true si ambos formularios son válidos
  };

  // Exponer solo la función `handleValidate` al componente padre
  useImperativeHandle(ref, () => ({
    handleValidate
  }));

  return (
    <div>
      <Datos ref={datosRef} data={data} />
      <h2 className="text-xl font-semibold text-primaryBlue">Domicilio</h2>
      <Domicilio ref={domicilioRef} data={data} />
    </div>
  );
});

export default DatosCliente;
