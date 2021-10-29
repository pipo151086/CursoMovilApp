var titleServicio = "Pago de Servicios";
var DeviceInfo;
var TokenAPN_GCM = 'TokenSimulador';
var RegisterUserEntityProcess;
var controlAccesoGlobal;
var contextoCliente;
var PosicionConsolidadaCliente;
var EntidadesFinancieras = [];
var invitacionesPendientesVS = [];
var gruposVS = [];
var allowRefreshDataVS = false;
var pinInvalidos = '0000,1111,2222,3333,4444,5555,6666,7777,8888,9999,0123,1234,2345,3456,4567,5678,6789,7890';
var PinStatusOk = true;
var pinValue = '';
var consolidatedPosition = {
    Cuentas: [],
    Tarjetas: [],
    TarjetasMarca: [],

    Creditos: [],
    Inversiones: []
};

var fPreventPropagationEvent = function (e) {
    e.preventDefault();
    e.stopPropagation();
    window.scrollTo(0, 0); //the second 0 marks the Y scroll pos. Setting this to i.e. 100 will push the screen up by 100px.
}

var getDateFormat = function (date) {
    try {
        if (date) {
            var newDate = Date.parse(date.split('T')[0]);
            return newDate.toString(ConstantsBehaivor.PATTERN_SHORTDATE);
        }
        else
            Date.parse('t').toString(ConstantsBehaivor.PATTERN_SHORTDATE);
    } catch (e) {
        return Date.parse('t').toString(ConstantsBehaivor.PATTERN_SHORTDATE);
    }
}

