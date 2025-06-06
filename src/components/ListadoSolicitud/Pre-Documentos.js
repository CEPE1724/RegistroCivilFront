import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Checkbox, 
  IconButton,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
  Alert,
  Tooltip,
  Badge
} from '@mui/material';
import { 
  Visibility, 
  Close, 
  CheckCircle, 
  Cancel, 
  Download,
  Image as ImageIcon,
  PictureAsPdf,
  Error as ErrorIcon
} from '@mui/icons-material';
import { APIURL } from "../../configApi/apiConfig";
import axios from "../../configApi/axiosConfig";

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

    useEffect(() => {
        const fetchDocs = async () => {
            if (!idSolicitud || !open) return;
            
            setLoading(true);
            setError(null);
            
            try {
                const response = await axios.get(APIURL.get_documentosEstado(idSolicitud, 3));
                const todosDocs = response.data || [];

                // Filtrar solo los documentos que nos interesan según idTipoDocumentoWEB
                const docsFiltrados = todosDocs.filter(doc =>
                    [12, 13, 14].includes(doc.idTipoDocumentoWEB)
                ).map(doc => ({
                    id: doc.idDocumentosSolicitudWeb,
                    nombre: getTipoDocumento(doc.idTipoDocumentoWEB),
                    tipoId: doc.idTipoDocumentoWEB,
                    url: doc.RutaDocumento || '',
                    validado: false,
                    invalido: false,
                    fechaSubida: doc.FechaSubida,
                    usuario: doc.Usuario
                }));

                setEstadoDocs(docsFiltrados);
            } catch (error) {
                console.error("Error al obtener los documentos:", error);
                setError("Error al cargar los documentos. Por favor, intente nuevamente.");
            } finally {
                setLoading(false);
            }
        };

        fetchDocs();
    }, [idSolicitud, open]);

    const handleCheck = (index) => {
        const newDocs = [...estadoDocs];
        newDocs[index].validado = !newDocs[index].validado;
        if (newDocs[index].validado) {
            newDocs[index].invalido = false; // Si se valida, no puede estar inválido
        }
        setEstadoDocs(newDocs);
    };

    const marcarInvalido = (index) => {
        const newDocs = [...estadoDocs];
        newDocs[index].invalido = !newDocs[index].invalido;
        if (newDocs[index].invalido) {
            newDocs[index].validado = false; // Si se marca inválido, no puede estar validado
        }
        setEstadoDocs(newDocs);
    };

    // Función corregida para manejar la previsualización
    const handlePreview = async (url, tipoId) => {
        if (!url) return;
        
        console.log('Abriendo preview para:', url, 'Tipo:', tipoId);
        
        setPreviewLoading(true);
        setPreviewError(false);
        setImagenPreview(url);
        setCurrentDocType(tipoId); // Guardar el tipo de documento
        
        // Simular carga del preview
        setTimeout(() => {
            setPreviewLoading(false);
        }, 500);
    };

    const closePreview = () => {
        setImagenPreview(null);
        setPreviewError(false);
        setPreviewLoading(false);
        setCurrentDocType(null);
    };

    const handleImageError = () => {
        setPreviewError(true);
        setPreviewLoading(false);
    };

    const getFileType = (url, tipoId) => {
        if (!url) return 'unknown';
        
        // Lógica específica por tipo de documento
        if (tipoId === 12) return 'image'; // Foto del Cliente
        if (tipoId === 13) return 'image'; // Croquis
        if (tipoId === 14) return 'image'; // Servicio Básico (generalmente es imagen)
        
        // Fallback: detectar por extensión
        const extension = url.split('.').pop()?.toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) return 'image';
        if (extension === 'pdf') return 'pdf';
        return 'unknown';
    };

    const getStatusColor = (doc) => {
        if (doc.invalido) return 'error';
        if (doc.validado) return 'success';
        return 'default';
    };

    const getStatusIcon = (doc) => {
        if (doc.invalido) return <Cancel color="error" />;
        if (doc.validado) return <CheckCircle color="success" />;
        return null;
    };

    const continuarHabilitado = estadoDocs.length > 0 && estadoDocs.every(doc => !doc.invalido);
    const documentosValidados = estadoDocs.filter(doc => doc.validado).length;
    const documentosInvalidos = estadoDocs.filter(doc => doc.invalido).length;

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
                                label={`${documentosValidados} validados`} 
                                color="success" 
                                variant="outlined" 
                                size="small"
                            />
                            {documentosInvalidos > 0 && (
                                <Chip 
                                    label={`${documentosInvalidos} inválidos`} 
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
                                    borderColor: doc.invalido ? 'error.main' : doc.validado ? 'success.main' : 'grey.300',
                                    backgroundColor: doc.invalido ? 'error.light' : doc.validado ? 'success.light' : 'transparent',
                                    opacity: doc.invalido ? 0.7 : 1
                                }}
                            >
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Box flex={1}>
                                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                                                <Typography variant="h6" component="div">
                                                    {doc.nombre}
                                                </Typography>
                                                {getStatusIcon(doc)}
                                            </Box>
                                            
                                            <Typography variant="body2" color="text.secondary">
                                                Subido: {new Date(doc.fechaSubida).toLocaleDateString()} por {doc.usuario}
                                            </Typography>
                                            
                                            <Box display="flex" alignItems="center" gap={1} mt={1}>
                                                <Chip 
                                                    icon={getFileType(doc.url, doc.tipoId) === 'pdf' ? <PictureAsPdf /> : <ImageIcon />}
                                                    label={getFileType(doc.url, doc.tipoId).toUpperCase()}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            </Box>
                                        </Box>

                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Tooltip title={doc.validado ? "Documento validado" : "Marcar como válido"}>
                                                <Checkbox
                                                    checked={doc.validado}
                                                    onChange={() => handleCheck(index)}
                                                    disabled={doc.invalido}
                                                    color="success"
                                                />
                                            </Tooltip>

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

                                            <Tooltip title={doc.invalido ? "Marcar como válido" : "Marcar como inválido"}>
                                                <IconButton 
                                                    onClick={() => marcarInvalido(index)}
                                                    color={doc.invalido ? "error" : "default"}
                                                >
                                                    <Close />
                                                </IconButton>
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
                        startIcon={<CheckCircle />}
                    >
                        Continuar ({estadoDocs.length - documentosInvalidos} documentos)
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog de Vista Previa */}
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
                        <Typography variant="h6">Vista previa del documento</Typography>
                        <IconButton onClick={closePreview} color="inherit">
                            <Close />
                        </IconButton>
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
                            {getFileType(imagenPreview, currentDocType) === 'pdf' ? (
                                <iframe
                                    src={imagenPreview}
                                    width="100%"
                                    height="100%"
                                    style={{ 
                                        border: 'none', 
                                        minHeight: '600px',
                                        borderRadius: '8px',
                                        backgroundColor: '#f5f5f5'
                                    }}
                                    title="Vista previa PDF"
                                    onLoad={() => setPreviewLoading(false)}
                                    onError={handleImageError}
                                />
                            ) : (
                                <img
                                    src={imagenPreview}
                                    alt="Vista previa"
                                    style={{ 
                                        maxHeight: '100%', 
                                        maxWidth: '100%', 
                                        objectFit: 'contain',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                        display: 'block',
                                        margin: '0 auto'
                                    }}
                                    onError={handleImageError}
                                    onLoad={() => setPreviewLoading(false)}
                                />
                            )}
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
        </>
    );
};

export default PreDocumentos;