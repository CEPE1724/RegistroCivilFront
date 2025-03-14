import { useState, useEffect } from "react";
import {
  Folder as FolderIcon,
  InsertDriveFile as FileIcon,
  GridView as GridIcon,
  List as ListIcon,
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";

// datos quemados
const  data = [
  {
    id: 1,
    name: "2025",
    type: "folder",
    children: [
      {
        id: 2,
        name: "Almacenes",
        type: "folder",
        children: [
          {
            id: 3,
            name: "Quicentro",
            type: "folder",
            children: [
              {
                id: 4,
                name: "Enero",
                type: "folder",
                children: [
                  { id: 101, name: "Solicitud-001.zip", type: "file" },
                  { id: 102, name: "Solicitud-002.zip", type: "file" },
                  { id: 103, name: "Solicitud-003.zip", type: "file" },
                ],
              },
              {
                id: 5,
                name: "Febrero",
                type: "folder",
                children: [
                  { id: 104, name: "Solicitud-004.zip", type: "file" },
                  { id: 105, name: "Solicitud-005.zip", type: "file" },
                ],
              },
            ],
          },
          {
            id: 6,
            name: "CCI",
            type: "folder",
            children: [
              {
                id: 7,
                name: "Enero",
                type: "folder",
                children: [
                  { id: 106, name: "Solicitud-006.zip", type: "file" },
                  { id: 107, name: "Solicitud-007.zip", type: "file" },
                ],
              },
              {
                id: 8,
                name: "Febrero",
                type: "folder",
                children: [
                  { id: 108, name: "Solicitud-008.zip", type: "file" },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 9,
    name: "2024",
    type: "folder",
    children: [
      {
        id: 10,
        name: "Almacenes",
        type: "folder",
        children: [
          {
            id: 11,
            name: "Quicentro",
            type: "folder",
            children: [
              {
                id: 12,
                name: "Diciembre",
                type: "folder",
                children: [
                  { id: 109, name: "Solicitud-009.zip", type: "file" },
                  { id: 110, name: "Solicitud-010.zip", type: "file" },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

export const RepositorioComponent = () => {
  const [view, setView] = useState("grid");
  const [search, setSearch] = useState("");
  const [openSidebarFolders, setOpenSidebarFolders] = useState({});
  const [currentPath, setCurrentPath] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedFileId, setSelectedFileId] = useState(null);


  const findPathToItem = (targetId, items =  data, currentPath = []) => {
    for (const item of items) {
      // Si encontramos el elemento, devolvemos la ruta
      if (item.id === targetId) {
        return [...currentPath, item.id];
      }

      // Si es una carpeta, buscamos en sus hijos
      if (item.children && item.children.length > 0) {
        const path = findPathToItem(targetId, item.children, [
          ...currentPath,
          item.id,
        ]);
        if (path) return path;
      }
    }
    return null;
  };


  const findPathToFile = (fileId, items =  data, currentPath = []) => {
    for (const item of items) {
      // Si es una carpeta, verificamos sus hijos
      if (item.type === "folder" && item.children) {
        // Verificamos si el archivo está directamente en esta carpeta
        const fileInFolder = item.children.find(
          (child) => child.id === fileId && child.type === "file"
        );

        if (fileInFolder) {
          // Encontramos el archivo, devolvemos la ruta a la carpeta que lo contiene
          return [...currentPath, item.id];
        }

        // No está directamente aquí, buscamos recursivamente en las subcarpetas
        const path = findPathToFile(fileId, item.children, [
          ...currentPath,
          item.id,
        ]);
        if (path) return path;
      }
    }
    return null;
  };

  // Función para expandir automáticamente las carpetas en el sidebar basado en la ruta actual
  useEffect(() => {
    // Configurar las carpetas abiertas en el sidebar basado en la ruta actual
    const newOpenFolders = { ...openSidebarFolders };

    // Para cada ID en la ruta actual, marcar la carpeta como abierta
    currentPath.forEach((id) => {
      newOpenFolders[id] = true;
    });

    setOpenSidebarFolders(newOpenFolders);
  }, [currentPath]);

  // Toggle sidebar visibility (mobile responsiveness)
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Toggle sidebar folder expansion y sincroniza con la navegación principal
  const toggleSidebarFolder = (id, item) => {
    // Si la carpeta se está abriendo, actualiza la ruta principal
    if (!openSidebarFolders[id]) {
      // Si hacemos clic en una carpeta en el sidebar, navegar a esa carpeta
      const path = findPathToItem(id);
      if (path) {
        setCurrentPath(path.slice(0, -1)); // Excluimos el último ID porque queremos mostrar el contenido, no navegar dentro
      }
    }

    // Actualiza el estado de apertura de la carpeta en el sidebar
    setOpenSidebarFolders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSidebarFileClick = (fileId) => {
    // Encontrar la ruta a la carpeta que contiene el archivo
    const path = findPathToFile(fileId);

    if (path) {
      // Navegar a esa carpeta
      setCurrentPath(path);

      // Seleccionar el archivo
      setSelectedFileId(fileId);

      // Asegurarse de que todas las carpetas en la ruta estén abiertas
      const newOpenFolders = { ...openSidebarFolders };
      path.forEach((id) => {
        newOpenFolders[id] = true;
      });
      setOpenSidebarFolders(newOpenFolders);
    }
  };

  
  const handleMainFileClick = (fileId) => {
    setSelectedFileId(fileId);
    alert(`Archivo abierto: ID ${fileId}`);
  };

  // Navigate to a folder in the main content area
  const navigateToFolder = (item) => {
    // Al navegar a una carpeta, actualizar la ruta actual
    setCurrentPath([...currentPath, item.id]);

    // Si es una carpeta, también abrir en el sidebar
    if (item.type === "folder") {
      setOpenSidebarFolders((prev) => ({ ...prev, [item.id]: true }));
    }

    // Reset de archivo seleccionado al cambiar de carpeta
    setSelectedFileId(null);
  };

  // Get the current folder content based on the navigation path
  const getCurrentFolderContent = () => {
    let content =  data;

    // If we have a path, traverse through it
    if (currentPath.length > 0) {
      let currentLevel =  data;

      for (const id of currentPath) {
        // Find the item with this id at the current level
        const foundItem = currentLevel.find((item) => item.id === id);

        if (foundItem && foundItem.children) {
          currentLevel = foundItem.children;
        } else {
          return []; // Path is invalid
        }
      }

      content = currentLevel;
    }

    // Apply search filter if needed
    if (search) {
      return content.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    return content;
  };

  // breadcrumb/ path /names /
  const getBreadcrumbs = () => {
    const breadcrumbs = [];
    let currentLevel =  data;

    // Start with "Home"
    breadcrumbs.push({ id: null, name: "Home" });

    // Add each level in the path
    for (let i = 0; i < currentPath.length; i++) {
      const id = currentPath[i];
      const item = currentLevel.find((item) => item.id === id);

      if (item) {
        breadcrumbs.push({ id, name: item.name });
        if (item.children) {
          currentLevel = item.children;
        }
      }
    }

    return breadcrumbs;
  };

  // Obtener el elemento actual basado en la ruta
  const getCurrentItem = () => {
    if (currentPath.length === 0) return null;

    let currentItem = null;
    let items =  data;

    for (const id of currentPath) {
      currentItem = items.find((item) => item.id === id);
      if (currentItem && currentItem.children) {
        items = currentItem.children;
      } else {
        break;
      }
    }

    return currentItem;
  };

  // Render sidebar folders recursively
  const renderSidebarFolders = (items, level = 0) => {
    return items.map((item) => {
      // Verificar si este elemento está en la ruta actual
      const isInCurrentPath = currentPath.includes(item.id);
      // Verificar si este archivo está seleccionado
      const isSelectedFile = item.type === "file" && item.id === selectedFileId;

      return (
        <div key={item.id} className={`flex flex-col`}>
          {item.type === "folder" ? (
            <button
              className={`flex items-center w-full p-2 hover:bg-gray-200 rounded-lg transition ${
                isInCurrentPath ? "  font-medium" : ""
              } ${level > 0 ? `ml-${level * 2}` : ""}`}
              onClick={() => toggleSidebarFolder(item.id, item)}
            >
              <ExpandMoreIcon
                className={`w-5 h-5 mr-2 ${
                  openSidebarFolders[item.id] ? "rotate-180" : ""
                } transition-transform text-gray-500`}
              />
              <FolderIcon
                className={`w-6 h-6 mr-2 ${
                  isInCurrentPath ? "text-blue-600" : "text-gray-500"
                }`}
              />
              <span className="truncate">{item.name}</span>
            </button>
          ) : (
            <div
              className={`flex items-center p-2 hover:bg-gray-200 rounded-lg transition cursor-pointer ${
                isSelectedFile ? "  font-medium" : ""
              } ${level > 0 ? `ml-${level * 4}` : ""}`}
              onClick={() => handleSidebarFileClick(item.id)}
            >
              <FileIcon
                className={`w-6 h-6 mr-2 ${
                  isSelectedFile ? "text-blue-600" : "text-gray-500"
                }`}
              />
              <span className="truncate">{item.name}</span>
            </div>
          )}
          {item.children && openSidebarFolders[item.id] && (
            <div className="ml-4">
              {renderSidebarFolders(item.children, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  // Navigate back one level
  const navigateUp = () => {
    if (currentPath.length > 0) {
      setCurrentPath(currentPath.slice(0, -1));
      setSelectedFileId(null);
    }
  };

  // Get the current folder items
  const currentFolderContent = getCurrentFolderContent();
  const breadcrumbs = getBreadcrumbs();
  const currentItem = getCurrentItem();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      <button
        className="md:hidden p-2 bg-gray-600 text-white fixed top-4 left-4 rounded-lg shadow-md z-10"
        onClick={toggleSidebar}
      >
        <MenuIcon />
      </button>

      {/* Sidebar */}
      <div
        className={`bg-white p-0 m-0 border-r shadow-lg overflow-auto transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-0 overflow-hidden"
        } md:w-64`}
      >
        <h2 className="text-lg font-bold mb-4 text-gray-700">
          Repositorio Solicitudes
        </h2>
        <nav className="space-y-1">{renderSidebarFolders( data)}</nav>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 overflow-auto">
        {/* Search and view controls */}
        <div className="flex items-center mb-6 gap-4">
          <div className="relative flex-grow">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none"
              placeholder="Buscar archivos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={() => setView("grid")}
            className={`p-2 ${
              view === "grid" ? "bg-gray-700" : "bg-gray-500"
            } text-white rounded-lg shadow-md hover:bg-gray-600 transition`}
          >
            <GridIcon className="w-6 h-6" />
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-2 ${
              view === "list" ? "bg-gray-700" : "bg-gray-500"
            } text-white rounded-lg shadow-md hover:bg-gray-600 transition`}
          >
            <ListIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Breadcrumbs navigation */}
        <div className="flex items-center mb-4 text-sm text-gray-600 overflow-x-auto">
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center">
              {index > 0 && <span className="mx-2">/</span>}
              <button
                className="hover:text-gray-900 hover:underline"
                onClick={() => {
                  if (index === 0) {
                    // Clicking "Home" resets to root
                    setCurrentPath([]);
                  } else {
                    // Navigate to this level
                    setCurrentPath(currentPath.slice(0, index));
                  }
                  setSelectedFileId(null);
                }}
              >
                {crumb.name}
              </button>
            </div>
          ))}
        </div>

        {/* Current folder information */}
        {currentItem && (
          <div className="mb-4 flex items-center">
            <FolderIcon className="w-6 h-6 text-blue-500 mr-2" />
            <h2 className="text-xl font-medium">{currentItem.name}</h2>
          </div>
        )}

        {/* Back button (when not at root) */}
        {currentPath.length > 0 && (
          <button
            onClick={navigateUp}
            className="mb-4 flex items-center p-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
          >
            <ExpandMoreIcon className="w-5 h-5 mr-1 rotate-90" />
            Volver
          </button>
        )}

        {/* Folder/file grid or list view */}
        <div
          className={
            view === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              : "flex flex-col gap-2"
          }
        >
          {currentFolderContent.length === 0 ? (
            <div className="col-span-full text-center p-8 text-gray-500">
              No hay elementos para mostrar
            </div>
          ) : (
            currentFolderContent.map((item) => (
              <div
                key={item.id}
                className={`${
                  view === "grid"
                    ? "p-4 flex flex-col items-center gap-2 bg-white border rounded-lg shadow hover:shadow-md transition"
                    : "p-3 flex items-center gap-3 bg-white border rounded-lg shadow hover:shadow-md transition"
                } cursor-pointer ${
                  item.id === selectedFileId
                    ? "ring-2 ring-blue-500 bg-blue-50"
                    : ""
                }`}
                onClick={() => {
                  if (item.type === "folder") {
                    navigateToFolder(item);
                  } else {
                    handleMainFileClick(item.id);
                  }
                }}
              >
                {item.type === "folder" ? (
                  <FolderIcon
                    className={`${
                      view === "grid" ? "w-12 h-12" : "w-8 h-8"
                    } text-blue-500`}
                  />
                ) : (
                  <FileIcon
                    className={`${view === "grid" ? "w-12 h-12" : "w-8 h-8"} ${
                      item.id === selectedFileId
                        ? "text-blue-600"
                        : "text-gray-500"
                    }`}
                  />
                )}
                <div
                  className={`${view === "grid" ? "text-center" : ""} truncate`}
                >
                  <div
                    className={`font-medium ${
                      item.id === selectedFileId ? "text-blue-700" : ""
                    }`}
                  >
                    {item.name}
                  </div>
                  {view === "list" && item.type === "folder" && (
                    <span className="text-xs text-gray-500">
                      {item.children
                        ? `${item.children.length} elementos`
                        : "0 elementos"}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
