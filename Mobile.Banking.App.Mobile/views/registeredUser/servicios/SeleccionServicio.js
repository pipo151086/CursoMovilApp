MobileBanking_App.SeleccionServicio = function (params) {
    "use strict";

    var categorias = [];
    var empresas = [];
    var pagosFrecuentes = [];

    var consultaEmpresaDTO = {
        IdCategoria: "",
        IdEmpresa: "",
        Categoria: "",
        Empresa: "",
        esPagoFrecuente: false,
        campos: {},
        Contrato: 0,
        Descripcion: ""
    }

    var categoriaValidator = 'categoriaValidator';
    var empresaValidator = 'empresaValidator';

    var viewModel = {
        categoriaValidator: categoriaValidator,
        empresaValidator: empresaValidator,
        koCategoria: {
            dataSource: [],
            searchEnabled: false,
            placeholder: "Seleccione Categoría",
            noDataText: "No existen categorías",
            displayExpr: 'CategoryName',
            valueExpr: 'CategoryID',
            onSelectionChanged: function (e) {
                consultaEmpresaDTO.IdCategoria = e.selectedItem.CategoryID;
                consultaEmpresaDTO.Categoria = e.selectedItem.CategoryName;

                var empresasFiltradas = $.grep(empresas, function (n, i) {
                    return (n.CategoryID === e.selectedItem.CategoryID);
                });
                $('#selectEmpresa').dxSelectBox('option', 'dataSource', empresasFiltradas);
                if (empresasFiltradas.length > 0) {
                    $('#selectEmpresa').dxSelectBox('option', 'disabled', false);
                }
                else {
                    $('#selectEmpresa').dxSelectBox('option', 'disabled', true);
                }
            },
        },
        koEmpresa: {
            dataSource: [],
            searchEnabled: false,
            placeholder: "Seleccione Empresa",
            noDataText: "No existen empresas",
            displayExpr: 'EnterpriseID',
            valueExpr: 'EnterpriseID',
            onSelectionChanged: function (e) {
                if (e.selectedItem) {
                    consultaEmpresaDTO.IdEmpresa = e.selectedItem.EnterpriseID;
                    consultaEmpresaDTO.Empresa = e.selectedItem.EnterpriseName;
                } else {
                    consultaEmpresaDTO.IdEmpresa = undefined;
                    consultaEmpresaDTO.Empresa = undefined;
                }
            },
        },
        koListPagoFrecuente: {
            dataSource: [],
            pageLoadingText: "Cargando...",
            noDataText: "No tienes pagos frecuentes",
            onItemClick: function (e) {
                ConsultarServicioEasyCashFrecuent(e.itemData.Hash, function (result) {
                    if (result) {
                        GetOperationByContractID(String(result.ReglasValidacion[0].IdContrato), function (operation) {
                            consultaEmpresaDTO.esPagoFrecuente = true;
                            consultaEmpresaDTO.Empresa = operation.EnterpriseName
                            consultaEmpresaDTO.Contrato = String(result.ReglasValidacion[0].IdContrato);
                            consultaEmpresaDTO.campos = operation.Content;
                            consultaEmpresaDTO.AccountFee = operation.AccountFee;
                            consultaEmpresaDTO.CardFee = operation.CardFee;
                            consultaEmpresaDTO.DtoEnvio = {
                                Cont: String(result.ReglasValidacion[0].IdContrato),
                                Cat: operation.CategoryName,
                                CatID: operation.CategoryID,
                                Emp: operation.EnterpriseName,
                                EmpID: operation.EnterpriseID,
                                DesPago: "",
                                inputs: result.inputs,
                            }
                            titleServicio = "Pago de Servicios " + operation.EnterpriseID;
                            consultaEmpresaDTO.RespuestaConsulta = result;
                            var uri = MobileBanking_App.app.router.format({
                                view: 'PagoServicio',
                                id: JSON.stringify(consultaEmpresaDTO)
                            });
                            MobileBanking_App.app.navigate(uri, { root: true });
                        });
                    }
                })
            },
            itemTemplate: function (itemData, itemIndex, itemElement) {
                var content = "<div>";
                content += "<label style='margin-top:11px; font-size:medium;padding-left: 5px;color:#d52133'>Descripción:</label> <label>" + itemData.Referencia + "</label> <br/>";
                content += "<label style='padding-left: 5px;color:#d52133' >Empresa: </label> <label> " + itemData.Empresa + "</label>";
                return content += '</div>';
            },
        },
        viewShown: function () {
            hideFloatButtons();
            SesionMovil.FechaActividadApp = new Date();
            setupFloatButton(classButtons.Cancel, cancelar, undefined, sizeFloatButtons.small, typeFloatButtons.white);
            SincServicios(function (frecuentOperations) {
                obtenerCategoriasEmpresas();
                setupFloatButton(classButtons.Accept, consultar, undefined, undefined, undefined, undefined, undefined)
                $('#listPagoFrecuente').dxList('option', 'dataSource', frecuentOperations);
            });
        }
    };

    function obtenerCategoriasEmpresas() {

        var QueriableGlobalOps = jslinq(GlobalOps);
        categorias = QueriableGlobalOps.groupBy(function (el) {
            return el.CategoryID;
        }).select(function (el) {
            return { CategoryID: el.elements[0].CategoryID, CategoryName: el.elements[0].CategoryName }
        }).toList()
        empresas = QueriableGlobalOps.select(function (el) {
            return { EnterpriseID: el.EnterpriseID, EnterpriseName: el.EnterpriseName, CategoryID: el.CategoryID }
        }).toList()

        $('#listPagoFrecuente').dxList('option', 'dataSource', pagosFrecuentes);
        $('#selectCategoria').dxSelectBox('option', 'dataSource', categorias);

    }

    function consultar() {
        var completeValidation = false;
        var validarCategoria = DevExpress.validationEngine.validateGroup(categoriaValidator);
        var validarEmpresa = DevExpress.validationEngine.validateGroup(empresaValidator);

        if ($('#selectEmpresa').dxSelectBox('option', 'disabled') === true) {
            completeValidation = validarCategoria.isValid;
        } else {
            completeValidation = (validarCategoria.isValid === true && validarEmpresa.isValid === true) ? true : false;
        }
        if (completeValidation == true) {
            GetOperationByEnterpriseAndCategory(
                consultaEmpresaDTO.IdEmpresa,
                consultaEmpresaDTO.IdCategoria,
                function (op) {
                    consultaEmpresaDTO.Contrato = op.Contract;
                    consultaEmpresaDTO.campos = op.Content;
                    consultaEmpresaDTO.AccountFee = op.AccountFee;
                    consultaEmpresaDTO.CardFee = op.CardFee;
                    titleServicio = "Pago de Servicios " + consultaEmpresaDTO.IdEmpresa;
                    Siguiente();
                });
        } else {
            showWarningMessage('Pago de Servicios', CORE_MESSAGE('MissingData'));
        }
    }

    function Siguiente() {
        var uri = MobileBanking_App.app.router.format({
            view: 'ConsultaServicio',
            id: JSON.stringify(consultaEmpresaDTO)
        });
        MobileBanking_App.app.navigate(uri, { root: true });
    }

    function cancelar() {
        MobileBanking_App.app.navigate('PosicionConsolidada', { root: true });
    }

    return viewModel;
};
