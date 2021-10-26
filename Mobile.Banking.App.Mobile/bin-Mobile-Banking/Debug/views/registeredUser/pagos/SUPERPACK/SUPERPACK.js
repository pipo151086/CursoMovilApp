MobileBanking_App.SUPERPACK = function (params) {
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

            var deviceVersion = parseInt(DeviceInfo.DeviceVersion.replace(".", "").substring(0, 2));
            if (deviceType === 'Android') {
                if (deviceVersion < 44 && deviceVersion != 9 && deviceVersion != 10 && deviceVersion != 11) {
                    $('#txtNumeroTelefono').bind('keyup', HandleCharacteresTelefono);

                }
                else {
                    $('#txtNumeroTelefono').bind('input', HandleCharacteresTelefono);
                }
            }
            else {
                $('#txtNumeroTelefono').bind('keyup', HandleCharacteresTelefono);
            }
        },
    };

    function HandleCharacteresTelefono(e) {
        var value = e.target.value;
        if (value.length > ConstantsBehaivor.LENGTH_PHONE) {
            let newVal = value.substring(0, value.length - 1);
            $('#txtNumeroTelefono').dxTextBox('option', 'value', newVal);
            $('#txtNumeroTelefono').dxTextBox('option', 'text', newVal);
        }
        else {
            $('#txtNumeroTelefono').dxTextBox('option', 'value', value);
            $('#txtNumeroTelefono').dxTextBox('option', 'text', value);
        }
    }

    function consultar(params) {
        var isValid = DevExpress.validationEngine.validateGroup(groupValidation).isValid;
        if (isValid) {
            var numeroCuenta = $("#txtNumeroTelefono").dxTextBox('option', 'value')
            var tipoComercio = tipoServicioBasicoStr.SUPERPACKS_CLARO;
            ConsultarCatalogoServicios(tipoComercio, "", numeroCuenta, function (resp) {
                if (!resp || resp == undefined) {
                    showSimpleMessage('Pago de Servicios', 'No Existen Productos', undefined, undefined);
                    return;
                }
                var uri = MobileBanking_App.app.router.format({
                    view: 'SUPERPACKInfo',
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
        MobileBanking_App.app.navigate('TipoServicio', { root: true });
    }

    return viewModel;
};