MobileBanking_App.BeneficiariosInternos = function (params) {
    "use strict";

    var cuentasBeneficiariasInternasCliente = null;

    var listDelete = [];
    var listBeneficiariosInternos;

    var viewModel = {
        viewShown: function () {
            try {
                SesionMovil.FechaActividadApp = new Date();
                setupFloatButton(classButtons.Delete, actionDelete, undefined, sizeFloatButtons.small, typeFloatButtons.white, 'btn-eliminar');
                setupFloatButton(classButtons.New, actionNew);
                $('.btn-eliminar').hide();
                ConsultaCuentasPermitidas(SesionMovil.ContextoCliente.CodigoCliente, function (data) {
                    cuentasBeneficiariasInternasCliente = jslinq(data).orderBy(function (t) { return t.Beneficiario }).toList();
                    listBeneficiariosInternos = new DevExpress.data.ArrayStore(
                        {
                            data: cuentasBeneficiariasInternasCliente,
                            key: "NumeroCuentaValido"
                        });

                    $('#listBox').dxList('option', 'dataSource', listBeneficiariosInternos);
                    if (cuentasBeneficiariasInternasCliente.length == 0) {
                        showQuestionMessage(CORE_TAG('InternalBeneficiary'), CORE_MESSAGE('AddInternalBeneficiaries'), function () {
                            MobileBanking_App.app.navigate('RegBeneficiariosInternos');
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
            var content = "<div style='margin-bottom:5px'>";
            content = content + "<span class='color' style='font-size:15px; text-transform:uppercase; display:block;margin-left:5px'>" + data.Beneficiario + "</span>";
            content = content + "<span class='texts' style='display:block; font-size:12px;margin-left:5px '><b style='margin-right:3px'>Cuenta #:</b> " + data.NumeroCuentaValido.inputChar('-', data.NumeroCuentaValido.length - 1) + "</span>"
            content = content + "<span class='texts' style='display:block; font-size:12px; position:relative;margin-left:5px'><b style='margin-right:3px'>Nombre/Alias de Cuenta:</b>" + data.Referencia + "</span>"
            content = content + "</div>";
            return content;
        })
    };

    function actionNew(param) {
        MobileBanking_App.app.navigate('RegBeneficiariosInternos');
    }

    viewModel.listBox.onSelectionChanged = function (select) {
        try {
            var selects = $('#listBox').dxList('option', 'selectedItems');
            if (selects.length > 0) {
                $('.btn-eliminar').show();
            }
            else {
                $('.btn-eliminar').hide();
            }
        } catch (e) {
            showException(e.message, e.stack, JSON.stringify(select.selectedItems));
        }

    }

    function actionDelete(param) {
        try {
            listDelete = $('#listBox').dxList('option', 'selectedItems');
            if (listDelete.length == 0) {
                showWarningMessage(CORE_TAG('InternalBeneficiary'), CORE_MESSAGE('SelectRecordDelete'));
                return;
            }
            showQuestionMessage(CORE_TAG('InternalBeneficiary'), CORE_MESSAGE('SureDeleteBeneficiaries'), function () {
                $('#listBox').dxList('option', 'selectedItems', []);
                for (var i = 0; i < listDelete.length; i++) {
                    var dateElim = listDelete[i];
                    EliminarCuentaBeneficiaria(dateElim, function (data) {
                        if (data) {
                            listBeneficiariosInternos.remove(dateElim.NumeroCuentaValido);
                            $('#listBox').dxList('option', 'dataSource', listBeneficiariosInternos);
                        }
                    })

                }
                showSuccessMessage(CORE_TAG('InternalBeneficiary'), CORE_MESSAGE('DeletedInternalBeneficiary'));
            })
        } catch (e) {
            showException(e.message, e.stack);
        }

    }
    return viewModel;
};