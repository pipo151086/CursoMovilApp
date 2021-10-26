MobileBanking_App.SolCtaForm1 = function (params) {
    "use strict";

    var CtaDigitalForm = {};
    var CtaDigDPIPasF1 = "CtaDigDPIPasF1";
    var fechaNacimientoInicial = Date.today().addYears(-18).toString('yyyy-MM-dd');
    var fechaNacimientoMaximo = Date.today().addYears(-100).toString('yyyy-MM-dd');
    debugger;

    if (params && params.id)
        CtaDigitalForm = JSON.parse(params.id);

    var viewModel = {
        viewShowing: function () {
            hideFloatButtons();
        },
        viewShown: function () {
            setupPaginatorDots();
            $('#dtFechaNacimientoDpi').dxDateBox('option', 'openOnFieldClick', false);
            showSimpleMessage(CORE_TAG('DefaultTitle'), 'Verifica que la información que se te despliegue sea correcta y esté actualizada, de lo contrario deberás ingresar la información válida.', function () { })
            $('#txtNumeroNitDpi').dxTextBox('option', 'placeholder', '12 dígitos');

            InitialFormValues(CtaDigitalForm.TipoIdentificacion);
            SetupListeners();
        },

        rgTipoIdentificacion: {
            items: tipoIdentificacion,
            layout: "horizontal",
            //value: CtaDigitalForm.TipoIdentificacion
            value: tipoIdentificacion.find(el => el.value === CtaDigitalForm.TipoIdentificacion)
        },

        txtNumeroDocumento: setupTextBoxDNIControl(CtaDigitalForm.NumeroDocumento ? CtaDigitalForm.NumeroDocumento : ''),
        CtaDigDPIPasF1: CtaDigDPIPasF1,
        txtPrimerNombreDpi: setupTextBoxControl(CtaDigitalForm.PrimerNombreDpi, 32, 'Ingresa tu primer nombre', typeLetter.upper, undefined, true, typeCharAllowed.OnlyText),
        txtSegundoNombreDpi: setupTextBoxControl(CtaDigitalForm.SegundoNombreDpi, 32, 'Ingresa tu segundo nombre', typeLetter.upper, undefined, true, typeCharAllowed.OnlyText),
        txtPrimerApellidoDpi: setupTextBoxControl(CtaDigitalForm.PrimerApellidoDpi, 32, 'Ingresa tu primer apellido', typeLetter.upper, undefined, true, typeCharAllowed.OnlyText),
        txtSegundoApellidoDpi: setupTextBoxControl(CtaDigitalForm.SegundoApellidoDpi, 32, 'Ingresa tu segundo apellido', typeLetter.upper, undefined, true, typeCharAllowed.OnlyText),
        txtApellidoCasadaDpi: setupTextBoxControl(CtaDigitalForm.ApellidoCasadaDpi, 32, 'Ingresa tu apellido de casada', typeLetter.upper, undefined, true, typeCharAllowed.OnlyText),
        txtNumeroNitDpi: setupTextRUCControl(CtaDigitalForm.NumeroNitDpi, undefined),
        dtFechaNacimientoDpi: setupDateControl(new Date(CtaDigitalForm.FechaNacimiento ? CtaDigitalForm.FechaNacimiento : fechaNacimientoInicial), new Date(fechaNacimientoMaximo), new Date(fechaNacimientoInicial), 'auto'),
        txtNumeroTelefonoDpi: setupTextPhoneControl(CtaDigitalForm.NumeroTelefonoDpi ? CtaDigitalForm.NumeroTelefonoDpi : '', typePhones.Mobile, undefined, "Ingresa el número de teléfono"),

        rgGenero: {
            items: Genero,
            layout: "horizontal",
            value: Genero.find(el => el.value === CtaDigitalForm.Genero)
        },
        btnValidar: {
            text: "Siguiente",
            disabled: false,
            visible: true,
            readonly: false,
            onClick: function (params) {
                var isValidDpi = DevExpress.validationEngine.validateGroup(CtaDigDPIPasF1).isValid;
                debugger;
                if (isValidDpi) {

                    CtaDigitalForm.TipoIdentificacion = $('#rgTipoIdentificacion').dxRadioGroup('option', 'value').value;
                    CtaDigitalForm.NumeroDocumento = $('#txtNumeroDocumento').dxTextBox('option', 'value');
                    CtaDigitalForm.PrimerNombreDpi = $('#txtPrimerNombreDpi').dxTextBox('option', 'value');
                    CtaDigitalForm.SegundoNombreDpi = $('#txtSegundoNombreDpi').dxTextBox('option', 'value');
                    CtaDigitalForm.PrimerApellidoDpi = $('#txtPrimerApellidoDpi').dxTextBox('option', 'value');
                    CtaDigitalForm.SegundoApellidoDpi = $('#txtSegundoApellidoDpi').dxTextBox('option', 'value');
                    CtaDigitalForm.ApellidoCasadaDpi = $('#txtApellidoCasadaDpi').dxTextBox('option', 'value');
                    CtaDigitalForm.NumeroNitDpi = $('#txtNumeroNitDpi').dxTextBox('option', 'value');
                    CtaDigitalForm.FechaNacimiento = (new Date($('#dtFechaNacimiento').dxDateBox('option', 'value')).toString('yyyy-MM-dd'));
                    CtaDigitalForm.NumeroTelefono = $('#txtNumeroTelefonoDpi').dxTextBox('option', 'value');
                    CtaDigitalForm.Genero = $('#rgGenero').dxRadioGroup('option', 'value').value;


                    debugger;
                    var uri = MobileBanking_App.app.router.format({
                        view: 'SolCtaForm2',
                        id: JSON.stringify(CtaDigitalForm)
                    });
                    MobileBanking_App.app.navigate(uri, { root: true });
                }
            }
        },
        btnRegresar: {
            text: "Volver",
            disabled: false,
            visible: true,
            readonly: false,
            onClick: function (params) {
                var uri;
                if (CtaDigitalForm.TieneSesion === true)
                    uri = MobileBanking_App.app.router.format({
                        view: 'PosicionConsolidada'
                    });
                else
                    uri = MobileBanking_App.app.router.format({
                        view: 'SolCtaScanDoc2',
                        id: JSON.stringify(CtaDigitalForm)
                    });

                MobileBanking_App.app.navigate(uri, { root: true });
            }
        },
    };

    function setupPaginatorDots() {
        if (CtaDigitalForm.TieneSesion === true) {
            $('#pagnatorTlt').text('Paso 1 / 2');

            $('#paginatorDots').append(
                '<div class="dot active"></div>' +
                '<div class="dot"></div>'
            );
        } else {
            $('#pagnatorTlt').text('Paso 3 / 4');

            $('#paginatorDots').append(
                '<div class="dot"></div>' +
                '<div class="dot"></div>' +
                '<div class="dot active"></div>' +
                '<div class="dot"></div>'
            );
        }
    }



    viewModel.rgTipoIdentificacion.onValueChanged = function (e) {
        if (e && e.value)
            selectTypeDocument(e.value.value);
    }

    function selectTypeDocument(select) {
        try {
            CtaDigitalForm.NumeroDocumento = $('#txtNumeroDocumento').dxTextBox('option', 'value');
            var lblNumeroDocumento = "Número de ";
            switch (select) {
                case 'CED':
                    lblNumeroDocumento += "DPI";
                    $('#lblNumeroDocumento').text(lblNumeroDocumento + ":");
                    $('#txtNumeroDocumento').dxTextBox(setupTextBoxDNIControl(CtaDigitalForm.NumeroDocumento ? CtaDigitalForm.NumeroDocumento : ''));
                    $('#txtNumeroDocumento').dxTextBox().dxValidator(validateDNI(true, grpValDPI, lblNumeroDocumento));
                    $('#txtNumeroDocumento').dxTextBox('option', 'placeholder', '13 dígitos');
                    break;
                case 'PAS':
                    lblNumeroDocumento += "Pasaporte";
                    $('#lblNumeroDocumento').text(lblNumeroDocumento + ":");
                    $('#txtNumeroDocumento').dxTextBox(setupTextPASAPORTControl(CtaDigitalForm.NumeroDocumento ? CtaDigitalForm.NumeroDocumento : ''));
                    $('#txtNumeroDocumento').dxTextBox().dxValidator(validatePASS(true, grpValDPI, lblNumeroDocumento));
                    $('#txtNumeroDocumento').dxTextBox('option', 'placeholder', '');
                    break;
            }
            InitialFormValues(select);
        } catch (e) {
            showException(e.message, e.stack, JSON.stringify(select));
        }
    }

    function InitialFormValues(tipoId) {
        switch (tipoId) {
            case 'CED':
                $('#dpiFormCont').show();
                $('#nitFormCont').hide();
                break;
            case 'PAS':
                $('#dpiFormCont').show();
                $('#nitFormCont').hide();
                break;
        }
    }

    function SetupListeners() {
        if (deviceType === 'Android') {
            if (deviceVersion < 44 && deviceVersion != 9 && deviceVersion != 10 && deviceVersion != 11) {
                $('#txtNumeroDocumento').bind('keyup', HndleCharNumDoc);
                $('#NumeroTelefono').bind('keyup', HndleCharTelef);
            }
            else {
                $('#txtNumeroDocumento').bind('input', HndleCharNumDoc);
                $('#NumeroTelefono').bind('input', HndleCharTelef);
            }
        }
        else {
            $('#txtNumeroDocumento').bind('keyup', HndleCharNumDoc);
            $('#NumeroTelefono').bind('keyup', HndleCharTelef);
        }
    }


    function HndleCharTelef(e) {
        var selectedVal = $('#tipoIdentificacion').dxSelectBox('option', 'value');
        var idComp = 'txtNumeroTelefono';
        var value = e.target.value;
        switch (selectedVal) {
            case 'CED':
                idComp += "Dpi";
                break;
            case 'PAS':
                break;
            case 'RUC':
                break;
        }
        if (value.length > ConstantsBehaivor.LENGTH_PHONE) {
            let newVal = value.substring(0, value.length - 1);
            $('#' + idComp).dxTextBox('option', 'value', newVal);
            $('#' + idComp).dxTextBox('option', 'text', newVal);
        }
        else {
            $('#' + idComp).dxTextBox('option', 'value', value);
            $('#' + idComp).dxTextBox('option', 'text', value);
        }
    }

    function HndleCharNumDoc(args) {
        var selectedVal = $('#tipoIdentificacion').dxSelectBox('option', 'value');
        var value = $('#txtNumeroDocumento').dxTextBox('option', 'value');
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
        $('#txtNumeroProducto').dxTextBox('option', 'value', newVal2);
        $('#txtNumeroProducto').dxTextBox('option', 'text', newVal2);
    }

    return viewModel;
};