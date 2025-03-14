import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";

export function InformacionCredito() {

    const { enqueueSnackbar } = useSnackbar();
    //almacenar datos del formulario
    const [formData, setFormData] = useState({
        score: "",
        rangeIngresos: "",
        resultadoEquifax: "",
        scoreInclusion: "",
        capacidadPago: "",
        segmentacionEquifax: "",
        scoreSobreendeudamiento: "",
        totalVencido: "",
        carteraCastigada: "",
    });

    const handleAgregar = () => {
        // Validar campos
        if (formData.score === "") {
            enqueueSnackbar("Score es requerido", { variant: "error" });
            return;
        }
        if (formData.rangeIngresos === "") {
            enqueueSnackbar("Rango Ingresos es requerido", { variant: "error" });
            return;
        }
        if (formData.resultadoEquifax === "") {
            enqueueSnackbar("Resultado Equifax es requerido", { variant: "error" });
            return;
        }
        if (formData.scoreInclusion === "") {
            enqueueSnackbar("Score Inclusion es requerido", { variant: "error" });
            return;
        }
        if (formData.capacidadPago === "") {
            enqueueSnackbar("Capacidad Pago es requerido", { variant: "error" });
            return;
        }
        if (formData.segmentacionEquifax === "") {
            enqueueSnackbar("Segmentación Equifax es requerido", { variant: "error" });
            return;
        }
        if (formData.scoreSobreendeudamiento === "") {
            enqueueSnackbar("Score Sobreendeudamiento es requerido", { variant: "error" });
            return;
        }
        if (formData.totalVencido === "") {
            enqueueSnackbar("Total Vencido es requerido", { variant: "error" });
            return;
        }
        if (formData.carteraCastigada === "") {
            enqueueSnackbar("Cartera Castigada es requerido", { variant: "error" });
            return;
        }   
        enqueueSnackbar("Datos Guardados", { variant: "success" });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value,});
    }

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {/* Score */}
                <div className="flex flex-col">
                    <label className="Informacioncliente-style">Score(*)</label>
                    <input
                        type="number"
                        name="score"
                        autocomplete="off"
                        placeholder="Score"
                        className="p-2 border rounded"
                        value={formData.score}
                        onChange={handleChange}
                    />
                </div>
                {/* Rango Ingresos */}
                <div className="flex flex-col">
                    <label className="Informacioncliente-style">Rango Ingresos(*)</label>
                    <input
                        type="text"
                        name="rangeIngresos"
                        autocomplete="off"
                        placeholder="Rango Ingresos"
                        className="p-2 border rounded"
                        pattern="[A-Za-z]+"
                        title="Solo se permiten letras y espacios"
                        value={formData.rangeIngresos}
                        onChange={handleChange}
                    />
                </div>
                {/* Resultado Equifax */}
                <div className="flex flex-col">
                    <label className="Informacioncliente-style">Resultado Equifax(*)</label>
                    <input
                        type="text"
                        name="resultadoEquifax"
                        autocomplete="off"
                        placeholder="Resultado Equifax"
                        className="p-2 border rounded"
                        pattern="[A-Za-z]+"
                        value={formData.resultadoEquifax}
                        onChange={handleChange}
                    />
                </div>
            </div>
            {/* Segunda Fila */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {/* Score Inclusion */}
                <div className="flex flex-col">
                    <label className="Informacioncliente-style">Score Inclusion(*)</label>
                    <input
                        type="number"
                        name="scoreInclusion"
                        autocomplete="off"
                        placeholder="Score Inclusion"
                        className="p-2 border rounded"
                        value={formData.scoreInclusion}
                        onChange={handleChange}
                    />
                </div>
                {/* Capacidad Pago */}
                <div className="flex flex-col">
                    <label className="Informacioncliente-style">Capacidad Pago(*)</label>
                    <input
                        type="number"
                        name="capacidadPago"
                        autocomplete="off"
                        placeholder="Capacidad Pago"
                        className="p-2 border rounded"
                        value={formData.capacidadPago}
                        onChange={handleChange}
                    />
                </div>
                {/* Segmentación Equifax */}
                <div className="flex flex-col">
                    <label className="Informacioncliente-style">Segmentación Equifax(*)</label>
                    <input
                        type="number"
                        name="segmentacionEquifax"
                        autocomplete="off"
                        placeholder="Segmentación Equifax"
                        className="p-2 border rounded"
                        value={formData.segmentacionEquifax}
                        onChange={handleChange}
                    />
                </div>
            </div>
            {/* Tercera Fila */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {/* Score de Sobreendeudamiento */}
                <div className="flex flex-col">
                    <label className="Informacioncliente-style">Score Sobreendeudamiento(*)</label>
                    <input
                        type="number"
                        name="scoreSobreendeudamiento"
                        autocomplete="off"
                        placeholder="Score Sobreendeudamiento"
                        className="p-2 border rounded"
                        value={formData.scoreSobreendeudamiento}
                        onChange={handleChange}
                    />
                </div>
                {/* Total Vencido */}
                <div className="flex flex-col">
                    <label className="Informacioncliente-style">Total Vencido(*)</label>
                    <input
                        type="number"
                        name="totalVencido"
                        autocomplete="off"
                        placeholder="Total Vencido"
                        className="p-2 border rounded"
                        value={formData.totalVencido}
                        onChange={handleChange}
                    />
                </div>
            </div>
            {/* Cuarta Fila */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <div></div>
                {/* Cartera Castigada*/}
                <div className="flex flex-col">
                    <label className="Informacioncliente-style">Cartera Castigada(*)</label>
                    <input
                        type="number"
                        name="carteraCastigada"
                        autocomplete="off"
                        placeholder="Cartera Castigada"
                        className="p-2 border rounded"
                        value={formData.carteraCastigada}
                        onChange={handleChange}
                    />
                </div>
                {/* boton guardar */}
                <button onClick={handleAgregar} className="p-2 bg-blue-500 text-white rounded mr-2">
                    Agregar
                </button>
            </div>
            {/* Tabla */}
            <div className="p-6 bg-gray-50 min-h-screen overflow-auto">
                <div className="overflow-x-auto bg-white shadow-lg rounded-lg border border-gray-300">
                    <table className="min-w-full table-auto">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="px-4 py-2 text-center font-bold">Número</th>
                                <th className="px-4 py-2 text-center font-bold">Fecha</th>
                                <th className="px-4 py-2 text-center font-bold">E. Financiera</th>
                                <th className="px-4 py-2 text-center font-bold">Lote</th>
                                <th className="px-4 py-2 text-center font-bold">Motivo</th>
                                <th className="px-4 py-2 text-center font-bold">Bodega</th>
                                <th className="px-4 py-2 text-center font-bold">Cuotas</th>
                                <th className="px-4 py-2 text-center font-bold">Monto</th>
                                <th className="px-4 py-2 text-center font-bold">F. Pago</th>
                                <th className="px-4 py-2 text-center font-bold">Valor Cuota</th>
                                <th className="px-4 py-2 text-center font-bold">C. Pendiente</th>
                                <th className="px-4 py-2 text-center font-bold">C. Pagada</th>
                                <th className="px-4 py-2 text-center font-bold">Saldo C</th>
                                <th className="px-4 py-2 text-center font-bold">P. Retraso</th>
                                <th className="px-4 py-2 text-center font-bold">Ult Pago</th>
                            </tr>
                        </thead>
                        <tbody>
                            <td className="px-4 py-2 text-center">Ejemplo</td>
                            <td className="px-4 py-2 text-center">Ejemplo</td>
                            <td className="px-4 py-2 text-center">Ejemplo</td>
                            <td className="px-4 py-2 text-center">Ejemplo</td>
                            <td className="px-4 py-2 text-center">Ejemplo</td>
                            <td className="px-4 py-2 text-center">Ejemplo</td>
                            <td className="px-4 py-2 text-center">Ejemplo</td>
                            <td className="px-4 py-2 text-center">Ejemplo</td>
                            <td className="px-4 py-2 text-center">Ejemplo</td>
                            <td className="px-4 py-2 text-center">Ejemplo</td>
                            <td className="px-4 py-2 text-center">Ejemplo</td>
                            <td className="px-4 py-2 text-center">Ejemplo</td>
                            <td className="px-4 py-2 text-center">Ejemplo</td>
                            <td className="px-4 py-2 text-center">Ejemplo</td>
                            <td className="px-4 py-2 text-center">Ejemplo</td>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
