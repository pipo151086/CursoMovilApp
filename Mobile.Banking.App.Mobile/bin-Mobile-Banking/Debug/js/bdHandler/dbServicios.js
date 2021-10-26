var GlobalOps = [];
var OperationEasyCash = {
    id: 0,
    AccountFee: 0,
    CardFee: 0,
    OperationID: "",
    Code: "",
    Description: "",
    Contract: "",
    IsActive: "",
    Content: "",
    CategoryID: "",
    CategoryName: "",
    EnterpriseID: "",
    EnterpriseName: "",
    Version: ""
}


var queryCreate = 'CREATE TABLE IF NOT EXISTS OperationEasyCash (' +
    'id integer primary key AUTOINCREMENT,' +
    'AccountFee text,' +
    'CardFee text,' +
    'OperationID text,' +
    'Code text,' +
    'Description text,' +
    'Contract text,' +
    'IsActive text,' +
    'Content text,' +
    'CategoryID text,' +
    'CategoryName text,' +
    'EnterpriseID text,' +
    'EnterpriseName text,' +
    'Version text)';

var queryInsert = 'INSERT INTO OperationEasyCash (' +
    'AccountFee ,' +
    'CardFee ,' +
    'OperationID ,' +
    'Code ,' +
    'Description ,' +
    'Contract ,' +
    'IsActive ,' +
    'Content ,' +
    'CategoryID ,' +
    'CategoryName ,' +
    'EnterpriseID ,' +
    'EnterpriseName ,' +
    'Version '
    + ') VALUES (' +
    '?,?,?,?,?,?,?,?,?,?,' +
    '?,?,?)';

var queryUpdate = 'UPDATE OperationEasyCash set ' +
    'AccountFee = ? ,' +
    'CardFee = ?,' +
    'Code = ?, ' +
    'Description = ?, ' +
    'Contract = ?, ' +
    'IsActive = ?, ' +
    'Content = ?, ' +
    'CategoryID = ?,' +
    'CategoryName = ?,' +
    'EnterpriseID = ?,' +
    'EnterpriseName = ?,' +
    'Version = ? ' +
    'where OperationID = ?';


var queryGetOperationByEnterpriseAndCategory = 'select * from OperationEasyCash where EnterpriseID = ? and CategoryID = ?';

var queryGetOperationByContractID = 'select * from OperationEasyCash where Contract = ?';

var queryGetOperationByOperationID = 'select * from OperationEasyCash where OperationID = ?';

var queryAllOperationsAndVersion = 'select OperationID, Version from OperationEasyCash';

var queryDeleteOperation = 'Delete from OperationEasyCash where OperationID = ?';

var UpdateOperationByOperationID = function (operationEasyCash, action) {
    try {
        DataBaseBancaMovil.transaction(function (tx) {
            tx.executeSql(queryUpdate, [
                operationEasyCash.AccountFee,
                operationEasyCash.CardFee,
                operationEasyCash.Code,
                operationEasyCash.Description,
                operationEasyCash.Contract,
                operationEasyCash.IsActive,
                operationEasyCash.Content,
                operationEasyCash.CategoryID,
                operationEasyCash.CategoryName,
                operationEasyCash.EnterpriseID,
                operationEasyCash.EnterpriseName,
                operationEasyCash.Version,
                operationEasyCash.OperationID
            ], function (tx, res) {
                console.log("UpdateOperationByOperationID insertId: " + res.insertId + " -- probably 1");
                if (action) {
                    action();
                }
            }, function (e) {
                console.log("ERROR UpdateOperationByOperationID: " + e.message);
            });
        });
    } catch (e) {
        console.log("ERROR UpdateOperationByOperationID: " + e.message);
    }
}

