function LoadScreen(transactionCode, esReconexion) {
    var messageLoad = CORE_MESSAGE('WaitPlease');
    switch (transactionCode) {
        case "03":
        case "04":
            messageLoad = "Obteniendo últimos movimientos de la cuenta...";
            break;
        case "05":
        case "06":
        case "16":
            messageLoad = "Consultando cuentas disponibles...";
            break;
        case "07":
        case "17":
            messageLoad = "Eliminando beneficiario...";
            break;
        case "08":
            messageLoad = "Creando beneficiario...";
            break;
        case "09":
            messageLoad = "Enviando código de transacción...";
            break;
        case "10":
            messageLoad = "Realizando Transferencia...";
            break;
        case "11":
            messageLoad = "Estamos recuperando tu nombre de usuario...";
            break;
        case "15":
            messageLoad = "Guardando cuenta beneficiaria...";
            break;
        case "02":
            messageLoad = "Verificando tus credenciales de acceso. Esto puede tardar varios segundos.";
            break;
        case "31":
            messageLoad = "Estamos validando tu PIN de seguridad";
            break;
        case "101":
            messageLoad = "Estamos verificando la validez de la cuenta";
            break;
        default:
            break;
    }
    if (esReconexion && esReconexion == true)
        messageLoad = CORE_MESSAGE('RetryConnection');
    //initProcess(messageLoad);
    //MobileBanking_App.app.navigate("LoadView/" + messageLoad);
    var loadProcess = document.getElementById('loadProcess');
    loadProcess.style.opacity = 1;
    loadProcess.style.zIndex = 9999;
    $('#spnMessageLoad').text(messageLoad);
}

