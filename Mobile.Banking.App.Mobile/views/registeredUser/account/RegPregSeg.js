MobileBanking_App.RegPregSeg = function (params) {
    "use strict";
    SesionMovil = JSON.parse('{"ControlAccesoGlobal":{"IdControlAcceso":2881,"NombreUsuario":"CRUZARNOLDO","TipoIdentificacion":"CED","NumeroIdentificacion":"2126190470101","FechaHoraUltimoAcceso":"2021-08-21T16:53:10.577","CanalUltimoAcceso":"WEB","CambiarNombreUsuario":false,"NumeroCelularRegistrado":"99262938","CorreoElectronicoRegistrado":"pipo151086@gmail.com","EsActivo":true,"FechaRegistro":"0001-01-01T00:00:00","CodigoNotificacion":1,"InfoNotificacionRequerida":false,"DiasxVencerClave":0},"ContextoCliente":{"IdInstitucion":2,"NombreCompletoCliente":"CRUZ ARNOLDO REVOLORIO ZUMETA","CodigoCliente":287832,"NombreOficina":"","NombreCadena":"","TokenAutenticacion":"UGHUIBJKB&%/&","SecuencialTransacciones":1,"BranchOperador":"El Ejido","CodigoOperador":null,"TipoDocumento":"CED","FechaTransaccional":"2021-10-05","ClaveFuerte":"","PasswordClaro":"","SessionId":"1","PasswordEncriptado":"","NumeroIntentos":1,"NumeroDocumento":"2126190470101","TipoClave":null,"Rol":null,"PasswordTransaccional":"","Respuesta":"0","IpTerminal":null},"PosicionConsolidada":{"IdPosConsolidada":1,"InversionesCliente":[],"CuentasCliente":[{"Codigo":"4127000008626","Tipo":"CORRIENTE GTQ","Estado":"ACTIVA","SaldoDisponible":"96.37","SaldoContable":"96.37","NumTransaccionesTotal":"60000.00","CodUltimaTransacion":null,"CuentaSaldo":null,"NumTarjetaDebitoTitular":"","CodigoSubProducto":"SPDANORMALGTQ","IdCuentaCliente":862,"Moneda":"GTQ","Identificacion":null,"MovimientosCuenta":null,"IdPosConsolidada":1,"TieneTarjetaDebito":false},{"Codigo":"4127000011589","Tipo":"CORRIENTE GTQ","Estado":"ACTIVA","SaldoDisponible":"997963.92","SaldoContable":"997963.92","NumTransaccionesTotal":"60000.00","CodUltimaTransacion":null,"CuentaSaldo":null,"NumTarjetaDebitoTitular":"","CodigoSubProducto":"SPDANORMALGTQ","IdCuentaCliente":1158,"Moneda":"GTQ","Identificacion":null,"MovimientosCuenta":null,"IdPosConsolidada":1,"TieneTarjetaDebito":false}],"TarjetasCliente":[{"EsPrincipal":true,"IdCuentaTarjeta":119839,"IdTarjetaHabiente":121293,"DescripcionEstadoTarjeta":"ACTIVA","DescripcionBin":"CLIENTE FAVORITO","DescripcionAfinidad":"CLIENTE FAVORITO","Marca":"TCJ","TipoProcesamiento":"TRJINTERNO","NumeroTarjeta":"6001105000007146","DiaPago":6,"CupoAprobado":8500,"CupoUtilizado":1627.99,"CupoDisponible":6872.01,"CupoAprobadoEspecial":0,"CupoUtilizadoEspecial":0,"CupoDisponibleEspecial":0,"CupoUtilizadoAvance":0,"FechaUltimoCorte":"2021-07-01T00:00:00","FechaUltimoVcto":"2021-07-06T00:00:00","FechaUltimoPago":"2021-07-03T00:00:00","SaldoPagoTotal":0,"SaldoPagoMinimo":0,"CupoAprobadoTotal":8500,"CupoUtilizadoTotal":1627.99,"CupoDisponibleTotal":6872.01,"CupoAprobadoSuperAvance":0,"CupoUtilizadoSuperAvance":0,"CupoDisponibleSuperAvance":0,"IdPosConsolidada":1,"RecSaldoPtos":0,"RecPtosGanados":0,"RecPtosCanjeados":0,"RecTotalPtosAcumulados":0,"RecAfiliado":false,"Moneda":"GTQ","Cotizacion":1,"EsPropia":false}],"CreditosCliente":[],"EstadosTarjetasVisaCliente":null},"SessionToken":{"SessionId":"IdDispositivoSimuladorPortaleshyx0LiUhO1","FechaSession":"2021/10/05","HoraSession":"17:07"},"FechaActividadApp":"2021-10-05T22:07:58.930Z","ProductosCliente":[{"IdProducto":1,"CodigoProducto":"CTA","NombreProducto":"CUENTAS"},{"IdProducto":2,"CodigoProducto":"TRJ","NombreProducto":"TARJETAS"}],"FechaHoraUltimoAccesoMostrar":"2021-08-21T21:53:10.000Z"}')

    var groupValidation = "PREGSEG";
    var coleccionAccordion = [];

    var viewModel = {
        viewShown: function () {
            setupFloatButton(classButtons.Accept, siguiente, undefined, undefined, undefined, undefined, groupValidation);
            ConsultarPreguntasSeguridadPredefinida(formularData);
        },
        viewShowing: function () {
            hideFloatButtons();
        },
        tooltip: {
            target: "#quetionToolTip",
            showEvent: "click",
            hideEvent: "mouseleave",
            closeOnOutsideClick: true,
            position: "left",
            width: 200,
            contentTemplate: function (data, itm, el) {
                let content = '<div style=" text-align: justify; white-space: pre-wrap;background-color:white">' +
                    '<b style="color:#d52133;font-weight:900">¡Recuerda!</b>' +
                    '<div style="color:#333; white-space: pre-wrap;">' +
                    'Tu puedes agregar una pregunta personalizada solo escribiendo en el campo.</div>' +
                    '</div>'
                return content;
            }
        },
        acordionPreguntas: {
            dataSource: coleccionAccordion,
            animationDuration: 200,
            collapsible: true,
            multiple: true,
            selectedItems: [],
            itemTitleTemplate: function (data) {
                return "<div style='font-family:Gotham-Book'>" +
                    "<i id=" + data.idIsNoValid + " class='fa fa-exclamation-circle accordionTittleValidator' aria-hidden='true'></i>" +
                    "<i id=" + data.idIsValid + " class='fa fa-check-circle accordionTittleValidator' aria-hidden='true' style='color:green;display:none'></i>" +
                    "<span style='display:inline-block;color: gray; text-transform: capitalize;'>" + data.title + "</span></div>";
            },
            itemTemplate: function (itemData) {
                let content = '<div class="" style="">' +
                    '<div id="' + itemData.idPregunta + '"></div>' +
                    '<div id="' + itemData.idRespuesta + '"></div>';
                content = content + '</div>';
                return content;
            },
            onSelectionChanged: function (e) {
                let currElement = e.addedItems[0];
                if (currElement) {
                    let hasSelected = $("#" + currElement.idPregunta).data('dxSelectBox');
                    if (!hasSelected) {
                        $("#" + currElement.idPregunta).dxSelectBox({
                            dataSource: currElement.bancoPregs,
                            displayExpr: 'Pregunta',
                            valueExpr: 'idAccesoPregunta',
                            placeholder: currElement.title,
                            acceptCustomValue: true,
                            searchEnabled: false,
                            itemTemplate: function (elmt) {
                                
                                let content = '<div class="preguntaInner">' + elmt.Pregunta; 
                                content = content + '</div>';
                                return content;
                            },
                            onCustomItemCreating: function (evnt) {
                                let newPregunta = {
                                    EsActiva: true,
                                    Pregunta: evnt.text,
                                    Respuesta: null,
                                    esPredefinida: true,
                                    idAccesoPregunta: evnt.text ? 0 : undefined
                                };
                                return newPregunta;
                            },
                            onFocusOut: ValPregAcordion
                        }).dxValidator({
                            validationRules: [{
                                type: "required",
                                message: currElement.valMessagePreg
                            }],
                            validationGroup: groupValidation
                        });
                    }

                    let responseInit = $("#" + currElement.idRespuesta).data('dxTextBox');
                    if (!responseInit) {
                        $("#" + currElement.idRespuesta).dxTextBox(
                            setupTextBoxControl('', 128, currElement.titleRespuesta)
                        ).dxValidator({
                            validationRules: [{
                                type: "required",
                                message: currElement.valMessageResp
                            }],
                            validationGroup: groupValidation
                        });
                        $("#" + currElement.idRespuesta).dxTextBox('option', 'onFocusOut', ValPregAcordion);
                    }

                    var deviceVersion = parseInt(DeviceInfo.DeviceVersion.replace(".", "").substring(0, 2));
                    if (deviceType === 'Android') {
                        if (deviceVersion < 44 && deviceVersion != 9 && deviceVersion != 10 && deviceVersion != 11) {
                            $("#" + currElement.idRespuesta).bind('keyup', HandleOcupacion);
                            $("#" + currElement.idPregunta).bind('keyup', HandleOcupacion);
                        }
                        else {
                            $("#" + currElement.idRespuesta).bind('input', HandleOcupacion);
                            $("#" + currElement.idPregunta).bind('input', HandleOcupacion);
                        }
                    }
                    else {
                        $("#" + currElement.idRespuesta).bind('keyup', HandleOcupacion);
                        $("#" + currElement.idPregunta).bind('keyup', HandleOcupacion);
                    }

                }


            }
        },

        groupValidation: groupValidation
    };

    function formularData(pregs) {
        if (pregs) {
            let numeroCombos = 5;
            let pregsPerCombo = pregs.chunk_inefficient(Math.ceil(pregs.length / numeroCombos))
            let accordionItems = [];
            for (var i = 1; i <= numeroCombos; i++) {
                let newElement = {
                    id: i,
                    bancoPregs: pregsPerCombo[i - 1],
                    //pregSeleccionada: pregsPerCombo[i - 1][0],
                    title: "Pregunta No. " + [i],
                    titleRespuesta: "Respuesta No. " + [i],
                    idPregunta: 'pregunta' + [i],
                    idRespuesta: 'respuesta' + [i],
                    idIsValid: 'pregResValid' + [i],
                    idIsNoValid: 'pregResNoValid' + [i],
                    valMessagePreg: 'pregunta No. ' + [i],
                    valMessageResp: 'respuesta No. ' + [i],
                    idAddButton: 'addButton' + [i],
                    pregPersonalizada: false

                }
                accordionItems.push(newElement);
            }
            coleccionAccordion = accordionItems;
            $('#acordionPreguntas').dxAccordion('option', 'dataSource', coleccionAccordion);
        }
    }

    function ValPregAcordion(evnt) {
        let resValidation = DevExpress.validationEngine.validateGroup(groupValidation);
        coleccionAccordion.forEach(accItem => {
            let preguntaSend = $('#' + accItem.idPregunta).dxSelectBox('option', 'selectedItem');
            let reponseSend = $('#' + accItem.idRespuesta).dxTextBox('option', 'value');
            if ((preguntaSend && preguntaSend.Pregunta) && reponseSend) {
                $('#' + accItem.idIsValid).show();
                $('#' + accItem.idIsNoValid).hide();
            }
            else {
                $('#' + accItem.idIsValid).hide();
                $('#' + accItem.idIsNoValid).show();
            }
        });
    }

    function HandleOcupacion(e) {
        var value = e.target.value;
        var idComp = e.currentTarget.id;
        var result = /^[A-Za-z0-9À-ÿ\u00f1\u00d1 ]*[A-Za-z0-9À-ÿ\u00f1\u00d1][A-Za-z0-9À-ÿ\u00f1\u00d1 ]*$/.test(value);
        if (!result || value.length > 40) {
            let newVal = value.substring(0, value.length - 1);
            e.target.value = newVal;
            if (e.currentTarget.id.includes('pregunta')) {
                $('#' + e.currentTarget.id).dxSelectBox('option', 'text', newVal);
                $('#' + e.currentTarget.id).dxSelectBox('option', 'displayValue', newVal)
            }
            else {
                $('#' + idComp).dxTextBox('option', 'value', newVal);
            }
        }
    }


    function siguiente(params) {
        let validators = (params.validationGroup && params.validationGroup.validators) ? params.validationGroup.validators : []
        if (validators.length < 10) {
            return showWarningMessage(CORE_TAG('DefaultTitle'), CORE_MESSAGE('MissingData'));
        }

        var result = params.validationGroup.validate();
        if (result.isValid) {
            var preguntasCliente = [];
            coleccionAccordion.forEach(accItem => {
                let preguntaSend = $('#' + accItem.idPregunta).dxSelectBox('option', 'selectedItem');
                if (!preguntaSend)
                    return;

                let reponseSend = $('#' + accItem.idRespuesta).dxTextBox('option', 'value');
                preguntaSend.Respuesta = reponseSend;
                preguntaSend.esPredefinida = preguntaSend.idAccesoPregunta > 0;
                preguntaSend.EsActiva = true;
                preguntasCliente.push(preguntaSend);
            });
            RegistrarPreguntaYRespuestaSeguridad(preguntasCliente, function (data) {
                if (data) {
                    var message = 'A continuación deberás registrar un PIN de Acceso';
                    MobileBanking_App.app.navigate("RegisterSecurePIN/" + message, { root: true });
                    return;
                }
            });
        }
        else {
            return showWarningMessage(CORE_TAG('DefaultTitle'), CORE_MESSAGE('MissingData'));
        }
    }

    return viewModel;
};