var InsertOperation = function (operationEasyCash, action) {
    try {
        DataBaseBancaMovil.transaction(function (tx) {
            tx.executeSql(queryCreate);
            tx.executeSql(queryInsert, [
                operationEasyCash.AccountFee,
                operationEasyCash.CardFee,
                operationEasyCash.OperationID,
                operationEasyCash.Code,
                operationEasyCash.Description,
                operationEasyCash.Contract,
                operationEasyCash.IsActive,
                operationEasyCash.Content,
                operationEasyCash.CategoryID,
                operationEasyCash.CategoryName,
                operationEasyCash.EnterpriseID,
                operationEasyCash.EnterpriseName,
                operationEasyCash.Version
            ], function (tx, res) {
                console.log("InsertOperation insertId: " + res.insertId + " -- probably 1");
                console.log("InsertOperation rowsAffected: " + res.rowsAffected + " -- should be 1");
                if (action) {
                    action();
                }
            }, function (e) {
                console.log("ERROR InsertOperation: " + e.message);
            });
        });
    } catch (e) {
        console.log("ERROR InsertOperation: " + e.message);
    }
}

var queryGetAllEnterprisesAndCategories = 'Select distinct EnterpriseID, EnterpriseName, CategoryID, CategoryName from OperationEasyCash';

var queryGetAllEnterprises = 'Select distinct EnterpriseID, EnterpriseName, CategoryID from OperationEasyCash';

var queryGetAllCategories = 'Select distinct CategoryID, CategoryName from OperationEasyCash';