var Transaction = {
    ConsultaMovimientos: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "Cuentas", TransactionDescription: "ConsultaMovimientos", TransactionCode: "03", Parameters: { numeroCuenta: "", idCuenta: "" } },
    ConsultaMovimientosFechas: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "Cuentas", TransactionDescription: "ConsultaMovimientosFechas", TransactionCode: "04", Parameters: { cuenta: "", fechaInicio: "", fechaFinal: "" } },
    ConsultaCuentasPermitidas: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "PerfilTransaccional", TransactionDescription: "ConsultarCuentasPermitidas", TransactionCode: "05", Parameters: { intCliente: "" } },
    ConsultaCuentaCanal: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "PerfilTransaccional", TransactionDescription: "ConsultaCuentaCanal", TransactionCode: "06", Parameters: { strNumerocuenta: "" } },
    EliminarCuentaBeneficiaria: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "PerfilTransaccional", TransactionDescription: "EliminarCuentaBeneficiaria", TransactionCode: "07", Parameters: { objCuentaPermitida: {} } },
    CrearCuentaPermitida: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "PerfilTransaccional", TransactionDescription: "CrearCuentaPermitida", TransactionCode: "08", Parameters: { contextCliente: {}, CuentaPermitida: {} } },
    EnviarOTP: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "PerfilTransaccional", TransactionDescription: "EnviarOTP", TransactionCode: "09", Parameters: { contextCliente: {} } },
    RealizarTranferenciaDirecta: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "Cuentas", TransactionDescription: "RealizarTranferenciaDirecta", TransactionCode: "10", Parameters: { DtoCanalTransferencia: {}, contextCliente: {} } },
    RecuperarNombreUsuarioWeb: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "Account", TransactionDescription: "RecuperarNombreUsuarioWeb", TransactionCode: "11", Parameters: { contextCliente: {}, tipoIdentificacion: "", numeroIdentificacion: "", esRegistro: true } },
    OlvidoDeClave: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "Account", TransactionDescription: "OlvidoDeClave", TransactionCode: "12", Parameters: { PreguntaUsuario: [{}], datosControlAcceso: {} } },
    ConsultarPreguntasSeguridadUsuario: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "Account", TransactionDescription: "ConsultarPreguntasSeguridadUsuario", TransactionCode: "13", Parameters: { nombreUsuario: "" } },
    ConsultarEntidadFinanciera: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "PerfilTransaccional", TransactionDescription: "ConsultarEntidadFinanciera", TransactionCode: "14", Parameters: {} },
    GuardarCuentaBeneficiariaExterna: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "PerfilTransaccional", TransactionDescription: "GuardarCuentaBeneficiariaExterna", TransactionCode: "15", Parameters: { dtoCtaTransferenciaExterna: {}, contextoCliente: {} } },
    ConsultarCuentasPermitidasExternas: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "PerfilTransaccional", TransactionDescription: "ConsultarCuentasPermitidasExternas", TransactionCode: "16", Parameters: { contextoCliente: {} } },
    EliminarCuentasPermitidasExternas: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "PerfilTransaccional", TransactionDescription: "EliminarCuentasPermitidasExternas", TransactionCode: "17", Parameters: { listaCtasExternas: [{}] } },
    RealizarTransferenciaInterBancaria: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "Cuentas", TransactionDescription: "RealizarTransferenciaInterBancaria", TransactionCode: "18", Parameters: { transferenciaInterbancaria: DtoCanalTransferenciaInterbancaria, listaFormaPago: [DtoFormaPagoTransInterbancaria], contextCliente: {} } },
    RecuperarDatosTransferenciaInterbancaria: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "Cuentas", TransactionDescription: "RecuperarDatosTransferenciaInterbancaria", TransactionCode: "19", Parameters: { numeroCuenta: "", valorTransferencia: 0.00, identificacionOrdenante: "", codigoEntidadBeneficiaria: "", moneda: "" } },
    ObtenerTransferenciasDirectas: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "Cuentas", TransactionDescription: "ObtenerTransferenciasDirectas", TransactionCode: "20", Parameters: { numeroCuenta: "", fechaInicial: "", fechaFinal: "", recibidas: false, } },
    ObtenerUltimasComprasTCF: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "Tarjeta", TransactionDescription: "ObtenerUltimasComprasTCF", TransactionCode: "22", Parameters: { idCuentaTarjeta: 0, indice: 0, registros: 0, contextCliente: {} } },
    ConsultarControlAcceso: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "Account", TransactionDescription: "ConsultarControlAcceso", TransactionCode: "21", Parameters: { userName: "" } },
    CambiarPassword: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "Account", TransactionDescription: "CambiarPassword", TransactionCode: "23", Parameters: { passwordActual: "", passwordNuevo: "", contextoCliente: {} } },
    EnviarCorreoContacto: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "Send", TransactionDescription: "EnviarCorreoContacto", TransactionCode: "24", Parameters: { ContextoCliente: {}, Tema: "", NumeroTelefonoSecundario: "", Cuerpo: "", DtoResultadoConsultaControlAcceso: {}, CorreoElectronicoSecundario: "" } },
    LogInPost: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "Account", TransactionDescription: "LogIn", TransactionCode: "02", Parameters: { username: "", password: "", lastTimeAccesedPosition: "", esRegistro: false, TokenAPNGCM: "" } },
    LogInLandingPage: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "Account", TransactionDescription: "LogInLandingPage", TransactionCode: "79", Parameters: { username: "", password: "", lastTimeAccesedPosition: "", esRegistro: false, TokenAPNGCM: "" } },
    RegistrarDispositivoAppBancaMovil: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "AppBancaMovil", TransactionDescription: "RegistrarDispositivoAppBancaMovil", TransactionCode: "25", Parameters: { tokenACM_GCM: "", osPlatform: "", model: "", manufacturer: "", lastTimeAccesedPosition: "", deviceVersion: "", contextoCliente: {}, dtoResultadoConsultaControlAcceso: {} } },
    ReportarExcepcionAppBancaMovil: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "AppBancaMovil", TransactionDescription: "ReportarExcepcionAppBancaMovil", TransactionCode: "27", Parameters: { jsExceptionMessage: "", jsExceptionStack: "", methodParameters: "" } },
    GetAppParameters: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "AppBancaMovil", TransactionDescription: "GetAppParameters", TransactionCode: "28", Parameters: {} },
    RecargarTiempoAire: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "Tarjeta", TransactionDescription: "RecargarTiempoAire", TransactionCode: "29", Parameters: { contextoCliente: {}, cadena: "", numeroCelular: "", tarjeta: "", plazo: "", valor: 0.00, anioExp: "", mesExp: "", cvv: "" } },
    SaveUserInServerAppBancaMobile: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "AppBancaMovil", TransactionDescription: "SaveUserInServerAppBancaMobile", TransactionCode: "30", Parameters: { esNuevoPIN: false, documentType: "", documentNumber: "", clientId: "", username: "", accessPIN: "", usersPassWord: "", phoneNumber: "", email: "", name: "", token: "", deviceId: "", osPlatform: "", model: "", manufacturer: "", lastTimeAccesedPosition: "", deviceVersion: "" } },
    ValidateUsersPINandLogin: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "AppBancaMovil", TransactionDescription: "ValidateUsersPINandLogin", TransactionCode: "31", Parameters: { esRegistro: false, InsertedPIN: "", LastTimeAccessedPosition: "", TokenAPNGCM: "" } },
    OlvideMiPin: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "AppBancaMovil", TransactionDescription: "OlvideMiPin", TransactionCode: "32", Parameters: {} },
    CambioPinSeguridad: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "AppBancaMovil", TransactionDescription: "CambioPinSeguridad", TransactionCode: "33", Parameters: { oldPin: "", newPin: "" } },
    /*Servicios Basicos*/
    ConsultarCatalogoServicioBasico: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "ServBasicos", TransactionDescription: "ConsultarCatalogoServicioBasico", TransactionCode: "36", Parameters: { nombreCatalogo: "" } },
    ConsultarMontoAPagarServicioBasico: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "ServBasicos", TransactionDescription: "ConsultarMontoAPagarServicioBasico", TransactionCode: "37", Parameters: {} },
    PagarCNTDebitoCuenta: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "ServBasicos", TransactionDescription: "PagarCNTDebitoCuenta", TransactionCode: "38", Parameters: {} },
    PagarCNTTarjetaCredito: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "ServBasicos", TransactionDescription: "PagarCNTTarjetaCredito", TransactionCode: "39", Parameters: {} },

    /*Billetera Móvil*/
    EnrolarBIMO: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "BIMO", TransactionDescription: "Enrolar BIMO", TransactionCode: "40", Parameters: { telefono: "", numeroCuenta: "", contextoCliente: {} } },
    AdministrarBIMO: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "BIMO", TransactionDescription: "Administrar BIMO", TransactionCode: "41", Parameters: { telefono: "", accion: "", motivoDesenrolamiento: "" } },
    PagarBIMO: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "BIMO", TransactionDescription: "Pagar BIMO", TransactionCode: "42", Parameters: { monto: 0.0, celularAsociado: "", celularBeneficiario: "", concepto: "", mailTercero: "", pagoPendienteId: "", tipoTransaccion: "", moneda: "", contextoCliente: {} } },
    CrearNotificacionCobroBIMO: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "BIMO", TransactionDescription: "Crear Notif Cobro BIMO", TransactionCode: "43", Parameters: { telefonoSolicitante: "", telefonoReceptorSolicitud: "", monto: 0.0, referencia: "", moneda: "" } },
    ConsultarPagosPendientesBIMO: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "BIMO", TransactionDescription: "Consultar Pagos Pendientes BIMO", TransactionCode: "44", Parameters: { telefono: "" } },
    RechazarPagoPendienteBIMO: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "BIMO", TransactionDescription: "Rechazar Pago Pendiente BIMO", TransactionCode: "45", Parameters: { telefono: "", pagoPendienteId: "", razon: "" } },
    ConsultarComisionBIMO: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "BIMO", TransactionDescription: "Consultar Comisión BIMO", TransactionCode: "46", Parameters: { telefonoBeneficiario: "" } },

    /*Operacion Obtener Cuentas Para Refrescar Posicion Consolidada*/
    ObtenerCuentasCliente: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "Cuentas", TransactionDescription: "ObtenerCuentasCliente", TransactionCode: "49", Parameters: { deviceId: "", contextCliente: "" } },

    /*OPERACIONES PAGO SERVICIOS EASYCASH*/
    SincronizarOperaciones: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "EasyCash", TransactionDescription: "SincronizarOperaciones", TransactionCode: "SYNC", Parameters: { operations: [] } },
    ConsultarServicioEasyCash: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "EasyCash", TransactionDescription: "ConsultarServicioEasyCash", TransactionCode: "QUERY", Parameters: { DtoEnvioConsulta: undefined } },
    PagarServicioEasyCashTarjetaCredito: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "EasyCash", TransactionDescription: "PagarServicioEasyCashTarjetaCredito", TransactionCode: "PAYWITHCARD", Parameters: { numeroTarjeta: undefined, cvv: undefined, anioVence: undefined, mesVence: undefined, totalAPagar: undefined, dtoEasyCashConsulta: undefined } },
    PagarServicioEasyCashDebitoCuenta: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "EasyCash", TransactionDescription: "PagarServicioEasyCashDebitoCuenta", TransactionCode: "PAYWITHACC", Parameters: { numeroCuenta: undefined, totalAPagar: undefined, dtoEasyCashConsulta: undefined } },
    ConsultarServicioEasyCashFrecuent: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "EasyCash", TransactionDescription: "ConsultarServicioEasyCashFrecuent", TransactionCode: "QUERYFREQUENT", Parameters: { Hash: undefined } },

    /*Login Biometrical*/
    ValidateBiometricAccess: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "AppBancaMovil", TransactionDescription: "ValidateUsersPINandLogin", TransactionCode: "50", Parameters: { esRegistro: false, LastTimeAccessedPosition: "", TokenAPNGCM: "" } },
    EnviarDocumentosCreditoPorCorreo: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "Credito", TransactionDescription: "EnviarDocumentosCreditoPorCorreo", TransactionCode: "51", Parameters: { numeroCredito: "", destinatario: "", nombreCliente: "" } },
    ConsultarCondicionesCredito: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "Credito", TransactionDescription: "ConsultarCondicionesCredito", TransactionCode: "52", Parameters: { idCliente: "", numeroCredito: "" } },
    EnviarTablaAmortizacionPorCorreo: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "Credito", TransactionDescription: "EnviarTablaAmortizacionPorCorreo", TransactionCode: "53", Parameters: { idCliente: "", numeroCredito: "", destinatario: "", nombreCliente: "" } },

    //*   ACH   *\\
    ConsultarEntidadFinancieraACH: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "PerfilTransaccional", TransactionDescription: "ConsultarEntidadFinancieraACH", TransactionCode: "56", Parameters: {} },
    EliminaCuentaPermitidaACH: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "PerfilTransaccional", TransactionDescription: "EliminaCuentaPermitidaACH", TransactionCode: "57", Parameters: { listaCtasExternas: [] } },
    CrearCuentaPermitidaACH: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "PerfilTransaccional", TransactionDescription: "CrearCuentaPermitidaACH", TransactionCode: "58", Parameters: { idCliente: "", ctaExterna: {} } },
    ConsultarCuentasClienteACH: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "PerfilTransaccional", TransactionDescription: "ConsultarCuentasClienteACH", TransactionCode: "59", Parameters: { idCliente: "" } },
    TransferenciaACH: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "Cuentas", TransactionDescription: "TransferenciaACH", TransactionCode: "54", Parameters: { correoCliente: "", contextoCliente: {}, numeroCuenta: "", moneda: "", monto: "", codigoAtributo: "", bancoDestino: "", tipoCuentaDestino: "", cuentaDestino: "", observacion: "", nombreBeneficiario: "", correoBeneficiario: "", esAchInmediato: false } },
    ConsultaHistoricoTransferenciaACH: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "Cuentas", TransactionDescription: "ConsultaHistoricoTransferenciaACH", TransactionCode: "55", Parameters: { numeroCuenta: "", fechaInicio: "", fechaFin: "" } },

    ConsultarEntidadInmediato: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "PerfilTransaccional", TransactionDescription: "ConsultarEntidadInmediato", TransactionCode: "72", Parameters: { IdEntidadFinanciera: 0 } },

    /*      PAGO CREDITO CON DEBITO A CUENTA        */
    ConsultaPagoCredito: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "Credito", TransactionDescription: "ConsultaPagoCredito", TransactionCode: "60", Parameters: { numeroCredito: '' } },
    ObtenerTasaDeConversion: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "Credito", TransactionDescription: "ObtenerTasaDeConversion", TransactionCode: "61", Parameters: { monedas: '' } },
    ConsultaCreditosVigentes: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "Credito", TransactionDescription: "ConsultaCreditosVigentes", TransactionCode: "62", Parameters: { numeroDocumento: '' } },
    PagarCreditoConDebitoACuenta: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "Credito", TransactionDescription: "PagarCreditoConDebitoACuenta", TransactionCode: "63", Parameters: { ctaMoneda: '', numeroCuenta: '', monto: '', numeroCredito: '', contextoCliente: {} } },
    ObtenerCreditosCliente: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "Credito", TransactionDescription: "ObtenerCreditosCliente", TransactionCode: "68", Parameters: { idCliente: '' } },

    /*      PAGO TARJETA CON DEBITO A CUENTA        */
    PagarTarjetaConDebitoACuenta: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "Tarjeta", TransactionDescription: "PagarTarjetaConDebitoACuenta", TransactionCode: "64", Parameters: { ctaMoneda: '', numeroCuenta: '', monedaTransaccion: '', monto: '', numeroTarjeta: '' } },
    PagarTRJRevolvente: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "Tarjeta", TransactionDescription: "PagarTRJRevolvente", TransactionCode: "78", Parameters: {} },

    /*PAGO DE SERVICIOS*/
    ConsultarCatalogoServicios: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "Servicios", TransactionDescription: "ConsultarCatalogoServicios", TransactionCode: "65", Parameters: { tipoComercio: '', tipoBusquedaSeleccionada: '', numero: '', } },
    ConsultaPagoServicios: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "Servicios", TransactionDescription: "ConsultaPagoServicios", TransactionCode: "66", Parameters: { tipoComercio: '', requerimiento: { Comercio: 0, TipoTransaccion: 0, NumeroCuenta: '', TipoCuenta: '', CodigoProducto: '', Secuencial: '', SecuencialPagoReversar: '', Documento: '', Moneda: '', Monto: 0.0, FechaRemision: '', Reintento: 0, NombreCliente: '', NIT: '', CorreoElectronico: '', } } },
    RealizarPagoServicios: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "Servicios", TransactionDescription: "RealizarPagoServicios", TransactionCode: "67", Parameters: { tipoComercio: '', ctaMoneda: '', numeroCuenta: '', monto: 0.0, codigoAtributo: '', requerimiento: { Comercio: 0, TipoTransaccion: 0, NumeroCuenta: '', TipoCuenta: '', CodigoProducto: '', Secuencial: '', SecuencialPagoReversar: '', Documento: '', Moneda: '', Monto: 0.0, FechaRemision: '', Reintento: 0, NombreCliente: '', NIT: '', CorreoElectronico: '', }, correoComprobante: '', NombrePago: '', DireccionPago: '', CargoPago: '', SaldoPago: '', Producto: '', NombreCliente: '', } },

    /*Consultas Tarjeta*/
    ConsultarSaldosTarjetaWeb: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "Tarjeta", TransactionDescription: "ConsultarSaldosTarjetaWeb", TransactionCode: "69", Parameters: { numeroTarjeta: '' } },
    ConsultarUltimosMovimientosTarjetaWeb: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "Tarjeta", TransactionDescription: "ConsultarUltimosMovimientosTarjetaWeb", TransactionCode: "70", Parameters: { numeroTarjeta: '' } },
    ConsultarEstadoCuentaTarjetaWEB: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "Tarjeta", TransactionDescription: "ConsultarEstadoCuentaTarjetaWEB", TransactionCode: "71", Parameters: { numeroTarjeta: '', fechaCorteStr: '', fechaCorte: '' } },
    ConsultarPreguntasSeguridadAleatoriamente: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "Account", TransactionDescription: "ConsultarPreguntasSeguridadAleatoriamente", TransactionCode: "73", Parameters: { nombreUsuario: '' } },
    /*VisaNet*/
    PagarBotonVisaNet: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "Credito", TransactionDescription: "PagarBotonVisaNet", TransactionCode: "74", Parameters: { monedaTransaccion: '', numeroTarjeta: '', codigoSeguridad: '', fechaExpiracion: '', monto: 0, numeroCredito: '', tasaConversion: 0, contextoCliente: {}, correoComprobante: '' } },
    PagarTarjetaBotonVisaNet: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "Tarjeta", TransactionDescription: "PagarBotonVisaNet", TransactionCode: "75", Parameters: { monedaTransaccion: '', numeroTarjeta: '', codigoSeguridad: '', fechaExpiracion: '', monto: 0, numeroCredito: '', tasaConversion: 0, contextoCliente: {}, correoComprobante: '' } },
    PagarTarjetaPropiaBotonVisaNet: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "Tarjeta", TransactionDescription: "PagarBotonVisaNet", TransactionCode: "100", Parameters: { monedaTransaccion: '', numeroTarjeta: '', codigoSeguridad: '', fechaExpiracion: '', monto: 0, numeroCredito: '', tasaConversion: 0, contextoCliente: {}, correoComprobante: '' } },


    /*Akisi*/
    ConsultaClienteBilletera: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "Akisi", TransactionDescription: "ConsultaClienteBilletera", TransactionCode: "76", Parameters: { NumeroCuenta: '', Moneda: '', Monto: '', NumeroTelefono: '', } },
    AfectacionBilleteraElectronica: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "Akisi", TransactionDescription: "AfectacionBilleteraElectronica", TransactionCode: "77", Parameters: { NumeroCuenta: '', Moneda: '', Monto: '', NumeroTelefono: '', } },
    ConsultarTipoCambioNoCliente: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "PerfilTransaccional", TransactionDescription: "ConsultarTipoCambioNoCliente", TransactionCode: "81", Parameters: {} },
    ConsultarTipoProductoCreaUsuario: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "PerfilTransaccional", TransactionDescription: "ConsultarTipoProductoCreaUsuario", TransactionCode: "82", Parameters: {} },
    RegistroCorreoTeléfonoContacto: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "PerfilTransaccional", TransactionDescription: "RegistroCorreoTeléfonoContacto", TransactionCode: "83", Parameters: {} },
    ConsultarPreguntasSeguridadPredefinida: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "Account", TransactionDescription: "ConsultarPreguntasSeguridadPredefinida", TransactionCode: "84", Parameters: {} },
    RegistrarPreguntaYRespuestaSeguridad: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "Account", TransactionDescription: "RegistrarPreguntaYRespuestaSeguridad", TransactionCode: "85", Parameters: {} },
    RecuperaCuposMaximosInstitucionales: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "Cuentas", TransactionDescription: "RecuperaCuposMaximosInstitucionales", TransactionCode: "86", Parameters: {} },
    ConsultaCuposEstablecidosClienteDebito: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "Cuentas", TransactionDescription: "ConsultaCuposEstablecidosClienteDebito", TransactionCode: "87", Parameters: {} },
    GrabarDtoCuposMaximosDebito: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "Cuentas", TransactionDescription: "GrabarDtoCuposMaximosDebito", TransactionCode: "88", Parameters: {} },
    GrabarDtoCuposMaximosCuentas: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "Cuentas", TransactionDescription: "GrabarDtoCuposMaximosCuentas", TransactionCode: "89", Parameters: {} },
    ConsultaDtoCuposMaximosCuentas: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "Cuentas", TransactionDescription: "ConsultaDtoCuposMaximosCuentas", TransactionCode: "90", Parameters: {} },
    ConsultarDtoConsumoNormaIdCuentaTrj: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "Cuentas", TransactionDescription: "ConsultarDtoConsumoNormaIdCuentaTrj", TransactionCode: "91", Parameters: {} },
    GrabarDtoConsumosNorma: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "Cuentas", TransactionDescription: "GrabarDtoConsumosNorma", TransactionCode: "92", Parameters: {} },
    GrabarControlAcceso: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "PerfilTransaccional", TransactionDescription: "GrabarControlAcceso", TransactionCode: "94", Parameters: {} },
    CambioNombreUsuario: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "PerfilTransaccional", TransactionDescription: "CambioNombreUsuario", TransactionCode: "95", Parameters: {} },
    RegistrarUsuarioCambioClave: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "PerfilTransaccional", TransactionDescription: "RegistrarUsuarioCambioClave", TransactionCode: "96", Parameters: {} },
    ConsultaMovimientosAnioMes: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "Cuentas", TransactionDescription: "ConsultaMovimientosAnioMes", TransactionCode: "97", Parameters: {} },
    ConsultarDetalleOficinas: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "AppBancaMovil", TransactionDescription: "ConsultarDetalleOficinas", TransactionCode: "98", Parameters: {} },
    ConsultarControlAccesoClave: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "Account", TransactionDescription: "ConsultarControlAccesoClave", TransactionCode: "99", Parameters: {} },

    ValidarCtaICG_ApiInterna: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "Cuentas", TransactionDescription: "ValidarCtaICG_ApiInterna", TransactionCode: "101", Parameters: {} },




    /******************      CREACION CTA DIGITAL       ********************/
    ConsultarUsuario_NumIntentos: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "PerfilTransaccional", TransactionDescription: "ConsultarUsuario_NumIntentos", TransactionCode: "102", Parameters: {} },

    RegistrarLogAperturaCtaDigital: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "Cuentas", TransactionDescription: "RegistrarLogAperturaCtaDigital", TransactionCode: "103", Parameters: {} },

    ValidarClienteBloqueos: { DeviceId: "", AppVersion: "", AppID: "AppBancaMobile", Controller: "Cuentas", TransactionDescription: "ValidarClienteBloqueos", TransactionCode: "104", Parameters: {} },



}


