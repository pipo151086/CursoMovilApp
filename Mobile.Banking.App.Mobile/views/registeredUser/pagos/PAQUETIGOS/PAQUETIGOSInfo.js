MobileBanking_App.PAQUETIGOSInfo = function (params) {
    "use strict";

    var currentPayment;

    if (params.id != undefined)
        currentPayment = JSON.parse(params.id);

    var groupValidation = 'groupValidator';

    var tiposPaquetes = jslinq(currentPayment.resp.Productos).select(function (el) {
        return {
            codigoProducto: el.CodigoProducto,
        };
    }).distinct().toList();


    var montoPaquete = jslinq(currentPayment.resp.Productos).where(function (el) {
        return el.CodigoProducto == tiposPaquetes[0].codigoProducto;
    }).toList();


    var viewModel = {
        viewShowing: function () {
            hideFloatButtons();
        },
        viewShown: function () {
            setupFloatButton(classButtons.Cancel, cancelar, undefined, sizeFloatButtons.small, typeFloatButtons.white);
            setupFloatButton(classButtons.Accept, consultar, undefined, undefined, undefined, undefined, groupValidation);
            $('#txtNumeroTelefono').dxTextBox('option', 'disabled', true);

            ////CARGAR CATALOGOS

        },
        txtNumeroTelefono: setupHibridPhoneControl(currentPayment.numeroCuenta, undefined, ''),

        slTipoPaquete: setupComboBoxControl((!tiposPaquetes) ? [] : tiposPaquetes, "codigoProducto", "codigoProducto", (!tiposPaquetes) ? '' : tiposPaquetes[0].codigoProducto, false, undefined, undefined, undefined),
        slMontoRecarga: setupComboBoxControl((!montoPaquete) ? [] : montoPaquete, "DescripcionPrimaria", "Monto", (!montoPaquete) ? '' : montoPaquete[0].Monto, false, undefined, undefined, undefined),
        txtNombre: setupTextBoxControl('', 128, 'Nombre', typeLetter.upper, undefined, true, typeCharAllowed.OnlyText),
        txtNit: setupTextBoxControl('', 10, 'Nit', undefined),
        txtCorreo: setupEmailControl('', undefined, undefined, 'Correo Electrónico'),
        groupValidation: groupValidation,
    };



    function consultar(params) {
        var isValid = DevExpress.validationEngine.validateGroup(groupValidation).isValid;
        if (isValid) {
            var tipoPaquete = $('#slTipoPaquete').dxSelectBox('option', 'value')
            var monto = $('#slMontoRecarga').dxSelectBox('option', 'selectedItem');
            currentPayment.infoPago = {
                tipoBusqueda: tipoPaquete,
                montoMostrar: monto,
                tipoMostrar: $('#slTipoPaquete').dxSelectBox('option', 'selectedItem'),
                monto: (monto.Valor) ? monto.Valor : monto.Monto,
                nombre: $('#txtNombre').dxTextBox('option', 'value'),
                nit: $('#txtNit').dxTextBox('option', 'value'),
                correo: $('#txtCorreo').dxTextBox('option', 'value'),
            }
            currentPayment.respSaldo = {
                Saldo: currentPayment.infoPago.monto
            }
            RedirectOnSuccess(currentPayment)
        }
    }


    function RedirectOnSuccess(currentPayment) {
        var uri = MobileBanking_App.app.router.format({
            view: 'PAQUETIGOSPagarServicio',
            id: JSON.stringify(currentPayment)
        });
        MobileBanking_App.app.navigate(uri, { root: true });
    }



    function cancelar(e) {
        MobileBanking_App.app.navigate('TipoServicio', { root: true });
    }

    viewModel.slTipoPaquete.onValueChanged = function (e) {
        var montoPaquete = jslinq(currentPayment.resp.Productos).where(function (el) {
            return el.CodigoProducto == e.value;
        }).toList();

        $('#slMontoRecarga').dxSelectBox('option', 'dataSource', montoPaquete);
        $('#slMontoRecarga').dxSelectBox('option', 'value', montoPaquete[0].Monto);
    }

    return viewModel;
};