import React, { useState, useEffect } from 'react';
import { FaEdit, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; // Iconos de react-icons

// Datos quemados (simulando lo que se recibiría de la API)
const rolesData = [
  { id: 1, name: 'Admin' },
  { id: 2, name: 'User' },
  { id: 3, name: 'Gestor' },
];

const usersData = [
  { id: 1, name: 'Juan Pérez', roleId: 1 },
  { id: 2, name: 'Ana García', roleId: 1 },
  { id: 3, name: 'Carlos Sánchez', roleId: 2 },
  { id: 4, name: 'María López', roleId: 3 },
  { id: 5, name: 'Luis Rodríguez', roleId: 2 },
];

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
  const [roles, setRoles] = useState(rolesData);
  const [users, setUsers] = useState(usersData);
  const [menuItems, setMenuItems] = useState(menuItemsData);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  // Filtrar los usuarios por el rol seleccionado
  const filteredUsers = users.filter(user => user.roleId === selectedRole?.id);

  // Manejar el cambio de rol
  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setSelectedUser(null); // Resetear el usuario seleccionado
    setSelectedPermissions([]); // Resetear permisos
  };

  // Manejar el cambio de usuario
  const handleUserChange = (user) => {
    setSelectedUser(user);
    setSelectedPermissions([]); // Resetear permisos al seleccionar un nuevo usuario
  };

  // Manejar el cambio de permisos
  const handlePermissionChange = (menuId) => {
    setSelectedPermissions((prevPermissions) =>
      prevPermissions.includes(menuId)
        ? prevPermissions.filter((id) => id !== menuId)
        : [...prevPermissions, menuId]
    );
  };

  // Guardar los permisos (simulación)
  const savePermissions = () => {
    console.log('Permisos guardados:', {
      userId: selectedUser?.id,
      menuItemIds: selectedPermissions,
    });
    alert('Permissions saved!');
  };

  return (
    <div className="p-6 space-y-6">

      {/* Contenedor Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Sección de Roles */}
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
                <tr key={role.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{role.name}</td>
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

        {/* Sección de Usuarios */}
        {selectedRole && (
          <div className="shadow-lg rounded-lg p-4 bg-white">
            <h2 className="text-xl font-semibold mb-4">Usuarios en el Rol {selectedRole.name}</h2>
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
                    <td className="px-4 py-2">{user.name}</td>
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

        {/* Sección de Permisos */}
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

            {/* Botón para guardar permisos */}
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