/*
**************************************************************************************************************************************************************
**************************************************** BANCA MOVIL BANCA MOVIL BANCA MOVIL BANCA MOVIL BANCA MOVIL *******************************************************
**************************************************************************************************************************************************************
*/

function ConsultarUsuario_NumIntentos(tipoIdentificacion, numIdentificacion, addFunction) {
    var transaction = Object.create(Transaction.ConsultarUsuario_NumIntentos);
    transaction.Parameters.tipoIdentificacion = tipoIdentificacion;
    transaction.Parameters.numIdentificacion = numIdentificacion;
    //SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');

    addFunction({ numeroIntentos: 0, existe: false })
}

function RegistrarLogAperturaCtaDigital(CtaDigitalForm) {

    var transaction = Object.create(Transaction.RegistrarLogAperturaCtaDigital);
    transaction.Parameters.CtaDigitalForm = CtaDigitalForm;

    //SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');

    addFunction(false);
}





function ValidarCtaICG_ApiInterna(bicDestino, account, currency, product, addFunction) {
    var transaction = Object.create(Transaction.ValidarCtaICG_ApiInterna);
    transaction.Parameters.bicDestino = bicDestino;
    transaction.Parameters.account = account;
    transaction.Parameters.currency = currency;
    transaction.Parameters.product = product;
    SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
}

function PagarTarjetaPropiaBotonVisaNet(monedaTransaccion, numeroTarjeta, codigoSeguridad, fechaExpiracion, monto, numeroCredito, tasaConversion, correoComprobante, idCuentaTarjeta, addFunction) {
    try {
        var transaction = Object.create(Transaction.PagarTarjetaPropiaBotonVisaNet);
        transaction.Parameters.monedaTransaccion = monedaTransaccion;
        transaction.Parameters.numeroTarjeta = numeroTarjeta;
        transaction.Parameters.codigoSeguridad = codigoSeguridad;
        transaction.Parameters.fechaExpiracion = fechaExpiracion;
        transaction.Parameters.monto = monto;//YYMM
        transaction.Parameters.numeroCredito = numeroCredito;
        transaction.Parameters.tasaConversion = tasaConversion;
        transaction.Parameters.contextoCliente = SesionMovil.ContextoCliente;
        transaction.Parameters.correoComprobante = correoComprobante;
        transaction.Parameters.idCuentaTarjeta = idCuentaTarjeta;
        SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    } catch (e) {
        throw e;
    }
}

function ConsultarControlAccesoClave(tipoIdentificacion, numeroIdentificacion, addFunction) {
    var transaction = Object.create(Transaction.ConsultarControlAccesoClave);
    transaction.Parameters.TipoIdentificacion = tipoIdentificacion;
    transaction.Parameters.NumeroIdentificacion = numeroIdentificacion;
    transaction.Parameters.ConsultaPorNombreUsuario = false;
    transaction.Parameters.ActualizoFechaCaducidadClave = true;
    SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
}

function ConsultarDetalleOficinas(latitud, longitud, addFunction) {
    var transaction = Object.create(Transaction.ConsultarDetalleOficinas);
    transaction.Parameters.latitud = latitud;
    transaction.Parameters.longitud = longitud;
    SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
}

function ConsultaMovimientosAnioMes(cuenta, anio, mes, ctaMoneda, enviarArchivo, addFunction) {
    var transaction = Object.create(Transaction.ConsultaMovimientosAnioMes);
    transaction.Parameters.cuenta = cuenta;
    transaction.Parameters.anio = anio;
    transaction.Parameters.mes = mes;
    transaction.Parameters.nombreTitular = SesionMovil.ContextoCliente.NombreCompletoCliente;
    transaction.Parameters.correoDestino = SesionMovil.ControlAccesoGlobal.CorreoElectronicoRegistrado;
    transaction.Parameters.ctaMoneda = ctaMoneda;
    transaction.Parameters.enviarArchivo = enviarArchivo;
    SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
}


function RegistrarUsuarioCambioClave(grabarControlAcceso, contextCliente, passwordActual, passwordNuevo, addFunction) {
    var transaction = Object.create(Transaction.RegistrarUsuarioCambioClave);
    transaction.Parameters.grabarControlAcceso = grabarControlAcceso;
    transaction.Parameters.contextCliente = contextCliente;
    transaction.Parameters.passwordActual = passwordActual;
    transaction.Parameters.passwordNuevo = passwordNuevo;
    SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
}


function GrabarControlAcceso(grabarControlAcceso, addFunction) {
    var transaction = Object.create(Transaction.GrabarControlAcceso);
    transaction.Parameters.grabarControlAcceso = grabarControlAcceso;
    SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
}


function CambioNombreUsuario(grabarControlAcceso, passwordCliente, contextCliente, addFunction) {
    var transaction = Object.create(Transaction.CambioNombreUsuario);
    transaction.Parameters.grabarControlAcceso = grabarControlAcceso;
    transaction.Parameters.contextCliente = contextCliente;
    transaction.Parameters.passwordCliente = passwordCliente;
    SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
}

function RecuperaCuposMaximosInstitucionales(idTarjHabiente, esDolares, addFunction) {
    var transaction = Object.create(Transaction.RecuperaCuposMaximosInstitucionales);
    transaction.Parameters.contextCliente = SesionMovil.ContextoCliente;
    transaction.Parameters.idTarjHabiente = idTarjHabiente;
    transaction.Parameters.esDolares = esDolares;
    SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
}

function ConsultaCuposEstablecidosClienteDebito(numCuenta, addFunction) {
    var transaction = Object.create(Transaction.ConsultaCuposEstablecidosClienteDebito);
    transaction.Parameters.contextCliente = SesionMovil.ContextoCliente;
    transaction.Parameters.numCuenta = numCuenta;
    SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
}
function GrabarDtoCuposMaximosDebito(modificado, original, addFunction) {
    var transaction = Object.create(Transaction.GrabarDtoCuposMaximosDebito);
    transaction.Parameters.contextCliente = SesionMovil.ContextoCliente;
    transaction.Parameters.modificado = modificado; //[]
    transaction.Parameters.original = original; //[]

    /*lst de 
     * IdComprasNorma INT
     * NumeroCuenta STR
     * CupoAutorizado DECIMAL
     * 
     */
    SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
}

function GrabarDtoCuposMaximosCuentas(PoseeTarjeta, modificado, original, RetiroAtm, MaximoTransferencias, addFunction) {
    var transaction = Object.create(Transaction.GrabarDtoCuposMaximosCuentas);
    transaction.Parameters.contextCliente = SesionMovil.ContextoCliente;
    transaction.Parameters.PoseeTarjeta = PoseeTarjeta;
    transaction.Parameters.modificado = modificado;
    transaction.Parameters.original = original;
    transaction.Parameters.RetiroAtm = RetiroAtm;
    /*RetiroAtm
     string NumeroCuenta
     decimal CupoDiario
     decimal CupoSemanal
     decimal CupoMensual     
     */
    transaction.Parameters.MaximoTransferencias = MaximoTransferencias;
    /*
     int IdCuentaCliente
     decimal CupoDiario
     decimal CupoSemanal
     decimal CupoMensual
     */
    SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
}
function ConsultaDtoCuposMaximosCuentas(NumCuenta, idCuentaSeleccion, addFunction) {
    var transaction = Object.create(Transaction.ConsultaDtoCuposMaximosCuentas);
    transaction.Parameters.contextCliente = SesionMovil.ContextoCliente;
    transaction.Parameters.NumCuenta = NumCuenta;
    transaction.Parameters.idCuentaSeleccion = idCuentaSeleccion;
    SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
}

