Function.prototype.handlerError = function (data) {
    var isOK = true;
    if (data) {
        if (data.TransactionResponseCode && data.TransactionResponseCode === '0')
            data.TransactionResponseCode = "00";
        if (data.TransactionResponseCode && data.TransactionResponseCode != '00') {
            var codeMessage = data.TransactionResponseCode;
            if (data.esRegistro != undefined && data.esRegistro == false) {
                if (codeMessage == "93" || codeMessage == "963" || codeMessage == "114" || codeMessage == "MB097" || codeMessage == "MB098" || codeMessage == "MB099" || codeMessage == "MB093")
                    codeMessage = codeMessage + 'PIN';
                else
                    codeMessage = "503";
                data.TransactionResponseCode = codeMessage;
            }
            if (data.esRegistro == true) {
                codeMessage = "REG" + codeMessage;
                data.TransactionResponseCode = codeMessage;
                if (data.ResponseElements) {
                    if (data.ResponseElements.validationType === 'PIN' || data.ResponseElements.validationType === 'BIO') {
                        data.TransactionResponseCode = "CAMBIOCTA_" + data.TransactionResponseCode;
                        codeMessage = data.TransactionResponseCode;
                    }
                }
            }
            if (data.TransactionResponseCode.includes("CRE")) {
                showErrorMessage(CORE_TAG('DefaultTitle'), data.ResponseElements, function () { NormalErrorHandler(data) });
            } else {
                showErrorMessage(CORE_TAG('DefaultTitle'), CORE_MESSAGE(codeMessage), function () { NormalErrorHandler(data) });
            }
            isOK = false;
        }
    }

    return isOK;
}


