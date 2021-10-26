MobileBanking_App.InfoTarjeta = function (params) {
    "use strict";

    var datosTarjeta = "";
    if (params.id)
        datosCredito = JSON.parse(params.id);

    if (params.id)
        datosTarjeta = JSON.parse(params.id);
    $.each(SesionMovil.PosicionConsolidada.TarjetasCliente, function (index, item) {
        $.extend(item, { NumeroTarjetaEncript: maskTarjeta(item.NumeroTarjeta, 3, 5) }
        );
        
    })

    var tarjetas = SesionMovil.PosicionConsolidada.TarjetasCliente;
    var listTarjetas = $.map(tarjetas, function (item, index) {
        
        return {
            NumeroTarjetaMostrar: maskTarjeta(item.NumeroTarjeta, 3, 5),
            NumeroTarjeta: item.NumeroTarjeta,
            MonedaTarjeta: item.Moneda
        }
        
    });



    var viewModel = {

        viewShown: function () {

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
        viewHidden: function () {
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
        popupSeleccionTarjeta: setupPopup(false, '90%', 'auto', true, 'Cuenta Origen', true),

       
    };

    viewModel.popupSeleccionTarjeta.onShown = function () {
        $('#floatButtons').hide();
    }

    viewModel.popupSeleccionTarjeta.onHidden = function () {
        $('#floatButtons').show();
    }
    function changeAccount() {
        changePropertyControl('#popupSeleccionTarjeta', typeControl.Popup, 'visible', true);
    }
    function cancelAccount() {
        changePropertyControl('#popupSeleccionTarjeta', typeControl.Popup, 'visible', false);
    }


    viewModel.lkpTarjetas.onSelectionChanged = function (e) {
        datosTarjeta = e.selectedItem;
        if (datosTarjeta) {
        }

        ConsultarSaldosTarjetaWeb(datosTarjeta.NumeroTarjeta, function (e) {
            var saldoTarjeta = e;
            
            $('#txtDescTarjeta').text(datosTarjeta.DescripcionBin);
            $('#spnNumeroTarjeta').text(datosTarjeta.NumeroTarjetaEncript);
            $('#spnDisponCompras').text("(Q)" + Number(saldoTarjeta.DisponibleComprasGTQ).formatMoney(2, '.', ',') + "/" + "($)" + Number(saldoTarjeta.DisponibleComprasUSD).formatMoney(2, '.', ','));
            $('#spDisponRetiros').text("(Q)" + Number(saldoTarjeta.DisponibleRetirosGTQ).formatMoney(2, '.', ',') + "/" + "($)" +   Number(saldoTarjeta.DisponibleRetirosUSD).formatMoney(2, '.', ','));
            $('#spnExtraFin').text("(Q)" + Number(saldoTarjeta.DisponibleExtraGTQ).formatMoney(2, '.', ',') + "/" + "($)" +        Number(saldoTarjeta.DisponibleExtraUSD).formatMoney(2, '.', ','));

        });



        

    };





return viewModel;
};


