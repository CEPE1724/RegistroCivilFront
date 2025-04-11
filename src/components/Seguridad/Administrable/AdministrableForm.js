import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaCheckCircle, FaSearch } from "react-icons/fa";
import { APIURL } from "../../../configApi/apiConfig";
import VisibilityIcon from "@mui/icons-material/Visibility";

export function AdministrableForm() {
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [menuItems, setMenuItems] = useState([]); // Para los menús
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [menuItemsOriginal, setMenuItemsOriginal] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [modalAccessData, setModalAccessData] = useState([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);

  // States para búsqueda
  const [searchRole, setSearchRole] = useState("");
  const [searchUser, setSearchUser] = useState("");

  // Obtener roles al montar
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(APIURL.getRolesWeb());
        setRoles(response.data);
      } catch (error) {
        console.error("Error al obtener roles:", error);
      }
    };

    fetchRoles();
  }, []);

  // Obtener menús por ID de usuario (APIURL.getMenuPorusuario())
  useEffect(() => {
    if (selectedUser) {
      const fetchMenuItems = async () => {
        try {
          const response = await axios.get(
            APIURL.getMenuPorusuario(selectedUser.idUsuario)
          );
          setMenuItems(response.data); // Aquí llenamos los menús con los datos de la API
          setMenuItemsOriginal(response.data);
        } catch (error) {
          console.error("Error al obtener menús:", error);
        }
      };

      fetchMenuItems();
    }
  }, [selectedUser]); // Ahora, este effect depende de selectedUser

  // Obtener usuarios por ID de rol
  const handleRoleChange = async (role) => {
    setSelectedRole(role);
    setSelectedUser(null); // Restablecer el usuario cuando cambie el rol

    try {
      const response = await axios.get(
        APIURL.getUsuarioPorROL(role.idRolesWeb)
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error al obtener usuarios por rol:", error);
      setUsers([]);
    }
  };

  const handleUserChange = (user) => {
    setSelectedUser(user);
  };

  const savePermissions = async () => {
    const operaciones = menuItems.map(async (item) => {
      const original = menuItemsOriginal.find(
        (orig) => orig.m_idmenu_items === item.m_idmenu_items
      );

      const originalId = original?.idmenu_item_roles || 0;

      //  eliminar
      if (originalId > 0 && item.idmenu_item_roles === 0) {
        try {
          await axios.delete(
            APIURL.deletePermisoUsuario(selectedUser.idUsuario, originalId)
          );
        } catch (error) {
          console.error(`Error eliminando permiso ${originalId}`, error);
        }
      }

      // crear
      if (originalId === 0 && item.idmenu_item_roles === -1) {
        try {
          const response = await axios.post(
            APIURL.createPermisoUsuario(
              selectedUser.idUsuario,
              item.m_idmenu_items
            )
          );
          item.idmenu_item_roles = response.data?.idmenu_item_roles || 1;
        } catch (error) {
          console.error(
            `Error creando permiso para ${item.m_idmenu_items}`,
            error
          );
        }
      }

      return item;
    });

    const resultados = await Promise.all(operaciones);
    setMenuItems(resultados);
    setMenuItemsOriginal(JSON.parse(JSON.stringify(resultados))); // deep clone actualizado

    setIsSaving(false);
    alert("Permisos guardados correctamente");
  };

  // Filtrar roles y usuarios según la búsqueda
  const filteredRoles = roles.filter((role) =>
    role.Nombre.toLowerCase().includes(searchRole.toLowerCase())
  );

  const filteredUsers = users.filter((user) =>
    user.Nombre.toLowerCase().includes(searchUser.toLowerCase())
  );

  const handleTogglePermission = async (menuId) => {
    const updatedItems = await Promise.all(
      menuItems.map(async (item) => {
        if (item.m_idmenu_items !== menuId) return item;

        try {
          if (item.idmenu_item_roles > 0) {
            // Eliminar permiso
            await axios.delete(
              APIURL.deletePermisoUsuario(
                selectedUser.idUsuario,
                item.idmenu_item_roles
              )
            );
            return { ...item, idmenu_item_roles: 0 };
          } else {
            // Crear permiso
            const response = await axios.post(
              APIURL.createPermisoUsuario(
                selectedUser.idUsuario,
                item.m_idmenu_items
              )
            );
            const newId = response.data?.idmenu_item_roles || 1;
            return { ...item, idmenu_item_roles: newId };
          }
        } catch (error) {
          console.error("Error al actualizar permiso:", error);
          return item; // no modificar en caso de error
        }
      })
    );

    setMenuItems(updatedItems);
  };

  const openModal = async (menuItem) => {
    try {
      const response = await axios.get(
        APIURL.getRolesAccesos(selectedUser.idUsuario, menuItem.m_idmenu_items)
      );
      setModalAccessData(response.data);
      setSelectedMenuItem(menuItem); // Esto mantiene el item con su `idmenu_item_roles`
      setShowModal(true);
    } catch (error) {
      console.error("Error al cargar accesos del usuario:", error);
    }
  };

  const closeModal = () => {
    setSelectedMenuItem(null);
    setShowModal(false);
  };

  const handleToggleAccess = async (accessItem) => {
	const updatedAccesses = await Promise.all(
	  modalAccessData.map(async (item) => {
		if (item.m_idmenu_items_access !== accessItem.m_idmenu_items_access) return item;
  
		try {
		  if (item.Activo) {
			// Eliminar acceso
			await axios.delete(APIURL.deleteRolesAccesos(
			  selectedUser.idUsuario,
			  accessItem.m_idmenu_items_access
			));

		  } else {
			// Crear acceso
			await axios.post(APIURL.createRolesAccesos(
			  selectedUser.idUsuario,
			  accessItem.m_idmenu_items_access
			));
		  }
		} catch (error) {
		  console.error("Error al actualizar acceso:", error);
		}
  
		return {
		  ...item,
		  Activo: !item.Activo,
		};
	  })
	);
  
	setModalAccessData(updatedAccesses);
  };
  
  

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Roles */}
        <div className="shadow-lg rounded-lg max-h-[400px] overflow-y-auto bg-white">
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
          <div className="shadow-lg rounded-lg p-4 max-h-[400px] overflow-y-auto bg-white">
            <h2 className="text-xl font-semibold mb-4">
              Usuarios en el Rol {selectedRole.Nombre}
            </h2>
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
          <div className="shadow-lg rounded-lg p-4 max-h-[400px] overflow-y-auto bg-white col-span-1 lg:col-span-3">
            <h2 className="text-xl font-semibold mb-4">
              Asignar Permisos a {selectedUser.Nombre}
            </h2>
            <table className="min-w-full table-auto mb-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Permiso</th>
                  <th className="px-4 py-2">Acción</th>
                </tr>
              </thead>
              <tbody>
                {menuItems?.map((item) => {
                  return (
                    <tr
                      key={item.m_idmenu_items}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="px-4 py-2">{item.menu_name}</td>
                      <td className="px-4 py-2">
                        <div className="flex justify-center items-center space-x-8">
                          <input
                            type="checkbox"
                            checked={item.idmenu_item_roles !== 0}
                            onChange={() =>
                              handleTogglePermission(item.m_idmenu_items)
                            }
                            className="form-checkbox h-5 w-5 text-blue-500"
                          />
                          <button
                            onClick={() => openModal(item)}
                            className="text-gray-600 hover:text-blue-600 transition-all"
                            title="Ver más"
                          >
                            <VisibilityIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {showModal && selectedMenuItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-xl relative max-h-[500px] overflow-y-auto">
              <h3 className="text-lg font-bold mb-4">
                Accesos del Menú: {selectedMenuItem.menu_name}
              </h3>

              <div className="overflow-y-auto max-h-[350px]">
                <table className="min-w-full table-auto mb-4 border rounded">
                  <thead>
                    <tr className="bg-gray-100 sticky top-0">
                      <th className="px-4 py-2">ID Acceso</th>
                      <th className="px-4 py-2">Permiso</th>
                      <th className="px-4 py-2">Check</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modalAccessData.map((access) => (
                      <tr key={access.idmenu_items_access} className="border-b">
                        <td className="px-4 py-2">
                          {access.m_idmenu_items_access}
                        </td>
                        <td className="px-4 py-2">{access.Permisos}</td>
                        <td className="px-4 py-2 text-center">
                          <input
                            type="checkbox"
                            checked={access.Activo === true}
                            onChange={() => handleToggleAccess(access)}
                            className="form-checkbox text-blue-500"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
