MobileBanking_App.RegisterSecurePIN = function (params) {
    "use strict";
    var pinTmp = "";
    var pinPrimeraVez = "";
    var primeraVezFlag = false;
    var pinConfirmacion = "";

    var viewModel = {
        viewShown: function () {
            if (params.id) {
                showNotificationWarning(CORE_MESSAGE(params.id), undefined, 'top');
            }
            $('#header-fixed').hide();
            $('.header-clear').hide();
            resetearRegistroPIN();
            $('#txtNumberRegisterPIN').val('');
            var txtPIN = document.getElementById('txtNumberRegisterPIN');
            var divContentRegisterSecurePin = document.getElementById('divContentRegisterSecurePin');
            var deviceVersion = parseInt(DeviceInfo.DeviceVersion.replace(".", "").substring(0, 2));
            if (deviceType == 'Android' && (deviceVersion >= 44 || deviceVersion == 9 || deviceVersion == 10 || deviceVersion == 11)) {
                $('#txtNumberRegisterPIN').attr('type', 'number');
            }
            else {
                $('#txtNumberRegisterPIN').attr('type', 'text');
                $('#txtNumberRegisterPIN').attr('pattern', '[0-9]*');
            }
            var deviceVersion = parseInt(DeviceInfo.DeviceVersion.replace(".", "").substring(0, 2));
            if (deviceType === 'Android') {
                if (deviceVersion < 44 && deviceVersion != 9 && deviceVersion != 10 && deviceVersion != 11) {
                    $('#txtNumberRegisterPIN').bind('keyup', KeyPadEventHandlerForPin);
                }
                else {
                    $('#txtNumberRegisterPIN').bind('input', KeyPadEventHandlerForPin);
                }
            }
            else {
                $('#txtNumberRegisterPIN').bind('keyup', KeyPadEventHandlerForPin);
            }
            //txtPIN.onblur = function (e) { txtPIN.focus(); }
            divContentRegisterSecurePin.onclick = function (e) {
                txtPIN.focus();
            }
            txtPIN.focus();
        },
        valuePin: ko.observable(),
        valueConfirmacionPin: ko.observable(),
        disabledValue: ko.observable(false),
        clickLimpiar: function () { resetearRegistroPIN(); },
        clickBorrar: function () {
            borrarPIN();
        },
        clickCancelar: function () {
            if (params.id == "CambiarPIN")
                MobileBanking_App.app.navigate('PosicionConsolidada', { root: true });
            else {
                //MobileBanking_App.app.navigate('RegisterUser', { root: true });
                MobileBanking_App.app.navigate("LandingPage", { root: true });
            }
        },
        viewHidden: function () {
            //hideNavBarButtons();
        },
        viewShowing: function () {
            hideFloatButtons();
        },
        changePIN: function (e) {
            //AddCharacterPin('a');
        }
    };


    var KeyPadEventHandlerForPin = function (e) {
        //e.preventDefault();
        //  e.stopPropagation();
        //   window.scrollTo(0, 0);
        var deviceVersion = parseInt(DeviceInfo.DeviceVersion.replace(".", "").substring(0, 2));
        var lastchar = e.target.value.slice(-1);
        switch (e.type) {
            case 'keyup':
                if (deviceType == 'Android' && deviceVersion < 44) // ANDROID VERSIONES JELLY BEAN
                {
                    if ((e.which && e.which === 8)) {
                        borrarPIN();
                    }
                    else {
                        if (
                            e.which == '48' || //0  
                            e.which == '49' || //1  
                            e.which == '50' || //2  
                            e.which == '51' || //3  
                            e.which == '52' || //4  
                            e.which == '53' || //5  
                            e.which == '54' || //6  
                            e.which == '55' || //7  
                            e.which == '56' || //8  
                            e.which == '57' //9  
                        ) {
                            switch (e.which) {
                                case '48': lastchar = '0'; break;
                                case '49': lastchar = '1'; break;
                                case '50': lastchar = '2'; break;
                                case '51': lastchar = '3'; break;
                                case '52': lastchar = '4'; break;
                                case '53': lastchar = '5'; break;
                                case '54': lastchar = '6'; break;
                                case '55': lastchar = '7'; break;
                                case '56': lastchar = '8'; break;
                                case '57': lastchar = '9'; break;
                            }
                            AddCharacterPin(lastchar);
                        }
                    }
                }
                else {//iOS
                    if ((e.keyCode && e.keyCode === 8)) {
                        borrarPIN();
                    }
                    else {
                        if (lastchar == '0' || lastchar == '1' || lastchar == '2' || lastchar == '3' || lastchar == '4' || lastchar == '5' || lastchar == '6' || lastchar == '7' || lastchar == '8' || lastchar == '9') {
                            AddCharacterPin(lastchar);
                        }
                    }
                }
                break;
            case 'input'://ANDROID VERSIONES KITKAT Y SUPERIOR
                if ((deviceType == 'Android' && (e.target.value.length < pinTmp.length))) {
                    borrarPIN();
                }
                else {
                    if (lastchar == '0' || lastchar == '1' || lastchar == '2' || lastchar == '3' || lastchar == '4' || lastchar == '5' || lastchar == '6' || lastchar == '7' || lastchar == '8' || lastchar == '9') {
                        if (e.target.value.length > pinTmp.length)
                            AddCharacterPin(lastchar);
                    }
                    else {
                        e.target.value = e.target.value.substring(0, e.target.value.length - 1);
                    }
                }
                break;
        }
    }


    function AddCharacterPin(caracter) {
        try {
            pinTmp = pinTmp + caracter;
            var imagenesCharacter = document.getElementsByClassName("imagen");
            var imagenCambiar;

            switch (pinTmp.length) {
                case 1:
                    imagenCambiar = document.getElementById("charVacio1");
                    imagenCambiar.className = 'img-char-pin-lleno';
                    Vibrate(100);
                    break;
                case 2:
                    imagenCambiar = document.getElementById("charVacio2");
                    imagenCambiar.className = 'img-char-pin-lleno';
                    Vibrate(100);
                    break;
                case 3:
                    imagenCambiar = document.getElementById("charVacio3");
                    imagenCambiar.className = 'img-char-pin-lleno';
                    Vibrate(100);
                    break;
                case 4:
                    imagenCambiar = document.getElementById("charVacio4");
                    imagenCambiar.className = 'img-char-pin-lleno';
                    if (validatePatterPIN(pinTmp) == true) {
                        Vibrate(2000);
                        resetearRegistroPIN();
                        showWarningMessage(CORE_TAG('DefaultTitle'), "El PIN ingresado no cumple las normas de seguridad adecuadas. Por favor inténtalo nuevamente.", function () {
                        });
                        return;
                    }
                    Vibrate(2000);
                    limpiarImagenes();
                    if (pinPrimeraVez.length === 0 && !primeraVezFlag) {
                        primeraVezFlag = true;
                        pinPrimeraVez = pinTmp;
                        pinTmp = "";
                        $('#txtNumberRegisterPIN').val('');
                        $('#txtNumberRegisterPIN').focus();
                        $('#spnHelpPIN').text(CORE_MESSAGE('ConfirmPIN'))
                    } else if (pinPrimeraVez.length === 4 && primeraVezFlag) {
                        pinConfirmacion = pinTmp;
                        //showNotificationWarning(CORE_MESSAGE('ValidatePIN'));
                        if (pinConfirmacion === pinPrimeraVez) {
                            var respuesta = 'OK';
                            if (respuesta) {
                                SaveLocalEntity();
                                if (params.id == "CambiarPIN") {
                                    document.getElementById('txtNumberRegisterPIN').blur();
                                    CambioPinSeguridad(userEntity.accessPIN, pinTmp, function (data) {
                                        try {
                                            showSimpleMessage(CORE_TAG('DefaultTitle'), 'Su PIN de seguridad ha sido cambiado correctamente', function () {
                                                MobileBanking_App.app.navigate("PosicionConsolidada", { root: true });
                                            });
                                        } catch (e) {
                                            showErrorMessage('Registro de Dispositivo', e.AditionalCoreMessage);
                                        }
                                    })
                                } else {
                                    document.getElementById('txtNumberRegisterPIN').blur();
                                    //RegisterUserEntityProcess
                                    SaveUserInServerAppBancaMobile(PinStatusOk, SesionMovil.ControlAccesoGlobal.TipoIdentificacion, SesionMovil.ControlAccesoGlobal.NumeroIdentificacion,
                                        SesionMovil.ContextoCliente.NombreCompletoCliente, SesionMovil.ControlAccesoGlobal.CorreoElectronicoRegistrado,
                                        SesionMovil.ControlAccesoGlobal.NumeroCelularRegistrado, "", SesionMovil.ControlAccesoGlobal.NombreUsuario, pinConfirmacion,
                                        RegisterUserEntityProcess.usersPassWord, function (data) {
                                            try {
                                                var deviceRegistryResult = data;
                                                if (deviceRegistryResult) {
                                                    upCredentialUsageEntity(1, 1, 1, function (resultUpdate) { console.log("passwordUpdated") });
                                                    buildMenuClient();
                                                    try {
                                                        SesionMovil.FechaHoraUltimoAccesoMostrar = Date.parse(SesionMovil.ControlAccesoGlobal.FechaHoraUltimoAcceso.split('.')[0]);
                                                    } catch (e) {
                                                        SesionMovil.FechaHoraUltimoAccesoMostrar = new Date(SesionMovil.ControlAccesoGlobal.FechaHoraUltimoAcceso);
                                                    }
                                                    showNotificationSuccess(CORE_MESSAGE_ADD('Welcome', SesionMovil.ContextoCliente.NombreCompletoCliente), undefined, 'bottom');
                                                    MobileBanking_App.app.navigate("PosicionConsolidada", { root: true });
                                                } else {
                                                    showNotificationError(CORE_MESSAGE('ServerError'));
                                                    MobileBanking_App.app.navigate("LandingPage", { root: true });
                                                }
                                            } catch (e) {
                                                showErrorMessage('Registro de Dispositivo', e.AditionalCoreMessage);
                                            }
                                        });
                                }
                            } else {
                                showNotificationError(CORE_MESSAGE('NetworkError'));
                            }
                            resetearRegistroPIN();
                        } else {
                            resetearRegistroPIN();
                            showNotificationError(CORE_MESSAGE('NotMatchPIN'));
                        }
                        pinTmp = "";
                    }
                    break;
            }
        } catch (e) {

            DevExpress.ui.notify({ message: e }, "error", 2000);
            $('#txtNumberRegisterPIN').val('');
        }

    }

    function limpiarImagenes() {
        document.getElementById("charVacio1").setAttribute('class', 'img-char-pin-vacio');
        document.getElementById("charVacio2").setAttribute('class', 'img-char-pin-vacio');
        document.getElementById("charVacio3").setAttribute('class', 'img-char-pin-vacio');
        document.getElementById("charVacio4").setAttribute('class', 'img-char-pin-vacio');
    }

    function resetearRegistroPIN() {
        $('#spnHelpPIN').text('Ingrese su nuevo PIN de Seguridad');
        pinTmp = "";
        pinConfirmacion = "";
        pinPrimeraVez = "";
        primeraVezFlag = false;
        limpiarImagenes();
        $('#txtNumberRegisterPIN').val('');
        $('#txtNumberRegisterPIN').focus();
    }

    function borrarPIN() {
        pinTmp = pinTmp.substring(0, pinTmp.length - 1);
        switch (pinTmp.length) {
            case 0:
                document.getElementById("charVacio1").setAttribute('class', 'img-char-pin-vacio');
                break;
            case 1:
                document.getElementById("charVacio2").setAttribute('class', 'img-char-pin-vacio');
                break;
            case 2:
                document.getElementById("charVacio3").setAttribute('class', 'img-char-pin-vacio');
                break;
            case 3:
                document.getElementById("charVacio4").setAttribute('class', 'img-char-pin-vacio');
                break;
            default:
                break;
        }
    }

    return viewModel;
};
