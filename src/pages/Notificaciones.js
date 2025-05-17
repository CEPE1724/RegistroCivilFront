import React from "react";
import { Notificaciones } from "../components/Notificaciones";

import Layout from "../components/Layout";
const NotificacionesCli = () => {
  return (
	<>
	  <Layout/>
		<div>
			<Notificaciones />
		</div>
	</>
  );
};

export default NotificacionesCli;