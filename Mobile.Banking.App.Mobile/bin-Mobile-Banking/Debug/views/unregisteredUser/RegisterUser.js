MobileBanking_App.RegisterUser = function (params) {
    "use strict";
    var groupValidation = 'REGISTERUSER';

    var userModel = {
        Usuario: ko.observable(),
        Clave: ko.observable(),
    }

    var viewModel = {
        viewShown: function () {
            GetParameterValidation(function () {
                DevExpress.validationEngine.resetGroup(groupValidation);
                var txtUsuario = document.getElementById('txtUsuario');
                txtUsuario.onfocus = function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    window.scrollTo(0, 0);
                }

                var txtUsuario = document.getElementById('txtUsuario');
                txtUsuario.onfocus = function (e) {

                    e.preventDefault();
                    e.stopPropagation();
                    window.scrollTo(0, 0);

                }

                txtUsuario.focus();
            });
        },
        intentosLogin: 0,
        groupValidation: groupValidation,
        txtUsuario: setupTextBoxControl(userModel.Usuario, 32, 'Usuario', typeLetter.upper, undefined, false, typeCharAllowed.OnlyTextAndNumber, true),
        txtClave: setupTextPasswordControl(userModel.Clave, 16, undefined, typeLetter.upper),
        btnEnviar: setupButtonControl('Ingresar', registrarUsuario, groupValidation, undefined),
        btnOlvideUsuario: setupButtonControl('Olvidé mi Usuario ', forgottenUserName),
        btnOlvideClave: setupButtonControl('Olvidé mi Clave', forgottenPassword),
        backHome: function () {
            MobileBanking_App.app.navigate('Home', { root: true });
        }


    };






    function forgottenPassword() {
        MobileBanking_App.app.navigate('ForgottenPassword');
    }

    function forgottenUserName() {
        MobileBanking_App.app.navigate('ForgottenUserName');
    }

    function registrarUsuario(params) {
        var result = params.validationGroup.validate();
        if (result.isValid) {
            LogIn(userModel.Usuario().toUpperCase(), userModel.Clave().toUpperCase(), currentPosition.PosicionInsertar, true, function (data) {
                var ServerCallResult = data;
                if (ServerCallResult != null) {
                    initSession(ServerCallResult);
                    SesionMovil = getObjectSession();
                    controlAccesoGlobal = ServerCallResult.dtoResultadoConsultaControlAcceso;
                    contextoCliente = ServerCallResult.contextoCliente;
                    PosicionConsolidadaCliente = ServerCallResult.dtoCanalPosicionConsolidada;
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
                        lastNames: ServerCallResult.contextoCliente.NombreCompletoCliente
                    }
                    switch (ServerCallResult.accessState) {
                        case 0://ClientDoesExistInMobileBanking
                            var message = 'Tú ya eres un usuario de Banca Móvil unicamente debes confirmar tu PIN de seguridad y nosotros haremos el resto.';
                            MobileBanking_App.app.navigate('PinConfirmation/' + message, { root: true });
                            return;
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
                            var message = 'A continuación deberás registrar un PIN de Acceso';
                            MobileBanking_App.app.navigate("RegisterSecurePIN/" + message, { root: true });
                            return;
                            break;
                    }
                    if (!ServerCallResult.CambiarClave) {
                        viewModel.intentosLogin = 0;
                        MobileBanking_App.app.navigate('RegisterSecurePIN', { root: true });
                    }
                    else {
                        MobileBanking_App.app.navigate('CambiarClaveAcceso', { root: true });
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

    return viewModel;
};