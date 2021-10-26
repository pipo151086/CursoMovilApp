MobileBanking_App.InformacionCreditos = function (params) {
    "use strict";

    var creditosClienteInformacion = [];
    creditosClienteInformacion.push(jslinq(SesionMovil.ProductosCliente).firstOrDefault(function (el) { return el.CodigoProducto === 'CRE'; }));


    var viewModel = {
        acdProductosCliente: setupAccordion(creditosClienteInformacion, function (data) {
            if (data.CodigoProducto === 'CRE')
                return "<div style='font-family:Gotham-Book'><img style='display:inline-block; margin-right:5px; vertical-align:middle; width:23px; height:24px' src='./images/" + data.CodigoProducto + ".png'></img><span style='display:inline-block'>" + data.NombreProducto + "</span></div>";
        }, function (itemData) {
            switch (itemData.CodigoProducto) {
                case 'CRE':
                    return $('#CreditosCliente');
                    break;
            }
        }, true),


        lstCreditos: setupListBox(SesionMovil.PosicionConsolidada.CreditosCliente, modeSelection.Single, false, 'auto', function (itemData, itemIndex, itemElement) {
            try {
                var content = '<div style="margin-top:15px;">';
                content = content + '<div class="" style="display: -webkit-box;">';
                content = content + '<div style="width: 5%;"><i style="margin-right:8px; color: ' + mainColor + '" class="fa fa-check" /></div>';
                content = content + '<div class="texts" style="font-weight:bold; width: 47.5%; word-wrap: break-word;">';
                    content = content + '<div class="div-values" style="font-weight:bold; width: 47.5%;text-align: right;"><span style="margin: 0px;">' + itemData.NumeroCredito + '</span></div>';
                content = content + '</div>'
                content = content + '<div class="" style="display: -webkit-box;">';
                content = content + '<div style="width: 5%;"></div>';
                content = content + '<div class="texts" style="margin-top: 5px;font-size:10px; width: 47.5%;"><span>Valor próximo pago</span></div>';
                content = content + '<div class="div-values" style="font-size:10px; width: 47.5%;text-align: right;"><span>' + ((itemData.Moneda === 'GTQ') ? 'Q ' : '$ ') + '</span><span class="values">' + Number(itemData.ValorTotalAPagar).formatMoney(2, '.', ',') + '</span>';
                content = content + '</div>'
                content = content + "</div>";
                return content;
            } catch (e) {
                showException(e.message, e.stack, JSON.stringify(itemData));
            }
        }),

    };


    viewModel.lstCreditos.onItemClick = function (itemData) {
        try {
            MobileBanking_App.app.navigate({
                view: 'DetalleCredito', id: JSON.stringify(itemData.itemData)
            });
        } catch (e) {
            showException(e.message, e.stack, JSON.stringify(itemData));
        }
    }


    return viewModel;
};


