MobileBanking_App.TipoCambio = function (params) {
    "use strict";

    let screen = {
        compraVal: ko.observable("0.00"),
        ventaVal: ko.observable("0.00"),
    }

    var viewModel = {
        viewShown: function () {
            $('#slideLogo').focus();
            ConsultarTipoCambioNoCliente(function (data) {
                let compraServ = data.find(itm => itm.Key === "Compra");
                let ventaServ = data.find(itm => itm.Key === "Venta");
                screen.compraVal(compraServ.Value);
                screen.ventaVal(ventaServ.Value);
            });
        },
        viewShowing: function () {
            hideFloatButtons();
        },
        compraVal: screen.compraVal,
        ventaVal: screen.ventaVal,
        clickBack: function () { MobileBanking_App.app.navigate('LandingPage', { root: true }); },
        tooltip: {
            target: "#quetionToolTip",
            showEvent: "click",
            hideEvent: "mouseleave",
            closeOnOutsideClick: true,
            position: "left",
            width: 200,
            contentTemplate: function (data) {
                let content = '<div style=" text-align: justify; white-space: pre-wrap;">' +
                    '<b style="color:#d52133;font-weight:900">¡Recuerda!</b>' +
                    '<div style="color:#333; white-space: pre-wrap;">' +
                    '<b style="font-weight:900">Compra</b> hace referencia a los dólares que el banco te compra.</div>' +
                    '<br/>' +
                    '<div style="color:#333; white-space: pre-wrap;">' +
                    '<b style="font-weight:900">Venta</b> hace referencia a los dólares que el banco te vende.' +
                    '</div>' +
                    '</div>'
                return content;
            }
        }
    };

    return viewModel;
};