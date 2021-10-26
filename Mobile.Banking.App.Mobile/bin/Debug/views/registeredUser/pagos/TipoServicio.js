MobileBanking_App.TipoServicio = function (params) {
    "use strict";

    var pathImg = './images/iconos/servicios/';

    var Servicios = [
        {
            id: 0,
            nombreMostrar: "EEGSA",
            viewName: "EEGSA",
            img: pathImg + 'EnergiaElectrica.png',
        },
        {
            id: 1,
            nombreMostrar: "DEOCSA",
            viewName: "DEOCSA",
            //img: pathImg + 'InternetMovil.png'
            img: pathImg + 'EnergiaElectrica.png'
        },
        {
            id: 2,
            nombreMostrar: "DEORSA",
            viewName: "DEORSA",
           //img: pathImg + 'ServicioCable.png'
            img: pathImg + 'EnergiaElectrica.png'
        },
        {
            id: 3,
            nombreMostrar: "CLARO",
            viewName: "CLARO",
            img: pathImg + 'Telefonia.png'
        },
        {
            id: 4,
            nombreMostrar: "TIGO",
            viewName: "TIGO",
           //img: pathImg + 'InternetMovil.png'
            img: pathImg + 'Telefonia.png'
        },
        {
            id: 5,
            nombreMostrar: "TIGO STAR",
            viewName: "TIGOSTAR",
            //img: pathImg + 'ServicioCable.png'
            img: pathImg + 'ServicioCable.png'
        },
        /*{
            id: 6,
            nombreMostrar: "MOVISTAR",
            viewName: "MOVISTAR",
            img: pathImg + 'Telefonia.png'
        },*/
        {
            id: 7,
            nombreMostrar: "PAQUETIGOS",
            viewName: "PAQUETIGOS",
            //img: pathImg + 'EnergiaElectrica.png'
            img: pathImg + 'InternetMovil.png'
        },
        {
            id: 8,
            nombreMostrar: "SUPER PACK",
            viewName: "SUPERPACK",
            img: pathImg + 'InternetMovil.png'
        },
        /*{
            id: 9,
            nombreMostrar: "TUENTI",
            viewName: "TUENTI",
            img: pathImg + 'Telefonia.png'
        }*/

    ]

    var viewModel = {
        viewShowing: function () {
            hideFloatButtons();
        },
        viewShown: function (w) {
            $("#tlServicios").dxTileView({
                items: Servicios,
                direction: 'vertical',
                onItemClick: function (args) {
                    var uri = MobileBanking_App.app.router.format({
                        view: args.itemData.viewName,
                        id: JSON.stringify(args.itemData)
                    });
                    MobileBanking_App.app.navigate(uri, { root: true });
                },
                itemTemplate: function (itemData, itemIndex, itemElement) {
                    var content = "<div style='width: 115px; border-style: solid;border-width: 1px; border-radius: 5px;text-align: -webkit-center;    border-color: lightgrey;' id='tileServContainer'>";
                    content += "<div style='margin: 0px 10px 10px 10px;font-weight: 600;color:#d52133'> " + itemData.nombreMostrar + "   </div>";
                    content += "<div style=\"background-image: url(" + itemData.img + "); height: 75px;width: 75px;background-position: center;background-size: cover;display: block; margin: 0px 10px 10px 10px; \"></div>";
                    content += "</div>";
                    return content;
                }
            });
            
            $('.dx-scrollview-content.dx-tileview-wrapper').css("margin-bottom", "50px");

        }
    };

    return viewModel;
};