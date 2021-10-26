MobileBanking_App.ConfirmacionCargaSaldoAkisi = function (params) {
    "use strict";

    var cargaSaldoAkisi = JSON.parse(params.id);
    var accountSelected = null;
    var cuentas = SesionMovil.PosicionConsolidada.CuentasCliente.filter((itm) => { return itm.Moneda === 'GTQ' });
    var ctasQueriable = jslinq(cuentas);

    var arrayCtaOrigen = $.map(ctasQueriable.toList(), function (item, index) {
        var simboloMoneda = ((item.Moneda === 'GTQ') ? 'Q' : '$')
        return {
            Codigo: item.Codigo,
            Descripcion: item.Codigo.inputChar('-', item.Codigo.length - 1) + ' (' + simboloMoneda + item.SaldoDisponible + ') ',
            SaldoDisponible: item.SaldoDisponible,
            SymbolMoneda: simboloMoneda
        }
    });

    var lisCtaOrigen = new DevExpress.data.DataSource({
        store: {
            type: "array",
            key: "Codigo",
            data: arrayCtaOrigen
        }
    });

    var viewModel = {
        viewShowing: function () {
            hideFloatButtons();
        },
        viewShown: function () {
            setupFloatButton(classButtons.Cancel, cancelar, undefined, sizeFloatButtons.small, typeFloatButtons.white);
            setupFloatButton(classButtons.Accept, siguiente, undefined, undefined, undefined, undefined, undefined);

        },

        titular: ko.observable(cargaSaldoAkisi.consultaResult.Nombre),
        numeroTelefono: ko.observable(cargaSaldoAkisi.numeroTelefono),
        montoMostrar: ko.observable(cargaSaldoAkisi.montoMostrar),

        btnCancelarCuenta: setupButtonControlDefault(classButtons.Cancel, cancelAccount),
        btnCambiarCuenta: setupButtonControl(lisCtaOrigen._store._array[0].Descripcion, changeAccount, undefined, undefined, iconosCore.chevron_down, undefined, true),
        popupSeleccionCuenta: setupPopup(false, '90%', 'auto', true, 'Cuenta Origen', true),
        rdbCuentas: setupRadioGroup(lisCtaOrigen._store._array[0].Codigo, lisCtaOrigen, 'Descripcion', 'Codigo', function (itemData, itemIndex, itemElement) {
            var content = "<div>";
            content = content + "<span>" + itemData.Codigo.inputChar('-', itemData.Codigo.length - 1) + " (" + itemData.SymbolMoneda + " " + Number(itemData.SaldoDisponible).formatMoney(2, '.', ',') + ")</span>";
            content = content + "</div>";
            return content;
        }),
    };

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
            $('#currSymbol').text(accountSelected.SymbolMoneda)
        }
    }


    function changeAccount() {
        changePropertyControl('#popupSeleccionCuenta', typeControl.Popup, 'visible', true);
    }

    function cancelAccount() {
        changePropertyControl('#popupSeleccionCuenta', typeControl.Popup, 'visible', false);
    }

    viewModel.popupSeleccionCuenta.onShown = function () {
        $('#floatButtons').hide();
    }

    viewModel.popupSeleccionCuenta.onHidden = function () {
        $('#floatButtons').show();
    }


    function siguiente(params) {
        var selectedCuenta = $('#rdbCuentas').dxRadioGroup('option', 'value');
        for (var i = 0; i < lisCtaOrigen._store._array.length; i++) {
            if (selectedCuenta == lisCtaOrigen._store._array[i].Codigo) {
                accountSelected = lisCtaOrigen._store._array[i];
                i = lisCtaOrigen._store._array.length;
            }
        }
        if (!accountSelected) {
            showWarningMessage('Banca Móvil', CORE_MESSAGE('SelectOriginAccount'), function () {
                $('#popupSeleccionCuenta').dxPopup('option', 'visible', true);
            });
            return;
        }

        if (+accountSelected.SaldoDisponible < +cargaSaldoAkisi.monto) {
            showWarningMessage('Banca Móvil', "El monto ingresado supera el monto disponible en la cuenta.", function () {
                $('#popupSeleccionCuenta').dxPopup('option', 'visible', true);
            });
            return;
        }

        AfectacionBilleteraElectronica(accountSelected.Codigo, cargaSaldoAkisi.moneda, cargaSaldoAkisi.monto, cargaSaldoAkisi.numeroTelefono, function (afectResult) {
            cargaSaldoAkisi.afectacionResult = afectResult;
            cargaSaldoAkisi.accountSelected = accountSelected;
            cargaSaldoAkisi.ctaMostrar = accountSelected.Codigo;
            ObtenerCuentasCliente(SesionMovil.ContextoCliente, function (data) {
                SesionMovil.PosicionConsolidada.CuentasCliente = data
                sessionStorage.setItem('', '');
                sessionStorage.setItem('FechaActividadApp', new Date());
                MobileBanking_App.app.navigate('ExitosoCargaSaldoAkisi/' + JSON.stringify(cargaSaldoAkisi), { root: true });
            });
        });
    }

    function cancelar(e) {
        MobileBanking_App.app.navigate('PosicionConsolidada', { root: true });
    }

    return viewModel;
};