function ConsultarDtoConsumoNormaIdCuentaTrj(idCuentaTarjeta, addFunction) {
    var transaction = Object.create(Transaction.ConsultarDtoConsumoNormaIdCuentaTrj);
    transaction.Parameters.contextCliente = SesionMovil.ContextoCliente;
    transaction.Parameters.idCuentaTarjeta = idCuentaTarjeta;
    SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
}

function GrabarDtoConsumosNorma(modificado, original, addFunction) {
    var transaction = Object.create(Transaction.GrabarDtoConsumosNorma);
    transaction.Parameters.contextCliente = SesionMovil.ContextoCliente;
    transaction.Parameters.modificado = modificado;
    transaction.Parameters.original = original;
    //DtoConsumoNorma
    /*
    int IdConsumoNorma 
    int IdTarjetaHabiente
    decimal CupoConsumo
    decimal CupoAvance 
    decimal CupoInternet 
    decimal CupoInternacional 
    */

    SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
}

function RegistrarPreguntaYRespuestaSeguridad(listAccesoPregunta, addFunction) {
    var transaction = Object.create(Transaction.RegistrarPreguntaYRespuestaSeguridad);
    transaction.Parameters.contextCliente = SesionMovil.ContextoCliente;
    transaction.Parameters.listAccesoPregunta = listAccesoPregunta;
    transaction.Parameters.nombreUsuario = SesionMovil.ControlAccesoGlobal.NombreUsuario;
    SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
}

function ConsultarPreguntasSeguridadPredefinida(addFunction) {
    var transaction = Object.create(Transaction.ConsultarPreguntasSeguridadPredefinida);
    SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
}

function RegistroCorreoTeléfonoContacto(registro, addFunction) {
    var transaction = Object.create(Transaction.RegistroCorreoTeléfonoContacto);
    transaction.Parameters.registro = registro;
    SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
}

function ConsultarTipoProductoCreaUsuario(addFunction) {
    var transaction = Object.create(Transaction.ConsultarTipoProductoCreaUsuario);
    SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
}

function ConsultarTipoCambioNoCliente(addFunction) {
    var transaction = Object.create(Transaction.ConsultarTipoCambioNoCliente);
    SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
}


function PagarTRJRevolvente(numeroCuenta, monedaCta, monto, idCuentaTarjeta, addFunction) {
    var transaction = Object.create(Transaction.PagarTRJRevolvente);
    transaction.Parameters.numeroCuenta = numeroCuenta;
    transaction.Parameters.monedaCta = monedaCta;
    transaction.Parameters.monto = monto;
    transaction.Parameters.idCuentaTarjeta = idCuentaTarjeta;
    SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
}


function ConsultaClienteBilletera(numeroCuenta, moneda, monto, numeroTelefono, addFunction) {
    var transaction = Object.create(Transaction.ConsultaClienteBilletera);
    transaction.Parameters.NumeroCuenta = numeroCuenta;
    transaction.Parameters.Moneda = moneda;
    transaction.Parameters.Monto = monto;
    transaction.Parameters.NumeroTelefono = numeroTelefono;
    SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
}

function AfectacionBilleteraElectronica(numeroCuenta, moneda, monto, numeroTelefono, addFunction) {
    var transaction = Object.create(Transaction.AfectacionBilleteraElectronica);
    transaction.Parameters.NumeroCuenta = numeroCuenta;
    transaction.Parameters.Moneda = moneda;
    transaction.Parameters.Monto = monto;
    transaction.Parameters.NumeroTelefono = numeroTelefono;
    SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
}




function PagarBotonVisaNet(monedaTransaccion, numeroTarjeta, codigoSeguridad, fechaExpiracion, monto, numeroCredito, tasaConversion, correoComprobante, addFunction) {
    try {
        var transaction = Object.create(Transaction.PagarBotonVisaNet);
        transaction.Parameters.monedaTransaccion = monedaTransaccion;
        transaction.Parameters.numeroTarjeta = numeroTarjeta;
        transaction.Parameters.codigoSeguridad = codigoSeguridad;
        transaction.Parameters.fechaExpiracion = fechaExpiracion;
        transaction.Parameters.monto = monto;//YYMM
        transaction.Parameters.numeroCredito = numeroCredito;
        transaction.Parameters.tasaConversion = tasaConversion;
        transaction.Parameters.contextoCliente = SesionMovil.ContextoCliente;
        transaction.Parameters.correoComprobante = correoComprobante;
        SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    } catch (e) {
        throw e;
    }
}

function PagarTarjetaBotonVisaNet(monedaTransaccion, numeroTarjeta, codigoSeguridad, fechaExpiracion, monto, numeroCredito, tasaConversion, correoComprobante, addFunction) {
    try {
        var transaction = Object.create(Transaction.PagarTarjetaBotonVisaNet);
        transaction.Parameters.monedaTransaccion = monedaTransaccion;
        transaction.Parameters.numeroTarjeta = numeroTarjeta;
        transaction.Parameters.codigoSeguridad = codigoSeguridad;
        transaction.Parameters.fechaExpiracion = fechaExpiracion;
        transaction.Parameters.monto = monto;//YYMM
        transaction.Parameters.numeroCredito = numeroCredito;
        transaction.Parameters.tasaConversion = tasaConversion;
        transaction.Parameters.contextoCliente = SesionMovil.ContextoCliente;
        transaction.Parameters.correoComprobante = correoComprobante;
        SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    } catch (e) {
        throw e;
    }
}



function ConsultarPreguntasSeguridadAleatoriamente(nombreUsuario, addFunction) {
    try {
        var transaction = Object.create(Transaction.ConsultarPreguntasSeguridadAleatoriamente);
        transaction.Parameters.nombreUsuario = nombreUsuario;
        SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    } catch (e) {
        throw e;
    }
}




/*REFRESCAR CUENTAS CLIENTE*/
function RefrescarCuentasCliente(addFunction) {
    ObtenerCuentasCliente(SesionMovil.ContextoCliente, function (data) {
        SesionMovil.PosicionConsolidada.CuentasCliente = data
        sessionStorage.setItem('', '');
        sessionStorage.setItem('FechaActividadApp', new Date());
        addFunction();
    });
}


function ObtenerCuentasClientePosConsolidada(args, addFunction) {
    try {
        var transaction = Object.create(Transaction.ObtenerCuentasCliente);
        transaction.Parameters.contextCliente = SesionMovil.ContextoCliente;
        return SendPostRequestToService(transaction, function (data) {
            SesionMovil.PosicionConsolidada.CuentasCliente = data
            sessionStorage.setItem('', '');
            sessionStorage.setItem('FechaActividadApp', new Date());
            addFunction(args);
        }, LoadScreen, 'Mobile');
    } catch (e) {
        throw e;
    }
}


/* FIN REFRESCAR CUENTAS CLIENTE*/

/* Consultas Tarjeta de Credito*/
function ConsultarSaldosTarjetaWeb(numeroTarjeta, addFunction) {
    try {
        var transaction = Object.create(Transaction.ConsultarSaldosTarjetaWeb);
        transaction.Parameters.numeroTarjeta = numeroTarjeta;
        SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    } catch (e) {
        throw e;
    }
}

function ConsultarUltimosMovimientosTarjetaWeb(numeroTarjeta, addFunction) {
    try {
        var transaction = Object.create(Transaction.ConsultarUltimosMovimientosTarjetaWeb);
        transaction.Parameters.numeroTarjeta = numeroTarjeta;
        SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    } catch (e) {
        throw e;
    }
}

function ConsultarEstadoCuentaTarjetaWEB(numeroTarjeta, fechaCorte, addFunction) {
    try {
        var transaction = Object.create(Transaction.ConsultarEstadoCuentaTarjetaWEB);
        transaction.Parameters.numeroTarjeta = numeroTarjeta;
        transaction.Parameters.fechaCorteStr = fechaCorte;
        transaction.Parameters.fechaCorte = Date.parse(fechaCorte.split("/").join("-")).toString("yyyy-MM-dd");
        SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    } catch (e) {
        throw e;
    }
}
/* FIN Consultas Tarjeta de Credito*/

/*  PAGO DE SERVICIOS */

function ConsultarCatalogoServicios(tipoComercio, tipoBusquedaSeleccionada, numero, addFunction) {
    try {
        var transaction = Object.create(Transaction.ConsultarCatalogoServicios);
        transaction.Parameters.tipoComercio = tipoComercio;
        transaction.Parameters.tipoBusquedaSeleccionada = tipoBusquedaSeleccionada;
        transaction.Parameters.numero = numero;
        SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');

    } catch (e) {
        throw e;
    }
}

function ConsultaPagoServicios(requerimiento, addFunction) {
    try {
        var transaction = Object.create(Transaction.ConsultaPagoServicios);
        transaction.Parameters.requerimiento = requerimiento;
        SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    } catch (e) {
        throw e;
    }
}

function RealizarPagoServicios(ctaMoneda, numeroCuenta, monto, codigoAtributo, requerimiento, correoComprobante, nombrePago, direccionPago, cargoPago, saldoPago, producto, addFunction) {
    try {
        var transaction = Object.create(Transaction.RealizarPagoServicios);
        transaction.Parameters.ctaMoneda = ctaMoneda;
        transaction.Parameters.numeroCuenta = numeroCuenta;
        transaction.Parameters.monto = monto;
        transaction.Parameters.codigoAtributo = codigoAtributo;
        transaction.Parameters.requerimiento = requerimiento;
        transaction.Parameters.correoComprobante = correoComprobante;

        transaction.Parameters.nombrePago = nombrePago;
        transaction.Parameters.direccionPago = direccionPago;
        transaction.Parameters.cargoPago = cargoPago;
        transaction.Parameters.saldoPago = saldoPago;
        transaction.Parameters.producto = producto;
        transaction.Parameters.nombreCliente = SesionMovil.ContextoCliente.NombreCompletoCliente



        SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    } catch (e) {
        throw e;
    }
}

/* FIN PAGO DE SERVICIOS */


/*      PAGO CREDITO CON DEBITO A CUENTA        */

function ObtenerCreditosCliente(addFunction) {
    try {
        var transaction = Object.create(Transaction.ObtenerCreditosCliente);
        transaction.Parameters.idCliente = SesionMovil.ContextoCliente.CodigoCliente;

        SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    } catch (e) {
        throw e;
    }
}

function ConsultaPagoCredito(numeroCredito, addFunction) {
    try {
        var transaction = Object.create(Transaction.ConsultaPagoCredito);
        transaction.Parameters.numeroCredito = numeroCredito;
        SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    } catch (e) {
        throw e;
    }
}


function ObtenerTasaDeConversion(monedas, addFunction) {
    try {
        var transaction = Object.create(Transaction.ObtenerTasaDeConversion);
        transaction.Parameters.monedas = monedas;
        SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    } catch (e) {
        throw e;
    }
}


function ConsultaCreditosVigentes(addFunction) {
    try {
        var transaction = Object.create(Transaction.ConsultaCreditosVigentes);
        transaction.Parameters.numeroDocumento = SesionMovil.ContextoCliente.NumeroDocumento;
        SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    } catch (e) {
        throw e;
    }
}


