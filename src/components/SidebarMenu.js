import * as React from "react";
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
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import SecurityIcon from '@mui/icons-material/Security';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import Collapse from "@mui/material/Collapse";
export default function SwipeableTemporaryDrawer() {
  const [open, setOpen] = React.useState(false);
  const [openGestor, setOpenGestor] = React.useState(false); // Controlar submenú Gestor
  const LogoIco = "/img/logo.webp"; // Ruta relativa desde la carpeta public

  const handleGestorClick = (event) => {
    event.stopPropagation();  // Evitar que se cierre el menú
    setOpenGestor(!openGestor);
  };

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
            <div className="bg-morado py-2 lg:px-1 h-20 flex justify-center items-center">
              <Link to="/">
                <img
                  className="sm:w-24 w-24 lg:w-36 mx-auto cursor-pointer"
                  src={LogoIco}
                  alt="Logo Point"
                />
              </Link>
            </div>

            {/* Ciudadanos */}
            <ListItem disablePadding>
              <ListItemButton component={Link} to={"/ciudadanos"}>
                <ListItemIcon>
                  <GroupIcon className="mr-2" />
                  Ciudadanos
                </ListItemIcon>
                <ListItemText />
              </ListItemButton>
            </ListItem>

            {/* Nueva Consulta */}
            <ListItem disablePadding>
              <ListItemButton component={Link} to={"/nueva-consulta"}>
                <ListItemIcon>
                  <ContentPasteSearchIcon className="mr-2" />
                  Nueva Consulta
                </ListItemIcon>
                <ListItemText />
              </ListItemButton>
            </ListItem>

            {/* Proteccion de Datos */}
            <ListItem disablePadding>
              <ListItemButton component={Link} to={"/proteccion-datos"}>
                <ListItemIcon>
                  <SecurityIcon className="mr-2" />
                  Protección de Datos
                </ListItemIcon>
                <ListItemText />
              </ListItemButton>
            </ListItem>

            {/* Gestor Virtual - con submenú */}
            <ListItem disablePadding>
              <ListItemButton onClick={handleGestorClick}>
                <ListItemIcon>
                  <PersonSearchIcon className="mr-2" />
                </ListItemIcon>
                <ListItemText primary="Gestor Virtual" />
              </ListItemButton>
            </ListItem>
            <Collapse in={openGestor} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton component={Link} to={"/gestor"}> 
                  <ListItemIcon>
                    <ManageAccountsIcon className="mr-2" /> 
                  </ListItemIcon>              
                  <ListItemText inset primary="Gestor"
                  />
                </ListItemButton>                             
              </List>
            </Collapse>
          </List>
        </Box>
      </SwipeableDrawer>
    </div>
  );
}
