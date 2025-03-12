import { get } from "react-hook-form";

 

//const API_BASE_URL = "http://192.168.137.28:3025/api/v1/"; 

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

    getTipodocumento : () => `${API_BASE_URL}cre-tipodocumento/findAll`,
    getTiposexo : () => `${API_BASE_URL}cre-sexo`,
    getNiveleducacion : () => `${API_BASE_URL}cre-niveleducacion`,
    getProfesion : () => `${API_BASE_URL}cre-profesion`,
    getParentesco : () => `${API_BASE_URL}cre-parentesco`,

    getProvincias : () => `${API_BASE_URL}cre-provincia`,
    getCantones : (id) => `${API_BASE_URL}cre-canton/${id}`,
    getParroquias : (id) => `${API_BASE_URL}cre-parroquia/${id}`,
    getBarrios : (id) => `${API_BASE_URL}cre-barrio/${id}`,
    getTipoCliente  : () => `${API_BASE_URL}tipo-cliente`,
    getMenu : (idUsuario) => `${API_BASE_URL}menu-item-role/${idUsuario}/menu`,
    getDetalleTipoCliente : () => `${API_BASE_URL}detalle-tipo-cliente`,
    getTipoTrabajo : () => `${API_BASE_URL}tipo-trabajo`,
    getCalificacion : () => `${API_BASE_URL}cre-tipocalificacion`,
    getEstado : () => `${API_BASE_URL}cre-estado`,
    getEstadoSolicitud : (id) => `${API_BASE_URL}estado-solicitud/${id}`,

    getUsuarioBodega : () => `${API_BASE_URL}usuario-bodega/usuario/bodegas`,

    postFileupload : () => `${API_BASE_URL}file-upload/upload`,
    putUpdatesolicitud : (id) => `${API_BASE_URL}cre-solicitud-web/${id}`,
    getConsultaCre_solicitud_web : (id) => `${API_BASE_URL}cre-solicitud-web/${id}`,
    get_cre_niveleducacion : () =>  `${API_BASE_URL}cre-niveleducacion `,

    get_cre_profesion : () =>  `${API_BASE_URL}cre-profesion`,
    getVendedor : (id) => `${API_BASE_URL}nomina/Vendedor/${id}`,

    get_cre_profesion : () =>  `${API_BASE_URL}cre-profesion `,

    getEstadoReferencia : () => `${API_BASE_URL}crectaedogestion`,

    get_nomina : (id) =>  `${API_BASE_URL}nomina/${id}`,
    generateOTP : () => `${API_BASE_URL}otp/generate`,
    verifyOTP : () => `${API_BASE_URL}otp/verify`,

    get_creNacionalidad : () => `${API_BASE_URL}cre-nacionalidad`,
	get_estadoCivil : () => `${API_BASE_URL}cre-estadocivil`,
	get_cre_actividadeconomina : (idAct) => `${API_BASE_URL}cre-actividadeconomina/${idAct}`,
	get_cre_inmueble : () => `${API_BASE_URL}cre-inmueble`,
	get_cre_CiudadInmueble : () => `${API_BASE_URL}cre-ciudadinmueble`,
	get_cre_tipoVivienda : () => `${API_BASE_URL}cre-tipovivienda`,
	get_cre_tiempoVivienda : () => `${API_BASE_URL}cre-tiempovivienda`,

   post_creVerificacionTelefonica : () => `${API_BASE_URL}creverificaciontelefonica`,

};
