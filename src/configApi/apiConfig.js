
 
const API_BASE_URL = "http://192.168.2.167:3008/";
const SOCKET_BASE_URL = "http://192.168.2.167:3008"; 
//const API_BASE_URL = "https://appservices.com.ec/cobranza/api/v1/point/";
//const SOCKET_BASE_URL = "https://appservices.com.ec";
export const APIURL = {
    getCbo_Gestor_Cobranzas : () =>`${API_BASE_URL}cbo-gestor-cobranzas`,
    cbo_gestores_estrategias : () =>`${API_BASE_URL}cbo-gestores-estrategia`,
    Cbo_Gestores : () =>`${API_BASE_URL}Cbo_Gestores`,
    Cbo_gestor_cobranzas : () =>`${API_BASE_URL}cbo-gestor-cobranzas`,
   
};
