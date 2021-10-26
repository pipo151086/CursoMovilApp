MobileBanking_App.EGGSAPagarServicio = function (params) {
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

    var nContador = currentPayment.respSaldo.IdentificadorPersonal;
    var ncorrelativo = currentPayment.respSaldo.Identificador;


    var groupValidation = 'validacionCorreo';
    var viewModel = {
        txtTipoBusqueda: ko.observable(currentPayment.infoPago.tipoMostrar.Valor),
        txtNumeroTelefono: ko.observable(currentPayment.numeroCuenta),
        txtFactura: ko.observable((currentPayment.infoPago.tipoBusqueda === "01") ? currentPayment.respSaldo.Documento : currentPayment.respSaldo.Factura),
        txtFechaFactura: ko.observable(getDateFormat(new Date(currentPayment.respSaldo.FechaPago).toString("dd/MM/yyyy"))),


        txtNombre: ko.observable(currentPayment.respSaldo.Nombre),
        txtDireccion: ko.observable(currentPayment.respSaldo.Direccion),

        txtSaldo: ko.observable(!currentPayment.respSaldo.Saldo ? "Q 0.00" : "Q " + (+ Number(currentPayment.respSaldo.Saldo).formatMoney(2, '.', ','))),
        txtCargos: ko.observable(!currentPayment.respSaldo.Cargos ? "Q 0.00" : "Q " + (+ Number(currentPayment.respSaldo.Cargos).formatMoney(2, '.', ','))),

        txtMontoPagar: ko.observable("Q " + (+ Number(currentPayment.respSaldo.Saldo).formatMoney(2, '.', ','))),

        txtDoc2: ko.observable((currentPayment.infoPago.tipoDocumento.Codigo === "1") ? ncorrelativo : nContador),


        txtCorreoFactura: setupEmailControl(SesionMovil.ControlAccesoGlobal.CorreoElectronicoRegistrado, undefined, undefined),
        groupValidation: groupValidation,




        viewShown: function () {
            setupFloatButton(classButtons.Accept, pagarServicio, undefined, undefined, undefined, undefined, undefined);
            setupFloatButton(classButtons.Cancel, cancelar, undefined, sizeFloatButtons.small, typeFloatButtons.white);
            if (currentPayment.infoPago.tipoMostrar.Codigo === '01')
                $('.esFactura').show();
            else
                $('.esFactura').hide();
            accountSelected = lisCtaOrigen._store._array[0];


            $('#tipoDoc').text(currentPayment.infoPago.tipoDocumento.Valor)



            if (currentPayment.infoPago.tipoDocumento.Codigo === "1") {

                $('#tipoDoc2').text("No. De Correlativo");
                //txtDoc2: ko.observable(ncorrelativo);
            } else {
                $('#tipoDoc2').text("No. Contador");
                //txtDoc2: ko.observable(nContador);
            }


        },
        viewShowing: function () {
            hideFloatButtons();
        },
        popupSeleccionCuenta: setupPopup(false, '90%', 'auto', true, 'Cuenta Origen', true),
        rdbCuentas: setupRadioGroup(lisCtaOrigen._store._array[0].Codigo, lisCtaOrigen, 'Descripcion', 'Codigo', function (itemData, itemIndex, itemElement) {
            var content = "<div>";
            content = content + "<span>" + "(" + itemData.SymbolMoneda + Number(itemData.SaldoDisponible).formatMoney(2, '.', ',') + ") " + itemData.Codigo.inputChar('-', itemData.Codigo.length - 1) + "</span>";
            content = content + "</div>";
            return content;
        }),
        btnCancelarCuenta: setupButtonControlDefault(classButtons.Cancel, cancelAccount),
        btnCambiarCuenta: setupButtonControl(lisCtaOrigen._store._array[0].Descripcion, changeAccount, undefined, undefined, iconosCore.chevron_down, undefined, true),
    };



    var pagarServicio = function (args) {



        var nombrePago = currentPayment.respSaldo.Nombre
        var direccionPago = currentPayment.respSaldo.Direccion
        var cargoPago = currentPayment.respSaldo.Cargos
        var saldoPago = ''
        var producto = currentPayment.respSaldo.IdentificadorPersonal

        var isValid = DevExpress.validationEngine.validateGroup(groupValidation).isValid;

        if (isValid == true) {


            if (currentPayment.infoPago.tipoBusqueda === "01") {

                var requerimiento = {

                    Comercio: currentPayment.tipoComercio,
                    Documento: currentPayment.respSaldo.Documento,
                    TipoCuenta: "0",
                    NumeroCuenta: currentPayment.respSaldo.Identificador,
                    Reintento: "0",
                    CodigoProducto: currentPayment.infoPago.tipoBusqueda
                }

            } else {
                var requerimiento = {

                    Comercio: currentPayment.tipoComercio,
                    Documento: currentPayment.respSaldo.Factura,
                    TipoCuenta: "0",
                    NumeroCuenta: currentPayment.respSaldo.Documento,
                    Reintento: "0",
                    CodigoProducto: currentPayment.infoPago.tipoBusqueda
                }

            }

            var atribPago = ""

            if (currentPayment.infoPago.tipoBusqueda === "01") {
                atribPago = "ATRFACEEGSA"
            } else {
                atribPago = "ATRRECEEGSA"
            }

            var correoComprobante = $('#txtCorreoFactura').dxTextBox('option', 'value');
            RealizarPagoServicios(accountSelected.Moneda,
                accountSelected.Codigo,
                currentPayment.respSaldo.Saldo,
                atribPago,
                requerimiento,
                correoComprobante,
                nombrePago,
                direccionPago,
                cargoPago,
                saldoPago,
                producto, function (respPago) {
                    //var respPago;
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
        });


        var uri = MobileBanking_App.app.router.format({
            view: 'EEGSAExitoso',
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
            changePropertyControl('#btnCambiarCuenta', typeControl.Button, 'text', '(' + accountSelected.SymbolMoneda + Number(accountSelected.SaldoDisponible).formatMoney(2, '.', ',') + ") " + accountSelected.Codigo.inputChar('-', accountSelected.Codigo.length - 1));
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
            changePropertyControl('#btnCambiarCuenta', typeControl.Button, 'text', ' (' + accountSelected.SymbolMoneda + Number(accountSelected.SaldoDisponible).formatMoney(2, '.', ',') + ") " + accountSelected.Codigo.inputChar('-', accountSelected.Codigo.length - 1));
            changePropertyControl('#popupSeleccionCuenta', typeControl.Popup, 'visible', false);

        }
    }
    var cancelar = function (args) {
        MobileBanking_App.app.navigate('TipoServicio', { root: true });
    }
    return viewModel;
};