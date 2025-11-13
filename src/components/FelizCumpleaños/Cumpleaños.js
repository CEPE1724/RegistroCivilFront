import React, { useState, useEffect } from 'react';
//import { Cake, Heart, Star, Trophy, TrendingUp } from 'lucide-react';
import pointPayaso from "../../img/pointPayaso.png";
import pointPastel from "../../img/pointPastel.png";
import eqSistemas from "../../img/sistemas.jpeg"


export function Cumpleaños() {
	const [mostrarBoton, setMostrarBoton] = useState(true);
	const [mostrarContenido, setMostrarContenido] = useState(false);
	const [elementos, setElementos] = useState([]);

	//cosas del fondo
	useEffect(() => {
		if (!mostrarBoton) {
			const nuevosElementos = [];
			const emojis = ['🎈', '🎉', '🎁', '🎂', '🎊', '🥳'];

			for (let i = 0; i < 20; i++) {
				nuevosElementos.push({
					id: i,
					emoji: i % 3 === 0 ? null : emojis[Math.floor(Math.random() * emojis.length)],
					imagen: i % 3 === 0 ? pointPayaso : null,
					left: Math.random() * 100,
					delay: Math.random() * 5,
					duration: 15 + Math.random() * 10,
					size: 30 + Math.random() * 40
				});
			}
			setElementos(nuevosElementos);
		}
	}, [mostrarBoton]);

	const handleClick = () => {
		setMostrarBoton(false);
		setTimeout(() => {
			setMostrarContenido(true);
		}, 300);
	};

	return (

		<div className="relative min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 overflow-hidden flex items-center justify-center">

			{/* Elementos flotantes de fondo */}
			{!mostrarBoton && elementos.map((elem) => (
				<div
					key={elem.id}
					className="absolute animate-float"
					style={{
						left: `${elem.left}%`,
						animationDelay: `${elem.delay}s`,
						animationDuration: `${elem.duration}s`,
						top: '-100px',
						fontSize: elem.emoji ? `${elem.size}px` : 'auto'
					}}
				>
					{elem.emoji ? (
						<span className="opacity-70">{elem.emoji}</span>
					) : (
						<img
							src={elem.imagen}
							alt="payaso"
							className="opacity-60"
							style={{ width: `${elem.size}px`, height: `${elem.size}px` }}
						/>
					)}
				</div>
			))}

			{/* Botón inicial */}
			{mostrarBoton && (
				<button
					onClick={handleClick}
					className="relative z-10 transform transition-all duration-300 hover:scale-110 hover:rotate-3 active:scale-95 focus:outline-none"
				>
					<img
						src={pointPayaso}
						alt="Point Payaso"
						className="w-65 h-65 md:w-56 md:h-56 drop-shadow-2xl animate-bounce"
					/>
					<div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg">
						<span className="text-sm font-semibold text-purple-600">¡Haz clic!</span>
					</div>
				</button>
			)}

			{/* Contenido principal */}
			{mostrarContenido && (
				<div className="relative z-10 max-w-6xl mx-auto px-4 animate-fadeInScale">
					{/* Título con degradado */}
					<h1
						className="text-4xl md:text-6xl lg:text-7xl font-bold text-center mb-8 animate-slideDown"
						style={{
							background: 'linear-gradient(90deg, #FF6B35 0%, #FF6B35 20%, #FF6B35 40%, #4A90E2 70%, #4A90E2 100%)',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							backgroundClip: 'text',
							filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))'
						}}
					>
						Feliz cumpleaños Ing. MARIANELA
					</h1>

					{/* Contenedor del texto y el pointy */}
					<div className="flex flex-col md:flex-row items-center justify-center gap-8 bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-5xl mx-auto animate-fadeIn">
						{/* Texto */}
						<div className="flex-1">
							<p className="text-lg md:text-xl text-gray-700 leading-relaxed text-center md:text-left">
								¡El equipo de Sistemas te desea un muy feliz cumpleaños! 🎉
								A quien guía con firmeza, cercanía y buena energía a todo el grupo de Point, esperamos que tengas un día lleno de alegría, buenos momentos y un merecido descanso entre tantos desafíos.
								¡Gracias por tu liderazgo y por inspirarnos cada día!
							</p>
							<div className="mt-6 flex justify-center md:justify-start gap-2">
								<span className="text-4xl animate-bounce" style={{ animationDelay: '0s' }}>🎉</span>
								<span className="text-4xl animate-bounce" style={{ animationDelay: '0.2s' }}>🎊</span>
								<span className="text-4xl animate-bounce" style={{ animationDelay: '0.4s' }}>🎈</span>
							</div>
						</div>

						{/* Imagen pastel */}
						<div className="flex-shrink-0 animate-scaleIn">
							<img
								src={pointPastel}
								alt="Point Pastel"
								style={{ width: "380px", height: "256px" }}
								className="w-72 h-72 md:w-80 md:h-80 rounded-2xl shadow-xl transform hover:rotate-3 transition-transform duration-300"
							/>
						</div>
					</div>

					{/* equipo sistemas :D */}
					<div className="mt-12 flex justify-center animate-fadeInUp">
						<img
							src={eqSistemas}
							alt="Equipo de Sistemas"
							className="w-full max-w-3xl rounded-2xl shadow-2xl object-cover"
						/>
					</div>
				</div>
			)}

			<style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(-100px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideDown {
          0% {
            opacity: 0;
            transform: translateY(-50px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          0% {
            opacity: 0;
            transform: scale(0.5) rotate(-10deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }

        .animate-float {
          animation: float linear infinite;
        }

        .animate-fadeInScale {
          animation: fadeInScale 0.8s ease-out forwards;
        }

        .animate-slideDown {
          animation: slideDown 0.8s ease-out forwards;
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease-out 0.4s forwards;
          opacity: 0;
        }

        .animate-scaleIn {
          animation: scaleIn 0.8s ease-out 0.6s forwards;
          opacity: 0;
        }
      `}</style>
		</div>

	)
}