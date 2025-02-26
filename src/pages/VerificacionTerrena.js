import React from "react";
import { GestorTerrena } from '../components/VerificacionTerrena';
import Layout from "../components/Layout";
const VerificacionTerrena = () => {
  return (
    <>
      <Layout/>
        <div>
            <GestorTerrena/>
        </div>
    </>
  );
};

export default VerificacionTerrena;