function PagarCreditoConDebitoACuenta(ctaMoneda, numeroCuenta, monto, numeroCredito, addFunction) {
    try {
        var transaction = Object.create(Transaction.PagarCreditoConDebitoACuenta);
        transaction.Parameters.contextoCliente = SesionMovil.ContextoCliente;
        transaction.Parameters.numeroCredito = numeroCredito;
        transaction.Parameters.monto = monto;
        transaction.Parameters.numeroCuenta = numeroCuenta;
        transaction.Parameters.ctaMoneda = ctaMoneda;
        SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    } catch (e) {
        throw e;
    }
}


/*      PAGO TARJETA CON DEBITO A CUENTA        */


function PagarTarjetaConDebitoACuenta(ctaMoneda, numeroCuenta, monedaTransaccion, monto, numeroTarjeta, addFunction) {
    try {
        var transaction = Object.create(Transaction.PagarTarjetaConDebitoACuenta);
        transaction.Parameters.tasaConversion = SesionMovil.PosicionConsolidada.TarjetasCliente[0].Cotizacion;
        transaction.Parameters.ctaMoneda = ctaMoneda;
        transaction.Parameters.numeroCuenta = numeroCuenta;
        transaction.Parameters.monedaTransaccion = monedaTransaccion;
        transaction.Parameters.monto = monto;
        transaction.Parameters.numeroTarjeta = numeroTarjeta;
        SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');

    } catch (e) {
        throw e;
    }
}


/*
 ACH
 */


function ConsultarEntidadInmediato(IdEntidadFinanciera, addFunction) {
    try {
        var transaction = Object.create(Transaction.ConsultarEntidadInmediato);
        transaction.Parameters.IdEntidadFinanciera = IdEntidadFinanciera;
        SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    } catch (e) {
        throw e;
    }
}

function ConsultarEntidadFinancieraACH(addFunction) {
    try {
        var transaction = Object.create(Transaction.ConsultarEntidadFinancieraACH);
        SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    } catch (e) {
        throw e;
    }
}

function EliminaCuentaPermitidaACH(listaCtasExternas, addFunction) {
    try {
        var transaction = Object.create(Transaction.EliminaCuentaPermitidaACH);
        transaction.Parameters.listaCtasExternas = listaCtasExternas;
        SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    } catch (e) {
        throw e;
    }
}

function CrearCuentaPermitidaACH(ctaExterna, addFunction) {
    try {
        var transaction = Object.create(Transaction.CrearCuentaPermitidaACH);
        transaction.Parameters.idCliente = SesionMovil.ContextoCliente.CodigoCliente;
        transaction.Parameters.ctaExterna = ctaExterna;
        SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    } catch (e) {
        throw e;
    }
}

function ConsultarCuentasClienteACH(addFunction) {
    try {
        var transaction = Object.create(Transaction.ConsultarCuentasClienteACH);
        transaction.Parameters.idCliente = SesionMovil.ContextoCliente.CodigoCliente;
        SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    } catch (e) {
        throw e;
    }
}

function TransferenciaACH(correoCliente, numeroCuenta, moneda, monto, codigoAtributo, bancoDestino, tipoCuentaDestino, cuentaDestino, observacion, nombreBeneficiario, correoBeneficiario, esAchInmediato, addFunction) {
    try {
        var transaction = Object.create(Transaction.TransferenciaACH);
        transaction.Parameters.contextoCliente = SesionMovil.ContextoCliente;
        transaction.Parameters.correoCliente = correoCliente;
        transaction.Parameters.numeroCuenta = numeroCuenta;
        transaction.Parameters.moneda = moneda;
        transaction.Parameters.monto = monto;
        transaction.Parameters.codigoAtributo = codigoAtributo;
        transaction.Parameters.bancoDestino = bancoDestino;
        transaction.Parameters.tipoCuentaDestino = tipoCuentaDestino;
        transaction.Parameters.cuentaDestino = cuentaDestino;
        transaction.Parameters.observacion = observacion;
        transaction.Parameters.nombreBeneficiario = nombreBeneficiario;
        transaction.Parameters.correoBeneficiario = correoBeneficiario;
        transaction.Parameters.esAchInmediato = esAchInmediato;
        SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    } catch (e) {

        throw e;
    }
}

function ConsultaHistoricoTransferenciaACH(numeroCuenta, fechaInicio, fechaFin, addFunction) {
    try {
        var transaction = Object.create(Transaction.ConsultaHistoricoTransferenciaACH);
        transaction.Parameters.numeroCuenta = numeroCuenta;
        transaction.Parameters.fechaInicio = fechaInicio;
        transaction.Parameters.fechaFin = fechaFin;
        SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    } catch (e) {
        throw e;
    }
}



/*
 FIN ACH
 */




function EnviarTablaAmortizacionPorCorreo(numeroCredito, addFunction) {
    try {
        var transaction = Object.create(Transaction.EnviarTablaAmortizacionPorCorreo);
        transaction.Parameters.numeroCredito = numeroCredito;
        transaction.Parameters.idCliente = SesionMovil.ContextoCliente.CodigoCliente;
        transaction.Parameters.destinatario = SesionMovil.ControlAccesoGlobal.CorreoElectronicoRegistrado;
        transaction.Parameters.nombreCliente = SesionMovil.ContextoCliente.NombreCompletoCliente;
        SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    } catch (e) {
        throw e;
    }
}

function EnviarDocumentosCreditoPorCorreo(numeroCredito, addFunction) {
    try {
        var transaction = Object.create(Transaction.EnviarDocumentosCreditoPorCorreo);
        transaction.Parameters.numeroCredito = numeroCredito;
        transaction.Parameters.destinatario = SesionMovil.ControlAccesoGlobal.CorreoElectronicoRegistrado;
        transaction.Parameters.nombreCliente = SesionMovil.ContextoCliente.NombreCompletoCliente;
        SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    } catch (e) {
        throw e;
    }
}

function ConsultarCatalogoServicioBasico(descripcion, addFunction) {
    try {
        var transaction = Object.create(Transaction.ConsultarCatalogoServicioBasico);
        transaction.Parameters.nombreCatalogo = descripcion;
        SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    } catch (e) {
        throw e;
    }
}

function CambioPinSeguridad(oldPin, newPin, addFunction) {
    try {
        var transaction = Object.create(Transaction.CambioPinSeguridad);
        transaction.Parameters.newPin = newPin;
        transaction.Parameters.oldPin = oldPin;
        SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    } catch (e) {
        throw e;
    }
}

function OlvideMiPin(addFunction) {
    try {
        var transaction = Object.create(Transaction.OlvideMiPin);
        SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    } catch (e) {
        throw e;
    }
}

function ValidateUsersPINandLogin(InsertedPIN, addFunction) {
    try {
        var transaction = Object.create(Transaction.ValidateUsersPINandLogin);
        transaction.Parameters.InsertedPIN = InsertedPIN;
        transaction.Parameters.esRegistro = true;
        transaction.Parameters.TokenAPNGCM = TokenAPN_GCM
        transaction.Parameters.LastTimeAccessedPosition = currentPosition.PosicionInsertar;
        transaction.Parameters.type = "PIN";
        SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    } catch (e) {
        throw e;
    }
}

function SaveUserInServerAppBancaMobile(esNuevoPIN, documentType, documentNumber, names, userMail, phoneNumber, clientId, username, accessPIN, usersPassWord, addFunction) {
    try {
        var transaction = Object.create(Transaction.SaveUserInServerAppBancaMobile);
        transaction.Parameters.documentType = documentType;
        transaction.Parameters.documentNumber = documentNumber;
        transaction.Parameters.clientId = clientId;
        transaction.Parameters.username = username;
        transaction.Parameters.accessPIN = accessPIN;
        transaction.Parameters.usersPassWord = usersPassWord;
        transaction.Parameters.phoneNumber = phoneNumber;
        transaction.Parameters.email = userMail;
        transaction.Parameters.name = names;
        transaction.Parameters.token = TokenAPN_GCM;
        transaction.Parameters.osPlatform = DeviceInfo.DevicePlatform;
        transaction.Parameters.model = DeviceInfo.DeviceModel;
        transaction.Parameters.manufacturer = DeviceInfo.DeviceManufacturer;
        transaction.Parameters.deviceVersion = DeviceInfo.DeviceVersion;
        transaction.Parameters.lastTimeAccesedPosition = currentPosition.PosicionInsertar;
        transaction.Parameters.esNuevoPIN = esNuevoPIN;
        SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    } catch (e) {
        throw e;
    }
}

function RecargarTiempoAire(contextoCliente, cadena, numeroCelular, tarjeta, plazo, valor, cvv, anioExp, mesExp, addFunction) {
    try {
        var transaction = Object.create(Transaction.RecargarTiempoAire);
        transaction.Parameters.contextoCliente = contextoCliente;
        transaction.Parameters.cadena = cadena;
        transaction.Parameters.numeroCelular = numeroCelular;
        transaction.Parameters.tarjeta = tarjeta;
        transaction.Parameters.plazo = plazo;
        transaction.Parameters.valor = valor;
        transaction.Parameters.cvv = cvv;
        transaction.Parameters.anioExp = anioExp;
        transaction.Parameters.mesExp = mesExp;
        SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    } catch (e) {
        throw e;
    }
}

function GetAppParameters(addFunction) {
    try {
        var transaction = Object.create(Transaction.GetAppParameters);
        return SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    } catch (e) {
        showErrorMessage('', e.AditionalCoreMessage.length > 0 ? e.AditionalCoreMessage : CORE_MESSAGE(e.TransactionResponseCode));
    }
}

function ReportarExcepcionAppBancaMovil(jsExceptionMessage, jsExceptionStack, methodParameters) {
    try {
        var transaction = Object.create(Transaction.ReportarExcepcionAppBancaMovil);
        transaction.Parameters.jsExceptionMessage = (jsExceptionMessage === undefined) ? "" : jsExceptionMessage;
        transaction.Parameters.jsExceptionStack = (jsExceptionStack === undefined) ? "" : jsExceptionStack;
        transaction.Parameters.methodParameters = (methodParameters === undefined) ? "" : methodParameters;
        return SendPostRequestToService(transaction, undefined, LoadScreen, 'Mobile');
    } catch (e) {

        throw e;
    }
}

function RegistrarDispositivoAppBancaMovil(lastTimeAccesedPosition, contextoCliente, resultadoConsultaControlAcceso, addFunction) {
    try {
        var transaction = Object.create(Transaction.RegistrarDispositivoAppBancaMovil);
        transaction.Parameters.tokenACM_GCM = (TokenAPN_GCM === undefined) ? "" : TokenAPN_GCM;
        transaction.Parameters.osPlatform = (DeviceInfo.DevicePlatform === undefined) ? "" : DeviceInfo.DevicePlatform;
        transaction.Parameters.model = (DeviceInfo.DeviceModel === undefined) ? "" : DeviceInfo.DeviceModel;
        transaction.Parameters.manufacturer = (DeviceInfo.DeviceManufacturer === undefined) ? "" : DeviceInfo.DeviceManufacturer;
        transaction.Parameters.lastTimeAccesedPosition = (lastTimeAccesedPosition === undefined) ? "" : currentPosition.PosicionInsertar;
        transaction.Parameters.deviceVersion = (DeviceInfo.DeviceVersion === undefined) ? "" : DeviceInfo.DeviceVersion;
        transaction.Parameters.contextoCliente = contextoCliente;
        transaction.Parameters.dtoResultadoConsultaControlAcceso = resultadoConsultaControlAcceso;
        return SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    } catch (e) {
        showErrorMessage('', e.AditionalCoreMessage.length > 0 ? e.AditionalCoreMessage : CORE_MESSAGE(e.TransactionResponseCode));
    }
}

