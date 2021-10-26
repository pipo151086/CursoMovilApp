MobileBanking_App.ForgottenPassword = function (params) {
    "use strict";


    var forgottenPasswordModel = {
        nombreUsuario: ko.observable()
    }

    var groupValidation = 'FORGOTTENPASSWORD';

    var viewModel = {
        viewShown: function () {
            clearControls();
        },
        groupValidation: groupValidation,
        txtNombreUsuario: setupTextBoxControl(forgottenPasswordModel.nombreUsuario, 32, CORE_TAG('UserName'), typeLetter.upper, undefined, false),
        btnEnviar: setupButtonControl('Enviar', sendRequire, groupValidation, undefined, iconosCore.send),
        clickAtras: function () {
            //MobileBanking_App.app.navigate("RegisterUser", { root: true });
            MobileBanking_App.app.navigate("LandingPage", { root: true });
        },
    };
    //ConsultarPreguntasSeguridadAleatoriamente


    var ConsultarPreguntasSeguridadUsuarioResultFunction = function (transactionConsultarPreguntasSeguridadUsuarioResult) {
        if (transactionConsultarPreguntasSeguridadUsuarioResult.CambiarPreguntasSeguridadUsuario === true) {


            if (transactionConsultarPreguntasSeguridadUsuarioResult.ListaPreguntasSeguridad.length > 0) {

                ConsultarControlAcceso(forgottenPasswordModel.nombreUsuario().toUpperCase(), function (data) {
                    var controlAccesoGlobal = data;
                    if (transactionConsultarPreguntasSeguridadUsuarioResult != null && controlAccesoGlobal != null) {

                        if (transactionConsultarPreguntasSeguridadUsuarioResult.ListaPreguntasSeguridad.length >= 2) {
                            var uri = MobileBanking_App.app.router.format({
                                view: 'ForgottenPasswordSecondInstance',
                                Pregunta1: transactionConsultarPreguntasSeguridadUsuarioResult.ListaPreguntasSeguridad[0].Pregunta,
                                Respuesta1: transactionConsultarPreguntasSeguridadUsuarioResult.ListaPreguntasSeguridad[0].Respuesta,
                                idAccesoPregunta1: transactionConsultarPreguntasSeguridadUsuarioResult.ListaPreguntasSeguridad[0].idAccesoPregunta,
                                esPredefinida1: transactionConsultarPreguntasSeguridadUsuarioResult.ListaPreguntasSeguridad[0].esPredefinida,

                                Pregunta2: transactionConsultarPreguntasSeguridadUsuarioResult.ListaPreguntasSeguridad[1].Pregunta,
                                Respuesta2: transactionConsultarPreguntasSeguridadUsuarioResult.ListaPreguntasSeguridad[1].Respuesta,
                                idAccesoPregunta2: transactionConsultarPreguntasSeguridadUsuarioResult.ListaPreguntasSeguridad[1].idAccesoPregunta,
                                esPredefinida2: transactionConsultarPreguntasSeguridadUsuarioResult.ListaPreguntasSeguridad[1].esPredefinida,

                                username: forgottenPasswordModel.nombreUsuario().toUpperCase(),
                                controlAccesoGlobal: JSON.stringify(controlAccesoGlobal)
                            });
                            MobileBanking_App.app.navigate(uri);
                        }
                        else {
                            //MENSAJE CUANDO SOLO POSEE UN A PREGUNTA
                            showWarningMessage(CORE_TAG('DefaultTitle'),
                                'Actualmente no tienes registradas tus preguntas de seguridad, favor de ingresar a nuestra ' +
                                '<a style="display: contents; color: blue; text-decoration: underline;" onclick="openInAppBrowser(undefined); return false;">página web de Bantigua en Línea</a>' +
                                ', accede con tu usuario y contraseña y el sistema te solicitará el registro de estas preguntas.<br/><br/>Al finalizar podrás ingresar normalmente a nuestra APP Bantigua.',
                                function () {
                                    //MobileBanking_App.app.navigate('RegisterUser');
                                    MobileBanking_App.app.navigate('LandingPage');
                                });

                        }
                    }
                });
            } else {
                showWarningMessage(CORE_TAG('DefaultTitle'), CORE_MESSAGE('REGMB094'), function () {
                    clearControls();
                })
            }
        } else {
            showWarningMessage(CORE_TAG('DefaultTitle'), "El número de intentos ha excedido por favor reintente en 10 minutos   ", function () {
                clearControls();
            })
        }
    }


    function sendRequire(params) {
        try {
            var result = params.validationGroup.validate();
            if (result.isValid) {
                ConsultarPreguntasSeguridadAleatoriamente(forgottenPasswordModel.nombreUsuario().toUpperCase(), ConsultarPreguntasSeguridadUsuarioResultFunction, true);
            } else {
                showWarningMessage(CORE_TAG('DefaultTitle'), CORE_MESSAGE('MissingData'));
            }
        } catch (e) {
            showException(e.message, e.stack);
        }
    }

    viewModel.txtNombreUsuario.onEnterKey = function () {
        $('#btnEnviar').click();
    }

    function clearControls() {
        DevExpress.validationEngine.resetGroup(groupValidation);
        $('#txtNombreUsuario').dxTextBox('instance').focus();
    }
    return viewModel;
};