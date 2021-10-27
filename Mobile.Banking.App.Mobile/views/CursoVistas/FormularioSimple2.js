MobileBanking_App.FormularioSimple2 = function (params) {
    "use strict";

    var dataDeLaVistaAnterior = {};

    if (params && params.id)
        dataDeLaVistaAnterior = JSON.parse(params.id);

    var viewModel = {
        viewShown: function () {
            $('#Content').text(JSON.stringify(dataDeLaVistaAnterior))
        }



    };

    return viewModel;
};