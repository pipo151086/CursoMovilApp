MobileBanking_App.ConfirmacionCrearBilleteraMovil = function (params) {
    "use strict";

    var Confirmar = JSON.parse(params.id);
    var viewModel = {
        Account: Confirmar.numeroCuentaMask,
        PhoneNumber: Confirmar.telefono,
        viewShown: function () {
            try {
                SesionMovil.FechaActividadApp = new Date();
                setupFloatButton(classButtons.Cancel, cancelar, undefined, sizeFloatButtons.small, typeFloatButtons.white);
                setupFloatButton(classButtons.Accept, confirmar);
            } catch (e) {
                showException(e.message, e.stack);
            }
        },
        viewShowing: function () {
            hideFloatButtons();
        },
    }

    function confirmar() {
        try {
  
            //EnviarOTP
            try {
                EnviarOTP(SesionMovil.ContextoCliente, function (data) {
                    var resultadoEnviarOTP = data;
                    if (resultadoEnviarOTP) {
                        var operacionAIngresoOTP = OperacionEjecutar.EnrolarBilleteraMovil;
                        var dto = {
                            telefono: Confirmar.telefono,
                            numeroCuenta: Confirmar.numeroCuenta,
                        }

                        operacionAIngresoOTP.dtoEnrolarBilleteraMovil = dto;
                        var uri = MobileBanking_App.app.router.format({
                            view: 'IngresoOTP',
                            id: JSON.stringify(operacionAIngresoOTP)
                        });
                        MobileBanking_App.app.navigate(uri, { root: true });
                    }
                    else {

                    }
                }) ///envia el sms al dispotivo

            } catch (e) {
                showException(e.message, e.stack);
            }


        } catch (e) {
            showException(e.message, e.stack);
        }
    }

    function cancelar() {
        try {
            MobileBanking_App.app.navigate('CrearBilleteraMovil', { root: true });

        } catch (e) {
            showException(e.message, e.stack);
        }
    }

    return viewModel;
};