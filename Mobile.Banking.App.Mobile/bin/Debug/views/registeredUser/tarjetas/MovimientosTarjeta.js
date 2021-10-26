MobileBanking_App.MovimientosTarjeta = function (params) {
    "use strict";
    var datosTarjeta = null;
    var movimientosTarjeta = [];

    if (params.id)
        datosTarjeta = JSON.parse(params.id);
    $.each(SesionMovil.PosicionConsolidada.TarjetasCliente, function (index, item) {
        $.extend(item, { NumeroTarjetaEncript: maskTarjeta(item.NumeroTarjeta, 3, 5) });
    })


    var lastMoveModel = {
        UltimosMovimientos: ko.observable(10),
        FechaDesde: ko.observable(),
        FechaHasta: ko.observable()
    }

    var viewModel = {
        viewShown: function () {
            SesionMovil.FechaActividadApp = new Date();
            $('#lkpTarjetas').dxLookup('option', 'value', datosTarjeta ? datosTarjeta.NumeroTarjeta : SesionMovil.PosicionConsolidada.TarjetasCliente[0].NumeroTarjeta);
            $('#lkpTarjetas').dxLookup('option', 'fieldTemplate', function (itemData, itemIndex, itemElement) {
                var content = "<div style='color: #d52133; font-style: italic'>";
                content = content + "<span>" + itemData.NumeroTarjetaEncript + "</span>";
                content = content + "</div>";
                return content;
            });
        },
        viewShowing: function () {
            hideFloatButtons();
        },
        lkpTarjetas: setupLookupControl(undefined, SesionMovil.PosicionConsolidada.TarjetasCliente, 'NumeroTarjetaEncript', 'NumeroTarjeta', false, 'instantly', undefined, function (itemData, itemIndex, itemElement) {
            var content = "<div style='margin-left:20px; font-size:18px; color: #d52133'>";
            content = content + "<img style='display:inline-block; margin-right:10px; width:24px; height:24px' src='images/TRJ.png' />";
            content = content + "<span style='display:inline-block'>" + itemData.NumeroTarjetaEncript + "</span>";
            content = content + "</div>";
            content = content + "<hr />";
            return content;
        }, 'Tarjetas'),

        lstMovimientos: setupListBox(movimientosTarjeta, modeSelection.None, false, 'auto', function (itemData, itemIndex, itemElement) {
            try {

                var data = {
                    Concepto: itemData.Concepto,
                    Fecha: Date.parse(itemData.Fecha).toString(ConstantsBehaivor.PATTERN_SHORTDATE),
                    ValorGTQ: itemData.EsCredito ? " -" + itemData.ValorGTQ.toFixed(2) : itemData.ValorGTQ.toFixed(2),
                    ValorUSD: itemData.EsCredito ? " -" + itemData.ValorUSD.toFixed(2) : itemData.ValorUSD.toFixed(2),

                }

                return formatListMovements(data);
            } catch (e) {

                showException(e.message, e.stack);
            }

        })
    };

    function changeCard() {
        try {
            changePropertyControl('#popupSeleccionTarjeta', typeControl.Popup, 'visible', true);
        } catch (e) {
            showException(e.message, e.stack);
        }
    }


    function formatListMovements(itemData) {
        var descripcion = itemData.Concepto;
        var colorText = mainColor;

        if (itemData.Concepto && itemData.Concepto.length > 25)
            descripcion = itemData.Concepto.substring(0, 25) + '...';
        var content = '<div style="padding: 10px;">';
        if (itemData.Concepto) {
            content += '<div "><div"><span style="color: #d52133;font-weight: 700;">Fecha: </span><span>' + itemData.Fecha + '</span></div>'
            content += '<div><span style="color: #d52133;font-weight: 700;">Concepto: </span><span>' + descripcion + ' </span></div>'
            content += '<div><span style="color: #d52133;font-weight: 700;">Valor: </span><span>' + "(Q)" + Number(itemData.ValorGTQ).formatMoney(2, '.', ',') + " / ($)" + Number(itemData.ValorUSD).formatMoney(2, '.', ',') + ' </span></div>'
            content += '</div>'

        } else {
            content = content + "<span style='word-break:break-word'>NO EXISTEN MOVIMIENTOS</span>"
        }
        content = content + "</div>"

        return content;
    }

    viewModel.lkpTarjetas.onSelectionChanged = function (e) {
        datosTarjeta = e.selectedItem;
        if (datosTarjeta) {

            ConsultarUltimosMovimientosTarjetaWeb(datosTarjeta.NumeroTarjeta, function (data) {
                try {
                    var movimientosTarjeta = data;
                    $('#movimientosTarjeta').show();
                    $('#lstMovimientos').dxList('option', 'dataSource', movimientosTarjeta);


                } catch (e) {
                    showException(e.message, e.stack, JSON.stringify(datosTarjeta));

                }


            });



        } else {
            $('#movimientosTarjeta').hide();
        }
    }

    function cancelSelectCard() {
        changePropertyControl('#popupSeleccionTarjeta', typeControl.Popup, 'visible', false);
    }

    function initialize() {
        try {
            if (datosTarjeta) {
            }

        } catch (e) {
            showException(e.message, e.stack);
        }
    }

    return viewModel;
};