var AgenciasBanco = [
    {
        CodigoProvincia: 'AZUAY', NombreProvincia: 'AZUAY', Agencias: [
            { Provincia: 'AZUAY', CodigoAgencia: 'CUE', NombreAgencia: 'CUENCA', Direccion: 'Luis Cordero 6-51 y Presidente Córdova', Telefonos: '07-2821777, 07-2881231, 07-2821029, 07-2823526, 07-2836720', HorariosLV: 'de 09H00 a 18H00', HorariosS: 'de 09H00 a 13H00', HorariosD: 'No hay atención', Latitud: -2.899005, Longitud: -79.0064633 }
        ]
    },
    {
        CodigoProvincia: 'CHIMBORAZO', NombreProvincia: 'CHIMBORAZO', Agencias: [
            { Provincia: 'CHIMBORAZO', CodigoAgencia: 'RIO', NombreAgencia: 'RIOBAMBA', Direccion: 'Calle 1ra. Constituyente 2723 entre Pichincha y Rocafuerte', Telefonos: '03-2940733, 03-2940734, 03-2947059, 03-2947060, 03-2947061, 03-2961821', HorariosLV: 'de 09H00 a 18H00', HorariosS: 'de 09H00 a 13H00', HorariosD: 'No hay atención', Latitud: -1.6703138, Longitud: -78.6538135 }
        ]
    },
    {
        CodigoProvincia: 'COTOPAXI', NombreProvincia: 'COTOPAXI', Agencias: [
            { Provincia: 'COTOPAXI', CodigoAgencia: 'LAT', NombreAgencia: 'LATACUNGA', Direccion: 'Calle Juan Abel Echeverria s/n entre Quito y Belisario Quevedo', Telefonos: '03-2813388, 03-2813790, 03-2813402', HorariosLV: 'de 09H00 a 18H00', HorariosS: 'de 09H00 a 13H00', HorariosD: 'No hay atención', Latitud: -0.9312941, Longitud: -78.6190286 },
            { Provincia: 'COTOPAXI', CodigoAgencia: 'SALC', NombreAgencia: 'SALCEDO', Direccion: 'Calle Bolívar y Sucre (junto al Palacio Municipal)', Telefonos: '03-2726003', HorariosLV: 'de 09H00 a 17H00', HorariosS: 'No hay atención', HorariosD: 'de 09H00 a 13H00', Latitud: -1.0396744, Longitud: -78.5998822 },
        ]
    },
    {
        CodigoProvincia: 'ELORO', NombreProvincia: 'EL ORO', Agencias: [
            { Provincia: 'ELORO', CodigoAgencia: 'MACH', NombreAgencia: 'MACHALA', Direccion: 'Rocafuerte y Santa Rosa, esquina (frente al Consejo Nacional Electoral de El Oro)', Telefonos: '07-2968961, 07-2968965, 07-2968963 ', HorariosLV: 'de 09H00 a 17H00', HorariosS: 'de 09H00 a 13H00', HorariosD: 'No hay atención', Latitud: -3.2575808, Longitud: -79.9638904 }
        ]
    },
    {
        CodigoProvincia: 'ESMERALDAS', NombreProvincia: 'ESMERALDAS', Agencias: [
            { Provincia: 'ESMERALDAS', CodigoAgencia: 'QUIN', NombreAgencia: 'QUININDÉ (MICRO)', Direccion: 'Av. Simón Plata Torres s/n Y Nelson Valencia', Telefonos: '06-2738093 ', HorariosLV: 'de 09H00 a 17H00', HorariosS: 'de 09H00 a 13H00', HorariosD: 'No hay atención', Latitud: 0.3330847, Longitud: -79.4738249 },
            { Provincia: 'ESMERALDAS', CodigoAgencia: 'ESME', NombreAgencia: 'ESMERALDAS', Direccion: 'Calle Sucre y 9 de Octubre esquina', Telefonos: '06-2722740, 06-2722762, 06-2723279, 06-2723403, 06-2723694, 06-2723815, 06-2724142, 06-2724746', HorariosLV: 'de 09H00 a 17H00', HorariosS: 'de 09H00 a 13H00', HorariosD: 'No hay atención', Latitud: 0.9663485, Longitud: -79.6548625 },
        ]
    },
    {
        CodigoProvincia: 'GUAYAS', NombreProvincia: 'GUAYAS', Agencias: [
            { Provincia: 'GUAYAS', CodigoAgencia: '25JUL', NombreAgencia: '25 DE JULIO', Direccion: 'Av. 25 de Julio, entre calle 1ra y 6ta, ciudadela 9 de Octubre', Telefonos: '04-2439759, 04-2439551, 04-2439151, 04-2439949, 04-2439317', HorariosLV: 'de 09H00 a 17H00', HorariosS: 'de 09H00 a 13H00', HorariosD: 'No hay atención', Latitud: -2.2341086, Longitud: -79.8948898 },
            { Provincia: 'GUAYAS', CodigoAgencia: 'ALB', NombreAgencia: 'ALBORADA', Direccion: 'Av. Rodolfo Baquerizo Nazur y Calle lateral 12 C.C. Gran Albocentro Locales 1-2-3-4', Telefonos: '04-2277655, 04-2277672', HorariosLV: 'de 09H30 a 17H30', HorariosS: 'de 10H00 a 13H00', HorariosD: 'No hay atención', Latitud: -2.1326475, Longitud: -79.9034677 },
            { Provincia: 'GUAYAS', CodigoAgencia: 'CITMAL', NombreAgencia: 'CITY MALL', Direccion: 'Av. Benjamín Carrión y calle Ing. Felipe Peso C.C. City Mall primera planta locales 106-107', Telefonos: '04-3068331 , 04-3068334 , 04-3068332, 04-3068333, 04-3068335, 04-3068336', HorariosLV: 'de 10H00 a 18H00', HorariosS: 'de 10H00 a 16H00', HorariosD: 'No hay atención', HorariosFD: 'de 10H00 a 14H00', Latitud: -2.1403018, Longitud: -79.9109513 },
            { Provincia: 'GUAYAS', CodigoAgencia: 'MILA', NombreAgencia: 'MILAGRO', Direccion: 'García Moreno S/N entre 12 de Febrero y Miguel Valverde C. C. La Milagreña.', Telefonos: '04-2970181, 04-2971317', HorariosLV: 'de 09H00 a 17H30', HorariosS: 'de 09H00 a 13H00', HorariosD: 'No hay atención', Latitud: -2.127776, Longitud: -79.593739 },
            { Provincia: 'GUAYAS', CodigoAgencia: 'POR', NombreAgencia: 'PORTETE', Direccion: 'Av. 17 ava # 4121 y Portete', Telefonos: '04-2617754, 04-2463493, 04-2471600', HorariosLV: 'de 09H00 a 17H30', HorariosS: 'de 10H00 a 13H00', HorariosD: 'No hay atención', Latitud: -2.2018814, Longitud: -79.9181074 },
            { Provincia: 'GUAYAS', CodigoAgencia: 'JUN', NombreAgencia: 'JUNÍN', Direccion: 'Junín 400 y General Córdova', Telefonos: '04-3717300', HorariosLV: 'de 09H00 a 18H00', HorariosS: 'de 09H00 a 13H00', HorariosD: 'No hay atención', Latitud: -2.1898141, Longitud: -79.8832746 },
            { Provincia: 'GUAYAS', CodigoAgencia: 'LAMER', NombreAgencia: 'LA MERCED', Direccion: 'General Córdova 920-922 y P. Icaza', Telefonos: '04-3717300', HorariosLV: 'de 09H30 a 17H30', HorariosS: 'de 10H00 a 13H00', HorariosD: 'No hay atención', Latitud: -2.190985, Longitud: -79.8836431 },
            { Provincia: 'GUAYAS', CodigoAgencia: 'MALSUR', NombreAgencia: 'MALL DEL SUR', Direccion: 'Av. 25 de Julio y Ernesto Albán C.C. Mall del Sur, local 149 (PA)', Telefonos: '04-2085288', HorariosLV: 'de 10H00 a 18H00', HorariosS: 'de 10H00 a 16H00', HorariosD: 'No hay atención', HorariosFD: 'de 10H00 a 14H00', Latitud: -2.2288416, Longitud: -79.9002677 },
            { Provincia: 'GUAYAS', CodigoAgencia: 'PARCAL', NombreAgencia: 'PARQUE CALIFORNIA', Direccion: 'Vía Daule Km 11 1/2, C.C. Parque California 2, Local 16', Telefonos: '04-2103281, 04-2103282, 04-103138, 04103265, 04103816, 04103328', HorariosLV: 'de 09H00 a 18H00', HorariosS: 'de 09H00 a 13H00', HorariosD: 'No hay atención', Latitud: -2.1015074, Longitud: -79.9393698 },
            { Provincia: 'GUAYAS', CodigoAgencia: 'URD', NombreAgencia: 'URDESA', Direccion: 'Av. Víctor Emilio Estrada 412 y Dátiles', Telefonos: '04-3717300', HorariosLV: 'de 09H00 a 17H00', HorariosS: 'de 10H00 a 13H00', HorariosD: 'No hay atención', Latitud: -2.1724607, Longitud: -79.9097918 },
            { Provincia: 'GUAYAS', CodigoAgencia: 'MALFOR', NombreAgencia: 'MALL EL FORTÍN', Direccion: 'Km. 25 Vía Perimetral entre Av. Modesto Luque y Casuarinas C.C. Mall El Fortín Planta Alta Locales 231-232', Telefonos: '04-2965063', HorariosLV: 'de 10H00 a 18H00', HorariosS: 'de 10H00 a 16H00', HorariosD: 'No hay atención', HorariosFD: 'de 10H00 a 14H00', Latitud: -2.109409, Longitud: -79.9511873 },
            { Provincia: 'GUAYAS', CodigoAgencia: 'SHOPDUR', NombreAgencia: 'SHOPPING DURÁN', Direccion: 'Km.3,5 vía Durán Boliche C.C. Paseo Shopping Durán Local 78', Telefonos: '04-2161057, 04-2161080M, 04-2161081', HorariosLV: 'de 10H00 a 18H00', HorariosS: 'de 10H00 a 16H00', HorariosD: 'No hay atención', HorariosFD: 'de 10H00 a 14H00', Latitud: -2.168639, Longitud: -79.8304408 },
        ]
    },
    {
        CodigoProvincia: 'IMBABURA', NombreProvincia: 'IMBABURA', Agencias: [
            { Provincia: 'IMBABURA', CodigoAgencia: 'IBAR', NombreAgencia: 'IBARRA', Direccion: 'Olmedo #1145 entre Perez Guerrero y Colón', Telefonos: '06-2957858, 06-2950391, 062958523', HorariosLV: 'de 09H00 a 18H00', HorariosS: 'de 09H00 a 13H00', HorariosD: 'No hay atención', Latitud: 0.3461023, Longitud: -78.1222513 },
            { Provincia: 'IMBABURA', CodigoAgencia: 'OTA', NombreAgencia: 'OTAVALO', Direccion: 'Bolívar y Av. Abdón Calderón (esq.)', Telefonos: '062-926147, 062-926146', HorariosLV: 'de 09H00 a 18H00', HorariosS: 'de 09H00 a 13H00', HorariosD: 'No hay atención', Latitud: 0.00, Longitud: 0.00 },
        ]
    },
    {
        CodigoProvincia: 'LOJA', NombreProvincia: 'LOJA', Agencias: [
            { Provincia: 'LOJA', CodigoAgencia: 'LOJA', NombreAgencia: 'LOJA', Direccion: 'José Antonio Eguiguren 15-33 entre Sucre y 18 de Noviembre', Telefonos: '07-2586028, 07-2577220, 07-2586062', HorariosLV: 'de 09H00 a 18H00', HorariosS: 'de 09H00 a 13H00', HorariosD: 'No hay atención', Latitud: -4.0004387, Longitud: -79.2048719 }
        ]
    },
    {
        CodigoProvincia: 'LOSRIOS', NombreProvincia: 'LOS RÍOS', Agencias: [
            { Provincia: 'LOSRIOS', CodigoAgencia: 'QUEV', NombreAgencia: 'QUEVEDO (MICRO)', Direccion: 'Av. 7 de Octubre entre la 11va. y 12va.', Telefonos: '05-2762-500, 05-2756-800', HorariosLV: 'de 09H00 a 17H00', HorariosS: 'de 09H00 a 13H00', HorariosD: 'No hay atención', Latitud: -1.028167, Longitud: -79.467890 }
        ]
    },
    {
        CodigoProvincia: 'MANABI', NombreProvincia: 'MANABÍ', Agencias: [
            { Provincia: 'MANABI', CodigoAgencia: 'CHON', NombreAgencia: 'CHONE', Direccion: 'Pichincha 040 entre Washington y Paez', Telefonos: '05-2696997, 05-2699869', HorariosLV: 'de 09H00 a 17H00', HorariosS: 'de 09H00 a 13H00', HorariosD: 'No hay atención', Latitud: -0.6970356, Longitud: -80.0978617 },
            { Provincia: 'MANABI', CodigoAgencia: 'ELCAR', NombreAgencia: 'EL CARMEN', Direccion: 'Av. Chone s/n y Abdon Calderón', Telefonos: '05-2660495 ', HorariosLV: 'de 09H00 a 17H00', HorariosS: 'de 09H00 a 13H00', HorariosD: 'No hay atención', Latitud: 0.00, Longitud: 0.00 },
            { Provincia: 'MANABI', CodigoAgencia: 'MANCEN', NombreAgencia: 'MANTA CENTRO', Direccion: 'Calle 10 Av. Cuarta', Telefonos: '05-2624912', HorariosLV: 'de 09H00 a 17H00', HorariosS: 'de 09H00 a 13H00', HorariosD: 'No hay atención', Latitud: -0.9477046, Longitud: -80.7246317 },
            { Provincia: 'MANABI', CodigoAgencia: 'MANTAR', NombreAgencia: 'MANTA TARQUI', Direccion: 'Pichincha 040 entre Washington y Paez', Telefonos: '05-2696997, 05-2699869', HorariosLV: 'de 09H00 a 17H00', HorariosS: 'de 09H00 a 13H00', HorariosD: 'No hay atención', Observacion: 'Fuera de Servicio por reconstrucción', Latitud: -0.9477046, Longitud: -80.7246317 },
            { Provincia: 'MANABI', CodigoAgencia: 'PORVIEOLM', NombreAgencia: 'PORTOVIEJO OLMEDO', Direccion: 'Olmedo entre 10 de Agosto y Córdova', Telefonos: '05-2654768, 05-2654770', HorariosLV: 'de 09H00 a 17H00', HorariosS: 'de 09H00 a 13H00', HorariosD: 'No hay atención', Observacion: 'Fuera de Servicio por reconstrucción', Latitud: -1.0460123, Longitud: -80.4720439 },
            { Provincia: 'MANABI', CodigoAgencia: 'PORVIECEN', NombreAgencia: 'PORTOVIEJO CENTRO', Direccion: 'Rocafuerte entre Pedro Gual y 9 de Octubre', Telefonos: '05-2655122, 05-2655222', HorariosLV: 'de 09H00 a 17H00', HorariosS: 'de 09H00 a 13H00', HorariosD: 'No hay atención', Observacion: 'Fuera de Servicio por reconstrucción', Latitud: -1.0460123, Longitud: -80.4720439 },
            { Provincia: 'MANABI', CodigoAgencia: 'PORVIEEXP', NombreAgencia: 'PORTOVIEJO EXPRESS', Direccion: 'Av. Del Periodista, entre Av. Manabí y Av. 5 de Junio.', Telefonos: undefined, HorariosLV: 'de 09H00 a 17H00', HorariosS: 'de 09H00 a 13H00', HorariosD: 'No hay atención', Latitud: -1.0460123, Longitud: -80.4720439 },
        ]
    },
    {
        CodigoProvincia: 'PICHINCHA', NombreProvincia: 'PICHINCHA', Agencias: [
            { Provincia: 'PICHINCHA', CodigoAgencia: 'CAY', NombreAgencia: 'CAYAMBE', Direccion: 'Av. Restauración S1-97 y 10 de Agosto (esquina)', Telefonos: '02-2364-037, 02-2364-352, 02-2364-353', HorariosLV: 'de 09H00 a 18H00', HorariosS: 'de 09H00 a 13H00', HorariosD: 'No hay atención', Latitud: 0.0398993, Longitud: -78.1473958 },
            { Provincia: 'PICHINCHA', CodigoAgencia: 'MAC', NombreAgencia: 'MACHACHI', Direccion: 'Av. Amazonas 1-72 y González Suarez', Telefonos: '02-2310355, 02-2310-077, 02-2310-152, 02-2310-503', HorariosLV: 'de 09H00 a 17H00', HorariosS: 'No hay atención', HorariosD: 'de 09H00 a 13H00', Latitud: 0.5109188, Longitud: -78.5649056 },
            { Provincia: 'PICHINCHA', CodigoAgencia: 'ATAHOFIMIC', NombreAgencia: 'ATAHUALPA - UIO (MICRO)', Direccion: 'Av. Mariscal Sucre S11-449 y Pedro Capiro, C.C. Atahualpa', Telefonos: '02-2643256', HorariosLV: 'de 09H00 a 17H00', HorariosS: 'de 09H00 a 13H00 (solo último sábado de mes)', HorariosD: 'No hay atención', Latitud: -0.250591, Longitud: -78.5393468 },
            { Provincia: 'PICHINCHA', CodigoAgencia: 'CAR', NombreAgencia: 'CARAPUNGO', Direccion: 'Av. Padre Luis Vaccari N14-175 y Río Villarrica', Telefonos: '02-3483320, 02-2424430, 02-3483352', HorariosLV: 'de 09H00 a 17H00', HorariosS: 'de 09H00 a 13H00', HorariosD: 'No hay atención', Latitud: -0.100463, Longitud: -78.4557374 },
            { Provincia: 'PICHINCHA', CodigoAgencia: 'ELEJI', NombreAgencia: 'EL EJIDO', Direccion: 'Av. 10 de Agosto No. 16-41 y Buenos Aires', Telefonos: '02-3995000', HorariosLV: 'de 09H00 a 17H00', HorariosS: 'de 09H00 a 13H00', HorariosD: 'No hay atención', Latitud: -0.2109053, Longitud: -78.5012267 },
            { Provincia: 'PICHINCHA', CodigoAgencia: 'GUAM', NombreAgencia: 'GUAMANÍ', Direccion: 'Av. Maldonado km. 13 lote 14 y Río Congo (esquina)', Telefonos: '02-2699990, 02-2699991, 02-2699992', HorariosLV: 'de 09H00 a 17H00', HorariosS: 'de 09H00 a 13H00', HorariosD: 'No hay atención', Latitud: -0.3253457, Longitud: -78.5508122 },
            { Provincia: 'PICHINCHA', CodigoAgencia: 'GUAMOFIMIC', NombreAgencia: 'GUAMANÍ (MICRO)', Direccion: 'Av. Maldonado km. 13 S51-193 y Río Congo', Telefonos: '02-3651747', HorariosLV: 'de 09H00 a 17H00', HorariosS: 'de 09H00 a 13H00', HorariosD: 'No hay atención', Latitud: -0.3253457, Longitud: -78.5508122 },
            { Provincia: 'PICHINCHA', CodigoAgencia: 'INIA', NombreAgencia: 'IÑAQUITO', Direccion: 'Av. Amazonas N36-69 y Corea', Telefonos: '02-3950600', HorariosLV: 'de 09H00 a 17H00', HorariosS: 'No hay atención', HorariosD: 'No hay atención', Latitud: -0.176725, Longitud: -78.486056 },
            { Provincia: 'PICHINCHA', CodigoAgencia: 'SANLU', NombreAgencia: 'SAN LUÍS', Direccion: 'Av. General Rumiñahui C.C San Luis', Telefonos: '02-2090395, 02-2090139', HorariosLV: 'de 10H00 a 18H00', HorariosS: 'de 10H00 a 16H00', HorariosD: 'No hay atención', HorariosFD: 'de 10H00 a 14H00', Latitud: -0.3078977, Longitud: -78.4525251 },
            { Provincia: 'PICHINCHA', CodigoAgencia: 'MAYOR', NombreAgencia: 'MAYORISTA', Direccion: 'Av. Teniente Hugo Ortíz y Ayapamba', Telefonos: '02-2674301', HorariosLV: 'de 09H00 a 17H00', HorariosS: 'de 09H00 a 13H00', HorariosD: 'No hay atención', Latitud: -0.2786439, Longitud: -78.534115 },
            { Provincia: 'PICHINCHA', CodigoAgencia: 'COND', NombreAgencia: 'CONDADO', Direccion: 'Av, Mariscal Sucre y la Prensa Condado Shopping, local 127 (planta baja)', Telefonos: '02-3802342, 02-3802345', HorariosLV: 'de 10H00 a 18H00', HorariosS: 'de 10H00 a 16H00', HorariosD: 'No hay atención', HorariosFD: 'de 10H00 a 14H00', Latitud: -0.1034928, Longitud: -78.4927403 },
            { Provincia: 'PICHINCHA', CodigoAgencia: 'CENGARMOR', NombreAgencia: 'CENTRO GARCÍA MORENO', Direccion: 'García Moreno N5-44 entre Chile y Mejía', Telefonos: '02-2959713, 02-2284612', HorariosLV: 'de 09H00 a 17H30', HorariosS: 'de 09H00 a 13H00', HorariosD: 'No hay atención', Latitud: -0.2190987, Longitud: -78.51212 },
            { Provincia: 'PICHINCHA', CodigoAgencia: 'QUICNOR', NombreAgencia: 'QUICENTRO NORTE', Direccion: 'Av. Naciones Unidas y Av. 6 de Diciembre Quicentro Shopping (Subsuelo 1)', Telefonos: '02-2430023, 02-2430063', HorariosLV: 'de 10H00 a 18H00', HorariosS: 'de 10H00 a 16H00', HorariosD: 'No hay atención', HorariosFD: 'de 10H00 a 14H00', Latitud: -0.1762954, Longitud: -78.4816141 },
            { Provincia: 'PICHINCHA', CodigoAgencia: 'QUICSUR', NombreAgencia: 'QUICENTRO SUR', Direccion: 'Av. Quitumbre Ñan y Morán Valverde Centro Comercial Quicentro Sur, local 61', Telefonos: '02-4000690', HorariosLV: 'de 10H00 a 18H00', HorariosS: 'de 10H00 a 16H00', HorariosD: 'No hay atención', HorariosFD: 'de 10H00 a 14H00', Latitud: -0.2846758, Longitud: -78.54601 },
            { Provincia: 'PICHINCHA', CodigoAgencia: 'QUICSUR2', NombreAgencia: 'QUICENTRO SUR II', Direccion: 'Av. Quitumbe Ñan y Morán Valverde (Turubamba Alto) CC. Quicentro Sur, local 105', Telefonos: '02-4000602, 02-4008911', HorariosLV: 'de 10H00 a 18H00', HorariosS: 'de 10H00 a 16H00', HorariosD: 'No hay atención', HorariosFD: 'de 10H00 a 14H00', Latitud: -0.2846758, Longitud: -78.54601 },
            { Provincia: 'PICHINCHA', CodigoAgencia: 'CCREC', NombreAgencia: 'RECREO', Direccion: 'Pedro Vicente Maldonado C.C. El Recreo G 15', Telefonos: '02-2659410', HorariosLV: 'de 10H00 a 18H00', HorariosS: 'de 10H00 a 16H00', HorariosD: 'No hay atención', HorariosFD: 'de 10H00 a 14H00', Latitud: -0.2539363, Longitud: -78.5252758 },
            { Provincia: 'PICHINCHA', CodigoAgencia: 'CCREC2', NombreAgencia: 'RECREO II', Direccion: 'Av. Pedro Vicente Maldonado No. 14-205 C.C. El Recreo local e-23 (2do. piso)', Telefonos: '02-2659474, 02-2659475', HorariosLV: 'de 10H00 a 18H00', HorariosS: 'de 10H00 a 16H00', HorariosD: 'No hay atención', HorariosFD: 'de 10H00 a 14H00', Latitud: -0.2539363, Longitud: -78.5252758 },
            { Provincia: 'PICHINCHA', CodigoAgencia: 'SANG', NombreAgencia: 'SANGOLQUÍ', Direccion: 'Av. General Enríquez 2673 y Luis Cordero.', Telefonos: '02-2334060, 02-2334059, 02-2334058, 02-2081863, 02-2081866', HorariosLV: 'de 09H00 a 17H00', HorariosS: 'de 09H00 a 13H00', HorariosD: 'No hay atención', Latitud: -0.324423, Longitud: -78.449534 },
            { Provincia: 'PICHINCHA', CodigoAgencia: 'TUMB', NombreAgencia: 'TUMBACO', Direccion: 'Av. Interoceánica 1589 y Juan Montalvo', Telefonos: '02-2370255', HorariosLV: 'de 09H00 a 18H00', HorariosS: 'de 09H00 a 13H00', HorariosD: 'No hay atención', Latitud: -0.1932689, Longitud: -78.4701652 },
            { Provincia: 'PICHINCHA', CodigoAgencia: 'RODCHA', NombreAgencia: 'RODRIGO DE CHÁVEZ', Direccion: 'Av. Rodrigo de Chávez OE2-52 y Pedro de Alfaro.', Telefonos: '02-3819290', HorariosLV: 'de 09H00 a 17H00', HorariosS: 'No hay atención', HorariosD: 'No hay atención', Latitud: -0.242098, Longitud: -78.521145 },
            { Provincia: 'PICHINCHA', CodigoAgencia: 'ATAH', NombreAgencia: 'ATAHUALPA', Direccion: 'Av. Mariscal Sucre S11-449 y Pedro Capiro, Centro Comercial Atahualpa', Telefonos: '02-2652653, 02-2618949, 02-2619853', HorariosLV: 'de 10H00 a 18H00', HorariosS: 'de 10H00 a 16H00', HorariosD: 'No hay atención', HorariosFD: 'de 10H00 a 14H00', Latitud: -0.250591, Longitud: -78.5393468 },
            { Provincia: 'PICHINCHA', CodigoAgencia: 'TOMBER', NombreAgencia: 'TOMÁS DE BERLANGA', Direccion: 'Tomás de Berlanga Oe 8-12 e Isla Seymur (esq.)', Telefonos: '02-2445192, 02-2439751', HorariosLV: 'de 09H00 a 17H00', HorariosS: 'No hay atención', HorariosD: 'No hay atención', Latitud: -0.1649823, Longitud: -78.4819054 },
            { Provincia: 'PICHINCHA', CodigoAgencia: 'LAPREN', NombreAgencia: 'LA PRENSA', Direccion: 'Av. de La Prensa N58-195 y Cristóbal Vaca de Castro', Telefonos: '02-2291908, 02-2533263, 02-2296651', HorariosLV: 'de 09H00 a 17H00', HorariosS: 'de 09H00 a 13H00', HorariosD: 'No hay atención', Latitud: -0.1293196, Longitud: -78.4961199 },
        ]
    },
    {
        CodigoProvincia: 'SANTAELENA', NombreProvincia: 'SANTA ELENA', Agencias: [
            { Provincia: 'SANTAELENA', CodigoAgencia: 'LIB', NombreAgencia: 'LIBERTAD', Direccion: 'Av. cuarta y calle 23 solar 9 sector 7 Rocafuerte', Telefonos: '04-2781923', HorariosLV: 'de 09H00 a 17H00', HorariosS: 'de 09H00 a 13H00', HorariosD: 'No hay atención', Latitud: -2.2225657, Longitud: -80.9094188 }
        ]
    },
    {
        CodigoProvincia: 'SANTODOMINGO', NombreProvincia: 'SANTO DOMINGO', Agencias: [
            { Provincia: 'SANTODOMINGO', CodigoAgencia: 'SANDOM', NombreAgencia: 'SANTO DOMINGO', Direccion: 'Av. Quito s/n y Río Mulaute.', Telefonos: '02-2754230, 02-2754318, 02-2754277, 02-2754185', HorariosLV: 'de 09H00 a 18H00', HorariosS: 'de 09H00 a 13H00', HorariosD: 'No hay atención', Latitud: -0.2544486, Longitud: -79.1529734 }
        ]
    },
    {
        CodigoProvincia: 'TUNGURAHUA', NombreProvincia: 'TUNGURAHUA', Agencias: [
            { Provincia: 'TUNGURAHUA', CodigoAgencia: 'AMBCAST', NombreAgencia: 'AMBATO CASTILLO', Direccion: 'Mariano Castillo entre Sucre y Bolívar', Telefonos: '03-2820135', HorariosLV: 'de 09H00 a 17H00', HorariosS: 'de 09H00 a 13H00', HorariosD: 'No hay atención', Latitud: -1.2427607, Longitud: -78.6314736 },
            { Provincia: 'TUNGURAHUA', CodigoAgencia: 'AMBCEV', NombreAgencia: 'AMBATO CEVALLOS', Direccion: 'Av. Cevallos 0348 y Unidad Nacional', Telefonos: '03-2420129, 03-2827221, 03-2822167', HorariosLV: 'de 09H00 a 18H00', HorariosS: 'de 09H00 a 13H00', HorariosD: 'No hay atención', Latitud: -1.2365995, Longitud: -78.6236303 },
            { Provincia: 'TUNGURAHUA', CodigoAgencia: 'PELI', NombreAgencia: 'PELILEO', Direccion: 'Calicuchima s/n y Ricaute', Telefonos: '03-2871583, 03-2871585, 03-2871582', HorariosLV: 'de 09H00 a 17H00', HorariosS: 'de 09H00 a 13H00', HorariosD: 'No hay atención', Latitud: 0.00, Longitud: 0.00 },
        ]
    },
]

