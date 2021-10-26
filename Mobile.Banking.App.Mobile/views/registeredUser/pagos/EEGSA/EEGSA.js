MobileBanking_App.EEGSA = function (params) {
    "use strict";

    var groupValidation = 'PagoEEGSADocumento'
    var groupValidation2 = 'PagoEEGSAFactura'

    var dsTIPOPAGO = [
        {
            "Codigo": "01",
            "Valor": "Factura de Energía"
        },
        {
            "Codigo": "07",
            "Valor": "Reconexión"
        }
    ]

    var dsTIPOBUSQUEDAPAGOFACTURA = [{
        "Codigo": "1",
        "Valor": "No. Contador"
    },
    {
        "Codigo": "0",
        "Valor": "No. de Correlativo"
    }]

    var dsTIPOBUSQUEDAPAGORECONEXION = [
        {
            "Codigo": "0",
            "Valor": "No. de Correlativo"
        }
    ]

    var viewModel = {
        viewShown: function () {
            setupFloatButton(classButtons.Cancel, cancelar, undefined, sizeFloatButtons.small, typeFloatButtons.white);
            setupFloatButton(classButtons.Accept, consultar, undefined, undefined, undefined, undefined, groupValidation);

            

        },
        viewShowing: function () {
            hideFloatButtons();
        },
        slTipoPago: setupComboBoxControl(dsTIPOPAGO, "Valor", "Codigo", '01', false, undefined, undefined, undefined),
        slTipoDocumento: setupComboBoxControl(dsTIPOBUSQUEDAPAGOFACTURA, "Valor", "Codigo", "No. de Correlativo", false, undefined, undefined, undefined),
        slTipoDocumentoReconec: setupComboBoxControl(dsTIPOBUSQUEDAPAGORECONEXION, "Valor", "Codigo", "No. de Correlativo", false, undefined, undefined, undefined),
        txtNumeroDocumento: ko.observable(),
        txtFactura: ko.observable(),
        valorTotalPagar: ko.observable(),
        groupValidation: groupValidation,
        groupValidation2: groupValidation2,
    };

    function consultar(params) {
        var tipoPago = $('#slTipoPago').dxSelectBox('option', 'value')
        var tipoDoc = $('#slTipoDocumento').dxSelectBox('option', 'value')
        var isValid = DevExpress.validationEngine.validateGroup("PagoEEGSADocumento").isValid;
   
        var numeroCuenta = $('#txtNumeroDocumento').dxTextBox('option', 'value');
        if (tipoPago == "07") {//Es Reconexion
            isValid = DevExpress.validationEngine.validateGroup("PagoEEGSAFactura").isValid
          var  numeroFactura = $('#txtNumeroFactura').dxTextBox('option', 'value');
        }

        if (isValid) {

            var requerimiento = {
                Comercio: tipoServicioBasicoStr.EMPRESA_ELECTRICA_EEGSA,
                NumeroCuenta: numeroCuenta,
                TipoCuenta: tipoDoc,
            }

            var monto = $('#valorTotalPagar').dxNumberBox('option', 'value');
            var currentPayment = {
                numeroCuenta: numeroCuenta,
                tipoComercio: tipoServicioBasicoStr.EMPRESA_ELECTRICA_EEGSA,
                infoPago: {
                    tipoBusqueda: tipoPago,
                    montoMostrar: 'Q ' + monto.toFixed(2),
                    tipoMostrar: $('#slTipoPago').dxSelectBox('option', 'selectedItem'),
                    monto: monto,
                    tipoDocumento: $('#slTipoDocumento').dxSelectBox('option', 'selectedItem'), //esFactura
                },
                respSaldo: {
                    Saldo: monto,
                    Nombre: "",
                    Direccion: "",
                    Documento: numeroCuenta,
                    Factura: numeroFactura
                }
            }
            if (tipoPago === '01') {//EsFactura

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
            else {
                RedirectOnSuccess(currentPayment);
            }



        }
    }


    function RedirectOnSuccess(currentPayment) {
        var uri = MobileBanking_App.app.router.format({
            view: 'EGGSAPagarServicio',
            id: JSON.stringify(currentPayment)
        });
        MobileBanking_App.app.navigate(uri, { root: true });
    }





    function cancelar(e) {
        MobileBanking_App.app.navigate('TipoServicio', { root: true });
    }

    viewModel.slTipoPago.onValueChanged = function (e) {
        if (e.value === '07') {
            $("#divNumeroFactura").show();
            $("#divValorPagar").show();

            $('#slTipoDocumento').dxSelectBox('option', 'dataSource', dsTIPOBUSQUEDAPAGORECONEXION );
            

            //slTipoDocumento: setupComboBoxControl(dsTIPOBUSQUEDAPAGOFACTURA[1], "Valor", "Codigo", "No. Contador", false, undefined, undefined, undefined);
            $("#divTipoDocumento").show();

            //$("#divNumeroDocumento").hide();

        }
        else {
            $('#slTipoDocumento').dxSelectBox('option', 'dataSource', dsTIPOBUSQUEDAPAGOFACTURA);
            $("#divNumeroFactura").hide();
            $("#divValorPagar").hide();
            
            $("#divTipoDocumento").show();
            $("#divNumeroDocumento").show();
            

        }
    }


    return viewModel;
};