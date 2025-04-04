import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaCheckCircle, FaSearch } from 'react-icons/fa';
import { APIURL } from '../../../configApi/apiConfig';

export function AdministrableForm() {
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [menuItems, setMenuItems] = useState([]); // Para los menús
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // States para búsqueda
  const [searchRole, setSearchRole] = useState('');
  const [searchUser, setSearchUser] = useState('');

  // Obtener roles al montar
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(APIURL.getRolesWeb());
        setRoles(response.data);
      } catch (error) {
        console.error('Error al obtener roles:', error);
      }
    };

    fetchRoles();
  }, []);

  // Obtener menús por ID de usuario (APIURL.getMenuPorusuario())
  useEffect(() => {
    if (selectedUser) {
      const fetchMenuItems = async () => {
        try {
          const response = await axios.get(APIURL.getMenuPorusuario(selectedUser.idUsuario));
          setMenuItems(response.data); // Aquí llenamos los menús con los datos de la API
        } catch (error) {
          console.error('Error al obtener menús:', error);
        }
      };

      fetchMenuItems();
    }
  }, [selectedUser]);  // Ahora, este effect depende de selectedUser

  // Obtener usuarios por ID de rol
  const handleRoleChange = async (role) => {
    setSelectedRole(role);
    setSelectedUser(null); // Restablecer el usuario cuando cambie el rol

    try {
      const response = await axios.get(APIURL.getUsuarioPorROL(role.idRolesWeb));
      setUsers(response.data);
    } catch (error) {
      console.error('Error al obtener usuarios por rol:', error);
      setUsers([]);
    }
  };

  const handleUserChange = (user) => {
    setSelectedUser(user);
  };

  const savePermissions = () => {
    alert('Permisos guardados correctamente');
  };

  // Filtrar roles y usuarios según la búsqueda
  const filteredRoles = roles.filter(role =>
    role.Nombre.toLowerCase().includes(searchRole.toLowerCase())
  );

  const filteredUsers = users.filter(user =>
    user.Nombre.toLowerCase().includes(searchUser.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Roles */}
        <div className="shadow-lg rounded-lg p-4 bg-white">
          <h2 className="text-xl font-semibold mb-4">Roles</h2>
          <div className="mb-4 flex items-center space-x-2">
            <FaSearch className="text-gray-500" />
            <input
              type="text"
              placeholder="Buscar Rol"
              value={searchRole}
              onChange={(e) => setSearchRole(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Rol</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoles.map((role) => (
                <tr key={role.idRolesWeb} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{role.Nombre}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleRoleChange(role)}
                      className="text-blue-500 hover:text-blue-700 transition-all"
                    >
                      <FaEdit />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Usuarios */}
        {selectedRole && (
          <div className="shadow-lg rounded-lg p-4 bg-white">
            <h2 className="text-xl font-semibold mb-4">Usuarios en el Rol {selectedRole.Nombre}</h2>
            <div className="mb-4 flex items-center space-x-2">
              <FaSearch className="text-gray-500" />
              <input
                type="text"
                placeholder="Buscar Usuario"
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Usuario</th>
                  <th className="px-4 py-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{user.Nombre}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleUserChange(user)}
                        className="text-blue-500 hover:text-blue-700 transition-all"
                      >
                        <FaEdit />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Permisos */}
        {selectedUser && (
          <div className="shadow-lg rounded-lg p-4 bg-white col-span-1 lg:col-span-3">
            <h2 className="text-xl font-semibold mb-4">Asignar Permisos a {selectedUser.Nombre}</h2>
            <table className="min-w-full table-auto mb-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Permiso</th>
                  <th className="px-4 py-2">Acción</th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map((item) => (
                  <tr key={item.m_idmenu_items} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{item.menu_name}</td>
                    <td className="px-4 py-2">
                      <input
                        type="checkbox"
                        checked={item.idmenu_item_roles > 0} // Verificamos si tiene rol o está en permisos seleccionados
                        
                        className="form-checkbox h-5 w-5 text-blue-500"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              onClick={savePermissions}
              className="mt-4 bg-blue-500 text-white p-2 rounded-md w-full hover:bg-blue-600 transition-all"
            >
              <FaCheckCircle className="inline-block mr-2" />
              Guardar Permisos
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
