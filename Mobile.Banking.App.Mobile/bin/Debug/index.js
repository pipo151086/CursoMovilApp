$(function () {
    var startupView = "LandingPage"//"LandingPage"//"FormularioSimple"//"SolCtaScanDoc1"//"SolCtaScanDoc1"//"FormUnreg1_Triage"//"SolCtaSuccess"//"LandingPage"

    //ESTUDIAR RegUsrPass



    //"SolCtaTrjDebMsg"


    GetDeviceInfo();
    // Uncomment the line below to disable platform-specific look and feel and to use the Generic theme for all devices
    // DevExpress.devices.current({ platform: "generic" });
    if (DevExpress.devices.real().platform === "win") {
        $("body").css("background-color", "#000");
    }
    MobileBanking_App.emptyController = new DevExpress.framework.html.EmptyLayoutController;

    document.addEventListener("deviceready", onDeviceReady, false);

    function onDeviceReady() {
        OpenDataBase();
        if (Keyboard && device.platform !== "Android")
            Keyboard.disableScroll(false);
        StatusBar.overlaysWebView(false);
        if (navigator.splashscreen)
            navigator.splashscreen.hide();
        deviceType = (device.platform == "iOS") ? undefined : device.platform;
        // deviceType = device.platform;
        InitializeMobbScan();

        GetDeviceInfo();
        GetAppVersion();
        if (IRoot) {
            IRoot.isRooted(function (rooted) {
                if (rooted) {
                    alert("Este dispositivo ha sido VULNERADO (Rooted-Jailbreaked)")
                    if (cordova.plugins && cordova.plugins.exit)
                        cordova.plugins.exit();
                    else
                        exitApp();
                }
            }, function (err) {
                alert(JSON.stringify(err));
            });
        }
        downLoadCurrentPosition();
        if (deviceType != undefined || deviceType != "null") {
            SSLPinningEnableSSLPinning(Parameters.UseSSL_Pinning);
            SSLPinningAcceptAllCerts(Parameters.AcceptAllCertificates);
        }
        GlobalPush = PushNotification.init({
            android: {
                senderID: "463565428250"
            },
            browser: {
                pushServiceURL: 'http://push.api.phonegap.com/v1/push'
            },
            ios: {
                alert: "true",
                badge: "true",
                sound: "true"
            },
            windows: {}
        });
        GlobalPush.on('registration', function (data) {
            // data.registrationId
            //alert(data.registrationId);
            TokenAPN_GCM = data.registrationId;
        });
        GlobalPush.on('notification', function (data) {
            // data.message,
            // data.title,
            // data.count,
            // data.sound,
            // data.image,
            // data.additionalData
            //invokeInstructionsPush(data.additionalData.instructions);
            //SetApplicationBadgeNumber(data.count);
        });
        GlobalPush.on('error', function (e) {
            // e.message
            //alert(JSON.stringify(e));
        });
        if (window.devextremeaddon) {
            window.devextremeaddon.setup();
        }
        $(document).on("backbutton", function () {
            DevExpress.processHardwareBackButton();
        });
    };

    function onNavigatingBack(e) {
        if (e.isHardwareButton && !MobileBanking_App.app.canBack()) {
            e.cancel = true;
        }
    }
    function exitApp() {
        switch (DevExpress.devices.real().platform) {
            case "android":
                navigator.app.exitApp();
                break;
            case "win":
                MSApp.terminateApp('');
                break;
        }
    }
    var layoutSet = DevExpress.framework.html.layoutSets[MobileBanking_App.config.layoutSet],
        navigation = MobileBanking_App.config.navigation;
    MobileBanking_App.app = new DevExpress.framework.html.HtmlApplication({
        namespace: MobileBanking_App,
        layoutSet: [
            { controller: new DevExpress.framework.html.SlideOutController },
            { customResolveRequired: true, controller: MobileBanking_App.emptyController }
        ],
        animationSet: DevExpress.framework.html.animationSets[MobileBanking_App.config.animationSet],
        navigation: navigation,
        commandMapping: MobileBanking_App.config.commandMapping,
        navigateToRootViewMode: "keepHistory",
        useViewTitleAsBackText: false
    });


    $(window).on("unload", function () {
        MobileBanking_App.app.saveState();
    });

    $(window).on("load", function () {
        //InsertUserDummy();
    });

    const specialViews = [
        "RegisterUser", "Home", "ForgottenPassword", "RegisterSecurePIN",
        "RequestPIN", "ForgottenPasswordSecondInstance", "OlvidoPIN", "ForgottenUserName", "PinConfirmation", "LoadView", "LandingPage",
        "InsertPin", "GuiaUsr", "SolProductos", "CanalesAtencion", "TipoCambio", "_1_TermCond", "_2_CreaUsr", "_3_ContactInfo", "_4_Confirm",
        "InfoContacto", "RegPregSeg", "RegUsrPass", "RedAgencias", "SolCtaForm1", "SolCtaForm2", "SolCtaForm3", "SolCtaForm4",
        "MsgRegUsr", "MsgUnregUsr", "SolCtaTrjDebMsg", "SolCtaSuccess", "SolCtaSorry", "FormUnreg1_Triage", "FormUnreg2NITSorry", "FormUnreg2_DpiPas", "SolCtaScanDoc1", "SolCtaScanDoc2",
        "SolCtaSelfie"
    ];


    MobileBanking_App.app.router.register(":view/:id", { view: startupView, id: undefined });
    MobileBanking_App.app.on("resolveLayoutController", function (args) {
        var viewName = args.viewInfo.viewName;
        if (specialViews.includes(viewName))
            args.layoutController = MobileBanking_App.emptyController;

    });
    MobileBanking_App.app.on("navigatingBack", onNavigatingBack);
    MobileBanking_App.app.navigate();
    function onPause() {
        MobileBanking_App.app.saveState();
    }
    function onResume() {
        var currentView = MobileBanking_App.app.navigationManager.currentStackKey;
        if ((currentView === null || currentView === undefined || currentView === "") && MobileBanking_App.app.navigationManager.currentItem() != undefined)
            currentView = MobileBanking_App.app.navigationManager.currentItem().uri;

        if (!specialViews.includes(currentView)) {
            if (SesionMovil) {
                var fechaActual = new Date();
                var fechaUltimaActividad = new Date(SesionMovil.FechaActividadApp);
                if (fechaUltimaActividad === undefined || fechaUltimaActividad === null)
                    fechaUltimaActividad = new Date(sessionStorage.getItem('FechaActividadApp'));

                var minutosTranscurridos = fechaActual.getMinutes() - fechaUltimaActividad.getMinutes();
                if (minutosTranscurridos >= parseInt(Parameters.SessionTime)) {
                    //if (minutosTranscurridos >= 3) {
                    endSession();
                    $('#header-fixed').hide();
                    $('.header-clear').hide();
                    showSimpleMessage(CORE_TAG('ExpiredSession'), CORE_MESSAGE('ExpiredSession'), function () {
                        MobileBanking_App.app.clearState();
                        //MobileBanking_App.app.navigate('RequestPIN', { root: true });
                        MobileBanking_App.app.navigate('LandingPage', { root: true });
                    })
                } else {
                    MobileBanking_App.app.restoreState();
                }
            }
        }
    }
    function movilOffLine() {
        showSimpleMessage('Sin RED', 'Dispositivo debe tener acceso a una red o a un plan de datos para acceder al sistema', function () {
            exitApp();
        })
    }

    document.addEventListener('pause', onPause, false);
    document.addEventListener('resume', onResume, false);
    document.addEventListener('offline', movilOffLine, false);
});