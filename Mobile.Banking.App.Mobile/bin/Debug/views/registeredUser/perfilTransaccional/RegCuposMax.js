MobileBanking_App.RegCuposMax = function (params) {
    "use strict";

    var ctasCliente = SesionMovil.PosicionConsolidada.CuentasCliente;
    var trjsCliente = SesionMovil.PosicionConsolidada.TarjetasCliente;
    var productosCliente = [];
    var datosCuenta = undefined;
    var accCtaItms = undefined;
    var datosTarjeta = undefined;
    var montosInst = [];
    var showTarjetas = false;
    var groupValidation = 'MONTOSMAX';

    if (ctasCliente && ctasCliente.length > 0) {
        productosCliente.push({ codProd: 'CTA', desProd: 'Cuentas' });
    }
    if (trjsCliente && trjsCliente.length > 0 && showTarjetas) {
        productosCliente.push({ codProd: 'TRJ', desProd: 'Tarjetas' });
    }

    var viewModel = {
        viewShown: function () {
            SesionMovil.FechaActividadApp = new Date();
            RecuperaCuposMaximosInstitucionales(0, false, function (data) {
                montosInst = data;
                setUpInicial();
                setupFloatButton(classButtons.Accept, siguiente, undefined, undefined, undefined, undefined, groupValidation);
            });

            //ConsultaCuposEstablecidosClienteDebito(numCuenta, addFunction) 
            //GrabarDtoCuposMaximosDebito(modificado, original, addFunction) 
            //ConsultaDtoCuposMaximosCuentas(NumCuenta, idCuentaSeleccion, addFunction) 
            //ConsultarDtoConsumoNormaIdCuentaTrj(idCuentaTarjeta, addFunction)


        },
        viewShowing: function () {
            hideFloatButtons();
        },
        accMontosCta: {
            dataSource: accCtaItms,
            animationDuration: 100,
            collapsible: true,
            multiple: true,
            selectedItems: accCtaItms ? accCtaItms[0] : [],
            itemTitleTemplate: function (data) {
                return "<div style='font-family:Gotham-Book'>" +
                    // "<i id=" + data.idIsNoValid + " class='fa fa-exclamation-circle accordionTittleValidator' aria-hidden='true'></i>" +
                    // "<i id=" + data.idIsValid + " class='fa fa-check-circle accordionTittleValidator' aria-hidden='true' style='color:green;display:none'></i>" +
                    "<span style='display:inline-block;color: gray'>" + data.title + "</span></div>";
            },
            itemTemplate: function (itemData) {
                let content = '<div class="" style="">';
                switch (itemData.id) {
                    case 'transferWeb':
                        content = content + '<div class="formItem" style="">';
                        content = content + '<span>' + itemData.spDiario + '</span>';
                        content = content + '<div id="' + itemData.idDiario + '"></div>';
                        content = content + '</div>';

                        content = content + '<div class="formItem" style="">';
                        content = content + '<span>' + itemData.spSemanal + '</span>';
                        content = content + '<div id="' + itemData.idSemanal + '"></div>';
                        content = content + '</div>';

                        content = content + '<div class="formItem" style="">';
                        content = content + '<span>' + itemData.spMensual + '</span>';
                        content = content + '<div id="' + itemData.idMensual + '"></div>';
                        content = content + '</div>';
                        break;
                    case 'retiroAtm': break;
                    case 'transferWeb': break;
                };
                content = content + '</div>';
                return content;
            },
            onSelectionChanged: function (e) {
                let itemData = e.addedItems[0];
                let valorMin = 10;
                let msgRango = 'Mínimo ' + valorMin;
                let msgMultiplo10 = 'Valor debe ser múltiplo de 10';
                let msgDiarioMyrSemanal = msgMultiplo10 + ' y mayor al diario';
                let msgSemanalMyrMensual = msgMultiplo10 + ' y mayor al semanal';
                let ruleRange = { type: "range", message: msgRango, min: valorMin };

                if (itemData) {
                    switch (itemData.id) {
                        case 'transferWeb':
                            $('#' + itemData.idDiario).dxNumberBox({
                                max: itemData.limDiario,
                                min: 10,
                                //value: itemData.cupoDiario && itemData.cupoDiario > 0 ? itemData.cupoDiario : 10
                            }).dxValidator({
                                validationRules: [ruleRange, {
                                    type: "custom", message: msgMultiplo10, reevaluate: true, validationCallback: function (params) {
                                        let esMultiplo10 = params.value % 10 === 0;
                                        return esMultiplo10;
                                    }
                                }],
                                validationGroup: groupValidation
                            });
                            if (itemData.cupoDiario && itemData.cupoDiario > 0)
                                $('#' + itemData.idDiario).dxNumberBox('option', 'value', itemData.cupoDiario);

                            $('#' + itemData.idSemanal).dxNumberBox({
                                max: itemData.limSemanal,
                                min: 10,
                                //value: itemData.cupoSemanal && itemData.cupoSemanal > 0 ? itemData.cupoSemanal : 10
                            }).dxValidator({
                                validationRules: [ruleRange, {
                                    type: "custom", message: msgDiarioMyrSemanal, reevaluate: true, validationCallback: function (params) {
                                        let esMultiplo10 = params.value % 10 === 0;
                                        let valDiario = $('#' + itemData.idDiario).dxNumberBox('option', 'value');
                                        let mayorADiario = +params.value >= +valDiario;
                                        return esMultiplo10 && mayorADiario;
                                    }
                                }],
                                validationGroup: groupValidation
                            });
                            if (itemData.cupoSemanal && itemData.cupoSemanal > 0)
                                $('#' + itemData.idSemanal).dxNumberBox('option', 'value', itemData.cupoSemanal);


                            $('#' + itemData.idMensual).dxNumberBox({
                                max: itemData.limMensual,
                                min: 10,
                                //value: itemData.cupoMensual && itemData.cupoMensual > 0 ? itemData.cupoMensual : 10
                            }).dxValidator({
                                validationRules: [ruleRange, {
                                    type: "custom", message: msgSemanalMyrMensual, reevaluate: true, validationCallback: function (params) {
                                        let esMultiplo10 = params.value % 10 === 0;
                                        let valSemanal = $('#' + itemData.idSemanal).dxNumberBox('option', 'value');
                                        let mayorASemanal = +params.value >= +valSemanal;
                                        return esMultiplo10 && mayorASemanal;
                                    }
                                }],
                                validationGroup: groupValidation
                            });
                            if (itemData.cupoMensual && itemData.cupoMensual > 0)
                                $('#' + itemData.idMensual).dxNumberBox('option', 'value', itemData.cupoMensual);

                            break;
                        case 'retiroAtm': break;
                        case 'transferWeb': break;
                    }
                }
            }
        },

        rdbProducto: setupRadioGroup(productosCliente ? productosCliente[0].codProd : undefined, productosCliente ? productosCliente : [], 'desProd', 'codProd'),
        lkpCuentas: setupLookupControl(undefined, SesionMovil.PosicionConsolidada.CuentasCliente, 'Codigo', 'Codigo', false, 'instantly', undefined, function (itemData, itemIndex, itemElement) {
            try {
                var content = "<div style='margin-left:20px; font-size:18px; color: #d52133'>";
                content = content + "<img style='display:inline-block; margin-right:10px; width:20px; height:24px' src='images/CTA.png' ></img>";
                content = content + "<span style='display:inline-block'>" + itemData.Codigo.inputChar('-', itemData.Codigo.length - 1) + "</span>";
                content = content + "</div>";
                return content;
            } catch (e) {
                showException(e.message, e.stack);
            }

        }, 'Cuentas'),
        lkpTarjetas: setupLookupControl(undefined, SesionMovil.PosicionConsolidada.TarjetasCliente, 'NumeroTarjetaEncript', 'NumeroTarjeta', false, 'instantly', undefined, function (itemData, itemIndex, itemElement) {
            var content = "<div style='margin-left:20px; font-size:18px; color: #d52133'>";
            content = content + "<img style='display:inline-block; margin-right:10px; width:24px; height:24px' src='images/TRJ.png' />";
            content = content + "<span style='display:inline-block'>" + itemData.NumeroTarjetaEncript + "</span>";
            content = content + "</div>";
            content = content + "<hr />";
            return content;
        }, 'Tarjetas'),
        groupValidation: groupValidation
    };

    viewModel.rdbProducto.onValueChanged = function (e) {
        
    }

    function getValuesTransfer() {
        let srcCtas = $('#accMontosCta').dxAccordion('option', 'dataSource');
        let tranObj = srcCtas.find(itm => itm.id === 'transferWeb');
        let maximoTransferencias = {
            IdCuentaCliente: datosCuenta.IdCuentaCliente,
            CupoDiario: $('#' + tranObj.idDiario).dxNumberBox('option', 'value'),
            CupoSemanal: $('#' + tranObj.idSemanal).dxNumberBox('option', 'value'),
            CupoMensual: $('#' + tranObj.idMensual).dxNumberBox('option', 'value'),
        };
        return maximoTransferencias;
    }



    /*************************************************************************************************************************************************************/
    /******************************************************************     NEGOCIO CUENTAS     ****************************************************************/
    /***********************************************************************************************************************************************************/

    viewModel.lkpCuentas.onSelectionChanged = function (e) {
        $('#accMontosCta').dxAccordion('option', 'dataSource', undefined);
        datosCuenta = SesionMovil.PosicionConsolidada.CuentasCliente.find(el => el.Codigo === e.selectedItem.Codigo);
        if (datosCuenta) {
            ConsultaDtoCuposMaximosCuentas(datosCuenta.Codigo, datosCuenta.IdCuentaCliente, function (data) {
                SesionMovil.PosicionConsolidada.CuentasCliente.flatMap(itm => {
                    if (itm.Codigo === datosCuenta.Codigo) {
                        itm.CuposMaximos = data;
                    }
                });
                setCtaValues(data);
            });
        };
    }

    var filterLimitesCtas = function () {
        let esJuridica = datosCuenta.Tipo.includes("JU");
        let montosInstUtil = [];
        if (datosCuenta.Moneda === 'USD')
            montosInstUtil = montosInst.listaConfiguracionPrametros.filter(limInst => limInst.Nombre.includes(datosCuenta.Moneda));
        else
            montosInstUtil = montosInst.listaConfiguracionPrametros.filter(limInst => !limInst.Nombre.includes(datosCuenta.Moneda));

        if (esJuridica)
            montosInstUtil = montosInstUtil.filter(limInstJ => limInstJ.Nombre.includes('J'));
        else
            montosInstUtil = montosInstUtil.filter(limInstJ => !limInstJ.Nombre.includes('J'));

        let valueReturn = {
            transDia: montosInstUtil.find(li => !li.Nombre.includes("SEM") && !li.Nombre.includes("MES")).ValorDecimal,
            transSem: montosInstUtil.find(li => li.Nombre.includes("SEM")).ValorDecimal,
            transMen: montosInstUtil.find(li => li.Nombre.includes("MES")).ValorDecimal,
            atm: montosInst.CuposRetiroATMNorma,
            compras: montosInst.CuposPlastico
        }
        return valueReturn;
    }

    var setCtaValues = function (data) {
        var montosInstUtil = filterLimitesCtas();
        var monedaSymbol = datosCuenta.Moneda == 'USD' ? "$." : "Q."
        let tmpAccSrc = [];
        let transfer = {
            id: 'transferWeb',
            title: "Transferencias Web",
            spDiario: 'Máximo Diario (' + monedaSymbol + montosInstUtil.transDia.formatMoney(2, '.', ',') + ')',
            idDiario: "tranDiario",
            cupoDiario: data.CuposMaximosTransferecias.CupoDiario,
            limDiario: montosInstUtil.transDia,
            spSemanal: 'Máximo Semanal (' + monedaSymbol + montosInstUtil.transSem.formatMoney(2, '.', ',') + ')',
            idSemanal: "tranSemanal",
            cupoSemanal: data.CuposMaximosTransferecias.CupoSemanal,
            limSemanal: montosInstUtil.transSem,
            spMensual: 'Máximo Mensual (' + monedaSymbol + montosInstUtil.transMen.formatMoney(2, '.', ',') + ')',
            idMensual: "tranMensual",
            cupoMensual: data.CuposMaximosTransferecias.CupoMensual,
            limMensual: montosInstUtil.transMen,
            idIsValid: 'transferValid',
            idIsNoValid: 'transferNoValid',
        };
        tmpAccSrc.push(transfer);
        /*if (datosCuenta.TieneTarjetaDebito){
        let cuposMaximosAtm = {
            id: 'retiroAtm',
            title: "Retiro Atm",
            idCupoAtm: "atmDiario",
            CupoAtm: data.CuposMaximosAtm,
            idIsValid: 'atmValid',
            idIsNoValid: 'atmNoValid',
        };
        tmpAccSrc.push(cuposMaximosAtm);
        let cupoMaximoCompra = {
            id: 'compra',
            title: "Compras",
            idCupoCompra: "compraDiario",
            CupoCompra: data.CuposMaximosCompraNorma,
            idIsValid: 'atmValid',
            idIsNoValid: 'atmNoValid',
        }
        tmpAccSrc.push(cupoMaximoCompra);}*/
        $('#accMontosCta').dxAccordion('option', 'dataSource', tmpAccSrc)
    }

    /*************************************************************************************************************************************************************/
    /******************************************************************     NEGOCIO TARJETAS     ****************************************************************/
    /***********************************************************************************************************************************************************/

    viewModel.lkpTarjetas.onSelectionChanged = function (e) {
        datosTarjeta = e.selectedItem;
        if (datosTarjeta) {


        }
    };











    /*************************************************************************************************************************************************************/
    /********************************************************************     NEGOCIO COMUN     ******************************************************************/
    /*************************************************************************************************************************************************************/

    function siguiente(params) {
        var result = params.validationGroup ? params.validationGroup.validate() : { isValid: false };
        if (result.isValid) {
            EnviarOTP(SesionMovil.ContextoCliente, function (data) {
                var resultadoEnviarOTP = data;
                if (resultadoEnviarOTP) {
                    var operacionAIngresoOTP = OperacionEjecutar.ConfigurarMontosMaximos;
                    var dto =
                    {
                        Cta: datosCuenta,
                        MaximoTransfer: getValuesTransfer()
                    };
                    operacionAIngresoOTP.dtoConfigurarMontosMaximos = dto;
                    var uri = MobileBanking_App.app.router.format({
                        view: 'IngresoOTP',
                        id: JSON.stringify(operacionAIngresoOTP)
                    });
                    MobileBanking_App.app.navigate(uri, { root: true });
                }
            });
        } else {
            showWarningMessage(CORE_TAG('DefaultTitle'), CORE_MESSAGE('MissingData'));
        }
    }

    function setUpInicial() {
        if (productosCliente && productosCliente[0].codProd === 'CTA') {
            $('#lkpCuentas').dxLookup('option', 'value', datosCuenta ? datosCuenta.Codigo : SesionMovil.PosicionConsolidada.CuentasCliente[0].Codigo);
            $('#lkpCuentas').dxLookup('option', 'fieldTemplate', function (itemData, itemIndex, itemElement) {
                if (itemData) {
                    var content = "<div style='color: #d52133; font-style: italic'>";
                    content = content + "<span>-" + itemData.Codigo + "-</span>";
                    content = content + "</div>";
                    return content;

                }
            });
        } else if (productosCliente && productosCliente[0].codProd === 'TRJ') {
            $('#lkpTarjetas').dxLookup('option', 'value', datosTarjeta ? datosTarjeta.NumeroTarjeta : SesionMovil.PosicionConsolidada.TarjetasCliente[0].NumeroTarjeta);
            $('#lkpTarjetas').dxLookup('option', 'fieldTemplate', function (itemData, itemIndex, itemElement) {
                var content = "<div style='color: #d52133; font-style: italic'>";
                content = content + "<span>" + itemData.NumeroTarjetaEncript + "</span>";
                content = content + "</div>";
                return content;
            });
        }
    }

    return viewModel;
};