MobileBanking_App.NotificacionCobroBilleteraMovil = function (params) {
    "use strict";

    var arrayBilleteraMovil = [];

    var groupValidation = 'CREARNOTIFICACIONCOBRO'

    var viewModel = {
        groupValidation: groupValidation,
        lkpBilleteraMovil: setupLookupControl(undefined, arrayBilleteraMovil, 'Descripcion', 'Codigo', false, 'instantly', undefined, function (itemData, itemIndex, itemElement) {
            var content = "<div style='margin-left:20px; font-size:18px;'>";
            //content = content + "<img style='display:inline-block; margin-right:10px; width:24px; height:24px' src='images/CTA.png' />";
            content = content + "<span style='font-size:18px; font-weight:bold'>" + itemData.Descripcion + "</span>";
            content = content + "<span style='font-size:14px; font-style:italic; display:block'>$" + itemData.SaldoDisponible + "</span>";
            content = content + "</div>";
            return content;
        }, 'Billetera Móvil'),
        txtNumeroCelular: setupTextPhoneControl(undefined, typePhones.Mobile, undefined),
        txtMontoNotif: setupNumberBox(undefined, 0.01, 5000, '40%'),
        txtReferencia: setupTextBoxControl('', 35, 'Concepto', typeLetter.upper),
        viewShown: function (e) {
            hideFloatButtons();
            SesionMovil.FechaActividadApp = new Date();
            setupFloatButton(classButtons.Cancel, cancelar, undefined, sizeFloatButtons.small, typeFloatButtons.white);
            setupFloatButton(classButtons.Accept, aceptar, undefined, undefined, undefined, undefined, groupValidation);
            limpiarControles();

            arrayBilleteraMovil = [];

            arrayBilleteraMovil = $.map(SesionMovil.PosicionConsolidada.CuentasCliente, function (item, index) {
                if (item.EsHabilitadoBiMo)
                    return {
                        Codigo: item.CodigoCuentaBilletera, Descripcion: item.CelularAsociado + ' - ' + maskTarjeta(item.Codigo, 4, 4), SaldoDisponible: item.SaldoDisponible, CelularAsociado: item.CelularAsociado, Moneda: item.Moneda
                    }
            });

            $('#lkpBilleteraMovil').dxLookup('option', 'value', undefined);

            if (arrayBilleteraMovil.length > 0) {
                $('#lkpBilleteraMovil').dxLookup('option', 'dataSource', arrayBilleteraMovil);
            }


            if (arrayBilleteraMovil.length == 0) {
                showSuccessMessage('Billetera Móvil', 'No tienes Billetera Móvil asignada', function () {
                    MobileBanking_App.app.navigate('PosicionConsolidada', { root: true });
                })
            }
        }
    };

    function aceptar(params) {

        try {
                var result = params.validationGroup.validate();
                if (result.isValid) {

                    var data = {
                        telefonoSolicitante: $('#lkpBilleteraMovil').dxLookup('option', 'selectedItem').CelularAsociado,
                        telefonoReceptorSolicitud: $('#txtNumeroCelular').dxTextBox('option', 'value'),
                        monto: $('#txtMontoNotif').dxNumberBox('option', 'value'),
                        referencia: $('#txtReferencia').dxTextBox('option', 'value'),
                        moneda: $('#lkpBilleteraMovil').dxLookup('option', 'selectedItem').Moneda
                    };

                
                    CrearNotificacionCobroBIMO(data.telefonoSolicitante, data.telefonoReceptorSolicitud, data.monto, data.referencia,data.moneda, function (data) {
                   
                        if (data.ok) {
                            showSuccessMessage('Billetera Móvil', 'Operación exitosa', function () {
                                MobileBanking_App.app.navigate('PosicionConsolidada', { root: true });
                            })
                        }
      
                    });
                }

        } catch (e) {
            showException(e.message, e.stack);
        }

    };

    function cancelar() {
        MobileBanking_App.app.navigate('PosicionConsolidada', { root: true });
    }

    function limpiarControles() { 
        $('#txtNumeroCelular').dxTextBox('option', 'value', undefined);
        $('#txtMontoNotif').dxNumberBox('option', 'value', undefined);
        $('#txtReferencia').dxTextBox('option', 'value', undefined);
        DevExpress.validationEngine.resetGroup(groupValidation);
    }


    return viewModel;
};