MobileBanking_App.PagoServicioExitoso = function (params) {
    "use strict";

    var consultaEmpresaDTO;

    if (params.id) {
        consultaEmpresaDTO = JSON.parse(params.id);
    }
    else {///ELIMINAR
        consultaEmpresaDTO = JSON.parse('{"IdCategoria":"002","IdEmpresa":"004","Categoria":"AGUA POTABLE","Empresa":"EMAP","esPagoFrecuente":false,"campos":{},"RespuestaConsulta":{"Respuesta":{"Servicio":{"Codigo_Servicio":"RE"},"Items":[{"NumeroId_Cliente":"FAC-45719143","Moneda":"USD","Valor":"435.49","Saldo":"435.49","Periodo":"2017-06-14","Fecha_Vencimiento_Proceso":"15/07/2017","DatosAdicionales":{"CodigoFactura":"FAC-45719143"},"Direccion":"","Telefono":"","ValorTotal":"1724.87","CantidadDocumentos":"4","NombreContrapartida":"GUADALUPEZ MENDEZ VASQUEZ","Id_Item":"0"},{"NumeroId_Cliente":"FAC-53711510","Moneda":"USD","Valor":"471.44","Saldo":"471.44","Periodo":"2018-06-15","Fecha_Vencimiento_Proceso":"16/07/2018","DatosAdicionales":{"CodigoFactura":"FAC-53711510"},"Direccion":"","Telefono":"","ValorTotal":"1724.87","CantidadDocumentos":"4","NombreContrapartida":"GUADALUPEZ MENDEZ VASQUEZ","Id_Item":"0"},{"NumeroId_Cliente":"FAC-54297520","Moneda":"USD","Valor":"317.98","Saldo":"317.98","Periodo":"2018-07-13","Fecha_Vencimiento_Proceso":"15/08/2018","DatosAdicionales":{"CodigoFactura":"FAC-54297520"},"Direccion":"","Telefono":"","ValorTotal":"1724.87","CantidadDocumentos":"4","NombreContrapartida":"GUADALUPEZ MENDEZ VASQUEZ","Id_Item":"0"},{"NumeroId_Cliente":"FAC-55002806","Moneda":"USD","Valor":"499.96","Saldo":"499.96","Periodo":"2018-08-15","Fecha_Vencimiento_Proceso":"14/09/2018","DatosAdicionales":{"CodigoFactura":"FAC-55002806"},"Direccion":"","Telefono":"","ValorTotal":"1724.87","CantidadDocumentos":"4","NombreContrapartida":"GUADALUPEZ MENDEZ VASQUEZ","Id_Item":"0"}],"ReglasValidacion":[{"Opcion_Menu":"","Id_Contrato":9052,"Id_Empresa":9292,"Id_Servicio":5030,"Nombre_Empresa":"Empresa Pública Metropolitana de Agua Potable y Saneamiento de Quito","Nombre_Corto_Empresa":"EPMAPS","Razon_Social":"Empresa Pública Metropolitana de Agua Potable y Saneamiento de Quito","Descripcion_Servicio":"RECAUDACION EPMAPS","Etiqueta":"DUI","Categoria":"AGUA","Longitud_Campo":15,"Con_Informacion":true,"Excepcion_Forma_Pago":"","Utiliza_Favoritos":true,"Origen_ValoresPagar":"USER","Observacion":"","Nota_Comprobante":"","Ingreso_Contrapartida":true,"Path_Imagen":"","Tipos_Credito":"","Expresion_Validacion":"","Funcion_Validacion":"","Maneja_Rubros":true,"Mascara":"","Muestra_Vencimiento":true,"Muestra_Periodo":true,"Muestra_PagoMinimo":true,"UrlComprobante":"","Mensaje_ValorPagar":"","Minimo_ValorPagar":"0.00","Maximo_ValorPagar":"99999900.00","Etiqueta_NoControl":"","ConfirmaPredio":false,"PagarValorMinimoDefault":false,"Numero_Copias":1,"OrdenDeCobro":false,"ValidarValorEnviado":false,"Permite_Pagos_Parciales":false,"ValorMinimo_Cobros":"0.00","Tipo_ValorMinimo":"VAL","Canal":"BVI","Recibe_Varios_Items":false,"NombreComercial":"CONTRATO RECAUDACION EPMAPS","PorcentajeMaximoCobros":"0.00","Tipo_Documento_Impresion":"C","Muestra_RefAdicional":false,"CampoOrden":null,"TributoSectorPublico":0,"Reglas_Adicionales":"","codigo_establecimiento":null,"Fuente_Informacion":"EPMAPS","Fuente_Registrador":"EPMAPS","Forma_Cobro_Mixta":true,"Tipo_Manejo_Tc":null,"Estado":"A","NombreCanal":"BVI","FormasPago":[{"ID_Contrato":9052,"TipoPago":"CTA","Descripcion":"DÉBITO/CRÉDITO A CUENTA ","Monto_Maximo":"99999999.00","Canal":"BVI"}]}],"Comision":{"COMISION":0,"IVA":0},"NotasCredito":[],"Datos":{"Aprobado":false},"DatosSuscripcion":{"Estado":"SIN SUSCRIPCION"}},"CodigoRetorno":"OK","MensajeRetorno":"PROCESO OK","IdMensaje":"692271cc-a598-11e8-9429-005056ba0abe","NumeroTransaccion":"150177"},"FieldDictionary":[{"type":"Parrafo","id":"1","value":"Para poder pagar tu servicio necesitamos la siguiente información, por favor asegurate de tener a mano: tu cédula de identidad y/o contrato de servicio. Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno","esContrapartida":false,"campoAsociado":""},{"type":"SelectBox","id":"3","value":{"id":"001","descripcion":"item001"},"esContrapartida":false,"campoAsociado":"servicio"},{"type":"SelectBox","id":"4","value":{"id":"002","descripcion":"item002"},"esContrapartida":false,"campoAsociado":"tipo"},{"type":"TextBox","id":"5","value":"1711807527","esContrapartida":true,"campoAsociado":"contrapartida"},{"type":"TextBox","id":"6","value":"2269194","esContrapartida":false,"campoAsociado":"numerico"}],"InformacionPago":{"cuentaTarjetaDebitar":"1234567890123456","cvvTrj":"912","fchCaducidadTrj":"07/2020","descripcion":"pago Agua Potable","nombreTitular":"GUADALUPEZ MENDEZ VASQUEZ","totalAPagar":1724.87,"formaPago":{"Codigo":"1234567890123456","Descripcion":"123456XXXXXXX456","Tipo":"TRJ","Disponible":"2,256.32"}}}');
    }
    var comisionMostrar = "";
    var formaPagoMostrar = (consultaEmpresaDTO.InformacionPago.formaPago.Tipo == 'CTA') ? 'Débito a Cuenta' : 'Tarjeta de Crédito'
    var totalPagarMostrar = CalculoTotal(consultaEmpresaDTO.InformacionPago.formaPago.Tipo,
        consultaEmpresaDTO.InformacionPago.totalAPagar
        );


    function CalculoTotal(formaPago, total) {
        if (formaPago === 'TRJ') {
            comisionMostrar = Number(consultaEmpresaDTO.CardFee).toFixed(2)
            return total + +consultaEmpresaDTO.CardFee;
        } else {
            comisionMostrar = Number(consultaEmpresaDTO.AccountFee).toFixed(2)
            return +total + +consultaEmpresaDTO.AccountFee;
        }
    }

    var contratoMostrar = ObtenerContrato(consultaEmpresaDTO);

    function ObtenerContrato(consultaEmpresaDTO) {
        var dictionaryQueriable = jslinq(consultaEmpresaDTO.DtoEnvio.inputs);
        var itemContrapartida = dictionaryQueriable.where(function (el) {
            return el.esContrapartida == true;
        }).toList()[0];
        if (itemContrapartida.type == "TextBox" || consultaEmpresaDTO.esPagoFrecuente == true) {
            return itemContrapartida.value;
        } else {
            return itemContrapartida.value.descripcion;
        }
    }

    var secuencialMostrar = obtenerSecuencial(consultaEmpresaDTO);

    function obtenerSecuencial(consultaEmpresaDTO) {
        return consultaEmpresaDTO.ResultPago.SecuencialBanco;
    };
    var signoMoneda = '$ ';
    var viewModel = {
        title: ko.observable(titleServicio),
        koTitle: ko.observable("Resultado de la transacción"),

        koContrato: ko.observable(contratoMostrar),
        koTitular: ko.observable(consultaEmpresaDTO.InformacionPago.nombreTitular),
        koValor: ko.observable(signoMoneda + String(Number(consultaEmpresaDTO.InformacionPago.totalAPagar).toFixed(2))),
        koComision: ko.observable(signoMoneda + " " + comisionMostrar),
        koTotal: ko.observable(signoMoneda + String(Number(totalPagarMostrar).toFixed(2))),
        koFormaPago: ko.observable(formaPagoMostrar),
        koCuentaTarjeta: ko.observable(consultaEmpresaDTO.InformacionPago.formaPago.Descripcion),
        koTransaccionSecuencial: ko.observable(secuencialMostrar),

        viewShown: function () {
            hideFloatButtons();
            SesionMovil.FechaActividadApp = new Date();
            setCampoContrapartidaLabel();
            setupFloatButton(classButtons.Accept, Accept, undefined, undefined, undefined, undefined, undefined)
        }
    };

    function setCampoContrapartidaLabel() {
        var campos = JSON.parse(consultaEmpresaDTO.campos);
        var campoContrapartida = jslinq(campos).firstOrDefault(function (el) { return el.Campo_Asociado == 'contrapartida' });
        if (campoContrapartida) {
            var valorTexto = campoContrapartida.Nombre_Campo;
            $('#idIdentificadorContrapartida').text(valorTexto + " ");
        }
    }

    function Accept() {
        MobileBanking_App.app.navigate('PosicionConsolidada', { root: true });
    }

    function cancelar() {
        MobileBanking_App.app.navigate('PosicionConsolidada', { root: true });
    }

    return viewModel;
};