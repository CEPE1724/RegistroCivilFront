import React from "react";
// import { SolicitudCreditoCrear } from '../components/SolicitudCredito';
import { AdministrableForm } from "../components/Seguridad/Administrable";
import Layout from "../components/Layout";

const Seguridad = () => {
    return (
        <>
            <Layout />
            <div className="w-full flex justify-center bg-[#ffffff] p-8 flex-col items-center">
                <AdministrableForm />
            </div>
        </>
    );
};

export default Seguridad;