function LogInLandingPage(userName, password, lastTimeAccesedPosition, esRegistro, addFunction) {
    try {
        var transaction = Object.create(Transaction.LogInLandingPage);
        transaction.Parameters.username = userName;
        transaction.Parameters.password = password;
        transaction.Parameters.TokenAPNGCM = TokenAPN_GCM;
        transaction.Parameters.lastTimeAccesedPosition = (lastTimeAccesedPosition === undefined) ? "" : lastTimeAccesedPosition.PosicionInsertar;
        transaction.Parameters.esRegistro = esRegistro;
        transaction.Parameters.type = "CRED";
        SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    } catch (e) {
        throw e;
    }
}


function LogIn(userName, password, lastTimeAccesedPosition, esRegistro, addFunction) {
    try {
        var transaction = Object.create(Transaction.LogInPost);
        transaction.Parameters.username = userName;
        transaction.Parameters.password = password;
        transaction.Parameters.TokenAPNGCM = TokenAPN_GCM;
        transaction.Parameters.lastTimeAccesedPosition = (lastTimeAccesedPosition === undefined) ? "" : lastTimeAccesedPosition.PosicionInsertar;
        transaction.Parameters.esRegistro = esRegistro;
        SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    } catch (e) {
        throw e;
    }
}

function EnviarCorreoContacto(contextoCliente, tema, numeroTelefonoSecundario, cuerpo, DtoResultadoConsultaControlAcceso, CorreoElectronicoSecundario, addFunction) {
    try {
        var transaction = Object.create(Transaction.EnviarCorreoContacto);
        transaction.Parameters.ContextoCliente = contextoCliente;
        transaction.Parameters.Tema = (tema === undefined) ? "" : tema;
        transaction.Parameters.NumeroTelefonoSecundario = (numeroTelefonoSecundario === undefined) ? "" : numeroTelefonoSecundario;
        transaction.Parameters.Cuerpo = (cuerpo === undefined) ? "" : cuerpo;
        transaction.Parameters.CorreoElectronicoSecundario = (CorreoElectronicoSecundario === undefined) ? "" : CorreoElectronicoSecundario;
        transaction.Parameters.DtoResultadoConsultaControlAcceso = DtoResultadoConsultaControlAcceso;
        SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    } catch (e) {
        showErrorMessage('', e.AditionalCoreMessage.length > 0 ? e.AditionalCoreMessage : CORE_MESSAGE(e.TransactionResponseCode));
    }
}

function CambiarPassword(passwordActual, passwordNuevo, contextoCliente, addFunction) {
    try {
        var transaction = Object.create(Transaction.CambiarPassword);
        transaction.Parameters.passwordActual = passwordActual;
        transaction.Parameters.passwordNuevo = passwordNuevo;
        transaction.Parameters.contextoCliente = contextoCliente;
        return SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    } catch (e) {
        showErrorMessage('', e.AditionalCoreMessage.length > 0 ? e.AditionalCoreMessage : CORE_MESSAGE(e.TransactionResponseCode));
    }
}

function ConsultarControlAcceso(userName, addFunction) {
    try {
        var transaction = Object.create(Transaction.ConsultarControlAcceso);
        transaction.Parameters.userName = userName;
        SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    } catch (e) {
        showErrorMessage('', e.AditionalCoreMessage.length > 0 ? e.AditionalCoreMessage : CORE_MESSAGE(e.TransactionResponseCode));
    }
}

function ObtenerUltimasComprasTCF(idCuentaTarjeta, indice, registros, contextCliente, addFunction) {
    try {
        var transaction = Object.create(Transaction.ObtenerUltimasComprasTCF);
        transaction.Parameters.idCuentaTarjeta = idCuentaTarjeta;
        transaction.Parameters.indice = indice;
        transaction.Parameters.registros = registros;
        transaction.Parameters.contextCliente = contextCliente;
        return SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    } catch (e) {
        showErrorMessage('', e.AditionalCoreMessage.length > 0 ? e.AditionalCoreMessage : CORE_MESSAGE(e.TransactionResponseCode));
    }
}

function ObtenerTransferenciasDirectas(numeroCuenta, fechaInicial, fechaFinal, recibidas) {
    try {
        var transaction = Object.create(Transaction.ObtenerTransferenciasDirectas);
        transaction.Parameters.numeroCuenta = numeroCuenta;
        transaction.Parameters.fechaInicial = fechaInicial;
        transaction.Parameters.fechaFinal = fechaFinal;
        transaction.Parameters.recibidas = recibidas;
        return SendPostRequestToService(transaction, undefined, LoadScreen, 'Mobile');
    } catch (e) {
        showErrorMessage('', e.AditionalCoreMessage.length > 0 ? e.AditionalCoreMessage : CORE_MESSAGE(e.TransactionResponseCode));
    }
}

function RecuperarDatosTransferenciaInterbancaria(numeroCuenta, valorTransferencia, identificacionOrdenante, codigoEntidadBeneficiaria, moneda, addFunction) {
    try {
        var transaction = Object.create(Transaction.RecuperarDatosTransferenciaInterbancaria);
        transaction.Parameters.codigoEntidadBeneficiaria = codigoEntidadBeneficiaria;
        transaction.Parameters.moneda = moneda;
        transaction.Parameters.identificacionOrdenante = identificacionOrdenante;
        transaction.Parameters.valorTransferencia = valorTransferencia;
        transaction.Parameters.numeroCuenta = numeroCuenta;
        return SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    }
    catch (e) {
        showErrorMessage('', e.AditionalCoreMessage.length > 0 ? e.AditionalCoreMessage : CORE_MESSAGE(e.TransactionResponseCode));
    }
}

function RealizarTransferenciaInterBancaria(transferenciaInterbancaria, listaFormaPago, contextCliente, addFunction) {
    try {
        contextCliente.SessionId = SesionMovil.SessionToken.SessionId;
        var transaction = Object.create(Transaction.RealizarTransferenciaInterBancaria);
        transaction.Parameters.contextCliente = contextCliente;
        transaction.Parameters.listaFormaPago = listaFormaPago;
        transaction.Parameters.transferenciaInterbancaria = transferenciaInterbancaria;
        return SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    }
    catch (e) {
        throw e;
    }
}

function EliminarCuentasPermitidasExternas(listaCtasExternas, addFunction) {
    try {
        var transaction = Object.create(Transaction.EliminarCuentasPermitidasExternas);
        transaction.Parameters.listaCtasExternas = listaCtasExternas;
        return SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    }
    catch (e) {
        showErrorMessage('', e.AditionalCoreMessage.length > 0 ? e.AditionalCoreMessage : CORE_MESSAGE(e.TransactionResponseCode));
    }
}

function ConsultarCuentasPermitidasExternas(contextoCliente, addFunction) {
    try {
        var transaction = Object.create(Transaction.ConsultarCuentasPermitidasExternas);
        transaction.Parameters.contextoCliente = contextoCliente;
        return SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    }
    catch (e) {
        showErrorMessage('', e.AditionalCoreMessage.length > 0 ? e.AditionalCoreMessage : CORE_MESSAGE(e.TransactionResponseCode));
    }
}

function GuardarCuentaBeneficiariaExterna(dtoCtaTransferenciaExterna, contextoCliente, addFunction) {
    try {
        contextoCliente.SessionId = SesionMovil.SessionToken.SessionId;
        var transaction = Object.create(Transaction.GuardarCuentaBeneficiariaExterna);
        transaction.Parameters.dtoCtaTransferenciaExterna = dtoCtaTransferenciaExterna;

        transaction.Parameters.contextoCliente = contextoCliente;
        return SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    }
    catch (e) {
        throw e;
    }
}

function ConsultarEntidadFinanciera(addFunction) {
    try {
        var transaction = Object.create(Transaction.ConsultarEntidadFinanciera);
        return SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    }
    catch (e) {
        showErrorMessage('', e.AditionalCoreMessage.length > 0 ? e.AditionalCoreMessage : CORE_MESSAGE(e.TransactionResponseCode));
    }
}

function ConsultarPreguntasSeguridadUsuario(nombreUsuario, addFunction, isAsync) {
    try {
        var transaction = Object.create(Transaction.ConsultarPreguntasSeguridadUsuario);
        transaction.Parameters.nombreUsuario = nombreUsuario;
        return SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    }
    catch (e) {
        showErrorMessage('', e.AditionalCoreMessage.length > 0 ? e.AditionalCoreMessage : CORE_MESSAGE(e.TransactionResponseCode));
    }
}

function OlvidoDeClave(ListaPreguntaUsuario, datosControlAcceso, addFunction) {
    try {
        var transaction = Object.create(Transaction.OlvidoDeClave);
        transaction.Parameters.PreguntaUsuario = ListaPreguntaUsuario;
        transaction.Parameters.datosControlAcceso = datosControlAcceso;
        SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    }
    catch (e) {
        showErrorMessage('', e.AditionalCoreMessage.length > 0 ? e.AditionalCoreMessage : CORE_MESSAGE(e.TransactionResponseCode));
    }
}

function RecuperarNombreUsuarioWeb(contextCliente, tipoIdentificacion, numeroIdentificacion, addFunction) {
    try {
        var transaction = Object.create(Transaction.RecuperarNombreUsuarioWeb);
        transaction.Parameters.contextCliente = contextCliente;
        transaction.Parameters.tipoIdentificacion = tipoIdentificacion;
        transaction.Parameters.numeroIdentificacion = numeroIdentificacion;
        return SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    }
    catch (e) {
        showErrorMessage('', e.AditionalCoreMessage.length > 0 ? e.AditionalCoreMessage : CORE_MESSAGE(e.TransactionResponseCode));
    }
}

function RealizarTranferenciaDirecta(dtoCanalTransferencia, contextCliente, correoOrigen, correoDestino, concepto, addFunction) {
    try {
        contextCliente.SessionId = SesionMovil.SessionToken.SessionId;
        var transaction = Object.create(Transaction.RealizarTranferenciaDirecta);
        transaction.Parameters.contextCliente = contextCliente;
        transaction.Parameters.dtoCanalTransferencia = dtoCanalTransferencia;
        transaction.Parameters.correoOrigen = correoOrigen;
        transaction.Parameters.correoDestino = correoDestino;
        transaction.Parameters.concepto = concepto;
        SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    }
    catch (e) {
        throw e;
    }
}

function EnviarOTP(contextCliente, addFunction) {
    try {
        contextCliente.SessionId = SesionMovil.SessionToken.SessionId;
        var transaction = Object.create(Transaction.EnviarOTP);
        transaction.Parameters.contextCliente = contextCliente;
        return SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    }
    catch (e) {
        showErrorMessage('', e.AditionalCoreMessage.length > 0 ? e.AditionalCoreMessage : CORE_MESSAGE(e.TransactionResponseCode));
    }
}

