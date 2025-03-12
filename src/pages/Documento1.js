import { Documental } from '../components/Documental/Documental';
import Layout from "../components/Layout";
import { useLocation } from "react-router-dom";
const Documento1 = () => {
    const location = useLocation();
    const {
        id,
        NumeroSolicitud,
        nombre,
        cedula,
        fecha,
        almacen,
        foto,
        vendedor,
        consulta,
    } = location.state || {}; // Si location.state es undefined, se asegura de no romper el código
    if (!id) {
        console.error("No se encontraron datos en la ubicación");
    }

    return (
        <>
            <Layout />
            <Documental
                id={id}
                NumeroSolicitud={NumeroSolicitud}
                nombre={nombre}
                cedula={cedula}
                fecha={fecha}
                almacen={almacen}
                foto={foto}
                vendedor={vendedor}
                consulta={consulta}
            />
        </>
    );
}

export default Documento1;
