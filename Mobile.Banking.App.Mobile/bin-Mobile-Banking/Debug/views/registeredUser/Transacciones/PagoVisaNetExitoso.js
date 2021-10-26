MobileBanking_App.PagoVisaNetExitoso = function (params) {
    "use strict";
    var datosPago = null;

    if (params.id)
        datosPago = JSON.parse(params.id);
    var ProductoMostrar = "";
    var tituloSpan = "";
    var numProductoMostrar = datosPago.numeroProducto;

    switch (datosPago.pagoProducto) {
        case 0: // CREDITO
            ProductoMostrar = 'Crédito';
            tituloSpan = "Número de Crédito";
            numProductoMostrar = datosPago.numeroProducto;
            break;
        case 1: //TRJ
        default:
            ProductoMostrar = 'Tarjeta de Crédito';
            tituloSpan = "Número de Tarjeta";
            numProductoMostrar = maskTarjeta(numProductoMostrar, 4, 5)
            break;
    }
    
    var viewModel = {
        lblProducto: ko.observable(tituloSpan),
        tipoProducto: ko.observable(ProductoMostrar),
        numProducto: ko.observable(numProductoMostrar),
        numTarjeta: ko.observable(maskTarjeta(datosPago.TrjPago, 4, 5)),
        numAutorizacion: ko.observable(datosPago.Response.Autorizacion),
        numSecuencial: ko.observable(datosPago.Response.Secuencial),
        monto: ko.observable(datosPago.montoMostrar),
        viewShown: function () {
            setupFloatButton(classButtons.Accept, aceptar, undefined, undefined, undefined, undefined, undefined);
        },

    };

    function aceptar() {
        MobileBanking_App.app.navigate({ view: 'PosicionConsolidada' }, { root: true });
    }

    return viewModel;
};