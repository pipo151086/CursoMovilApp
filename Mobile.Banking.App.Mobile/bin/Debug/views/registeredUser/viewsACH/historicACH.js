MobileBanking_App.historicACH = function (params) {
    "use strict";

    //traer las cuentas de la pocision consolidada
    var cuentas = SesionMovil.PosicionConsolidada.CuentasCliente;


    //****************************cargar y filtrar los datos del combo**************************

    //filtrar las cuentas para que extraiga solo las GTQ
    var ctasQueriable = jslinq(cuentas);



    //var filtradas = ctasQueriable.where(function (el) {
    //    return el.Moneda == 'GTQ';
    //}).toList();



    var arrayCtaOrigen = [];



    const TipocuentaMostrar = {
        AHORRO: tipoCuentaACH[0].TipoCta,
        CREDITO: tipoCuentaACH[1].TipoCta,
        CORRIENTE: tipoCuentaACH[2].TipoCta,
        TARJETA: tipoCuentaACH[3].TipoCta

    }

    arrayCtaOrigen = $.map(ctasQueriable.toList(), function (item, index) {
        //return { Codigo: item.Codigo, Descripcion: item.Codigo.inputChar('-', item.Codigo.length - 1) + ' (' + item.Moneda + Number(item.SaldoDisponible).formatMoney(2, '.', ',') + ') ', SaldoDisponible: item.SaldoDisponible, SaldoDisponible: item.SaldoDisponible, SymbolMoneda: ((item.Moneda === 'GTQ') ? 'Q' : '$ ') }
        return { Codigo: item.Codigo, Descripcion: item.Codigo.inputChar('-', item.Codigo.length - 1) + ' (' + item.Moneda + item.SaldoDisponible + ') ', SaldoDisponible: item.SaldoDisponible, SaldoDisponible: item.SaldoDisponible, SymbolMoneda: ((item.Moneda === 'GTQ') ? 'Q' : '$') }
    });

    var lisCtaOrigen = new DevExpress.data.DataSource({
        store: {
            type: "array",
            key: "Codigo",
            data: arrayCtaOrigen
        }

    });
    //************************************************************************************************
    var movimientosCuenta = [];
    var accountSelected = arrayCtaOrigen[0];

    //carga de entidades financieras
    var entidadesFinancieras = EntidadesFinancierasACH;
    var ctasQueriable = jslinq(entidadesFinancieras);

    var lastMoveModel = {
        FechaDesde: ko.observable(undefined),
        FechaHasta: ko.observable(undefined)
    }

    var viewModel = {
        viewShown: function () {
            try {
                //setupFloatButton(classButtons.Cancel, cancelar, undefined, sizeFloatButtons.small, typeFloatButtons.white);
                setupFloatButton(classButtons.Accept, ok, undefined, undefined, undefined, undefined);
                $('#lstMovimientos').dxList('option', 'noDataText', 'Sin transferencias en estas fechas.')
                clearControls();
                $('#dtFechaDesde').dxDateBox('option', 'popupPosition.offset.v', -123)
                $('#dtFechaHasta').dxDateBox('option', 'popupPosition.offset.v', -123)

                //cambio certificacion
                var fechaHasta = new Date();
                var fechaDesde = new Date();
                fechaDesde.setDate(fechaHasta.getDate() - 30);
                ConsultaHistoricoTransferenciaACH(accountSelected.Codigo, fechaDesde, fechaHasta, function (data) {
                    movimientosCuenta = data;

                    movimientosCuenta.sort(function (a, b) {
                        return new Date(b.Fecha) - new Date(a.Fecha);
                    });


                    $('#lstMovimientos').dxList('option', 'dataSource', movimientosCuenta);
                });

                //fin cambio



            } catch (e) {

                showException(e.message, e.stack);
            }

        },
        viewShowing: function () {
            hideFloatButtons();
        },
        btnCambiarCuenta: setupButtonControl(lisCtaOrigen._store._array[0].Descripcion, changeAccount, undefined, undefined, iconosCore.chevron_down, undefined, true),
        popupSeleccionCuenta: setupPopup(false, '90%', 'auto', true, 'Cuenta', true),
        rdbCuentas: setupRadioGroup(lisCtaOrigen._store._array[0].Codigo, lisCtaOrigen, 'Descripcion', 'Codigo', function (itemData, itemIndex, itemElement) {
            var content = "<div>";
            content = content + "<span>" + itemData.Codigo.inputChar('-', itemData.Codigo.length - 1) + " (" + itemData.SymbolMoneda + " " + Number(itemData.SaldoDisponible).formatMoney(2, '.', ',') + ")</span>";
            content = content + "</div>";
            return content;
        }),
        btnCancelarCuenta: setupButtonControlDefault(classButtons.Cancel, cancelAccount),
        dtFechaDesde: setupDateControl(lastMoveModel.FechaDesde, new Date().addDate(dateParts.Months, -12), new Date(), 'auto'),
        dtFechaHasta: setupDateControl(lastMoveModel.FechaHasta, new Date().addDate(dateParts.Months, -12), new Date(), 'auto'),
        lstMovimientos: setupListBox(movimientosCuenta, modeSelection.None, false, 'auto', function (itemData, itemIndex, itemElement) {
            try {
                var moneySymbol = (itemData.Moneda === 'GTQ') ? 'Q ' : '$ ';

                var ctaFinanciera = ctasQueriable.firstOrDefault(function (el) {
                    return el.DFI == itemData.CodigoEntidadFinancieraDestino;
                });

                var ctaMostrar = null;
                //var ctaMostrar = itemData.TipoCuentaDestino  mapear todas las cuentas

                switch (itemData.TipoCuentaDestino) {
                    case TipocuentaMostrar.AHORRO:
                        ctaMostrar = 'AHORRO'
                        break;
                    case TipocuentaMostrar.CORRIENTE:
                        ctaMostrar = 'CORRIENTE'
                        break;
                    case TipocuentaMostrar.TARJETA:
                        ctaMostrar = 'TARJETA CRÉDITO'
                        break;
                    default:
                        ctaMostrar = "CRÉDITO"
                        break;

                };
                //EstadoTransferencia
                var fecha = new Date(itemData.Fecha).toString("dd/MM/yyyy HH:mm");
                var str = itemData.NumeroReferencia.toString();
                var truncatedComprobante = (str.length > 8) ? str.substr(0, 8 - 1) + '&hellip;' : str;
                var truncatedDescripcion = (itemData.Descripcion.length > 25) ? itemData.Descripcion.substr(0, 25 - 1) + '&hellip;' : itemData.Descripcion;

                var content = '<div style="padding: 10px;">'
                content += '<div><div  style="width:65%;display: inline-block; "><span style="color: #d52133;font-weight: 700;">Fecha: </span><span>' + fecha + '</span> </div>' + '<div  style="width:35%; display: inline-block; text-align: right;">' + '<span style ="font-style: italic">' + itemData.EstadoTransferencia + '</span>' + '</div></div>'
                content += '<div><span style="color: #d52133;font-weight: 700;">Beneficiario: </span><span>' + itemData.NombreBeneficiario.toString(ConstantsBehaivor.PATTERN_SHORTDATE) + ' </span></div>'
                content += '<div><span style="color: #d52133;font-weight: 700;">Monto: </span><span>' + moneySymbol + Number(itemData.Monto).formatMoney(2, '.', ',') + ' </span></div>'
                content += '<div><span style="color: #d52133;font-weight: 700;">Descripción: </span><span>' + truncatedDescripcion + ' </span></div>'
                content += '<div><span style="color: #d52133;font-weight: 700;">No. Comprobante: </span><span>' + itemData.NumeroReferencia.toString() + ' </span></div>'
                content += '<div><span style="color: #d52133;font-weight: 700;">Cuenta: </span><span>' + itemData.CuentaDestino + ' </span> </div>'
                content += '<div><span style="color: #d52133;font-weight: 700;">Tipo Cuenta: </span><span>' + ctaMostrar + ' </span></div>'
                content += '<div><span style="color: #d52133;font-weight: 700;">Banco: </span><span>' + ctaFinanciera.Descripcion + ' </span></div>'
                if (itemData.EstadoTransferencia === "DEVUELTA") {
                    let motivoMostrar = (itemData.MotivoDevolucion && itemData.MotivoDevolucion != "") ? itemData.MotivoDevolucion : "N/A"
                    content += '<div><span style="color: #d52133;font-weight: 700;">Motivo: </span><span>' + motivoMostrar + ' </span></div>'
                }



                content += '</div>'

                return content;

            } catch (e) {

                showException(e.message, e.stack);
            }

        })
    };


    //functions
    function changeAccount() {
        changePropertyControl('#popupSeleccionCuenta', typeControl.Popup, 'visible', true);
    }

    function cancelAccount() {
        changePropertyControl('#popupSeleccionCuenta', typeControl.Popup, 'visible', false);
    }


    function ok() {
        MobileBanking_App.app.navigate('PosicionConsolidada', { root: true });
    }

    function clearControls() {
        try {
            $('#rdbCuentas').dxRadioGroup('option', 'value', undefined);
            $('#dtFechaDesde').dxDateBox('option', 'value', undefined);
            $('#dtFechaHasta').dxDateBox('option', 'value', undefined);
            changePropertyControl('#btnCambiarCuentaOrigen', typeControl.Button, 'text', lisCtaOrigen._store._array[0].Descripcion);
            accountSelected = arrayCtaOrigen[0];
        } catch (e) {
            showException(e.message, e.stack);
        }

    }

    //view Model
    viewModel.popupSeleccionCuenta.onShown = function () {
        $('#floatButtons').hide();
    }
    viewModel.popupSeleccionCuenta.onHidden = function () {
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
            // changePropertyControl('#btnCambiarCuenta', typeControl.Button, 'text', accountSelected.Codigo.inputChar('-', accountSelected.Codigo.length - 1) + ' (' + accountSelected.SymbolMoneda + Number(accountSelected.SaldoDisponible).formatMoney(2, '.', ',') + ")");

            changePropertyControl('#btnCambiarCuenta', typeControl.Button, 'text', accountSelected.Codigo.inputChar('-', accountSelected.Codigo.length - 1) + ' (' + accountSelected.SymbolMoneda + Number(accountSelected.SaldoDisponible).formatMoney(2, '.', ',') + ")");
            changePropertyControl('#popupSeleccionCuenta', typeControl.Popup, 'visible', false);
            $('#currSymbol').text(accountSelected.SymbolMoneda)

        }
    }



    viewModel.dtFechaDesde.onValueChanged = function (e) {
        try {
            var fechaDesde = e.value;
            changePropertyControl('#dtFechaHasta', typeControl.DateBox, 'min', fechaDesde);
            changePropertyControl('#dtFechaHasta', typeControl.DateBox, 'max', fechaDesde.addDate(dateParts.Days, 30));
            changePropertyControl('#dtFechaHasta', typeControl.DateBox, 'value', undefined);

        } catch (e) {

            showException(e.message, e.stack, JSON.stringify(e));
        }
    }
    viewModel.dtFechaHasta.onValueChanged = function (e) {
        try {
            if (e.value) {
                var fechaHasta = e.value;
                var fechaDesde = $('#dtFechaDesde').dxDateBox('option', 'value');
                if (!fechaHasta)
                    changePropertyControl('#dtFechaDesde', typeControl.DateBox, 'max', new Date());
                else
                    changePropertyControl('#dtFechaDesde', typeControl.DateBox, 'max', fechaHasta);
                if (fechaDesde && fechaHasta) {
                    var fechaHasta = e.value;
                    var fechaDesde = $('#dtFechaDesde').dxDateBox('option', 'value');
                    var dias = Date.parse(fechaDesde).compareTo(Date.parse(fechaHasta))
                    if (dias <= 30) {
                        ConsultaHistoricoTransferenciaACH(accountSelected.Codigo, fechaDesde, fechaHasta, function (data) {
                            movimientosCuenta = data;


                            movimientosCuenta.sort(function (a, b) {
                                return new Date(b.Fecha) - new Date(a.Fecha);
                            });


                            $('#lstMovimientos').dxList('option', 'dataSource', movimientosCuenta);
                        });

                    } else {
                        showSimpleMessage('Cuentas Cliente', 'Fecha fuera de rango (30 días)');
                    }
                }
            }
        } catch (e) {

            showException(e.message, e.stack);
        }

    }

    return viewModel;
};