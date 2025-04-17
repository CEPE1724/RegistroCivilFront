import React from "react";
import Layout from "../components/Layout";
import {ListaNegraTelefonos } from "../components/ListaNegraTelefonos/ListaNegraTelefonos";
const ListaNegra = () => {
    return (
        <>
        <Layout />
        <div>
            <ListaNegraTelefonos/>
        </div>
        </>
    );
    }
export default ListaNegra;