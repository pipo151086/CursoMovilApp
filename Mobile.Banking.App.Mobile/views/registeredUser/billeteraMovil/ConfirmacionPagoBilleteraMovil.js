MobileBanking_App.ConfirmacionPagoBilleteraMovil = function (params) {
    "use strict";

    var Confirmar = JSON.parse(params.id);

    var viewModel = {
        Monto: Confirmar.Monto,
        ValorUsoCanal: Confirmar.ValorUsoCanal,
        ValorTotal: Confirmar.ValorTotal,
        CelularAsociado:Confirmar.CelularAsociado,
        CuentaBilletera: Confirmar.CuentaBilletera,
        CelularBeneficiario: Confirmar.CelularBeneficiario,
        Concepto: Confirmar.Concepto,
        EmailTercero: Confirmar.EmailTercero,
        PagoPendienteId: Confirmar.PagoPendienteId,
        TipoTransaccion: Confirmar.TipoTransaccion,
        Moneda: Confirmar.Moneda,
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
    };



    function confirmar() {
        try {
            //EnviarOTP
            try {
                EnviarOTP(SesionMovil.ContextoCliente, function (data) {
                var resultadoEnviarOTP = data;
                if (resultadoEnviarOTP) {
                    var operacionAIngresoOTP = OperacionEjecutar.PagoBilleteraMovil;
                    var dto = {
                        monto: Confirmar.Monto,
                        celularAsociado: Confirmar.CelularAsociado,
                        celularBeneficiario: Confirmar.CelularBeneficiario,
                        concepto: Confirmar.Concepto,
                        emailTercero: Confirmar.EmailTercero,
                        pagoPendienteId: Confirmar.PagoPendienteId,
                        tipoTransaccion: Confirmar.TipoTransaccion,
                        moneda: Confirmar.Moneda
                    }

                    operacionAIngresoOTP.dtoPagoBilleteraMovil = dto;
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
            MobileBanking_App.app.navigate('PosicionConsolidada', { root: true });

        } catch (e) {
            showException(e.message, e.stack);
        }
    }

    return viewModel;
};