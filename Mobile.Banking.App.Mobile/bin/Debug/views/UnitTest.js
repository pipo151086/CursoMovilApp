MobileBanking_App.UnitTest = function (params) {
    "use strict";

    var viewModel = {
        koButtonInsert: {
            text: "koButtonInsert",
            onClick: InsertOp
        },
        koButtonGetAllAndVersions: {
            text: "koButtonGetAllAndVersions",
            onClick: koButtonGetAllAndVersions
        },
        koButtonGetByCatAndEnt: {
            text: "koButtonGetByCatAndEnt",
            onClick: koButtonGetByCatAndEnt
        },
        koButtonDeleteOp: {
            text: "koButtonDeleteOp",
            onClick: koButtonDeleteOp
        },
        koButtonUpdateOp: {
            text: "koButtonUpdateOp",
            onClick: koButtonUpdateOp
        },
        koGetAllEnterprisesAndCategories: {
            text: "koGetAllEnterprisesAndCategories",
            onClick: koGetAllEnterprisesAndCategories
        },
        koGetOperationByOperationID: {
            text: "koGetOperationByOperationID",
            onClick: koGetOperationByOperationID
        },
        koSincOps: {
            text: "koSincOps",
            onClick: koSincOps
        },
        koFB_Ops: {
            text: "koFB_Ops",
            onClick: koSincOps
        },
    };

    function koSincOps() {
        var arrayOfPersmissions = ['ads_management', 'business_management', 'publish_to_groups', 'user_birthday', 'user_friends', 'user_hometown', 'user_likes', 'user_location'];

            facebookConnectPlugin.login(arrayOfPersmissions, SuccessFaceBook, ErrorFaceBook);
       


    }

    function SuccessFaceBook(args) {
        
    }

    function ErrorFaceBook(args) {
        
    }













    var operationEasyCash1 = {
        id: 0,
        OperationID: "1",
        Code: "1",
        Description: "1",
        Contract: "1",
        IsActive: "1",
        Content: "1",
        CategoryID: "1",
        Category: "1",
        EnterpriseID: "1",
        EnterpriseName: "1",
        Version: "1"
    }
    var operationEasyCash2 = {
        id: 0,
        OperationID: "2",
        Code: "2",
        Description: "2",
        Contract: "2",
        IsActive: "2",
        Content: "2",
        CategoryID: "2",
        Category: "2",
        EnterpriseID: "2",
        EnterpriseName: "2",
        Version: "2"
    }
    var operationEasyCash3 = {
        id: 0,
        OperationID: "3",
        Code: "3",
        Description: "3",
        Contract: "3",
        IsActive: "3",
        Content: "3",
        CategoryID: "3",
        Category: "3",
        EnterpriseID: "3",
        EnterpriseName: "3",
        Version: "3"
    }
    var operationEasyCash4 = {
        id: 0,
        OperationID: "4",
        Code: "4",
        Description: "4",
        Contract: "4",
        IsActive: "4",
        Content: "4",
        CategoryID: "4",
        Category: "4",
        EnterpriseID: "4",
        EnterpriseName: "4",
        Version: "4"
    }

    function InsertOp() {
        InsertOperation(operationEasyCash1, function (data) {
            alert('OK');
        })
        InsertOperation(operationEasyCash2, function (data) {
            alert('OK');
        })
        InsertOperation(operationEasyCash3, function (data) {
            alert('OK');
        })
        InsertOperation(operationEasyCash4, function (data) {
            alert('OK');
        })
    }

    function koButtonDeleteOp() {
        DeleteOperationByOperationID(1, function (data) {
            alert('OK');
        })
    }

    function koButtonUpdateOp() {
        operationEasyCash1 = {
            id: 0,
            OperationID: "1",
            Code: "UPDATED",
            Description: "UPDATED",
            Contract: "UPDATED",
            IsActive: "UPDATED",
            Content: "UPDATED",
            CategoryID: "1",
            Category: "UPDATED",
            EnterpriseID: "1",
            EnterpriseName: "UPDATED",
            Version: "1"
        }

        UpdateOperationByOperationID(operationEasyCash1, function (data) {
            alert('OK');
        })
    }

    function koGetOperationByOperationID() {
        GetOperationByOperationID(1, function (data) {
            alert('OK = ' + JSON.stringify(data));
        })
    }

    function koButtonGetAllAndVersions() {
        GetAllOperationsAndVersion(function (data) {
            alert('OK: ' + data.length);
        });
    }

    function koButtonGetByCatAndEnt() {
        GetOperationByEnterpriseAndCategory(1, 1, function (data) {
            alert('OK' + data.id);
        });
    }

    function koGetAllEnterprisesAndCategories() {
        GetAllEnterprisesAndCategories(function (data) {
            alert('OK: ' + data.length);
        });
    }

    function koSincOps() {
        SincServicios(function () {
            alert('Sinc Ops OK');
        });
    }

    return viewModel;
};