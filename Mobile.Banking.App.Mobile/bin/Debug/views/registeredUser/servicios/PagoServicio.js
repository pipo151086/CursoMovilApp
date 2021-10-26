MobileBanking_App.PagoServicio = function (params) {
    "use strict";

    var consultaEmpresaDTO;
    if (params.id) {
        consultaEmpresaDTO = JSON.parse(params.id);
    }
    else {
        consultaEmpresaDTO = JSON.parse('{"IdCategoria":"002","IdEmpresa":"003","Categoria":"AGUA POTABLE","Empresa":"Intergaua","esPagoFrecuente":false,"campos":"[{\"Nombre_Campo\":\"\",\"Tipo_Campo\":\"PARRAFO\",\"Longitud_Campo\":0,\"Tipo_Aplicacion\":\"T\",\"Orden\":1,\"Campo_Asociado\":\"\",\"Id_Contrato\":0,\"Campo_Habilitado\":true,\"Obligatorio\":false,\"Formato_Campo\":\"\",\"Control_Campo\":\"PARRAFO\",\"Combo_Descripcion\":\"\",\"Visible\":true,\"Valor_Default\":\"Para poder pagar tu servicio necesitamos la siguiente información, por favor asegurate de tener a mano: tu cédula de identidad y/o contrato de servicio. Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno\",\"EventoChange\":\"\",\"PlaceHolder\":\"\",\"Evento\":\"Seleccionar()|Administrar(\"App/Banca_Movil/40\")\",\"Propiedades_Adicionales\":\"\"},{\"Nombre_Campo\":\"\",\"Tipo_Campo\":\"LNK\",\"Longitud_Campo\":0,\"Tipo_Aplicacion\":\"T\",\"Orden\":2,\"Campo_Asociado\":\"linkSeleccionarSuministros|linkAdmFavoritos\",\"Id_Contrato\":0,\"Campo_Habilitado\":true,\"Obligatorio\":false,\"Formato_Campo\":\"\",\"Control_Campo\":\"LINK|LINK\",\"Combo_Descripcion\":\"\",\"Visible\":true,\"Valor_Default\":\"lnkSeleccionar|lnkAdministrar\",\"EventoChange\":\"\",\"PlaceHolder\":\"\",\"Evento\":\"Seleccionar()|Administrar(\"App/Banca_Movil/40\")\",\"Propiedades_Adicionales\":\"\"},{\"Nombre_Campo\":\"Contrato:\",\"Tipo_Campo\":\"T\",\"Longitud_Campo\":20,\"Tipo_Aplicacion\":\"T\",\"Orden\":5,\"Campo_Asociado\":\"contrapartida\",\"Id_Contrato\":9152,\"Campo_Habilitado\":true,\"Obligatorio\":true,\"Formato_Campo\":\"\",\"Control_Campo\":\"TEXTBOX\",\"Combo_Descripcion\":\"\",\"Visible\":true,\"Valor_Default\":\"\",\"EventoChange\":\"\",\"PlaceHolder\":\"Ingrese el valor\",\"Evento\":\"\",\"Propiedades_Adicionales\":\"\"},{\"Nombre_Campo\":\"Numérico:\",\"Tipo_Campo\":\"T\",\"Longitud_Campo\":20,\"Tipo_Aplicacion\":\"T\",\"Orden\":6,\"Campo_Asociado\":\"numerico\",\"Id_Contrato\":9152,\"Campo_Habilitado\":true,\"Obligatorio\":false,\"Formato_Campo\":{},\"Control_Campo\":\"TEXTBOX\",\"Combo_Descripcion\":\"\",\"Visible\":true,\"Valor_Default\":\"\",\"EventoChange\":\"\",\"PlaceHolder\":\"Ingrese el valor\",\"Evento\":\"\",\"Propiedades_Adicionales\":\"\"},{\"Nombre_Campo\":\"Servicio:\",\"Tipo_Campo\":\"T\",\"Longitud_Campo\":20,\"Tipo_Aplicacion\":\"T\",\"Orden\":3,\"Campo_Asociado\":\"servicio\",\"Id_Contrato\":9152,\"Campo_Habilitado\":true,\"Obligatorio\":false,\"Formato_Campo\":\"\",\"Control_Campo\":\"COMBO\",\"Combo_Descripcion\":[{\"id\":\"001\",\"descripcion\":\"item001\"},{\"id\":\"002\",\"descripcion\":\"item002\"},{\"id\":\"003\",\"descripcion\":\"item003\"},{\"id\":\"004\",\"descripcion\":\"item004\"},{\"id\":\"005\",\"descripcion\":\"item005\"}],\"Visible\":true,\"Valor_Default\":\"\",\"EventoChange\":\"\",\"PlaceHolder\":\"Ingrese el valor\",\"Evento\":\"\",\"Propiedades_Adicionales\":\"\"},{\"Nombre_Campo\":\"Tipo:\",\"Tipo_Campo\":\"T\",\"Longitud_Campo\":20,\"Tipo_Aplicacion\":\"T\",\"Orden\":4,\"Campo_Asociado\":\"tipo\",\"Id_Contrato\":9152,\"Campo_Habilitado\":true,\"Obligatorio\":true,\"Formato_Campo\":\"\",\"Control_Campo\":\"COMBO\",\"Combo_Descripcion\":[{\"id\":\"001\",\"descripcion\":\"item001\"},{\"id\":\"002\",\"descripcion\":\"item002\"},{\"id\":\"003\",\"descripcion\":\"item003\"},{\"id\":\"004\",\"descripcion\":\"item004\"},{\"id\":\"005\",\"descripcion\":\"item005\"}],\"Visible\":true,\"Valor_Default\":\"\",\"EventoChange\":\"\",\"PlaceHolder\":\"Ingrese el valor\",\"Evento\":\"\",\"Propiedades_Adicionales\":\"\"}]","Contrato":"123456","Descripcion":"","DtoEnvio":{"Cont":"123456","Cat":"AGUA POTABLE","CatID":"002","Emp":"Intergaua","EmpID":"003","DesPago":"","inputs":[{"type":"Parrafo","id":"1","value":"Para poder pagar tu servicio necesitamos la siguiente información, por favor asegurate de tener a mano: tu cédula de identidad y/o contrato de servicio. Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno","esContrapartida":false,"campoAsociado":""},{"type":"SelectBox","id":"3","value":{"id":"001","descripcion":"item001"},"esContrapartida":false,"campoAsociado":"servicio"},{"type":"SelectBox","id":"4","value":{"id":"005","descripcion":"item005"},"esContrapartida":false,"campoAsociado":"tipo"},{"type":"TextBox","id":"5","value":"1234","esContrapartida":true,"campoAsociado":"contrapartida"},{"type":"TextBox","id":"6","value":"7890","esContrapartida":false,"campoAsociado":"numerico"}]},"RespuestaConsulta":{"Respuesta":{"Servicio":{"Codigo_Servicio":"RE"},"Items":[{"NumeroId_Cliente":"FAC-45719143","Moneda":"USD","Valor":"435.49","Saldo":"435.49","Periodo":"2017-06-14","Fecha_Vencimiento_Proceso":"15/07/2017","DatosAdicionales":{"CodigoFactura":"FAC-45719143"},"Direccion":"","Telefono":"","ValorTotal":"1724.87","CantidadDocumentos":"4","NombreContrapartida":"GUADALUPEZ MENDEZ VASQUEZ","Id_Item":"0"},{"NumeroId_Cliente":"FAC-53711510","Moneda":"USD","Valor":"471.44","Saldo":"471.44","Periodo":"2018-06-15","Fecha_Vencimiento_Proceso":"16/07/2018","DatosAdicionales":{"CodigoFactura":"FAC-53711510"},"Direccion":"","Telefono":"","ValorTotal":"1724.87","CantidadDocumentos":"4","NombreContrapartida":"GUADALUPEZ MENDEZ VASQUEZ","Id_Item":"0"},{"NumeroId_Cliente":"FAC-54297520","Moneda":"USD","Valor":"317.98","Saldo":"317.98","Periodo":"2018-07-13","Fecha_Vencimiento_Proceso":"15/08/2018","DatosAdicionales":{"CodigoFactura":"FAC-54297520"},"Direccion":"","Telefono":"","ValorTotal":"1724.87","CantidadDocumentos":"4","NombreContrapartida":"GUADALUPEZ MENDEZ VASQUEZ","Id_Item":"0"},{"NumeroId_Cliente":"FAC-55002806","Moneda":"USD","Valor":"499.96","Saldo":"499.96","Periodo":"2018-08-15","Fecha_Vencimiento_Proceso":"14/09/2018","DatosAdicionales":{"CodigoFactura":"FAC-55002806"},"Direccion":"","Telefono":"","ValorTotal":"1724.87","CantidadDocumentos":"4","NombreContrapartida":"GUADALUPEZ MENDEZ VASQUEZ","Id_Item":"0"}],"ReglasValidacion":[{"Opcion_Menu":"","Id_Contrato":9052,"Id_Empresa":9292,"Id_Servicio":5030,"Nombre_Empresa":"Empresa Pública Metropolitana de Agua Potable y Saneamiento de Quito","Nombre_Corto_Empresa":"EPMAPS","Razon_Social":"Empresa Pública Metropolitana de Agua Potable y Saneamiento de Quito","Descripcion_Servicio":"RECAUDACION EPMAPS","Etiqueta":"DUI","Categoria":"AGUA","Longitud_Campo":15,"Con_Informacion":true,"Excepcion_Forma_Pago":"","Utiliza_Favoritos":true,"Origen_ValoresPagar":"USER","Observacion":"","Nota_Comprobante":"","Ingreso_Contrapartida":true,"Path_Imagen":"","Tipos_Credito":"","Expresion_Validacion":"","Funcion_Validacion":"","Maneja_Rubros":true,"Mascara":"","Muestra_Vencimiento":true,"Muestra_Periodo":true,"Muestra_PagoMinimo":true,"UrlComprobante":"","Mensaje_ValorPagar":"","Minimo_ValorPagar":"0.00","Maximo_ValorPagar":"99999900.00","Etiqueta_NoControl":"","ConfirmaPredio":false,"PagarValorMinimoDefault":false,"Numero_Copias":1,"OrdenDeCobro":false,"ValidarValorEnviado":false,"Permite_Pagos_Parciales":false,"ValorMinimo_Cobros":"0.00","Tipo_ValorMinimo":"VAL","Canal":"BVI","Recibe_Varios_Items":false,"NombreComercial":"CONTRATO RECAUDACION EPMAPS","PorcentajeMaximoCobros":"0.00","Tipo_Documento_Impresion":"C","Muestra_RefAdicional":false,"CampoOrden":null,"TributoSectorPublico":0,"Reglas_Adicionales":"","codigo_establecimiento":null,"Fuente_Informacion":"EPMAPS","Fuente_Registrador":"EPMAPS","Forma_Cobro_Mixta":true,"Tipo_Manejo_Tc":null,"Estado":"A","NombreCanal":"BVI","FormasPago":[{"ID_Contrato":9052,"TipoPago":"CTA","Descripcion":"DÉBITO/CRÉDITO A CUENTA ","Monto_Maximo":"99999999.00","Canal":"BVI"}]}],"Comision":{"COMISION":0,"IVA":0},"NotasCredito":[],"Datos":{"Aprobado":false},"DatosSuscripcion":{"Estado":"SIN SUSCRIPCION"}},"CodigoRetorno":"OK","MensajeRetorno":"PROCESO OK","IdMensaje":"692271cc-a598-11e8-9429-005056ba0abe","NumeroTransaccion":"150177"}}');
    }

    var pagoServicioViewModel = {
        koNombreTitular: ko.observable(),
        koTotalAPagar: ko.observable(),
        koCuentaOTarjeta: ko.observable(),
        koDeudasConsultadas: ko.observableArray()
    }
    var signoMoneda = "$ ";
    var rubros = setupMontos();
    pagoServicioViewModel.koDeudasConsultadas(rubros);

    var formaPagoDataSourse = [
        { descripcion: "Cta. Ahorro/Corriente", codigo: "CTA" },
        { descripcion: "Tarjeta de Crédito", codigo: "TRJ" },
    ]

    var PaymentMethods = [];
    cargarPaymentMethods();
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

    var Anios = [];
    var MMSelected = undefined;
    var AASelected = undefined;

    var titleCompuesto = (consultaEmpresaDTO.Empresa === undefined) ? consultaEmpresaDTO.Categoria : consultaEmpresaDTO.Empresa;
    var groupValidation = 'groupValidation';

    var viewModel = {
        title: ko.observable(titleServicio),
        groupValidation: groupValidation,
        koTitle: ko.observable("Revisa los datos y selecciona tu forma de pago"),
        koMetodoPago: {
            dataSource: PaymentMethods,
            displayExpr: 'Descripcion',
            title: 'Método de pago',
            showDoneButton: true,
            showCancelButton: true,
            showClearButton: false,
            placeholder: 'Seleccione',
            clearButtonText: 'Limpiar',
            cancelButtonText: 'Cancelar',
            searchPlaceholder: 'Buscar',
            searchEnabled: false,
            onSelectionChanged: function (e) {
                if (e != null && e != undefined) {
                    var disponible = Number(String(e.selectedItem.Disponible).replace(',', ''));
                    var totalPagar = Number(pagoServicioViewModel.koTotalAPagar());
                    if (disponible < totalPagar) {
                        showSimpleMessage('Banca Móvil', 'El monto es insuficiente para continuar.', function () {
                            e.selectedItem = undefined;
                        }, undefined);
                    }
                    else {
                        MMSelected = undefined;
                        AASelected = undefined;
                        if ($('#MetodoPago').dxLookup('option', 'selectedItem').Tipo != 'TRJ') {
                            $('#containerCaducidad').hide();
                            $('#containerCodigoSeg').hide();
                            $('#PagoTarjeta').hide();
                        } else {
                            $('#PagoTarjeta').show();
                            $('#containerCaducidad').show();
                            $('#containerCodigoSeg').show();
                        }
                    }
                }
            },
            itemTemplate: function (itemData, itemIndex, itemElement) {
                var content = "<div style='margin-left:10px;margin-top:15px;display: initial; font-size:18px; color: #d52133; font-weight:bold'>";
                content = content + "<img style='display:inline-block; margin-right:10px; width:30px' src='images/" + itemData.Tipo + ".png' />";
                content = content + "<span style='display:inline-block'>" + itemData.Descripcion + "</span><br/>";
                content = content + "<span style=' font-style: normal;font-size: smaller;margin-left: 50px;display:inline-block'> Disponible:  " + itemData.Disponible + "</span>";
                content = content + "</div>";
                content = content + "<br />";
                return content;
            },
            value: pagoServicioViewModel.koCuentaOTarjeta,
            onOpened: function () {
                $('#floatButtons').hide();
            },
            onClosed: function () {
                $('#floatButtons').show();
            }
        },

        //////////////////////////////////////////////////////////////TARJETA//////////////////////////////////////////////////////////////
        koCodigoSeg: setupTextBoxControl(undefined, 3, 'CVV', undefined, undefined, false, typeCharAllowed.OnlyNumber, undefined),
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

        koTxtDescripcion: {
            //value:pagoServicioViewModel.koNombreTitular,
            placeholder: 'Ej: Pago Luz Mamá',
            maxLength: 128
        },
        koGridRubros: {
            dataSource: pagoServicioViewModel.koDeudasConsultadas(),
            paging: {
                pageSize: 10
            },
            pager: {
                showPageSizeSelector: false,
                showInfo: false
            },

            columns: [
                { alignment: 'left', dataField: "Periodo", caption: "Periodo", allowSorting: false },
                { alignment: 'right', dataField: "ValorStr", caption: "Valor", allowSorting: false, width: 75 }
            ],
        },
        viewShown: function () {
            hideFloatButtons();
            SesionMovil.FechaActividadApp = new Date();
            setTitularCuenta();
            $('#rdbAA').dxRadioGroup('option', 'dataSource', getAniosForward(5));
            $('#idGridRubros').dxDataGrid('instance').selectAll();
            setupFloatButton(classButtons.Cancel, cancelar, undefined, sizeFloatButtons.small, typeFloatButtons.white);
            setupFloatButton(classButtons.Accept, pagar, undefined, undefined, undefined, undefined, undefined)
        },

    };

    //----------------------------------------------------------------------
    //----------------------------------------------------------------------
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
    viewModel.koCodigoSeg.onInput = function (e) {
        var value = $('#txtCodigoSeg').dxTextBox('option', 'text');
        var result = /^[0-9]+$/.test(value);
        if (result === false) {
            value = value.substring(0, value.length - 1);
            $('#txtCodigoSeg').dxTextBox('option', 'text', value);
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


    viewModel.koGridRubros.onSelectionChanged = function (e) {
        var selectedItems = $('#idGridRubros').dxDataGrid('instance').getSelectedRowsData();
        var sumatoria = 0;
        $.each(selectedItems, function (index, value) {
            sumatoria += +value.ValorNum;
        });
        pagoServicioViewModel.koTotalAPagar(Number(sumatoria).toFixed(2));
        $('#spnTotalAPagar').text(signoMoneda + String(pagoServicioViewModel.koTotalAPagar()));
    }

    function setTitularCuenta() {
        var ultimaDeuda = consultaEmpresaDTO.RespuestaConsulta.Items[consultaEmpresaDTO.RespuestaConsulta.Items.length - 1]
        $('#idTitular').text("Titular: " + ultimaDeuda.NombreContrapartida);
        pagoServicioViewModel.koNombreTitular(ultimaDeuda.NombreContrapartida);
        var campos = JSON.parse(consultaEmpresaDTO.campos);
        var campoContrapartida = jslinq(campos).firstOrDefault(function (el) { return el.Campo_Asociado == 'contrapartida' });
        if (campoContrapartida) {
            var valorTexto = campoContrapartida.Nombre_Campo;
            $('#idIdentificadorContrapartida').text(valorTexto + " ");
        }
        var identificador = jslinq(consultaEmpresaDTO.DtoEnvio.inputs).firstOrDefault(function (el) { return el.esContrapartida = true }).value
        $('#idIndentificador').text(identificador);

        document.getElementById("containerTitular").style.textAlign = "center";
        document.getElementById("containerIdentificador").style.textAlign = "center";
       
        
    }

    function setupMontos() {
        var deudasQueriable = jslinq(consultaEmpresaDTO.RespuestaConsulta.Items);
        var deudasPendientes = deudasQueriable.orderBy(function (el) {
            return el.FechaVencimientoProceso;
        }).toList();
        var rubrosGrid = [];
        $.each(deudasPendientes, function (index, deuda) {
            deuda.ValorNum = Number(deuda.Saldo).toFixed(2);
            deuda.ValorStr = signoMoneda + String(Number(deuda.Saldo).toFixed(2));
            rubrosGrid.push(deuda);
        });

        var ultimaDeuda = deudasPendientes[deudasPendientes.length - 1]
        return rubrosGrid;
    }

    function pagar() {
        try {
            var validarMetodoPago = DevExpress.validationEngine.validateGroup(groupValidation);
            var metodoPagoSeleccionado = $('#MetodoPago').dxLookup('option', 'selectedItem');
            if (metodoPagoSeleccionado != null) {
                var disponible = +metodoPagoSeleccionado.Disponible.replace(',', '');
                var totalPagar = Number(pagoServicioViewModel.koTotalAPagar());
                if (totalPagar > 0) {
                    if (disponible >= totalPagar) {
                        if (metodoPagoSeleccionado.Tipo === "TRJ") ///ES TARJETA
                        {
                            if (MMSelected === undefined || AASelected === undefined) {
                                showSimpleMessage('Banca Móvil', 'La fecha de caducidad es incorrecta.', function () { }, undefined);
                                return;
                            }
                            if ($('#txtCodigoSeg').dxTextBox('option', 'text') == "" || $('#txtCodigoSeg').dxTextBox('option', 'text') == undefined ||
                                $('#txtCodigoSeg').dxTextBox('option', 'value') == "" || $('#txtCodigoSeg').dxTextBox('option', 'value') == undefined) {
                                showSimpleMessage('Banca Móvil', 'El código de seguridad es incorrecto.', function () { }, undefined);
                                return;
                            }
                        }

                        if (validarMetodoPago.isValid === true) {
                            var cuentaTarjetaDebitar = $('#MetodoPago').dxLookup('option', 'selectedItem').Codigo;
                            var cvvTrj = $('#txtCodigoSeg').dxTextBox('option', 'text');
                            var fchCaducidadTrj = { mes: 0, anio: 0 };
                            if (metodoPagoSeleccionado.Tipo === "TRJ") {
                                fchCaducidadTrj = { mes: MMSelected.Numero, anio: AASelected.IdAnio };
                            }
                            var descripcion = $('#txtDescripcion').dxTextBox('option', 'text');
                            var nombreTitular = pagoServicioViewModel.koNombreTitular();
                            consultaEmpresaDTO.Descripcion = descripcion;
                            consultaEmpresaDTO.DtoEnvio.DesPago = descripcion;
                            var deudasSeleccionadas = $('#idGridRubros').dxDataGrid('instance').getSelectedRowsData();
                            consultaEmpresaDTO.DtoEnvio.Deudas = deudasSeleccionadas;
                            var metodoBusqueda = (metodoPagoSeleccionado.Tipo === 'TRJ') ? "TARJCRED" : "NOTADEBI";
                            var FormaPagoReglaValidacion = $.grep(consultaEmpresaDTO.RespuestaConsulta.ReglasValidacion[0].FormasPago, function (value, index) {
                                return value.FormaPago === metodoBusqueda;
                            })
                            var resultValidacionPago = ValidarPago();
                            consultaEmpresaDTO.DtoEnvio.FormaPagoReglaValidacion = FormaPagoReglaValidacion[0];
                            if (resultValidacionPago.Code === "00") {
                                consultaEmpresaDTO.InformacionPago = {
                                    cuentaTarjetaDebitar: cuentaTarjetaDebitar,
                                    cvvTrj: cvvTrj,
                                    fchCaducidadTrj: fchCaducidadTrj,
                                    descripcion: descripcion,
                                    nombreTitular: nombreTitular,
                                    totalAPagar: totalPagar,
                                    formaPago: metodoPagoSeleccionado,
                                }
                                var uri = MobileBanking_App.app.router.format({
                                    view: 'PagoServicioConfirmacion',
                                    id: JSON.stringify(consultaEmpresaDTO)
                                });
                                MobileBanking_App.app.navigate(uri, { root: true });
                            }
                            else {
                                showSimpleMessage('Banca Móvil', resultValidacionPago.Descripcion, function () { }, undefined);
                            }
                        }
                        else {
                            showWarningMessage('Pago de Servicios', CORE_MESSAGE('MissingData'));
                        }
                    } else {
                        showSimpleMessage('Banca Móvil', 'La cuenta o tarjeta seleccionada posee un monto insuficiente para continuar.', function () { }, undefined);
                    }
                }
                else {
                    showSimpleMessage('Banca Móvil', 'Debes seleccionar al menos una factura.', function () { }, undefined);
                }
            }
            else {
                showSimpleMessage('Banca Móvil', 'Debes seleccionar una forma de pago para continuar con el proceso.', function () { }, undefined);
            }
        } catch (e) {
            showSimpleMessage('Banca Móvil', 'Algo Salió mal, por favor vuelve a intentar.', function () {
                MobileBanking_App.app.navigate('PosicionConsolidada', { root: true });
            }, undefined);
        }
    }


    function ValidarPago() {
        var resultValidacionPago = {
            Code: "00",
            Descripcion: "OK"
        }


        return resultValidacionPago;
    }

    function cargarPaymentMethods() {
        var permiteTarjeta = true;
        var permiteCuenta = true;
        var metodoPagoEasyCashQueryable = jslinq(consultaEmpresaDTO.RespuestaConsulta.ReglasValidacion[0].FormasPago);
        if (SesionMovil != undefined && SesionMovil.PosicionConsolidada != undefined) {
            if (permiteTarjeta === true) {
                $.each(SesionMovil.PosicionConsolidada.TarjetasCliente, function (index, value) {
                    var paymentMethod = {
                        rawObject: value,
                        Codigo: value.NumeroTarjeta,
                        Descripcion: maskTarjeta(value.NumeroTarjeta, 6, 4),
                        Tipo: "TRJ",
                        Disponible: Number(String(value.CupoDisponible).replace(',', '')).formatMoney(2, '.', ',')
                    }
                    PaymentMethods.push(paymentMethod);
                });
            }
            if (permiteCuenta === true) {
                $.each(SesionMovil.PosicionConsolidada.CuentasCliente, function (index, value) {
                    var paymentMethod = {
                        rawObject: value,
                        Codigo: value.Codigo,
                        Descripcion: maskTarjeta(value.Codigo, 4, 4),
                        Tipo: "CTA",
                        Disponible: Number(String(value.SaldoDisponible).replace(',', '')).formatMoney(2, '.', ',')
                    }
                    PaymentMethods.push(paymentMethod);
                });
            }
        }
        else {
            if (permiteTarjeta === true) {
                var paymentMethod = {
                    rawObject: undefined,
                    Codigo: "1234567890123456",
                    Descripcion: maskTarjeta("1234567890123456", 6, 4),
                    Tipo: "TRJ",
                    Disponible: Number(String("6256.32").replace(',', '')).formatMoney(2, '.', ',')
                }
                PaymentMethods.push(paymentMethod);
            }
            if (permiteCuenta === true) {
                var paymentMethod = {
                    rawObject: undefined,
                    Codigo: "9876543214444",
                    Descripcion: maskTarjeta("9876543214444", 4, 4),
                    Tipo: "CTA",
                    Disponible: Number(String("8025.99").replace(',', '')).formatMoney(2, '.', ',')
                }
                PaymentMethods.push(paymentMethod);
            }
        }
    }

    viewModel.koTxtDescripcion.onFocusIn = function (e) {
        try {
            $("#scrollView").dxScrollView('instance').scrollBy(+300);
        } catch (e) {

        }
    }

    function cancelar() {
        MobileBanking_App.app.navigate('PosicionConsolidada', { root: true });
    }

    return viewModel;
};