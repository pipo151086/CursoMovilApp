MobileBanking_App.PagoCredito = function (params) {
    "use strict";


    var datosCredito = null;
    if (params.id)
        datosCredito = JSON.parse(params.id);

    var credPosCons = null;
    var creditosConsultaCliente = [];
    var creditosConsultaClientePorVencer = [];
    var arrayCtaOrigen = [];
    var arrayTipoPago = [
        { Codigo: 'TRJ', Descripcion: 'TARJETA' }
    ];
    var accountSelected = null;
    var tipoPagoSeleccionado = null;
    var cuotasVigentes = null;
    var cuotasVencidas = null;
    var cuotasPorvencer = null;
    var filtradas = [];
    
    if (SesionMovil.PosicionConsolidada.CuentasCliente && SesionMovil.PosicionConsolidada.CuentasCliente.length > 0) {
        filtradas = jslinq(SesionMovil.PosicionConsolidada.CuentasCliente).where(function (el) {
            return el.Moneda == 'GTQ';
        }).toList();
    }

    arrayCtaOrigen = $.map(filtradas, function (item, index) {
        var monedaSymbol = ((item.Moneda === 'GTQ') ? 'Q' : '$');
        return {
            Codigo: item.Codigo,
            Descripcion: '(' + monedaSymbol + Number(item.SaldoDisponible).formatMoney(2, '.', ',') + ') ' + item.Codigo.inputChar('-', item.Codigo.length - 1),
            SaldoDisponible: item.SaldoDisponible, SaldoDisponible: item.SaldoDisponible, SymbolMoneda: monedaSymbol, Moneda: item.Moneda
        }
    });

    if (filtradas.length > 0)
        arrayTipoPago = [
            { Codigo: 'CTA', Descripcion: 'CUENTA' },
            { Codigo: 'TRJ', Descripcion: 'TARJETA' }
        ];


    var lisCtaOrigen = new DevExpress.data.DataSource({
        store: {
            type: "array",
            key: "Codigo",
            data: arrayCtaOrigen
        }
    });

    var lisTipoPago = new DevExpress.data.DataSource({
        store: {
            type: "array",
            key: "Codigo",
            data: arrayTipoPago
        }

    });

    var listAcordionPagos = [
        { cod: "PagCred", desc: "Datos de Crédito" },
        { cod: "CuotCred", desc: "CRONOGRAMA DE PAGOS" },
    ];

    var datosCreditoMostrar = {
        numero: "",
        cuotasPendintes: "",
        numeroCuotas: "",
        fechaVencimiento: "",
        estadoCredito: "",
        valorAPagar: "",
    }

    var viewModel = {
        numeroCredito: ko.observable(),
        numeroCuotaPendiente: ko.observable(),
        numeroCuota: ko.observable(),
        FechaVencimiento: ko.observable(),
        EstadoCredito: ko.observable(),
        ValorPagar: ko.observable(),
        valorTotalPagar: setupNumberBox(0.01, 0.01, 10000, '40%'),
        spnMoneda: ko.observable(),

        viewShown: function () {
            setupFloatButton(classButtons.Accept, pagarCredito, undefined, undefined, undefined, undefined, undefined);
            setupFloatButton(classButtons.Cancel, cancelar, undefined, sizeFloatButtons.small, typeFloatButtons.white);
            var numCred = datosCredito ? datosCredito.NumeroCredito : SesionMovil.PosicionConsolidada.CreditosCliente[0].NumeroCredito;
            SesionMovil.FechaActividadApp = new Date();

            ConsultaCreditosVigentes(function (dataDos) {
                if (dataDos.ListaCredito) {
                    var creditosQueryable = jslinq(dataDos.ListaCredito);
                    $.each(dataDos.ListaCredito, function (index, item) {
                        var cuotasMostrar = jslinq(item.Cuotas).where(function (el) {
                            return el.EstadoCuota !== "PorVencer" && el.EstadoCuota !== "Cancelada";
                        }).toList();
                        item.CuotasTotal = item.Cuotas;
                        item.Cuotas = cuotasMostrar;
                    });

                    var vigentes = creditosQueryable.where(
                        function (item) { return item.EstadoCredito == "Vigente" || item.EstadoCredito == "Vencido" }
                    ).toList();

                    creditosConsultaCliente = vigentes;

                    datosCredito = jslinq(creditosConsultaCliente).singleOrDefault(function (el) {
                        return el.NumeroCredito == numCred;
                    });

                    $('#lkpCreditos').dxLookup('option', 'dataSource', creditosConsultaCliente);
                    $('#lkpCreditos').dxLookup('option', 'value', datosCredito ? datosCredito.NumeroCredito : SesionMovil.PosicionConsolidada.CreditosCliente[0].NumeroCredito);
                    $('#lkpCreditos').dxLookup('option', 'fieldTemplate', function (itemData, itemIndex, itemElement) {
                        var content = "<div style='color: #d52133; font-style: italic'>";
                        content = content + "<span>-" + itemData.NumeroCredito + "-</span>";
                        content = content + "</div>";
                        return content;
                    });

                    tipoPagoSeleccionado = lisTipoPago._store._array[0];

                    if (tipoPagoSeleccionado.Codigo == 'CTA') {
                        $('.pagoCta').show();
                    } else {
                        $('.pagoCta').hide();
                    }

                    accountSelected = lisCtaOrigen._store._array[0];
                }
                else {
                    showSimpleMessage('Banca Movil', 'No hemos recuperado la información de este crédito', undefined, undefined);
                }
            });
        },
        viewShowing: function () {
            hideFloatButtons();
        },
        viewHidden: function () {
            hideFloatButtons();
        },
        lkpCreditos: setupLookupControl(undefined, [], 'NumeroCredito', 'NumeroCredito', false, 'instantly', undefined, function (itemData, itemIndex, itemElement) {
            var content = "<div style='margin-left:20px; font-size:18px; color: #d52133'>";
            content = content + "<img style='display:inline-block; margin-right:10px; width:24px; height:24px' src='images/CRE.png' />";
            content = content + "<span style='display:inline-block'>" + itemData.NumeroCredito.inputChar('-', itemData.NumeroCredito.length - 1) + "</span>";
            content = content + "</div>";
            return content;
        }, 'Créditos'),
        lstCuotasCredito: ko.observable(),
        btnCambiarCuenta: setupButtonControl(lisCtaOrigen._store._array[0] ? lisCtaOrigen._store._array[0].Descripcion : '', changeAccount, undefined, undefined, iconosCore.chevron_down, undefined, true),
        popupSeleccionCuenta: setupPopup(false, '90%', 'auto', true, 'Cuenta Origen', true),
        rdbTipoPago: setupRadioGroup(lisTipoPago._store._array[0] ? lisTipoPago._store._array[0].Codigo : '', lisTipoPago, 'Descripcion', 'Codigo', function (itemData, itemIndex, itemElement) {
            var content = "<div>";
            content = content + "<span>" + itemData.Descripcion + "</span>";
            content = content + "</div>";
            return content;
        }),
        rdbCuentas: setupRadioGroup(lisCtaOrigen._store._array[0] ? lisCtaOrigen._store._array[0].Codigo : '', lisCtaOrigen, 'Descripcion', 'Codigo', function (itemData, itemIndex, itemElement) {
            var content = "<div>";
            content = content + "<span>" + itemData.Codigo.inputChar('-', itemData.Codigo.length - 1) + " (" + itemData.SymbolMoneda + Number(itemData.SaldoDisponible).formatMoney(2, '.', ',') + ")</span>";
            content = content + "</div>";

            return content;
        }),
        btnCancelarCuenta: setupButtonControlDefault(classButtons.Cancel, cancelAccount),
        acdPagoCred: setupAccordion(listAcordionPagos, function (data) {
            return "<div style='font-family:Gotham-Book'><span style='display:inline-block;color: white'>" + data.desc + "</span></div>";

        }, function (itemData) {
            switch (itemData.cod) {
                case 'PagCred':
                    var content = ' <div id="datosCreditoResumen">';
                    content += '     <div class="row">';
                    content += '         <div class="col-lg-6 texts" style="display:inline-block">';
                    content += '             <label style="display:block">Número</label>';
                    content += '         </div>';
                    content += '         <div class="col-lg-6 texts" style="display:inline-block; float:right; text-align:right">';
                    content += '             <span id="spnNumeroCredito" class="color" style="display:block; font-size:14px"></span>';
                    content += '         </div>';
                    content += '     </div>';
                    content += '     <hr />';
                    content += '     <div class="row">';
                    content += '         <div class="col-lg-6 texts" style="display:inline-block">';
                    content += '             <label style="display:block">Cuotas pendientes</label>';
                    content += '         </div>';
                    content += '         <div class="col-lg-6 texts" style="display:inline-block; float:right; text-align:right">';
                    content += '             <span id="spnNumeroCuotaPendiente" class="color" style="display:block; font-size:14px"></span>';
                    content += '         </div>';
                    content += '     </div>';
                    content += '     <hr />';
                    content += '     <div class="row">';
                    content += '         <div class="col-lg-6 texts" style="display:inline-block">';
                    content += '             <label style="display:block">Número Cuotas</label>';
                    content += '         </div>';
                    content += '         <div class="col-lg-6 texts" style="display:inline-block; float:right; text-align:right">';
                    content += '             <span id="spnNumeroCuota" class="color" style="display:block; font-size:14px"></span>';
                    content += '         </div>';
                    content += '     </div>';
                    content += '     <hr />';
                    content += '     <div class="row">';
                    content += '         <div class="col-lg-6 texts" style="display:inline-block">';
                    content += '             <label style="display:block">Fecha Vencimiento</label>';
                    content += '         </div>';
                    content += '         <div class="col-lg-6 texts" style="display:inline-block; float:right; text-align:right">';
                    content += '             <span id="spnFechaVencimiento" class="color" style="display:block; font-size:14px"></span>';
                    content += '         </div>';
                    content += '     </div>';
                    content += '     <hr />';
                    content += '     <div class="row">';
                    content += '         <div class="col-lg-6 texts" style="display:inline-block">';
                    content += '             <label style="display:block">Estado Crédito</label>';
                    content += '         </div>';
                    content += '         <div class="col-lg-6 texts" style="display:inline-block; float:right; text-align:right">';
                    content += '             <span id="spnEstadoCredito" class="color" style="display:block; font-size:14px"></span>';
                    content += '         </div>';
                    content += '     </div>';
                    content += '     <hr />';
                    content += '     <div class="row">';
                    content += '         <div class="col-lg-6 texts" style="display:inline-block">';
                    content += '             <label style="display:block">Valor a Pagar</label>';
                    content += '         </div>';
                    content += '         <div class="col-lg-6 texts" style="display:inline-block; float:right; text-align:right">';
                    content += '             <span id="spnValorPagar" class="color" style="display:block; font-size:14px"></span>';
                    content += '         </div>';
                    content += '     </div>';
                    content += '     <hr />';
                    content += ' </div>';
                    return content;
                    break;
                case 'CuotCred':
                    var content = '<div id="cuotasCredito">';
                    content += '<div class="row">';
                    content += '<div style="width:100%;font-size:12px" class="color">';
                    content += '<div style="width:10%;font-weight:bold; display:inline-block;text-align:center">';
                    content += '<span>N°</span>';
                    content += '</div>';
                    content += '<div style="width:26%;font-weight:bold; display:inline-block;text-align:center">';
                    content += '<span>FECH. VENC.</span>';
                    content += '</div>';
                    content += '<div style="width:30%;font-weight:bold; display:inline-block;text-align:center">';
                    content += '<span>VALOR</span>';
                    content += '</div>';
                    content += '<div style="width:29%;font-weight:bold; display:inline-block; text-align:center;">';
                    content += '<span>ESTADO</span>';
                    content += '</div>';
                    content += '</div>';
                    content += '<hr />';
                    content += '<div id="lstCuotasCredito"></div>';
                    content += '</div>';
                    content += '</div >';
                    return content;
                    break;
                default:
                    break;
            }
        }, false, false),
    };


    viewModel.acdPagoCred.onContentReady = function (args) {
        $('#lstCuotasCredito').dxList(
            setupListBox(undefined, modeSelection.None, false, 'auto', function (itemData, itemIndex, itemElement) {

                var estadoMostrar = "";
                switch (itemData.EstadoCuota) {
                    case 'PorVencer': estadoMostrar = 'Por Vencer'
                        break;
                    default:
                        estadoMostrar = itemData.EstadoCuota
                        break;

                }

                var content = "<div class='row-list'>";
                content = content + "<div class='column-1-small' style='text-align:center; width:10% !important; font-size:14px'><span>" + itemData.NumeroCuota + "</span></div>";
                content = content + "<div class='column-3' style='text-align:center  !important; width:29% !important'>";
                content = content + "<span style='font-size:14px;'>" + Date.parse(itemData.FechaVencimiento).toString(ConstantsBehaivor.PATTERN_SHORTDATE) + "</span>";
                content = content + "</div>";

                var valorMostrar = ((+itemData.ValorCuotayOtros + +itemData.Mora + +itemData.Gestion) - +itemData.ValorPago);
                content = content + "<div class='column-2-small' style='margin:0px  !important;text-align:center;width:30% !important; font-size:18px !importat; color:" + mainColor + "'><span>" + ((datosCredito.Moneda === 'GTQ') ? 'Q ' : '$ ') + Number(valorMostrar).formatMoney(2, '.', ',') + "</span></div>";
                content = content + "<div class='column-3' style='text-align:center; width:35% !important'>";
                content = content + "<span style='font-size:14px;'>" + estadoMostrar + "</span>";
                content = content + "</div>";

                return content;
            })

        );
    }

    viewModel.popupSeleccionCuenta.onShown = function () {
        $('#floatButtons').hide();
    }

    viewModel.popupSeleccionCuenta.onHidden = function () {
        $('#floatButtons').show();
    }

    viewModel.lkpCreditos.onOpened = function () {
        $('#floatButtons').hide();
    }

    viewModel.lkpCreditos.onClosed = function () {
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
            changePropertyControl('#btnCambiarCuenta', typeControl.Button, 'text', '(' + accountSelected.SymbolMoneda + Number(accountSelected.SaldoDisponible).formatMoney(2, '.', ',') + ") " + accountSelected.Codigo.inputChar('-', accountSelected.Codigo.length - 1));
            changePropertyControl('#popupSeleccionCuenta', typeControl.Popup, 'visible', false);
        }
    }

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
        } else {
            $('.pagoCta').hide();
        }
    }

    viewModel.lkpCreditos.onSelectionChanged = function (e) {
        datosCredito = e.selectedItem;
        credPosCons = jslinq(SesionMovil.PosicionConsolidada.CreditosCliente).singleOrDefault(function (el) {
            return el.NumeroCredito == datosCredito.NumeroCredito;
        });
        datosCredito.Moneda = credPosCons.Moneda;
        if (datosCredito) {
            $('#datosCredito').show();
            $('#cuotasCredito').show();
            $('#TipoPago').show();
            var monedaSymbol = (credPosCons.Moneda === 'GTQ') ? 'Q ' : '$ '
            $('#spnMoneda').text(monedaSymbol);
            $('#valorTotalPagar').dxNumberBox('option', 'value', credPosCons.ValorTotalAPagar);

            var cuotasMostrar = jslinq(datosCredito.Cuotas).where(function (el) {
                return el.EstadoCuota !== "PorVencer";
            }).toList();
            datosCredito.Cuotas = cuotasMostrar;

            /*Informacion General Credito*/
            $('#spnNumeroCredito').text(datosCredito.NumeroCredito.inputChar('-', datosCredito.NumeroCredito.length - 1));
            datosCreditoMostrar.numero = datosCredito.NumeroCredito;
            var coutaPendiente = jslinq(datosCredito.CuotasTotal).where(function (el) {
                return el.Cubierta === false;
            }).toList();

            var NumeroCuotaMostrar = 0;
            if (credPosCons.CuotasCredito && credPosCons.CuotasCredito.length > 0)
                NumeroCuotaMostrar = credPosCons.CuotasCredito[0].Cuota;

            var cuotaVigente = jslinq(datosCredito.Cuotas).singleOrDefault(function (el) {
                return el.EstadoCuota === "Vigente";
            });

            cuotasVigentes = cuotaVigente;

            //valores para la loista del acordeon
            var cuotaVigenteValue = jslinq(datosCredito.CuotasTotal).where(function (el) {
                return el.EstadoCuota === "Vigente";
            }).toList();

            var cuotaVencida = jslinq(datosCredito.CuotasTotal).where(function (el) {
                return el.EstadoCuota === "Vencida";
            }).toList();

            var cuotaPorVencer = jslinq(datosCredito.CuotasTotal).where(function (el) {
                return el.EstadoCuota === "PorVencer";
            }).toList();
            var cuotasTotaalMostarAcord = cuotaVencida.concat(cuotaVigenteValue).concat(cuotaPorVencer[0]);

            var fechaVigenteMostrar = '';
            if (cuotaVigente)
                fechaVigenteMostrar = Date.parse(cuotaVigente.FechaVencimiento).toString(ConstantsBehaivor.PATTERN_SHORTDATE);
            else
                fechaVigenteMostrar = Date.parse(datosCredito.CuotasTotal[0].FechaVencimiento).toString(ConstantsBehaivor.PATTERN_SHORTDATE);

            $('#spnNumeroCuotaPendiente').text(coutaPendiente.length);
            $('#spnNumeroCuota').text(NumeroCuotaMostrar);
            $('#spnFechaVencimiento').text(fechaVigenteMostrar);
            $('#spnEstadoCredito').text(datosCredito.EstadoCredito);
            $('#spnValorPagar').text(monedaSymbol + Number(credPosCons.ValorTotalAPagar).formatMoney(2, '.', ','));
            $('#lstCuotasCredito').dxList('option', 'dataSource', cuotasTotaalMostarAcord);

        } else {
            $('#datosCredito').hide();
            $('#TipoPago').hide();
            $('#cuotasCredito').hide();
        }
    }

    var pagarCredito = function (args) {
        var CodTipoPago = tipoPagoSeleccionado.Codigo;
        if (CodTipoPago == 'CTA') {
            var saldoCta = +accountSelected.SaldoDisponible;
            var valPagar = +credPosCons.ValorTotalAPagar;
            if (valPagar > saldoCta) {
                showSimpleMessage('Banca Móvil', 'El valor de la cuota es mayor al disponible en la cuenta.', function () { })
                return;
            }

            //if (cuotasVigentes == null) {
            //    showSimpleMessage('Banca Móvil', 'Las cuotas vigentes ya fueron pagadas.', function () { })
            //    return;
            //}


            var dtoPagoCreditoDebitoCuenta = {
                ctaSeleccionada: accountSelected,
                credPosConsSeleccionado: credPosCons,
                credConsultado: datosCredito,
                ctaMoneda: accountSelected.Moneda,
                numeroCuenta: accountSelected.Codigo,
                monto: $('#valorTotalPagar').dxNumberBox('option', 'value'),
                numeroCredito: datosCredito.NumeroCredito,
                montoMostrar: ($('#spnMoneda').text() + String(Number($('#valorTotalPagar').dxNumberBox('option', 'value')).formatMoney(2, '.', ','))),

                TitularCuentaOrigenMostrar: SesionMovil.ContextoCliente.NombreCompletoCliente
            }
            if (dtoPagoCreditoDebitoCuenta.monto === 0) {
                showSimpleMessage('Banca Movil', 'No existen cuotas a pagar.', function () { })
                return;
            } else {
                MobileBanking_App.app.navigate({ view: 'PagoCreditoConfirmacion', id: JSON.stringify(dtoPagoCreditoDebitoCuenta) }, { root: true });
            }

        } else {

            var dtoPagoCreditoTarjeta = {
                TarjPosConsSeleccionado: credPosCons,
                TarjCredConsultado: datosCredito,
                monto: $('#valorTotalPagar').dxNumberBox('option', 'value'),
                numeroCredito: datosCredito.NumeroCredito,
                numeroProducto: datosCredito.NumeroCredito,
                montoMostrar: ($('#spnMoneda').text() + " " + String(Number($('#valorTotalPagar').dxNumberBox('option', 'value')).formatMoney(2, '.', ','))),
                pagoProducto: 0,//Credito = 0
                TitularCuentaOrigenMostrar: SesionMovil.ContextoCliente.NombreCompletoCliente
            }
            if (dtoPagoCreditoTarjeta.monto === 0) {
                showSimpleMessage('Banca Movil', 'No existen cuotas a pagar.', function () { })
                return;
            } else {
                MobileBanking_App.app.navigate({ view: 'PagoVisaNet', id: JSON.stringify(dtoPagoCreditoTarjeta) }, { root: true });
            }

        }
    }

    var cancelar = function (args) {
        MobileBanking_App.app.navigate('PosicionConsolidada', { root: true });
    }

    return viewModel;
};