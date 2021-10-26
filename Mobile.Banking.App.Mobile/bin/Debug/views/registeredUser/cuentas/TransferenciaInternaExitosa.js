MobileBanking_App.TransferenciaInternaExitosa = function (params) {
    "use strict";


    var Imprimir = JSON.parse(params.id);
    var viewModel = {
        viewShown: function () {
            setupFloatButton(classButtons.Accept, salir);
        },
        viewShowing: function () {
            hideFloatButtons();
        },
        Comprobante: Imprimir.Comprobante,
        CuentaOrigen: Imprimir.CuentaOrigen.inputChar('-', Imprimir.CuentaOrigen.length - 1),
        TitularCuentaOrigen: Imprimir.TitularCuentaOrigen,
        Moneda: Imprimir.Moneda,
        Monto: Number(Imprimir.Monto).formatMoney(2, '.', ','),
        CuentaDestino: Imprimir.CuentaDestino.inputChar('-', Imprimir.CuentaDestino.length - 1),
        TitularCuentaDestino: Imprimir.TitularCuentaDestino,
        Concepto: Imprimir.Concepto,
        EmailPersonal: Imprimir.emailOrigen,
        EmailTercero: Imprimir.emailDestino
    };

    function salir() {
        MobileBanking_App.app.navigate("PosicionConsolidada", { root: true });
    }

    return viewModel;
};