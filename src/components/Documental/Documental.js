import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import { useLocation } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { IconButton } from "@mui/material";

export function Documental({ id, NumeroSolicitud, nombre, cedula, fecha, almacen, foto, vendedor, consulta }) {
  const [files, setFiles] = useState({});
  const [activeTab, setActiveTab] = useState("Buro Credito");
  const [showFileInput, setShowFileInput] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();
  const [view, setView] = useState(false);
  const [observacion, setObservacion] = useState({});


  const [clientInfo, setClientInfo] = useState({
    id: null,
    nombre: "",
    cedula: "",
    fecha: "",
    almacen: "",
    foto: "",
    NumeroSolicitud: "",
    vendedor: "",
    consulta: "",

  });
  const [filePreviews, setFilePreviews] = useState({});



  useEffect(() => {
    if (location.state) {
      // Si hay datos en `location.state`, los guardamos en localStorage
      localStorage.setItem("clientInfo", JSON.stringify(location.state));
      setClientInfo(location.state);
    } else {
      // Si no hay datos en `location.state`, intentamos recuperar de localStorage
      const savedClientInfo = localStorage.getItem("clientInfo");
      if (savedClientInfo) {
        setClientInfo(JSON.parse(savedClientInfo));
      }
    }
  }, [location.state]);
  useEffect(() => {
    // Actualiza la información del cliente cuando cambie location.state


    // Optimiza la vista previa de los archivos seleccionados
    const updatedFilePreviews = {};
    Object.keys(files).forEach((field) => {
      updatedFilePreviews[field] = files[field].map((file) => {
        if (file.type === "application/pdf") {
          // Crea URL para vista previa de archivos PDF
          return URL.createObjectURL(file);
        }
        // Si no es PDF, puede que quieras otra lógica para imágenes o diferentes tipos de archivo
        return URL.createObjectURL(file);
      });
    });

    setFilePreviews(updatedFilePreviews);

    // Cleanup: Elimina las URLs de los archivos cuando el componente se desmonte o cambie
    return () => {
      Object.values(updatedFilePreviews).forEach((previewUrls) =>
        previewUrls.forEach((url) => URL.revokeObjectURL(url))
      );
    };
  }, [location.state, files]); // Se ejecuta cuando 'location.state' o 'files' cambian

  const calculateProgress = () => {
    const totalFields = menuItems.length;
    const completedFields = menuItems.filter(
      (field) => files[field] && files[field].length > 0
    ).length;
    return (completedFields / totalFields) * 100;
  };

  const getProgressBarColor = () => {
    const progress = calculateProgress();
    if (progress < 50) return "#FF0000";
    if (progress < 80) return "#FF9800";
    return "#4CAF50";
  };

  const handleFileChange = (e, field) => {
    const selectedFiles = Array.from(e.target.files);

    // Verifica si ya hay un archivo cargado en el campo activo
    if (files[field] && files[field].length > 0) {
      // Si ya hay un archivo, muestra un mensaje de error
      enqueueSnackbar(
        `Ya tienes un archivo cargado en el campo "${field}". Primero debes eliminarlo antes de cargar uno nuevo.`,
        { variant: "error" }
      );
      return; // No permite cargar más archivos si ya existe uno
    }

    // Si no hay archivo, se puede agregar el nuevo archivo
    setFiles((prevFiles) => ({
      ...prevFiles,
      [field]: [...(prevFiles[field] || []), ...selectedFiles],
    }));
    setShowFileInput(false);
  };


  const handleRemoveFile = (field, index) => {
    setFiles((prevFiles) => {
      if (!prevFiles[field] || prevFiles[field].length === 0) return prevFiles;

      const updatedFiles = { ...prevFiles };
      updatedFiles[field] = updatedFiles[field].filter((_, i) => i !== index);

      if (updatedFiles[field].length === 0) {
        delete updatedFiles[field]; // Elimina la clave si ya no hay archivos
      }

      return updatedFiles;
    });
  };




  const toggleView = () => {
    setView(!view);
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar archivos y observación por cada sección
    if (!files[activeTab] || files[activeTab].length === 0) {
      enqueueSnackbar(
        `Por favor, selecciona un archivo para el campo ${activeTab}`,
        { variant: "error" }
      );
    } else if (!observacion[activeTab] || observacion[activeTab].length < 10) {
      enqueueSnackbar(
        "La observación debe tener al menos 10 caracteres para este campo.",
        { variant: "error" }
      );
    } else {
      // Si los datos son válidos
      enqueueSnackbar("Archivo y observación subidos correctamente.", {
        variant: "success",
      });
      setShowFileInput(false);
    }
  };

  const handleSubmitUpFile = (e) => {
    e.preventDefault();

    const inputElement = document.querySelector(`input[name="${activeTab}"]`);

    if (!inputElement || inputElement.files.length === 0) {
      enqueueSnackbar(`Por favor, selecciona un archivo para poder subirlo`, {
        variant: "error",
      });
    } else {

      enqueueSnackbar("Archivo subido correctamente.", { variant: "success" });
      setShowFileInput(false);
    }
  };

  const menuItems = [
    "Buro Credito",
    "Copia De Cedula",
    "Contrato de Compra",
    "Declaracion",
    "Pagare a la Orden",
    "Tabla de amortizacion",
    "Gastos de cobranza",
    "Compromiso Lugar de pago",
    "Acta",
    "Consentimiento",
    "Autorización",
  ];

  const completedFields = menuItems.filter(
    (field) => files[field] && files[field].length > 0
  );
  const pendingFields = menuItems.filter(
    (field) => !(files[field] && files[field].length > 0)
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div
        className={`w-64 bg-[#2d3689] text-white ${isMenuOpen ? "block" : "hidden"} md:block transition-all duration-300 ease-in-out`}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-100">Menú</h2>

          {/* Progreso de Archivos */}
          <div className="mt-6">
            <div className="relative pt-1">
              <label className="block text-sm font-semibold text-gray-300">Progreso de Archivos</label>
              <div className="flex mb-2 items-center justify-between">
                <span className="text-xs font-medium text-gray-300">
                  {Math.round(calculateProgress())}%
                </span>
              </div>
              <div className="flex mb-2">
                <div
                  className="w-full bg-gray-200 rounded-full h-2.5"
                  style={{
                    backgroundColor: getProgressBarColor(),
                    width: `${calculateProgress()}%`,
                  }}
                ></div>
              </div>
              {calculateProgress() === 100 && (
                <div className="flex justify-center mt-6">
                  <button className="bg-green-600 text-white py-2 px-6 rounded-md shadow-md hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105">
                    Funcionalidad Nueva
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Campos Pendientes */}
          <div className="mt-6">
            <h3 className="text-lg text-gray-300 font-semibold">Campos Pendientes</h3>
            <ul className="mt-4 space-y-4">
              {pendingFields.map((item) => {
                const fileCount = files[item] ? files[item].length : 0;
                return (
                  <li key={item}>
                    <a
                      href="#"
                      onClick={() => setActiveTab(item)}
                      className={`block text-gray-300 hover:text-white py-2 px-4 rounded-md transition-all duration-200 ease-in-out ${activeTab === item ? "bg-gray-700" : "hover:bg-gray-600"}`}
                    >
                      {item}
                      {fileCount > 0 && (
                        <span className="text-white px-2 ml-2 bg-green-500 rounded-full text-xs font-bold">
                          {`+${fileCount}`}
                        </span>
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Campos Completados */}
          {completedFields.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg text-gray-300 font-semibold">Campos Completados</h3>
              <ul className="mt-4 space-y-4">
                {completedFields.map((item) => {
                  const fileCount = files[item] ? files[item].length : 0;
                  return (
                    <li key={item}>
                      <a
                        href="#"
                        onClick={() => setActiveTab(item)}
                        className={`block text-gray-300 hover:text-white py-2 px-4 rounded-md transition-all duration-200 ease-in-out ${activeTab === item ? "bg-gray-700" : "hover:bg-gray-600"}`}
                      >
                        {item}
                        {fileCount > 0 && (
                          <span className="text-white px-2 ml-2 bg-green-500 rounded-full text-xs font-bold">
                            {`+${fileCount}`}
                          </span>
                        )}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>


      {/* Menu Toggle Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="fixed top-6 left-6 md:hidden bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
      >
        {isMenuOpen ? "❌" : "☰"}
      </button>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-white">
        <div className="w-full bg-white p-6 rounded-lg shadow-lg">
          <div className="mb-6">
            <div className="flex flex-col md:flex-row gap-6">
              {clientInfo.foto && (
                <div className="flex justify-center items-center md:w-1/4">
                  <img
                    src={clientInfo.foto}
                    alt="Foto del cliente"
                    className="w-80 h-80 md:w-64 md:h-64 object-cover border-4 border-gray-300 rounded-lg"
                  />
                </div>
              )}

              <div className="md:w-3/4 mt-6 pl-4 bg-white shadow-lg rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base leading-relaxed pl-10">
                  {[
                    ["Número de Solicitud", clientInfo.NumeroSolicitud],
                    ["Nombre", clientInfo.nombre],
                    ["Cédula", clientInfo.cedula],
                    ["Fecha", clientInfo.fecha],
                    ["Vendedor", clientInfo.vendedor],
                    ["Tipo de consulta", clientInfo.consulta],
                    ["Almacén", clientInfo.almacen],
                  ].map(([label, value], idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <p className="font-semibold text-gray-700">{label}:</p>
                      <p className="text-gray-500">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Documentos Subidos */}
          <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
            Documentos Subidos
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {filePreviews[activeTab]?.map((previewUrl, index) => (
              <div
                key={index}
                className="bg-gray-50 p-4 rounded-md shadow-md border border-gray-200 hover:border-blue-500 transition duration-300"
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    {files[activeTab][index]?.name}
                  </span>

                  <div className="flex items-center gap-2">
                    <IconButton onClick={toggleView}>
                      <VisibilityIcon />
                    </IconButton>

                    <button
                      type="button"
                      onClick={() => handleRemoveFile(activeTab, index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ❌
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  {files[activeTab][index]?.type === "application/pdf" ? (
                    <object
                      data={previewUrl}
                      type="application/pdf"
                      width="100%"
                      height="200px"
                      className="rounded-md"
                      aria-label="Vista previa PDF"
                    >
                      <p>Vista previa no disponible</p>
                    </object>
                  ) : (
                    <img
                      src={previewUrl}
                      alt="Vista previa archivo"
                      className="w-full h-auto rounded-md"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Observación */}
          <div className="mb-6">
            <label className="text-lg font-medium text-gray-700">Observación</label>
            <textarea
              name="observacion"
              value={observacion[activeTab] || ""}
              onChange={(e) => setObservacion((prev) => ({ ...prev, [activeTab]: e.target.value }))}
              rows="4"
              className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              placeholder="Escribe una observación aquí..."
            ></textarea>
            {observacion[activeTab] && observacion[activeTab].length < 10 && (
              <p className="text-red-500 text-sm mt-2">La observación debe tener al menos 10 caracteres.</p>
            )}
          </div>

          <div className="flex justify-center mt-6">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white py-2 px-6 rounded-md shadow-lg hover:bg-blue-700 transition duration-300"
            >
              Subir archivos al sistema
            </button>
          </div>
        </div>

        {/* Botón para nueva solicitud */}
        <button
          title="Nueva Solicitud"
          className="group cursor-pointer outline-none hover:rotate-90 duration-300"
          onClick={() => setShowFileInput(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="50px"
            height="50px"
            viewBox="0 0 24 24"
            className="stroke-indigo-400 fill-none group-hover:fill-indigo-800 group-active:stroke-indigo-200 group-active:fill-indigo-600 group-active:duration-0 duration-300"
          >
            <path
              d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
              stroke-width="1.5"
            ></path>
            <path d="M8 12H16" stroke-width="1.5"></path>
            <path d="M12 16V8" stroke-width="1.5"></path>
          </svg>
        </button>

        {/* Modal de subir archivo */}
        {showFileInput && (
          <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">Subir Nuevo Documento</h2>
                <button
                  onClick={() => setShowFileInput(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ❌
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col">
                  <label className="text-lg font-medium text-gray-700">{activeTab}</label>
                  <label className="mt-2 p-3 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:border-blue-500 transition">
                    <span className="text-gray-500 mr-2">📁</span>
                    <span className="text-gray-600">Subir archivo</span>
                    <input
                      type="file"
                      multiple
                      accept=".pdf"
                      onChange={(e) => handleFileChange(e, activeTab)}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={handleSubmitUpFile}
                    type="submit"
                    className="bg-blue-600 text-white py-2 px-6 rounded-md shadow-lg hover:bg-blue-700 transition duration-300"
                  >
                    Enviar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Vista previa */}
      {view && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg shadow-lg w-3/4 h-3/4 relative">
            <button onClick={toggleView} className="absolute top-2 right-2 text-lg">
              ✖
            </button>
            <iframe
              src={filePreviews[activeTab] && filePreviews[activeTab][0]}
              className="w-full h-full"
              title="Vista previa del archivo"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}