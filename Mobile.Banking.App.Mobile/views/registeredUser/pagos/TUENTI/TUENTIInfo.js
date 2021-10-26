MobileBanking_App.TUENTIInfo = function (params) {
    "use strict";

    var currentPayment;

    if (params.id != undefined)
        currentPayment = JSON.parse(params.id);

    var dsTIPOBUSQUEDA = [
        {
            "Codigo": "1",
            "Valor": "Recarga"
        },
        {
            "Codigo": "0",
            "Valor": "Paquetes"
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
            "Valor": "50",
            "Descripcion": "Q 50.00"
        },
        {
            "Codigo": "4",
            "Valor": "75",
            "Descripcion": "Q 75.00"
        },
        {
            "Codigo": "5",
            "Valor": "100",
            "Descripcion": "Q 100.00"
        },
        {
            "Codigo": "6",
            "Valor": "150",
            "Descripcion": "Q 150.00"
        }
    ]

    var dsPAQUETES = [
        {
            "Codigo": "1",
            "Valor": "8",
            "Descripcion": "Paquete Datos Q 8.00"
        },
        {
            "Codigo": "2",
            "Valor": "15",
            "Descripcion": "Paquete Datos Q 15.00"
        },
        {
            "Codigo": "3",
            "Valor": "25",
            "Descripcion": "Paquete Datos Q 25.00"
        },
        {
            "Codigo": "4",
            "Valor": "50",
            "Descripcion": "Combo Q 50.00"
        },
        {
            "Codigo": "5",
            "Valor": "75",
            "Descripcion": "Combo Q 75.00"
        },
        {
            "Codigo": "6",
            "Valor": "100",
            "Descripcion": "Combo Q 100.00"
        },
        {
            "Codigo": "7",
            "Valor": "10",
            "Descripcion": "Paquete Voz Digital Q 10.00"
        },
        {
            "Codigo": "8",
            "Valor": "10",
            "Descripcion": "Paquete Voz Q 10.00"
        },
        {
            "Codigo": "9",
            "Valor": "20",
            "Descripcion": "Paquete Voz Q 20.00"
        }
    ]


    var groupValidation = 'prepagoValidator';

    var viewModel = {
        viewShowing: function () {
            hideFloatButtons();
        },
        viewShown: function () {
            setupFloatButton(classButtons.Cancel, cancelar, undefined, sizeFloatButtons.small, typeFloatButtons.white);
            setupFloatButton(classButtons.Accept, consultar, undefined, undefined, undefined, undefined, groupValidation);
            $('#txtNumeroTelefono').dxTextBox('option', 'disabled', true);
            $('.containerPaquete').hide();
        },
        //setupComboBoxControl(dataSource, displayMember, valueMember, defaultValue, searchEnabled, typeStateField, width, placeHolder)
        txtNumeroTelefono: setupHibridPhoneControl(currentPayment.numeroCuenta, undefined, ''),
        slTipoBusqueda: setupComboBoxControl(dsTIPOBUSQUEDA, "Valor", "Codigo", dsTIPOBUSQUEDA[0].Codigo, false, undefined, undefined, undefined),

        slMontoRecarga: setupComboBoxControl(dsRECARGAS, "Descripcion", "Codigo", dsRECARGAS[0].Codigo, false, undefined, undefined, undefined),
        slMontoPaquete: setupComboBoxControl(dsPAQUETES, "Descripcion", "Codigo", dsPAQUETES[0].Codigo, false, undefined, undefined, undefined),

        txtNombre: setupTextBoxControl('', 128, 'Nombre', typeLetter.upper, undefined, true, typeCharAllowed.OnlyText),
        txtNit: setupTextBoxDNIControl('', undefined),
        txtCorreo: setupEmailControl('', undefined, undefined, 'Correo Electrónico'),
        groupValidation: groupValidation,
    };

    function consultar(params) {
        var isValid = DevExpress.validationEngine.validateGroup(groupValidation).isValid;
        if (isValid) {
            var tipoBusqueda = $('#slTipoBusqueda').dxSelectBox('option', 'value')
            var monto;
            if (tipoBusqueda === '1') //Recarga
                monto = $('#slMontoRecarga').dxSelectBox('option', 'selectedItem');
            else
                monto = $('#slMontoPaquete').dxSelectBox('option', 'selectedItem');
            currentPayment.infoPago = {
                tipoBusqueda: tipoBusqueda,
                montoMostrar: monto,
                tipoMostrar: $('#slTipoBusqueda').dxSelectBox('option', 'selectedItem'),
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
            view: 'TUENTIPagarServicio',
            id: JSON.stringify(currentPayment)
        });
        MobileBanking_App.app.navigate(uri, { root: true });
    }


    function cancelar(e) {
        MobileBanking_App.app.navigate('PosicionConsolidada', { root: true });
    }

    viewModel.slTipoBusqueda.onValueChanged = function (e) {
        if (e.value === '1') {//Recarga
            $(".containerRecarga").show();
            $('.containerPaquete').hide();
        }
        else {
            $(".containerPaquete").show();
            $(".containerRecarga").hide();
        }
    }

    return viewModel;
};