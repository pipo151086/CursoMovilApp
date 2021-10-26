MobileBanking_App.SolCtaTrjDebMsg = function (params) {
    "use strict";

    var CtaDigitalForm = {};

    if (params && params.id)
        CtaDigitalForm = JSON.parse(params.id);


    var viewModel = {
        viewShowing: function () {
            hideFloatButtons();
        },
        viewShown: function () {
            setupPaginatorDots();

        },
        btnSiguiente: {
            text: "Siguiente",
            disabled: false,
            visible: true,
            readonly: false,
            onClick: function (params) {
                showSimpleMessage(CORE_TAG('DefaultTitle'), "Tu tarjeta de débito se generará automáticamente cuando la suma de tus depósitos sea igual o mayor a Q. 250.00", function () {
                    $('#popupCtaLista').dxPopup('option', 'visible', true);
                });
            }
        },
        popupCtaLista: {
            showTitle: true,
            title: CORE_TAG('DefaultTitle'),
            dragEnabled: false,
            closeOnOutsideClick: true,
            height: 250,
            showCloseButton: true,

            onShown: function () {
                $('#nuevoNumCta').text(CtaDigitalForm.NumeroCuentaCreada);
            }
        },

        btnDescargarCta: {
            icon: "fa fa-download",
            elementAttr: {
                class: "btnDownloadCtaNumber"
            },
            text: "Descargar No. de Cuenta",
            onClick: function () {
                initProcess("Preparando tu Cuenta");
                $('#popupCtaLista').dxPopup('option', 'visible', false);
                html2canvas(document.getElementById('contImgExpCtaDigital')).then(function (canvas) {
                    document.body.appendChild(canvas);
                    var img = canvas.toDataURL("image/png");
                    stopProcess();
                    if (typeof device !== 'undefined' && device && device.platform) {
                        PhotoViewer.show(img, 'Tu Nueva Cuenta de Ahorro');
                        var url = cordova.file.applicationStorageDirectory; // file or remote URL. url can also be dataURL, but giving it a file path is much faster
                        var album = 'Bantigua App';
                        cordova.plugins.photoLibrary.saveImage(img, album, function (libraryItem) {
                            console.log(libraryItem);
                        }, function (err) {
                            console.log(err)
                        });
                    }
                    ShowBienvenido();
                });
            }
        },
        btnAceptarCta: {
            text: "Aceptar",
            onClick: ShowBienvenido
        }
    };

    function ShowBienvenido() {
        $('#popupCtaLista').dxPopup('option', 'visible', false);
        showSimpleMessage(CORE_TAG('DefaultTitle'), '<div><div class="tltMsgBienvenido"><b>¡Bienvenido a tu cuenta de ahorro!</b><br/><br/></div>' +
            '<div>Revisa tu correo electrónico, por favor. Te hemos enviado los accesos para la Banca en línea.</div>'
            + '</div>',
            function () {
                debugger;

                var uri = MobileBanking_App.app.router.format({
                    view: 'SolCtaSuccess',
                    id: JSON.stringify({})
                });
                MobileBanking_App.app.navigate(uri, { root: true });
            });
    }


    function setupPaginatorDots() {
        if (CtaDigitalForm.TieneSesion === true) {
            $('#pagnatorTlt').text('Paso 1 / 2');

            $('#paginatorDots').append(
                '<div class="dot"></div>' +
                '<div class="dot active"></div>'
            );
        } else {
            $('#pagnatorTlt').text('Paso 3 / 4');

            $('#paginatorDots').append(
                '<div class="dot"></div>' +
                '<div class="dot"></div>' +
                '<div class="dot"></div>' +
                '<div class="dot active"></div>'
            );
        }
    }

    return viewModel;
};