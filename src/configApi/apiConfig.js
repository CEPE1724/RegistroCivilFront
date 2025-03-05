
 

const API_BASE_URL = "http://192.168.2.167:3008/api/v1/";



const SOCKET_BASE_URL = "http://192.168.2.167:3008"; 
//const API_BASE_URL = "https://appservices.com.ec/cobranza/api/v1/point/";
//const SOCKET_BASE_URL = "https://appservices.com.ec";
export const APIURL = {
    getCbo_Gestor_Cobranzas : () =>`${API_BASE_URL}cbo-gestor-cobranzas`,
    cbo_gestores_estrategias : () =>`${API_BASE_URL}cbo-gestores-estrategia`,
    Cbo_Gestores : () =>`${API_BASE_URL}Cbo_Gestores`,
    Cbo_gestor_cobranzas : () =>`${API_BASE_URL}cbo-gestor-cobranzas`,
    BodegaGet : () =>`${API_BASE_URL}bodega`,
    SelectDato : () =>`${API_BASE_URL}Cbo_EstadosGestion`,
    SelectTipoContacto : () =>`${API_BASE_URL}Cbo_EstadosTipoContacto`,
    SelectTipoResultado : () =>`${API_BASE_URL}Cbo_ResultadoGestion`,
    postinst : () => `${API_BASE_URL}Protecion-datos`,
    postImg : () => `${API_BASE_URL}subir-img`,
	  getEstabilidadLaboral : () => `${API_BASE_URL}cre-tiempo/1`,
    getCreVerificacionTelefonica : () => `${API_BASE_URL}cre-verificacion-telefonica`,
    getCreSolicitudCredito : () => `${API_BASE_URL}cre-solicitud-web`,
    getActividadEconomina : () => `${API_BASE_URL}cre-actividadeconomina/2`,
    getTipoConsulta : () => `${API_BASE_URL}compraencuesta/1`,
	post_cre_solicitud_web : () => `${API_BASE_URL}cre-solicitud-web`,
	get_TipoConsulta : () => `${API_BASE_URL}compraencuesta/1`,
	post_cogno_Token : (ci) => `${API_BASE_URL}auth/cogno/token/${ci}`,
    getCoordenadasprefactura : () => `${API_BASE_URL}coordenadasprefactura/all`,

};
