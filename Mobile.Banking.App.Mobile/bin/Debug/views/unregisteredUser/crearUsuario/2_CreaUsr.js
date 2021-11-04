MobileBanking_App._2_CreaUsr = function (params) {
    "use strict";

   

    var registroDto = {};

    if (params.id)
        registroDto = JSON.parse(params.id);

    var groupValidation = 'CREATEUSER';
    var arrTipoProducto = undefined;
    var fechaNacimientoInicial = Date.today().addYears(-18).toString('yyyy-MM-dd');
    var fechaNacimientoMaximo = Date.today().addYears(-100).toString('yyyy-MM-dd');

    var viewModel = {
        viewShown: function () {
            $('#slideLogo').focus();
            setupFloatButton(classButtons.Accept, siguiente, undefined, undefined, undefined, undefined, groupValidation);
            $('#dtFechaNacimiento').dxDateBox('option', 'openOnFieldClick', false);
            ConsultarTipoProductoCreaUsuario(function (catalogoProducto) {
                arrTipoProducto = catalogoProducto;
                $('#tipoProducto').dxSelectBox('option', 'dataSource', arrTipoProducto);
            });
            $('#txtNumeroProducto').attr('pattern', '^[0-9]*$');
            $('#txtNumeroProducto').attr('type', 'number');
            var deviceVersion = parseInt(DeviceInfo.DeviceVersion.replace(".", "").substring(0, 2));
            if (deviceType === 'Android') {
                if (deviceVersion < 44 && deviceVersion != 9 && deviceVersion != 10 && deviceVersion != 11) {
                    $('#txtNumeroProducto').bind('keyup', HandleCharNumProd);
                }
                else {
                    $('#txtNumeroProducto').bind('input', HandleCharNumProd);
                }
            }
            else {
                $('#txtNumeroProducto').bind('keyup', HandleCharNumProd);
            }

        },
        viewShowing: function () {
            hideFloatButtons();
        },
        clickBack: function () {
            registroDto.TipoIdentificacion = $('#tipoIdentificacion').dxSelectBox('option', 'value');
            registroDto.Identificacion = $('#txtNumeroDocumento').dxTextBox('option', 'value');
            registroDto.TipoProducto = $('#tipoProducto').dxSelectBox('option', 'value');
            registroDto.NumeroProducto = $('#txtNumeroProducto').dxTextBox('option', 'value');
            registroDto.Moneda = $('#tipoMoneda').dxSelectBox('option', 'value');
            registroDto.FechaNacimiento = $('#dtFechaNacimiento').dxDateBox('option', 'value').toString("yyyy-MM-dd");
            registroDto.NumeroCelular = registroDto.NumeroCelular ? registroDto.NumeroCelular : '';
            registroDto.CorreoElectronico = registroDto.CorreoElectronico ? registroDto.CorreoElectronico : ''
            var uri = MobileBanking_App.app.router.format({
                view: '_1_TermCond',
                id: JSON.stringify(registroDto)
            });
            MobileBanking_App.app.navigate(uri, { root: true });
        },
        groupValidation: groupValidation,
        tipoIdentificacion: setupComboBoxControl(tipoIdentificacion, 'Texto', 'Codigo', registroDto.TipoIdentificacion ? registroDto.TipoIdentificacion : tipoIdentificacion[0].Codigo, false, undefined, undefined, 'Tipo Identificación'),
        txtNumeroDocumento: setupTextBoxDNIControl(registroDto.Identificacion ? registroDto.Identificacion : ''),
        tipoProducto: setupComboBoxControl([], 'Value', 'Key', registroDto.TipoProducto ? registroDto.TipoProducto : undefined, false, undefined, undefined, 'Tipo Producto'),
        txtNumeroProducto: setupTextBoxControl(registroDto.NumeroProducto ? registroDto.NumeroProducto : '', 128, 'No. de producto', typeLetter.upper, undefined, true, typeCharAllowed.OnlyNumber),
        tipoMoneda: setupComboBoxControl(tipoMoneda, 'Texto', 'Codigo', registroDto.Moneda ? registroDto.Moneda : tipoMoneda[0].Codigo, false, undefined, undefined, 'Moneda Producto'),
        dtFechaNacimiento: setupDateControl(new Date(registroDto.FechaNacimiento ? registroDto.FechaNacimiento : fechaNacimientoInicial), new Date(fechaNacimientoMaximo), new Date(fechaNacimientoInicial), 'auto'),
    };

    var HandleCharNumProd = function (e) {
        var value = $('#txtNumeroProducto').dxTextBox('option', 'text');
        if (!/^[0-9]*$/.test(value)) {
            var newVal2 = value.replace(/\D/g, '');
            $('#txtNumeroProducto').dxTextBox('option', 'value', newVal2);
            $('#txtNumeroProducto').dxTextBox('option', 'text', newVal2);
        }
    }



    viewModel.tipoIdentificacion.onValueChanged = function (e) {
        selectTypeDocument(e.value);
    }



    function selectTypeDocument(select) {
        try {
            registroDto.Identificacion = $('#txtNumeroDocumento').dxTextBox('option', 'value');
            switch (select) {
                case 'CED':
                    $('#txtNumeroDocumento').dxTextBox(setupTextBoxDNIControl(registroDto.Identificacion ? registroDto.Identificacion : ''));
                    $('#txtNumeroDocumento').dxTextBox().dxValidator(validateDNI(true, groupValidation, 'Número Documento'));
                    $('#txtNumeroDocumento').dxTextBox('option', 'placeholder', '13 dígitos');
                    break;
                case 'PAS':
                    $('#txtNumeroDocumento').dxTextBox(setupTextPASAPORTControl(registroDto.Identificacion ? registroDto.Identificacion : ''));
                    $('#txtNumeroDocumento').dxTextBox().dxValidator(validatePASS(true, groupValidation, 'Número Documento'));
                    $('#txtNumeroDocumento').dxTextBox('option', 'placeholder', '');
                    break;
            }

        } catch (e) {
            showException(e.message, e.stack, JSON.stringify(select));
        }
    }


    function siguiente(params) {
        var result = params.validationGroup.validate();
        if (result.isValid) {
            registroDto = {
                TipoIdentificacion: $('#tipoIdentificacion').dxSelectBox('option', 'value'),
                Identificacion: $('#txtNumeroDocumento').dxTextBox('option', 'value'),
                TipoProducto: $('#tipoProducto').dxSelectBox('option', 'value'),
                NumeroProducto: $('#txtNumeroProducto').dxTextBox('option', 'value'),
                Moneda: $('#tipoMoneda').dxSelectBox('option', 'value'),
                FechaNacimiento: $('#dtFechaNacimiento').dxDateBox('option', 'value').toString("yyyy-MM-dd"),
                NumeroCelular: registroDto.NumeroCelular ? registroDto.NumeroCelular : '',
                CorreoElectronico: registroDto.CorreoElectronico ? registroDto.CorreoElectronico : ''
            };
            var uri = MobileBanking_App.app.router.format({
                view: '_3_ContactInfo',
                id: JSON.stringify(registroDto)
            });
            MobileBanking_App.app.navigate(uri, { root: true });
        }
        else {
            showWarningMessage(CORE_TAG('DefaultTitle'), CORE_MESSAGE('MissingData'));
        }
    }

    return viewModel;
};