var GetAllEnterprisesAndCategories = function (action) {
    try {
        var repuesta = {
            Categorias: [],
            Empresas: [],
            PagosFrecuentes: []
        }
        if (DeviceInfo.DevicePlatform.contains('Simulador')) {
            repuesta.Categorias = [
                        { CategoryID: "001", CategoryName: "LUZ" },
                        { CategoryID: "002", CategoryName: "AGUA POTABLE" },
                        { CategoryID: "003", CategoryName: "TELEFONO, INTERNET Y TV" },
                        { CategoryID: "004", CategoryName: "MUNICIPIOS" },
                        { CategoryID: "005", CategoryName: "SRI" },
                        { CategoryID: "006", CategoryName: "IESS" },
                        { CategoryID: "007", CategoryName: "VENTA POR CATÁLOGO" },
            ];
            repuesta.Empresas = [
                       { CategoryID: "001", EnterpriseID: "001", EnterpriseName: "Eléctrica Quito" },
                       { CategoryID: "001", EnterpriseID: "002", EnterpriseName: "Eléctrica Guayaquil" },
                       { CategoryID: "002", EnterpriseID: "003", EnterpriseName: "Intergaua" },
                       { CategoryID: "002", EnterpriseID: "004", EnterpriseName: "EMAP" },
                       { CategoryID: "003", EnterpriseID: "005", EnterpriseName: "Claro" },
                       { CategoryID: "003", EnterpriseID: "006", EnterpriseName: "Netlife" },
                       { CategoryID: "004", EnterpriseID: "007", EnterpriseName: "Municipio Quito" },
                       { CategoryID: "004", EnterpriseID: "008", EnterpriseName: "Municipio Gye" },
                       { CategoryID: "007", EnterpriseID: "009", EnterpriseName: "Yanbal" },
                       { CategoryID: "007", EnterpriseID: "010", EnterpriseName: "Oriflame" },
                       { CategoryID: "007", EnterpriseID: "011", EnterpriseName: "AVON" },
            ];
            repuesta.PagosFrecuentes = [
                    { idContrato: 1, campos: {}, Id: "001", CategoryName: "LUZ", CategoryID: "001", EnterpriseName: "Eléctrica Quito", EnterpriseID: "001", descripcion: "Pago luz mamá" },
                    { idContrato: 2, campos: {}, Id: "002", CategoryName: "LUZ", CategoryID: "001", EnterpriseName: "Eléctrica Guayaquil", EnterpriseID: "002", descripcion: "Pago luz papá" },
                    { idContrato: 3, campos: {}, Id: "003", CategoryName: "AGUA POTABLE", CategoryID: "002", EnterpriseName: "Intergaua", EnterpriseID: "003", descripcion: "Pago agua mamá" },
                    { idContrato: 4, campos: {}, Id: "004", CategoryName: "AGUA POTABLE", CategoryID: "002", EnterpriseName: "EMAP", EnterpriseID: "004", descripcion: "Pago agua papá" },
                    { idContrato: 5, campos: {}, Id: "005", CategoryName: "TELEFONO, INTERNET Y TV", CategoryID: "003", EnterpriseName: "Claro", EnterpriseID: "005", descripcion: "Pago Claro mamá" },
                    { idContrato: 6, campos: {}, Id: "006", CategoryName: "TELEFONO, INTERNET Y TV", CategoryID: "003", EnterpriseName: "Netlife", EnterpriseID: "006", descripcion: "pago Netlife papá" },
                    { idContrato: 7, campos: {}, Id: "007", CategoryName: "MUNICIPIOS", CategoryID: "004", EnterpriseName: "Municipio Quito", EnterpriseID: "007", descripcion: "pago Municipio Quito mamá" },
                    { idContrato: 8, campos: {}, Id: "008", CategoryName: "MUNICIPIOS", CategoryID: "004", EnterpriseName: "Municipio Gye", EnterpriseID: "008", descripcion: "pago Municipio Gye papá" },

                    { idContrato: 9, campos: {}, Id: "009", CategoryName: "SRI", CategoryID: "005", EnterpriseName: undefined, EnterpriseID: undefined, descripcion: "pago SRI papá" },
                    { idContrato: 10, campos: {}, Id: "010", CategoryName: "SRI", CategoryID: "005", EnterpriseName: undefined, EnterpriseID: undefined, descripcion: "pago SRI mamá" },
                    { idContrato: 11, campos: {}, Id: "011", CategoryName: "IESS", CategoryID: "006", EnterpriseName: undefined, EnterpriseID: undefined, descripcion: "pago IESS papá" },
                    { idContrato: 12, campos: {}, Id: "012", CategoryName: "IESS", CategoryID: "006", EnterpriseName: undefined, EnterpriseID: undefined, descripcion: "pago IESS mamá" },

                    { idContrato: 13, campos: {}, Id: "013", CategoryName: "VENTA POR CATÁLOGO", CategoryID: "007", EnterpriseName: "Yanbal", EnterpriseID: "009", descripcion: "pago Yanbal amigo 1" },
                    { idContrato: 14, campos: {}, Id: "014", CategoryName: "VENTA POR CATÁLOGO", CategoryID: "007", EnterpriseName: "Oriflame", EnterpriseID: "010", descripcion: "pago Oriflame amigo 2" },
                    { idContrato: 15, campos: {}, Id: "015", CategoryName: "VENTA POR CATÁLOGO", CategoryID: "007", EnterpriseName: "AVON", EnterpriseID: "011", descripcion: "pago AVON amigo 3" },
            ];
            action(repuesta);
        }
        else {
            DataBaseBancaMovil.transaction(function (tx) {
                tx.executeSql(queryCreate);
                tx.executeSql(queryGetAllEnterprises, [], function (tx, res) {
                    repuesta.Empresas = res.rows._array;
                    tx.executeSql(queryGetAllCategories, [], function (tx2, res2) {
                        repuesta.Categorias = res2.rows._array;
                        action(repuesta);
                    })
                }, function (e) {
                    console.log("ERROR GetAllEnterprisesAndCategories: " + e.message);
                });
            });
        }


    } catch (e) {
        console.log("ERROR GetAllEnterprisesAndCategories: " + e.message);
    }
}

