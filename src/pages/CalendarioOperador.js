import React from "react";
import CiudadanosTable from "../components/CiudadanosTable";
import Layout from "../components/Layout";
import { CalendarPerson } from "../components";
const CalendarioOperador = () => {
  return (
    <>
      <Layout />
      <div>
        <CalendarPerson />
      </div>
    </>
  );
};

export default CalendarioOperador;
