var itemsMenu = [
    { IdMenu: 1, IdMenuPadre: null, Nombre: 'Posición Consolidada', Icono: '', Vista: null, Nivel: 'MODULO' },
    { IdMenu: 2, IdMenuPadre: 1, Nombre: 'Posición Consolidada', Icono: '', Vista: 'PosicionConsolidada', Nivel: 'VISTA' },

    { IdMenu: 3, IdMenuPadre: null, Nombre: 'Cuentas', Icono: '', Vista: null, Nivel: 'MODULO' },
    { IdMenu: 4, IdMenuPadre: 3, Nombre: 'Últimos Movimientos', Icono: '', Vista: 'Movimientos', Nivel: 'VISTA' },
    { IdMenu: 5, IdMenuPadre: 3, Nombre: 'Movimientos Por Fechas', Icono: '', Vista: 'MovimientosPorFechas', Nivel: 'VISTA'  },
    { IdMenu: 6, IdMenuPadre: 3, Nombre: 'Transferencias Internas', Icono: '', Vista: 'TransferenciaInterna', Nivel: 'VISTA' },
    { IdMenu: 7, IdMenuPadre: 3, Nombre: 'Transferencias Externas', Icono: '', Vista: 'TransferenciaExterna', Nivel: 'VISTA' },
    { IdMenu: 8, IdMenuPadre: 3, Nombre: 'Beneficiarios Internos', Icono: '', Vista: 'BeneficiariosInternos', Nivel: 'VISTA' },
    { IdMenu: 9, IdMenuPadre: 3, Nombre: 'Cupos Máximos', Icono: '', Vista: 'CuposMaximos', Nivel: 'VISTA' },

    { IdMenu: 10, IdMenuPadre: null, Nombre: 'Seguridad', Icono: '', Vista: null, Nivel: 'MODULO' },
    { IdMenu: 11, IdMenuPadre: 10, Nombre: 'Clave Ingreso', Icono: '', Vista: 'RequestPIN', Nivel: 'VISTA' },
    { IdMenu: 12, IdMenuPadre: 10, Nombre: 'Usuario', Icono: '', Vista: 'Usuario', Nivel: 'VISTA' },

    { IdMenu: 13, IdMenuPadre: null, Nombre: 'Productos y Servicios', Icono: '', Vista: null, Nivel: 'MODULO' },
    { IdMenu: 14, IdMenuPadre: 13, Nombre: 'Crédito', Icono: '', Vista: 'Credito', Nivel: 'VISTA' },
    { IdMenu: 15, IdMenuPadre: 13, Nombre: 'Tarjetas', Icono: '', Vista: 'Tarjetas', Nivel: 'VISTA' },
    { IdMenu: 16, IdMenuPadre: 13, Nombre: 'Inversiones', Icono: '', Vista: 'Inversiones', Nivel: 'VISTA' },
    { IdMenu: 17, IdMenuPadre: 13, Nombre: 'Cuentas', Icono: '', Vista: 'Cuentas', Nivel: 'VISTA' },
]


function buildDinamicMenu() {
    var divMain = document.createElement('div');
    var divContentMenu = document.createElement('div');
    divContentMenu.classList.add('sidebar-menu');
    divContentMenu.classList.add('half-bottom');

    for (var i = 0; i < itemsMenu.length; i++) {
        if (itemsMenu[i].Nivel == 'MODULO') {
            var divPrimerNivel = document.createElement('div');
            divPrimerNivel.id = itemsMenu[i].Nivel + '_' + itemsMenu[i].IdMenu;
            divPrimerNivel.classList.add('has-submenu');
            var aPrimerNivel = document.createElement('a');
            aPrimerNivel.classList.add('menu-item');
            aPrimerNivel.classList.add('show-submenu');
            if(i == 0)
                aPrimerNivel.classList.add('submenu-active');

            //Verificamos si el item del menú posee ícono y le ubicamos en el HTML
            if (itemsMenu[i].Icono != null && itemsMenu[i].Icono.length > 0) {
                var i_aPrimerNivel = document.createElement('i');
                i_aPrimerNivel.classList.add('bg-solidario fa ' + itemsMenu[i].Icono);
                aPrimerNivel.appendChild(i_aPrimerNivel);
            }

            //Colocamos el nombre del menú
            var em_aPrimerNivel = document.createElement('em');
            em_aPrimerNivel.innerText = itemsMenu[i].Nombre;

            //Para seguir la secuencia de la plantilla. Después verificaremos en qué nos puede servir.
            var strong_aPrimerNivel = document.createElement('strong');
            strong_aPrimerNivel.innerText = '1';

            //Enlazamos cada uno de los elementos a sus correspondientes padres
            aPrimerNivel.appendChild(em_aPrimerNivel);
            aPrimerNivel.appendChild(strong_aPrimerNivel);
            divPrimerNivel.appendChild(aPrimerNivel);
        }
        var k = 0;
        //Preguntamos si el item del menú es una vista para darle su tratamiento respectivo
        if (itemsMenu[i].Nivel == 'VISTA') {
            var divSegundoNivel = document.createElement('div');
            divSegundoNivel.classList.add('submenu');
            if (k == 0)
                divSegundoNivel.classList.add('submenu-active');
            
            var aSegundoNivel = document.createElement('a');
            aSegundoNivel.id = itemsMenu[i].Nivel + '_' + itemsMenu[i].IdMenu;

            //Activar evento click de la opción del submenu para que se dirija a la vista correspondiente
            $('#' + itemsMenu[i].Nivel + '_' + itemsMenu[i].IdMenu).click(function (e) {
                var idMenu = e.currentTarget.id.split('_')[1];
                var optMenu = getItemMenuById(idMenu);
                MobileBanking_App.app.navigate(optMenu.Vista);
                $('.close-sidebar').click();
            })

            var i

            k = k + 1;

        }
    }


    return divMain.innerHTML;
}

function getItemMenuById(idMenu) {
    for (var i = 0; i < itemsMenu.length; i++) {
        if (itemsMenu[i].IdMenu == idMenu)
            return itemsMenu[i];
    }
}