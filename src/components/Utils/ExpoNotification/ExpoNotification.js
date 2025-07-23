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
 * @param {string} options.expoToken - Token expo para notificaciones directas.
 * @param {string} options.tipo - Tipo de destinatario (vendedor, analista, operador, etc.).
 */export const fetchConsultaYNotifica = async (
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

    if (!idSolicitud || isNaN(Number(idSolicitud)) || Number(idSolicitud) === 0) {
      if (expoToken) {
        const enviado = await sendNotification({ tokens: expoToken, title, body, type, empresa });
  
      }
      throw new Error("ID de solicitud inválido");
    }

    const solicitudURL = APIURL.getConsultaCre_solicitud_web(idSolicitud);
    const { data: solicitud } = await axios.get(solicitudURL);



    const notificar = async (id, callback) => {
      if (id) {
   
        await callback(id, data, { title, body, type, empresa, url });
      }
    };

    switch (tipo) {
      case "vendedor":
        await notificar(solicitud.idVendedor, fetchYNotificaVendedor);
        break;
      case "analista":
        await notificar(solicitud.idAnalista, fetchYNotificaAnalista);
        break;
      case "operador":
        await notificar(solicitud.idOperador, fetchYNotificaAnalista);
        break;
      case "analista-operador":
        await notificar(solicitud.idAnalista, fetchYNotificaAnalista);
        await notificar(solicitud.idOperador, fetchYNotificaAnalista);
        break;
      default:
        console.warn(`⚠️ Tipo de destinatario no válido: ${tipo}`);
        break;
    }

  } catch (error) {
    console.error("❌ Error al procesar solicitud:", error.message);
    console.error("❌ Stack trace:", error.stack);
  }
};

const fetchYNotificaAnalista = async (idAnalista, data, options) => {
  try {
    const usuarioURL = APIURL.get_UsuariobyId(idAnalista);
    const { data: usuario } = await axios.get(usuarioURL);

    if (!usuario?.Nombre) {
      console.warn("⚠️ Usuario sin nombre válido.");
      return;
    }

    await fetchTokenYEnviar(usuario.Nombre, data, options);

  } catch (error) {
    console.error("❌ Error al obtener usuario analista/operador:", error.message);
    console.error("❌ Stack trace:", error.stack);
  }
};

const fetchYNotificaVendedor = async (_id, data, options) => {
  try {
    await fetchTokenYEnviarVendedor(data, options);
  } catch (error) {
    console.error("❌ Error al obtener usuario vendedor:", error.message);
    console.error("❌ Stack trace:", error.stack);
  }
};

const fetchTokenYEnviarVendedor = async (data, options) => {
  try {
    const tokenURL = APIURL.get_tokenVendedor(data.NumeroSolicitud);
    const { data: tokenData } = await axios.get(tokenURL);

    const tokenFinal = tokenData && tokenData !== 'null' ? tokenData : null;
    if (!tokenFinal) {
      console.warn("⚠️ No se encontró token válido para vendedor.");
      return;
    }

    const tokens = [tokenFinal];
    const filledBody = personalizeMessage(options.body, data);

    return await sendNotification({ tokens, title: options.title, body: filledBody, type: options.type, empresa: options.empresa, url: options.url });

  } catch (error) {
    console.error("❌ Error al enviar notificación al vendedor:", error.message);
    console.error("❌ Stack trace:", error.stack);
    return false;
  }
};

const fetchTokenYEnviar = async (nombreUsuario, data, options) => {
  try {
    const tokenURL = APIURL.get_tokenbyUsuario(nombreUsuario);
    const { data: tokenData } = await axios.get(tokenURL);

    const tokenFinal = tokenData?.TokenExpo && tokenData?.TokenExpo !== 'null'
      ? tokenData.TokenExpo
      : tokenData?.TokenExpo || null;

    if (!tokenFinal) {
      console.warn('⚠️ No se encontró token válido.');
      return;
    }

    const tokens = [tokenFinal];
    const filledBody = personalizeMessage(options.body, data);

    return await sendNotification({ tokens, title: options.title, body: filledBody, type: options.type, empresa: options.empresa, url: options.url });

  } catch (error) {
    console.error("❌ Error al enviar notificación:", error.message);
    console.error("❌ Stack trace:", error.stack);
    return false;
  }
};

const sendNotification = async ({ tokens, title, body, type = "alert", empresa, url = "" }) => {
  const payload = {
    tokens,
    notification: { type, title, body, url, empresa }
  };

  try {
    const response = await axios.post(APIURL.enviarNotificacion(), payload);
  
    return response.status === 200;
  } catch (error) {
    console.error("❌ Error al enviar la notificación:", error.response?.data || error.message);
    return false;
  }
};

const personalizeMessage = (template, data) => {
  return template
    .replace("{nombre}", data?.PrimerNombre || "")
    .replace("{apellido}", data?.ApellidoPaterno || "");
};

export const fechaHoraEcuador = new Date().toLocaleString('es-EC', {
    timeZone: 'America/Guayaquil',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    });