var SesionMovil = {};

function GetDeviceInfo() {
    if (typeof device != 'undefined') {
        this.DeviceInfo = {
            DeviceManufacturer: device.manufacturer,
            DevicePhoneGap: device.phonegap,
            DevicePlatform: device.platform,
            DeviceUUID: device.uuid,
            DeviceVersion: device.version,
            DeviceRegistrado: "",
            DeviceModel: device.model,
        }
    } else {
        //InsertUserDummy();
        this.DeviceInfo = {
            DeviceName: 'NombreSimuladorPortales',
            DevicePhoneGap: 'PhoneGapSimuladorPortales',
            DevicePlatform: 'PlataformaSimuladorPortales',
            DeviceUUID: 'IdDispositivoSimuladorPortales',//Cambiar
            DeviceVersion: '1.0.0.0',
            DeviceRegistrado: "",
            DeviceManufacturer: 'ManufacturerSimuladorPortales',
            DeviceModel: 'ModelSimuladorPortales',
        }
    }
}

var OperacionEjecutar = {
    TransferenciaInterna: { id: 0, Titulo: "Transferencia Interna", dtoTransferenciaDirecta: {} },
    TransferenciaExterna: { id: 1, Titulo: "Transferencia Externa", dtoTransferenciaExterna: {} },
    CuentaBeneficiariaInterna: { id: 2, Titulo: "Registro cta. Interna", dtoCuentaBeneficiariaInterna: {} },
    CuentaBeneficiariaExterna: { id: 3, Titulo: "Registro cta. Externa", dtoCuentaBeneficiariaExterna: {} },
    CompraTiempoAire: { id: 4, Titulo: "Compra Tiempo Aire", dtoCompraTiempoAire: {} },
    EnrolarBilleteraMovil: { id: 5, Titulo: "Crear Billetera Móvil", dtoEnrolarBilleteraMovil: {} },
    PagoBilleteraMovil: { id: 6, Titulo: "Pago Billetera Móvil", dtoPagoBilleteraMovil: {} },
    //CNT
    PagoServicioBasicoCNT: { id: 7, Titulo: "Pago de CNT", dtoPagoCNT: {} },
    //PAGO SERVICIOS EASYCASH
    PagoServicioEasyCash: { id: 8, Titulo: "Pago de Servicio", dtoPagoServicio: {} },
    PagarCreditoConDebitoACuenta: { id: 9, Titulo: "Pagar Crédito", dtoPagarCreditoConDebitoACuenta: {} },
    PagarTarjetaConDebitoACuenta: { id: 10, Titulo: "Pagar Tarjeta", dtoPagarTarjetaConDebitoACuenta: {} },
    ConfigurarMontosMaximos: { id: 11, Titulo: "Montos Máximos", dtoConfigurarMontosMaximos: {} },
}

