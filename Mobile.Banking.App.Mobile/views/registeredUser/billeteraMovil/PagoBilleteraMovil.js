MobileBanking_App.PagoBilleteraMovil = function (params) {
    "use strict";

    var arrayBilleteraMovil = [];

    var groupValidation = 'PAGOBILLETERAMOVIL'

    var viewModel = {
        groupValidation: groupValidation,
        txtMonto: setupNumberBox(undefined, 0.01, 5000, '40%'),
        txtCelularBeneficiario: setupTextPhoneControl(undefined, typePhones.Mobile, undefined),
        txtConcepto: setupTextBoxControl('', 35, 'Concepto', typeLetter.upper),
        txtCorreoBeneficiario: setupEmailControl('', 128, undefined, 'Opcional'),

        lkpBilleteraMovil: setupLookupControl(undefined, arrayBilleteraMovil, 'Descripcion', 'Codigo', false, 'instantly', undefined, function (itemData, itemIndex, itemElement) {
            var content = "<div style='margin-left:20px; font-size:18px;'>";
            content = content + "<span style='font-size:18px; font-weight:bold'>" + itemData.Descripcion + "</span>";
            content = content + "<span style='font-size:14px; font-style:italic; display:block'>$" + itemData.SaldoDisponible + "</span>";
            content = content + "</div>";
            return content;
        }, 'Billetera Móvil'),

        viewShown: function (e) {
            hideFloatButtons();
            SesionMovil.FechaActividadApp = new Date();
            setupFloatButton(classButtons.Cancel, cancelar, undefined, sizeFloatButtons.small, typeFloatButtons.white);
            setupFloatButton(classButtons.Accept, pagar, undefined, undefined, undefined, undefined, groupValidation);
            limpiarControles();

            arrayBilleteraMovil = [];

            arrayBilleteraMovil = $.map(SesionMovil.PosicionConsolidada.CuentasCliente, function (item, index) {
                if (item.EsHabilitadoBiMo)
                    return {
                        Codigo: item.CodigoCuentaBilletera, Descripcion: item.CelularAsociado + ' - ' + maskTarjeta(item.Codigo, 4, 4), SaldoDisponible: item.SaldoDisponible, CelularAsociado: item.CelularAsociado, Moneda: item.Moneda
                    }
            });

            $('#lkpBilleteraMovil').dxLookup('option', 'value', undefined);

            if (arrayBilleteraMovil.length > 0) 
                $('#lkpBilleteraMovil').dxLookup('option', 'dataSource', arrayBilleteraMovil);

            if (arrayBilleteraMovil.length == 0) {
                showSuccessMessage('Billetera Móvil', 'No tienes Billetera Móvil asignada', function () {
                    MobileBanking_App.app.navigate('PosicionConsolidada', { root: true });
                })
            }

        }
    };

    function pagar(params) {  
        var result = params.validationGroup.validate();
        if (result.isValid) {

            var celularBeneficiario = $('#txtCelularBeneficiario').dxTextBox('option', 'value');

            ConsultarComisionBIMO(celularBeneficiario, function (data) {
                var montoUsoCanal = parseFloat(data.montoUsoCanal.toFixed(2));
                var confirmar = {
                    Monto: $('#txtMonto').dxNumberBox('option', 'value'),
                    CelularAsociado: $('#lkpBilleteraMovil').dxLookup('option', 'selectedItem').CelularAsociado,
                    CuentaBilletera: $('#lkpBilleteraMovil').dxLookup('option', 'selectedItem').Descripcion,
                    CelularBeneficiario: celularBeneficiario,
                    Concepto: $('#txtConcepto').dxTextBox('option', 'value'),
                    EmailTercero: $('#txtCorreoBeneficiario').dxTextBox('option', 'value'),
                    PagoPendienteId: "00000",
                    TipoTransaccion: "PAGO",
                    Moneda: $('#lkpBilleteraMovil').dxLookup('option', 'selectedItem').Moneda,
                    ValorUsoCanal: montoUsoCanal,
                    ValorTotal: $('#txtMonto').dxNumberBox('option', 'value') + montoUsoCanal,
                };

                MobileBanking_App.app.navigate('ConfirmacionPagoBilleteraMovil/' + JSON.stringify(confirmar), { root: true });

            });

           
        } 
    };

    function cancelar() {
        MobileBanking_App.app.navigate('PosicionConsolidada', { root: true });
    }

    function limpiarControles() {
        $('#txtMonto').dxNumberBox('option', 'value', undefined);
        $('#txtConcepto').dxTextBox('option', 'value', undefined);
        $('#txtCorreoBeneficiario').dxTextBox('option', 'value', undefined);
        DevExpress.validationEngine.resetGroup(groupValidation);
    }


    return viewModel;
};