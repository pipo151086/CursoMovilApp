MobileBanking_App.Ubiquenos = function (params) {
    "use strict";

    var ubModel = {
        ProvinciaSeleccionada: ko.observable('PICHINCHA')
    }

    var dataProvince = null;

    var rowsInfoCard = [
        { dataField: 'NombreAgencia', isTitle: true },
        { dataField: 'Imagen', isImage: true },
        { dataField: 'Direccion', caption: 'Dirección' },
        { dataField: 'Telefonos', caption: 'Teléfonos' },
        { dataField: 'HorariosLV', caption: 'Horarios Lunes a Viernes' },
        { dataField: 'HorariosS', caption: 'Horarios Sábado' },
        { dataField: 'HorariosD', caption: 'Horarios Domingo' },
        { dataField: 'HorariosFD', caption: 'Horarios Feriado' },
        { dataField: 'Observacion', caption: 'Observación' },
    ]

    var viewModel = {
        viewShown: function () {
            selectProvince();
            if (SesionMovil)
                SesionMovil.FechaActividadApp = new Date();
        },
        viewShowing: function () {
            hideFloatButtons();
        },
        viewHidden: function(){
            hideFloatButtons();
        },
        rdbProvincias: setupRadioGroup(ubModel.ProvinciaSeleccionada, AgenciasBanco, 'NombreProvincia', 'CodigoProvincia'),
        popupSeleccionProvincia: setupPopup(false, '90%', '80%', true, 'Provincias', true),
        btnCancelar: setupButtonControlDefault(classButtons.Cancel, cancelSelectProvince),
        btnCambiarProvincia: setupButtonControl(ubModel.ProvinciaSeleccionada, changeProvince, undefined, undefined, iconosCore.chevron_down, undefined, true),
    };

    function changeProvince() {
        try {
            changePropertyControl('#popupSeleccionProvincia', typeControl.Popup, 'visible', true);
        } catch (e) {
            showException(e.message, e.stack);
        }
    }

    viewModel.rdbProvincias.onValueChanged = function (e) {
        if (e.value)
            selectProvince();
    }

    function selectProvince() {
        try {
            changePropertyControl('#popupSeleccionProvincia', typeControl.Popup, 'visible', false);
            var provinceSelected = $('#rdbProvincias').dxRadioGroup('option', 'value');
            for (var i = 0; i < AgenciasBanco.length; i++) {
                if (provinceSelected == AgenciasBanco[i].CodigoProvincia) {
                    dataProvince = AgenciasBanco[i];
                    i = AgenciasBanco.length;
                }
            }
            if (dataProvince) {
                var spnInfo = document.getElementById('spnInformacion');
                spnInfo.innerHTML = dataProvince.NombreProvincia + " tiene <i style='font-size:20px; font-weight:bold; color:" + mainColor + "'>" + dataProvince.Agencias.length + "</i> Agencias";
                var itemData = dataProvince;
                var cardsAgencias = document.getElementById('crdAgencias');
                cardsAgencias.InfoCards(itemData.Agencias, rowsInfoCard, true, '#ededed', true, iconosCore.map_marker, showMapAgency);
                changePropertyControl('#btnCambiarProvincia', typeControl.Button, 'text', dataProvince.NombreProvincia);
            }
        } catch (e) {
            showException(e.message, e.stack);
        }

    }

    function cancelSelectProvince() {
        changePropertyControl('#popupSeleccionProvincia', typeControl.Popup, 'visible', false);
    }

    function showMapAgency(data) {
        try {
            MobileBanking_App.app.navigate('MapaAgencia/' + JSON.stringify(data));
        } catch (e) {
            showException(e.message, e.stack, JSON.stringify(data));
        }
    }

    return viewModel;
};