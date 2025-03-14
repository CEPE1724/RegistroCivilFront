import React from 'react';
import { TelefonicaList } from '../components/Telefonica/Telefonica';
import Layout from "../components/Layout";

const TelefonicaListSol = () => {
    return (
        <>
            <Layout />
            <div>
                <TelefonicaList />
            </div>
        </>
    );
}

export default TelefonicaListSol;