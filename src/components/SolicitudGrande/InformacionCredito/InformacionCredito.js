import React from "react";

export function InformacionCredito() {

    return (
        <div>
            <h1> Información Crédito</h1>
            {/* Primera Fila */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {/* Score */}
                <div className="flex flex-col">
                    <label className="text-lightGrey text-xs mb-2">Score</label>
                    <input
                        type="number"
                        name="apellidoPaterno"
                        placeholder="Score"
                        className="p-2 border rounded"
                    />
                </div>
                {/* Rango Ingresos */}
                <div className="flex flex-col">
                    <label className="text-lightGrey text-xs mb-2">Rango Ingresos</label>
                    <input
                        type="text"
                        name="rangeIngresos"
                        placeholder="Rango Ingresos"
                        className="p-2 border rounded"
                        pattern="[A-Za-z]+"
                        title="Solo se permiten letras y espacios"
                    />
                </div>
                {/* Resultado Equifax */}
                <div className="flex flex-col">
                    <label className="text-lightGrey text-xs mb-2">Resultado Equifax</label>
                    <input
                        type="text"
                        name="resultadoEquifax"
                        placeholder="Resultado Equifax"
                        className="p-2 border rounded"
                        pattern="[A-Za-z]+"
                    />
                </div>
            </div>
            {/* Segunda Fila */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {/* Score Inclusion */}
                <div className="flex flex-col">
                    <label className="text-lightGrey text-xs mb-2">Score Inclusion</label>
                    <input
                        type="number"
                        name="scoreInclusion"
                        placeholder="Score Inclusion"
                        className="p-2 border rounded"
                    />
                </div>
                {/* Capacidad Pago */}
                <div className="flex flex-col">
                    <label className="text-lightGrey text-xs mb-2">Capacidad Pago</label>
                    <input
                        type="number"
                        name="capacidadPago"
                        placeholder="Capacidad Pago"
                        className="p-2 border rounded"
                    />
                </div>
                {/* Segmentación Equifax */}
                <div className="flex flex-col">
                    <label className="text-lightGrey text-xs mb-2">Segmentación Equifax</label>
                    <input
                        type="number"
                        name="segmentacionEquifax"
                        placeholder="Segmentación Equifax"
                        className="p-2 border rounded"
                    />
                </div>
            </div>
            {/* Tercera Fila */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {/* Score de Sobreendeudamiento */}
                <div className="flex flex-col">
                    <label className="text-lightGrey text-xs mb-2">Score Sobreendeudamiento</label>
                    <input
                        type="number"
                        name="scoreSobreendeudamiento"
                        placeholder="Score Sobreendeudamiento"
                        className="p-2 border rounded"
                    />
                </div>
                {/* Total Vencido */}
                <div className="flex flex-col">
                    <label className="text-lightGrey text-xs mb-2">Total Vencido</label>
                    <input
                        type="number"
                        name="totalVencido"
                        placeholder="Total Vencido"
                        className="p-2 border rounded"
                    />
                </div>
            </div>
            {/* Cuarta Fila */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <div></div>
                {/* Cartera Castigada*/}
                <div className="flex flex-col col-start-2 col-span-1">
                    <label className="text-lightGrey text-xs mb-2">Cartera Castigada</label>
                    <input
                        type="number"
                        name="cartetaCastigada"
                        placeholder="Cartera Castigada"
                        className="p-2 border rounded"
                    />
                </div>
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
