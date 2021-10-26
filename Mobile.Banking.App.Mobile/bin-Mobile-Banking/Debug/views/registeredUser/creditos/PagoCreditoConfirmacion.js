MobileBanking_App.PagoCreditoConfirmacion = function (params) {
    "use strict";

    var datosPago = null;
    if (params.id)
        datosPago = JSON.parse(params.id);



    var viewModel = {
        viewShown: function () {
            setupFloatButton(classButtons.Cancel, cancelar, undefined, sizeFloatButtons.small, typeFloatButtons.white);
            setupFloatButton(classButtons.Accept, siguiente, undefined, undefined, undefined, undefined, undefined);

            $('#ctaOrigen').text(datosPago.ctaSeleccionada.Descripcion);
            $('#TitCtaOrigen').text(datosPago.TitularCuentaOrigenMostrar);
            $('#credPagar').text(datosPago.numeroCredito);
            $('#valorTotalPagar').text(datosPago.montoMostrar);

        },
        viewShowing: function () {
            hideFloatButtons();
        },
        viewHidden: function () {
            hideFloatButtons();
        },
        ctaOrigen: ko.observable(),
        TitCtaOrigen: ko.observable(),
        credPagar: ko.observable(),
        valorTotalPagar: ko.observable(),
    };

    var siguiente = function (args) {


        PagarCreditoConDebitoACuenta(
            datosPago.ctaMoneda,
            datosPago.numeroCuenta,
            datosPago.monto,
            datosPago.numeroCredito,

            function (result) {


                var uri = MobileBanking_App.app.router.format({
                    view: 'PagoCreditoExitoso',
                    id: JSON.stringify(datosPago)
                })

                ObtenerCreditosCliente(function (data) {
                    SesionMovil.PosicionConsolidada.CreditosCliente = data;
                    ObtenerCuentasCliente(SesionMovil.ContextoCliente, function (data) {
                        SesionMovil.PosicionConsolidada.CuentasCliente = data
                        sessionStorage.setItem('', '');
                        sessionStorage.setItem('FechaActividadApp', new Date());
                        MobileBanking_App.app.navigate(uri, { root: true });
                    });

                });
            });


        //EnviarOTP(SesionMovil.ContextoCliente, function (data) {
        //    if (data) {


        //        //paso por OTP
        //        //var pagarCreditoConDebitoACuenta = OperacionEjecutar.PagarCreditoConDebitoACuenta;
        //        //pagarCreditoConDebitoACuenta.dtoPagarCreditoConDebitoACuenta = datosPago;
        //        //var uri = MobileBanking_App.app.router.format({
        //        //    view: 'IngresoOTP',
        //        //    id: JSON.stringify(pagarCreditoConDebitoACuenta)
        //        //});
        //        //MobileBanking_App.app.navigate(uri, { root: true });
        //    }
        //})
    }

    var cancelar = function (args) {
        MobileBanking_App.app.navigate('PosicionConsolidada', { root: true });
    }

    return viewModel;
};