MobileBanking_App.ConsultaServicio = function (params) {
    "use strict";

    var consultaEmpresaDTO;
    if (params.id) {
        consultaEmpresaDTO = JSON.parse(params.id);
    }
    else {
        //consultaEmpresaDTO = JSON.parse('{"IdCategoria":"002","IdEmpresa":"004","Categoria":"AGUA POTABLE","Empresa":"EMAP","esPagoFrecuente":false,"campos":"[{\"Nombre_Campo\":\"\",\"Tipo_Campo\":\"PARRAFO\",\"Longitud_Campo\":0,\"Tipo_Aplicacion\":\"T\",\"Orden\":1,\"Campo_Asociado\":\"\",\"Id_Contrato\":0,\"Campo_Habilitado\":true,\"Obligatorio\":false,\"Formato_Campo\":\"\",\"Control_Campo\":\"PARRAFO\",\"Combo_Descripcion\":\"\",\"Visible\":true,\"Valor_Default\":\"Para poder pagar tu servicio necesitamos la siguiente información, por favor asegurate de tener a mano: tu cédula de identidad y/o contrato de servicio. Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno\",\"EventoChange\":\"\",\"PlaceHolder\":\"\",\"Evento\":\"Seleccionar()|Administrar(\"App/Banca_Movil/40\")\",\"Propiedades_Adicionales\":\"\"},{\"Nombre_Campo\":\"\",\"Tipo_Campo\":\"LNK\",\"Longitud_Campo\":0,\"Tipo_Aplicacion\":\"T\",\"Orden\":2,\"Campo_Asociado\":\"linkSeleccionarSuministros|linkAdmFavoritos\",\"Id_Contrato\":0,\"Campo_Habilitado\":true,\"Obligatorio\":false,\"Formato_Campo\":\"\",\"Control_Campo\":\"LINK|LINK\",\"Combo_Descripcion\":\"\",\"Visible\":true,\"Valor_Default\":\"lnkSeleccionar|lnkAdministrar\",\"EventoChange\":\"\",\"PlaceHolder\":\"\",\"Evento\":\"Seleccionar()|Administrar(\"App/Banca_Movil/40\")\",\"Propiedades_Adicionales\":\"\"},{\"Nombre_Campo\":\"Contrato:\",\"Tipo_Campo\":\"T\",\"Longitud_Campo\":20,\"Tipo_Aplicacion\":\"T\",\"Orden\":5,\"Campo_Asociado\":\"contrapartida\",\"Id_Contrato\":9152,\"Campo_Habilitado\":true,\"Obligatorio\":true,\"Formato_Campo\":\"\",\"Control_Campo\":\"TEXTBOX\",\"Combo_Descripcion\":\"\",\"Visible\":true,\"Valor_Default\":\"\",\"EventoChange\":\"\",\"PlaceHolder\":\"Ingrese el valor\",\"Evento\":\"\",\"Propiedades_Adicionales\":\"\"},{\"Nombre_Campo\":\"Numérico:\",\"Tipo_Campo\":\"T\",\"Longitud_Campo\":20,\"Tipo_Aplicacion\":\"T\",\"Orden\":6,\"Campo_Asociado\":\"numerico\",\"Id_Contrato\":9152,\"Campo_Habilitado\":true,\"Obligatorio\":false,\"Formato_Campo\":{},\"Control_Campo\":\"TEXTBOX\",\"Combo_Descripcion\":\"\",\"Visible\":true,\"Valor_Default\":\"\",\"EventoChange\":\"\",\"PlaceHolder\":\"Ingrese el valor\",\"Evento\":\"\",\"Propiedades_Adicionales\":\"\"},{\"Nombre_Campo\":\"Servicio:\",\"Tipo_Campo\":\"T\",\"Longitud_Campo\":20,\"Tipo_Aplicacion\":\"T\",\"Orden\":3,\"Campo_Asociado\":\"servicio\",\"Id_Contrato\":9152,\"Campo_Habilitado\":true,\"Obligatorio\":false,\"Formato_Campo\":\"\",\"Control_Campo\":\"COMBO\",\"Combo_Descripcion\":[{\"id\":\"001\",\"descripcion\":\"item001\"},{\"id\":\"002\",\"descripcion\":\"item002\"},{\"id\":\"003\",\"descripcion\":\"item003\"},{\"id\":\"004\",\"descripcion\":\"item004\"},{\"id\":\"005\",\"descripcion\":\"item005\"}],\"Visible\":true,\"Valor_Default\":\"\",\"EventoChange\":\"\",\"PlaceHolder\":\"Ingrese el valor\",\"Evento\":\"\",\"Propiedades_Adicionales\":\"\"},{\"Nombre_Campo\":\"Tipo:\",\"Tipo_Campo\":\"T\",\"Longitud_Campo\":20,\"Tipo_Aplicacion\":\"T\",\"Orden\":4,\"Campo_Asociado\":\"tipo\",\"Id_Contrato\":9152,\"Campo_Habilitado\":true,\"Obligatorio\":true,\"Formato_Campo\":\"\",\"Control_Campo\":\"COMBO\",\"Combo_Descripcion\":[{\"id\":\"001\",\"descripcion\":\"item001\"},{\"id\":\"002\",\"descripcion\":\"item002\"},{\"id\":\"003\",\"descripcion\":\"item003\"},{\"id\":\"004\",\"descripcion\":\"item004\"},{\"id\":\"005\",\"descripcion\":\"item005\"}],\"Visible\":true,\"Valor_Default\":\"\",\"EventoChange\":\"\",\"PlaceHolder\":\"Ingrese el valor\",\"Evento\":\"\",\"Propiedades_Adicionales\":\"\"}]","Contrato":"123456","Descripcion":""}')
    }

    var controlType = {
        TextBox: "TextBox",
        SelectBox: "SelectBox",
        Parrafo: "Parrafo"
    }

    var titleCompuesto = (consultaEmpresaDTO.Empresa === undefined) ? consultaEmpresaDTO.Categoria : consultaEmpresaDTO.Empresa;

    var formGroupValidator = 'formGroupValidator';

    var viewModel = {
        title: ko.observable(titleServicio),

        formGroupValidator: formGroupValidator,
        koTitle: ko.observable("Consulta el servicio"),
        viewShown: function (e) {
            hideFloatButtons();
            //SesionMovil.FechaActividadApp = new Date();
            //var elementos = JSON.parse(consultaEmpresaDTO.campos);
            var elementosQueriable = jslinq(consultaEmpresaDTO.campos);
            var result = elementosQueriable
                .orderBy(function (el) {
                    return el.Orden;
                }).toList();
            DrawContent(result);

            setupFloatButton(classButtons.Cancel, cancelar, undefined, sizeFloatButtons.small, typeFloatButtons.white);
            setupFloatButton(classButtons.Accept, consultar, undefined, undefined, undefined, undefined, undefined);
        }

    };


    function DrawContent(domElements) {
        $.each(domElements, function (index, element) {
            var newDom = "";
            switch (element.Control_Campo) {
                case "LINK":
                case "LINK|LINK":
                    break;

                case "TEXTBOX":
                    newDom = DrawGenericTextBox(element.Orden, //Complemento al id
                        element.PlaceHolder,
                        element.Nombre_Campo,
                        element.Campo_Habilitado,
                        element.Obligatorio,
                        element.Longitud_Campo,
                        element.Formato_Campo,
                        element.Visible);
                    break;

                case "COMBO":
                    newDom = DrawGenericSelectBox(element.Orden, //Complemento al id
                        element.PlaceHolder,
                        element.Nombre_Campo,
                        element.Visible,
                        element.Campo_Habilitado,
                        element.Obligatorio,
                        element.Evento,
                        element.Combo_Descripcion);
                    break;

                case "LABEL":
                    break;

                case "PARRAFO":
                    newDom = DrawGenericParragraph(element.Orden, //Complemento al id
                        element.Valor_Default);
                    break;

                case "BOTON":
                    break;
            }
            $("#dinamicViewContent").append(newDom);
        });

    }

    function getStructureForDom(nombreCampo, type, id) {
        var inputContainer = $('<div id=dom' + id + ' class="" style="text-align: left;padding-bottom: 10px;width: 100% !important; display: inline-flex;margin-right: auto;margin-left: auto;"></div>');
        var inputLabel = $('<label class="col-sm-3" style="width: 50%;padding-top: 5px;">' + nombreCampo + '</label>');
        var grafico = $('<div class="col-sm-3" style="width: 100%;"  id="' + type + id + '"></div>');
        return { inputContainer: inputContainer, inputLabel: inputLabel, grafico: grafico }
    }

    function DrawGenericTextBox(idComplemento, placeHolder, nombreCampo, campoHabilitado, obligatorio, longitud, formatoCampo, visible) {
        var habilitado = (campoHabilitado === false) ? true : false;
        var validationRules = [];
        if (obligatorio === true) {
            validationRules.push({
                type: "required",
                message: "Campo Obligatorio"
            });
        }
        if (formatoCampo != undefined && formatoCampo != "") {
            validationRules.push({
                type: "pattern",
                pattern: formatoCampo,///^[^0-9]+$/,
                message: "No concuerda con el formato."
            });
        }

        var domStructure = getStructureForDom(nombreCampo, controlType.TextBox, idComplemento);

        domStructure.grafico.dxTextBox({
            placeholder: placeHolder,
            maxLength: longitud,
            disabled: habilitado,
            //visible: visible
        })
            .dxValidator({
                validationRules: validationRules,
                validationGroup: formGroupValidator
            });

        if (!visible) {
            document.getElementById("dom" + idComplemento).style.display = "none";
        }

        domStructure.inputContainer.append(domStructure.inputLabel);
        domStructure.inputContainer.append(domStructure.grafico);
        return domStructure.inputContainer;
    }

    function DrawGenericParragraph(idComplemento, content) {
        var inputContainer = $('<div class="" style="text-align: justify;padding-bottom: 10px;width: 100% !important; display: inline-flex;margin-right: auto;margin-left: auto;"></div>');
        var parragraph = $('<p style="padding-right: 15px;padding-left: 15px;" id="Parrafo' + idComplemento + '" ></p>');
        parragraph.text(content);
        inputContainer.append(parragraph);
        return inputContainer;
    }

    function DrawGenericSelectBox(idComplemento, placeHolder, nombreCampo, visible, campoHabilitado, obligatorio, eventoChange, dataSourse) {
        
        var validationRules = [];
        if (obligatorio === true) {
            validationRules.push({
                type: "required",
                message: "Campo Obligatorio"
            });
        }
        var domStructure = getStructureForDom(nombreCampo, controlType.SelectBox, idComplemento);
        domStructure.grafico.dxSelectBox({
            dataSource: dataSourse,
            displayExpr: 'descripcion',
            valueExpr: 'id',
            onSelectionChanged: new Function('args', eventoChange),
            searchEnabled: false,
           // visible: visible
        })
            .dxValidator({
                validationRules: validationRules,
                validationGroup: formGroupValidator
            });

        if (!visible) {
            document.getElementById("dom" + idComplemento).style.display = "none";
        }

        domStructure.inputContainer.append(domStructure.inputLabel);
        domStructure.inputContainer.append(domStructure.grafico);
        return domStructure.inputContainer;
    }

    function getValidChildren() {
        var validChildren = [];
        $.each($("#dinamicViewContent").children(), function (index, value) {
            var tempValidChild = $.grep($(value).children(), function (n, i) {
                return n.id != "";
            });
            validChildren.push(tempValidChild[0]);
        });
        var validChildrenDictionary = [];
        $.each(validChildren, function (index, value) {
            var type;
            var dictionaryItem = { type: "", id: "", value: "", esContrapartida: false, campoAsociado: "" }
            var elementosQueriable = jslinq(JSON.parse(consultaEmpresaDTO.campos));
            if (value.id.includes(controlType.TextBox)) {
                dictionaryItem.type = controlType.TextBox;
                dictionaryItem.id = getIdFromString(value.id, dictionaryItem.type);
                dictionaryItem.value = ($('#' + value.id).dxTextBox('option', 'value')) ? $('#' + value.id).dxTextBox('option', 'value') : $('#' + value.id).dxTextBox('option', 'text');
            }
            else if (value.id.includes(controlType.SelectBox)) {
                dictionaryItem.type = controlType.SelectBox;
                dictionaryItem.id = getIdFromString(value.id, dictionaryItem.type);
                dictionaryItem.value = ($('#' + value.id).dxSelectBox('option', 'selectedItem')) ? $('#' + value.id).dxSelectBox('option', 'selectedItem').id : "";
            }
            else if (value.id.includes(controlType.Parrafo)) {
                dictionaryItem.type = controlType.Parrafo;
                dictionaryItem.id = getIdFromString(value.id, dictionaryItem.type);
                dictionaryItem.value = $('#' + value.id).text();
            }
            var item = elementosQueriable.where(function (el) {
                return Number(el.Orden) == Number(dictionaryItem.id);
            }).toList()[0];
            dictionaryItem.esContrapartida = (item.Campo_Asociado && item.Campo_Asociado.toUpperCase().includes('CONTRAPARTIDA')) ? true : false;
            dictionaryItem.campoAsociado = item.Campo_Asociado;
            validChildrenDictionary.push(dictionaryItem);
        });
        return validChildrenDictionary;
    }

    function getIdFromString(domId, type) {
        return domId.replace(type, '');
    }

    function consultar() {
        try {
            var validarForm = DevExpress.validationEngine.validateGroup(formGroupValidator);
            if (validarForm.isValid) {
                var validChildren = getValidChildren();
                consultaEmpresaDTO.DtoEnvio = ObtenerDtoEnvio(consultaEmpresaDTO, validChildren)
                ConsultarServicioEasyCash(consultaEmpresaDTO.DtoEnvio, function (respuestaConsulta) {
                    if (respuestaConsulta) {
                        //VARIABLE GLOBAL PARA EL TITULO DEL TIPO SERVICIO A PAGAR (js/globalElements/commonElements)
                        titleServicio = "Pago de Servicios " + consultaEmpresaDTO.IdEmpresa;
                        consultaEmpresaDTO.RespuestaConsulta = respuestaConsulta;
                        var uri = MobileBanking_App.app.router.format({
                            view: 'PagoServicio',
                            id: JSON.stringify(consultaEmpresaDTO)
                        });
                        MobileBanking_App.app.navigate(uri, { root: true });
                    }
                    else {
                        showWarningMessage('Pago de Servicios', 'No hemos recibido respuesta al consultar el servicio, intenta más tarde.');
                    }
                });
            } else {
                showWarningMessage('Pago de Servicios', CORE_MESSAGE('MissingData'));
            }
        } catch (e) {
            showWarningMessage('Pago de Servicios', 'Tuvimos un problema con la información ingresada, intenta más tarde.');
        }
    }

    function ObtenerDtoEnvio(consultaEmpresaDTO, validChildren) {
        var dtoEnvio = {
            Cont: 0,
            Cat: "",
            CatID: "",
            Emp: "",
            EmpID: "",
            DesPago: "",
            inputs: [],
        }
        dtoEnvio.Cont = consultaEmpresaDTO.Contrato;
        dtoEnvio.inputs = validChildren;
        dtoEnvio.CatID = consultaEmpresaDTO.IdCategoria;
        dtoEnvio.Cat = consultaEmpresaDTO.Categoria;
        dtoEnvio.EmpID = consultaEmpresaDTO.IdEmpresa;
        dtoEnvio.Emp = consultaEmpresaDTO.Empresa;
        return dtoEnvio;
    }


    function cancelar() {
        MobileBanking_App.app.navigate('PosicionConsolidada', { root: true });
    }


    var Combo_Changed = function (e) {
    }


    return viewModel;
};