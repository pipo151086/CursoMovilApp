MobileBanking_App.DetalleCredito = function (params) {
    "use strict";
    var datosCredito = null;

    if (params.id)
        datosCredito = JSON.parse(params.id);

    var CreditosFiltrados = [];

    if (datosCredito.fromMenu === true) {
        filtrarCreditos(datosCredito.productoId);
        datosCredito = CreditosFiltrados[0];
    }
    else {
        filtrarCreditos(datosCredito.CodigoProducto);
    }
   

    function filtrarCreditos(codigo) {
        var creditosQueryAble = jslinq(SesionMovil.PosicionConsolidada.CreditosCliente)
        CreditosFiltrados = creditosQueryAble.where(function (el) { return el.CodigoProducto === codigo }).toList();
    }

    var viewModel = {
        btnDocDigital: {
            icon: 'fa fa-envelope-o',
            text: 'Enviar por mail',
            onClick: ClickEnviarDocumentosPorCorreo
        },
        btnTablaAmortizacion: {
            icon: 'fa fa-envelope-o',
            text: 'Enviar por mail',
            onClick: ClickEnviarTAmortizacionPorCorreo
        },
        viewShown: function () {
$('#spnTipoCredito').text(datosCredito.ProductoDescripcion);
            SesionMovil.FechaActividadApp = new Date();
            $('#lkpCreditos').dxLookup('option', 'value', datosCredito ? datosCredito.NumeroCredito : SesionMovil.PosicionConsolidada.CreditosCliente[0].NumeroCredito);
            $('#lkpCreditos').dxLookup('option', 'fieldTemplate', function (itemData, itemIndex, itemElement) {
                var content = "<div style='color: #d52133; font-style: italic'>";
                content = content + "<span>" + itemData.NumeroCredito + "</span>";
                content = content + "</div>";
                return content;
            });
            setupFloatButton(classButtons.Accept, Volver);
        },
        viewShowing: function () {
            hideFloatButtons();
            SesionMovil.FechaActividadApp = new Date();
        },
        viewHidden: function () {
            hideFloatButtons();
        },

        numeroCredito: ko.observable(),
        estadoCredito: ko.observable(),
        numeroCuota: ko.observable(),

        fchProximoPago: ko.observable(),
        diasMora: ko.observable(),
        valorProximoPago: ko.observable(),
        totalPrecancelar: ko.observable(),
        documetosDigitales: ko.observable(),
        tablaAmortizacion: ko.observable(),


        koClickDocDigital: ClickEnviarDocumentosPorCorreo,
        koClickTAmortizacion: ClickEnviarTAmortizacionPorCorreo,

        lkpCreditos: setupLookupControl(undefined, CreditosFiltrados, 'NumeroCredito', 'NumeroCredito', false, 'instantly', undefined, function (itemData, itemIndex, itemElement) {
            var content = "<div style='margin-left:20px; font-size:18px; color: #d52133'>";
            content = content + "<img style='display:inline-block; margin-right:10px; width:24px; height:24px' src='images/CRE.png' />";
            content = content + "<span style='display:inline-block'>" + itemData.NumeroCredito.inputChar('-', itemData.NumeroCredito.length - 1) + "</span>";
            content = content + "</div>";
            return content;
        }, 'Créditos'),
    };

    function Volver() {
        try {
            MobileBanking_App.app.navigate('PosicionConsolidada', { root: true });
        } catch (e) {
            showException(e.message, e.stack);
        }
    }

    function ClickEnviarTAmortizacionPorCorreo() {
        EnviarTablaAmortizacionPorCorreo(datosCredito.NumeroCredito, function (result) {
            if (result === true) {
                showSimpleMessage('Banca Móvil', 'Se ha enviado a tu correo electrónico registrado la tabla de amortización de tu crédito.', function () { }, undefined);
            }
        });
    }


    function ClickEnviarDocumentosPorCorreo() {
        EnviarDocumentosCreditoPorCorreo(datosCredito.NumeroCredito, function (result) {
            if (result === true) {
                showSimpleMessage('Banca Móvil', 'Se ha enviado a tu correo electrónico registrado los documentos de tu crédito.', function () { }, undefined);
            }
        });
    }

    function SetValores() {
        var _TMPnumeroCredito = datosCredito ? datosCredito.NumeroCredito : '';
        var _TMPfchProximoPago = datosCredito ? Date.parse(datosCredito.FechaProximoVencimiento).toString('dd/MM/yyyy') : '';
        var _TMPtotalPrecancelar = datosCredito ? datosCredito.SaldoCapitalCredito : '';
        var _TMPvalorProximoPago = datosCredito ? datosCredito.ValorTotalAPagar : '';
        var cuotasQueryAble = jslinq(datosCredito.CuotasCredito)
        var cuotasOrdenadas = cuotasQueryAble.orderByDescending(function (el) {
            return Date.parse(el.FechaVencimiento);
        }).toList();
        var ultimaCuota = cuotasOrdenadas[0];
        var _TMPnumeroCuota = ultimaCuota ? ultimaCuota.Cuota : '';
        var _TMPestadoCredito = datosCredito ? datosCredito.EstadoCredito : '';;
        var _TMPdiasMora = datosCredito ? datosCredito.DiasMora : '';
        var _TMPdocumetosDigitales = 'Enviar por mail';
        var _TMPtablaAmortizacion = 'Enviar por mail';
        $('#spnNumeroCredito').text(''+_TMPnumeroCredito+'');
        $('#spnEstado').text(_TMPestadoCredito);
        $('#spnNumeroCuota').text(_TMPnumeroCuota);
        $('#spnFchProximoPago').text(_TMPfchProximoPago);
        $('#spnDiasMora').text(_TMPdiasMora);
        $('#spnValorProximoPago').text( Number(_TMPvalorProximoPago).formatMoney(2, '.', ','));
        $('#spnTotalPrecancelar').text( Number(_TMPtotalPrecancelar).formatMoney(2, '.', ','));
        $('#spnDocumetosDigitales').text(_TMPdocumetosDigitales);
        $('#spnTablaAmortizacion').text(_TMPtablaAmortizacion);
    }


    viewModel.lkpCreditos.onSelectionChanged = function (e) {
        datosCredito = e.selectedItem;
        SetValores();
    }

    return viewModel;
};