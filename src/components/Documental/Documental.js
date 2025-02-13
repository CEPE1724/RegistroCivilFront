import { useState } from 'react';
import { useSnackbar } from 'notistack';

export function Documental() {
  const [files, setFiles] = useState({});
  const [activeTab, setActiveTab] = useState('Buro Credito');
  const [showFileInput, setShowFileInput] = useState(false); // Controla si se muestra el formulario de carga
  const { enqueueSnackbar } = useSnackbar();

  // Maneja el cambio de archivos
  const handleFileChange = (e, field) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prevFiles) => ({
      ...prevFiles,
      [field]: [...(prevFiles[field] || []), ...selectedFiles],
    }));
    setShowFileInput(false); // Cierra el formulario de carga automáticamente después de seleccionar archivos
    handleSubmit(); // Llama al submit automáticamente después de seleccionar un archivo
  };

  // Maneja la eliminación de un archivo
  const handleRemoveFile = (field, index) => {
    setFiles((prevFiles) => {
      const updatedFiles = { ...prevFiles };
      updatedFiles[field].splice(index, 1);
      if (updatedFiles[field].length === 0) delete updatedFiles[field];
      return { ...updatedFiles };
    });
  };

  // Validación y envío del formulario
  const handleSubmit = (e) => {
    // Si no se pasa el evento, simplemente validad la carga de archivos
    if (e) e.preventDefault();
    const missingFiles = Object.keys(files).some(
      (field) => !files[field] || files[field].length === 0
    );

    // Si hay archivos faltantes, mostrar mensaje de error
    if (missingFiles) {
      enqueueSnackbar('Por favor, sube todos los archivos requeridos.', { variant: 'error' });
    } else {
      console.log('Archivos enviados:', files);
      enqueueSnackbar('Archivos enviados correctamente.', { variant: 'success' });
    }
  };

  const menuItems = [
    'Buro Credito',
    'Copia De Cedula',
    'Contrato de Compra',
    'Declaracion',
    'Pagare a la Orden',
    'Tabla de amortizacion',
    'Gastos de cobranza',
    'Compromiso Lugar de pago',
    'Acta',
    'Consentimiento',
    'Autorizacion',
  ];

  return (
    <div className="flex min-h-screen">
      {/* Menú lateral */}
      <div className="w-64 bg-gray-800 text-white">
        <div className="p-5">
          <h2 className="text-xl font-semibold">Menú</h2>
          <ul className="mt-6 space-y-4">
            {menuItems.map((item) => (
              <li key={item}>
                <a
                  href="#"
                  onClick={() => setActiveTab(item)} // Cambiar la pestaña activa
                  className={`block text-gray-300 hover:text-white ${activeTab === item ? 'bg-gray-700' : ''}`}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Contenedor principal */}
      <div className="flex-1 bg-gray-100 p-6 relative">
        <div className="w-full bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Documentos Subidos</h2>

          {/* Tarjetas con los archivos ya subidos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {files[activeTab]?.map((file, fileIndex) => (
              <div key={fileIndex} className="bg-gray-50 p-4 rounded-md shadow-md border border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(activeTab, fileIndex)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ❌
                  </button>
                </div>

                {/* Vista previa del PDF (primera página) */}
                <div className="mt-4">
                  {file.type === 'application/pdf' && (
                    <object
                      data={URL.createObjectURL(file)} // Crea una URL temporal para el archivo
                      type="application/pdf"
                      width="100%"
                      height="200px"
                      className="rounded-md"
                    >
                      <p>Vista previa no disponible</p>
                    </object>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Botón flotante en la esquina inferior derecha */}
        <button
          onClick={() => setShowFileInput(true)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
        >
          ➕
        </button>

        {/* Formulario de carga de archivos (centrado y solo visible cuando showFileInput es true) */}
        {showFileInput && (
          <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Subir Nuevo Documento</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col">
                  <label className="text-lg font-medium text-gray-700">{activeTab}</label>
                  <label className="mt-2 p-3 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:border-blue-500 transition">
                    <span className="text-gray-500 mr-2">📁</span>
                    <span className="text-gray-600">Subir archivo</span>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx" // Restricción de tipos de archivo
                      onChange={(e) => handleFileChange(e, activeTab)}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 px-6 rounded-md shadow-lg hover:bg-blue-700 transition duration-300"
                  >
                    Enviar
                  </button>
                </div>
              </form>

              {/* Botón para cerrar el formulario */}
              <button
                onClick={() => setShowFileInput(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                ❌
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
