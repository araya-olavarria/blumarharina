/***
Metronic AngularJS App Main Script
***/

/* Metronic App */
var MetronicApp = angular.module("MetronicApp", [
    "ui.router",
    "ui.bootstrap",
    "oc.lazyLoad",
    "ngSanitize",
    "ui.date"
]);
var IPSERVER = "";
$.getJSON('https://api.ipify.org/?format=json', function(data) {
    if (data.ip == "200.54.43.154") {
        IPSERVER = "http://10.99.99.122:8080/";
    } else {
        IPSERVER = "http://dev.sclem.simpleagro.cl/";
    }
});
var IPSERVICIOSAPX = "http://200.54.43.156/BLUMAR/";
var IPSERVICIOSBD = "http://200.54.27.12/BlumarServices/json/";
//var IPSERVER ="http://localhost:8081/";
//var IPSERVER ="http://10.99.99.122:8080/";
//var IPSERVER ="http://dev.sclem.simpleagro.cl/";
//var IPSERVER ="http://200.54.43.157/";
var d = new Date();
var mes = d.getMonth() + 1;
if (mes >= 1 && mes <= 9) {
    mes = "0" + mes;
} else {
    mes = d.getMonth() + 1;
}
var dia = d.getDate();
if (dia >= 1 && dia <= 9) {
    dia = "0" + dia;
}
var fecha = dia + "-" + mes + "-" + d.getFullYear();

var fechaIngreso = d.getFullYear() + "-" + mes + "-" + dia;
var hora = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();

APPMOVIL = false;

var ua = navigator.userAgent.toLowerCase();
//console.log(ua);

if (ua.indexOf("android") > -1) {

    APPMOVIL = true;

}
/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
MetronicApp.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        // global configs go here
    });
}]);



//AngularJS v1.3.x workaround for old style controller declarition in HTML
MetronicApp.config(['$controllerProvider', function($controllerProvider) {
    // this option might be handy for migrating old apps, but please don't use it
    // in new ones!
    $controllerProvider.allowGlobals();
}]);

/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/

