MobileBanking_App.DEORSA = function (params) {
    "use strict";

    var groupValidation = 'PagoNIS'
    var groupValidation2 = 'PagoNIR'

    var dsTIPOBUSQUEDA = [
        {
            "Codigo": "0",
            "Valor": "NIS"
        },
        {
            "Codigo": "1",
            "Valor": "NIR"
        }
    ]

    var viewModel = {
        viewShowing: function () {
            hideFloatButtons();
        },
        viewShown: function () {
            setupFloatButton(classButtons.Cancel, cancelar, undefined, sizeFloatButtons.small, typeFloatButtons.white);
            setupFloatButton(classButtons.Accept, consultar, undefined, undefined, undefined, undefined, groupValidation);


        },
        //setupComboBoxControl(dataSource, displayMember, valueMember, defaultValue, searchEnabled, typeStateField, width, placeHolder)
        slTipoBusqueda: setupComboBoxControl(dsTIPOBUSQUEDA, "Valor", "Codigo", '0', false, undefined, undefined, undefined),
        txtNumeroDocumento: setupTextBoxControl('', 256, 'Documento', typeLetter.upper, undefined, true, typeCharAllowed.OnlyNumber),
        valorTotalPagar: (1, 1, 18000, undefined, undefined, undefined, 'Valor a Pagar', undefined),
        groupValidation: groupValidation,
        groupValidation2: groupValidation2
    };




    function consultar(params) {
        var tipoBusqueda = $('#slTipoBusqueda').dxSelectBox('option', 'value')
        var isValid = DevExpress.validationEngine.validateGroup(groupValidation).isValid;
        if (tipoBusqueda === '1')
            isValid = isValid && DevExpress.validationEngine.validateGroup(groupValidation2).isValid;

        if (isValid) {
            var requerimiento = {
                Comercio: tipoServicioBasicoStr.ENERGUATE_DEORSA,
                NumeroCuenta: $('#txtNumeroDocumento').dxTextBox('option', 'value'),
                TipoCuenta: tipoBusqueda,
            }

            var monto = $('#valorTotalPagar').dxNumberBox('option', 'value');
            var currentPayment = {
                numeroCuenta: $('#txtNumeroDocumento').dxTextBox('option', 'value'),
                tipoComercio: tipoServicioBasicoStr.ENERGUATE_DEORSA,
                infoPago: {
                    tipoBusqueda: tipoBusqueda,
                    montoMostrar: 'Q ' + monto.toFixed(2),
                    tipoMostrar: $('#slTipoBusqueda').dxSelectBox('option', 'selectedItem'),
                    monto: monto
                },
                respSaldo: {
                    Saldo: monto,
                    Nombre: "",
                    Direccion: ""
                }
            }

            if (tipoBusqueda === '0') {
                ConsultaPagoServicios(requerimiento, function (respSaldo) {
                    if (!respSaldo) {
                        showSimpleMessage('Pago de Serivcios', 'No se obtubo el saldo a cancelar', function () {
                            return;
                        }, undefined);
                    } else {
                        currentPayment.respSaldo = respSaldo;
                        RedirectOnSuccess(currentPayment);
                    }
                });
            }
            else {
                RedirectOnSuccess(currentPayment);
            }

        }
    }

    function RedirectOnSuccess(currentPayment) {

        var monto = $('#valorTotalPagar').dxNumberBox('option', 'value');
        if (monto >= 0 && monto < 18000) {
            var uri = MobileBanking_App.app.router.format({
                view: 'DEORSAPagarServicio',
                id: JSON.stringify(currentPayment)
            });
            MobileBanking_App.app.navigate(uri, { root: true });

        } else {
            showSimpleMessage('Pago de Serivcios', 'Ingrese un monto valido a pagar (menor que  18000)', function () {
                return;
            }, undefined);


        }


    }

    function cancelar(e) {
        MobileBanking_App.app.navigate('TipoServicio', { root: true });
    }

    viewModel.slTipoBusqueda.onValueChanged = function (e) {
        if (e.value === '1') {
            $("#divValorPagar").show();
        }
        else {
            $("#divValorPagar").hide();
        }
    }
    return viewModel;
};