function ConsultaMovimientos(numeroCuenta, addFunction) {
    try {
        var transaction = Object.create(Transaction.ConsultaMovimientos);
        transaction.Parameters.numeroCuenta = numeroCuenta;
        SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    }
    catch (e) {
        showErrorMessage('', e.AditionalCoreMessage.length > 0 ? e.AditionalCoreMessage : CORE_MESSAGE(e.TransactionResponseCode));
    }
}

function ConsultaMovimientosFechas(cuenta, fechaInicio, fechaFinal, addFunction) {
    try {
        var transaction = Object.create(Transaction.ConsultaMovimientosFechas);
        transaction.Parameters.fechaFinal = fechaFinal;
        transaction.Parameters.fechaInicio = fechaInicio;
        transaction.Parameters.cuenta = cuenta;
        SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    }
    catch (e) {
        showErrorMessage('', e.AditionalCoreMessage.length > 0 ? e.AditionalCoreMessage : CORE_MESSAGE(e.TransactionResponseCode));
    }
}

function ConsultaCuentasPermitidas(intCliente, addFunction) {
    try {
        var transaction = Object.create(Transaction.ConsultaCuentasPermitidas);
        transaction.Parameters.intCliente = intCliente;
        return SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    } catch (e) {
        showErrorMessage('', e.AditionalCoreMessage.length > 0 ? e.AditionalCoreMessage : CORE_MESSAGE(e.TransactionResponseCode));
    }
}

function ConsultaCuentaCanal(strNumerocuenta, addFunction) {
    try {
        var transaction = Object.create(Transaction.ConsultaCuentaCanal);
        transaction.Parameters.strNumerocuenta = strNumerocuenta;
        return SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    } catch (e) {
        showErrorMessage('', e.AditionalCoreMessage.length > 0 ? e.AditionalCoreMessage : CORE_MESSAGE(e.TransactionResponseCode));
    }
}

function EliminarCuentaBeneficiaria(objCuentaPermitida, addFunction) {
    try {
        var transaction = Object.create(Transaction.EliminarCuentaBeneficiaria);
        transaction.Parameters.objCuentaPermitida = objCuentaPermitida;
        return SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    } catch (e) {
        showErrorMessage('', e.AditionalCoreMessage.length > 0 ? e.AditionalCoreMessage : CORE_MESSAGE(e.TransactionResponseCode));
    }
}

function CrearCuentaPermitida(contextCliente, CuentaPermitida, addFunction) {
    try {
        contextCliente.SessionId = SesionMovil.SessionToken.SessionId;
        var transaction = Object.create(Transaction.CrearCuentaPermitida);
        transaction.Parameters.contextCliente = contextCliente;
        transaction.Parameters.CuentaPermitida = CuentaPermitida;
        return SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    } catch (e) {
        throw e;
    }
}

function ConsultarMontoAPagarServicioBasico(contextCliente, criterioConsulta, numeroTelefonoContrato, codigoPrecio, tipoServicio, addFunction) {
    try {
        //contextCliente.SessionId = SesionMovil.SessionToken.SessionId;
        var transaction = Object.create(Transaction.ConsultarMontoAPagarServicioBasico);
        transaction.Parameters.numeroDocumento = contextCliente.NumeroDocumento;//IDCliente
        transaction.Parameters.criterioConsulta = criterioConsulta;
        transaction.Parameters.tipoServicio = tipoServicio;
        transaction.Parameters.telefonoContacto = numeroTelefonoContrato;
        transaction.Parameters.codigoPrecio = codigoPrecio;
        return SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    } catch (e) {
        throw e;
    }
}


/*CNT*/

function PagarCNTDebitoCuenta(contextCliente, nombreCompletoCliente, numeroCuenta, numeroPapeleta, valor, criterioConsulta, tipoServicio, telefonoContacto, correoElectronicoTercero, objRespuestaCNT, addFunction) {
    try {
        contextCliente.SessionId = SesionMovil.SessionToken.SessionId;
        var transaction = Object.create(Transaction.PagarCNTDebitoCuenta);
        transaction.Parameters.ContextoCliente = contextCliente;
        transaction.Parameters.nombreCompletoCliente = nombreCompletoCliente;
        transaction.Parameters.numeroDocumento = contextCliente.NumeroDocumento;
        transaction.Parameters.numeroCuenta = numeroCuenta;
        transaction.Parameters.numeroPapeleta = numeroPapeleta;
        transaction.Parameters.valor = valor;
        transaction.Parameters.criterioConsulta = criterioConsulta;
        transaction.Parameters.tipoServicio = tipoServicio;
        transaction.Parameters.telefonoContacto = telefonoContacto;
        transaction.Parameters.correoElectronicoTercero = correoElectronicoTercero;
        transaction.Parameters.identificacionRespuestaCNT = objRespuestaCNT.IdentificacionCliente;
        transaction.Parameters.comisionRespuestaCNT = objRespuestaCNT.Comision;
        transaction.Parameters.nombreClienteRespuestaCNT = objRespuestaCNT.NombreCliente;
        return SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    } catch (e) {
        throw e;
    }
}

function PagarCNTTarjetaCredito(contextCliente, cuentaTarjeta, cvv, anio, mes, criterioConsulta, tipoServicio, telefonoContacto, valor, correoElectronicoTercero, objRespuestaCNT, addFunction) {
    try {
        contextCliente.SessionId = SesionMovil.SessionToken.SessionId;
        var transaction = Object.create(Transaction.PagarCNTTarjetaCredito);
        transaction.Parameters.ContextoCliente = contextCliente;
        transaction.Parameters.numeroDocumento = contextCliente.NumeroDocumento;
        transaction.Parameters.cuentaTarjeta = cuentaTarjeta;
        transaction.Parameters.cvv = cvv;
        transaction.Parameters.anio = anio;
        transaction.Parameters.mes = mes;
        transaction.Parameters.criterioConsulta = criterioConsulta;
        transaction.Parameters.tipoServicio = tipoServicio;
        transaction.Parameters.telefonoContacto = telefonoContacto;
        transaction.Parameters.valor = valor;
        transaction.Parameters.correoElectronicoTercero = correoElectronicoTercero;
        transaction.Parameters.identificacionRespuestaCNT = objRespuestaCNT.IdentificacionCliente;
        transaction.Parameters.comisionRespuestaCNT = objRespuestaCNT.Comision;
        transaction.Parameters.nombreClienteRespuestaCNT = objRespuestaCNT.NombreCliente;
        return SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    } catch (e) {
        throw e;
    }
}

/*BIMO*/


function EnrolarBIMO(telefono, numeroCuenta, contextoCliente, addFunction) {
    try {
        var transaction = Object.create(Transaction.EnrolarBIMO);
        transaction.Parameters.telefono = telefono;
        transaction.Parameters.numeroCuenta = numeroCuenta;
        transaction.Parameters.contextoCliente = contextoCliente;
        SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    }
    catch (e) {
        showErrorMessage('', e.AditionalCoreMessage.length > 0 ? e.AditionalCoreMessage : CORE_MESSAGE(e.TransactionResponseCode));
    }
}

function AdministrarBIMO(telefono, accion, motivoDesenrolamiento, addFunction) {
    try {
        var transaction = Object.create(Transaction.AdministrarBIMO);
        transaction.Parameters.telefono = telefono;
        transaction.Parameters.accion = accion;
        transaction.Parameters.motivoDesenrolamiento = motivoDesenrolamiento;
        SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    }
    catch (e) {
        showErrorMessage('', e.AditionalCoreMessage.length > 0 ? e.AditionalCoreMessage : CORE_MESSAGE(e.TransactionResponseCode));
    }
}

function PagarBIMO(monto, celularAsociado, celularBeneficiario, concepto, mailTercero, pagoPendienteId, tipoTransaccion, moneda, contextoCliente, addFunction) {
    try {
        var transaction = Object.create(Transaction.PagarBIMO);
        transaction.Parameters.monto = monto;
        transaction.Parameters.celularAsociado = celularAsociado;
        transaction.Parameters.celularBeneficiario = celularBeneficiario;
        transaction.Parameters.concepto = concepto;
        transaction.Parameters.mailTercero = mailTercero;
        transaction.Parameters.pagoPendienteId = pagoPendienteId;
        transaction.Parameters.tipoTransaccion = tipoTransaccion;
        transaction.Parameters.moneda = moneda;
        transaction.Parameters.contextoCliente = contextoCliente;
        SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    }
    catch (e) {
        showErrorMessage('', e.AditionalCoreMessage.length > 0 ? e.AditionalCoreMessage : CORE_MESSAGE(e.TransactionResponseCode));
    }
}

function CrearNotificacionCobroBIMO(telefonoSolicitante, telefonoReceptorSolicitud, monto, referencia, moneda, addFunction) {
    try {
        var transaction = Object.create(Transaction.CrearNotificacionCobroBIMO);
        transaction.Parameters.telefonoSolicitante = telefonoSolicitante;
        transaction.Parameters.telefonoReceptorSolicitud = telefonoReceptorSolicitud;
        transaction.Parameters.monto = monto;
        transaction.Parameters.referencia = referencia;
        transaction.Parameters.moneda = moneda;
        SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    }
    catch (e) {
        showErrorMessage('', e.AditionalCoreMessage.length > 0 ? e.AditionalCoreMessage : CORE_MESSAGE(e.TransactionResponseCode));
    }
}

function ConsultarPagosPendientesBIMO(telefono, addFunction) {
    try {
        var transaction = Object.create(Transaction.ConsultarPagosPendientesBIMO);
        transaction.Parameters.telefono = telefono;
        SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    }
    catch (e) {
        showErrorMessage('', e.AditionalCoreMessage.length > 0 ? e.AditionalCoreMessage : CORE_MESSAGE(e.TransactionResponseCode));
    }
}

function RechazarPagoPendienteBIMO(telefono, pagoPendienteId, razon, addFunction) {
    try {
        var transaction = Object.create(Transaction.RechazarPagoPendienteBIMO);
        transaction.Parameters.telefono = telefono;
        transaction.Parameters.pagoPendienteId = pagoPendienteId;
        transaction.Parameters.razon = razon;
        SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    }
    catch (e) {
        showErrorMessage('', e.AditionalCoreMessage.length > 0 ? e.AditionalCoreMessage : CORE_MESSAGE(e.TransactionResponseCode));
    }
}

function ConsultarComisionBIMO(telefonoBeneficiario, addFunction) {
    try {
        var transaction = Object.create(Transaction.ConsultarComisionBIMO);
        transaction.Parameters.telefonoBeneficiario = telefonoBeneficiario;
        SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    }
    catch (e) {
        showErrorMessage('', e.AditionalCoreMessage.length > 0 ? e.AditionalCoreMessage : CORE_MESSAGE(e.TransactionResponseCode));
    }
}

function ObtenerCuentasCliente(contextCliente, addFunction) {
    try {
        var transaction = Object.create(Transaction.ObtenerCuentasCliente);
        transaction.Parameters.contextCliente = contextCliente;
        return SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    } catch (e) {
        throw e;
    }
}

