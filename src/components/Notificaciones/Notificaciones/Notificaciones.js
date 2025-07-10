import { useState, useEffect, useRef } from "react";
import { X, Upload, Trash2 } from "lucide-react";
import axios from "../../../configApi/axiosConfig";
import { APIURL } from "../../../configApi/apiConfig";
import { useSnackbar } from "notistack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { IconButton } from "@mui/material";

export function Notificaciones() {
  const { enqueueSnackbar } = useSnackbar();
  const [tokens, setTokens] = useState([]);
  const [selectedTokenExpo, setSelectedTokenExpo] = useState("");
  const [titulo, setTitulo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipo, setTipo] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [imagen, setImagen] = useState(null);
  const [imagenUrl, setImagenUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [view, setView] = useState(false);
  const modalRef = useRef(null);
  const [disponibleUsuarios, setDisponibleUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [ roles, setRoles ] = useState([]);
  const gruposUnicos = [...new Set(disponibleUsuarios.map(usuario => usuario.idGrupo.idGrupo).filter(id => id !== undefined && id !== null && id !== '' && id !== 36))].sort((a, b) => a - b);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "titulo" || name === "mensaje") {
      if (value.length <= 255) {
        if (name === "titulo") {
          setTitulo(value.toUpperCase());
        } else if (name === "mensaje") {
          setMensaje(value);
        }
      } else {
        alert(`El campo ${name} no puede exceder los 255 caracteres`);
      }
    } else if (name === "tipo") {
      setTipo(value);
    } else if (name === "empresa") {
      setEmpresa(value);
      // Limpiar tokens
      setTokens([]);
      setDisponibleUsuarios([]);
      // Cargar usuarios según la empresa seleccionada
      if (value) {
        cargarUsuariosPorEmpresa(value);
      }
    } else if (name === "selectedTokenExpo") {
      setSelectedTokenExpo(value);
    }
  };

  const fetchRoles = async () => {
	try {
		const url = APIURL.getRolesWeb();
		const response = await axios.get(url);
		if (response.data) {
        setRoles(response.data);
      } else {
        enqueueSnackbar(response.data.message || "No se encontraron roles", { variant: "warning" });
        setRoles([]);
      }	
	}  catch (error) {
		  console.error("Error al cargar roles:", error);
  	}
}

useEffect(() => {
  fetchRoles();
  }, []);

  const handleGrupos = (e) => {
	const { value } = e.target;

	switch (value) {
		case "": setTokens([]); break;
		case "todos": setTokens(disponibleUsuarios); break;
		default:
			const usuariosFiltrados = disponibleUsuarios.filter(usuario => usuario?.idGrupo?.idGrupo == value);
			setTokens(usuariosFiltrados);
			break;
	}
}

  const cargarUsuariosPorEmpresa = async (empresaSeleccionada) => {
    setIsLoading(true);
    try {
      const empresaId = empresaSeleccionada === "POINT" ? 1 : 33;
      
      const url = APIURL.consultarNombresNotif(empresaId);
      
      const response = await axios.get(url);
      
      if (response.data.success) {
        setDisponibleUsuarios(response.data.data);
      } else {
        enqueueSnackbar(response.data.message || "No se encontraron usuarios", { variant: "warning" });
        setDisponibleUsuarios([]);
      }
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      enqueueSnackbar("Error al cargar usuarios.", { variant: "error" });
      setDisponibleUsuarios([]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleView = () => {
    setView(!view);
  };

  // Función agregar token
  const addToken = () => {
    if (selectedTokenExpo) {
      // Buscar el usuario seleccionado para obtener su información
      const usuarioSeleccionado = disponibleUsuarios.find(
        (usuario) => usuario.TokenExpo === selectedTokenExpo
      );
      
      if (usuarioSeleccionado) {
        // Verificar si el token ya existe en la lista
        if (!tokens.some(token => token.TokenExpo === selectedTokenExpo)) {
          setTokens([...tokens, {
            TokenExpo: selectedTokenExpo,
            nombreCompleto: usuarioSeleccionado.nombreCompleto
          }]);
        } else {
          enqueueSnackbar("Este usuario ya ha sido agregado", { variant: "warning" });
        }
        
        setSelectedTokenExpo("");
      }
    }
  };

  // Función eliminar un token
  const removeToken = (indexToRemove) => {
    setTokens(tokens.filter((_, index) => index !== indexToRemove));
  };

  // Manejar la tecla Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addToken();
    }
  };

  // Manejar el cambio de archivo
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImagen(e.target.files[0]);
    }
  };

  // Función para abrir el selector de archivos
  const handleClickUpload = () => {
    fileInputRef.current.click();
  };

  const subirImagen = async () => {
    if (!imagen) {
      enqueueSnackbar("Debes seleccionar una imagen primero.", {
        variant: "error",
      });
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", imagen);
      // Valores quemados
      formData.append("almacen", "notificacion");
      formData.append("cedula", "notificaciones-system");
      formData.append("numerosolicitud", new Date().getTime().toString());
      formData.append("Tipo", "imagenes");

      const url = APIURL.postFileupload();

      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setImagenUrl(response.data.url);
      enqueueSnackbar("Imagen subida correctamente.", { variant: "success" });
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      enqueueSnackbar("Error al subir la imagen.", { variant: "error" });
    } finally {
      setIsUploading(false);
    }
  };

  // Función para borrar la imagen
  const borrarImagen = () => {
    setImagen(null);
    setImagenUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const limpiarFormulario = () => {
    setTokens([]);
    setTitulo("");
    setMensaje("");
    setTipo("");
    setEmpresa("");
    setImagen(null);
    setImagenUrl("");
    setSelectedTokenExpo("");
    setDisponibleUsuarios([]);
  };

  const enviarNotificacion = async () => {
    if (tokens.length === 0) {
      enqueueSnackbar("Debes agregar al menos un usuario.", { variant: "error" });
      return;
    }

    if (!tipo || !titulo || !mensaje || !empresa) {
      enqueueSnackbar("Todos los campos son obligatorios.", {
        variant: "error",
      });
      return;
    }

    if (titulo.length < 5) {
      enqueueSnackbar("El título debe tener al menos 5 caracteres.", {
        variant: "error",
      });
      return;
    }

    if (mensaje.length < 5) {
      enqueueSnackbar("El mensaje debe tener al menos 5 caracteres.", {
        variant: "error",
      });
      return;
    }
	
	if (imagen && !imagenUrl) {
	  enqueueSnackbar("Debes subir la imagen antes de enviar la notificación.", {
		variant: "error",
	  });
	  return;
	}
    try {
      const url = APIURL.enviarNotificacion();

      const tokensList = tokens.map(token => token.TokenExpo);

      const response = await axios.post(url, {
        tokens: tokensList,
        notification: {
          type: tipo,
          title: titulo,
          body: mensaje,
          url: imagenUrl,
          empresa: empresa,
        },
      });
      enqueueSnackbar("Notificación enviada.", { variant: "success" });
      limpiarFormulario();
    } catch (error) {
      console.error("Error al enviar la notificación:", error);
      enqueueSnackbar("Hubo un error al enviar la notificación.", {
        variant: "error",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-6">
      <h1 className="text-3xl font-bold text-center mb-6 mt-4 text-gray-800">
       📢 Envío de Notificaciones
      </h1>

      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {/* Empresa */}
          <div className="sm:w-full">
            <label className="block text-gray-700 font-semibold mb-2">
              Empresa:
            </label>
            <select
              id="empresa"
              name="empresa"
              value={empresa}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccione uno</option>
              <option value="POINT">POINT</option>
              <option value="CREDI">CREDI</option>
            </select>
          </div>
          {/* Tipo */}
          <div className="sm:w-full">
            <label
              htmlFor="tipo"
              className="block text-gray-700 font-semibold mb-2"
            >
              Tipo:
            </label>
            <select
              id="tipo"
              name="tipo"
              value={tipo}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecciona uno</option>
              <option value="alert">ALERT</option>
              <option value="info">INFO</option>
              <option value="promotion">PROMOTION</option>
              <option value="update">UPDATE</option>
			  <option value="warning">WARNING</option>
			  <option value="success">SUCCESS</option>
			  <option value="evento">EVENTO</option>
            </select>
          </div>
          {/* Título */}
          <div className="sm:w-full">
            <label
              htmlFor="titulo"
              className="block text-gray-700 font-semibold mb-2"
            >
              Título:
            </label>
            <input
              id="titulo"
              name="titulo"
              value={titulo}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              {titulo.length}/255 caracteres (mínimo 5)
            </p>
          </div>

          {/* Tokens */}
          {empresa !== "" && (
            <div className="sm:w-full lg:col-span-3">
              <label
                htmlFor="tokens"
                className="block text-gray-700 font-semibold mb-2"
              >
                Usuarios:
              </label>
              <div className="flex flex-wrap gap-2 p-2 border-2 border-gray-300 rounded-md min-h-12 mb-2">
                {tokens.map((token, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
                  >
                    <span className="mr-1">{token.nombreCompleto}</span>
                    <button
                      onClick={() => removeToken(index)}
                      className="text-blue-600 hover:text-blue-800 focus:outline-none"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                {tokens.length === 0 && (
                  <span className="text-gray-400 p-1">
                    No se han seleccionado usuarios
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <select
                  name="selectedTokenExpo"
                  value={selectedTokenExpo}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  className="flex-grow p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading || disponibleUsuarios.length === 0}
                >
                  <option value="">
                    {isLoading
                      ? "Cargando usuarios..."
                      : disponibleUsuarios.length === 0
                      ? "No hay usuarios disponibles"
                      : "Seleccione un usuario"}
                  </option>
                  {disponibleUsuarios.map((usuario, index) => (
                    <option key={index} value={usuario.TokenExpo}>
                      {usuario.nombreCompleto || `Usuario ${index + 1}`}
                    </option>
                  ))}
                </select>
                <button
                  onClick={addToken}
                  disabled={!selectedTokenExpo}
                  className={`px-4 rounded-md ${
                    !selectedTokenExpo
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  Agregar
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Usuarios seleccionados: {tokens.length}
              </p>
			  <div className="flex gap-2 mt-10">
				<label
              	htmlFor="grupo"
              	className="block text-gray-700 font-semibold mb-2"
				>
					Enviar por grupo:
            	</label>
           		<select
           		  id="grupo"
           		  name="grupo"
				  onChange={handleGrupos}
           		  className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
           		>
					<option value="">Ninguno</option>
           		  	<option value="todos">Todos</option>
					{gruposUnicos.map((idGrupo, index) => {
						const nombreGrupo = roles.find(role => role.idRolesWeb === idGrupo)?.Nombre || `Grupo ${idGrupo}`;
						return (
    					  <option key={index} value={idGrupo}>
    					    {nombreGrupo}
    					  </option>
    					);	
					})}
           		</select>			
			  </div>
            </div>
          )}

          {/* Mensaje */}
          <div className="sm:w-full lg:col-span-3">
            <label className="block text-gray-700 font-semibold mb-2">
              Mensaje:
            </label>
            <textarea
              id="mensaje"
              name="mensaje"
              value={mensaje}
              onChange={handleChange}
              rows="3"
              className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
            <p className="text-xs text-gray-500 mt-1">
              {mensaje.length}/255 caracteres (mínimo 5)
            </p>
          </div>

          {/* Imagen */}
          <div className="sm:w-full lg:col-span-3">
            <label className="block text-gray-700 font-semibold mb-2">
              Imagen:
            </label>
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="file"
                  accept=".jpg, .png, .pdf"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  name="imagen"
                  id="imagen"
                  className="hidden"
                />

                <div className="flex-grow flex items-center border-2 border-gray-300 rounded-md p-2">
                  <span className="text-gray-500 flex-grow truncate">
                    {imagen ? imagen.name : "Ningún archivo seleccionado"}
                  </span>
                </div>

                {(imagen || imagenUrl) && (
                  <IconButton onClick={toggleView}>
                    <VisibilityIcon />
                  </IconButton>
                )}
                <button
                  type="button"
                  onClick={handleClickUpload}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md font-medium flex items-center gap-2 min-w-24"
                >
                  <Upload size={18} />
                  <span>Elegir</span>
                </button>

                <button
                  type="button"
                  onClick={borrarImagen}
                  disabled={!imagen}
                  className={`py-2 px-4 rounded-md font-medium flex items-center gap-2 min-w-24 ${
                    !imagen
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-red-100 hover:bg-red-200 text-red-600"
                  }`}
                >
                  <Trash2 size={18} />
                  <span>Borrar</span>
                </button>
              </div>

              <div className="flex items-center">
                <button
                  type="button"
                  onClick={subirImagen}
                  disabled={!imagen || isUploading || imagenUrl}
                  className={`py-2 px-4 rounded-md font-medium flex items-center gap-2 ${
                    !imagen || isUploading || imagenUrl
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  <Upload size={18} />
                  <span>
                    {isUploading
                      ? "Subiendo..."
                      : imagenUrl
                      ? "Subida completada"
                      : "Subir a la nube"}
                  </span>
                </button>
              </div>

              {view && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                  <div
                    ref={modalRef}
                    className="bg-white p-4 rounded-lg shadow-lg w-3/4 h-3/4 relative"
                  >
                    <button
                      onClick={toggleView}
                      className="absolute top-2 right-2 text-lg"
                    >
                      ❌
                    </button>
                    <iframe
                      src={imagenUrl ? imagenUrl : URL.createObjectURL(imagen)}
                      className="w-full h-full"
                      title="Vista previa del archivo"
                    ></iframe>
                  </div>
                </div>
              )}

              {/* {imagenUrl && (
                <div className="text-xs text-gray-500 mt-1 break-all">
                  <span className="font-medium">URL:</span> {imagenUrl}
                </div>
              )} */}
            </div>
          </div>
        </div>

        {/* Botón de envío */}
        <div className="flex justify-end mt-6">
          <button
            onClick={enviarNotificacion}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md font-medium flex items-center justify-center min-w-32"
          >
            <span>Enviar Notificación</span>
          </button>
        </div>
      </div>
    </div>
  );
}