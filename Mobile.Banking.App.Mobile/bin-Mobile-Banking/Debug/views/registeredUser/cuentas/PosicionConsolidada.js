MobileBanking_App.PosicionConsolidada = function (params) {
    "use strict";

    var arrayBilleteraMovil = [];

    var ctasQueriable = SesionMovil.PosicionConsolidada.CuentasCliente ?
        jslinq(SesionMovil.PosicionConsolidada.CuentasCliente) :
        jslinq([]);

    var ctasOrdenadas = ctasQueriable.orderBy(function (el) {
        return el.Moneda;
    }).toList();

    var invQueriable = jslinq(SesionMovil.PosicionConsolidada.InversionesCliente);
    var invOrdenado = invQueriable.orderBy(function (el) {
        return el.Moneda;
    }).toList();

    var viewModel = {
        viewShown: function () {
            try {
                ResetSelectedMenuBullet();
                $('#smnPosicionConsolidada').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');

                arrayBilleteraMovil = [];

                arrayBilleteraMovil = $.map(ctasOrdenadas, function (item, index) {
                    if (item.CodigoCuentaBilletera && item.EsHabilitadoBiMo)
                        return item;
                });
                $('#header-fixed').show();
                $('.header-clear').show();
                SesionMovil.FechaActividadApp = new Date();
                if (!ctasOrdenadas || ctasOrdenadas.length == 0)
                    changePropertyControl('#lstCuentas', typeControl.ListBox, 'visible', false);
                if (!arrayBilleteraMovil || arrayBilleteraMovil.length == 0)
                    changePropertyControl('#lstBilleteraMovil', typeControl.ListBox, 'visible', false);
                if (!SesionMovil.PosicionConsolidada.TarjetasCliente || SesionMovil.PosicionConsolidada.TarjetasCliente.length == 0)
                    changePropertyControl('#lstTarjetas', typeControl.ListBox, 'visible', false);
                if (!SesionMovil.PosicionConsolidada.CreditosCliente || SesionMovil.PosicionConsolidada.CreditosCliente.length == 0)
                    changePropertyControl('#lstCreditos', typeControl.ListBox, 'visible', false);
                if (!invOrdenado || invOrdenado.length == 0)
                    changePropertyControl('#lstInversiones', typeControl.ListBox, 'visible', false);
                if (!SesionMovil.PosicionConsolidada.EstadosTarjetasVisaCliente || SesionMovil.PosicionConsolidada.EstadosTarjetasVisaCliente.length == 0)
                    changePropertyControl('#lstTarjetasVisa', typeControl.ListBox, 'visible', false);

                changePropertyControl('#lstCuentas', typeControl.ListBox, 'dataSource', ctasOrdenadas);
                changePropertyControl('#lstBilleteraMovil', typeControl.ListBox, 'dataSource', arrayBilleteraMovil);
                changePropertyControl('#lstTarjetas', typeControl.ListBox, 'dataSource', SesionMovil.PosicionConsolidada.TarjetasCliente);
                changePropertyControl('#lstCreditos', typeControl.ListBox, 'dataSource', SesionMovil.PosicionConsolidada.CreditosCliente);
                changePropertyControl('#lstInversiones', typeControl.ListBox, 'dataSource', invOrdenado);
                changePropertyControl('#lstTarjetasVisa', typeControl.ListBox, 'dataSource', SesionMovil.PosicionConsolidada.EstadosTarjetasVisaCliente);
                $('#lstCuentas').dxList('instance').repaint();
                $('#lstBilleteraMovil').dxList('instance').repaint();
                $('#lstTarjetas').dxList('instance').repaint();
                $('#lstCreditos').dxList('instance').repaint();
                $('#lstInversiones').dxList('instance').repaint();
                $('#lstTarjetasVisa').dxList('instance').repaint();

                if (SesionMovil.ControlAccesoGlobal.DiasxVencerClave > 0 && !Parameters.AlertaClaveCaducaShown)
                    showSimpleMessage(CORE_TAG('DefaultTitle'), "Tu Clave de Acceso caduca en: " + SesionMovil.ControlAccesoGlobal.DiasxVencerClave + " días.", undefined);

                Parameters.AlertaClaveCaducaShown = true;
            } catch (e) {
                showException(e.message, e.stack);
            }
        },
        viewShowing: function () {
            hideFloatButtons();
        },
        acdProductosCliente: setupAccordion(SesionMovil.ProductosCliente, function (data) {
            return "<div style='font-family:Gotham-Book'><img style='display:inline-block; margin-right:5px; vertical-align:middle; width:23px; height:24px' src='./images/" + data.CodigoProducto + ".png'></img><span style='display:inline-block'>" + data.NombreProducto + "</span></div>";
        }, function (itemData) {
            switch (itemData.CodigoProducto) {
                case 'CTA':
                    return $('#CuentasCliente');
                    break;
                //case 'BIMO':
                //    return $('#BilleteraMovil');
                //break;
                case 'TRJ':
                    return $('#TarjetasCliente');
                    break;
                case 'CRE':
                    return $('#CreditosCliente');
                    break;
                case 'INV':
                    return $('#InversionesCliente');
                    break;
                case 'TRJVISA':
                    return $('#TarjetasVisaCliente');
                    break;
                default:
                    break;
            }
        }, true, true),


        lstCuentas: setupListBox(ctasOrdenadas, modeSelection.Single, false, 'auto', function (itemData, itemIndex, itemElement) {
            try {

                //Number(itemData.SaldoContable).formatMoney(2,'.',',')

                var content = "<div class='div-main' style='margin-left:10px;margin-right:30px'>";
                var estaActiva = "<i style='margin-right:8px; color: " + mainColor + "' class='fa fa-check' ></i>";
                if (itemData.Estado == 'INACTIVA')
                    estaActiva = "<i style='margin-right:8px; color: " + negativeColor + "' class='fa fa-times'></i>";
                content = content + "<div class='div-second'>";
                content = content + "<span class='texts text-main-list' style='font-size:14px'>" + estaActiva + itemData.Codigo.inputChar('-', itemData.Codigo.length - 1) + "</span>";
                content = content + "<span class='texts text-second-list' style='margin-left:20px'>Saldo Contable</span></div>";
                content = content + "<div class='div-values' style='margin-right:20px'><span class='values'>" + ((itemData.Moneda === 'GTQ') ? 'Q ' : '$ ') + Number(itemData.SaldoDisponible).formatMoney(2, '.', ',') + "</span>";
                content = content + "<span class='values-second'>" + ((itemData.Moneda === 'GTQ') ? 'Q ' : '$ ') + Number(itemData.SaldoContable).formatMoney(2, '.', ',') + "</span></div>";
                content = content + "<i class='fa fa-chevron-right next'></i>"
                content = content + "</div>";
                return content;
            } catch (e) {
                showException(e.message, e.stack, JSON.stringify(itemData));
            }

        }, false, function (itemData) {
            return "<div><img style='margin-right:10px;width:32px;height:32px' src='./images/" + itemData.Icono + "'> <span style='text-transform:uppercase'>" + itemData.Tipo + "</span>"
        }),
        lstBilleteraMovil: setupListBox(arrayBilleteraMovil, modeSelection.Single, false, 'auto', function (itemData, itemIndex, itemElement) {
            try {
                var content = "<div class='div-main' style='margin-left:10px;margin-right:30px'>";
                var estaActiva = "<i style='margin-right:8px; color: " + mainColor + "' class='fa fa-check'></i>";
                if (itemData.Estado == 'INACTIVA')
                    estaActiva = "<i style='margin-right:8px; color: " + negativeColor + "' class='fa fa-times'></i>";

                content = content + "<div class='div-second'>";
                content = content + "<span class='texts text-main-list' style='font-size:12px'>" + estaActiva + itemData.Codigo.inputChar('-', itemData.Codigo.length - 1) + "/" + itemData.CelularAsociado + "</span>";
                content = content + "<span class='texts text-second-list' style='margin-left:20px'>Saldo Contable</span></div>";
                content = content + "<div class='div-values' style='margin-right:20px'><span class='values'>" + ((itemData.Moneda === 'GTQ') ? 'Q ' : '$ ') + Number(itemData.SaldoDisponible).formatMoney(2, '.', ',') + "</span>";
                content = content + "<span class='values-second'>$" + Number(itemData.SaldoContable).formatMoney(2, '.', ',') + "</span></div>";
                content = content + "<i class='fa fa-chevron-right next'></i>"
                content = content + "</div>";
                return content;
            } catch (e) {
                showException(e.message, e.stack, JSON.stringify(itemData));
            }

        }, false, function (itemData) {
            var item = "<div><img style='margin-right:10px;width:32px;height:32px' src='./images/" + itemData.Icono + "'> <span style='text-transform:uppercase'>" + itemData.Tipo + "</span>";
            return item;
        }),
        lstTarjetas: setupListBox(SesionMovil.PosicionConsolidada.TarjetasCliente, modeSelection.Single, false, 'auto', function (itemData, itemIndex, itemElement) {
            try {
                var content = "<div class='div-main'>";
                content = content + "<div class='div-second'>";
                //content = content + "<img src='./images/" + itemData.Marca + ".png'></img>";
                content = content + "<img src='./images/TRJS.png'></img>";
                content = content + "<span class='texts text-main-list'>" + maskTarjeta(itemData.NumeroTarjeta, 3, 5) + "</span>";
                if (itemData.EsPrincipal)
                    content = content + "<i style='color:" + mainColor + "; margin-left:1px; font-size:10px'>(T)</i>";
                else
                    content = content + "<i style='color:" + mainColor + "; margin-left:1px; font-size:10px'>(A)</i>";
                content = content + "<span class='texts text-second-list'> " + itemData.DescripcionBin;
                content = content + "</span>";
                //content = content + "<span class='texts text-second-list'> Pago Total </span>";
                content = content + "</div>";
                //content = content + "<div class='div-values' style='margin-right:15px'><span style='font-size:18px'>$</span><span class='values'> " + itemData.SaldoPagoMinimo.toFixed(2) + "</span>";
                // content = content + "<div class='div-values' style='margin-right:15px'><span style='font-size:18px'></span><span class='values'> " +"</span>";
                //content = content + "<span class='values-second'>$" + itemData.SaldoPagoTotal.toFixed(2) + "</span></div>";
                //content = content + "<span class='values-second'>$" + "</span></div>";
                // content = content + "<i class='fa fa-chevron-right next'></i>"
                content = content + "</div>";
                return content;
            } catch (e) {
                showException(e.message, e.stack, JSON.stringify(itemData));
            }

        }),
        lstCreditos: setupListBox(SesionMovil.PosicionConsolidada.CreditosCliente, modeSelection.Single, false, 'auto', function (itemData, itemIndex, itemElement) {
            try {
                var content = "<div class='div-main'>";
                content = content + "<div class='div-second'>";
                content = content + "<img src='./images/money-7.png'></img>";
                content = content + "<span class='texts text-main-list'>" + itemData.NumeroCredito.inputChar('-', itemData.NumeroCredito.length - 1) + "</span>";
                //content = content + "<span class='texts text-second-list'>Cuota " + itemData.CuotasCredito[itemData.CuotasCredito.length - 1].Cuota.split('/')[0] + " de " + itemData.NumeroCuotas + "</span></div>";
                content = content + "<span class='texts text-second-list'>Cuota " + itemData.CuotasCredito[0].Cuota.split('/')[0] + " de " + itemData.NumeroCuotas + "</span></div>";
                content = content + "<div class='div-values' style='margin-right:20px'><span style='font-size:18px'>" + ((itemData.Moneda === 'GTQ') ? 'Q ' : '$ ') + "</span><span class='values' >" + Number(itemData.ValorTotalAPagar).formatMoney(2, '.', ',') + "</span>";
                content = content + "<span class='values-second'> Vence: " + Date.parse(itemData.FechaProximoVencimiento).toString(ConstantsBehaivor.PATTERN_SHORTDATE) + "</span></div>";
                content = content + "<i class='fa fa-chevron-right next'></i>"
                content = content + "</div>";
                return content;
            } catch (e) {
                showException(e.message, e.stack, JSON.stringify(itemData));
            }
        }),
        lstInversiones: setupListBox(invOrdenado, modeSelection.Single, false, 'auto', function (itemData, itemIndex, itemElement) {
            try {
                var content = "<div class='div-main'>";
                content = content + "<div class='div-second'>";
                content = content + "<img src='./images/time-money.png'></img>";
                content = content + "<span class='texts text-main-list'>" + itemData.Codigo.inputChar('-', itemData.Codigo.length - 1) + "</span>";
                content = content + "<span class='texts text-second-list'>Plazo: " + itemData.Plazo + "</span></div>";
                content = content + "<div class='div-values' style='margin-right:20px'><span style='font-size:18px'>" + ((itemData.Moneda === 'GTQ') ? 'Q ' : '$ ') + "</span><span class='values'> " + Number(itemData.Capital).formatMoney(2, '.', ',') + "</span>";
                content = content + "<span class='values-second'> Últ. Venc.: " + Date.parse(itemData.FechaUltimoVencimiento).toString(ConstantsBehaivor.PATTERN_SHORTDATE) + "</span></div>";
                content = content + "<i class='fa fa-chevron-right next'></i>"
                content = content + "</div>";
                return content;
            } catch (e) {
                showException(e.message, e.stack, JSON.stringify(itemData));

            }

        }),
        lstTarjetasVisa: setupListBox(SesionMovil.PosicionConsolidada.EstadosTarjetasVisaCliente, modeSelection.Single, false, 'auto', function (itemData, itemIndex, itemElement) {
            try {
                var content = "<div class='div-main'>";
                content = content + "<div class='div-second'>";
                content = content + "<img src='./images/" + itemData.TipoTarjeta + ".png'></img>";
                content = content + "<span class='texts text-main-list'>" + maskTarjeta(itemData.NumeroTarjeta, 3, 5) + "</span>";
                content = content + "<span class='texts text-second-list'>Consumos del Mes</span></div>";
                content = content + "<div class='div-values' style='margin-right:20px'><span>$</span><span class='values'> " + Number(itemData.PagoMinimo).formatMoney(2, '.', ',') + "</span>";
                content = content + "<span class='values-second'>$" + itemData.ConsumosMes + "</span></div>";
                content = content + "<i class='fa fa-chevron-right next'></i>"
                content = content + "</div>";
                return content;
            } catch (e) {
                showException(e.message, e.stack, JSON.stringify(itemData));

            }

        }),
    };

    viewModel.lstCuentas.onItemClick = function (itemData) {
        try {
            if (itemData.itemData.Estado == 'ACTIVA')
                MobileBanking_App.app.navigate({ view: 'Movimientos', id: JSON.stringify(itemData.itemData) });
        } catch (e) {
            showException(e.message, e.stack, JSON.stringify(itemData));
        }
    }

    viewModel.lstTarjetas.onItemClick = function (itemData) {
        try {
            MobileBanking_App.app.navigate({ view: 'MovimientosTarjeta', id: JSON.stringify(itemData.itemData) });
        } catch (e) {
            showException(e.message, e.stack, JSON.stringify(itemData));
        }

    }

    viewModel.lstCreditos.onItemClick = function (itemData) {
        try {
            MobileBanking_App.app.navigate({ view: 'CuotasCredito', id: JSON.stringify(itemData.itemData) });
        } catch (e) {
            showException(e.message, e.stack, JSON.stringify(itemData));
        }
    }

    viewModel.lstInversiones.onItemClick = function (itemData) {
        try {
            MobileBanking_App.app.navigate({ view: 'Inversiones', id: JSON.stringify(itemData.itemData) });
        } catch (e) {
            showException(e.message, e.stack, JSON.stringify(itemData));
        }
    }

    viewModel.lstTarjetasVisa.onItemClick = function (itemData) {
        try {
            MobileBanking_App.app.navigate('MovimientosTarjeta', { root: true });
        } catch (e) {
            showException(e.message, e.stack, JSON.stringify(itemData));
        }
    }

    viewModel.lstBilleteraMovil.onItemClick = function (itemData) {
        try {
            MobileBanking_App.app.navigate('PagoBilleteraMovil', { root: true });
        } catch (e) {
            showException(e.message, e.stack, JSON.stringify(itemData));
        }
    }

    return viewModel;
};