function NormalErrorHandler(data) {
    var codeMessage = data.TransactionResponseCode;
    if (data.esRegistro != undefined && data.esRegistro == false && (codeMessage == "93PIN" || codeMessage == "963PIN")) {
        BorrarContenidoBaseUser();
        MobileBanking_App.app.navigate("LandingPage", { root: true });
    } else {
        switch (data.TransactionResponseCode) {
            case '963':
                if ($('#txtClave').dxTextBox('instance')) {
                    changePropertyControl('#txtClave', typeControl.TextBox, 'value', undefined);
                    $('#txtClave').dxTextBox('instance').focus();
                }
                if ($('#otp').dxTextBox('instance')) {
                    changePropertyControl('#otp', typeControl.TextBox, 'value', undefined);
                    changePropertyControl('#btn0', typeControl.Button, 'disabled', false);
                    changePropertyControl('#btn1', typeControl.Button, 'disabled', false);
                    changePropertyControl('#btn2', typeControl.Button, 'disabled', false);
                    changePropertyControl('#btn3', typeControl.Button, 'disabled', false);
                    changePropertyControl('#btn4', typeControl.Button, 'disabled', false);
                    changePropertyControl('#btn5', typeControl.Button, 'disabled', false);
                    changePropertyControl('#btn6', typeControl.Button, 'disabled', false);
                    changePropertyControl('#btn7', typeControl.Button, 'disabled', false);
                    changePropertyControl('#btn8', typeControl.Button, 'disabled', false);
                    changePropertyControl('#btn9', typeControl.Button, 'disabled', false);
                    changePropertyControl('#btnClear', typeControl.Button, 'disabled', false);
                    changePropertyControl('#btnClearAll', typeControl.Button, 'disabled', false);
                }
                break;
            case '114PIN':
            case '114':
                if (data.TransactionCode == '31' || data.TransactionCode == '02') {
                    changePropertyControl('#txtUsuario', typeControl.TextBox, 'disabled', true);
                    changePropertyControl('#txtClave', typeControl.TextBox, 'disabled', true);
                    //MobileBanking_App.app.navigate("RequestPIN/Login", { root: true });
                    MobileBanking_App.app.navigate("LandingPage", { root: true });
                } else {
                    if (data.TransactionCode != '11')
                        MobileBanking_App.app.navigate("PosicionConsolidada", { root: true });
                    else
                        MobileBanking_App.app.back();
                }
                break;
            case '93PIN':
            case '93':
                if ($('#txtUsuario').dxTextBox('instance'))
                    $('#txtUsuario').dxTextBox('instance').focus();
                break;
            case '1214':
                MobileBanking_App.app.navigate('TransferenciasInternas', { root: true });
                break;

            case '2':
            case '709':
            case '521':
            case '1213':
            case '1215':
            case '1216':
            case '16':
            case '517':
            case '217':
            case '721':
            case '554':
            case '94':
            case '369':
            case '711':
            case '614':
            case '001525':
            case '001526':
            case '001527':
            case '001528':
            case '001529':
            case '001530':
            case '001531':
            case '001532':
            case '001533':
            case '001534':
            case '001535':
            case '001536':
            case '001537':
            case '002001':
            case '002002':
            case '002003':
            case '002004':
            case '002005':
            case '002006':
            case '002007':
            case '002008':
            case '002009':
            case '002010':
            case '002011':
            case '002012':
            case '002013':
            case '002014':
            case '002015':
            case '002016':
            case '002017':
            case '002018':
            case '002019':
            case '002020':
            case '002023':
            case '002024':
            case '002025':
            case '370':
            case '952':
            case '638':
            case '370':
            case '789':
            case 'MB092':
            case "MB103":
            case "MB101":
            case 'VISANET01':
            case 'VISANET02':
            case 'VISANET05':
            case 'VISANET13':
            case 'VISANET19':
            case 'VISANET31':
            case 'VISANET35':
            case 'VISANET36':
            case 'VISANET37':
            case 'VISANET38':
            case 'VISANET41':
            case 'VISANET43':
            case 'VISANET51':
            case 'VISANET57':
            case 'VISANET58':
            case 'VISANET65':
            case 'VISANET89':
            case 'VISANET91':
            case 'VISANET94':
            case 'VISANET96':
            case '950':
            case '939':
            case 'TRJPAG92':
            case "941":
                MobileBanking_App.app.navigate('PosicionConsolidada', { root: true });
                break;
            case '440':
                if (data.TransactionCode == '06') {
                    $('#txtNumeroCta').dxTextBox('option', 'value', undefined);
                    $('#txtNumeroCta').dxTextBox('instance').focus();
                }
                break;
            case '834':
            case 'REG834':
            case 'CAMBIOCTA_REG834':
                data.ResponseElements.contextoCliente.PasswordClaro = pinValue;
                data.ResponseElements.contextoCliente.NombreCadena = data.ResponseElements.dtoResultadoConsultaControlAcceso.NombreUsuario;
                MobileBanking_App.app.navigate({ view: 'CambiarClaveAcceso', id: data.ResponseElements.contextoCliente });
                break;
            case "MB097PIN":
            case "REGMB097":
            case "MB097": //Pin Incorrecto
                document.getElementById("charVacio1").setAttribute('class', 'img-char-pin-vacio');
                document.getElementById("charVacio2").setAttribute('class', 'img-char-pin-vacio');
                document.getElementById("charVacio3").setAttribute('class', 'img-char-pin-vacio');
                document.getElementById("charVacio4").setAttribute('class', 'img-char-pin-vacio');
                $('#txtNumberPIN').val('');
                $('#txtNumberPIN').focus();
                pinValue = '';
                break;
           
            case '366':
            case 'MB093':
            case "CRE521":
            case "CRE2":
            case "CRE16":
            case "CRE91":
                return MobileBanking_App.app.navigate("LandingPage", { root: true });
                break;
            case "91":
                $('#spnMensaje').text("Ha ocurrido un error al momento de realizar la transacción. Por favor inténtalo más tarde");
                break;
            case '99':
            case '191':
            case '308':
            case '203':
            case '1135':
            case '1168':
            case "AKI30":
            case "AKI99":
            case 'AKI1135':
            case 'AKI1137':
            case 'AKI1138':
            case 'AKI1139':
            case 'AKI1141':
            case 'AKI1142':
            case 'AKI1143':
            case 'AKI1144':
            case 'AKI1146':
            case 'AKI1148':
            case 'AKI1149':
            case 'AKI1151':
            case 'AKI1152':
            case 'AKI1153':
            case 'AKI1154':
            case 'AKI1155':
            case 'AKI1156':
            case 'AKI1157':
            case 'AKI1158':
            case 'AKI1159':
            case 'AKI1160':
            case 'AKI1161':
            case 'AKI1162':
            case 'AKI1163':
            case 'AKI1164':
            case 'AKI1165':
            case 'AKI1166':
            case 'AKI1167':
            case 'AKI1170':
            case 'AKI1171':
            case 'AKI1172':
            case 'AKI1173':
            case 'AKI1174':
            case 'AKI1175':
            case 'AKI1176':
            case 'AKI1177':
            case 'AKI1178':
            case 'AKI1179':
            case 'AKI1180':
            case 'AKI1181':
            case 'AKI1182':
            case 'AKI1183':
            case 'AKI1184':
            case 'AKI1185':
            case 'AKI1186':
            case 'AKI1187':
            case 'AKI1188':
            case 'AKI1189':
            case 'AKI1190':
            case 'AKI1191':
            case 'AKI1192':
            case 'AKI1193':
            case 'AKI1194':
            case 'AKI1195':
            case 'AKI1196':
            case 'AKI1197':
            case 'AKI1198':
            case 'AKI1199':
            case 'AKI957':
            case '202':
            case 'REG202':
            case "ICG145":
                //NO HACER NADA    ----> PERMANECER EN PANTALLA
                break;

            case 'REG963':
            case 'REG964':
            case 'REG114':
                return MobileBanking_App.app.navigate("LandingPage", { root: true });
                break;
            case "REGMB2000":
                MobileBanking_App.app.navigate({
                    view: 'RegUsrPass', id: {
                        controlAcceso: data.ResponseElements.dtoResultadoConsultaControlAcceso,
                        contextoCliente: data.ResponseElements.contextoCliente
                    }
                });
                break;
            case "UnAuthorized_401":
                Parameters.JWT = "";
                endSession();
                var leftMenu = document.getElementById('menuInicialMovil');
                if (leftMenu)
                    leftMenu.innerHTML = '';
                $('#header-fixed').hide();
                $('.header-clear').hide();
                MobileBanking_App.app.navigate('LandingPage', { root: true });
                break;

            case 'CAMBIOCTA_REG93':
            case 'CAMBIOCTA_REG963':
            case 'CAMBIOCTA_REG964':
            case 'CAMBIOCTA_REG114':
            case 'MB099PIN':
            case 'MB098PIN':
            case 'MB093PIN':
            case 'REGMB093':
            case 'REGMB093PIN':
            case '963PIN':
            case 'MB098':
            case "REGMB098":
            case "REGMB099PIN":
            case "REGMB099":
            case 'MB099':
                if (data.ResponseElements.validationType === "PIN" || data.ResponseElements.validationType === "BIO" ||
                    data.TransactionResponseCode === 'REGMB093' || data.TransactionResponseCode === "REGMB098" ||
                    data.TransactionResponseCode === "REGMB099") {
                    return upCredentialUsageEntity(1, 0, 0, function (res) {
                        if (MobileBanking_App.app.navigationManager.currentStackKey === 'LandingPage') {
                            $('#HuellaBtn').dxButton('option', 'disabled', true);
                            $('#PinBtn').dxButton('option', 'disabled', true);
                        }
                        else {
                            MobileBanking_App.app.navigate("LandingPage", { root: true });
                        }
                    });
                }
                break;
            default:
                MobileBanking_App.app.navigate('LandingPage', { root: true });
                break;
        }
    }

}
