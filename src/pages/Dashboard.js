import React from "react";
import {Dashboards}  from "../components/Dashboards";
import Layout from "../components/Layout";
const Dashboard = () => {
  return (
    <>
      <Layout />
      <div>
        <Dashboards/>
      </div>
    </>
  );
};

export default Dashboard;