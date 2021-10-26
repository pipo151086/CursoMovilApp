MobileBanking_App.EEGSAExitoso = function (params) {
    "use strict";

    var currentPayment;
    if (params.id)
        currentPayment = JSON.parse(params.id);

    var nContador = currentPayment.respSaldo.IdentificadorPersonal;
    var ncorrelativo = currentPayment.respSaldo.Identificador;


    var viewModel = {
        txtTipoBusqueda: ko.observable(currentPayment.infoPago.tipoMostrar.Valor),
        txtNumeroTelefono: ko.observable(currentPayment.numeroCuenta),
       //txtFactura: ko.observable(currentPayment.respSaldo.Documento),
        txtFactura: ko.observable((currentPayment.infoPago.tipoBusqueda === "01") ? currentPayment.respSaldo.Documento : currentPayment.respSaldo.Factura),
        txtFechaFactura: ko.observable(getDateFormat(new Date(currentPayment.respSaldo.FechaPago).toString("dd/MM/yyyy"))),


        txtNombre: ko.observable(currentPayment.respSaldo.Nombre),
        txtDireccion: ko.observable(currentPayment.respSaldo.Direccion),

        txtSaldo: ko.observable(!currentPayment.respSaldo.Saldo ? "Q 0.00" : "Q " + (+ Number(currentPayment.respSaldo.Saldo).formatMoney(2, '.', ','))),
        txtCargos: ko.observable(!currentPayment.respSaldo.Cargos ? "Q 0.00" : "Q " + (+ Number(currentPayment.respSaldo.Cargos).formatMoney(2, '.', ','))),

        txtMontoPagar: ko.observable("Q " + (+ Number(currentPayment.respSaldo.Saldo).formatMoney(2, '.', ','))),

        //txtCuenta: ko.observable(maskTarjeta(currentPayment.accountSelected.Codigo, 4, 4)),
        txtCuenta: ko.observable(currentPayment.accountSelected.Codigo.inputChar('-', currentPayment.accountSelected.Codigo.length - 1)),

        txtDoc2: ko.observable((currentPayment.infoPago.tipoDocumento.Codigo === "1") ? ncorrelativo : nContador),
        txtNumRef: ko.observable(currentPayment.respPago.RespuestaGenerarDebitoWeb.inputChar('-', currentPayment.respPago.RespuestaGenerarDebitoWeb.length - 1)),

        viewShown: function () {

            $('#tipoDoc').text(currentPayment.infoPago.tipoDocumento.Valor)
            if (currentPayment.infoPago.tipoDocumento.Codigo === "1") {
                $('#tipoDoc2').text("No. De Correlativo");
            } else {
                $('#tipoDoc2').text("No. Contador");
            }


            setupFloatButton(classButtons.Accept, aceptar, undefined, undefined, undefined, undefined, undefined);
            if (currentPayment.infoPago.tipoMostrar.Codigo === '01')
                $('.esFactura').show();
            else
                $('.esFactura').hide();
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