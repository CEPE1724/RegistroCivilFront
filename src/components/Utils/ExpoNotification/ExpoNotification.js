
import { APIURL } from "../../../configApi/apiConfig";
import axios from "../../../configApi/axiosConfig";


export const sendNotification = async ({
    tokens,
    title,
    body,
    type = "alert",
    empresa = "POINT",
    url = ""
}) => {
    alert("Enviando notificación...");
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
