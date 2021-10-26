MobileBanking_App.BloqueoDesbloqueoBilleteraMovil = function (params) {
    "use strict";

    var arrayBilleteraMovil = [];

    arrayBilleteraMovil = $.map(SesionMovil.PosicionConsolidada.CuentasCliente, function (item, index) {
        if (item.CodigoCuentaBilletera)
            return { Codigo: item.CodigoCuentaBilletera, Descripcion: item.CelularAsociado + ' - ' + maskTarjeta(item.Codigo, 4, 4), SaldoDisponible: item.SaldoDisponible, CelularAsociado: item.CelularAsociado, Moneda: item.Moneda }
    });

    var Transactions = [
       { Codigo: 'BLOQUEO', Descripcion: 'BLOQUEO' },
       { Codigo: 'DESBLOQUEO', Descripcion: 'DESBLOQUEO' },
       { Codigo: 'DESENROLAMIENTO', Descripcion: 'DESAFILIAR' }
    ]

    var groupValidation = 'BLOQDESBDESENROLBILLETERAMOVIL';

    var viewModel = {
        groupValidation: groupValidation,
        lkpBilleteraMovil: setupLookupControl(undefined, arrayBilleteraMovil, 'Descripcion', 'Codigo', false, 'instantly', undefined, function (itemData, itemIndex, itemElement) {
            var content = "<div style='margin-left:20px; font-size:18px;'>";
            content = content + "<span style='font-size:18px; font-weight:bold'>" + itemData.Descripcion + "</span>";
            content = content + "<span style='font-size:14px; font-style:italic; display:block'>$" + itemData.SaldoDisponible + "</span>";
            content = content + "</div>";
            return content;
        }, 'Billetera Móvil'),
        koTxtReference: setupTextBoxControl('', 64, 'Referencia', typeLetter.upper),
        lkpTransaction: setupLookupControl(undefined, Transactions, 'Descripcion', 'Codigo', false, 'instantly', undefined, function (itemData, itemIndex, itemElement) {
            var content = "<div style='margin-left:10px;margin-top:18px;display: initial; font-size:18px; font-weight:bold'>";
            content = content + "<span style='display:inline-block'>" + itemData.Descripcion + "</span><br/>";
            content = content + "</div>";
            content = content + "<br />";
            return content;
        }, 'Transacción'),
        viewShown: function (e) {
            SesionMovil.FechaActividadApp = new Date();
            hideFloatButtons();
            setupFloatButton(classButtons.Cancel, cancelar, undefined, sizeFloatButtons.small, typeFloatButtons.white);
            setupFloatButton(classButtons.Accept, confirmar, undefined, undefined, undefined, undefined, groupValidation);
            limpiarControles();

            if (arrayBilleteraMovil.length == 0) {
                showSuccessMessage('Billetera Móvil', 'No tienes Billetera Móvil asignada', function () {
                    MobileBanking_App.app.navigate('PosicionConsolidada', {
                        root: true
                    });
                })
            }
        }
    };

    function cancelar() {
        MobileBanking_App.app.navigate('PosicionConsolidada', { root: true });
    }

    function confirmar(params) {
        try {
            var result = params.validationGroup.validate();
            if (result.isValid) {

                var data = {
                    telefono: $('#lkpBilleteraMovil').dxLookup('option', 'selectedItem').CelularAsociado,
                    accion: $('#lkpTransaction').dxLookup('option', 'selectedItem').Codigo,
                    motivoDesenrolamiento: $('#txtReference').dxTextBox('option', 'value')
                }
             
                AdministrarBIMO(data.telefono, data.accion, data.motivoDesenrolamiento, function (data) {
                   
                    if (data.ok) {
                        showSuccessMessage('Billetera Móvil', 'Operación exitosa', function () {
                            LogIn(SesionMovil.ControlAccesoGlobal.NombreUsuario, SesionMovil.ContextoCliente.PasswordClaro, currentPosition.PosicionInsertar, false, function (resultLogin) {
                                initSession(resultLogin);
                                SesionMovil = getObjectSession();
                                MobileBanking_App.app.navigate('PosicionConsolidada', { root: true });
                            })
                        })
                    }

                });
            }

        } catch (e) {
            showException(e.message, e.stack);
        }
    }

    function limpiarControles() {
        $('#txtReference').dxTextBox('option', 'value', undefined);
        DevExpress.validationEngine.resetGroup(groupValidation);
    }

    return viewModel;
};