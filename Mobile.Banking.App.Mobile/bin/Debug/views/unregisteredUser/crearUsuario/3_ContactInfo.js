MobileBanking_App._3_ContactInfo = function (params) {
    "use strict";

    var registroDto = {};

    if (params.id)
        registroDto = JSON.parse(params.id);

    var groupValidation = "CONTACT_INFO";

    var viewModel = {
        viewShown: function () {
            $('#slideLogo').focus();
            setupFloatButton(classButtons.Accept, siguiente, undefined, undefined, undefined, undefined, groupValidation);
            var deviceVersion = parseInt(DeviceInfo.DeviceVersion.replace(".", "").substring(0, 2));
            if (deviceType === 'Android') {
                if (deviceVersion < 44 && deviceVersion != 9 && deviceVersion != 10 && deviceVersion != 11) {
                    $('#txtTelef').bind('keyup', HandleCharacteresTelefono);
                    $('#txtTelefConfirm').bind('keyup', HandleCharacteresTelefono);
                }
                else {
                    $('#txtTelef').bind('input', HandleCharacteresTelefono);
                    $('#txtTelefConfirm').bind('input', HandleCharacteresTelefono);
                }
            }
            else {
                $('#txtTelef').bind('keyup', HandleCharacteresTelefono);
                $('#txtTelefConfirm').bind('keyup', HandleCharacteresTelefono);
            }
        },
        viewShowing: function () {
            hideFloatButtons();
        },
        clickBack: function () {
            registroDto.NumeroCelular = $('#txtTelefConfirm').dxTextBox('option', 'value');
            registroDto.CorreoElectronico = $('#txtMailConfirm').dxTextBox('option', 'value');
            var uri = MobileBanking_App.app.router.format({
                view: '_2_CreaUsr',
                id: JSON.stringify(registroDto)
            });
            MobileBanking_App.app.navigate(uri, { root: true });
        },
        groupValidation: groupValidation,
        txtMail: setupEmailControl(registroDto.CorreoElectronico ? registroDto.CorreoElectronico : "", 128),
        txtMailConfirm: setupEmailControl("", 128),
        txtTelef: setupTextPhoneControl(registroDto.NumeroCelular ? registroDto.NumeroCelular : '', typePhones.Mobile, undefined, "Celular"),
        txtTelefConfirm: setupTextPhoneControl("", typePhones.Mobile, undefined, "Celular"),
        comparisonTargetMail: function () {
            var corr = $('#txtMail').dxTextBox('instance');
            if (corr) {
                return corr.option('value');
            }
        },
        comparisonTargetTelef: function () {
            var telf = $('#txtTelef').dxTextBox('instance');
            if (telf) {
                return telf.option('value');
            }
        },
    };

    function HandleCharacteresTelefono(e) {
        var value = e.target.value;
        var targetId = '#' + e.currentTarget.id;
        if (value.length > ConstantsBehaivor.LENGTH_PHONE) {
            let newVal = value.substring(0, value.length - 1);
            $(targetId).dxTextBox('option', 'value', newVal);
            $(targetId).dxTextBox('option', 'text', newVal);
        }
        else {
            $(targetId).dxTextBox('option', 'value', value);
            $(targetId).dxTextBox('option', 'text', value);
        }
    }


    function siguiente(params) {
        var result = params.validationGroup.validate();
        if (result.isValid) {
            registroDto.NumeroCelular = $('#txtTelefConfirm').dxTextBox('option', 'value');
            registroDto.CorreoElectronico = $('#txtMailConfirm').dxTextBox('option', 'value');
            RegistroCorreoTeléfonoContacto(registroDto, function (data) {
                var uri = MobileBanking_App.app.router.format({
                    view: '_4_Confirm',
                    id: JSON.stringify(registroDto)
                });
                MobileBanking_App.app.navigate(uri, { root: true });
            });
        }
        else {
            showWarningMessage(CORE_TAG('DefaultTitle'), CORE_MESSAGE('MissingData'));
        }
    }

    return viewModel;
};