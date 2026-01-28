import React, { useState, useEffect } from 'react';
import { SaveIcon } from '@heroicons/react/24/outline';
import { ScoresCobranzasTable } from './Tables/ScoresCobranzasTable';
import { RiesgosTable } from './Tables/RiesgosTable';
import { SegmentosTable } from './Tables/SegmentosTable';
import { AlmacenesTable } from './Tables/AlmacenesTable';
import { TiposClienteTable } from './Tables/TiposClienteTable';
import { EdadTable } from './Tables/EdadTable';
import { SaldosTable } from './Tables/SaldosTable';
import { ScoreResultadoTable } from './Tables/ScoreResultadoTable';
import { APIURL } from '../../../configApi/apiConfig';
import axios from '../../../configApi/axiosConfig';
export const ScoreConfig = () => {
    const [scoreSeleccionado, setScoreSeleccionado] = useState(''); // Score maestro seleccionado
    const [scoresCobranzas, setScoresCobranzas] = useState([]);
    const [riesgos, setRiesgos] = useState([]);
    const [segmentos, setSegmentos] = useState([]);
    const [almacenes, setAlmacenes] = useState([]);
    const [tiposCliente, setTiposCliente] = useState([]);
    const [edad, setEdad] = useState([]);
     const [saldos, setSaldos] = useState([]);
     const [scoreResultado, setScoreResultado] = useState([]);
    useEffect(() => {
        fetchCbo_Score_cobranza();
    }, []);

    useEffect(() => {
        if (scoresCobranzas.length > 0 && !scoreSeleccionado) {
            setScoreSeleccionado(scoresCobranzas[0].sCbo_Scores_Cobranzas);
        }
    }, [scoresCobranzas]);

    useEffect(() => {
        if (scoreSeleccionado) {
            fetchCbo_Riesgos(scoreSeleccionado);
            fetchSegmento(scoreSeleccionado);
            fetchalmacenes(scoreSeleccionado);
            fetchTipoCliente(scoreSeleccionado);
            fetchEdades(scoreSeleccionado);
            fetchSaldos(scoreSeleccionado);
            fetchscore_Resultado(scoreSeleccionado);
        }
    }, [scoreSeleccionado]);

    const fetchCbo_Score_cobranza = async () => {
        try {
            const response = await axios.get(APIURL.cbo_scores_cobranzaFindAll());
            setScoresCobranzas(response.data);
        } catch (error) {
            setScoresCobranzas([]);
        }
    };

    const fetchCbo_Riesgos = async (scoreId) => {
        try {
            const response = await axios.get(APIURL.cbo_riesgos_findBy(scoreId));

            // Forzamos array
            const data = Array.isArray(response.data)
                ? response.data
                : [response.data];
            setRiesgos(data);
        } catch (error) {
            setRiesgos([]);
        }
    };

    const fetchSegmento = async (scoreId) => {
        try {
            const response = await axios.get(APIURL.cbo_segmentos_findBy(scoreId));
            setSegmentos(response.data);
        } catch (error) {
            setSegmentos([]);
        }
    };

    const fetchalmacenes = async (scoreId) => {
        try {
            const response = await axios.get(APIURL.cbo_almacenes_findBy(scoreId));
            setAlmacenes(response.data);
        }
        catch (error) {
            setAlmacenes([]);
        }
    };

    const fetchTipoCliente = async (scoreId) => {
        try {
            const response = await axios.get(APIURL.cbo_tipo_cliente(scoreId));
            
            setTiposCliente(response.data);
        }
        catch (error) {
            setTiposCliente([]);
        }
    };

    const fetchEdades = async (scoreId) => {
        try {
            const response = await axios.get(APIURL.cbo_edad_findBy(scoreId));
            setEdad(response.data);
        }
        catch (error) {
            setEdad([]);
        }
    };

    const fetchSaldos = async (scoreId) =>{
    try {
            const response = await axios.get(APIURL.cbo_Saldos(scoreId));
         
            setSaldos(response.data);
        }
        catch (error) {
            setSaldos([]);
        }
    };

    const fetchscore_Resultado = async (scoreId) => {
        try {
            const response = await axios.get(APIURL.cbo_Score_Resultado(scoreId));
               console.log('resultado:', response.data);
            setScoreResultado(response.data);
        }
        catch (error) {
            setScoreResultado([]);
        }
    };

 


    // Función para cambiar score maestro
    const manejarSeleccionScore = (idScore) => {
        setScoreSeleccionado(idScore);
    };

    // Funciones de filtrado para maestro-detalle
    const riesgofiltrados = riesgos.filter(r => r.sCbo_Scores_Cobranzas === scoreSeleccionado);
    const segmentosFiltrados = segmentos.filter(s => s.sCbo_Scores_Cobranzas === scoreSeleccionado);
    const almacenesFiltrados = almacenes.filter(a => a.sCbo_Scores_Cobranzas === scoreSeleccionado);
    const tiposClienteFiltrados = tiposCliente.filter(t => t.sCbo_Scores_Cobranzas === scoreSeleccionado);
    const edadFiltrada = edad.filter(e => e.sCbo_Scores_Cobranzas === scoreSeleccionado);
    const saldosFiltrados = saldos.filter(s => s.sCbo_Scores_Cobranzas === scoreSeleccionado);
    const scoreResultadoFiltrado = scoreResultado.filter(sr => sr.sCbo_Scores_Cobranzas === scoreSeleccionado);

    

     const agregarRiesgo = () => {
        console.log('Agregando riesgo para score:', scoreSeleccionado);
        console.log('Riesgos actuales:', riesgos);
        const nuevoRiesgo = {
            idCbo_Riesgo: 0,
            _tempId: Date.now() + Math.random(), // ID temporal único mientras no se guarde
            idCbo_Scores_Cobranzas: scoreSeleccionado,
            sCbo_Scores_Cobranzas: scoreSeleccionado,
            Riesgo: '',
            Peso: '',
            Desde: '',
            Hasta: '',
            Usuario: ''
        };
        console.log('Nuevo riesgo a agregar:', nuevoRiesgo);
        setRiesgos([...riesgos, nuevoRiesgo]);
    };

    const actualizarRiesgo = (id, campo, valor) => {
        console.log('Actualizando riesgo ID:', id, 'Campo:', campo, 'Valor:', valor);
        const riesgosActualizados = riesgos.map(r => {
            // Si es un registro existente (idCbo_Riesgo > 0), usar ese ID
            // Si es nuevo (idCbo_Riesgo === 0), usar el _tempId
            const identificador = r.idCbo_Riesgo > 0 ? r.idCbo_Riesgo : r._tempId;
            if (identificador === id) {
                console.log('Riesgo encontrado para actualizar:', r);
                return { ...r, [campo]: valor };
            }
            return r;
        });
        console.log('Riesgos después de actualizar:', riesgosActualizados);
        setRiesgos(riesgosActualizados);
    };

    const eliminarRiesgo = (id) => {
        console.log('Eliminando riesgo ID:', id);
        console.log('Riesgos antes de eliminar:', riesgos);
        const riesgosFiltered = riesgos.filter(r => {
            const identificador = r.idCbo_Riesgo > 0 ? r.idCbo_Riesgo : r._tempId;
            const noEliminar = identificador !== id;
            console.log('Comparando:', identificador, 'vs', id, 'Mantener:', noEliminar);
            return noEliminar;
        });
        console.log('Riesgos después de eliminar:', riesgosFiltered);
        setRiesgos(riesgosFiltered);
    };

    // Funciones para Cbo_Segmentos
    const agregarSegmento = () => {
        setSegmentos([...segmentos, {
            id: Math.max(...segmentos.map(s => s.id), 0) + 1,
            idCbo_Scores_Cobranzas: scoreSeleccionado,
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
                            {scoresCobranzas.find(s => s.sCbo_Scores_Cobranzas === scoreSeleccionado)?.Descripcion}
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
                        riesgos={riesgofiltrados}
                        onAdd={agregarRiesgo}
                        onUpdate={actualizarRiesgo}
                        onDelete={eliminarRiesgo}
                    />
                    <SegmentosTable
                        segmentos={segmentosFiltrados}
                        onAdd={agregarSegmento}
                        onUpdate={actualizarSegmento}
                        onDelete={eliminarSegmento}
                    />

                    {/* Fila 3: Almacenes (Full Width) */}
                    <div className="lg:col-span-2">
                        <AlmacenesTable
                            almacenes={almacenesFiltrados}
                            riesgos={riesgofiltrados}
                           
                          
                        />
                    </div>

                    {/* Fila 4: Tablas de Detalles por Score (Ordenadas en grid) */}
                    <TiposClienteTable
                        tiposClienteFiltrados={tiposClienteFiltrados}
                        riesgos={riesgos}
                        scoresCobranzas={scoresCobranzas}
                        scoreSeleccionado={scoreSeleccionado}
                    
                    />
                    <EdadTable
                        edadFiltrada={edadFiltrada}
                        riesgos={riesgos}
                        scoresCobranzas={scoresCobranzas}
                        scoreSeleccionado={scoreSeleccionado}
                       
                    />

                    {/* Fila 5: Saldos y Score Resultado */}
                    <SaldosTable
                        saldosFiltrados={saldosFiltrados}
                        riesgos={riesgos}
                        scoresCobranzas={scoresCobranzas}
                        scoreSeleccionado={scoreSeleccionado}
                     
                    />
                    <ScoreResultadoTable
                        scoreResultadoFiltrado={scoreResultadoFiltrado}
                        riesgos={riesgos}
                        scoresCobranzas={scoresCobranzas}
                        scoreSeleccionado={scoreSeleccionado}
                       
                    />
                </div>

                
            </div>
        </div>
    );
};


export default ScoreConfig;

