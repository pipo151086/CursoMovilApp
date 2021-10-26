MobileBanking_App.TIGOSTARExitoso = function (params) {
    "use strict";
    

    var currentPayment;
    if (params.id)
        currentPayment = JSON.parse(params.id);


    var viewModel = {
        txtCodigoCliente: ko.observable(currentPayment.numeroCuenta.inputChar('-', currentPayment.numeroCuenta.length - 1)),
        txtTitular: ko.observable(currentPayment.respSaldo.Nombre),
        txtMontoPagar: ko.observable("Q " + (+ Number(currentPayment.respSaldo.Saldo).formatMoney(2, '.', ','))),
        //txtCuenta: ko.observable(maskTarjeta(currentPayment.accountSelected.Codigo, 4, 4)),
        txtCuenta: ko.observable(currentPayment.accountSelected.Codigo.inputChar('-', currentPayment.accountSelected.Codigo.length - 1)),


        txtNumAutorizacion: ko.observable(currentPayment.respPago.RespuestaPronet.IdentificadorUnicoTransaccion.inputChar('-', currentPayment.respPago.RespuestaPronet.IdentificadorUnicoTransaccion.length - 1)), //revisarr
        txtNumReferencia: ko.observable(currentPayment.respPago.RespuestaGenerarDebitoWeb.inputChar('-', currentPayment.respPago.RespuestaGenerarDebitoWeb.length - 1)), 
        viewShown: function () {
            setupFloatButton(classButtons.Accept, aceptar, undefined, undefined, undefined, undefined, undefined);
        },
        viewShowing: function () {
            hideFloatButtons();
        },
    };

    function aceptar(args) {
        MobileBanking_App.app.navigate("PosicionConsolidada", { root: true });
    }

    return viewModel;
};