MobileBanking_App.FormularioSimple = function (params) {
    "use strict";

    var GrupoDeValidacionCapacitacion = 'GrupoDeValidacionCapacitacio';

    var viewModel = {
        GrupoDeValidacionCapacitacion: GrupoDeValidacionCapacitacion,
        viewShowing: function () {
            //DURANTE LA RENDERIZACION DE LA VISTA
            console.log("ESTOY RENDERIZANDO ACTUALMENTE")
        },
        viewShown: function () {
            //cuando la vista ya acabo de rendirizar
            console.log("Ya me renderice");
            $('#passwordField').dxTextBox({
                placeholder: "Enter password",
                showClearButton: true,
                //value: "f5lzKs0T",
                mode: 'password'
            }).dxValidator({
                validationRules: [
                    {
                        type: "required",
                        message: "Password is required"
                    }
                ],
                validationGroup: GrupoDeValidacionCapacitacion
            });
        },
        userName: {
            placeholder: "Type a text here...",
            value: "admin"
        },
        userNameValidador: {
            validationRules: [
                {
                    type: "required",
                    message: "UserName is required"
                },
                {
                    type: "email",
                    message: "e Mail Mal Formato"
                },
            ],
            validationGroup: GrupoDeValidacionCapacitacion
        },
        slPerfil: {
            dataSource: PerfilesCapacitacion,
            searchEnabled: true,
            displayExpr: "DescripcionPerfil",
            valueExpr: "idPerfil",
        },
        submit: {
            validationGroup: GrupoDeValidacionCapacitacion,
            text: "Login",
            onClick: function (args) {
                var resultadoValidacion = DevExpress.validationEngine.validateGroup(GrupoDeValidacionCapacitacion);
                if (resultadoValidacion.isValid) {
                    $('#BtnNoHacer').hide();
                    var loginDto = {
                        userName: $('#txtUserName').dxTextBox('option', 'value'),
                        password: $('#passwordField').dxTextBox('option', 'value'),
                        perfil: $('#slPerfil').dxSelectBox('option', 'value'),
                    }

                    var uri = MobileBanking_App.app.router.format({
                        view: 'FormularioSimple2',
                        id: JSON.stringify(loginDto)
                    });
                    MobileBanking_App.app.navigate(uri, { root: true });

                }
            }
        },
        yoMeEjecuto: function () {
            alert("NO HACER ESTO");
        }
    };
    /*
     Tarea:
     Radio https://js.devexpress.com/Documentation/18_2/ApiReference/UI_Widgets/dxRadioGroup/
     Number https://js.devexpress.com/Documentation/18_2/ApiReference/UI_Widgets/dxNumberBox/
     Check https://js.devexpress.com/Documentation/18_2/ApiReference/UI_Widgets/dxCheckBox/
     
     
     
     
     
     
     
     
     */




    return viewModel;
};