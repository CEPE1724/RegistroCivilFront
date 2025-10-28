import { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "../../configApi/axiosConfig";
import { APIURL } from "../../configApi/apiConfig";
import { useAuth } from "../AuthContext/AuthContext";
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
import { AlertTriangle, Check, X, FileText, Printer, Undo2 } from 'lucide-react';

export function ReporteEquifax() {
  const [imprimiendo, setImprimiendo] = useState(false);
  const location = useLocation();
  const { nombre, cedula, Fecha } = location.state || {};
  const [clienteDatos, setClienteDatos] = useState([]);
  console.log("clienteDatos", clienteDatos)
  const [datosTablas, setDatosTablas] = useState([]); 
  console.log("datosTablas", datosTablas)
  const navigate = useNavigate();
  const [encEntConsu, setEncEntConsu] = useState([])
  const [tabEntConsu, setTabEntConsu] = useState([]) 
  const { userData, idMenu, socket } = useAuth();
  const [permisos, setPermisos] = useState([]);

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
  const scoreV4Percentage = (datosTablas?.score?.data?.score / 999) * 100;
  const sobreendudamientoPercentage = (parseInt(datosTablas?.scoreSobreendeudamiento?.data?.score) / 999) * 100;

  // Datos para el gráfico radial de Score V4
  const scoreV4Data = [
    {
      name: 'Score V4',
      value: scoreV4Percentage,
      fill: getScoreColor(datosTablas?.score?.data?.score)
    }
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
        const { data } = response.data;
        setClienteDatos(prev => ({
          ...prev,
          informacion: data,
        }));
        fecthDatosCogno(data.NumeroDocumento);
      } else {
        console.error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching equifax data:", error);
    }
  };

  const permisosComponente = async (idMenu, idUsuario) => {
    try {
      const url = APIURL.getacces(idMenu, idUsuario);
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        const data = response.data;
        setPermisos(data);
      } else {
        console.error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching permissions components:", error);
    }
  };

  const permisoVerTablas = () => {
    const permiso = permisos.find((p) => p.Permisos === `EQUIFAX VER TABLAS`);
    return permiso && permiso.Activo;
  };

  useEffect(() => {
    if (cedula) {
      fetchEqfxInformacion(cedula);
    }

	if (userData?.idUsuario && idMenu) {
		permisosComponente(idMenu, userData.idUsuario);
    }
  }, []);

  const fecthDatosCogno = async (cedula) => {
    try {
      const url = APIURL.validarCedulaCognos(cedula);
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        const data = response.data;
        setClienteDatos(prev => ({
          ...prev,
          edad: data,
        }));
      } else {
        console.error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching edad data:", error);
    }
  };

  const fetchReporteBuro = async (id) => {
    try {
      const url = APIURL.getUatReporteBuroCredito(id);
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        const data  = response.data;
        setDatosTablas(data);
     
		setEncEntConsu(data.entidadesConsultadas.data[0])
		setTabEntConsu(data.entidadesConsultadas.data.slice(1))
      } else {
        console.error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching equifax data:", error);
    }
  }

	const datos = datosTablas?.deudaHistorica?.data ?? [];
	const datosOrdenados = [...datos].sort(
		(a, b) => new Date(a.fecha_corte) - new Date(b.fecha_corte)
	);

  useEffect(() => {
    if (clienteDatos.informacion) {
      fetchReporteBuro(clienteDatos.informacion.idEQFX_IdentificacionConsultada);
    }
  }, [clienteDatos.informacion]);

  // Formateador de fecha para el eje X
  const formatoFecha = (fechaStr) => {
    try {
      const fecha = new Date(fechaStr);
      return fecha.toLocaleDateString('es-ES', { 
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      });
    } catch (e) {
      return fechaStr;
    }
  };

  const TooltipPersonalizado = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const fecha = formatoFecha(label);
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-md rounded">
          <p className="font-semibold">{fecha}</p>
          {payload.map((entry, index) => (
            <p key={`tooltip-${index}`} style={{ color: entry.color }}>
              {entry.name}: {new Intl.NumberFormat('es-ES', { 
                style: 'currency', 
                currency: 'USD',
                minimumFractionDigits: 0 
              }).format(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const infoConsolidadaActual = [
	...(datosTablas?.infoActualSb?.data || []),
	...(datosTablas?.infoActualSeps?.data || []),
	...(datosTablas?.infoActualSicom?.data || []),
  ]

  const infoConsolidadaHistorica = [
	...(datosTablas?.infoHistoricaSb?.data || []),
	...(datosTablas?.infoHistoricaSeps?.data || []),
	...(datosTablas?.infoHistoricaSicom?.data || []),
  ]
  console.count("Render ReporteEquifax");

  return (
    <div className="w-full max-w-5xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-2 px-4 sm:px-6 lg:px-8 py-4">
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
          <div className={`p-2 rounded-full ${datosTablas?.segmentacion?.data?.segmentacion_cliente === "RECHAZAR" ? "bg-red-100" : "bg-green-100"} mr-3`}>
            {datosTablas?.segmentacion?.data?.segmentacion_cliente === "RECHAZAR" ?
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
                <span className={`font-bold ${datosTablas?.segmentacion?.data?.segmentacion_cliente === "RECHAZAR" ? "text-red-600" : "text-green-600"}`}>
                  {datosTablas?.segmentacion?.data?.segmentacion_cliente}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="font-semibold">RANGO INGRESOS:</span>
                <span>{datosTablas?.segmentacion?.data?.RangoIngresos}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="font-semibold">CAPACIDAD DE PAGO:</span>
                <span>${datosTablas?.segmentacion?.data?.CapacidaddePago}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">EDAD:</span>
                <span>{clienteDatos.edad?.edad} años</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-gray-700 mb-2 text-center">CUOTA ESTIMADA MENSUAL</h3>
            <div className="text-3xl font-bold text-center text-blue-800">{ datosTablas?.cuotaEstMens?.data?.pago}</div>
            <div className="mt-4 text-center">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">
                <AlertTriangle className="w-4 h-4 mr-1" />
                Valor referencial
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SCORE SOBREENDEUDAMIENTO */}
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
                {datosTablas?.scoreSobreendeudamiento?.data?.score || 0}
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
                      fill={getScoreColor(datosTablas?.score?.data?.score)}
                    />
                    <text
                      x="50%"
                      y="50%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="font-bold text-xl"
                    >
                      {datosTablas?.score?.data?.score > 0 ? datosTablas?.score?.data?.score : 0}
                    </text>
                  </RadialBarChart>
                </ResponsiveContainer>
                {/* Texto debajo del gráfico */}
                <div className="w-full max-w-xs text-center  text-xs">
                  <p>
                    Una persona con un score entre <span className="font-medium">{datosTablas?.score?.data?.score_min} y {datosTablas?.score?.data?.score_max}</span> tiene una probabilidad de <span className="font-medium"> {datosTablas?.scoreSobreendeudamiento?.data?.porcentaje}% </span> de incurrir en morosidad en el Sistema Crediticio Ecuatoriano.
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

      {/* Manejo de cuentas corrientes */}
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
				{datosTablas?.politicas?.data?.map((item) => (
              <tr className="border-b border-gray-100 hover:bg-gray-50" key={item.idEQFX_UAT_resultado_politicas}>
                <td className="p-3 text-xs">{item.politica}</td>
                <td className={`p-3 text-xs font-bold ${datosTablas?.politicas?.data?.Resultado === "RECHAZAR" ? "text-red-600" : "text-green-600"}`}>{datosTablas?.politicas?.data?.Resultado}</td>
                <td className="p-3 text-xs">{item.valor}</td>
              </tr>))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Información Consolidada Actual */}
      <div className="p-6 border-b border-gray-200 bg-white print-section print-page-break">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <div className="w-4 h-4 rounded-full bg-blue-600 mr-2"></div>
          INFORMACIÓN CONSOLIDADA ACTUAL
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">FECHA CORTE</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">SEGMENTO</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">INSTITUCIÓN FINANCIERA</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">TIPO RIESGO</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">TIPO CRÉDITO</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">TOTAL VENCER</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">NO DEVENGA INTERÉS</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">TOTAL VENCIDO</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">DEMANDA JUDICIAL</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">CARTERA CASTIGADA</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">SALDO DEUDA</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">TIEMPO DÍAS VENCIDO</th>
              </tr>
            </thead>
            <tbody>
              {infoConsolidadaActual?.map((item, index) => (
                <tr className="border-b border-gray-100 hover:bg-gray-50" key={index}>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.fecha_corte}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.segmento}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.institucion}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.tipo_riesgo}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.tipo_credito}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.total_vencer}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.ndi}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.total_vencido}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.dem_jud}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.cart_cast}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.saldo_deuda}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.dias_morosidad}</td>
              </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Información Consolidada Histórica */}
      <div className="p-6 border-b border-gray-200 bg-white print-section">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <div className="w-4 h-4 rounded-full bg-blue-600 mr-2"></div>
          INFORMACIÓN CONSOLIDADA HISTÓRICA
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
                <tr className="bg-gray-100">
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">FECHA CORTE</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">SEGMENTO</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">INSTITUCIÓN FINANCIERA</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">TIPO RIESGO</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">TIPO CRÉDITO</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">MAYOR VALOR VENCIDO</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">FECHA MAYOR VALOR VENCIDO</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">MAYOR PLAZO</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">FECHA MAYOR PLAZO VENCIDO</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">FECHA ÚLTIMO VENCIDO</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">OPERACIÓN</th>
              </tr>
            </thead>
            <tbody>
              {infoConsolidadaHistorica?.map((item) => (
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-2 text-xs border border-gray-200 text-center">{item.fecha_corte}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.segmento}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.institucion}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.tipo_riesgo}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.tipo_credito}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.total_vencido}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.fecha_vencimiento}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.MayorPlazoVencido}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.FechaMayorPlazo}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.FechaUltimoVencido}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.Operacion}</td>
              </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deuda Reportada por el Sistema Financiero */}
	  {permisoVerTablas() && (
      <div className="p-6 border-b border-gray-200 bg-white print-section">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <div className="w-4 h-4 rounded-full bg-blue-600 mr-2"></div>
          DEUDA REPORTADA POR EL SISTEMA FINANCIERO
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-1 text-xs font-semibold border border-gray-200 text-center">FECHA CORTE</th>
                <th className="p-1 text-xs font-semibold border border-gray-200 text-center">INSTITUCIÓN</th>
                <th className="p-1 text-xs font-semibold border border-gray-200 text-center">TIPO RIESGO</th>
                <th className="p-1 text-xs font-semibold border border-gray-200 text-center">TIPO CRÉDITO</th>
                <th className="p-1 text-xs font-semibold border border-gray-200 text-center">CUPO / MONTO ORIGINAL</th>
                <th className="p-1 text-xs font-semibold border border-gray-200 text-center">FECHA APERTURA</th>
                <th className="p-1 text-xs font-semibold border border-gray-200 text-center">FECHA VENCIMIENTO</th>
                <th className="p-1 text-xs font-semibold border border-gray-200 text-center">TOTAL VENCER</th>
                <th className="p-1 text-xs font-semibold border border-gray-200 text-center">NDI</th>
                <th className="p-1 text-xs font-semibold border border-gray-200 text-center">TOTAL VENCIDO</th>
                <th className="p-1 text-xs font-semibold border border-gray-200 text-center">DEM JUDICIAL</th>
                <th className="p-1 text-xs font-semibold border border-gray-200 text-center">CART CASTIGADA</th>
                <th className="p-1 text-xs font-semibold border border-gray-200 text-center">SALDO DEUDA</th>
                <th className="p-1 text-xs font-semibold border border-gray-200 text-center">CUOTA MENSUAL</th>
              </tr>
            </thead>
            <tbody>
            {datosTablas?.deudaReportada?.data?.map((item, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-2 text-xs border border-gray-200 text-center">{item.fecha_corte}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.institucion}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.tipo_riesgo}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.tipo_credito}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.cupo_monto_original}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.fecha_apertura}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.fecha_vencimiento}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.total_vencer}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.ndi}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.total_vencer}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.dem_jud}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.cart_cast}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.saldo_deuda}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.cuota_mensual}</td>
              </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div> )}

      {/* Detalle de Tarjetas */}
	  {permisoVerTablas() && (
      <div className="p-6 border-b border-gray-200 bg-white print-section">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <div className="w-4 h-4 rounded-full bg-blue-600 mr-2"></div>
          DETALLE DE TARJETAS
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">INSTITUCIÓN</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">EMISOR</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">ANTIGÜEDAD</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">CUPO</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">SALDO ACTUAL</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">SALDO PROMEDIO 6 MESES</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">PORCENTAJE USO TARJETA</th>
                {/* <th className="p-2 text-xs font-semibold border border-gray-200 text-center">PORCENTAJE RELACIÓN DEUDA TC/DEUDA TOTAL</th> */}
              </tr>
            </thead>
            <tbody>
            {datosTablas?.detalleTarj?.data?.map((item, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-2 text-xs border border-gray-200 text-center">{item.institucion}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.emisor}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.antiguedad}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.cupo}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.saldo_actual}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.saldo_promedio_ultimos_6_meses}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.porcentaje_uso_tarjeta}%</td>
                {/* <td className="p-2 text-xs border border-gray-200 text-center">{item.PorcentajeRelacionDeudaTCDeudaTotal}</td> */}
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div> )}

      {/* Detalle Operaciones */}
	  {permisoVerTablas() && (
      <div className="p-6 border-b border-gray-200 bg-white print-section">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <div className="w-4 h-4 rounded-full bg-blue-600 mr-2"></div>
          DETALLE OPERACIONES
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                {/* <th className="p-2 text-xs font-semibold border border-gray-200 text-center">CONCEPTO</th> */}
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">DE 1 A 30 DÍAS</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">DE 1 A 2 MESES</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">DE 2 A 3 MESES</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">DE 3 A 6 MESES</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">DE 6 A 9 MESES</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">DE 9 A 12 MESES</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">DE 12 A 24 MESES</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">DE 24 A 36 MESES</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">MAS DE 36 MESES</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">DEMANDA JUDICIAL</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">CARTERA CASTIGADA</th>
                {/* <th className="p-2 text-xs font-semibold border border-gray-200 text-center">TOTAL</th> */}
              </tr>
            </thead>
            <tbody>
            {datosTablas?.detalleOperaciones?.data?.map((item, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                {/* <td className="p-2 text-xs border border-gray-200 text-center">{item.Titulo}</td> */}
                <td className="p-2 text-xs border border-gray-200 text-center">{item.vencido_0_a_1}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.vencido_1_a_2}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.vencido_2_a_3}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.vencido_3_a_6}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.vencido_6_a_9}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.vencido_9_a_12}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.vencido_12_a_24}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.vencido_24}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.vencido_36}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.demanda_judicial}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.cartera_castigada}</td>
                {/* <td className="p-2 text-xs border border-gray-200 text-center">{item.Total}</td> */}
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div> )}

      {/* Indicadores de Perfil de Riesgo */}
	  {permisoVerTablas() && (
      <div className="p-6 border-b border-gray-200 bg-white print-section">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <div className="w-4 h-4 rounded-full bg-blue-600 mr-2"></div>
          INDICADORES DE PERFIL DE RIESGO
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-xs font-semibold border border-gray-200 text-left">DESCRIPCIÓN</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-left">VALOR</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-left">FECHA</th>
              </tr>
            </thead>
            <tbody>
            {datosTablas?.indicadoresPerfilRiesgo?.data?.map((item, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-2 text-xs border border-gray-200">{item.indicador}</td>
                <td className="p-2 text-xs border border-gray-200">{item.valor}</td>
                <td className="p-2 text-xs border border-gray-200">{new Date(item.fecha).toLocaleDateString('es-ES')}</td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div> )}

      {/* Central de Infocom */}
	  {permisoVerTablas() && (
      <div className="p-6 border-b border-gray-200 bg-white print-section">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <div className="w-4 h-4 rounded-full bg-blue-600 mr-2"></div>
          CENTRAL DE INFOCOM
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">ACREEDOR</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">FECHA CORTE</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">TIPO RIESGO</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">SALDO DEUDA</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">POR VENCER</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">NDI</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">VALOR VENCIDO</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">DEMANDA JUDICIAL</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">CARTERA CASTIGADA</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">DÍAS VENCIDO</th>
              </tr>
            </thead>
            <tbody>
            {datosTablas?.centralInfocom?.data?.map((item) => (
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-2 text-xs border border-gray-200 text-center">{item.institucion}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{new Date(item.fecha_corte).toLocaleDateString('es-ES')}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.tipo_riesgo}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.saldo_deuda}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.total_vencer}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.ndi}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.total_vencido}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.dem_jud}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.cart_cast}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.dias_morosidad}</td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div> )}

      {/* Deuda Histórica */}
	  {permisoVerTablas() && (
      <div className="p-6 border-b border-gray-200 bg-white print-section">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <div className="w-4 h-4 rounded-full bg-blue-600 mr-2"></div>
          DEUDA HISTÓRICA
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-1 text-xs font-semibold border border-gray-200 text-center">MES</th>
                <th className="p-1 text-xs font-semibold border border-gray-200 text-center">POR VENCER</th>
                <th className="p-1 text-xs font-semibold border border-gray-200 text-center">NO DEVENGA</th>
                <th className="p-1 text-xs font-semibold border border-gray-200 text-center">1 MES</th>
                <th className="p-1 text-xs font-semibold border border-gray-200 text-center">2 MESES</th>
                <th className="p-1 text-xs font-semibold border border-gray-200 text-center">3 MESES</th>
                <th className="p-1 text-xs font-semibold border border-gray-200 text-center">6 MESES</th>
                <th className="p-1 text-xs font-semibold border border-gray-200 text-center">9 MESES</th>
                <th className="p-1 text-xs font-semibold border border-gray-200 text-center">12 MESES</th>
                <th className="p-1 text-xs font-semibold border border-gray-200 text-center">24 MESES</th>
                <th className="p-1 text-xs font-semibold border border-gray-200 text-center">36 MESES</th>
                <th className="p-1 text-xs font-semibold border border-gray-200 text-center">MAS 36 MESES</th>
                <th className="p-1 text-xs font-semibold border border-gray-200 text-center">DEMANDA JUDICIAL</th>
                <th className="p-1 text-xs font-semibold border border-gray-200 text-center">CARTERA CASTIGADA</th>
                <th className="p-1 text-xs font-semibold border border-gray-200 text-center">SALDO DEUDA</th>
              </tr>
            </thead>
            <tbody>
            {datosOrdenados.map((item, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-2 text-xs border border-gray-200 text-center">{new Date(item.fecha_corte).toLocaleDateString('es-ES')}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.por_vencer}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.no_devenga_int}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.vencido_0_a_1}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.vencido_1_a_2}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.vencido_2_a_3}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.vencido_3_a_6}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.vencido_6_a_9}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.vencido_9_a_12}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.vencido_12_a_24}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.vencido_24}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.vencido_36}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.demanda_judicial}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.cartera_castigada}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.saldo_deuda}</td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div> )}

      {/* Evolución Deuda Total y Vencida */}
	  {permisoVerTablas() && (
      <div className="p-6 border-b border-gray-200 bg-white print-section">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <div className="w-4 h-4 rounded-full bg-blue-600 mr-2"></div>
          EVOLUCIÓN DEUDA TOTAL Y VENCIDA
        </h2>
        <div className="w-full h-80 border border-gray-200 p-2 overflow-x-auto overflow-y-hidden">
        {datosTablas?.deudaHistorica?.data && datosTablas?.deudaHistorica?.data.length > 0 ? (
          <div style={{ minWidth: `${datosTablas.deudaHistorica.data.length * 50}px`, height: '100%' }}>
            <LineChart
			  width={datosTablas.deudaHistorica.data.length * 50}
      		  height={300}
              //data={datosTablas.deudaHistorica.data} 
			  data={datosOrdenados}
              margin={{ top: 5, right: 30, left: 5, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="fecha_corte" 
                tickFormatter={formatoFecha}
                angle={-45}
                textAnchor="end"
                height={60}
                interval={0}
                tick={{ fontSize: 15 }}
              />
              <YAxis 
                tickCount={6} 
                tick={{ fontSize: 15 }}
                domain={[0, 'auto']}
              />
              <Tooltip content={<TooltipPersonalizado />} />
              <Legend wrapperStyle={{ bottom: -10 }} />
              <Line
                type="monotone"
                dataKey="saldo_deuda"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ fill: "#3B82F6", r: 5 }}
                activeDot={{ r: 7 }}
                name="Endeudamiento"
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="por_vencer"
                stroke="#EF4444"
                strokeWidth={2}
                dot={{ fill: "#EF4444", r: 5 }}
                activeDot={{ r: 7 }}
                name="Vencido, Dem. Judicial, Cart. Castigada"
                isAnimationActive={false}
              />
            </LineChart>
          </div>
        ) : (
          <div className="flex justify-center items-center h-full">
            <p className="text-sm text-gray-500">No hay datos disponibles para mostrar</p>
          </div>
        )}
        <div className="flex justify-center mt-4">
          <div className="flex items-center mr-6">
            <div className="w-4 h-4 bg-blue-500 mr-2"></div>
            <span className="text-xs">Endeudamiento</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 mr-2"></div>
            <span className="text-xs">Vencido, Dem. Judicial, Cart. Castigada</span>
          </div>
        </div>
      </div>
    </div> )}
      
      {/* DEUDA TOTAL REPORTADA FINANCIERO, REGULADO SB, SEPS Y COMERCIAL*/}
	  {permisoVerTablas() && (
      <div className="p-6 border-b border-gray-200 bg-white print-section">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <div className="w-4 h-4 rounded-full bg-blue-600 mr-2"></div>
          DEUDA TOTAL REPORTADA FINANCIERO, REGULADO SB, SEPS Y COMERCIAL
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">SECTOR</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">POR VENCER</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">NO DEVENGA INTERES</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">VENCIDO</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">DEMANDA JUDICIAL</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">CARTERA CASTIGADA</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">TOTAL</th>
              </tr>
            </thead>
            <tbody>
            {datosTablas?.deudaTotalRfr?.data?.map((item, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-2 text-xs border border-gray-200 text-center">{item.institucion}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.por_vencer}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.no_devenga_int}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.vencido}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.demanda_judicial}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.cartera_castigada}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.total}</td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div> )}

      {/*ANÁLISIS SALDOS POR VENCER SISTEMA */}
	  {permisoVerTablas() && (
      <div className="p-6 border-b border-gray-200 bg-white print-section">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <div className="w-4 h-4 rounded-full bg-blue-600 mr-2"></div>
          ANÁLISIS SALDOS POR VENCER SISTEMA
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">INSTITUCIÓN FINANCIERA</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">FECHA CORTE</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">POR VENCER</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">POR VENCER 1 A 30 DÍAS</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">POR VENCER 1 A 3 MESES</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">POR VENCER 3 A 6 MESES</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">POR VENCER 6 A 12 MESES</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">POR VENCER 12 MESES</th>
              </tr>
            </thead>
            <tbody>
            {datosTablas?.analisisSaldoVencer?.data?.map((item, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-2 text-xs border border-gray-200 text-center">{item.institucion}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{new Date(item.fecha_corte).toLocaleDateString('es-ES')}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.total_por_vencer}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.por_vencer_0_a_1}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.por_vencer_1_a_3}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.por_vencer_3_a_6}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.por_vencer_6_a_12}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.por_vencer_12}</td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div> )}

      {/*COMPOSICIÓN ESTRUCTURA DEL VENCIMIENTO */}
	  {permisoVerTablas() && (
      <div className="p-6 border-b border-gray-200 bg-white print-section">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <div className="w-4 h-4 rounded-full bg-blue-600 mr-2"></div>
          COMPOSICIÓN ESTRUCTURA DEL VENCIMIENTO
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">INSTITUCIÓN FINANCIERA</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">FECHA CORTE</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">TOTAL VENCER</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">TOTAL VENCIDO</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">NO DEVENGA INTERESES</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">SALDO DEUDA</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">DEMANDA JUDICIAL</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">CARTERA CASTIGADA</th>
                {/* <th className="p-2 text-xs font-semibold border border-gray-200 text-center">ACUERDO CONCORDATO</th> */}
              </tr>
            </thead>
            <tbody>
            {datosTablas?.compoEstructuraVenc?.data?.map((item, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-2 text-xs border border-gray-200 text-center">{item.institucion}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{new Date(item.fecha_corte).toLocaleDateString('es-ES')}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.por_vencer}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.vencido}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.no_devenga_int}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.saldo_deuda}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.demanda_judicial}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.cartera_castigada}</td>
                {/* <td className="p-2 text-xs border border-gray-200 text-center">{item.acuerdo_concordatorio}</td> */}
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div> )}

      {/*CRÉDITOS OTORGADOS ÚLTIMOS 12 MESES */}
	  {permisoVerTablas() && (
      <div className="p-6 border-b border-gray-200 bg-white print-section">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <div className="w-4 h-4 rounded-full bg-blue-600 mr-2"></div>
          CRÉDITOS OTORGADOS ÚLTIMOS 12 MESES
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">INSTITUCIÓN FINANCIERA</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">ESTADO OPERACIÓN</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">TIPO CRÉDITO</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">VALOR OPERACIÓN</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">SALDO TITULAR</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">SALDO CODEUDOR</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">SALDO GARANTE</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">FECHA CONCESIÓN</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">FECHA VENCIMIENTO</th>
              </tr>
            </thead>
            <tbody>
            {datosTablas?.creditosOtorgados12m?.data?.map((item, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-2 text-xs border border-gray-200 text-center">{item.institucion}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.estado_operacion}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.tipo_credito}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.valor_operacion}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.titular}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.codeudor}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.garante}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.fecha_concesion}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.fecha_vencimiento}</td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div> )}	

      {/*ULTIMAS 10 OPERACIONES CANCELADAS */}
	  {permisoVerTablas() && (
      <div className="p-6 border-b border-gray-200 bg-white print-section">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <div className="w-4 h-4 rounded-full bg-blue-600 mr-2"></div>
          ULTIMAS 10 OPERACIONES CANCELADAS
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
              <th className="p-2 text-xs font-semibold border border-gray-200 text-center">FECHA CORTE</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">INSTITUCIÓN</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">NUMERO OPERACIÓN</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">FECHA CANCELACION</th>
              </tr>
            </thead>
            <tbody>
            {datosTablas?.ultimas10Operaciones?.data?.map((item, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-2 text-xs border border-gray-200 text-center">{new Date(item.fecha_corte).toLocaleDateString('es-ES')}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.institucion}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.numero_operacion}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{new Date(item.fecha_cancelacion).toLocaleDateString('es-ES')}</td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div> )}

      {/*ENTIDADES CONSULTADAS */}
	  {permisoVerTablas() && (
      <div className="p-6 border-b border-gray-200 bg-white print-section">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <div className="w-4 h-4 rounded-full bg-blue-600 mr-2"></div>
          ENTIDADES CONSULTADAS
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
			  { encEntConsu && (
			  <tr className="bg-gray-100">
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">{encEntConsu.nombre_cliente}</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">{encEntConsu.mes1}</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">{encEntConsu.mes2}</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">{encEntConsu.mes3}</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">{encEntConsu.mes4}</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">{encEntConsu.mes5}</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">{encEntConsu.mes6}</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">{encEntConsu.mes7}</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">{encEntConsu.mes8}</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">{encEntConsu.mes9}</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">{encEntConsu.mes10}</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">{encEntConsu.mes11}</th>
                <th className="p-2 text-xs font-semibold border border-gray-200 text-center">{encEntConsu.mes12}</th>
              </tr>)}
            </thead>
            <tbody>
            {tabEntConsu.map((item, index) => ( 
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-2 text-xs border border-gray-200 text-center">{item.nombre_cliente}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.mes1}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.mes2}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.mes3}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.mes4}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.mes5}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.mes6}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.mes7}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.mes8}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.mes9}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.mes10}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.mes11}</td>
                <td className="p-2 text-xs border border-gray-200 text-center">{item.mes12}</td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div> )}

      {/* Botón de impresión mejorado (solo visible en web) */}
      <div className={`p-6 flex justify-end ${imprimiendo ? 'hidden' : ''}`}>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center transition-all duration-300 shadow-md mr-4"
          onClick={() => navigate("/ListadoSolicitud", { replace: true })}>
          <Undo2 className="w-5 h-5 mr-2" />
          Regresar
        </button>
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