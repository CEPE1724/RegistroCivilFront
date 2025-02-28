import React from 'react';

export function SeccionA() {
    return (
        <div className="p-6 bg-gray-100 rounded-lg shadow-md">
            <h1 className="text-xl font-bold mb-4">Datos del Negocio</h1>
            <div className="bg-white p-6 rounded-lg shadow">
                {/* Rejilla adaptable para responsive */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    {/* Primera fila: Nombre, Tiempo, Metros, Ingresos y Gastos */}
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold mb-1">Nombre de Negocio</label>
                        <input type="text" className="bg-[#F9FAFB] w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm" />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold mb-1">Tiempo del Negocio</label>
                        <input type="number" className="bg-[#F9FAFB] w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm" />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold mb-1">Metros</label>
                        <input type="number" className="bg-[#F9FAFB] w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm" />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold mb-1">Ingresos</label>
                        <input type="number" className="bg-[#F9FAFB] w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm" />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold mb-1">Gastos</label>
                        <input type="number" className="bg-[#F9FAFB] w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm" />
                    </div>

                    {/* Segunda fila: Cantón, Parroquia, Barrio */}
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold mb-1">Provincia</label>
                        <input type="text" className="bg-[#F9FAFB] w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm" />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-semibold mb-1">Cantón</label>
                        <input type="text" className="bg-[#F9FAFB] w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm" />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold mb-1">Parroquia</label>
                        <select className="bg-[#F9FAFB] w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm">
                            <option>Seleccione</option>
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold mb-1">Barrio</label>
                        <input type="text" className="bg-[#F9FAFB] w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm" />
                    </div>

                        
                    <div className="lg:col-span-1"></div>

                   

                  

                    {/* Tercera fila: Calle Principal, Calle Secundaria, Número de Casa, Referencia de Ubicación */}
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold mb-1">Calle Principal</label>
                        <input type="text" className="bg-[#F9FAFB] w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm" />
                    </div>


                    <div className="flex flex-col">
                        <label className="text-sm font-semibold mb-1">Número Casa</label>
                        <input type="text" className="bg-[#F9FAFB] w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm" />
                    </div>


                    <div className="flex flex-col">
                        <label className="text-sm font-semibold mb-1">Calle Secundaria</label>
                        <input type="text" className="bg-[#F9FAFB] w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm" />
                    </div>
                   
                    
                    <div className="flex flex-col lg:col-span-2">
                        <label className="text-sm font-semibold mb-1">Referencia Ubicación</label>
                        <textarea className="bg-[#F9FAFB] w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm h-20"></textarea>
                    </div>

                    {/* Cuarta fila: Actividad del Negocio y Opciones */}
                    <div className="flex flex-col lg:col-span-2">
                        <label className="text-sm font-semibold mb-1">Actividad del Negocio</label>
                        <textarea className="bg-[#F9FAFB] w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm h-20"></textarea>
                    </div>

                    {/* Opciones */}
                    <div className="lg:col-span-2 flex flex-col lg:flex-row lg:items-center lg:space-x-4 space-y-2 lg:space-y-0">
                        <label className="text-sm font-semibold">Opciones:</label>
                        <label className="inline-flex items-center">
                            <input type="checkbox" className="mr-2" />
                            Afiliado Tributario
                        </label>
                        <label className="inline-flex items-center">
                            <input type="checkbox" className="mr-2" />
                            Obligado a Llevar Contabilidad
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}
