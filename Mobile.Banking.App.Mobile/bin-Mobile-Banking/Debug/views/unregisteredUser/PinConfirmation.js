MobileBanking_App.PinConfirmation = function (params) {
    "use strict";
    var pinTmp = "";
    var pinPrimeraVez = "";
    var primeraVezFlag = false;
    var pinConfirmacion = "";
    var numeroIntentos = 0;

    var viewModel = {
        viewShown: function () {
            if (params.id) {
                showNotificationWarning(params.id, 10000, 'top');
            }
            $('#header-fixed').hide();
            $('.header-clear').hide();
            resetearRegistroPIN();
            $('#txtNumberPINConfirmation').unbind('keyup');
            if (params.id && params.id != 'Login')
                $('#btnCancelar').show();
            else {
                params.id = 'Login';
                $('#btnCancelar').hide();
            }
            var txtPIN = document.getElementById('txtNumberPINConfirmation');
            var divContentPinConfirmation = document.getElementById('divContentPinConfirmation');
            var deviceVersion = parseInt(DeviceInfo.DeviceVersion.replace(".", "").substring(0, 2));
            if (deviceType == 'Android' && (deviceVersion >= 44 || deviceVersion == 9 || deviceVersion == 10)) {
                $('#txtNumberPINConfirmation').attr('type', 'number');
            }
            else {
                $('#txtNumberPINConfirmation').attr('type', 'text');
                $('#txtNumberPINConfirmation').attr('pattern', '[0-9]*');
            }
            var deviceVersion = parseInt(DeviceInfo.DeviceVersion.replace(".", "").substring(0, 2));
            if (deviceType === 'Android') {
                if (deviceVersion < 44 && deviceVersion != 9 && deviceVersion != 10 && deviceVersion != 11) {
                    $('#txtNumberPINConfirmation').bind('keyup', KeyPadEventHandlerForPin);
                }
                else {
                    $('#txtNumberPINConfirmation').bind('input', KeyPadEventHandlerForPin);
                }
            }
            else {
                $('#txtNumberPINConfirmation').bind('keyup', KeyPadEventHandlerForPin);
            }
            //txtPIN.onblur = function (e) { txtPIN.focus(); }
            divContentPinConfirmation.onclick = function (e) {
                txtPIN.focus();
            }
            txtPIN.focus();
        },
        valuePin: ko.observable(),
        valueConfirmacionPin: ko.observable(),
        clickLimpiar: function () { resetearRegistroPIN(); },
        clickBorrar: function () {
            borrarPIN();
        },
        clickCancelar: function () {
            MobileBanking_App.app.navigate("LandingPage", { root: true });
            //MobileBanking_App.app.navigate('RegisterUser', { root: true });
            //if (params.id == 'Login')
            //    MobileBanking_App.app.navigate('Home', { root: true });
            //else
            //    MobileBanking_App.app.navigate('PosicionConsolidada', { root: true });
        },
        visible: ko.observable(false),
        clickOlvidoPIN: function () {
            this.visible(!this.visible());
        },
        animationConfig: ko.observable({
            show: { type: "pop", from: { opacity: 1, scale: 0 }, to: { scale: 1 } },
            hide: { type: "pop", from: { scale: 1 }, to: { scale: 0 } }
        }),
        togglePopup: function () {
            this.visible(!this.visible());
            $('#txtNumberPINConfirmation').focus();
        },
        clickAceptarOlvidoPIN: function () {
            BorrarContenidoBaseLocalEntity();
            OlvideMiPin(function (data) {
                MobileBanking_App.app.navigate("RegisterSecurePIN");
                this.visible(!this.visible());
            })
        },
        viewShowing: function () {
            hideFloatButtons();
        },
    };

    var KeyPadEventHandlerForPin = function (e) {

        //e.stopPropagation();
        //window.scrollTo(0, 0);
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
                    Vibrate(200);
                    document.getElementById('txtNumberPINConfirmation').blur();
                    SaveUserInServerAppBancaMobile(false, SesionMovil.ControlAccesoGlobal.TipoIdentificacion, SesionMovil.ControlAccesoGlobal.NumeroIdentificacion, SesionMovil.ContextoCliente.NombreCompletoCliente,
                        SesionMovil.ControlAccesoGlobal.CorreoElectronicoRegistrado, SesionMovil.ControlAccesoGlobal.NumeroCelularRegistrado, "", SesionMovil.ControlAccesoGlobal.NombreUsuario, pinTmp,
                        RegisterUserEntityProcess.usersPassWord, function (response) {
                            if (response === true) {
                                Parameters.RegisteredDevice === true

                                upCredentialUsageEntity(1, 1, 1, function (resultUpdate) { console.log("passwordUpdated") });

                                SaveLocalEntity();
                                showNotificationError("Este equipo fué registrado con éxito");
                                buildMenuClient();
                                try {
                                    SesionMovil.FechaHoraUltimoAccesoMostrar = Date.parse(SesionMovil.ControlAccesoGlobal.FechaHoraUltimoAcceso.split('.')[0]);
                                } catch (e) {
                                    SesionMovil.FechaHoraUltimoAccesoMostrar = new Date(SesionMovil.ControlAccesoGlobal.FechaHoraUltimoAcceso);
                                }
                                showNotificationSuccess(CORE_MESSAGE_ADD('Welcome', SesionMovil.ContextoCliente.NombreCompletoCliente), undefined, 'bottom');
                                MobileBanking_App.app.navigate("PosicionConsolidada", { root: true });
                            } else {
                                showNotificationError("Error al registrar este equipo");
                            }
                        });

                    break;
            }
        } catch (e) {
            showException(e.message, e.stack);
            $('#txtNumberPINConfirmation').val('');
        }
    }

    function limpiarImagenes() {
        document.getElementById("charVacio1").setAttribute('class', 'img-char-pin-vacio');
        document.getElementById("charVacio2").setAttribute('class', 'img-char-pin-vacio');
        document.getElementById("charVacio3").setAttribute('class', 'img-char-pin-vacio');
        document.getElementById("charVacio4").setAttribute('class', 'img-char-pin-vacio');
    }

    function resetearRegistroPIN() {
        pinTmp = "";
        pinConfirmacion = "";
        pinPrimeraVez = "";
        primeraVezFlag = false;
        numeroIntentos = 0;
        limpiarImagenes();
        $('#txtNumberPINConfirmation').val('');
        $('#txtNumberPINConfirmation').focus();
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