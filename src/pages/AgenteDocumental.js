import React from "react";
import CiudadanosTable from "../components/CiudadanosTable";
import Layout from "../components/Layout";
import { DocumentoSolicitud } from "../components";
const AgenteDocumental = () => {
  return (
    <>
      <Layout />
      <div>
        <DocumentoSolicitud />
      </div>
    </>
  );
};

export default AgenteDocumental;
