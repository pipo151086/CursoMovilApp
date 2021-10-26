MobileBanking_App.PagoCreditoTarjeta = function (params) {
    "use strict";

    var datosPago = null;

    SesionMovil = JSON.parse('{"ControlAccesoGlobal":{"IdControlAcceso":2866,"NombreUsuario":"JJIMENEZ","TipoIdentificacion":"CED","NumeroIdentificacion":"2152500440301","FechaHoraUltimoAcceso":"2019 - 06 - 17T16: 07: 57.647","CanalUltimoAcceso":"WEB","CambiarNombreUsuario":false,"NumeroCelularRegistrado":"0992629386","CorreoElectronicoRegistrado":"jmpaucarm@hotmail.com","EsActivo":true,"FechaRegistro":"0001 - 01 - 01T00: 00: 00","CodigoNotificacion":1,"InfoNotificacionRequerida":true},"ContextoCliente":{"IdInstitucion":2,"NombreCompletoCliente":"JOSUE CARLOS RENE JIMENEZ MORALES","CodigoCliente":631725,"NombreOficina":"","NombreCadena":"","TokenAutenticacion":"UGHUIBJKB &% /&","SecuencialTransacciones":1,"BranchOperador":"El Ejido","CodigoOperador":null,"TipoDocumento":"CED","FechaTransaccional":"2020-09-30","ClaveFuerte":"ghhjgfdj&%%$$)=jkhjkhk","PasswordClaro":"111111","SessionId":"1","PasswordEncriptado":"LYGr9O5mU5s=","NumeroIntentos":1,"NumeroDocumento":"2152500440301","TipoClave":null,"Rol":null,"PasswordTransaccional":null,"Respuesta":"0","IpTerminal":null},"PosicionConsolidada":{"IdPosConsolidada":1,"InversionesCliente":[{"Codigo":"4125500349494","Capital":40000,"Plazo":365,"Tasa":0.0725,"FechaCreacion":"2019-05-07T15:22:07","FechaUltimoVencimiento":"2020-05-06T15:22:07","DescripcionItem":"AL VENCIMIENTO","BeneficiariosInversion":[{"Identificacion":"","NumeroCertificado":"4125500349494","Beneficiario":"BRAULIO JUAREZ JUANA","Direccion":"CIUDAD","Telefono":""},{"Identificacion":"","NumeroCertificado":"4125500349494","Beneficiario":"SANCHEZ BRAULIO ROMELIA GRACIELA","Direccion":"CIUDAD/HIJA","Telefono":""}],"IdPosConsolidada":1,"Interes":2900,"ValorRetencion":290,"TotalInversion":42610,"Moneda":"GTQ"}],"CuentasCliente":[{"Codigo":"4127001073669","Tipo":"CORRIENTE USD","Estado":"ACTIVA","SaldoDisponible":"1431.99","SaldoContable":"1431.99","NumTransaccionesTotal":"8000.00","CodUltimaTransacion":null,"CuentaSaldo":null,"NumTarjetaDebitoTitular":"","CodigoSubProducto":"SPDPAINDIVIDUAL","IdCuentaCliente":126364,"Moneda":"USD","Identificacion":null,"MovimientosCuenta":null,"IdPosConsolidada":1,"TieneTarjetaDebito":false},{"Codigo":"4127001074525","Tipo":"EMPLEADOS GTQ","Estado":"ACTIVA","SaldoDisponible":"969630.06","SaldoContable":"-29902.67","NumTransaccionesTotal":"60000.00","CodUltimaTransacion":null,"CuentaSaldo":null,"NumTarjetaDebitoTitular":"4915830000093786","CodigoSubProducto":"SPDPARRHH","IdCuentaCliente":126449,"Moneda":"GTQ","Identificacion":null,"MovimientosCuenta":null,"IdPosConsolidada":1,"TieneTarjetaDebito":false},{"Codigo":"4127001086620","Tipo":"CORRIENTE GTQ","Estado":"ACTIVA","SaldoDisponible":"52.75","SaldoContable":"52.75","NumTransaccionesTotal":"60000.00","CodUltimaTransacion":null,"CuentaSaldo":null,"NumTarjetaDebitoTitular":"","CodigoSubProducto":"SPDANORMALGTQ","IdCuentaCliente":127648,"Moneda":"GTQ","Identificacion":null,"MovimientosCuenta":null,"IdPosConsolidada":1,"TieneTarjetaDebito":false}],"TarjetasCliente":[{"EsPrincipal":true,"IdCuentaTarjeta":107631,"IdTarjetaHabiente":109043,"DescripcionEstadoTarjeta":"ACTIVA","DescripcionBin":"VISA CLASSIC","DescripcionAfinidad":"MASTER CARD LOCAL EMPLEADO BDA","Marca":"VISA","TipoProcesamiento":"TRJEXTERNO","NumeroTarjeta":"4399348915002855","DiaPago":16,"CupoAprobado":300,"CupoUtilizado":908.79,"CupoDisponible":-608.79,"CupoAprobadoEspecial":0,"CupoUtilizadoEspecial":0,"CupoDisponibleEspecial":0,"CupoUtilizadoAvance":0,"FechaUltimoCorte":"2019-11-21T00:00:00","FechaUltimoVcto":"2019-12-16T00:00:00","FechaUltimoPago":"2019-11-12T00:00:00","SaldoPagoTotal":0,"SaldoPagoMinimo":0,"CupoAprobadoTotal":1300,"CupoUtilizadoTotal":908.79,"CupoDisponibleTotal":391.21,"CupoAprobadoSuperAvance":0,"CupoUtilizadoSuperAvance":0,"CupoDisponibleSuperAvance":0,"IdPosConsolidada":1,"Moneda":"USD","Cotizacion":7.55},{"EsPrincipal":true,"IdCuentaTarjeta":109543,"IdTarjetaHabiente":110971,"DescripcionEstadoTarjeta":"ACTIVA","DescripcionBin":"VISA CLASSIC","DescripcionAfinidad":"MASTER CARD CLASICA FLUJO EXPRESS / CLIENTE VIP PREFERENTE","Marca":"VISA","TipoProcesamiento":"TRJEXTERNO","NumeroTarjeta":"4399348415035553","DiaPago":16,"CupoAprobado":300,"CupoUtilizado":0,"CupoDisponible":300,"CupoAprobadoEspecial":0,"CupoUtilizadoEspecial":0,"CupoDisponibleEspecial":0,"CupoUtilizadoAvance":0,"FechaUltimoCorte":"2019-11-21T00:00:00","FechaUltimoVcto":"2019-12-16T00:00:00","FechaUltimoPago":"1900-01-01T00:00:00","SaldoPagoTotal":0,"SaldoPagoMinimo":0,"CupoAprobadoTotal":300,"CupoUtilizadoTotal":0,"CupoDisponibleTotal":300,"CupoAprobadoSuperAvance":0,"CupoUtilizadoSuperAvance":0,"CupoDisponibleSuperAvance":0,"IdPosConsolidada":1,"Moneda":"USD","Cotizacion":7.55},{"EsPrincipal":true,"IdCuentaTarjeta":109544,"IdTarjetaHabiente":110972,"DescripcionEstadoTarjeta":"ACTIVA","DescripcionBin":"VISA GOLD","DescripcionAfinidad":"MASTER CARD CLASICA FLUJO EXPRESS / CLIENTE VIP PREFERENTE","Marca":"VISA","TipoProcesamiento":"TRJEXTERNO","NumeroTarjeta":"4399338412025582","DiaPago":16,"CupoAprobado":1900,"CupoUtilizado":0,"CupoDisponible":1900,"CupoAprobadoEspecial":0,"CupoUtilizadoEspecial":0,"CupoDisponibleEspecial":0,"CupoUtilizadoAvance":0,"FechaUltimoCorte":"2019-11-21T00:00:00","FechaUltimoVcto":"2019-12-16T00:00:00","FechaUltimoPago":"1900-01-01T00:00:00","SaldoPagoTotal":0,"SaldoPagoMinimo":0,"CupoAprobadoTotal":1900,"CupoUtilizadoTotal":0,"CupoDisponibleTotal":1900,"CupoAprobadoSuperAvance":0,"CupoUtilizadoSuperAvance":0,"CupoDisponibleSuperAvance":0,"IdPosConsolidada":1,"Moneda":"USD","Cotizacion":7.55}],"CreditosCliente":[{"NumeroCredito":"4112001165930","IdAgencia":1,"NombreAgencia":"OFICINA CENTRAL ADMINSTRATIVO","FechaOtorgamiento":"2019-05-08T00:00:00","SaldoCapitalCredito":6344.67,"NumeroCuotas":24,"ValorTotalAPagar":0,"FechaProximoVencimiento":"2020-10-19T00:00:00","ValorTarifa":0,"CuotasCredito":[{"Credito":"4112001165930","Cuota":"17/24","ValorCuota":0,"FechaVencimiento":"2020-10-19T00:00:00","ValorAPagar":818,"Vencida":false},{"Credito":"4112001165930","Cuota":"18/24","ValorCuota":0,"FechaVencimiento":"2020-11-19T00:00:00","ValorAPagar":923,"Vencida":false},{"Credito":"4112001165930","Cuota":"19/24","ValorCuota":0,"FechaVencimiento":"2020-12-19T00:00:00","ValorAPagar":923,"Vencida":false},{"Credito":"4112001165930","Cuota":"20/24","ValorCuota":0,"FechaVencimiento":"2021-01-19T00:00:00","ValorAPagar":923,"Vencida":false},{"Credito":"4112001165930","Cuota":"21/24","ValorCuota":0,"FechaVencimiento":"2021-02-19T00:00:00","ValorAPagar":923,"Vencida":false},{"Credito":"4112001165930","Cuota":"22/24","ValorCuota":0,"FechaVencimiento":"2021-03-19T00:00:00","ValorAPagar":923,"Vencida":false},{"Credito":"4112001165930","Cuota":"23/24","ValorCuota":0,"FechaVencimiento":"2021-04-19T00:00:00","ValorAPagar":923,"Vencida":false},{"Credito":"4112001165930","Cuota":"24/24","ValorCuota":0,"FechaVencimiento":"2021-05-19T00:00:00","ValorAPagar":923,"Vencida":false}],"Moneda":"GTQ","IdPosConsolidada":1,"ValorVencido":0,"ValorVigente":0,"CodigoProducto":"JAPONMOTOS","ValorCuota":0},{"NumeroCredito":"4112001165949","IdAgencia":1,"NombreAgencia":"OFICINA CENTRAL ADMINSTRATIVO","FechaOtorgamiento":"2019-05-08T00:00:00","SaldoCapitalCredito":4618.48,"NumeroCuotas":15,"ValorTotalAPagar":0,"FechaProximoVencimiento":"2019-06-19T00:00:00","ValorTarifa":0,"CuotasCredito":[{"Credito":"4112001165949","Cuota":"1/15","ValorCuota":0,"FechaVencimiento":"2019-06-19T00:00:00","ValorAPagar":401,"Vencida":false},{"Credito":"4112001165949","Cuota":"2/15","ValorCuota":0,"FechaVencimiento":"2019-07-19T00:00:00","ValorAPagar":401,"Vencida":false},{"Credito":"4112001165949","Cuota":"3/15","ValorCuota":0,"FechaVencimiento":"2019-08-19T00:00:00","ValorAPagar":401,"Vencida":false},{"Credito":"4112001165949","Cuota":"4/15","ValorCuota":0,"FechaVencimiento":"2019-09-19T00:00:00","ValorAPagar":401,"Vencida":false},{"Credito":"4112001165949","Cuota":"5/15","ValorCuota":0,"FechaVencimiento":"2019-10-19T00:00:00","ValorAPagar":401,"Vencida":false},{"Credito":"4112001165949","Cuota":"6/15","ValorCuota":0,"FechaVencimiento":"2019-11-19T00:00:00","ValorAPagar":401,"Vencida":false},{"Credito":"4112001165949","Cuota":"7/15","ValorCuota":0,"FechaVencimiento":"2019-12-19T00:00:00","ValorAPagar":401,"Vencida":false},{"Credito":"4112001165949","Cuota":"8/15","ValorCuota":0,"FechaVencimiento":"2020-01-19T00:00:00","ValorAPagar":401,"Vencida":false},{"Credito":"4112001165949","Cuota":"9/15","ValorCuota":0,"FechaVencimiento":"2020-02-19T00:00:00","ValorAPagar":401,"Vencida":false},{"Credito":"4112001165949","Cuota":"10/15","ValorCuota":0,"FechaVencimiento":"2020-03-19T00:00:00","ValorAPagar":401,"Vencida":false}],"Moneda":"GTQ","IdPosConsolidada":1,"ValorVencido":0,"ValorVigente":0,"CodigoProducto":"CONSUMOINCOM","ValorCuota":0}],"EstadosTarjetasVisaCliente":null},"SessionToken":{"SessionId":"IdDispositivoSimuladorPortaleszO7lLTc2KJ","FechaSession":"2020/09 / 30","HoraSession":"16: 08"},"FechaActividadApp":"2020 - 09 - 30T21: 08: 34.463Z","ProductosCliente":[{"IdProducto":1,"CodigoProducto":"CTA","NombreProducto":"CUENTAS"},{"IdProducto":2,"CodigoProducto":"TRJ","NombreProducto":"TARJETAS"},{"IdProducto":4,"CodigoProducto":"CRE","NombreProducto":"CRÉDITOS"},{"IdProducto":5,"CodigoProducto":"INV","NombreProducto":"DEPÓSITOS A PLAZO"}],"FechaHoraUltimoAccesoMostrar":"2019 - 06 - 17T21: 07: 57.000Z"}')

    if (params.id)
        datosPago = JSON.parse(params.id);

    var Anios = [];
    var MMSelected = null;
    var AASelected = null;
    var groupValidation = 'PAGOCONTARJETA';

    var viewModel = {
        groupValidation: groupValidation,
        viewShown: function () {
            setupFloatButton(classButtons.Cancel, cancelar, undefined, sizeFloatButtons.small, typeFloatButtons.white);
            setupFloatButton(classButtons.Accept, siguiente, undefined, undefined, undefined, undefined, groupValidation);
            $('#txtMonto').text(datosPago.montoMostrar);
            $('#txtNumTarjeta').attr('type', 'number');
            $('#txtNumTarjeta').attr('type', 'text');
            $('#txtNumTarjeta').attr('pattern', '[0-9]*');

            /*
             * https://js.devexpress.com/Demos/WidgetsGallery/Demo/Common/CustomTextEditorButtons/jQuery/Light/
             buttons: [{
            name: "password",
            location: "after",
            options: {
                icon: "images/icons/eye.png",
                type: "default",
                onClick: function() {
                    passwordEditor.option("mode", passwordEditor.option("mode") === "text" ? "password" : "text");
                }
            }
        }]
             
             */

            /*var deviceVersion = parseInt(DeviceInfo.DeviceVersion.replace(".", "").substring(0, 2));
            if (deviceType === 'Android') {
                if (deviceVersion < 44 && deviceVersion != 9 && deviceVersion != 10) {
                    $('#txtNumTarjeta').bind('keyup', KeyPadEventHandlerForPinNUM);
                }
                else {
                    $('#txtNumTarjeta').bind('input', KeyPadEventHandlerForPinNUM);
                }
            }
            else {
                $('#txtNumTarjeta').bind('keyup', KeyPadEventHandlerForPinNUM);
            }*/
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
        if (result.isValid) {
            if (datosPago.esCredito === true) {

                PagarBotonVisaNet(
                    "GTQ",
                    //datosPago.TarjCredConsultado.Moneda,
                    $('#txtNumTarjeta').dxTextBox('option', 'value'),
                    $('#txtCodigoSeguridad').dxNumberBox('option', 'value'),
                    AASelected.IdAnio + MMSelected.Numero,
                    datosPago.monto,
                    datosPago.numeroCredito,
                    0,
                    function (data) {
                        debugger;
                    })
            }
            else {
                debugger;
                PagarTarjetaBotonVisaNet(
                    //datosPago.TarjCredConsultado.MonedaTarjeta,
                    "GTQ",
                    $('#txtNumTarjeta').dxTextBox('option', 'value'),
                    $('#txtCodigoSeguridad').dxNumberBox('option', 'value'),
                    AASelected.IdAnio + MMSelected.Numero,
                    datosPago.monto,
                    datosPago.TarjCredConsultado.NumeroTarjeta, //TRJ A PAGAR
                    SesionMovil.PosicionConsolidada.TarjetasCliente[0].Cotizacion,
                    function (data) {
                        debugger;
                    })
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