MobileBanking_App.CambiarClaveAcceso = function (params) {
    "use strict";

    var contextoCliente = SesionMovil ? SesionMovil.ContextoCliente : params.id;
    
    var groupValidation = 'CAMBIOCLAVE';
    var cumpleLetras = false;
    var cumpleMin = false;
    var cumpleEspecial = false;
    var cumpleNumYLetras = false;

    var viewModel = {
        viewShowing: function () {
            hideFloatButtons();
        },
        viewHidden: function () {
            hideFloatButtons();
        },
        viewShown: function () {
            setupFloatButton(classButtons.Accept, cambiarClave, undefined, undefined, undefined, undefined, groupValidation);
            showNotificationInfo("Para continuar debes cambiar tu contraseña por motivos de seguridad.");
            if (SesionMovil)
                SesionMovil.FechaActividadApp = new Date();

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

            var deviceVersion = parseInt(DeviceInfo.DeviceVersion.replace(".", "").substring(0, 2));
            if (deviceType === 'Android') {
                if (deviceVersion < 44 && deviceVersion != 9 && deviceVersion != 10 && deviceVersion != 11) {
                    $("#txtClaveNueva").bind('keyup', valClaveNueva);
                }
                else {
                    $("#txtClaveNueva").bind('input', valClaveNueva);
                }
            }
            else {
                $("#txtClaveNueva").bind('keyup', valClaveNueva);
            };
        },
        comparisonTargetNueva: function () {
            let valComp = $('#txtClaveNueva').val();
            if (valComp) {
                return valComp;
            }
        },
        txtClaveAntigua: setupTextPasswordControl('', 64, 'Clave Antigua'),
        koClaveNueva: ko.observable(""),
        txtClaveNueva: setupTextPasswordControl('', 64, 'Clave Nueva'),
        txtConfirmaClaveNueva: setupTextPasswordControl('', 64, ''),
        groupValidation: groupValidation,
    };

    function valClaveNueva(e) {
        cumpleLetras = $("#txtClaveNueva").pwstrength("ruleIsMet", "wordTwoCharacterClasses");
        cumpleMin = $("#txtClaveNueva").pwstrength("ruleIsMet", "wordMinLength");
        cumpleEspecial = $("#txtClaveNueva").pwstrength("ruleIsMet", "wordOneSpecialChar");
        cumpleNumYLetras = $("#txtClaveNueva").pwstrength("ruleIsMet", "wordLetterNumberCombo");
        if (cumpleLetras && cumpleMin && cumpleEspecial && cumpleNumYLetras)
            $(".claveNuevaInvalid").hide();
        else
            $(".claveNuevaInvalid").show();
    };

    function cambiarClave(params) {
        try {
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
                    return showSimpleMessage(CORE_TAG('DefaultTitle'), "Tu contrase&ntilde;a necesita 1 caracter especial", undefined);
                }
                if (!cumpleNumYLetras) {
                    return showSimpleMessage(CORE_TAG('DefaultTitle'), 'Tu contrase&ntilde;a necesita Letras y N&#250;mero', undefined);
                }

                let claveAntigua = $("#txtClaveAntigua").dxTextBox('option', 'value').toUpperCase();
                let claveNuevaConf = $("#txtConfirmaClaveNueva").dxTextBox('option', 'value').toUpperCase();
                CambiarPassword(claveAntigua, claveNuevaConf, contextoCliente, function (data) {
                    var cambiarClaveResult = data;
                    if (cambiarClaveResult) {
                        upCredentialUsageEntity(1, 1, 1, function (res) {
                            showSimpleMessage('Cambio Clave', "Has cambiado tu contraseña con éxito", function () {
                                MobileBanking_App.app.navigate("LandingPage", { root: true });
                                showNotificationSuccess('Ahora accede con tu nueva contraseña.');
                            });
                        });
                    }
                });
            } else {
                showWarningMessage('Cambio Clave', CORE_MESSAGE('MissingData'));
            }
        } catch (e) {

            showException(e.message, e.stack);
        }
    };

    return viewModel;
};