/* Setup global settings */
MetronicApp.factory('settings', ['$rootScope', function($rootScope) {
    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar menu state
            pageContentWhite: true, // set page content layout
            pageBodySolid: false, // solid body color state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        assetsPath: '../assets',
        globalPath: '../assets/global',
        layoutPath: '../assets/layouts/layout',
    };

    $rootScope.settings = settings;

    return settings;
}]);
/*MetronicApp.factory('$exceptionHandler', function($log) {
    return function myExceptionHandler(exception, cause) {
        $log.error(exception, cause);
        ////console.log(exception)
        ////console.log({exception:exception})
        alert(exception.stack + ' <-->' + cause);
    };
});*/
/* Setup App Main Controller */
MetronicApp.controller('AppController', ['$scope', '$rootScope', '$location', '$window', function($scope, $rootScope, $location, $window) {
    $rootScope.pageHistory = [];
    $scope.$on('$viewContentLoaded', function() {
        if ($rootScope.pageHistory.indexOf($location.$$path) === -1) {
            $rootScope.pageHistory.push($location.$$path);
        } else {
            if ($location.$$path != '/login') {
                var aux = $rootScope.pageHistory;
                var bool = false;
                $rootScope.pageHistory = [];
                //console.log($location.$$path, ' <- ya esta');
                for (var i = 0; i < aux.length; i++) {
                    //console.log(i,bool)
                    if (!bool) {
                        if (aux[i] == $location.$$path) {
                            bool = true
                        } else {
                            $rootScope.pageHistory.push(aux[i]);
                        }

                    }
                }
                $rootScope.pageHistory.push($location.$$path)
            }

            /* $rootScope.pageHistory = [];
             var historyAux = $rootScope.pageHistory;
             for (var i = 0; i < historyAux.length; i++) {
                 if (i < aux) {
                     $rootScope.pageHistory.push(historyAux[i]);
                 }
             }*/
        }

        //console.log($rootScope.pageHistory);
        ////console.log($rootScope.pageHistory);
        ////console.log("%c PERRO CULIAO CHUPA EL PICO :v", "color:red; font-size: 16pt"); no descomentar :v
        //App.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 
        $rootScope.getHora = function() {
            var d = new Date();
            var hora = d.getHours();
            if (hora >= 1 && hora <= 9) {
                hora = "0" + hora;
            }
            var min = d.getMinutes();
            if (min >= 1 && min <= 9) {
                min = "0" + min;
            }
            return hora + ":" + min;
        }
        $rootScope.Cerrar_Alert = function(x) {
            if (x != '') {
                $location.path(x);
                $rootScope.IR_MSG = '';
            }
            $rootScope.showM = false;
        }
        $rootScope.formatNumber = function(num) {
            if (!num || num == 'NaN') return '0';
            if (num == 'Infinity') return '&#x221e;';
            num = num.toString().replace(/\$|\,/g, '');
            if (isNaN(num))
                num = "0";
            sign = (num == (num = Math.abs(num)));
            num = Math.floor(num * 100 + 0.50000000001);
            cents = num % 100;
            num = Math.floor(num / 100).toString();
            if (cents < 10)
                cents = "0" + cents;
            for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
                num = num.substring(0, num.length - (4 * i + 3)) + '.' + num.substring(num.length - (4 * i + 3));
            return (((sign) ? '' : '-') + num + ',' + cents);
        };
        $rootScope.getFecha = function() {
            var d = new Date();
            var mes = d.getMonth() + 1;
            if (mes >= 1 && mes <= 9) {
                mes = "0" + mes;
            } else {
                mes = d.getMonth() + 1;
            }
            var dia = d.getDate();
            if (dia >= 1 && dia <= 9) {
                dia = "0" + dia;
            }
            var fecha = dia + "-" + mes + "-" + d.getFullYear();

            var fechaIngreso = d.getFullYear() + "-" + mes + "-" + dia;
            var hora = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
            return fechaIngreso + " " + hora;
        }
        $rootScope.getFechaSep = function(sep) {
            var d = new Date();
            var mes = d.getMonth() + 1;
            if (mes >= 1 && mes <= 9) {
                mes = "0" + mes;
            } else {
                mes = d.getMonth() + 1;
            }
            var dia = d.getDate();
            if (dia >= 1 && dia <= 9) {
                dia = "0" + dia;
            }
            var fecha = dia + sep + mes + sep + d.getFullYear();

            return fecha;
        }
        $rootScope.getFechaBapi = function() {
            var d = new Date();
            var mes = d.getMonth() + 1;
            if (mes >= 1 && mes <= 9) {
                mes = "0" + mes;
            } else {
                mes = d.getMonth() + 1;
            }
            var dia = d.getDate();
            if (dia >= 1 && dia <= 9) {
                dia = "0" + dia;
            }
            var fechaIngreso = d.getFullYear() + "" + mes + "" + dia;
            return fechaIngreso;
        }

        $rootScope.FILTER_STORAGE = function(planta, arrPlantas) {

            var pozosPlanta = [];
            angular.forEach(arrPlantas, function(v, k) {

                if (v.planta == planta) {
                    pozosPlanta.push(v);
                }

            })

            return pozosPlanta;

        }
        $rootScope.formatFechaDB = function(date, time) {

            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            var h = time.getHours();
            var m = time.getMinutes();


            return [year, month, day].join('-') + " " + h + ":" + m;

        }

        $rootScope.formatFechaBapi = function(date) {

            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            return [year, month, day].join('');

        }

        $rootScope.loading = {
            on: function() {
                $scope.oloading = {
                    show: true
                }
            },
            off: function() {
                $scope.oloading = {
                    show: false
                }
            }
        }
        $rootScope.parseFechaTexto = function(fecha) {
            if (fecha == "") return "";
            var anio = fecha.substring(0, 4);
            var mes = fecha.substring(4, 6);
            var dia = fecha.substring(6, 8);
            var fec = dia + "/" + mes + "/" + anio;
            return fec;
        }
        $rootScope.parseFechaYMD = function(fecha) {
            if (fecha == "") return "";
            var arrFecha = fecha.split("/");
            var fec = arrFecha[2] + "/" + arrFecha[1] + "/" + arrFecha[0];
            return fec;
        }

        $rootScope.dialog = {
            alert: function(msje) {
                $scope.alert = {
                    show: true,
                    title: msje.title,
                    message: msje.msje,
                    confirm: true
                }
            },
            confirm: function(msje) {
                return $scope.alert = {
                    show: true,
                    title: msje.title,
                    message: msje.msje,
                    continue: function() {
                        $location.path(msje.ruta);
                    }
                }
            },
            httpRequest: {
                error: function(result, status, header, config) {
                    var HTTP_STATUS_CODES = {
                        'CODE_200': 'OK',
                        'CODE_201': 'Created',
                        'CODE_202': 'Accepted',
                        'CODE_203': 'Non-Authoritative Information',
                        'CODE_204': 'No Content',
                        'CODE_205': 'Reset Content',
                        'CODE_206': 'Partial Content',
                        'CODE_300': 'Multiple Choices',
                        'CODE_301': 'Moved Permanently',
                        'CODE_302': 'Found',
                        'CODE_303': 'See Other',
                        'CODE_304': 'Not Modified',
                        'CODE_305': 'Use Proxy',
                        'CODE_307': 'Temporary Redirect',
                        'CODE_400': 'Bad Request',
                        'CODE_401': 'Unauthorized',
                        'CODE_402': 'Payment Required',
                        'CODE_403': 'Forbidden',
                        'CODE_404': 'Not Found',
                        'CODE_405': 'Method Not Allowed',
                        'CODE_406': 'Not Acceptable',
                        'CODE_407': 'Proxy Authentication Required',
                        'CODE_408': 'Request Timeout',
                        'CODE_409': 'Conflict',
                        'CODE_410': 'Gone',
                        'CODE_411': 'Length Required',
                        'CODE_412': 'Precondition Failed',
                        'CODE_413': 'Request Entity Too Large',
                        'CODE_414': 'Request-URI Too Long',
                        'CODE_415': 'Unsupported Media Type',
                        'CODE_416': 'Requested Range Not Satisfiable',
                        'CODE_417': 'Expectation Failed',
                        'CODE_500': 'Internal Server Error',
                        'CODE_501': 'Not Implemented',
                        'CODE_502': 'Bad Gateway',
                        'CODE_503': 'Service Unavailable',
                        'CODE_504': 'Gateway Timeout',
                        'CODE_505': 'HTTP Version Not Supported',
                        'CODE_0': 'Time Out'
                    };
                    $scope.alert = {
                        show: true,
                        title: "Error del servicio!!",
                        message: status + ': ' + HTTP_STATUS_CODES['CODE_' + status] + '\n' + config.url.split("/")[config.url.split("/").length - 1],
                        confirm: true
                    }
                    $rootScope.loading.off();
                },
            }
        }
    });

    $rootScope.formToJSON = function(formulario) {

        var json = {};
        angular.forEach(formulario, function(v, k) {
            if (v.validado) {

                if (v.immybox) {

                    if ($('#' + v.id).immybox('getValue').length > 0) {

                        json[v.json] = $('#' + v.id).immybox('getValue')[0]

                    }

                } else {

                    if (v.ngModel != '') {

                        if (v.type == 'date') {

                            json[v.json] = $rootScope.formatFechaDB(v.ngModel, v.time.ngModel);

                        } else {

                            json[v.json] = v.ngModel;

                        }

                    }

                }



            }
        })

        return json;

    }

    $rootScope.backHistory = function() {

        ////console.log($rootScope.pageHistory);
        var aux = $rootScope.pageHistory;
        $rootScope.pageHistory = [];
        for (var i = 0; i < aux.length; i++) {
            if (aux[i] != $location.$$path) {
                $rootScope.pageHistory.push(aux[i]);
            }

        }
        //console.log($rootScope.pageHistory);
        $location.path($rootScope.pageHistory[$rootScope.pageHistory.length - 1])
            //$window.history.back();
    }

    $rootScope.exit = function() {

        location.reload();

    }

    $rootScope.pad = function(n, width, z) { //cadena, tamaño total que se desea, con qué rellenar
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }

    $rootScope.Get_Material = function(id) {
        var json;
        angular.forEach($rootScope.materialesPT, function(vMateriales, kMateriales) {
            if (vMateriales.value == id) {
                json = vMateriales;
            }
        })

        return json
    }

    $rootScope.showM = false;
    $rootScope.loader = false;
    $rootScope.IR_MSG = '';
    $rootScope.getTimeFormat = function() {

        var d = new Date();
        return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes());

    }


}]);

