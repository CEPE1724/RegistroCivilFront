import axios from "axios";
import { APIURL } from "../../../configApi/apiConfig";
import axios from "../../../configApi/axiosConfig";

export const sendNotification = async ({
    tokens,
    title,
    body,
    type = "alert",
    empresa = "CREDI",
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

    try {
        const response = await axios.post(APIURL.enviarNotificacion(), payload);
        return response.status === 200;
    } catch (error) {
        console.error("❌ Error al enviar la notificación:", error);
        return false;
    }
};
