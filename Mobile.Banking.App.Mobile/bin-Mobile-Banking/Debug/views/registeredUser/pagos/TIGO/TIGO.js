MobileBanking_App.TIGO = function (params) {
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
            "Valor": "25",
            "Descripcion": "Q 25.00"
        },
        {
            "Codigo": "4",
            "Valor": "50",
            "Descripcion": "Q 50.00"
        },
        {
            "Codigo": "5",
            "Valor": "100",
            "Descripcion": "Q 100.00"
        }]

    var groupValidation = 'prepagoValidator';
    var groupValidation2 = 'posPagoValidator';

    var viewModel = {
        viewShowing: function () {
            hideFloatButtons();
        },
        viewShown: function () {
            setupFloatButton(classButtons.Cancel, cancelar, undefined, sizeFloatButtons.small, typeFloatButtons.white);
            setupFloatButton(classButtons.Accept, consultar, undefined, undefined, undefined, undefined, groupValidation);

            var deviceVersion = parseInt(DeviceInfo.DeviceVersion.replace(".", "").substring(0, 2));
            if (deviceType === 'Android') {
                if (deviceVersion < 44 && deviceVersion != 9 && deviceVersion != 10 && deviceVersion != 11) {
                    $('#txtNumeroTelefono').bind('keyup', HandleCharacteresIdentificacion);

                }
                else {
                    $('#txtNumeroTelefono').bind('input', HandleCharacteresTelefono);
                }
            }
            else {
                $('#txtNumeroTelefono').bind('keyup', HandleCharacteresTelefono);
            }




        },
        //setupComboBoxControl(dataSource, displayMember, valueMember, defaultValue, searchEnabled, typeStateField, width, placeHolder)
        slTipoServicio: setupComboBoxControl(dsTIPOBUSQUEDA, "Valor", "Codigo", '1', false, undefined, undefined, undefined),
        txtNumeroTelefono: setupHibridPhoneControl('', undefined, ''),
        slMontoRecarga: setupComboBoxControl(dsRECARGAS, "Valor", "Codigo", '2', false, undefined, undefined, undefined),
        txtNombre: setupTextBoxControl('', 128, 'Nombre', typeLetter.upper, undefined, true, typeCharAllowed.OnlyText),
        txtNit: setupTextBoxControl('', 10, 'Nit', undefined),
        txtCorreo: setupEmailControl('', undefined, undefined, 'Correo Electrónico'),
        groupValidation: groupValidation,
        groupValidation2: groupValidation2
    };

    function HandleCharacteresTelefono(e) {
        var value = e.target.value;
        if (value.length > ConstantsBehaivor.LENGTH_PHONE) {
            let newVal = value.substring(0, value.length - 1);
            $('#txtNumeroTelefono').dxTextBox('option', 'value', newVal);
            $('#txtNumeroTelefono').dxTextBox('option', 'text', newVal);
        }
        else {
            $('#txtNumeroTelefono').dxTextBox('option', 'value', value);
            $('#txtNumeroTelefono').dxTextBox('option', 'text', value);
        }
    }

    function consultar(params) {
        var tipoBusqueda = $('#slTipoServicio').dxSelectBox('option', 'value');
        var tipoServicio = tipoServicioBasicoStr.TIGO_POSTPAGO;
        var isValid = DevExpress.validationEngine.validateGroup(groupValidation).isValid;
        var isvalidNum = true;

        if (tipoBusqueda === '1') { //Prepago
            isValid = DevExpress.validationEngine.validateGroup(groupValidation2).isValid;
            isvalidNum = DevExpress.validationEngine.validateGroup(groupValidation).isValid;
            tipoServicio = tipoServicioBasicoStr.TIGO_PREPAGO;
        }
        if (isValid == true && isvalidNum == true) {
            var monto = $('#slMontoRecarga').dxSelectBox('option', 'selectedItem');
            var currentPayment = {
                numeroCuenta: $('#txtNumeroTelefono').dxTextBox('option', 'value'),
                tipoComercio: tipoServicio,
                infoPago: {
                    tipoBusqueda: tipoBusqueda,
                    montoMostrar: monto,
                    tipoMostrar: $('#slTipoServicio').dxSelectBox('option', 'selectedItem'),
                    monto: (tipoBusqueda==='1') ? monto.Valor : monto.Monto,
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
            view: 'TIGOPagarServicio',
            id: JSON.stringify(currentPayment)
        });
        MobileBanking_App.app.navigate(uri, { root: true });
    }

    function cancelar(e) {
        MobileBanking_App.app.navigate('TipoServicio', { root: true });
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