MobileBanking_App.FormComplejo = function (params) {
    "use strict";

    var validationGroupPart1 = 'validationGroupPart1';
    var validationGroupPart2 = 'validationGroupPart2';

    var viewModel = {
        //cuando la vista ya se renderizo
        viewShown: function () {
            // $('#btnValidarNombre').dxButton('option', 'visible', false);
            setupViewListeners();
        },

        //setupComboBoxControl(dataSource, displayMember, valueMember, defaultValue, searchEnabled, typeStateField, width, placeHolder)
        slTipoDocumento: setupComboBoxControl(tipoIdCompleto, 'Texto', 'Codigo', undefined, false, undefined, '50%', 'Selecciona ID'),

        //setupTextBoxControl(defaultValue, maxLenght, placeholder, typeLetterControl, typeStateField, allowSpace, typeChar, specialsChar, preventPropagation)
        txtNumeroDocumento: setupTextBoxControl(undefined, 18, 'PLACEHOLDER', undefined, undefined, false, undefined, false),

        //setupButtonControl(text, action, validationGroup, type, icon, typeStateField, rtlEnabled) 'favorites'
        btnValidar: setupButtonControl('Validar Id', ActionValidarId, validationGroupPart1, undefined, 'fa fa-free-code-camp', undefined, undefined),

        txtNombre: setupTextBoxControl(undefined, 18, 'txtNombre', undefined, undefined, false, undefined, false),
        txtSegundoNombre: setupTextBoxControl(undefined, 18, 'txtSegundoNombre', undefined, undefined, false, undefined, false),
        txtApellido: setupTextBoxControl(undefined, 18, 'txtApellido', undefined, undefined, false, undefined, false),
        txtSegundoApellido: setupTextBoxControl(undefined, 18, 'txtSegundoApellido', undefined, undefined, false, undefined, false),

        btnValidarNombre: setupButtonControl('Validar Id', ValidarNombre, validationGroupPart2, undefined, 'fa fa-thermometer-empty', undefined, undefined),


        //setupPopup(visible, width, height, showTitle, title, showCloseButton, resizeEnabled, toolbarItems)
        popUpFlotante: setupPopup(false, '100%', '100%', true, 'MI POPUP TITULO', true, true, undefined),
        slParametrosSistema: setupComboBoxControl(undefined, 'Key', 'Value', undefined, false, undefined, '100%', 'Selecciona Parametro'),



        validationGroupPart2: validationGroupPart2,
        validationGroupPart1: validationGroupPart1
    };


    //ValidarNombre
    function ValidarNombre(args) {
        var resultadoValidacion2 = DevExpress.validationEngine.validateGroup(validationGroupPart2);
        if (resultadoValidacion2.isValid) {
            GetAppParameters(function (respuestaDelServidor) {
                debugger;
                //respuestaDelServidor = [];
                if (respuestaDelServidor.length <= 0) {
                    //showSimpleMessage(title, message, action, sound) 
                    //showQuestionMessage(title, message, actionYes, actionNo, sound) 
                    //showWarningMessage(title, CORE_MESSAGE('ErrorData')
                    showSimpleMessage('MI TITULO', 'Pana Recupero 0', function () {
                        alert('YO SOY UNICO MENSAJE SIN FORMATO')
                    }, undefined);
                }
                else {
                    debugger;
                    $('#popUpFlotante').dxPopup('option', 'visible', true);
                    $('#slParametrosSistema').dxSelectBox('option', 'dataSource', respuestaDelServidor);
                }
            })
        }
    }













    //Accion al detonar el Btn
    function ActionValidarId(arg) {
        debugger;
        var resultadoValidacion = DevExpress.validationEngine.validateGroup(validationGroupPart1);
        if (resultadoValidacion.isValid) {
            $('#btnValidarId').dxButton('option', 'visible', false);
            $('#miFormComplejoPart2').show();
        } else {
            $('#miFormComplejoPart2').hide();
            $('#btnValidarId').dxButton('option', 'visible', true);
        }
    }


    debugger;
    viewModel.slTipoDocumento.onValueChanged = function (args) {
        let tipoIdSeleccionado = args.value;
        switch (tipoIdSeleccionado) {
            case 'CED':
                $('#txtNumeroDocumento').dxTextBox(setupTextBoxDNIControl('2126190470101', undefined)).dxValidator(
                    validateDNI(true, validationGroupPart1, 'Pues este es DNI')
                );

                break;
            case 'PAS':
                $('#txtNumeroDocumento').dxTextBox(setupTextPASAPORTControl('', undefined)).dxValidator(
                    validatePASS(true, validationGroupPart1, 'PASAPORTEEEEEEEEE')
                );
                $('#txtNumeroDocumento').dxTextBox('option', 'placeholder', 'Ingresa tu Pasaporte');

                break;
            case 'RUC':
                $('#txtNumeroDocumento').dxTextBox(setupTextRUCControl('', undefined)).dxValidator(
                    validateRUC(true, validationGroupPart1, 'Pues este es RUC')
                );
                $('#txtNumeroDocumento').dxTextBox('option', 'placeholder', 'Ingresa tu Nit');

                break;
        }
    }

    function setupViewListeners() {
        var deviceVersion = parseInt(DeviceInfo.DeviceVersion.replace(".", "").substring(0, 2));
        if (deviceType === 'Android') {
            if (deviceVersion < 44 && deviceVersion != 9 && deviceVersion != 10 && deviceVersion != 11) {
                $('#txtNumeroDocumento').bind('keyup', HndleCharNumDoc);
            }
            else {
                $('#txtNumeroDocumento').bind('input', HndleCharNumDoc);
            }
        }
        else {
            $('#txtNumeroDocumento').bind('keyup', HndleCharNumDoc);
        }
    }

    //Manejador de Caracteres y expresiones en el Campo de NUMERO DE DOCUMENTO
    function HndleCharNumDoc(args) {
        //Recupero tipo de documento
        var selectedVal = $('#slTipoDocumento').dxSelectBox('option', 'value');
        //Recupero el valor del documento
        var value = $('#txtNumeroDocumento').dxTextBox('option', 'value');
        //variable para setear la validacion LIMPIO
        var newVal2 = '';
        switch (selectedVal) {
            case 'CED':
                if (!/^[0-9]*$/.test(value))
                    newVal2 = value.replace(/\D/g, '');
                if (value.length > ConstantsBehaivor.LENGTH_DNI)
                    newVal2 = value.substring(0, value.length - 1);

                break;
            case 'PAS':
                if (value.length > ConstantsBehaivor.LENGTH_PASSPORT)
                    newVal2 = value.substring(0, value.length - 1);
                break
            case 'RUC':
                if (!/^[0-9]*$/.test(value))
                    newVal2 = value.replace(/\D/g, '');
                if (value.length > ConstantsBehaivor.LENGTH_RUC)
                    newVal2 = value.substring(0, value.length - 1);
                break
        };
        $('#txtNumeroDocumento').dxTextBox('option', 'value', newVal2);
        $('#txtNumeroDocumento').dxTextBox('option', 'text', newVal2);
    }

    return viewModel;
};