var Elementos = [
    {
        Nombre_Campo: "",
        Tipo_Campo: "PARRAFO",
        Longitud_Campo: 0,
        Tipo_Aplicacion: "T",
        Orden: 1,
        Campo_Asociado: "",
        Id_Contrato: 0,
        Campo_Habilitado: true,
        Obligatorio: false,
        Formato_Campo: "",
        Control_Campo: "PARRAFO",
        Combo_Descripcion: "",
        Visible: true,
        Valor_Default: "Para poder pagar tu servicio necesitamos la siguiente información, por favor asegurate de tener a mano: tu cédula de identidad y/o contrato de servicio. Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno Parrafo de relleno.",
        EventoChange: "",
        PlaceHolder: "",
        Evento: "Seleccionar()|Administrar()",
        Propiedades_Adicionales: ""
    },
    {
        Nombre_Campo: "",
        Tipo_Campo: "LNK",
        Longitud_Campo: 0,
        Tipo_Aplicacion: "T",
        Orden: 2,
        Campo_Asociado: "linkSeleccionarSuministros|linkAdmFavoritos",
        Id_Contrato: 0,
        Campo_Habilitado: true,
        Obligatorio: false,
        Formato_Campo: "",
        Control_Campo: "LINK|LINK",
        Combo_Descripcion: "",
        Visible: true,
        Valor_Default: "lnkSeleccionar|lnkAdministrar",
        EventoChange: "",
        PlaceHolder: "",
        Evento: "Seleccionar()|Administrar()",
        Propiedades_Adicionales: ""
    },
    {
        Nombre_Campo: "Contrato:",
        Tipo_Campo: "T",
        Longitud_Campo: 20,
        Tipo_Aplicacion: "T",
        Orden: 5,
        Campo_Asociado: "contrapartida",
        Id_Contrato: 9152,
        Campo_Habilitado: true,
        Obligatorio: true,
        Formato_Campo: "",
        Control_Campo: "TEXTBOX",
        Combo_Descripcion: "",
        Visible: true,
        Valor_Default: "",
        EventoChange: "",
        PlaceHolder: "Ingrese el valor",
        Evento: "",
        Propiedades_Adicionales: ""
    },
    {
        Nombre_Campo: "Numérico:",
        Tipo_Campo: "T",
        Longitud_Campo: 20,
        Tipo_Aplicacion: "T",
        Orden: 6,
        Campo_Asociado: "numerico",
        Id_Contrato: 9152,
        Campo_Habilitado: true,
        Obligatorio: false,
        Formato_Campo: /^[0-9()-]+$/,
        Control_Campo: "TEXTBOX",
        Combo_Descripcion: "",
        Visible: true,
        Valor_Default: "",
        EventoChange: "",
        PlaceHolder: "Ingrese el valor",
        Evento: "",
        Propiedades_Adicionales: ""
    },
    {
        Nombre_Campo: "Servicio:",
        Tipo_Campo: "T",
        Longitud_Campo: 20,
        Tipo_Aplicacion: "T",
        Orden: 3,
        Campo_Asociado: "servicio",
        Id_Contrato: 9152,
        Campo_Habilitado: true,
        Obligatorio: false,
        Formato_Campo: "",
        Control_Campo: "COMBO",
        Combo_Descripcion: [
            { id: "001", descripcion: "item001" },
            { id: "002", descripcion: "item002" },
            { id: "003", descripcion: "item003" },
            { id: "004", descripcion: "item004" },
            { id: "005", descripcion: "item005" },
        ],
        Visible: true,
        Valor_Default: "",
        EventoChange: "",
        PlaceHolder: "Ingrese el valor",
        Evento: "",
        Propiedades_Adicionales: ""
    },
    {
        Nombre_Campo: "Tipo:",
        Tipo_Campo: "T",
        Longitud_Campo: 20,
        Tipo_Aplicacion: "T",
        Orden: 4,
        Campo_Asociado: "tipo",
        Id_Contrato: 9152,
        Campo_Habilitado: true,
        Obligatorio: true,
        Formato_Campo: "",
        Control_Campo: "COMBO",
        Combo_Descripcion: [
            { id: "001", descripcion: "item001" },
            { id: "002", descripcion: "item002" },
            { id: "003", descripcion: "item003" },
            { id: "004", descripcion: "item004" },
            { id: "005", descripcion: "item005" },
        ],
        Visible: true,
        Valor_Default: "",
        EventoChange: "",// "function testChange(e) { alert(JSON.stringify(e)) }",
        PlaceHolder: "Ingrese el valor",
        Evento: "",
        Propiedades_Adicionales: ""
    }
]

