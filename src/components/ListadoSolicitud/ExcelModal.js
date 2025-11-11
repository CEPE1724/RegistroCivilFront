import { Dialog, Typography, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material"
import { useState } from "react"
import { APIURL } from "../../configApi/apiConfig";
import axios from "../../configApi/axiosConfig";
import { Loader } from "../Utils/Loader/Loader";
import { enqueueSnackbar } from "notistack";

const ExcelModal = ({ open, onClose, bodegas }) => {
	const [bodega, setBodega] = useState(null)
	const [fechaInicio, setFechaInicio] = useState(null)
	const [fechaHasta, setFechaHasta] = useState(null)
	const [loadingVerificacion, setLoadingVerificacion] = useState(false);

	const fetchCrearExcel = async ({ BodegaId, FechaDesde, FechaHasta }) => {
		try {
			setLoadingVerificacion(true);
			enqueueSnackbar("Construyendo Reporte 👨‍💻...", { variant: "warning", });

			const response = await axios.get(APIURL.get_excelSolicitudWeb({
				BodegaId: BodegaId !== undefined ? BodegaId : bodega,
				FechaDesde: FechaDesde !== undefined ? FechaDesde : fechaInicio,
				FechaHasta: FechaHasta !== undefined ? FechaHasta : fechaHasta
			}), {
				responseType: 'blob',
			});

			// Crear un objeto URL para el blob recibido
			const blob = new Blob([response.data], {
				type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			});

			const downloadUrl = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = downloadUrl;
			link.download = 'reporte_solicitudesWeb.xlsx';
			document.body.appendChild(link);
			link.click();
			link.remove();

			if (response) {
				enqueueSnackbar("Reporte creado.", { variant: "success", });
			}

		} catch (error) {
			console.error("Error al generar el Excel:", error);
			enqueueSnackbar("Error al generar el reporte.", { variant: "error" });
			return null;
		} finally {
			setLoadingVerificacion(false);
		}
	}

	return (
		<>
			<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
				<DialogTitle>Informe Solicitudes 📊</DialogTitle>

				<DialogContent>
					<div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
						<Button onClick={() => {
							fetchCrearExcel({ BodegaId: null, FechaDesde: null, FechaHasta: null });
						}} color="success" variant="contained" sx={{ width: '45%' }} >
							Informe Completo
						</Button>
						{loadingVerificacion && <Loader />}
					</div>
					<Typography sx={{ mb: 2 }}>
						Filtros:
					</Typography>
					<div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
						<Button onClick={fetchCrearExcel} color="success" variant="contained" sx={{ width: '45%' }} >
							Informe con filtros
						</Button>
						{loadingVerificacion && <Loader />}
					</div>
					<FormControl fullWidth>
						<InputLabel>Bodegas</InputLabel>
						<Select
							value={bodega || ""}
							onChange={(e) => setBodega(e.target.value)}
							label='Bodegas'>
							<MenuItem value="Ninguna">Ninguna</MenuItem>
							{bodegas.map((bodega) => (
								<MenuItem key={bodega.value} value={bodega.value}>
									{bodega.label}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<TextField
						label="Fecha desde"
						type="date"
						fullWidth
						margin="normal"
						slotProps={{
							inputLabel: { shrink: true }
						}}
						value={fechaInicio || ""}
						onChange={(e) => {
							const value = e.target.value;
							setFechaInicio(value);
						}}
					/>
					<TextField
						label="Fecha hasta"
						type="date"
						fullWidth
						margin="normal"
						slotProps={{
							inputLabel: { shrink: true }
						}}
						value={fechaHasta || ""}
						onChange={(e) => {
							const value = e.target.value;
							setFechaHasta(value);
						}}
					/>

				</DialogContent>
				<DialogActions>
					<Button onClick={onClose} color="primary">
						Cerrar
					</Button>
				</DialogActions>
			</Dialog>
		</>
	)
}

export default ExcelModal