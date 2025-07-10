import React from "react";
import Layout from "../components/Layout";
import { ListaNegraEmails } from "../components/ListaNegraEmail/ListaNegraEmails";

const ListaNegraEmail = () => {
    return (
        <>
            <Layout />
            <div>
                <ListaNegraEmails />
            </div>
        </>
    );
};

export default ListaNegraEmail;