var objetoOperacionEjecutar;

var menuTusCuentas = "<div class='has-submenu' style='display:none' id='mnCuentas'><a class='menu-item show-submenu'><img class='img-menu' src='./images/iconos/tus-cuentas.png' /><em>" + CORE_TAG('Accounts') + "</em></a>" +
    "<div class='submenu'>" +
    "<a id='smnPosicionConsolidada' class='submenu-item'><img class='bulletMenu' src='./images/iconos/bullet-pasivo.png'></img><img class='linea'></img><em>" + CORE_TAG('PositionConsolidated') + "</em></a>" +
    "<a id='smnMovimientosCuentas' class='submenu-item'><img class='bulletMenu' src='./images/iconos/bullet-pasivo.png'></img><img class='linea'></img><em>" + CORE_TAG('LastMovements') + "</em></a>" +
    "<a id='smnMontosMaximos' class='submenu-item'><img class='bulletMenu' src='./images/iconos/bullet-pasivo.png'></img><em>" + CORE_TAG('MontosMaximos') + "</em></a>" +
    "</div></div>";

var menuCredito = "<div class='has-submenu' style='display:none' id='mnCreditos'><a class='menu-item show-submenu'><img class='img-menu' src='./images/iconos/credito.png' /><em>" + CORE_TAG('Credits') + "</em></a>" +
    "<div class='submenu'>" +
    "<a id='smnPayCreditDue' class='submenu-item'><img class='bulletMenu' src='./images/iconos/bullet-pasivo.png'><img class='linea'></img></img><em>" + CORE_TAG('PayCreditDue') + "</em></a>" +
    "<a id='smnEstadoCredito' class='submenu-item'><img class='bulletMenu' src='./images/iconos/bullet-pasivo.png'></img><em>" + CORE_TAG('CreditStatus') + "</em></a>" +
    "</div></div>";


var menuTransferencias = "<div class='has-submenu' style='display:none' id='mnTransferencias'><a class='menu-item show-submenu ' href='#'><img class='img-menu' src='./images/iconos/transferencias.png' /><em>" + CORE_TAG('Transfers') + "</em></a>" +
    "<div class='submenu'>" +
    "<a class='submenu-item' id='smnTransferenciaInterna'><img class='bulletMenu' src='./images/iconos/bullet-pasivo.png'></img><img class='linea'></img><em>" + CORE_TAG('InternalTransfers') + "</em></a>" +
    "<a class='submenu-item' id='smnBeneficiariosInternos'><img class='bulletMenu' src='./images/iconos/bullet-pasivo.png'></img><em>" + CORE_TAG('InternalBeneficiaries') + "</em></a>" +
    "</div></div>";

var menuTransferenciasExternas = "<div class='has-submenu' style='display:none' id='mnTransferenciasExternas'><a class='menu-item show-submenu ' href='#'><img class='img-menu' src='./images/iconos/tran-ach.png' /><em>" + CORE_TAG('ExternalTransfers') + "</em></a>" +
    "<div class='submenu'>" +
    "<a class='submenu-item' id='smnInfoACH'><img class='bulletMenu' src='./images/iconos/bullet-pasivo.png'><img class='linea'></img></img><em>" + CORE_TAG('InfoACH') + "</em></a>" +
    "<a class='submenu-item' id='smnBeneficiariosExternos'><img class='bulletMenu' src='./images/iconos/bullet-pasivo.png'><img class='linea'></img></img><em>" + CORE_TAG('ExternalBeneficiariesACH') + "</em></a>" +
    "<a class='submenu-item' id='smnTransferenciaExterna'><img class='bulletMenu' src='./images/iconos/bullet-pasivo.png'></img><img class='linea'></img><em>" + CORE_TAG('ExternalTransfersACH') + "</em></a>" +
    "<a class='submenu-item' id='smnhistoricACH'><img class='bulletMenu' src='./images/iconos/bullet-pasivo.png'></img><em>" + CORE_TAG('TransactionsHistoricACH') + "</em></a>" +
    "</div></div>";

var nuevoMenuAntojado = "<div class='has-submenu' style='display:none' id='mnMenuPaPa'><a class='menu-item show-submenu ' href='#'><img class='img-menu' src='./images/seguridad.png' /><em>" + CORE_TAG('NMENUPAPA') + "</em></a>" +
    "<div class='submenu'>" +
    "<a class='submenu-item' id='smnHijoNum1'><img class='bulletMenu' src='./images/iconos/bullet-pasivo.png'></img><img class='linea'></img><em>" + CORE_TAG('NMENUHIJO1') + "</em></a>" +
    "<a class='submenu-item' id='smnHijoNum3'><img class='bulletMenu' src='./images/iconos/bullet-pasivo.png'></img><img class='linea'></img><em>" + CORE_TAG('NMENUHIJO3') + "</em></a>" +
    "<a class='submenu-item' id='smnHijoNum2'><img class='bulletMenu' src='./images/iconos/bullet-pasivo.png'></img><em>" + CORE_TAG('NMENUHIJO2') + "</em></a>" +
    "</div></div>"



