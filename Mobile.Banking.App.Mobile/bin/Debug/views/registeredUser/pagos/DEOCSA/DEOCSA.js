MobileBanking_App.DEOCSA = function (params) {
    "use strict";

    var groupValidation = 'PagoDEOCSA_NIS'
    var groupValidation2 = 'PagoDEOCSA_NIR'
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
        txtNumeroDocumento: setupTextBoxControl ('', 256, 'Documento', typeLetter.upper, undefined, true, typeCharAllowed.OnlyNumber),
       
        valorTotalPagar: (1, 1, 35000, undefined, undefined, undefined, 'Valor a Pagar', undefined),
        groupValidation: groupValidation,
        groupValidation2: groupValidation2,



        //txtNir: setupNumberBox('', undefined, 10, undefined, 18, undefined, 'Nir (18 Números)', false, 18),
        //txtNis: setupNumberBox('', undefined, undefined, undefined, 10, undefined, 'Nis (7-10 Números)', false, 7),

    };



    function consultar(params) {
        var tipoBusqueda = $('#slTipoBusqueda').dxSelectBox('option', 'value')

        var isValid = DevExpress.validationEngine.validateGroup(groupValidation).isValid;
        if (tipoBusqueda === '1')
            isValid = isValid && DevExpress.validationEngine.validateGroup(groupValidation2).isValid;

        if (isValid) {
            var monto = $('#valorTotalPagar').dxNumberBox('option', 'value');
            var currentPayment = {
                numeroCuenta: $('#txtNumeroDocumento').dxTextBox('option', 'value'),
                tipoComercio: tipoServicioBasicoStr.ENERGUATE_DEOCSA,
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

            var requerimiento = {
                Comercio: tipoServicioBasicoStr.ENERGUATE_DEOCSA,
                TipoCuenta: tipoBusqueda,
                NumeroCuenta: currentPayment.numeroCuenta,
            }

            if (tipoBusqueda === '0') {
                ConsultaPagoServicios(requerimiento, function (respSaldo) {
                    if (!respSaldo)
                        showSimpleMessage('Pago de Serivcios', 'No se obtubo el saldo a cancelar', function () {
                            return;
                        }, undefined);
                    else {
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
                view: 'DEOCSAPagarServicio',
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
            //$("#NIR").show();

        }
        else {
            $("#divValorPagar").hide();
            //$("#NIS").show();
        }
    }

    return viewModel;
};