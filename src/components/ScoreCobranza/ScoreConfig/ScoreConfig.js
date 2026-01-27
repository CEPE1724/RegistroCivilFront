import React, { useState } from 'react';
import { SaveIcon } from '@heroicons/react/24/outline';
import { ScoresCobranzasTable } from './Tables/ScoresCobranzasTable';
import { RiesgosTable } from './Tables/RiesgosTable';
import { SegmentosTable } from './Tables/SegmentosTable';
import { AlmacenesTable } from './Tables/AlmacenesTable';
import { TiposClienteTable } from './Tables/TiposClienteTable';
import { EdadTable } from './Tables/EdadTable';
import { SaldosTable } from './Tables/SaldosTable';
import { ScoreResultadoTable } from './Tables/ScoreResultadoTable';

export const ScoreConfig = () => {
    // Estado para Cbo_Scores_Cobranzas
    const [scoresCobranzas, setScoresCobranzas] = useState([
        {
            idCbo_Scores_Cobranzas: 1,
            Desde: '1/1/2026',
            Hasta: '31/3/2026',
            Descripcion: 'PRIMER TRIMESTRE 2026',
            Estado: 1,
            Etiqueta: 'CERRADO ANULADO',
            editando: false
        },
        {
            idCbo_Scores_Cobranzas: 2,
            Desde: '1/4/2026',
            Hasta: '30/6/2026',
            Descripcion: 'SEGUNDO TRIMESTRE 2026',
            Estado: 2,
            Etiqueta: 'CERRADO ANULADO',
            editando: false
        },
        {
            idCbo_Scores_Cobranzas: 3,
            Desde: '1/7/2026',
            Hasta: '30/9/2026',
            Descripcion: 'TERCER TRIMESTRE 2026',
            Estado: 3,
            Etiqueta: 'CERRADO ANULADO',
            editando: false
        }
    ]);

    // Estado para Cbo_Riesgos
    const [riesgos, setRiesgos] = useState([
        { id: 1, nombre: 'ALTO', peso: 100, desde: 20.01, hasta: 100 },
        { id: 2, nombre: 'MEDIANO', peso: 50, desde: 14.01, hasta: 20 },
        { id: 3, nombre: 'BAJO', peso: 20, desde: 0, hasta: 14 }
    ]);

    // Estado para Cbo_Segmentos
    const [segmentos, setSegmentos] = useState([
        { id: 1, nombre: 'CIUDAD', participacion: 20 },
        { id: 2, nombre: 'SCORE', participacion: 30 },
        { id: 3, nombre: 'SALDO', participacion: 30 },
        { id: 4, nombre: 'EDAD', participacion: 20 }
    ]);

    // Estado para Cbo_Almacenes
    const [almacenes, setAlmacenes] = useState([
        { id: 1, bodega: '140', idRiesgo: 1, puntaje: 4 },
        { id: 2, bodega: '11', idRiesgo: 3, puntaje: 4 },
        { id: 3, bodega: '63', idRiesgo: 3, puntaje: 4 },
        { id: 4, bodega: '70', idRiesgo: 3, puntaje: 4 },
        { id: 5, bodega: '41', idRiesgo: 3, puntaje: 4 },
        { id: 6, bodega: '6', idRiesgo: 3, puntaje: 4 },
        { id: 7, bodega: '60', idRiesgo: 3, puntaje: 4 },
        { id: 8, bodega: '117', idRiesgo: 3, puntaje: 4 },
        { id: 9, bodega: '76', idRiesgo: 3, puntaje: 4 },
        { id: 10, bodega: '121', idRiesgo: 3, puntaje: 4 }
    ]);

    // Estado para Cbo_TiposCliente
    const [tiposCliente, setTiposCliente] = useState([
        { id: 1, idCbo_Scores_Cobranzas: 1, idTipoCliente: 1, idCbo_Riesgo: 1, puntaje: 15 },
        { id: 2, idCbo_Scores_Cobranzas: 1, idTipoCliente: 6, idCbo_Riesgo: 3, puntaje: 6 },
        { id: 3, idCbo_Scores_Cobranzas: 1, idTipoCliente: 9, idCbo_Riesgo: 2, puntaje: 9 },
        { id: 4, idCbo_Scores_Cobranzas: 1, idTipoCliente: 8, idCbo_Riesgo: 1, puntaje: 30 },
        { id: 5, idCbo_Scores_Cobranzas: 1, idTipoCliente: 5, idCbo_Riesgo: 3, puntaje: 6 }
    ]);

    // Estado para Cbo_Edad
    const [edad, setEdad] = useState([
        { id: 1, idCbo_Scores_Cobranzas: 1, desde: 18, hasta: 20, idCbo_Riesgo: 1, puntaje: 20 },
        { id: 2, idCbo_Scores_Cobranzas: 1, desde: 21, hasta: 25, idCbo_Riesgo: 1, puntaje: 20 },
        { id: 3, idCbo_Scores_Cobranzas: 1, desde: 26, hasta: 30, idCbo_Riesgo: 2, puntaje: 10 },
        { id: 4, idCbo_Scores_Cobranzas: 1, desde: 31, hasta: 40, idCbo_Riesgo: 2, puntaje: 10 },
        { id: 5, idCbo_Scores_Cobranzas: 1, desde: 41, hasta: 50, idCbo_Riesgo: 2, puntaje: 10 },
        { id: 6, idCbo_Scores_Cobranzas: 1, desde: 51, hasta: 100, idCbo_Riesgo: 3, puntaje: 4 }
    ]);

    // Estado para Cbo_Saldos
    const [saldos, setSaldos] = useState([
        { id: 1, idCbo_Scores_Cobranzas: 1, desde: 1.00, hasta: 150.00, idCbo_Riesgo: 3, puntaje: 6 },
        { id: 2, idCbo_Scores_Cobranzas: 1, desde: 150.01, hasta: 400.00, idCbo_Riesgo: 2, puntaje: 15 },
        { id: 3, idCbo_Scores_Cobranzas: 1, desde: 400.01, hasta: 700.00, idCbo_Riesgo: 2, puntaje: 15 },
        { id: 4, idCbo_Scores_Cobranzas: 1, desde: 700.01, hasta: 1000.00, idCbo_Riesgo: 2, puntaje: 15 },
        { id: 5, idCbo_Scores_Cobranzas: 1, desde: 1000.01, hasta: 10000.00, idCbo_Riesgo: 1, puntaje: 30 }
    ]);

    // Estado para Cbo_Score_Resultado
    const [scoreResultado, setScoreResultado] = useState([
        { id: 1, idCbo_Scores_Cobranzas: 1, desde: 0, hasta: 40, peso: 21.81, resultado: 81.03, idCbo_Riesgo: 3 },
        { id: 2, idCbo_Scores_Cobranzas: 1, desde: 41, hasta: 45, peso: 19.05, resultado: 76.72, idCbo_Riesgo: 3 },
        { id: 3, idCbo_Scores_Cobranzas: 1, desde: 46, hasta: 50, peso: 6.34, resultado: 73.26, idCbo_Riesgo: 2 },
        { id: 4, idCbo_Scores_Cobranzas: 1, desde: 51, hasta: 55, peso: 12.81, resultado: 73.86, idCbo_Riesgo: 2 }
    ]);

    const [scoreSeleccionado, setScoreSeleccionado] = useState(1); // Score maestro seleccionado

    // Función para cambiar score maestro
    const manejarSeleccionScore = (idScore) => {
        setScoreSeleccionado(idScore);
    };

    // Funciones de filtrado para maestro-detalle
    const tiposClienteFiltrados = tiposCliente.filter(t => t.idCbo_Scores_Cobranzas === scoreSeleccionado);
    const edadFiltrada = edad.filter(e => e.idCbo_Scores_Cobranzas === scoreSeleccionado);
    const saldosFiltrados = saldos.filter(s => s.idCbo_Scores_Cobranzas === scoreSeleccionado);
    const scoreResultadoFiltrado = scoreResultado.filter(sr => sr.idCbo_Scores_Cobranzas === scoreSeleccionado);

    // Funciones para Cbo_Riesgos
    const agregarRiesgo = () => {
        setRiesgos([...riesgos, {
            id: Math.max(...riesgos.map(r => r.id), 0) + 1,
            nombre: '',
            peso: '',
            desde: '',
            hasta: ''
        }]);
    };

    const actualizarRiesgo = (id, campo, valor) => {
        setRiesgos(riesgos.map(r => r.id === id ? { ...r, [campo]: valor } : r));
    };

    const eliminarRiesgo = (id) => {
        setRiesgos(riesgos.filter(r => r.id !== id));
    };

    // Funciones para Cbo_Segmentos
    const agregarSegmento = () => {
        setSegmentos([...segmentos, {
            id: Math.max(...segmentos.map(s => s.id), 0) + 1,
            nombre: '',
            participacion: ''
        }]);
    };

    const actualizarSegmento = (id, campo, valor) => {
        setSegmentos(segmentos.map(s => s.id === id ? { ...s, [campo]: valor } : s));
    };

    const eliminarSegmento = (id) => {
        setSegmentos(segmentos.filter(s => s.id !== id));
    };

    // Funciones para Cbo_Almacenes
    const agregarAlmacen = () => {
        setAlmacenes([...almacenes, {
            id: Math.max(...almacenes.map(a => a.id), 0) + 1,
            bodega: '',
            idRiesgo: '',
            puntaje: ''
        }]);
    };

    const actualizarAlmacen = (id, campo, valor) => {
        setAlmacenes(almacenes.map(a => a.id === id ? { ...a, [campo]: valor } : a));
    };

    const eliminarAlmacen = (id) => {
        setAlmacenes(almacenes.filter(a => a.id !== id));
    };

    // Funciones para Cbo_TiposCliente
    const agregarTipoCliente = () => {
        setTiposCliente([...tiposCliente, {
            id: Math.max(...tiposCliente.map(t => t.id), 0) + 1,
            idCbo_Scores_Cobranzas: 1,
            idTipoCliente: '',
            idCbo_Riesgo: '',
            puntaje: ''
        }]);
    };

    const actualizarTipoCliente = (id, campo, valor) => {
        setTiposCliente(tiposCliente.map(t => t.id === id ? { ...t, [campo]: valor } : t));
    };

    const eliminarTipoCliente = (id) => {
        setTiposCliente(tiposCliente.filter(t => t.id !== id));
    };

    // Funciones para Cbo_Edad
    const agregarEdad = () => {
        setEdad([...edad, {
            id: Math.max(...edad.map(e => e.id), 0) + 1,
            idCbo_Scores_Cobranzas: 1,
            desde: '',
            hasta: '',
            idCbo_Riesgo: '',
            puntaje: ''
        }]);
    };

    const actualizarEdad = (id, campo, valor) => {
        setEdad(edad.map(e => e.id === id ? { ...e, [campo]: valor } : e));
    };

    const eliminarEdad = (id) => {
        setEdad(edad.filter(e => e.id !== id));
    };

    // Funciones para Cbo_Saldos
    const agregarSaldo = () => {
        setSaldos([...saldos, {
            id: Math.max(...saldos.map(s => s.id), 0) + 1,
            idCbo_Scores_Cobranzas: 1,
            desde: '',
            hasta: '',
            idCbo_Riesgo: '',
            puntaje: ''
        }]);
    };

    const actualizarSaldo = (id, campo, valor) => {
        setSaldos(saldos.map(s => s.id === id ? { ...s, [campo]: valor } : s));
    };

    const eliminarSaldo = (id) => {
        setSaldos(saldos.filter(s => s.id !== id));
    };

    // Funciones para Cbo_Score_Resultado
    const agregarScoreResultado = () => {
        setScoreResultado([...scoreResultado, {
            id: Math.max(...scoreResultado.map(sr => sr.id), 0) + 1,
            idCbo_Scores_Cobranzas: 1,
            desde: '',
            hasta: '',
            peso: '',
            resultado: '',
            idCbo_Riesgo: ''
        }]);
    };

    const actualizarScoreResultado = (id, campo, valor) => {
        setScoreResultado(scoreResultado.map(sr => sr.id === id ? { ...sr, [campo]: valor } : sr));
    };

    const eliminarScoreResultado = (id) => {
        setScoreResultado(scoreResultado.filter(sr => sr.id !== id));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-4 md:p-6 lg:p-8">
            <div className="max-w-8xl mx-auto">
                {/* Header Compacto */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-blue-800 rounded-full"></div>
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">Configuración Score Cobranzas</h1>
                            <p className="text-gray-600 text-sm mt-1">Dashboard de configuración integrado del sistema de scoring</p>
                        </div>
                    </div>
                </div>

                {/* Score Seleccionado - Indicador Maestro (Compacto) */}
                <div className="mb-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-3 border-2 border-blue-700 shadow-md">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
                        <span className="text-white text-xs font-bold uppercase tracking-wider">Score Maestro:</span>
                        <span className="text-blue-50 text-sm font-bold">
                            {scoresCobranzas.find(s => s.idCbo_Scores_Cobranzas === scoreSeleccionado)?.Descripcion}
                        </span>
                    </div>
                </div>

                {/* Grid Dashboard - 2 columnas en desktop, 1 en mobile */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                    {/* Fila 1: Score Cobranzas (Full Width) */}
                    <div className="lg:col-span-2">
                        <ScoresCobranzasTable
                            scoresCobranzas={scoresCobranzas}
                            scoreSeleccionado={scoreSeleccionado}
                            onSelectScore={manejarSeleccionScore}
                        />
                    </div>

                    {/* Fila 2: Riesgos y Segmentos */}
                    <RiesgosTable
                        riesgos={riesgos}
                        onAdd={agregarRiesgo}
                        onUpdate={actualizarRiesgo}
                        onDelete={eliminarRiesgo}
                    />
                    <SegmentosTable
                        segmentos={segmentos}
                        onAdd={agregarSegmento}
                        onUpdate={actualizarSegmento}
                        onDelete={eliminarSegmento}
                    />

                    {/* Fila 3: Almacenes (Full Width) */}
                    <div className="lg:col-span-2">
                        <AlmacenesTable
                            almacenes={almacenes}
                            riesgos={riesgos}
                            onAdd={agregarAlmacen}
                            onUpdate={actualizarAlmacen}
                            onDelete={eliminarAlmacen}
                        />
                    </div>

                    {/* Fila 4: Tablas de Detalles por Score (Ordenadas en grid) */}
                    <TiposClienteTable
                        tiposClienteFiltrados={tiposClienteFiltrados}
                        riesgos={riesgos}
                        scoresCobranzas={scoresCobranzas}
                        scoreSeleccionado={scoreSeleccionado}
                        onUpdate={actualizarTipoCliente}
                        onDelete={eliminarTipoCliente}
                    />
                    <EdadTable
                        edadFiltrada={edadFiltrada}
                        riesgos={riesgos}
                        scoresCobranzas={scoresCobranzas}
                        scoreSeleccionado={scoreSeleccionado}
                        onUpdate={actualizarEdad}
                        onDelete={eliminarEdad}
                    />

                    {/* Fila 5: Saldos y Score Resultado */}
                    <SaldosTable
                        saldosFiltrados={saldosFiltrados}
                        riesgos={riesgos}
                        scoresCobranzas={scoresCobranzas}
                        scoreSeleccionado={scoreSeleccionado}
                        onUpdate={actualizarSaldo}
                        onDelete={eliminarSaldo}
                    />
                    <ScoreResultadoTable
                        scoreResultadoFiltrado={scoreResultadoFiltrado}
                        riesgos={riesgos}
                        scoresCobranzas={scoresCobranzas}
                        scoreSeleccionado={scoreSeleccionado}
                        onUpdate={actualizarScoreResultado}
                        onDelete={eliminarScoreResultado}
                    />
                </div>

                {/* Footer Compacto */}
                <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border border-slate-300 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Cambios realizados</p>
                        <p className="text-slate-600 text-xs mt-1">Los cambios se guardarán al hacer clic en Guardar</p>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <button className="flex-1 sm:flex-none px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm font-bold rounded-lg transition-all duration-200">
                            Cancelar
                        </button>
                        <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-bold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg">
                        
                            Guardar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default ScoreConfig;