var menuCaptaciones = "<div class='has-submenu' style='display:none' id='mnCaptaciones'><a class='menu-item show-submenu'><img class='img-menu' src='./images/iconos/inversiones.png' /><em>" + CORE_TAG('Catchments') + "</em></a><div class='submenu'><a id='smnInversiones' class='submenu-item'><img class='bulletMenu' src='./images/iconos/bullet-pasivo.png'></img><em>" + CORE_TAG('Investments') + "</em></a></div></div>";


var menuTarjetas = "<div class='has-submenu' style='display:none;word-wrap: break-word;' id='mnTarjetas'><a class='menu-item show-submenu'><img class='img-menu' src='./images/iconos/trajetas.png' /><em>Tarjeta</em></a>" +
    "<div class='submenu' >" +
    "<a class='submenu-item' id='smnPagoTarjetas' ><img class='bulletMenu' src='./images/iconos/bullet-pasivo.png'><img class='linea'></img><em >" + CORE_TAG('CreditCardPayment') + "</em></a>" +
    "<a class='submenu-item' id='smnInfoTarjetas'><img class='bulletMenu' src='./images/iconos/bullet-pasivo.png'><img class='linea'></img></img><em>" + CORE_TAG('InfoCreditCard') + "</em></a>" +
    "<a class='submenu-item' id='smnSaldoTarjetas'><img class='bulletMenu' src='./images/iconos/bullet-pasivo.png'><img class='linea'></img></img><em>" + CORE_TAG('CreditcardBalance') + "</em></a>" +
    "<a class='submenu-item' id='smMovimientosTarjeta'><img class='bulletMenu' src='./images/iconos/bullet-pasivo.png'><img class='linea'></img></img><em>" + CORE_TAG('CreditCardMovements') + "</em></a>" +
    "<a class='submenu-item' id='smEstadoCuentaTarjeta'><img class='bulletMenu' src='./images/iconos/bullet-pasivo.png'></img><em>" + CORE_TAG('CreditCardStatus') + "</em></a>" +
    "</div></div>";

var menuTarjetasVisa = "<div class='has-submenu' style='display:none' id='mnTarjetasVisa'><a class='menu-item show-submenu'><img class='img-menu' src='./images/iconos/trajetas.png' /><em>" + CORE_TAG('VisaCards') + "</em></a><div class='submenu'><a id='smnMovimientosTarjetasVisa' class='submenu-item'><img class='bulletMenu' src='./images/iconos/bullet-pasivo.png'></img><img class='linea'></img><em>" + CORE_TAG('LastMovements') + "</em><i class='fa fa-circle'></i></a><a id='smnEstadosCuentaTarjetaVisa' class='submenu-item'><img class='bulletMenu' src='./images/iconos/bullet-pasivo.png'></img><em>" + CORE_TAG('AccountStatus') + "</em></a></div></div>";

var menuTransacciones = "<div class='has-submenu' style='display:none' id='mnTransacciones'><a class='menu-item show-submenu'><img class='img-menu' src='./images/iconos/transacciones.png' /><em>" + CORE_TAG('Dealings') + "</em></a>" +
    "<div class='submenu'>" +
    "<a class='submenu-item' id='smnCompraTiempoAire'><img class='bulletMenu' src='./images/iconos/bullet-pasivo.png'></img><em>" + CORE_TAG('BuyAirTime') + "</em></a>" +
    "</div></div>";

var menuConfiguracion = "<div class='has-submenu' id='mnConfiguracion'><a class='menu-item show-submenu '><img class='img-menu' src='./images/iconos/configuracion.png' /><em>" + CORE_TAG('Config') + "</em></a>" +
    "<div class='submenu'>" +
    "<a class='submenu-item' id='smnCambioPIN'><img class='bulletMenu' src='./images/iconos/bullet-pasivo.png'></img><em>" + CORE_TAG('ChangePIN') + "</em></a>" +
    "</div></div>";

var menuSalir = "<div class='menuSalirHandleClickEvent' id='mnSalir' onclick='salirBancaMovil()'><a class='menu-item show-submenu submenu' href='#' onclick='salirBancaMovil()'><img class='img-menu' src='./images/iconos/salir.png' /><em>" + CORE_TAG('SignOut') + "</em></a>" +
    "<div class='submenu'>" +
    "</div></div>";

var menuBilleteraMovil = "<div class='has-submenu' style='display:none' id='mnBilleteraMovil'><a class='menu-item show-submenu ' href='#'><img class='img-menu' src='./images/iconos/billetera-movil.png' /><em>" + CORE_TAG('MobileWallet') + "</em></a>" +
    "<div class='submenu'>" +
    "<a class='submenu-item' id='smnCreacionBilleteraMovil'><img class='bulletMenu' src='./images/iconos/bullet-pasivo.png'></img><img class='linea'></img><em>" + CORE_TAG('CreateMobileWallet') + "</em></a>" +
    "<a class='submenu-item' id='smnPagoBilleteraMovil'><img class='bulletMenu' src='./images/iconos/bullet-pasivo.png'></img><img class='linea'></img><em>" + CORE_TAG('PaymentsMobileWallet') + "</em></a>" +
    "<a class='submenu-item' id='smnNotificacionCobroBilleteraMovil'><img class='bulletMenu' src='./images/iconos/bullet-pasivo.png'></img><img class='linea'></img><em>" + CORE_TAG('ChargeNotificationMobileWallet') + "</em></a>" +
    "<a class='submenu-item' id='smnConsultaPagosPendientesBilleteraMovil'><img class='bulletMenu' src='./images/iconos/bullet-pasivo.png'><img class='linea'></img><em>" + CORE_TAG('QueryPendingPaymentsMobileWallet') + "</em></a>" +
    "<a class='submenu-item' id='smnBloqueoDesbloqueoBilleteraMovil'><img class='bulletMenu' src='./images/iconos/bullet-pasivo.png'></img><em>" + CORE_TAG('LockUnlockMobileWallet') + "</em></a>" +
    "</div></div>";

//var menuPagos = "<div class='has-submenu' style='display:none' id='mnPagos'><a class='menu-item show-submenu submenu' href='#'><img class='img-menu' src='./images/pagos-icon.png' /><em>" + CORE_TAG('Payments') + "</em></a>" +
//     "<div class='submenu'>" +
//     "<a class='submenu-item' id='smnRealizaTusPagos'><img class='bulletMenu' src='./images/iconos/bullet-pasivo.png'></img><img class='linea'></img><em>" + CORE_TAG('PerformYourPayments') + "</em></a>" +
//     "<a class='submenu-item' id='smnServiciosBasicosCNT'><img class='bulletMenu' src='./images/iconos/bullet-pasivo.png'></img><em>" + CORE_TAG('BasicServicesCNT') + "</em></a>" +
//     "</div></div>";


var menuPagos = "<div class='has-submenu' style='display:none' id='mnPagos'><a class='menu-item show-submenu ' href='#'><img class='img-menu' src='./images/pagos-icon.png' /><em>" + CORE_TAG('Payments') + "</em></a>" +
    "<div class='submenu'>" +
    "<a class='submenu-item' id='smnRealizaTusPagos'><img class='bulletMenu' src='./images/iconos/bullet-pasivo.png'></img><em>" + CORE_TAG('PerformYourPayments') + "</em></a>" +
    "</div></div>";

var menuAkisi = "<div class='has-submenu' style='display:none' id='mnAkisi'><a class='menu-item show-submenu ' href='#'><img class='img-menu' src='./images/iconos/akisilogo-app.png' /><em>" + CORE_TAG('AkisiMenu') + "</em></a>" +
    "<div class='submenu'>" +
    "<a class='submenu-item' id='smnCargarSaldo'><img class='bulletMenu' src='./images/iconos/bullet-pasivo.png'></img><em>" + CORE_TAG('AkisiCargaSaldo') + "</em></a>" +
    "</div></div>";

var anuncioOpciones = '<p class="sidebar-footer" style="">Opciones en esta versión.</p>'

//MenuConBotonPersonalizado
var menuAbreTuCtaDigital = '<div class="containerBotonNoClienteMenu" style="text-align: -webkit-center;margin-left: -25px;">' +
    '<div id="contBtnCtaDigMenu" style="" >' +
    '<div id="BtnCtaDigMenu" style="">' +
    '<span id="txt2BtnCtaDig" style="">' +
    '<span id="txt1BtnCtaDig" style="">Abre tu&nbsp</span>Cuenta de Ahorro' +
    '</span>' +
    '<div id="txt34ContBtnCtaDig">' +
    '<span id="txt3BtnCtaDig" style="">100%&nbsp</span>' +
    '<span id="txt4BtnCtaDig" style="">digital</span>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '<div id="menuBorder" style="border-bottom: solid 1px #CC0000; width: 80%;"></div>' +
    '</div >'


var htmlLeftSideMenu = '<div style="display:block; position:relative" class="sidebar-header"><div class="sidebar-header-logo"><a></a></div><div class="overlay"></div></div>'
    + menuAbreTuCtaDigital
    + menuTusCuentas
    + menuCredito
    + menuTransferencias
    + menuTransferenciasExternas
    + menuPagos
    + menuCaptaciones
    + menuTarjetas
    + menuAkisi



    + nuevoMenuAntojado



    //+ menuTarjetasVisa
    //+ menuTransacciones
    //+ menuBilleteraMovil
    + menuConfiguracion
    + menuSalir
    //  + anuncioOpciones
    + '</div>';

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

function GetUriDetalleCredito(productoId) {
    var uri = MobileBanking_App.app.router.format({
        view: 'DetalleCredito',
        id: JSON.stringify({ fromMenu: true, productoId: productoId })
    });
    return uri;
}

