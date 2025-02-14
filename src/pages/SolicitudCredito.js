import React from "react";
import { SolicitudCreditoCrear } from '../components/SolicitudCredito';
import Layout from "../components/Layout";
const SolicitudCredito = () => {
  return (
    <>
      <Layout/>
      <div>
        <SolicitudCreditoCrear />
      </div>
    </>
  );
};
export default SolicitudCredito;
