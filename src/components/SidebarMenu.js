import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import GroupIcon from "@mui/icons-material/Group";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import SecurityIcon from "@mui/icons-material/Security";
import PersonIcon from "@mui/icons-material/Person";
import GpsFixed from "@mui/icons-material/GpsFixed";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"; // Flecha para submenú
import Collapse from "@mui/material/Collapse";
import axios from "axios"; // Importando axios
import { APIURL } from "../configApi/apiConfig";
import { useAuth } from "./AuthContext/AuthContext"; // Importando el contexto de autenticación
export function SwipeableTemporaryDrawer({ userDataToken }) {
  const [open, setOpen] = useState(false);
  const [openSubMenus, setOpenSubMenus] = useState({});
  const [userData, setUserData] = useState([]);
  const { setMenuId } = useAuth();  // Obtener la función de actualización
 

  // Fetching data from the API with axios
  /*
  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = APIURL.getMenu(userDataToken.idUsuario);
        const response = await axios.get(url);
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userDataToken]);*/

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token'); // Obtenemos el token del localStorage
  
        if (!token) {
          console.error('No token found');
          return;
        }
  
        const url = APIURL.getMenu(userDataToken.idUsuario);
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`, // Enviamos el token en la cabecera
          },
        });
  
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    if (userDataToken?.idUsuario) {
      fetchData();
    }
  }, [userDataToken]);
  


  // Filtrar los datos de menú para los elementos principales
  const menuItems = userData.filter(item => item.i_parent_id === null || item.i_parent_id === 0);

  // Función recursiva para crear submenús
  const createSubMenu = (parentId) => {
    return userData
      .filter(item => item.i_parent_id === parentId)
      .map(item => ({
        ...item,
        children: createSubMenu(item.i_idmenu_items), // Recursivamente crea submenús
      }));
  };

  // Función para manejar el toggle de submenú
  const handleSubMenuToggle = (id) => {
    setOpenSubMenus(prevState => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  // Asignar íconos dinámicamente
  const getIcon = (iconName) => {
    switch (iconName) {
      case "GroupIcon": return <GroupIcon />;
      case "ContentPasteSearchIcon": return <ContentPasteSearchIcon />;
      case "SecurityIcon": return <SecurityIcon />;
      case "PersonIcon": return <PersonIcon />;
      case "GpsFixed": return <GpsFixed />;
      case "PersonSearchIcon": return <PersonSearchIcon />;
      case "ManageAccountsIcon": return <ManageAccountsIcon />;
      default: return <GroupIcon />;
    }
  };

  const handleMenuClick = ( id, children) => {
   
    setMenuId(id); // Actualizamos el id del menú al hacer clic
    if (children) {
      handleSubMenuToggle(id); // Gestionamos el toggle del submenú si hay hijos
    }
  };
  // Componente de Item de Menú
  const MenuItem = ({  to, icon, text, id, children }) => (
    <div>
      <ListItem disablePadding>
        <ListItemButton
          component={to ? Link : 'button'} // Usamos Link solo si `to` está definido
          to={to}  // Usamos la ruta si existe
          onClick={ () => handleMenuClick( id, children)} // Manejo de clics
        >
          <ListItemIcon>{icon}</ListItemIcon>
          <ListItemText primary={text} />
          {children && (
            <ListItemIcon>
              <ArrowForwardIosIcon style={{ transform: openSubMenus[id] ? "rotate(90deg)" : "rotate(0deg)" }} />
            </ListItemIcon>
          )}
        </ListItemButton>
      </ListItem>
      {children && openSubMenus[id] && (
        <Collapse in={openSubMenus[id]} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {children.map((subMenu) => (
              <MenuItem
                key={subMenu.i_idmenu_items}
                to={subMenu.i_route} // Aquí ahora se usa la ruta correcta para submenú//
                icon={getIcon(subMenu.i_icon)}
                text={subMenu.i_name}
                id={subMenu.i_idmenu_items}
                children={subMenu.children} // Recursividad para submenú
              />
            ))}
          </List>
        </Collapse>
      )}
    </div>
  );

  // Crear la estructura del menú con los submenús
  const structuredMenuItems = menuItems.map((menuItem) => {
    const { i_idmenu_items, i_name, i_route, i_icon } = menuItem;
    const icon = getIcon(i_icon);
    const subMenu = createSubMenu(i_idmenu_items); // Creando los submenús automáticamente
    return (
      <MenuItem
        to={i_route || '#'} // Ahora los menús principales también tienen su ruta
        icon={icon}
        text={i_name}
        id={i_idmenu_items}
        children={subMenu} // Enviando los submenús si existen
      />
    );
  });

  return (
    <div>
      <button
        className="ml-2 mr-4 text-white p-2 bg-morado rounded-full hover:bg-morado focus:outline-none"
        onClick={() => setOpen(true)}
      >
        <MenuIcon />
      </button>

      <SwipeableDrawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        PaperProps={{ sx: { width: 300 } }}
      >
        <Box
          sx={{ width: 300 }}
          role="presentation"
          onClick={() => setOpen(false)}
          onKeyDown={() => setOpen(false)}
        >
          <List sx={{ padding: 0 }}>
            {/* Logo */}
            <div className="bg-morado py-2 h-20 flex justify-center items-center">
            <Link to="/dashboard" className="ml-4">
                <img
                  className="sm:w-24 w-24 lg:w-36 mx-auto cursor-pointer"
                  src="/img/logo.webp"
                  alt="Logo Point"
                />
             </Link>
            </div>
            {/* Render de los elementos del menú principal */}
            {structuredMenuItems}
          </List>
        </Box>
      </SwipeableDrawer>
    </div>
  );
}
