import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  IconButton,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
  Alert,
  Tooltip,
  Badge,
  Snackbar
} from '@mui/material';
import { 
  Visibility, 
  Close, 
  Download,
  Image as ImageIcon,
  PictureAsPdf,
  Error as ErrorIcon
} from '@mui/icons-material';
import { APIURL } from "../../configApi/apiConfig";
import axios from "../../configApi/axiosConfig";
import { set } from 'react-hook-form';

const getTipoDocumento = (id) => {
  const documentoIds = {
    2: "Copia de Cédula",
    3: "Contrato de Compra",
    4: "Declaración",
    5: "Pagaré",
    6: "Tabla de Amortización",
    7: "Gastos de Cobranza",
    8: "Compromiso Lugar de Pago",
    9: "Acta",
    10: "Consentimiento",
    11: "Autorización",
    12: "Foto del Cliente",
    13: "Croquis",
    14: "Servicio Básico"
  };
  return documentoIds[id] || `Documento ${id}`;
};

const PreDocumentos = ({ open, onClose, onContinue, idSolicitud }) => {
    const [estadoDocs, setEstadoDocs] = useState([]);
    const [imagenPreview, setImagenPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [previewLoading, setPreviewLoading] = useState(false);
    const [previewError, setPreviewError] = useState(false);
    const [currentDocType, setCurrentDocType] = useState(null);
    const [updatingDoc, setUpdatingDoc] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
	const [ todosDocs, setTodosDocs ] = useState([]);

    useEffect(() => {
        const fetchDocs = async () => {
            if (!idSolicitud || !open) return;
            
            setLoading(true);
            setError(null);
            
            try {
                const response1 = await axios.get(APIURL.get_documentosEstado(idSolicitud, 1));
				let documentos = [];
				if(response1.data && response1.data.length > 0) {
					documentos = response1.data;
				} else {
					const response2 = await axios.get(APIURL.get_documentosEstado(idSolicitud, 3));
					documentos = response2.data || [];
				}
                // const todosDocs = response.data || [];

                // Filtrar solo los documentos que nos interesan según idTipoDocumentoWEB
                const docsFiltrados = documentos.filter(doc =>
                    [12, 13].includes(doc.idTipoDocumentoWEB)
                ).map(doc => ({
                    id: doc.idDocumentosSolicitudWeb,
                    nombre: getTipoDocumento(doc.idTipoDocumentoWEB),
                    tipoId: doc.idTipoDocumentoWEB,
                    url: doc.RutaDocumento || '',
                    tieneX: false, // Cambiar de validado/invalido a tieneX
                    fechaSubida: doc.FechaSubida,
                    usuario: doc.Usuario,
                    estadoOriginal: doc.idEstadoDocumento || 3 // Guardar el estado original
                }));
				setTodosDocs(docsFiltrados);
                setEstadoDocs(docsFiltrados);
            } catch (error) {
                console.error("Error al obtener los documentos:", error);
                setError("Error al cargar los documentos. Por favor, intente nuevamente.");
                showSnackbar("Error al cargar los documentos", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchDocs();
    }, [idSolicitud, open]);

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    // Función para actualizar el estado del documento en la API
    // const updateDocumentStatus = async (docId, newStatus) => {
    //     try {
    //         setUpdatingDoc(docId);
            
    //         if (newStatus === 6) {
    //             // Documento rechazado/cancelado
    //             await axios.patch(APIURL.patch_documentos(docId), {
    //                 idEstadoDocumento: 5
    //             });
    //             showSnackbar("Documento rechazado", "warning");
    //         } else if (newStatus === 3) {
    //             // Documento aceptado
    //             await axios.patch(APIURL.patch_documentos(docId), {
    //                 idEstadoDocumento: 3
    //             });
    //             showSnackbar(" removida del documento", "success");
    //         }
            
    //         return true;
    //     } catch (error) {
    //         console.error("Error al actualizar el estado del documento:", error);
    //         showSnackbar("Error al actualizar el documento", "error");
    //         return false;
    //     } finally {
    //         setUpdatingDoc(null);
    //     }
    // };

    // Cambiar función para manejar las X
    const handleToggleX = async (index) => {
        const doc = estadoDocs[index];
        const newTieneX = !doc.tieneX;
        
        // Actualizar estado local primero para UX inmediata
        const newDocs = [...estadoDocs];
        newDocs[index].tieneX = newTieneX;
        setEstadoDocs(newDocs);

        // Llamar a la API según el nuevo estado
        const newStatus = newTieneX ? 5 : 3; // 6 para rechazado, 3 para aceptado
        // const success = await updateDocumentStatus(doc.id, newStatus);
        
        // if (!success) {
        //     // Revertir cambio si falló la API
        //     const revertDocs = [...estadoDocs];
        //     revertDocs[index].tieneX = !newTieneX;
        //     setEstadoDocs(revertDocs);
        // }
    };

    // Función mejorada para manejar la previsualización
    const handlePreview = async (url, tipoId) => {
        if (!url) {
            console.error('❌ URL vacía o undefined');
            return;
        }
        
        //console.log('🔍 Abriendo preview para:', url, 'Tipo:', tipoId);
        
        setPreviewLoading(true);
        setPreviewError(false);
        
        // Construir URL completa si es necesario
        let fullUrl = url;
        if (!url.startsWith('http')) {
            // Ajusta esta línea según tu configuración de API
            fullUrl = url.startsWith('/') ? `${window.location.origin}${url}` : url;
        }
        
        //console.log('🌐 URL final:', fullUrl);
        
        setImagenPreview(fullUrl);
        setCurrentDocType(tipoId);
        
        // Simular carga mínima
        setTimeout(() => {
            setPreviewLoading(false);
        }, 300);
    };

    const closePreview = () => {
        setImagenPreview(null);
        setPreviewError(false);
        setPreviewLoading(false);
        setCurrentDocType(null);
    };

    const handleImageError = () => {
        console.error('❌ Error al cargar el archivo');
        setPreviewError(true);
        setPreviewLoading(false);
    };

    const getFileType = (url, tipoId) => {
        // FORZAR TODO COMO PDF - YA NO MÁS PROBLEMAS
        return 'pdf';
    };

    const getStatusColor = (doc) => {
        if (doc.tieneX) return 'error';
        return 'default';
    };

    // Validación modificada: botón "Aceptar" se deshabilita si algún documento tiene X
    const hayDocumentosConX = estadoDocs.some(doc => doc.tieneX);
    const continuarHabilitado = estadoDocs.length > 0 && !hayDocumentosConX;
    const documentosConX = estadoDocs.filter(doc => doc.tieneX).length;

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" component="div">
                            Validar Documentos Previos
                        </Typography>
                        <Box display="flex" gap={1}>
                            <Chip 
                                label={`${estadoDocs.length - documentosConX}/${estadoDocs.length} sin X`} 
                                color={!hayDocumentosConX ? "success" : "default"} 
                                variant="outlined" 
                                size="small"
                            />
                            {documentosConX > 0 && (
                                <Chip 
                                    label={`${documentosConX} con X`} 
                                    color="error" 
                                    variant="outlined" 
                                    size="small"
                                />
                            )}
                        </Box>
                    </Box>
                </DialogTitle>
                
                <DialogContent dividers>
                    {loading && (
                        <Box sx={{ width: '100%', mb: 2 }}>
                            <LinearProgress />
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Cargando documentos...
                            </Typography>
                        </Box>
                    )}

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {hayDocumentosConX && estadoDocs.length > 0 && (
                        <Alert severity="warning" sx={{ mb: 2 }}>
                            Hay documentos marcados con X. Para continuar, debe remover todas las X.
                        </Alert>
                    )}

                    {!loading && estadoDocs.length === 0 && !error && (
                        <Alert severity="info">
                            No se encontraron documentos para validar.
                        </Alert>
                    )}

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {estadoDocs.map((doc, index) => (
                            <Card 
                                key={doc.id || index} 
                                variant="outlined"
                                sx={{
                                    borderColor: doc.tieneX ? 'error.main' : 'grey.300',
                                    backgroundColor: doc.tieneX ? 'error.light' : 'transparent',
                                    opacity: doc.tieneX ? 0.7 : 1,
                                    position: 'relative'
                                }}
                            >
                                {updatingDoc === doc.id && (
                                    <LinearProgress 
                                        sx={{ 
                                            position: 'absolute', 
                                            top: 0, 
                                            left: 0, 
                                            right: 0,
                                            borderRadius: '4px 4px 0 0'
                                        }} 
                                    />
                                )}
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Box flex={1}>
                                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                                                <Typography variant="h6" component="div">
                                                    {doc.nombre}
                                                </Typography>
                                                {doc.tieneX && (
                                                    <Chip 
                                                        label="X" 
                                                        color="error" 
                                                        size="small"
                                                        sx={{ fontWeight: 'bold' }}
                                                    />
                                                )}
                                                {updatingDoc === doc.id && (
                                                    <Chip 
                                                        label="Actualizando..." 
                                                        size="small" 
                                                        color="primary"
                                                        variant="outlined"
                                                    />
                                                )}
                                            </Box>
                                            
                                            <Typography variant="body2" color="text.secondary">
                                                Subido: {new Date(doc.fechaSubida).toLocaleDateString()} por {doc.usuario}
                                            </Typography>
                                            
                                            <Box display="flex" alignItems="center" gap={1} mt={1}>
                                                <Chip 
                                                    icon={<PictureAsPdf />}
                                                    label="PDF"
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            </Box>
                                        </Box>

                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Tooltip title="Vista previa">
                                                <span>
                                                    <IconButton 
                                                        onClick={() => handlePreview(doc.url, doc.tipoId)} 
                                                        disabled={!doc.url}
                                                        color="primary"
                                                    >
                                                        <Visibility />
                                                    </IconButton>
                                                </span>
                                            </Tooltip>

                                            <Tooltip title="Descargar">
                                                <span>
                                                    <IconButton 
                                                        component="a"
                                                        href={doc.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        disabled={!doc.url}
                                                        color="info"
                                                    >
                                                        <Download />
                                                    </IconButton>
                                                </span>
                                            </Tooltip>

                                            <Tooltip title={doc.tieneX ? "Remover X" : "Marcar con X"}>
                                                <span>
                                                    <IconButton 
                                                        onClick={() => handleToggleX(index)}
                                                        color={doc.tieneX ? "error" : "default"}
                                                        disabled={updatingDoc === doc.id}
                                                        sx={{
                                                            backgroundColor: doc.tieneX ? 'error.main' : 'transparent',
                                                            color: doc.tieneX ? 'white' : 'inherit',
                                                            '&:hover': {
                                                                backgroundColor: doc.tieneX ? 'error.dark' : 'rgba(0, 0, 0, 0.04)'
                                                            }
                                                        }}
                                                    >
                                                        <Close />
                                                    </IconButton>
                                                </span>
                                            </Tooltip>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose} color="inherit">
                        Cancelar
                    </Button>
                    <Button
                        onClick={onContinue}
                        disabled={!continuarHabilitado}
                        variant="contained"
                        color="primary"
                    >
                        {hayDocumentosConX 
                            ? `Aceptar (${documentosConX} )` 
                            : `Aceptar (${estadoDocs.length})`
                        }
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog de Vista Previa - CORREGIDO CON OBJECT */}
            <Dialog
                open={Boolean(imagenPreview)}
                onClose={closePreview}
                maxWidth="lg"
                fullWidth
                PaperProps={{
                    sx: { height: '90vh' }
                }}
            >
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">
                            Vista previa del documento
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Chip 
                                label="PDF"
                                size="small"
                                variant="outlined"
                            />
                            <IconButton onClick={closePreview} color="inherit">
                                <Close />
                            </IconButton>
                        </Box>
                    </Box>
                </DialogTitle>
                
                <DialogContent 
                    dividers 
                    sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        p: 2
                    }}
                >
                    {previewLoading && (
                        <Box textAlign="center">
                            <LinearProgress sx={{ mb: 2, width: 200 }} />
                            <Typography variant="body2" color="text.secondary">
                                Cargando vista previa...
                            </Typography>
                        </Box>
                    )}

                    {previewError && (
                        <Box textAlign="center">
                            <ErrorIcon color="error" sx={{ fontSize: 64, mb: 2 }} />
                            <Typography variant="h6" color="error" gutterBottom>
                                Error al cargar el documento
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                No se pudo cargar la vista previa del documento.
                            </Typography>
                            <Button 
                                variant="outlined" 
                                href={imagenPreview} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                startIcon={<Download />}
                            >
                                Descargar archivo
                            </Button>
                        </Box>
                    )}

                    {imagenPreview && !previewLoading && !previewError && (
                        <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
                            {/* SIEMPRE MOSTRAR COMO PDF */}
                            <Box sx={{ 
                                width: '100%', 
                                height: '100%', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center' 
                            }}>
                                <object
                                    data={imagenPreview}
                                    type="application/pdf"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        minHeight: '600px',
                                        borderRadius: '8px',
                                        backgroundColor: '#f5f5f5'
                                    }}
                                    aria-label="Vista previa PDF"
                                >
                                    <Box sx={{ textAlign: 'center', p: 4 }}>
                                        <ErrorIcon color="warning" sx={{ fontSize: 64, mb: 2 }} />
                                        <Typography variant="h6" gutterBottom>
                                            Vista previa no disponible
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                            No se puede mostrar el archivo en el navegador.
                                        </Typography>
                                        <Button 
                                            variant="contained" 
                                            href={imagenPreview} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            startIcon={<Download />}
                                        >
                                            Abrir en nueva pestaña
                                        </Button>
                                    </Box>
                                </object>
                            </Box>
                        </Box>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button 
                        href={imagenPreview} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        startIcon={<Download />}
                        color="primary"
                    >
                        Descargar
                    </Button>
                    <Button onClick={closePreview} variant="contained">
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar para notificaciones */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default PreDocumentos;