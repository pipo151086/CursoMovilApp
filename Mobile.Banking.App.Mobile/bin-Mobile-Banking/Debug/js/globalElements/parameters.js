var Parameters = {
    TiempoVidaClaveOTP: 10,
    HoraAtencionTransferenciaDesde: undefined,
    HoraAtencionTransferenciaHasta: undefined,
    HoraInicioAchInmediato: undefined,
    HoraInicioFinInmediato: undefined,
    SessionTime: 10,
    //ServiceUri: 'http://10.100.150.33/apifrontier/api/Mobile',//QA
    //ServiceUri: 'http://10.10.0.50:81/apifrontier/api/Mobile',//QA
    ServiceUri: 'https://glimux.com:446/apifrontier/api/Mobile',
    //ServiceUri: 'https://app01.bantigua.com.gt/Apifrontier/api/Mobile',
    //ServiceUri: 'http://10.100.101.67/Apifrontier/api/Mobile',
    Api: 'Mobile.Banking.Api/api/',
    AppID: 1,
    AppVersion: 'Apiv3.6', //SOLO SIRVE EN SIMULADOR
    AppBuild: "",
    UseSSL_Pinning: false,
    AcceptAllCertificates: true,
    ValidateDomainName: false,
    UseBiometricalAuth: true,
    urlWebTransaccional: "https://enlinea.bantigua.com.gt/BankPlus/WebTransaccional",
    RegisteredDevice: "true",
    LnkProdBenePromo: '',
    LnkMedPagoDigital: 'https://bantigua.com.gt/pasos-pagos-de-creditos-y-tarjeta-de-credito/',
    LnkCreaUsuario: '',
    LnkPuntoPago: 'https://bantigua.com.gt/contenido-inicio/nuestra-red-de-agencias/',
    LnkSolTrjCred: '',
    LnkSolCredAntigua: '',
    LnkSolMicroAntigua: '',
    LnkSolCredUnifica: '',
    LnkSolCredRemesas: '',
    LnkSolPymeAntigua: '',
    LnkSolCredGanadero: '',
    JWT: "",
    AlertaClaveCaducaShown: false
}
var deviceType;

function GetAppVersion() {
    var version = AppVersion.version.split('.');
    Parameters.AppVersion = 'Apiv' + version[0] + '.' + version[1];
    Parameters.AppBuild = AppVersion.build;
}

function GetParameterValidation(successCall) {
    try {
        if (Parameters.HoraAtencionTransferenciaDesde === undefined) {
            GetAppParameters(function (data) {
                try {
                    for (var i = 0; i < data.length; i++) {
                        Parameters[data[i]["Key"]] = data[i]["Value"];
                    }
                    if (EntidadesFinancierasACH.length <= 0)
                        ConsultarEntidadFinancieraACH(function (consEntFin) {
                            EntidadesFinancierasACH = consEntFin;
                            if (successCall)
                                successCall();
                        });
                    else {
                        if (successCall)
                            successCall();
                    }
                } catch (e) {
                    showErrorMessage('Consulta de Parámetros', e.AditionalCoreMessage);
                }
            });
        } else {
            if (successCall)
                successCall();
        }

    } catch (e) {

    }
}

function getAniosForward(number) {

    let Anios = [];
    var anioActual = Date.today().getFullYear();
    for (var i = 0; i < number; i++) {
        var anios = {
            IdAnio: anioActual.toString().substring(2),
            Anio: anioActual
        }
        anioActual++;

        Anios.push(anios);
    }

    return Anios;
}

function getAniosBackward(number) {
    let Anios = [];
    var anioActual = Date.today().getFullYear();
    for (var i = 0; i < number; i++) {
        var anios = {
            IdAnio: anioActual.toString(),
            Anio: anioActual
        }
        anioActual--;
        Anios.push(anios);
    }
    return Anios;
}


function getAniosSince(number) {
    let Anios = [];
    var anioActual = Date.today().getFullYear();
    getAniosForward
    for (var i = number; i <= anioActual; i++) {
        var anio = {
            IdAnio: number.toString(),
            Anio: number
        }
        number++;
        Anios.push(anio);
    }
    return Anios;
}

function openInAppBrowser(url) {
    if (!DeviceInfo.DeviceManufacturer.includes("Simulador")) {
        if (!url || url === "" || url === undefined)
            url = Parameters.urlWebTransaccional;
        cordova.InAppBrowser.open(url, "_system")
    } else {
        var win = cordova.InAppBrowser.open(url, '_blank');
        if (win)
            win.focus();
    }
}

Object.defineProperty(Array.prototype, 'chunk_inefficient', {
    value: function (chunkSize) {
        var array = this;
        return [].concat.apply([],
            array.map(function (elem, i) {
                return i % chunkSize ? [] : [array.slice(i, i + chunkSize)];
            })
        );
    }
});

function routeOnSuccess(ServerCallResult) {
    if (!ServerCallResult.dtoResultadoConsultaControlAcceso.CorreoElectronicoRegistrado ||
        !ServerCallResult.dtoResultadoConsultaControlAcceso.NumeroCelularRegistrado ||
        ServerCallResult.dtoResultadoConsultaControlAcceso.InfoNotificacionRequerida === true) {
        var uri = MobileBanking_App.app.router.format({
            view: 'InfoContacto',
            id: JSON.stringify(ServerCallResult)
        });
        MobileBanking_App.app.navigate(uri, { root: true });
        return;
    } else if (ServerCallResult.solicitaPreguntas === true) {
        var uri = MobileBanking_App.app.router.format({
            view: 'RegPregSeg',
            id: JSON.stringify(ServerCallResult)
        });
        MobileBanking_App.app.navigate(uri, { root: true });
    } else if (ServerCallResult.needToRegDevide === true) {
        var message = 'Tú ya eres un usuario de Banca Móvil unicamente debes confirmar tu PIN de seguridad y nosotros haremos el resto.';
        MobileBanking_App.app.navigate('PinConfirmation/' + message, { root: true });
        return;
    }
    else {
        buildMenuClient();
        showNotificationSuccess(CORE_MESSAGE_ADD('Welcome', SesionMovil.ContextoCliente.NombreCompletoCliente), undefined, 'bottom');
        MobileBanking_App.app.navigate("PosicionConsolidada", { root: true });
    }

}
