MobileBanking_App.PuntosCredito = function (params) {
    "use strict";

    var datosCredito = null;
    if (params.id)
        datosCredito = JSON.parse(params.id);

    var PuntosCreditoViewModel = {
        Credito: {},
        saldoPuntosAnterior: ko.observable(),
        puntosGanados: ko.observable(),
        puntosCanjeados: ko.observable(),
        totalPuntosAcumulados: ko.observable(),
    }

    var viewModel = {
        viewShown: function () {
            SesionMovil.FechaActividadApp = new Date();
            $('#lkpCreditos').dxLookup('option', 'value', SesionMovil.PosicionConsolidada.CreditosCliente[0]);
            $('#lkpCreditos').dxLookup('option', 'selectedItem', SesionMovil.PosicionConsolidada.CreditosCliente[0]);
        },
        lkpCreditos: {
            dataSource: SesionMovil.PosicionConsolidada.CreditosCliente,
            displayExpr: 'NumeroCredito',
            title: 'Créditos',
            showDoneButton: true,
            showCancelButton: true,
            showClearButton: true,
            placeholder: 'Seleccione',
            clearButtonText: 'Limpiar',
            cancelButtonText: 'Cancelar',
            searchPlaceholder: 'Buscar',
            searchEnabled: false,
            onSelectionChanged: function (e) {


            },
            itemTemplate: function (itemData, itemIndex, itemElement) {
                var content = "<div style='margin-left:20px; font-size:18px; color: #d52133'>";
                content = content + "<img style='display:inline-block; margin-right:10px; width:24px; height:24px' src='images/CRE.png'></img>";
                content = content + "<span style='display:inline-block'>" + itemData.NumeroCredito.inputChar('-', itemData.NumeroCredito.length - 1) + "</span>";
                content = content + "</div>";
                return content;
            },
            fieldTemplate: function (itemData, itemIndex, itemElement) {
                var content = "<div style='color: #d52133; font-style: italic'>";
                if (itemData) {
                    content = content + "<span>-" + itemData.NumeroCredito + "-</span>";
                } else {
                    content = content + "<span>-Seleccione-</span>";
                }
                content = content + "</div>";
                return content;
            },
            value: PuntosCreditoViewModel.Credito,
            onOpened: function () {
                $('#floatButtons').hide();
            },
            onClosed: function () {
                $('#floatButtons').show();
            }
        },
        saldoPuntosAnterior: PuntosCreditoViewModel.saldoPuntosAnterior,
        puntosGanados: PuntosCreditoViewModel.puntosGanados,
        puntosCanjeados: PuntosCreditoViewModel.puntosCanjeados,
        totalPuntosAcumulados: PuntosCreditoViewModel.totalPuntosAcumulados,
    };


    viewModel.lkpCreditos.onValueChanged = function (e) {
        if (e.value != null || e.value != undefined) {
            PuntosCreditoViewModel.saldoPuntosAnterior(e.value.PuntosSaldo);
            PuntosCreditoViewModel.puntosGanados(e.value.PuntosGanados)
            PuntosCreditoViewModel.puntosCanjeados(e.value.PuntosCanjeados)
            PuntosCreditoViewModel.totalPuntosAcumulados(e.value.PuntosAcumulados)
            $('#datosCreditoPuntos').show();
            $(".col-lg-12").addClass("texts");
        }
    }


    return viewModel;
};