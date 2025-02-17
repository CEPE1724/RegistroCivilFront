import { useState } from 'react';
import { useSnackbar } from 'notistack';

export function Documental() {
  const [files, setFiles] = useState({});
  const [activeTab, setActiveTab] = useState('Buro Credito');
  const [showFileInput, setShowFileInput] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to toggle menu visibility
  const { enqueueSnackbar } = useSnackbar();

  // Calcular progreso
  const calculateProgress = () => {
    const totalFields = menuItems.length;
    const completedFields = menuItems.filter(
      (field) => files[field] && files[field].length > 0
    ).length;
    return (completedFields / totalFields) * 100;
  };

  // Cambiar el color de la barra de progreso
  const getProgressBarColor = () => {
    const progress = calculateProgress();
    if (progress < 50) return '#FF0000'; // Rojo
    if (progress < 80) return '#FF9800'; // Naranja
    return '#4CAF50'; // Verde
  };

  const handleFileChange = (e, field) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prevFiles) => ({
      ...prevFiles,
      [field]: [...(prevFiles[field] || []), ...selectedFiles],
    }));
    setShowFileInput(false);
  };

  const handleRemoveFile = (field, index) => {
    setFiles((prevFiles) => {
      const updatedFiles = { ...prevFiles };
      updatedFiles[field].splice(index, 1);
      if (updatedFiles[field].length === 0) delete updatedFiles[field];
      return updatedFiles;
    });
  };
 
  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Verificar si el campo activo tiene archivos
    if (!files[activeTab] || files[activeTab].length === 0) {
      enqueueSnackbar(`Por favor, sube un archivo en el campo de ${activeTab}.`, { variant: 'error' });
    } else {
      // Si el campo tiene archivos, proceder a enviar
      console.log('Archivos enviados:', files);
      enqueueSnackbar('Archivos enviados correctamente.', { variant: 'success' });
    }
  };
  
   const handleSubmitUpFile = (e) => {
    e.preventDefault();

  // Verificar si el input de archivos está vacío para el campo actual
  const inputElement = document.querySelector(`input[name="${activeTab}"]`);
  
  if (!inputElement || inputElement.files.length === 0) {
    enqueueSnackbar(`Por favor, selecciona un archivo para poder subirlo`, { variant: 'error' });
  } else {
    // Si hay archivo seleccionado, proceder a enviarlo
    console.log('Archivo enviado:', files);
    enqueueSnackbar('Archivo subido correctamente.', { variant: 'success' });
    setShowFileInput(false); // Cerrar modal de archivo después de enviar
  }

   }


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

  const completedFields = menuItems.filter((field) => files[field] && files[field].length > 0);
  const pendingFields = menuItems.filter((field) => !(files[field] && files[field].length > 0));

  return (
    <div className="flex min-h-screen">
        
      {/* Sidebar */}
      <div className={`w-64 bg-[#2d3689] text-white ${isMenuOpen ? 'block' : 'hidden'} md:block`}>
        <div className="p-5">
          <h2 className="text-xl font-semibold">Menú</h2>
          <div className="mt-4">
            {/* Barra de progreso general */}
            <div className="relative pt-1">
              <label className="block text-sm font-semibold text-gray-300">Progreso de Archivos</label>
              <div className="flex mb-2 items-center justify-between">
                <span className="text-xs font-medium text-gray-300">{Math.round(calculateProgress())}%</span>
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
                  <button
                    className="bg-green-600 text-white py-2 px-6 rounded-md shadow-lg hover:bg-green-700 transition duration-300"
                  >
                    Funcionalidad Nueva
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Menú de campos pendientes */}
          <div>
            <h3 className="text-lg text-gray-300 font-semibold">Campos Pendientes</h3>
            <ul className="mt-4 space-y-4">
              {pendingFields.map((item) => {
                const fileCount = files[item] ? files[item].length : 0;
                return (
                  <li key={item}>
                    <a
                      href="#"
                      onClick={() => setActiveTab(item)}
                      className={`block text-gray-300 hover:text-white ${activeTab === item ? 'bg-gray-700' : ''}`}
                    >
                      {item} {fileCount > 0 && <span className="text-white px-2 ml-2">{`+${fileCount}`}</span>}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Menú de campos completados */}
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
                        className={`block text-gray-300 hover:text-white ${activeTab === item ? 'bg-gray-700' : ''}`}
                      >
                        {item} {fileCount > 0 && <span className="text-white px-2 ml-2">{`+${fileCount}`}</span>}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>

      
      
      
      {/* Mobile Menu Button */}
        
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="fixed top-6 left-6 md:hidden bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
      >
        {isMenuOpen ? '❌' : '☰'}
      </button>

      {/* Content Section */}
      <div className="flex-1 bg-gray-100 p-6 relative">
        <div className="w-full bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Documentos Subidos</h2>

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

                <div className="mt-4">
                  {file.type === 'application/pdf' && (
                    <object
                      data={URL.createObjectURL(file)}
                      type="application/pdf"
                      width="100%"
                      height="200px"
                      className="rounded-md"
                      aria-label="Vista previa PDF"
                    >
                      <p>Vista previa no disponible</p>
                    </object>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Botón de subir */}
          <div className="flex justify-center mt-6">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white py-2 px-6 rounded-md shadow-lg hover:bg-blue-700 transition duration-300"
            >
              Subir archivos al sistema
            </button>
          </div>
        </div>

        <button
          onClick={() => setShowFileInput(true)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
        >
          ➕
        </button>

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
                      accept=".pdf,.doc,.docx"
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
