
import { APIURL } from "../../../configApi/apiConfig";
import axios from "../../../configApi/axiosConfig";


/**
 * Consulta la solicitud y envía una notificación personalizada.
 * @param {number} idSolicitud - ID de la solicitud de crédito.
 * @param {object} data - Datos del cliente, usados en el cuerpo del mensaje.
 * @param {object} options - Parámetros personalizados para la notificación.
 * @param {string} options.title - Título de la notificación.
 * @param {string} options.body - Cuerpo de la notificación.
 * @param {string} options.type - Tipo de notificación.
 * @param {string} options.empresa - Nombre de la empresa.
 * @param {string} options.url - (Opcional) URL de navegación.
 */
export const fetchConsultaYNotifica = async (
    idSolicitud,
    data,
    {
        title = "¡Notificación de solicitud!",
        body = `Se ha generado una solicitud de crédito.`,
        type = "alert",
        empresa = "POINT",
        url = "",
        expoToken = "",
        tipo = "analista"

    } = {}
) => {
    try {
console.log("Iniciando consulta y notificación para ID de solicitud:", idSolicitud);
        if (!idSolicitud || isNaN(Number(idSolicitud) || Number(idSolicitud) == 0)) {
            // para solitidu creada en el frontend jefe de almacem
            const enviado = await sendNotification({
                tokens: expoToken,
                title: title,
                body: body,
                type: type,
                empresa: empresa,
                url: ""
            });
            console.log(enviado ? "✅ Notificación enviada." : "❌ Fallo al enviar notificación.");
            throw new Error("ID de solicitud inválido");
        }
        // 
        /* daniel */
        const solicitudURL = APIURL.getConsultaCre_solicitud_web(idSolicitud);
        const { data: solicitud } = await axios.get(solicitudURL, {
            headers: { 'Content-Type': 'application/json' }
        });



        if (tipo === "analista" && solicitud?.idAnalista) {
            console.log("Enviando notificación al analista:", solicitud.idAnalista);
            await fetchYNotificaAnalista(
                solicitud.idAnalista,
                data,
                { title, body, type, empresa, url }
            );
        } else if (tipo === "operador" && solicitud?.idOperador) {
            await fetchYNotificaAnalista(
                solicitud.idOperador,
                data,
                { title, body, type, empresa, url }
            );
        } else if (tipo === "analista-operador") {
            // Enviar a ambos si existen
            if (solicitud?.idAnalista) {
                await fetchYNotificaAnalista(
                    solicitud.idAnalista,
                    data,
                    { title, body, type, empresa, url }
                );
            }
            if (solicitud?.idOperador) {
                await fetchYNotificaAnalista(
                    solicitud.idOperador,
                    data,
                    { title, body, type, empresa, url }
                );
            }
        }
        /* daniel */

    } catch (error) {
        console.error("❌ Error al procesar solicitud:", error.message);
    }
};


const fetchYNotificaAnalista = async (idAnalista, data, options) => {
    try {
        console.log("Buscando usuario por ID:", idAnalista);
        const usuarioURL = APIURL.get_UsuariobyId(idAnalista);
        const { data: usuario } = await axios.get(usuarioURL, {
            headers: { 'Content-Type': 'application/json' }
        });

        if (!usuario?.Nombre) {
            console.warn("⚠️ Usuario sin nombre válido.");
            return;
        }

        await fetchTokenYEnviar(usuario.Nombre, data, options);

    } catch (error) {
        console.error("❌ Error al obtener usuario:", error.message);
    }
};

const fetchTokenYEnviar = async (nombreUsuario, data, options) => {
    try {
        const tokenURL = APIURL.get_tokenbyUsuario(nombreUsuario);
        const { data: tokenData } = await axios.get(tokenURL, {
            headers: { 'Content-Type': 'application/json' }
        });

        const expoToken = tokenData?.TokenExpo;
        if (!expoToken || expoToken === "null") {
            console.warn("⚠️ No se encontró token válido.");
            return;
        }

        const tokens = [expoToken];
        console.log("Tokens obtenidos:", tokens);
        const filledBody = options.body
            .replace("{nombre}", data?.PrimerNombre || "")
            .replace("{apellido}", data?.ApellidoPaterno || "");

        const enviado = await sendNotification({
            tokens,
            title: options.title,
            body: filledBody,
            type: options.type,
            empresa: options.empresa,
            url: ""
        });

        console.log(enviado ? "✅ Notificación enviada." : "❌ Fallo al enviar notificación.");
    } catch (error) {
        console.error("❌ Error al enviar notificación:", error.message);
    }
};

const sendNotification = async ({
    tokens,
    title,
    body,
    type = "alert",
    empresa = "POINT",
    url = ""
}) => {

    const payload = {
        tokens,
        notification: {
            type,
            title,
            body,
            url,
            empresa,
        }
    };
    console.log("Payload de notificación:", payload);
    try {
        const response = await axios.post(APIURL.enviarNotificacion(), payload);

        console.log("✅ Notificación enviada:", response.data);
        return response.status === 200;
    } catch (error) {
        console.error("❌ Error al enviar la notificación:", error);
        return false;
    }
};