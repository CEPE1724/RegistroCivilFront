import React, { useState, useEffect } from 'react';
import {
    FiUser, FiHash, FiFileText, FiDollarSign, FiCalendar, FiUploadCloud
} from 'react-icons/fi';
import useBodegaUsuario from "../../hooks/useBodegaUsuario";
import { useAuth } from '../AuthContext/AuthContext';
export function DepositosPendientes() {
    const { userData } = useAuth(); // Obtener el userData del contexto de autenticación
    const { data, loading, error, fetchBodegaUsuario, } = useBodegaUsuario();

    const [formData, setFormData] = useState({
        cedula: '',
        nombre: '',
        banco: '',
        numeroDeposito: '',
        detalle: '',
        abono: '',
        bodega: 0,
    });

    const [imagen, setImagen] = useState(null);
    const [preview, setPreview] = useState(null);
    const [selectedBodega, setSelectedBodega] = useState("todos");
    const isCedulaValid = /^\d{10}$/.test(formData.cedula);
    const formEnabled = isCedulaValid;

    useEffect(() => {
        const fetchData = async () => {
            if (!userData || !userData.idUsuario) return; // ⛔ Espera hasta que esté disponible
    
            try {
                await fetchBodega();
            } catch (error) {
                console.error("Error al cargar los datos iniciales:", error);
            }
        };
    
        fetchData();
    }, [userData]); // ✅ Se ejecutará cuando userData esté disponible
    
    
    const fetchBodega = async () => {
        if (!userData || !userData.idUsuario) {
            console.warn("userData aún no está disponible");
            return;
        }
    
        const userId = userData.idUsuario;
        const idTipoFactura = 43;
        const fecha = new Date().toISOString();
        const recibeConsignacion = true;
    
        try {
            await fetchBodegaUsuario(userId, idTipoFactura, fecha, recibeConsignacion);
        } catch (err) {
            console.error("Error al obtener los datos de la bodega:", err);
        }
    };
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Si es cédula, solo aceptar números
        if (name === 'cedula' && !/^\d*$/.test(value)) return;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagen(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
       
    };

    const bancos = ['Banco Central', 'Banco del Sol', 'Financiera Águila'];

    return (
        <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center p-6">
            <div className="w-full max-w-3xl bg-white p-10 rounded-xl shadow-2xl border border-gray-200">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-indigo-700">Depósitos Pendientes</h1>
                        <p className="text-gray-500 flex items-center gap-2 text-sm mt-1">
                            <FiCalendar className="text-indigo-500" />
                            Fecha actual: {new Date().toLocaleDateString()}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Campo Cédula */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                                <FiHash className="text-indigo-500" /> Cédula
                            </label>
                            <input
                                type="text"
                                name="cedula"
                                value={formData.cedula}
                                onChange={handleChange}
                                maxLength={10}
                                className="w-full border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>

                        {/* Campo Nombre */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                                <FiUser className="text-indigo-500" /> Nombre
                            </label>
                            <input
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                disabled={!formEnabled}
                                className="w-full border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                                <FiFileText className="text-indigo-500" /> Almacén
                            </label>
                            <select
                                name="bodega"
                                value={formData.bodega}
                                onChange={handleChange}
                                disabled={!formEnabled}
                                className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                                required
                            >
                                <option value="">Seleccione una bodega</option>
                                {data?.map((bodega) => (
                                    <option key={bodega.b_Bodega} value={bodega.b_Bodega}>
                                        {bodega.b_Nombre}
                                    </option>
                                ))}
                            </select>
                        </div>


                        {/* Campo Banco */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                                <FiFileText className="text-indigo-500" /> Banco
                            </label>
                            <select
                                name="banco"
                                value={formData.banco}
                                onChange={handleChange}
                                disabled={!formEnabled}
                                className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                                required
                            >
                                <option value="">Seleccione un banco</option>
                                {bancos.map((banco, index) => (
                                    <option key={index} value={banco}>{banco}</option>
                                ))}
                            </select>
                        </div>



                        {/* Campo Nº de Depósito */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                                <FiHash className="text-indigo-500" /> Nº de Depósito
                            </label>
                            <input
                                type="text"
                                name="numeroDeposito"
                                value={formData.numeroDeposito}
                                onChange={handleChange}
                                disabled={!formEnabled}
                                className="w-full border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                                required
                            />
                        </div>
                    </div>

                    {/* Detalle */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                            <FiFileText className="text-indigo-500" /> Detalle
                        </label>
                        <textarea
                            name="detalle"
                            value={formData.detalle}
                            onChange={handleChange}
                            disabled={!formEnabled}
                            className="w-full border border-gray-300 rounded-md px-4 py-2 shadow-sm resize-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                            rows="3"
                        ></textarea>
                    </div>

                    {/* Abono */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                            <FiDollarSign className="text-indigo-500" /> Abono
                        </label>
                        <input
                            type="number"
                            name="abono"
                            value={formData.abono}
                            onChange={handleChange}
                            disabled={!formEnabled}
                            className="w-full border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                            required
                        />
                    </div>

                    {/* Subida de imagen */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <FiUploadCloud className="text-indigo-500" /> Comprobante de Depósito (Imagen)
                        </label>
                        <div className={`flex flex-col items-center justify-center border-2 border-dashed rounded-md p-6 ${formEnabled ? 'border-indigo-300 bg-gray-50' : 'border-gray-200 bg-gray-100'}`}>
                            {preview ? (
                                <img src={preview} alt="Vista previa" className="w-60 rounded-md mb-4" />
                            ) : (
                                <span className="text-gray-500 mb-2">No se ha cargado ninguna imagen</span>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                disabled={!formEnabled}
                                className="hidden"
                                id="imagenInput"
                            />
                            <label
                                htmlFor="imagenInput"
                                className={`px-4 py-2 rounded-md cursor-pointer transition ${formEnabled
                                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                        : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                    }`}
                            >
                                Cargar Imagen
                            </label>
                        </div>
                    </div>

                    <div className="text-center">
                        <button
                            type="submit"
                            disabled={!formEnabled}
                            className={`px-6 py-2 rounded-md font-medium shadow-md transition ${formEnabled
                                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                    : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                }`}
                        >
                            Confirmar Depósito
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