var GetOperationByEnterpriseAndCategory = function (enterpriseID, categoryID, action) {
    try {
        if (DeviceInfo.DevicePlatform.contains('Simulador')) {
            var queryableOps = jslinq(GlobalOps);
            var result = queryableOps.firstOrDefault(function (el) {
                return (el.EnterpriseID === enterpriseID && el.CategoryID === categoryID);
            });
            action(result);
        }
        else {
            DataBaseBancaMovil.transaction(function (tx) {
                tx.executeSql(queryCreate);
                tx.executeSql(queryGetOperationByEnterpriseAndCategory,
                    [
                        enterpriseID,
                        categoryID
                    ], function (tx, res) {
                        action(res.rows._array[0]);
                    }, function (e) {
                        console.log("ERROR GetOperationByEnterpriseAndCategory: " + e.message);
                    });
            });
        }
    } catch (e) {
        console.log("ERROR GetOperationByEnterpriseAndCategory: " + e.message);
    }
}

var GetOperationByOperationID = function (operationID, action) {
    try {
        DataBaseBancaMovil.transaction(function (tx) {
            tx.executeSql(queryCreate);
            tx.executeSql(queryGetOperationByOperationID, [operationID], function (tx, res) {
                action(res.rows._array);
            }, function (e) {
                console.log("ERROR GetOperationByOperationID: " + e.message);
            });
        });
    } catch (e) {
        console.log("ERROR GetOperationByOperationID: " + e.message);
    }
}

var GetOperationByContractID = function (contractId, action) {
    try {
        if (DeviceInfo.DevicePlatform.contains('Simulador')) {
            var queryableOps = jslinq(GlobalOps);
            var result = queryableOps.firstOrDefault(function (el) {
                return (el.Contract === contractId);
            });
            action(result);
        }
        else {
            DataBaseBancaMovil.transaction(function (tx) {
                tx.executeSql(queryCreate);
                tx.executeSql(queryGetOperationByContractID, [contractId], function (tx, res) {
                    action(res.rows._array[0]);
                }, function (e) {
                    console.log("ERROR GetOperationByContractID: " + e.message);
                });
            });
        }
    } catch (e) {
        console.log("ERROR GetOperationByContractID: " + e.message);
    }
}


var GetAllOperationsAndVersion = function (action) {
    try {
        DataBaseBancaMovil.transaction(function (tx) {
            tx.executeSql(queryCreate);
            tx.executeSql(queryAllOperationsAndVersion, [], function (tx, res) {
                var operationArray = [];
                $.each(res.rows._array, function (index, op) {
                    operationArray.push({ id: Number(op.OperationID), ver: Number(op.Version) });
                })
                action(operationArray);
            }, function (e) {
                console.log("ERROR GetAllOperationsAndVersion: " + e.message);
            });
        });
    } catch (e) {
        console.log("ERROR GetAllOperationsAndVersion: " + e.message);
    }
}

