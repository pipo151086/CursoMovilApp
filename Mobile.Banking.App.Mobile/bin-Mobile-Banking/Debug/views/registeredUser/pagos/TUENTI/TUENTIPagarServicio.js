MobileBanking_App.TUENTIPagarServicio = function (params) {
    "use strict";

    var currentPayment;
    if (params.id)
        currentPayment = JSON.parse(params.id);


    var arrayCtaOrigen = [];
    var accountSelected = null;

    var filtradas = jslinq(SesionMovil.PosicionConsolidada.CuentasCliente).where(function (el) {
        return el.Moneda == 'GTQ';
    }).toList();

    arrayCtaOrigen = $.map(filtradas, function (item, index) {
        var monedaSymbol = ((item.Moneda === 'GTQ') ? 'Q ' : '$ ');
        return { Codigo: item.Codigo, Descripcion: ' (' + monedaSymbol + Number(item.SaldoDisponible ).formatMoney(2, '.', ',')+ ') ' + item.Codigo.inputChar('-', item.Codigo.length - 1), SaldoDisponible: item.SaldoDisponible, SaldoDisponible: item.SaldoDisponible, SymbolMoneda: monedaSymbol, Moneda: item.Moneda }
    });

    var lisCtaOrigen = new DevExpress.data.DataSource({
        store: {
            type: "array",
            key: "Codigo",
            data: arrayCtaOrigen
        }

    });

    var viewModel = {
        txtNumeroTelefono: ko.observable(currentPayment.numeroCuenta),
        //txtTitular: ko.observable(currentPayment.infoPago.nombre),
        txtProducto: ko.observable(currentPayment.infoPago.montoMostrar.Descripcion),
        txtNombre: ko.observable(currentPayment.infoPago.nombre),
        txtNit: ko.observable(currentPayment.infoPago.nit),
        txtCorreo: ko.observable(currentPayment.infoPago.correo),
        txtMontoPagar: ko.observable("Q " + (+ Number(currentPayment.respSaldo.Saldo).formatMoney(2, '.', ','))),

        viewShown: function () {
            setupFloatButton(classButtons.Accept, pagarServicio, undefined, undefined, undefined, undefined, undefined);
            setupFloatButton(classButtons.Cancel, cancelar, undefined, sizeFloatButtons.small, typeFloatButtons.white);
            //setInfoIntoView();
            accountSelected = lisCtaOrigen._store._array[0];
        },
        viewShowing: function () {
            hideFloatButtons();
        },
        popupSeleccionCuenta: setupPopup(false, '90%', 'auto', true, 'Cuenta Origen', true),
        rdbCuentas: setupRadioGroup(lisCtaOrigen._store._array[0].Codigo, lisCtaOrigen, 'Descripcion', 'Codigo', function (itemData, itemIndex, itemElement) {
            var content = "<div>";
            content = content + "<span>" + itemData.Codigo.inputChar('-', itemData.Codigo.length - 1) + " (" + Number(itemData.SaldoDisponible ).formatMoney(2, '.', ',')+ ")</span>";
            content = content + "</div>";
            return content;
        }),
        btnCancelarCuenta: setupButtonControlDefault(classButtons.Cancel, cancelAccount),
        btnCambiarCuenta: setupButtonControl(lisCtaOrigen._store._array[0].Descripcion, changeAccount, undefined, undefined, iconosCore.chevron_down, undefined, true),
    };

    var pagarServicio = function (args) {
        var requerimiento = {
            Comercio: currentPayment.tipoComercio,
            TipoCuenta: currentPayment.infoPago.tipoBusqueda,
            NumeroCuenta: currentPayment.numeroCuenta,
            CodigoProducto: currentPayment.infoPago.tipoMostrar.codigoProducto,
            Monto: currentPayment.infoPago.monto,
            NombreCliente: currentPayment.infoPago.nombre,
            NIT: currentPayment.infoPago.nit,
            CorreoElectronico: currentPayment.infoPago.correo
        }
        //RealizarPagoServicios(ctaMoneda, numeroCuenta, monto, codigoAtributo, requerimiento, addFunction)
        
        RealizarPagoServicios(accountSelected.Moneda,
            accountSelected.Codigo,
            requerimiento.Monto,
            "ATRDEBPAGOTCACTA",
            requerimiento, function (respPago) {
                currentPayment.respPago = !respPago ? {
                    RespuestaGenerarDebitoWeb: 'Secuencial', RespuestaPronet: { cualquierProp: "" }
                } :
                    respPago
                    ;
                currentPayment.accountSelected = accountSelected;
                RedirectOnSuccess(currentPayment);
            });
    }


    function RedirectOnSuccess(currentPayment) {
        var uri = MobileBanking_App.app.router.format({
            view: 'TUENTIExitoso',
            id: JSON.stringify(currentPayment)
        });
        MobileBanking_App.app.navigate(uri, { root: true });
    }



    viewModel.rdbCuentas.onValueChanged = function (e) {
        var select = e.value;
        for (var i = 0; i < lisCtaOrigen._store._array.length; i++) {
            if (select == lisCtaOrigen._store._array[i].Codigo) {
                accountSelected = lisCtaOrigen._store._array[i];
                i = lisCtaOrigen._store._array.length;
            }
        }
        if (accountSelected) {
            changePropertyControl('#btnCambiarCuenta', typeControl.Button, 'text', accountSelected.Codigo.inputChar('-', accountSelected.Codigo.length - 1) + ' (' + accountSelected.SymbolMoneda + Number(accountSelected.SaldoDisponible ).formatMoney(2, '.', ',')+ ")");
            changePropertyControl('#popupSeleccionCuenta', typeControl.Popup, 'visible', false);

        }
    }

    viewModel.popupSeleccionCuenta.onShown = function () {
        $('#floatButtons').hide();
    }

    viewModel.popupSeleccionCuenta.onHidden = function () {
        $('#floatButtons').show();
    }

    function changeAccount() {
        changePropertyControl('#popupSeleccionCuenta', typeControl.Popup, 'visible', true);
    }
    function cancelAccount() {
        changePropertyControl('#popupSeleccionCuenta', typeControl.Popup, 'visible', false);
    }

    viewModel.rdbCuentas.onValueChanged = function (e) {
        var select = e.value;
        for (var i = 0; i < lisCtaOrigen._store._array.length; i++) {
            if (select == lisCtaOrigen._store._array[i].Codigo) {
                accountSelected = lisCtaOrigen._store._array[i];
                i = lisCtaOrigen._store._array.length;
            }
        }
        if (accountSelected) {
            changePropertyControl('#btnCambiarCuenta', typeControl.Button, 'text', accountSelected.Codigo.inputChar('-', accountSelected.Codigo.length - 1) + ' (' + accountSelected.SymbolMoneda + Number(accountSelected.SaldoDisponible).formatMoney(2, '.', ',') + ")");
            changePropertyControl('#popupSeleccionCuenta', typeControl.Popup, 'visible', false);

        }
    }
    var cancelar = function (args) {
        MobileBanking_App.app.navigate('PosicionConsolidada', { root: true });
    }
    return viewModel;
};