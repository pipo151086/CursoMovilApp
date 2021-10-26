function InitializeMobbScan() {
    try {
        if (!MobbScanAPI)
            return false;

        let inputBaseUrl = Parameters.MobbScanURL;
        let inputLicenseId = (device.platform == "iOS") ? "c15af969-2c75-4025-8123-34e1a1856534" : "3b3ee62f-573d-4015-a6dc-336ab6e47d78";

        var msConfiguration = new MobbScanConfiguration();
        msConfiguration.checkDocumentPosition = true;

        MobbScanAPI.initAPIWithLicenseAndConfiguration(inputLicenseId, msConfiguration, function (succ) {
            console.log(succ); /*Sentencia OK Valid*/
            startScanForDocumentType();
        }, function (err) {
            console.log(err);
        });

        MobbScanAPI.setBaseURL(inputBaseUrl, function (succ) {
            console.log(succ);/*Sentencia OK*/
        }, function (err) {
            console.log(err);
        });
    } catch (cErr) {
        alert("Catch Err" + JSON.stringify(cErr));
    }
}

var scanId = "";
var operation = ";"
var dataFromScan = {};
var tmpFrontResult = {};
var tmpBackResult = {};


var success = function (message) {
    console.log(message);
}

var failure = function (message) {
    console.log(message);
}

var startScanForDocumentTypeSuccess = function (message) {
    scanId = message;
    console.log("Scan ID: " + message);
}

var scanDocumentSuccess = function (message) {
    console.debug(message);
}

var scanDocumentImageCallback = function (message) {
    if (operation == "scanDocument") {
        var result = message.detectionResult;
        if (result == "OK") {
            var documentSide = message.documentSide;
            var image = message.image;
            var img;
            if (documentSide == MobbScanDocumentSide.FRONT.value) {
                img = document.getElementById("idFrontSide");
                tmpFrontResult = message;
            } else {
                img = document.getElementById("idBackSide");
                tmpBackResult = message;
            }
            img.src = "data:image/png;base64, " + image;
            img.style.display = "block";
        } else if (result == "PROCESS_CANCELLED") {
            stopProcess();
            return showSimpleMessage(CORE_TAG('DefaultTitle'), "Detección cancelada por el usuario", undefined, undefined);
        }
    } else {
        var result = message.detectionResult;
        if (result == "OK") {
            var image = message.image;
            var img = document.getElementById("mrz");
            img.src = "data:image/png;base64, " + image;
            img.style.display = "block";
        } else if (result == "PROCESS_CANCELLED") {
            stopProcess();
            return showSimpleMessage(CORE_TAG('DefaultTitle'), "Detección cancelada por el usuario", undefined, undefined);
        }
    }

}

var scanDocumentDataCallback = function (message) {
    //var div = document.getElementById("data");
    //data.innerText = JSON.stringify(message, null, 2);
    dataFromScan = message;
}

function startScanForDocumentType() {
    // Set BaseURL
    let inputBaseUrl = Parameters.MobbScanURL;
    MobbScanAPI.setBaseURL(inputBaseUrl, success, failure);

    // Set Fixed mode
    MobbScanAPI.setFalsePositiveRejection(true, success);

    //Start Scan
    operation = "scanDocument";
    /*
    document.getElementById("frontSide").style.display = "none";
    document.getElementById("backSide").style.display = "none";
    document.getElementById("data").innerText = "";
    */

    var documentType = MobbScanDocumentType.GTMIDCard;
    var operationMode = MobbScanOperationMode.SCAN_BOTH_SIDES;
    MobbScanAPI.startScanForDocumentType(documentType, operationMode, startScanForDocumentTypeSuccess, failure);
    MobbScanAPI.setScanDocumentImageCallback(scanDocumentImageCallback);
    MobbScanAPI.setScanDocumentDataCallback(scanDocumentDataCallback);
}

function scanDocumentForFrontSide(viewCallBack) {
    initProcess("Validando el DNI (Frente)...");
    MobbScanAPI.scanDocumentForSide(MobbScanDocumentSide.FRONT, scanId, function (args, rest1, rest2) {
        console.log("scanDocumentForFrontSide", JSON.stringify([rest1, rest2]))
        scanDocumentSuccess(args);
        if (viewCallBack)
            viewCallBack(args);
    }, failure);
}

function scanDocumentForBackSide(viewCallBack) {
    initProcess("Validando el DNI (Dorso)...");
    MobbScanAPI.scanDocumentForSide(MobbScanDocumentSide.BACK, scanId, function (args, rest1, rest2) {
        console.log("scanDocumentForBackSide", JSON.stringify([rest1, rest2]))
        scanDocumentSuccess(args);
        if (viewCallBack)
            viewCallBack(args);
    }, failure);
}





function clearSelfie() {
    debugger;
    var divFaceValidationSection = document.getElementById("faceValidationSection");
    var divVideoShow = document.getElementById("videoShow");

    divFaceValidationSection.innerHTML = "";
    divVideoShow.innerHTML = "";
}

function showSelfie(faceImageBase64, txtMessage) {
    debugger;
    var divFaceValidationSection = document.getElementById("faceValidationSection");
    var message = document.createElement('p')
    message.innerHTML = txtMessage;
    divFaceValidationSection.appendChild(message);
    var img = document.createElement("img");
    img.src = "data:image/png;base64, " + faceImageBase64;
    img.id = "selfie"
    img.style.display = "block";
    img.style.width = '250px';
    img.style.height = '250px';
    divFaceValidationSection.appendChild(img);
}


function videoLiveness() {
    clearSelfie();
    MobbScanAPI.validateFace(scanId, MobbScanFaceValidationMode.LIVENESS_VIDEO_HEAD_MOVEMENT, validateFaceSuccess, validateFaceFailure);
}

var validateFaceSuccess = function (faceValidationResultMessage) {
    debugger;
    var filterConsoleResultWhitelist = ["result", "scanId", "resultData", "score", "mobbScanValidationType"];
    console.log(JSON.stringify(faceValidationResultMessage, filterConsoleResultWhitelist, 2));
    if (faceValidationResultMessage.result == MobbScanValidationState.VALID.value) {
        showSelfie(faceValidationResultMessage.resultData.face, "Face Matching is VALID");
    } else if (faceValidationResultMessage.result == MobbScanValidationState.NOT_VALID.value) {
        showSelfie(faceValidationResultMessage.resultData.face, "FaceMatching is NOT VALID");
    } else {
        // NOT_CHECKED
        showErrorMessage("FaceMatching could not be performed");
    }
}

var validateFaceFailure = function (faceValidationResultMessage) {
    debugger;
    console.log(JSON.stringify(faceValidationResultMessage, null, 2));
    showErrorMessage("Facial Matching ERROR: " + JSON.stringify(faceValidationResultMessage.error, null, 2));
    alert("Facial Matching ERROR: " + faceValidationResultMessage.error.errorCode);
}

var faceAcquisitorCallback = function (faceAcquiredResult) {
    debugger;
    var filterConsoleResultWhitelist = ["result", "scanId", "resultData", "score", "mobbScanValidationType"];
    console.log(JSON.stringify(faceAcquiredResult, filterConsoleResultWhitelist, 2));
    if (faceAcquiredResult.result == 'FACE_ACQUIRED') {
        showSelfie(faceAcquiredResult.resultData.faces[0], "Face Acquired!");
    } else {
        // TODO Show better error information
        showErrorMessage("Cannot acquire user's face");
    }
}