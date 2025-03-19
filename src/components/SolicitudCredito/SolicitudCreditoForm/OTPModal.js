import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { APIURL } from '../../../configApi/apiConfig';
import { useSnackbar } from 'notistack';

const OTPModal = ({ isOpen, onClose, onVerifyOtp, phoneNumberOTP }) => {
  const [otp, setOtp] = useState(Array(5).fill('')); // Array de 5 dígitos
  const [isValid, setIsValid] = useState(null);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutos en segundos
  const [otpSent, setOtpSent] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(phoneNumberOTP);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpValidated, setOtpValidated] = useState(false);
  
  const { enqueueSnackbar } = useSnackbar();

  // Maneja el ingreso de cada dígito del OTP
  const handleInputChange = (e, index) => {
    const value = e.target.value;
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const updatedOtp = [...otp];
      updatedOtp[index] = value;
      setOtp(updatedOtp);
      // Mover al siguiente input si se ingresó un valor
      if (index < otp.length - 1 && value !== "") {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };

  // Función para validar el OTP
  const ValidarCodigo = async () => {
    const otpCode = otp.join('');
    setIsVerifying(true);
    // Muestra el mensaje de Snackbar "Verificando OTP"
    enqueueSnackbar('Verificando OTP...', { variant: 'info', autoHideDuration: 2000 });
    try {
      const url = APIURL.verifyOTP();
      const response = await axios.post(url, {
        phoneNumber: phoneNumberOTP,
        otpCode,
      });
      if (response.data.success) {
        setOtpValidated(true); // Mantiene el botón bloqueado
        setIsValid(true);
        onVerifyOtp(true, otpCode); // Se envía el OTP validado al componente padre
      } else {
        setIsValid(false);
      }
    } catch (error) {
      console.error(error);
      alert('Hubo un error al verificar el OTP');
    } finally {
      setIsVerifying(false);
    }
  };

  // Actualización del cronómetro
  useEffect(() => {
    if (timeLeft > 0 && isOpen) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft <= 0) {
      onClose();
    }
  }, [isOpen, timeLeft, otpSent, phoneNumber]);

  // Formatea el tiempo en minutos y segundos
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

          {/* Inputs para cada dígito del OTP */}
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

          {/* Botón de validación del OTP */}
          <div className="mt-6">
            <button
              className="w-full py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50"
              onClick={ValidarCodigo}
              disabled={timeLeft <= 0 || isVerifying || otpValidated}
              type="button"
            >
              Validar OTP
            </button>
          </div>

          {/* Mensaje de error en caso de fallo en la validación */}
          {isValid === false && (
            <p className="text-red-500 text-xs mt-2 text-center">
              El código OTP es incorrecto. Intenta de nuevo.
            </p>
          )}

          {/* Botón para cerrar el modal */}
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