/***
Layout Partials.
By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial 
initialization can be disabled and Layout.init() should be called on page load complete as explained above.
***/

/* Setup Layout Part - Header */
MetronicApp.controller('HeaderController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initHeader(); // init header
    });
}]);

/* Setup Layout Part - Sidebar */
MetronicApp.controller('SidebarController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initSidebar(); // init sidebar
    });
}]);

/* Setup Layout Part - Quick Sidebar */
MetronicApp.controller('QuickSidebarController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        setTimeout(function() {
            QuickSidebar.init(); // init quick sidebar        
        }, 2000)
    });
}]);

/* Setup Layout Part - Theme Panel */
MetronicApp.controller('ThemePanelController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Demo.init(); // init theme panel
    });
}]);

/* Setup Layout Part - Footer */
MetronicApp.controller('FooterController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initFooter(); // init footer
    });
}]);

/* Setup Rounting For All Pages */
MetronicApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    // Redirect any unmatched url
    $urlRouterProvider.otherwise("/login");

    $stateProvider

    // User Profile Help
        .state("login", {
            url: "/login",
            templateUrl: "view/login/login.html",
            data: { pageTitle: 'Login' },
            controller: "Login",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'view/login/login.js',
                            'js/components/ag1Loading/ctr.js',
                            'js/components/ag1Alert/ctr.js'
                        ]
                    });
                }]
            }
        })
        // User Profile Help
        .state("mainMenu", {
            url: "/mainMenu",
            templateUrl: "view/mainMenu/mainMenu.html",
            data: { pageTitle: 'Menu' },
            controller: "MainMenu",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'view/mainMenu/mainMenu.js',
                            'js/components/menus/ctrMenus.js',
                            'js/components/ag1Loading/ctr.js',
                            'js/components/ag1Alert/ctr.js',
                            'js/components/ag1Popup/ctr.js'
                        ]
                    });
                }]
            }
        })
        //Recepcion Materia Prima
        .state("recepcion", {
            url: "/recepcion",
            templateUrl: "view/recepcionMP/recepcion.html",
            data: { pageTitle: 'Menu' },
            controller: "recepcion",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'view/recepcionMP/recepcion.js',
                            'js/components/ag1Loading/ctr.js',
                            'js/components/ag1Alert/ctr.js',
                            'js/components/ag1Popup/ctr.js'
                        ]
                    });
                }]
            }
        })
        .state("recepcionMP", {
            url: "/recepcionMP",
            templateUrl: "view/recepcionMP/materiaPrima/recepcionMP.html",
            data: { pageTitle: 'Menu' },
            controller: "recepcionMP",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'view/recepcionMP/materiaPrima/recepcionMP.js',
                            'js/components/ag1Loading/ctr.js',
                            'js/components/ag1Alert/ctr.js',
                            'js/components/ag1Popup/ctr.js'
                        ]
                    });
                }]
            }
        })
        .state("cierreDescarga", {
            url: "/cierreDescarga",
            templateUrl: "view/MenuDescarga/cierreDescarga/cierreDescarga.html",
            data: { pageTitle: 'Menu' },
            controller: "cierreDescarga",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'view/MenuDescarga/cierreDescarga/cierreDescarga.js'
                        ]
                    });
                }]
            }
        })
        .state("listarRecepciones", {
            url: "/listarRecepciones",
            templateUrl: "view/recepcionMP/listarRecepciones/listarRecepciones.html",
            data: { pageTitle: 'Menu' },
            controller: "listarRecepciones",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'view/recepcionMP/listarRecepciones/listarRecepciones.js',
                            'js/components/ag1Loading/ctr.js',
                            'js/components/ag1Alert/ctr.js',
                            'js/components/ag1Popup/ctr.js'
                        ]
                    });
                }]
            }
        })
        /** MP Comprada */
        //Recepcion Materia Prima Comprada
        .state("mpComprada", {
            url: "/mpComprada",
            templateUrl: "view/recepcionMP/materiaPrima/MPComprada/mpComprada2.html",
            data: { pageTitle: 'Menu' },
            controller: "mpComprada",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'view/recepcionMP/materiaPrima/MPComprada/mpComprada2.js',
                            'js/components/ag1Loading/ctr.js',
                            'js/components/ag1Alert/ctr.js',
                            'js/components/ag1Popup/ctr.js'
                        ]
                    });
                }]
            }
        })
        //Migo
        .state("migo", {
            url: "/migo",
            templateUrl: "view/recepcionMP/materiaPrima/MPComprada/migo/migo.html",
            data: { pageTitle: 'Menu' },
            controller: "migo",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'view/recepcionMP/materiaPrima/MPComprada/migo/migo.js',
                            'js/components/ag1Loading/ctr.js',
                            'js/components/ag1Alert/ctr.js',
                            'js/components/ag1Popup/ctr.js'
                        ]
                    });
                }]
            }
        })
        /** FIN MPCOMPRADA */
        /**MP PROPIA */
        .state("mpPropia", {
            url: "/mpPropia",
            templateUrl: "view/recepcionMP/materiaPrima/MPPropia/mpPropia2.html",
            data: { pageTitle: 'Menu' },
            controller: "mpPropia",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'view/recepcionMP/materiaPrima/MPPropia/mpPropia2.js',
                            'js/components/ag1Loading/ctr.js',
                            'js/components/ag1Alert/ctr.js',
                            'js/components/ag1Popup/ctr.js'
                        ]
                    });
                }]
            }
        })
        //Migo
        .state("migoMPPropia", {
            url: "/migoMPPropia",
            templateUrl: "view/recepcionMP/MPPropia/migo/migo.html",
            data: { pageTitle: 'Menu' },
            controller: "migoMPPropia",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'view/recepcionMP/MPPropia/migo/migo.js',
                            'js/components/ag1Loading/ctr.js',
                            'js/components/ag1Alert/ctr.js',
                            'js/components/ag1Popup/ctr.js'
                        ]
                    });
                }]
            }
        })
        /* Recepción Subproducto */
        .state("recepcionSupProd", {
            url: "/recepcionSupProd",
            templateUrl: "view/recepcionMP/subProducto/recepcionSubp.html",
            data: { pageTitle: 'Menu' },
            controller: "recepcionSubp",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'view/recepcionMP/subProducto/recepcionSubp.js',
                            'js/components/ag1Loading/ctr.js',
                            'js/components/ag1Alert/ctr.js',
                            'js/components/ag1Popup/ctr.js'
                        ]
                    });
                }]
            }
        })
        .state("subproducto", {
            url: "/subproducto",
            templateUrl: "view/recepcionMP/subProducto/subproducto/subproducto.html",
            data: { pageTitle: 'Menu' },
            controller: "subproducto",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'view/recepcionMP/subProducto/subproducto/subproducto.js',
                            'js/components/ag1Loading/ctr.js',
                            'js/components/ag1Alert/ctr.js',
                            'js/components/ag1Popup/ctr.js'
                        ]
                    });
                }]
            }
        })
        //Descarga
        .state("recepcionDescarga", {
            url: "/recepcionDescarga",
            templateUrl: "view/MenuDescarga/recepcionDescarga.html",
            data: { pageTitle: 'Descarga' },
            controller: "recepcionDescarga",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'view/MenuDescarga/recepcionDescarga.js',
                            'js/components/ag1Loading/ctr.js',
                            'js/components/ag1Alert/ctr.js',
                            'js/components/ag1Popup/ctr.js'
                        ]
                    });
                }]
            }
        })
        .state("descarga", {
            url: "/descarga",
            templateUrl: "view/MenuDescarga/descargaMP/descargaMP2.html",
            data: { pageTitle: 'Descarga' },
            controller: "descargaMP",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'view/MenuDescarga/descargaMP/descargaMP2.js',
                            'js/components/ag1Loading/ctr.js',
                            'js/components/ag1Alert/ctr.js',
                            'js/components/ag1Popup/ctr.js'
                        ]
                    });
                }]
            }
        })
        .state("descarga2", {
            url: "/descarga2",
            templateUrl: "view/MenuDescarga/descargaMP/descargaMP.html",
            data: { pageTitle: 'Descarga' },
            controller: "descargaMP",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'view/MenuDescarga/descargaMP/descargaMP.js',
                            'js/components/ag1Loading/ctr.js',
                            'js/components/ag1Alert/ctr.js',
                            'js/components/ag1Popup/ctr.js'
                        ]
                    });
                }]
            }
        })
        .state("guiaDespacho", {
            url: "/guiaDespacho",
            templateUrl: "view/MenuDescarga/descargaMP/guiaDespacho/guiaDespacho2.html",
            data: { pageTitle: 'Descarga' },
            controller: "guiaDespacho",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'view/MenuDescarga/descargaMP/guiaDespacho/guiaDespacho2.js',
                            'js/components/ag1Loading/ctr.js',
                            'js/components/ag1Alert/ctr.js',
                            'js/components/ag1Popup/ctr.js'
                        ]
                    });
                }]
            }
        })
        //guia despacho propia
        .state("guiaDespachoPropia", {
            url: "/guiaDespachoPropia",
            templateUrl: "view/MenuDescarga/descargaMP/guiaDespachoPropia/guiaDespachoPropia.html",
            data: { pageTitle: 'Descarga' },
            controller: "guiaDespachoPropia",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'view/MenuDescarga/descargaMP/guiaDespachoPropia/guiaDespachoPropia.js',
                            'js/components/ag1Loading/ctr.js',
                            'js/components/ag1Alert/ctr.js',
                            'js/components/ag1Popup/ctr.js'
                        ]
                    });
                }]
            }
        })
        .state("descargasPendientes", {
            url: "/descargasPendientes",
            templateUrl: "view/MenuDescarga/descargasPendientes/descargasPendientes.html",
            data: { pageTitle: 'descargasPendientes' },
            controller: "descargasPendientes",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'view/MenuDescarga/descargasPendientes/descargasPendientes.js',
                            'js/components/ag1Loading/ctr.js',
                            'js/components/ag1Alert/ctr.js',
                            'js/components/ag1Popup/ctr.js'
                        ]
                    });
                }]
            }
        })
        .state("resumenDescarga", {
            url: "/resumenDescarga",
            templateUrl: "view/MenuDescarga/descargaMP/resumen/resumen.html",
            data: { pageTitle: 'Resumen' },
            controller: "resumenDescarga",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'view//MenuDescarga/descargaMP/resumen/resumen.js',
                            'js/components/ag1Loading/ctr.js',
                            'js/components/ag1Alert/ctr.js',
                            'js/components/ag1Popup/ctr.js'
                        ]
                    });
                }]
            }
        })
        .state("menuPPTT", {
            url: "/menuPPTT",
            templateUrl: "view/menuPPTT/menuPPTT.html",
            data: { pageTitle: 'menuPPTT' },
            controller: "menuPPTT",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'view/menuPPTT/menuPPTT.js',
                            'js/components/ag1Loading/ctr.js',
                            'js/components/ag1Alert/ctr.js',
                            'js/components/ag1Popup/ctr.js'
                        ]
                    });
                }]
            }
        })
        .state("mezcla", {
            url: "/mezcla",
            templateUrl: "view/menuPPTT/mezcla/mezcla.html",
            data: { pageTitle: 'mezcla' },
            controller: "mezcla",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'view/menuPPTT/mezcla/mezcla.js',
                            'js/components/ag1Loading/ctr.js',
                            'js/components/ag1Alert/ctr.js',
                            'js/components/ag1Popup/ctr.js'
                        ]
                    });
                }]
            }
        })
        .state("procesoMezcla1", {
            url: "/procesoMezcla1",
            templateUrl: "view/menuPPTT/mezcla/procesoMezcla1/procesoMezcla1.html",
            data: { pageTitle: 'procesoMezcla1' },
            controller: "procesoMezcla1",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'view/menuPPTT/mezcla/procesoMezcla1/procesoMezcla1.js',
                            'js/components/ag1Loading/ctr.js',
                            'js/components/ag1Alert/ctr.js',
                            'js/components/ag1Popup/ctr.js'
                        ]
                    });
                }]
            }
        })
        .state("procesoMezcla2", {
            url: "/procesoMezcla2",
            templateUrl: "view/menuPPTT/mezcla/procesoMezcla1/procesoMezcla2/procesoMezcla2.html",
            data: { pageTitle: 'procesoMezcla2' },
            controller: "procesoMezcla2",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'view/menuPPTT/mezcla/procesoMezcla1/procesoMezcla2/procesoMezcla2.js',
                            'js/components/ag1Loading/ctr.js',
                            'js/components/ag1Alert/ctr.js',
                            'js/components/ag1Popup/ctr.js'
                        ]
                    });
                }]
            }
        })

    .state("menuPT", {
            url: "/menuPT",
            templateUrl: "view/menuPT/menuPT.html",
            data: { pageTitle: 'menuTP' },
            controller: "menuTP",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'view/menuPT/menuPT.js',
                            'js/components/ag1Loading/ctr.js',
                            'js/components/ag1Alert/ctr.js',
                            'js/components/ag1Popup/ctr.js'
                        ]
                    });
                }]
            }
        })
        .state("notificarPT", {
            url: "/notificarPT",
            templateUrl: "view/menuPT/notificar/notificar.html",
            data: { pageTitle: 'menuTP' },
            controller: "notificarPT",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'view/menuPT/notificar/notificar.js',
                            'js/components/ag1Loading/ctr.js',
                            'js/components/ag1Alert/ctr.js',
                            'js/components/ag1Popup/ctr.js'
                        ]
                    });
                }]
            }
        })
        .state("notificacionMP", {
            url: "/notificacionMP",
            templateUrl: "view/menuPT/notificar/mp/mp2.html",
            data: { pageTitle: 'menuTP' },
            controller: "notMP",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'view/menuPT/notificar/mp/mp2.js',
                            'js/components/ag1Loading/ctr.js',
                            'js/components/ag1Alert/ctr.js',
                            'js/components/ag1Popup/ctr.js'
                        ]
                    });
                }]
            }
        })
        .state("notificacionAceite", {
            url: "/notificacionAceite",
            templateUrl: "view/menuPT/notificar/aceite/aceite.html",
            data: { pageTitle: 'menuTP' },
            controller: "notAceite",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'view/menuPT/notificar/aceite/aceite.js',
                            'js/components/ag1Loading/ctr.js',
                            'js/components/ag1Alert/ctr.js',
                            'js/components/ag1Popup/ctr.js'
                        ]
                    });
                }]
            }
        })
        .state("notificacionPT", {
            url: "/notificacionPT",
            templateUrl: "view/menuPT/notificar/pt/pt.html",
            data: { pageTitle: 'menuTP' },
            controller: "notPT",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'view/menuPT/notificar/pt/pt.js',
                            'js/components/ag1Loading/ctr.js',
                            'js/components/ag1Alert/ctr.js',
                            'js/components/ag1Popup/ctr.js'
                        ]
                    });
                }]
            }
        })
        .state("anularPT", {
            url: "/anularPT",
            templateUrl: "view/menuPT/anular/anular.html",
            data: { pageTitle: 'menuTP' },
            controller: "anularPT",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'view/menuPT/anular/anular.js',
                            'js/components/ag1Loading/ctr.js',
                            'js/components/ag1Alert/ctr.js',
                            'js/components/ag1Popup/ctr.js'
                        ]
                    });
                }]
            }
        })
        .state("reprocesoPT", {
            url: "/reprocesoPT",
            templateUrl: "view/menuPT/notificar/reproceso/reprocesoPT.html",
            data: { pageTitle: 'menuTP' },
            controller: "reprocesoPT",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'view/menuPT/notificar/reproceso/reprocesoPT.js',
                            'js/components/ag1Loading/ctr.js',
                            'js/components/ag1Alert/ctr.js',
                            'js/components/ag1Popup/ctr.js'
                        ]
                    });
                }]
            }
        })
        //autorizar
        .state("autorizar", {
            url: "/autorizar",
            templateUrl: "view/menuPT/autorizar/autorizar.html",
            data: { pageTitle: 'autorrizar' },
            controller: "autorizar",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'view/menuPT/autorizar/autorizar.js',
                            'js/components/ag1Loading/ctr.js',
                            'js/components/ag1Alert/ctr.js',
                            'js/components/ag1Popup/ctr.js'
                        ]
                    });
                }]
            }
        })
        //Mezcla Mario jaja 
        .state("mezclaPT", {
            url: "/mezclaPT",
            templateUrl: "view/menuPT/mezcla/mezcla.html",
            data: { pageTitle: 'Mezclas' },
            controller: "mezclaCTR",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'view/menuPT/mezcla/mezcla.js',
                            'js/components/ag1Loading/ctr.js',
                            'js/components/ag1Alert/ctr.js',
                            'js/components/ag1Popup/ctr.js'
                        ]
                    });
                }]
            }
        })
        //Mezcla2 Mario jaja 
        .state("mezclaProcesoPT", {
            url: "/mezclaProcesoPT",
            templateUrl: "view/menuPT/mezcla/procesoMezclado/mezclaProceso.html",
            data: { pageTitle: 'Mezclas Proceso' },
            controller: "mezclaProcesoCTR",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'view/menuPT/mezcla/procesoMezclado/mezclaProceso.js',
                            'js/components/ag1Loading/ctr.js',
                            'js/components/ag1Alert/ctr.js',
                            'js/components/ag1Popup/ctr.js'
                        ]
                    });
                }]
            }
        })
        //Mezcla3 Mario jaja 
        .state("mezclaProcesoHUPT", {
            url: "/mezclaProcesoHUPT",
            templateUrl: "view/menuPT/mezcla/ProcesoMezcladoHU/mezclaProcesoHU.html",
            data: { pageTitle: 'Mezclas Proceso HU' },
            controller: "mezclaProcesoHUCTR",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'view/menuPT/mezcla/ProcesoMezcladoHU/mezclaProcesoHU.js',
                            'js/components/ag1Loading/ctr.js',
                            'js/components/ag1Alert/ctr.js',
                            'js/components/ag1Popup/ctr.js'
                        ]
                    });
                }]
            }
        })
        //ALMACEN - MENU
        .state("menuAlmacen", {
            url: "/menuAlmacen",
            templateUrl: "view/almacen/menuAlmacen.html",
            data: { pageTitle: 'Menu Almacen' },
            controller: "menuAlmacenCTR",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'view/almacen/menuAlmacen.js',
                            'js/components/ag1Loading/ctr.js',
                            'js/components/ag1Alert/ctr.js',
                            'js/components/ag1Popup/ctr.js'
                        ]
                    });
                }]
            }
        })
        //ALMACEN - POSICIONES
        .state("posiciones", {
            url: "/posiciones",
            templateUrl: "view/almacen/posiciones/posiciones.html",
            data: { pageTitle: 'Menu Posiciones' },
            controller: "posicionesCTR",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'view/almacen/posiciones/posiciones.js',
                            'js/components/ag1Loading/ctr.js',
                            'js/components/ag1Alert/ctr.js',
                            'js/components/ag1Popup/ctr.js'
                        ]
                    });
                }]
            }
        })
        //ALMACEN - customerData
        .state("customerData", {
            url: "/customerData",
            templateUrl: "view/almacen/customerData/customerData.html",
            data: { pageTitle: 'Menu Customer Data' },
            controller: "customerDataCTR",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'view/almacen/customerData/customerData.js',
                            'js/components/ag1Loading/ctr.js',
                            'js/components/ag1Alert/ctr.js',
                            'js/components/ag1Popup/ctr.js'
                        ]
                    });
                }]
            }
        }) //ALMACEN - moverhu
        .state("moverhu", {
            url: "/moverhu",
            templateUrl: "view/almacen/moverHU/moverhu.html",
            data: { pageTitle: 'Menu Customer Data' },
            controller: "moverhuCTR",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'view/almacen/moverHU/moverhu.js',
                            'js/components/ag1Loading/ctr.js',
                            'js/components/ag1Alert/ctr.js',
                            'js/components/ag1Popup/ctr.js'
                        ]
                    });
                }]
            }
        })//calidadMain
        .state("calidadMain", {
            url: "/menuCalidad",
            templateUrl: "view/calidad/menuCalidad.html",
            data: { pageTitle: 'Menu Calidad' },
            controller: "calidadController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'view/calidad/menuCalidad.js',
                            'js/components/ag1Loading/ctr.js',
                            'js/components/ag1Alert/ctr.js',
                            'js/components/ag1Popup/ctr.js'
                        ]
                    });
                }]
            }
        })//calidadMain
        .state("aceiteCalidad", {
            url: "/aceiteCalidad",
            templateUrl: "view/calidad/aceite/aceiteCl.html",
            data: { pageTitle: 'Aceites' },
            controller: "aceiteController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'view/calidad/aceite/aceiteCl.js',
                            'js/components/ag1Loading/ctr.js',
                            'js/components/ag1Alert/ctr.js',
                            'js/components/ag1Popup/ctr.js'
                        ]
                    });
                }]
            }
        })//agua de cola
        .state("aguaColaCl", {
            url: "/aguaColaCl",
            templateUrl: "view/calidad/aceite/aguaCola/aguaCola.html",
            data: { pageTitle: 'Agua de Cola' },
            controller: "aguaColaController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'view/calidad/aceite/aguaCola/aguaCola.js',
                            'js/components/ag1Loading/ctr.js',
                            'js/components/ag1Alert/ctr.js',
                            'js/components/ag1Popup/ctr.js'
                        ]
                    });
                }]
            }
        })//agua de cola
        .state("concentradoCl", {
            url: "/concentradoCl",
            templateUrl: "view/calidad/aceite/concentrado/concentrado.html",
            data: { pageTitle: 'Concentrado' },
            controller: "concentradoController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'view/calidad/aceite/concentrado/concentrado.js',
                            'js/components/ag1Loading/ctr.js',
                            'js/components/ag1Alert/ctr.js',
                            'js/components/ag1Popup/ctr.js'
                        ]
                    });
                }]
            }
        })//productos intermedios
        .state("prodIntermedioCl", {
            url: "/prodIntermedioCl",
            templateUrl: "view/calidad/prodIntermedio/prodIntermedio.html",
            data: { pageTitle: 'Producto Intermedio' },
            controller: "prodIntermedioController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'view/calidad/prodIntermedio/prodIntermedio.js',
                            'js/components/ag1Loading/ctr.js',
                            'js/components/ag1Alert/ctr.js',
                            'js/components/ag1Popup/ctr.js'
                        ]
                    });
                }]
            }
        })//productos intermedios body
        .state("prodIntermBod", {
            url: "/prodIntermBod",
            templateUrl: "view/calidad/prodIntermedio/prodIntermBody/prodIntermBody.html",
            data: { pageTitle: 'Producto Intermedio' },
            controller: "prdoBodyController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'view/calidad/prodIntermedio/prodIntermBody/prodIntermBody.js',
                            'js/components/ag1Loading/ctr.js',
                            'js/components/ag1Alert/ctr.js',
                            'js/components/ag1Popup/ctr.js'
                        ]
                    });
                }]
            }
        })
}]);

/* Init global settings and run the app */
MetronicApp.run(["$rootScope", "settings", "$state", "$location", function($rootScope, settings, $state, $location) {
    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$settings = settings; // state to be accessed from view
    $rootScope.redirect = {
        mostrarVista: false,
        vista: ""
    }
    if ($location.$$path != "/login") {
        if ($rootScope.data == undefined) {
            $location.path("/login");
        }
    }
    $rootScope.volver = false;
    $rootScope.location = function(data) {
        var mostrarVista = data.mostrarVista;
        $rootScope.redirect = {
            mostrarVista: mostrarVista,
            vista: data.vista
        }
        if (data.ruta != "")
            $location.path(data.ruta);
    }
}]);