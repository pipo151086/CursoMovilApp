MobileBanking_App.ForgottenUserName = function (params) {
    "use strict";

    var groupValidation = 'FORGOTTENUSERNAME';
    var catalogoTipoDocumento = [
        { id: 1, Codigo: "CED", tipo: "DPI" },
        { id: 2, Codigo: "PAS", tipo: "PASAPORTE" },
        { id: 3, Codigo: "RUC", tipo: "NIT" }
    ];
    var typeDocumentSelected = catalogoTipoDocumento[0];
    var forgottenUserModel = {
        tipoDocumento: ko.observable(catalogoTipoDocumento[0].Codigo),
        numeroDocumento: ko.observable(),
        claveAcceso: ko.observable()
    }

    var viewModel = {
        viewShown: function () {
            clearControls();
            $('#txtNumeroDocumento').dxTextBox('option', 'placeholder', '13 dígitos');
        },
        clickAtras: function () {
            //MobileBanking_App.app.navigate("RegisterUser", { root: true });
            MobileBanking_App.app.navigate("LandingPage", { root: true });
        },
        groupValidation: groupValidation,
        popupSeleccionTipoDocumento: setupPopup(false, '90%', 'auto', true, 'Tipo de Documento', true),
        rdbTiposDocumento: setupRadioGroup(forgottenUserModel.tipoDocumento, catalogoTipoDocumento, 'tipo', 'Codigo'),
        btnCambiarTipoDocumento: setupButtonControl(catalogoTipoDocumento[0].tipo, changeTypeDocument, undefined, undefined, iconosCore.chevron_down, undefined, true),
        txtNumeroDocumento: setupTextBoxDNIControl(forgottenUserModel.numeroDocumento),
        txtClave: setupTextPasswordControl(forgottenUserModel.claveAcceso, 128, 'Clave', typeLetter.upper),
        btnCancelarTipoDocumento: setupButtonControlDefault(classButtons.Cancel, cancelTypeDocument),
        btnEnviar: setupButtonControl('Enviar', sendRequire, groupValidation, undefined, iconosCore.send),
        validateAndSubmit: function (params) {

        }
    };

    viewModel.txtNumeroDocumento.onEnterKey = function () {
        var value = $('#txtNumeroDocumento').dxTextBox('option', 'value');
        if (value) {
            $('#txtClave').dxTextBox('instance').focus();
        }
    }

    viewModel.txtClave.onEnterKey = function () {
        $('#btnEnviar').click();
    }

    function clearControls() {
        changePropertyControl('#txtNumeroDocumento', typeControl.TextBox, 'value', undefined);
        changePropertyControl('#txtClave', typeControl.TextBox, 'value', undefined);
        typeDocumentSelected = catalogoTipoDocumento[0];
        changePropertyControl('#btnCambiarTipoDocumento', typeControl.Button, 'text', typeDocumentSelected.tipo);
        changePropertyControl('#rdbTiposDocumento', typeControl.RadioGroup, 'value', typeDocumentSelected.Codigo);
        $('#txtNumeroDocumento').dxTextBox('instance').focus();
    }

    function changeTypeDocument() {
        changePropertyControl('#popupSeleccionTipoDocumento', typeControl.Popup, 'visible', true);
    }

    function cancelTypeDocument() {
        changePropertyControl('#popupSeleccionTipoDocumento', typeControl.Popup, 'visible', false);
    }

    viewModel.rdbTiposDocumento.onValueChanged = function (e) {
        try {
            var select = e.value;
            for (var i = 0; i < catalogoTipoDocumento.length; i++) {
                if (catalogoTipoDocumento[i].Codigo == select) {
                    typeDocumentSelected = catalogoTipoDocumento[i];
                    i = catalogoTipoDocumento.length;
                }
            }
            if (typeDocumentSelected) {
                changePropertyControl('#btnCambiarTipoDocumento', typeControl.Button, 'text', typeDocumentSelected.tipo);
                changePropertyControl('#popupSeleccionTipoDocumento', typeControl.Popup, 'visible', false);
                $('#txtNumeroDocumento').dxTextBox('instance').focus();
                selectTypeDocument(typeDocumentSelected);
            }
        } catch (e) {
            showException(e.message, e.stack);
        }
    }

    function selectTypeDocument(select) {
        try {
            switch (select.Codigo) {
                case 'DPI':
                    viewModel.txtNumeroDocumento = setupTextBoxDNIControl();
                    $('#txtNumeroDocumento').dxTextBox().dxValidator(validateDNI(true, groupValidation, 'Número Documento'));
                    $('#txtNumeroDocumento').dxTextBox('option', 'placeholder', '13 dígitos');
                    break;
                case 'PAS':
                    viewModel.txtNumeroDocumento = setupTextPASAPORTControl();
                    $('#txtNumeroDocumento').dxTextBox().dxValidator(validatePASS(true, groupValidation, 'Número Documento'));
                    break;
                case 'NIT':
                    viewModel.txtNumeroDocumento = setupTextRUCControl();
                    $('#txtNumeroDocumento').dxTextBox().dxValidator(validateRUC(true, groupValidation, 'Número Documento'));
                    break;
            }
            $('#txtNumeroDocumento').dxTextBox('option', viewModel.txtNumeroDocumento);
        } catch (e) {
            showException(e.message, e.stack, JSON.stringify(select));
        }
    }

    function sendRequire(params) {
        try {
            var result = params.validationGroup.validate();
            if (result.isValid) {
                var contextoCliente = ContextoCliente;
                contextoCliente.PasswordClaro = forgottenUserModel.claveAcceso().toUpperCase();
                contextoCliente.NumeroDocumento = forgottenUserModel.numeroDocumento().toUpperCase();
                var tipoIdentificacion = $("#rdbTiposDocumento").dxRadioGroup('option', 'value');
                RecuperarNombreUsuarioWeb(contextoCliente, tipoIdentificacion, contextoCliente.NumeroDocumento, function (data) {
                    var ServerResponse = data;
                    if (ServerResponse) {
                        showSuccessMessage(CORE_TAG('DefaultTitle'), CORE_MESSAGE('SendEmailUserName'), function () {
                            //MobileBanking_App.app.navigate('RegisterUser');
                            MobileBanking_App.app.navigate("LandingPage", { root: true });
                        })
                    }
                });

            } else {
                showWarningMessage(CORE_TAG('DefaultTitle'), CORE_MESSAGE('MissingData'));
            }
        } catch (e) {
            showException(e.message, e.stack);
        }
    }

    return viewModel;
};