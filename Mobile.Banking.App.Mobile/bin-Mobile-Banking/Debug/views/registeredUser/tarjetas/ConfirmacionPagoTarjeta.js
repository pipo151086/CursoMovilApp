MobileBanking_App.ConfirmacionPagoTarjeta = function (params) {
    "use strict";

    var Verificar = JSON.parse(params.id);

    var viewModel = {
        viewShown: function () {
            try {
                setupFloatButton(classButtons.Cancel, cancelar, undefined, sizeFloatButtons.small, typeFloatButtons.white);
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

        CtaMoneda: Verificar.ctaMoneda,
        NumeroCuenta: '(' + ((Verificar.ctaMoneda === 'GTQ') ? 'Q' : '$') + ')' + Verificar.numeroCuenta.inputChar('-', Verificar.numeroCuenta.length - 1),
        MonedaTransaccion: Verificar.monedaTransaccion,
        MontoMostrar: '(' + Verificar.symbolMonedaTransaccion + ') ' + Number(Verificar.monto).formatMoney(2, '.', ','),
        Monto: Verificar.monto,
        NumeroTarjetaMostrar: '(' + ((Verificar.monedaTarjeta === 'GTQ') ? 'Q' : '$') + ')' + maskTarjeta(Verificar.numeroTarjeta, 3, 5),
        NumeroTarjeta: Verificar.numeroTarjeta,
        TasaDeConversion: Verificar.tasaDeConversion,
        MontoQuetzal: '(Q)' + ((Verificar.monedaTransaccion == "USD") ? Number(Verificar.valorQuetzal).formatMoney(2, '.', ',') : 0),
    };

    function confirmar() {
        if (Verificar.esPropia || Verificar.marca === "TCJ") {
            PagarTRJRevolvente(
                Verificar.numeroCuenta,
                Verificar.ctaMoneda,
                Verificar.monto,
                Verificar.idCuentaTarjeta,
                successPago
            )
        }
        else {
            PagarTarjetaConDebitoACuenta(
                Verificar.ctaMoneda,
                Verificar.numeroCuenta,
                Verificar.monedaTransaccion,
                Verificar.monto,
                Verificar.numeroTarjeta,
                successPago
            )
        }
    }

    function successPago(result) {
        Verificar.numeroTransaccion = result;
        ObtenerCuentasCliente(SesionMovil.ContextoCliente, function (data) {
            SesionMovil.PosicionConsolidada.CuentasCliente = data
            sessionStorage.setItem('', '');
            sessionStorage.setItem('FechaActividadApp', new Date());
        });
        var uri = MobileBanking_App.app.router.format({
            view: 'PagoTarjetaExitoso',
            id: JSON.stringify(Verificar)
        });
        MobileBanking_App.app.navigate(uri, { root: true });
    }


    function cancelar() {
        MobileBanking_App.app.navigate('PosicionConsolidada', { root: true });
    }
    return viewModel;
};