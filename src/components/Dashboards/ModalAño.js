import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography } from "@mui/material";
import Confetti from "react-confetti";
import { useState, useEffect } from "react";

const ModalAño = ({ openModalAño, setOpenModalAño }) => {
	const [mostrarConfeti, setMostrarConfeti] = useState(false);
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);
	const [windowHeight, setWindowHeight] = useState(window.innerHeight);
	const point = "/img/felizAño.png";

	useEffect(() => {
		const handleResize = () => {
			setWindowWidth(window.innerWidth);
			setWindowHeight(window.innerHeight);
		};
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		if (openModalAño) {
			setMostrarConfeti(true);
			const timer = setTimeout(() => setMostrarConfeti(false), 10000); // 10 segundos
			return () => clearTimeout(timer);
		}
	}, [openModalAño]);

	const mensaje = `Comienza un nuevo año y con él llegan nuevas oportunidades y experiencias.
                    Queremos agradecerte por todo lo que haces día a día. Tu esfuerzo y compromiso hacen de este equipo algo increíble. 
                    En este nuevo año te deseamos los mejor éxitos, mucha salud y felicidad. ¡Gracias por ser parte de esta familia y por todo lo que aportas!`;

	return (
		<>
			<Dialog
				open={openModalAño}
				onClose={(event, reason) => {
					if (reason === "backdropClick" || reason === "escapeKeyDown") {
						return; 
					}
					setOpenModalAño(false);
				}}
				maxWidth="md"
				fullWidth
				sx={{
					'& .MuiDialog-paper': {
						borderRadius: 16,
						background: 'linear-gradient(135deg, #FF6F00 50%, #003366 50%)',
						padding: '30px',
						boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
						position: 'relative',
						opacity: 0.95,
					},
				}}
			>
				<DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', color: '#fff'}}>
					¡Feliz Año Nuevo! 🎉
				</DialogTitle>

				<DialogContent>
					<Typography
						variant="h6"
						color="text.primary"
						sx={{
							lineHeight: 1.8,
							color: '#fff',
							whiteSpace: 'pre-line',
							textAlign: 'center',
							fontFamily: '"Roboto", sans-serif',
						}}
					>
						{mensaje}
					</Typography>
					<Box sx={{ textAlign: 'center', marginBottom: '20px' }}>
						<img
							src={point}
							alt="Feliz Año"
							style={{
								maxWidth: '100%',
								height: 'auto',
								borderRadius: '8px',
								marginBottom: '20px',
							}}
						/>
					</Box>
				</DialogContent>

				<DialogActions sx={{ justifyContent: 'center', paddingBottom: '20px' }}>
					<Button
						onClick={() => setOpenModalAño(false)}
						variant="contained"
						color="primary"
						sx={{
							padding: '10px 20px',
							borderRadius: 20,
							textTransform: 'none',
							fontWeight: 'bold',
							backgroundColor: '#ff5722',
							'&:hover': {
								backgroundColor: '#ff8a50', // Hover del botón
							},
						}}
					>
						¡Gracias! 🫂
					</Button>
				</DialogActions>
			</Dialog>

			{mostrarConfeti && (
				<Confetti
					width={windowWidth}
					height={windowHeight}
					numberOfPieces={500}
					recycle={true}
				/>
			)}
		</>
	);
};

export default ModalAño;
