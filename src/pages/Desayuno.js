import React, { useState, useEffect } from 'react';
import { HiOutlineCheckCircle } from 'react-icons/hi2';
import Confetti from 'react-confetti';
import Credito from "../assets/img/Credito.png";

// Hook para capturar tamaño de ventana (para el confeti)
const useWindowSize = () => {
    const [size, setSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        const handleResize = () => {
            setSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return size;
};

const Desayuno = () => {
    const [mostrarInvitacion, setMostrarInvitacion] = useState(false);
    const [mostrarConfeti, setMostrarConfeti] = useState(false);
    const [mostrarModal, setMostrarModal] = useState(false);
    const { width, height } = useWindowSize();

    const handleConfirmar = () => {
        setMostrarConfeti(true);
        setMostrarModal(true);

        setTimeout(() => {
            setMostrarConfeti(false);
            setMostrarModal(false);
        }, 6000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-6 relative overflow-hidden print-section">
            {mostrarConfeti && (
                <Confetti width={width} height={height} numberOfPieces={250} recycle={false} />
            )}

            {/* ✅ Modal de confirmación */}
            {mostrarModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm text-center border border-gray-300 animate-fade-in">
                        <h2 className="text-2xl font-semibold text-green-600 mb-2">🎉 ¡Gracias!</h2>
                        <p className="text-gray-700">Tu asistencia ha sido confirmada con éxito.</p>
                    </div>
                </div>
            )}

            {!mostrarInvitacion ? (
                // 🟦 Carátula inicial
                <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-200 p-8 text-center transition-all duration-500">
                    <img
                        src={Credito}
                        alt="Logo Point"
                        className="w-32 h-auto mx-auto mb-6 animate-pulse"
                    />
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">de ciim erddp </h1>
                    <p className="text-gray-600 text-lg mb-6">
                        Acompáñanos a un evento especial organizado por el equipo directivo.
                    </p>
                    <button
                        onClick={() => {
                            setMostrarInvitacion(true);
                            setMostrarConfeti(true); // 🎉 Mostrar confeti al abrir la invitación
                            setTimeout(() => setMostrarConfeti(false), 9000); // ⏱️ Opcional: se detiene luego de 5 segundos
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition-colors"
                    >
                        Ver Invitación
                    </button>

                </div>
            ) : (
                // 🟦 Invitación
                <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-500">
                    {/* Imagen header */}
                    <div className="relative">
                        <img
                            src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?fit=crop&w=1000&q=80"
                            alt="Desayuno corporativo"
                            className="w-full h-64 object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                            <h1 className="text-white text-3xl md:text-4xl font-bold drop-shadow-lg">
                                Invitación Especial
                            </h1>
                        </div>
                    </div>

                    {/* Contenido de la invitación */}
                    <div className="p-8 text-center">
                       

                        

                       

                        {/* Botón de confirmación */}
                        <div className="flex justify-center">
                            <button
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white px-6 py-3 rounded-full font-semibold shadow-md"
                                onClick={handleConfirmar}
                            >
                                <HiOutlineCheckCircle className="text-xl" />
                                Confirmar Asistencia
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Desayuno;
