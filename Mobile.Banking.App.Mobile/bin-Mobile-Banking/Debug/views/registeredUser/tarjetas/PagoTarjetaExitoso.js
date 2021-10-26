MobileBanking_App.PagoTarjetaExitoso = function (params) {
    "use strict";

    var Verificar = JSON.parse(params.id);
    
    var viewModel = {
        viewShown: function () {
            try {
                setupFloatButton(classButtons.Accept, confirmar);
                if (Verificar.monedaTransaccion !== "USD")
                    $(".valorQuetzal").hide();
                else
                    $(".valorQuetzal").show();

            } catch (e) {
                showException(e.message, e.stack);
            }
        },
        viewShowing: function () {
            hideFloatButtons();
        },
        NumeroCuenta: '(' + ((Verificar.ctaMoneda === 'GTQ') ? 'Q' : '$') + ')' + Verificar.numeroCuenta.inputChar('-', Verificar.numeroCuenta.length - 1),
        Monto: '(' + ((Verificar.monedaTransaccion === 'GTQ') ? 'Q' : '$') + ')' + Number(Verificar.monto).formatMoney(2, '.', ','),
        NumeroTarjeta: '(' + ((Verificar.monedaTarjeta === 'GTQ') ? 'Q' : '$') + ')' + Verificar.numeroTarjeta,
        NumeroTransaccion: Verificar.numeroTransaccion,
        MontoQuetzales: '(Q)' + ((Verificar.monedaTransaccion == "USD") ? Number(Verificar.valorQuetzal).formatMoney(2, '.', ',') : 0),
    };


    function confirmar() {
        MobileBanking_App.app.navigate('PosicionConsolidada', { root: true });
    }

    return viewModel;
};