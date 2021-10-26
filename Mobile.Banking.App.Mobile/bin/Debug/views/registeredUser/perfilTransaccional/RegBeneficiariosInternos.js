MobileBanking_App.RegBeneficiariosInternos = function (params) {
    "use strict";

    var result;

    var beneficiarioModel = {
        Beneficiario: ko.observable(),
        NumeroCta: ko.observable(),
        Referencia: ko.observable(),
        IdCliente: ko.observable(),
        IdClienteValido: ko.observable()
    }

    var groupValidation = 'BENEFICIARIOSINTERNOS';

    var viewModel = {
        viewShown: function () {
            SesionMovil.FechaActividadApp = new Date();
            setupFloatButton(classButtons.Save, registrarBeneficiario);
            clearControls();
        },
        viewShowing: function () {
            hideFloatButtons();
        },
        groupValidation: groupValidation,
        txtBeneficiario: setupTextBoxControl(beneficiarioModel.Beneficiario, 128, undefined, typeLetter.upper, stateControl.disabled, true, typeCharAllowed.OnlyText),
        txtNumeroCta: setupTextBoxControl(beneficiarioModel.NumeroCta, 16, undefined, undefined, undefined, false, typeCharAllowed.OnlyNumber),
        txtReferencia: setupTextBoxControl(beneficiarioModel.Referencia, 128, undefined, typeLetter.upper, undefined, true, typeCharAllowed.OnlyText),
        btnVerificar: setupButtonControl('', verificar, undefined, undefined, iconosCore.check_square_o),
    };

    function registrarBeneficiario(params) {
        try {
            var result = params.validationGroup.validate();
            if (result.isValid) {
                if (!$('#txtBeneficiario').dxTextBox('option', 'value')) {
                    showWarningMessage('Registro Beneficiarios', 'Verifique la cuenta ingresada para proceder con la transacción');
                    return;
                }
                var operacionAIngresoOTP = OperacionEjecutar.CuentaBeneficiariaInterna;
                var dto = {
                    Beneficiario: $('#txtBeneficiario').dxTextBox('option', 'value'),
                    EmailBeneficiario: "",
                    EsActivo: false,
                    IdCliente: beneficiarioModel.IdCliente(),
                    IdClienteValido: beneficiarioModel.IdClienteValido(),
                    IdCuentaPermitidaTransferencia: 0,
                    NumeroCuentaValido: $('#txtNumeroCta').dxTextBox('option', 'value'),
                    Referencia: $('#txtReferencia').dxTextBox('option', 'value') == undefined ? '' : $('#txtReferencia').dxTextBox('option', 'value')
                }
                EnviarOTP(SesionMovil.ContextoCliente, function (data) {
                    var resultadoEnviarOTP = data;
                    if (resultadoEnviarOTP) {
                        operacionAIngresoOTP.CuentaBeneficiariaInterna = dto;
                        MobileBanking_App.app.clearState();
                        MobileBanking_App.app.navigate("IngresoOTP/" + JSON.stringify(operacionAIngresoOTP), { root: true });
                    }
                    else {

                    }
                })

            }
        } catch (e) {
            showException(e.message, e.stack, JSON.stringify(params));
        }

    }

    function verificar(params) {
        try {
            var numeroCuenta = $('#txtNumeroCta').dxTextBox('option', 'value');
            
            if (numeroCuenta != undefined && numeroCuenta != '') {
                ConsultaCuentaCanal(numeroCuenta, function (data) {
                    var result = data;
                    if (result != undefined) {
                        beneficiarioModel.IdCliente(SesionMovil.ContextoCliente.CodigoCliente);
                        beneficiarioModel.IdClienteValido(result.IdCliente);
                        if (result.Naturaleza == 'JUD')
                            $('#txtBeneficiario').dxTextBox('option', 'value', result.RazonSocial);
                        else
                            $('#txtBeneficiario').dxTextBox('option', 'value', result.PrimerNombre + ' ' + result.PrimerApellido);
                    }
                });
            }
        } catch (e) {
            showException(e.message, e.stack, JSON.stringify(params));
        }

    }

    function clearControls() {
        changePropertyControl('#txtNumeroCta', typeControl.TextBox, 'value', undefined);
        changePropertyControl('#txtBeneficiario', typeControl.TextBox, 'value', undefined);
        changePropertyControl('#txtReferencia', typeControl.TextBox, 'value', undefined);
        DevExpress.validationEngine.resetGroup(groupValidation);
        $('#txtNumeroCta').dxTextBox('instance').focus();
    }

    return viewModel;
};