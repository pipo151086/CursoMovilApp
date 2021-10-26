MobileBanking_App.MOVISTARExitoso = function (params) {
    "use strict";
    
    var currentPayment = JSON.parse('{"numeroCuenta":"45645645645","tipoComercio":"CLARO_PREPAGO","infoPago":{"tipoBusqueda":"1","montoMostrar":{"Codigo":"2","Valor":"11","Descripcion":"Q 11.00"},"tipoMostrar":{"Codigo":"1","Valor":"Prepago"},"monto":"11","nombre":"DFGDFG","nit":"3453453453","correo":"pipo151086@gmail.com"},"respSaldo":{"Saldo":"11"},"respPago":{"RespuestaGenerarDebitoWeb":"Secuencial","RespuestaPronet":{"cualquierProp":""}},"accountSelected":{"Codigo":"4127001074525","Descripcion":" (Q 981259.25) 412700107452-5","SaldoDisponible":"981259.25","SymbolMoneda":"Q ","Moneda":"GTQ"}}');
    if (params.id)
        currentPayment = JSON.parse(params.id);


    var viewModel = {
        txtNumeroTelefono: ko.observable(currentPayment.numeroCuenta),
        txtTitular: ko.observable(currentPayment.respSaldo.Nombre),
        txtFactura: ko.observable(currentPayment.respSaldo.Documento),
        txtFechaFactura: ko.observable(currentPayment.respSaldo.FechaPago),
        txtNombre: ko.observable(currentPayment.infoPago.nombre),
        txtNit: ko.observable(currentPayment.infoPago.nit),
        txtCorreo: ko.observable(currentPayment.infoPago.correo),
        txtMontoPagar: ko.observable("Q " + (+currentPayment.respSaldo.Saldo).toFixed(2)),
        txtCuenta: ko.observable(maskTarjeta(currentPayment.accountSelected.Codigo, 4, 4)),

        viewShown: function () {
            setupFloatButton(classButtons.Accept, aceptar, undefined, undefined, undefined, undefined, undefined);
            if (currentPayment.tipoComercio === tipoServicioBasicoStr.MOVISTAR_PREPAGO) {
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