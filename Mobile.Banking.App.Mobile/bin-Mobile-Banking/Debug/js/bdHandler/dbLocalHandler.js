var LocalEntity = {
    id: 0,
    APN_GCM_Token: "",
    registeredDevice: 0,//0-1
}

var getLocalEntity = function () {
    try {
        DataBaseBancaMovil.transaction(function (tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS LocalEntity (id integer primary key,APN_GCM_Token text,registeredDevice integer)');
            tx.executeSql("select * from LocalEntity;", [], function (tx, res) {
                if (res.rows.length === 1) {
                    MobileBanking_App.app.navigate('RequestPIN', { root: true });
                    LocalEntity = { Coleccion: [] };
                    LocalEntity.Coleccion.push(res.rows.item(0));
                }
                else {
                    MobileBanking_App.app.navigate('RegisterUser', { root: true });
                }
            });
        }, function (e) {
            console.log("ERROR: " + e.message);
        });
    } catch (e) {

    }
}

var SaveLocalEntity = function () {
    try {
        DataBaseBancaMovil.transaction(function (tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS LocalEntity (id integer primary key,APN_GCM_Token text,registeredDevice integer)');
            tx.executeSql("select * from LocalEntity;", [], function (tx, res) {
                if (res.rows.length < 1) {
                    tx.executeSql("INSERT INTO LocalEntity (APN_GCM_Token ,registeredDevice ) VALUES (?,?)", [TokenAPN_GCM, 1], function (tx, res) {
                        console.log("insertId: " + res.insertId + " -- probably 1");
                        console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");
                        DataBaseBancaMovil.transaction(function (tx) {
                            tx.executeSql("select * from LocalEntity;", [], function (tx, res) {
                                console.log("res.rows.length: " + res.rows.length + " -- should be 1");
                                console.log("res.rows.item(0).id: " + res.rows.item(0).id);
                                console.log("res.rows.item(0).APN_GCM_Token: " + res.rows.item(0).APN_GCM_Token);
                                console.log("res.rows.item(0).registeredDevice: " + res.rows.item(0).registeredDevice);
                                LocalEntity = { Coleccion: [] };
                                LocalEntity.Coleccion.push(res.rows.item(0));
                            });
                        });
                    }, function (e) {
                        console.log("ERROR: " + e.message);
                    });
                }
                else {
                    LocalEntity = { Coleccion: [] };
                    LocalEntity.Coleccion.push(res.rows.item(0));
                }
            });
        });
    } catch (e) { }

}

var TaskAfterSavingCurrentUserInServer = function (serverResponse) {
    try {
        if (serverResponse === true) {
            DataBaseBancaMovil.transaction(function (tx) {
                tx.executeSql('DROP TABLE IF EXISTS user');
            }, function (e) {
                console.log("ERROR: " + e.message);
            });
            SaveLocalEntity();
        }
    } catch (e) {

    }
}

function BorrarContenidoBaseLocalEntity() {
    try {
        DataBaseBancaMovil.transaction(function (tx) {
            tx.executeSql('DROP TABLE IF EXISTS LocalEntity');
        }, function (e) {
            console.log("ERROR: " + e.message);
        });

    } catch (e) {

    }
}

var DeleteLocalUserAndSaveItInServer = function (localUserToBeDeleted) {
    try {
        var documentType = localUserToBeDeleted.documentType;
        var documentNumber = localUserToBeDeleted.documentNumber;
        var clientId = localUserToBeDeleted.clientId;
        var username = localUserToBeDeleted.username;
        var accessPIN = localUserToBeDeleted.accessPIN;
        var usersPassWord = localUserToBeDeleted.usersPassWord;
        var names = localUserToBeDeleted.names;
        var userMail = localUserToBeDeleted.userMail;
        var phoneNumber = localUserToBeDeleted.userPhoneNumber;
        SaveUserInServerAppBancaMobile(true,documentType, documentNumber, names, userMail, phoneNumber, clientId, username, accessPIN, usersPassWord, TaskAfterSavingCurrentUserInServer);
    } catch (e) {

    }
}



var SaveTestUser = function () {
    userEntity = {
        documentType: "CED",
        documentNumber: "1312413667",
        userMail: "miguel.altamirano@portalesit.net",
        userPhoneNumber: "0992629386",
        clientId: "0123456",
        username: "USER04",
        accessPIN: "1234",
        usersPassWord: "ABC123",
        names: "EDGARDO ESTUARDO FLORES LEON",
        lastNames: "FLORES LEON"
    };
    InsertUser(userEntity);
}

var SaveTestLocal = function () {
    LocalEntity = {
        APN_GCM_Token: "AQUI VA EL TOKEN PUSH",
        registeredDevice: 1,//0-1
    }
    SaveLocalEntity(SaveTestLocal);
}