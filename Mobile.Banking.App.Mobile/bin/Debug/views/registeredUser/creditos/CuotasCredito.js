MobileBanking_App.CuotasCredito = function (params) {
    "use strict";
    var datosCredito = null;
    if (params.id)
        datosCredito = JSON.parse(params.id);


    var viewModel = {
        viewShown: function () {
            var numCred = datosCredito ? datosCredito.NumeroCredito : SesionMovil.PosicionConsolidada.CreditosCliente[0].NumeroCredito;
            SesionMovil.FechaActividadApp = new Date();
            ConsultaCreditosVigentes(function (dataDos) {

                if (dataDos.ListaCredito) {

                    var creditosQueryable = jslinq(dataDos.ListaCredito);

                    datosCredito = creditosQueryable.singleOrDefault(function (el) {
                        return el.NumeroCredito == numCred;
                    });

                    var vigentes = creditosQueryable.where(
                        function (item) { return item.EstadoCredito == "Vigente" || item.EstadoCredito == "Vencido" }
                    ).toList();



                    $('#lkpCreditos').dxLookup('option', 'dataSource', vigentes);
                    $('#lkpCreditos').dxLookup('option', 'value', datosCredito ? datosCredito.NumeroCredito : SesionMovil.PosicionConsolidada.CreditosCliente[0].NumeroCredito);
                    $('#lkpCreditos').dxLookup('option', 'fieldTemplate', function (itemData, itemIndex, itemElement) {
                        var content = "<div style='color: #d52133; font-style: italic'>";
                        content = content + "<span>-" + itemData.NumeroCredito + "-</span>";
                        content = content + "</div>";
                        return content;
                    });
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
        numeroCredito: datosCredito ? datosCredito.NumeroCredito : '',
        valorTotalPagar: datosCredito ? (((datosCredito.Moneda === 'GTQ') ? 'Q ' : '$ ') + Number(datosCredito.ValorTotalAPagar).formatMoney(2, '.', ',')) : 0,
        fechaProximoVencimiento: datosCredito ? new Date(datosCredito.FechaProximoVencimiento) : new Date(),
        valorVigente: datosCredito ? Number(datosCredito.ValorVigente).formatMoney(2, '.', ',') : 0,
        numeroActualCuota: datosCredito ? (datosCredito.NumeroCuotas - datosCredito.CuotasCredito.length) : 0,
        numeroCuotas: datosCredito ? datosCredito.NumeroCuotas : 0,
        agencia: datosCredito ? datosCredito.Agencia : '',
        fechaOtorgamiento: datosCredito ? datosCredito.FechaOtorgamiento : undefined,
        saldoCapitalCredito: datosCredito ? Number(datosCredito.SaldoCapitalCredito).formatMoney(2, '.', ',') : 0,
        lkpCreditos: setupLookupControl(undefined, [], 'NumeroCredito', 'NumeroCredito', false, 'instantly', undefined, function (itemData, itemIndex, itemElement) {
            var content = "<div style='margin-left:20px; font-size:18px; color: #d52133'>";
            content = content + "<img style='display:inline-block; margin-right:10px; width:24px; height:24px' src='images/CRE.png'></img>";
            content = content + "<span style='display:inline-block'>" + itemData.NumeroCredito.inputChar('-', itemData.NumeroCredito.length - 1) + "</span>";
            content = content + "</div>";
            return content;
        }, 'Créditos'),
        lstCuotasCredito:


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
                //colocar  el if   estado mostrar si es cancelada mandarle con cero si esta cancelada es 0 si es por vencer realizar calculo  
                if (itemData.EstadoCuota == "Cancelada") {
                    var valorMostrar = 0;
                } else {
                    var valorMostrar = ((+itemData.ValorCuotayOtros + +itemData.Mora + +itemData.Gestion) - +itemData.ValorPago);
                }
            
            content = content + "<div class='column-2-small' style='margin:0px  !important;text-align:center;width:30% !important; font-size:18px !important; color:" + mainColor + "'><span>" + Number(valorMostrar).formatMoney(2, '.', ',') + "</span></div>";
            content = content + "<div class='column-3' style='text-align:center; width:35% !important'>";
            content = content + "<span style='font-size:14px;'>" + estadoMostrar + "</span>";
            content = content + "</div>";

            return content;
        })
    };

    viewModel.lkpCreditos.onSelectionChanged = function (e) {
        datosCredito = e.selectedItem;
        var credPosConsolidada = jslinq(SesionMovil.PosicionConsolidada.CreditosCliente).singleOrDefault(function (el) {
            return el.NumeroCredito == datosCredito.NumeroCredito;
        });
        
        datosCredito.Moneda = credPosConsolidada.Moneda;
        if (datosCredito) {
            $('#datosCredito').show();
            $('#cuotasCredito').show();
            viewModel.numeroCredito = "-" + datosCredito.NumeroCredito + "-";
            viewModel.valorTotalPagar = ((datosCredito.Moneda === 'GTQ') ? 'Q ' : '$ ') + Number(credPosConsolidada.ValorTotalAPagar).formatMoney(2, '.', ',')//datosCredito.ValorTotalAPagar;
            viewModel.fechaProximoVencimiento = credPosConsolidada.FechaProximoVencimiento;
            viewModel.valorVigente = Number(datosCredito.Saldo).formatMoney(2, '.', ',');
            viewModel.numeroActualCuota = credPosConsolidada.CuotasCredito[credPosConsolidada.CuotasCredito.length - 1].Cuota.split('/')[0];
            viewModel.numeroCuotas = datosCredito.Cuotas.length;
            viewModel.saldoCapitalCredito = Number(credPosConsolidada.SaldoCapitalCredito).formatMoney(2, '.', ',');
            viewModel.agencia = 'MATRIZ';
            viewModel.fechaOtorgamiento = datosCredito.FechaOtorgamiento;
            $('#spnNumeroCredito').text(viewModel.numeroCredito);
            $('#spnAgencia').text(viewModel.agencia);
            $('#spnFechaOtorgamiento').text(Date.parse(viewModel.fechaOtorgamiento).toString(ConstantsBehaivor.PATTERN_SHORTDATE));
            $('#spnValorPagar').text(viewModel.valorTotalPagar);
            $('#lstCuotasCredito').dxList('option', 'dataSource', datosCredito.Cuotas);
        } else {
            $('#datosCredito').hide();
            $('#cuotasCredito').hide();
        }
    }

    return viewModel;
};