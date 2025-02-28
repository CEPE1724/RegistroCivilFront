

import React, { Component } from 'react';
import Layout from "../components/Layout";

import { Cabecera, DatosCliente, DatosConyuge } from '../components'
const SolicitudGrande = () => {

    return (
        <>
            <Layout />
            <Cabecera />
            {/*<DatosCliente />
          
            <h1>SolicitudGrande</h1>*/}

            <DatosConyuge />

        </>
    )
}

export default SolicitudGrande;


// Compare this snippet from src/pages/VerificacionTelefonica.js: