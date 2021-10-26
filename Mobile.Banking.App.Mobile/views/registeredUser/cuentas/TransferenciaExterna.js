MobileBanking_App.TransferenciaExterna = function (params) {

    var resultEntidades = EntidadesFinancierasACH;
    var selectCtaOrigen;
    var selectedBeneficiario;
    var DtoCanalOrdenante = {
        Nombres: "",
        Identificacion: "",
        Ciudad: "",
        Direccion: "",
        Telefono: "",
        Celular: "",
        FormaPago: "",
        NumeroCuenta: "",
        Correo: "",
        OrigenFondos: "",
    }
    var DtoCanalBeneficiario = {
        CodigoInstitucionFinanciera: "",
        NombreInstitucionBeneficiaria: "",
        TipoCuenta: "",
        DFI: "",
        NumeroCuenta: "",
        Nombres: "",
        Direccion: "",
        TipoIdentificacion: "",
        Identificacion: "",
        Telefono: "",
        Correo: "",
        MotivoTransferencia: { CodigoMotivo: "01", DescripcionMotivo: "" },
        TipoCtaDesc: "",
    }
    var DFI;

    const Tipocuenta = {
        AHORRO: tipoCuentaACH[0].TipoCta,
        CREDITO: tipoCuentaACH[1].TipoCta,
        CORRIENTE: tipoCuentaACH[2].TipoCta,
        TARJETA: tipoCuentaACH[3].TipoCta
    }



    var lsTipoTransfer = [
        {
            "Codigo": "0",
            "Valor": "ACH"
        },
        {
            "Codigo": "1",
            "Valor": "ACH INMEDIATO"
        }]



    var achInmediato = false;

    //traer todas las cuentas solo que sean en QTG

    var arrayCtaOrigen = [];
    var cuentas = SesionMovil.PosicionConsolidada.CuentasCliente;

    var ctasQueriable = jslinq(cuentas);



    //var filtradas = ctasQueriable.where(function (el) {
    //    return el.Moneda == 'GTQ';
    //}).toList();


    arrayCtaOrigen = $.map(ctasQueriable.toList(), function (item, index) {
        return { Codigo: item.Codigo, Descripcion: item.Codigo.inputChar('-', item.Codigo.length - 1) + ' (' + item.Moneda + item.SaldoDisponible + ') ', SaldoDisponible: item.SaldoDisponible, SaldoDisponible: item.SaldoDisponible, SymbolMoneda: ((item.Moneda === 'GTQ') ? 'Q' : '$') }
    });

    var lisCtaOrigen = new DevExpress.data.DataSource({
        store: {
            type: "array",
            key: "Codigo",
            data: arrayCtaOrigen
        }

    });

    var arrayCtaBeneficiarios = [];

    var listBenficiarios = new DevExpress.data.DataSource({
        store: {
            type: "array",
            key: "NumeroCuenta",
            data: arrayCtaBeneficiarios
        }
    });
    var groupValidation = 'TRANSFERENCIASEXTERNAS';
    var beneficiarySelected = null;
    var accountSelected = arrayCtaOrigen[0];

    var monedasPermitidas = (accountSelected.SymbolMoneda === 'Q') ? 'GTQ' : 'USD';


    var TransferenciaExterna = {


        ValorTransferir: ko.observable(),
        NumeroCuenta: ko.observable(),
        Beneficiario: ko.observable(),
        TipoIdentificacion: ko.observable(),
        EntidadFinancieraTercero: ko.observable(),
        NumeroCuentaTercero: ko.observable(),
        TipoCuentaTercero: ko.observable(),
        Motivo: ko.observable('Transferencia entre clientes'),
        Observacion: ko.observable(),
        EmailTercero: ko.observable()

    }


    var viewModel = {

        viewShown: function () {
            try {

                setupFloatButton(classButtons.Cancel, cancelar, undefined, sizeFloatButtons.small, typeFloatButtons.white);
                setupFloatButton(classButtons.Accept, siguiente, undefined, undefined, undefined, undefined, groupValidation);
                var currentHour = new Date().getHours();

                if (currentHour < parseInt(Parameters.HoraAtencionTransferenciaDesde) || currentHour > parseInt(Parameters.HoraAtencionTransferenciaHasta)) {
                    showSimpleMessage('', 'Upps! Lo sentimos, no se encuentran habilitadas las transferencias en este horario. Las transferencias están habilitadas desde las 0' + Parameters.HoraAtencionTransferenciaDesde + 'H00 hasta las ' + Parameters.HoraAtencionTransferenciaHasta + 'H00', function () {
                        MobileBanking_App.app.navigate('PosicionConsolidada', { root: true });
                    })
                }


                changePropertyControl('#popupInfo', typeControl.Popup, 'visible', true);

                SesionMovil.FechaActividadApp = new Date();

                //logica para cargar el combobox de cuentas de cliente 

                searchBeneficiary(monedasPermitidas);

                clearControls();
            } catch (e) {

                showException(e.message, e.stack);
            }

        },
        viewShowing: function () {
            hideFloatButtons();
        },
        groupValidation: groupValidation,
        txtValorTransferir: setupNumberBox(TransferenciaExterna.ValorTransferir, 0.01, 10000, '40%'),
        btnCambiarCuenta: setupButtonControl(lisCtaOrigen._store._array[0].Descripcion, changeAccount, undefined, undefined, iconosCore.chevron_down, undefined, true),
        btnCambiarBeneficiarios: setupButtonControl('Seleccione', changeBeneficiary, undefined, undefined, iconosCore.chevron_down, undefined, true),
        popupSeleccionCuenta: setupPopup(false, '90%', 'auto', true, 'Cuenta Origen', true),
        popupSeleccionBeneficiario: setupPopup(false, '90%', '80%', true, CORE_TAG('ExternalBeneficiary'), true),
        btnCancelarCuenta: setupButtonControlDefault(classButtons.Cancel, cancelAccount),
        btnCancelarBeneficiarios: setupButtonControlDefault(classButtons.Cancel, cancelBeneficiaries),

        popupInfo: setupPopup(false, '90%', '80%', true, CORE_TAG('ExternalBeneficiary'), true),

        btnAceptarInfo: setupButtonControlDefault(classButtons.Accept, acceptInfo),
        btnBringInfo: setupButtonControlDefault(classButtons.Info, bringInfo, undefined, true),

        charactersCount: ko.observable('0/128'),


        rdbCuentas: setupRadioGroup(lisCtaOrigen._store._array[0].Codigo, lisCtaOrigen, 'Descripcion', 'Codigo', function (itemData, itemIndex, itemElement) {
            var content = "<div>";
            content = content + "<span>" + itemData.Codigo.inputChar('-', itemData.Codigo.length - 1) + " (" + itemData.SymbolMoneda + " " + Number(itemData.SaldoDisponible).formatMoney(2, '.', ',') + ")</span>";
            content = content + "</div>";
            return content;
        }),

        rdbBeneficiarios: setupRadioGroup(undefined, [], 'Descripcion', 'NumeroCuenta', function (itemData, itemIndex, itemElement) {
            var content = '<div style="text-align: left;">';
            if (itemData.IdCliente > 0)
                content = content + "<span>" + itemData.Descripcion + "</span>";
            else
                content = content + "<i>" + itemData.Descripcion + "</i>";
            content = content + "</div>";
            return content;
        }),

        txtEntidadFinancieraTercero: setupTextBoxControl(TransferenciaExterna.EntidadFinancieraTercero, 16, undefined, typeLetter.upper, stateControl.readOnly, true, typeCharAllowed.OnlyText),
        txtNumeroCuentaTercero: setupTextBoxControl(TransferenciaExterna.NumeroCuentaTercero, 32, undefined, typeLetter.upper, stateControl.readOnly, true, typeCharAllowed.OnlyText),
        txtTipoCuentaTercero: setupTextBoxControl(TransferenciaExterna.TipoCuentaTercero, 16, undefined, typeLetter.upper, stateControl.readOnly, true, typeCharAllowed.OnlyText),
        txtObservacion: setupTextAreaControl(TransferenciaExterna.Observacion, 128, '100%', 70, 'Ingrese alguna observación adicional'),
        txtEmailTercero: setupEmailControl(TransferenciaExterna.EmailTercero, 128),

        slAplicarTransfer: setupComboBoxControl(lsTipoTransfer, "Valor", "Codigo", '0', false, undefined, undefined, undefined),

    };


    KeyPadEventHandlerForObservacion = function (e) {
        var character = $("#txtObservacion").dxTextArea('option', 'text').length;
        viewModel.charactersCount(character + '/128');
    }


    function searchBeneficiary(moneda, esAch) {


        ConsultarCuentasClienteACH(function (data) {
            var cuentasPermitidasExternas = data;

            //filtrar el tipo de moneda de las cuentas 
            var ctasPermitidasQueriable = jslinq(cuentasPermitidasExternas);

            monedasPermitidas = (accountSelected.SymbolMoneda === 'Q') ? 'GTQ' : 'USD'
            //cuentas permitidas solo GTQ ???
            var cuentasPermitidasExternasFiltradas = ctasPermitidasQueriable.where(function (el) {

                return el.CodigoMoneda == moneda;
            }).toList();


            if (esAch == true) {

                var cuentasPermitidasAchInmediato = jslinq(cuentasPermitidasExternasFiltradas).where(function (el) {

                    return el.EsACHInmediato == esAch;
                }).toList();

            } else {

                var cuentasPermitidasAchInmediato = jslinq(cuentasPermitidasExternasFiltradas).where(function (el) {
                    return el.EsACH == true;
                }).toList();
            }

            arrayCtaBeneficiarios = $.map(cuentasPermitidasAchInmediato, function (item, index) {

                return {
                    IdCliente: item.IdCliente,
                    NumeroCuenta: item.NumeroCuenta,
                    Beneficiario: item.Beneficiario,
                    NumeroIdentificacion: item.NumeroIdentificacion,
                    TipoIdentificacion: item.TipoIdentificacion,
                    IdEntidadFinanciera: item.IdEntidadFinanciera,
                    TipoCuenta: item.TipoCuenta,
                    EsAchInmediato: esAch,


                    Descripcion: item.Beneficiario + ' Cta..' + item.NumeroCuenta.substring
                        (
                            item.NumeroCuenta.length - 4,
                            item.NumeroCuenta.length
                        ) + "(" + ((item.CodigoMoneda === 'GTQ') ? 'Q' : '$') + ")"
                }
            });
            arrayCtaBeneficiarios.push({ IdCliente: 0, NumeroCuenta: '', Beneficiario: '', Descripcion: '--Nueva Cuenta Destino--', IdEntidadFinanciera: '', TipoCuenta: '' })

            $('#rdbBeneficiarios').dxRadioGroup('option', 'dataSource', arrayCtaBeneficiarios);

            var deviceVersion = parseInt(DeviceInfo.DeviceVersion.replace(".", "").substring(0, 2));
            if (deviceType === 'Android') {
                if (deviceVersion < 44 && deviceVersion != 9 && deviceVersion != 10 && deviceVersion != 11) {
                    $('#txtObservacion').bind('keyup', KeyPadEventHandlerForObservacion);
                }
                else {
                    $('#txtObservacion').bind('input', KeyPadEventHandlerForObservacion);
                }
            }
            else {
                $('#txtObservacion').bind('keyup', KeyPadEventHandlerForObservacion);
            }

        });




    }


    function selectBeneficiary(data) {
        try {

            selectedBeneficiario = data;
            if (selectedBeneficiario) {

                var tipoMostrar;
                switch (data.TipoCuenta) {
                    case Tipocuenta.AHORRO:
                        tipoMostrar = "AHORRO";
                        DtoCanalBeneficiario.TipoCtaDesc = "AHORRO";
                        break;
                    case Tipocuenta.CORRIENTE:
                        tipoMostrar = "CORRIENTE";
                        DtoCanalBeneficiario.TipoCtaDesc = "CORRIENTE";
                        break;

                    case Tipocuenta.TARJETA:
                        tipoMostrar = "TARJETA CRÉDITO";
                        DtoCanalBeneficiario.TipoCtaDesc = "TARJETA CRÉDITO";
                        break;
                    default:
                        tipoMostrar = "CRÉDITO";
                        DtoCanalBeneficiario.TipoCtaDesc = "CRÉDITO";
                        break;
                }

                if (selectedBeneficiario.IdCliente == 0) {
                    MobileBanking_App.app.navigate('RegBeneficiarioExterno');
                    changePropertyControl('#txtEntidadFinancieraTercero', typeControl.TextBox, 'value', undefined);
                    changePropertyControl('#txtNumeroCuentaTercero', typeControl.TextBox, 'value', undefined);
                    changePropertyControl('#txtTipoCuentaTercero', typeControl.TextBox, 'value', undefined);
                    beneficiarySelected = null;
                }
                if (selectedBeneficiario.IdCliente > 0) {
                    var Entidad = $.map(resultEntidades, function (item, index) {
                        if (item.IdEntidadFinanciera == selectedBeneficiario.IdEntidadFinanciera) {
                            return item;
                        }
                    });
                    if (Entidad != null && Entidad != undefined) {
                        $('#txtEntidadFinancieraTercero').dxTextBox('option', 'value', Entidad[0].Descripcion);
                        DFI = Entidad[0].DFI;
                    }
                    $('#txtNumeroCuentaTercero').dxTextBox('option', 'value', selectedBeneficiario.NumeroCuenta.inputChar('-', selectedBeneficiario.NumeroCuenta.length - 1));

                    $('#txtTipoCuentaTercero').dxTextBox('option', 'value', tipoMostrar);
                    if (selectedBeneficiario.TipoCuenta == 'TARJETACRED') {
                        txtObservacion
                    } else {
                        $('#IdMotivo').text('Transferencia entre clientes')
                    }

                }
            }
            else {
                changePropertyControl('#txtEntidadFinancieraTercero', typeControl.TextBox, 'value', undefined);
                changePropertyControl('#txtNumeroCuentaTercero', typeControl.TextBox, 'value', undefined);
                changePropertyControl('#txtTipoCuentaTercero', typeControl.TextBox, 'value', undefined);
                changePropertyControl('#txtObservacion', typeControl.TextArea, 'value', undefined);
                changePropertyControl('#txtEmailTercero', typeControl.TextBox, 'value', undefined);
            }
        } catch (e) {

            showException(e.message, e.stack, JSON.stringify(data));
        }

    }

    function clearControls() {
        try {
            $('#rdbCuentas').dxRadioGroup('option', 'value', undefined);
            $('#rdbBeneficiarios').dxRadioGroup('option', 'value', undefined);
            changePropertyControl('#btnCambiarCuenta', typeControl.Button, 'text', 'Seleccione');
            changePropertyControl('#btnCambiarBeneficiarios', typeControl.Button, 'text', 'Seleccione');
            changePropertyControl('#txtValorTransferir', typeControl.NumberBox, 'value', undefined);
            changePropertyControl('#txtEntidadFinancieraTercero', typeControl.TextBox, 'value', undefined);
            changePropertyControl('#txtNumeroCuentaTercero', typeControl.TextBox, 'value', undefined);
            changePropertyControl('#txtTipoCuentaTercero', typeControl.TextBox, 'value', undefined);
            changePropertyControl('#txtObservacion', typeControl.TextArea, 'value', undefined);
            changePropertyControl('#txtEmailTercero', typeControl.TextBox, 'value', undefined);
            $('#txtValorTransferir').dxNumberBox('instance').focus();
            //accountSelected = undefined;
            accountSelected = arrayCtaOrigen[0]
            beneficiarySelected = undefined;

        } catch (e) {

            showException(e.message, e.stack);
        }

    }

    function clearDataTercero() {

        changePropertyControl('#btnCambiarBeneficiarios', typeControl.Button, 'text', 'Seleccione');
        changePropertyControl('#txtValorTransferir', typeControl.NumberBox, 'value', undefined);
        changePropertyControl('#txtEntidadFinancieraTercero', typeControl.TextBox, 'value', undefined);
        changePropertyControl('#txtNumeroCuentaTercero', typeControl.TextBox, 'value', undefined);
        changePropertyControl('#txtTipoCuentaTercero', typeControl.TextBox, 'value', undefined);
        changePropertyControl('#txtObservacion', typeControl.TextArea, 'value', undefined);
        changePropertyControl('#txtEmailTercero', typeControl.TextBox, 'value', undefined);
        $('#txtValorTransferir').dxNumberBox('instance').focus();

    }

    viewModel.popupSeleccionCuenta.onShown = function () {
        $('#floatButtons').hide();
    }
    viewModel.popupSeleccionBeneficiario.onShown = function () {
        $('#floatButtons').hide();
    }
    viewModel.popupSeleccionCuenta.onHidden = function () {
        $('#floatButtons').show();
    }
    viewModel.popupSeleccionBeneficiario.onHidden = function () {
        $('#floatButtons').show();
    }

    viewModel.popupInfo.onShown = function () {
        $('#floatButtons').hide();
    }
    viewModel.popupInfo.onHidden = function () {
        $('#floatButtons').show();
    }


    function siguiente(params) {
        try {

            var result = params.validationGroup.validate();
            if (result.isValid) {
                var selectedCuenta = $('#rdbCuentas').dxRadioGroup('option', 'value');
                for (var i = 0; i < lisCtaOrigen._store._array.length; i++) {
                    if (selectedCuenta == lisCtaOrigen._store._array[i].Codigo) {
                        accountSelected = lisCtaOrigen._store._array[i];
                        i = lisCtaOrigen._store._array.length;
                    }
                }
                if (!accountSelected) {
                    showWarningMessage(CORE_TAG('ExternalTransfer'), CORE_MESSAGE('SelectOriginAccount'), function () {
                        $('#popupSeleccionCuenta').dxPopup('option', 'visible', true);
                    });
                    return;
                }
                if (TransferenciaExterna.ValorTransferir() > accountSelected.SaldoDisponible) {
                    showWarningMessage(CORE_TAG('ExternalTransfer'), CORE_MESSAGE('GreaterAmountTransfer'));
                    return;
                }
                if (!beneficiarySelected) {
                    showWarningMessage(CORE_TAG('ExternalTransfer'), CORE_MESSAGE('SelectBeneficiary'), function () {
                        $('#popupSeleccionBeneficiario').dxPopup('option', 'visible', true);
                    });
                    return;
                }


                var Email = $('#txtEmailTercero').dxTextBox('option', 'value') == undefined ? '' : $('#txtEmailTercero').dxTextBox('option', 'value');
                var observacion = $('#txtObservacion').dxTextArea('option', 'value') == undefined ? '' : $('#txtObservacion').dxTextArea('option', 'value');




                if (achInmediato === !beneficiarySelected.EsAchInmediato) {
                    showWarningMessage(CORE_TAG('ExternalTransfer'), "El Beneficiario seleccionado no admite transacciones de tipo Ach Inmediato");
                    clearControls();
                    return;

                }

                //control de horario para ach inmediato
                if (achInmediato == true) {
                    var currentHour = new Date().getHours();

                    if (currentHour < parseInt(Parameters.HoraInicioAchInmediato) || currentHour > parseInt(Parameters.HoraInicioFinInmediato)) {
                        showSimpleMessage('', 'Upps! Lo sentimos, no se encuentran habilitadas las transferencias en este horario. Las transferencias están habilitadas desde las 0' + Parameters.HORAACHINMEDIATODESDE + 'H00 hasta las ' + Parameters.HORAACHINMEDIATOHASTA + 'H00 ' + 'de Lunes a Viernes', function () {
                            MobileBanking_App.app.navigate('PosicionConsolidada', { root: true });
                        })
                    }
                }


                DtoCanalOrdenante.NumeroCuenta = accountSelected.Codigo;
                DtoCanalOrdenante.Nombres = SesionMovil.ContextoCliente.NombreCompletoCliente;
                DtoCanalOrdenante.Identificacion = SesionMovil.ContextoCliente.NumeroDocumento;
                DtoCanalBeneficiario.CodigoInstitucionFinanciera = selectedBeneficiario.IdEntidadFinanciera;
                DtoCanalBeneficiario.NombreInstitucionBeneficiaria = $('#txtEntidadFinancieraTercero').dxTextBox('option', 'value');
                DtoCanalBeneficiario.TipoCuenta = selectedBeneficiario.TipoCuenta;
                DtoCanalBeneficiario.NumeroCuenta = selectedBeneficiario.NumeroCuenta;
                DtoCanalBeneficiario.Nombres = selectedBeneficiario.Beneficiario;
                DtoCanalBeneficiario.TipoIdentificacion = selectedBeneficiario.TipoIdentificacion;
                DtoCanalBeneficiario.MotivoTransferencia.DescripcionMotivo = TransferenciaExterna.Motivo();
                DtoCanalBeneficiario.Identificacion = selectedBeneficiario.NumeroIdentificacion;
                DtoCanalBeneficiario.Correo = Email;
                DtoCanalBeneficiario.DFI = DFI;

                var EsAchInmediato = achInmediato;

                var DtoCanalTransferenciaInterbancaria =
                {
                    Ordenante: DtoCanalOrdenante,
                    Beneficiario: DtoCanalBeneficiario,
                    FechaProceso: "",
                    Agencia: "",
                    TipoTransferencia: "",
                    ExcentoISD: false,
                    ValorTransferir: TransferenciaExterna.ValorTransferir(),
                    ValorTransferirTotal: TransferenciaExterna.ValorTransferir(),
                    Moneda: ((accountSelected.SymbolMoneda === 'Q') ? 'GTQ' : 'USD'),
                    ConceptoAdicional: observacion,
                    EsAchInmediato: EsAchInmediato,
                }
                MobileBanking_App.app.navigate('ConfirmacionTransferenciaExterna/' + JSON.stringify(DtoCanalTransferenciaInterbancaria), { root: true });

            }
            else {
                showWarningMessage(CORE_TAG('ExternalTransfer'), CORE_MESSAGE('MissingData'));
            }
        } catch (e) {

            showException(e.message, e.stack, JSON.stringify(params));
        }
    }

    function cancelar() {
        MobileBanking_App.app.navigate('PosicionConsolidada', { root: true });
    }


    function changeAccount() {
        changePropertyControl('#popupSeleccionCuenta', typeControl.Popup, 'visible', true);
    }



    function changeBeneficiary() {
        changePropertyControl('#popupSeleccionBeneficiario', typeControl.Popup, 'visible', true);
    }

    function cancelAccount() {
        changePropertyControl('#popupSeleccionCuenta', typeControl.Popup, 'visible', false);
    }

    function cancelBeneficiaries() {
        changePropertyControl('#popupSeleccionBeneficiario', typeControl.Popup, 'visible', false);
    }


    function acceptInfo() {
        changePropertyControl('#popupInfo', typeControl.Popup, 'visible', false);
    }

    function bringInfo() {
        changePropertyControl('#popupInfo', typeControl.Popup, 'visible', true);
    }



    viewModel.rdbBeneficiarios.onValueChanged = function (e) {
        var select = e.value;
        for (var i = 0; i < arrayCtaBeneficiarios.length; i++) {
            if (select == arrayCtaBeneficiarios[i].NumeroCuenta) {
                beneficiarySelected = arrayCtaBeneficiarios[i];
                i = arrayCtaBeneficiarios.length;
            }
        }
        if (beneficiarySelected) {
            changePropertyControl('#btnCambiarBeneficiarios', typeControl.Button, 'text', beneficiarySelected.Beneficiario);
            changePropertyControl('#popupSeleccionBeneficiario', typeControl.Popup, 'visible', false);
        }
        selectBeneficiary(beneficiarySelected);
    }

    viewModel.rdbCuentas.onValueChanged = function (e) {
        var select = e.value;
        for (var i = 0; i < lisCtaOrigen._store._array.length; i++) {
            if (select == lisCtaOrigen._store._array[i].Codigo) {
                accountSelected = lisCtaOrigen._store._array[i];
                i = lisCtaOrigen._store._array.length;
            }
        }
        if (accountSelected) {
            changePropertyControl('#btnCambiarCuenta', typeControl.Button, 'text', accountSelected.Codigo.inputChar('-', accountSelected.Codigo.length - 1) + ' (' + accountSelected.SymbolMoneda + Number(accountSelected.SaldoDisponible).formatMoney(2, '.', ',') + ")");
            changePropertyControl('#popupSeleccionCuenta', typeControl.Popup, 'visible', false);
            $('#currSymbol').text(accountSelected.SymbolMoneda)
            monedasPermitidas = (accountSelected.SymbolMoneda === 'Q') ? 'GTQ' : 'USD'
            searchBeneficiary(monedasPermitidas, achInmediato);
            //clearDataTercero();
        }
    }

    viewModel.slAplicarTransfer.onValueChanged = function (e) {

        if (e.value == "1") {
            achInmediato = true;
            monedasPermitidas = (accountSelected.SymbolMoneda === 'Q') ? 'GTQ' : 'USD'
            searchBeneficiary(monedasPermitidas, achInmediato);
        } else {
            achInmediato = false;
            monedasPermitidas = (accountSelected.SymbolMoneda === 'Q') ? 'GTQ' : 'USD'
            searchBeneficiary(monedasPermitidas, achInmediato);
        }

    }

    return viewModel;
};