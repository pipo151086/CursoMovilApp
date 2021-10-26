MobileBanking_App.InsertPin = function (params) {
    "use strict";

    var viewModel = {
        viewShown: function (e) {
            var txtPIN = document.getElementById('txtNumberPIN');
            $('#txtNumberPIN').unbind('keyup');
            resetearRegistroPIN();

            var deviceVersion = parseInt(DeviceInfo.DeviceVersion.replace(".", "").substring(0, 2));
            if (deviceType == 'Android' && (deviceVersion >= 44 || deviceVersion == 9 || deviceVersion == 10 || deviceVersion == 11)) {
                $('#txtNumberPIN').attr('type', 'number');
            }
            else {
                $('#txtNumberPIN').attr('type', 'text');
                $('#txtNumberPIN').attr('pattern', '[0-9]*');
            }
            if (deviceType === 'Android') {
                if (deviceVersion < 44 && deviceVersion != 9 && deviceVersion != 10 && deviceVersion != 11) {
                    $('#txtNumberPIN').bind('keyup', KeyPadEventHandlerForPin);
                }
                else {
                    $('#txtNumberPIN').bind('input', KeyPadEventHandlerForPin);
                }
            }
            else {
                $('#txtNumberPIN').bind('keyup', KeyPadEventHandlerForPin);
            }
            txtPIN.focus();
            $('#txtNumberPIN').focus();
        },
        clickCancelar: function () {
            MobileBanking_App.app.navigate('LandingPage', { root: true });
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
            $('#txtNumberPIN').click();
        },
        clickAceptarOlvidoPIN: function () {
            BorrarContenidoBaseLocalEntity();
            OlvideMiPin(function (data) {
                MobileBanking_App.app.navigate("RegisterUser", { root: true });
            })
            this.visible(!this.visible());
        },
        viewShowing: function () {
            hideFloatButtons();
        },
        clickView: function () {
            $('#txtNumberPIN').click();
            $('#txtNumberPIN').focus();
        },


    };


    var KeyPadEventHandlerForPin = function (e) {
        e.stopPropagation();
        var deviceVersion = parseInt(DeviceInfo.DeviceVersion.replace(".", "").substring(0, 2));
        var lastchar = e.target.value.slice(-1);
        switch (e.type) {
            case 'keyup':
                if (deviceType === 'Android' && deviceVersion < 44) // ANDROID VERSIONES JELLY BEAN
                {
                    if ((e.which && e.which === 8)) {
                        borrarPIN();
                    }
                    else {
                        if (
                            e.which === '48' || //0  
                            e.which === '49' || //1  
                            e.which === '50' || //2  
                            e.which === '51' || //3  
                            e.which === '52' || //4  
                            e.which === '53' || //5  
                            e.which === '54' || //6  
                            e.which === '55' || //7  
                            e.which === '56' || //8  
                            e.which === '57' //9  
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
                        if (lastchar === '0' || lastchar === '1' || lastchar === '2' || lastchar === '3' || lastchar === '4' || lastchar === '5' || lastchar === '6' || lastchar === '7' || lastchar === '8' || lastchar === '9') {
                            AddCharacterPin(lastchar);
                        }
                    }
                }
                break;
            case 'input'://ANDROID VERSIONES KITKAT Y SUPERIOR
                if ((deviceType == 'Android' && (e.target.value.length < pinValue.length))) {
                    borrarPIN();
                }
                else {
                    if (lastchar === '0' || lastchar === '1' || lastchar === '2' || lastchar === '3' || lastchar === '4' || lastchar === '5' || lastchar === '6' || lastchar === '7' || lastchar === '8' || lastchar === '9') {
                        if (e.target.value.length > pinValue.length)
                            AddCharacterPin(lastchar);
                    }
                    else {
                        e.target.value = e.target.value.substring(0, e.target.value.length - 1);
                    }
                }
                break;
        }
    }


    function resetearRegistroPIN() {
        pinValue = "";
        limpiarImagenes();
        $('#txtNumberPIN').val('');
        $('#txtNumberPIN').focus();
    }

    function AddCharacterPin(caracter) {
        try {
            pinValue = pinValue + caracter;
            var imagenesCharacter = document.getElementsByClassName("imagen");
            var imagenCambiar;
            switch (pinValue.length) {
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
                    document.getElementById('txtNumberPIN').blur();
                    ValidateUsersPINandLogin(pinValue,
                        function (resultLogin) {
                            if (resultLogin !== null) {
                                Parameters.JWT = resultLogin.JWT;
                                initSession(resultLogin);
                                userEntity.accessPIN = pinValue;
                                SesionMovil = getObjectSession();
                                SesionMovil.ContextoCliente.PasswordClaro = pinValue;
                                SesionMovil.ContextoCliente.NombreCadena = SesionMovil.ControlAccesoGlobal.NombreUsuario;
                                //buildMenuClient();
                                try {
                                    SesionMovil.FechaHoraUltimoAccesoMostrar = Date.parse(SesionMovil.ControlAccesoGlobal.FechaHoraUltimoAcceso.split('.')[0]);
                                } catch (e) {
                                    SesionMovil.FechaHoraUltimoAccesoMostrar = new Date(SesionMovil.ControlAccesoGlobal.FechaHoraUltimoAcceso);
                                }
                                //debugger;
                                //MobileBanking_App.app.navigate({ view: 'CambiarClaveAcceso', id: JSON.stringify(SesionMovil.ContextoCliente)});
                                routeOnSuccess(resultLogin);

                            } else {
                                resetearRegistroPIN();
                            }
                        });

                    break;
            }
        } catch (e) {
            showException(e.message, e.stack);
        }

    }

    function limpiarImagenes() {
        document.getElementById("charVacio1").setAttribute('class', 'img-char-pin-vacio');
        document.getElementById("charVacio2").setAttribute('class', 'img-char-pin-vacio');
        document.getElementById("charVacio3").setAttribute('class', 'img-char-pin-vacio');
        document.getElementById("charVacio4").setAttribute('class', 'img-char-pin-vacio');
    }


    function borrarPIN() {
        pinValue = pinValue.substring(0, pinValue.length - 1);
        switch (pinValue.length) {
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