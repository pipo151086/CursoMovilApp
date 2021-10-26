MobileBanking_App.DEOCSAExitoso = function (params) {
    "use strict";

    
    var currentPayment;
    if (params.id)
        currentPayment = JSON.parse(params.id);

    var viewModel = {

        txtTipoBusqueda: ko.observable(currentPayment.infoPago.tipoMostrar.Valor),
        txtNumeroTelefono: ko.observable(currentPayment.numeroCuenta.inputChar('-', currentPayment.numeroCuenta.length - 1)),
        txtTitular: ko.observable(currentPayment.respSaldo.Nombre),
        txtDireccion: ko.observable(currentPayment.respSaldo.Direccion),
        txtMontoPagar: ko.observable("Q " + (+ Number(currentPayment.respSaldo.Saldo).formatMoney(2, '.', ','))),

        //txtCuenta: ko.observable(maskTarjeta(currentPayment.accountSelected.Codigo, 4, 4)),
        txtCuenta: ko.observable(currentPayment.accountSelected.Codigo.inputChar('-', currentPayment.accountSelected.Codigo.length - 1)),
        txtNumReferencia: ko.observable(currentPayment.respPago.RespuestaGenerarDebitoWeb.inputChar('-', currentPayment.respPago.RespuestaGenerarDebitoWeb.length - 1)), //revisar
        viewShown: function () {
            setupFloatButton(classButtons.Accept, aceptar, undefined, undefined, undefined, undefined, undefined);
            if (currentPayment.infoPago.tipoMostrar.Codigo === '0')
                $('.esNIS').show();
            else
                $('.esNIS').hide();
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