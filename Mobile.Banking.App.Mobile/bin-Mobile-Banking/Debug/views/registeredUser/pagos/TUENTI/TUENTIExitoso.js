MobileBanking_App.TUENTIExitoso = function (params) {
    "use strict";
    var currentPayment;
    if (params.id)
        currentPayment = JSON.parse(params.id);
    var viewModel = {
        viewShown: function () {
            setupFloatButton(classButtons.Accept, aceptar, undefined, undefined, undefined, undefined, undefined);
        },
        viewShowing: function () {
            hideFloatButtons();
        },
        txtNumeroTelefono: ko.observable(currentPayment.numeroCuenta),
        txtProducto: ko.observable(currentPayment.infoPago.montoMostrar.Descripcion),
        txtNombre: ko.observable(currentPayment.infoPago.nombre),
        txtNit: ko.observable(currentPayment.infoPago.nit),
        txtCorreo: ko.observable(currentPayment.infoPago.correo),
        txtMontoPagar: ko.observable("Q " + (+ Number(currentPayment.respSaldo.Saldo).formatMoney(2, '.', ','))),
        txtCuenta: ko.observable(maskTarjeta(currentPayment.accountSelected.Codigo, 4, 4))
    };

    function aceptar(args) {
        MobileBanking_App.app.navigate("PosicionConsolidada", { root: true });
    }
    return viewModel;
};