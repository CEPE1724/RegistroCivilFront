import React from 'react';
import { GestorDocumentos } from '../components/GestDocumentos/GestorDocumentos';
import Layout from "../components/Layout";

const GestorDocumentosCli = () => {
    return (
        <>
            <Layout />
            <div>
                <GestorDocumentos />
            </div>
        </>
    );
}

export default GestorDocumentosCli;