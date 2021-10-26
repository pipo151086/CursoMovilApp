MobileBanking_App.RedAgencias = function (params) {
    "use strict";

    var returnPage = "LandingPage";
    debugger;
    if (params && params.id)
        returnPage = JSON.parse(params.id);


    var agencias = [];
    var selectedAg = undefined;
    var map;
    var markers = {};
    var infoMsgs = {};
    var toolTipShown = false;

    var mapProp = {
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
    };

    var bounds = new google.maps.LatLngBounds();
    var directionsDisplay = new google.maps.DirectionsRenderer(
        {
            suppressMarkers: true,
            polylineOptions: {
                strokeWeight: 10,
                strokeOpacity: 0.5,
                strokeColor: 'blue',
            },
        });

    var directionsService = new google.maps.DirectionsService;

    var viewModel = {
        viewShown: function () {
            setupFloatButton(classButtons.Other, showInfo, iconosCore.info, undefined, undefined, undefined, undefined);
            $('#slideLogo').click();

            downLoadCurrentPositionSync(false, function (pos) {
                ConsultarDetalleOficinas(String(currentPosition.Latitud), String(currentPosition.Longitud), function (data) {
                    agencias = data;
                    if (data.length > 0) {
                        let masCercano = data[0];
                        masCercano.posMap = { lat: +masCercano.Latitud, lng: +masCercano.Longitud };
                        map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
                        var trafficLayer = new google.maps.TrafficLayer();
                        trafficLayer.setMap(map);

                        setInitialMarker(currentPosition);
                        $('#luAgencias').dxLookup('option', 'value', masCercano.IdOficina);
                        $('#luAgencias').dxLookup('option', 'dataSource', data);
                    }
                });

            });


        },
        viewShowing: function () {
            hideFloatButtons();
        },
        clickBack: function () { MobileBanking_App.app.navigate(returnPage, { root: true }); },
        luAgencias: {
            dataSource: [],
            cancelButtonText: "Cancelar",
            cleanSearchOnOpening: true,
            clearButtonText: "Limpiar",
            deferRendering: true,
            displayExpr: "Nombre",
            focusStateEnabled: true,
            itemTemplate: function (item) {
                let content = '<table style="">';
                content += '<tr>'
                content += '<th style="border: none;"><i class="fa fa-building-o" aria-hidden="true" style="font-size: 20px; padding: 10px;color:#d52133"></i></th>';
                content += '<th style="padding: 5px 0px; border: none;width: 100%;"><div class="itmAgenciaTitle" >' + item.Nombre + '</div>   <div class="itmAgenciaDireccion" ><i>' + item.Direccion + '</i></div>  <div class="itmAgenciaRegion" >' + item.Region + '</div>   </th>';
                content += '<th style="border: none; width: 45px !important; white-space: pre-wrap; align-items: center; align-content: center; text-align: center;">' + item.Metrica + '</th>';
                content += '</tr></table>';
                return content;
            },
            noDataText: "No hay información",
            searchEnabled: true,
            searchExpr: ["Nombre", "Direccion", "Region"],
            searchMode: "contains",
            searchPlaceholder: "Buscar Agencia...",
            placeholder: "Buscar Agencia...",
            valueExpr: "IdOficina",
            dropDownOptions: {
                showTitle: false
            },
        },
        llamar: function () {
            cordova.InAppBrowser.open('tel:' + selectedAg.Telefono1, '_system')
        },
        popupInfoAg: {
            showTitle: true,
            title: "Información Agencia",
            dragEnabled: false,
            closeOnOutsideClick: true,
            height: 280,
            showCloseButton: true,
        },
        ttInfoAgencia: {
            target: "#floatButtons",
            showEvent: undefined,//"mouseenter",
            hideEvent: "mouseleave",
            closeOnOutsideClick: true,
            position: "top",
            width: 220,
            contentTemplate: function (data, itm, el) {
                let content = '<div style=" text-align: justify; white-space: pre-wrap;background-color:white">' +
                    '<b style="color:#d52133;font-weight:900">¡Recuerda!</b>' +
                    '<div style="color:#333; white-space: pre-wrap;">' +
                    'Presiona el boton de información si necesitas conocer más detalles sobre nuestras agencias.</div>' +
                    '</div>'
                return content;
            }
        },
    };

    viewModel.popupInfoAg.onShown = function () {
        $('#floatButtons').hide();
        $('#ttInfoAgencia').dxTooltip('option', 'visible', false);
    }

    viewModel.popupInfoAg.onHidden = function () {
        $('#floatButtons').show();
        if (!toolTipShown)
            $('#ttInfoAgencia').dxTooltip('option', 'visible', true);
    }

    function showInfo() {
        $('#popupInfoAg').dxPopup('option', 'visible', true);
    }

    function cancelRoute() {
        directionsDisplay.setPanel(undefined);
        var mapaActual = document.getElementById('googleMap');
        mapaActual.style.height = mapaActual.clientHeight + 200 + 'px';
        var panelRoute = document.getElementById('panelRoute');
        panelRoute.style.display = 'none';
        map.fitBounds(bounds);
    }

    function resetBounds() {
        bounds = new google.maps.LatLngBounds();
    }

    var deleteMarker = function (id) {
        let marker = markers[id];
        let info = infoMsgs[id];
        info.setMap(null);
        marker.setMap(null);
    }

    function setRoute(destination) {
        directionsDisplay.setMap(map);
        directionsDisplay.setPanel(document.getElementById('panelRoute'));
        var origin = currentPosition.Latitud + "," + currentPosition.Longitud;
        calculateAndDisplayRoute(directionsService, directionsDisplay, origin, destination); //positionNeighBour
        var mapaActual = document.getElementById('googleMap');
        mapaActual.style.height = mapaActual.clientHeight - 200 + 'px';
        var panelRoute = document.getElementById('panelRoute');
        panelRoute.style.display = 'block';
    }

    function setInitialMarker(position) {
        var pos = {
            lat: position.Latitud,
            lng: position.Longitud
        };

        var originMarker = new google.maps.Marker({
            animation: google.maps.Animation.DROP,
            id: 0
        });

        var infowindow = new google.maps.InfoWindow({
            content: "Usted está aquí",
            id: 0
        });

        infowindow.setPosition(pos);
        infowindow.open(map, originMarker);

        originMarker.setPosition(pos);
        originMarker.setMap(map);
        bounds.extend(pos);
    }

    function setAgMarkers(ag) {
        let markerAg = new google.maps.Marker({
            animation: google.maps.Animation.DROP,
            id: ag.IdOficina,
        });
        let infowindowAg = new google.maps.InfoWindow({
            content: ag.Nombre,
            id: ag.IdOficina,
        });
        infowindowAg.setPosition(ag.posMap);

        infowindowAg.open(map, markerAg);
        markerAg.setPosition(ag.posMap);
        markerAg.setIcon('./images/iconos/icons8-building-48.png');
        bounds.extend(ag.posMap);
        markerAg.setMap(map);

        markers[ag.IdOficina] = markerAg;
        infoMsgs[ag.IdOficina] = infowindowAg;
    }

    viewModel.luAgencias.onValueChanged = function (e) {
        $('#slideLogo').click();
        if (selectedAg) {
            deleteMarker(selectedAg.IdOficina);
            toolTipShown = true;
        };

        if (!selectedAg)
            $('#popupInfoAg').dxPopup('option', 'visible', true);

        selectedAg = agencias.find(itm => itm.IdOficina === e.value);
        $('#nombreAg').text(selectedAg.Nombre);
        $('#dirAg').text(selectedAg.Direccion);
        $('#regAg').text(selectedAg.Region);
        $('#distAg').text(selectedAg.Metrica);
        $('#horarioAg').text(selectedAg.Horario);
        $('#feriadoAg').text('(Cerrado en feriados)');

        if (selectedAg.Telefono2 && selectedAg.Telefono2 != "" && selectedAg.Telefono2 != "0")
            $('#telefAg').text('(' + selectedAg.Telefono1 + ') / (' + selectedAg.Telefono2 + ')');
        else
            $('#telefAg').text('(' + selectedAg.Telefono1 + ')');

        selectedAg.posMap = { lat: +selectedAg.Latitud, lng: +selectedAg.Longitud };
        resetBounds();
        setAgMarkers(selectedAg);
        setRoute(selectedAg.posMap);
        cancelRoute();
    }

    return viewModel;
};