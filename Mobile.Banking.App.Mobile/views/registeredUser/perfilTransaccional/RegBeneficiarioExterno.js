MobileBanking_App.RegBeneficiarioExterno = function (params) {
    "use strict";

    var beneficiarioModel = {
        Beneficiario: ko.observable(),
        NumeroDocumento: ko.observable(''),
        NumeroCta: ko.observable()
    }

    var validCta = false;

    var groupValidation = 'BENEFICIARIOSEXTERNOS';

    var consultaEntidades = EntidadesFinancierasACH;
    if (EntidadesFinancierasACH.length <= 0) {
        ConsultarEntidadFinancieraACH(function (consEntFin) { EntidadesFinancierasACH = consEntFin; consultaEntidades = consEntFin; });
    }
    //apuntar al nuevo lado de entidades financieras
    var listEntidades = $.map(consultaEntidades, function (item, index) {
        if (item.CodigoEntidadFinanciera != 'ECIBANCOCADOR025' && item.CodigoEntidadFinanciera != 'ecbce-scp1001')
            return item
    });

    var resultEntidades
    if (listEntidades != undefined)
        resultEntidades = listEntidades
    else
        resultEntidades = [];

    var listInstituciones = new DevExpress.data.DataSource({
        store: {
            type: "array",
            key: "IdEntidadFinanciera",
            data: resultEntidades
        }
    });

    var typeDocumentSelected = null;
    var typeAccountSelected = null;
    var institutionSelected = null;
    var typeCurrencySelected = null;

    var esAchInmediato
    var esAch;

    var viewModel = {
        viewShown: function () {
            $('#rdbInstituciones').dxRadioGroup('option', 'dataSource', EntidadesFinancierasACH);
            SesionMovil.FechaActividadApp = new Date();
            //setupFloatButton(classButton, action, icon, sizeFloatButtons, typeFloatButtons, aditionalClass, groupValidation);

            setupFloatButton(classButtons.Save, registrarBeneficiario, undefined, undefined, undefined, 'accept-btn', groupValidation);
            setupFloatButton(classButtons.Cancel, cancelar, undefined, sizeFloatButtons.small, typeFloatButtons.white);

            $('.accept-btn').dxButton('option', 'disabled', !validCta);
            $('#ttValidarCta').dxTooltip('option', 'visible', true);
            $('#alertCtaInvalida').hide();

            clearControls();
        },
        viewShowing: function () {
            hideFloatButtons();
        },
        groupValidation: groupValidation,
        txtBeneficiario: setupTextBoxControl(beneficiarioModel.Beneficiario, 128, undefined, typeLetter.upper, undefined, true, typeCharAllowed.OnlyText),
        txtNumeroCED: setupTextBoxDNIControl(),
        txtNumeroCta: {
            value: 0,
            min: 0,
            max: 9999999999999999,
            showSpinButtons: false
        },
        //setupTextBoxControl(beneficiarioModel.NumeroCta, 16, undefined, undefined, undefined, false, typeCharAllowed.OnlyNumber),
        btnCambiarTipoDocumento: setupButtonControl('Seleccione', changeTypeDocument, undefined, undefined, iconosCore.chevron_down, undefined, true),
        btnCambiarTipoCuenta: setupButtonControl('Seleccione', changeTypeAccount, undefined, undefined, iconosCore.chevron_down, undefined, true),
        btnCambiarInstitucion: setupButtonControl('Seleccione...', changeInstitution, undefined, undefined, iconosCore.chevron_down, undefined, true),
        popupSeleccionTipoDocumento: setupPopup(false, '90%', 'auto', true, 'Tipo de Documento', true),
        popupSeleccionTipoCuenta: setupPopup(false, '90%', 'auto', true, 'Tipo de Cuenta', true),
        popupSeleccionInstitucion: setupPopup(false, '100%', '70%', true, 'Institución', true),
        rdbTiposDocumentos: setupRadioGroup(undefined, tipoIdentificacion, 'Texto', 'Codigo'),
        rdbTiposCuenta: setupRadioGroup(undefined, tipoCuentaACH, 'Texto', 'TipoCta'),
        rdbInstituciones: setupRadioGroup(undefined, EntidadesFinancierasACH, 'Descripcion', 'IdEntidadFinanciera'),
        btnCancelarTipoDocumento: setupButtonControlDefault(classButtons.Cancel, cancelTypeDocument),
        btnCancelarTipoCuenta: setupButtonControlDefault(classButtons.Cancel, cancelTypeAccount),
        btnCancelarInstitucion: setupButtonControlDefault(classButtons.Cancel, cancelInstitution),
        txtFiltroInstitucion: setupTextBoxControl(undefined, 128, 'Ingrese la institución a filtrar', typeLetter.upper),
        btnFiltrar: setupButtonControl('', filterInstitution, undefined, undefined, iconosCore.search),
        btnQuitarFiltro: setupButtonControl('', exitFilter, undefined, undefined, iconosCore.times, stateControl.hide),


        //Botonnes ACH
        btnCambiarTipoMoneda: setupButtonControl('Seleccione', changeTypeCurrency, undefined, undefined, iconosCore.chevron_down, undefined, true),
        popupSeleccionTipoMoneda: setupPopup(false, '90%', 'auto', true, 'Tipo de Cuenta', true),
        rdbTiposMoneda: setupRadioGroup(undefined, tipoMoneda, 'Texto', 'Codigo'),
        btnCancelarTipoMoneda: setupButtonControlDefault(classButtons.Cancel, cancelTypeAccount),


        ttValidarCta: {
            //target: "#noValidIcon",
            target: ".accept-btn",
            showEvent: "click",
            hideEvent: "mouseleave",
            closeOnOutsideClick: true,
            position: "bottom",
            width: 200,
            contentTemplate: function (data, itm, el) {
                let content = '<div style=" text-align: justify; white-space: pre-wrap;background-color:white">' +
                    '<b style="color:#d52133;font-weight:900">¡En hora buena!</b>' +
                    '<div style="color:#333; white-space: pre-wrap;">' +
                    'El sistema comprueba si la cuenta ingresada existe en el banco.</div>' +
                    '</div>'
                return content;
            }
        },
    };

    var validarCta = function (params) {
        let textDefaultValidar = "La cuenta, tipo de cuenta o banco ingresado  es incorrecta";
        let textDefaultCtaOk = "La cuenta es correcta puede guardar";
        var numCta = $('#txtNumeroCta').dxNumberBox('option', 'value');
        if (numCta && numCta > 0 &&
            typeAccountSelected &&
            typeCurrencySelected &&
            institutionSelected
        ) {
            ValidarCtaICG_ApiInterna(
                institutionSelected.CodigoBICACH, String(numCta),
                typeCurrencySelected.Codigo, typeAccountSelected.TipoCta, function (result) {
                    validCta = result.CuentaValida;
                    if ((result.CuentaValida === false && result.EsError === true) || result.CuentaValida === true) {
                        $('.accept-btn').dxButton('option', 'disabled', false);
                        validCta = true;
                    }
                    debugger;
                    if (result.CuentaValida === true) {
                        $('#noValidIcon').hide();
                        //$('#alertCtaInvalida').hide();
                        $('#alertCtaInvalida').show();
                        $('#validIcon').show();
                        $('#alertCtaInvalida').text(textDefaultCtaOk);
                        $('#alertCtaInvalida').css('color', 'gray');
                    }
                    else {
                        if (result.EsError === true) {
                            $('#alertCtaInvalida').text("No pudimos validar la cuenta, el banco destino se encuentra fuera de línea.");       
                        } else {
                            $('#alertCtaInvalida').text(textDefaultValidar);                           
                        }
                        $('#noValidIcon').show();
                        $('#alertCtaInvalida').show();
                        $('#validIcon').hide();
                        $('#alertCtaInvalida').css('color', 'red');
                    }
                });
        }
        validCta = false;
        $('#alertCtaInvalida').text(textDefaultValidar);
        $('#alertCtaInvalida').css('color', 'red');
        $('.accept-btn').dxButton('option', 'disabled', !validCta);
        //$('#noValidIcon').show();
        //$('#alertCtaInvalida').show();
        //$('#validIcon').hide();
    }

    viewModel.txtNumeroCta.onFocusOut = validarCta;

    viewModel.popupSeleccionTipoDocumento.onShown = function () {
        $('#floatButtons').hide();
    }
    viewModel.popupSeleccionTipoCuenta.onShown = function () {
        $('#floatButtons').hide();
    }
    viewModel.popupSeleccionInstitucion.onShown = function () {
        $('#floatButtons').hide();
    }
    viewModel.popupSeleccionInstitucion.onShowing = function () {
        $('#floatButtons').hide();
    }
    viewModel.popupSeleccionTipoDocumento.onHidden = function () {
        $('#floatButtons').show();
    }
    viewModel.popupSeleccionTipoCuenta.onHidden = function () {
        $('#floatButtons').show();
    }
    viewModel.popupSeleccionInstitucion.onHidden = function () {
        $('#floatButtons').show();
    }

    //cambios Botones
    viewModel.txtBeneficiario.onFocus = function () {
        $('#floatButtons').hide();
    }

    //VIEW MODEL ACH
    viewModel.popupSeleccionTipoMoneda.onShown = function () {
        $('#floatButtons').hide();
    }

    viewModel.popupSeleccionTipoMoneda.onHidden = function () {
        $('#floatButtons').show();
    }
       
    function changeTypeDocument() {
        changePropertyControl('#popupSeleccionTipoDocumento', typeControl.Popup, 'visible', true);
    }

    function changeTypeAccount() {
        changePropertyControl('#popupSeleccionTipoCuenta', typeControl.Popup, 'visible', true);
    }

    function changeInstitution() {
        changePropertyControl('#popupSeleccionInstitucion', typeControl.Popup, 'visible', true);
    }

    function cancelTypeDocument() {
        changePropertyControl('#popupSeleccionTipoDocumento', typeControl.Popup, 'visible', false);
    }

    function cancelTypeAccount() {
        changePropertyControl('#popupSeleccionTipoCuenta', typeControl.Popup, 'visible', false);
    }

    function cancelInstitution() {
        changePropertyControl('#popupSeleccionInstitucion', typeControl.Popup, 'visible', false);
    }

    function filterInstitution() {
        var institucionFiltrar = $('#txtFiltroInstitucion').dxTextBox('option', 'value');
        var instituciones = searchArray(EntidadesFinancierasACH, 'Descripcion', institucionFiltrar, searchOperations.Contains);
        $('#btnQuitarFiltro').dxButton('option', 'visible', true);
        $('#rdbInstituciones').dxRadioGroup('option', 'dataSource', instituciones);
    }

    function exitFilter() {
        $('#txtFiltroInstitucion').dxTextBox('option', 'value', '');
        $('#rdbInstituciones').dxRadioGroup('option', 'dataSource', EntidadesFinancierasACH);
        $('#btnQuitarFiltro').dxButton('option', 'visible', false);
        $('#txtFiltroInstitucion').dxTextBox('instance').focus();
    }


    //Funciones ACH
    function changeTypeCurrency() {
        changePropertyControl('#popupSeleccionTipoMoneda', typeControl.Popup, 'visible', true);
    }

    function cancelTypeAccount() {
        changePropertyControl('#popupSeleccionTipoMoneda', typeControl.Popup, 'visible', false);
    }

    //FIN

    //INICIO RBD 

    function cancelar() {
        MobileBanking_App.app.navigate('PosicionConsolidada', { root: true });
    }


    viewModel.rdbTiposMoneda.onValueChanged = function (e) {
        try {
            var select = e.value;
            for (var i = 0; i < tipoMoneda.length; i++) {
                if (tipoMoneda[i].Codigo == select) {
                    typeCurrencySelected = tipoMoneda[i];
                    i = tipoMoneda.length;
                }
            }

            if (typeCurrencySelected) {
                changePropertyControl('#btnCambiarTipoMoneda', typeControl.Button, 'text', typeCurrencySelected.Texto);
                changePropertyControl('#popupSeleccionTipoMoneda', typeControl.Popup, 'visible', false);
                validarCta();
            }
        } catch (e) {
            showException(e.message, e.stack);
        }
    }

    //FIN RDB 


    viewModel.popupSeleccionInstitucion.onShown = function () {
        $('#txtFiltroInstitucion').dxTextBox('instance').focus();
    }

    viewModel.rdbTiposDocumentos.onValueChanged = function (e) {
        try {
            var select = e.value;
            for (var i = 0; i < tipoIdentificacion.length; i++) {
                if (tipoIdentificacion[i].Codigo == select) {
                    typeDocumentSelected = tipoIdentificacion[i];
                    i = tipoIdentificacion.length;
                }
            }
            if (typeDocumentSelected) {
                changePropertyControl('#btnCambiarTipoDocumento', typeControl.Button, 'text', typeDocumentSelected.Texto);
                changePropertyControl('#popupSeleccionTipoDocumento', typeControl.Popup, 'visible', false);
                selectTypeDocument(typeDocumentSelected);
            }
        } catch (e) {
            showException(e.message, e.stack);
        }

    }

    viewModel.rdbTiposCuenta.onValueChanged = function (e) {
        try {
            var select = e.value;
            for (var i = 0; i < tipoCuentaACH.length; i++) {
                if (tipoCuentaACH[i].TipoCta == select) {
                    typeAccountSelected = tipoCuentaACH[i];
                    i = tipoCuentaACH.length;
                }
            }

            if (typeAccountSelected) {
                changePropertyControl('#btnCambiarTipoCuenta', typeControl.Button, 'text', typeAccountSelected.Texto);
                changePropertyControl('#popupSeleccionTipoCuenta', typeControl.Popup, 'visible', false);

                validarCta();
            }
        } catch (e) {
            showException(e.message, e.stack);
        }

    }

    viewModel.rdbInstituciones.onValueChanged = function (e) {
        try {
            var select = e.value;
            for (var i = 0; i < listInstituciones._store._array.length; i++) {
                if (listInstituciones._store._array[i].IdEntidadFinanciera == select) {
                    institutionSelected = listInstituciones._store._array[i];
                    i = listInstituciones._store._array.length;
                }
            };
            if (institutionSelected) {
                changePropertyControl('#btnCambiarInstitucion', typeControl.Button, 'text', institutionSelected.Descripcion);
                changePropertyControl('#popupSeleccionInstitucion', typeControl.Popup, 'visible', false);
                if (institutionSelected.EsACHInmediato == true)
                    $('#currSymbol').text(" (ACH y ACH Inmediato)");
                else
                    $('#currSymbol').text("(ACH)");
                validarCta();;
            }
        } catch (e) {
            showException(e.message, e.stack);
        }
    }




    function selectTypeDocument(select) {
        try {
            switch (select.Codigo) {
                case 'CED':
                    viewModel.txtNumeroCED = setupTextBoxDNIControl();
                    $('#txtNumeroCED').dxTextBox().dxValidator(validateDNI(true, groupValidation, 'Cédula'));
                    break;
                case 'PAS':
                    viewModel.txtNumeroCED = setupTextPASAPORTControl();
                    $('#txtNumeroCED').dxTextBox().dxValidator(validatePASS(true, groupValidation, 'Pasaporte'));
                    break;
                case 'RUC':
                    viewModel.txtNumeroCED = setupTextRUCControl();
                    $('#txtNumeroCED').dxTextBox().dxValidator(validateRUC(true, groupValidation, 'RUC'));
                    break;
            }
            $('#txtNumeroCED').dxTextBox('option', viewModel.txtNumeroCED);
        } catch (e) {
            showException(e.message, e.stack, JSON.stringify(data));
        }
    }

    function registrarBeneficiario(params) {
        try {
            var result = params.validationGroup.validate();
            var completeValidation = false;
            var valueNumeroCta = $('#txtNumeroCta').dxNumberBox('option', 'value');
            var resultValidationNumeroCta = /^[0-9]+$/.test(valueNumeroCta);
            if (resultValidationNumeroCta === true && result.isValid == true) {
                completeValidation = true;
            } else if (resultValidationNumeroCta === false) {
                showWarningMessage(CORE_MESSAGE('Registro'), 'La cuenta solo debe estar compuesta por números', function () {
                });
                return;
            }
            if (validCta === false)
                $('#ttValidarCta').dxTooltip('option', 'visible', true);

            if (completeValidation == true && validCta === true) {
                //if (!typeDocumentSelected) {
                //    showWarningMessage(CORE_MESSAGE('Registro'), 'Seleccione el tipo de documento', function () {
                //        $('#btnCambiarTipoDocumento').click();
                //    });
                //    return;
                //}
                //else 
                if (!typeAccountSelected) {
                    showWarningMessage(CORE_MESSAGE('Registro'), 'Seleccione un tipo de cuenta', function () {
                        $('#btnCambiarTipoCuenta').click();
                    });
                    return;
                }
                else if (!typeCurrencySelected) {
                    showWarningMessage(CORE_MESSAGE('Registro'), 'Seleccione el tipo de moneda', function () {
                        $('#btnCambiarTipoMoneda').click();
                    });
                    return;
                }
                else if (!institutionSelected) {
                    showWarningMessage(CORE_MESSAGE('Registro'), 'Seleccione la entidad bancaria', function () {
                        $('#btnCambiarInstitucion').click();
                    });
                    return;
                }

                var DtoTransferenciaExterna =
                {
                    IdTransferenciaExterna: 0,
                    IdCliente: SesionMovil.ContextoCliente.CodigoCliente,
                    IdEntidadFinanciera: institutionSelected.IdEntidadFinanciera,
                    TipoCuenta: typeAccountSelected.TipoCta,
                    NumeroCuenta: $('#txtNumeroCta').dxNumberBox('option', 'value'),
                    Beneficiario: $('#txtBeneficiario').dxTextBox('option', 'value'),
                    TipoIdentificacion: "",
                    NumeroIdentificacion: $('#txtNumeroCED').dxTextBox('option', 'value'),
                    Email: "",
                    Celular: "",
                    Cadena1: "",
                    CodigoMoneda: typeCurrencySelected.Codigo,
                    DescripcionMoneda: typeCurrencySelected.Texto,
                    DescripcionEntidadFinanciera: institutionSelected.Descripcion,
                    CtaDesc: typeAccountSelected.Texto,
                    EsACH: esAch,
                    EsACHInmediato: esAchInmediato
                }
                MobileBanking_App.app.navigate('ConfirmarBeneficiarioExterno/' + JSON.stringify(DtoTransferenciaExterna), { root: true });

            } else {

                showWarningMessage(CORE_MESSAGE('Registro'), CORE_MESSAGE('MissingData'));
            }



        }
        catch (e) {
            showException(e.message, e.stack, JSON.stringify(params));
        }

    }

    function clearControls() {
        try {
            changePropertyControl('#txtBeneficiario', typeControl.TextBox, 'value', undefined);
            $('#rdbTiposDocumentos').dxRadioGroup('option', 'value', undefined)
            changePropertyControl('#txtNumeroCED', typeControl.TextBox, 'value', undefined);
            changePropertyControl('#txtNumeroCta', typeControl.NumberBox, 'value', undefined);
            $('#rdbTiposCuenta').dxRadioGroup('option', 'value', undefined)
            $('#rdbInstituciones').dxRadioGroup('option', 'value', undefined)
            //ojo nuevo
            $('#rdbTiposMoneda').dxRadioGroup('option', 'value', undefined)

            DevExpress.validationEngine.resetGroup(groupValidation);
            //$('#txtBeneficiario').dxTextBox('instance').focus();
            typeDocumentSelected = undefined;
            typeAccountSelected = undefined;
            typeCurrencySelected = undefined
            institutionSelected = undefined;
            changePropertyControl('#btnCambiarTipoDocumento', typeControl.Button, 'text', 'Seleccione');
            changePropertyControl('#btnCambiarTipoCuenta', typeControl.Button, 'text', 'Seleccione');
            changePropertyControl('#btnCambiarInstitucion', typeControl.Button, 'text', 'Seleccione');
            changePropertyControl('#btnCambiarTipoMoneda', typeControl.Button, 'text', 'Seleccione');

            //CLEAR ACH


            //FIN

        } catch (e) {
            showException(e.message, e.stack);
        }

    }

    return viewModel;
};