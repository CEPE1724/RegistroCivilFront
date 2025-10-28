import { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';
import { useParams } from 'react-router-dom';
import { useSnackbar } from "notistack";
import { APIURL } from "../../configApi/apiConfig";
import axios from "../../configApi/axiosConfig";
import { FaLocationDot } from "react-icons/fa6";

const containerStyle = {
    width: '90%',
    height: '90vh',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
    position: 'relative',
};

const MapPantalla = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { bodega = 0, cedula = '', tipo = '', codigoEntrega = '' } = useParams();
    const googleMapsApiKey = "AIzaSyDSFUJHYlz1cpaWs2EIkelXeMaUY0YqWag";

    const [coordenadas, setCoordenadas] = useState(null);
    const [center, setCenter] = useState({ lat: -0.1807, lng: -78.4678 });
    const [cliente, setCliente] = useState();
    const autocompleteRef = useRef(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    const ubicacionActual = { lat: latitude, lng: longitude };
                    setCenter(ubicacionActual);
                    setCoordenadas(ubicacionActual);
                },
                (err) => {
                    console.warn("No se pudo obtener la ubicación actual:", err);
                }
            );
        }
    }, []);

    useEffect(() => {
        if (!cedula) return;
        fetchCliente(cedula);
    }, []);

    const handleMyLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    const ubicacionActual = { lat: latitude, lng: longitude };
                    setCenter(ubicacionActual);
                    setCoordenadas(ubicacionActual);
                },
                (err) => {
                    enqueueSnackbar("No se pudo obtener tu ubicación ❌", { variant: "error" });
                    console.warn("Error obteniendo ubicación:", err);
                }
            );
        } else {
            enqueueSnackbar("Tu navegador no soporta geolocalización 😢", { variant: "warning" });
        }
    };


    // --- Extracción desde texto o URL ---
    const extractLatLngFromUrl = (text) => {
        const regex = /maps\.google\.com\/\?q=(-?\d+\.\d+),(-?\d+\.\d+)/;
        const match = text.match(regex);
        if (match) return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
        return null;
    };

    const extractLatLngFromDecimal = (text) => {
        const regex = /(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)/;
        const match = text.match(regex);
        if (match) return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
        return null;
    };

    const extractLatLngFromDMS = (text) => {
        const dmsRegex = /([\d.]+)[°º]\s*(\d+)[']\s*([\d.]+)[\"]?([NSns])\s+([\d.]+)[°º]\s*(\d+)[']\s*([\d.]+)[\"]?([EWew])/;
        const match = text.match(dmsRegex);
        if (!match) return null;
        let lat = parseFloat(match[1]) + parseFloat(match[2]) / 60 + parseFloat(match[3]) / 3600;
        let lng = parseFloat(match[5]) + parseFloat(match[6]) / 60 + parseFloat(match[7]) / 3600;
        if (match[4].toUpperCase() === 'S') lat = -lat;
        if (match[8].toUpperCase() === 'W') lng = -lng;
        return { lat, lng };
    };

    const updateAddressFromLatLng = async (lat, lng) => {
        try {
            const { data } = await axios.get(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${googleMapsApiKey}`
            );
            if (data.results && data.results.length > 0) {
                setCoordenadas((prev) => ({
                    ...prev,
                    address: data.results[0].formatted_address,
                }));
            }
        } catch (error) {
            console.error("Error obteniendo dirección desde coordenadas:", error);
        }
    };

    // --- Funciones de Autocomplete ---
    const handleAutocompleteLoad = (autocomplete) => {
        autocompleteRef.current = autocomplete;
    };

    const handlePlaceChanged = () => {
        const place = autocompleteRef.current?.getPlace();
        if (!place?.geometry) return;

        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const newCoords = { lat, lng };

        setCoordenadas(newCoords);
        setCenter(newCoords);
        updateAddressFromLatLng(lat, lng);
    };

    const handleSearchInputChange = async (e) => {
        const value = e.target.value;
        let coords = extractLatLngFromUrl(value) || extractLatLngFromDMS(value) || extractLatLngFromDecimal(value);

        if (coords) {
            setCoordenadas(coords);
            setCenter(coords);
            await updateAddressFromLatLng(coords.lat, coords.lng);
        }
    };

    // --- Mapa y Guardado ---
    const handleMapClick = (event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        const nuevaCoord = { lat, lng };
        setCoordenadas(nuevaCoord);
        setCenter(nuevaCoord);
    };

    const fetchCliente = async (cedula) => {
        try {
            const url = APIURL.getCliente(cedula);
            const response = await axios.get(url);
            if (response.status === 200) setCliente(response.data.data);
        } catch (error) {
            console.error("Error obteniendo cliente:", error);
        }
    };

    const fetchGeoReferencia = async () => {

        if (!coordenadas?.lat || !coordenadas?.lng) {
            enqueueSnackbar("Selecciona una coordenada antes de guardar.", { variant: "warning" });
            return;
        }
        try {
            const url = APIURL.postGeoreferenciaEntregaDomicilio();
            await axios.post(url, {
                Bodega: Number(bodega),
                cedula,
                tipo,
                idCompra: 0,
                Latitud: coordenadas.lat,
                Longitud: coordenadas.lng,
                codigoEntrega: codigoEntrega
            });
            enqueueSnackbar("Coordenadas guardadas correctamente.", { variant: "success" });
        } catch (error) {
            enqueueSnackbar("Error al guardar las coordenadas.", { variant: "error" });
            console.error("Error al guardar las coordenadas.", error);
        }
    };

    const handleSave = () => {
        if (!coordenadas) return alert('No has seleccionado ninguna coordenada.');
        setShowConfirmModal(true); // Abrir modal
    };

    const handleConfirmSave = () => {
        setShowConfirmModal(false);
        fetchGeoReferencia(); // Llamamos a tu función existente de guardado
        // REDIRECCIONAR Y BORRAR EL HISTORIAL DIRIGUE A POINT.COM.EC

        window.location.href = "https://point.com.ec";


    };

    const handleCancelSave = () => {
        setShowConfirmModal(false);
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const floatVal = parseFloat(value);
        if (!isNaN(floatVal)) {
            const nuevaCoord = { ...coordenadas, [name]: floatVal };
            setCoordenadas(nuevaCoord);
            setCenter(nuevaCoord);
        }
    };

    const ConfirmSaveModal = ({ open, onConfirm, onCancel }) => {
        if (!open) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
                    <h2 className="text-xl font-bold mb-6 text-gray-800">
                        ¿Está seguro de guardar la ubicación?
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Esta acción guardará la coordenada seleccionada.
                        Asegúrate de que sea la correcta.
                    </p>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={onConfirm}
                            className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition duration-200"
                        >
                            Sí, guardar
                        </button>
                        <button
                            onClick={onCancel}
                            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition duration-200"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        );
    };



    return (
        <div style={{ padding: '20px' }}>
            <div className="max-w-3xl mx-auto mb-8 p-6 bg-white rounded-2xl shadow-md border border-gray-200">
                <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-4">
                    Ubicación Georreferenciada 🗺️
                </h1>
                <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-4">
                    {tipo}
                </h1>
                <p className="text-gray-700 text-lg mb-4">
                    Hola <span className="font-semibold">{cliente?.Nombre}</span> con CI. <span className="font-semibold">{cliente?.Ruc}</span> 😀
                </p>
                <p className="text-gray-700 text-lg">
                    Esta es la ubicación a la que enviaremos tus productos.
                    <span className="font-semibold text-green-600"> Por favor, verifica que sea la dirección correcta.</span> 😎
                </p>
                {coordenadas && (
                    <button
                        onClick={handleSave}
                        style={{
                            height: '45px',
                            padding: '10px 20px',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        Guardar Coordenadas
                    </button>
                )}
            </div>

            <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={['places']}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={center}
                        zoom={15}
                        onClick={handleMapClick}
                    >
                        {coordenadas && <Marker position={coordenadas} />}

                        <div
                            onClick={handleMyLocation}
                            style={{
                                position: 'absolute',
                                bottom: '160px',
                                right: '8px',
                                backgroundColor: 'white',
                                borderRadius: '50%',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                                width: '45px',
                                height: '45px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                zIndex: 5,
                                transition: 'all 0.2s ease-in-out',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                        >
                            <FaLocationDot style={{ color: 'red', fontSize: 27 }} />
                            {/* <span role="img" aria-label="Mi ubicación" style={{ fontSize: '22px' }}>
								📍
							</span> */}
                        </div>

                        {/* Buscador dentro del mapa */}
                        <div style={{
                            position: 'absolute',
                            top: '20px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            zIndex: 10,
                            width: '60%',
                        }}>
                            <Autocomplete
                                onLoad={handleAutocompleteLoad}
                                onPlaceChanged={handlePlaceChanged}
                            >
                                <input
                                    type="text"
                                    placeholder="Buscar dirección o pegar enlace de Google Maps..."
                                    onChange={handleSearchInputChange}
                                    style={{
                                        width: '100%',
                                        padding: '10px 15px',
                                        borderRadius: '5px',
                                        border: '1px solid #ccc',
                                        fontSize: '16px',
                                        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                                    }}
                                />
                            </Autocomplete>
                        </div>
                    </GoogleMap>
                </div>
            </LoadScript>

            {/* Panel debajo del mapa */}
            {coordenadas && (
                <div style={{
                    marginTop: '20px',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '20px',
                    alignItems: 'flex-end',
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <label>
                            Latitud:
                            <input
                                type="number"
                                name="lat"
                                value={coordenadas.lat}
                                onChange={handleInputChange}
                                step="0.000001"
                                style={{ width: '250px', padding: '6px' }}
                            />
                        </label>
                        <label>
                            Longitud:
                            <input
                                type="number"
                                name="lng"
                                value={coordenadas.lng}
                                onChange={handleInputChange}
                                step="0.000001"
                                style={{ width: '250px', padding: '6px' }}
                            />
                        </label>
                    </div>


                </div>
            )}
            <ConfirmSaveModal
                open={showConfirmModal}
                onConfirm={handleConfirmSave}
                onCancel={handleCancelSave}
            />

        </div>


    );
};

export default MapPantalla;
