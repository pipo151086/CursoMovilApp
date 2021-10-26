var Contactenos = function () {
    var that = this;
    var groupValidation = 'CONTACTENOS';
    var caracteresMsj = 0;
    that.configurarControles = function () {

        $('#loadPanel').dxLoadPanel({ text: 'Enviando Mensaje', visible: false });
        $('#txtMotivoContacto').dxTextBox(setupTextBoxControl('', 32, 'Motivo', typeLetter.upper));
        $('#txtCorreoContacto2').dxTextBox(setupEmailControl(undefined, undefined));
        $('#txtTelefonoContacto2').dxNumberBox(setupTextPhoneControl(undefined, typePhones.Mobile,undefined,'8 dígitos'));
        $('#txtMensajeContacto').dxTextArea(setupTextAreaControl(undefined, undefined, '100%', 50)).dxValidator(validateRequired(groupValidation, 'Mensaje'));
        //$('#txtMensajeContacto').dxTextArea().dxValidator(validateRequired(groupValidation, 'Mensaje'))
        $('#txtMotivoContacto').dxTextBox().dxValidator(validateRequired(groupValidation, 'Motivo'))
        $('#txtTelefonoContacto2').dxNumberBox().dxValidator(validateRequired(groupValidation, 'teléfono'));
        $('#txtCorreoContacto2').dxTextBox().dxValidator(validateEmail(true, groupValidation, 'correo'))
        $('#btnEnviarMensaje').dxButton(setupButtonControl('Enviar', sendEmail, groupValidation, undefined, iconosCore.send));
        $('#txtMensajeContacto').dxTextArea('option', 'onKeyUp', function (e) {
            var value = e.jQueryEvent.currentTarget.value;
            var caracteresRestantes = 200 - value.length;
            $('#numCaracteres').text('(' + caracteresRestantes + ' / 200 caracteres)');
            if (caracteresRestantes <= 0) {
                e.jQueryEvent.currentTarget.value = value.substring(0, value.length - 1);
            }
        })

        $('#txtTelefonoContacto2').dxNumberBox('option', 'onKeyUp', function (e) {
            var value = e.jQueryEvent.currentTarget.value;
            if (value.length > ConstantsBehaivor.LENGTH_PHONE) {
                e.jQueryEvent.currentTarget.value = value.substring(0, value.length - 1);
            }
        })


    }

    function sendEmail(params) {
        var result = params.validationGroup.validate();
        if (result.isValid) {
            var tema = $('#txtMotivoContacto').dxTextBox('option', 'value');

            var numeroTelefonoSecundario = $('#txtTelefonoContacto2').dxNumberBox('option', 'value');
            var cuerpo = $('#txtMensajeContacto').dxTextArea('option', 'value');
            var correoElectronicoSecundario = $('#txtCorreoContacto2').dxTextBox('option', 'value');
            $('.open-right-sidebar').click();
            setTimeout(function () {
                EnviarCorreoContacto(SesionMovil.ContextoCliente, tema, numeroTelefonoSecundario, cuerpo, SesionMovil.ControlAccesoGlobal, correoElectronicoSecundario, function () {
                    showSuccessMessage('Contáctenos', 'Su requerimiento ha sido enviado con éxito. Nos estaremos comunicando con usted lo más pronto posible.')
                    clearControls();
                });
            }, 500);
        }
    }
}



function clearControls() {
    try {
        $('#txtMotivoContacto').dxTextBox('option', 'value', undefined);
        $('#txtTelefonoContacto2').dxNumberBox('option', 'value', undefined);
        $('#txtMensajeContacto').dxTextArea('option', 'value', undefined);
        $('#txtCorreoContacto2').dxTextBox('option', 'value', undefined);

    } catch (e) {
        showException(e.message, e.stack);
    }

}


$(function () {
    MobileBanking_App.contactenos = new Contactenos();
    //contactenos.configurarControles();
})