/*PAGO SERVICIOS EASY CASH*/

function SincronizarOperaciones(operations, addFunction) {
    try {
        var transaction = Object.create(Transaction.SincronizarOperaciones);
        transaction.Parameters.operations = operations;
        transaction.Parameters.IdCliente = SesionMovil.ContextoCliente.CodigoCliente;
        return SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    } catch (e) {
        throw e;
    }
}

function ConsultarServicioEasyCash(dtoEnvioConsulta, addFunction) {
    try {
        var transaction = Object.create(Transaction.ConsultarServicioEasyCash);
        transaction.Parameters.DtoEnvioConsulta = dtoEnvioConsulta;
        return SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    } catch (e) {

    }
}

function PagarServicioEasyCashTarjetaCredito(contextCliente, dtoEasyCashConsulta, addFunction) {
    try {
        var transaction = Object.create(Transaction.PagarServicioEasyCashTarjetaCredito);
        transaction.Parameters.contextCliente = contextCliente;

        transaction.Parameters.numeroTarjeta = dtoEasyCashConsulta.InformacionPago.cuentaTarjetaDebitar;
        transaction.Parameters.cvv = dtoEasyCashConsulta.InformacionPago.cvvTrj;
        transaction.Parameters.anioVence = dtoEasyCashConsulta.InformacionPago.fchCaducidadTrj.anio;
        transaction.Parameters.mesVence = dtoEasyCashConsulta.InformacionPago.fchCaducidadTrj.mes;
        transaction.Parameters.totalAPagar = dtoEasyCashConsulta.InformacionPago.totalAPagar;
        transaction.Parameters.dtoEasyCashConsulta = dtoEasyCashConsulta.DtoEnvio;
        return SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    } catch (e) {

    }
}


function PagarServicioEasyCashDebitoCuenta(contextCliente, dtoEasyCashConsulta, addFunction) {
    try {
        var transaction = Object.create(Transaction.PagarServicioEasyCashDebitoCuenta);
        transaction.Parameters.contextCliente = contextCliente;

        transaction.Parameters.numeroCuenta = dtoEasyCashConsulta.InformacionPago.cuentaTarjetaDebitar;
        transaction.Parameters.totalAPagar = dtoEasyCashConsulta.InformacionPago.totalAPagar;
        transaction.Parameters.dtoEasyCashConsulta = dtoEasyCashConsulta.DtoEnvio;
        return SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    } catch (e) {

    }
}


function ConsultarServicioEasyCashFrecuent(Hash, addFunction) {
    try {
        var transaction = Object.create(Transaction.ConsultarServicioEasyCashFrecuent);
        transaction.Parameters.Hash = Hash;
        transaction.Parameters.IdCliente = SesionMovil.ContextoCliente.CodigoCliente;
        return SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    } catch (e) {
        throw e;
    }
}

/*BIOMETRICAL ACCESS*/
function ValidateBiometricAccess(addFunction) {
    try {
        var transaction = Object.create(Transaction.ValidateBiometricAccess);
        transaction.Parameters.esRegistro = true;
        transaction.Parameters.TokenAPNGCM = TokenAPN_GCM
        transaction.Parameters.LastTimeAccessedPosition = currentPosition.PosicionInsertar;
        transaction.Parameters.type = "BIO";
        SendPostRequestToService(transaction, addFunction, LoadScreen, 'Mobile');
    } catch (e) {
        throw e;
    }
}

/****************************************************************************************************************************************************************************************************************************************
********************************************************************************** DTOs Y ENTIDADES**************************************************************************************************************************************
****************************************************************************************************************************************************************************************************************************************/

var DtoAccesoPregunta =
{
    esPredefinida: false,
    idAccesoPregunta: 0,
    Pregunta: "",
    Respuesta: "",
}

var DemoCuposMaximos =
{
    diarioWeb: 0.00,
    semanalWeb: 0.00,
    mensualWeb: 0.00,
    diarioATM: 0.00,
    semanalATM: 0.00,
    mensualATM: 0.00,
    diarioDebito: 0.00,
    diarioTAR: 0.00,
    avanceDiarioTAR: 0.00,
    poseeTarjeta: false
}

var DtoCuentaPermitidaTransferencia = {
    Beneficiario: "",
    EmailBeneficiario: "",
    EsActivo: false,
    IdCliente: 0,
    IdClienteValido: 0,
    IdCuentaPermitidaTransferencia: 0,
    NumeroCuentaValido: "",
    Referencia: ""
}

var DtoGrabarControlAcceso = {
    CambiarNombreUsuario: false,
    Canal: "",
    CodigoNotificacion: { Ninguno: 0, Correo: 1, Celular: 2, Todos: 3 },
    ConsultaPorIdentificacion: false,
    CorreoElectronicoRegistrado: "",
    EsCreacion: false,
    IdOficina: 0,
    InfoNotificacionProvista: false,
    Ip: "",
    NombreEstacion: "",
    NombreUsuario: "",
    NumeroCelularRegistrado: "",
    NumeroIdentificacion: "",
    TipoIdentificacion: "",
}

var DtoCanalTransferencia =
{
    Comprobante: "",
    Monto: 0.00,
    Fecha: "",
    CuentaOrigen: "",
    TipoCuentaOrigen: "",
    TitularCuentaOrigen: "",
    CuentaDestino: "",
    TipoCuentaDestino: "",
    TitularCuentaDestino: "",
    Concepto: "",
    FlujoTransferencia: "",
    emailOrigen: "",
    emailDestino: "",
    Institucion: "",
    IdEntidadFinanciera: 0,
    BancoDestino: "",
    Estado: "",
}


var ContextoCliente =
{
    IdInstitucion: 0,
    NombreCompletoCliente: "",
    CodigoCliente: 0,
    NombreOficina: "",
    NombreCadena: "",
    TokenAutenticacion: "",
    SecuencialTransacciones: 0,
    BranchOperador: "",
    CodigoOperador: "",
    tipoDocumento: "",
    TipoDocumento: "",
    FechaTransaccional: "",
    ClaveFuerte: "",
    PasswordClaro: "",
    SessionId: "",
    PasswordEncriptado: "",
    NumeroIntentos: 0,
    NumeroDocumento: "",
    TipoClave: "",
    Rol: "",
    PasswordTransaccional: "",
    Respuesta: "",
    IpTerminal: "",
}


var DtoResultadoConsultaControlAcceso =
{
    IdControlAcceso: 0,
    NombreUsuario: "",
    TipoIdentificacion: "",
    NumeroIdentificacion: "",
    FechaHoraUltimoAcceso: "",
    CanalUltimoAcceso: "",
    CambiarNombreUsuario: false,
    NumeroCelularRegistrado: "",
    CorreoElectronicoRegistrado: "",
    EsActivo: true,
    FechaRegistro: "",
    CodigoNotificacion: 0,
    InfoNotificacionRequerida: false,
}

var DtoTransferenciaExterna =
{
    IdTransferenciaExterna: 0,
    IdCliente: 0,
    IdEntidadFinanciera: "",
    TipoCuenta: "",
    NumeroCuenta: "",
    Beneficiario: "",
    TipoIdentificacion: "",
    NumeroIdentificacion: "",
    Email: "",
    Celular: "",
    Cadena1: "",
}


var DtoCanalTransferenciaInterbancaria =
{
    dtoCanalOrdenante: { Nombres: "", Identificacion: "", Ciudad: "", Direccion: "", Telefono: "", Celular: "", FormaPago: "", NumeroCuenta: "", Correo: "", OrigenFondos: "" },
    dtoCanalBeneficiario: { CodigoInstitucionFinanciera: "", NombreInstitucionBeneficiaria: "", TipoCuenta: "", NumeroCuenta: "", Nombres: "", Direccion: "", TipoIdentificacion: "", Identificacion: "", Telefono: "", Correo: "", dtoCanalMotivo: { CodigoMotivo: "", DescripcionMotivo: "" } },
    FechaProceso: "",
    Agencia: "",
    TipoTransferencia: "",
    ExcentoISD: false,
    ValorComision: 0.00,
    Impuesto: 0.00,
    Tarifa: 0.00,
    ValorTransferir: 0.00,
    ValorTransferirTotal: 0.00,
    Moneda: "",
    ConceptoAdicional: "",
    RubroTransferenciaInterbancaria: {
        ValorComisiones: 0.00, ValorImpuestos: 0.00, ValorTotal: 0.00, Rubros: [{ CodigoRubro: "", DescripcionRubro: "", EsImpuesto: false, ValorRubroLocal: 0.00, IdFlujoRubro: 0, MotivoExcepcion: "", }]
    }
}

var DtoCanalOrdenante =
{
    Nombres: "",
    Identificacion: "",
    Ciudad: "",
    Direccion: "",
    Telefono: "",
    Celular: "",
    FormaPago: "",
    NumeroCuenta: "",
    Correo: "",
    OrigenFondos: "",
}

var DtoCanalBeneficiario =
{
    CodigoInstitucionFinanciera: "",
    NombreInstitucionBeneficiaria: "",
    TipoCuenta: "",
    NumeroCuenta: "",
    Nombres: "",
    Direccion: "",
    TipoIdentificacion: "",
    Identificacion: "",
    Telefono: "",
    Correo: "",
    dtoCanalMotivo: { CodigoMotivo: "", DescripcionMotivo: "" },
}
var DtoCanalBeneficiario =
{
    CodigoInstitucionFinanciera: "",
    NombreInstitucionBeneficiaria: "",
    TipoCuenta: "",
    NumeroCuenta: "",
    Nombres: "",
    Direccion: "",
    TipoIdentificacion: "",
    Identificacion: "",
    Telefono: "",
    Correo: "",
    dtoCanalMotivo: { CodigoMotivo: "", DescripcionMotivo: "" }

}
var DtoCanalMotivo =
{
    CodigoMotivo: "",
    DescripcionMotivo: "",
}

var DtoRubroTransferenciaInterbancaria =
{
    ValorComisiones: 0.00,
    ValorImpuestos: 0.00,
    ValorTotal: 0.00,
    Rubros: [{ CodigoRubro: "", DescripcionRubro: "", EsImpuesto: false, ValorRubroLocal: 0.00, IdFlujoRubro: 0, MotivoExcepcion: "", }]
}

var DtoCanalRubroTransferencia =
{
    CodigoRubro: "",
    DescripcionRubro: "",
    EsImpuesto: false,
    ValorRubroLocal: 0.00,
    IdFlujoRubro: 0,
    MotivoExcepcion: "",
}

var DtoFormaPagoTransInterbancaria =
{
    CodigoFormaPago: "",
    Cotizacion: 0.00,
    Moneda: "",
    Valor: 0.00,
    ValorConversion: 0.00
}

var PagoServicioBasico = {

    tipoPago: "",

    //Tarjeta
    idCuentaTarjeta: "",
    cvv: "",
    anioVence: "",
    mesVence: "",


    criterioConsulta: "",
    tipoServicio: "",
    numeroTelefonoContrato: "",
    totalAPagar: "",
    mailTerceros: "",


    //CTA
    nombreTitular: "",
    cuentaTarjetaDebitar: "",
    secuencial: "",

}