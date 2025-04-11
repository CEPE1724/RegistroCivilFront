import React, { useState } from "react";
import { Link } from "react-router-dom";
import { SwipeableTemporaryDrawer} from "../components/SidebarMenu";
import DropDown from "./DropDows";

const Nav = ({ showButton, userData }) => {
  const LogoIco = "/img/logo.webp"; // Ruta relativa desde la carpeta public
  return (
    <nav className="lg:px-12 w-full h-20 bg-morado px-4 py-3 text-white flex items-center justify-between static">
      <div className="flex items-center">
        {userData && <SwipeableTemporaryDrawer userDataToken ={userData} className="flex-shrink-0 w-full md:w-auto" />}
        <Link to="/dashboard" className="ml-4">
          <img
            className="w-24 lg:w-36 cursor-pointer"
            src={LogoIco}
            alt="Logo Point"
          />
        </Link>
      </div>
      {showButton && (
        <div className="flex space-x-8 items-center justify-end flex-shrink-0">
          <span className="ml-4 truncate max-w-xs">
            {" "}
            {userData.Nombre}
          </span>
          <DropDown />
        </div>
      )}
    </nav>
  );
};

export default Nav;
