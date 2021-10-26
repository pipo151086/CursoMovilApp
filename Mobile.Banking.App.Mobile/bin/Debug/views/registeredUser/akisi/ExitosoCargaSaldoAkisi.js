MobileBanking_App.ExitosoCargaSaldoAkisi = function (params) {
    "use strict";

    var cargaSaldoAkisi = JSON.parse(params.id);
    
    var viewModel = {
        viewShowing: function () {
            hideFloatButtons();
        },
        viewShown: function () {
            setupFloatButton(classButtons.Accept, siguiente, undefined, undefined, undefined, undefined, undefined);
        },
        numeroSecuencial: ko.observable(cargaSaldoAkisi.afectacionResult.Secuencial),
        numeroAutorizacion: ko.observable(cargaSaldoAkisi.afectacionResult.DtoResultPronet.CodigoAutorizacion),
        titular: ko.observable(cargaSaldoAkisi.consultaResult.Nombre),
        numeroTelefono: ko.observable(cargaSaldoAkisi.numeroTelefono),
        montoMostrar: ko.observable(cargaSaldoAkisi.montoMostrar),
        ctaMostrar: ko.observable(cargaSaldoAkisi.ctaMostrar)
    };

    function siguiente() {
        MobileBanking_App.app.navigate('PosicionConsolidada', { root: true });
    }

    return viewModel;
};