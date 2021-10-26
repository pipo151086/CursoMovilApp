MobileBanking_App.SolCtaForm4 = function (params) {
    "use strict";

    var CtaDigitalForm = {};
    var CtaDigDPIPasF4 = "CtaDigDPIPasF4";
    var prefixBeneficiarioX = 'Beneficiario';
    var beneficiarios = [1];

    if (params && params.id)
        CtaDigitalForm = JSON.parse(params.id);

    var viewModel = {
        viewShowing: function () {
            hideFloatButtons();
        },
        viewShown: function () {
            setupPaginatorDots();

            setupFields(beneficiarios[0])
        },
        CtaDigDPIPasF4: CtaDigDPIPasF4,
        btnNuevoBeneficiario: {
            text: "Agregar Beneficiario",
            disabled: false,
            visible: true,
            readonly: false,
            onClick: function (params) {
                var lastId = beneficiarios[beneficiarios.length - 1]
                lastId++
                beneficiarios.push(lastId);

                let numBeneficiarios = beneficiarios.length;
                if (numBeneficiarios === 5)
                    $('#btnNuevoBeneficiario').dxButton('option', 'visible', false);
                setupFields(lastId);
            }
        },

        btnValidar: {
            text: "Siguiente",
            disabled: false,
            visible: true,
            readonly: false,
            onClick: function (params) {
                var isValid = DevExpress.validationEngine.validateGroup(CtaDigDPIPasF4).isValid;
                if (isValid) {
                    let listaBeneficiarios = getData();
                    let sumaPorcent = listaBeneficiarios.map(bene => bene.porcentaje).reduce(SumaPorcentajes, 0);
                    if (sumaPorcent != 100)
                        return showSimpleMessage(CORE_TAG('DefaultTitle'), 'El porcentaje debe ser 100', undefined, undefined);




                    CtaDigitalForm.NumeroCuentaCreada = "Numero de la cuenta Nueva ";

                    CtaDigitalForm.Beficiarios = listaBeneficiarios;
                    var uri = MobileBanking_App.app.router.format({
                        view: 'SolCtaTrjDebMsg',
                        id: JSON.stringify(CtaDigitalForm)
                    });
                    debugger;
                    MobileBanking_App.app.navigate(uri);
                }
            }
        },
        btnRegresar: {
            text: "Volver",
            disabled: false,
            visible: true,
            readonly: false,
            onClick: function (params) {
                var uri = MobileBanking_App.app.router.format({
                    view: 'SolCtaForm3',
                    id: JSON.stringify(CtaDigitalForm)
                });
                MobileBanking_App.app.navigate(uri);
            }
        },

    };

    function SumaPorcentajes(acumulator, a) {
        return acumulator + a;
    }

    function getData() {
        let listaBeneficiarios = [];

        for (let x = 0; x < beneficiarios.length; x++) {
            listaBeneficiarios.push({
                nombre: $('#txtNombre' + prefixBeneficiarioX + beneficiarios[x]).dxTextBox('option', 'value'),
                apellido: $('#txtApellido' + prefixBeneficiarioX + beneficiarios[x]).dxTextBox('option', 'value'),
                parentesco: $('#slParentesco' + prefixBeneficiarioX + beneficiarios[x]).dxSelectBox('option', 'value'),
                porcentaje: $('#numPorcentaje' + prefixBeneficiarioX + beneficiarios[x]).dxNumberBox('option', 'value')
            });
        }

        return listaBeneficiarios;
    }





    function setupFields(idBeneficiario) {
        var containerBeneficiarios = $('#solCtaContBeneficiarios');
        let valueElementId = prefixBeneficiarioX + idBeneficiario;
        //Agregamos un nuevo elemento contenedor para el nuevo Beneficiario
        containerBeneficiarios.append('<div class="containerNuevoBene" id="contNuevo' + valueElementId + '"></div>');
        let nuevoBeneficiario = $('#contNuevo' + valueElementId);
        //Agregamos contenedor para la linea que contendra al Nombre del beneficiario y el boton eliminar
        nuevoBeneficiario.append('<div style="width:100%;display:inline-flex" id="contLineaNombre' + valueElementId + '"></div>')
        let contenedorLineaNombre = $('#contLineaNombre' + valueElementId);
        //Agregamos el nombre
        contenedorLineaNombre.append('<div class="formSolCtaDigFieldValueComp" style="flex:1" id="txtNombre' + valueElementId + '"></div>');
        //Agregamos el boton eliminar siempre y cuando no sea el primer Beneficiario
        if (idBeneficiario > 1)
            contenedorLineaNombre.append('<div class="deleteButton btnBorrarElemento" id="btnBorrar' + valueElementId + '"></div>');
        //Agregamos el campo Apellido
        nuevoBeneficiario.append('<div class="formSolCtaDigFieldValueComp itemSeparator"  id="txtApellido' + valueElementId + '"></div>');
        //Agregamos un contenedor para la linea del parentesco y porcentaje
        nuevoBeneficiario.append('<div style="width:100%;display:inline-flex" id="contParentPorcen' + valueElementId + '"></div>');
        var contenedorLineaPorcentaje = $('#contParentPorcen' + valueElementId);
        //Agregamos los campos parentesco y porcentaje
        contenedorLineaPorcentaje.append('<div class="formSolCtaDigFieldValueComp" style="flex:1;padding-right:10px" id="slParentesco' + valueElementId + '"></div>');
        contenedorLineaPorcentaje.append('<div class="formSolCtaDigFieldValueComp numPorcentCls" style="width:100px" id="numPorcentaje' + valueElementId + '"></div>');

        //Una vez creados los DOMs los configuramos como corresponda:
        /*TEXTO Nombre Bene*/
        $('#txtNombre' + valueElementId).dxTextBox(setupTextBoxControl("", 64, 'Nombre', typeLetter.upper, undefined, true, typeCharAllowed.OnlyText)).dxValidator({
            validationRules: [{
                type: "required",
                message: "Nombre es Obligatorio"
            }],
            validationGroup: CtaDigDPIPasF4
        });

        /*TEXTO Apellido Bene*/
        $('#txtApellido' + valueElementId).dxTextBox(setupTextBoxControl("", 64, 'Apellido', typeLetter.upper, undefined, true, typeCharAllowed.OnlyText)).dxValidator({
            validationRules: [{
                type: "required",
                message: "Apellido es Obligatorio"
            }],
            validationGroup: CtaDigDPIPasF4
        });

        /*COMBO Parentesco Bene*/
        $('#slParentesco' + valueElementId).dxSelectBox(setupComboBoxControl(ParentescoRelacion, "text", "value", "", false, undefined, undefined, "Relación / Parentesco")).dxValidator({
            validationRules: [{
                type: "required",
                message: "Parentesco es Obligatorio"
            }],
            validationGroup: CtaDigDPIPasF4
        });

        /*NUMERO Parentesco Porcentaje*/
        $('#numPorcentaje' + valueElementId).dxNumberBox(setupNumberBox(undefined, 0, 100, undefined, undefined, undefined, "Porcentaje")).dxValidator({
            validationRules: [{
                type: "required",
                message: "Porcentaje es Obligatorio"
            }],
            validationGroup: CtaDigDPIPasF4
        });
        $('#numPorcentaje' + valueElementId).dxNumberBox('option', 'mode', "number");

        $('#numPorcentaje' + valueElementId).dxNumberBox('option', 'onFocusOut', function (args) {
            controlDecimales('#numPorcentaje' + valueElementId);
        });

        /*BOTON ELIMINAR BtnBorrarBene*/
        $('#btnBorrar' + valueElementId).dxButton({
            text: "-",
            disabled: false,
            visible: true,
            readonly: false,
            onClick: function (params) { deleteItem(valueElementId); }
        });
        //Linea Separadora de Beneficiarios
        nuevoBeneficiario.append('<hr style="border-color: darkgray;"/>')

    }

    function controlDecimales(idComponent) {
        let newValue = 0;
        if (!isNaN($(idComponent).dxNumberBox('option', 'value')))
            newValue = Math.round($(idComponent).dxNumberBox('option', 'value'));

        $(idComponent).dxNumberBox('option', 'value', newValue);
    }

    var deleteItem = function (ele) {
        $('#contNuevo' + ele).remove();
        let itemEliminar = ele.replace(prefixBeneficiarioX, '');
        for (var i = 0; i < beneficiarios.length; i++) {
            if (beneficiarios[i] === +itemEliminar) {
                beneficiarios.splice(i, 1);
            }
        }
        let numBeneficiarios = beneficiarios.length;
        if (numBeneficiarios < 5)
            $('#btnNuevoBeneficiario').dxButton('option', 'visible', true);
    }

    function setupPaginatorDots() {
        if (CtaDigitalForm.TieneSesion === true) {
            $('#pagnatorTlt').text('Paso 1 / 2');

            $('#paginatorDots').append(
                '<div class="dot active"></div>' +
                '<div class="dot"></div>'
            );
        } else {
            $('#pagnatorTlt').text('Paso 3 / 4');

            $('#paginatorDots').append(
                '<div class="dot"></div>' +
                '<div class="dot"></div>' +
                '<div class="dot active"></div>' +
                '<div class="dot"></div>'
            );
        }
    }

    return viewModel;
};