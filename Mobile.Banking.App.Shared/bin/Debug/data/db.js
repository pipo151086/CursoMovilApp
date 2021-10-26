/// <reference path="../js/jquery-1.12.3.min.js" />
/// <reference path="../js/knockout-3.4.0.js" />
/// <reference path="../js/dx.all.js" />

(function() {
    var isWinJS = "WinJS" in window;
    var endpointSelector = new DevExpress.EndpointSelector(MobileBanking_App.config.endpoints);
    var serviceConfig = $.extend(true, {}, MobileBanking_App.config.services, {
        db: {
            url: endpointSelector.urlFor("db"),

            // To enable JSONP support, uncomment the following line
            //jsonp: !isWinJS,

            // To allow cookies and HTTP authentication with CORS, uncomment the following line
            // withCredentials: true,

            errorHandler: handleServiceError
        }
    });

    function handleServiceError(error) {
        if(isWinJS) {
            try {
                new Windows.UI.Popups.MessageDialog(error.message).showAsync();
            } catch(e) {
                // Another dialog is shown
            }
        } else {
            alert(error.message);
        }
    }

    // Enable partial CORS support for IE < 10    
    $.support.cors = true;
    
    MobileBanking_App.db = new DevExpress.data.ODataContext(serviceConfig.db);

}());
