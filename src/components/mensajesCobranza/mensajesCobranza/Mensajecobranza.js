import { useState } from "react";
import * as XLSX from "xlsx";
import { useSnackbar } from "notistack";
import { FiUpload } from "react-icons/fi";
import { APIURL } from "../../../configApi/apiConfig";
import axios from "../../../configApi/axiosConfig";


const Textos = {
	36308: {
		id: 36308,
		mensaje: `Estimado Sr/a. (nombre), Almacenes Point le recuerda que su credito se encuentra impago, no afecte su historial crediticio y pague de inmediato.`
	},
	36500: {
		id: 36500,
		mensaje: `Sr/a (nombre), Almacenes Point le recuerda que su credito se encuentra con (diasMora) dias en mora, contamos su pago inmediato`
	},
	36701: {
		id: 36701,
		mensaje: `Almacenes Point informa que sus pagos los puede realizar por transferencia a la CTA Corriente 3077712404 Bco Pichincha a nombre de Supermercado de computadoras`
	},
	39315: {
		id: 39315,
		mensaje: `Estimado cliente, Almacenes Point informa que debido a la situacion que atraviesa el pais por el mes de (mes) puede cancelar su cuota sin recargos por cobranza`
	},
	47109: {
		id: 47109,
		mensaje: `Sr/Sra. (nombre), ALMACENES POINT le recuerda que su pago es el (dia), evite recargos adicionales. Contamos con su pago en la fecha establecida`
	}

}

