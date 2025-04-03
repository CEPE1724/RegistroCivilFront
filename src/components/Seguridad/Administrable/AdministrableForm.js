import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaCheckCircle } from 'react-icons/fa';
import { APIURL } from '../../../configApi/apiConfig';

const menuItemsData = [
  { id: 1, name: 'Ciudadanos', route: '/ciudadanos' },
  { id: 2, name: 'Nueva Consulta', route: '/nueva-consulta' },
  { id: 3, name: 'Protección de Datos', route: '/proteccion-datos' },
  { id: 4, name: 'Solicitudes de Crédito', route: '/ListadoSolicitud' },
  { id: 5, name: 'Georeferencia Cliente', route: '/georeferencia' },
  { id: 6, name: 'Gestor Virtual', route: '#' },
  { id: 7, name: 'Gestor', route: '/gestor' },
];

export function AdministrableForm() {
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [menuItems] = useState(menuItemsData);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

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

  // Obtener usuarios por ID de rol
  const handleRoleChange = async (role) => {
    setSelectedRole(role);
    setSelectedUser(null);
    setSelectedPermissions([]);

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
    setSelectedPermissions([]);
  };

  const handlePermissionChange = (menuId) => {
    setSelectedPermissions((prev) =>
      prev.includes(menuId)
        ? prev.filter((id) => id !== menuId)
        : [...prev, menuId]
    );
  };

  const savePermissions = () => {
    alert('Permisos guardados correctamente');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Roles */}
        <div className="shadow-lg rounded-lg p-4 bg-white">
          <h2 className="text-xl font-semibold mb-4">Roles</h2>
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Rol</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
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
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Usuario</th>
                  <th className="px-4 py-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
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
            <h2 className="text-xl font-semibold mb-4">Asignar Permisos a {selectedUser.name}</h2>
            <table className="min-w-full table-auto mb-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Permiso</th>
                  <th className="px-4 py-2">Acción</th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{item.name}</td>
                    <td className="px-4 py-2">
                      <input
                        type="checkbox"
                        checked={selectedPermissions.includes(item.id)}
                        onChange={() => handlePermissionChange(item.id)}
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
