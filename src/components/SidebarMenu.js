import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import GroupIcon from "@mui/icons-material/Group";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import SecurityIcon from "@mui/icons-material/Security";
import PersonIcon from "@mui/icons-material/Person";
import GpsFixed from "@mui/icons-material/GpsFixed";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import Collapse from "@mui/material/Collapse";
import axios from "axios"; // Importando axios
import { APIURL } from "../configApi/apiConfig";
export function SwipeableTemporaryDrawer({ userDataToken }) {
  const [open, setOpen] = useState(false);
  const [openGestor, setOpenGestor] = useState(false);
  const [userData, setUserData] = useState([]);
  const handleGestorClick = (event) => {
    event.stopPropagation();
    setOpenGestor(!openGestor);
  };

  // Fetching data from the API with axios
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
    fetchBodegaUsuario();
  }, []);

  const fetchBodegaUsuario = async () => {
    try {
      console.log("Fetching data...", userData);
      // Definir los parámetros que quieres enviar
      const params = {
        userId: userDataToken.idUsuario,  // Ejemplo de ID de usuario
        idTipoFactura: 43,  // Ejemplo de tipo de factura
        fecha: '2025-03-06T00:00:00.000Z',  // Fecha en formato ISO 8601
        recibeConsignacion: true  // Parámetro de consignación
      };

      // Realizar la solicitud GET pasando los parámetros en la propiedad 'params'
      const response = await axios.get(APIURL.getUsuarioBodega(), { params });

      // Manejar la respuesta
    } catch (error) {
      // Manejo de errores
      console.error("Error fetching data:", error);
    }
  };
  // Filtrar los datos de menú para los elementos principales
  const menuItems = userData.map(item => item.i_parent_id === null ? item : null).filter(Boolean);

  // Reusable ListItem Component
  const MenuItem = ({ to, icon, text }) => (
    <ListItem disablePadding>
      <ListItemButton component={Link} to={to}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={text} />
      </ListItemButton>
    </ListItem>
  );

  // Gestor Virtual Submenu
  const GestorSubMenu = ({ open, onToggle }) => (
    <Collapse in={open} timeout="auto" unmountOnExit>
      <List component="div" disablePadding>
        <ListItemButton component={Link} to="/gestor">
          <ListItemIcon>
            <ManageAccountsIcon className="mr-2" />
          </ListItemIcon>
          <ListItemText inset primary="Gestor" />
        </ListItemButton>
      </List>
    </Collapse>
  );

  return (
    <div>
      <button className="ml-2 mr-4 text-white" onClick={() => setOpen(true)}>
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
            <div className="bg-morado py-2 lg:px-1 h-20 flex justify-center items-center">
              <Link to="/">
                <img
                  className="sm:w-24 w-24 lg:w-36 mx-auto cursor-pointer"
                  src="/img/logo.webp"
                  alt="Logo Point"
                />
              </Link>
            </div>

            {/* Render dynamic menu items */}
            {menuItems.map((menuItem) => {
              const { i_idmenu_items, i_name, i_route, i_icon } = menuItem;

              // Asignar iconos dinámicamente
              let icon;
              switch (i_icon) {
                case "GroupIcon":
                  icon = <GroupIcon />;
                  break;
                case "ContentPasteSearchIcon":
                  icon = <ContentPasteSearchIcon />;
                  break;
                case "SecurityIcon":
                  icon = <SecurityIcon />;
                  break;
                case "PersonIcon":
                  icon = <PersonIcon />;
                  break;
                case "GpsFixed":
                  icon = <GpsFixed />;
                  break;
                case "PersonSearchIcon":
                  icon = <PersonSearchIcon />;
                  break;
                case "ManageAccountsIcon":
                  icon = <ManageAccountsIcon />;
                  break;
                default:
                  icon = <GroupIcon />;
                  break;
              }

              return (
                <MenuItem
                  key={i_idmenu_items}
                  to={i_route}
                  icon={icon}
                  text={i_name}
                />
              );
            })}

            {/* Gestor Virtual - with submenu */}
            {menuItems.some(item => item.i_idmenu_items === 6) && (
              <ListItem disablePadding>
                <ListItemButton onClick={handleGestorClick}>
                  <ListItemIcon>
                    <PersonSearchIcon className="mr-2" />
                  </ListItemIcon>
                  <ListItemText primary="Gestor Virtual" />
                </ListItemButton>
              </ListItem>
            )}

            <GestorSubMenu open={openGestor} onToggle={handleGestorClick} />
          </List>
        </Box>
      </SwipeableDrawer>
    </div>
  );
};


