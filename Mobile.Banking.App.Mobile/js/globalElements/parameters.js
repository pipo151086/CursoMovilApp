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
    AppVersion: 'Apiv3.7', //SOLO SIRVE EN SIMULADOR
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
    AlertaClaveCaducaShown: false,
    MobbScanURL: "https://bantigua-stage.mobbscan.mobbeel.com/mobbscan",
    IntentosScanDocument: 3,
    IntentosLiveness: 3,
    IntentosAperturaCtaDigital: 3,
}

var MobbScanDocumentSide = JSON.parse('{"FRONT":{"value":"FRONT"},"BACK":{"value":"BACK"}}')

var MobbScanValidationState = JSON.parse('{"NOT_CHECKED":{"value":"NOT_CHECKED"},"NOT_VALID":{"value":"NOT_VALID"},"VALID":{"value":"VALID"}}')

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


/**
 * Convert a base64 string in a Blob according to the data and contentType.
 * 
 * @param b64Data {String} Pure base64 string without contentType
 * @param contentType {String} the content type of the file i.e (image/jpeg - image/png - text/plain)
 * @param sliceSize {Int} SliceSize to process the byteCharacters
 * @see http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
 * @return Blob
 */
function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
}

/**
 * Create a Image file according to its database64 content only.
 * 
 * @param folderpath {String} The folder where the file will be created
 * @param filename {String} The name of the file that will be created
 * @param content {Base64 String} Important : The content can't contain the following string (data:image/png[or any other format];base64,). Only the base64 string is expected.
 */
function savebase64AsImageFile(folderpath, filename, content, contentType) {
    // Convert the base64 string in a Blob
    var DataBlob = b64toBlob(content, contentType);

    console.log("Starting to write the file :3");

    window.resolveLocalFileSystemURL(folderpath, function (dir) {
        console.log("Access to the directory granted succesfully");
        dir.getFile(filename, { create: true }, function (file) {
            console.log("File created succesfully.");
            file.createWriter(function (fileWriter) {
                console.log("Writing content to file");
                fileWriter.write(DataBlob);
            }, function () {
                alert('Unable to save file in path ' + folderpath);
            });
        });
    });
}