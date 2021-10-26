MobileBanking_App.FormUnreg2NITSorry = function (params) {
    "use strict";
    var CtaDigitalForm = {};

    if (params && params.id)
        CtaDigitalForm = JSON.parse(params.id);

    var viewModel = {
        viewShowing: function () {
            hideFloatButtons();
        },
        btnAgenciaCercana: {
            text: "Agencia más cercana",
            disabled: false,
            visible: true,
            readonly: false,
            onClick: function (params) {
                var uri = MobileBanking_App.app.router.format({
                    view: 'RedAgencias',
                    id: JSON.stringify("LandingPage")
                });
                MobileBanking_App.app.navigate(uri, { root: true });
            }
        },

        btnAbrirCtaPersonal: {
            text: "Abrir Cuenta Personal",
            disabled: false,
            visible: true,
            readonly: false,
            onClick: function (params) {
                var uri = MobileBanking_App.app.router.format({
                    view: 'FormUnreg1_Triage',
                    id: JSON.stringify(CtaDigitalForm)
                });
                MobileBanking_App.app.navigate(uri, { root: true });
            }
        },


    };

    return viewModel;
};