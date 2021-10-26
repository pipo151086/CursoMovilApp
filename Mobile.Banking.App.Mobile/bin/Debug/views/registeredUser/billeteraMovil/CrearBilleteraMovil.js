MobileBanking_App.CrearBilleteraMovil = function (params) {
    "use strict";

    var Accounts = [] //Cuentas 

    $.each(SesionMovil.PosicionConsolidada.CuentasCliente, function (index, value) {
       
        if (!value.CodigoCuentaBilletera)
        {
            var account = {
                rawObject: value,
                Codigo: value.Codigo,
                Descripcion: maskTarjeta(value.Codigo, 4, 4),
                Tipo: "CTA",
                Disponible: Number(String(value.SaldoDisponible).replace(',', '')).formatMoney(2, '.', ',')
            }
            Accounts.push(account);
        }
       
    });

    var groupValidation = 'CREARBILLETERAMOVIL'

    var viewModel = {
        groupValidation: groupValidation,
        koTxtWarningOne: ko.observable('Antes de realizar transacciones debes afiliar tu cuenta a tu celular.'),
        koBtnRegisterPhone: setupButtonControl('Registrar Celular', registrarCelular, undefined, undefined, undefined, undefined, true),
        koTxtTiePhone: ko.observable('Atar cuenta a celular.'),
        koTxtPhoneNumber: setupTextPhoneControl(undefined, typePhones.Mobile, undefined),
        koTxtWarningTwo: ko.observable('Recuerda que el sistema grabará esta referencia sin considerar la diferencia entre mayúsculas y minúsculas'),
        lkpCuentaPropia: setupLookupControl(undefined, Accounts, 'Descripcion', 'Codigo', false, 'instantly', undefined, function (itemData, itemIndex, itemElement) {
            var content = "<div style='margin-left:20px; font-size:18px;'>";
            //content = content + "<img style='display:inline-block; margin-right:10px; width:24px; height:24px' src='images/CTA.png' />";
            content = content + "<span style='font-size:18px; font-weight:bold'>" + itemData.Descripcion + "</span>";
            content = content + "<span style='font-size:14px; font-style:italic; display:block'>$" + itemData.Disponible + "</span>";
            content = content + "</div>";
            return content;
        }, 'Cuenta Propia'),

        viewShown: function (e) {
            hideFloatButtons();
            SesionMovil.FechaActividadApp = new Date();
            setupFloatButton(classButtons.Cancel, cancelar, undefined, sizeFloatButtons.small, typeFloatButtons.white);
            setupFloatButton(classButtons.Accept, registrar,undefined,undefined,undefined,undefined,groupValidation);
            limpiarControles();

            if (Accounts.length == 0) {
                showSuccessMessage('Billetera Móvil', 'No tienes cuentas para afiliar.', function () {
                    MobileBanking_App.app.navigate('PosicionConsolidada', { root: true });
                })
            }
        }
    };

    function registrar(params) {
        try {
            var result = params.validationGroup.validate();
            if (result.isValid) {

                var confirmar = {
                    telefono: $('#txtPhoneNumber').dxTextBox('option', 'value'),
                    numeroCuenta: $('#lkpCuentaPropia').dxLookup('option', 'selectedItem').Codigo,
                    numeroCuentaMask: $('#lkpCuentaPropia').dxLookup('option', 'selectedItem').Descripcion,
                }

                MobileBanking_App.app.navigate('ConfirmacionCrearBilleteraMovil/' + JSON.stringify(confirmar), { root: true });

            }
        } catch (e) {
            showException(e.message, e.stack);
        }
    }

    function cancelar() {
        MobileBanking_App.app.navigate('PosicionConsolidada', { root: true });
    }

    function registrarCelular() {
        
    }


    function limpiarControles() {      
        $('#txtPhoneNumber').dxTextBox('option', 'value', undefined);
        DevExpress.validationEngine.resetGroup(groupValidation);
    }


    return viewModel;
};