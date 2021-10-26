MobileBanking_App.MOVISTARPagarServicio = function (params) {
    "use strict";

    var currentPayment = JSON.parse('{"numeroCuenta":"45645645645","tipoComercio":"CLARO_PREPAGO","infoPago":{"tipoBusqueda":"1","montoMostrar":{"Codigo":"2","Valor":"11","Descripcion":"Q 11.00"},"tipoMostrar":{"Codigo":"1","Valor":"Prepago"},"monto":"11","nombre":"DFGDFG","nit":"3453453453","correo":"pipo151086@gmail.com"},"respSaldo":{"Saldo":"11"}}');
    if (params.id)
        currentPayment = JSON.parse(params.id);


    var arrayCtaOrigen = [];
    var accountSelected = null;
    var posCons = JSON.parse('{"IdPosConsolidada":1,"InversionesCliente":[{"Codigo":"4125500349494","Capital":40000,"Plazo":365,"Tasa":0.0725,"FechaCreacion":"2019-05-07T15:22:07","FechaUltimoVencimiento":"2020-05-06T15:22:07","DescripcionItem":"AL VENCIMIENTO","BeneficiariosInversion":[{"Identificacion":"","NumeroCertificado":"4125500349494","Beneficiario":"BRAULIO JUAREZ JUANA","Direccion":"CIUDAD","Telefono":""},{"Identificacion":"","NumeroCertificado":"4125500349494","Beneficiario":"SANCHEZ BRAULIO ROMELIA GRACIELA","Direccion":"CIUDAD/HIJA","Telefono":""}],"IdPosConsolidada":1,"Interes":2900,"ValorRetencion":290,"TotalInversion":42610,"Moneda":"GTQ"},{"Codigo":"4125500349508","Capital":49100,"Plazo":365,"Tasa":0.0725,"FechaCreacion":"2019-05-07T15:56:17","FechaUltimoVencimiento":"2020-05-06T15:56:17","DescripcionItem":"AL VENCIMIENTO","BeneficiariosInversion":[{"Identificacion":"","NumeroCertificado":"4125500349508","Beneficiario":"GONZALEZ ESTHEFANI GABRIELA","Direccion":"","Telefono":""},{"Identificacion":"","NumeroCertificado":"4125500349508","Beneficiario":"GONZALEZ MADYORI DEL CARMEN","Direccion":"","Telefono":""}],"IdPosConsolidada":1,"Interes":3560,"ValorRetencion":356,"TotalInversion":52304,"Moneda":"GTQ"},{"Codigo":"4125500349516","Capital":30800,"Plazo":182,"Tasa":0.016,"FechaCreacion":"2019-05-07T17:18:16","FechaUltimoVencimiento":"2019-11-05T17:18:16","DescripcionItem":"AL VENCIMIENTO","BeneficiariosInversion":[{"Identificacion":"","NumeroCertificado":"4125500349516","Beneficiario":"SIERRA GONZALEZ LOURDES AMPARO","Direccion":"CIUDAD","Telefono":""},{"Identificacion":"","NumeroCertificado":"4125500349516","Beneficiario":"VILLELA XOY  ILSE EMPERATRIZ","Direccion":"CIUDAD","Telefono":""}],"IdPosConsolidada":1,"Interes":246,"ValorRetencion":24.6,"TotalInversion":31021.4,"Moneda":"USD"}],"CuentasCliente":[{"Codigo":"4127001073669","Tipo":"CORRIENTE USD","Estado":"ACTIVA","SaldoDisponible":"1431.99","SaldoContable":"1431.99","NumTransaccionesTotal":null,"CodUltimaTransacion":null,"CuentaSaldo":null,"NumTarjetaDebitoTitular":"","CodigoSubProducto":"SPDPAINDIVIDUAL","IdCuentaCliente":126364,"Moneda":"USD","Identificacion":null,"MovimientosCuenta":null,"IdPosConsolidada":1,"TieneTarjetaDebito":false},{"Codigo":"4127001074525","Tipo":"EMPLEADOS GTQ","Estado":"ACTIVA","SaldoDisponible":"981259.25","SaldoContable":"-18273.48","NumTransaccionesTotal":null,"CodUltimaTransacion":null,"CuentaSaldo":null,"NumTarjetaDebitoTitular":"4915830000093786","CodigoSubProducto":"SPDPARRHH","IdCuentaCliente":126449,"Moneda":"GTQ","Identificacion":null,"MovimientosCuenta":null,"IdPosConsolidada":1,"TieneTarjetaDebito":false},{"Codigo":"4127001086620","Tipo":"CORRIENTE GTQ","Estado":"ACTIVA","SaldoDisponible":"240.00","SaldoContable":"240.00","NumTransaccionesTotal":null,"CodUltimaTransacion":null,"CuentaSaldo":null,"NumTarjetaDebitoTitular":"","CodigoSubProducto":"SPDANORMALGTQ","IdCuentaCliente":127648,"Moneda":"GTQ","Identificacion":null,"MovimientosCuenta":null,"IdPosConsolidada":1,"TieneTarjetaDebito":false}],"TarjetasCliente":[{"EsPrincipal":true,"IdCuentaTarjeta":107631,"IdTarjetaHabiente":109043,"DescripcionEstadoTarjeta":"ACTIVA","DescripcionBin":"VISA CLASSIC","DescripcionAfinidad":"EMPLEADO BDA","Marca":"VISA","TipoProcesamiento":"TRJEXTERNO","NumeroTarjeta":"4399348915002855","DiaPago":16,"CupoAprobado":300,"CupoUtilizado":908.79,"CupoDisponible":-608.79,"CupoAprobadoEspecial":0,"CupoUtilizadoEspecial":0,"CupoDisponibleEspecial":0,"CupoUtilizadoAvance":0,"FechaUltimoCorte":"2019-11-21T00:00:00","FechaUltimoVcto":"2019-12-16T00:00:00","FechaUltimoPago":"2019-11-12T00:00:00","SaldoPagoTotal":0,"SaldoPagoMinimo":0,"CupoAprobadoTotal":1300,"CupoUtilizadoTotal":908.79,"CupoDisponibleTotal":391.21,"CupoAprobadoSuperAvance":0,"CupoUtilizadoSuperAvance":0,"CupoDisponibleSuperAvance":0,"IdPosConsolidada":1,"Moneda":"USD"}],"CreditosCliente":[{"NumeroCredito":"4112001165930","IdAgencia":1,"NombreAgencia":"OFICINA CENTRAL ADMINSTRATIVO","FechaOtorgamiento":"2019-05-08T00:00:00","SaldoCapitalCredito":6344.67,"NumeroCuotas":24,"ValorTotalAPagar":0,"FechaProximoVencimiento":"2020-10-19T00:00:00","ValorTarifa":0,"CuotasCredito":[{"Credito":"4112001165930","Cuota":"17/24","ValorCuota":0,"FechaVencimiento":"2020-10-19T00:00:00","ValorAPagar":923,"Vencida":false},{"Credito":"4112001165930","Cuota":"18/24","ValorCuota":0,"FechaVencimiento":"2020-11-19T00:00:00","ValorAPagar":923,"Vencida":false},{"Credito":"4112001165930","Cuota":"19/24","ValorCuota":0,"FechaVencimiento":"2020-12-19T00:00:00","ValorAPagar":923,"Vencida":false},{"Credito":"4112001165930","Cuota":"20/24","ValorCuota":0,"FechaVencimiento":"2021-01-19T00:00:00","ValorAPagar":923,"Vencida":false},{"Credito":"4112001165930","Cuota":"21/24","ValorCuota":0,"FechaVencimiento":"2021-02-19T00:00:00","ValorAPagar":923,"Vencida":false},{"Credito":"4112001165930","Cuota":"22/24","ValorCuota":0,"FechaVencimiento":"2021-03-19T00:00:00","ValorAPagar":923,"Vencida":false},{"Credito":"4112001165930","Cuota":"23/24","ValorCuota":0,"FechaVencimiento":"2021-04-19T00:00:00","ValorAPagar":923,"Vencida":false},{"Credito":"4112001165930","Cuota":"24/24","ValorCuota":0,"FechaVencimiento":"2021-05-19T00:00:00","ValorAPagar":923,"Vencida":false}],"Moneda":"GTQ","IdPosConsolidada":1,"ValorVencido":0,"ValorVigente":0,"CodigoProducto":"JAPONMOTOS","ValorCuota":0},{"NumeroCredito":"4112001165949","IdAgencia":1,"NombreAgencia":"OFICINA CENTRAL ADMINSTRATIVO","FechaOtorgamiento":"2019-05-08T00:00:00","SaldoCapitalCredito":4618.48,"NumeroCuotas":15,"ValorTotalAPagar":0,"FechaProximoVencimiento":"2019-06-19T00:00:00","ValorTarifa":0,"CuotasCredito":[{"Credito":"4112001165949","Cuota":"1/15","ValorCuota":0,"FechaVencimiento":"2019-06-19T00:00:00","ValorAPagar":401,"Vencida":false},{"Credito":"4112001165949","Cuota":"2/15","ValorCuota":0,"FechaVencimiento":"2019-07-19T00:00:00","ValorAPagar":401,"Vencida":false},{"Credito":"4112001165949","Cuota":"3/15","ValorCuota":0,"FechaVencimiento":"2019-08-19T00:00:00","ValorAPagar":401,"Vencida":false},{"Credito":"4112001165949","Cuota":"4/15","ValorCuota":0,"FechaVencimiento":"2019-09-19T00:00:00","ValorAPagar":401,"Vencida":false},{"Credito":"4112001165949","Cuota":"5/15","ValorCuota":0,"FechaVencimiento":"2019-10-19T00:00:00","ValorAPagar":401,"Vencida":false},{"Credito":"4112001165949","Cuota":"6/15","ValorCuota":0,"FechaVencimiento":"2019-11-19T00:00:00","ValorAPagar":401,"Vencida":false},{"Credito":"4112001165949","Cuota":"7/15","ValorCuota":0,"FechaVencimiento":"2019-12-19T00:00:00","ValorAPagar":401,"Vencida":false},{"Credito":"4112001165949","Cuota":"8/15","ValorCuota":0,"FechaVencimiento":"2020-01-19T00:00:00","ValorAPagar":401,"Vencida":false},{"Credito":"4112001165949","Cuota":"9/15","ValorCuota":0,"FechaVencimiento":"2020-02-19T00:00:00","ValorAPagar":401,"Vencida":false},{"Credito":"4112001165949","Cuota":"10/15","ValorCuota":0,"FechaVencimiento":"2020-03-19T00:00:00","ValorAPagar":401,"Vencida":false}],"Moneda":"GTQ","IdPosConsolidada":1,"ValorVencido":0,"ValorVigente":0,"CodigoProducto":"CONSUMOINCOM","ValorCuota":0}],"EstadosTarjetasVisaCliente":null}');
    //var filtradas = jslinq(SesionMovil.PosicionConsolidada.CuentasCliente).where(function (el) {
    var filtradas = jslinq(posCons.CuentasCliente).where(function (el) {
        return el.Moneda == 'GTQ';
    }).toList();

    arrayCtaOrigen = $.map(filtradas, function (item, index) {
        var monedaSymbol = ((item.Moneda === 'GTQ') ? 'Q ' : '$ ');
        return { Codigo: item.Codigo, Descripcion: ' (' + monedaSymbol + item.SaldoDisponible + ') ' + item.Codigo.inputChar('-', item.Codigo.length - 1), SaldoDisponible: item.SaldoDisponible, SaldoDisponible: item.SaldoDisponible, SymbolMoneda: monedaSymbol, Moneda: item.Moneda }
    });

    var lisCtaOrigen = new DevExpress.data.DataSource({
        store: {
            type: "array",
            key: "Codigo",
            data: arrayCtaOrigen
        }
    });

    var viewModel = {
        txtNumeroTelefono: ko.observable(currentPayment.numeroCuenta),
        txtTitular: ko.observable(currentPayment.respSaldo.Nombre),
        txtFactura: ko.observable(currentPayment.respSaldo.Documento),
        txtFechaFactura: ko.observable(currentPayment.respSaldo.FechaPago),
        txtNombre: ko.observable(currentPayment.infoPago.nombre),
        txtNit: ko.observable(currentPayment.infoPago.nit),
        txtCorreo: ko.observable(currentPayment.infoPago.correo),
        txtMontoPagar: ko.observable("Q " + (+currentPayment.respSaldo.Saldo).toFixed(2)),

        viewShown: function () {
            setupFloatButton(classButtons.Accept, pagarServicio, undefined, undefined, undefined, undefined, undefined);
            setupFloatButton(classButtons.Cancel, cancelar, undefined, sizeFloatButtons.small, typeFloatButtons.white);
            if (currentPayment.tipoComercio === tipoServicioBasicoStr.MOVISTAR_PREPAGO) {
                $('.esPrePago').show();
                $('.esPostPago').hide();
            } else {
                $('.esPrePago').hide();
                $('.esPostPago').show();
            }
            accountSelected = lisCtaOrigen._store._array[0];
        },
        viewShowing: function () {
            hideFloatButtons();
        },
        popupSeleccionCuenta: setupPopup(false, '90%', 'auto', true, 'Cuenta Origen', true),
        rdbCuentas: setupRadioGroup(lisCtaOrigen._store._array[0].Codigo, lisCtaOrigen, 'Descripcion', 'Codigo', function (itemData, itemIndex, itemElement) {
            var content = "<div>";
            content = content + "<span>" + itemData.Codigo.inputChar('-', itemData.Codigo.length - 1) + " (" + itemData.SaldoDisponible + ")</span>";
            content = content + "</div>";
            return content;
        }),
        btnCancelarCuenta: setupButtonControlDefault(classButtons.Cancel, cancelAccount),
        btnCambiarCuenta: setupButtonControl(lisCtaOrigen._store._array[0].Descripcion, changeAccount, undefined, undefined, iconosCore.chevron_down, undefined, true),
    };

    var pagarServicio = function (args) {
        var requerimiento =
        {
            Comercio: currentPayment.tipoComercio,
            TipoCuenta: currentPayment.infoPago.tipoBusqueda,
            NumeroCuenta: currentPayment.numeroCuenta,
            NombreCliente: currentPayment.infoPago.nombre,
            NIT: currentPayment.infoPago.nit,
            CorreoElectronico: currentPayment.infoPago.correo,
            CodigoProducto: "01",
            Monto: currentPayment.infoPago.monto,
        };
        
        //RealizarPagoServicios(ctaMoneda, numeroCuenta, monto, codigoAtributo, requerimiento, addFunction)
        RealizarPagoServicios(accountSelected.Moneda,
            accountSelected.Codigo,
            requerimiento.Monto,
            "ATRDEBPAGOTCACTA",
            requerimiento, function (respPago) {
                currentPayment.respPago = !respPago ? {
                    RespuestaGenerarDebitoWeb: 'Secuencial', RespuestaPronet: { cualquierProp: "" }
                } :
                    respPago
                    ;
                currentPayment.accountSelected = accountSelected;
                RedirectOnSuccess(currentPayment);
            });

    }

    function RedirectOnSuccess(currentPayment) {
        var uri = MobileBanking_App.app.router.format({
            view: 'MOVISTARExitoso',
            id: JSON.stringify(currentPayment)
        });
        MobileBanking_App.app.navigate(uri, { root: true });
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
            changePropertyControl('#btnCambiarCuenta', typeControl.Button, 'text', accountSelected.Codigo.inputChar('-', accountSelected.Codigo.length - 1) + ' (' + accountSelected.SymbolMoneda + accountSelected.SaldoDisponible + ")");
            changePropertyControl('#popupSeleccionCuenta', typeControl.Popup, 'visible', false);

        }
    }

    viewModel.popupSeleccionCuenta.onShown = function () {
        $('#floatButtons').hide();
    }

    viewModel.popupSeleccionCuenta.onHidden = function () {
        $('#floatButtons').show();
    }

    function changeAccount() {
        changePropertyControl('#popupSeleccionCuenta', typeControl.Popup, 'visible', true);
    }
    function cancelAccount() {
        changePropertyControl('#popupSeleccionCuenta', typeControl.Popup, 'visible', false);
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
            changePropertyControl('#btnCambiarCuenta', typeControl.Button, 'text', accountSelected.Codigo.inputChar('-', accountSelected.Codigo.length - 1) + ' (' + accountSelected.SymbolMoneda + accountSelected.SaldoDisponible + ")");
            changePropertyControl('#popupSeleccionCuenta', typeControl.Popup, 'visible', false);

        }
    }
    var cancelar = function (args) {
        MobileBanking_App.app.navigate('PosicionConsolidada', { root: true });
    }
    return viewModel;
};