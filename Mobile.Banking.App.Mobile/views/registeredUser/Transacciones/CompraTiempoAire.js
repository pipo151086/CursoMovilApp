MobileBanking_App.CompraTiempoAire = function (params) {
    "use strict";


    var Tarjetas = [];
    var TarjetaSelected = null;
    var MMSelected = null;
    var AASelected = null;
    var DtoCanalTarjeta = {
        EsPrincipal: false,
        IdCuentaTarjeta: 0,
        IdTarjetaHabiente: 0,
        DescripcionEstadoTarjeta: "",
        DescripcionBin: "",
        DescripcionAfinidad: "",
        Marca: "",
        TipoProcesamiento: "",
        NumeroTarjeta: "",
        DiaPago: 0,
        CupoAprobado: 0,
        CupoUtilizado: 0,
        CupoDisponible: 0,
        CupoAprobadoEspecial: 0,
        CupoUtilizadoEspecial: 0,
        CupoDisponibleEspecial: 0,
        CupoUtilizadoAvance: 0,
        FechaUltimoCorte: "2016-06-06",
        FechaUltimoVcto: "2016-06-06",
        FechaUltimoPago: "2016-06-06",
        SaldoPagoTotal: 0,
        SaldoPagoMinimo: 0,
        CupoAprobadoTotal: 0,
        CupoUtilizadoTotal: 0,
        CupoDisponibleTotal: 0,
        CupoAprobadoSuperAvance: 0,
        CupoUtilizadoSuperAvance: 0,
        CupoDisponibleSuperAvance: 0,
        idPosConsolidada: 0
    }

    var montoClaro = [
        { texto: '$ 3.00', valor: 3 },
        { texto: '$ 6.00', valor: 6 },
        { texto: '$ 10.00', valor: 10 },
        { texto: '$ 20.00', valor: 20 },
        { texto: '$ 30.00', valor: 30 },
    ]


    Tarjetas = $.map(SesionMovil.PosicionConsolidada.CuentasCliente, function (item, index) {
        if (item.TieneTarjetaDebito == true)
            return { Display: maskTarjeta(item.NumTarjetaDebitoTitular, 3, 5), NumeroTarjeta: item.NumTarjetaDebitoTitular, Saldo: item.SaldoDisponible, dto: item.NumTarjetaDebitoTitular, Type: 'TD' };
    });
    $.map(SesionMovil.PosicionConsolidada.TarjetasCliente, function (item, index) {
        Tarjetas.push({ Display: maskTarjeta(item.NumeroTarjeta, 3, 5), NumeroTarjeta: item.NumeroTarjeta, Saldo: item.CupoDisponible, dto: item, Type: 'TC' });
    });

    var Anios = [];

    function getAniosForward(number) {
        Anios = [];
        var anioActual = Date.today().getFullYear();
        for (var i = 0; i < number; i++) {
            var anios = {
                IdAnio: anioActual.toString().substring(2),
                Anio: anioActual
            }
            anioActual++;

            Anios.push(anios);
        }

        return Anios;
    }

    var groupValidation = 'COMPRATIEMPOAIRE'

    var viewModel = {
        groupValidation: groupValidation,
        viewShown: function () {
            SesionMovil.FechaActividadApp = new Date();
            setupFloatButton(classButtons.Cancel, cancelar, undefined, sizeFloatButtons.small, typeFloatButtons.white);
            setupFloatButton(classButtons.Accept, siguiente);
            limpiarControles();
            $('#rdbAA').dxRadioGroup('option', 'dataSource', getAniosForward(5));
        },
        viewShowing: function () {
            hideFloatButtons();
        },
        rbOperadora: setupRadioGroup(operadorasMobile[0].IdOperadora, operadorasMobile, 'Operadora', 'IdOperadora'),
        txtNumberPhone: setupTextPhoneControl(undefined, typePhones.Mobile, undefined),
        txtMonto: setupNumberBox(undefined, 3, 100, '80%'),
        txtCodigoSeg: setupNumberBox(undefined, 100, 999, '100%'),
        //---------------------------------------------------------
        btnCambiarTarjeta: setupButtonControl('Seleccione', changeTarjeta, undefined, undefined, iconosCore.chevron_down, undefined, true),
        popupSeleccionTarjeta: setupPopup(false, '80%', 'auto', true, 'Tarjetas', true),
        rdbTarjeta: setupRadioGroup(undefined, Tarjetas, 'Display', 'NumeroTarjeta', function (itemData, itemIndex, itemElement) {
            var content = "<div style='text-align:justify'>";
            content = content + "<span style='display:block; font-size:16px;position:relative;top:10px'>" + itemData.Display + "</span>";
            var tipoTarjeta = 'Tarjeta de Crédito';
            if (itemData.Type == "TD")
                tipoTarjeta = 'Tarjeta de Débito';
            content = content + "<span style='position: relative;top: 4px;text-transform: none;display:block; font-size:12px; color: " + mainColor + "'>" + tipoTarjeta + "</span>";
            return content;
        }),
        btnCancelarTarjeta: setupButtonControlDefault(classButtons.Cancel, cancelTarjeta),
        //---------------------------------------------------------
        btnCambiarMM: setupButtonControl('Mes', changeMM, undefined, undefined, iconosCore.chevron_down, undefined, true),
        popupSeleccionMM: setupPopup(false, '70%', 'auto', true, 'Mes Caducidad', true),
        rdbMM: setupRadioGroup(undefined, mesesAnio, 'Texto', 'Número'),
        btnCancelarMM: setupButtonControlDefault(classButtons.Cancel, cancelMM),
        //---------------------------------------------------------
        btnCambiarAA: setupButtonControl('Año', changeAA, undefined, undefined, iconosCore.chevron_down, undefined, true),
        popupSeleccionAA: setupPopup(false, '70%', 'auto', true, 'Año Caducidad', true),
        rdbAA: setupRadioGroup(undefined, Anios, 'Anio', 'IdAnio'),
        btnCancelarAA: setupButtonControlDefault(classButtons.Cancel, cancelAA),
        //---------------------------------------------------------
        cmbFechaAA: setupComboBoxControl(Anios, 'Anio', 'IdAnio', undefined, '100%'),
        cmbMonto: setupComboBoxControl(montoClaro, 'texto', 'valor', undefined, false, undefined, '100%', 'Valor Recarga')
    };
    //----------------------------------------------------------------------
    //----------------------------------------------------------------------

    viewModel.popupSeleccionAA.onShown = function () {
        $('#floatButtons').hide();
    }
    viewModel.popupSeleccionMM.onShown = function () {
        $('#floatButtons').hide();
    }
    viewModel.popupSeleccionTarjeta.onShown = function () {
        $('#floatButtons').hide();
    }

    viewModel.popupSeleccionAA.onHidden = function () {
        $('#floatButtons').show();
    }
    viewModel.popupSeleccionMM.onHidden = function () {
        $('#floatButtons').show();
    }
    viewModel.popupSeleccionTarjeta.onHidden = function () {
        $('#floatButtons').show();
    }

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

    viewModel.rbOperadora.onValueChanged = function (e) {
        if (e.value) {
            switch (e.value) {
                case 'CLA':
                    changePropertyControl('#cmbMonto', typeControl.SelectBox, 'visible', true);
                    changePropertyControl('#cmbMonto', typeControl.SelectBox, 'value', 3);
                    changePropertyControl('#txtMonto', typeControl.NumberBox, 'visible', false);
                    $('#bsigno').hide();
                    break;
                case 'MOV':
                    changePropertyControl('#cmbMonto', typeControl.SelectBox, 'visible', false);
                    changePropertyControl('#txtMonto', typeControl.NumberBox, 'visible', true);
                    changePropertyControl('#txtMonto', typeControl.NumberBox, 'value', 3);
                    $('#bsigno').show();
                    break;
                default:

            }
        }
    }

    function changeAA() {
        changePropertyControl('#popupSeleccionAA', typeControl.Popup, 'visible', true);
    }
    function cancelAA() {
        changePropertyControl('#popupSeleccionAA', typeControl.Popup, 'visible', false);
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
    //----------------------------------------------------------------------
    //----------------------------------------------------------------------
    viewModel.rdbTarjeta.onValueChanged = function (e) {

        var select = e.value;
        for (var i = 0; i < Tarjetas.length; i++) {
            if (select == Tarjetas[i].NumeroTarjeta) {
                TarjetaSelected = Tarjetas[i];
                i = Tarjetas.length;
            }
        }
        if (TarjetaSelected) {
            changePropertyControl('#btnCambiarTarjeta', typeControl.Button, 'text', maskTarjeta(TarjetaSelected.NumeroTarjeta, 3, 5));
            changePropertyControl('#popupSeleccionTarjeta', typeControl.Popup, 'visible', false);
        }
    }
    function changeTarjeta() {
        changePropertyControl('#popupSeleccionTarjeta', typeControl.Popup, 'visible', true);
    }
    function cancelTarjeta() {
        changePropertyControl('#popupSeleccionTarjeta', typeControl.Popup, 'visible', false);
    }

    function siguiente(params) {
        try {
            var result = params.validationGroup.validate();
            if (result.isValid) {
                if (TarjetaSelected == null || MMSelected == null || AASelected == null) {
                    showWarningMessage(CORE_MESSAGE('COMPTIEMPAIRE'), CORE_MESSAGE('MissingData'));
                    return;
                }
                var operadora = $('#rbOperadora').dxRadioGroup('option', 'value');
                var monto = 0;
                if (operadora == 'CLA')
                    monto = $('#cmbMonto').dxSelectBox('option', 'value');
                else
                    monto = $('#txtMonto').dxNumberBox('option', 'value');

                var saldo = TarjetaSelected.Saldo;
                //validar monto
                if (monto > saldo) {
                    showWarningMessage(CORE_MESSAGE('COMPTIEMPAIRE'), CORE_MESSAGE('CTAIMONT'));
                    return;
                }
                EnviarOTP(SesionMovil.ContextoCliente, function (data) {
                    var resultadoEnviarOTP = data;
                    if (resultadoEnviarOTP) {

                        var operacionAIngresoOTP = OperacionEjecutar.CompraTiempoAire;

                        if (TarjetaSelected.Type == 'TD')
                            DtoCanalTarjeta.NumeroTarjeta = TarjetaSelected.NumeroTarjeta;
                        else
                            DtoCanalTarjeta = TarjetaSelected.dto;
                        var DtoCompraTiempoAire = {
                            dtoCanalTarjeta: DtoCanalTarjeta,
                            cadena: $('#rbOperadora').dxRadioGroup('option', 'value'),
                            numeroCelular: $('#txtNumberPhone').dxTextBox('option', 'value'),
                            valor: monto,
                            cvv: $('#txtCodigoSeg').dxNumberBox('option', 'value'),
                            mesExp: MMSelected.Numero,
                            anioExp: AASelected.IdAnio
                        }

                        operacionAIngresoOTP.dtoCompraTiempoAire = DtoCompraTiempoAire;

                        var uri = MobileBanking_App.app.router.format({
                            view: 'IngresoOTP',
                            id: JSON.stringify(operacionAIngresoOTP)
                        });

                        MobileBanking_App.app.navigate(uri, { root: true });
                    }
                })
            }
            else
                showWarningMessage(CORE_MESSAGE('COMPTIEMPAIRE'), CORE_MESSAGE('MissingData'));
        } catch (e) {
            showException(e.message, e.stack, JSON.stringify(params));
        }
    }

    function cancelar() {
        MobileBanking_App.app.navigate('PosicionConsolidada', { root: true });
    }

    function limpiarControles() {
        changePropertyControl('#txtNumberPhone', typeControl.TextBox, 'value', undefined);
        $('#txtNumberPhone').dxTextBox('instance').focus();
        $('#cmbTarjetas').dxSelectBox('option', 'value', undefined);
        $('#txtMonto').dxNumberBox('option', 'value', undefined);
        $('#txtCodigoSeg').dxNumberBox('option', 'value', undefined);
        $('#cmbFechaMM').dxSelectBox('option', 'value', undefined);
        $('#cmbFechaAA').dxSelectBox('option', 'value', undefined);

        DevExpress.validationEngine.resetGroup(groupValidation);
        $('#rbOperadora').dxRadioGroup('option', 'value', operadorasMobile[0].IdOperadora);
        $('#rdbAA').dxRadioGroup('option', 'value', undefined);
        $('#rdbMM').dxRadioGroup('option', 'value', undefined);
        $('#rdbCuentas').dxRadioGroup('option', 'value', undefined);
        $('#rbOperadora').dxRadioGroup('option', 'rtlEnabled', true);
        $('#btnCambiarTarjeta').dxButton('option', 'text', 'Seleccione');
        $('#btnCambiarMM').dxButton('option', 'text', 'Mes');
        $('#btnCambiarAA').dxButton('option', 'text', 'Año');
    }

    return viewModel;
};