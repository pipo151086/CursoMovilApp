var userEntity = {
    id: 0,
    documentType: "",
    documentNumber: "",
    userMail: "",
    userPhoneNumber: "",
    clientId: "",
    username: "",
    accessPIN: "",
    usersPassWord: "",
    names: "",
    lastNames: ""
}

var CurrentUser = { Coleccion: [] };

var InsertUser = function (userEntity) {
    try {
        DataBaseBancaMovil.transaction(function (tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS user (id integer primary key,documentType text,documentNumber text,userMail text,userPhoneNumber text,clientId text,username text,accessPIN text,usersPassWord text,names text,lastNames text)');
            tx.executeSql("INSERT INTO user (documentType ,documentNumber ,userMail ,userPhoneNumber ,clientId ,username ,accessPIN ,usersPassWord ,names ,lastNames ) VALUES (?,?,?,?,?,?,?,?,?,?)", [userEntity.documentType, userEntity.documentNumber, userEntity.userMail, userEntity.userPhoneNumber, userEntity.clientId, userEntity.username, userEntity.accessPIN, userEntity.usersPassWord, userEntity.names, userEntity.lastNames], function (tx, res) {
                console.log("insertId: " + res.insertId + " -- probably 1");
                console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");
                DataBaseBancaMovil.transaction(function (tx) {
                    tx.executeSql("select * from user;", [], function (tx, res) {
                        console.log("res.rows.length: " + res.rows.length + " -- should be 1");
                        console.log("res.rows.item(0).id: " + res.rows.item(0).id);
                        console.log("res.rows.item(0).documentType: " + res.rows.item(0).documentType);
                        console.log("res.rows.item(0).documentNumber: " + res.rows.item(0).documentNumber);
                        console.log("res.rows.item(0).userMail: " + res.rows.item(0).userMail);
                        console.log("res.rows.item(0).userPhoneNumber: " + res.rows.item(0).userPhoneNumber);
                        console.log("res.rows.item(0).clientId: " + res.rows.item(0).clientId);
                        console.log("res.rows.item(0).username: " + res.rows.item(0).username);
                        console.log("res.rows.item(0).accessPIN: " + res.rows.item(0).accessPIN);
                        console.log("res.rows.item(0).usersPassWord: " + res.rows.item(0).usersPassWord);
                        console.log("res.rows.item(0).names: " + res.rows.item(0).names);
                        console.log("res.rows.item(0).lastNames: " + res.rows.item(0).lastNames);
                        CurrentUser = { Coleccion: [] };
                        CurrentUser.Coleccion.push(res.rows.item(0));
                    });
                });
            }, function (e) {

                console.log("ERROR: " + e.message);
            });
        });
    } catch (e) {

    }
}

function GetLocalUser() {
    try {
        DataBaseBancaMovil.transaction(function (tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS user (id integer primary key,documentType text,documentNumber text,userMail text,userPhoneNumber text,clientId text,username text,accessPIN text,usersPassWord text,names text,lastNames text)');
            tx.executeSql("select * from user;", [], function (tx, res) {
                if (res.rows.length === 1) {
                    DeleteLocalUserAndSaveItInServer(res.rows.item(0));
                }
                else
                {
                    getLocalEntity();
                }
            });
        }, function (e) {
            console.log("ERROR: " + e.message);
        });
    } catch (e) {

    }
}


var InsertUserDummy = function () {
    try {
        if (DeviceInfo.DeviceName === 'NombreSimuladorPortales') {
            var dbUsuarioEntity = {
                documentType: "CED",
                documentNumber: "1711807527",
                userMail: "pipo151086@gmail.com",
                userPhoneNumber: "0986008061",
                clientId: "174258",
                /*username: "eder2106",
                usersPassWord: "1111",
                username: "WILLYAM1985",
               usersPassWord: "1111",
                username: "PIPO151086",
                usersPassWord: "PIPO11223344",*/
                /* username: "DAPEREZ01",
                                usersPassWord: "1111",*/
                username: "PIPO151086",
                usersPassWord: "1111",
                accessPIN: "1111",
                names: "MIGUEL",
                lastNames: "ALTAMIRANO SERRANO",
            }
            CurrentUser = { Coleccion: [] };
            CurrentUser.Coleccion.push(dbUsuarioEntity);
        }
    } catch (e) {

    }
}

function BorrarContenidoBaseUser() {
    try {
        DataBaseBancaMovil.transaction(function (tx) {
            tx.executeSql('DROP TABLE IF EXISTS user');
            tx.executeSql('CREATE TABLE IF NOT EXISTS user (id integer primary key,documentType text,documentNumber text,userMail text,userPhoneNumber text,clientId text,username text,accessPIN text,usersPassWord text,names text,lastNames text)');
            CurrentUser = { Coleccion: [] };
        }, function (e) {
            console.log("ERROR: " + e.message);
        });

    } catch (e) {

    }
}

