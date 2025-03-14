import React, { useRef, useImperativeHandle } from "react";
import Datos from "../DatosCliente/Datos/Datos";

// Exponer `handleValidate` al componente padre (Cabecera)
const DatosCliente = React.forwardRef((props, ref) => {
  const { data } = props;
  const datosRef = useRef(); // Referencia al componente Datos

  // Función para manejar la validación
  const handleValidate = () => {
    const isValid = datosRef.current.validateForm(); // Llamamos a validateForm del componente Datos
    return isValid; // Retornar el resultado de la validación
  };

  // Exponer la función `handleValidate` al componente padre
  useImperativeHandle(ref, () => ({
    handleValidate,
  }));

  return (
    <div>
      <Datos ref={datosRef} data={data} />
    </div>
  );
});

export default DatosCliente;
