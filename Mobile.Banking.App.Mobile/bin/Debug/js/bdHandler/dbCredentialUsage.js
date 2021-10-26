var CredentialUsageEntity = {
    id: 0,
    cred: 0,
    bio: 0,
    pin: 0,
};

var getCredentialUsageEntity = function (addFunction) {
    try {
        if (!DeviceInfo.DevicePlatform.contains('Simulador')) {
            DataBaseBancaMovil.transaction(function (tx) {
                tx.executeSql('CREATE TABLE IF NOT EXISTS CredentialUsageEntity (id integer primary key, cred integer, bio integer, pin integer)');
                tx.executeSql("select * from CredentialUsageEntity;", [], function (tx, resGet) {
                    if (resGet.rows.length === 1) {
                        return addFunction(resGet.rows._array[0]);
                    }
                    else if (resGet.rows.length < 1) {
                        tx.executeSql("INSERT INTO CredentialUsageEntity (cred, bio, pin) VALUES (?,?,?)", [1, 1, 1], function (txIns, resIns) {
                            return addFunction({
                                id: 0,
                                cred: 1,
                                bio: 1,
                                pin: 1
                            });
                        });
                    }
                });
            }, function (e) {
                console.log("ERROR: " + e.message);
            });
        }
        else {
            return addFunction({
                id: 0,
                cred: 1,
                bio: 1,
                pin: 1
            });
        }
    } catch (e) {

    }
};

var upCredentialUsageEntity = function (cred, bio, pin, addFunction) {
    if (!DeviceInfo.DevicePlatform.contains('Simulador')) {
        DataBaseBancaMovil.transaction(function (tx) {
            tx.executeSql("select * from CredentialUsageEntity;", [], function (tx, resGet) {
                let credLocal = resGet.rows._array[0];
                tx.executeSql("update CredentialUsageEntity set cred = ?, bio = ?, pin = ? where id = ?", [cred, bio, pin, credLocal.id], function (tx, resUp) {
                    if (resGet.rows.length === 1)
                        return addFunction(true);
                    return addFunction(false);
                });
            });
        });
    }
    else {
        return addFunction(true);
    }
}