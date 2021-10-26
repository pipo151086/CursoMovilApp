MobileBanking_App.CLAROExitoso = function (params) {
    "use strict";
    
    var currentPayment;
    if (params.id)
        currentPayment = JSON.parse(params.id);


    var viewModel = {
        txtComprobante: ko.observable(currentPayment.respPago.RespuestaGenerarDebitoWeb.inputChar('-', currentPayment.respPago.RespuestaGenerarDebitoWeb.length - 1)),

        txtNumeroTelefono: ko.observable(currentPayment.numeroCuenta.inputChar('-', currentPayment.numeroCuenta.length - 1)),
        txtTitular: ko.observable(currentPayment.respSaldo.Nombre),
        txtFactura: ko.observable(currentPayment.respSaldo.Documento),

        txtFechaFactura: ko.observable(getDateFormat(new Date(currentPayment.respSaldo.FechaPago).toString("dd/MM/yyyy")) ),


        txtNombre: ko.observable(currentPayment.infoPago.nombre),
        txtNit: ko.observable(currentPayment.infoPago.nit),
        txtCorreo: ko.observable((currentPayment.infoPago.correo.length > 30) ? currentPayment.infoPago.correo.substr(0, 30 - 1) + '...' : currentPayment.infoPago.correo),
        txtMontoPagar: ko.observable("Q " + (+ Number(currentPayment.respSaldo.Saldo).formatMoney(2, '.', ','))),
        //txtCuenta: ko.observable(maskTarjeta(currentPayment.accountSelected.Codigo, 4, 4)),
        txtFecha: ko.observable(new Date().toString("dd/MM/yyyy")),
        txtCuenta: ko.observable(currentPayment.accountSelected.Codigo.inputChar('-', currentPayment.accountSelected.Codigo.length - 1)),
        viewShown: function () {
            setupFloatButton(classButtons.Accept, aceptar, undefined, undefined, undefined, undefined, undefined);
            if (currentPayment.tipoComercio === tipoServicioBasicoStr.CLARO_PREPAGO) {
                $('.esPrePago').show();
                $('.esPostPago').hide();
            } else {
                $('.esPrePago').hide();
                $('.esPostPago').show();
            }

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