MobileBanking_App.TransferenciasInternas = function (params) {
    "use strict";

    var cuentasBeneficiariasInternasCliente = null;
    var arrayCtaOrigen = [];
    arrayCtaOrigen = $.map(SesionMovil.PosicionConsolidada.CuentasCliente, function (item, index) {
        return {
            Codigo: item.Codigo,
            Descripcion: item.Codigo.inputChar('-', item.Codigo.length - 1) + ' (' + ((item.Moneda === 'GTQ') ? 'Q ' : '$') + Number(item.SaldoDisponible).formatMoney(2, '.', ',') + ')',
            SaldoDisponible: item.SaldoDisponible,
            MonedaSimbolo: ((item.Moneda === 'GTQ') ? 'Q ' : '$'),
            Moneda: item.Moneda
        }
    });
    var lisCtaOrigen = new DevExpress.data.DataSource({
        store: {
            type: "array",
            key: "Codigo",
            data: arrayCtaOrigen
        }
    });

    var lisCtaPropia = new DevExpress.data.DataSource({
        store: {
            type: "array",
            key: "Codigo",
            data: SesionMovil.PosicionConsolidada.CuentasCliente
        }
    });
    var propio = false;
    var tercero = false;
    var originAccountSelected = SesionMovil.PosicionConsolidada.CuentasCliente[0];
    var ownAccountSelected = null;
    var otherAccountSelected = null;

    var arrayCtaTerceros = [];

    var listCtaTerceros;

    var groupValidation = 'TRANSFERENCIASINTERNAS';

    var InternoModel =
    {
        Monto: ko.observable(),
        Concepto: ko.observable(),
        MailTerceros: ko.observable()
    }

    var viewModel = {
        viewShown: function () {
            try {
                clearControls();
                setupFloatButton(classButtons.Cancel, cancelar, undefined, sizeFloatButtons.small, typeFloatButtons.white);
                setupFloatButton(classButtons.Accept, siguiente, undefined, undefined, undefined, undefined, groupValidation);
                var currentHour = new Date().getHours();
                if (currentHour < parseInt(Parameters.HoraAtencionTransferenciaDesde) || currentHour > parseInt(Parameters.HoraAtencionTransferenciaHasta)) {
                    showSimpleMessage('', 'Upps! Lo sentimos, no se encuentran habilitadas las transferencias en este horario. Las transferencias están habilitadas desde las 0' + Parameters.HoraAtencionTransferenciaDesde + 'H00 hasta las ' + Parameters.HoraAtencionTransferenciaHasta + 'H00', function () {
                        MobileBanking_App.app.navigate('PosicionConsolidada', { root: true });
                    })
                }


                ConsultaCuentasPermitidas(SesionMovil.ContextoCliente.CodigoCliente, function (data) {
                    if (data && data.length > 0)
                        cuentasBeneficiariasInternasCliente = jslinq(data).orderBy(function (t) { return t.Beneficiario }).toList();
                    else
                        cuentasBeneficiariasInternasCliente = data;

                    arrayCtaTerceros = $.map(cuentasBeneficiariasInternasCliente, function (item, index) {
                        return {
                            IdCliente: item.IdCliente,
                            NumeroCuentaValido: item.NumeroCuentaValido,
                            Beneficiario: item.Beneficiario,
                            Moneda: item.Moneda,
                            Descripcion: item.Beneficiario + ' Cta..' + item.NumeroCuentaValido.substring
                                (
                                    item.NumeroCuentaValido.length - 4,
                                    item.NumeroCuentaValido.length
                                )
                        }
                    });

                    arrayCtaTerceros.push
                        (
                            {
                                IdCliente: 0,
                                Descripcion: '--Nueva Cuenta Beneficiaria Interna--',
                                NumeroCuentaValido: '',
                                Beneficiario: ''
                            }
                        )

                    listCtaTerceros = new DevExpress.data.DataSource({
                        store: {
                            type: "array",
                            key: "IdCliente",
                            data: arrayCtaTerceros
                        }
                    });
                    $('#rdbCuentasTercero').dxRadioGroup('option', 'dataSource', arrayCtaTerceros);

                    var deviceVersion = parseInt(DeviceInfo.DeviceVersion.replace(".", "").substring(0, 2));
                    if (deviceType === 'Android') {
                        if (deviceVersion < 44 && deviceVersion != 9 && deviceVersion != 10 && deviceVersion != 11 ) {
                            $('#txtConcepto').bind('keyup', KeyPadEventHandlerForConcepto);

                        }
                        else {
                            $('#txtConcepto').bind('input', KeyPadEventHandlerForConcepto);
                        }
                    }
                    else {
                        $('#txtConcepto').bind('keyup', KeyPadEventHandlerForConcepto);
                    }


                });
                //Seleccionar primera cuenta propia

                ownAccountSelected = lisCtaOrigen._store._array[0]; simboloMoneda
                $('#simboloMoneda').text(ownAccountSelected.MonedaSimbolo);






            } catch (e) {
                showException(e.message, e.stack);
            }

        },
        viewShowing: function () {
            hideFloatButtons();
        },
        groupValidation: groupValidation,
        txtMonto: setupNumberBox(InternoModel.Monto, 0.01, 5000, '40%'),
        btnCambiarCuentaOrigen: setupButtonControl(lisCtaOrigen._store._array[0].Descripcion, changeOriginAccount, undefined, undefined, iconosCore.chevron_down, undefined, true),
        btnCambiarCuentaPropia: setupButtonControl(lisCtaPropia._store._array[0].Codigo, changeOwnAccount, undefined, undefined, iconosCore.chevron_down, undefined, true),
        btnCambiarCuentaTercero: setupButtonControl('Seleccione', changeOtherAccount, undefined, undefined, iconosCore.chevron_down, stateControl.disabled, true),
        popupSeleccionCuentaOrigen: setupPopup(false, '90%', 'auto', true, 'Cuenta Origen', true),
        popupSeleccionCuentaPropia: setupPopup(false, '90%', 'auto', true, 'Cuenta Propia', true),
        popupSeleccionCuentaTercero: setupPopup(false, '100%', '80%', true, 'Cuenta de Terceros', true),
        rdbCuentasOrigen: setupRadioGroup(lisCtaOrigen._store._array[0].Codigo, lisCtaOrigen, 'Descripcion', 'Codigo', function (itemData, itemIndex, itemElement) {
            var content = "<div>";
            content = content + "<span>" + itemData.Descripcion + "</span>";
            content = content + "</div>";
            return content;
        }),
        rdbCuentasPropia: setupRadioGroup(lisCtaPropia._store._array[0].Codigo, lisCtaPropia, 'Codigo', 'Codigo', function (itemData, itemIndex, itemElement) {
            var content = "<div>";
            content = content + "<span>" + itemData.Codigo.inputChar('-', itemData.Codigo.length - 1) + ((itemData.Moneda === 'GTQ') ? '(Q)' : '($)') + "</span>";
            content = content + "</div>";
            return content;
        }),
        rdbCuentasTercero: setupRadioGroup(undefined, [], 'Descripcion', 'NumeroCuentaValido', function (itemData, itemIndex, itemElement) {
            var content = '<div  style="text-align: left;">';
            if (itemData.IdCliente > 0)
                content = content + "<span>" + itemData.Descripcion.inputChar('-', itemData.Descripcion.length - 1) + ((itemData.Moneda === 'GTQ') ? '(Q)' : '($)') + "</span>";
            else
                content = content + "<i>" + itemData.Descripcion + "</i>";
            content = content + "</div>";
            return content;
        }),

        //txtConcepto: setupTextBoxControl(InternoModel.Concepto, 64, 'Concepto', typeLetter.upper),
        chkCuentaPropia: setupCheckBoxControl(true, 'Propia'),
        chkCuentaTerceros: setupCheckBoxControl(false, 'Terceros'),
        txtMailTerceros: setupEmailControl(InternoModel.MailTerceros, 128),
        btnCancelarOrigen: setupButtonControlDefault(classButtons.Cancel, cancelOriginAccount),
        btnCancelarPropia: setupButtonControlDefault(classButtons.Cancel, cancelOwnAccount),
        btnCancelarTercero: setupButtonControlDefault(classButtons.Cancel, cancelOtherAccount),
        txtConcepto: setupTextAreaControl(InternoModel.Concepto, 128, '100%', 70, 'Ingrese el concepto de la transacción'),
        charactersCount: ko.observable('0/128'),
    };



    var KeyPadEventHandlerForConcepto = function (e) {
        var character = $("#txtConcepto").dxTextArea('option', 'text').length;
        viewModel.charactersCount(character + '/128');
    }



    viewModel.popupSeleccionCuentaOrigen.onShown = function () {
        $('#floatButtons').hide();
    }
    viewModel.popupSeleccionCuentaPropia.onShown = function () {
        $('#floatButtons').hide();
    }
    viewModel.popupSeleccionCuentaTercero.onShown = function () {
        $('#floatButtons').hide();
    }
    viewModel.popupSeleccionCuentaOrigen.onHidden = function () {
        $('#floatButtons').show();
    }
    viewModel.popupSeleccionCuentaPropia.onHidden = function () {
        $('#floatButtons').show();
    }
    viewModel.popupSeleccionCuentaTercero.onHidden = function () {
        $('#floatButtons').show();
    }

    function changeOriginAccount() {
        changePropertyControl('#popupSeleccionCuentaOrigen', typeControl.Popup, 'visible', true);
    }

    function changeOwnAccount() {
        changePropertyControl('#popupSeleccionCuentaPropia', typeControl.Popup, 'visible', true);
    }

    function changeOtherAccount() {
        changePropertyControl('#popupSeleccionCuentaTercero', typeControl.Popup, 'visible', true);
    }

    function cancelOriginAccount() {
        changePropertyControl('#popupSeleccionCuentaOrigen', typeControl.Popup, 'visible', false);
    }

    function cancelOwnAccount() {
        changePropertyControl('#popupSeleccionCuentaPropia', typeControl.Popup, 'visible', false);
    }

    function cancelOtherAccount() {
        changePropertyControl('#popupSeleccionCuentaTercero', typeControl.Popup, 'visible', false);
    }

    viewModel.rdbCuentasOrigen.onValueChanged = function (e) {
        try {
            if (e.value != undefined) {
                changePropertyControl('#popupSeleccionCuentaOrigen', typeControl.Popup, 'visible', false);
                var select = e.value;
                var cuentaOrigen = lisCtaOrigen._store._array;
                for (var i = 0; i < cuentaOrigen.length; i++) {
                    if (cuentaOrigen[i].Codigo == select) {
                        originAccountSelected = cuentaOrigen[i];
                        i = cuentaOrigen.length;
                    }
                }
                if (originAccountSelected) {
                    $('#simboloMoneda').text(originAccountSelected.MonedaSimbolo);
                    changePropertyControl('#btnCambiarCuentaOrigen', typeControl.Button, 'text', originAccountSelected.Descripcion);
                }
            }
        } catch (e) {
            showException(e.message, e.stack);
        }
    }

    viewModel.rdbCuentasPropia.onValueChanged = function (e) {
        try {
            if (e.value != undefined) {
                var select = e.value;
                var cuentaPropia = lisCtaPropia._store._array;
                for (var i = 0; i < cuentaPropia.length; i++) {
                    if (cuentaPropia[i].Codigo == select) {
                        ownAccountSelected = cuentaPropia[i];
                        i = cuentaPropia.length;
                    }
                }
                if (ownAccountSelected) {
                    changePropertyControl('#btnCambiarCuentaPropia', typeControl.Button, 'text', ownAccountSelected.Codigo.inputChar('-', ownAccountSelected.Codigo.length - 1));
                }
                changePropertyControl('#popupSeleccionCuentaPropia', typeControl.Popup, 'visible', false);
            }
        } catch (e) {
            showException(e.message, e.stack);
        }
    }

    viewModel.rdbCuentasTercero.onValueChanged = function (e) {
        try {
            if (e.value != undefined) {
                var select = e.value;
                var cuentaTercero = arrayCtaTerceros;
                for (var i = 0; i < cuentaTercero.length; i++) {
                    if (cuentaTercero[i].NumeroCuentaValido == select) {
                        otherAccountSelected = cuentaTercero[i];
                        i = cuentaTercero.length;
                    }
                }
                if (otherAccountSelected) {
                    changePropertyControl('#btnCambiarCuentaTercero', typeControl.Button, 'text', otherAccountSelected.NumeroCuentaValido.inputChar('-', otherAccountSelected.NumeroCuentaValido.length - 1));
                }
                if (otherAccountSelected.IdCliente == 0) {
                    MobileBanking_App.app.navigate('RegBeneficiariosInternos');
                    changePropertyControl('#btnCambiarCuentaTercero', typeControl.Button, 'text', 'Nueva Cuenta');
                }
                changePropertyControl('#popupSeleccionCuentaTercero', typeControl.Popup, 'visible', false);
            }
        } catch (e) {
            showException(e.message, e.stack);
        }
    }

    viewModel.chkCuentaPropia.onValueChanged = function (e) {
        if (e.value == true) {
            $('#chkCuentaTerceros').dxCheckBox('option', 'value', false);
            changePropertyControl('#btnCambiarCuentaPropia', typeControl.Button, 'disabled', false);
        } else {
            changePropertyControl('#btnCambiarCuentaPropia', typeControl.Button, 'text', 'Seleccione');
            changePropertyControl('#btnCambiarCuentaPropia', typeControl.Button, 'disabled', true);
            $('#rdbCuentasPropia').dxRadioGroup('option', 'value', undefined);
        }
    }

    viewModel.chkCuentaTerceros.onValueChanged = function (e) {
        if (e.value == true) {
            $('#chkCuentaPropia').dxCheckBox('option', 'value', false);
            changePropertyControl('#btnCambiarCuentaTercero', typeControl.Button, 'disabled', false);

        } else {
            changePropertyControl('#btnCambiarCuentaTercero', typeControl.Button, 'disabled', true);
            changePropertyControl('#btnCambiarCuentaTercero', typeControl.Button, 'text', 'Seleccione');
            $('#rdbCuentasTercero').dxRadioGroup('option', 'value', undefined);
        }
    }
    function siguiente(params) {
        try {
            var result = params.validationGroup.validate();
            if (result.isValid) {
                var esCuentaPropia = $('#chkCuentaPropia').dxCheckBox('option', 'value');
                var esCuentaTercero = $('#chkCuentaTerceros').dxCheckBox('option', 'value');
                var cuentaPropia = ownAccountSelected ? ownAccountSelected.Codigo : null;
                var cuentaTercero = otherAccountSelected ? otherAccountSelected.NumeroCuentaValido : null;

                if (
                    (esCuentaPropia == true && originAccountSelected.Moneda != ownAccountSelected.Moneda) ||
                    (esCuentaPropia == false && originAccountSelected.Moneda != otherAccountSelected.Moneda)
                ) {
                    showWarningMessage(CORE_TAG('InternalTransfers'), 'No se puede realizar esta transferencia debido a que son de diferente moneda.');
                    return;
                }

                if ((esCuentaPropia == true && !ownAccountSelected) || (esCuentaTercero && !otherAccountSelected) || (esCuentaPropia == false && esCuentaTercero == false)) {
                    showWarningMessage(CORE_TAG('InternalTransfers'), CORE_MESSAGE('TRANSELECT'));
                    return;
                }
                if (InternoModel.Monto() <= 0 || InternoModel.Monto() > (originAccountSelected.SaldoDisponible)) {
                    showWarningMessage(CORE_TAG('InternalTransfers'), CORE_MESSAGE('VALMONTOTRF'));
                    return;
                }
                var cuentaDestino = esCuentaPropia == true ? ownAccountSelected.Codigo : otherAccountSelected.NumeroCuentaValido;
                var titularCuentaDestino = esCuentaPropia == true ? SesionMovil.ContextoCliente.NombreCompletoCliente : otherAccountSelected.Beneficiario;

                if (cuentaDestino == originAccountSelected.Codigo) {
                    showWarningMessage(CORE_TAG('InternalTransfers'), CORE_MESSAGE('VALCTATRF'));
                    return;
                }
                var confirmar = {
                    Monto: InternoModel.Monto(),
                    Concepto: InternoModel.Concepto(),
                    CuentaOrigen: originAccountSelected.Codigo,
                    CtaPropia: cuentaPropia,
                    CuentaDestino: cuentaDestino,
                    TitularCuentaDestino: titularCuentaDestino,
                    TitularCuentaOrigen: SesionMovil.ContextoCliente.NombreCompletoCliente,
                    emailOrigen: SesionMovil.ControlAccesoGlobal.CorreoElectronicoRegistrado,
                    emailDestino: InternoModel.MailTerceros(),

                    Moneda: '(' + ((originAccountSelected.Moneda === 'GTQ') ? 'Q' : '$') + ')'
                }

                MobileBanking_App.app.navigate('ConfirmacionTansferenciaInterna/' + JSON.stringify(confirmar), { root: true });
            }
            else {
                showWarningMessage(CORE_TAG('InternalTransfers'), CORE_MESSAGE('MissingData'));
            }
        } catch (e) {
            showException(e.message, e.stack, JSON.stringify(params));
        }
    }

    function cancelar() {
        MobileBanking_App.app.navigate('PosicionConsolidada', { root: true });
    }

    function clearControls() {
        changePropertyControl('#txtMonto', typeControl.NumberBox, 'value', undefined);
        changePropertyControl('#btnCambiarCuentaOrigen', typeControl.Button, 'text', lisCtaOrigen._store._array[0].Descripcion);
        changePropertyControl('#btnCambiarCuentaPropia', typeControl.Button, 'text', 'Seleccione');
        changePropertyControl('#btnCambiarCuentaTercero', typeControl.Button, 'text', 'Seleccione');
        changePropertyControl('#chkCuentaTerceros', typeControl.Check, 'value', false);
        changePropertyControl('#chkCuentaPropia', typeControl.Check, 'value', true);
        changePropertyControl('#txtConcepto', typeControl.TextArea, 'value', undefined);
        changePropertyControl('#txtMailTerceros', typeControl.TextBox, 'value', undefined);
        changePropertyControl('#rdbCuentasOrigen', typeControl.dxRadioGroup, 'value', lisCtaOrigen._store._array[0].Codigo);
        changePropertyControl('#rdbCuentasPropia', typeControl.dxRadioGroup, 'value', undefined);
        changePropertyControl('#rdbCuentasTercero', typeControl.dxRadioGroup, 'value', undefined);
        originAccountSelected = SesionMovil.PosicionConsolidada.CuentasCliente[0];
        ownAccountSelected = undefined;
        otherAccountSelected = undefined;
        $('#txtMonto').dxNumberBox('instance').focus();
    }

    return viewModel;
};


