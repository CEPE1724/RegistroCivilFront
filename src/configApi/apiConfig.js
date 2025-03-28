import { get } from "react-hook-form";
const API_BASE_URL = "http://192.168.137.169:3025/api/v1/";

const SOCKET_BASE_URL = "http://192.168.2.167:3008";
//const API_BASE_URL = "https://appservices.com.ec/cobranza/api/v1/point/";
//const SOCKET_BASE_URL = "https://appservices.com.ec";
export const APIURL = {


    SelectDato : () =>`${API_BASE_URL}Cbo_EstadosGestion`,
    SelectTipoContacto : () =>`${API_BASE_URL}Cbo_EstadosTipoContacto`,
    SelectTipoResultado : () =>`${API_BASE_URL}Cbo_ResultadoGestion`,
    postinst : () => `${API_BASE_URL}Protecion-datos`,
    postImg : () => `${API_BASE_URL}subir-img`,
	  getEstabilidadLaboral : () => `${API_BASE_URL}cre-tiempo/1`,
    getCreVerificacionTelefonica : () => `${API_BASE_URL}cre-verificacion-telefonica`,
    getCreVerificacionTelefonicaMaestro : (id) => `${API_BASE_URL}cre-verificacion-telefonica-maestro/${id}`,
    getHistorilaVerificacionTelefonica : (id) => `${API_BASE_URL}cre-verificacion-telefonica-historial/${id}`,
    getSearchCreSolicitudVerificacionTelefonica : (idCre_SolicitudWeb, idCre_VerificacionTelefonicaMaestro) => 
      `${API_BASE_URL}cre-solicitudverificaciontelefonica/search?idCre_SolicitudWeb=${idCre_SolicitudWeb}&idCre_VerificacionTelefonicaMaestro=${idCre_VerificacionTelefonicaMaestro}`,
    

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
   post_documentos : () => `${API_BASE_URL}documentos-solicitud`,
   get_documentos : (id,idEstadoVerificacionDocumental) => `${API_BASE_URL}documentos-solicitud/documentos/${id}/${idEstadoVerificacionDocumental}`,
   get_documentosEstado : (id, estado) => `${API_BASE_URL}documentos-solicitud/${id}/${estado}`,
   patch_documentos : (id) => `${API_BASE_URL}documentos-solicitud/${id}`,
   patch_solicitudweb : (id) => `${API_BASE_URL}documentos-solicitud/updateEstado/${id}`,
   patch_cancelados: (id) => `${API_BASE_URL}documentos-solicitud/update-cancelados/${id}`,
   get_observaciones: (idSolicitud, idTipoDocumento) => `${API_BASE_URL}documentos-solicitud/observaciones?idSolicitud=${idSolicitud}&idTipoDocumento=${idTipoDocumento}`,
   post_observaciones: () => `${API_BASE_URL}historial-observaciones`,
   /*solicitud grande*/
   get_cre_solicitud_web : () => `${API_BASE_URL}cre-solicitud-web/`,
   get_cre_solicitud_web_id : (idSolicitud, numeroSolicitud) => `${API_BASE_URL}web-solicitudgrande/${idSolicitud}/${numeroSolicitud}`,
   puth_web_solicitudgrande_listadosolicitud : (idWeb_SolicitudGrande) => `${API_BASE_URL}web-solicitudgrande/listadosolicitud/${idWeb_SolicitudGrande}`,
   post_creSolicitudVerificacionTelefonica : () => `${API_BASE_URL}cre-solicitudverificaciontelefonica`,
   getActividadEconominasituacionLaboral: () => `${API_BASE_URL}cre-situacionlaboral`,
   getCheckDocumento: (idCreSolicitudWeb, tipoDocumento) =>`${API_BASE_URL}documentos-solicitud/check?idCreSolicitudWeb=${idCreSolicitudWeb}&tipoDocumento=${tipoDocumento}`,

  get_analis_cogno: (ci) => `${API_BASE_URL}usuarios/analistas/?Filtro=${ci}`,
  post_analista: () => `${API_BASE_URL}analistacredito`,
  getFechaAnalista: () => `${API_BASE_URL}fecha-analista`,
  analistacredito: () => `${API_BASE_URL}analistacredito`,
  posthorarioanalista: () => `${API_BASE_URL}horariosanalistas`,

  get_repositorios: (anio, mes) => {
    let url = API_BASE_URL + 'cre-solicitud-web/repositorios';
    let params = [];
    if (anio != null) {
      params.push('anio=' + encodeURIComponent(anio));
    }
    if (mes != null) {
      params.push('mes=' + encodeURIComponent(mes));
    }
    if (params.length > 0) {
      url += '?' + params.join('&');
    }
    return url;
  },
  get_cre_tipoempresa: () => `${API_BASE_URL}cre-tipoempresa`,
  get_tipocontrato: () => `${API_BASE_URL}cre-tipocontrato`,
  get_cre_tiposueldo: () => `${API_BASE_URL}cre-tiposueldo`,
  get_cre_cargo: () => `${API_BASE_URL}cre-cargo`,
  post_cre_referenciasclientesweb: () => `${API_BASE_URL}cre-referenciasclientesweb`,
  get_cre_referenciasclientesweb_id: (id) => `${API_BASE_URL}cre-referenciasclientesweb/all/${id}`,
  update_soliciutd_telefonica:(id, estado) => `${API_BASE_URL}cre-solicitud-web/updatetelefonica/${id}/${estado}`,

  get_horariosanalistas: () => `${API_BASE_URL}horariosanalistas`,


  postInsertarCoordenadasprefactura: () => `${API_BASE_URL}coordenadasprefactura/insert`,

  get_cognotrabajocargo: () => `${API_BASE_URL}cognotrabajocargo`,
  post_createtiemposolicitudeswebDto : () => `${API_BASE_URL}tiemposolicitudesweb`,
  get_tiemposolicitudesweb_all : (id) => `${API_BASE_URL}tiemposolicitudesweb/all/${id}`,
  /*   @Get('all/estado/:idCre_SolicitudWeb/:tipo')
 */
  get_tiemposolicitudesweb : (id ,estado) => `${API_BASE_URL}tiemposolicitudesweb/all/estado/${id}/${estado}`,

};
