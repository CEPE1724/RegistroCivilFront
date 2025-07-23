import { get } from "react-hook-form";

//const API_BASE_URL = "https://backregistrocivil.appservices.com.ec/api/v1/"




//const API_BASE_URL = "http://192.168.2.25:3008/api/v1/"
const API_BASE_URL = "http://192.168.2.49:3008/api/v1/"


const API_PYTHON_BASE_URL = "https://recognition.appservices.com.ec/"



export const APIURL = {
  SelectDato: () => `${API_BASE_URL}Cbo_EstadosGestion`,
  SelectTipoContacto: () => `${API_BASE_URL}Cbo_EstadosTipoContacto`,
  SelectTipoResultado: () => `${API_BASE_URL}Cbo_ResultadoGestion`,
  postinst: () => `${API_BASE_URL}Protecion-datos`,
  postImg: () => `${API_BASE_URL}subir-img`,
  getEstabilidadLaboral: () => `${API_BASE_URL}cre-tiempo/1`,
  getCreVerificacionTelefonica: () => `${API_BASE_URL}cre-verificacion-telefonica`,
  getCreVerificacionTelefonicaMaestro: (id) => `${API_BASE_URL}cre-verificacion-telefonica-maestro/${id}`,
  getHistorilaVerificacionTelefonica: (id) => `${API_BASE_URL}cre-verificacion-telefonica-historial/${id}`,
  getSearchCreSolicitudVerificacionTelefonica: (idCre_SolicitudWeb, idCre_VerificacionTelefonicaMaestro ) => `${API_BASE_URL}cre-solicitudverificaciontelefonica/search?idCre_SolicitudWeb=${idCre_SolicitudWeb}&idCre_VerificacionTelefonicaMaestro=${idCre_VerificacionTelefonicaMaestro}`,
  getCreSolicitudCredito: () => `${API_BASE_URL}cre-solicitud-web`,
  getActividadEconomina: () => `${API_BASE_URL}cre-actividadeconomina/2`,
  getTipoConsulta: () => `${API_BASE_URL}compraencuesta/1`,
  post_cre_solicitud_web: () => `${API_BASE_URL}cre-solicitud-web`,
  get_TipoConsulta: () => `${API_BASE_URL}compraencuesta/1`,
  post_cogno_Token: (ci) => `${API_BASE_URL}auth/cogno/token/${ci}`,
  getCoordenadasprefactura: () => `${API_BASE_URL}coordenadasprefactura/all`,
  getTipodocumento: () => `${API_BASE_URL}cre-tipodocumento/findAll`,
  getTiposexo: () => `${API_BASE_URL}cre-sexo`,
  getNiveleducacion: () => `${API_BASE_URL}cre-niveleducacion`,
  getProfesion: () => `${API_BASE_URL}cre-profesion`,
  getParentesco: () => `${API_BASE_URL}cre-parentesco`,
  getProvincias: () => `${API_BASE_URL}cre-provincia`,
  getCantones: (id) => `${API_BASE_URL}cre-canton/${id}`,
  getParroquias: (id) => `${API_BASE_URL}cre-parroquia/${id}`,
  getBarrios: (id) => `${API_BASE_URL}cre-barrio/${id}`,
  getTipoCliente: () => `${API_BASE_URL}tipo-cliente`,
  getMenu: (idUsuario) => `${API_BASE_URL}menu-item-role/${idUsuario}/menu`,
  getDetalleTipoCliente: () => `${API_BASE_URL}detalle-tipo-cliente`,
  getTipoTrabajo: () => `${API_BASE_URL}tipo-trabajo`,
  getCalificacion: () => `${API_BASE_URL}cre-tipocalificacion`,
  getEstado: () => `${API_BASE_URL}cre-estado`,
  getEstadoSolicitud: (id) => `${API_BASE_URL}estado-solicitud/${id}`,
  getUsuarioBodega: () => `${API_BASE_URL}usuario-bodega/usuario/bodegas`,
  postFileupload: () => `${API_BASE_URL}file-upload/upload`,
  putUpdatesolicitud: (id) => `${API_BASE_URL}cre-solicitud-web/${id}`,
  getConsultaCre_solicitud_web: (id) => `${API_BASE_URL}cre-solicitud-web/${id}`,
  get_cre_niveleducacion: () => `${API_BASE_URL}cre-niveleducacion `,
  get_cre_profesion: () => `${API_BASE_URL}cre-profesion`,
  getVendedor: (id) => `${API_BASE_URL}nomina/Vendedor/${id}`,
  getEstadoReferencia: () => `${API_BASE_URL}crectaedogestion`,
  get_nomina: (id) => `${API_BASE_URL}nomina/${id}`,
  generateOTP: () => `${API_BASE_URL}otp/generate`,
  verifyOTP: () => `${API_BASE_URL}otp/verify`,
  get_creNacionalidad: () => `${API_BASE_URL}cre-nacionalidad`,
  get_estadoCivil: () => `${API_BASE_URL}cre-estadocivil`,
  get_cre_actividadeconomina: (idAct) => `${API_BASE_URL}cre-actividadeconomina/${idAct}`,
  get_cre_inmueble: () => `${API_BASE_URL}cre-inmueble`,
  get_cre_CiudadInmueble: () => `${API_BASE_URL}cre-ciudadinmueble`,
  get_cre_tipoVivienda: () => `${API_BASE_URL}cre-tipovivienda`,
  get_cre_tiempoVivienda: () => `${API_BASE_URL}cre-tiempovivienda`,
  getNombreTipoConsulta: (id) => `${API_BASE_URL}compraencuesta/tipo/${id}`,
  post_creVerificacionTelefonica: () => `${API_BASE_URL}creverificaciontelefonica`,
  post_documentos: () => `${API_BASE_URL}documentos-solicitud`,
  get_documentos: (id, idEstadoVerificacionDocumental) => `${API_BASE_URL}documentos-solicitud/documentos/${id}/${idEstadoVerificacionDocumental}`,
  get_documentosEstado: (id, estado) => `${API_BASE_URL}documentos-solicitud/${id}/${estado}`,
  patch_documentos: (id) => `${API_BASE_URL}documentos-solicitud/${id}`,
  patch_solicitudweb: (id) => `${API_BASE_URL}documentos-solicitud/updateEstado/${id}`,
  patch_cancelados: (id) => `${API_BASE_URL}documentos-solicitud/update-cancelados/${id}`,
  get_observaciones: (idSolicitud, idTipoDocumento) => `${API_BASE_URL}documentos-solicitud/observaciones?idSolicitud=${idSolicitud}&idTipoDocumento=${idTipoDocumento}`,
  post_observaciones: () => `${API_BASE_URL}historial-observaciones`,
  /*solicitud grande*/
  get_cre_solicitud_web: () => `${API_BASE_URL}cre-solicitud-web/`,
  get_cre_solicitud_web_id: (idSolicitud, numeroSolicitud) => `${API_BASE_URL}web-solicitudgrande/${idSolicitud}/${numeroSolicitud}`,
  puth_web_solicitudgrande_listadosolicitud: (idWeb_SolicitudGrande) => `${API_BASE_URL}web-solicitudgrande/listadosolicitud/${idWeb_SolicitudGrande}`,
  post_creSolicitudVerificacionTelefonica: () => `${API_BASE_URL}cre-solicitudverificaciontelefonica`,
  getActividadEconominasituacionLaboral: () => `${API_BASE_URL}cre-situacionlaboral`,
  getCheckDocumento: (idCreSolicitudWeb, tipoDocumento) => `${API_BASE_URL}documentos-solicitud/check?idCreSolicitudWeb=${idCreSolicitudWeb}&tipoDocumento=${tipoDocumento}`,
  get_analis_cogno: (ci) => `${API_BASE_URL}usuarios/analistas/?Filtro=${ci}`,
  get_verif_cogno: (ci) => `${API_BASE_URL}usuarios/verificadores/?Filtro=${ci}`,
  post_analista: () => `${API_BASE_URL}analistacredito`,
  post_verificador: () => `${API_BASE_URL}verificadorcredito`,
  getFechaAnalista: () => `${API_BASE_URL}fecha-analista`,
  getFechaVerificador: () => `${API_BASE_URL}fecha-verificador`,
  analistacredito: () => `${API_BASE_URL}analistacredito`,
  verificadorcredito: () => `${API_BASE_URL}verificadorcredito`,
  posthorarioanalista: () => `${API_BASE_URL}horariosanalistas`,
  posthorarioverificador: () => `${API_BASE_URL}horariosverificadores`,
  get_repositorios: (anio, mes) => {
    let url = API_BASE_URL + "cre-solicitud-web/repositorios";
    let params = [];
    if (anio != null) {
      params.push("anio=" + encodeURIComponent(anio));
    }
    if (mes != null) {
      params.push("mes=" + encodeURIComponent(mes));
    }
    if (params.length > 0) {
      url += "?" + params.join("&");
    }
    return url;
  },
  get_cre_tipoempresa: () => `${API_BASE_URL}cre-tipoempresa`,
  get_tipocontrato: () => `${API_BASE_URL}cre-tipocontrato`,
  get_cre_tiposueldo: () => `${API_BASE_URL}cre-tiposueldo`,
  get_cre_cargo: () => `${API_BASE_URL}cre-cargo`,
  post_cre_referenciasclientesweb: () => `${API_BASE_URL}cre-referenciasclientesweb`,
  get_cre_referenciasclientesweb_id: (id) => `${API_BASE_URL}cre-referenciasclientesweb/all/${id}`,
  update_soliciutd_telefonica: (id, estado) => `${API_BASE_URL}cre-solicitud-web/updatetelefonica/${id}/${estado}`,
  update_solicitud: (id) => `${API_BASE_URL}cre-solicitud-web/updatetelefonicaEstados/${id}`,
  verificarRegistroSolicitud: (cedula, bodega) => `${API_BASE_URL}cre-solicitud-web/verificar-cedula-bodega?cedula=${cedula}&bodega=${bodega}`,
  getIdsTerrenas: (id, tipo) => `${API_BASE_URL}clientes-verificacion-terrena/${id}/${tipo}`,
  get_info_trabajo: (id) => `${API_BASE_URL}terrena-gestion-trabajo/${id}`,
  get_horariosanalistas: () => `${API_BASE_URL}horariosanalistas`,
  get_horariosverificadores: () => `${API_BASE_URL}horariosverificadores`,
  postInsertarCoordenadasprefactura: () => `${API_BASE_URL}coordenadasprefactura/insert`,
  get_cognotrabajocargo: () => `${API_BASE_URL}cognotrabajocargo`,
  post_createtiemposolicitudeswebDto: () => `${API_BASE_URL}tiemposolicitudesweb`,
  get_tiemposolicitudesweb_all: (id) => `${API_BASE_URL}tiemposolicitudesweb/all/${id}`,
  /*   @Get('all/estado/:idCre_SolicitudWeb/:tipo')  */
  get_tiemposolicitudesweb: (id, estado) => `${API_BASE_URL}tiemposolicitudesweb/all/estado/${id}/${estado}`,
  get_TiempSolicWeb: (tipo, id, estado) => `${API_BASE_URL}tiemposolicitudesweb/tiempo/${tipo}/${id}/${estado}`,
  get_Verificador: (id) => `${API_BASE_URL}tiemposolicitudesweb/tiempo/${id}`,
  get_ingresoCobrador: () => `${API_BASE_URL}ingreso-cobrador`,
  post_clientesVerificacionTerrenaBasica: () =>`${API_BASE_URL}clientes-verificacion-terrena/basica`,
  getCoordenadasprefacturaPorId: (id, Tipo) => `${API_BASE_URL}coordenadasprefactura/find/${id}/${Tipo}`,
  get_cre_referenciasclientesweb_id_all: (id) => `${API_BASE_URL}cre-referenciasclientesweb/all/count/${id}`,
  getTerrenaGestionDomicilio: (id) => `${API_BASE_URL}terrena-gestion-domicilio/${id}`,
  getacces: (idMenu, idUsuario) => `${API_BASE_URL}menu-item-role/permissionscomponents/${idMenu}/${idUsuario}`,
  getRolesWeb: () => `${API_BASE_URL}rolesweb`,
  getUsuarioPorROL: (idRol) => `${API_BASE_URL}usuarios/rol/${idRol}`,
  getMenuPorusuario: (idUsuario) => `${API_BASE_URL}menu-item-role/permissionsmenu/${idUsuario}`,
  deletePermisoUsuario: (idUsuario, idmenuItemRoles) => `${API_BASE_URL}menu-item-role/permisos/delete/${idUsuario}/${idmenuItemRoles}`,
  createPermisoUsuario: (idUsuario, mIdmenuItems) => `${API_BASE_URL}menu-item-role/permisos/create/${idUsuario}/${mIdmenuItems}`,
  getTodosLosAccesos: () => `${API_BASE_URL}menu-item-role/permissionscomponents`,
  getRolesAccesos: (idUsuario, idmenu_items) => `${API_BASE_URL}menu-item-role/accessroles/${idUsuario}/${idmenu_items}`,
  deleteRolesAccesos: (idUsuario, idmenu_items) => `${API_BASE_URL}menu-item-role/accessroles/delete/${idUsuario}/${idmenu_items}`,
  createRolesAccesos: (idUsuario, idmenu_items) => `${API_BASE_URL}menu-item-role/accessroles/create/${idUsuario}/${idmenu_items}`,
  listaVendedoresporBodega: (Fecha, idBodega, inivel) => `${API_BASE_URL}exec-sp/FacturacionListaVendedoresWeb/${Fecha}/${idBodega}/${inivel}`,
  getdocumentosanalista: () => `${API_BASE_URL}cre-solicitud-web/documentosanalista`,
  post_VerificacionTelefonicaMaestro: () => `${API_BASE_URL}cre-verificacion-telefonica-maestro`,
  postCompareFaces: () => `${API_PYTHON_BASE_URL}verify-faces`,
  //// LISTA NEGRA TELEFONOS
  getTelefonos: () => `${API_BASE_URL}lista-negra-cell`,
  postTelefono: () => `${API_BASE_URL}lista-negra-cell`,
  updateTelefono: (id) => `${API_BASE_URL}lista-negra-cell/${id}`,
  validarTelefono: (telefono) => `${API_BASE_URL}lista-negra-cell/telefono/${telefono}`,
  getCedulas: () => `${API_BASE_URL}lista-negra-cedula`,
  postCedula: () => `${API_BASE_URL}lista-negra-cedula`,
  updateCedula: (id) => `${API_BASE_URL}lista-negra-cedula/${id}`,
  validarCedula: (cedula) => `${API_BASE_URL}lista-negra-cedula/cedula/${cedula}`,
  validarCedulaCognos: (cedula) => `${API_BASE_URL}cre-solicitud-web/solicitud-Cogno/${cedula}`,
  analistacreditoUsuarioRol: (igrupo, analista) => `${API_BASE_URL}analistacredito/usuario/${igrupo}/${analista}`,
  getEqfxIdentificacion: (Cedula) => `${API_BASE_URL}eqfxidentificacionconsultada/${Cedula}`,
  getEqfxResultSegment: (id) => `${API_BASE_URL}eqfxResultadoSegmentacion/${id}`,
  getEqfxResultPliticas: (id) => `${API_BASE_URL}eqfxResultadoPoliticas/${id}`,
  getEqfxScorePuntaje: (id) => `${API_BASE_URL}eqfxScorePuntajeV3/${id}`,
  getVerificacionTresDocumentos: (id) => `${API_BASE_URL}documentos-solicitud/verificar-documentos-aprobados/${id}`,
  getReporteBuroCredito: (id) => `${API_BASE_URL}eqfxReporteBuroCredito/${id}`,
  patch_codDactil: (id) => `${API_BASE_URL}cre-solicitud-web/updatecodDactilar/${id}`,
  enviarNotificacion: () => `https://appservices.com.ec/cobranza/api/v1/point/NotificationUser/expo`,
  consultarNombresNotif: (id) => `${API_BASE_URL}dispositivosApp/empresa/${id}`,
  patch_CuotayCupo: (id) => `${API_BASE_URL}web-solicitudgrande/updatecuotaycupo/${id}`,
  get_Asignacion_vendedores: (id) => `${API_BASE_URL}com-asignacion-de-vendedores/jefes-de-bodega/${id}`,
  get_UsuariobyId: (id) => `${API_BASE_URL}usuarios/id/${id}`,
  get_tokenbyUsuario: (nombre) => `${API_BASE_URL}dispositivosApp/usuario/${nombre}`,
  get_tokenVendedor: (id) => `${API_BASE_URL}dispositivosApp/tokenExpo/${id}`,
  getCoordenadasId: (id, tipo) => `${API_BASE_URL}coordenadasprefactura/id/${id}/${tipo}`,

   // Verifica si el usuario ya tiene ingreso en InfoSistema
  verificarCambioClave: (usuario) => `${API_BASE_URL}info-sistema/existe/${usuario}`,

  // Registra el ingreso del usuario en InfoSistema
  registrarIngresoSistema: () => `${API_BASE_URL}info-sistema/registrar`,

  // Cambiar contraseña del usuario
  cambiarClave: () => `${API_BASE_URL}usuarios/cambiar-clave`,
  recuperarClave: () => `${API_BASE_URL}usuarios/recuperar-clave`, 
  patch_ClientesVerifTerren: (id) => `${API_BASE_URL}clientes-verificacion-terrena/update/${id}`,

  get_ClientesVerifTerrenporId: (id) => `${API_BASE_URL}clientes-verificacion-terrena/allbyID/${id}` ,
  get_CoordenadasInforme: (id) => `${API_BASE_URL}clientes-verificacion-terrena/coordInforme/${id}`,
  
  // Endpoints para Lista Negra de Emails
  getEmails: () => `${API_BASE_URL}lista-negra-email`,
  postEmail: () => `${API_BASE_URL}lista-negra-email`,
  updateEmail: (id) => `${API_BASE_URL}lista-negra-email/${id}`,
  deleteEmail: (id) => `${API_BASE_URL}lista-negra-email/${id}`,
  getEmailById: (id) => `${API_BASE_URL}lista-negra-email/${id}`,
  validarEmail: (email) => `${API_BASE_URL}lista-negra-email/email/${email}`,

  store_reports_phone_verification: (id) => `${API_BASE_URL}store-reports-phone-verification/cre-solicitud/${id}`,
  patchTipoVerificacionDomicilio: (id) => `${API_BASE_URL}terrena-gestion-domicilio/${id}/tipo-verificacion`,

};
