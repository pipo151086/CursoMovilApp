MobileBanking_App.Vista1 = function (params) {
    "use strict";


    /*
     * 1. Creacion Vista
     * 2. Consultar Cliente SERVICIO
     * 3. Obtener Fechas 'yyyy-MM-ddTHH:mm:ssZ'        90%
     * 4. Obtener Fechas 'yyyy-MM-dd'    2%
     * 5. Obtener Fechas 'yyyy/MM/dd HH:mm:ss.000' 5%
     * 
     * 6. JS new Date()  Funciona En android        NO FUNCIONA EN iOS
     * 7. Libreria que utilizamos https://github.com/datejs/Datejs
     * 
     * 
     * 
     * 
     * 8.Libreria de Progress Bar https://kimmobrunfeldt.github.io/progressbar.js/
     * 
     * */


    var viewModel = {
        // setupDateControl(defaultValue, minDate, maxDate, width, typeStateField, readOnly)
        dtFechaNacimiento: setupDateControl('', undefined, undefined, undefined, undefined, undefined),

        viewShown: function () {
            let respuestaServidor = {
                //2021-07-14T23:03:25.000Z
                fechaNacimiento: '1986-10-15T07:50:33Z'
            }
            
            let experimento1 = new Date(respuestaServidor.fechaNacimiento);

            //1. Paso numero 1
            let experimento2 = Date.parse(respuestaServidor.fechaNacimiento);
            //Se CAEEEEEEEEEEEEEEEEEEE
            //$('#dtFechaNacimiento').dxDateBox('option', 'value', experimento2);



            //SI FUNCIONA
            $('#dtFechaNacimiento').dxDateBox('option', 'value', new Date(experimento2));
            //Deber Ser es:
            //1. Obtener data
            //2. Transformar con DateJS
            //3. Hacer todas las operaciones que necesitemos con DateJS
            //4. Hacer un new Date Para Integrarle al control

            let response = {
                registroViaje: true / false,
                desde: '2021-11-10 08:30:00Z',
                hasta: '2021-11-15',
                monto: 1332
            }









            /********************************************************************************************************/

            
            //var bar = new ProgressBar.Line(container, {
            var bar = new ProgressBar.Line(document.getElementById('container'), {
                strokeWidth: 4,
                easing: 'easeInOut',
                duration: 1400,
                color: '#FFEA82',
                trailColor: '#eee',
                trailWidth: 1,
                svgStyle: { width: '100%', height: '100%' },
                text: {
                    style: {
                        // Text color.
                        // Default: same as stroke color (options.color)
                        color: '#999',
                        position: 'absolute',
                        right: '0',
                        top: '30px',
                        padding: 0,
                        margin: 0,
                        transform: null
                    },
                    autoStyleContainer: false
                },
                from: { color: '#FFEA82' },
                to: { color: '#ED6A5A' },
                step: (state, bar) => {
                    bar.setText(Math.round(bar.value() * 100) + ' %');
                }
            });

            bar.animate(1.0);  // Number from 0.0 to 1.0

        }

    };






    return viewModel;
};