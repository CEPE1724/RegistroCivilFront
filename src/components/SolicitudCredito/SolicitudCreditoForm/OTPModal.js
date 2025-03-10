import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { APIURL } from '../../../configApi/apiConfig';

const OTPModal = ({ isOpen, onClose, onVerifyOtp, phoneNumberOTP }) => {
  const [otp, setOtp] = useState(Array(5).fill('')); // Ahora es un array de 5 dígitos
  const [isValid, setIsValid] = useState(null);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutos en segundos
  const [otpSent, setOtpSent] = useState(false); // Nuevo estado para controlar si el OTP fue enviado
  const [phoneNumber, setPhoneNumber] = useState(phoneNumberOTP);
console.log(phoneNumberOTP);
  // Función para manejar los cambios de los campos OTP
  const handleInputChange = (e, index) => {
    const value = e.target.value;
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const updatedOtp = [...otp];
      updatedOtp[index] = value;
      setOtp(updatedOtp);

      // Mover al siguiente campo cuando se ingresa un valor
      if (index < otp.length - 1 && value !== "") {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };



  // cambiar estado optsent a false cuando se cierre el modal

  // Función para manejar la validación del OTP
  const ValidarCodigo = async () => {
    const otpCode = otp.join('');
    try {
      const url = APIURL.verifyOTP();
      console.log(url, phoneNumberOTP, otpCode);
      const response = await axios.post(url, {
        phoneNumber: phoneNumberOTP,
        otpCode,
      });

      if (response.data.success) {
        setIsValid(true);
        onVerifyOtp(true);
      } else {
        setIsValid(false);
      }
    } catch (error) {
      console.error(error);
      alert('Hubo un error al verificar el OTP');
    }
  };

  // Función para actualizar el cronómetro
  useEffect(() => {
    if (timeLeft > 0 && isOpen) {
   
      // Solo iniciar el timer si el modal está abierto
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      // Enviar el OTP automáticamente cuando el modal se abra, solo si aún no se ha enviado
     

      return () => clearInterval(timer); // Limpiar el intervalo cuando el componente se desmonta o timeLeft cambia
    } else if (timeLeft <= 0) {
      // Cerrar el modal cuando el tiempo expire
      onClose();
    }
  }, [isOpen, timeLeft, otpSent, phoneNumber]); // Agregar otpSent en las dependencias

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full sm:w-96">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">Verificación de OTP</h3>
          <p className="text-sm text-gray-600 mb-6">
            Se enviará un código de 5 dígitos a tu teléfono móvil {phoneNumber}. El código tendrá una duración de 5 minutos.
          </p>

          {/* Campos OTP */}
          <div className="flex justify-between mb-4">
            {otp.map((_, index) => (
              <input
                key={index}
                id={`otp-input-${index}`}
                type="text"
                maxLength="1"
                value={otp[index]}
                onChange={(e) => handleInputChange(e, index)}
                className="w-12 h-12 text-center text-2xl font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="-"
              />
            ))}
          </div>

          {/* Cronómetro */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">Tiempo restante: {formatTime(timeLeft)}</p>
          </div>

          {/* Botón de validación */}
          <div className="mt-6">
            <button
              className="w-full py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50"
              onClick={ValidarCodigo}
              disabled={timeLeft <= 0} // Deshabilita el botón si el tiempo ha expirado
              type='button'
            >
              Validar OTP
            </button>
          </div>

          {/* Mensaje de error */}
          {isValid === false && (
            <p className="text-red-500 text-xs mt-2 text-center">
              El código OTP es incorrecto. Intenta de nuevo.
            </p>
          )}

          {/* Cerrar el modal */}
          <div className="mt-6 text-center">
            <button
              className="text-gray-500 hover:text-gray-700 text-sm"
              onClick={onClose}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default OTPModal;
