MobileBanking_App.ConfirmarBeneficiarioExterno = function (params) {
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
        Beneficiario: Confirmar.Beneficiario,
        CuentaOrigen: Confirmar.CodigoEntidadFinanciera,
        NumeroCuenta: Confirmar.NumeroCuenta.toString().inputChar('-', Confirmar.NumeroCuenta.toString().length - 1),
        Moneda: Confirmar.DescripcionMoneda,
        TipoCuenta: Confirmar.TipoCuenta,
        Banco: Confirmar.DescripcionEntidadFinanciera,
        CtaDesc: Confirmar.CtaDesc,
        


    }


    function confirmar() {

        //try {
        //    EnviarOTP(SesionMovil.ContextoCliente, function (data) {
        //        var resultadoEnviarOTP = data;
        //        if (resultadoEnviarOTP) {
        //            var operacionAIngresoOTP = OperacionEjecutar.CuentaBeneficiariaExterna;
        //            operacionAIngresoOTP.dtoCuentaBeneficiariaExterna = Confirmar;

        //            var uri = MobileBanking_App.app.router.format({
        //                view: 'IngresoOTP',
        //                id: JSON.stringify(operacionAIngresoOTP)
        //            });
        //            MobileBanking_App.app.navigate(uri, { root: true });
        //        }
        //    }) ///envia el sms al dispotivo

        //} catch (e) {
        //    showException(e.message, e.stack);
        //}


        CrearCuentaPermitidaACH(Confirmar, function (data) {
            var registroBeneficiarioExterno = data;
            SesionMovil.ContextoCliente.PasswordTransaccional = null;
            if (registroBeneficiarioExterno) {
                showSuccessMessage('Cuenta de Tercero', 'El Beneficiario Externo se registró exitosamente.', function () {
                    MobileBanking_App.app.navigate('PosicionConsolidada', { root: true });
                })
            }
        })

    }

    function cancelar() {
        try {
            MobileBanking_App.app.navigate('PosicionConsolidada', { root: true });

        } catch (e) {
            showException(e.message, e.stack);
        }
    }



return viewModel;
};