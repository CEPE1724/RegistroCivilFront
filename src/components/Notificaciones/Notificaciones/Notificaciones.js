import { useState, useEffect, useRef } from "react";
import { X, Upload, Trash2 } from "lucide-react";
import axios from "../../../configApi/axiosConfig";
import { APIURL } from "../../../configApi/apiConfig";
import { useSnackbar } from "notistack";

export function Notificaciones() {
  const { enqueueSnackbar } = useSnackbar();
  const [tokens, setTokens] = useState([]);
  const [tokenInput, setTokenInput] = useState("");
  const [titulo, setTitulo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipo, setTipo] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [imagen, setImagen] = useState(null);
  const [imagenUrl, setImagenUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const tokenInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "titulo" || name === "mensaje") {
      if (value.length <= 255) {
        if (name === "titulo") {
          setTitulo(value);
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
    }
  };

  // Función agregar token
  const addToken = () => {
    if (tokenInput.trim() !== "") {
      setTokens([...tokens, tokenInput.trim()]);
      setTokenInput("");
      tokenInputRef.current.focus();
    }
  };

  // Función eliminar un token
  const removeToken = (indexToRemove) => {
    setTokens(tokens.filter((_, index) => index !== indexToRemove));
  };

  // Manejar la tecla Enter en el input de tokens
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

      // Asumiendo que la respuesta contiene la URL de la imagen
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
  };

  const enviarNotificacion = async () => {
    if (tokens.length === 0) {
      enqueueSnackbar("Debes agregar al menos un token.", { variant: "error" });
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

    try {
      const url = APIURL.enviarNotificacion();

      const response = await axios.post(url, {
        tokens: tokens,
        notification: {
          type: "promotion",
          title: titulo,
          body: mensaje,
          url: "",
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
        Envío de Notificaciones
      </h1>

      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {/* Tokens */}
          <div className="sm:w-full lg:col-span-3">
            <label
              htmlFor="tokens"
              className="block text-gray-700 font-semibold mb-2"
            >
              Tokens:
            </label>
            <div className="flex flex-wrap gap-2 p-2 border-2 border-gray-300 rounded-md min-h-12 mb-2">
              {tokens.map((token, index) => (
                <div
                  key={index}
                  className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
                >
                  <span className="mr-1">{token}</span>
                  <button
                    onClick={() => removeToken(index)}
                    className="text-blue-600 hover:text-blue-800 focus:outline-none"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                ref={tokenInputRef}
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ingresa un token"
                className="flex-grow p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={addToken}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-md"
              >
                Agregar
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Tokens agregados: {tokens.length}
            </p>
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
              <option value="1">Tipo 1</option>
              <option value="2">Tipo 2</option>
              <option value="3">Tipo 3</option>
              <option value="4">Tipo 4</option>
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
