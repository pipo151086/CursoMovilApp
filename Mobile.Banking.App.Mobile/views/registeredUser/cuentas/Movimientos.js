MobileBanking_App.Movimientos = function (params) {
    "use strict";

    var datosCuenta = null;
    var movimientosCuenta = [];
    var accountMoves;
    var subtituloMovimientos = '';
    if (params.id)
        datosCuenta = JSON.parse(params.id);

    var MoveAccountSeries = [
        { valueField: 'Saldo', name: 'Saldo Actual' },
    ]

    var AASelected;
    var MMSelected;
    var Anios = getAniosSince(1995);
    
    var viewModel = {
        viewShown: function () {
            try {
                SesionMovil.FechaActividadApp = new Date();
                $('#lkpCuentas').dxLookup('option', 'value', datosCuenta ? datosCuenta.Codigo : SesionMovil.PosicionConsolidada.CuentasCliente[0].Codigo);
                $('#lkpCuentas').dxLookup('option', 'fieldTemplate', function (itemData, itemIndex, itemElement) {
                    if (itemData) {
                        var content = "<div style='color: #d52133; font-style: italic'>";
                        content = content + "<span>-" + itemData.Codigo + "-</span>";
                        content = content + "</div>";
                        return content;

                    }
                });
            } catch (e) {
                showException(e.message, e.stack);
            }

        },
        viewShowing: function () {
            hideFloatButtons();
        },
        txtCuenta: setupTextBoxControl(datosCuenta ? datosCuenta.Codigo : SesionMovil.PosicionConsolidada.CuentasCliente[0].Codigo, 16, '', stateControl.readOnly),
        crtMovimientosCuenta: setupChartLine(movimientosCuenta, 'FechaMovimiento', MoveAccountSeries, 'Últimos Movimientos', subtituloMovimientos, 350),
        TipoCuenta: datosCuenta ? datosCuenta.Tipo : '',
        NumeroCuenta: datosCuenta ? datosCuenta.Codigo : '',
        SaldoDisponible: datosCuenta ? datosCuenta.SaldoDisponible : 0,
        SaldoContable: datosCuenta ? datosCuenta.SaldoContable : 0,

        lkpCuentas: setupLookupControl(undefined, SesionMovil.PosicionConsolidada.CuentasCliente, 'Codigo', 'Codigo', false, 'instantly', undefined, function (itemData, itemIndex, itemElement) {
            try {
                var content = "<div style='margin-left:20px; font-size:18px; color: #d52133'>";
                content = content + "<img style='display:inline-block; margin-right:10px; width:20px; height:24px' src='images/CTA.png' ></img>";
                content = content + "<span style='display:inline-block'>" + itemData.Codigo.inputChar('-', itemData.Codigo.length - 1) + "</span>";
                content = content + "</div>";
                return content;
            } catch (e) {
                showException(e.message, e.stack);
            }

        }, 'Cuentas'),
        lstMovimientos: setupListBox(movimientosCuenta, modeSelection.None, false, 'auto', function (itemData, itemIndex, itemElement) {
            try {
                var fechaMov;
                if (itemData.FechaMovimiento.contains('/')) {
                    fechaMov = Date.parse(itemData.FechaMovimiento);
                }
                else {
                    fechaMov = Date.parse(itemData.FechaMovimiento + 'T00:00:00');
                }
                var data = {
                    Descripcion: itemData.Movimiento,
                    Fecha: fechaMov.toString(ConstantsBehaivor.PATTERN_SHORTDATE),
                    Signo: itemData.Signo,
                    Oficina: itemData.Oficina,
                    ValorParcial: Number(itemData.Monto).formatMoney(2, '.', ','),
                    ValorTotal: ((datosCuenta.Moneda === 'GTQ') ? 'Q ' : '$ ') + Number(itemData.Saldo).formatMoney(2, '.', ',') + " / " + ((datosCuenta.Moneda === 'GTQ') ? 'Q ' : '$ ') + Number(itemData.SaldoContable).formatMoney(2, '.', ','),
                    Moneda: (datosCuenta.Moneda === 'GTQ') ? 'Q ' : '$ '
                }
                return getStyleListMovements(data);
            } catch (e) {
                showException(e.message, e.stack);
            }

        }),


        //---------------------------------------------------------
        btnCambiarMM: setupButtonControl('Mes', changeMM, undefined, undefined, iconosCore.chevron_down, undefined, true),
        popupSeleccionMM: setupPopup(false, '70%', 'auto', true, 'Mes', true),
        rdbMM: setupRadioGroup(undefined, mesesAnio, 'Texto', 'Numero'),
        btnCancelarMM: setupButtonControlDefault(classButtons.Cancel, cancelMM),
        //---------------------------------------------------------
        btnCambiarAA: setupButtonControl('Año', changeAA, undefined, undefined, iconosCore.chevron_down, undefined, true),
        popupSeleccionAA: setupPopup(false, '70%', '100%', true, 'Año', true),
        rdbAA: setupRadioGroup(undefined, Anios, 'Anio', 'IdAnio'),
        btnCancelarAA: setupButtonControlDefault(classButtons.Cancel, cancelAA),
        //---------------------------------------------------------

        btnMail: function () { ConsultarMovimientos(true); }
    };

    viewModel.popupSeleccionMM.onShown = function () {
        $('#header-fixed').hide();
    }

    viewModel.popupSeleccionMM.onHidden = function () {
        $('#header-fixed').show();
    }

    viewModel.popupSeleccionAA.onShown = function () {
        $('#header-fixed').hide();
    }
 
    viewModel.popupSeleccionAA.onHidden = function () {
        $('#header-fixed').show();
    }
       

    function changeAA() {
        changePropertyControl('#popupSeleccionAA', typeControl.Popup, 'visible', true);
    }
    function cancelAA() {
        changePropertyControl('#popupSeleccionAA', typeControl.Popup, 'visible', false);
    }
    viewModel.rdbAA.onValueChanged = function (e) {
        var select = e.value;
        if (select) {
            for (var i = 0; i < Anios.length; i++) {
                if (select == Anios[i].IdAnio) {
                    AASelected = Anios[i];
                    i = Anios.length;
                }
            }
            if (AASelected) {
                changePropertyControl('#btnCambiarAA', typeControl.Button, 'text', AASelected.Anio);
                changePropertyControl('#popupSeleccionAA', typeControl.Popup, 'visible', false);
                if (MMSelected)
                    ConsultarMovimientos(false);
            }
        }
    }



    //----------------------------------------------------------------------
    //----------------------------------------------------------------------

    viewModel.rdbMM.onValueChanged = function (e) {
        var select = e.value;
        if (select) {
            for (var i = 0; i < mesesAnio.length; i++) {
                if (select == mesesAnio[i].Numero) {
                    MMSelected = mesesAnio[i];
                    i = mesesAnio.length;
                }
            }
            if (MMSelected) {
                changePropertyControl('#btnCambiarMM', typeControl.Button, 'text', MMSelected.Texto);
                changePropertyControl('#popupSeleccionMM', typeControl.Popup, 'visible', false);
                if (AASelected)
                    ConsultarMovimientos(false);
            }
        }
    }
    function changeMM() {
        changePropertyControl('#popupSeleccionMM', typeControl.Popup, 'visible', true);
    }
    function cancelMM() {
        changePropertyControl('#popupSeleccionMM', typeControl.Popup, 'visible', false);
    }

    viewModel.lkpCuentas.onSelectionChanged = function (e) {
        datosCuenta = e.selectedItem;
        $('#rdbMM').dxRadioGroup('option', 'value', undefined);
        $('#rdbAA').dxRadioGroup('option', 'value', undefined);
        AASelected = undefined;
        MMSelected = undefined;
        $('#btnCambiarAA').dxButton('option', 'text', 'Año');
        $('#btnCambiarMM').dxButton('option', 'text', 'Mes');

        if (datosCuenta && datosCuenta != null) {
            ConsultaMovimientos(datosCuenta.Codigo, function (data) {
                try {
                    movimientosCuenta = data;
                    var nuevosMov = [];
                    var MonedaSimbolo = ((datosCuenta.Moneda === 'GTQ') ? 'Q' : '$')
                    for (var i = 0; i < movimientosCuenta.length; i++) {
                        var mov = movimientosCuenta[i];
                        mov.Moneda = MonedaSimbolo;
                        mov.SaldoMostrar = MonedaSimbolo + ' ' + Number(movimientosCuenta[i].Saldo).formatMoney(2, '.', ',');
                        $.extend(mov, { FechaMovimientoD: Date.parse(movimientosCuenta[i].FechaMovimiento + 'T00:00:00') })
                        nuevosMov.push(mov);
                    }
                    var accountMovesQueryable = jslinq(movimientosCuenta);
                    accountMoves = accountMovesQueryable.orderByDescending(function (el) {
                        return el.IdTransaccion;
                    }).toList();;

                    if (movimientosCuenta.length > 0) {
                        if (datosCuenta.Estado == 'INACTIVA')
                            subtituloMovimientos = 'CUENTA INACTIVA';
                        else {
                            subtituloMovimientos = 'Del '
                                + Date.parse(nuevosMov[0].FechaMovimientoD).toString(ConstantsBehaivor.PATTERN_SHORTDATE) + ' Al '
                                + Date.parse('t').toString(ConstantsBehaivor.PATTERN_SHORTDATE);
                        }

                        $('#datosCuenta').show();
                        $('#movimientosCuenta').show();
                        $('#spnTipoCuenta').text(datosCuenta.Tipo);
                        $('#spnNumeroCuenta').text(datosCuenta.Codigo.inputChar('-', datosCuenta.Codigo.length - 1));
                        $('#spnSaldoDisponible').text(((datosCuenta.Moneda === 'GTQ') ? 'Q ' : '$ ') + Number(datosCuenta.SaldoDisponible).formatMoney(2, '.', ','));
                        $('#spnSaldoContable').text(((datosCuenta.Moneda === 'GTQ') ? 'Q ' : '$ ') + Number(datosCuenta.SaldoContable).formatMoney(2, '.', ','));
                        $('#chartMovimientosCuenta').dxChart('option', 'visible', true);
                        $('#lstMovimientos').dxList('option', 'dataSource', accountMoves);
                        $('#chartMovimientosCuenta').dxChart('option', setupChartLine(nuevosMov, 'FechaMovimiento', MoveAccountSeries, 'Últimos Movimientos', subtituloMovimientos));
                        $('#chartMovimientosCuenta').dxChart('instance').render();

                    } else {
                        showSimpleMessage('Cuentas Cliente', 'La Cuenta no posee movimientos');
                        $('#datosCuenta').hide();
                        $('#movimientosCuenta').hide();
                        $('#chartMovimientosCuenta').dxChart('option', 'visible', false);
                    }
                } catch (e) {
                    showException(e.message, e.stack);
                }
            });
        } else {
            $('#datosCuenta').hide();
            $('#movimientosCuenta').hide();
        }
    }


    function ConsultarMovimientos(envioCorreo) {
        if (AASelected && MMSelected) {
            ConsultaMovimientosAnioMes(datosCuenta.Codigo, AASelected.IdAnio, MMSelected.Numero, datosCuenta.Moneda, envioCorreo ? envioCorreo : false, function (data) {
                movimientosCuenta = data[0].MovimientosCuenta;
                var movimientosQueryable = jslinq(movimientosCuenta ? movimientosCuenta : []);
                movimientosCuenta = movimientosQueryable.orderByDescending(function (el) {
                    return el.IdTransaccion;
                }).toList();;
                changePropertyControl('#lstMovimientos', typeControl.ListBox, 'dataSource', movimientosCuenta);
                if (movimientosCuenta.length <= 0) {
                    let msg = 'La Cuenta no posee movimientos para el año y mes seleccionados';
                    if (envioCorreo === true)
                        msg = msg + ' por lo tanto NO recibiras ningún correo';
                    showSimpleMessage('Cuentas Cliente', msg);
                }
                else {
                    if (envioCorreo === true)
                        showSimpleMessage('Cuentas Cliente', 'Tu estado de cuenta está en camino, revisa tu correo: ' + maskTarjeta(SesionMovil.ControlAccesoGlobal.CorreoElectronicoRegistrado, 2, 12));
                }
            });
        } else {
            if (!AASelected) {
                showSimpleMessage('Cuentas Cliente', 'Primero debes seleccionar el año a consultar', changeAA);
            } else if (!MMSelected) {
                showSimpleMessage('Cuentas Cliente', 'Ahora debes seleccionar el mes a consultar', changeMM);
            };
        }
    }

    return viewModel;
};