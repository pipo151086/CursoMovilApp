// NOTE object below must be a valid JSON
window.MobileBanking_App = $.extend(true, window.MobileBanking_App, {
  "config": {
    "layoutSet": "slideout",
    "animationSet": "default",
    "navigation": [
      {
        "title": "About",
        "onExecute": "#About",
        "icon": "info"
      },
      {
        "title": "PinConfirmation",
        "onExecute": "#PinConfirmation",
        "icon": "pinconfirmation"
      },
      {
        "title": "PlanConmigo",
        "onExecute": "#PlanConmigo",
        "icon": "planconmigo"
      },
      {
        "title": "ConsultMontPagarServBasico",
        "onExecute": "#ConsultMontPagarServBasico",
        "icon": "consultmontpagarservbasico"
      },
      {
        "title": "PuntosCredito",
        "onExecute": "#PuntosCredito",
        "icon": "puntoscredito"
      },
      {
        "title": "CrearBilleteraMovil",
        "onExecute": "#CrearBilleteraMovil",
        "icon": "crearbilleteramovil"
      },
      {
        "title": "ConfirmacionCrearBilleteraMovil",
        "onExecute": "#ConfirmacionCrearBilleteraMovil",
        "icon": "confirmacioncrearbilleteramovil"
      },
      {
        "title": "BloqueoDesbloqueoBilleteraMovil",
        "onExecute": "#BloqueoDesbloqueoBilleteraMovil",
        "icon": "bloqueodesbloqueobilleteramovil"
      },
      {
        "title": "PagoBilleteraMovil",
        "onExecute": "#PagoBilleteraMovil",
        "icon": "pagobilleteramovil"
      },
      {
        "title": "NotificacionCobroBilleteraMovil",
        "onExecute": "#NotificacionCobroBilleteraMovil",
        "icon": "notificacioncobrobilleteramovil"
      },
      {
        "title": "ConsultaPagosPendientesBilleteraMovil",
        "onExecute": "#ConsultaPagosPendientesBilleteraMovil",
        "icon": "consultapagospendientesbilleteramovil"
      },
      {
        "title": "ConfirmacionPagoBilleteraMovil",
        "onExecute": "#ConfirmacionPagoBilleteraMovil",
        "icon": "confirmacionpagobilleteramovil"
      },
      {
        "title": "UnitTest",
        "onExecute": "#UnitTest",
        "icon": "unittest"
      },
      {
        "title": "InformacionCreditos",
        "onExecute": "#InformacionCreditos",
        "icon": "informacioncreditos"
      },
      {
        "title": "DetalleCredito",
        "onExecute": "#DetalleCredito",
        "icon": "detallecredito"
      },
      {
        "title": "infoACH",
        "onExecute": "#infoACH",
        "icon": "infoach"
      },
      {
        "title": "historicACH",
        "onExecute": "#historicACH",
        "icon": "historicACH"
      },
      {
        "title": "ConfirmarBeneficiarioExterno",
        "onExecute": "#ConfirmarBeneficiarioExterno",
        "icon": "confirmarbeneficiarioexterno"
      },
      {
        "title": "PagoCredito",
        "onExecute": "#PagoCredito",
        "icon": "pagocredito"
      },
      {
        "title": "PagoCreditoConfirmacion",
        "onExecute": "#PagoCreditoConfirmacion",
        "icon": "pagocreditoconfirmacion"
      },
      {
        "title": "PagoCreditoExitoso",
        "onExecute": "#PagoCreditoExitoso",
        "icon": "pagocreditoexitoso"
      },
      {
        "title": "PagoTarjetaCredito",
        "onExecute": "#PagoTarjetaCredito",
        "icon": "pagotarjetacredito"
      },
      {
        "title": "ConfirmacionPagoTarjeta",
        "onExecute": "#ConfirmacionPagoTarjeta",
        "icon": "confirmacionpagotarjeta"
      },
      {
        "title": "TipoServicio",
        "onExecute": "#TipoServicio",
        "icon": "tiposervicio"
      },
      {
        "title": "CLARO",
        "onExecute": "#CLARO",
        "icon": "claro"
      },
      {
        "title": "TIGO",
        "onExecute": "#TIGO",
        "icon": "tigo"
      },
      {
        "title": "TIGOSTAR",
        "onExecute": "#TIGOSTAR",
        "icon": "tigostar"
      },
      {
        "title": "MOVISTAR",
        "onExecute": "#MOVISTAR",
        "icon": "movistar"
      },
      {
        "title": "PAQUETIGOS",
        "onExecute": "#PAQUETIGOS",
        "icon": "paquetigos"
      },
      {
        "title": "SUPERPACK",
        "onExecute": "#SUPERPACK",
        "icon": "superpack"
      },
      {
        "title": "TUENTI",
        "onExecute": "#TUENTI",
        "icon": "tuenti"
      },
      {
        "title": "DEOCSA",
        "onExecute": "#DEOCSA",
        "icon": "deocsa"
      },
      {
        "title": "PAQUETIGOSInfo",
        "onExecute": "#PAQUETIGOSInfo",
        "icon": "paquetigosinfo"
      },
      {
        "title": "SUPERPACKInfo",
        "onExecute": "#SUPERPACKInfo",
        "icon": "superpackinfo"
      },
      {
        "title": "TUENTIInfo",
        "onExecute": "#TUENTIInfo",
        "icon": "tuentiinfo"
      },
      {
        "title": "CLAROPagarServicio",
        "onExecute": "#CLAROPagarServicio",
        "icon": "claropagarservicio"
      },
      {
        "title": "DEOCSAPagarServicio",
        "onExecute": "#DEOCSAPagarServicio",
        "icon": "deocsapagarservicio"
      },
      {
        "title": "PAQUETIGOSPagarServicio",
        "onExecute": "#PAQUETIGOSPagarServicio",
        "icon": "paquetigospagarservicio"
      },
      {
        "title": "PAQUETIGOSExitoso",
        "onExecute": "#PAQUETIGOSExitoso",
        "icon": "paquetigosexitoso"
      },
      {
        "title": "CLAROExitoso",
        "onExecute": "#CLAROExitoso",
        "icon": "claroexitoso"
      },
      {
        "title": "DEOCSAExitoso",
        "onExecute": "#DEOCSAExitoso",
        "icon": "deocsaexitoso"
      },
      {
        "title": "DEORSAPagarServicio",
        "onExecute": "#DEORSAPagarServicio",
        "icon": "deorsapagarservicio"
      },
      {
        "title": "DEORSAExitoso",
        "onExecute": "#DEORSAExitoso",
        "icon": "deorsaexitoso"
      },
      {
        "title": "MOVISTARPagarServicio",
        "onExecute": "#MOVISTARPagarServicio",
        "icon": "movistarpagarservicio"
      },
      {
        "title": "MOVISTARExitoso",
        "onExecute": "#MOVISTARExitoso",
        "icon": "movistarexitoso"
      },
      {
        "title": "TIGOPagarServicio",
        "onExecute": "#TIGOPagarServicio",
        "icon": "tigopagarservicio"
      },
      {
        "title": "TIGOExitoso",
        "onExecute": "#TIGOExitoso",
        "icon": "tigoexitoso"
      },
      {
        "title": "SUPERPACKPagarServicio",
        "onExecute": "#SUPERPACKPagarServicio",
        "icon": "superpackpagarservicio"
      },
      {
        "title": "SUPERPACKExitoso",
        "onExecute": "#SUPERPACKExitoso",
        "icon": "superpackexitoso"
      },
      {
        "title": "TIGOSTARPagarServicio",
        "onExecute": "#TIGOSTARPagarServicio",
        "icon": "tigostarpagarservicio"
      },
      {
        "title": "TIGOSTARExitoso",
        "onExecute": "#TIGOSTARExitoso",
        "icon": "tigostarexitoso"
      },
      {
        "title": "TUENTIPagarServicio",
        "onExecute": "#TUENTIPagarServicio",
        "icon": "tuentipagarservicio"
      },
      {
        "title": "TUENTIExitoso",
        "onExecute": "#TUENTIExitoso",
        "icon": "tuentiexitoso"
      },
      {
        "title": "EGGSAPagarServicio",
        "onExecute": "#EGGSAPagarServicio",
        "icon": "eggsapagarservicio"
      },
      {
        "title": "EEGSAExitoso",
        "onExecute": "#EEGSAExitoso",
        "icon": "eegsaexitoso"
      },
      {
        "title": "InfoTarjeta",
        "onExecute": "#InfoTarjeta",
        "icon": "infotarjeta"
      },
      {
        "title": "SaldoTarjeta",
        "onExecute": "#SaldoTarjeta",
        "icon": "saldotarjeta"
      },
      {
        "title": "EstadoCuentaTarjeta",
        "onExecute": "#EstadoCuentaTarjeta",
        "icon": "estadocuentatarjeta"
      },
      {
        "title": "PagoCreditoTarjeta",
        "onExecute": "#PagoCreditoTarjeta",
        "icon": "pagocreditotarjeta"
      },
      {
        "title": "CargarSaldoAkisi",
        "onExecute": "#CargarSaldoAkisi",
        "icon": "cargarsaldoakisi"
      },
      {
        "title": "ConfirmacionCargaSaldoAkisi",
        "onExecute": "#ConfirmacionCargaSaldoAkisi",
        "icon": "confirmacioncargasaldoakisi"
      },
      {
        "title": "LandingPage",
        "onExecute": "#LandingPage",
        "icon": "landingpage"
      },
      {
        "title": "InsertPin",
        "onExecute": "#InsertPin",
        "icon": "insertpin"
      },
      {
        "title": "GuiaUsr",
        "onExecute": "#GuiaUsr",
        "icon": "guiausr"
      },
      {
        "title": "SolProductos",
        "onExecute": "#SolProductos",
        "icon": "solproductos"
      },
      {
        "title": "CanalesAtencion",
        "onExecute": "#CanalesAtencion",
        "icon": "canalesatencion"
      },
      {
        "title": "TipoCambio",
        "onExecute": "#TipoCambio",
        "icon": "tipocambio"
      },
      {
        "title": "1_TermCond",
        "onExecute": "#_1_TermCond",
        "icon": "1_termcond"
      },
      {
        "title": "2_CreaUsr",
        "onExecute": "#_2_CreaUsr",
        "icon": "2_creausr"
      },
      {
        "title": "RedAgencias",
        "onExecute": "#RedAgencias",
        "icon": "redagencias"
      },
      {
        "title": "3_ContactInfo",
        "onExecute": "#_3_ContactInfo",
        "icon": "3_contactinfo"
      },
      {
        "title": "4_Confirm",
        "onExecute": "#_4_Confirm",
        "icon": "4_confirm"
      },
      {
        "title": "InfoContacto",
        "onExecute": "#InfoContacto",
        "icon": "infocontacto"
      },
      {
        "title": "RegPregSeg",
        "onExecute": "#RegPregSeg",
        "icon": "regpregseg"
      },
      {
        "title": "RegUsrPass",
        "onExecute": "#RegUsrPass",
        "icon": "regusrpass"
      },
      {
        "title": "RegCuposMax",
        "onExecute": "#RegCuposMax",
        "icon": "regcuposmax"
      },
      {
        "title": "MsgUnregUsr",
        "onExecute": "#MsgUnregUsr",
        "icon": "msgunregusr"
      },
      {
        "title": "SolCtaForm1",
        "onExecute": "#SolCtaForm1",
        "icon": "solctaform1"
      },
      {
        "title": "SolCtaForm2",
        "onExecute": "#SolCtaForm2",
        "icon": "solctaform2"
      },
      {
        "title": "SolCtaForm3",
        "onExecute": "#SolCtaForm3",
        "icon": "solctaform3"
      },
      {
        "title": "SolCtaForm4",
        "onExecute": "#SolCtaForm4",
        "icon": "solctaform4"
      },
      {
        "title": "FormUnreg1_Triage",
        "onExecute": "#FormUnreg1_Triage",
        "icon": "formunreg1_triage"
      },
      {
        "title": "SolCtaSorry",
        "onExecute": "#SolCtaSorry",
        "icon": "solctasorry"
      },
      {
        "title": "FormUnreg2NITSorry",
        "onExecute": "#FormUnreg2NITSorry",
        "icon": "formunreg2nitsorry"
      },
      {
        "title": "FormUnreg2_DpiPas",
        "onExecute": "#FormUnreg2_DpiPas",
        "icon": "formunreg2_dpipas"
      },
      {
        "title": "TstMobbScan",
        "onExecute": "#TstMobbScan",
        "icon": "tstmobbscan"
      },
      {
        "title": "FormularioSimple",
        "onExecute": "#FormularioSimple",
        "icon": "formulariosimple"
      },
      {
        "title": "FormularioSimple2",
        "onExecute": "#FormularioSimple2",
        "icon": "formulariosimple2"
      }
    ]
  }
});
