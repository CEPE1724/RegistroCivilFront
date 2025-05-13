import React, { useState, useEffect } from "react";
import { Paginacion } from "../../Utils";
import { TablaConDocumentos } from "../TablaConDocumentos";
import { GoogleGeoreferencia } from "../GoogleGeoreferencia";
import { APIURL } from "../../../configApi/apiConfig";
import axios from "../../../configApi/axiosConfig"

export function GestorGeoreferencia() {
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [cedula, setCedula] = useState("");
    const [estado, setEstado] = useState("");
    const [tipo, setTipo] = useState("");
    const [datos, setDatos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [fileToView, setFileToView] = useState("");
    const [isModalGoogleOpen, setIsModalGoogleOpen] = useState(false);
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);

    const optEstado = [
        { value: 0, label: "PENDIENTE" },
        { value: 1, label: "APROBADO" },
        { value: 2, label: "RECHAZADO" }
    ];

    const optTipo = [
        { value: 1, label: "DOMICILIO" },
        { value: 2, label: "LABORAL" },
    ];

    useEffect(() => {
        fetchData();
    }, [fechaInicio, fechaFin, cedula, estado, tipo, currentPage]);

  
const fetchData = async () => {
    try {
        const fechaHoy = new Date().toISOString().split("T")[0];
        const fechahoymasuno = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().split("T")[0];
        const fechaInicioFinal = fechaInicio || fechaHoy;
        const fechaFinFinal = fechaFin || fechahoymasuno;
        const estadoFinal = estado || 0;
        const tipoFinal = tipo || 0;
        const itemsPerPage = 5;
        const offset = (currentPage - 1) * itemsPerPage;

        const queryParams = {
            FechaInicio: fechaInicioFinal,
            FechaFin: fechaFinFinal,
            Estado: estadoFinal,
            Tipo: tipoFinal,
            Cedula: cedula,
            limit: itemsPerPage,
            offset: offset,
        };

        const response = await axios.get(APIURL.getCoordenadasprefactura(), {
            params: queryParams
        });

        const data = response.data;

        setDatos(data.data);
        setTotalRecords(data.total);
        setTotalPages(Math.ceil(data.total / itemsPerPage));
    } catch (error) {
        console.log(error);
    }
};

    const changePage = (page) => {
        setCurrentPage(page);
    };

    const openModal = (fileUrl) => {
        setFileToView(fileUrl);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const openModalGoogle = (lat, lng) => {
        setLatitude(lat);
        setLongitude(lng);
        setIsModalGoogleOpen(true);
    };

    const closeModalGoogle = () => {
        setIsModalGoogleOpen(false);
    };

    return (
        <>
            <div className="p-4 sm:p-6 bg-gray-50 min-h-screen overflow-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex flex-col">
                        <label className="text-lightGrey text-xs mb-2">Desde</label>
                        <input
                            type="date"
                            value={fechaInicio}
                            onChange={(e) => setFechaInicio(e.target.value)}
                            className="p-2 border rounded"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-lightGrey text-xs mb-2">Hasta</label>
                        <input
                            type="date"
                            value={fechaFin}
                            onChange={(e) => setFechaFin(e.target.value)}
                            className="p-2 border rounded"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-lightGrey text-xs mb-2">Estado</label>
                        <select
                            value={estado}
                            onChange={(e) => setEstado(e.target.value)}
                            className="p-2 border rounded"
                        >
                            <option value="">Seleccione una opción</option>
                            {optEstado.map((opcion) => (
                                <option key={opcion.value} value={opcion.value}>
                                    {opcion.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-lightGrey text-xs mb-2">Tipo</label>
                        <select
                            value={tipo}
                            onChange={(e) => setTipo(e.target.value)}
                            className="p-2 border rounded"
                        >
                            <option value="">Seleccione una opción</option>
                            {optTipo.map((opcion) => (
                                <option key={opcion.value} value={opcion.value}>
                                    {opcion.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-lightGrey text-xs mb-2">Cedula</label>
                        <input
                            type="text"
                            value={cedula}
                            onChange={(e) => setCedula(e.target.value)}
                            placeholder="Cédula"
                            className="p-2 border rounded"
                        />
                    </div>
                </div>




                <div className="p-6 bg-gray-50 min-h-screen overflow-auto">
                    <div className="overflow-x-auto bg-white shadow-lg rounded-lg border border-gray-300">
                        <table className="min-w-full table-auto">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="px-4 py-2 text-center font-bold">#</th>
                                    <th className="px-4 py-2 text-center font-bold">Fecha</th>
                                    <th className="px-4 py-2 text-center font-bold">Cédula</th>
                                    <th className="px-4 py-2 text-center font-bold">Dirección</th>
                                    <th className="px-4 py-2 text-center font-bold">Estado</th>
                                    <th className="px-4 py-2 text-center font-bold">Tipo</th>
                                    <th className="px-4 py-2 text-center font-bold hidden">Aprobar</th>
                                    <th className="px-4 py-2 text-center font-bold">Documentos</th>
                                    <th className="px-4 py-2 text-center font-bold">Ubicación</th>
                                </tr>
                            </thead>
                            <tbody>
                                {datos?.map((data, index) => {
                                    const estado = optEstado.find(option => option.value === data.iEstado);
                                    const estadoLabel = estado ? estado.label : 'Desconocido';

                                    const tipo = optTipo.find(option => option.value === data.Tipo);
                                    const tipoLabel = tipo ? tipo.label : 'Desconocido';
                                    const formatFecha = new Date(data.FechaSistema).toLocaleDateString();
                                    return (
                                        <tr key={data.idCoordenadasPrefactura}>
                                            <td className="px-4 py-2 text-center">{index + 1}</td>
                                            <td className="px-4 py-2 text-center">{formatFecha}</td>
                                            <td className="px-4 py-2 text-center">{data.cedula}</td>
                                            <td className="px-4 py-2 text-center">{data.direccion}</td>
                                            <td className="px-4 py-2 text-center">{estadoLabel}</td>
                                            <td className="px-4 py-2 text-center">{tipoLabel}</td>
                                            <td className="px-4 py-2 text-center hidden">
                                                <input
                                                    type="checkbox"
                                                    className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                            </td>
                                            <td className="px-4 py-2 text-center">
                                                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                                                    onClick={() => openModal(data.UrlImagen)}
                                                >
                                                    Ver
                                                </button>
                                            </td>
                                            <td className="px-4 py-2 text-center">
                                                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                                                    onClick={() => openModalGoogle(data.latitud, data.longitud)}
                                                >
                                                    Ver
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                    </div>
                    <Paginacion
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={changePage}
                    />
                    <TablaConDocumentos
                        isOpen={isModalOpen}
                        closeModal={closeModal}
                        urls={fileToView}
                    />

                    <GoogleGeoreferencia
                        isOpen={isModalGoogleOpen}
                        closeModal={closeModalGoogle}
                        latitude={latitude}
                        longitude={longitude}
                    />
                </div>
            </div>

        </>
    );
}
