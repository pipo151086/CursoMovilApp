MobileBanking_App.MOVISTAR = function (params) {
    "use strict";

    var dsTIPOBUSQUEDA = [
        {
            "Codigo": "1",
            "Valor": "Prepago"
        },
        {
            "Codigo": "0",
            "Valor": "PostPago"
        }]

    var dsRECARGAS = [
        {
            "Codigo": "1",
            "Valor": "5",
            "Descripcion": "Q 5.00"
        },
        {
            "Codigo": "2",
            "Valor": "10",
            "Descripcion": "Q 10.00"
        },
        {
            "Codigo": "3",
            "Valor": "15",
            "Descripcion": "Q 15.00"
        },
        {
            "Codigo": "4",
            "Valor": "25",
            "Descripcion": "Q 25.00"
        },
        {
            "Codigo": "5",
            "Valor": "35",
            "Descripcion": "Q 35.00"
        },
        {
            "Codigo": "6",
            "Valor": "50",
            "Descripcion": "Q 50.00"
        },
        {
            "Codigo": "7",
            "Valor": "75",
            "Descripcion": "Q 75.00"
        },
        {
            "Codigo": "8",
            "Valor": "100",
            "Descripcion": "Q 100.00"
        },
        {
            "Codigo": "9",
            "Valor": "150",
            "Descripcion": "Q 150.00"
        },
        {
            "Codigo": "10",
            "Valor": "300",
            "Descripcion": "Q 300.00"
        }
    ]

    var groupValidation = 'prepagoValidator';
    var groupValidation2 = 'posPagoValidator';

    var viewModel = {
        viewShowing: function () {
            hideFloatButtons();
        },
        viewShown: function () {
            setupFloatButton(classButtons.Cancel, cancelar, undefined, sizeFloatButtons.small, typeFloatButtons.white);
            setupFloatButton(classButtons.Accept, consultar, undefined, undefined, undefined, undefined, groupValidation);
        },
        //setupComboBoxControl(dataSource, displayMember, valueMember, defaultValue, searchEnabled, typeStateField, width, placeHolder)
        slTipoServicio: setupComboBoxControl(dsTIPOBUSQUEDA, "Valor", "Codigo", '1', false, undefined, undefined, undefined),

        txtNumeroTelefono: ko.observable(),
        slMontoRecarga: setupComboBoxControl(dsRECARGAS, "Valor", "Codigo", '2', false, undefined, undefined, undefined),


        txtNombre: setupTextBoxControl('', 128, 'Nombre', typeLetter.upper, undefined, true, typeCharAllowed.OnlyText),
        txtNit: setupTextBoxDNIControl('', undefined),
        txtCorreo: setupEmailControl('', undefined, undefined, 'Correo Electrónico'),
        groupValidation: groupValidation,
        groupValidation2: groupValidation2
    };

    function consultar(params) {
        var tipoBusqueda = $('#slTipoServicio').dxSelectBox('option', 'value');
        var tipoServicio = tipoServicioBasicoStr.MOVISTAR_POSTPAGO;
        var isValid = DevExpress.validationEngine.validateGroup(groupValidation).isValid;
        if (tipoBusqueda === '1') { //Prepago
            isValid = DevExpress.validationEngine.validateGroup(groupValidation2).isValid;
            tipoServicio = tipoServicioBasicoStr.MOVISTAR_PREPAGO;
        }
        if (isValid) {
            var monto = $('#slMontoRecarga').dxSelectBox('option', 'selectedItem');
            var currentPayment = {
                numeroCuenta: $('#txtNumeroTelefono').dxTextBox('option', 'value'),
                tipoComercio: tipoServicio,
                infoPago: {
                    tipoBusqueda: tipoBusqueda,
                    montoMostrar: monto,
                    tipoMostrar: $('#slTipoServicio').dxSelectBox('option', 'selectedItem'),
                    monto: (monto.Valor) ? monto.Valor : monto.Monto,
                    nombre: $('#txtNombre').dxTextBox('option', 'value'),
                    nit: $('#txtNit').dxTextBox('option', 'value'),
                    correo: $('#txtCorreo').dxTextBox('option', 'value'),
                },
                respSaldo: {
                    Saldo: (monto.Valor) ? monto.Valor : monto.Monto,
                    Nombre: "",
                    Direccion: "",
                    Documento: "",
                    FechaPago: ""
                },
            }

            var requerimiento = {
                Monto: currentPayment.infoPago.monto,
                Comercio: tipoServicio,
                TipoCuenta: tipoBusqueda,
                NumeroCuenta: currentPayment.numeroCuenta,
                NombreCliente: currentPayment.infoPago.nombre,
                NIT: currentPayment.infoPago.nit,
                CorreoElectronico: currentPayment.infoPago.correo
            }
            
            if (tipoBusqueda === '0') {//PostPago
                ConsultaPagoServicios(requerimiento, function (respSaldo) {
                    if(!respSaldo)
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
            view: 'MOVISTARPagarServicio',
            id: JSON.stringify(currentPayment)
        });
        MobileBanking_App.app.navigate(uri, { root: true });
    }


    function cancelar(e) {
        MobileBanking_App.app.navigate('PosicionConsolidada', { root: true });
    }

    viewModel.slTipoServicio.onValueChanged = function (e) {
        if (e.value === '1') {//Prepago
            $(".containerPrePago").show();
        }
        else {
            $(".containerPrePago").hide();
        }
    }
    return viewModel;
};