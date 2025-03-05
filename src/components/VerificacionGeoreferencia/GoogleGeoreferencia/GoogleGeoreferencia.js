import React, { useState, useEffect } from 'react';

export function GoogleGeoreferencia({ isOpen, closeModal, latitude, longitude, onCoordinatesChange }) {
    const [error, setError] = useState(null);
    const [map, setMap] = useState(null);
    const [marker, setMarker] = useState(null);
    const [isMapLoaded, setIsMapLoaded] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadGoogleMaps();
        }
    }, [isOpen]);


    const loadGoogleMaps = () => {
        if (window.google) {
            return initializeMap();
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDSFUJHYlz1cpaWs2EIkelXeMaUY0YqWag&callback=initMap&libraries=places`;
        script.async = true;
        script.defer = true;

        script.onerror = () => {
            setError('No se pudo cargar Google Maps. Verifica la clave de API.');
            console.error('Error al cargar el script de Google Maps.');
        };

        document.head.appendChild(script);

        window.initMap = initializeMap;
    };

    const initializeMap = () => {
        try {
            const mapInstance = new window.google.maps.Map(document.getElementById('map'), {
                center: { lat: latitude || -0.2232523, lng: longitude || -78.5141064 },
                zoom: 15,
            });

            setMap(mapInstance);

            const initialMarker = new window.google.maps.Marker({
                position: { lat: latitude, lng: longitude },
                map: mapInstance,
                draggable: false,
                title: 'Ubicación seleccionada',
            });

            setMarker(initialMarker);

            initialMarker.addListener('dragend', () => {
                const position = initialMarker.getPosition();
                if (onCoordinatesChange) {
                    onCoordinatesChange(position.lat(), position.lng());
                }
                mapInstance.setCenter(position);
            });

            setIsMapLoaded(true);
        } catch (error) {
            setError('Error al inicializar el mapa: ' + error.message);
            console.error('Error al inicializar el mapa:', error);
        }
    };

    const handleCloseModal = () => {
        setIsMapLoaded(false);
        closeModal();
    };

    return (
        isOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="relative bg-white rounded-lg p-4 w-full sm:w-[800px]">
                    <div className="flex justify-end">
                        <button
                            className="p-2 bg-red-500 text-white rounded-full"
                            onClick={handleCloseModal}
                        >
                            X
                        </button>
                    </div>
                    <div id="map" className="w-full h-[500px] mb-4"></div>
                    {error && <div className="absolute top-0 left-0 bg-red-500 text-white p-2">{error}</div>}
                    {isMapLoaded && !error && (
                        <div className="mt-2 text-center text-green-500">Mapa cargado correctamente</div>
                    )}
                </div>
            </div>

        )
    );
}
