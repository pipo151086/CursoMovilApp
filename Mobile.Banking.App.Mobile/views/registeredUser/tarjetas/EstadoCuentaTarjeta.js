MobileBanking_App.EstadoCuentaTarjeta = function (params) {
    "use strict";

    var datosTarjeta = "";
    if (params.id)
        datosCredito = JSON.parse(params.id);

    if (params.id)
        datosTarjeta = JSON.parse(params.id);
    $.each(SesionMovil.PosicionConsolidada.TarjetasCliente, function (index, item) {
        $.extend(item, { NumeroTarjetaEncript: maskTarjeta(item.NumeroTarjeta, 3, 5) });
    });

    var tarjetas = SesionMovil.PosicionConsolidada.TarjetasCliente;

    var movimientosTarjeta = [];
    var listfechasCorte = []

    var fechaBusqueda = ko.observable(new Date());

    var viewModel = {
        PagoMinimoQTG: ko.observable(),
        PagoContadoQTG: ko.observable(),
        PagoMinimoUSD: ko.observable(),
        PagoContadoUSD: ko.observable(),
        FechaLimite: ko.observable(),
        viewShown: function () {
            $('#lkpTarjetas').dxLookup('option', 'value', datosTarjeta ? datosTarjeta.NumeroTarjeta : SesionMovil.PosicionConsolidada.TarjetasCliente[0].NumeroTarjeta);
            $('#lkpTarjetas').dxLookup('option', 'fieldTemplate', function (itemData, itemIndex, itemElement) {
                var content = "<div style='color: #d52133; font-style: italic'>";
                content = content + "<span>" + itemData.NumeroTarjetaEncript + "</span>";
                content = content + "</div>";
                return content;
            });

            $('#dtFechaBusqueda').dxDateBox('option', 'popupPosition.offset.v', -123)
            $('#tipoTrjMostrar').text(SesionMovil.PosicionConsolidada.TarjetasCliente[0].DescripcionAfinidad);

            ConsultarSaldosTarjetaWeb(SesionMovil.PosicionConsolidada.TarjetasCliente[0].NumeroTarjeta, function (data) {
                let srcSB = [];
                if (data.ListaFechaCorteDisponibles && data.ListaFechaCorteDisponibles.length > 0) {
                    data.ListaFechaCorteDisponibles.map(el => { srcSB.push({ val: el, des: Date.parse(el).toString("MM/yyyy") }) })
                    $('#slTFechasCorte').dxSelectBox('option', 'placeholder', srcSB[srcSB.length - 1].des);
                }
            });
            consultarPrimeraVez();
        },

        viewShowing: function () {
            hideFloatButtons();
        },
        viewHidden: function () {
            hideFloatButtons();
        },
        dtFechaBusqueda: setupDateControl(fechaBusqueda, new Date().addDate(dateParts.Months, -12), new Date(), 'auto'),
        lkpTarjetas: setupLookupControl(undefined, SesionMovil.PosicionConsolidada.TarjetasCliente, 'NumeroTarjetaEncript', 'NumeroTarjeta', false, 'instantly', undefined, function (itemData, itemIndex, itemElement) {
            var content = "<div style='margin-left:20px; font-size:18px; color: #d52133'>";
            content = content + "<img style='display:inline-block; margin-right:10px; width:24px; height:24px' src='images/TRJ.png' />";
            content = content + "<span style='display:inline-block'>" + itemData.NumeroTarjetaEncript + "</span>";
            content = content + "</div>";
            content = content + "<hr />";
            return content;
        }, 'Tarjetas'),
        popupSeleccionTarjeta: setupPopup(false, '90%', 'auto', true, 'Cuenta Origen', true),
        slTFechasCorte: setupComboBoxControl(listfechasCorte, "des", "val", '1', false, undefined, undefined, undefined),
        lstMovimientos: setupListBox(movimientosTarjeta, modeSelection.None, false, 'auto', function (itemData, itemIndex, itemElement) {
            try {
                var data = {
                    Fecha: Date.parse(itemData.Fecha).toString(ConstantsBehaivor.PATTERN_SHORTDATE),
                    Concepto: itemData.Concepto,
                    ValorGTQ: itemData.EsCredito ? " -" + itemData.ValorGTQ.toFixed(2) : itemData.ValorGTQ.toFixed(2),
                    ValorUSD: itemData.EsCredito ? " -" + itemData.ValorUSD.toFixed(2) : itemData.ValorUSD.toFixed(2),
                }
                return formatListMovements(data);
            } catch (e) {
                showException(e.message, e.stack);
            }
        })
    };

    viewModel.popupSeleccionTarjeta.onShown = function () {
        $('#floatButtons').hide();
    }

    viewModel.popupSeleccionTarjeta.onHidden = function () {
        $('#floatButtons').show();
    }

    function consultar(dateSelected) {
        var trj = $('#lkpTarjetas').dxLookup('option', 'value');

        ConsultarEstadoCuentaTarjetaWEB(trj, dateSelected, function (data) {
            try {
                if (data && data.length > 0) {
                    var movimientosTarjeta = data;
                    $('#movimientosTarjeta').show();
                    $('#lstMovimientos').dxList('option', 'dataSource', movimientosTarjeta);
                    $('#spnPagoMinimo').text("(Q)" + Number(data[0].PagoMinimoGTQ).formatMoney(2, '.', ',') + "/" + "($)" + Number(data[0].PagoMinimoUSD).formatMoney(2, '.', ','));
                    $('#spnPagoContado').text("(Q)" + Number(data[0].PagoContadoGTQ).formatMoney(2, '.', ',') + "/" + "($)" + Number(data[0].PagoContadoUSD).formatMoney(2, '.', ','));
                    $('#spnFechaLimite').text(Date.parse(data[0].FechaLimitePago).toString(ConstantsBehaivor.PATTERN_SHORTDATE));
                    $('#spnFechaCorte').text(Date.parse(data[0].FechaLimitePago).toString(ConstantsBehaivor.PATTERN_SHORTDATE));
                    $('#dtFechaBusqueda').dxDateBox('option', 'value', undefined);
                }
            } catch (e) {
                showWarningMessage(CORE_TAG('DefaultTitle'), "El Usuario no posee ningun estado de cuenta asociado a la tarjeta", undefined)
            }
        });
    }

    function consultarCortes() {
        var trj = $('#lkpTarjetas').dxLookup('option', 'value');

        var selectedtrj = jslinq(tarjetas).where(
            function (item) { return item.NumeroTarjeta == trj }
        ).toList();

        $('#tipoTrjMostrar').text(selectedtrj[0].DescripcionBin);

        var fechaUltCort = jslinq(selectedtrj).select(function (el) {
            return {
                FechaUltimoCorte: el.FechaUltimoCorte,
            };
        }).firstOrDefault();

        var fechaF = new Date(fechaUltCort.FechaUltimoCorte);
        fechaF.setDate(fechaF.getDate() - 1);

        ConsultarSaldosTarjetaWeb(trj, getListaEstadoCuenta);
    }

    function getListaEstadoCuenta(data) {
        try {
            if (data.ListaFechaCorteDisponibles) {
                let srcSB = [];
                data.ListaFechaCorteDisponibles.map(el => { srcSB.push({ val: el, des: Date.parse(el).toString("MM/yyyy") }) })
                $('#slTFechasCorte').dxSelectBox('option', 'dataSource', srcSB);
                $('#slTFechasCorte').dxSelectBox('option', 'selectedItem', srcSB[srcSB.length - 1]);
            }
        } catch (e) {
            showWarningMessage(CORE_TAG('DefaultTitle'), "El Usuario no posee ningun estado de cuenta asociado a la tarjeta", undefined);
        }
    }

    function consultarPrimeraVez() {
        ConsultarEstadoCuentaTarjetaWEB(SesionMovil.PosicionConsolidada.TarjetasCliente[0].NumeroTarjeta, SesionMovil.PosicionConsolidada.TarjetasCliente[0].FechaUltimoCorte.toString("dd/MM/yyyy"), function (data) {
            try {
                if (data && data.length > 0) {
                    var movimientosTarjeta = data;
                    $('#movimientosTarjeta').show();
                    $('#lstMovimientos').dxList('option', 'dataSource', movimientosTarjeta);
                    $('#spnPagoMinimo').text("(Q)" + Number(data[0].PagoMinimoGTQ).formatMoney(2, '.', ',') + "/" + "($)" + Number(data[0].PagoMinimoUSD).formatMoney(2, '.', ','));
                    $('#spnPagoContado').text("(Q)" + Number(data[0].PagoContadoGTQ).formatMoney(2, '.', ',') + "/" + "($)" + Number(data[0].PagoContadoUSD).formatMoney(2, '.', ','));
                    $('#spnFechaLimite').text(Date.parse(data[0].FechaLimitePago).toString(ConstantsBehaivor.PATTERN_SHORTDATE));
                    $('#spnFechaCorte').text(Date.parse(data[0].FechaLimitePago).toString(ConstantsBehaivor.PATTERN_SHORTDATE));
                    $('#dtFechaBusqueda').dxDateBox('option', 'value', undefined);
                } else {
                    showWarningMessage(CORE_TAG('DefaultTitle'), "El Usuario no posee ningún movimiento o estado de cuenta en esta tarjeta", undefined);
                }
            } catch (e) {
                showWarningMessage(CORE_TAG('DefaultTitle'), "El Usuario no posee ningun estado de cuenta asociado a la tarjeta", undefined);
            }
        });
    }

    viewModel.lkpTarjetas.onSelectionChanged = function (e) {
        datosTarjeta = e.selectedItem;
        if (datosTarjeta) {
            //consultar();
            consultarCortes();
        }
    };

    viewModel.slTFechasCorte.onSelectionChanged = function (e) {
        if (e.selectedItem)
            consultar(e.selectedItem.val);
    };

    function formatListMovements(itemData) {
        var content = '<div style="padding: 10px;">';
        if (itemData) {
            var truncatedConcepto = (itemData.Concepto.length > 25) ? itemData.Concepto.substr(0, 25 - 1) + '&hellip;' : itemData.Concepto;
            content += '<div><div"><span style="color: #d52133;font-weight: 700;">Fecha: </span><span>' + itemData.Fecha + '</span></div>'
            content += '<div><span style="color: #d52133;font-weight: 700;">Concepto: </span><span>' + truncatedConcepto + ' </span></div>'
            content += '<div><span style="color: #d52133;font-weight: 700;">Valor: </span><span>' + "(Q)" + Number(itemData.ValorGTQ).formatMoney(2, '.', ',') + " / ($)" + Number(itemData.ValorUSD).formatMoney(2, '.', ',') + ' </span></div>'
            content += '</div>'

        } else {
            content = content + "<span style='word-break:break-word'>NO EXISTEN MOVIMIENTOS</span>"
        }
        content = content + "</div>"

        return content;
    }

    return viewModel;
};


