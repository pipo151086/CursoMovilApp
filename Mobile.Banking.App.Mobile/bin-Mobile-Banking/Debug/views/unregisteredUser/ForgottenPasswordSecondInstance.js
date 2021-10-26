MobileBanking_App.ForgottenPasswordSecondInstance = function (params) {
    "use strict";

    var intentos = 0;

    var objPregunta = {
        Pregunta: params.Pregunta1,
        Respuesta: params.Respuesta1,
        idAccesoPregunta: params.idAccesoPregunta1,
        esPredefinida: params.esPredefinida1,
    }

    var objPregunta2 = {
        Pregunta: params.Pregunta2,
        Respuesta: params.Respuesta2,
        idAccesoPregunta: params.idAccesoPregunta2,
        esPredefinida: params.esPredefinida2,
    }



    var groupValidation = 'FORGOTTENPASSWORD2';

    var model = {
        respuesta: ko.observable(),
        respuesta2: ko.observable(),
        valuePregunta: ko.observable(),

    }

    var controlAccesoGlobal = JSON.parse(params.controlAccesoGlobal);

    var viewModel = {
        viewShown: function () {
            clearControls();
            $('#Pregunta1').text("¿" + objPregunta.Pregunta + "?")
            $('#Pregunta2').text("¿" + objPregunta2.Pregunta + "?")
        },
        clickAtras: function () {
            //MobileBanking_App.app.navigate("RegisterUser", { root: true });
            MobileBanking_App.app.navigate("LandingPage", { root: true });
        },
        groupValidation: groupValidation,
        txtRespuesta: setupTextBoxControl(model.respuesta, 64, CORE_TAG('Response'), typeLetter.upper),
        txtRespuesta2: setupTextBoxControl(model.respuesta2, 64, CORE_TAG('Response'), typeLetter.upper),
        btnEnviar: setupButtonControl('Enviar', sendRequire, groupValidation, undefined, iconosCore.send),
        btnCambiar: setupButtonControl('Cambiar Preguntas', cambiarPregunta, groupValidation, undefined, undefined),
        valuePregunta: objPregunta.Pregunta,
        valuePregunta2: objPregunta2.Pregunta,
        valueUserName: params.username,


        validateAndSubmit: function (params) {

        }
    };

    function sendRequire(params) {
        try {
            var result = params.validationGroup.validate();
            if (result.isValid) {
                objPregunta.Respuesta = model.respuesta();
                objPregunta2.Respuesta = model.respuesta2();
                var preguntas = []

                preguntas.push(objPregunta)
                preguntas.push(objPregunta2)
                OlvidoDeClave(preguntas, controlAccesoGlobal, function (data) {
                    var ValidateAnswerResponse = data;
                    if (ValidateAnswerResponse != null) {
                        showSimpleMessage(CORE_TAG('DefaultTitle'), CORE_MESSAGE_ADD('SendEmailPassword', ValidateAnswerResponse), function () {
                            //MobileBanking_App.app.navigate("RegisterUser", { root: true });
                            MobileBanking_App.app.navigate("LandingPage", { root: true });
                        })
                    } else {
                        showSimpleMessage(CORE_TAG('DefaultTitle'), CORE_MESSAGE('GeneralError'), function () {
                            //MobileBanking_App.app.navigate("RegisterUser", { root: true });
                            MobileBanking_App.app.navigate("LandingPage", { root: true });
                        })
                    }
                });

            }
        } catch (e) {
            showException(e.message, e.stack);
        }
    }




    function cambiarPregunta() {
        try {
            ConsultarPreguntasSeguridadAleatoriamente(params.username, function (data) {
                if (data.CambiarPreguntasSeguridadUsuario == true) {
                    
                    //en pantalla 
                    $('#Pregunta1').text("¿" + data.ListaPreguntasSeguridad[0].Pregunta + "?")
                    $('#Pregunta2').text("¿" + data.ListaPreguntasSeguridad[1].Pregunta + "?")
                    //en data obj1
                    objPregunta.Pregunta = data.ListaPreguntasSeguridad[0].Pregunta
                    objPregunta.Respuesta = data.ListaPreguntasSeguridad[0].Respuesta
                    objPregunta.idAccesoPregunta = data.ListaPreguntasSeguridad[0].idAccesoPregunta
                    objPregunta.esPredefinida = data.ListaPreguntasSeguridad[0].esPredefinida
                    //DATA EN OBJ2

                    objPregunta2.Pregunta = data.ListaPreguntasSeguridad[1].Pregunta
                    objPregunta2.Respuesta = data.ListaPreguntasSeguridad[1].Respuesta
                    objPregunta2.idAccesoPregunta = data.ListaPreguntasSeguridad[1].idAccesoPregunta
                    objPregunta2.esPredefinida = data.ListaPreguntasSeguridad[1].esPredefinida

                    //model.valuePregunta(data.ListaPreguntasSeguridad[0].Pregunta);
                    $('#txtRespuesta').dxTextBox('option', 'value', '');
                    $('#txtRespuesta2').dxTextBox('option', 'value', '');

                } else {

                    showWarningMessage(CORE_TAG('DefaultTitle'), "El número de intentos ha excedido por favor reintente en 10 minutos   ")
                }

            }, true);
        } catch (e) {
            showException(e.message, e.stack);
        }
    }



    function clearControls() {
        DevExpress.validationEngine.resetGroup(groupValidation);
        $('#txtRespuesta').dxTextBox('instance').focus();
        $('#txtRespuesta2').dxTextBox('instance').focus();
    }

    return viewModel;
};