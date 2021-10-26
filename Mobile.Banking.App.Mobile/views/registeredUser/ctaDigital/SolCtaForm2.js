MobileBanking_App.SolCtaForm2 = function (params) {
    "use strict";

    var CtaDigitalForm = {};
    var CtaDigDPIPasF2 = "CtaDigDPIPasF2";

    if (params && params.id)
        CtaDigitalForm = JSON.parse(params.id);

    var viewModel = {
        viewShowing: function () {
            hideFloatButtons();
        },
        viewShown: function () {
            setupPaginatorDots();



            SetupListeners();
        },
        CtaDigDPIPasF2: CtaDigDPIPasF2,

        tipoNacionalidad: setupComboBoxControl(TipoNacionalidad, "text", "value", CtaDigitalForm.TipoNacionalidad ? CtaDigitalForm.TipoNacionalidad : "NGT", false, undefined, undefined, "Tipo de Nacionalidad"),
        nacionalidad: setupComboBoxControl(Nacionalidad, "text", "value", CtaDigitalForm.Nacionalidad ? CtaDigitalForm.Nacionalidad : "GTO", false, undefined, undefined, "Nacionalidad"),
        condicionMigratoria: setupComboBoxControl(ConficionMigratoria, "text", "value", CtaDigitalForm.ConficionMigratoria ? CtaDigitalForm.ConficionMigratoria : "NAC", false, undefined, undefined, "Condición Migratoria"),
        nivelEstudios: setupComboBoxControl(NivelInstruccionCli, "text", "value", CtaDigitalForm.NivelEstudios, false, undefined, undefined, "Nivel de Estudios"),
        profOficio: setupComboBoxControl(Profesion, "text", "value", CtaDigitalForm.ProfOficio, false, undefined, undefined, "Profesión u Oficio"),
        estadoCivil: setupComboBoxControl(EstadoCivil, "text", "value", CtaDigitalForm.EstadoCivil, false, undefined, undefined, "Estado Civil"),
        dirPrincipal: setupTextBoxControl(CtaDigitalForm.DirPrincipal, 64, 'Calle Principal', typeLetter.upper, undefined, true, typeCharAllowed.OnlyText),
        dirNumero: setupTextBoxControl(CtaDigitalForm.DirNumero, 16, 'Número de vivienda', typeLetter.upper, undefined, true, typeCharAllowed.OnlyTextAndNumber),
        dirTransversal: setupTextBoxControl(CtaDigitalForm.DirTransversal, 64, 'Calle Transversal', typeLetter.upper, undefined, true, typeCharAllowed.OnlyText),
        numTelefRes: setupTextPhoneControl(CtaDigitalForm.NumTelefResidencia ? CtaDigitalForm.NumTelefResidencia : '', typePhones.Mobile, undefined, "Número de Teléfono"),
        correoElecRes: setupEmailControl(CtaDigitalForm.CorreoElectronico, 128, undefined, "Correo Electrónico"),

        btnValidar: {
            text: "Siguiente",
            disabled: false,
            visible: true,
            readonly: false,
            onClick: function (params) {
                var isValid = DevExpress.validationEngine.validateGroup(CtaDigDPIPasF2).isValid;                
                if (isValid) {
                    CtaDigitalForm.TipoNacionalidad = $('#tipoNacionalidad').dxSelectBox('option', 'value');
                    CtaDigitalForm.Nacionalidad = $('#nacionalidad').dxSelectBox('option', 'value');
                    CtaDigitalForm.ConficionMigratoria = $('#condicionMigratoria').dxSelectBox('option', 'value');
                    CtaDigitalForm.NivelEstudios = $('#nivelEstudios').dxSelectBox('option', 'value');
                    CtaDigitalForm.ProfOficio = $('#profOficio').dxSelectBox('option', 'value');
                    CtaDigitalForm.EstadoCivil = $('#estadoCivil').dxSelectBox('option', 'value');
                    CtaDigitalForm.DirPrincipal = $('#dirPrincipal').dxTextBox('option', 'value');
                    CtaDigitalForm.DirNumero = $('#dirNumero').dxTextBox('option', 'value');
                    CtaDigitalForm.DirTransversal = $('#dirTransversal').dxTextBox('option', 'value');
                    CtaDigitalForm.NumTelefResidencia = $('#numTelefRes').dxTextBox('option', 'value');
                    CtaDigitalForm.CorreoElectronico = $('#correoElecRes').dxTextBox('option', 'value');

                    debugger;


                    var uri = MobileBanking_App.app.router.format({
                        view: 'SolCtaForm3',
                        id: JSON.stringify(CtaDigitalForm)
                    });
                    MobileBanking_App.app.navigate(uri);
                }
            }
        },
        btnRegresar: {
            text: "Volver",
            disabled: false,
            visible: true,
            readonly: false,
            onClick: function (params) {
                var uri = MobileBanking_App.app.router.format({
                    view: 'SolCtaForm1',
                    id: JSON.stringify(CtaDigitalForm)
                });
                MobileBanking_App.app.navigate(uri);
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

    function SetupListeners() {
        if (deviceType === 'Android') {
            if (deviceVersion < 44 && deviceVersion != 9 && deviceVersion != 10 && deviceVersion != 11) {
                $('#numTelefRes').bind('keyup', HndleCharTelef);
            }
            else {
                $('#numTelefRes').bind('input', HndleCharTelef);
            }
        }
        else {
            $('#numTelefRes').bind('keyup', HndleCharTelef);
        }
    }

    function HndleCharTelef(e) {
        var idComp = 'numTelefRes';
        var value = e.target.value;
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


    return viewModel;
};