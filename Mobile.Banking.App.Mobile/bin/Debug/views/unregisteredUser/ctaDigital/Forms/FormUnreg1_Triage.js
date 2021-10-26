MobileBanking_App.FormUnreg1_Triage = function (params) {
    "use strict";

    var groupValidation = "CtaDigFormTriage";
    var grpValNIT = "CtaDigNIT";
    var grpValDPI = "CtaDigDPI";
    var numeroIntentos = 0;
    var fechaNacimientoInicial = Date.today().addYears(-18).toString('yyyy-MM-dd');
    var fechaNacimientoMaximo = Date.today().addYears(-100).toString('yyyy-MM-dd');

    var CtaDigitalForm = {
        TieneSesion: false,
        TipoIdentificacion: "CED",
        NumeroDocumento: "",

        /*NIT FORM*/
        NombreEmpresa: "",
        NumeroTelefono: "",
        EsPEP: false,
        EsFamliarPEP: false,
        VivioUSA: false,
        PoseeResUSA: false,
        EsCEP: false,
        EsCiudadanoUSA: false,

        /*DPI FORM*/
        PrimerNombreDpi: "",
        SegundoNombreDpi: "",
        PrimerApellidoDpi: "",
        SegundoApellidoDpi: "",
        ApellidoCasadaDpi: "",
        NumeroNitDpi: "",
        FechaNacimiento: fechaNacimientoInicial
    }

    var viewModel = {
        viewShowing: function () {
            hideFloatButtons();
        },
        viewShown: function () {
            $('#dtFechaNacimientoDpi').dxDateBox('option', 'openOnFieldClick', false);
            $('#infoPEP').click(function () {
                $('#ttPEP').dxTooltip('option', 'visible', true);
            });
            $('#infoCEP').click(function () {
                $('#ttCEP').dxTooltip('option', 'visible', true);
            });
            SetupListeners();
            
            $('#dpiFormCont').hide();
            $('#nitFormCont').hide();
            $('#containerButtons').hide();
        },
        tipoIdentificacion: setupComboBoxControl(tipoIdCompleto, "Texto", "Codigo", CtaDigitalForm.TipoIdentificacion, false, undefined, undefined, undefined),
        txtNumeroDocumento: setupTextBoxDNIControl(CtaDigitalForm.NumeroDocumento ? CtaDigitalForm.NumeroDocumento : ''),
        groupValidation: groupValidation,
        grpValNIT: grpValNIT,
        grpValDPI: grpValDPI,
        //DPI FORM

        txtPrimerNombreDpi: setupTextBoxControl(CtaDigitalForm.PrimerNombreDpi, 32, 'Ingresa tu primer nombre', typeLetter.upper, undefined, true, typeCharAllowed.OnlyText),
        txtSegundoNombreDpi: setupTextBoxControl(CtaDigitalForm.SegundoNombreDpi, 32, 'Ingresa tu segundo nombre', typeLetter.upper, undefined, true, typeCharAllowed.OnlyText),
        txtPrimerApellidoDpi: setupTextBoxControl(CtaDigitalForm.PrimerApellidoDpi, 32, 'Ingresa tu primer apellido', typeLetter.upper, undefined, true, typeCharAllowed.OnlyText),
        txtSegundoApellidoDpi: setupTextBoxControl(CtaDigitalForm.SegundoApellidoDpi, 32, 'Ingresa tu segundo apellido', typeLetter.upper, undefined, true, typeCharAllowed.OnlyText),
        txtApellidoCasadaDpi: setupTextBoxControl(CtaDigitalForm.ApellidoCasadaDpi, 32, 'Ingresa tu apellido de casada', typeLetter.upper, undefined, true, typeCharAllowed.OnlyText),
        txtNumeroNitDpi: setupTextRUCControl(CtaDigitalForm.NumeroNitDpi, undefined),
        dtFechaNacimientoDpi: setupDateControl(new Date(CtaDigitalForm.FechaNacimiento ? CtaDigitalForm.FechaNacimiento : fechaNacimientoInicial), new Date(fechaNacimientoMaximo), new Date(fechaNacimientoInicial), 'auto'),
        txtNumeroTelefonoDpi: setupTextPhoneControl(CtaDigitalForm.NumeroTelefonoDpi ? CtaDigitalForm.NumeroTelefonoDpi : '', typePhones.Mobile, undefined, "Ingresa el número de teléfono"),
        //FINDPI

        //NIT FORM
        txtNombreEmpresa: setupTextBoxControl(CtaDigitalForm.NombreEmpresa, 32, 'Ingresa el nombre de la empresa', typeLetter.upper, undefined, true, typeCharAllowed.OnlyText),
        txtNumeroTelefono: setupTextPhoneControl(CtaDigitalForm.NumeroTelefono ? CtaDigitalForm.NumeroTelefono : '', typePhones.Mobile, undefined, "Ingresa el número de teléfono"),
        rgEsPEP: {
            items: OpcionesSiNo,
            layout: "horizontal"
        },
        rgEsFamliarPEP: {
            items: OpcionesSiNo,
            layout: "horizontal"
        },
        rgVivioUSA: {
            items: OpcionesSiNo,
            layout: "horizontal"
        },
        rgPoseeResUSA: {
            items: OpcionesSiNo,
            layout: "horizontal"
        },
        rgEsCEP: {
            items: OpcionesSiNo,
            layout: "horizontal"
        },
        rgEsCiudadanoUSA: {
            items: OpcionesSiNo,
            layout: "horizontal"
        },
        ttPEP: {
            target: "#lblEsPEP",
            showEvent: undefined,
            hideEvent: "mouseleave",
            closeOnOutsideClick: true,
            position: "top",
            width: 220,
            contentTemplate: function (data, itm, el) {
                let content = '<div style=" text-align: justify; white-space: pre-wrap;background-color:white">' +
                    '<b style="color:#d52133;font-weight:900">* ¿Qué es un PEP?</b>' +
                    '<div style="color:#333; white-space: pre-wrap;">' +
                    '“Aquellas que desempeñan o hayan desempeñado un cargo público relevante en Guatemala o en otro país, o aquella que tiene o se le ha confiado una función prominente en una organización internacional, así como, los dirigentes de partidos políticos nacionales y de otro país que por su perfil están expuestos a riesgos inherentes a su nivel o posición jerárquica” (Superintendencia de Bancos, Guatemala, C.A.)</div>' +
                    '</div>'
                return content;
            }
        },
        ttCEP: {
            target: "#lblEsCEP",
            showEvent: undefined,
            hideEvent: "mouseleave",
            closeOnOutsideClick: true,
            position: "top",
            width: 220,
            contentTemplate: function (data, itm, el) {
                let content = '<div style=" text-align: justify; white-space: pre-wrap;background-color:white">' +
                    '<b style="color:#d52133;font-weight:900">* ¿Qué es un CPE?</b>' +
                    '<div style="color:#333; white-space: pre-wrap;">' +
                    '“La persona individual o jurídica, nacional o extranjera, que sin importar la modalidad de la adquisición pública, provea o venda bienes, suministros, obras, servicios o arrendamientos al Estado o a cualquiera de las entidades, instituciones o sujetos indicados en el artículo 1 de la Ley de Contrataciones del Estado, por valor que exceda a novecientos mil quetzales (Q.900,000.00), en uno o varios contratos, no importando la modalidad de adquisición pública” (Superintendencia de Bancos, Guatemala, C.A.)</div>' +
                    '</div>'
                return content;
            }
        },

        //FIN NIT

        btnValidarDocumento: {
            text: "Validar Documento",
            disabled: false,
            visible: true,
            readonly: false,
            onClick: function (params) {

                var isValid = DevExpress.validationEngine.validateGroup(groupValidation).isValid;
                if (isValid) {
                    var idType = $('#tipoIdentificacion').dxSelectBox('option', 'value');
                    var numDoc = $('#txtNumeroDocumento').dxTextBox('option', 'value');
                    ConsultarUsuario_NumIntentos(idType, numDoc, function (result) {
                        numeroIntentos = result.numeroIntentos;
                        if (result.existe) {
                            return showSimpleMessage(CORE_TAG('DefaultTitle'), 'Tu ya eres un usuario de Banca Digital, por favor sigue las instrucciones que te vamos a presentar a continuación.', function () {
                                MobileBanking_App.app.navigate('MsgRegUsr');
                            });
                        }
                        else {
                            if (numeroIntentos < Parameters.IntentosAperturaCtaDigital) {
                                $('#tipoIdentificacion').dxSelectBox('option', 'disabled', true);
                                $('#txtNumeroDocumento').dxTextBox('option', 'disabled', true);
                                InitialFormValues(idType);
                                $('#containerValidarDocButton').hide();
                                
                            }
                            else
                                return showSimpleMessage(CORE_TAG('DefaultTitle'), 'Has superado el número de intentos para la apertura de tu Cuenta Digital, por favor acércate a tu agencia más cercana.', function () {
                                    MobileBanking_App.app.navigate('RedAgencias');
                                });
                        }
                    });

                }
            }
        },


        btnValidar: {
            text: "Siguiente",
            disabled: false,
            visible: true,
            readonly: false,
            onClick: function (params) {
                debugger;
                var idType = $('#tipoIdentificacion').dxSelectBox('option', 'value');
                var isValid = DevExpress.validationEngine.validateGroup(groupValidation).isValid;
                var isValidNit = DevExpress.validationEngine.validateGroup(grpValNIT).isValid;
                var isValidDpi = DevExpress.validationEngine.validateGroup(grpValDPI).isValid;

                if ((idType === 'CED' || idType === 'PAS') && (isValid && isValidDpi)) {
                    CtaDigitalForm.TipoIdentificacion = idType;
                    CtaDigitalForm.txtTipoDocumento = idType;

                    CtaDigitalForm.NumeroDocumento = $('#txtNumeroDocumento').dxTextBox('option', 'value');
                    CtaDigitalForm.txtNumeroDocumento = $('#txtNumeroDocumento').dxTextBox('option', 'value');

                    CtaDigitalForm.PrimerNombreDpi = $('#txtPrimerNombreDpi').dxTextBox('option', 'value');
                    CtaDigitalForm.SegundoNombreDpi = $('#txtSegundoNombreDpi').dxTextBox('option', 'value');
                    CtaDigitalForm.PrimerApellidoDpi = $('#txtPrimerApellidoDpi').dxTextBox('option', 'value');
                    CtaDigitalForm.SegundoApellidoDpi = $('#txtSegundoApellidoDpi').dxTextBox('option', 'value');
                    CtaDigitalForm.ApellidoCasadaDpi = $('#txtApellidoCasadaDpi').dxTextBox('option', 'value');
                    CtaDigitalForm.NumeroNitDpi = $('#txtNumeroNitDpi').dxTextBox('option', 'value');
                    CtaDigitalForm.FechaNacimiento = (new Date($('#dtFechaNacimiento').dxDateBox('option', 'value')).toString('yyyy-MM-dd'));
                    CtaDigitalForm.NumeroTelefono = $('#txtNumeroTelefonoDpi').dxTextBox('option', 'value');
                    debugger;
                    var uri = MobileBanking_App.app.router.format({
                        view: 'FormUnreg2_DpiPas',
                        id: JSON.stringify(CtaDigitalForm)
                    });
                    MobileBanking_App.app.navigate(uri, { root: true });


                } else if (idType === 'RUC' && (isValidNit && isValid)) {
                    CtaDigitalForm.TipoIdentificacion = idType;
                    CtaDigitalForm.txtTipoDocumento = idType;

                    CtaDigitalForm.NumeroDocumento = $('#txtNumeroDocumento').dxTextBox('option', 'value');
                    CtaDigitalForm.txtNumeroDocumento = $('#txtNumeroDocumento').dxTextBox('option', 'value');

                    CtaDigitalForm.NombreEmpresa = $('#txtNombreEmpresa').dxTextBox('option', 'value');
                    CtaDigitalForm.NumeroTelefono = $('#txtNumeroTelefono').dxTextBox('option', 'value');
                    CtaDigitalForm.EsPEP = $('#rgEsPEP').dxRadioGroup('option', 'value').value;
                    CtaDigitalForm.EsFamliarPEP = $('#rgEsFamliarPEP').dxRadioGroup('option', 'value').value;
                    CtaDigitalForm.VivioUSA = $('#rgVivioUSA').dxRadioGroup('option', 'value').value;
                    CtaDigitalForm.PoseeResUSA = $('#rgPoseeResUSA').dxRadioGroup('option', 'value').value;
                    CtaDigitalForm.EsCEP = $('#rgEsCEP').dxRadioGroup('option', 'value').value;
                    CtaDigitalForm.EsCiudadanoUSA = $('#rgEsCiudadanoUSA').dxRadioGroup('option', 'value').value;
                    debugger;
                    var uri = MobileBanking_App.app.router.format({
                        view: 'FormUnreg2NITSorry',
                        id: JSON.stringify(CtaDigitalForm)
                    });
                    MobileBanking_App.app.navigate(uri, { root: true });
                    return;
                }


                //MobileBanking_App.app.navigate('FormUnreg1_Triage');
            }
        },
        btnRegresar: {
            text: "Volver",
            disabled: false,
            visible: true,
            readonly: false,
            onClick: function (params) {
                MobileBanking_App.app.navigate('MsgUnregUsr');
            }
        },
    };

    viewModel.tipoIdentificacion.onValueChanged = function (e) {
        selectTypeDocument(e.value);
    }

    function selectTypeDocument(select) {
        try {
            CtaDigitalForm.NumeroDocumento = $('#txtNumeroDocumento').dxTextBox('option', 'value');
            var lblNumeroDocumento = "2. Número de ";
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
                case 'RUC':
                    lblNumeroDocumento += "NIT";
                    $('#lblNumeroDocumento').text(lblNumeroDocumento + ":");
                    $('#txtNumeroDocumento').dxTextBox(setupTextRUCControl(CtaDigitalForm.NumeroDocumento ? CtaDigitalForm.NumeroDocumento : ''));
                    //$('#txtNumeroDocumento').dxTextBox().dxValidator(validateRUC(true, grpValNIT, lblNumeroDocumento));
                    $('#txtNumeroDocumento').dxTextBox().dxValidator(validateRequired(grpValNIT, lblNumeroDocumento));
                    $('#txtNumeroDocumento').dxTextBox('option', 'placeholder', '12 dígitos');
                    break;
            }            
        } catch (e) {
            showException(e.message, e.stack, JSON.stringify(select));
        }
    }

    function InitialFormValues(tipoId) {
        switch (tipoId) {
            case 'CED':
                $('#dpiFormCont').show();
                $('#nitFormCont').hide();
                $('#txtNumeroNitDpi').dxTextBox('option', 'placeholder', '12 dígitos');
                break;
            case 'PAS':
                $('#dpiFormCont').show();
                $('#nitFormCont').hide();
                break;
            case 'RUC':
                $('#dpiFormCont').hide();
                $('#nitFormCont').show();
                break;
        }
        $('#containerButtons').show();
    }

    function SetupListeners() {
        if (deviceType === 'Android') {
            if (deviceVersion < 44 && deviceVersion != 9 && deviceVersion != 10 && deviceVersion != 11) {
                $('#txtNumeroDocumento').bind('keyup', HndleCharNumDoc);
                $('#NumeroTelefono').bind('keyup', HndleCharTelef);
                $('#NumeroTelefonoDpi').bind('keyup', HndleCharTelef);
            }
            else {
                $('#txtNumeroDocumento').bind('input', HndleCharNumDoc);
                $('#NumeroTelefono').bind('input', HndleCharTelef);
                $('#NumeroTelefonoDpi').bind('input', HndleCharTelef);
            }
        }
        else {
            $('#txtNumeroDocumento').bind('keyup', HndleCharNumDoc);
            $('#NumeroTelefono').bind('keyup', HndleCharTelef);
            $('#NumeroTelefonoDpi').bind('keyup', HndleCharTelef);
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