var GetAllOperationsEasyCash = function (action) {
    try {
        if (DeviceInfo.DevicePlatform.contains('Simulador')) {
            var DummyOps = [
                {
                    "OperationID": 10,
                    "Code": "[LUZ][Institución]",
                    "Description": "[LUZ][Institución]",
                    "Contract": "2000",
                    "CategoryID": "1",
                    "CategoryName": "LUZ",
                    "EnterpriseID": "2",
                    "EnterpriseName": "Institución",
                    "Content": "{\"Nombre_Campo\":\"txtCampo_0\",\"Tipo_Campo\":null,\"Longitud_Campo\":14,\"Tipo_Aplicacion\":\"T\",\"Orden\":6,\"Campo_Asociado\":\"txtCampo_Changed0\",\"Id_Contrato\":\"2000\",\"Campo_Habilitado\":false,\"Obligatorio\":false,\"Formato_Campo\":\"\",\"Control_Campo\":\"TEXTBOX\",\"Combo_Descripcion\":\"description_0\",\"Visible\":true,\"Valor_Default\":\"\",\"EventoChange\":\"txtCampo_Changed\",\"Evento\":\"\",\"Propiedades_Adicionales\":\"646|38||26181274296|USD\"},{\"Nombre_Campo\":\"txtCampo_1\",\"Tipo_Campo\":null,\"Longitud_Campo\":11,\"Tipo_Aplicacion\":\"T\",\"Orden\":17,\"Campo_Asociado\":\"txtCampo_Changed1\",\"Id_Contrato\":\"2000\",\"Campo_Habilitado\":false,\"Obligatorio\":false,\"Formato_Campo\":\"\",\"Control_Campo\":\"TEXTBOX\",\"Combo_Descripcion\":\"description_1\",\"Visible\":true,\"Valor_Default\":\"\",\"EventoChange\":\"txtCampo_Changed\",\"Evento\":\"\",\"Propiedades_Adicionales\":\"646|38||26144593653|USD\"},{\"Nombre_Campo\":\"txtCampo_5\",\"Tipo_Campo\":null,\"Longitud_Campo\":31,\"Tipo_Aplicacion\":\"T\",\"Orden\":54,\"Campo_Asociado\":\"txtCampo_Changed5\",\"Id_Contrato\":\"2000\",\"Campo_Habilitado\":false,\"Obligatorio\":false,\"Formato_Campo\":\"\",\"Control_Campo\":\"TEXTBOX\",\"Combo_Descripcion\":\"description_5\",\"Visible\":true,\"Valor_Default\":\"\",\"EventoChange\":\"txtCampo_Changed\",\"Evento\":\"\",\"Propiedades_Adicionales\":\"646|38||26246279227|USD\"}",
                    "IsActive": true,
                    "Version": 0,
                    "Estado": "A",
                    "ObjectState": null
                },
                {
                    "OperationID": 11,
                    "Code": "[TELEFONO, INTERNET Y TV][Compañía]",
                    "Description": "[TELEFONO, INTERNET Y TV][Compañía]",
                    "Contract": "3000",
                    "CategoryID": "3",
                    "CategoryName": "TELEFONO, INTERNET Y TV",
                    "EnterpriseID": "3",
                    "EnterpriseName": "Compañía",
                    "Content": "{\"Nombre_Campo\":\"txtCampo_3\",\"Tipo_Campo\":null,\"Longitud_Campo\":12,\"Tipo_Aplicacion\":\"T\",\"Orden\":78,\"Campo_Asociado\":\"txtCampo_Changed3\",\"Id_Contrato\":\"3000\",\"Campo_Habilitado\":false,\"Obligatorio\":false,\"Formato_Campo\":\"\",\"Control_Campo\":\"TEXTBOX\",\"Combo_Descripcion\":\"description_3\",\"Visible\":true,\"Valor_Default\":\"\",\"EventoChange\":\"txtCampo_Changed\",\"Evento\":\"\",\"Propiedades_Adicionales\":\"646|38||26643351538|USD\"},{\"Nombre_Campo\":\"txtCampo_7\",\"Tipo_Campo\":null,\"Longitud_Campo\":13,\"Tipo_Aplicacion\":\"T\",\"Orden\":70,\"Campo_Asociado\":\"txtCampo_Changed7\",\"Id_Contrato\":\"3000\",\"Campo_Habilitado\":false,\"Obligatorio\":false,\"Formato_Campo\":\"\",\"Control_Campo\":\"TEXTBOX\",\"Combo_Descripcion\":\"description_7\",\"Visible\":true,\"Valor_Default\":\"\",\"EventoChange\":\"txtCampo_Changed\",\"Evento\":\"\",\"Propiedades_Adicionales\":\"646|38||26501768941|USD\"},{\"Nombre_Campo\":\"cmbCombo_8\",\"Tipo_Campo\":null,\"Longitud_Campo\":9,\"Tipo_Aplicacion\":\"T\",\"Orden\":29,\"Campo_Asociado\":\"cmbCombo_Changed8\",\"Id_Contrato\":\"3000\",\"Campo_Habilitado\":false,\"Obligatorio\":false,\"Formato_Campo\":\"\",\"Control_Campo\":\"COMBO\",\"Combo_Descripcion\":\"description_8\",\"Visible\":true,\"Valor_Default\":\"\",\"EventoChange\":\"cmbCombo_Changed\",\"Evento\":\"\",\"Propiedades_Adicionales\":\"646|38||26776156865|USD\"}",
                    "IsActive": true,
                    "Version": 0,
                    "Estado": "A",
                    "ObjectState": null
                },
                {
                    "OperationID": 12,
                    "Code": "[IESS][Empresa]",
                    "Description": "[IESS][Empresa]",
                    "Contract": "1000",
                    "CategoryID": "6",
                    "CategoryName": "IESS",
                    "EnterpriseID": "1",
                    "EnterpriseName": "Empresa",
                    "Content": null,
                    "IsActive": true,
                    "Version": 0,
                    "Estado": "A",
                    "ObjectState": null
                },
                {
                    "OperationID": 13,
                    "Code": "[IESS][Entidad gubernamental]",
                    "Description": "[IESS][Entidad gubernamental]",
                    "Contract": "4000",
                    "CategoryID": "6",
                    "CategoryName": "IESS",
                    "EnterpriseID": "4",
                    "EnterpriseName": "Entidad gubernamental",
                    "Content": "{\"Nombre_Campo\":\"cmbCombo_2\",\"Tipo_Campo\":null,\"Longitud_Campo\":26,\"Tipo_Aplicacion\":\"T\",\"Orden\":94,\"Campo_Asociado\":\"cmbCombo_Changed2\",\"Id_Contrato\":\"4000\",\"Campo_Habilitado\":false,\"Obligatorio\":false,\"Formato_Campo\":\"\",\"Control_Campo\":\"COMBO\",\"Combo_Descripcion\":\"description_2\",\"Visible\":true,\"Valor_Default\":\"\",\"EventoChange\":\"cmbCombo_Changed\",\"Evento\":\"\",\"Propiedades_Adicionales\":\"646|38||26383328752|USD\"},{\"Nombre_Campo\":\"txtCampo_4\",\"Tipo_Campo\":null,\"Longitud_Campo\":15,\"Tipo_Aplicacion\":\"T\",\"Orden\":38,\"Campo_Asociado\":\"txtCampo_Changed4\",\"Id_Contrato\":\"4000\",\"Campo_Habilitado\":false,\"Obligatorio\":false,\"Formato_Campo\":\"\",\"Control_Campo\":\"TEXTBOX\",\"Combo_Descripcion\":\"description_4\",\"Visible\":true,\"Valor_Default\":\"\",\"EventoChange\":\"txtCampo_Changed\",\"Evento\":\"\",\"Propiedades_Adicionales\":\"646|38||26332887830|USD\"},{\"Nombre_Campo\":\"txtCampo_6\",\"Tipo_Campo\":null,\"Longitud_Campo\":6,\"Tipo_Aplicacion\":\"T\",\"Orden\":83,\"Campo_Asociado\":\"txtCampo_Changed6\",\"Id_Contrato\":\"4000\",\"Campo_Habilitado\":false,\"Obligatorio\":false,\"Formato_Campo\":\"\",\"Control_Campo\":\"TEXTBOX\",\"Combo_Descripcion\":\"description_6\",\"Visible\":true,\"Valor_Default\":\"\",\"EventoChange\":\"txtCampo_Changed\",\"Evento\":\"\",\"Propiedades_Adicionales\":\"646|38||26843362337|USD\"}",
                    "IsActive": true,
                    "Version": 0,
                    "Estado": "A",
                    "ObjectState": null
                },
                {
                    "OperationID": 14,
                    "Code": "[IESS][Organización]",
                    "Description": "[IESS][Organización]",
                    "Contract": "5000",
                    "CategoryID": "6",
                    "CategoryName": "IESS",
                    "EnterpriseID": "5",
                    "EnterpriseName": "Organización",
                    "Content": null,
                    "IsActive": true,
                    "Version": 0,
                    "Estado": "A",
                    "ObjectState": null
                }
            ]
            action(DummyOps);
        }
        else {
            DataBaseBancaMovil.transaction(function (tx) {
                tx.executeSql(queryCreate);
                tx.executeSql('select * from OperationEasyCash', [], function (tx, res) {
                    action(res.rows._array);
                }, function (e) {
                    console.log("ERROR GetAllOperations: " + e.message);
                });
            });
        }
    } catch (e) {
        console.log("ERROR GetAllOperations: " + e.message);
    }
}

