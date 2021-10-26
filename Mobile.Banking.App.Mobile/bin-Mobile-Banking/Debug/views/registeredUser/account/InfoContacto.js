MobileBanking_App.InfoContacto = function (params) {
    "use strict";

    var ServerCallResult = {};
    if (params.id)
        ServerCallResult = JSON.parse(params.id);

    var groupValidation = "CONTACT_INFO";

    var viewModel = {
        viewShown: function () {
            setupFloatButton(classButtons.Accept, siguiente, undefined, undefined, undefined, undefined, groupValidation);
            var deviceVersion = parseInt(DeviceInfo.DeviceVersion.replace(".", "").substring(0, 2));
            if (deviceType === 'Android') {
                if (deviceVersion < 44 && deviceVersion != 9 && deviceVersion != 10 && deviceVersion != 11) {
                    $('#txtTelef').bind('keyup', HandleCharacteresTelefono);
                    $('#txtTelefConfirm').bind('keyup', HandleCharacteresTelefono);
                }
                else {
                    $('#txtTelef').bind('input', HandleCharacteresTelefono);
                    $('#txtTelefConfirm').bind('input', HandleCharacteresTelefono);
                }
            }
            else {
                $('#txtTelef').bind('keyup', HandleCharacteresTelefono);
                $('#txtTelefConfirm').bind('keyup', HandleCharacteresTelefono);
            }
        },
        viewShowing: function () {
            hideFloatButtons();
        },
        clickBack: function () { MobileBanking_App.app.navigate('_2_CreaUsr', { root: true }); },
        groupValidation: groupValidation,
        txtMail: setupEmailControl("", 128),
        txtMailConfirm: setupEmailControl("", 128),

        txtTelef: setupTextPhoneControl("", typePhones.Mobile, undefined, "Celular"),
        txtTelefConfirm: setupTextPhoneControl("", typePhones.Mobile, undefined, "Celular"),
    };

    function HandleCharacteresTelefono(e) {
        var value = e.target.value;
        var targetId = '#' + e.currentTarget.id;
        if (value.length > ConstantsBehaivor.LENGTH_PHONE) {
            let newVal = value.substring(0, value.length - 1);
            $(targetId).dxTextBox('option', 'value', newVal);
            $(targetId).dxTextBox('option', 'text', newVal);
        }
        else {
            $(targetId).dxTextBox('option', 'value', value);
            $(targetId).dxTextBox('option', 'text', value);
        }
    }


    function siguiente(params) {
        var result = params.validationGroup.validate();
        if (result.isValid) {
            let grabarControlAcceso = {
                CambiarNombreUsuario: false,
                CanalUltimoAcceso: "MOVIL",
                CodigoNotificacion: 1,
                CorreoElectronicoRegistrado: $('#txtMailConfirm').dxTextBox('option', 'value'),
                EsActivo: SesionMovil.ControlAccesoGlobal.EsActivo,
                IdControlAcceso: SesionMovil.ControlAccesoGlobal.IdControlAcceso,
                InfoNotificacionRequerida: SesionMovil.ControlAccesoGlobal.InfoNotificacionRequerida,
                NombreUsuario: SesionMovil.ControlAccesoGlobal.NombreUsuario,
                NumeroCelularRegistrado: $('#txtTelefConfirm').dxTextBox('option', 'value'),
                NumeroIdentificacion: SesionMovil.ControlAccesoGlobal.NumeroIdentificacion,
                TipoIdentificacion: SesionMovil.ControlAccesoGlobal.TipoIdentificacion,
                Canal: "MOVIL",
                EsCreacion: false,
                ConsultaPorIdentificacion: true,
                InfoNotificacionProvista: true
            };

            GrabarControlAcceso(grabarControlAcceso, function (data) {
                var view = 'RegPregSeg';
                if (ServerCallResult.solicitaPreguntas === false && ServerCallResult.needToRegDevide === true) {
                    var message = 'A continuación deberás registrar un PIN de Acceso';
                    return MobileBanking_App.app.navigate("RegisterSecurePIN/" + message, { root: true });
                } else if (ServerCallResult.solicitaPreguntas === false) {
                    buildMenuClient();
                    view = "PosicionConsolidada";
                }
                var uri = MobileBanking_App.app.router.format({
                    view: view,
                    id: JSON.stringify(ServerCallResult)
                });
                MobileBanking_App.app.navigate(uri, { root: true });
            });

        }
        else {
            showWarningMessage(CORE_TAG('DefaultTitle'), CORE_MESSAGE('MissingData'));
        }
    }

    return viewModel;
};