import React, { useState } from 'react';
import Layout from '../components/Layout';
import {DetalleCobranza } from '../components';
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
    TrashIcon
} from '@heroicons/react/24/outline';

const InformesCobranza = () => {
    const [filters, setFilters] = useState({
        periodo: '12/2025',
        tipoGestion: 'todos', // todos, gestion, sinGestion, compromisoPago
        filtroGestion: 'gestion', // gestion, almacen
        diasMoraDesde: 1,
        diasMoraHasta: 150,
        operador: '',
        gestion: '',
        estado: '',
        banco: '',
        almacen: ''
    });

    const [isDetalleOpen, setIsDetalleOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    const [metricas, setMetricas] = useState({
        proyectado: 0.00,
        cobrado: 0.00,
        avance: 0.00,
        cobroExterno: 0.00
    });

    const [tableData, setTableData] = useState([
        {
            periodo: '12/2025',
            operador: 'JUAN PÉREZ',
            equifax: 'Aprobado',
            zona: 'Norte',
            cobrador: 'MARÍA GARCÍA',
            fechaGestion: '15/12/2025',
            gestion: 'Llamada'
        },
        {
            periodo: '12/2025',
            operador: 'ANA LÓPEZ',
            equifax: 'Pendiente',
            zona: 'Sur',
            cobrador: 'CARLOS RUIZ',
            fechaGestion: '14/12/2025',
            gestion: 'Visita'
        },
        {
            periodo: '12/2025',
            operador: 'PEDRO TORRES',
            equifax: 'Rechazado',
            zona: 'Centro',
            cobrador: 'LUCÍA MENDEZ',
            fechaGestion: '13/12/2025',
            gestion: 'WhatsApp'
        },
        {
            periodo: '12/2025',
            operador: 'SOFÍA MARTÍNEZ',
            equifax: 'Aprobado',
            zona: 'Este',
            cobrador: 'DIEGO VEGA',
            fechaGestion: '12/12/2025',
            gestion: 'Email'
        },
        {
            periodo: '12/2025',
            operador: 'MIGUEL CASTRO',
            equifax: 'Aprobado',
            zona: 'Oeste',
            cobrador: 'ELENA ROJAS',
            fechaGestion: '11/12/2025',
            gestion: 'Llamada'
        }
    ]);

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const handleBuscar = () => {
        console.log('Buscando con filtros:', filters);
        // Aquí iría la lógica de búsqueda
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

    return (
        <>
            <Layout />
            <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 p-3 lg:p-6">
                {/* Header Mejorado */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center space-x-4">
                            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-4 rounded-2xl shadow-lg">
                                <ChartBarIcon className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
                                    Informes de Cobranza
                                </h1>
                                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                    Gestión y seguimiento operacional
                                </p>
                            </div>
                        </div>
                        
                        {/* Botones de acción superiores - Mejorados */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <button
                                onClick={() => handleExportar('excel')}
                                className="group px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 text-sm font-semibold transform hover:scale-105"
                            >
                                <DocumentArrowDownIcon className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                                <span className="hidden sm:inline">Excel</span>
                            </button>
                            <button className="px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-sm font-semibold transform hover:scale-105">
                                <span className="hidden sm:inline">Créditos Nómina</span>
                                <span className="sm:hidden">Nómina</span>
                            </button>
                            <button className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 text-sm font-semibold transform hover:scale-105">
                                <DocumentArrowUpIcon className="w-4 h-4" />
                                <span className="hidden md:inline">Importar</span>
                            </button>
                            <button className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 text-sm font-semibold transform hover:scale-105">
                                <MapPinIcon className="w-4 h-4" />
                                <span className="hidden md:inline">Barrios</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-6">
                    {/* Panel de Filtros - Mejorado */}
                    <div className="xl:col-span-3">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden sticky top-6">
                            <div className="bg-gradient-to-r from-gray-800 to-gray-700 px-5 py-4">
                                <div className="flex items-center space-x-3">
                                    <FunnelIcon className="w-5 h-5 text-blue-400" />
                                    <h2 className="text-lg font-bold text-white">Filtros de Búsqueda</h2>
                                </div>
                            </div>

                            <div className="p-5 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">{/* Periodo */}
                                <div className="space-y-2">
                                    <label className="flex items-center text-xs font-bold text-gray-700 uppercase tracking-wide">
                                        <CalendarIcon className="w-4 h-4 mr-2 text-blue-600" />
                                        Periodo
                                    </label>
                                    <input
                                        type="month"
                                        value="2025-12"
                                        onChange={(e) => handleFilterChange('periodo', e.target.value)}
                                        className="w-full px-3 py-2.5 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all text-sm font-medium"
                                    />
                                </div>

                                <div className="border-t border-gray-100 pt-4">
                                    <label className="text-xs font-bold text-gray-700 mb-3 block uppercase tracking-wide">
                                        Tipo de Gestión
                                    </label>
                                    <div className="space-y-2.5">
                                        {[
                                            { value: 'todos', label: 'Todos' },
                                            { value: 'gestion', label: 'Gestión' },
                                            { value: 'sinGestion', label: 'Sin Gestión' },
                                            { value: 'compromisoPago', label: 'Compromiso De Pago' }
                                        ].map(option => (
                                            <label key={option.value} className="flex items-center cursor-pointer group">
                                                <div className="relative">
                                                    <input
                                                        type="radio"
                                                        name="tipoGestion"
                                                        value={option.value}
                                                        checked={filters.tipoGestion === option.value}
                                                        onChange={(e) => handleFilterChange('tipoGestion', e.target.value)}
                                                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <span className="ml-3 text-sm text-gray-700 group-hover:text-blue-600 transition-colors font-medium">
                                                    {option.label}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-4">
                                    <label className="text-xs font-bold text-gray-700 mb-3 block uppercase tracking-wide">
                                        Filtro
                                    </label>
                                    <div className="flex gap-4">
                                        {[
                                            { value: 'gestion', label: 'Gestión' },
                                            { value: 'almacen', label: 'Almacen' }
                                        ].map(option => (
                                            <label key={option.value} className="flex items-center cursor-pointer group">
                                                <input
                                                    type="radio"
                                                    name="filtroGestion"
                                                    value={option.value}
                                                    checked={filters.filtroGestion === option.value}
                                                    onChange={(e) => handleFilterChange('filtroGestion', e.target.value)}
                                                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
                                                />
                                                <span className="ml-2 text-sm text-gray-700 group-hover:text-blue-600 transition-colors font-medium">
                                                    {option.label}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Días de Mora */}
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-100">
                                    <label className="text-xs font-bold text-gray-700 mb-3 block uppercase tracking-wide">
                                        Días de Mora
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs text-gray-600 mb-1.5 block font-semibold">Desde</label>
                                            <input
                                                type="number"
                                                value={filters.diasMoraDesde}
                                                onChange={(e) => handleFilterChange('diasMoraDesde', e.target.value)}
                                                className="w-full px-3 py-2 rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-sm font-semibold text-gray-700"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-600 mb-1.5 block font-semibold">Hasta</label>
                                            <input
                                                type="number"
                                                value={filters.diasMoraHasta}
                                                onChange={(e) => handleFilterChange('diasMoraHasta', e.target.value)}
                                                className="w-full px-3 py-2 rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-sm font-semibold text-gray-700"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Operador */}
                                <div className="space-y-2">
                                    <label className="flex items-center text-xs font-bold text-gray-700 uppercase tracking-wide">
                                        <UserIcon className="w-4 h-4 mr-2 text-blue-600" />
                                        Operador
                                    </label>
                                    <select
                                        value={filters.operador}
                                        onChange={(e) => handleFilterChange('operador', e.target.value)}
                                        className="w-full px-3 py-2.5 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all text-sm font-medium"
                                    >
                                        <option value="">Seleccionar...</option>
                                        <option value="operador1">Operador 1</option>
                                        <option value="operador2">Operador 2</option>
                                    </select>
                                </div>

                                {/* Gestión */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block">
                                        Gestión
                                    </label>
                                    <select
                                        value={filters.gestion}
                                        onChange={(e) => handleFilterChange('gestion', e.target.value)}
                                        className="w-full px-3 py-2.5 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all text-sm font-medium"
                                    >
                                        <option value="">Seleccionar...</option>
                                        <option value="gestion1">Gestión 1</option>
                                        <option value="gestion2">Gestión 2</option>
                                    </select>
                                </div>

                                {/* Estado */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block">
                                        Estado
                                    </label>
                                    <select
                                        value={filters.estado}
                                        onChange={(e) => handleFilterChange('estado', e.target.value)}
                                        className="w-full px-3 py-2.5 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all text-sm font-medium"
                                    >
                                        <option value="">Seleccionar...</option>
                                        <option value="activo">Activo</option>
                                        <option value="pendiente">Pendiente</option>
                                    </select>
                                </div>

                                {/* Banco */}
                                <div className="space-y-2">
                                    <label className="flex items-center text-xs font-bold text-gray-700 uppercase tracking-wide">
                                        <BuildingOfficeIcon className="w-4 h-4 mr-2 text-blue-600" />
                                        Banco
                                    </label>
                                    <select
                                        value={filters.banco}
                                        onChange={(e) => handleFilterChange('banco', e.target.value)}
                                        className="w-full px-3 py-2.5 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all text-sm font-medium"
                                    >
                                        <option value="">Seleccionar...</option>
                                        <option value="pichincha">Pichincha</option>
                                        <option value="guayaquil">Guayaquil</option>
                                    </select>
                                </div>

                                {/* Almacen */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block">
                                        Almacen
                                    </label>
                                    <select
                                        value={filters.almacen}
                                        onChange={(e) => handleFilterChange('almacen', e.target.value)}
                                        className="w-full px-3 py-2.5 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all text-sm font-medium"
                                    >
                                        <option value="">Seleccionar...</option>
                                        <option value="almacen1">Almacen 1</option>
                                        <option value="almacen2">Almacen 2</option>
                                    </select>
                                </div>

                                {/* Botón Buscar */}
                                <button
                                    onClick={handleBuscar}
                                    className="w-full mt-6 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center space-x-2"
                                >
                                    <MagnifyingGlassIcon className="w-5 h-5" />
                                    <span>Buscar Registros</span>
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
                                <p className="text-2xl lg:text-3xl font-bold text-gray-800">${metricas.proyectado.toFixed(2)}</p>
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
                                <p className="text-2xl lg:text-3xl font-bold text-gray-800">${metricas.cobrado.toFixed(2)}</p>
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
                                <p className="text-2xl lg:text-3xl font-bold text-gray-800">{metricas.avance.toFixed(2)}%</p>
                                <div className="mt-2 bg-gray-200 rounded-full h-2 overflow-hidden">
                                    <div className="bg-gradient-to-r from-violet-500 to-violet-600 h-full rounded-full" style={{width: `${metricas.avance}%`}}></div>
                                </div>
                            </div>

                            {/* Cobro Externo */}
                            <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl p-5 border-l-4 border-amber-500 transform hover:-translate-y-1 transition-all duration-300">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wide">Cobro Externo</h3>
                                    <div className="p-2.5 bg-amber-100 rounded-xl group-hover:bg-amber-200 transition-colors">
                                        <BanknotesIcon className="w-5 h-5 text-amber-600" />
                                    </div>
                                </div>
                                <p className="text-2xl lg:text-3xl font-bold text-gray-800">${metricas.cobroExterno.toFixed(2)}</p>
                                <p className="text-xs text-gray-500 mt-2">Gestión externa</p>
                            </div>
                        </div>

                        {/* Tabla de Resultados - Mejorada */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-gray-800 to-gray-700 px-5 py-4 flex items-center justify-between flex-wrap gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/20 rounded-lg">
                                        <ChartBarIcon className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <h2 className="text-lg font-bold text-white">Resultados de Búsqueda</h2>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold">
                                        {tableData.length} registros
                                    </span>
                                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-all duration-200 flex items-center gap-2 text-sm font-semibold transform hover:scale-105">
                                        <MagnifyingGlassIcon className="w-4 h-4" />
                                        <span className="hidden sm:inline">Ver Detalles</span>
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                                        <tr>
                                            <th className="px-4 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                Periodo
                                            </th>
                                            <th className="px-4 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                Operador
                                            </th>
                                            <th className="px-4 py-3.5 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                Acciones
                                            </th>
                                            <th className="px-4 py-3.5 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                
                                            </th>
                                            <th className="px-4 py-3.5 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                
                                            </th>
                                            <th className="px-4 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                Equifax
                                            </th>
                                            <th className="px-4 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                Zona
                                            </th>
                                            <th className="px-4 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                Cobrador
                                            </th>
                                            <th className="px-4 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                F. Gestión
                                            </th>
                                            <th className="px-4 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                Gestión
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100">
                                        {tableData.length === 0 ? (
                                            <tr>
                                                <td colSpan="10" className="px-6 py-16 text-center">
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
                                            tableData.map((row, index) => (
                                                <tr key={index} className="hover:bg-blue-50 transition-colors duration-150 group">
                                                    <td className="px-4 py-4 text-sm font-medium text-gray-800">
                                                        {row.periodo}
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-md">
                                                                {row.operador.charAt(0)}
                                                            </div>
                                                            <span className="text-sm font-semibold text-gray-700">{row.operador}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 text-center">
                                                        <button
                                                            onClick={() => handleVerDetalle(row)}
                                                            className="p-2.5 bg-blue-100 hover:bg-blue-600 text-blue-600 hover:text-white rounded-xl transition-all duration-200 transform hover:scale-110 shadow-sm hover:shadow-md"
                                                            title="Ver detalles"
                                                        >
                                                            <EyeIcon className="w-5 h-5" />
                                                        </button>
                                                    </td>
                                                    <td className="px-4 py-4 text-center">
                                                        <button
                                                            onClick={() => console.log('Editar', index)}
                                                            className="p-2.5 bg-emerald-100 hover:bg-emerald-600 text-emerald-600 hover:text-white rounded-xl transition-all duration-200 transform hover:scale-110 shadow-sm hover:shadow-md"
                                                            title="Editar registro"
                                                        >
                                                            <PencilSquareIcon className="w-5 h-5" />
                                                        </button>
                                                    </td>
                                                    <td className="px-4 py-4 text-center">
                                                        <button
                                                            onClick={() => console.log('Eliminar', index)}
                                                            className="p-2.5 bg-red-100 hover:bg-red-600 text-red-600 hover:text-white rounded-xl transition-all duration-200 transform hover:scale-110 shadow-sm hover:shadow-md"
                                                            title="Eliminar registro"
                                                        >
                                                            <TrashIcon className="w-5 h-5" />
                                                        </button>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm ${
                                                            row.equifax === 'Aprobado' 
                                                                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white' 
                                                                : row.equifax === 'Rechazado'
                                                                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                                                                : 'bg-gradient-to-r from-amber-500 to-amber-600 text-white'
                                                        }`}>
                                                            {row.equifax}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 text-sm font-medium text-gray-700">
                                                        <div className="flex items-center gap-2">
                                                            <div className="p-1.5 bg-blue-100 rounded-lg">
                                                                <MapPinIcon className="w-4 h-4 text-blue-600" />
                                                            </div>
                                                            {row.zona}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">
                                                                {row.cobrador.charAt(0)}
                                                            </div>
                                                            <span className="text-sm text-gray-700 font-medium">{row.cobrador}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-gray-600">
                                                        <div className="flex items-center gap-2">
                                                            <CalendarIcon className="w-4 h-4 text-gray-400" />
                                                            {row.fechaGestion}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm">
                                                            {row.gestion}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
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
            />
        </>
    );
};

export default InformesCobranza;
