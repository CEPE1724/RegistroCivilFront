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
import { APIURL } from "../../configApi/apiConfig";
import axios from 'axios';

export const RepositorioComponent = () => {
  const [view, setView] = useState("grid");
  const [search, setSearch] = useState("");
  const [openSidebarFolders, setOpenSidebarFolders] = useState({});
  const [currentPath, setCurrentPath] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedFileId, setSelectedFileId] = useState(null);
  // Estado para la data transformada desde la API
  const [repositorios, setRepositorios] = useState([]);

  // Función para transformar la data de la API en la estructura de carpetas requerida
  const transformData = (apiData) => {
    const meses = {
      1: "Enero",
      2: "Febrero",
      3: "Marzo",
      4: "Abril",
      5: "Mayo",
      6: "Junio",
      7: "Julio",
      8: "Agosto",
      9: "Septiembre",
      10: "Octubre",
      11: "Noviembre",
      12: "Diciembre"
    };
  
    // Agrupar por Año
    const agrupadoPorAnio = apiData.reduce((acc, item) => {
      const anio = item.Anio;
      if (!acc[anio]) {
        acc[anio] = [];
      }
      acc[anio].push(item);
      return acc;
    }, {});
  
    const dataTree = Object.keys(agrupadoPorAnio).map(anio => {
      const itemsAnio = agrupadoPorAnio[anio];
  
      // Agrupar por Bodega
      const agrupadoPorBodega = itemsAnio.reduce((acc, item) => {
        const bodega = item.Bodega;
        if (!acc[bodega]) {
          acc[bodega] = [];
        }
        acc[bodega].push(item);
        return acc;
      }, {});
  
      const bodegas = Object.keys(agrupadoPorBodega).map(bodega => {
        const itemsBodega = agrupadoPorBodega[bodega];
  
        // Agrupar por Mes (conversión de número a nombre)
        const agrupadoPorMes = itemsBodega.reduce((acc, item) => {
          const mesNombre = meses[item.Mes];
          if (!acc[mesNombre]) {
            acc[mesNombre] = [];
          }
          acc[mesNombre].push(item);
          return acc;
        }, {});
  
        const mesFolders = Object.keys(agrupadoPorMes).map(mesNombre => {
          const itemsMes = agrupadoPorMes[mesNombre];
  
          // Agrupar por día, extraído de FechaSubida
          const agrupadoPorDia = itemsMes.reduce((acc, item) => {
            const dia = new Date(item.FechaSubida).getDate();
            if (!acc[dia]) {
              acc[dia] = [];
            }
            acc[dia].push(item);
            return acc;
          }, {});
  
          const diasFolders = Object.keys(agrupadoPorDia).map(dia => {
            // Dentro de cada día, agrupar por NumeroSolicitud
            const agrupadoPorNumeroSolicitud = agrupadoPorDia[dia].reduce((acc, item) => {

              const numero = item.NumeroSolicitud;
              if (!acc[numero]) {
                acc[numero] = [];
              }
              acc[numero].push(item);
              return acc;
            }, {});
  
            // Cada subcarpeta será una carpeta con el nombre del NumeroSolicitud
            const solicitudFolders = Object.keys(agrupadoPorNumeroSolicitud).map(numero => {
              const files = agrupadoPorNumeroSolicitud[numero].map(item => ({
                
                id: `${item.idCre_SolicitudWeb}-${item.NumeroSolicitud}-${dia}-${item.FechaSubida}-${item.idDocumentosSolicitudWeb}`,
                name: item.TipoDocumento,
                type: "file",
                RutaDocumento: item.RutaDocumento,
                FechaSubida: item.FechaSubida
              }));
              return {
                id: `${bodega}-${mesNombre}-dia-${dia}-ns-${numero}`,
                name: numero,
                type: "folder",
                children: files
              };
            });
  
            return {
              id: `${bodega}-${mesNombre}-dia-${dia}`,
              name: `${dia}`,
              type: "folder",
              children: solicitudFolders
            };
          });
  
          return {
            id: `${bodega}-${mesNombre}`,
            name: mesNombre,
            type: "folder",
            children: diasFolders
          };
        });
  
        return {
          id: `${anio}-${bodega}`,
          name: bodega,
          type: "folder",
          children: mesFolders
        };
      });
  
      return {
        id: anio,
        name: anio,
        type: "folder",
        children: bodegas
      };
    });
  
    return dataTree;
  };
  

  // Cargar data de la API y transformarla
  useEffect(() => {
    const fetchRepositorios = async () => {
      try {
        const url = APIURL.get_repositorios(); // Ajusta parámetros si es necesario
        const response = await axios.get(url, {
          headers: { "Content-Type": "application/json" },
        });
        const apiData = response.data;
        const transformedData = transformData(apiData);
        setRepositorios(transformedData);
      } catch (error) {
        console.error("Error al obtener los repositorios", error);
      }
    };
    fetchRepositorios();
  }, []);

  // Buscar la ruta de un item dado su id en el árbol repositorios
  const findPathToItem = (targetId, items = repositorios, currentPath = []) => {
    for (const item of items) {
      if (item.id === targetId) {
        return [...currentPath, item.id];
      }
      if (item.children && item.children.length > 0) {
        const path = findPathToItem(targetId, item.children, [...currentPath, item.id]);
        if (path) return path;
      }
    }
    return null;
  };

  // Buscar la ruta de una carpeta que contenga un archivo dado su id
  const findPathToFile = (fileId, items = repositorios, currentPath = []) => {
    for (const item of items) {
      if (item.type === "folder" && item.children) {
        const fileInFolder = item.children.find(
          (child) => child.id === fileId && child.type === "file"
        );
        if (fileInFolder) {
          return [...currentPath, item.id];
        }
        const path = findPathToFile(fileId, item.children, [...currentPath, item.id]);
        if (path) return path;
      }
    }
    return null;
  };

  // Expandir automáticamente las carpetas del sidebar según la ruta actual
  useEffect(() => {
    const newOpenFolders = { ...openSidebarFolders };
    currentPath.forEach((id) => {
      newOpenFolders[id] = true;
    });
    setOpenSidebarFolders(newOpenFolders);
  }, [currentPath]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const toggleSidebarFolder = (id, item) => {
    if (!openSidebarFolders[id]) {
      const path = findPathToItem(id);
      if (path) {
        setCurrentPath(path.slice(0, -1));
      }
    }
    setOpenSidebarFolders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Al hacer clic en un archivo en el sidebar se navega hasta su carpeta
  // y se actualiza el archivo seleccionado. Aquí no abrimos directamente el archivo.
  const handleSidebarFileClick = (fileId) => {
    const path = findPathToFile(fileId);
    if (path) {
      setCurrentPath(path);
      setSelectedFileId(fileId);
      const newOpenFolders = { ...openSidebarFolders };
      path.forEach((id) => {
        newOpenFolders[id] = true;
      });
      setOpenSidebarFolders(newOpenFolders);
    }
  };

  // Al hacer clic en un archivo en el área principal se abre la URL del archivo
  const handleMainFileClick = (file) => {
    setSelectedFileId(file.id);
    // Aquí se maneja la lógica de abrir el archivo; por ejemplo, abriendo la URL en una nueva pestaña.
    window.open(file.RutaDocumento, "_blank");
  };

  // Navegar a una carpeta (contenido principal)
  const navigateToFolder = (item) => {
    setCurrentPath([...currentPath, item.id]);
    if (item.type === "folder") {
      setOpenSidebarFolders((prev) => ({ ...prev, [item.id]: true }));
    }
    setSelectedFileId(null);
  };

  // Obtener el contenido de la carpeta actual basado en la ruta
  const getCurrentFolderContent = () => {
    let content = repositorios;
    if (currentPath.length > 0) {
      let currentLevel = repositorios;
      for (const id of currentPath) {
        const foundItem = currentLevel.find((item) => item.id === id);
        if (foundItem && foundItem.children) {
          currentLevel = foundItem.children;
        } else {
          return [];
        }
      }
      content = currentLevel;
    }
    if (search) {
      return content.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    return content;
  };

  // Breadcrumbs para la navegación
  const getBreadcrumbs = () => {
    const breadcrumbs = [];
    let currentLevel = repositorios;
    breadcrumbs.push({ id: null, name: "Home" });
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

  const getCurrentItem = () => {
    if (currentPath.length === 0) return null;
    let currentItem = null;
    let items = repositorios;
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

  // Renderizado recursivo de carpetas para el sidebar
  const renderSidebarFolders = (items, level = 0) => {
    return items.map((item) => {
      const isInCurrentPath = currentPath.includes(item.id);
      const isSelectedFile = item.type === "file" && item.id === selectedFileId;
      return (
        <div key={item.id} className="flex flex-col">
          {item.type === "folder" ? (
            <button
              className={`flex items-center w-full p-2 hover:bg-gray-200 rounded-lg transition ${
                isInCurrentPath ? "font-medium" : ""
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
                isSelectedFile ? "font-medium" : ""
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
            <div className="ml-4">{renderSidebarFolders(item.children, level + 1)}</div>
          )}
        </div>
      );
    });
  };

  const navigateUp = () => {
    if (currentPath.length > 0) {
      setCurrentPath(currentPath.slice(0, -1));
      setSelectedFileId(null);
    }
  };

  const currentFolderContent = getCurrentFolderContent();
  const breadcrumbs = getBreadcrumbs();
  const currentItem = getCurrentItem();

  return (
    <div className="flex h-screen bg-gray-100">
  {/* Botón para toggle del sidebar en mobile */}
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
    <nav className="space-y-1 mt-4">
      {repositorios.length > 0 ? (
        renderSidebarFolders(repositorios)
      ) : (
        <div className="p-4 text-gray-500">Cargando...</div>
      )}
    </nav>
  </div>

  {/* Área principal */}
  <div className="flex-1 p-6 overflow-auto">
    {/* Barra de búsqueda */}
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

    {/* Breadcrumbs */}
    <div className="flex items-center mb-4 text-sm text-gray-600 overflow-x-auto">
      {breadcrumbs.map((crumb, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && <span className="mx-2">/</span>}
          <button
            className="hover:text-gray-900 hover:underline"
            onClick={() => {
              if (index === 0) {
                setCurrentPath([]);
              } else {
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

    {/* Título de la carpeta actual */}
    {currentItem && (
      <div className="mb-4 flex items-center">
        <FolderIcon className="w-6 h-6 text-blue-500 mr-2" />
        <h2 className="text-xl font-medium">{currentItem.name}</h2>
      </div>
    )}

    {currentPath.length > 0 && (
      <button
        onClick={navigateUp}
        className="mb-4 flex items-center p-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
      >
        <ExpandMoreIcon className="w-5 h-5 mr-1 rotate-90" />
        Volver
      </button>
    )}

    {/* Renderizado de la carpeta o archivos en vista grid o lista */}
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
              item.id === selectedFileId ? "ring-2 ring-blue-500 bg-blue-50" : ""
            }`}
            onClick={() => {
              if (item.type === "folder") {
                navigateToFolder(item);
              } else {
                // Aquí pasamos el objeto completo del archivo para abrirlo
                handleMainFileClick(item);
              }
            }}
          >
            {item.type === "folder" ? (
              <FolderIcon
                className={`${view === "grid" ? "w-12 h-12" : "w-8 h-8"} text-blue-500`}
              />
            ) : (
              <FileIcon
                className={`${
                  view === "grid" ? "w-12 h-12" : "w-8 h-8"
                } ${item.id === selectedFileId ? "text-blue-600" : "text-gray-500"}`}
              />
            )}
            <div className={`${view === "grid" ? "text-center" : ""} truncate`}>
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
