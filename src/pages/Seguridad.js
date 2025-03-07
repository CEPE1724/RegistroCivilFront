import React from "react";
// import { SolicitudCreditoCrear } from '../components/SolicitudCredito';
import { AdministrableForm } from "../components/Seguridad/Administrable";
import Layout from "../components/Layout";

const Seguridad = () => {
    return (
        <>
            <Layout />
            <div className="w-full min-h-screen flex justify-center bg-[#ffffff] p-8 flex-col items-center">
                <h2 className="pb-2 col-span-1 text-primaryBlue text-center text-2xl lg:col-span-2 font-semibold">
                    Solicitud de Crédito
                </h2>
                <AdministrableForm />
            </div>
        </>
    );
};

export default Seguridad;
