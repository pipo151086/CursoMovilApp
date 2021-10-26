MobileBanking_App.SolProductos = function (params) {
    "use strict";

    var viewModel = {
        viewShown: function () {
            $('#slideLogo').focus();
        },
        viewShowing: function () {
            hideFloatButtons();
        },
        
        clkTrjCred: function () { openInAppBrowser(Parameters.LnkSolTrjCred)  },
        clkCredBantigua: function () { openInAppBrowser(Parameters.LnkSolCredAntigua)  },
        clkMicroCred: function () { openInAppBrowser(Parameters.LnkSolMicroAntigua) },
        clkCredUnifica: function () { openInAppBrowser(Parameters.LnkSolCredUnifica)  },
        clkCredRemesas: function () { openInAppBrowser(Parameters.LnkSolCredRemesas)  },
        clkPymeBantigua: function () { openInAppBrowser(Parameters.LnkSolPymeAntigua)  },
        clkCredGanadero: function () { openInAppBrowser(Parameters.LnkSolCredGanadero) },
        clickBack: function () { MobileBanking_App.app.navigate('LandingPage', { root: true }); },
    };

    return viewModel;
};