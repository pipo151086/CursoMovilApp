MobileBanking_App.MsgRegUsr = function (params) {
    "use strict";

    var viewModel = {
        viewShowing: function () {
            hideFloatButtons();
        },
        btnEmpezar: {
            text: "Empezar",
            disabled: false,
            visible: true,
            readonly: false,
            onClick: function (params) {
                MobileBanking_App.app.navigate('LandingPage');
            }
        },
        btnVolver: {
            text: "Volver",
            disabled: false,
            visible: true,
            readonly: false,
            onClick: function (params) {
                MobileBanking_App.app.navigate('LandingPage');
            }
        },
    };

    return viewModel;
};