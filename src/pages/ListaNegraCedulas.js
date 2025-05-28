import React from "react";
import Layout from "../components/Layout";
import { ListaNegraCedulas } from "../components/ListaNegraCedula/ListaNegraCedulas";
const ListaNegraCedula = () => {
    return (
        <>
        <Layout />
        <div>
            <ListaNegraCedulas/>
        </div>
        </>
    );
    }
export default ListaNegraCedula;