var DeleteOperationByOperationID = function (operationID, action) {
    try {
        DataBaseBancaMovil.transaction(function (tx) {
            tx.executeSql(queryDeleteOperation, [operationID], function (tx, res) {
                action();
            }, function (e) {
                console.log("ERROR DeleteOperationByOperationID: " + e.message);
            });
        });
    } catch (e) {
        console.log("ERROR DeleteOperationByOperationID: " + e.message);
    }
}

var SincServicios = function (action) {
    try {
        var insertFinished = true;
        var modifiedFinished = true;
        var deleteFinished = true;
        if (DeviceInfo.DevicePlatform.contains('Simulador') == false) {
            GetAllOperationsAndVersion(function (operations) {
                SincronizarOperaciones(operations, function (result) {
                    if (result.newOperations.length > 0) {
                        insertFinished = false;
                        $.each(result.newOperations, function (index, value) {
                            InsertOperation(value, function () {
                                console.log('Attempted to Insert operation: ' + value.Description)
                                if ((result.newOperations.length - 1) === index) {
                                    insertFinished = true;
                                    taskAfetrSincValidation(insertFinished, modifiedFinished, deleteFinished, result, action);
                                }
                            });
                        });
                    }
                    if (result.modifiedOperations.length > 0) {
                        modifiedFinished = false;
                        $.each(result.modifiedOperations, function (index, value) {
                            UpdateOperationByOperationID(value, function () {
                                console.log('Attempted update operation: ' + value.Description)
                                if ((result.modifiedOperations.length - 1) === index) {
                                    modifiedFinished = true;
                                    taskAfetrSincValidation(insertFinished, modifiedFinished, deleteFinished, result, action);
                                }
                            });
                        });

                    }
                    if (result.deletedOperations.length > 0) {
                        deleteFinished = false;
                        $.each(result.deletedOperations, function (index, value) {
                            DeleteOperationByOperationID(value, function () {
                                console.log('Attempted delete operation: ' + value)
                                if ((result.deletedOperations.length - 1) === index) {
                                    deleteFinished = true;
                                    taskAfetrSincValidation(insertFinished, modifiedFinished, deleteFinished, result, action);
                                }
                            });
                        });
                    }
                    taskAfetrSincValidation(insertFinished, modifiedFinished, deleteFinished, result, action);
                });
            });
        }
        else {
            SincronizarOperaciones([], function (result) {
                GlobalOps = result.newOperations;
                taskAfetrSincValidation(insertFinished, modifiedFinished, deleteFinished, result, action);

            });
        }
    } catch (e) {

    }
}

function taskAfetrSincValidation(insertFinished, modifiedFinished, deleteFinished, result, action) {
    if (insertFinished == true && modifiedFinished == true && deleteFinished == true) {
        if (DeviceInfo.DevicePlatform.contains('Simulador') == false) {
            GetAllOperationsEasyCash(function (ops) {
                GlobalOps = ops;
                action(result.frecuentOperations);
            });
        }
        else {
            action(result.frecuentOperations);
        }
    }
}