MobileBanking_App.ConfirmacionTransferenciaExterna = function (params) {
    "use strict";
    var Confirmar = JSON.parse(params.id);



    var viewModel = {
        viewShown: function () {
            try {
                SesionMovil.FechaActividadApp = new Date();
                setupFloatButton(classButtons.Cancel, cancelar, undefined, sizeFloatButtons.small, typeFloatButtons.white);
                setupFloatButton(classButtons.Accept, confirmar);
            } catch (e) {
                showException(e.message, e.stack);
            }
        },
        viewShowing: function () {
            hideFloatButtons();
        },
        MontoMostrar: ((Confirmar.Moneda === 'GTQ') ? 'Q ' : '$ ') + Number(Confirmar.ValorTransferir).formatMoney(2, '.', ','),
        ValorTransferir: Confirmar.ValorTransferir,
        ValorTransferirTotal: parseFloat(Confirmar.ValorTransferirTotal),
        NumeroCuenta: Confirmar.Ordenante.NumeroCuenta.inputChar('-', Confirmar.Ordenante.NumeroCuenta.length - 1),
        NombresApellidos: Confirmar.Beneficiario.Nombres,
        NumeroIdentificacion: Confirmar.Beneficiario.Identificacion,
        ValorTransferirMostrar: ((Confirmar.Moneda === 'GTQ') ? 'Q ' : '$ ') + Number(Confirmar.ValorTransferir).formatMoney(2, '.', ','),
        ValorTransferirTotalMostrar: ((Confirmar.Moneda === 'GTQ') ? 'Q ' : '$ ') + Number(Confirmar.ValorTransferirTotal).formatMoney(2, '.', ','),
        EntidadFinancieraTercero: Confirmar.Beneficiario.NombreInstitucionBeneficiaria,
        TipoCuentaTercero: Confirmar.Beneficiario.TipoCuenta,
        NumeroCuentaTercero: Confirmar.Beneficiario.NumeroCuenta.inputChar('-', Confirmar.Beneficiario.NumeroCuenta.length - 1),
        Motivo: Confirmar.Beneficiario.MotivoTransferencia.DescripcionMotivo,
        Observacion: Confirmar.ConceptoAdicional,
        EmailTercero: Confirmar.Beneficiario.Correo,
        DescripcionTipoCta: Confirmar.Beneficiario.TipoCtaDesc,
        AplicarTransfer: (Confirmar.EsAchInmediato === true) ? "Ach Inmediato" : "Ach",
        
    };

    function confirmar() {
        try {
            EnviarOTP(SesionMovil.ContextoCliente, function (data) {
                var resultadoEnviarOTP = data;
                if (resultadoEnviarOTP) {
                    var operacionAIngresoOTP = OperacionEjecutar.TransferenciaExterna;
                    var dto =
                    {
                        Ordenante: Confirmar.Ordenante,
                        Beneficiario: Confirmar.Beneficiario,
                        FechaProceso: Globalize.dateFormatter({ raw: 'yyyy/MM/dd HH:mm:ss' })(new Date()),
                        Agencia: Confirmar.Agencia,
                        TipoTransferencia: Confirmar.TipoTransferencia,
                        ExcentoISD: Confirmar.ExcentoISD,
                        ValorComision: Confirmar.ValorComision,
                        Impuesto: Confirmar.Impuesto,
                        ValorTransferir: Confirmar.ValorTransferir,
                        ValorTransferirTotal: parseFloat(Confirmar.ValorTransferir).toFixed(2),
                        Moneda: Confirmar.Moneda,
                        ConceptoAdicional: Confirmar.ConceptoAdicional,
                        EsAchInmediato: Confirmar.EsAchInmediato,

                    };
                    operacionAIngresoOTP.dtoTransferenciaExterna = dto;
                    var uri = MobileBanking_App.app.router.format({
                        view: 'IngresoOTP',
                        id: JSON.stringify(operacionAIngresoOTP)
                    });
                    MobileBanking_App.app.navigate(uri, { root: true });
                }
            }) ///envia el sms al dispotivo
            
        } catch (e) {
            showException(e.message, e.stack);
        }
    }

    function cancelar() {
        try {
            MobileBanking_App.app.navigate('TransferenciaExterna', { root: true });

        } catch (e) {
            showException(e.message, e.stack);
        }
    }

    return viewModel;
};