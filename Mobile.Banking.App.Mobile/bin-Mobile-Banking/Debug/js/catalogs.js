var mesesAnio = [
    { Numero: '01', Texto: 'ENERO', TextoAbr: 'ENE', NumRomano: 'I' },
    { Numero: '02', Texto: 'FEBRERO', TextoAbr: 'FEB', NumRomano: 'II' },
    { Numero: '03', Texto: 'MARZO', TextoAbr: 'MAR', NumRomano: 'III' },
    { Numero: '04', Texto: 'ABRIL', TextoAbr: 'ABR', NumRomano: 'IV' },
    { Numero: '05', Texto: 'MAYO', TextoAbr: 'MAY', NumRomano: 'V' },
    { Numero: '06', Texto: 'JUNIO', TextoAbr: 'JUN', NumRomano: 'VI' },
    { Numero: '07', Texto: 'JULIO', TextoAbr: 'JUL', NumRomano: 'VII' },
    { Numero: '08', Texto: 'AGOSTO', TextoAbr: 'AGO', NumRomano: 'VIII' },
    { Numero: '09', Texto: 'SEPTIEMBRE', TextoAbr: 'SEP', NumRomano: 'IX' },
    { Numero: '10', Texto: 'OCTUBRE', TextoAbr: 'OCT', NumRomano: 'X' },
    { Numero: '11', Texto: 'NOVIEMBRE', TextoAbr: 'NOV', NumRomano: 'XI' },
    { Numero: '12', Texto: 'DICIEMBRE', TextoAbr: 'DIC', NumRomano: 'XII' }
]

var operadorasMobile = [
    { IdOperadora: 'CLA', Operadora: 'Claro' },
    { IdOperadora: 'MOV', Operadora: 'Movistar' },
]

var tipoIdentificacion = [
    { Codigo: 'CED', Texto: 'DPI' },
    { Codigo: 'PAS', Texto: 'PASAPORTE' },
   //{ Codigo: 'RUC', Texto: 'RUC' }
]

var tipoCuenta = [
    { TipoCta: 'CTAAHORRO', Texto: 'CUENTA DE AHORROS' },
    { TipoCta: 'CTACORRIENTE', Texto: 'CUENTA CORRIENTE' },
    { TipoCta: 'TARJETACRED', Texto: 'TARJETA CRÉDITO' }
]

var tipoMoneda = [
    { Codigo: 'GTQ', Texto: 'QUETZALES', Simbolo: 'Q' },
    { Codigo: 'USD', Texto: 'DÓLARES', Simbolo: '$' },

]

var tipoCuentaACH = [
    { TipoCta: 'CTAAH', Texto: 'AHORROS' },
    { TipoCta: 'CRE', Texto: 'CRÉDITO' },
    { TipoCta: 'CTAC', Texto: 'CORRIENTE' },
    { TipoCta: 'TRJ', Texto: 'TARJETA CRÉDITO' }
]



const tipoServicioBasico = {
    ENERGUATE_DEOCSA: 0,
    ENERGUATE_DEORSA: 1,
    EMPRESA_ELECTRICA_EEGSA: 2,
    MOVISTAR_POSTPAGO: 3,
    MOVISTAR_PREPAGO: 4,
    CLARO_TELGUA_POSTPAGO: 5,
    CLARO_PREPAGO: 6,
    TIGO_POSTPAGO: 7,
    TIGO_PREPAGO: 8,
    TUENTI_PREPAGO_PAQUETES: 38,
    EMETRA_CEPOS: 40,
    PAQUETIGOS: 45,
    SUPERPACKS_CLARO: 46,
    TIGO_STAR: 71
}

const tipoServicioBasicoStr = {
    ENERGUATE_DEOCSA: 'ENERGUATE_DEOCSA',
    ENERGUATE_DEORSA: 'ENERGUATE_DEORSA',
    EMPRESA_ELECTRICA_EEGSA: 'EMPRESA_ELECTRICA_EEGSA',
    MOVISTAR_POSTPAGO: 'MOVISTAR_POSTPAGO',
    MOVISTAR_PREPAGO: 'MOVISTAR_PREPAGO',
    CLARO_TELGUA_POSTPAGO: 'CLARO_TELGUA_POSTPAGO',
    CLARO_PREPAGO: 'CLARO_PREPAGO',
    TIGO_POSTPAGO: 'TIGO_POSTPAGO',
    TIGO_PREPAGO: 'TIGO_PREPAGO',
    TUENTI_PREPAGO_PAQUETES: 'TUENTI_PREPAGO_PAQUETES',
    EMETRA_CEPOS: 'EMETRA_CEPOS',
    PAQUETIGOS: 'PAQUETIGOS',
    SUPERPACKS_CLARO: 'SUPERPACKS_CLARO',
    TIGO_STAR: 'TIGO_STAR'
}