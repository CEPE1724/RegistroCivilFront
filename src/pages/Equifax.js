import { ReporteEquifax } from "../components/Equifax/ReporteEquifax";
import Layout from "../components/Layout";
import React, { useState } from "react";

const Equifax = () => {
  const [imprimiendo, setImprimiendo] = useState(false);

  return (
    <>
      
      {!imprimiendo && <Layout />}
      <ReporteEquifax setImprimiendo={setImprimiendo} />
    </>
  );
};

export default Equifax;
