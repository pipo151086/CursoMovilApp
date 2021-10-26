MobileBanking_App.RegPregSeg = function (params) {
    "use strict";

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