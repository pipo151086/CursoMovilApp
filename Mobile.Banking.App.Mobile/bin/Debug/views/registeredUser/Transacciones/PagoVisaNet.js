MobileBanking_App.PagoVisaNet = function (params) {
    "use strict";

    var datosPago = null;

    if (params.id)
        datosPago = JSON.parse(params.id);

    var Anios = [];
    var MMSelected = null;
    var AASelected = null;
    var groupValidation = 'PAGOCONTARJETA';

    var viewModel = {
        groupValidation: groupValidation,
        txtCorreoComprobante: setupEmailControl(SesionMovil.ControlAccesoGlobal.CorreoElectronicoRegistrado, undefined, undefined),
        viewShown: function () {
            setupFloatButton(classButtons.Cancel, cancelar, undefined, sizeFloatButtons.small, typeFloatButtons.white);
            setupFloatButton(classButtons.Accept, siguiente, undefined, undefined, undefined, undefined, groupValidation);
            $('#txtMonto').text(datosPago.montoMostrar);
            $('#txtNumTarjeta').attr('type', 'number');
            $('#txtNumTarjeta').attr('type', 'text');
            $('#txtNumTarjeta').attr('pattern', '[0-9]*');
            Anios = getAniosForward(5);
            $('#rdbAA').dxRadioGroup('option', 'dataSource', Anios);
        },
        viewShowing: function () {
            hideFloatButtons();
        },
        viewHidden: function () {
            hideFloatButtons();
        },
        txtNumTarjeta: setupTextPasswordControl("", 16, "Número de Tarjeta", typeControl.text),
        txtCodigoSeguridad: setupNumberBox(undefined, 111, 999, undefined, undefined, undefined, 'Código de seguridad'),
        txtMonto: ko.observable(),
        //---------------------------------------------------------
        btnCambiarMM: setupButtonControl('Mes', changeMM, undefined, undefined, iconosCore.chevron_down, undefined, true),
        popupSeleccionMM: setupPopup(false, '70%', 'auto', true, 'Mes Caducidad', true),
        rdbMM: setupRadioGroup(undefined, mesesAnio, 'Texto', 'Numero'),
        btnCancelarMM: setupButtonControlDefault(classButtons.Cancel, cancelMM),
        //---------------------------------------------------------
        btnCambiarAA: setupButtonControl('Año', changeAA, undefined, undefined, iconosCore.chevron_down, undefined, true),
        popupSeleccionAA: setupPopup(false, '70%', 'auto', true, 'Año Caducidad', true),
        rdbAA: setupRadioGroup(undefined, Anios, 'Anio', 'IdAnio'),
        btnCancelarAA: setupButtonControlDefault(classButtons.Cancel, cancelAA),
        //---------------------------------------------------------
    };

    viewModel.rdbAA.onValueChanged = function (e) {
        var select = e.value;
        for (var i = 0; i < Anios.length; i++) {
            if (select == Anios[i].IdAnio) {
                AASelected = Anios[i];
                i = Anios.length;
            }
        }
        if (AASelected) {
            changePropertyControl('#btnCambiarAA', typeControl.Button, 'text', AASelected.Anio);
            changePropertyControl('#popupSeleccionAA', typeControl.Popup, 'visible', false);
        }
    }

    function changeAA() {
        changePropertyControl('#popupSeleccionAA', typeControl.Popup, 'visible', true);
    }
    function cancelAA() {
        changePropertyControl('#popupSeleccionAA', typeControl.Popup, 'visible', false);
    }

    viewModel.popupSeleccionMM.onShown = function (e) {
        $('#floatButtons').hide();
    }
    viewModel.popupSeleccionAA.onShown = function (e) {
        $('#floatButtons').hide();
    }

    //----------------------------------------------------------------------
    //----------------------------------------------------------------------


    viewModel.rdbMM.onValueChanged = function (e) {

        var select = e.value;
        for (var i = 0; i < mesesAnio.length; i++) {
            if (select == mesesAnio[i].Numero) {
                MMSelected = mesesAnio[i];
                i = mesesAnio.length;
            }
        }
        if (MMSelected) {
            changePropertyControl('#btnCambiarMM', typeControl.Button, 'text', MMSelected.Texto);
            changePropertyControl('#popupSeleccionMM', typeControl.Popup, 'visible', false);
        }
    }

    function changeMM() {
        changePropertyControl('#popupSeleccionMM', typeControl.Popup, 'visible', true);
    }
    function cancelMM() {
        changePropertyControl('#popupSeleccionMM', typeControl.Popup, 'visible', false);
    }

    viewModel.popupSeleccionMM.onHidden = function (e) {
        $('#floatButtons').show();
    }
    viewModel.popupSeleccionAA.onHidden = function (e) {
        $('#floatButtons').show();
    }

    //----------------------------------------------------------------------
    //----------------------------------------------------------------------

    var siguiente = function (params) {
        var result = params.validationGroup.validate();
        if (!MMSelected) {
            showWarningMessage(CORE_TAG('DefaultTitle'), 'Debes Seleccionar el mes de expiración', function () {
                changePropertyControl('#popupSeleccionMM', typeControl.Popup, 'visible', true);
            });
            return;

        }
        if (!AASelected) {
            showWarningMessage(CORE_TAG('DefaultTitle'), 'Debes Seleccionar el año de expiración', function () {
                changePropertyControl('#popupSeleccionAA', typeControl.Popup, 'visible', true);
            });
            return;
        }
        var thisMonth = Date.today().toString("MM");
        var thisYear = Date.today().toString("yy");
        if (+thisYear === +AASelected.IdAnio) {
            if (+thisMonth > +MMSelected.Numero) {
                showWarningMessage(CORE_TAG('DefaultTitle'), 'La fecha de expiración no puede ser menor a la actual', function () {
                    changePropertyControl('#popupSeleccionMM', typeControl.Popup, 'visible', true);
                });
                return;
            }
        }

        if (result.isValid) {
            datosPago.TrjPago = $('#txtNumTarjeta').dxTextBox('option', 'value');

            switch (datosPago.pagoProducto) {
                case 0: // CREDITO
                    PagarBotonVisaNet(
                        "GTQ",
                        //datosPago.TarjCredConsultado.Moneda,
                        datosPago.TrjPago,
                        $('#txtCodigoSeguridad').dxNumberBox('option', 'value'),
                        AASelected.IdAnio + MMSelected.Numero,
                        datosPago.monto,
                        datosPago.numeroCredito,
                        0,
                        $('#txtCorreoComprobante').dxTextBox('option', 'value'),
                        function (data) {
                            datosPago.Response = data;
                            ObtenerCreditosCliente(function (dataCreditos) {
                                SesionMovil.PosicionConsolidada.CreditosCliente = dataCreditos;
                                sessionStorage.setItem('', '');
                                sessionStorage.setItem('FechaActividadApp', new Date());
                                MobileBanking_App.app.navigate({ view: 'PagoVisaNetExitoso', id: JSON.stringify(datosPago) }, { root: true });
                            });
                        });
                    break;
                case 1: //TARJETA
                default:
                    if (datosPago.TarjCredConsultado.Marca !== "TCJ")
                        PagarTarjetaBotonVisaNet(
                            datosPago.monedaTransaccion,
                            //"GTQ",
                            datosPago.TrjPago,
                            $('#txtCodigoSeguridad').dxNumberBox('option', 'value'),
                            AASelected.IdAnio + MMSelected.Numero,
                            datosPago.montoAplicar,
                            datosPago.TarjCredConsultado.NumeroTarjeta, //TRJ A PAGAR
                            SesionMovil.PosicionConsolidada.TarjetasCliente[0].Cotizacion,
                            $('#txtCorreoComprobante').dxTextBox('option', 'value'),
                            function (data) {
                                datosPago.Response = data;
                                MobileBanking_App.app.navigate({ view: 'PagoVisaNetExitoso', id: JSON.stringify(datosPago) }, { root: true });
                            });
                    else
                        PagarTarjetaPropiaBotonVisaNet(
                            datosPago.monedaTransaccion,
                            //"GTQ",
                            datosPago.TrjPago,
                            $('#txtCodigoSeguridad').dxNumberBox('option', 'value'),
                            AASelected.IdAnio + MMSelected.Numero,
                            datosPago.montoAplicar,
                            datosPago.TarjCredConsultado.NumeroTarjeta, //TRJ A PAGAR
                            SesionMovil.PosicionConsolidada.TarjetasCliente[0].Cotizacion,
                            $('#txtCorreoComprobante').dxTextBox('option', 'value'),
                            datosPago.TarjCredConsultado.IdCuentaTarjeta,
                            function (data) {
                                datosPago.Response = data;
                                MobileBanking_App.app.navigate({ view: 'PagoVisaNetExitoso', id: JSON.stringify(datosPago) }, { root: true });
                            });
                    break;
            }
        }
    }
    var cancelar = function (args) {
        MobileBanking_App.app.navigate('PosicionConsolidada', { root: true });
    }


    var KeyPadEventHandlerForPinNUM = function (e) {
        var imagen = document.getElementById('TipoTarjeta');
        if (e.target.value.substring(0, 1) == '4' || e.target.value.substring(0, 1) == '5') {
            if (e.target.value.substring(0, 1) == '4')
                imagen.src = 'images/visa-logo-14.png';
            if (e.target.value.substring(0, 1) == '5')
                imagen.src = 'images/MasterCard-logo.png';
            $('#imgContainer').show();
        }
        else {
            imagen.src = '';
            $('#imgContainer').hide();
        }
    }



    return viewModel;
};