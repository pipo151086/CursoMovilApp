MobileBanking_App.CanalesAtencion = function (params) {
    "use strict";

    var viewModel = {
        viewShown: function () {
            $('#slideLogo').focus();
        },
        viewShowing: function () {
            hideFloatButtons();
        },
        clkWa: function () {
            window.plugins.socialsharing.shareViaWhatsAppToPhone('+50258005146', '', null /* img */, null /* url */, function () { console.log('share ok') })
        },
        clkFb: function () {
            //iOS: fb://
            //Android: com.facebook.katana

            if ((typeof device !== 'undefined') && device && device.platform === 'iOS') {
                return cordova.InAppBrowser.open('fb://profile/582903268515612', '_system', 'location=no');
            }
            else if ((typeof device !== 'undefined') && device && device.platform === 'Android') {
                appAvailability.check(
                    'com.facebook.katana',       // URI Scheme or Package Name
                    function (succ) {  // Success callback
                        return cordova.InAppBrowser.open('fb://page/582903268515612', '_system', 'location=no');
                    },
                    function (err) {  // Error callback
                        cordova.InAppBrowser.open('https://www.facebook.com/BancodeAntiguaGuatemala', '_system', 'location=no');
                    }
                );
            }
            else {
                openInAppBrowser("https://www.facebook.com/BancodeAntiguaGuatemala")
            }
        },
        clkIg: function () { openInAppBrowser("https://www.instagram.com/bantigua_oficialgt/") },
        clkCc: function () { cordova.InAppBrowser.open('tel:+50224205555', '_system') },
        clkCe: function () {
            window.plugins.socialsharing.shareViaEmail(
                '', // can contain HTML tags, but support on Android is rather limited:  http://stackoverflow.com/questions/15136480/how-to-send-html-content-with-image-through-android-default-email-client
                'Contacto Servicio al Cliente',
                ['servicioalcliente@bancodeantigua.com.gt'], // TO: must be null or an array
                [''], // CC: must be null or an array
                null, // BCC: must be null or an array
                null, // FILES: can be null, a string, or an array
                function (succ) { }, // called when sharing worked, but also when the user cancelled sharing via email. On iOS, the callbacks' boolean result parameter is true when sharing worked, false if cancelled. On Android, this parameter is always true so it can't be used). See section "Notes about the successCallback" below.
                function (err) { }// called when sh*t hits the fan
            );
        },
        clickBack: function () { MobileBanking_App.app.navigate('LandingPage'); },

    };

    return viewModel;
};