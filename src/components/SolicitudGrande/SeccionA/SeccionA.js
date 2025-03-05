import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import { useImperativeHandle, forwardRef } from 'react';

export const SeccionA = forwardRef((props, ref) => {
    const { enqueueSnackbar } = useSnackbar();

    // Estado unificado
    const [formData, setFormData] = useState({
        nombreNegocio: '',
        tiempoNegocio: '',
        metros: '',
        ingresos: '',
        gastos: '',
        provincia: '',
        canton: '',
        parroquia: '',
        barrio: '',
        callePrincipal: '',
        numeroCasa: '',
        calleSecundaria: '',
        referenciaUbicacion: '',
        actividadNegocio: '',
    });

    // Función para manejar cambios en los inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'nombreNegocio' || name === 'barrio' || name === 'callePrincipal' || name === 'calleSecundaria' || name === 'referenciaUbicacion' || name === 'actividadNegocio'
                ? value.toUpperCase()  // Solo aplicamos toUpperCase a campos de texto
                : value
        }));
    };

    const handleSubmit = (e) => {
        e && e.preventDefault();

        const { nombreNegocio, tiempoNegocio, metros, ingresos, gastos, provincia, canton, parroquia, barrio, callePrincipal, numeroCasa, calleSecundaria, referenciaUbicacion, actividadNegocio } = formData;

        // Validaciones
        if (nombreNegocio.length <= 3) return enqueueSnackbar('El nombre del negocio debe tener más de 3 caracteres', { variant: 'error' });
        if (tiempoNegocio <= 0 || tiempoNegocio > 1e11) return enqueueSnackbar('El tiempo del negocio debe ser un número mayor a 0', { variant: 'error' });
        if (metros <= 0 || metros > 1e11) return enqueueSnackbar('Los metros deben ser un número mayor a 0', { variant: 'error' });
        if (ingresos <= 0 || ingresos > 1e11) return enqueueSnackbar('Los ingresos deben ser un número mayor a 0', { variant: 'error' });
        if (gastos <= 0 || gastos > 1e11) return enqueueSnackbar('Los gastos deben ser un número mayor a 0', { variant: 'error' });
        if (gastos > ingresos) return enqueueSnackbar('Los gastos no pueden ser mayores a los ingresos', { variant: 'error' });

        if (!provincia) return enqueueSnackbar('La provincia es obligatoria', { variant: 'error' });
        if (!canton) return enqueueSnackbar('El cantón es obligatorio', { variant: 'error' });
        if (!parroquia) return enqueueSnackbar('La parroquia es obligatoria', { variant: 'error' });
        if (!barrio || barrio.length > 100) return enqueueSnackbar('El barrio es obligatorio y no debe exceder 100 caracteres', { variant: 'error' });
        if (!callePrincipal || callePrincipal.length > 100) return enqueueSnackbar('La calle principal es obligatoria y no debe exceder 100 caracteres', { variant: 'error' });
        if (!numeroCasa) return enqueueSnackbar('El número de casa es obligatorio', { variant: 'error' });
        if (!calleSecundaria || calleSecundaria.length > 100) return enqueueSnackbar('La calle secundaria es obligatoria y no debe exceder 100 caracteres', { variant: 'error' });
        if (!referenciaUbicacion || referenciaUbicacion.length > 300) return enqueueSnackbar('La referencia de ubicación es obligatoria y no debe exceder 300 caracteres', { variant: 'error' });
        if (!actividadNegocio || actividadNegocio.length > 300) return enqueueSnackbar('La actividad del negocio es obligatoria y no debe exceder 300 caracteres', { variant: 'error' });

        enqueueSnackbar('Formulario enviado con éxito', { variant: 'success' });
    };

    useImperativeHandle(ref, () => ({ handleSubmit }));

    return (
        <div className="p-6">
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    {[
                        { label: 'Nombre de Negocio', name: 'nombreNegocio', type: 'text' },
                        { label: 'Tiempo del Negocio', name: 'tiempoNegocio', type: 'number' },
                        { label: 'Metros', name: 'metros', type: 'number' },
                        { label: 'Ingresos', name: 'ingresos', type: 'number' },
                        { label: 'Gastos', name: 'gastos', type: 'number' }
                    ].map(({ label, name, type }) => (
                        <div key={name} className="flex flex-col">
                            <label className="text-sm font-semibold mb-1">{label}</label>
                            <input
                                type={type}
                                name={name}
                                className="bg-[#F9FAFB] w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                                value={formData[name]}
                                onChange={handleChange}
                            />
                        </div>
                    ))}

                    {[
                        { label: 'Provincia', name: 'provincia' },
                        { label: 'Cantón', name: 'canton' },
                        { label: 'Parroquia', name: 'parroquia' }
                    ].map(({ label, name }) => (
                        <div key={name} className="flex flex-col">
                            <label className="text-sm font-semibold mb-1">{label}</label>
                            <select
                                name={name}
                                className="bg-[#F9FAFB] w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                                value={formData[name]}
                                onChange={handleChange}
                            >
                                <option>Seleccione</option>
                            </select>
                        </div>
                    ))}

                    {[
                        { label: 'Barrio', name: 'barrio', type: 'text' },
                        { label: 'Calle Principal', name: 'callePrincipal', type: 'text' },
                        { label: 'Número de Casa', name: 'numeroCasa', type: 'text' },
                        { label: 'Calle Secundaria', name: 'calleSecundaria', type: 'text' },
                        { label: 'Referencia Ubicación', name: 'referenciaUbicacion', type: 'text' },
                        { label: 'Actividad del Negocio', name: 'actividadNegocio', type: 'text' }
                    ].map(({ label, name, type }) => (
                        <div key={name} className="flex flex-col">
                            <label className="text-sm font-semibold mb-1">{label}</label>
                            <input
                                type={type}
                                name={name}
                                className="bg-[#F9FAFB] w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                                value={formData[name]}
                                onChange={handleChange}
                            />
                        </div>
                    ))}
                </div>
            </form>
        </div>
    );
});
