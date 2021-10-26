MobileBanking_App.MapaAgencia = function (params) {
    "use strict";
    var dataAgency = null;

    if (params.id)
        dataAgency = JSON.parse(params.id);

    var Agencias = [];
    var markersData = [];
    var agencySelected = null;
    var provinceSelected;

    var viewModel = {
        viewShown: function () {
            try {
                $('#rdbProvincias').dxRadioGroup('option', 'value', dataAgency.Provincia);
                $('#btnCambiarAgencia').dxButton('option', 'text', dataAgency.NombreAgencia);
                $('#btnCambiarAgencia').dxButton('option', 'text', dataAgency.NombreAgencia);
                agencySelected = dataAgency;
                markerMap();
                if (SesionMovil)
                    SesionMovil.FechaActividadApp = new Date();
            } catch (e) {
                showException(e.message, e.stack);
            }

        },
        viewShowing: function () {
            hideFloatButtons();
        },
        viewHidden: function () {
            hideFloatButtons();
        },
        rdbProvincias: setupRadioGroup(dataAgency.CodigoProvincia, AgenciasBanco, 'NombreProvincia', 'CodigoProvincia'),
        rdbAgencias: setupRadioGroup(dataAgency.CodigoAgencia, dataAgency.Agencias, 'NombreAgencia', 'CodigoAgencia'),
        popupSeleccionProvincia: setupPopup(false, '90%', 'auto', true, 'PROVINCIAS', true),
        popupSeleccionAgencia: setupPopup(false, '90%', 'auto', true, 'AGENCIAS', true),
        btnCancelarP: setupButtonControlDefault(classButtons.Cancel, cancelSelectProvince),
        btnCancelarA: setupButtonControlDefault(classButtons.Cancel, cancelSelectAgency),
        btnCambiarProvincia: setupButtonControl(dataAgency.Provincia, changeProvince, undefined, undefined, iconosCore.chevron_down, undefined, true),
        btnCambiarAgencia: setupButtonControl(dataAgency.NombreAgencia, changeAgency, undefined, undefined, iconosCore.chevron_down, undefined, true),
        mapAgencia: setupMapControl(markersData, '102%', '100%', 11, 'markerLocation'),
        btnRuta: setupButtonControl('', getRoute, undefined, undefined, iconosCore.car)
    };

    function changeProvince() {
        $('#popupSeleccionProvincia').dxPopup('option', 'visible', true);
    }

    function cancelSelectProvince() {
        $('#popupSeleccionProvincia').dxPopup('option', 'visible', false);
    }

    function cancelSelectAgency() {
        $('#popupSeleccionAgencia').dxPopup('option', 'visible', false);
    }

    function changeAgency() {
        try {
            $('#popupSeleccionAgencia').dxPopup('option', 'visible', true);
        } catch (e) {
            showException(e.message, e.stack);
        }

    }

    viewModel.rdbProvincias.onValueChanged = function (e) {
        try {
            var selected = e.value;
            for (var i = 0; i < AgenciasBanco.length; i++) {
                if (selected == AgenciasBanco[i].CodigoProvincia) {
                    provinceSelected = AgenciasBanco[i];
                    i = AgenciasBanco.length;
                }
            }
            if (provinceSelected) {
                Agencias = [];
                Agencias.push({ CodigoAgencia: 'TOD', NombreAgencia: 'TODAS' });
                markersData = [];
                markersData.push({ location: { lat: currentPosition.Latitud, lng: currentPosition.Longitud }, tooltip: { text: 'Usted Está Aquí', isShown: true } });
                for (var i = 0; i < provinceSelected.Agencias.length; i++) {
                    Agencias.push(provinceSelected.Agencias[i]);
                }
                $('#rdbAgencias').dxRadioGroup('option', 'dataSource', Agencias);
                $('#rdbAgencias').dxRadioGroup('option', 'value', dataAgency.CodigoAgencia);

                $('#popupSeleccionProvincia').dxPopup('option', 'visible', false);
                $('#btnCambiarProvincia').dxButton('option', 'text', provinceSelected.NombreProvincia);
                $('#btnCambiarAgencia').dxButton('option', 'text', 'Seleccione Agencia');
            }
        } catch (e) {
            showException(e.message, e.stack);
        }

    }

    viewModel.rdbAgencias.onValueChanged = function (e) {
        try {
            var selected = e.value;
            for (var i = 0; i < Agencias.length; i++) {
                if (selected == Agencias[i].CodigoAgencia) {
                    agencySelected = Agencias[i];
                    i = Agencias.length;
                }
            }
            markerMap();
            $('#popupSeleccionAgencia').dxPopup('option', 'visible', false);
            $('#btnCambiarAgencia').dxButton('option', 'text', agencySelected.NombreAgencia);
            $('#mapAgencia').dxMap('option', 'zoom', 7);
        } catch (e) {
            showException(e.message, e.stack);
        }
    }

    function markerMap() {
        try {
            if (agencySelected) {
                markersData = [];
                markersData.push({ location: { lat: currentPosition.Latitud, lng: currentPosition.Longitud }, tooltip: { text: 'Usted Está Aquí', isShown: true } });
                if (agencySelected.CodigoAgencia != 'TOD') {
                    markersData.push({ location: { lat: agencySelected.Latitud, lng: agencySelected.Longitud }, tooltip: { text: getToolTipMap(agencySelected) }, onClick: undefined });
                    $('#mapAgencia').dxMap('option', 'markers', markersData);
                    changePropertyControl('#btnRuta', typeControl.button, 'visible', 'true');
                } else {
                    changePropertyControl('#btnRuta', typeControl.button, 'visible', 'false');
                    for (var i = 0; i < provinceSelected.Agencias.length; i++) {
                        markersData.push({ location: { lat: provinceSelected.Agencias[i].Latitud, lng: provinceSelected.Agencias[i].Longitud }, tooltip: { text: getToolTipMap(provinceSelected.Agencias[i]), isShown: false }, onClick: goLocationMap });
                    }
                    $('#mapAgencia').dxMap('option', 'markers', markersData);
                }
                $('#mapAgencia').dxMap('option', 'routes', []);
            }
        } catch (e) {
            showException(e.message, e.stack);
        }
    }

    function getToolTipMap(dataMap) {
        try {
            var toolTipMap = "<div>"
            + "<div style='margin-bottom: 5px; text-align:center; display:block; padding: 3px 0px; color: white; background-color: " + mainColor + "'><span>" + dataMap.NombreAgencia + "</span></div>"
            + "<div style='display:block'><label style='font-weight:bold; margin-right:2px'>Dirección:</label><span>" + dataMap.Direccion + "</span></div>"
            + "<div style='display:block'><label style='font-weight:bold; margin-right:2px'>Teléfonos:</label><span>" + dataMap.Telefonos + "</span></div>"
            + "<div style='display:block'><label style='font-weight:bold; margin-right:2px'>Horario Lunes a Viernes:</label><span>" + dataMap.HorariosLV + "</span></div>"
            + "<div style='display:block'><label style='font-weight:bold; margin-right:2px'>Horario Sábados:</label><span>" + dataMap.HorariosS + "</span></div>"
            + "<div style='display:block'><label style='font-weight:bold; margin-right:2px'>Horario Domingos:</label><span>" + dataMap.HorariosD + "</span></div>"
            + "</div>";
            return toolTipMap;
        } catch (e) {
            showException(e.message, e.stack);
        }
        
    }

    function goLocationMap(select) {
        try {
            markersData = [];
            markersData.push({ location: { lat: currentPosition.Latitud, lng: currentPosition.Longitud }, tooltip: { text: 'Usted Está Aquí', isShown: true } });
            markersData.push({ location: { lat: select.location.lat, lng: select.location.lng } });
            changePropertyControl('#btnRuta', typeControl.button, 'visible', 'true');
            $('#mapAgencia').dxMap('option', 'zoom', 18);
        } catch (e) {
            showException(e.message, e.stack);
        }
    }

    function getRoute() {
        try {
            var ruta = [{
                color: mainColor,
                weight: 6,
                opacity: '0.5',
                locations: [
                    [currentPosition.Latitud, currentPosition.Longitud],
                    [agencySelected.Latitud, agencySelected.Longitud]
                ]
            }]

            $('#mapAgencia').dxMap('option', 'routes', ruta);
        } catch (e) {
            showException(e.message, e.stack);
        }
        
    }

    return viewModel;
};