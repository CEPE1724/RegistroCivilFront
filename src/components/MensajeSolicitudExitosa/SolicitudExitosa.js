import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import pointTriste from "../../img/pointTriste.png";

// Hook para capturar tamaño de la ventana
const useWindowSize = () => {
	const [size, setSize] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	});

	useEffect(() => {
		const handleResize = () => {
			setSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return size;
};

export const SolicitudExitosa = ({
	isOpen,
	onClose,
	titulo,
	subtitulo,
	color,
	li1,
	li2,
	li3,
	ruta,
	icono = "normal",
}) => {
	const navigate = useNavigate();
	const { width, height } = useWindowSize();
	const [mostrarConfeti, setMostrarConfeti] = useState(false);

	useEffect(() => {
		if (isOpen) {
			setMostrarConfeti(true);
			const timer = setTimeout(() => setMostrarConfeti(false), 9000); // 🎉 Dura 9 segundos
			return () => clearTimeout(timer);
		}
	}, [isOpen]);

	const handleCerrar = () => {

		
		// PRIMERO navegar si hay ruta
		if (ruta && ruta !== "") {
			navigate(ruta, { replace: true });
		} else {
			console.log('⚠️ No hay ruta para navegar');
		}
		
		// LUEGO cerrar el modal con un pequeño delay para asegurar la navegación
		setTimeout(() => {
			if (onClose) {
				onClose();
			}
		}, 100);
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center">
			{/* 🎊 Confeti sobre todo el modal LI1 SEA DIFERENTE DE VACIO O NULL */}
			{mostrarConfeti && li1 && li2 && (
				<Confetti
					width={width}
					height={height}
					numberOfPieces={300}
					recycle={false}
				/>
			)}

			<div className="relative bg-white rounded-xl shadow-lg max-w-lg w-full text-center sm:mx-0 mx-4">
				<div className="p-8">
					<button
						onClick={handleCerrar}
						className="absolute top-3 right-3 text-primaryOrange text-2xl font-bold"
					>
						×
					</button>

					<h2 className="text-xl font-bold text-black mb-4">{titulo}</h2>

					<p className="text-gray-600 text-sm">{subtitulo}</p>

					<ul className="text-black-500 text-left text-sm px-8 list-disc list-inside mt-6 space-y-1">
						{li1 && <li>{li1}</li>}
						{li2 && <li>{li2}</li>}
						{li3 && <li>{li3}</li>}
					</ul>
				</div>

				<div
					className={`${color} p-4 rounded-lg flex items-center justify-between overflow-visible relative`}
				>
					<div>
						<p className="italic text-sm text-gray-800 pl-8 text-center z-10">
							Regresa para ver el detalle de tu solicitud.
						</p>
						<p className="text-sm text-gray-800 pl-8 text-center font-bold z-10">
							¡Gracias por confiar en POINT!
						</p>
					</div>

					{icono === "normal" && (
						<img
							src="https://storage.googleapis.com/sparta_bucket/BANNER/BANN000215/1744323404172_POINTY4.png"
							alt="Mascota"
							className="w-24 h-24 -scale-x-100 flex-shrink-0 -mt-10 z-0"
						/>
					)}

					{icono === "triste" && (
						<img
							src={pointTriste}
							alt="Mascota"
							className="w-32 h-32 -scale-x-100 flex-shrink-0 -mt-10 z-0"
						/>
					)}
				</div>
			</div>
		</div>
	);
};
