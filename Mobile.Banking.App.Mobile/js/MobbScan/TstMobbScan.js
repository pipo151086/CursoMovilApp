MobileBanking_App.TstMobbScan = function (params) {
    "use strict";

    var viewModel = {

        TestMobbScanFront: {
            text: "scanDocumentForFrontSide",
            disabled: false,
            visible: true,
            readonly: false,
            onClick: function (params) {
                scanDocumentForFrontSide();
            }
        },

        TestMobbBack: {
            text: "scanDocumentForBackSide",
            disabled: false,
            visible: true,
            readonly: false,
            onClick: function (params) {
                scanDocumentForBackSide();
            }
        },
        TestMobbScanLiveness: {
            text: "videoLiveness",
            disabled: false,
            visible: true,
            readonly: false,
            onClick: function (params) {
                videoLiveness();
            }
        }
    };

    return viewModel;
};