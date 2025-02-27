import React, { useState, useEffect } from "react";

export function TablaConDocumentos({ isOpen, closeModal, urls }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileToView, setFileToView] = useState("");

  // Si 'urls' es una cadena, convertirla en un array
  const urlArray = Array.isArray(urls)
    ? urls
    : urls.replace(/["\[\]'"]+/g, "").split(",");

  // Abre el modal y carga el archivo
  const openModal = (url) => {
    setFileToView(url);
    setIsModalOpen(true);
  };

  const closeModalHandler = () => {
    setIsModalOpen(false);
    closeModal(); // Si el componente principal también necesita cerrar algo
  };

  const openInNewTab = (url) => {
    window.open(url, "_blank"); // Abre el enlace en una nueva pestaña
  };

  const openAllInNewTabs = () => {
    urlArray.forEach((url) => {
      window.open(url, "_blank");
    });
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg w-3/4 h-3/4 relative overflow-hidden">
          <button
            onClick={closeModalHandler}
            className="absolute top-4 right-4 text-lg text-gray-700 hover:text-gray-500"
          >
            ✖
          </button>
          <h2 className="text-2xl font-semibold mb-6 text-center">Lista de Documentos</h2>
          <table className="min-w-full table-auto border-separate border-spacing-2">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">#</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Documento</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Acción</th>
              </tr>
            </thead>
            <tbody>
              {urlArray.length > 0 &&
                urlArray.map((url, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="px-6 py-3 text-sm text-gray-700">{index + 1}</td>
                    <td className="px-6 py-3 text-sm text-gray-700">Documento {index + 1}</td>
                    <td className="px-6 py-3 text-sm">
                      <button
                        onClick={() => openInNewTab(url)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400"
                      >
                        Ver
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

         
        </div>
      </div>
    )
  );
}
