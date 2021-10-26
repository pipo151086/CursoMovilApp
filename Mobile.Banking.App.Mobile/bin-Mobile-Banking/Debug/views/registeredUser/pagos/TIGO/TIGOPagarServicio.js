MobileBanking_App.TIGOPagarServicio = function (params) {
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
        var monedaSymbol = ((item.Moneda === 'GTQ') ? 'Q' : '$');
        return { Codigo: item.Codigo, Descripcion: '(' + monedaSymbol + Number(item.SaldoDisponible).formatMoney(2, '.', ',') + ') ' + item.Codigo.inputChar('-', item.Codigo.length - 1), SaldoDisponible: item.SaldoDisponible, SaldoDisponible: item.SaldoDisponible, SymbolMoneda: monedaSymbol, Moneda: item.Moneda }
    });

    var lisCtaOrigen = new DevExpress.data.DataSource({
        store: {
            type: "array",
            key: "Codigo",
            data: arrayCtaOrigen
        }
    });

    var groupValidation = 'validacionCorreo';
    var viewModel = {
        txtNumeroTelefono: ko.observable(currentPayment.numeroCuenta.inputChar('-', currentPayment.numeroCuenta.length - 1)),
        txtTitular: ko.observable(currentPayment.respSaldo.Nombre),
        txtFactura: ko.observable(currentPayment.respSaldo.Documento),
        txtFechaFactura: ko.observable(getDateFormat(new Date(currentPayment.respSaldo.FechaPago).toString("dd/MM/yyyy"))),
        txtNombre: ko.observable(currentPayment.infoPago.nombre),
        txtNit: ko.observable(currentPayment.infoPago.nit),
        txtCorreo: ko.observable((currentPayment.infoPago.correo.length > 30) ? currentPayment.infoPago.correo.substr(0, 30 - 1) + '...' : currentPayment.infoPago.correo),
        txtMontoPagar: ko.observable("Q " + (+ Number(currentPayment.respSaldo.Saldo).formatMoney(2, '.', ','))),

        txtCorreoFactura: setupEmailControl(SesionMovil.ControlAccesoGlobal.CorreoElectronicoRegistrado, undefined, undefined),
        groupValidation: groupValidation,

        viewShown: function () {
            setupFloatButton(classButtons.Accept, pagarServicio, undefined, undefined, undefined, undefined, undefined);
            setupFloatButton(classButtons.Cancel, cancelar, undefined, sizeFloatButtons.small, typeFloatButtons.white);
            if (currentPayment.tipoComercio === tipoServicioBasicoStr.TIGO_PREPAGO) {
                $('.esPrePago').show();
                $('.esPostPago').hide();
            } else {
                $('.esPrePago').hide();
                $('.esPostPago').show();
            }
            accountSelected = lisCtaOrigen._store._array[0];
        },
        viewShowing: function () {
            hideFloatButtons();
        },
        popupSeleccionCuenta: setupPopup(false, '90%', 'auto', true, 'Cuenta Origen', true),
        rdbCuentas: setupRadioGroup(lisCtaOrigen._store._array[0].Codigo, lisCtaOrigen, 'Descripcion', 'Codigo', function (itemData, itemIndex, itemElement) {
            var content = "<div>";
            content = content + "<span>" + itemData.Codigo.inputChar('-', itemData.Codigo.length - 1) + " (" + itemData.SymbolMoneda + Number(itemData.SaldoDisponible).formatMoney(2, '.', ',') + ")</span>";
            content = content + "</div>";
            return content;
        }),
        btnCancelarCuenta: setupButtonControlDefault(classButtons.Cancel, cancelAccount),
        btnCambiarCuenta: setupButtonControl(lisCtaOrigen._store._array[0].Descripcion, changeAccount, undefined, undefined, iconosCore.chevron_down, undefined, true),
    };

    var pagarServicio = function (args) {


        var nombrePago = ''
        var direccionPago = ''
        var cargoPago = ''
        var saldoPago = ''
        var producto = ''

        var isValid = DevExpress.validationEngine.validateGroup(groupValidation).isValid;

        if (isValid == true) {

            var requerimiento =
            {
                Comercio: currentPayment.tipoComercio,
                TipoCuenta: currentPayment.infoPago.tipoBusqueda,
                NumeroCuenta: currentPayment.numeroCuenta,
                NombreCliente: currentPayment.infoPago.nombre,
                NIT: currentPayment.infoPago.nit,
                CorreoElectronico: currentPayment.infoPago.correo,
                CodigoProducto: "01",
                Monto: (currentPayment.infoPago.tipoBusqueda === '1') ?
                    +currentPayment.infoPago.montoMostrar.Valor :
                    +currentPayment.respSaldo.Saldo,
            };

            var atribPago = ""

            if (currentPayment.infoPago.tipoBusqueda === "0") {
                atribPago = "ATRTIGOPOSTPAGO"
            } else {
                atribPago = "ATRTIGOPREPAGO"

            }

            var correoComprobante = $('#txtCorreoFactura').dxTextBox('option', 'value');


            //RealizarPagoServicios(ctaMoneda, numeroCuenta, monto, codigoAtributo, requerimiento, addFunction)
            RealizarPagoServicios(accountSelected.Moneda,
                accountSelected.Codigo,
                requerimiento.Monto,
                atribPago,
                requerimiento,
                correoComprobante,
                nombrePago,
                direccionPago,
                cargoPago,
                saldoPago,
                producto, function (respPago) {
                    currentPayment.respPago = !respPago ? {
                        RespuestaGenerarDebitoWeb: 'Secuencial', RespuestaPronet: { cualquierProp: "" }
                    } :
                        respPago
                        ;
                    currentPayment.accountSelected = accountSelected;
                    RedirectOnSuccess(currentPayment);
                });
        }
    }

    function RedirectOnSuccess(currentPayment) {


        ObtenerCuentasCliente(SesionMovil.ContextoCliente, function (data) {
            SesionMovil.PosicionConsolidada.CuentasCliente = data
            sessionStorage.setItem('', '');
            sessionStorage.setItem('FechaActividadApp', new Date());
            //MobileBanking_App.app.navigate(uri, { root: true });
        });

        var uri = MobileBanking_App.app.router.format({
            view: 'TIGOExitoso',
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
            changePropertyControl('#btnCambiarCuenta', typeControl.Button, 'text', "(" + accountSelected.SymbolMoneda + Number(accountSelected.SaldoDisponible).formatMoney(2, '.', ',') + ") " + accountSelected.Codigo.inputChar('-', accountSelected.Codigo.length - 1));
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
            changePropertyControl('#btnCambiarCuenta', typeControl.Button, 'text', "(" + accountSelected.SymbolMoneda + Number(accountSelected.SaldoDisponible).formatMoney(2, '.', ',') + ") " + accountSelected.Codigo.inputChar('-', accountSelected.Codigo.length - 1));
            changePropertyControl('#popupSeleccionCuenta', typeControl.Popup, 'visible', false);

        }
    }
    var cancelar = function (args) {
        MobileBanking_App.app.navigate('TipoServicio', { root: true });
    }
    return viewModel;
};