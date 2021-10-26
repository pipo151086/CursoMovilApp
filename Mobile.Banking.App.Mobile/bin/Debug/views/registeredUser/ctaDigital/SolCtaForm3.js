MobileBanking_App.SolCtaForm3 = function (params) {
    "use strict";

    var CtaDigitalForm = {};
    var CtaDigDPIPasF3 = "CtaDigDPIPasF3";

    if (params && params.id)
        CtaDigitalForm = JSON.parse(params.id);



    var viewModel = {
        viewShowing: function () {
            hideFloatButtons();
        },
        viewShown: function () {
            setupPaginatorDots();
            $('#patNit').dxTextBox('option', 'placeholder', 'Nit (12 Dígitos)')


            SetupListeners();
        },
        CtaDigDPIPasF3: CtaDigDPIPasF3,

        montoIngreso: setupNumberBox(CtaDigitalForm.MontoIngreso, 0.01, 30000, undefined, undefined, undefined, "Ingresos"),
        actEconActual: setupComboBoxControl(FuenteIngreso, "text", "value", CtaDigitalForm.ActividadEconomica, false, undefined, undefined, "Actividad Económica Actual"),
        patNomComer: setupTextBoxControl(CtaDigitalForm.PatNomComercial, 64, 'Nombre Comercial / Negocio Propio', typeLetter.upper, undefined, true, typeCharAllowed.OnlyTextAndNumber),
        patNit: setupTextRUCControl(CtaDigitalForm.PatNit, undefined),
        patActividadEcono: setupComboBoxControl(ActividadEconomica, "text", "value", CtaDigitalForm.PatActividadEconomica, false, undefined, undefined, "Actividad"),
        patPuesto: setupTextBoxControl(CtaDigitalForm.PatPuesto, 64, 'Puesto', typeLetter.upper, undefined, true, typeCharAllowed.OnlyTextAndNumber),
        patSector: setupComboBoxControl(SectorPublicoPrivado, "text", "value", CtaDigitalForm.SectorPublicoPrivado, false, undefined, undefined, "Sector"),
        patDirCallePrin: setupTextBoxControl(CtaDigitalForm.PatDirCallePrin, 64, 'Calle Principal', typeLetter.upper, undefined, true, typeCharAllowed.OnlyText),
        patDirNumero: setupTextBoxControl(CtaDigitalForm.PatDirNumero, 16, 'Número de vivienda', typeLetter.upper, undefined, true, typeCharAllowed.OnlyTextAndNumber),
        patDirCalleTran: setupTextBoxControl(CtaDigitalForm.PatDirCalleTran, 16, 'Calle Transversal', typeLetter.upper, undefined, true, typeCharAllowed.OnlyTextAndNumber),
        patNumeroTelef: setupTextPhoneControl(CtaDigitalForm.PatNumeroTelef ? CtaDigitalForm.PatNumeroTelef : '', typePhones.Mobile, undefined, "Número de Teléfono"),
        ingTipoMoneda: setupComboBoxControl(tipoMonedaSoloQuetsal, "Simbolo", "Codigo", CtaDigitalForm.IngTipoMoneda ? CtaDigitalForm.IngTipoMoneda : tipoMonedaSoloQuetsal[0].Codigo, false, undefined, undefined, "Moneda"),
        ingMonto: setupNumberBox(CtaDigitalForm.IngMonto, 0.01, 30000, undefined, undefined, undefined, "Ingresos"),
        egreTipoMoneda: setupComboBoxControl(tipoMonedaSoloQuetsal, "Simbolo", "Codigo", CtaDigitalForm.EgreTipoMoneda ? CtaDigitalForm.EgreTipoMoneda : tipoMonedaSoloQuetsal[0].Codigo, false, undefined, undefined, "Moneda"),
        egreMonto: setupNumberBox(CtaDigitalForm.EgreMonto, 0.01, 10000, undefined, undefined, undefined, "Egresos"),

        btnValidar: {
            text: "Siguiente",
            disabled: false,
            visible: true,
            readonly: false,
            onClick: function (params) {
                var isValid = DevExpress.validationEngine.validateGroup(CtaDigDPIPasF3).isValid;
                if (isValid) {
                    CtaDigitalForm.IngTipoMoneda = $('#ingTipoMoneda').dxSelectBox('option', 'value');
                    CtaDigitalForm.IngMonto = $('#ingMonto').dxNumberBox('option', 'value');
                    CtaDigitalForm.EgreTipoMoneda = $('#egreTipoMoneda').dxSelectBox('option', 'value');
                    CtaDigitalForm.EgreMonto = $('#egreMonto').dxNumberBox('option', 'value');
                    if (CtaDigitalForm.EgreMonto > CtaDigitalForm.IngMonto)
                        return showSimpleMessage(CORE_TAG('DefaultTitle'), 'Los Egresos no pueden exceder a los Ingresos', undefined, undefined);

                    CtaDigitalForm.MontoIngreso = $('#montoIngreso').dxNumberBox('option', 'value');
                    CtaDigitalForm.ActividadEconomica = $('#actEconActual').dxSelectBox('option', 'value');
                    CtaDigitalForm.PatNomComercial = $('#patNomComer').dxTextBox('option', 'value');
                    CtaDigitalForm.PatNit = $('#patNit').dxTextBox('option', 'value');
                    CtaDigitalForm.PatActividadEconomica = $('#patActividadEcono').dxSelectBox('option', 'value');
                    CtaDigitalForm.PatPuesto = $('#patPuesto').dxTextBox('option', 'value');
                    CtaDigitalForm.SectorPublicoPrivado = $('#patSector').dxSelectBox('option', 'value');
                    CtaDigitalForm.PatDirCallePrin = $('#patDirCallePrin').dxTextBox('option', 'value');
                    CtaDigitalForm.PatDirNumero = $('#patDirNumero').dxTextBox('option', 'value');
                    CtaDigitalForm.PatDirCalleTran = $('#patDirCalleTran').dxTextBox('option', 'value');
                    CtaDigitalForm.PatNumeroTelef = $('#patNumeroTelef').dxTextBox('option', 'value');

                    var uri = MobileBanking_App.app.router.format({
                        view: 'SolCtaForm4',
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
                    view: 'SolCtaForm2',
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
                $('#patNumeroTelef').bind('keyup', HndleCharTelef);
            }
            else {
                $('#patNumeroTelef').bind('input', HndleCharTelef);
            }
        }
        else {
            $('#patNumeroTelef').bind('keyup', HndleCharTelef);
        }
    }

    function HndleCharTelef(e) {
        var idComp = 'patNumeroTelef';
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