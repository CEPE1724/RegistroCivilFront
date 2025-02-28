import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { APIURL } from '../configApi/apiConfig';  // Suponiendo que tienes tu configuración para la API
import IconCard from './IconCard';
import { GestorTelefonico } from './GestorVirtual';  // Suponiendo que tienes un componente GestorTelefonico

import LogoutIcon from '@mui/icons-material/Logout';
const GestorVirtualTable = () => {
  const [search, setSearch] = useState('');  // Estado de búsqueda
  const [comboBox1, setComboBox1] = useState('');  // Estado para ComboBox 1 (Estrategia)
  const [comboBox2, setComboBox2] = useState('');  // Estado para ComboBox 2 (Gestor)
  const [gestoresEstrategias, setGestoresEstrategias] = useState([]);  // Datos de la primera API (estrategias)
  const [gestores, setGestores] = useState([]);  // Datos de la segunda API (gestores)
  const [bodega, setBodega] = useState([]);  // Datos de la tercera API (bodega)
  const [cboGestorCobranzas, setCboGestorCobranzas] = useState([]);  // Datos de la API para llenar la tabla
  const [loading, setLoading] = useState(false);  // Estado de carga
  const [showModal, setShowModal] = useState(false);  // Estado para mostrar el modal
  const [selectedItem, setSelectedItem] = useState(null);  // Estado para el item seleccionado
  // Estado para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Llamada a la API para obtener los gestores y estrategias
  const fetchGestoresEstrategias = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(APIURL.cbo_gestores_estrategias(), {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      setGestoresEstrategias(response.data.data);
    } catch (error) {
      console.error("Error fetching gestores estrategias:", error);
    } finally {
      setLoading(false);
    }
  };

  // Llamada a la API para obtener los gestores
  const fetchGestores = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(APIURL.Cbo_Gestores(), {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      setGestores(response.data.data);
    } catch (error) {
      console.error("Error fetching gestores:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBodega = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(APIURL.BodegaGet(), {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      console.log("bodega", response.data.data);
      setBodega(response.data.data);
    } catch (error) {
      console.error("Error fetching gestores:", error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setShowModal(false);
  };
  // Llamada a la API para obtener la data para la tabla (filtrada)
  const fetchGestorCobranzas = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const UrlGestor = APIURL.Cbo_gestor_cobranzas();
      const url = `${UrlGestor}?idCbo_Gestores=${comboBox2}&Bodega=${comboBox1}&page=${page}&limit=${limit}`;
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      setCboGestorCobranzas(response.data.data);  // Set the data for the table
      setTotalCount(response.data.totalCount);  // Asegúrate de que la API devuelva el total de registros
    } catch (error) {
      console.error("Error fetching gestor cobranzas:", error);
    } finally {
      setLoading(false);
    }
  };

  // Llamar las APIs al montar el componente
  useEffect(() => {
    fetchGestoresEstrategias();
    fetchGestores();
    fetchBodega();
    fetchGestorCobranzas(currentPage, itemsPerPage);
  }, []); // Se llama una vez al montar el componente

  // Llamar a la función fetchGestorCobranzas cuando los filtros cambian
  useEffect(() => {
    fetchGestorCobranzas(currentPage, itemsPerPage);
  }, [comboBox1, comboBox2, currentPage, itemsPerPage]);  // Se vuelve a llamar cuando cambia cualquiera de los filtros

  // Calcular el total de páginas
  console.log(totalCount, itemsPerPage);
  const totalPages = Math.ceil(totalCount / itemsPerPage);


  // Filtrar los datos de la tabla según el texto de búsqueda y los combos
  const filteredData = (cboGestorCobranzas || []).filter(item => {
    return (
      (item.Cliente.toLowerCase().includes(search.toLowerCase()) || item.Cedula.toLowerCase().includes(search.toLowerCase())) &&
      (comboBox1 ? item.Bodega === parseInt(comboBox1) : true) &&
      (comboBox2 ? item.idCbo_Gestores === parseInt(comboBox2) : true)
    );
  });

  // Función para manejar el cambio de página
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Función para manejar el cambio de número de elementos por página
  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);  // Resetear a la primera página cuando cambie el número de elementos por página
  };


  return (
    <div className="p-6 bg-gray-50">
      <div className="mb-6 flex space-x-4">
        <IconCard />
      </div>
      <div className="mb-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        {/* Campo de búsqueda */}
        <input
          type="text"
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg shadow-md w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* ComboBox 1 - Llenado dinámico desde la API (Estrategia) */}
        <select
          value={comboBox1}
          onChange={(e) => setComboBox1(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg shadow-md w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        >
          <option value="">Seleccionar Bodega</option>
          {bodega.map((item) => (
            <option key={item.Bodega} value={item.Bodega}>
              {item.Nombre}
            </option>
          ))}
        </select>

        {/* ComboBox 2 - Llenado dinámico desde la segunda API (Gestor) */}
        <select
          value={comboBox2}
          onChange={(e) => setComboBox2(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg shadow-md w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        >
          <option value="">Seleccionar Gestor</option>
          {gestores.map((item) => (
            <option key={item.idCbo_Gestores} value={item.idCbo_Gestores}>
              {item.Gestor}
            </option>
          ))}
        </select>
      </div>


      <div className="overflow-x-auto">
        <div className="overflow-y-auto max-h-[500px] rounded-lg shadow-lg bg-white">
          <table className="min-w-full table-auto border-collapse">
            <thead className="sticky top-0 bg-gradient-to-r from-blue-500 to-teal-400 text-white z-10">

              <tr className="bg-gradient-to-r from-blue-500 to-teal-400 text-white">
                {/* Las dos primeras columnas están ocultas */}
                <th className="px-4 py-3 border-b text-left ">Gestión</th>
                <th className="px-4 py-3 border-b text-left hidden">idCbo_Gestor_Cobranzas</th>
                <th className="px-4 py-3 border-b text-left hidden">idCompra</th>
                <th className="px-4 py-3 border-b text-left">Agente</th>
                <th className="px-4 py-3 border-b text-left">Bodega</th>
                <th className="px-4 py-3 border-b text-left hidden">idGestor</th>
                <th className="px-4 py-3 border-b text-left">Cedula</th>
                <th className="px-4 py-3 border-b text-left">Cliente</th>
                <th className="px-4 py-3 border-b text-left">Documento</th>
                <th className="px-4 py-3 border-b text-left">Cartera</th>
                <th className="px-4 py-3 border-b text-left">Direccion</th>
                <th className="px-4 py-3 border-b text-left">Referencia</th>
                <th className="px-4 py-3 border-b text-left">Barrio</th>
                <th className="px-4 py-3 border-b text-left">Celular</th>
                <th className="px-4 py-3 border-b text-left">Cuota</th>
                <th className="px-4 py-3 border-b text-left">Vence</th>
                <th className="px-4 py-3 border-b text-left">Cuotas Vencidas</th>
                <th className="px-4 py-3 border-b text-left">Cuotas Pendientes</th>
                <th className="px-4 py-3 border-b text-left">Dias Mora</th>
                <th className="px-4 py-3 border-b text-left">Valor Cuotas</th>
                <th className="px-4 py-3 border-b text-left">Mora</th>
                <th className="px-4 py-3 border-b text-left">Gastos</th>
                <th className="px-4 py-3 border-b text-left">Saldo Vencido</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr
                  key={item.idCbo_Gestor_Cobranzas}
                  className="border-b hover:bg-gray-50 transition duration-300 text-sm font-sans"
                >
                  {/* Ocultamos las dos primeras celdas */}
                  <td className="px-4 py-3 ">
                    <button onClick={() => openModal(item)} className="w-[100px] bg-black h-[30px] my-3 flex items-center justify-center rounded-xl cursor-pointer relative overflow-hidden transition-all duration-500 ease-in-out shadow-md hover:scale-105 hover:shadow-lg before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-[#009b49] before:to-[rgb(105,184,141)] before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-xl hover:before:left-0 text-[#fff]">
                      IR
                    </button>
                  </td>
                  <td className="px-4 py-3 hidden">{item.idCbo_Gestor_Cobranzas}</td>
                  <td className="px-4 py-3 hidden">{item.idCompra}</td>
                  <td className="px-4 py-3">{gestores.find(gestor => gestor.idCbo_Gestores === item.idCbo_Gestores)?.Gestor || 'Sin Gestor'}</td>
                  <td className="px-4 py-3">{bodega.find(bodega => bodega.Bodega === item.Bodega)?.Nombre || 'Sin Estrategia'}</td>
                  <td className="px-4 py-3 hidden">{item.idGestor}</td>
                  <td className="px-4 py-3">{item.Cedula}</td>
                  <td className="px-4 py-3">{item.Cliente}</td>
                  <td className="px-4 py-3">{item.Documento}</td>
                  <td className="px-4 py-3">{item.Cartera}</td>
                  <td className="px-4 py-3">{item.Direccion}</td>
                  <td className="px-4 py-3">{item.Referencia}</td>
                  <td className="px-4 py-3">{item.Barrio}</td>
                  <td className="px-4 py-3">{item.Celular}</td>
                  <td className="px-4 py-3">{item.Cuota}</td>
                  <td className="px-4 py-3">{item.Vence}</td>
                  <td className="px-4 py-3">{item.CuotasVencidas}</td>
                  <td className="px-4 py-3">{item.CuotasPendientes}</td>
                  <td className="px-4 py-3">{item.DiasMora}</td>
                  <td className="px-4 py-3">{(item.ValorCuotas || 0).toFixed(2)}</td>
                  <td className="px-4 py-3">{(item.Mora || 0).toFixed(2)}</td>
                  <td className="px-4 py-3">{(item.Gastos || 0).toFixed(2)}</td>
                  <td className="px-4 py-3">{(item.SaldoVencido || 0).toFixed(2)}</td>

                </tr>

              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginación */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 space-y-4 sm:space-y-0 sm:space-x-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
        >
          Anterior
        </button>

        <span>
          Página {currentPage} de {totalPages}
        </span>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
        >
          Siguiente
        </button>

        <select
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          {[10, 25, 50, 100].map((option) => (
            <option key={option} value={option}>
              {option} por página
            </option>
          ))}
        </select>
      </div>

      {showModal && (
        <GestorTelefonico selectedItem={selectedItem} closeModal={closeModal} />
      )}
    </div>
  );
};

export default GestorVirtualTable;

/* From Uiverse.io by Jules-gitclerc */


