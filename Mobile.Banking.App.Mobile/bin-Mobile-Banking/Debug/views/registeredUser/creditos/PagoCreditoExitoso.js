MobileBanking_App.PagoCreditoExitoso = function (params) {
    "use strict";

    var datosPago = null;
    if (params.id)
        datosPago = JSON.parse(params.id);

    var viewModel = {
        viewShown: function () {
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
        MobileBanking_App.app.navigate('PosicionConsolidada', { root: true });
    }

    return viewModel;
};