

import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { DetalleCobranza } from '../components';
import { TablaAmortizacionWeb } from '../components';
import {
    CalendarIcon,
    UserIcon,
    BuildingOfficeIcon,
    BanknotesIcon,
    MagnifyingGlassIcon,
    DocumentArrowDownIcon,
    DocumentArrowUpIcon,
    MapPinIcon,
    ChartBarIcon,
    FunnelIcon,
    EyeIcon,
    PencilSquareIcon,
    TrashIcon,
    UserGroupIcon,
    ExclamationCircleIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon

} from '@heroicons/react/24/outline';
import { APIURL } from '../configApi/apiConfig';
import axios from '../configApi/axiosConfig';
const InformesCobranza = () => {


    const [filters, setFilters] = useState({
        tipoGestion: 0,
        filtroGestion: 0,
        diasMoraDesde: 1,
        diasMoraHasta: 150,
        operador: null,
        gestion: 0,
        gestor: 0,
        gestorHoy: 0,
        pageNumber: 1,
        pageSize: 5
    });

    // Operadores obtenidos de la API
    const [operadores, setOperadores] = useState([]);
    const [bancos, setBancos] = useState([]);
    const [estadoGestion, setEstadoGestion] = useState([]);
    const [selectGestores, setSelectGestores] = useState([]);
    const [porcentajeAvance, setPorcentajeAvance] = useState([]);
    // Cargar operadores al montar el componente
    useEffect(() => {
        fetchOperadores();
        fetchBancos();
        fetchEstadoGestion();
        fetchGestores();
        // Cargar datos iniciales con valores por defecto
        handleBuscar();
    }, []);

    /*consuma la api de porcentajeavance cuando preciones buscar  */



    const fetchOperadores = async () => {
        try {
            const response = await axios.get(APIURL.personal_bdd_findAllgestor());
            setOperadores(response.data);
        } catch (error) {
            setOperadores([]);
        }
    };

    const getchPorcentajeAvance = async (sCobrador) => {
        try {
            const response = await axios.get(APIURL.porcentaje_cobranza(sCobrador));
          
            // La API devuelve un array, extraer el primer elemento
            const data = Array.isArray(response.data) ? response.data[0] : response.data || {};
            setPorcentajeAvance(data);
  
        } catch (error) {
            setPorcentajeAvance({});
        }
    };
    const fetchGestores = async () => {
        try {
            const response = await axios.get(APIURL.findAllCbo_Gestores());
            setSelectGestores(response.data.data);
        } catch (error) {
            setSelectGestores([]);
        }
    };
    const fetchBancos = async () => {
        try {
            const response = await axios.get(APIURL.cre_entidad_financiera_findAllCobranza(true));
            setBancos(response.data);
        } catch (error) {
            setBancos([]);
        }
    };

    const fetchEstadoGestion = async () => {
        try {
            const response = await axios.get(APIURL.SelectDato());
            setEstadoGestion(response.data.data);
        }
        catch (error) {
            setEstadoGestion([]);
        }
    };

    const [isDetalleOpen, setIsDetalleOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    const [showTablaAmortizacion, setShowTablaAmortizacion] = useState(false);
    const [selectedAmortizacion, setSelectedAmortizacion] = useState(null);

    const [metricas, setMetricas] = useState({
        proyectado: 0.00,
        cobrado: 0.00,
        avance: 0.00,
        cobroExterno: 0.00
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const pageSize = 100;

    const [tableData, setTableData] = useState([]);

    const handleFilterChange = (field, value) => {
        // Convertir a número los campos que lo requieren
        let finalValue = value;
        if (['tipoGestion', 'filtroGestion', 'gestion'].includes(field)) {
            finalValue = parseInt(value) || 0;
        } else if (['diasMoraDesde', 'diasMoraHasta'].includes(field)) {
            finalValue = parseInt(value) || 0;
        } else if (['gestorHoy'].includes(field)) {
            finalValue = parseInt(value) || 0;
        }
        // operador se mantiene como string para comparación

        setFilters(prev => ({ ...prev, [field]: finalValue }));
    };

    const handleBuscar = async (pageNum = 1) => {
        try {
            // Convertir valores del filtro a parámetros de API
            const diasMoraDesde = parseInt(filters.diasMoraDesde) || 0;
            const diasMoraHasta = parseInt(filters.diasMoraHasta) || 150;
            const cobradorOperador = parseInt(filters.tipoGestion) || 0;
            const idOperadorCobrador = filters.operador ? filters.operador : null;
            const gestionados = parseInt(filters.filtroGestion) === 0 ? 0 : (parseInt(filters.filtroGestion) === 1 ? 1 : 2);
            const idCbo_ResultadoGestion = filters.gestion ? parseInt(filters.gestion) : 0;
            const idGestor = filters.gestor ? parseInt(filters.gestor) : 0;
            const gestionHoy = filters.gestorHoy ? parseInt(filters.gestorHoy) : 0;

            const response = await axios.get(
                APIURL.cbo_gestores_cobranzas_operativo(
                    diasMoraDesde,
                    diasMoraHasta,
                    cobradorOperador,
                    idOperadorCobrador,
                    gestionados,
                    idCbo_ResultadoGestion,
                    idGestor,
                    gestionHoy,
                    pageNum,
                    filters.pageSize,

                )
            );
         

            // La API devuelve {data: Array, pageNumber, pageSize, totalCount}
            const dataArray = response.data.data || response.data;
            const total = response.data.totalCount || 0;
            if(filters.operador)
            {
            await getchPorcentajeAvance (filters.operador);
            }

            if (dataArray && Array.isArray(dataArray)) {
                setTableData(dataArray);
                setTotalCount(total);
                setCurrentPage(pageNum);

                // Calcular métricas
                const totalProyectado = dataArray.reduce((sum, row) => sum + (row.Valor_Cobrar_Proyectado || 0), 0);
                const totalCobrado = dataArray.reduce((sum, row) => sum + (row.Valor_Cobrado_Total || 0), 0);
                const avance = totalProyectado > 0 ? ((totalCobrado / totalProyectado) * 100).toFixed(2) : 0;

                setMetricas({
                    proyectado: porcentajeAvance?.TotalProyectado ? parseFloat(porcentajeAvance.TotalProyectado).toFixed(2) : totalProyectado.toFixed(2),
                    cobrado: porcentajeAvance?.TotalCobrado ? parseFloat(porcentajeAvance.TotalCobrado).toFixed(2) : totalCobrado.toFixed(2),
                    avance: porcentajeAvance?.PorcentajeCobrado ? parseFloat(porcentajeAvance.PorcentajeCobrado).toFixed(2) : avance,
                    cobroExterno: 0.00
                });
            }
        } catch (error) {
            console.error('Error al buscar gestiones de cobranza:', error);
            // Mantener datos anteriores en caso de error
        }
    };

    const handleExportar = (tipo) => {
        console.log(`Exportando a ${tipo}`);
        // Lógica de exportación
    };

    const handleVerDetalle = (row) => {
        setSelectedRow(row);
        setIsDetalleOpen(true);
    };

    const handleCloseDetalle = () => {
        setIsDetalleOpen(false);
        setSelectedRow(null);
    };

    const handleTablaAmortizacion = (row) => {
        setSelectedAmortizacion(row);
        setShowTablaAmortizacion(true);
    };

    const handleCloseTablaAmortizacion = () => {
        setShowTablaAmortizacion(false);
        setSelectedAmortizacion(null);
    };

    // Función para obtener el icono del operador según la selección
    const getOperadorIcon = () => {
        // Buscar el operador seleccionado en la lista de operadores
        const operadorSeleccionado = operadores.find(op => String(op.idPersonalBDD) === String(filters.operador));
        if (operadorSeleccionado) {
            if (operadorSeleccionado.idGrupo === 19) {
                // Call Center
                return <UserGroupIcon className="w-4 h-4 mr-2 text-blue-600" title="Call Center" />;
            }
            if (operadorSeleccionado.idGrupo === 33) {
                // Cobrador
                return <BanknotesIcon className="w-4 h-4 mr-2 text-emerald-600" title="Cobrador" />;
            }
        }
        // Por defecto
        return <UserIcon className="w-4 h-4 mr-2 text-blue-600" />;
    };
    /*idCbo_Riesgo	Riesgo
    1	ALTO RIESGO
    2	MEDIANO RIESGO
    3	BAJO RIESGO
    
    colocar iconos
    */
    const TipoRiesgo = [
        { id: 1, label: 'ALTO RIESGO', icon: <ExclamationCircleIcon className="w-4 h-4 text-red-600" title="Alto Riesgo" /> },
        { id: 2, label: 'MEDIANO RIESGO', icon: <ExclamationTriangleIcon className="w-4 h-4 text-yellow-600" title="Mediano Riesgo" /> },
        { id: 3, label: 'BAJO RIESGO', icon: <CheckCircleIcon className="w-4 h-4 text-green-600" title="Bajo Riesgo" /> },
    ];

    return (
        <>
            <Layout />
            <div className="w-full min-h-screen bg-gray-50 p-3 lg:p-6">
                {/* Header Mejorado */}
                <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 rounded-2xl shadow-2xl border border-blue-400/50 p-6 mb-8">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center space-x-4">
                            <div className="bg-white/20 p-4 rounded-2xl shadow-lg backdrop-blur-sm border border-white/30 transform hover:scale-110 transition-transform duration-300">
                                <ChartBarIcon className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl lg:text-4xl font-bold text-white drop-shadow-lg">
                                    Informes de Cobranza
                                </h1>
                                <p className="text-sm text-blue-100 mt-1 flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse shadow-lg"></span>
                                    Sistema de gestión y seguimiento operacional
                                </p>
                            </div>
                        </div>

                        {/* Botones de acción superiores - Mejorados */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <button
                                onClick={() => handleExportar('excel')}
                                className="group px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center gap-2 text-sm font-semibold transform hover:scale-110 active:scale-95 border border-emerald-400/50"
                            >
                                <DocumentArrowDownIcon className="w-4 h-4 group-hover:rotate-12 group-hover:-translate-y-1 transition-all" />
                                <span className="hidden sm:inline">Excel</span>
                            </button>
                            <button className="px-4 py-2.5 bg-violet-500 hover:bg-violet-600 text-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 text-sm font-semibold transform hover:scale-110 active:scale-95 border border-violet-400/50">
                                <span className="hidden sm:inline">Créditos Nómina</span>
                                <span className="sm:hidden">Nómina</span>
                            </button>
                            <button className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center gap-2 text-sm font-semibold transform hover:scale-110 active:scale-95 border border-blue-400/50">
                                <DocumentArrowUpIcon className="w-4 h-4" />
                                <span className="hidden md:inline">Importar</span>
                            </button>
                            <button className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center gap-2 text-sm font-semibold transform hover:scale-110 active:scale-95 border border-amber-400/50">
                                <MapPinIcon className="w-4 h-4" />
                                <span className="hidden md:inline">Barrios</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-6">
                    {/* Panel de Filtros - Mejorado */}
                    <div className="xl:col-span-3">
                        <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-xl border border-blue-200 overflow-hidden sticky top-4 backdrop-blur-sm border-t-4 border-t-blue-500">

                            {/* HEADER */}
                            <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 px-4 py-4">
                                <div className="flex items-center space-x-2">
                                    <div className="p-2 bg-white/20 rounded-md backdrop-blur-sm">
                                        <FunnelIcon className="w-5 h-5 text-white" />
                                    </div>
                                    <h2 className="text-base font-bold text-white tracking-wide">
                                        Filtrar resultados
                                    </h2>
                                </div>
                            </div>

                            {/* BODY */}
                            <div className="p-4 space-y-3 max-h-[calc(100vh-180px)] overflow-y-auto custom-scrollbar">

                                {/* Tipo de Gestión */}
                                <div className="bg-white rounded-lg shadow-md border border-blue-100 p-3 hover:border-blue-300 transition">
                                    <label className="text-[11px] font-bold text-gray-700 uppercase mb-2 block">
                                        Tipo de Gestión
                                    </label>
                                    <div className="flex gap-3">
                                        {[
                                            { value: 0, label: 'Todos', icon: '📊' },
                                            { value: 1, label: 'Operador', icon: '👤' },
                                            { value: 2, label: 'Cobrador', icon: '💼' }
                                        ].map(option => (
                                            <label
                                                key={option.value}
                                                className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-blue-50 transition"
                                            >
                                                <input
                                                    type="radio"
                                                    name="tipoGestion"
                                                    value={option.value}
                                                    checked={filters.tipoGestion === option.value}
                                                    onChange={(e) =>
                                                        handleFilterChange('tipoGestion', e.target.value)
                                                    }
                                                    className="w-4 h-4 text-blue-600"
                                                />
                                                <span className="text-sm font-medium text-gray-700">
                                                    {option.icon} {option.label}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Tipo Gestor Hoy */}
                                <div className="bg-white rounded-lg shadow-md border border-blue-100 p-3 hover:border-blue-300 transition">
                                    <label className="text-[11px] font-bold text-gray-700 uppercase mb-2 block">
                                        Tipo de Gestor Hoy
                                    </label>
                                    <div className="flex gap-3">
                                        {[
                                            { value: 0, label: 'Todos', icon: '📊' },
                                            { value: 1, label: 'Día', icon: '📅' },
                                            { value: 2, label: 'Posteriores', icon: '⏳' }
                                        ].map(option => (
                                            <label
                                                key={option.value}
                                                className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-blue-50 transition"
                                            >
                                                <input
                                                    type="radio"
                                                    name="gestorHoy"
                                                    value={option.value}
                                                    checked={filters.gestorHoy === option.value}
                                                    onChange={(e) =>
                                                        handleFilterChange('gestorHoy', e.target.value)
                                                    }
                                                    className="w-4 h-4 text-blue-600"
                                                />
                                                <span className="text-sm font-medium text-gray-700">
                                                    {option.icon} {option.label}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Filtro Gestión */}
                                <div className="bg-white rounded-lg shadow-md border border-blue-100 p-3 hover:border-blue-300 transition">
                                    <label className="text-[11px] font-bold text-gray-700 uppercase mb-2 block">
                                        Filtro
                                    </label>

                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { value: 0, label: 'Todos', icon: '📋' },
                                            { value: 1, label: 'Con Gestión', icon: '✅' },
                                            { value: 2, label: 'Sin Gestión', icon: '⏳' }
                                        ].map(option => (
                                            <label
                                                key={option.value}
                                                className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-blue-50 transition"
                                            >
                                                <input
                                                    type="radio"
                                                    name="filtroGestion"
                                                    value={option.value}
                                                    checked={filters.filtroGestion === option.value}
                                                    onChange={(e) =>
                                                        handleFilterChange('filtroGestion', e.target.value)
                                                    }
                                                    className="w-4 h-4 text-blue-600"
                                                />
                                                <span className="text-sm font-medium text-gray-700">
                                                    {option.icon} {option.label}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Días de Mora */}
                                <div className="bg-blue-50 rounded-lg border border-blue-100 p-3">
                                    <label className="text-[11px] font-bold text-gray-700 uppercase mb-2 block">
                                        📅 Días de Mora
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="number"
                                            value={filters.diasMoraDesde}
                                            onChange={(e) =>
                                                handleFilterChange('diasMoraDesde', e.target.value)
                                            }
                                            className="w-full px-3 py-2 rounded-md border border-blue-200 text-sm font-medium"
                                            placeholder="Desde"
                                        />
                                        <input
                                            type="number"
                                            value={filters.diasMoraHasta}
                                            onChange={(e) =>
                                                handleFilterChange('diasMoraHasta', e.target.value)
                                            }
                                            className="w-full px-3 py-2 rounded-md border border-blue-200 text-sm font-medium"
                                            placeholder="Hasta"
                                        />
                                    </div>
                                </div>

                                {/* Operador */}
                                <div className="bg-white rounded-lg shadow-md border border-blue-100 p-3 hover:border-blue-300 transition">
                                    <label className="text-[11px] font-bold text-gray-700 uppercase mb-2 flex items-center gap-1">
                                        {getOperadorIcon()} Operador
                                    </label>
                                    <select
                                        value={filters.operador}
                                        onChange={(e) =>
                                            handleFilterChange('operador', e.target.value)
                                        }
                                        className="w-full px-3 py-2 rounded-md border border-blue-200 text-sm font-medium"
                                    >
                                        <option value="">Seleccionar...</option>
                                        {operadores?.map(op => (
                                            <option key={op.idPersonalBDD} value={op.idPersonalBDD}>
                                                {op.primerNombre} {op.segundoNombre} {op.apellidoPaterno} {op.apellidoMaterno} - {op.Codigo}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Gestión */}
                                <div className="bg-white rounded-lg shadow-md border border-blue-100 p-3 hover:border-blue-300 transition">
                                    <label className="text-[11px] font-bold text-gray-700 uppercase mb-2 block">
                                        Gestión
                                    </label>
                                    <select
                                        value={String(filters.gestion)}
                                        onChange={(e) =>
                                            handleFilterChange('gestion', e.target.value)
                                        }
                                        className="w-full px-3 py-2 rounded-md border border-blue-200 text-sm font-medium"
                                    >
                                        <option value="0">Seleccionar...</option>
                                        {estadoGestion.map(estado => (
                                            <option
                                                key={estado.idCbo_EstadoGestion}
                                                value={String(estado.idCbo_EstadoGestion)}
                                            >
                                                {estado.Estado}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Gestores */}
                                <div className="bg-white rounded-lg shadow-md border border-blue-100 p-3 hover:border-blue-300 transition">
                                    <label className="text-[11px] font-bold text-gray-700 uppercase mb-2 block">
                                        Gestores
                                    </label>
                                    <select
                                        value={String(filters.gestor)}
                                        onChange={(e) =>
                                            handleFilterChange('gestor', e.target.value)
                                        }
                                        className="w-full px-3 py-2 rounded-md border border-blue-200 text-sm font-medium"
                                    >
                                        <option value="0">Seleccionar...</option>
                                        {selectGestores.map(gestor => (
                                            <option
                                                key={gestor.idCbo_Gestores}
                                                value={String(gestor.idCbo_Gestores)}
                                            >
                                                {gestor.Gestor}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Botón Buscar */}
                                <button
                                    onClick={() => handleBuscar(1)}
                                    className="w-full py-3 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
                                >
                                    <MagnifyingGlassIcon className="w-5 h-5" />
                                    Buscar Registros
                                </button>

                            </div>
                        </div>
                    </div>


                    {/* Área Principal - Métricas y Tabla */}
                    <div className="xl:col-span-9 space-y-4 lg:space-y-6">
                        {/* Tarjetas de Métricas - Mejoradas */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                            {/* Proyectado */}
                            <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl p-5 border-l-4 border-blue-500 transform hover:-translate-y-1 transition-all duration-300">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wide">Proyectado</h3>
                                    <div className="p-2.5 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                                        <BanknotesIcon className="w-5 h-5 text-blue-600" />
                                    </div>
                                </div>
                                <p className="text-2xl lg:text-3xl font-bold text-gray-800">${metricas.proyectado}</p>
                                <p className="text-xs text-gray-500 mt-2">Meta del periodo</p>
                            </div>

                            {/* Cobrado */}
                            <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl p-5 border-l-4 border-emerald-500 transform hover:-translate-y-1 transition-all duration-300">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wide">Cobrado</h3>
                                    <div className="p-2.5 bg-emerald-100 rounded-xl group-hover:bg-emerald-200 transition-colors">
                                        <BanknotesIcon className="w-5 h-5 text-emerald-600" />
                                    </div>
                                </div>
                                <p className="text-2xl lg:text-3xl font-bold text-gray-800">${metricas.cobrado}</p>
                                <p className="text-xs text-emerald-600 mt-2 font-semibold">✓ Recaudado</p>
                            </div>

                            {/* % De Avance */}
                            <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl p-5 border-l-4 border-violet-500 transform hover:-translate-y-1 transition-all duration-300">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wide">% Avance</h3>
                                    <div className="p-2.5 bg-violet-100 rounded-xl group-hover:bg-violet-200 transition-colors">
                                        <ChartBarIcon className="w-5 h-5 text-violet-600" />
                                    </div>
                                </div>
                                <p className="text-2xl lg:text-3xl font-bold text-gray-800">{metricas.avance}%</p>
                                <div className="mt-2 bg-gray-200 rounded-full h-2 overflow-hidden">
                                    <div className="bg-gradient-to-r from-violet-500 to-violet-600 h-full rounded-full" style={{ width: `${metricas.avance}%` }}></div>
                                </div>
                            </div>

                           
                        </div>

                        {/* Tabla de Resultados - Mejorada */}
                        <div className="bg-white rounded-2xl shadow-2xl border border-blue-200 overflow-hidden backdrop-blur-sm border-t-4 border-t-blue-500">
                            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between flex-wrap gap-3">
                                <div className="flex items-center gap-3">
                                    <label className="text-sm font-semibold text-gray-700">Registros por página:</label>
                                    <select
                                        value={filters.pageSize}
                                        onChange={(e) => {
                                            const newPageSize = parseInt(e.target.value);
                                            setFilters(prev => ({ ...prev, pageSize: newPageSize }));
                                            // handleBuscar(1);
                                        }}
                                        className="px-3 py-2 rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-sm font-medium bg-white"
                                    >
                                        <option value="5">5</option>
                                        <option value="10">10</option>
                                        <option value="15">15</option>
                                        <option value="20">20</option>
                                        <option value="25">25</option>
                                    </select>
                                </div>
                            </div>
                            <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 px-5 py-5 flex items-center justify-between flex-wrap gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-white/20 rounded-lg backdrop-blur-sm border border-white/30">
                                        <ChartBarIcon className="w-5 h-5 text-white" />
                                    </div>
                                    <h2 className="text-lg font-bold text-white drop-shadow-lg">Gestiones de Cobranza</h2>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="px-3 py-1.5 bg-white/30 text-white rounded-lg text-xs font-bold backdrop-blur-sm border border-white/20 shadow-lg">
                                            {tableData.length} registros
                                        </span>
                                        <span className="text-xs text-white/70">
                                            Total: {totalCount} | Página {currentPage} de {Math.ceil(totalCount / pageSize)}
                                        </span>
                                    </div>

                                    {/* Controles de paginación */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleBuscar(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${currentPage === 1
                                                ? 'bg-gray-300/30 text-gray-400 cursor-not-allowed'
                                                : 'bg-white/30 text-white hover:bg-white/50 shadow-md border border-white/20'
                                                }`}
                                        >
                                            ← Anterior
                                        </button>

                                        <div className="flex gap-1">
                                            {[...Array(Math.min(5, Math.ceil(totalCount / pageSize)))].map((_, i) => {
                                                const pageNum = Math.max(1, currentPage - 2) + i;
                                                if (pageNum > Math.ceil(totalCount / pageSize)) return null;

                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => handleBuscar(pageNum)}
                                                        className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${currentPage === pageNum
                                                            ? 'bg-white text-blue-700 shadow-md'
                                                            : 'bg-white/20 text-white hover:bg-white/40'
                                                            }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <button
                                            onClick={() => handleBuscar(currentPage + 1)}
                                            disabled={currentPage >= Math.ceil(totalCount / pageSize)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${currentPage >= Math.ceil(totalCount / pageSize)
                                                ? 'bg-gray-300/30 text-gray-400 cursor-not-allowed'
                                                : 'bg-white/30 text-white hover:bg-white/50 shadow-md border border-white/20'
                                                }`}
                                        >
                                            Siguiente →
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gradient-to-r from-blue-50 to-blue-100 border-b-2 border-blue-200">
                                        <tr>
                                            <th className="px-4 py-3.5 text-center text-xs font-bold text-blue-700 uppercase tracking-wider">Acciones</th>
                                            <th className='px-4 py-3.5 text-left text-xs font-bold text-blue-700 uppercase tracking-wider'>Riesgo</th>
                                            <th className="px-4 py-3.5 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Operador</th>
                                            <th className="px-4 py-3.5 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Cobrador</th>
                                            <th className="px-4 py-3.5 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Gestor</th>
                                            <th className="px-4 py-3.5 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Fecha_Gestion</th>
                                            <th className="px-4 py-3.5 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Cliente</th>
                                            <th className="px-4 py-3.5 text-center text-xs font-bold text-blue-700 uppercase tracking-wider">Cédula</th>
                                            <th className="px-4 py-3.5 text-center text-xs font-bold text-blue-700 uppercase tracking-wider">Doc. Ref.</th>
                                            <th className="px-4 py-3.5 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Almacén</th>
                                            <th className="px-4 py-3.5 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Banco</th>
                                            <th className="px-4 py-3.5 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Estado</th>
                                            <th className="px-4 py-3.5 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Resultado</th>
                                            <th className="px-4 py-3.5 text-center text-xs font-bold text-blue-700 uppercase tracking-wider">Días Mora</th>
                                            <th className="px-4 py-3.5 text-center text-xs font-bold text-blue-700 uppercase tracking-wider">Días Mora Proy.</th>
                                            <th className="px-4 py-3.5 text-center text-xs font-bold text-blue-700 uppercase tracking-wider">Ult. Gestión</th>
                                            <th className="px-4 py-3.5 text-right text-xs font-bold text-blue-700 uppercase tracking-wider">Valor Proyectado</th>
                                            <th className="px-4 py-3.5 text-right text-xs font-bold text-blue-700 uppercase tracking-wider">Valor Cobrar</th>
                                            <th className="px-4 py-3.5 text-right text-xs font-bold text-blue-700 uppercase tracking-wider">Valor Cobrado Total</th>

                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100">
                                        {tableData.length === 0 ? (
                                            <tr>
                                                <td colSpan="16" className="px-6 py-16 text-center">
                                                    <div className="flex flex-col items-center justify-center text-gray-400">
                                                        <div className="p-4 bg-gray-100 rounded-2xl mb-4">
                                                            <ChartBarIcon className="w-16 h-16 text-gray-300" />
                                                        </div>
                                                        <p className="text-lg font-semibold text-gray-600">No hay datos disponibles</p>
                                                        <p className="text-sm mt-2 text-gray-500">Utiliza los filtros para buscar información</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            tableData.map((row, index) => {
                                                const tieneSolicitud =
                                                    row?.sCre_SolicitudWeb !== null && row?.sCre_SolicitudWeb !== '';
                                                return (
                                                    <tr key={index} className="hover:bg-blue-50 transition-colors duration-150 group border-l-4 border-transparent hover:border-blue-500">
                                                        <td className="px-4 py-4 text-center">
                                                            <div className="flex items-center justify-center gap-1">
                                                                <button
                                                                    onClick={() => tieneSolicitud && handleVerDetalle(row)}
                                                                    disabled={!tieneSolicitud}
                                                                    className={`p-2 rounded-lg transition-all duration-200 transform
        ${tieneSolicitud
                                                                            ? 'bg-emerald-100 hover:bg-emerald-600 text-emerald-600 hover:text-white hover:scale-110'
                                                                            : 'bg-red-100 text-red-600 cursor-not-allowed'
                                                                        }`}
                                                                    title={tieneSolicitud ? 'Ingresar Gestión' : 'Sin datos'}
                                                                >
                                                                    <PencilSquareIcon className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleTablaAmortizacion(row)}
                                                                    className="p-2 bg-blue-100 hover:bg-blue-600 text-blue-600 hover:text-white rounded-lg transition-all duration-200 transform hover:scale-110"

                                                                    title="Tabla de Amortización"
                                                                >

                                                                    <EyeIcon className="w-4 h-4" />
                                                                </button>

                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <div className="flex items-center gap-2">
                                                                {TipoRiesgo.find(riesgo => riesgo.label === row.Riesgo)?.icon}
                                                                <span className="text-sm font-semibold text-gray-700 truncate">
                                                                    {TipoRiesgo.find(riesgo => riesgo.label === row.Riesgo)?.label || 'N/A'}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                                                                    {row.Operador ? row.Operador.charAt(0) : '?'}
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="text-sm font-semibold text-gray-700 truncate">{row.Operador || 'N/A'}</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">
                                                                    {row.Cobrador ? row.Cobrador.charAt(0) : '?'}
                                                                </div>
                                                                <span className="text-sm text-gray-700 font-medium truncate">{row.Cobrador || 'N/A'}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white text-xs font-bold">
                                                                    {row.Gestor ? row.Gestor.charAt(0) : '?'}
                                                                </div>
                                                                <span className="text-sm text-gray-700 font-medium truncate">{row.Gestor || 'N/A'}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm text-gray-700 font-medium truncate">
                                                                    {new Date(row.Fecha_Gestion).toLocaleDateString('es-ES')}
                                                                </span>

                                                            </div>
                                                        </td>



                                                        <td className="px-4 py-4">
                                                            <div className="text-sm text-gray-700 font-medium truncate max-w-xs">{row.Cliente}</div>
                                                            <div className="text-xs text-gray-500">{row.Celular}</div>
                                                        </td>
                                                        <td className="px-4 py-4 text-center">
                                                            <span className="inline-block px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold">
                                                                {row.Cedula}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-4 text-center">
                                                            <span className="inline-block px-2.5 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-semibold truncate">
                                                                {row.Numero_Documento}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 truncate">
                                                                {row.Almacen}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-100 text-indigo-700 truncate">
                                                                {row.Banco}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-sm bg-blue-100 text-blue-700">
                                                                {row.Estado}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${row.Resultado === 'COMPROMISO DE PAGO'
                                                                ? 'bg-emerald-100 text-emerald-700'
                                                                : row.Resultado === 'NO CONTESTA'
                                                                    ? 'bg-red-100 text-red-700'
                                                                    : 'bg-amber-100 text-amber-700'
                                                                }`}>
                                                                {row.Resultado}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-4 text-center">
                                                            <div className="text-sm font-semibold">
                                                                <span className={`px-2.5 py-1 rounded-lg font-bold ${row.Dias_Mora_Actual === 0
                                                                    ? 'bg-emerald-100 text-emerald-700'
                                                                    : row.Dias_Mora_Actual > 30
                                                                        ? 'bg-red-100 text-red-700'
                                                                        : 'bg-amber-100 text-amber-700'
                                                                    }`}>
                                                                    {row.Dias_Mora_Actual}
                                                                </span>
                                                            </div>
                                                        </td>

                                                        <td className="px-4 py-4 text-center">
                                                            <div className="text-sm font-semibold">
                                                                <span className={`px-2.5 py-1 rounded-lg font-bold ${row.Dias_Mora_Proyectado > 30
                                                                    ? 'bg-red-100 text-red-700'
                                                                    : 'bg-amber-100 text-amber-700'
                                                                    }`}>
                                                                    {row.Dias_Mora_Proyectado}
                                                                </span>
                                                            </div>
                                                        </td>

                                                        <td className="px-4 py-4 text-center">
                                                            <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                                                {new Date(row.Fecha_Ultima_Gestion).toLocaleDateString('es-ES')}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-4 text-right">
                                                            <span className="text-sm font-bold text-gray-800">
                                                                ${row.Valor_Cobrar_Proyectado.toFixed(2)}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-4 text-right">
                                                            <span className="text-sm font-bold text-gray-800">
                                                                ${row.Valor_Cobrado.toFixed(2)}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-4 text-right">
                                                            <span className={`text-sm font-bold ${row.Valor_Cobrado_Total > 0 ? 'text-emerald-600' : 'text-gray-500'}`}>
                                                                ${row.Valor_Cobrado_Total.toFixed(2)}
                                                            </span>
                                                        </td>

                                                    </tr>
                                                )
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Detalle */}
            <DetalleCobranza
                isOpen={isDetalleOpen}
                onClose={handleCloseDetalle}
                data={selectedRow}
                estadoGestion={estadoGestion}
            />

            {/* Modal de Tabla de Amortización */}
            {showTablaAmortizacion && selectedAmortizacion && (
                <TablaAmortizacionWeb
                    idCompra={selectedAmortizacion.idCompra}
                    cliente={selectedAmortizacion.Cliente}
                    cedula={selectedAmortizacion.Cedula}
                    numeroDocumento={selectedAmortizacion.Numero_Documento}
                    onClose={handleCloseTablaAmortizacion}
                />
            )}
        </>
    );
};

export default InformesCobranza;
