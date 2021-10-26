MobileBanking_App.BeneficiariosExternos = function (params) {
    "use strict";

    var cuentasBeneficiariasExternasCliente = [];
    var listDelete = [];


    const Tipocuenta = {
        AHORRO: tipoCuentaACH[0].TipoCta,
        CREDITO: tipoCuentaACH[1].TipoCta,
        CORRIENTE: tipoCuentaACH[2].TipoCta,
        TARJETA: tipoCuentaACH[3].TipoCta

    }

    var listBeneficiariosExternos;

    var viewModel = {
        viewShown: function () {
            try {
                SesionMovil.FechaActividadApp = new Date();
                setupFloatButton(classButtons.Delete, actionDelete, undefined, sizeFloatButtons.small, typeFloatButtons.white, 'btn-eliminar');

                setupFloatButton(classButtons.Cancel, cancelar, undefined, sizeFloatButtons.small, typeFloatButtons.white);
                setupFloatButton(classButtons.New, actionNew);
                $('.btn-eliminar').hide();

                ConsultarCuentasClienteACH(function (data) {
                    cuentasBeneficiariasExternasCliente = data;
                    listBeneficiariosExternos = new DevExpress.data.ArrayStore({
                        data: cuentasBeneficiariasExternasCliente,
                        key: "IdTransferenciaExterna"
                    });
                    $('#listBox').dxList('option', 'dataSource', listBeneficiariosExternos);
                    if (cuentasBeneficiariasExternasCliente.length == 0) {
                        showQuestionMessage(CORE_TAG('ExternalBeneficiary'), CORE_MESSAGE('AddExternalBeneficiaries'), function () {

                            MobileBanking_App.app.navigate('RegBeneficiarioExterno');
                        })
                    }
                });

            } catch (e) {

                showException(e.message, e.stack);
            }

        },
        viewShowing: function () {
            hideFloatButtons();
        },
        listBox: setupListBox([], modeSelection.Multiple, true, 'auto', function (data) {

            var tipoMostrar;
            switch (data.TipoCuenta) {
                case Tipocuenta.AHORRO:
                    tipoMostrar = "AHORRO";
                    break;
                case Tipocuenta.CORRIENTE:
                    tipoMostrar = "CORRIENTE"
                    break;

                case Tipocuenta.TARJETA:
                    tipoMostrar = "TARJETA CRÉDITO"
                    break;
                default:
                    tipoMostrar = "CRÉDITO"
                    break;
            }

            var esAchInmediato = ""
            if (data.EsACHInmediato) {

                esAchInmediato = "y ACH Inmediato"
            }

            var content = "<div style='margin-bottom:5px'>";

            //content = content + "<span class='color' style='font-size:15px; text-transform:uppercase; display:block; margin-left:5px'>" + data.Beneficiario + " ( ACH " + esAchInmediato + ")" + "</span>";
            content = content + "<span class='color' style='font-size:15px; text-transform:uppercase; display:block; margin-left:5px'>" + data.Beneficiario + "</span>";
            content = content + "<span class='texts' style='display:block; font-size:12px; '><b style='margin-right:3px; margin-left:5px'>Tipo de cuenta:</b> " + tipoMostrar + "</span>"
            content = content + "<span class='texts' style='display:block; font-size:12px; '><b style='margin-right:3px; margin-left:5px'>Moneda:</b> " + data.CodigoMoneda + "</span>"
            content = content + "<span class='texts' style='display:block; font-size:12px; '><b style='margin-right:3px; margin-left:5px'>Cuenta #:</b> " + data.NumeroCuenta.inputChar('-', data.NumeroCuenta.length - 1) + "</span>"
            content = content + "<span class='texts' style='display:block; font-size:12px; '><b style='margin-right:3px; margin-left:5px'>Acepta:</b> " + "Ach " + esAchInmediato + "</span>"
            content = content + "<span class='texts' style='display:block; font-size:12px; position:relative;'><b style='margin-right:3px; margin-left:5px'>Entidad:</b>" + searchEntityFinancer(data.IdEntidadFinanciera).Descripcion + "</span>"

            content = content + "</div>";

            return content;
        })
    };

    function searchEntityFinancer(IdEntidadFinanciera) {
        for (var i = 0; i < EntidadesFinancierasACH.length; i++) {
            if (EntidadesFinancierasACH[i].IdEntidadFinanciera == IdEntidadFinanciera)
                return EntidadesFinancierasACH[i];
        }
        return {
            Descripcion: 'Sin Nombre id = ' + IdEntidadFinanciera
        }
    }

    viewModel.listBox.onSelectionChanged = function () {
        try {
            var selects = $('#listBox').dxList('option', 'selectedItems');
            if (selects.length > 0) {
                $('.btn-eliminar').show();
            }
            else {
                $('.btn-eliminar').hide();
            }
        } catch (e) {
            showException(e.message, e.stack);
        }

    }

    function actionNew(param) {
        MobileBanking_App.app.navigate('RegBeneficiarioExterno', { root: true });
    }

    function cancelar() {
        MobileBanking_App.app.navigate('PosicionConsolidada', { root: true });
    }



    function actionDelete(param) {
        try {
            listDelete = $('#listBox').dxList('option', 'selectedItems');
            if (listDelete.length == 0) {
                showWarningMessage(CORE_TAG('ExternalBeneficiary'), CORE_MESSAGE('SelectRecordDelete'));
                return;
            }
            showQuestionMessage(CORE_TAG('ExternalBeneficiary'), CORE_MESSAGE('SureDeleteBeneficiaries'), function () {
                EliminaCuentaPermitidaACH(listDelete, function (data) {
                    var elimnar = data;
                    if (elimnar) {
                        $('#listBox').dxList('option', 'selectedItems', []);
                        for (var i = 0; i < listDelete.length; i++) {
                            listBeneficiariosExternos.remove(listDelete[i].IdTransferenciaExterna);
                            $('#listBox').dxList('option', 'dataSource', listBeneficiariosExternos);
                        }
                        showSuccessMessage(CORE_TAG('ExternalBeneficiary'), CORE_MESSAGE('DeletedExternalBeneficiary'));
                    }
                });

            });
        } catch (e) {
            showException(e.message, e.stack);
        }

    }

    return viewModel;
};