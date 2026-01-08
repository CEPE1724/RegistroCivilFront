import React, { useState, useEffect } from 'react';
import axios from '../../../configApi/axiosConfig';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import DescriptionIcon from '@mui/icons-material/Description';
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import jsPDF from "jspdf";
import { APIURL } from "../../../configApi/apiConfig";
import { enqueueSnackbar } from "notistack";

export function DocumentoDescarga({ isOpen, onClose, data }) {
    const [isLoading, setIsLoading] = useState(false);
   const [pdfUrl, setPdfUrl] = useState(data?.PDFTerrena || '');
   const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_KEY;

   useEffect(() => {
    if (data?.PDFTerrena) {
        setPdfUrl(data.PDFTerrena);
    }
}, [data]);

    
    if (!isOpen) return null;

    const generarPDF = async () => {
        try {
           
            setIsLoading(true);

            const url = `https://appservices.com.ec/cobranza/api/v1/point/TerrenaGestionDomicilio/PDF/${data?.id}`;
        

            const response = await axios.get(url); // No necesitas blob, solo JSON
            if (response.data?.url) {
                setPdfUrl(response.data.url);
            } else {
                throw new Error('No se recibió URL del documento');
            }

        } catch (error) {
            console.error('Error generando PDF:', error);
            alert('No se pudo generar el PDF. Intente más tarde.');
        } finally {
            setIsLoading(false);
        }
    };

	const fetchCoordenadas = async (id) => {
		try {
			const response = await axios.get(APIURL.get_CoordenadasInforme(id));
			if (response.data && response.data.length > 0) {
				generarCroquisPDF(response.data);
			} else {
				enqueueSnackbar("No existen coordenadas.", { variant: "error",})
			}			
		} catch (error) {
			
		}
	}

	const generarCroquisPDF = (registros) => {
    const registroDomicilio = registros.find(r => r.bDomicilio && r.gestionDomicilio);
    const registroTrabajo = registros.find(r => r.bTrabajo && r.gestionTrabajo);

    const pdf = new jsPDF();
    
    const loadImage = (src) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    };

    const generatePDF = async () => {
        let currentY = 20;

        // DOMICILIO
        if (registroDomicilio) {
            const mapImageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${registroDomicilio.gestionDomicilio.Latitud},${registroDomicilio.gestionDomicilio.Longitud}&zoom=17&size=600x400&scale=2&maptype=roadmap&markers=color:red|${registroDomicilio.gestionDomicilio.Latitud},${registroDomicilio.gestionDomicilio.Longitud}&key=${GOOGLE_MAPS_API_KEY}`;
            
            // Título domicilio
            pdf.setFontSize(18);
            pdf.text("Croquis Domicilio", 80, currentY);
            currentY += 10;
            
            try {
                // Cargar imagen domicilio
                const imgDomicilio = await loadImage(mapImageUrl);
                pdf.addImage(imgDomicilio, 'JPEG', 17, currentY, 180, 120);
                currentY += 130; // Espacio después de la imagen
            } catch (error) {
                console.error("Error cargando imagen del domicilio:", error);
            }
        }

        // TRABAJO
        if (registroTrabajo) {
            const mapImageUrlTrabajo = `https://maps.googleapis.com/maps/api/staticmap?center=${registroTrabajo.gestionTrabajo.Latitud},${registroTrabajo.gestionTrabajo.Longitud}&zoom=17&size=600x400&scale=2&maptype=roadmap&markers=color:red|${registroTrabajo.gestionTrabajo.Latitud},${registroTrabajo.gestionTrabajo.Longitud}&key=${GOOGLE_MAPS_API_KEY}`;
            
            // Título trabajo
            pdf.setFontSize(18);
            pdf.text("Croquis Trabajo", 80, currentY);
            currentY += 10;
            
            try {
                // Cargar imagen trabajo
                const imgTrabajo = await loadImage(mapImageUrlTrabajo);
                pdf.addImage(imgTrabajo, 'JPEG', 17, currentY, 180, 120);
            } catch (error) {
                console.error("Error cargando imagen del trabajo:", error);
            }
        }

        // Guardar el PDF
        pdf.save('Croquis-ubicaciones.pdf');
    };

    generatePDF().catch(error => {
        console.error("Error generando PDF:", error);
    });
};

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="relative bg-white w-full max-w-md rounded-lg shadow-lg p-6 mx-4">

                <button
                    onClick={() => {
                        setPdfUrl(null);
                        onClose();
                    }}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                >
                    ✕
                </button>

                {/* Icono encabezado */}
                <div className="flex items-center justify-center mb-4">
                    <TwoWheelerIcon className="text-4xl text-[#063970]" />
                </div>

                {/* Datos del cliente */}
                <div className="mb-4 text-center">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {data?.PrimerNombre} {data?.SegundoNombre} {data?.ApellidoPaterno} {data?.ApellidoMaterno}
                    </h3>
                    <p className="text-sm text-gray-600">
                        Cédula: {data?.cedula} &bull; Solicitud: {data?.NumeroSolicitud}
                    </p>
                </div>

                {/* Tipo de verificación */}
                <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        Verificaciones realizadas
                    </h4>
                    <div className="flex items-center gap-4">
                        {/* Verificación domicilio */}
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                            <HomeIcon className="text-lg" />
                            <span>Domicilio:</span>
                            {data?.Domicilio ? (
                                <CheckCircleIcon className="text-green-600" />
                            ) : (
                                <CancelIcon className="text-gray-400" />
                            )}
                        </div>

                        {/* Verificación laboral */}
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                            <WorkIcon className="text-lg" />
                            <span>Trabajo:</span>
                            {data?.Laboral ? (
                                <CheckCircleIcon className="text-green-600" />
                            ) : (
                                <CancelIcon className="text-gray-400" />
                            )}
                        </div>
                    </div>
                </div>

                {/* Título del documento */}
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                    Informe del Motorizado
                </h2>

                {/* Descripción */}
                <p className="text-sm text-gray-600 mb-6">
                    Este informe detalla la verificación presencial realizada en el domicilio y/o lugar de trabajo del cliente, como parte del proceso de evaluación crediticia.
                    Incluye observaciones generales, validación de presencia, ubicación, y datos relevantes recopilados durante la visita.
                </p>

                {/* Contenedor del documento */}
                {/* Contenedor del documento PDF */}
                {/* Contenedor del documento PDF */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
                    <div className="p-3 bg-[#E0ECF9] text-[#063970] rounded-full">
                        <DescriptionIcon className="text-3xl" />
                    </div>
                    <div className="flex flex-col flex-1">
                        <span className="text-sm font-semibold text-gray-800">
                            motorizado-informe.pdf
                        </span>
                        {pdfUrl ? (
                            <span className="text-xs text-gray-500">Haz clic para descargar</span>
                        ) : (
                            <span className="text-xs text-gray-500">Haz clic para generar el PDF</span>
                        )}
                    </div>

                    {pdfUrl ? (
                        <a
                            href={pdfUrl}
                            download
                            className="text-white bg-[#063970] hover:bg-[#052c5e] font-medium rounded-lg text-sm px-4 py-2 transition-all"
                        >
                            Descargar
                        </a>
                    ) : (
                        <button
                            onClick={generarPDF}
                            disabled={isLoading}
                            className={`text-white ${isLoading ? 'bg-gray-400' : 'bg-yellow-500 hover:bg-yellow-600'} font-medium rounded-lg text-sm px-4 py-2 transition-all`}
                        >
                            {isLoading ? 'Generando...' : 'Generar PDF'}
                        </button>
                    )}
                </div>
				
				<div className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
					<div className="p-3 bg-[#E0ECF9] text-[#063970] rounded-full">
                        <HomeWorkIcon className="text-3xl" />
                    </div>
					<div className="flex flex-col flex-1">
                        <span className="text-sm font-semibold text-gray-800">
                            Croquis-ubicaciones.pdf
                        </span>
						<span className="text-xs text-gray-500">Haz clic para descargar el PDF</span>           
                    </div>
					<button
                        onClick={()=> {fetchCoordenadas(data?.id)}}
                        //disabled={isLoading}
                        className= "text-white bg-yellow-500 hover:bg-yellow-600 font-medium rounded-lg text-sm px-4 py-2 transition-all"
                    >
                        Descargar
                    </button>

				</div>
            </div>
        </div>
    );
}
