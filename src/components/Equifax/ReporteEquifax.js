import { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import axios from "../../configApi/axiosConfig";
import { APIURL } from "../../configApi/apiConfig";
import { 
  LineChart, Line,
  RadialBarChart, RadialBar,
  PolarAngleAxis,
  XAxis, YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { AlertTriangle, Check, X, FileText, Printer } from 'lucide-react';

export function ReporteEquifax({ 
  setImprimiendo2, // Prop para manejar el estado de impresión
  // Props para datos dinámicos
  // datosPersonales = {
  //   nombre: "GUALPA ALUCHO SEGUNDO MANUEL",
  //   identificacion: "0200706745",
  //   fechaConsulta: "23/04/2025"
  // },
  resultado = {
    segmentacion: "RECHAZAR",
    rangoIngresos: "751-1000",
    capacidadPago: "$ 0.00",
    edad: "65 años",
    cuotaEstimada: "$0.00"
  },
  scoreSobreendeudamiento = 750,
  scoreV4 = 900,
  politicas = [
    {
      politica: "MATRIZ DUAL: SCORE BURO 3.0 - SCORE SOBREENDEUDAMIENTO",
      decision: "RECHAZAR",
      valor: "528-550"
    }
  ]
}) {
  const [imprimiendo, setImprimiendo] = useState(false);
  const location = useLocation();
  const { nombre, cedula, Fecha } = location.state || {};
  const [clienteDatos, setClienteDatos] = useState([]);
  console.log("cliente datos",clienteDatos);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('es-EC', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const datosPersonales = {
    nombre: nombre || "",
    identificacion: cedula || "",
    fechaConsulta: formatDate(Fecha)
  };

  const handleImprimir = () => {
    if (setImprimiendo) {
      setImprimiendo(true);
    }
    setTimeout(() => {
      window.print();
      if (setImprimiendo) {
        setImprimiendo(false);
      }
    }, 100);
  };
  // Función para determinar el color según el score
  const getScoreColor = (score, max = 999) => {
    const percentage = score / max;
    if (percentage < 0.33) return '#ef4444'; // Rojo
    if (percentage < 0.66) return '#eab308'; // Amarillo
    return '#22c55e'; // Verde
  };

  // Porcentaje para visualización
  const scoreV4Percentage = (clienteDatos.scorev3?.Score / 999) * 100;
  const sobreendudamientoPercentage = (parseInt(clienteDatos.segmentacion?.ScoreSobreendeudamiento)/ 999) * 100;
  
  // Datos para el gráfico radial de Score V4
  const scoreV4Data = [
    {
      name: 'Score V4',
      value: scoreV4Percentage,
      fill: getScoreColor(clienteDatos.scorev3?.Score)
    }
  ];
  
  // Datos para línea de sobreendeudamiento
  const sobreendeudamientoData = [
    { name: 'Muy Alto', value: 0, position: 0 },
    { name: 'Alto', value: 334, position: 33 },
    { name: 'Medio', value: 524, position: 52 },
    { name: 'Bajo', value: 728, position: 73 },
    { name: 'Muy Bajo', value: 999, position: 100 }
  ];

  const fetchEqfxInformacion = async (cedula) => {
      try {
        const url = APIURL.getEqfxIdentificacion(cedula);
        const response = await axios.get(url, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status === 200) {
          const {data} = response.data;
          setClienteDatos(prev => ({
            ...prev,
            informacion: data, 
          }));
          fetchEqfxSegmentacion(data.idEQFX_IdentificacionConsultada);
          fetchEqfxPoliticas(data.idEQFX_IdentificacionConsultada);
          fetchEqfxScorev3(data.idEQFX_IdentificacionConsultada);
        } else {
          console.error(`Error: ${response.status} - ${response.statusText}`);
        }
      } catch (error) {
        console.error("Error fetching equifax data:", error);
      }
    };

    useEffect(() => {
      if (cedula) {
        fetchEqfxInformacion(cedula);
      }
    }
  , []);

  const fetchEqfxSegmentacion = async (id) => {
    try {
      const url = APIURL.getEqfxResultSegment(id);
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        const {data} = response.data;
        setClienteDatos(prev => ({
          ...prev,
          segmentacion: data,
        }));
      } else {
        console.error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching equifax data:", error);
    }
  };

  const fetchEqfxPoliticas = async (id) => {
    try {
      const url = APIURL.getEqfxResultPliticas(id);
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        const {data} = response.data;
        setClienteDatos(prev => ({
          ...prev,
          politicas: data,
        }));
      } else {
        console.error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching equifax data:", error);
    }
  };

  const fetchEqfxScorev3 = async (id) => {
    try {
      const url = APIURL.getEqfxScorePuntaje(id);
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        const {data} = response.data;
        setClienteDatos(prev => ({
          ...prev,
          scorev3: data,
        }));
      } else {
        console.error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching equifax data:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-2">
      {/* Cabecera Mejorada */}
      <div className="flex justify-between items-center bg-gradient-to-r from-blue-900 to-blue-700 p-6 text-white print-header">
        <div className="flex items-center">
          <FileText className="w-8 h-8 mr-3" />
          <h1 className="text-2xl font-bold tracking-tight">REPORTE BURO DE CRÉDITO</h1>
        </div>
      </div>
      
      {/* Información del cliente mejorada */}
      <div className="flex flex-wrap p-6 border-b border-gray-200 bg-gradient-to-r from-gray-100 to-gray-50 print-section">
        <div className="flex items-center flex-grow">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mr-4 border-2 border-blue-300">
            <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="space-y-1">
            <div className="font-semibold text-lg">{datosPersonales.nombre}</div>
            <div className="flex items-center text-gray-600">
              <span className="font-medium">ID:</span>
              <span className="ml-2">{datosPersonales.identificacion}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <span className="font-medium">CONSULTA:</span>
              <span className="ml-2">{datosPersonales.fechaConsulta}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center mt-4 md:mt-0">
        </div>
      </div>

      {/* Resultado mejorado con iconos */}
      <div className="p-6 border-b border-gray-200 bg-white print-section">
        <div className="flex items-center mb-6">
          <div className={`p-2 rounded-full ${clienteDatos.segmentacion?.SegmentacionCliente === "RECHAZAR" ? "bg-red-100" : "bg-green-100"} mr-3`}>
            {clienteDatos.segmentacion?.SegmentacionCliente === "RECHAZAR" ? 
              <X className="w-6 h-6 text-red-600" /> : 
              <Check className="w-6 h-6 text-green-600" />
            }
          </div>
          <h2 className="text-xl font-bold text-gray-800">RESULTADO DE EVALUACIÓN</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print-grid">
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="font-semibold">SEGMENTACIÓN:</span>
                <span className={`font-bold ${clienteDatos.segmentacion?.SegmentacionCliente === "RECHAZAR" ? "text-red-600" : "text-green-600"}`}>
                  {clienteDatos.segmentacion?.SegmentacionCliente}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="font-semibold">RANGO INGRESOS:</span>
                <span>{clienteDatos.segmentacion?.RangoIngresos}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="font-semibold">CAPACIDAD DE PAGO:</span>
                <span>${clienteDatos.segmentacion?.CapacidaddePago}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">EDAD:</span>
                <span>{resultado.edad}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-gray-700 mb-2 text-center">CUOTA ESTIMADA MENSUAL</h3>
            <div className="text-3xl font-bold text-center text-blue-800">{resultado.cuotaEstimada}</div>
            <div className="mt-4 text-center">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">
                <AlertTriangle className="w-4 h-4 mr-1" />
                Valor referencial
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Indicadores mejorados */}
      <div className="p-2 border-b border-gray-200 bg-gray-50 print-section print-scores">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print-grid">
          {/* Score Sobreendeudamiento - Simplificado */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <div className="w-4 h-4 rounded-full bg-blue-600 mr-2"></div>
              SCORE SOBREENDEUDAMIENTO
            </h2>
            <div className="h-48 print-chart">
              <div className="relative h-6 bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 rounded-full mb-8">
                {/* Marcadores de referencia */}
                <div className="absolute -bottom-6 left-0 text-xs">0</div>
                <div className="absolute -bottom-6 left-1/3 transform -translate-x-1/2 text-xs">334</div>
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs">524</div>
                <div className="absolute -bottom-6 left-3/4 transform -translate-x-1/2 text-xs">728</div>
                <div className="absolute -bottom-6 right-0 text-xs">999</div>
                
                {/* Indicador de posición */}
                <div 
                  className="absolute top-0 w-4 h-8 bg-blue-800 transform -translate-x-1/2 rounded-full shadow-md" 
                  style={{ left: `${sobreendudamientoPercentage}%` }}
                ></div>
              </div>
              
              <div className="mt-12 text-center font-bold text-xl">
                {clienteDatos.segmentacion?.ScoreSobreendeudamiento || 0} 
                <span className="text-sm font-normal text-gray-600 ml-2">puntos</span>
              </div>
              
              <div className="mt-6 grid grid-cols-5 gap-2 text-xs text-center">
                <div className="bg-red-500 text-white p-1 rounded">Muy Alto Riesgo</div>
                <div className="bg-orange-500 text-white p-1 rounded">Alto Riesgo</div>
                <div className="bg-yellow-400 text-gray-800 p-1 rounded">Riesgo Medio</div>
                <div className="bg-green-400 text-gray-800 p-1 rounded">Bajo Riesgo</div>
                <div className="bg-green-600 text-white p-1 rounded">Muy Bajo Riesgo</div>
              </div>
            </div>
          </div>

          {/* Score V4 - Simplificado */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <div className="w-4 h-4 rounded-full bg-blue-600 mr-2"></div>
              SCORE V4
            </h2>
            <div className="h-56 print-chart">
              
              <div className="flex justify-center">
                <ResponsiveContainer width="60%" height={120}>
                  <RadialBarChart 
                    cx="50%" 
                    cy="50%" 
                    innerRadius="70%" 
                    outerRadius="90%" 
                    data={scoreV4Data} 
                    startAngle={180} 
                    endAngle={0}
                  >
                    <PolarAngleAxis
                      type="number"
                      domain={[0, 100]}
                      angleAxisId={0}
                      tick={false}
                    />
                    <RadialBar
                      background
                      clockWise
                      dataKey="value"
                      cornerRadius={10}
                      fill={getScoreColor(clienteDatos.scorev3?.Score)}
                    />
                    <text
                      x="50%"
                      y="50%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="font-bold text-xl"
                    >
                      {clienteDatos.scorev3?.Score>0 ? clienteDatos.scorev3?.Score : 0}
                    </text>
                  </RadialBarChart>
                 
                </ResponsiveContainer>
                {/* Texto debajo del gráfico */}
  <div className="w-full max-w-xs text-center  text-xs">
    <p>
      Una persona con un score entre <span className="font-medium">325 y 562</span> tiene una probabilidad de <span className="font-medium">29.90%</span> de incurrir en morosidad en el Sistema Crediticio Ecuatoriano.
    </p>
    <p className="bg-blue-50 border border-blue-100 rounded ">
      <span className="font-semibold">Importante:</span> El <span className="font-medium">20%</span> de las personas en el Sistema Crediticio Ecuatoriano tienen un Score menor que el evaluado.
    </p>
  </div>
               
              </div>

              
            </div>
          </div>
        </div>
      </div>

      {/* Manejo de cuentas - Empieza en nueva página para impresión */}
      <div className="p-6 border-b border-gray-200 bg-white print-section print-page-break">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <div className="w-4 h-4 rounded-full bg-blue-600 mr-2"></div>
          MANEJO DE CUENTAS CORRIENTES
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left text-xs font-semibold border-b-2 border-gray-200">FECHA HABILITACIÓN</th>
                <th className="p-3 text-left text-xs font-semibold border-b-2 border-gray-200">TIEMPO INHABILITACIÓN</th>
                <th className="p-3 text-left text-xs font-semibold border-b-2 border-gray-200">ACCIÓN</th>
                <th className="p-3 text-left text-xs font-semibold border-b-2 border-gray-200">MOTIVO</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 text-xs" colSpan="4">
                  <div className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Es persona habilitada para manejo de cuentas Corrientes de acuerdo a normativa emitida por SBS.
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Resultado políticas */}
      <div className="p-6 print-section">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <div className="w-4 h-4 rounded-full bg-blue-600 mr-2"></div>
          RESULTADO POLÍTICAS
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left text-xs font-semibold border-b-2 border-gray-200">POLÍTICA</th>
                <th className="p-3 text-left text-xs font-semibold border-b-2 border-gray-200">DECISIÓN</th>
                <th className="p-3 text-left text-xs font-semibold border-b-2 border-gray-200">VALOR</th>
              </tr>
            </thead>
            <tbody>
              {politicas.map((politica, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-3 text-xs">{politica.politica}</td>
                  <td className="p-3 text-xs font-bold text-red-600">{clienteDatos.segmentacion?.SegmentacionCliente}</td>
                  <td className="p-3 text-xs">{clienteDatos.segmentacion?.RangoIngresos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      {/* Botón de impresión mejorado (solo visible en web) */}
      <div className={`p-6 flex justify-end ${imprimiendo ? 'hidden' : ''}`}>
        <button 
          onClick={handleImprimir}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center transition-all duration-300 shadow-md"
        >
          <Printer className="w-5 h-5 mr-2" />
          Imprimir Reporte
        </button>
      </div>

      {/* Estilos para impresión */}
      <style>{`
        @media print {
          body { 
            print-color-adjust: exact; 
            -webkit-print-color-adjust: exact;
            font-size: 10px;
          }
          
          /* Aplica escalado para ajustar mejor al tamaño de página */
          .print-section {
            padding: 12px;
          }
          
          /* Mantener la estructura de grid en impresión */
          .print-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
          }
          
          /* Ajustar tamaños para los gráficos */
          .print-chart {
            height: 160px;
           display: block !important;

          }
          
          /* Forzar salto de página después de los scores */
         
          
          /* Reducir tamaños de texto para impresión */
          h1 {
            font-size: 16px !important;
          }
          
          h2 {
            font-size: 14px !important;
          }
          
          h3 {
            font-size: 12px !important;
          }
          
          .text-3xl {
            font-size: 20px !important;
          }
          
          .text-2xl {
            font-size: 18px !important;  
          }
          
          .text-xl {
            font-size: 16px !important;
          }
          
          .text-lg {
            font-size: 14px !important;
          }
          
          /* Ajustes para íconos */
          
          
          /* Ajustes para tablas */
      
        
          
          /* Ocultar botón de impresión */
          button {
            display: none !important;
          }
          
          /* Asegurar que no hay margen extra en la página */
          @page {
            margin: 0.5cm;
          }
        }
      `}</style>
    </div>
  );
}