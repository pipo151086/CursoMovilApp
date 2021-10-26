MobileBanking_App.Inversiones = function (params) {
    "use strict";
    var datosInversion = null
    if (params.id)
        datosInversion = JSON.parse(params.id);
    
    var viewModel = {
        viewShown: function () {
            //selectInvestment();
            SesionMovil.FechaActividadApp = new Date();
            $('#lkpInversiones').dxLookup('option', 'value', datosInversion ? datosInversion.Codigo : SesionMovil.PosicionConsolidada.InversionesCliente[0].Codigo);
            $('#lkpInversiones').dxLookup('option', 'fieldTemplate', function (itemData, itemIndex, itemElement) {
                var content = "<div style='color: #d52133; font-style: italic'>";
                content = content + "<span>-" + itemData.Codigo + "-</span>";
                content = content + "</div>";
                return content;
            });
        },
        viewShowing: function () {
            hideFloatButtons();
        },
        viewHidden: function () {
            hideFloatButtons();
        },
        descripcion: datosInversion ? datosInversion.DescripcionItem : '',
        capital: datosInversion ? (((datosInversion.Moneda === 'GTQ') ? 'Q ' : '$ ') + datosInversion.Capital) : 0,
        plazo: datosInversion ? datosInversion.Plazo : 0,
        fechaCreacion: datosInversion ? Date.parse(datosInversion.FechaUltimoVencimiento) : Date.parse('t'),
        tasa: datosInversion ? (datosInversion.Tasa * 100) : 0,
        fechaUltimoVencimiento: datosInversion ? Date.parse(datosInversion.FechaUltimoVencimiento) : Date.parse('t'),

        lkpInversiones: setupLookupControl(undefined, SesionMovil.PosicionConsolidada.InversionesCliente, 'Codigo', 'Codigo', false, 'instantly', undefined, function (itemData, itemIndex, itemElement) {
            var content = "<div style='margin-left:20px; font-size:18px; color: #d52133'>";
            content = content + "<img style='display:inline-block; margin-right:10px; width:24px; height:24px' src='images/INV.png'></img>";
            content = content + "<span style='display:inline-block'>" + itemData.Codigo + "</span>";
            content = content + "</div>";

            return content;
        }, 'Inversiones'),
        lstBeneficiarios: setupListBox(datosInversion ? datosInversion.BeneficiariosInversion : [], modeSelection.None, false, 'auto', function (itemData, itemIndex, itemElement) {
            try {
                var beneficiario = itemData.Beneficiario;

                if (itemData.Beneficiario.length > 27)
                    beneficiario = itemData.Beneficiario.substring(0, 27) + '...';

                var content = "<div style='color:grey;'>";
                // content = content + "<span class='column-1-small'>" + itemData.Identificacion + "</span>";
                content = content + "<div class='' style='padding-left: 10px;width:70%;'><span>" + beneficiario + "</span></div>";
                content = content + "<div class='' style='padding-right: 10px;width:20%;' >";
                content = content + "<span style='font-size:12px;'>" + itemData.Telefono + "</span>";
                content = content + "</div>"

                return content;
            } catch (e) {
                showException(e.message, e.stack, JSON.stringify(itemData));
            }

        })
    };

    viewModel.lkpInversiones.onSelectionChanged = function (e) {
        datosInversion = e.selectedItem;
        if (datosInversion) {
            $('#datosInversion').show();
            $('#beneficiariosInversion').show();
            viewModel.descripcion = datosInversion.DescripcionItem;
            viewModel.capital = ((datosInversion.Moneda === 'GTQ') ? 'Q ' : '$ ') + Number(datosInversion.Capital).formatMoney(2, '.', ',');
            viewModel.plazo = datosInversion.Plazo;
            viewModel.tasa = (datosInversion.Tasa * 100);
            viewModel.fechaUltimoVencimiento = Date.parse(datosInversion.FechaUltimoVencimiento);
            viewModel.fechaCreacion = Date.parse(datosInversion.FechaCreacion.split('.')[0]);
            $('#spnDescripcion').text(viewModel.descripcion);
            $('#spnFechaUltimoVencimiento').text(Date.parse(viewModel.fechaUltimoVencimiento).toString(ConstantsBehaivor.PATTERN_SHORTDATE));
            $('#spnFechaCreacion').text(Date.parse(viewModel.fechaCreacion).toString(ConstantsBehaivor.PATTERN_SHORTDATE));
            $('#spnCapital').text(viewModel.capital);
            $('#spnPlazo').text(viewModel.plazo);
            $('#spnTasa').text(parseFloat(viewModel.tasa).toFixed(2) + '%');
            var beneficiariosOrden = jslinq(datosInversion.BeneficiariosInversion).orderBy(function (t) { return t.Beneficiario }).toList();;
            $('#lstBeneficiarios').dxList('option', 'dataSource', beneficiariosOrden);
        } else {
            $('#datosInversion').hide();
            $('#beneficiariosInversion').hide();
        }
    }

    return viewModel;
};