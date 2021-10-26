MobileBanking_App.ConsultaPagosPendientesBilleteraMovil = function (params) {
    "use strict";

    var arrayBilleteraMovil = [];

    var viewModel = {
        lkpBilleteraMovil: setupLookupControl(undefined, arrayBilleteraMovil, 'Descripcion', 'Codigo', false, 'instantly', undefined, function (itemData, itemIndex, itemElement) {
            var content = "<div style='margin-left:20px; font-size:18px;'>";
            content = content + "<span style='font-size:18px; font-weight:bold'>" + itemData.Descripcion + "</span>";
            content = content + "<span style='font-size:14px; font-style:italic; display:block'>$" + itemData.SaldoDisponible + "</span>";
            content = content + "</div>";
            return content;
        }, 'Billetera Móvil'),
        lstPagosPendientes: setupListBox([], modeSelection.None, false, 'auto', function (itemData, itemIndex, itemElement) {

            try {

                var date = itemData.FechaSolicitudPago.split('T')[0];

                var content = "<div class='div-main' style='padding-left:15px' >";
                content = content + "<div class='div-second'>";
                content = content + "<span class='texts text-main-list'><b>" + itemData.TelefonoOrigen + "</b></span>";
                content = content + "<span class='texts text-second-list' style='margin-left: 10px; !important'>" + itemData.Referencia.substring(0, 22) + "</span></div>";
                content = content + "<div class='div-values' style='margin-right:15px'><span>$</span><span class='values'>" + parseFloat(itemData.Monto).toFixed(2) + "</span>";
                content = content + "<span class='values-second'>" + date + "</span></div>";
                content = content + "<i class='fa fa-chevron-right next'></i>"
                content = content + "</div>";
                return content;

            } catch (e) {
                showException(e.message, e.stack, JSON.stringify(itemData));
            }


        }),
        viewShown: function (e) {
            hideFloatButtons();
            SesionMovil.FechaActividadApp = new Date();
            arrayBilleteraMovil = [];

            arrayBilleteraMovil = $.map(SesionMovil.PosicionConsolidada.CuentasCliente, function (item, index) {
                if (item.EsHabilitadoBiMo)
                    return {
                        Codigo: item.CodigoCuentaBilletera, Descripcion: item.CelularAsociado + ' - ' + maskTarjeta(item.Codigo, 4, 4), SaldoDisponible: item.SaldoDisponible, CelularAsociado: item.CelularAsociado, Moneda: item.Moneda
                    }
            });


            $('#lstPagosPendientes').dxList('option', 'dataSource', []);
            $('#lkpBilleteraMovil').dxLookup('option', 'value', undefined);

            if (arrayBilleteraMovil.length > 0) {
                $('#lkpBilleteraMovil').dxLookup('option', 'dataSource', arrayBilleteraMovil);
                $('#lkpBilleteraMovil').dxLookup('option', 'value', arrayBilleteraMovil[0].Codigo);
            }


            if (arrayBilleteraMovil.length == 0) {
                showSuccessMessage('Billetera Móvil', 'No tienes Billetera Móvil asignada', function () {
                    MobileBanking_App.app.navigate('PosicionConsolidada', { root: true });
                })
            }
        }
    };

    viewModel.lkpBilleteraMovil.onValueChanged = function (e) {

        var selected = $('#lkpBilleteraMovil').dxLookup('option', 'selectedItem');

        if (selected != null) {
            $('#lstPagosPendientes').dxList('option', 'dataSource', []);
            ConsultarPagosPendientesBIMO(selected.CelularAsociado, function (response) {
                if ((response.data != undefined) && (response.data.Pendientes != undefined) && (response.data.Pendientes.length > 0))
                    $('#lstPagosPendientes').dxList('option', 'dataSource', response.data.Pendientes);
                else {
                    showSuccessMessage('Billetera Móvil', 'No tiene Pagos Pendientes', function () {

                        if (arrayBilleteraMovil.length == 1)
                            MobileBanking_App.app.navigate('PosicionConsolidada', { root: true });
                    })
                }
            });
        }


    }

    var pagar = function () {
        return "Pagar";
    };

    var rechazar = function () {
        return "Rechazar";
    };

    var cancelar = function () {
        return "Cancelar";
    };


    viewModel.lstPagosPendientes.onItemClick = function (itemData) {

        var customDialog = DevExpress.ui.dialog.custom({
            title: "Billetera Móvil",
            message: 'Seleccione una opción',
            buttons: [
                { text: "Pagar", onClick: pagar },
                { text: "Rechazar", onClick: rechazar },
                 { text: "Cancelar", onClick: cancelar }
            ]
        });

        customDialog.show().done(function (dialogResult) {

            var iData = itemData.itemData;
            var monto = parseFloat(iData.Monto.toFixed(2));

            switch (dialogResult) {
                case "Pagar":

                    try {

                        var celularBeneficiario = iData.TelefonoOrigen;
                        ConsultarComisionBIMO(celularBeneficiario, function (data) {

                            var montoUsoCanal = parseFloat(data.montoUsoCanal.toFixed(2));
                            var confirmar = {
                                Monto: monto,
                                CelularAsociado: $('#lkpBilleteraMovil').dxLookup('option', 'selectedItem').CelularAsociado,
                                CuentaBilletera: $('#lkpBilleteraMovil').dxLookup('option', 'selectedItem').Descripcion,
                                CelularBeneficiario: celularBeneficiario,
                                Concepto: iData.Referencia,
                                EmailTercero: '',
                                PagoPendienteId: iData.PagoPendienteId,
                                TipoTransaccion: "COBROP2P",
                                Moneda: $('#lkpBilleteraMovil').dxLookup('option', 'selectedItem').Moneda,
                                ValorUsoCanal: montoUsoCanal,
                                ValorTotal: monto + montoUsoCanal,
                            };

                            MobileBanking_App.app.navigate('ConfirmacionPagoBilleteraMovil/' + JSON.stringify(confirmar), { root: true });

                        });


                    } catch (e) {
                        showException(e.message, e.stack, JSON.stringify(itemData));
                    }

                    break;
                case "Rechazar":
                    try {

                        var ref = "REJECTED"; //iData.Referencia

                        RechazarPagoPendienteBIMO(iData.TelefonoDestino, iData.PagoPendienteId, ref, function (data) {

                            if (data.ok) {
                                showSuccessMessage('Billetera Móvil', 'Se rechazó el pago pendiente', function () {
                                    MobileBanking_App.app.navigate('PosicionConsolidada', { root: true });
                                })
                            }
                            else {
                                showSuccessMessage('Billetera Móvil', 'No se pudo rechazar el pago pendiente', function () {

                                })
                            }
                        });

                    } catch (e) {
                        showException(e.message, e.stack, JSON.stringify(itemData));
                    }


                    break;
            }
        });



    }


    return viewModel;
};