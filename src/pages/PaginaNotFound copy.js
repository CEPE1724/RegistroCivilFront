import React from "react";
import MySVG from "../img/notFound.png";
import ReplyAllIcon from "@mui/icons-material/ReplyAll";
const NotFoundPage = () => {
  const LogoIco = "/img/logo.webp"; // Ruta relativa desde la carpeta public

  return (
    <>
      <nav className="lg:px-16 w-full h-20 bg-morado px-4 py-3 text-white flex items-center justify-between">
        <div>
          <img
            className="w-36 mx-4 sm:mx-auto cursor-pointer"
            src={LogoIco}
            alt="Logo Point"
          />
        </div>
        <div className="ml-4 sm:ml-0">
          <a href="/" id="aPoint" className="flex items-center">
            <ReplyAllIcon className="ml-1" />&nbsp;&nbsp;Vover al Inicio</a>
        </div>
      </nav>
      <div className="mt-2 flex justify-center">
        <img
          className="pointer-events-none w-full lg:w-2/3"
          src={MySVG}
          alt="Pagina no encontrada"
        />
        <div className="mt-8 flex items-center justify-center text-center"></div>
      </div>
    </>
  );
};

export default NotFoundPage;
