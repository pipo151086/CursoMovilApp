MobileBanking_App.TIGOSTAR = function (params) {
    "use strict";

    var groupValidation = 'groupValidator';

    var viewModel = {
        txtCodigoCliente: ko.observable(),
        groupValidation: groupValidation,
        viewShowing: function () {
            hideFloatButtons();
        },
        viewShown: function () {
            setupFloatButton(classButtons.Cancel, cancelar, undefined, sizeFloatButtons.small, typeFloatButtons.white);
            setupFloatButton(classButtons.Accept, consultar, undefined, undefined, undefined, undefined, groupValidation);
        },
    };


    function consultar(params) {
        var isValid = DevExpress.validationEngine.validateGroup(groupValidation).isValid;
        if (isValid) {
            var codigoCli = $('#txtCodigoCliente').dxTextBox('option', 'value');
            var requerimiento =
            {
                Comercio: tipoServicioBasicoStr.TIGO_STAR,
                TipoCuenta: "0",
                NumeroCuenta: codigoCli
            };


            var currentPayment = {
                numeroCuenta: codigoCli,
                tipoComercio: tipoServicioBasicoStr.TIGO_STAR,
                infoPago: {
                    tipoBusqueda: "",
                    montoMostrar: "",
                    tipoMostrar: "",
                    monto: "",
                    nombre: "",
                    nit: "",
                    correo: "",
                },
                respSaldo: {
                    Saldo: "",
                    Nombre: "",
                    Direccion: "",
                    Documento: "",
                    FechaPago: "",
                    TipoBusquedaSeleccionada: ""
                },
            }


            ConsultaPagoServicios(requerimiento, function (respSaldo) {
                
                if (!respSaldo)
                    showSimpleMessage('Pago de Serivcios', 'No se obtubo el saldo a cancelar', function () {
                        return;
                    }, undefined);
                else {
                    currentPayment.respSaldo = respSaldo;
                    RedirectOnSuccess(currentPayment);
                }
            });



        }
    }


    function RedirectOnSuccess(currentPayment) {
        var uri = MobileBanking_App.app.router.format({
            view: 'TIGOSTARPagarServicio',
            id: JSON.stringify(currentPayment)
        });
        MobileBanking_App.app.navigate(uri, { root: true });
    }

    function cancelar(e) {
        MobileBanking_App.app.navigate('TipoServicio', { root: true });
    }

    return viewModel;
};