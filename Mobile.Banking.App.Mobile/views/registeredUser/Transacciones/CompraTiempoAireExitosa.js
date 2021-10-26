MobileBanking_App.CompraTiempoAireExitosa = function (params) {
    "use strict";

    var CompraTiempoAire = JSON.parse(params.id);

    var viewModel = {
        viewShown: function () {
            SesionMovil.FechaActividadApp = new Date();
            setupFloatButton(classButtons.Accept, salir);
        },
        viewShowing: function () {
            hideFloatButtons();
        },
        Secuencial: CompraTiempoAire.Secuencial,
        Operadora: getOperadora(CompraTiempoAire.cadena),
        NumberPhone: CompraTiempoAire.numeroCelular,
        Valor: CompraTiempoAire.valor,        
        Tarjeta: maskTarjeta(CompraTiempoAire.dtoCanalTarjeta.NumeroTarjeta, 3, 4),
        CodigoSeguridad: CompraTiempoAire.cvv,
        FechaMMAA:CompraTiempoAire.mesExp+'/'+CompraTiempoAire.anioExp,             
    };

    function getOperadora(codigoOperadora) {
        var NombreOperadora = codigoOperadora;
        if (codigoOperadora === 'CLA')
            NombreOperadora = 'Claro';
        if (codigoOperadora === 'MOV')
            NombreOperadora = 'Movistar';
        return NombreOperadora;
    }

    function salir() {
        try {            
            MobileBanking_App.app.navigate('PosicionConsolidada', { root: true });
        } catch (e) {
            showException(e.message, e.stack);
        }
    }

    return viewModel;
};