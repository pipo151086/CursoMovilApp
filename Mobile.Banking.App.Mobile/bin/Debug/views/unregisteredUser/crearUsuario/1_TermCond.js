MobileBanking_App._1_TermCond = function (params) {
    "use strict";

    var registroDto = {};

    if (params.id)
        registroDto = JSON.parse(params.id);

    var viewModel = {
        viewShown: function () {
            $('#slideLogo').focus();
        },
        viewShowing: function () {
            hideFloatButtons();
        },
        clickBack: function () { MobileBanking_App.app.navigate('LandingPage', { root: true }); },
        chkTerminos: setupCheckBoxControl(false, 'Acepto el Contrato', undefined),
        continuar: {
            onClick: function () {
                let chkTerminos = $('#chkTerminos').dxCheckBox('option', 'value');
                if (chkTerminos) {
                    var uri = MobileBanking_App.app.router.format({
                        view: '_2_CreaUsr',
                        id: JSON.stringify(registroDto)
                    });
                    MobileBanking_App.app.navigate(uri, { root: true });

                }
                else {
                    showSimpleMessage('Banca Móvil', 'Debes ACEPTAR los términos y condiciones para poder continuar.', undefined);
                }
            },
            text: "Continuar"
        },
    };

    return viewModel;
};