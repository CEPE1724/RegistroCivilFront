import React from "react";
import DataProtectionTable from "../components/DataProtectionTable";
import Layout from "../components/Layout";
const DataProtection = () => {
  return (
    <>
      <Layout/>
      <div>
        <DataProtectionTable />
      </div>
    </>
  );
};

export default DataProtection;
