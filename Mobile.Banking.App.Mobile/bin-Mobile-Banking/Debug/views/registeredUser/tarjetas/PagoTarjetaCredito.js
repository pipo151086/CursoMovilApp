MobileBanking_App.PagoTarjetaCredito = function (params) {
    "use strict";

    //varables Aplicar A
    var listAplicarA = [
        { descripcion: "Saldo en Quetzales", codMoneda: "GTQ", symbolMoneda: "Q" },
        { descripcion: "Saldo en Dólares", codMoneda: "USD", symbolMoneda: "$" },
    ];

    var listAplicarAEsPropia = [
        { descripcion: "Saldo en Quetzales", codMoneda: "GTQ", symbolMoneda: "Q" },
    ];

    var aplicarASelected = null;
    var accountSelected = null;
    var filtradas = [];
    var creditCardSelected = null;
    var valorQuetzal = null;

    //filtrar las cuentas para q salgan los las de Quetzales
    var arrayCtaOrigen = [];
    var cuentas = SesionMovil.PosicionConsolidada.CuentasCliente;


    if (cuentas) {
        var ctasQueriable = jslinq(cuentas);
        filtradas = ctasQueriable.where(function (el) {
            return el.Moneda == 'GTQ';
        }).toList();
    }

    arrayCtaOrigen = $.map(filtradas, function (item, index) {
        return {
            Codigo: item.Codigo, Descripcion: ' (' + item.Moneda + Number(item.SaldoDisponible).formatMoney(2, '.', ',') + ') ' +
                item.Codigo.inputChar('-', item.Codigo.length - 1), SaldoDisponible: item.SaldoDisponible, SaldoDisponible: item.SaldoDisponible, SymbolMoneda: ((item.Moneda === 'GTQ') ? 'Q' : '$ '), Moneda: item.Moneda

        }
    });
    var lisCtaOrigen = new DevExpress.data.DataSource({
        store: {
            type: "array",
            key: "Codigo",
            data: arrayCtaOrigen
        }
    });

    //Tarjetas Cliente
    var tarjetas = SesionMovil.PosicionConsolidada.TarjetasCliente;
    var listTarjetas = $.map(tarjetas, function (item, index) {
        return {
            NumeroTarjetaMostrar: maskTarjeta(item.NumeroTarjeta, 3, 5),
            NumeroTarjeta: item.NumeroTarjeta,
            MonedaTarjeta: item.Moneda,
            EsPropia: item.EsPropia,
            Marca: item.Marca,
            IdCuentaTarjeta: item.IdCuentaTarjeta
        }
    });

    //observables
    var PagoTarjetaCredito = {
        ValorPagar: ko.observable(),
    }

    //DTOS
    var pagarTarjetaDto = {
        ctaMoneda: "",
        numeroCuenta: "",
        monedaTransaccion: "",
        symbolMonedaTransaccion: "",
        monto: "",
        numeroTarjeta: "",
        tasaDeConversion: "",
        monedaTarjeta: "",
        valorQuetzal: ""
    }

    var groupValidation = 'PAGOTARJETA';


    var arrayTipoPago = [
        { Codigo: 'TRJ', Descripcion: 'TARJETA' }
    ];

    if (lisCtaOrigen._store._array.length > 0) {
        arrayTipoPago = [
            { Codigo: 'CTA', Descripcion: 'CUENTA' },
            { Codigo: 'TRJ', Descripcion: 'TARJETA' }
        ]
    }

    var lisTipoPago = new DevExpress.data.DataSource({
        store: {
            type: "array",
            key: "Codigo",
            data: arrayTipoPago
        }
    });
    var tipoPagoSeleccionado = null;

    var viewModel = {
        rdbTipoPago: setupRadioGroup(lisTipoPago._store._array[0].Codigo, lisTipoPago, 'Descripcion', 'Codigo', function (itemData, itemIndex, itemElement) {
            var content = "<div>";
            content = content + "<span>" + itemData.Descripcion + "</span>";
            content = content + "</div>";
            return content;
        }),

        viewShown: function () {
            try {
                setupFloatButton(classButtons.Cancel, cancelar, undefined, sizeFloatButtons.small, typeFloatButtons.white);
                setupFloatButton(classButtons.Accept, siguiente, undefined, undefined, undefined, undefined, groupValidation);
                $('#rdbAplicarA').dxRadioGroup('option', 'dataSource', listAplicarA);
                clearControls();
                $('#rdbTarjetas').dxRadioGroup('option', 'dataSource', listTarjetas);
                $('#rdbTarjetas').dxRadioGroup('option', 'value', listTarjetas[0]);
                $('#rdbCuentas').dxRadioGroup('option', 'value', lisCtaOrigen._store._array[0]);
                //$('#rdbTipoPago').hide();

                tipoPagoSeleccionado = lisTipoPago._store._array[0];

                if (tipoPagoSeleccionado.Codigo == 'CTA') {
                    $('.pagoCta').show();
                    $('.pagoTrj').hide();
                } else {
                    $('.pagoCta').hide();
                    $('.pagoTrj').show();
                }

            } catch (e) {
                showException(e.message, e.stack);
            }
        },
        viewShowing: function () {
            hideFloatButtons();
        },
        groupValidation: groupValidation,
        //cuentas
        btnCambiarCuenta: setupButtonControl(lisCtaOrigen._store._array.length > 0 ? lisCtaOrigen._store._array[0].Descripcion : "", changeAccount, undefined, undefined, iconosCore.chevron_down, undefined, true),
        btnCancelarCuenta: setupButtonControlDefault(classButtons.Cancel, cancelAccount),
        rdbCuentas: setupRadioGroup(lisCtaOrigen._store._array.length > 0 ? lisCtaOrigen._store._array[0].Codigo : "", lisCtaOrigen, 'Descripcion', 'Codigo', function (itemData, itemIndex, itemElement) {
            var content = "<div>";
            content = content + "<span>" + itemData.Codigo.inputChar('-', itemData.Codigo.length - 1) + " (" + itemData.SymbolMoneda + " " + Number(itemData.SaldoDisponible).formatMoney(2, '.', ',') + ")</span>";
            content = content + "</div>";
            return content;
        }),
        popupSeleccionCuenta: setupPopup(false, '90%', 'auto', true, 'Cuenta Origen', true),

        //aplicar A
        btnAplicarA: setupButtonControl('Seleccione', changeApplyto, undefined, undefined, iconosCore.chevron_down, undefined, true),
        btnCancelarAplicarA: setupButtonControlDefault(classButtons.Cancel, cancelApplyto),
        rdbAplicarA: setupRadioGroup(undefined, [], 'descripcion', 'codMoneda', function (itemData, itemIndex, itemElement) {
            var content = '<div style="text-align: left;">';
            content = content + "<span>" + itemData.descripcion + "</span>";
            content = content + "</div>";
            return content;
        }),
        popupSeleccionAplicarA: setupPopup(false, '90%', 'auto', true, 'Aplicar A', true),
        //tarjetas
        btnCambiarTarjeta: setupButtonControl('Seleccione', changeCreditCard, undefined, undefined, iconosCore.chevron_down, undefined, true),
        cancelCreditCard: setupButtonControlDefault(classButtons.Cancel, cancelCreditCard),
        rdbTarjetas: setupRadioGroup(undefined, [], 'NumeroTarjetaMostrar', 'NumeroTarjeta', function (itemData, itemIndex, itemElement) {
            var content = "<div>";
            content = content + "<span>" + itemData.NumeroTarjetaMostrar + "</span>";
            content = content + "</div>";
            return content;
        }),
        popupSeleccionTarjeta: setupPopup(false, '90%', 'auto', true, 'Tarjetas Cliente', true),

        //monto a pagar
        txtValorPagar: setupNumberBox(PagoTarjetaCredito.ValorPagar, 0.01, 10000, '40%'),
        txtvalorQuetzal: setupTextBoxControl("", 256, undefined, typeLetter.upper, stateControl.readOnly, true, typeCharAllowed.OnlyText),

        txtvalorTrjQuetzal: setupNumberBox(PagoTarjetaCredito.ValorPagar, 0.01, 10000, '40%'),
    };

    viewModel.rdbTipoPago.onValueChanged = function (e) {
        var select = e.value;
        for (var i = 0; i < lisTipoPago._store._array.length; i++) {
            if (select == lisTipoPago._store._array[i].Codigo) {
                tipoPagoSeleccionado = lisTipoPago._store._array[i];
                i = lisTipoPago._store._array.length;
            }
        }
        if (tipoPagoSeleccionado.Codigo == 'CTA') {
            $('.pagoCta').show();
            $('.pagoTrj').hide();
        } else {
            $('.pagoCta').hide();
            $('.pagoTrj').show();
        }
    }

    function selectAplicar(data) {
        aplicarASelected = data;
    }

    function selectCreditCard(data) {
        creditCardSelected = data;
    }

    function clearControls() {
        try {
            changePropertyControl('#btnCambiarCuenta', typeControl.Button, 'text', 'Seleccione');
            changePropertyControl('#btnAplicarA', typeControl.Button, 'text', 'Seleccione');
            changePropertyControl('#txtValorPagar', typeControl.NumberBox, 'value', undefined);
            $('#txtValorPagar').dxNumberBox('instance').focus();
            changePropertyControl('#btnCambiarTarjeta', typeControl.Button, 'text', 'Seleccione');
        } catch (e) {
            showException(e.message, e.stack);
        }

    }
    function changeAccount() {
        changePropertyControl('#popupSeleccionCuenta', typeControl.Popup, 'visible', true);
    }
    function changeCreditCard() {
        changePropertyControl('#popupSeleccionTarjeta', typeControl.Popup, 'visible', true);
    }
    function changeApplyto() {
        changePropertyControl('#popupSeleccionAplicarA', typeControl.Popup, 'visible', true);
    }
    function cancelAccount() {
        changePropertyControl('#popupSeleccionCuenta', typeControl.Popup, 'visible', false);
    }
    function cancelApplyto() {
        changePropertyControl('#popupSeleccionAplicarA', typeControl.Popup, 'visible', false);
    }
    function cancelCreditCard() {
        changePropertyControl('#popupSeleccionTarjeta', typeControl.Popup, 'visible', false);
    }


    //view Model
    viewModel.popupSeleccionCuenta.onShown = function () {
        $('#floatButtons').hide();
    }
    viewModel.popupSeleccionCuenta.onHidden = function () {
        $('#floatButtons').show();
    }
    viewModel.popupSeleccionAplicarA.onShown = function () {
        $('#floatButtons').hide();
    }
    viewModel.popupSeleccionAplicarA.onHidden = function () {
        $('#floatButtons').show();
    }
    viewModel.popupSeleccionTarjeta.onShown = function () {
        $('#floatButtons').hide();
    }
    viewModel.popupSeleccionTarjeta.onHidden = function () {
        $('#floatButtons').show();
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

    viewModel.rdbAplicarA.onValueChanged = function (e) {
        var select = e.value;
        for (var i = 0; i < listAplicarA.length; i++) {
            if (select == listAplicarA[i].codMoneda) {
                aplicarASelected = listAplicarA[i];
                i = listAplicarA.length;
            }
        }

        if (aplicarASelected) {
            changePropertyControl('#btnAplicarA', typeControl.Button, 'text', aplicarASelected.descripcion);
            changePropertyControl('#popupSeleccionAplicarA', typeControl.Popup, 'visible', false);
            $('#currSymbol').text(aplicarASelected.symbolMoneda);
        }

        if (aplicarASelected == null)
            $("#divValorQuetzales").hide();
        else {
            if (aplicarASelected.codMoneda == "GTQ")
                $(".pagoQuetzales").hide();
            else {
                $('#currSymbol2').text("Q")
                $(".pagoQuetzales").show();
            }
        }
        selectAplicar(aplicarASelected);
    }

    viewModel.rdbTarjetas.onValueChanged = function (e) {
        var select = e.value;
        for (var i = 0; i < listTarjetas.length; i++) {
            if (select == listTarjetas[i].NumeroTarjeta) {
                creditCardSelected = listTarjetas[i];
                i = listTarjetas.length;
            }
        }
        if (creditCardSelected) {
            changePropertyControl('#btnCambiarTarjeta', typeControl.Button, 'text', creditCardSelected.NumeroTarjetaMostrar);
            changePropertyControl('#popupSeleccionTarjeta', typeControl.Popup, 'visible', false);
        }

        if (creditCardSelected) {
            selectCreditCard(creditCardSelected);
            if (creditCardSelected.Marca == "TCJ") {
                $('#rdbAplicarA').dxRadioGroup('option', 'dataSource', listAplicarAEsPropia);
                $('#rdbAplicarA').dxRadioGroup('option', 'value', listAplicarAEsPropia[0].codMoneda);
            }
            else {
                $('#rdbAplicarA').dxRadioGroup('option', 'dataSource', listAplicarA);
                $('#rdbAplicarA').dxRadioGroup('option', 'value', listAplicarA[0].codMoneda);
            }
        }
    }



    viewModel.txtValorPagar.onValueChanged = function (e) {
        if (aplicarASelected == null)
            valorQuetzal = null
        else {
            if (aplicarASelected.codMoneda == "GTQ")
                valorQuetzal = null
            else {
                valorQuetzal = $("#txtValorPagar").dxNumberBox('option', 'value')
                valorQuetzal = valorQuetzal * SesionMovil.PosicionConsolidada.TarjetasCliente[0].Cotizacion
                valorQuetzal = Number(valorQuetzal).formatMoney(2, '.', ',')
                $('#txtvalorQuetzal').dxTextBox('option', 'value', valorQuetzal);
            }
        }
    }


    function siguiente(params) {
        try {
            if (!creditCardSelected) {
                showWarningMessage(CORE_TAG('DefaultTitle'), 'Debes Seleccionar una Tarjeta para continuar');
                return;
            }

            if (tipoPagoSeleccionado.Codigo != 'TRJ') {
                var result = params.validationGroup.validate();
                if (result.isValid) {
                    var selectedCuenta = $('#rdbCuentas').dxRadioGroup('option', 'value');

                    for (var i = 0; i < lisCtaOrigen._store._array.length; i++) {
                        if (selectedCuenta == lisCtaOrigen._store._array[i].Codigo) {
                            accountSelected = lisCtaOrigen._store._array[i];
                            i = lisCtaOrigen._store._array.length;
                        }
                    }

                    if (!accountSelected) {
                        showWarningMessage(CORE_TAG('DefaultTitle'), CORE_MESSAGE('SelectOriginAccount'), function () {
                            $('#popupSeleccionCuenta').dxPopup('option', 'visible', true);
                        });
                        return;
                    }

                    if (PagoTarjetaCredito.ValorPagar() > accountSelected.SaldoDisponible) {
                        showWarningMessage(CORE_TAG('DefaultTitle'), CORE_MESSAGE('GreaterAmountPayCreditCard'));
                        return;
                    }
                    if (aplicarASelected.codMoneda === "USD" && valorQuetzal && +valorQuetzal.replace(',', '') <= 0) {
                        showWarningMessage(CORE_TAG('DefaultTitle'), 'Monto convertido a Quetzales inválido');
                        return;
                    }
                    pagarTarjetaDto.esPropia = creditCardSelected.EsPropia;
                    pagarTarjetaDto.idCuentaTarjeta = creditCardSelected.IdCuentaTarjeta;
                    pagarTarjetaDto.ctaMoneda = accountSelected.Moneda;
                    pagarTarjetaDto.numeroCuenta = accountSelected.Codigo;
                    pagarTarjetaDto.monedaTransaccion = aplicarASelected.codMoneda;
                    pagarTarjetaDto.symbolMonedaTransaccion = aplicarASelected.symbolMoneda;
                    pagarTarjetaDto.monto = PagoTarjetaCredito.ValorPagar();
                    pagarTarjetaDto.numeroTarjeta = creditCardSelected.NumeroTarjeta;
                    pagarTarjetaDto.monedaTarjeta = creditCardSelected.MonedaTarjeta;
                    pagarTarjetaDto.valorQuetzal = valorQuetzal;
                    pagarTarjetaDto.marca = creditCardSelected.Marca;
                    MobileBanking_App.app.navigate('ConfirmacionPagoTarjeta/' + JSON.stringify(pagarTarjetaDto), { root: true });
                }
                else
                    showWarningMessage(CORE_TAG('DefaultTitle'), CORE_MESSAGE('MissingData'));

            }
            else {
                var isValid = params.validationGroup.validate().isValid;

                if (aplicarASelected.codMoneda === "USD" && valorQuetzal && +valorQuetzal.replace(',', '') <= 0) {
                    showWarningMessage(CORE_TAG('DefaultTitle'), 'Monto convertido a Quetzales inválido');
                    return;
                }
                if (isValid) {
                    var dtoPagoTarjetaConTarjeta = {
                        esPropia: creditCardSelected.EsPropia,
                        monedaTransaccion: aplicarASelected.codMoneda,
                        symbolMonedaTransaccion: aplicarASelected.symbolMoneda,
                        montoAplicar: PagoTarjetaCredito.ValorPagar(),
                        monto: valorQuetzal ? +valorQuetzal.replace(',', '') : PagoTarjetaCredito.ValorPagar(),
                        TarjPosConsSeleccionado: creditCardSelected,
                        TarjCredConsultado: creditCardSelected,
                        //monto: $('#txtvalorTrjQuetzal').dxNumberBox('option', 'value'),
                        numeroProducto: creditCardSelected.NumeroTarjeta,
                        montoMostrar: ("Q. " + String(Number(valorQuetzal ? +valorQuetzal.replace(',', '') : PagoTarjetaCredito.ValorPagar()).formatMoney(2, '.', ','))),
                        pagoProducto: 1,//Credito = 0 || Tarjeta = 1
                        TitularCuentaOrigenMostrar: SesionMovil.ContextoCliente.NombreCompletoCliente
                    }
                    if (dtoPagoTarjetaConTarjeta.monto === 0) {
                        showSimpleMessage(CORE_TAG('DefaultTitle'), 'No existen cuotas a pagar.', function () { })
                        return;
                    } else
                        MobileBanking_App.app.navigate({ view: 'PagoVisaNet', id: JSON.stringify(dtoPagoTarjetaConTarjeta) }, { root: true });

                }
            }

        } catch (e) {
            showException(e.message, e.stack);
        }
    }

    function cancelar() {
        MobileBanking_App.app.navigate('PosicionConsolidada', { root: true });
    }


    return viewModel;
};