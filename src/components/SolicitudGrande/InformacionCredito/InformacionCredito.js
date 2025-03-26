import React, { useState, useEffect, forwardRef, useCallback, useImperativeHandle } from "react";
import { useSnackbar } from "notistack";
import { FaStar,FaChartLine,FaFileInvoiceDollar,FaUserCheck,FaHandHoldingUsd,FaChartPie,
	FaExclamationTriangle,FaExclamationCircle,FaBan
 } from "react-icons/fa";
const InformacionCredito = forwardRef((props, ref) => {
  const { data } = props;


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
		  {/* Primera Fila */}
		  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
			{/* Score */}
			<div className="flex flex-col">
			  <label className="text-xs font-medium mb-1 flex items-center">
				<FaStar className="mr-2 text-primaryBlue" />
				Score(*)
			  </label>
			  <input
				type="number"
				name="score"
				autoComplete="off"
				placeholder="Score"
				className="solcitudgrande-style"
				value={formData.score}
				onChange={handleChange}
			  />
			</div>
			{/* Rango Ingresos */}
			<div className="flex flex-col">
			  <label className="text-xs font-medium mb-1 flex items-center">
				<FaChartLine className="mr-2 text-primaryBlue" />
				Rango Ingresos(*)
			  </label>
			  <input
				type="text"
				name="rangeIngresos"
				autoComplete="off"
				placeholder="Rango Ingresos"
				className="solcitudgrande-style"
				pattern="[A-Za-z]+"
				title="Solo se permiten letras y espacios"
				value={formData.rangeIngresos}
				onChange={handleChange}
			  />
			</div>
			{/* Resultado Equifax */}
			<div className="flex flex-col">
			  <label className="text-xs font-medium mb-1 flex items-center">
				<FaFileInvoiceDollar className="mr-2 text-primaryBlue" />
				Resultado Equifax(*)
			  </label>
			  <input
				type="text"
				name="resultadoEquifax"
				autoComplete="off"
				placeholder="Resultado Equifax"
				className="solcitudgrande-style"
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
			  <label className="text-xs font-medium mb-1 flex items-center">
				<FaUserCheck className="mr-2 text-primaryBlue" />
				Score Inclusion(*)
			  </label>
			  <input
				type="number"
				name="scoreInclusion"
				autoComplete="off"
				placeholder="Score Inclusion"
				className="solcitudgrande-style"
				value={formData.scoreInclusion}
				onChange={handleChange}
			  />
			</div>
			{/* Capacidad Pago */}
			<div className="flex flex-col">
			  <label className="text-xs font-medium mb-1 flex items-center">
				<FaHandHoldingUsd className="mr-2 text-primaryBlue" />
				Capacidad Pago(*)
			  </label>
			  <input
				type="number"
				name="capacidadPago"
				autoComplete="off"
				placeholder="Capacidad Pago"
				className="solcitudgrande-style"
				value={formData.capacidadPago}
				onChange={handleChange}
			  />
			</div>
			{/* Segmentación Equifax */}
			<div className="flex flex-col">
			  <label className="text-xs font-medium mb-1 flex items-center">
				<FaChartPie className="mr-2 text-primaryBlue" />
				Segmentación Equifax(*)
			  </label>
			  <input
				type="number"
				name="segmentacionEquifax"
				autoComplete="off"
				placeholder="Segmentación Equifax"
				className="solcitudgrande-style"
				value={formData.segmentacionEquifax}
				onChange={handleChange}
			  />
			</div>
		  </div>
	  
		  {/* Tercera Fila */}
		  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
			{/* Score Sobreendeudamiento */}
			<div className="flex flex-col">
			  <label className="text-xs font-medium mb-1 flex items-center">
				<FaExclamationTriangle className="mr-2 text-primaryBlue" />
				Score Sobreendeudamiento(*)
			  </label>
			  <input
				type="number"
				name="scoreSobreendeudamiento"
				autoComplete="off"
				placeholder="Score Sobreendeudamiento"
				className="solcitudgrande-style"
				value={formData.scoreSobreendeudamiento}
				onChange={handleChange}
			  />
			</div>
			{/* Total Vencido */}
			<div className="flex flex-col">
			  <label className="text-xs font-medium mb-1 flex items-center">
				<FaExclamationCircle className="mr-2 text-primaryBlue" />
				Total Vencido(*)
			  </label>
			  <input
				type="number"
				name="totalVencido"
				autoComplete="off"
				placeholder="Total Vencido"
				className="solcitudgrande-style"
				value={formData.totalVencido}
				onChange={handleChange}
			  />
			</div>
		  </div>
	  
		  {/* Cuarta Fila */}
		  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
			<div></div>
			{/* Cartera Castigada */}
			<div className="flex flex-col">
			  <label className="text-xs font-medium mb-1 flex items-center">
				<FaBan className="mr-2 text-primaryBlue" />
				Cartera Castigada(*)
			  </label>
			  <input
				type="number"
				name="carteraCastigada"
				autoComplete="off"
				placeholder="Cartera Castigada"
				className="solcitudgrande-style"
				value={formData.carteraCastigada}
				onChange={handleChange}
			  />
			</div>
			{/* Botón Guardar */}
			<button
			  onClick={handleAgregar}
			  className="rounded-full hover:shadow-md transition duration-300 ease-in-out group bg-primaryBlue text-white border border-white hover:bg-white hover:text-primaryBlue hover:border-primaryBlue text-xs px-6 py-2.5"
			>
			  Agregar
			</button>
		  </div>
	  
		  {/* Tabla */}
		  <div className="p-6 bg-gray-50 min-h-screen overflow-auto">
			<div className="overflow-x-auto bg-white shadow-lg rounded-lg border border-gray-300">
			  <table className="min-w-full table-auto">
				<thead className="bg-primaryBlue">
				  <tr>
					<th className="px-4 py-2 text-center font-bold text-white">Número</th>
					<th className="px-4 py-2 text-center font-bold text-white">Fecha</th>
					<th className="px-4 py-2 text-center font-bold text-white">E. Financiera</th>
					<th className="px-4 py-2 text-center font-bold text-white">Lote</th>
					<th className="px-4 py-2 text-center font-bold text-white">Motivo</th>
					<th className="px-4 py-2 text-center font-bold text-white">Bodega</th>
					<th className="px-4 py-2 text-center font-bold text-white">Cuotas</th>
					<th className="px-4 py-2 text-center font-bold text-white">Monto</th>
					<th className="px-4 py-2 text-center font-bold text-white">F. Pago</th>
					<th className="px-4 py-2 text-center font-bold text-white">Valor Cuota</th>
					<th className="px-4 py-2 text-center font-bold text-white">C. Pendiente</th>
					<th className="px-4 py-2 text-center font-bold text-white">C. Pagada</th>
					<th className="px-4 py-2 text-center font-bold text-white">Saldo C</th>
					<th className="px-4 py-2 text-center font-bold text-white">P. Retraso</th>
					<th className="px-4 py-2 text-center font-bold text-white">Ult Pago</th>
				  </tr>
				</thead>
				<tbody>
				  <tr className="hover:bg-gray-100">
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
				  </tr>
				</tbody>
			  </table>
			</div>
		  </div>
		</div>
	  )
	});
	
	export default InformacionCredito;
	