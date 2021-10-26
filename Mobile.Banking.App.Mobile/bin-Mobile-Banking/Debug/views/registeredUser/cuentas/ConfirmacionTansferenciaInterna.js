MobileBanking_App.ConfirmacionTansferenciaInterna = function (params) {
    "use strict";

    var Confirmar = JSON.parse(params.id);
    var viewModel = {
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
        Comprobante: '',
        CuentaOrigen: Confirmar.CuentaOrigen.inputChar('-', Confirmar.CuentaOrigen.length-1),
        TitularCuentaOrigen: Confirmar.TitularCuentaOrigen,
        Moneda: Confirmar.Moneda,
        Monto: Confirmar.Monto,
        MontoMostrar:  Number(Confirmar.Monto).formatMoney(2, '.', ','),
        CuentaDestino: Confirmar.CuentaDestino.inputChar('-', Confirmar.CuentaDestino.length - 1),
        TitularCuentaDestino: Confirmar.TitularCuentaDestino,
        Concepto: Confirmar.Concepto,
        emailOrigen: Confirmar.emailOrigen,
        emailDestino: Confirmar.emailDestino,
        IdCliente: SesionMovil.ContextoCliente.CodigoCliente,
    }

    function confirmar() {
        try {
            EnviarOTP(SesionMovil.ContextoCliente, function (data) {
                var resultadoEnviarOTP = data;
                if (resultadoEnviarOTP) {
                    var operacionAIngresoOTP = OperacionEjecutar.TransferenciaInterna;
                    var dto = {
                        Comprobante: "",
                        Monto: viewModel.Monto,
                        Fecha: Globalize.dateFormatter({ raw: 'yyyy/MM/dd HH:mm' })(new Date()),
                        CuentaOrigen: viewModel.CuentaOrigen,
                        TipoCuentaOrigen: "",
                        TitularCuentaOrigen: viewModel.TitularCuentaOrigen,
                        CuentaDestino: viewModel.CuentaDestino,
                        TipoCuentaDestino: "",
                        TitularCuentaDestino: viewModel.TitularCuentaDestino,
                        Concepto: viewModel.Concepto == undefined ? '' : viewModel.Concepto,
                        FlujoTransferencia: "",
                        emailOrigen: viewModel.emailOrigen,
                        emailDestino: viewModel.emailDestino == undefined ? '' : viewModel.emailDestino,
                        Institucion: "",
                        IdEntidadFinanciera: 0,
                        BancoDestino: "",
                        Estado: "",
                        Moneda: viewModel.Moneda
                    }

                    operacionAIngresoOTP.dtoTransferenciaDirecta = dto;
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
    }

    function cancelar() {
        try {
            MobileBanking_App.app.navigate('TransferenciasInternas', { root: true });

        } catch (e) {
            showException(e.message, e.stack);
        }
    }

    return viewModel;
};