MobileBanking_App.TransferenciaExternaExitosa = function (params) {
    "use strict";
    var Imprimir = JSON.parse(params.id);

    var viewModel = {
        viewShown: function () {
            setupFloatButton(classButtons.Accept, salir);
        },
        viewShowing: function () {
            hideFloatButtons();
        },
        ValorTransferir: ((Imprimir.Moneda === 'GTQ') ? 'Q ' : '$ ') + Number(Imprimir.ValorTransferir).formatMoney(2, '.', ','),
        ValorTransferirTotal: ((Imprimir.Moneda === 'GTQ') ? 'Q ' : '$ ') + Number(Imprimir.ValorTransferirTotal).formatMoney(2, '.', ','),
        NumeroCuenta: Imprimir.Ordenante.NumeroCuenta.inputChar('-', Imprimir.Ordenante.NumeroCuenta.length - 1),
        NombresPellidos: Imprimir.Beneficiario.Nombres,
        EntidadFinancieraTercero: Imprimir.Beneficiario.NombreInstitucionBeneficiaria,
        TipoCuentaTercero: Imprimir.Beneficiario.TipoCuenta,
        NumeroCuentaTercero: Imprimir.Beneficiario.NumeroCuenta.inputChar('-', Imprimir.Beneficiario.NumeroCuenta.length - 1),
        Motivo: Imprimir.Beneficiario.MotivoTransferencia.DescripcionMotivo,
        Observacion: Imprimir.ConceptoAdicional,
        EmailTercero: Imprimir.Beneficiario.Correo,
        TipoCtaDesc:Imprimir.Beneficiario.TipoCtaDesc,
    };


    function salir() {
        MobileBanking_App.app.navigate("PosicionConsolidada", { root: true });
    }

    return viewModel;
};