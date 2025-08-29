import React, { useState, useEffect } from "react";

export function UpdateTelefonica({ isOpen, onClose, onSave, data, tablaDatos }) {
    const [origen, setOrigen] = useState("");
    const [telefono, setTelefono] = useState("");
    const [observacion, setObservacion] = useState("");
    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    const [isSaving, setIsSaving] = useState(false);


    const opciones = [
        { id: 1, nombre: "DOMICILIO # 1", campo: "Telefono", mumcaracteres: 9 },
        { id: 2, nombre: "DOMICILIO # 2", campo: "TelefonoDomiliarDos", mumcaracteres: 9 },
        { id: 3, nombre: "CELULAR TITULAR", campo: "Celular", mumcaracteres: 10 },
        { id: 6, nombre: "TELEFONO TRABAJO", campo: "TelefonoTrabajo", mumcaracteres: 9 },
        { id: 7, nombre: "CELULAR NEGOCIO", campo: "TelefonoNegocio", mumcaracteres: 9 },
        { id: 8, nombre: "TELEFONO NEGOCIO", campo: "CelularNegocio", mumcaracteres: 10 },
        { id: 10, nombre: "JEFE INMEDIATO", campo: "CelularInmediatoIndependiente", mumcaracteres: 10 },
    ];

    const codigoProvincias = [
        "02", "03", "04", "05", "06", "07", "08", "09"
    ];
    useEffect(() => {
        validar();
    }, [origen, telefono, observacion]);

    const validar = () => {
        const newErrors = {};

        // Validación teléfono
        if (!/^\d{9,10}$/.test(telefono)) {
            newErrors.telefono = "El teléfono debe tener 9 o 10 dígitos numéricos.";
        } else if (telefono.length === 9) {
            const codigoProvincia = telefono.substring(0, 2);
            if (!codigoProvincias.includes(codigoProvincia)) {
                newErrors.telefono = "El teléfono convencional debe empezar con un código de provincia válido.";
            }
        } else if (telefono.length === 10) {
            if (!telefono.startsWith("09")) {
                newErrors.telefono = "El número celular debe empezar con 09.";
            }
        }

        // Validación de duplicados
        if (tablaDatos.some((item) => item.Telefono === telefono)) {
            newErrors.telefono = "Este teléfono ya existe en el registro.";
        }

        // Validación observación
        if (observacion.trim().length < 10) {
            newErrors.observacion = "La observación debe tener al menos 10 caracteres.";
        }

        setErrors(newErrors);
        setIsFormValid(Object.keys(newErrors).length === 0);
    };


    const handleSave = async () => {
        if (!isFormValid || isSaving) return;

        setIsSaving(true);

        // Buscar el campo dinámico a actualizar
        const opcionSeleccionada = opciones.find(
            (opcion) => opcion.nombre === data.Observacion
        );

        // Si no se encuentra una opción válida, salir
        if (!opcionSeleccionada) {
            alert("No se encontró una opción válida para actualizar.");
            setIsSaving(false);
            return;
        }

        // Nombre del campo dinámico (por ejemplo: "Telefono", "TelefonoTrabajo", etc.)
        const campoActualizado = opcionSeleccionada.campo;

        // Crear objeto con el campo dinámico actualizado
        const dataEnvio = {
            ...data,
            idEstadoGestns: 0,
            idCre_VerificacionTelefonicaMaestro: 0,
            idCre_VerificacionTelefonicaMaestroOrigen: data.idCre_VerificacionTelefonicaMaestro,
            Observaciones: observacion,
            Campo: campoActualizado,
            TelefonoOrigen: data.Telefono,
            Telefono: telefono,
        };

        try {
            await onSave(dataEnvio); // espera si onSave es async
            // Limpiar formulario
            setOrigen("");
            setTelefono("");
            setObservacion("");
            setErrors({});
            setIsFormValid(false);
            onClose();
        } catch (error) {
            console.error("Error al guardar:", error);
        } finally {
            setIsSaving(false); // Siempre desbloquea después de terminar
        }
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Actualizar Teléfono</h2>
                <h2 className="text-md font-semibold mb-4"> {data.Observacion} - {data.Telefono}</h2>

                {/* Teléfono */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Teléfono</label>
                    <input
                        type="text"
                        value={telefono}
                        onChange={(e) => {
                            // Permitir solo números
                            const value = e.target.value.replace(/\D/g, "");
                            setTelefono(value);
                        }}
                        className={`w-full border rounded px-3 py-2 ${errors.telefono ? "border-red-500" : ""}`}
                        placeholder="Ingresa el número de teléfono"
                        maxLength={10}
                    />
                    {errors.telefono && <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>}
                </div>

                {/* Observación */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Observación</label>
                    <textarea
                        value={observacion}
                        onChange={(e) => setObservacion(e.target.value.toUpperCase())}
                        className={`w-full border rounded px-3 py-2 ${errors.observacion ? "border-red-500" : ""}`}
                        rows="3"
                        placeholder="Escribe una observación..."
                    />
                    {errors.observacion && (
                        <p className="text-red-500 text-sm mt-1">{errors.observacion}</p>
                    )}
                </div>

                {/* Botones */}
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!isFormValid || isSaving}
                        className={`px-4 py-2 rounded text-white ${isFormValid
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-blue-300 cursor-not-allowed"
                            }`}
                    >
                         {isSaving ? "Guardando..." : "Guardar"}
                    </button>
                </div>
            </div>
        </div>
    );
}
