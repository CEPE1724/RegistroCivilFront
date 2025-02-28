

import React, { Component } from 'react';
import Layout from "../components/Layout";

import { Cabecera, DatosCliente, DatosConyuge, Referencias } from '../components'
const SolicitudGrande = () => {

    return (
        <>
            <Layout />
            <Cabecera />
            /* Kevin genera una copia del encabezado y hace un tab menu con los siguienets datos*/
            -Datos cliente - 
            Datos Conyuge - 
            Sección A Negocio  -  
            <DatosCliente />
            /*eduardo genera todo el diseño que esta  en el tab de Datos cliente*/

            solo visual no funcionalidad
            <h1>SolicitudGrande</h1>

            <DatosConyuge />
            ""
            <Referencias />

        </>
    )
}

export default SolicitudGrande;


// Compare this snippet from src/pages/VerificacionTelefonica.js: