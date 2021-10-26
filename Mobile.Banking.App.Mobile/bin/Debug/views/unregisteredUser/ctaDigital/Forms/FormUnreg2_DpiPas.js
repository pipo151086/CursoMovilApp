MobileBanking_App.FormUnreg2_DpiPas = function (params) {
    "use strict";

    var CtaDigitalForm = {};
    var grpValDpiPas = "CtaDigDPIPas";

    if (params && params.id)
        CtaDigitalForm = JSON.parse(params.id);


    var viewModel = {
        viewShowing: function () {
            hideFloatButtons();
        },
        viewShown: function () {
            $('#infoPEP').click(function () {
                $('#ttPEP').dxTooltip('option', 'visible', true);
            });
            $('#infoCEP').click(function () {
                $('#ttCEP').dxTooltip('option', 'visible', true);
            });

        },
        grpValDpiPas: grpValDpiPas,
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

        btnValidar: {
            text: "Siguiente",
            disabled: false,
            visible: true,
            readonly: false,
            onClick: function (params) {
                var isValid = DevExpress.validationEngine.validateGroup(grpValDpiPas).isValid;
                if (isValid) {
                    CtaDigitalForm.EsPEP = $('#rgEsPEP').dxRadioGroup('option', 'value').value;
                    CtaDigitalForm.EsFamliarPEP = $('#rgEsFamliarPEP').dxRadioGroup('option', 'value').value;
                    CtaDigitalForm.VivioUSA = $('#rgVivioUSA').dxRadioGroup('option', 'value').value;
                    CtaDigitalForm.PoseeResUSA = $('#rgPoseeResUSA').dxRadioGroup('option', 'value').value;
                    CtaDigitalForm.EsCEP = $('#rgEsCEP').dxRadioGroup('option', 'value').value;
                    CtaDigitalForm.EsCiudadanoUSA = $('#rgEsCiudadanoUSA').dxRadioGroup('option', 'value').value;

                    let noCumplePol = CtaDigitalForm.EsPEP || CtaDigitalForm.EsFamliarPEP ||
                        CtaDigitalForm.VivioUSA || CtaDigitalForm.PoseeResUSA ||
                        CtaDigitalForm.EsCEP || CtaDigitalForm.EsCiudadanoUSA;
                    
                    let forwardview = 'SolCtaSelfie';
                    if (CtaDigitalForm.TipoIdentificacion == "PAS" || noCumplePol)
                        forwardview = 'FormUnreg2NITSorry';

                    var uri = MobileBanking_App.app.router.format({
                        view: forwardview,
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
                    view: 'FormUnreg1_Triage',
                    id: JSON.stringify(CtaDigitalForm)
                });
                MobileBanking_App.app.navigate(uri);
            }
        },

    };




    return viewModel;
};