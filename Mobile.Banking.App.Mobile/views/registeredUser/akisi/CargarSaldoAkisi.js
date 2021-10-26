MobileBanking_App.CargarSaldoAkisi = function (params) {
    "use strict";

    var groupValidation = 'VALAKISI';
    var viewModel = {
        viewShowing: function () {
            hideFloatButtons();
        },
        viewShown: function () {
            setupFloatButton(classButtons.Cancel, cancelar, undefined, sizeFloatButtons.small, typeFloatButtons.white);
            setupFloatButton(classButtons.Accept, consultar, undefined, undefined, undefined, undefined, groupValidation);
            $('#currSymbol').text('Q.');
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
        txtMonto: setupNumberBox(0, 0.01, 10000, '40%'),
        txtNumeroTelefono: setupHibridPhoneControl('', undefined, ''),
        groupValidation: groupValidation
    };

    function consultar(params) {
        var isValid = DevExpress.validationEngine.validateGroup(groupValidation).isValid;
        if (isValid == true) {
            var numeroTelefono = $('#txtNumeroTelefono').dxTextBox('option', 'value');
            var monto = $('#txtMonto').dxNumberBox('option', 'value');
            if (monto <= 0) {
                showSimpleMessage('Banca Móvil', 'Falta ingresar el monto para continuar.', function () {

                })
                return;
            }
            var moneda = 'GTQ';
            ConsultaClienteBilletera(undefined, moneda, monto, numeroTelefono, function (data) {
                var simboloMoneda = (moneda === 'GTQ') ? '(Q.)' : '($)';
                var cargaSaldoAkisi = {
                    numeroTelefono: numeroTelefono,
                    monto: monto,
                    moneda: moneda,
                    consultaResult: data,
                    montoMostrar: simboloMoneda + ' ' + Number(monto).formatMoney(2, '.', ',')
                };
                MobileBanking_App.app.navigate('ConfirmacionCargaSaldoAkisi/' + JSON.stringify(cargaSaldoAkisi), { root: true });
            });
        }
    }


    function cancelar(e) {
        MobileBanking_App.app.navigate('PosicionConsolidada', { root: true });
    }

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

    return viewModel;
};