function buildMenuClient() {
    if (SesionMovil) {
        var leftMenu = document.getElementById('menuInicialMovil');
        if (leftMenu) {
            leftMenu.remove();
        }
        leftMenu = document.createElement('div');
        leftMenu.id = 'menuInicialMovil';
        leftMenu.classList.add('snap-drawer');
        leftMenu.classList.add('snap-drawer-left');

        leftMenu.innerHTML = htmlLeftSideMenu;

        $(leftMenu).dxScrollView();

        var snapDrawer = document.getElementById('snapDrawers');
        snapDrawer.appendChild(leftMenu);




        $('.show-submenu').click(function () {
            $(this).parent().find('.submenu').toggleClass('submenu-active');
            $(this).toggleClass('submenu-active');
            return false;
        });


        $('#mnBilleteraMovil').show();

        $('#mnMenuPaPa').show();

        for (var i = 0; i < SesionMovil.ProductosCliente.length; i++) {
            if (SesionMovil.ProductosCliente[i].CodigoProducto == 'CTA') {
                $('#mnCuentas').show();
                $('#mnPerfilTransaccional').show();
                $('#mnTransferencias').show();
                $('#mnTransferenciasExternas').show();


            } else if (SesionMovil.ProductosCliente[i].CodigoProducto == 'TRJ') {
                $('#mnTarjetas').show();

                $('#mnTransacciones').show();
                if (SesionMovil.PosicionConsolidada.TarjetasCliente.length > 0) {
                    $.map(SesionMovil.PosicionConsolidada.TarjetasCliente, function (item, index) {
                        try {
                            if (SesionMovil.PosicionConsolidada.TarjetasCliente[index].RecAfiliado) {
                                if (SesionMovil.PosicionConsolidada.TarjetasCliente[index].RecAfiliado === true) {
                                    $('#smnPlanConmigo').show();
                                } else {
                                    $('#smnPlanConmigo').hide();
                                }
                            }
                        } catch (e) {

                        }
                    });
                }
            } else if (SesionMovil.ProductosCliente[i].CodigoProducto == 'CRE') {
                $('#mnCreditos').show();
                var tieneCtas = jslinq(SesionMovil.ProductosCliente).any(function (el) {
                    return el.CodigoProducto == "CTA";
                });
                if (tieneCtas)
                    $('smnPayCreditDue').show();
            } else if (SesionMovil.ProductosCliente[i].CodigoProducto == 'INV') {
                $('#mnCaptaciones').show();
            }

        }

        if (SesionMovil.PosicionConsolidada.CuentasCliente != null) {
            for (var i = 0; i < SesionMovil.PosicionConsolidada.CuentasCliente.length; i++) {
                if (SesionMovil.PosicionConsolidada.CuentasCliente[i].TieneTarjetaDebito == true) {
                    $('#mnTransacciones').show();
                    i = SesionMovil.PosicionConsolidada.CuentasCliente.length;
                }
            }
        }

        if (SesionMovil.PosicionConsolidada.CuentasCliente != null || SesionMovil.PosicionConsolidada.TarjetasCliente != null) {
            $('#mnTransacciones').show();
            $('#smnCompraTiempoAire').show();
            $('#smnServiciosBasicosCNT').show();
            $('#mnPagos').show();
            $('#smnRealizaTusPagos').show();
            $('#mnAkisi').show();
        } else {
            $('#mnTransacciones').hide();
            $('#smnCompraTiempoAire').hide();
            $('#smnServiciosBasicosCNT').hide();
            $('#mnPagos').hide();
            $('#smnRealizaTusPagos').hide();
            $('#mnAkisi').hide();
        }

        $('#header-fixed').show();
        $('.header-clear').show();




        /*MENUCREDITO PRODUCTOS*/
        $('#smnMICROURBANO').click(function () {
            ResetSelectedMenuBullet();
            $('#smnMICROURBANO').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate(GetUriDetalleCredito('MICROURBANO'), { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        });
        $('#smnMICRORURAL').click(function () {
            ResetSelectedMenuBullet();
            $('#smnMICRORURAL').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate(GetUriDetalleCredito('MICRORURAL'), { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        });
        $('#smnMICROCAMPANIA').click(function () {
            ResetSelectedMenuBullet();
            $('#smnMICROCAMPANIA').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate(GetUriDetalleCredito('MICROCAMPANIA'), { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        });
        $('#smnVIVIENDA').click(function () {
            ResetSelectedMenuBullet();
            $('#smnVIVIENDA').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate(GetUriDetalleCredito('VIVIENDA'), { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        });
        $('#smnCOMERCIAL').click(function () {
            ResetSelectedMenuBullet();
            $('#smnCOMERCIAL').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate(GetUriDetalleCredito('COMERCIAL'), { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        });
        $('#smnPERSONAL').click(function () {
            ResetSelectedMenuBullet();
            $('#smnPERSONAL').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate(GetUriDetalleCredito('PERSONAL'), { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        });
        $('#smnBACKTOBACK').click(function () {
            ResetSelectedMenuBullet();
            $('#smnBACKTOBACK').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate(GetUriDetalleCredito('BACKTOBACK'), { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        });
        $('#smnESPECIAL').click(function () {
            ResetSelectedMenuBullet();
            $('#smnESPECIAL').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate(GetUriDetalleCredito('ESPECIAL'), { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        });
        $('#smnUNICREDITO').click(function () {
            ResetSelectedMenuBullet();
            $('#smnUNICREDITO').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate(GetUriDetalleCredito('UNICREDITO'), { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        });
        $('#smnCONVENIO').click(function () {
            ResetSelectedMenuBullet();
            $('#smnCONVENIO').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate(GetUriDetalleCredito('CONVENIO'), { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        });
        $('#smnIMPULSO').click(function () {
            ResetSelectedMenuBullet();
            $('#smnIMPULSO').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate(GetUriDetalleCredito('IMPULSO'), { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        });
        $('#smnICESA').click(function () {
            ResetSelectedMenuBullet();
            $('#smnICESA').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate(GetUriDetalleCredito('ICESA'), { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        });
        $('#smnEKOGAR').click(function () {
            ResetSelectedMenuBullet();
            $('#smnEKOGAR').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate(GetUriDetalleCredito('EKOGAR'), { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        });
        $('#smnORVE').click(function () {
            ResetSelectedMenuBullet();
            $('#smnORVE').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate(GetUriDetalleCredito('ORVE'), { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        });
        $('#smnPOINT').click(function () {
            ResetSelectedMenuBullet();
            $('#smnPOINT').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate(GetUriDetalleCredito('POINT'), { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        });
        $('#smnORIGINARSA').click(function () {
            ResetSelectedMenuBullet();
            $('#smnORIGINARSA').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate(GetUriDetalleCredito('ORIGINARSA'), { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        });
        $('#smnFIRMAS').click(function () {
            ResetSelectedMenuBullet();
            $('#smnFIRMAS').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate(GetUriDetalleCredito('FIRMAS'), { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        });
        $('#smnREESTRTRJ').click(function () {
            ResetSelectedMenuBullet();
            $('#smnREESTRTRJ').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate(GetUriDetalleCredito('REESTRTRJ'), { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        });
        $('#smnCARTIMEX').click(function () {
            ResetSelectedMenuBullet();
            $('#smnCARTIMEX').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate(GetUriDetalleCredito('CARTIMEX'), { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        });
        $('#smnPALITO').click(function () {
            ResetSelectedMenuBullet();
            $('#smnPALITO').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate(GetUriDetalleCredito('PALITO'), { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        });
        $('#smnCOMPTECO').click(function () {
            ResetSelectedMenuBullet();
            $('#smnCOMPTECO').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate(GetUriDetalleCredito('COMPTECO'), { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        });
        $('#smnNOVITAT').click(function () {
            ResetSelectedMenuBullet();
            $('#smnNOVITAT').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate(GetUriDetalleCredito('NOVITAT'), { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        });
        $('#smnMOTOFACIL').click(function () {
            ResetSelectedMenuBullet();
            $('#smnMOTOFACIL').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate(GetUriDetalleCredito('MOTOFACIL'), { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        });
        $('#smnINDIANMOTOS').click(function () {
            ResetSelectedMenuBullet();
            $('#smnINDIANMOTOS').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate(GetUriDetalleCredito('INDIANMOTOS'), { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        });
        $('#smnFDGCOMPUTER').click(function () {
            ResetSelectedMenuBullet();
            $('#smnFDGCOMPUTER').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate(GetUriDetalleCredito('FDGCOMPUTER'), { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        });
        $('#smnEYSCORP').click(function () {
            ResetSelectedMenuBullet();
            $('#smnEYSCORP').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate(GetUriDetalleCredito('EYSCORP'), { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        });
        $('#smnICESACCO').click(function () {
            ResetSelectedMenuBullet();
            $('#smnICESACCO').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate(GetUriDetalleCredito('ICESACCO'), { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        });
        $('#smnTARDI').click(function () {
            ResetSelectedMenuBullet();
            $('#smnTARDI').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate(GetUriDetalleCredito('TARDI'), { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        });
        $('#smnLAURORA').click(function () {
            ResetSelectedMenuBullet();
            $('#smnLAURORA').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate(GetUriDetalleCredito('LAURORA'), { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        });
        $('#smnCHEPEREZ').click(function () {
            ResetSelectedMenuBullet();
            $('#smnCHEPEREZ').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate(GetUriDetalleCredito('CHEPEREZ'), { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        });
        $('#smnDISTRIBPACIFICO').click(function () {
            ResetSelectedMenuBullet();
            $('#smnDISTRIBPACIFICO').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate(GetUriDetalleCredito('DISTRIBPACIFICO'), { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        });
        $('#smnELPENION').click(function () {
            ResetSelectedMenuBullet();
            $('#smnELPENION').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate(GetUriDetalleCredito('ELPENION'), { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        });
        $('#smnCONSMAPE').click(function () {
            ResetSelectedMenuBullet();
            $('#smnCONSMAPE').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate(GetUriDetalleCredito('CONSMAPE'), { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        });
        $('#smnCHIMASA').click(function () {
            ResetSelectedMenuBullet();
            $('#smnCHIMASA').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate(GetUriDetalleCredito('CHIMASA'), { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        });
        $('#smnOLLACONPRE').click(function () {
            ResetSelectedMenuBullet();
            $('#smnOLLACONPRE').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate(GetUriDetalleCredito('OLLACONPRE'), { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        });
        $('#smnARTEYMUEBLE').click(function () {
            ResetSelectedMenuBullet();
            $('#smnARTEYMUEBLE').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate(GetUriDetalleCredito('ARTEYMUEBLE'), { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        });
        $('#smnCARLETHY').click(function () {
            ResetSelectedMenuBullet();
            $('#smnCARLETHY').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate(GetUriDetalleCredito('CARLETHY'), { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        });
        $('#smnMASTERPC').click(function () {
            ResetSelectedMenuBullet();
            $('#smnMASTERPC').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate(GetUriDetalleCredito('MASTERPC'), { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        });
        $('#smnDISTRIBUIDORES').click(function () {
            ResetSelectedMenuBullet();
            $('#smnDISTRIBUIDORES').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate(GetUriDetalleCredito('DISTRIBUIDORES'), { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        });
        $('#smnPCCOUNO').click(function () {
            ResetSelectedMenuBullet();
            $('#smnPCCOUNO').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate(GetUriDetalleCredito('PCCOUNO'), { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        });
        $('#smnPCCODOS').click(function () {
            ResetSelectedMenuBullet();
            $('#smnPCCODOS').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate(GetUriDetalleCredito('PCCODOS'), { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        });
        $('#smnPCCOTRES').click(function () {
            ResetSelectedMenuBullet();
            $('#smnPCCOTRES').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate(GetUriDetalleCredito('PCCOTRES'), { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        });
        $('#smnPCCOCUATRO').click(function () {
            ResetSelectedMenuBullet();
            $('#smnPCCOCUATRO').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate(GetUriDetalleCredito('PCCOCUATRO'), { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        });
        $('#smnCINTICOMPDOS').click(function () {
            ResetSelectedMenuBullet();
            $('#smnCINTICOMPDOS').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate(GetUriDetalleCredito('CINTICOMPDOS'), { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        });
        $('#smnMICURBCOMPRA').click(function () {
            ResetSelectedMenuBullet();
            $('#smnMICURBCOMPRA').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate(GetUriDetalleCredito('MICURBCOMPRA'), { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        });
        $('#smnMICRURTRANSF').click(function () {
            ResetSelectedMenuBullet();
            $('#smnMICRURTRANSF').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate(GetUriDetalleCredito('MICRURTRANSF'), { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        });
        $('#smnMICCAMTRANSF').click(function () {
            ResetSelectedMenuBullet();
            $('#smnMICCAMTRANSF').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate(GetUriDetalleCredito('MICCAMTRANSF'), { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        });
        $('#smnMICURBTRANSF').click(function () {
            ResetSelectedMenuBullet();
            $('#smnMICURBTRANSF').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate(GetUriDetalleCredito('MICURBTRANSF'), { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        });
        $('#smnMOTORUNO').click(function () {
            ResetSelectedMenuBullet();
            $('#smnMOTORUNO').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate(GetUriDetalleCredito('MOTORUNO'), { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        });
        $('#smnCONSTRUMAJI').click(function () {
            ResetSelectedMenuBullet();
            $('#smnCONSTRUMAJI').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate(GetUriDetalleCredito('CONSTRUMAJI'), { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        });
        $('#smnTECNOHOGARDOS').click(function () {
            ResetSelectedMenuBullet();
            $('#smnTECNOHOGARDOS').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate(GetUriDetalleCredito('TECNOHOGARDOS'), { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        });
        $('#smnOLLAEMERFCUO').click(function () {
            ResetSelectedMenuBullet();
            $('#smnOLLAEMERFCUO').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate(GetUriDetalleCredito('OLLAEMERFCUO'), { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        });
        $('#smnMICNORMALIZ').click(function () {
            ResetSelectedMenuBullet();
            $('#smnMICNORMALIZ').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate(GetUriDetalleCredito('MICNORMALIZ'), { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        });
        $('#smnCONNORMALIZ').click(function () {
            ResetSelectedMenuBullet();
            $('#smnCONNORMALIZ').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate(GetUriDetalleCredito('CONNORMALIZ'), { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        });
        $('#smnCCONORMALIZ').click(function () {
            ResetSelectedMenuBullet();
            $('#smnCCONORMALIZ').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate(GetUriDetalleCredito('CCONORMALIZ'), { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        });
        $('#smnUNIFER').click(function () {
            ResetSelectedMenuBullet();
            $('#smnUNIFER').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate(GetUriDetalleCredito('UNIFER'), { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        });
        $('#smnMICROAEI').click(function () {
            ResetSelectedMenuBullet();
            $('#smnMICROAEI').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate(GetUriDetalleCredito('MICROAEI'), { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        });
        $('#smnLISTOYA').click(function () {
            ResetSelectedMenuBullet();
            $('#smnLISTOYA').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate(GetUriDetalleCredito('LISTOYA'), { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        });
        /*FIN MENUCREDITO PRODUCTOS*/

        $('#smnPosicionConsolidada').click(function () {
            ResetSelectedMenuBullet();
            $('#smnPosicionConsolidada').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate('PosicionConsolidada', { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        })

        $('#smnMovimientosCuentas').click(function () {
            ResetSelectedMenuBullet();
            $('#smnMovimientosCuentas').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate('Movimientos', { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        })

        $('#smnMontosMaximos').click(function () {
            ResetSelectedMenuBullet();
            $('#smnMontosMaximos').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate('RegCuposMax', { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        })



        $('#smnTransferenciaInterna').click(function () {
            ResetSelectedMenuBullet();
            $('#smnTransferenciaInterna').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate('TransferenciasInternas', { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        })

        $('#smnBeneficiariosExternos').click(function () {
            ResetSelectedMenuBullet();
            $('#smnBeneficiariosExternos').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate('BeneficiariosExternos', { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        })


        $('#smnBeneficiariosInternos').click(function () {
            ResetSelectedMenuBullet();
            $('#smnBeneficiariosInternos').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate('BeneficiariosInternos', { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        })

        $('#smnTransferenciaExterna').click(function () {
            ResetSelectedMenuBullet();
            $('#smnTransferenciaExterna').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate('TransferenciaExterna', { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        })

        $('#smnInversiones').click(function () {
            ResetSelectedMenuBullet();
            $('#smnInversiones').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate('Inversiones', { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        })

        $('#smnEstadoCredito').click(function () {
            ResetSelectedMenuBullet();
            $('#smnEstadoCredito').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate('CuotasCredito', { root: false });
            Vibrate(100);
            $('.open-left-sidebar').click();
        })

        $('#smnPayCreditDue').click(function () {
            ResetSelectedMenuBullet();
            $('#smnPayCreditDue').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate('PagoCredito', { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        })



        $('#smnInformacionCreditos').click(function () {
            ResetSelectedMenuBullet();
            $('#smnInformacionCreditos').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate('InformacionCreditos', { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        })


        $('#smnPuntosCredito').click(function () {
            ResetSelectedMenuBullet();
            $('#smnPuntosCredito').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate('PuntosCredito', { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        })

        /*$('#smnMovimientosTarjetasVisa').click(function () {
            ResetSelectedMenuBullet();
            $('#smnMovimientosTarjetasVisa').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate('MovimientosTarjetaVisa', { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        })

        $('#smnMovimientosTarjetas').click(function () {
            ResetSelectedMenuBullet();
            $('#smnMovimientosTarjetas').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate('MovimientosTarjeta', { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        })*/

        $('#smnPlanConmigo').click(function () {
            ResetSelectedMenuBullet();
            $('#smnPlanConmigo').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate('PlanConmigo', { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        })

        $('#smnContactenos').click(function () {
            ResetSelectedMenuBullet();
            $('#smnContactenos').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            Vibrate(100);
            $('.open-left-sidebar').click();
            $('.open-right-sidebar').click();
        })

        $('#smnContactoFacebook').click(function () {
            ResetSelectedMenuBullet();
            $('#smnContactoFacebook').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate('FacebookBS', { root: true });
            $('.open-left-sidebar').click();
        })

        $('#smnUbiquenos').click(function () {
            ResetSelectedMenuBullet();
            $('#smnUbiquenos').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate('Ubiquenos', { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        })

        $('#smnCambioPIN').click(function () {
            ResetSelectedMenuBullet();
            $('#smnCambioPIN').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate('RequestPIN/CambiarPIN', { id: 'CambiarPIN', root: true })
            Vibrate(100);
            $('.open-left-sidebar').click();
        })

        $('#smnCompraTiempoAire').click(function () {
            ResetSelectedMenuBullet();
            $('#smnCompraTiempoAire').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate('CompraTiempoAire', { root: true })
            Vibrate(100);
            $('.open-left-sidebar').click();
        })

        $('#smnServiciosBasicosCNT').click(function () {
            ResetSelectedMenuBullet();
            $('#smnServiciosBasicosCNT').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate('ConsultMontPagarServBasicoCNT', { root: true })
            Vibrate(100);
            $('.open-left-sidebar').click();
        })


        $('#smnCerrarSesion').click(function () {
            ResetSelectedMenuBullet();
            $('#smnCerrarSesion').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            endSession();
            var leftMenu = document.getElementById('menuInicialMovil');
            leftMenu.innerHTML = '';
            $('#header-fixed').hide();
            $('.header-clear').hide();
            $('.open-left-sidebar').click();
            //MobileBanking_App.app.navigate('RequestPIN/Login', { root: true });
            MobileBanking_App.app.navigate('LandingPage', { root: true });
            Vibrate(100);
        })

        $('#smnCreacionBilleteraMovil').click(function () {
            ResetSelectedMenuBullet();
            $('#smnCreacionBilleteraMovil').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate('CrearBilleteraMovil', { root: true })
            Vibrate(100);
            $('.open-left-sidebar').click();
        })

        $('#smnBloqueoDesbloqueoBilleteraMovil').click(function () {
            ResetSelectedMenuBullet();
            $('#smnBloqueoDesbloqueoBilleteraMovil').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate('BloqueoDesbloqueoBilleteraMovil', { root: true })
            Vibrate(100);
            $('.open-left-sidebar').click();
        })

        $('#smnPagoBilleteraMovil').click(function () {
            ResetSelectedMenuBullet();
            $('#smnPagoBilleteraMovil').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate('PagoBilleteraMovil', { root: true })
            Vibrate(100);
            $('.open-left-sidebar').click();
        })

        $('#smnNotificacionCobroBilleteraMovil').click(function () {
            ResetSelectedMenuBullet();
            $('#smnNotificacionCobroBilleteraMovil').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate('NotificacionCobroBilleteraMovil', { root: true })
            Vibrate(100);
            $('.open-left-sidebar').click();
        })

        $('#smnConsultaPagosPendientesBilleteraMovil').click(function () {
            ResetSelectedMenuBullet();
            $('#smnConsultaPagosPendientesBilleteraMovil').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate('ConsultaPagosPendientesBilleteraMovil', { root: true })
            Vibrate(100);
            $('.open-left-sidebar').click();
        });


        $('#smnRealizaTusPagos').click(function () {
            ResetSelectedMenuBullet();
            $('#smnRealizaTusPagos').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            //MobileBanking_App.app.navigate('SeleccionServicio', { root: true })
            MobileBanking_App.app.navigate('TipoServicio', { root: true })
            Vibrate(100);
            $('.open-left-sidebar').click();
        });

        //************************MENUS ACH**********************************

        $('#smnInfoACH').click(function () {
            ResetSelectedMenuBullet();
            $('#smnInfoACH').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate('infoACH', { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        });
        $('#smnhistoricACH').click(function () {
            ResetSelectedMenuBullet();
            $('#smnhistoricACH').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate('historicACH', { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        });
        $('#smnPagoTarjetas').click(function () {
            ResetSelectedMenuBullet();
            $('#smnPagoTarjetas').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate('PagoTarjetaCredito', { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        });
        //************************MENUS Tarjetas**********************************

        $('#smnInfoTarjetas').click(function () {
            ResetSelectedMenuBullet();
            $('#smnInfoTarjetas').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate('InfoTarjeta', { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        })


        $('#smnSaldoTarjetas').click(function () {
            ResetSelectedMenuBullet();
            $('#smnSaldoTarjetas').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate('SaldoTarjeta', { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        })


        $('#smMovimientosTarjeta').click(function () {
            ResetSelectedMenuBullet();
            $('#smMovimientosTarjeta').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate('MovimientosTarjeta', { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        })


        $('#smEstadoCuentaTarjeta').click(function () {
            ResetSelectedMenuBullet();
            $('#smEstadoCuentaTarjeta').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate('EstadoCuentaTarjeta', { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        })

        /***************************AKISI******************************/
        $('#smnCargarSaldo').click(function () {
            ResetSelectedMenuBullet();
            $('#smnCargarSaldo').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate('CargarSaldoAkisi', { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        })


        $('#smnHijoNum1').click(function () {
            ResetSelectedMenuBullet();
            $('#smnHijoNum1').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate('FormularioSimple', { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        })




        $('#smnHijoNum3').click(function () {
            ResetSelectedMenuBullet();
            $('#smnHijoNum3').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate('FormComplejo', { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        })


        $('#smnHijoNum2').click(function () {
            ResetSelectedMenuBullet();
            $('#smnHijoNum2').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
            MobileBanking_App.app.navigate('FormularioSimple2', { root: true });
            Vibrate(100);
            $('.open-left-sidebar').click();
        })








        $('#contBtnCtaDigMenu').click(function () {
            ResetSelectedMenuBullet();
            debugger;
            var CtaDigitalForm = {
                TieneSesion: true,
            };
            var nombreCli = SesionMovil.ContextoCliente.NombreCompletoCliente.split(' ');

            CtaDigitalForm.TipoIdentificacion = SesionMovil.ContextoCliente.TipoDocumento;
            CtaDigitalForm.NumeroDocumento = SesionMovil.ContextoCliente.NumeroDocumento;
            CtaDigitalForm.PrimerNombreDpi = nombreCli[0];
            CtaDigitalForm.SegundoNombreDpi = nombreCli[1];
            CtaDigitalForm.PrimerApellidoDpi = nombreCli[2];
            CtaDigitalForm.SegundoApellidoDpi = nombreCli[3];
            CtaDigitalForm.NumeroTelefono = SesionMovil.ControlAccesoGlobal.NumeroCelularRegistrado;
            CtaDigitalForm.CorreoElectronico = SesionMovil.ControlAccesoGlobal.CorreoElectronicoRegistrado
            /*
CtaDigitalForm.ApellidoCasadaDpi = ''
CtaDigitalForm.NumeroNitDpi =
CtaDigitalForm.FechaNacimiento =
CtaDigitalForm.NombreEmpresa
CtaDigitalForm.EsPEP =
CtaDigitalForm.EsFamliarPEP =
CtaDigitalForm.VivioUSA =
CtaDigitalForm.PoseeResUSA =
CtaDigitalForm.EsCEP =
CtaDigitalForm.EsCiudadanoUSA =
CtaDigitalForm.Genero
*/

            var uri = MobileBanking_App.app.router.format({
                view: 'SolCtaForm1',
                id: JSON.stringify(CtaDigitalForm)
            });
            MobileBanking_App.app.navigate(uri, { root: true });

            Vibrate(100);
            $('.open-left-sidebar').click();
        })


        MobileBanking_App.contactenos.configurarControles();
    }
}

function salirBancaMovil() {
    ResetSelectedMenuBullet();
    $('#smnCerrarSesion').find("img.bulletMenu").attr('src', './images/iconos/bullet-activo.png');
    endSession();
    var leftMenu = document.getElementById('menuInicialMovil');
    leftMenu.innerHTML = '';
    $('#header-fixed').hide();
    $('.header-clear').hide();
    $('.open-left-sidebar').click();
    //MobileBanking_App.app.navigate('RequestPIN/Login', { root: true });
    MobileBanking_App.app.navigate('LandingPage', { root: true });
    Vibrate(100);
}

function invokeInstructionsPush(instructions) {
    for (i = 0; i < instructions.length; i++) {
        switch (instructions[i].InstructionType) {
            case 0:
                MobileBanking_App.app.navigate({ view: instructions[i].InstructionData, id: instructions[i].AditionalData });
                break;

        }
    }
}

function validatePatterPIN(pin) {
    return pinInvalidos.contains(pin);
}


EntidadesFinancierasACH = [];

function ResetSelectedMenuBullet() {
    $('#smnMontosMaximos').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnPosicionConsolidada').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnMovimientosCuentas').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnTransferenciaInterna').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnBeneficiariosExternos').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnBeneficiariosInternos').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnTransferenciaExterna').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnInversiones').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnEstadoCredito').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnInformacionCreditos').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnInfoTarjetas').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnSaldoTarjetas').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smMovimientosTarjeta').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smEstadoCuentaTarjeta').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnMICROURBANO').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnMICRORURAL').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnMICROCAMPANIA').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnVIVIENDA').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnCOMERCIAL').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnPERSONAL').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnBACKTOBACK').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnESPECIAL').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnUNICREDITO').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnCONVENIO').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnIMPULSO').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnICESA').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnEKOGAR').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnORVE').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnPOINT').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnORIGINARSA').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnFIRMAS').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnREESTRTRJ').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnCARTIMEX').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnPALITO').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnCOMPTECO').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnNOVITAT').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnMOTOFACIL').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnINDIANMOTOS').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnFDGCOMPUTER').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnEYSCORP').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnICESACCO').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnTARDI').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnLAURORA').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnCHEPEREZ').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnDISTRIBPACIFIC').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnELPENION').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnCONSMAPE').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnCHIMASA').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnOLLACONPRE').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnARTEYMUEBLE').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnCARLETHY').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnMASTERPC').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnDISTRIBUIDORES').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnPCCOUNO').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnPCCODOS').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnPCCOTRES').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnPCCOCUATRO').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnCINTICOMPDOS').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnMICURBCOMPRA').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnMICRURTRANSF').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnMICCAMTRANSF').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnMICURBTRANSF').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnMOTORUNO').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnCONSTRUMAJI').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnTECNOHOGARDOS').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnOLLAEMERFCUO').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnMICNORMALIZ').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnCONNORMALIZ').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnCCONORMALIZ').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnUNIFER').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnMICROAEI').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnLISTOYA').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnPuntosCredito').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnMovimientosTarjetasVisa').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnMovimientosTarjetas').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnContactenos').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnContactoFacebook').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnUbiquenos').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnCambioPIN').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnCompraTiempoAire').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnCerrarSesion').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnPlanConmigo').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnServiciosBasicosCNT').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnCreacionBilleteraMovil').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnBloqueoDesbloqueoBilleteraMovil').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnEliminacionBilleteraMovil').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnPagoBilleteraMovil').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnNotificacionCobroBilleteraMovil').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnConsultaPagosPendientesBilleteraMovil').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnRealizaTusPagos').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnInfoACH').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnhistoricACH').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnPayCreditDue').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnPagoTarjetas').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnCargarSaldo').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');



    $('#smnHijoNum1').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnHijoNum3').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
    $('#smnHijoNum2').find("img.bulletMenu").attr('src', './images/iconos/bullet-pasivo.png');
}

Number.prototype.formatMoney = function (c, d, t) {
    var n = this,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};