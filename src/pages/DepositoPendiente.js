import React from "react";
import {DepositosPendientes} from "../components/DepositosPendientes";
import Layout from "../components/Layout";
const DepositoPendiente = () => {
  return (
    <>
      <Layout/>
      <div>
        <DepositosPendientes />
      </div>
    </>
  );
};

export default DepositoPendiente;
