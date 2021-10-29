MobileBanking_App.LandingPage = function (params) {
    "use strict";
    var groupValidation = 'REGISTERUSER';
    var userModel = {
        Usuario: ko.observable(),
        Clave: ko.observable(),
    }

    var viewModel = {
        viewShown: function () {
            initProcess("Cargando...");
            getCredentialUsageEntity(function (res) {
                GetParameterValidation(function () {
                    DevExpress.validationEngine.resetGroup(groupValidation);
                    var txtUsuario = document.getElementById('txtUsuario');
                    txtUsuario.onfocus = function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        window.scrollTo(0, 0);
                    };
                    var txtUsuario = document.getElementById('txtUsuario');
                    txtUsuario.onfocus = function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        window.scrollTo(0, 0);
                    };

                    var huellaVisible = false;
                    var pinVisible = false;
                    if (+res.bio != 1)
                        huellaVisible = true;

                    if (+res.pin != 1)
                        pinVisible = true;

                    $('#HuellaBtn').dxButton('option', 'disabled', huellaVisible);
                    $('#PinBtn').dxButton('option', 'disabled', pinVisible);
                    stopProcess();
                });
            });
        },
        viewShowing: function () {
            hideFloatButtons();
        },
        groupValidation: groupValidation,
        /*---------------------------------------------------------------------------------------------------------------*/
        /*--------------------------------------------------WEB CREDENTIALS-----------------------------------------------*/
        /*---------------------------------------------------------------------------------------------------------------*/
        txtUsuario: setupTextBoxControl(userModel.Usuario, 32, 'Usuario', typeLetter.upper, undefined, false, typeCharAllowed.OnlyTextAndNumber, true),
        txtClave: setupTextPasswordControl(userModel.Clave, 16, undefined, typeLetter.upper),
        btnEnviar: setupButtonControl('Ingresar', registrarUsuario, groupValidation, undefined),
        btnOlvideUsuario: setupButtonControl('Olvidé mi Usuario ', forgottenUserName),
        btnOlvideClave: setupButtonControl('Olvidé mi Clave', forgottenPassword),

        /*---------------------------------------------------------------------------------------------------------------*/
        /*--------------------------------------------------PIN / HUELLA-----------------------------------------------*/
        /*---------------------------------------------------------------------------------------------------------------*/
        koClickCodigo: IngresarPIN,
        koClickHuella: function () {
            if (Parameters.RegisteredDevice === "true" || Parameters.RegisteredDevice === true) {
                var platform = (deviceType === "Android") ? "Android" : device.platform;
                switch (platform) {
                    case 'Android':
                        Fingerprint.isAvailable(
                            function () {
                                Fingerprint.show({
                                    clientId: "ClientID",
                                    clientSecret: "password", //Only necessary for Android
                                    disableBackup: true,
                                },
                                    successCallbackID,
                                    errorCallbackID);
                            },
                            function () {
                                showSimpleMessage('Banca Móvil', 'No está disponible la autenticación con huella digital, deberás utilizar tu PIN de seguridad.', IngresarPIN, undefined);
                            });
                        break;
                    case 'iOS':
                        window.plugins.touchid.isAvailable(
                            window.plugins.touchid.
                                verifyFingerprintWithCustomPasswordFallbackAndEnterPasswordLabel(
                                    'Permítenos escanear tu huella digital', // this will be shown in the native scanner popup
                                    'Ingresar el PIN', // this will become the 'Enter password' button label 
                                    successCallbackID, // success handler: fingerprint accepted
                                    errorCallbackID), // error handler with errorcode and localised reason
                            function () {
                                showSimpleMessage('Banca Móvil', 'No está disponible la autenticación facial o huella digital, deberás utilizar tu PIN de seguridad.', IngresarPIN, undefined);
                            });
                        break;
                }
            }
            else {
                DispositivoNoRegistradoAction();
            }
        },
        puMenuNoCli: {
            fullScreen: false,
            showTitle: false,
            visible: false,
            //showTitle: true,
            //showCloseButton: true,
            fullScreen: true,
        },

        floaterLanding: noClientMenu,

        /*---------------------------------------------------------------------------------------------------------------*/
        /*--------------------------------------------------NO CLIENT MENU-----------------------------------------------*/
        /*---------------------------------------------------------------------------------------------------------------*/

        agenciaClick: function () {
            MobileBanking_App.app.navigate('RedAgencias', { root: true })
        },
        prodBeneClick: function () {

            openInAppBrowser(Parameters.LnkProdBenePromo)
        },
        medioPagoClick: function () { openInAppBrowser(Parameters.LnkMedPagoDigital) },
        creaUsuarioClick: function () { MobileBanking_App.app.navigate('_1_TermCond', { root: true }) },
        guiaUsuarioClick: function () { MobileBanking_App.app.navigate('GuiaUsr', { root: true }); },
        puntosPagoClick: function () { openInAppBrowser(Parameters.LnkPuntoPago) },
        solProdClick: function () { MobileBanking_App.app.navigate('SolProductos', { root: true }) },
        tipoCambioClick: function () { MobileBanking_App.app.navigate('TipoCambio', { root: true }) },
        canalAtencionClick: function () { MobileBanking_App.app.navigate('CanalesAtencion', { root: true }) },







        koClickCtaDig: function () {
            showQuestionMessage(CORE_TAG('DefaultTitle'), "Ya tienes Bantigua en Línea", function () {
                //Y
                MobileBanking_App.app.navigate('MsgRegUsr');
            }, function () {
                //N
                MobileBanking_App.app.navigate('MsgUnregUsr');
            }, undefined);
        }
    };
    /*---------------------------------------------------------------------------------------------------------------*/
    /*--------------------------------------------------NO CLIENT MENU-----------------------------------------------*/
    /*---------------------------------------------------------------------------------------------------------------*/
    function noClientMenu() {
        changePropertyControl('#puMenuNoCli', typeControl.Popup, 'visible', true);
    }

    function addClickToBackGroundMenu() {
        $('#fullContainer').addClass('blur');
        $('.dx-overlay-content.dx-popup-fullscreen.dx-resizable.dx-popup-fullscreen-width').click(function () {
            changePropertyControl('#puMenuNoCli', typeControl.Popup, 'visible', false);
        });

        $('#content > div.dx-viewport.dx-device-phone.dx-device-mobile.dx-device-generic.dx-simulator.dx-theme-ios7.dx-theme-ios7-typography.dx-color-scheme-default > div.dx-overlay-wrapper.dx-popup-wrapper.dx-overlay-modal.dx-overlay-shader > div').click(function () {
            changePropertyControl('#puMenuNoCli', typeControl.Popup, 'visible', false);
        });
    }
    viewModel.puMenuNoCli.onShown = addClickToBackGroundMenu;
    viewModel.puMenuNoCli.onShowing = addClickToBackGroundMenu;


    function removeClickToBackGroundMenu() {
        $('#fullContainer').removeClass('blur');
        $('.dx-overlay-content.dx-popup-fullscreen.dx-resizable.dx-popup-fullscreen-width').click(undefined);
        $('#content > div.dx-viewport.dx-device-phone.dx-device-mobile.dx-device-generic.dx-simulator.dx-theme-ios7.dx-theme-ios7-typography.dx-color-scheme-default > div.dx-overlay-wrapper.dx-popup-wrapper.dx-overlay-modal.dx-overlay-shader > div').click(undefined);
    }
    viewModel.puMenuNoCli.onHidden = removeClickToBackGroundMenu;
    viewModel.puMenuNoCli.onHidding = removeClickToBackGroundMenu;



















    /*---------------------------------------------------------------------------------------------------------------*/
    /*--------------------------------------------------WEB CREDENTIALS-----------------------------------------------*/
    /*---------------------------------------------------------------------------------------------------------------*/
    function forgottenPassword() {
        MobileBanking_App.app.navigate('ForgottenPassword');
    }
    function forgottenUserName() {
        MobileBanking_App.app.navigate('ForgottenUserName');
    }
    function registrarUsuario(params) {
        var result = params.validationGroup.validate();
        if (result.isValid) {
            LogInLandingPage(userModel.Usuario().toUpperCase(), userModel.Clave().toUpperCase(), currentPosition.PosicionInsertar, true, function (data) {
                var ServerCallResult = data;
                if (ServerCallResult != null && ServerCallResult.contextoCliente) {
                    Parameters.JWT = data.JWT;
                    debugger;
                    initSession(ServerCallResult);
                    SesionMovil = getObjectSession();
                    controlAccesoGlobal = ServerCallResult.dtoResultadoConsultaControlAcceso;
                    contextoCliente = ServerCallResult.contextoCliente;

                    if (ServerCallResult.updatePasswordAccessResult === true) {
                        upCredentialUsageEntity(1, 1, 1, function (resultUpdate) { console.log("passwordUpdated") });
                    }

                    PosicionConsolidadaCliente = ServerCallResult.dtoCanalPosicionConsolidada;
                    try {
                        SesionMovil.FechaHoraUltimoAccesoMostrar = Date.parse(SesionMovil.ControlAccesoGlobal.FechaHoraUltimoAcceso.split('.')[0]);
                    } catch (e) {

                        SesionMovil.FechaHoraUltimoAccesoMostrar = new Date(SesionMovil.ControlAccesoGlobal.FechaHoraUltimoAcceso);
                    }
                    RegisterUserEntityProcess = {
                        documentType: ServerCallResult.contextoCliente.TipoDocumento,
                        documentNumber: ServerCallResult.contextoCliente.NumeroDocumento,
                        userMail: ServerCallResult.dtoResultadoConsultaControlAcceso.CorreoElectronicoRegistrado,
                        userPhoneNumber: ServerCallResult.dtoResultadoConsultaControlAcceso.NumeroCelularRegistrado,
                        clientId: ServerCallResult.contextoCliente.CodigoCliente,
                        username: userModel.Usuario().toUpperCase(),
                        accessPIN: "",
                        usersPassWord: userModel.Clave().toUpperCase(),
                        names: ServerCallResult.contextoCliente.NombreCompletoCliente,
                        lastNames: ServerCallResult.contextoCliente.NombreCompletoCliente,
                    }
                    switch (ServerCallResult.accessState) {
                        case 0://ClientDoesExistInMobileBanking
                            if (!ServerCallResult.CambiarClave) {
                                routeOnSuccess(ServerCallResult);
                            }
                            break;
                        case 1://ClientsAccessForgotten
                            var message = 'Tú ya eres un usuario de Banca Móvil y has reportado un OLVIDO DE PIN, debes ingresar un nuevo PIN de Acceso';
                            MobileBanking_App.app.navigate("RegisterSecurePIN/" + message, { root: true });
                            PinStatusOk = false;
                            return;
                            break;
                        case 2://ClientAccessBlocked
                            var message = 'Tú ya eres un usuario de Banca Móvil y tu PIN de acceso está bloqueado, deberás ingresar un nuevo PIN de Acceso'
                            MobileBanking_App.app.navigate("RegisterSecurePIN/" + message, { root: true });
                            PinStatusOk = false;
                            return;
                            break;
                        case 3://ClientDoesntExist
                            if ((!ServerCallResult.dtoResultadoConsultaControlAcceso.CorreoElectronicoRegistrado ||
                                !ServerCallResult.dtoResultadoConsultaControlAcceso.NumeroCelularRegistrado ||
                                ServerCallResult.dtoResultadoConsultaControlAcceso.InfoNotificacionRequerida === false) &&
                                ServerCallResult.solicitaPreguntas === false &&
                                ServerCallResult.needToRegDevide === false) {
                                var message = 'A continuación deberás registrar un PIN de Acceso';
                                MobileBanking_App.app.navigate("RegisterSecurePIN/" + message, { root: true });
                                return;
                            }
                            else
                                routeOnSuccess(ServerCallResult);
                            break;
                    }

                    if (ServerCallResult.CambiarClave) {
                        MobileBanking_App.app.navigate('CambiarClaveAcceso', { root: true });
                        return;
                    }

                } else {
                    showNotificationWarning(CORE_MESSAGE('InvalidCredentialsUser'));
                    params.validationGroup.reset();
                    $('#txtUsuario').dxTextBox('instance').focus();
                    return;
                }

            });
        } else {
            showNotificationWarning(CORE_MESSAGE('MissingData'));
        }
    }



    /*---------------------------------------------------------------------------------------------------------------*/
    /*--------------------------------------------------PIN / HUELLA-----------------------------------------------*/
    /*---------------------------------------------------------------------------------------------------------------*/

    function successCallbackID(result) {
        ValidateBiometricAccess(function (resultLogin) {
            if (resultLogin !== null && resultLogin.dtoResultadoConsultaControlAcceso != null) {
                Parameters.JWT = resultLogin.JWT;
                initSession(resultLogin);
                userEntity.accessPIN = pinValue;
                SesionMovil = getObjectSession();
                buildMenuClient();
                try {
                    SesionMovil.FechaHoraUltimoAccesoMostrar = Date.parse(SesionMovil.ControlAccesoGlobal.FechaHoraUltimoAcceso.split('.')[0]);
                } catch (e) {
                    SesionMovil.FechaHoraUltimoAccesoMostrar = new Date(SesionMovil.ControlAccesoGlobal.FechaHoraUltimoAcceso);
                }

                showNotificationSuccess(CORE_MESSAGE_ADD('Welcome', SesionMovil.ContextoCliente.NombreCompletoCliente), undefined, 'bottom');
                MobileBanking_App.app.navigate("PosicionConsolidada", { root: true });
            } else {
                resetearRegistroPIN();
            }
        });
    }

    function errorCallbackID(err) {
        var platform = (deviceType === "Android") ? "Android" : device.platform;
        switch (platform) {
            case 'Android':
                IngresarPIN();
                //alert("Authentication invalid " + err);
                break;
            case 'iOS':
                switch (err.code) {
                    case -3://USA PIN
                        break;
                    case -8://Excede limite intentos
                    case -2://Presiono Cancelar
                        break
                }
                IngresarPIN();
                break;
        }
    }
    function IngresarPIN() {
        if (Parameters.RegisteredDevice === "true" || Parameters.RegisteredDevice === true)
            MobileBanking_App.app.navigate("InsertPin", { root: true });
        else
            DispositivoNoRegistradoAction();
    }

    function DispositivoNoRegistradoAction() {
        showSimpleMessage('Banca Móvil', 'Dispositivo NO registrado, debes ingresar por medio de Nombre de usuario Web y clave',
            function () {
                $('#txtUsuario').focus();
            }, undefined);
    }



















    return viewModel;
};