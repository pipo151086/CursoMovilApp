MobileBanking_App.SolCtaSorry = function (params) {
    "use strict";

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

    };

    return viewModel;
};