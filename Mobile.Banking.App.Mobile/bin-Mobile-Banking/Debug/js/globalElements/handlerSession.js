function initSession(resultLogin) {
    sessionStorage.setItem('', '');
    sessionStorage.setItem('FechaActividadApp', new Date());
    sessionStorage.setItem('controlAccesoGlobal', JSON.stringify(resultLogin.dtoResultadoConsultaControlAcceso));
    sessionStorage.setItem('contextoCliente', JSON.stringify(resultLogin.contextoCliente));
    sessionStorage.setItem('posicionConsolidada', JSON.stringify(resultLogin.dtoCanalPosicionConsolidada));
}

function endSession() {
    sessionStorage.removeItem('controlAccesoGlobal');
    sessionStorage.removeItem('contextoCliente');
    sessionStorage.removeItem('posicionConsolidada');
    SesionMovil = null;
}

function getObjectSession() {
    try {
        var session = {
            ControlAccesoGlobal: JSON.parse(sessionStorage.controlAccesoGlobal),
            ContextoCliente: JSON.parse(sessionStorage.contextoCliente),
            PosicionConsolidada: JSON.parse(sessionStorage.posicionConsolidada),
            SessionToken: GenerarTockenSession(),
            FechaActividadApp: new Date(sessionStorage.FechaActividadApp),
            ProductosCliente: []
        }
        if (session.PosicionConsolidada.TarjetasCliente) {
            //var tarjetasALIA = searchArray(session.PosicionConsolidada.TarjetasCliente, 'Marca', 'VISA', searchOperations.NotContains);
            //session.PosicionConsolidada.TarjetasCliente = tarjetasALIA;
        }

        if (session.PosicionConsolidada.CuentasCliente && session.PosicionConsolidada.CuentasCliente.length > 0) {
            session.ProductosCliente.push({ IdProducto: 1, CodigoProducto: 'CTA', NombreProducto: 'CUENTAS' });
        }

        if (session.PosicionConsolidada.TarjetasCliente && session.PosicionConsolidada.TarjetasCliente.length > 0) {
            session.ProductosCliente.push({ IdProducto: 2, CodigoProducto: 'TRJ', NombreProducto: 'TARJETAS' });
        }

        if (session.PosicionConsolidada.EstadosTarjetasVisaCliente && session.PosicionConsolidada.EstadosTarjetasVisaCliente.length > 0) {
            session.ProductosCliente.push({ IdProducto: 3, CodigoProducto: 'TRJVISA', NombreProducto: 'TARJETAS VISA' });
        }

        if (session.PosicionConsolidada.CreditosCliente && session.PosicionConsolidada.CreditosCliente.length > 0) {
            session.ProductosCliente.push({ IdProducto: 4, CodigoProducto: 'CRE', NombreProducto: 'CRÉDITOS' });
        }

        if (session.PosicionConsolidada.InversionesCliente && session.PosicionConsolidada.InversionesCliente.length > 0) {
            session.ProductosCliente.push({ IdProducto: 5, CodigoProducto: 'INV', NombreProducto: 'DEPÓSITOS A PLAZO' });
        }

        //if (session.PosicionConsolidada.CuentasCliente && session.PosicionConsolidada.CuentasCliente.length > 0) {
        //    var tieneBIMO = false;
        //    for (i = 0; i < session.PosicionConsolidada.CuentasCliente.length; i++) {
        //        if (session.PosicionConsolidada.CuentasCliente[i].EsHabilitadoBiMo) {
        //            tieneBIMO = true;
        //            break;
        //        }
        //    }
        //    if (tieneBIMO)
        //      session.ProductosCliente.splice(1, 0, { IdProducto: 6, CodigoProducto: "BIMO", NombreProducto: "BILLETERA MÓVIL" });
        //}

        return session;
    } catch (e) {
        showException(e.message, e.stack);
    }

}


function GenerarTockenSession() {
    var fechaSession = Globalize.dateFormatter({ raw: 'yyyy/MM/dd' })(new Date());
    var horaSession = Globalize.dateFormatter({ raw: 'HH:mm' })(new Date());
    var sessionId = DeviceInfo.DeviceUUID + GenerarIdentificadorUnicoSession();

    var SessionToken = {
        SessionId: sessionId,
        FechaSession: fechaSession,
        HoraSession: horaSession
    }

    return SessionToken;
}

function GenerarIdentificadorUnicoSession() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 10; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function ResetSessionToken() {
    SesionMovil.SessionToken = GenerarTockenSession();
}
