MobileBanking_App.RegUsrPass = function (params) {
    "use strict";

    var SesionMovil = JSON.parse('{"ControlAccesoGlobal":{"IdControlAcceso":2881,"NombreUsuario":"CRUZARNOLDO","TipoIdentificacion":"CED","NumeroIdentificacion":"2126190470101","FechaHoraUltimoAcceso":"2021-07-14T18:03:25.137","CanalUltimoAcceso":"WEB","CambiarNombreUsuario":false,"NumeroCelularRegistrado":"99262938","CorreoElectronicoRegistrado":"pipo151086@gmail.com","EsActivo":true,"FechaRegistro":"0001-01-01T00:00:00","CodigoNotificacion":1,"InfoNotificacionRequerida":false,"DiasxVencerClave":0},"ContextoCliente":{"IdInstitucion":2,"NombreCompletoCliente":"CRUZ ARNOLDO REVOLORIO ZUMETA","CodigoCliente":287832,"NombreOficina":"","NombreCadena":"CRUZARNOLDO","TokenAutenticacion":"UGHUIBJKB&%/&","SecuencialTransacciones":1,"BranchOperador":"El Ejido","CodigoOperador":null,"TipoDocumento":"CED","FechaTransaccional":"2021-11-04","ClaveFuerte":"","PasswordClaro":"2107","SessionId":"1","PasswordEncriptado":"","NumeroIntentos":1,"NumeroDocumento":"2126190470101","TipoClave":null,"Rol":null,"PasswordTransaccional":"","Respuesta":"0","IpTerminal":null},"PosicionConsolidada":{"IdPosConsolidada":1,"InversionesCliente":[],"CuentasCliente":[{"Codigo":"4127000008626","Tipo":"CORRIENTE GTQ","Estado":"ACTIVA","SaldoDisponible":"96.37","SaldoContable":"96.37","NumTransaccionesTotal":"60000.00","CodUltimaTransacion":null,"CuentaSaldo":null,"NumTarjetaDebitoTitular":"","CodigoSubProducto":"SPDANORMALGTQ","IdCuentaCliente":862,"Moneda":"GTQ","Identificacion":null,"MovimientosCuenta":null,"IdPosConsolidada":1,"TieneTarjetaDebito":false},{"Codigo":"4127000011589","Tipo":"CORRIENTE GTQ","Estado":"ACTIVA","SaldoDisponible":"997938.92","SaldoContable":"997938.92","NumTransaccionesTotal":"60000.00","CodUltimaTransacion":null,"CuentaSaldo":null,"NumTarjetaDebitoTitular":"","CodigoSubProducto":"SPDANORMALGTQ","IdCuentaCliente":1158,"Moneda":"GTQ","Identificacion":null,"MovimientosCuenta":null,"IdPosConsolidada":1,"TieneTarjetaDebito":false}],"TarjetasCliente":[{"EsPrincipal":true,"IdCuentaTarjeta":119839,"IdTarjetaHabiente":121293,"DescripcionEstadoTarjeta":"ACTIVA","DescripcionBin":"CLIENTE FAVORITO","DescripcionAfinidad":"CLIENTE FAVORITO","Marca":"TCJ","TipoProcesamiento":"TRJINTERNO","NumeroTarjeta":"6001105000007146","DiaPago":6,"CupoAprobado":8500,"CupoUtilizado":1627.99,"CupoDisponible":6872.01,"CupoAprobadoEspecial":0,"CupoUtilizadoEspecial":0,"CupoDisponibleEspecial":0,"CupoUtilizadoAvance":0,"FechaUltimoCorte":"2021-07-01T00:00:00","FechaUltimoVcto":"2021-07-06T00:00:00","FechaUltimoPago":"2021-07-03T00:00:00","SaldoPagoTotal":0,"SaldoPagoMinimo":0,"CupoAprobadoTotal":8500,"CupoUtilizadoTotal":1627.99,"CupoDisponibleTotal":6872.01,"CupoAprobadoSuperAvance":0,"CupoUtilizadoSuperAvance":0,"CupoDisponibleSuperAvance":0,"IdPosConsolidada":1,"RecSaldoPtos":0,"RecPtosGanados":0,"RecPtosCanjeados":0,"RecTotalPtosAcumulados":0,"RecAfiliado":false,"Moneda":"GTQ","Cotizacion":1,"EsPropia":false}],"CreditosCliente":[],"EstadosTarjetasVisaCliente":null},"SessionToken":{"SessionId":"IdDispositivoSimuladorPortalesOdXyB2lpJz","FechaSession":"2021/11/04","HoraSession":"09:57"},"FechaActividadApp":"2021-11-04T14:57:58.099Z","ProductosCliente":[{"IdProducto":1,"CodigoProducto":"CTA","NombreProducto":"CUENTAS"},{"IdProducto":2,"CodigoProducto":"TRJ","NombreProducto":"TARJETAS"}],"FechaHoraUltimoAccesoMostrar":"2021-07-14T23:03:25.000Z"}');
    

    params.id = { controlAcceso : SesionMovil.ControlAccesoGlobal }

    var groupValidation = "REGUSRPASS";
    var controlAcceso = params.id.controlAcceso;
    var contextoCliente = SesionMovil ? SesionMovil.ContextoCliente : params.id.contextoCliente;
    var regexNoCaracteresEspeciales = /^[A-Za-z0-9À-ÿ\u00f1\u00d1]*[A-Za-z0-9À-ÿ\u00f1\u00d1][A-Za-z0-9À-ÿ\u00f1\u00d1]*$/;
    var UserNameOK = false;
    var cumpleLetras = false;
    var cumpleMin = false;
    var cumpleEspecial = false;
    var cumpleNumYLetras = false;

    var viewModel = {
        koClaveNueva: ko.observable(""),
        viewShown: function () {
            setupFloatButton(classButtons.Accept, siguiente, undefined, undefined, undefined, undefined, groupValidation);
            var deviceVersion = parseInt(DeviceInfo.DeviceVersion.replace(".", "").substring(0, 2));

            var options = {};
            options.ui = {
                bootstrap3: true,
                showErrors: true,
                showProgressBar: true,
                showVerdictsInsideProgressBar: true,
            };
            options.rules = {
                activated: {
                    wordTwoCharacterClasses: true,
                    wordMinLength: true,
                    wordOneSpecialChar: true,
                    wordLetterNumberCombo: true
                }
            };
            $('#txtClaveNueva').pwstrength(options);

            if (deviceType === 'Android') {
                if (deviceVersion < 44 && deviceVersion != 9 && deviceVersion != 10 && deviceVersion != 11) {
                    $("#txtNombreUsuario").bind('keyup', HandleUsuario);
                    $("#txtClaveNueva").bind('keyup', valClaveNueva);
                }
                else {
                    $("#txtNombreUsuario").bind('input', HandleUsuario);
                    $("#txtClaveNueva").bind('input', valClaveNueva);
                }
            }
            else {
                $("#txtNombreUsuario").bind('keyup', HandleUsuario);
                $("#txtClaveNueva").bind('keyup', valClaveNueva);

            }
        },
        viewShowing: function () {
            hideFloatButtons();
        },
        txtNombreUsuario: setupTextBoxControl('', 16, undefined, typeLetter.upper, undefined, false, undefined),
        txtClaveAntigua: setupTextPasswordControl('', 64, 'Clave Antigua'),
        txtClaveNueva: setupTextPasswordControl('', 64, 'Clave Nueva'),
        comparisonTarget: function () {
            let valComp = $('#txtClaveNueva').val();
            if (valComp) {
                return valComp;
            }
        },
        txtConfirmaClaveNueva: setupTextPasswordControl('', 64, ''),
        ttUserTaken: {
            target: "#noValidIcon",
            showEvent: "click",
            hideEvent: "mouseleave",
            closeOnOutsideClick: true,
            position: "bottom",
            width: 200,
            contentTemplate: function (data, itm, el) {
                let content = '<div style=" text-align: justify; white-space: pre-wrap;background-color:white">' +
                    '<b style="color:#d52133;font-weight:900">¡Alerta!</b>' +
                    '<div style="color:#333; white-space: pre-wrap;">' +
                    'Este nombre de usuario no está disponible.</div>' +
                    '</div>'
                return content;
            }
        },
        groupValidation: groupValidation
    };

    viewModel.txtNombreUsuario.onFocusOut = function (params) {
        let value = $('#txtNombreUsuario').dxTextBox('option', 'value');
        if (value.length >= 6)
            ConsultarControlAcceso(value, function (data) {
                if (data) {
                    $('#validIcon').hide();
                    $('#noValidIcon').show();
                    //$('#ttUserTaken').dxTooltip('option', 'visible', true);
                    $('#alertUserName').show();
                    UserNameOK = false;
                }
                else {
                    $('#alertUserName').hide();
                    $('#validIcon').show();
                    $('#noValidIcon').hide();
                    $('#txtNombreUsuario').removeClass('userNameTaken');
                    UserNameOK = true;
                }
            });
        else {
            $('#validIcon').hide();
            $('#noValidIcon').show();
            //$('#ttUserTaken').dxTooltip('option', 'visible', true);
            UserNameOK = false;
        }
    }

    function HandleUsuario(e) {
        var value = e.target.value;
        var result = regexNoCaracteresEspeciales.test(value);
        if (!result || value.length > 16) {
            let newVal = value.substring(0, value.length - 1);
            e.target.value = newVal;
            $("#txtNombreUsuario").dxTextBox('option', 'value', newVal);
        }
    }

    function valClaveNueva(e) {
        cumpleLetras = $("#txtClaveNueva").pwstrength("ruleIsMet", "wordTwoCharacterClasses");
        cumpleMin = $("#txtClaveNueva").pwstrength("ruleIsMet", "wordMinLength");
        cumpleEspecial = $("#txtClaveNueva").pwstrength("ruleIsMet", "wordOneSpecialChar");
        cumpleNumYLetras = $("#txtClaveNueva").pwstrength("ruleIsMet", "wordLetterNumberCombo");
        if (cumpleLetras && cumpleMin && cumpleEspecial && cumpleNumYLetras)
            $(".claveNuevaInvalid").hide();
        else
            $(".claveNuevaInvalid").show();
    }

    function siguiente(params) {
        var result = params.validationGroup.validate();
        valClaveNueva(undefined);

        if (result.isValid) {
            if (!cumpleLetras) {
                return showSimpleMessage(CORE_TAG('DefaultTitle'), "Mezcla diferentes clases de caracteres", undefined);
            }
            if (!cumpleMin) {
                return showSimpleMessage(CORE_TAG('DefaultTitle'), 'Tu contrase&ntilde;a es muy corta (8)', undefined);
            }
            if (!cumpleEspecial) {
                return showSimpleMessage(CORE_TAG('DefaultTitle'), "Tu contrase&ntilde;a necesita 1 caracter especial (&#161;) (!) (#) ($) (%) (&) (/) (@) (*) (-) (+)", undefined);
            }
            if (!cumpleNumYLetras) {
                return showSimpleMessage(CORE_TAG('DefaultTitle'), 'Tu contrase&ntilde;a necesita Letras y N&#250;mero', undefined);
            }

            if (!UserNameOK) {
                return showSimpleMessage(CORE_TAG('DefaultTitle'), 'El Nombre de Usuario que seleccionaste no está disponible', undefined);
            }
            let grabarControlAcceso = {
                NombreUsuario: $("#txtNombreUsuario").dxTextBox('option', 'value'),
                TipoIdentificacion: contextoCliente.TipoDocumento,
                NumeroIdentificacion: contextoCliente.NumeroDocumento,
                CambiarNombreUsuario: true,
                CambiarNombreUsuario: false,
                Canal: "MOVIL",
                CanalUltimoAcceso: "MOVIL",
                NumeroCelularRegistrado: controlAcceso.NumeroCelularRegistrado,
                CorreoElectronicoRegistrado: controlAcceso.CorreoElectronicoRegistrado,
                CodigoNotificacion: 1,
                EsCreacion: false,
                ConsultaPorIdentificacion: true,
                InfoNotificacionProvista: controlAcceso.InfoNotificacionRequerida,
                EsActivo: controlAcceso.EsActivo,
                IdControlAcceso: controlAcceso.IdControlAcceso,
                InfoNotificacionRequerida: controlAcceso.InfoNotificacionRequerida,
            };
            let claveAntigua = $("#txtClaveAntigua").dxTextBox('option', 'value').toUpperCase();
            let claveNuevaConf = $("#txtConfirmaClaveNueva").dxTextBox('option', 'value').toUpperCase();
            RegistrarUsuarioCambioClave(grabarControlAcceso, contextoCliente, claveAntigua, claveNuevaConf, function (data) {
                if (data) {
                    showSimpleMessage(CORE_TAG('DefaultTitle'), 'Hemos registrado con éxito tu Nombre de Usuario y Contraseña, utilízalos en el próximo acceso a tu Banca en Línea', function () {
                        MobileBanking_App.app.navigate('LandingPage', { root: true });
                    })

                }
            });
        }
    }

    return viewModel;
};