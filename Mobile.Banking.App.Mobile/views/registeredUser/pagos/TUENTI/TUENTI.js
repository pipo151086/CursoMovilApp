MobileBanking_App.TUENTI = function (params) {
    "use strict";

    var groupValidation = 'groupValidator';

    var viewModel = {
        viewShowing: function () {
            hideFloatButtons();
        },
        txtNumeroTelefono: setupHibridPhoneControl('', undefined, ''),//ko.observable(),
        groupValidation: groupValidation,
        viewShown: function () {
            setupFloatButton(classButtons.Cancel, cancelar, undefined, sizeFloatButtons.small, typeFloatButtons.white);
            setupFloatButton(classButtons.Accept, consultar, undefined, undefined, undefined, undefined, groupValidation);
        },
    };


    function consultar(params) {
        var isValid = DevExpress.validationEngine.validateGroup(groupValidation).isValid;
        if (isValid) {
            var numeroCuenta = $("#txtNumeroTelefono").dxTextBox('option', 'value')
            var tipoComercio = tipoServicioBasicoStr.TUENTI_PREPAGO_PAQUETES;
            ConsultarCatalogoServicios(tipoComercio, "", numeroCuenta, function (resp) {
                
                if (!resp || resp == undefined) {
                    showSimpleMessage('Pago de Servicios', 'No Existen Productos', undefined, undefined);
                    return;
                }
                var uri = MobileBanking_App.app.router.format({
                    view: 'TUENTIInfo',
                    id: JSON.stringify({
                        numeroCuenta: numeroCuenta,
                        tipoComercio: tipoComercio,
                        resp: resp
                    })
                });
                MobileBanking_App.app.navigate(uri, { root: true });
            });

        }
    }

    function cancelar(e) {
        MobileBanking_App.app.navigate('PosicionConsolidada', { root: true });
    }

    return viewModel;
};