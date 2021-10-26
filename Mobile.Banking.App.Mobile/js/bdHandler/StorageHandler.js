var DataBaseBancaMovil;
var DataBaseName = "my.db";

var OpenDataBase = function () {
    DataBaseBancaMovil = window.sqlitePlugin.openDatabase({ name: DataBaseName, location: 1 });
}