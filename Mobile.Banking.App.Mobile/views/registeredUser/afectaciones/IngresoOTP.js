MobileBanking_App.IngresoOTP = function (params) {
    "use strict";

    var viewOTP =
    {
        Clave: ko.observable()
    }

    var groupValidation = 'LLAVEOTP'
    var operacion;
    var bar;
    var envioOtp = false;
    var viewModel = {
        groupValidation: groupValidation,
        otp: setupTextPasswordControl(viewOTP.Clave, 6, ' ', stateControl.disabled),
        koOtpValue: ko.observable(),
        koTitulo: ko.observable(),
        //tiempo
        countDown: ko.observable(),
        formatedTime: ko.observable(),
        viewShown: function () {
            SesionMovil.FechaActividadApp = new Date();
            envioOtp = false;
            animacionCircle();
            operacion = JSON.parse(params.id);
            switch (operacion.id) {
                case 0:
                    viewModel.koTitulo(operacion.Titulo);
                    break;
                case 1:
                    viewModel.koTitulo(operacion.Titulo)
                    break;
                case 2:
                    viewModel.koTitulo(operacion.Titulo)
                    break;
                case 3:
                    viewModel.koTitulo(operacion.Titulo)
                    break;
                case 4:
                    viewModel.koTitulo(operacion.Titulo)
                    break;
                case 5:
                    viewModel.koTitulo(operacion.Titulo)
                    break;
                case 6:
                    viewModel.koTitulo(operacion.Titulo)
                    break;
                case 7:
                    viewModel.koTitulo(operacion.Titulo)
                    break;
                case 8:
                    viewModel.koTitulo(operacion.Titulo)
                    break;
                case 9:
                    viewModel.koTitulo(operacion.Titulo)
                    break;
                case 10:
                    viewModel.koTitulo(operacion.Titulo)
                    break;
                case 11:
                    viewModel.koTitulo(operacion.Titulo)
                    break;

            }
            clearControls();
        },
        viewShowing: function () {
            hideFloatButtons();
        },
        viewHidden: function () {
            hideFloatButtons();
            envioOtp = true;
        },
        btn1: setupButtonControl('1', function () { inputNumberKey('1') }),
        btn2: setupButtonControl('2', function () { inputNumberKey('2') }),
        btn3: setupButtonControl('3', function () { inputNumberKey('3') }),
        btn4: setupButtonControl('4', function () { inputNumberKey('4') }),
        btn5: setupButtonControl('5', function () { inputNumberKey('5') }),
        btn6: setupButtonControl('6', function () { inputNumberKey('6') }),
        btn7: setupButtonControl('7', function () { inputNumberKey('7') }),
        btn8: setupButtonControl('8', function () { inputNumberKey('8') }),
        btn9: setupButtonControl('9', function () { inputNumberKey('9') }),
        btn0: setupButtonControl('0', function () { inputNumberKey('0') }),
        btnClear: setupButtonControl('', function () { inputNumberKey('clear') }, undefined, undefined, 'fa-caret-square-o-left '),//iconosCore.undo),
        btnClearAll: setupButtonControl('', function () { inputNumberKey('clearall') }, undefined, undefined, iconosCore.eraser),
        btnAceptar: setupButtonControl('Aceptar', siguiente, groupValidation, typeButtons.Success, iconosCore.check, undefined, false),
        btnCancelar: setupButtonControl('Cancelar', cancelOTP, undefined, typeButtons.Danger, iconosCore.times, undefined, false),
    };

    //function tiempo  
    ko.bindingHandlers.timer = {

        update: function (element, valueAccessor) {


            var sec = Parameters.TiempoVidaClaveOTP * 60
            var timer = setInterval(function () {
                var timeShow = fancyTimeFormat(--sec)
                $(element).text(timeShow);
                if (sec == 0) {
                    clearInterval(timer);
                }
            }, 1000);

        }
    };


    function fancyTimeFormat(time) {

        var hrs = ~~(time / 3600);
        var mins = ~~((time % 3600) / 60);
        var secs = ~~time % 60;

        var ret = "";

        if (hrs > 0) {
            ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
        }

        ret += "" + mins + ":" + (secs < 10 ? "0" : "");
        ret += "" + secs;
        return ret;
    }


    function cancelOTP() {
        showQuestionMessage(CORE_TAG('DinamicKey'), CORE_MESSAGE('CancelOperation'), function () {
            ResetSessionToken();
            envioOtp = true;
            MobileBanking_App.app.navigate('PosicionConsolidada', { root: true });
        })
    }

    function siguiente(params) {
        try {
            if (viewOTP.Clave()) {
                if (SesionMovil === undefined) {
                    SesionMovil = {
                        ContextoCliente: {}
                    }
                }
                SesionMovil.ContextoCliente.PasswordTransaccional = viewOTP.Clave();
                envioOtp = true;
                changePropertyControl('#btn0', typeControl.Button, 'disabled', true);
                changePropertyControl('#btn1', typeControl.Button, 'disabled', true);
                changePropertyControl('#btn2', typeControl.Button, 'disabled', true);
                changePropertyControl('#btn3', typeControl.Button, 'disabled', true);
                changePropertyControl('#btn4', typeControl.Button, 'disabled', true);
                changePropertyControl('#btn5', typeControl.Button, 'disabled', true);
                changePropertyControl('#btn6', typeControl.Button, 'disabled', true);
                changePropertyControl('#btn7', typeControl.Button, 'disabled', true);
                changePropertyControl('#btn8', typeControl.Button, 'disabled', true);
                changePropertyControl('#btn9', typeControl.Button, 'disabled', true);
                changePropertyControl('#btnClear', typeControl.Button, 'disabled', true);
                changePropertyControl('#btnClearAll', typeControl.Button, 'disabled', true);
                switch (operacion.id) {
                    case 0:
                        operacion.dtoTransferenciaDirecta.CuentaDestino = operacion.dtoTransferenciaDirecta.CuentaDestino.replace('-', '');
                        operacion.dtoTransferenciaDirecta.CuentaOrigen = operacion.dtoTransferenciaDirecta.CuentaOrigen.replace('-', '');
                        RealizarTranferenciaDirecta(operacion.dtoTransferenciaDirecta, SesionMovil.ContextoCliente, operacion.dtoTransferenciaDirecta.emailOrigen, operacion.dtoTransferenciaDirecta.emailDestino, operacion.dtoTransferenciaDirecta.Concepto, function (data) {
                            var resultadoTransferencia = data;
                            SesionMovil.ContextoCliente.PasswordTransaccional = null;
                            if (resultadoTransferencia != null)
                                operacion.dtoTransferenciaDirecta.Comprobante = resultadoTransferencia.Comprobante;
                            ResetSessionToken();
                            var uri = MobileBanking_App.app.router.format({
                                view: 'TransferenciaInternaExitosa',
                                id: JSON.stringify(operacion.dtoTransferenciaDirecta)
                            });
                            MobileBanking_App.app.navigate(uri, { root: true });
                            ObtenerCuentasCliente(SesionMovil.ContextoCliente, function (data) {
                                SesionMovil.PosicionConsolidada.CuentasCliente = data
                                sessionStorage.setItem('', '');
                                sessionStorage.setItem('FechaActividadApp', new Date());
                            });
                        });

                        break;
                    case 1:
                        var DtoFormaPagoTransInterbancaria =
                        {
                            CodigoFormaPago: "EFECRECI",
                            Cotizacion: 1,
                            Moneda: operacion.dtoTransferenciaExterna.Moneda,
                            //Valor: operacion.dtoTransferenciaExterna.ValorTransferir + operacion.dtoTransferenciaExterna.Tarifa,
                            Valor: operacion.dtoTransferenciaExterna.ValorTransferir,
                            //ValorConversion: operacion.dtoTransferenciaExterna.ValorTransferir + operacion.dtoTransferenciaExterna.Tarifa
                            ValorConversion: operacion.dtoTransferenciaExterna.ValorTransferir,
                            correoCliente: "",
                            numeroCuenta: operacion.dtoTransferenciaExterna.Ordenante.NumeroCuenta,
                            monto: operacion.dtoTransferenciaExterna.ValorTransferirTotal,
                            codigoAtributo: "ATRDEBITOACH",
                            bancoDestino: operacion.dtoTransferenciaExterna.Beneficiario.DFI,
                            tipoCuentaDestino: operacion.dtoTransferenciaExterna.Beneficiario.TipoCuenta,
                            cuentaDestino: operacion.dtoTransferenciaExterna.Beneficiario.NumeroCuenta,
                            observacion: operacion.dtoTransferenciaExterna.ConceptoAdicional,
                            nombreBeneficiario: operacion.dtoTransferenciaExterna.Beneficiario.Nombres,
                            correoBeneficiario: operacion.dtoTransferenciaExterna.Beneficiario.Correo,
                            esAchInmediato: operacion.dtoTransferenciaExterna.EsAchInmediato,

                        };
                        TransferenciaACH(DtoFormaPagoTransInterbancaria.correoCliente, DtoFormaPagoTransInterbancaria.numeroCuenta,
                            DtoFormaPagoTransInterbancaria.Moneda, DtoFormaPagoTransInterbancaria.monto,
                            DtoFormaPagoTransInterbancaria.codigoAtributo, DtoFormaPagoTransInterbancaria.bancoDestino,
                            DtoFormaPagoTransInterbancaria.tipoCuentaDestino, DtoFormaPagoTransInterbancaria.cuentaDestino,
                            DtoFormaPagoTransInterbancaria.observacion, DtoFormaPagoTransInterbancaria.nombreBeneficiario,
                            DtoFormaPagoTransInterbancaria.correoBeneficiario, DtoFormaPagoTransInterbancaria.esAchInmediato, function (data) {

                                var resultadoTransferenciaExterna = data;
                                SesionMovil.ContextoCliente.PasswordTransaccional = null;
                                if (resultadoTransferenciaExterna) {
                                    ResetSessionToken();
                                    var uri = MobileBanking_App.app.router.format({
                                        view: 'TransferenciaExternaExitosa',
                                        id: JSON.stringify(operacion.dtoTransferenciaExterna)
                                    });
                                    MobileBanking_App.app.navigate(uri, { root: true });
                                }
                                ObtenerCuentasCliente(SesionMovil.ContextoCliente, function (data) {
                                    SesionMovil.PosicionConsolidada.CuentasCliente = data
                                    sessionStorage.setItem('', '');
                                    sessionStorage.setItem('FechaActividadApp', new Date());
                                });
                            })

                        break;
                    case 2:
                        CrearCuentaPermitida(SesionMovil.ContextoCliente, operacion.CuentaBeneficiariaInterna, function (data) {
                            var registrarBeneficiarioInterno = data;
                            SesionMovil.ContextoCliente.PasswordTransaccional = null;
                            if (registrarBeneficiarioInterno != null) {
                                ResetSessionToken();
                                showSuccessMessage('Beneficiario Interno', 'El Beneficiario Interno se registró exitosamente', function () {
                                    MobileBanking_App.app.navigate('BeneficiariosInternos', { root: true });
                                })
                            }
                        })
                        break;
                    case 3:
                        CrearCuentaPermitidaACH(operacion.dtoCuentaBeneficiariaExterna, function (data) {
                            var registroBeneficiarioExterno = data;
                            SesionMovil.ContextoCliente.PasswordTransaccional = null;
                            if (registroBeneficiarioExterno) {
                                ResetSessionToken();
                                showSuccessMessage('Cuenta de Tercero', 'El Beneficiario Externo se registró exitosamente', function () {
                                    MobileBanking_App.app.navigate('BeneficiariosExternos', { root: true });
                                })
                            }
                        })
                        break;
                    case 4:
                        RecargarTiempoAire(
                            SesionMovil.ContextoCliente,
                            operacion.dtoCompraTiempoAire.cadena,
                            operacion.dtoCompraTiempoAire.numeroCelular,
                            operacion.dtoCompraTiempoAire.dtoCanalTarjeta,//tarjeta,
                            0,//plazo,
                            operacion.dtoCompraTiempoAire.valor,
                            operacion.dtoCompraTiempoAire.cvv,
                            operacion.dtoCompraTiempoAire.anioExp,
                            operacion.dtoCompraTiempoAire.mesExp,
                            function (data) {
                                var recargarTiempoAire = data;
                                if (recargarTiempoAire != null && recargarTiempoAire.length > 0) {
                                    operacion.dtoCompraTiempoAire.Secuencial = recargarTiempoAire;
                                    ResetSessionToken();
                                    var uri = MobileBanking_App.app.router.format({
                                        view: 'CompraTiempoAireExitosa',
                                        id: JSON.stringify(operacion.dtoCompraTiempoAire)
                                    });
                                    MobileBanking_App.app.navigate(uri, { root: true });
                                }
                                ObtenerCuentasCliente(SesionMovil.ContextoCliente, function (data) {
                                    SesionMovil.PosicionConsolidada.CuentasCliente = data
                                    sessionStorage.setItem('', '');
                                    sessionStorage.setItem('FechaActividadApp', new Date());
                                });
                            })

                        break;
                    case 5:
                        var data = operacion.dtoEnrolarBilleteraMovil;
                        EnrolarBIMO(data.telefono, data.numeroCuenta, SesionMovil.ContextoCliente, function (data) {
                            SesionMovil.ContextoCliente.PasswordTransaccional = null;
                            if (data.ok) {
                                showSuccessMessage(CORE_TAG('DefaultTitle'), 'Cuenta afiliada correctamente', function () {
                                    ResetSessionToken();
                                    MobileBanking_App.app.navigate('PosicionConsolidada', { root: true });
                                    ObtenerCuentasCliente(SesionMovil.ContextoCliente, function (data) {
                                        SesionMovil.PosicionConsolidada.CuentasCliente = data
                                        sessionStorage.setItem('', '');
                                        sessionStorage.setItem('FechaActividadApp', new Date());
                                    });
                                })
                            }

                        });
                        break;
                    case 6:
                        var data = operacion.dtoPagoBilleteraMovil;
                        PagarBIMO(data.monto, data.celularAsociado, data.celularBeneficiario, data.concepto, data.emailTercero, data.pagoPendienteId, data.tipoTransaccion, data.moneda, SesionMovil.ContextoCliente, function (data) {
                            SesionMovil.ContextoCliente.PasswordTransaccional = null;
                            if (data.ok) {
                                showSuccessMessage(CORE_TAG('DefaultTitle'), 'Pago realizado correctamente', function () {
                                    ResetSessionToken();
                                    MobileBanking_App.app.navigate('PosicionConsolidada', { root: true });
                                    ObtenerCuentasCliente(SesionMovil.ContextoCliente, function (data) {
                                        SesionMovil.PosicionConsolidada.CuentasCliente = data
                                        sessionStorage.setItem('', '');
                                        sessionStorage.setItem('FechaActividadApp', new Date());
                                    });
                                })
                            }

                        });
                        break;
                    case 7:
                        var data = operacion.dtoPagoCNT;
                        if (data.tipoPago === 'TRJ') {
                            PagarCNTTarjetaCredito(SesionMovil.ContextoCliente,
                                data.idCuentaTarjeta,
                                data.cvv,
                                data.anioVence,
                                data.mesVence,
                                data.criterioConsulta,
                                data.tipoServicio,
                                data.numeroTelefonoContrato,
                                data.totalAPagar,
                                data.mailTerceros,
                                data.objRespuestaCNT,
                                function (data) {
                                    if (data === true) {
                                        SesionMovil.ContextoCliente.PasswordTransaccional = null;
                                        showSimpleMessage(CORE_TAG('DefaultTitle'), 'El pago se realizó con éxito.', function () {
                                            ResetSessionToken();

                                            var result = {
                                                resultGestion: data,
                                                NombreTitular: operacion.dtoPagoCNT.nombreTitular,
                                                NumeroTelefonoContrato: operacion.dtoPagoCNT.numeroTelefonoContrato,
                                                TotalAPagar: operacion.dtoPagoCNT.totalAPagar,
                                                MailTerceros: operacion.dtoPagoCNT.mailTerceros,
                                                SecuencialPagoBSolidario: operacion.dtoPagoCNT.secuencial,
                                                CuentaTarjetaDebitar: operacion.dtoPagoCNT.metodoPago,
                                            }

                                            var uri = MobileBanking_App.app.router.format({
                                                view: 'PagoServBasicoCNTExitoso',
                                                id: JSON.stringify(result)
                                            });
                                            MobileBanking_App.app.navigate(uri, { root: true });



                                        }, undefined);
                                    }
                                }
                            );
                        }
                        else {
                            PagarCNTDebitoCuenta(SesionMovil.ContextoCliente,
                                data.nombreTitular,
                                data.cuentaTarjetaDebitar,
                                data.secuencial,
                                data.totalAPagar,
                                data.criterioConsulta,
                                data.tipoServicio,
                                data.numeroTelefonoContrato,
                                data.mailTerceros,
                                data.objRespuestaCNT,
                                function (data) {
                                    if (data === true) {
                                        SesionMovil.ContextoCliente.PasswordTransaccional = null;
                                        showSimpleMessage(CORE_TAG('DefaultTitle'), 'El pago se realizó con éxito.', function () {
                                            ResetSessionToken();
                                            ObtenerCuentasCliente(SesionMovil.ContextoCliente, function (data) {
                                                SesionMovil.PosicionConsolidada.CuentasCliente = data
                                                sessionStorage.setItem('', '');
                                                sessionStorage.setItem('FechaActividadApp', new Date());
                                                var result = {
                                                    resultGestion: data,
                                                    NombreTitular: operacion.dtoPagoCNT.nombreTitular,
                                                    NumeroTelefonoContrato: operacion.dtoPagoCNT.numeroTelefonoContrato,
                                                    TotalAPagar: operacion.dtoPagoCNT.totalAPagar,
                                                    MailTerceros: operacion.dtoPagoCNT.mailTerceros,
                                                    SecuencialPagoBSolidario: operacion.dtoPagoCNT.secuencial,
                                                    CuentaTarjetaDebitar: operacion.dtoPagoCNT.metodoPago,
                                                }
                                                var uri = MobileBanking_App.app.router.format({
                                                    view: 'PagoServBasicoCNTExitoso',
                                                    id: JSON.stringify(result)
                                                });
                                                MobileBanking_App.app.navigate(uri, { root: true });
                                            });
                                        }, undefined);

                                    }
                                }
                            );
                        }
                        break;
                    case 8:
                        var tipoPago = operacion.dtoPagoServicio.InformacionPago.formaPago.Tipo;
                        empresaAPagar = operacion.dtoPagoServicio.IdEmpresa;
                        if (tipoPago === 'TRJ') {
                            PagarServicioEasyCashTarjetaCredito(SesionMovil.ContextoCliente,
                                operacion.dtoPagoServicio,
                                function (result) {
                                    SesionMovil.ContextoCliente.PasswordTransaccional = null;
                                    ResetSessionToken();
                                    if (+result.SecuencialBanco > 0) {
                                        operacion.dtoPagoServicio.ResultPago = result;
                                        var uri = MobileBanking_App.app.router.format({
                                            view: 'PagoServicioExitoso',
                                            id: JSON.stringify(operacion.dtoPagoServicio)
                                        });
                                        MobileBanking_App.app.navigate(uri, { root: true });
                                    }
                                });
                        }
                        else {
                            PagarServicioEasyCashDebitoCuenta(SesionMovil.ContextoCliente,
                                operacion.dtoPagoServicio,
                                function (result) {
                                    if (+result.SecuencialBanco > 0) {
                                        SesionMovil.ContextoCliente.PasswordTransaccional = null;
                                        ResetSessionToken();
                                        ObtenerCuentasCliente(SesionMovil.ContextoCliente, function (data) {
                                            SesionMovil.PosicionConsolidada.CuentasCliente = data
                                            sessionStorage.setItem('', '');
                                            sessionStorage.setItem('FechaActividadApp', new Date());
                                            operacion.dtoPagoServicio.ResultPago = result;
                                            var uri = MobileBanking_App.app.router.format({
                                                view: 'PagoServicioExitoso',
                                                id: JSON.stringify(operacion.dtoPagoServicio)
                                            });
                                            MobileBanking_App.app.navigate(uri, { root: true });
                                        });
                                    }
                                });
                        }
                        break;

                    case 9:
                        PagarCreditoConDebitoACuenta(
                            operacion.dtoPagarCreditoConDebitoACuenta.ctaMoneda,
                            operacion.dtoPagarCreditoConDebitoACuenta.numeroCuenta,
                            operacion.dtoPagarCreditoConDebitoACuenta.monto,
                            operacion.dtoPagarCreditoConDebitoACuenta.numeroCredito,
                            function (result) {
                                SesionMovil.ContextoCliente.PasswordTransaccional = null;
                                ResetSessionToken();
                                var uri = MobileBanking_App.app.router.format({
                                    view: 'PagoCreditoExitoso',
                                    id: JSON.stringify(operacion.dtoPagarCreditoConDebitoACuenta)
                                });

                                ObtenerCreditosCliente(function (data) {
                                    SesionMovil.PosicionConsolidada.CreditosCliente = data;
                                    ObtenerCuentasCliente(SesionMovil.ContextoCliente, function (data) {
                                        SesionMovil.PosicionConsolidada.CuentasCliente = data
                                        sessionStorage.setItem('', '');
                                        sessionStorage.setItem('FechaActividadApp', new Date());
                                        MobileBanking_App.app.navigate(uri, { root: true });
                                    });

                                });
                            });
                        break;

                    case 10:
                        if (operacion.dtoPagarTarjetaConDebitoACuenta.EsPropia) {

                            PagarTRJRevolvente(operacion.dtoPagarTarjetaConDebitoACuenta.NumeroCuenta, operacion.dtoPagarTarjetaConDebitoACuenta.CuentaMoneda,
                                operacion.dtoPagarTarjetaConDebitoACuenta.Monto, operacion.dtoPagarTarjetaConDebitoACuenta.IdCuentaTarjeta,
                                function (result) {
                                    operacion.dtoPagarTarjetaConDebitoACuenta.numeroTransaccion = result;

                                    var uri = MobileBanking_App.app.router.format({
                                        view: 'PagoTarjetaExitoso',
                                        id: JSON.stringify(operacion.dtoPagarTarjetaConDebitoACuenta)
                                    });

                                    ObtenerCuentasCliente(SesionMovil.ContextoCliente, function (data) {
                                        SesionMovil.PosicionConsolidada.CuentasCliente = data
                                        sessionStorage.setItem('', '');
                                        sessionStorage.setItem('FechaActividadApp', new Date());
                                        MobileBanking_App.app.navigate(uri, { root: true });
                                    })
                                }
                            );
                        } else {
                            PagarTarjetaConDebitoACuenta(
                                operacion.dtoPagarTarjetaConDebitoACuenta.CuentaMoneda,
                                operacion.dtoPagarTarjetaConDebitoACuenta.NumeroCuenta,
                                operacion.dtoPagarTarjetaConDebitoACuenta.MonedaTransaccion,
                                operacion.dtoPagarTarjetaConDebitoACuenta.Monto,
                                operacion.dtoPagarTarjetaConDebitoACuenta.NumeroTarjeta,
                                //operacion.dtoPagarTarjetaConDebitoACuenta.TasaDeConversion,

                                function (result) {
                                    SesionMovil.ContextoCliente.PasswordTransaccional = null;
                                    ResetSessionToken();
                                    operacion.dtoPagarTarjetaConDebitoACuenta.numeroTransaccion = result;
                                    var uri = MobileBanking_App.app.router.format({
                                        view: 'PagoTarjetaExitoso',
                                        id: JSON.stringify(operacion.dtoPagarTarjetaConDebitoACuenta)
                                    });

                                    ObtenerCuentasCliente(SesionMovil.ContextoCliente, function (data) {
                                        SesionMovil.PosicionConsolidada.CuentasCliente = data
                                        sessionStorage.setItem('', '');
                                        sessionStorage.setItem('FechaActividadApp', new Date());
                                        MobileBanking_App.app.navigate(uri, { root: true });
                                    });

                                });
                        }
                        break;

                    case 11:
                        GrabarDtoCuposMaximosCuentas(operacion.dtoConfigurarMontosMaximos.Cta.TieneTarjetaDebito, undefined,
                            undefined, undefined, operacion.dtoConfigurarMontosMaximos.MaximoTransfer, function (data) {
                                if (data) {
                                    SesionMovil.ContextoCliente.PasswordTransaccional = null;
                                    ResetSessionToken();
                                    return showWarningMessage(CORE_TAG('DefaultTitle'), 'Se registraron tus montos máximos con éxito.', function () {
                                        var uri = MobileBanking_App.app.router.format({
                                            view: 'PosicionConsolidada',
                                            id: JSON.stringify(operacion.dtoConfigurarMontosMaximos)
                                        });
                                        MobileBanking_App.app.navigate(uri, { root: true });
                                    });
                                };
                            });
                        break;

                }
                bar = null;
            } else {
                showWarningMessage(CORE_TAG('DinamicKey'), CORE_MESSAGE('InputDinamicKey'), function () {
                    $('#otp').dxTextBox('instance').focus();
                })
            }
        } catch (e) {
            showException(e.message, e.stack);
        }
    }

    function animacionCircle() {
        try {
            $("#container").html(null);
            var container = document.getElementById('container');

            bar = new ProgressBar.Circle(container, {
                strokeWidth: 9,
                easing: 'easeInOut',
                duration: parseInt(Parameters.TiempoVidaClaveOTP) * 60 * 1000,
                color: '#FFEA82',
                trailColor: '#aaa',
                trailWidth: 1,
                svgStyle: null,
                from: { color: '#d52133', width: 2 },
                to: { color: '#f85032', width: 6 },
                step: function (state, circle) {
                    circle.path.setAttribute('stroke', state.color);
                    circle.path.setAttribute('stroke-width', state.width);
                    if (state.width >= 6 && envioOtp == false) {
                        showQuestionMessage('Ingreso OTP', 'Su clave temporal ha expirado. ¿Desea que se le envíe un nuevo código?', function () {
                            envioOtp = false;
                            EnviarOTP(SesionMovil.ContextoCliente, function () {
                                showNotificationSuccess('Se ha enviado un nuevo código temporal a su móvil o correo');
                                MobileBanking_App.app.navigate('PosicionConsolidada', { root: true });
                                MobileBanking_App.app.navigate('IngresoOTP?id=' + JSON.stringify(operacion), { root: true });
                            });
                        }, function () {
                            ResetSessionToken();
                            envioOtp = true;
                            MobileBanking_App.app.navigate('PosicionConsolidada', { root: true });
                        })
                    }
                }
            });

            bar.animate(1.0);
        } catch (e) {
            showException(e.message, e.stack);
        }
    }

    function inputNumberKey(number) {
        setTimeout(function () {
            var currentValueOtp = $('#otp').dxTextBox('option', 'value');
            if (!currentValueOtp)
                currentValueOtp = '';
            switch (number) {
                case 'clear':
                    currentValueOtp = currentValueOtp.substring(0, currentValueOtp.length - 1);
                    break;
                case 'clearall':
                    currentValueOtp = '';
                    break;
                default:
                    currentValueOtp = currentValueOtp + number;
            }
            $('#otp').dxTextBox('option', 'value', currentValueOtp);
        }, 300);
    }

    function clearControls() {
        changePropertyControl('#otp', typeControl.TextBox, 'value', undefined);
        changePropertyControl('#btn0', typeControl.Button, 'disabled', false);
        changePropertyControl('#btn1', typeControl.Button, 'disabled', false);
        changePropertyControl('#btn2', typeControl.Button, 'disabled', false);
        changePropertyControl('#btn3', typeControl.Button, 'disabled', false);
        changePropertyControl('#btn4', typeControl.Button, 'disabled', false);
        changePropertyControl('#btn5', typeControl.Button, 'disabled', false);
        changePropertyControl('#btn6', typeControl.Button, 'disabled', false);
        changePropertyControl('#btn7', typeControl.Button, 'disabled', false);
        changePropertyControl('#btn8', typeControl.Button, 'disabled', false);
        changePropertyControl('#btn9', typeControl.Button, 'disabled', false);
        changePropertyControl('#btnClear', typeControl.Button, 'disabled', false);
        changePropertyControl('#btnClearAll', typeControl.Button, 'disabled', false);
        $('#otp').dxTextBox('instance').focus();
    }


    return viewModel;
};