export const Mensajecobranza = () => {

	const { enqueueSnackbar } = useSnackbar();
	const [mensajeSeleccionado, setMensajeSeleccionado] = useState("");
	const mensajeActual = Textos[mensajeSeleccionado];
	const [registros, setRegistros] = useState([]);
	const totalFilas = registros.length;
	const [archivoExcel, setArchivoExcel] = useState(null);

	const tieneVariablesSinReemplazar = (mensaje) => { return /\(.*?\)/.test(mensaje); };

	const obtenerVariablesDelMensaje = (mensaje) => {
		const matches = mensaje.match(/\((.*?)\)/g) || [];
		return matches.map(v => v.replace(/[()]/g, ""));
	};

	const variables = mensajeActual
		? obtenerVariablesDelMensaje(mensajeActual.mensaje)
		: [];

	const validarFila = (fila, variablesNecesarias) => {
		const faltantes = variablesNecesarias.filter(
			(variable) =>
				!fila[variable] || fila[variable].toString().trim() === ""
		);

		return {
			esValida: faltantes.length === 0,
			faltantes
		};
	};

	const validarCelular = (celular, index) => {
		const tel = celular?.toString() || "";

		if (tel.length !== 10 || !tel.startsWith("0")) {
			enqueueSnackbar("Algunos numeros de telefono tienen errores.", { variant: "error" });
			return false;
		}

		return true;
	};

	const filasConEstado = mensajeActual
		? registros.map((fila, index) => {
			const resultado = validarFila(fila, variables);
			const celularValido = validarCelular(fila.celular, index);

			return {
				...fila,
				esValida: resultado.esValida && celularValido,
				faltantes: resultado.faltantes
			};
		})
		: [];

	const filasConError = filasConEstado.filter(f => !f.esValida).length;


	const descargarErroresExcel = () => {
		if (filasConEstado.length === 0) return;

		const filasErrores = filasConEstado
			.filter(fila => !fila.esValida)
			.map(fila => ({
				...fila,
				errores: fila.faltantes.join(", ")
			}));

		const worksheet = XLSX.utils.json_to_sheet(filasErrores);
		const workbook = XLSX.utils.book_new();

		XLSX.utils.book_append_sheet(workbook, worksheet, "Errores");

		XLSX.writeFile(workbook, "filas_con_errores.xlsx");
	};


	const filasInvalidas = mensajeActual
		? registros.filter(fila => !validarFila(fila, variables))
		: [];

	const handleFileUpload = (e) => {
		const file = e.target.files[0];
		if (!file) return;

		setArchivoExcel(file);
		const reader = new FileReader();

		reader.onload = (evt) => {
			const data = new Uint8Array(evt.target.result);
			const workbook = XLSX.read(data, { type: "array" });

			const sheetName = workbook.SheetNames[0];
			const sheet = workbook.Sheets[sheetName];

			const jsonData = XLSX.utils.sheet_to_json(sheet);

		
			setRegistros(jsonData);
		};

		reader.readAsArrayBuffer(file);
	};

	const generarMensajeFinal = (plantilla, datos) => {
		return plantilla.replace(/\((.*?)\)/g, (_, key) => {
			return datos[key] ?? `[${key} faltante]`;
		});
	};

	const enviarCampana = async () => {
		if (!archivoExcel || !mensajeSeleccionado) {
			enqueueSnackbar("Seleccione mensaje y archivo", { variant: "error" });
			return;
		}

		const url = APIURL.postMensajescobranza();

		const formData = new FormData();
		formData.append("file", archivoExcel);
		formData.append("mensajeid", mensajeSeleccionado);
		formData.append("campana", "Cobranza Octubre");
		formData.append("tipo", "1");
		formData.append("ruta", "0");

		try {
			await axios.post(url, formData, {
				headers: {
					'Content-Type': undefined,
				},
			});

			enqueueSnackbar("Campaña enviada", { variant: "success" });
		} catch (error) {
			enqueueSnackbar("Error al enviar campaña", { variant: "error" });
		}
	};


	return (
		<>
			<h1 className="text-3xl font-bold text-center mb-6 mt-4 text-gray-800">
				Mensaje masivo
			</h1>

			<div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8">

				<label className="inline-flex items-center gap-2 cursor-pointer bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg shadow-md transition">
					<FiUpload size={20} />
					<span>Subir Excel</span>

					<input
						type="file"
						accept=".xlsx,.xls,.csv"
						onChange={handleFileUpload}
						className="hidden"
					/>
				</label>

				{filasConError > 0 && (
					<button
						onClick={descargarErroresExcel}
						className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
					>
						Descargar filas con errores
					</button>
				)}



				<div className="w-[80%] mx-auto">
					<select
						name="selectedMensaje"
						className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						onChange={(e) => setMensajeSeleccionado(e.target.value)}
					>
						<option value="">Seleccione un mensaje</option>
						{Object.values(Textos).map((texto) => (
							<option key={texto.id} value={texto.id}>
								{`${texto.id} - ${texto.mensaje}`}
							</option>
						))}
					</select>
				</div>

				{/* EJEMPLO */}
				{mensajeSeleccionado && (
					<div className="w-[80%] mx-auto mt-6">
						<label className="block font-semibold mb-2 text-gray-700">
							Ejemplo
						</label>

						{mensajeActual && (
							<div className="p-4 border rounded-md bg-gray-50 text-gray-800">
								{generarMensajeFinal(mensajeActual.mensaje, {
									nombre: "Daniel Torres",
									dia: 15,
									mes: "febrero",
									diasMora: 7
								})}
							</div>
						)}

					</div>
				)}

				{registros.length > 0 && (
					<>
						{/* CONTADORES */}
						<div className="mt-6 flex gap-6 font-medium">
							<span>Total filas: {totalFilas}</span>
							<span className="text-red-600">
								Filas con error: {filasConError}
							</span>
						</div>

						<div className="mt-4 overflow-x-auto">
							<table className="min-w-full border border-gray-300 text-sm">
								<thead className="bg-gray-100">
									<tr>
										<th className="border p-2">Celular</th>
										<th className="border p-2">Nombre</th>
										<th className="border p-2">Mensaje generado</th>
										<th className="border p-2">Errores</th>
										<th className="border p-2">Acción</th>
									</tr>
								</thead>

								<tbody>
									{filasConEstado.map((fila, index) => {
										const mensajeFinal = mensajeActual
											? generarMensajeFinal(mensajeActual.mensaje, fila)
											: "";

										return (
											<tr
												key={index}
												className={`hover:bg-red-400 ${!fila.esValida ? "bg-red-100" : ""
													}`}
											>
												<td className="border p-2">{fila.celular}</td>
												<td className="border p-2">{fila.nombre || "-"}</td>
												<td className="border p-2">{mensajeFinal}</td>
												<td className="border p-2 text-red-600 text-xs">
													{!fila.esValida &&
														fila.faltantes.map((f) => (
															<div key={f}>Falta: {f}</div>
														))}
												</td>
												<td className="border p-2 text-center">
													<button
														onClick={() =>
															setRegistros(registros.filter((_, i) => i !== index))
														}
														className="text-red-600 hover:text-red-800"
													>
														Eliminar
													</button>
												</td>

											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					</>
				)}

				{/* Botón de envío */}
				<div className="flex justify-end mt-6">
					<button
						onClick={enviarCampana}
						className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md font-medium flex items-center justify-center min-w-32"
					>
						<span>Enviar Mensajes</span>
					</button>
				</div>



			</div>

		</>
	)
}

{ /*
	Subir un CSV o Excel
		Un solo formato o formato dependiendo del mensaje? 
		Ningun campo vacio

	Leer filas
		parsear datos
		reemplazar (x)
		Mostrar una tabla

	validaciones
		Que no haya ningun campo vacio 
		que haya un excel 
	
	*/ }