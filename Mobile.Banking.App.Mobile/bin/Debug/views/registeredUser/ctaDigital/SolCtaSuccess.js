MobileBanking_App.SolCtaSuccess = function (params) {
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
                let returnView = "LandingPage";
                if (CtaDigitalForm.TieneSesion === true) {
                    //Actualizar Pos Cons
                    returnView = "PosicionConsolidada";

                    var uri = MobileBanking_App.app.router.format({
                        view: 'RedAgencias',
                        id: JSON.stringify(returnView)
                    });
                    MobileBanking_App.app.navigate(uri, { root: true });
                }
                else {
                    var uri = MobileBanking_App.app.router.format({
                        view: 'RedAgencias',
                        id: JSON.stringify(returnView)
                    });
                    MobileBanking_App.app.navigate(uri, { root: true });
                }
            }
        },
        floaterSuccess: function () {
            let returnView = "PosicionConsolidada";
            if (CtaDigitalForm.TieneSesion != true)
                returnView = "LandingPage";

            var uri = MobileBanking_App.app.router.format({
                view: returnView
            });
            MobileBanking_App.app.navigate(uri, { root: true });

        }
    };

    return viewModel;
};