MobileBanking_App.RegUsrPass = function (params) {
    "use strict";

    var groupValidation = "REGUSRPASS";
    var controlAcceso = params.id.controlAcceso;
    var contextoCliente = SesionMovil ? SesionMovil.ContextoCliente : params.id.contextoCliente;
    var regexNoCaracteresEspeciales = /^[A-Za-z0-9À-ÿ\u00f1\u00d1]*[A-Za-z0-9À-ÿ\u00f1\u00d1][A-Za-z0-9À-ÿ\u00f1\u00d1]*$/;
    var UserNameOK = false;
    var cumpleLetras = false;
    var cumpleMin = false;
    var cumpleEspecial = false;
    var cumpleNumYLetras = false;

    var viewModel = {
        koClaveNueva: ko.observable(""),
        viewShown: function () {
            setupFloatButton(classButtons.Accept, siguiente, undefined, undefined, undefined, undefined, groupValidation);
            var deviceVersion = parseInt(DeviceInfo.DeviceVersion.replace(".", "").substring(0, 2));

            var options = {};
            options.ui = {
                bootstrap3: true,
                showErrors: true,
                showProgressBar: true,
                showVerdictsInsideProgressBar: true,
            };
            options.rules = {
                activated: {
                    wordTwoCharacterClasses: true,
                    wordMinLength: true,
                    wordOneSpecialChar: true,
                    wordLetterNumberCombo: true
                }
            };
            $('#txtClaveNueva').pwstrength(options);

            if (deviceType === 'Android') {
                if (deviceVersion < 44 && deviceVersion != 9 && deviceVersion != 10 && deviceVersion != 11) {
                    $("#txtNombreUsuario").bind('keyup', HandleUsuario);
                    $("#txtClaveNueva").bind('keyup', valClaveNueva);
                }
                else {
                    $("#txtNombreUsuario").bind('input', HandleUsuario);
                    $("#txtClaveNueva").bind('input', valClaveNueva);
                }
            }
            else {
                $("#txtNombreUsuario").bind('keyup', HandleUsuario);
                $("#txtClaveNueva").bind('keyup', valClaveNueva);

            }
        },
        viewShowing: function () {
            hideFloatButtons();
        },
        txtNombreUsuario: setupTextBoxControl('', 16, undefined, typeLetter.upper, undefined, false, undefined),
        txtClaveAntigua: setupTextPasswordControl('', 64, 'Clave Antigua'),
        txtClaveNueva: setupTextPasswordControl('', 64, 'Clave Nueva'),
        comparisonTarget: function () {
            let valComp = $('#txtClaveNueva').val();
            if (valComp) {
                return valComp;
            }
        },
        txtConfirmaClaveNueva: setupTextPasswordControl('', 64, ''),
        ttUserTaken: {
            target: "#noValidIcon",
            showEvent: "click",
            hideEvent: "mouseleave",
            closeOnOutsideClick: true,
            position: "bottom",
            width: 200,
            contentTemplate: function (data, itm, el) {
                let content = '<div style=" text-align: justify; white-space: pre-wrap;background-color:white">' +
                    '<b style="color:#d52133;font-weight:900">¡Alerta!</b>' +
                    '<div style="color:#333; white-space: pre-wrap;">' +
                    'Este nombre de usuario no está disponible.</div>' +
                    '</div>'
                return content;
            }
        },
        groupValidation: groupValidation
    };

    viewModel.txtNombreUsuario.onFocusOut = function (params) {
        let value = $('#txtNombreUsuario').dxTextBox('option', 'value');
        if (value.length >= 6)
            ConsultarControlAcceso(value, function (data) {
                if (data) {
                    $('#validIcon').hide();
                    $('#noValidIcon').show();
                    //$('#ttUserTaken').dxTooltip('option', 'visible', true);
                    $('#alertUserName').show();
                    UserNameOK = false;
                }
                else {
                    $('#alertUserName').hide();
                    $('#validIcon').show();
                    $('#noValidIcon').hide();
                    $('#txtNombreUsuario').removeClass('userNameTaken');
                    UserNameOK = true;
                }
            });
        else {
            $('#validIcon').hide();
            $('#noValidIcon').show();
            //$('#ttUserTaken').dxTooltip('option', 'visible', true);
            UserNameOK = false;
        }
    }

    function HandleUsuario(e) {
        var value = e.target.value;
        var result = regexNoCaracteresEspeciales.test(value);
        if (!result || value.length > 16) {
            let newVal = value.substring(0, value.length - 1);
            e.target.value = newVal;
            $("#txtNombreUsuario").dxTextBox('option', 'value', newVal);
        }
    }

    function valClaveNueva(e) {
        cumpleLetras = $("#txtClaveNueva").pwstrength("ruleIsMet", "wordTwoCharacterClasses");
        cumpleMin = $("#txtClaveNueva").pwstrength("ruleIsMet", "wordMinLength");
        cumpleEspecial = $("#txtClaveNueva").pwstrength("ruleIsMet", "wordOneSpecialChar");
        cumpleNumYLetras = $("#txtClaveNueva").pwstrength("ruleIsMet", "wordLetterNumberCombo");
        if (cumpleLetras && cumpleMin && cumpleEspecial && cumpleNumYLetras)
            $(".claveNuevaInvalid").hide();
        else
            $(".claveNuevaInvalid").show();
    }

    function siguiente(params) {
        var result = params.validationGroup.validate();
        valClaveNueva(undefined);

        if (result.isValid) {
            if (!cumpleLetras) {
                return showSimpleMessage(CORE_TAG('DefaultTitle'), "Mezcla diferentes clases de caracteres", undefined);
            }
            if (!cumpleMin) {
                return showSimpleMessage(CORE_TAG('DefaultTitle'), 'Tu contrase&ntilde;a es muy corta (8)', undefined);
            }
            if (!cumpleEspecial) {
                return showSimpleMessage(CORE_TAG('DefaultTitle'), "Tu contrase&ntilde;a necesita 1 caracter especial (&#161;) (!) (#) ($) (%) (&) (/) (@) (*) (-) (+)", undefined);
            }
            if (!cumpleNumYLetras) {
                return showSimpleMessage(CORE_TAG('DefaultTitle'), 'Tu contrase&ntilde;a necesita Letras y N&#250;mero', undefined);
            }

            if (!UserNameOK) {
                return showSimpleMessage(CORE_TAG('DefaultTitle'), 'El Nombre de Usuario que seleccionaste no está disponible', undefined);
            }
            let grabarControlAcceso = {
                NombreUsuario: $("#txtNombreUsuario").dxTextBox('option', 'value'),
                TipoIdentificacion: contextoCliente.TipoDocumento,
                NumeroIdentificacion: contextoCliente.NumeroDocumento,
                CambiarNombreUsuario: true,
                CambiarNombreUsuario: false,
                Canal: "MOVIL",
                CanalUltimoAcceso: "MOVIL",
                NumeroCelularRegistrado: controlAcceso.NumeroCelularRegistrado,
                CorreoElectronicoRegistrado: controlAcceso.CorreoElectronicoRegistrado,
                CodigoNotificacion: 1,
                EsCreacion: false,
                ConsultaPorIdentificacion: true,
                InfoNotificacionProvista: controlAcceso.InfoNotificacionRequerida,
                EsActivo: controlAcceso.EsActivo,
                IdControlAcceso: controlAcceso.IdControlAcceso,
                InfoNotificacionRequerida: controlAcceso.InfoNotificacionRequerida,
            };
            let claveAntigua = $("#txtClaveAntigua").dxTextBox('option', 'value').toUpperCase();
            let claveNuevaConf = $("#txtConfirmaClaveNueva").dxTextBox('option', 'value').toUpperCase();
            RegistrarUsuarioCambioClave(grabarControlAcceso, contextoCliente, claveAntigua, claveNuevaConf, function (data) {
                if (data) {
                    showSimpleMessage(CORE_TAG('DefaultTitle'), 'Hemos registrado con éxito tu Nombre de Usuario y Contraseña, utilízalos en el próximo acceso a tu Banca en Línea', function () {
                        MobileBanking_App.app.navigate('LandingPage', { root: true });
                    })

                }
            });
        }
    }

    return viewModel;
};