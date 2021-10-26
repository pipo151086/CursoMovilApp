MobileBanking_App.PlanConmigo = function (params) {
    "use strict";

    var datosTarjeta = SesionMovil.PosicionConsolidada.TarjetasCliente[0];

    var coleccionTarjetasPlanConmigo = [];

    var viewModel = {
        viewShown: function () {
            VerificarAfiliacion();
            SesionMovil.FechaActividadApp = new Date();
            $('#rdbTarjetas').dxRadioGroup('option', 'itemTemplate', function (itemData, itemIndex, itemElement) {
                return "<div><span>" + maskTarjeta(itemData.NumeroTarjeta, 3, 5) + "</span></div>";
            })
            //setupFloatButton(classButtons.Accept, accept);
        },
        viewShowing: function () {
            hideFloatButtons();
        },
        marcaTarjeta: datosTarjeta ? datosTarjeta.Marca : '',
        numeroTarjeta: datosTarjeta ? datosTarjeta.NumeroTarjeta : '',
        fechaUltimoCortePlan: datosTarjeta ? datosTarjeta.FechaUltimoCorte : '',
        saldoPuntosAnterior: datosTarjeta ? datosTarjeta.RecSaldoPtos : '',
        puntosGanados: datosTarjeta ? datosTarjeta.RecPtosGanados : '',
        puntosCanjeados: datosTarjeta ? datosTarjeta.RecPtosCanjeados : '',
        totalPuntosAcumulados: datosTarjeta ? datosTarjeta.RecTotalPtosAcumulados : '',

        btnCambiarTarjeta: setupButtonControl(datosTarjeta ? maskTarjeta(datosTarjeta.NumeroTarjeta, 3, 5) : maskTarjeta(coleccionTarjetasPlanConmigo[0].NumeroTarjeta, 3, 5), changeCard, undefined, undefined, iconosCore.chevron_down, undefined, true),
        popupSeleccionTarjeta: setupPopup(false, '90%', 'auto', true, 'Tarjetas', true),
        rdbTarjetas: setupRadioGroup(datosTarjeta ? datosTarjeta.NumeroTarjeta : coleccionTarjetasPlanConmigo[0].NumeroTarjeta, coleccionTarjetasPlanConmigo, 'NumeroTarjeta', 'NumeroTarjeta'),
        btnCancelar: setupButtonControlDefault(classButtons.Cancel, cancelSelectCard),
    };

    function accept() {
        MobileBanking_App.app.navigate('PosicionConsolidada', { root: true });
    }

    function changeCard() {
        try {
            changePropertyControl('#popupSeleccionTarjeta', typeControl.Popup, 'visible', true);
        } catch (e) {
            showException(e.message, e.stack);
        }
    }

    function VerificarAfiliacion() {
        $.map(SesionMovil.PosicionConsolidada.TarjetasCliente, function (item, index) {
            if (SesionMovil.PosicionConsolidada.TarjetasCliente[index].RecAfiliado === true && SesionMovil.PosicionConsolidada.TarjetasCliente[index].EsPrincipal === true) {
                coleccionTarjetasPlanConmigo.push(SesionMovil.PosicionConsolidada.TarjetasCliente[index]);
            }
        });
        if (coleccionTarjetasPlanConmigo.length <= 0) {
            showSimpleMessage('Banca Móvil', 'Lamentamos informarte que tu no cuentas con el Plan de recompensa, acercate a tu agencia más cercana para mayor información.', function () {
                MobileBanking_App.app.navigate('PosicionConsolidada', { root: true });
            }, undefined);
        } else {
            selectCard();
        }
    }



    function selectCard() {
        try {
            changePropertyControl('#popupSeleccionTarjeta', typeControl.Popup, 'visible', false);
            var cardSelected = $('#rdbTarjetas').dxRadioGroup('option', 'value');
            changePropertyControl('#btnCambiarTarjeta', typeControl.Button, 'text', maskTarjeta(cardSelected, 3, 5));
            for (var i = 0; i < SesionMovil.PosicionConsolidada.TarjetasCliente.length; i++) {
                if (cardSelected == SesionMovil.PosicionConsolidada.TarjetasCliente[i].NumeroTarjeta) {
                    datosTarjeta = SesionMovil.PosicionConsolidada.TarjetasCliente[i];
                    i = SesionMovil.PosicionConsolidada.TarjetasCliente.length;
                }
            }
            if (datosTarjeta) {
                $('#datosTarjeta').show();
                viewModel.numeroTarjeta = datosTarjeta.NumeroTarjeta;
                viewModel.fechaUltimoCortePlan = Date.parse(datosTarjeta.FechaUltimoCorte).toString("dd/MM/yyyy");
                viewModel.saldoPuntosAnterior = datosTarjeta.RecSaldoPtos;
                viewModel.puntosGanados = datosTarjeta.RecPtosGanados;
                viewModel.puntosCanjeados = datosTarjeta.RecPtosCanjeados;
                viewModel.totalPuntosAcumulados = datosTarjeta.RecTotalPtosAcumulados;
                //$('#spnNumeroTarjeta').text(maskTarjeta(viewModel.numeroTarjeta, 3, 5));
                $('#spnFechaCortePlan').text(viewModel.fechaUltimoCortePlan);
                $('#spnSaldoPuntosAnterior').text(viewModel.saldoPuntosAnterior);
                $('#spnPuntosGanados').text(viewModel.puntosGanados);
                $('#spnPuntosCanjeados').text(viewModel.puntosCanjeados);
                $('#spnTotalPuntosAcumulados').text(viewModel.totalPuntosAcumulados);
            } else {
                $('#datosTarjeta').hide();
                $('#movimientosTarjeta').hide();
            }
        } catch (e) {
            showException(e.message, e.stack);
        }
    }

    function cancelSelectCard() {
        changePropertyControl('#popupSeleccionTarjeta', typeControl.Popup, 'visible', false);
    }

    return viewModel;
};