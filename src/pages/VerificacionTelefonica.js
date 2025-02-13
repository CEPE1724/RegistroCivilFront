import React from "react";
import { GestorOperadora } from '../components/VerificacionTelefonica';
import Layout from "../components/Layout";
const VerificacionTelefonica = () => {
  return (
    <>
      <Layout/>
        <div>
            <GestorOperadora />
        </div>
    </>
  );
};

export default VerificacionTelefonica;