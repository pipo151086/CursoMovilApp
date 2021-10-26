MobileBanking_App.MovimientosTarjetaVisa = function (params) {
    "use strict";
    var datosTarjeta = null;

    if (params.id)
        datosTarjeta = JSON.parse(params.id);

    var lastMoveModel = {
        UltimosMovimientos: ko.observable(10),
        FechaDesde: ko.observable(new Date().addDate(dateParts.Months, -1)),
        FechaHasta: ko.observable(new Date())
    }
    
    var viewModel = {
        viewShown: function () {
            initialize();
            SesionMovil.FechaActividadApp = new Date();

        },
        viewShowing: function () {
            hideFloatButtons();
        },
        cmbTarjeta: setupComboBoxControl(consolidatedPosition.TarjetasMarca, 'NumeroTarjeta', 'NumeroTarjeta', datosTarjeta ? datosTarjeta.NumeroTarjeta : undefined),
        tipoTarjeta: datosTarjeta ? datosTarjeta.TipoTarjeta : '',
        numeroTarjeta: datosTarjeta ? datosTarjeta.NumeroTarjeta : '',
        fechaCorte: datosTarjeta ? new Date(datosTarjeta.FechaCorteActual) : new Date(),
        fechaPago: datosTarjeta ? new Date(datosTarjeta.FechaPago) : new Date(),
        pagoMinimo: datosTarjeta ? datosTarjeta.PagoMinimo : 0,
        pagoTotal: datosTarjeta ? datosTarjeta.Pagos : 0,
        txtUltimosMovimientos: setupNumberBox(lastMoveModel.UltimosMovimientos, 1, 50, '35px'),
        btnObtenerMovimientos: setupButtonControl(undefined, getMoves, undefined, undefined, iconosCore.search),
        dtFechaDesde: setupDateControl(lastMoveModel.FechaDesde, new Date().addDate(dateParts.Months, -3), new Date(), 'auto'),
        dtFechaHasta: setupDateControl(lastMoveModel.FechaHasta, new Date().addDate(dateParts.Months, -3), new Date(), 'auto'),
        lstMovimientos: setupListBox(datosTarjeta ? datosTarjeta.DetallesEstadoCuenta : [], modeSelection.None, false, 'auto', function (itemData, itemIndex, itemElement) {
            try {
                var data = {
                    Descripcion: itemData.Descripcion,
                    Fecha: Date.parse(itemData.FechaMovimiento).toString('yy/MM/dd'),
                    Signo: '+',
                    Oficina: itemData.Nombre,
                    ValorParcial: itemData.ValorMovimiento.toFixed(2),
                    ValorTotal: itemData.Referencia
                }
                return getStyleListMovements(data);
            } catch (e) {
                showException(e.message, e.stack);
            }
            
        })
    };

    function getMoves() {

    }

    viewModel.cmbTarjeta.onSelectionChanged = function (e) {
        try {
            datosTarjeta = e.selectedItem;
            if (datosTarjeta) {
                var divProgressBar = document.getElementById('pbCuposTarjeta');
                $('#datosTarjeta').show();
                $('#movimientosTarjeta').show();
                viewModel.numeroTarjeta = datosTarjeta.NumeroTarjeta;
                viewModel.fechaCorte = datosTarjeta.FechaCorteActual;
                viewModel.fechaPago = datosTarjeta.FechaPago;
                viewModel.pagoMinimo = datosTarjeta.PagoMinimo;
                viewModel.pagoTotal = datosTarjeta.Pagos;
                $('#spnNumeroTarjeta').text(viewModel.numeroTarjeta);
                $('#spnFechaCorte').text(viewModel.fechaCorte.toString(ConstantsBehaivor.PATTERN_SHORTDATE));
                $('#spnFechaPago').text(viewModel.fechaPago.toString(ConstantsBehaivor.PATTERN_SHORTDATE));
                $('#spnPagoMinimo').text(viewModel.pagoMinimo);
                $('#spnPagoTotal').text( viewModel.pagoTotal);

                $('#lstMovimientos').dxList('option', 'dataSource', datosTarjeta.DetallesEstadoCuenta);
                divProgressBar.progressBar(0, datosTarjeta.PagoMinimo, datosTarjeta.ConsumosMes, 'Pago Mínimo: ', 'Consumos: ');
            } else {
                $('#datosTarjeta').hide();
                $('#movimientosTarjeta').hide();
            }
        } catch (e) {
            showException(e.message, e.stack, JSON.stringify(e.selectedItem));
        }
        
    }

    function initialize() {
        if (datosTarjeta) {
            var divProgressBar = document.getElementById('pbCuposTarjeta');
            divProgressBar.progressBar(0, datosTarjeta.PagoMinimo, datosTarjeta.ConsumosMes, 'Pago Mínimo: ', 'Consumos: ');
        }
    }
    return viewModel;
};