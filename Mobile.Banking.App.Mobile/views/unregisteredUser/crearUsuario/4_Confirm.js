MobileBanking_App._4_Confirm = function (params) {
    "use strict";

    var viewModel = {
        viewShown: function () {
            $('#slideLogo').focus();
            setupFloatButton(classButtons.Accept, siguiente, undefined, undefined, undefined, undefined, undefined);

        },
        viewShowing: function () {
            hideFloatButtons();
        },
    };

    function siguiente() {
        MobileBanking_App.app.navigate("LandingPage", { root: true });
    }

    return viewModel;
};