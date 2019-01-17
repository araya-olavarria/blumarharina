/* Setup blank page controller */
angular.module('MetronicApp').controller('descargasPendientes', ['$rootScope', '$scope', 'settings', '$http', '$sce', '$location', '$interval',
    function($rootScope, $scope, settings, $http, $sce, $location, $interval) {
        $rootScope.CierreNuevo = true;
        $scope.pendientes = [];
        $scope.DATOS = []
        $scope.showM = "modal fade";
        $scope.listaguias = [];
        $http.get(IPSERVICIOSBD + "descarga/getPendientes").success(function(data) {
            $scope.pendientes = data;
            $scope.DATOS = data;

        })

        $scope.filterByboat = function() {



        }

        $scope.selectPendiente = function(item) {
            if (item.tipoDescarga == 0) {
                $rootScope.ocSeleccionada = item;
                $location.path("/guiaDespacho");
            } else {
                $rootScope.ocSeleccionada = item;
                $location.path("/guiaDespacho");
            }
        }

        $scope.getPlanta = function(val) {

            var planta = "";
            angular.forEach($rootScope.plantas, function(v, k) {

                if (v.value == val) {
                    planta = v.text;
                }

            })

            return planta;

        }

        $scope.verGuias = function(item) {
            //console.log($rootScope.plantas);
            if (item.tipoDescarga == 0) {
                $http.get(IPSERVICIOSBD + "guia/getGuiasPropias?descarga=" + item.fechaDescarga + "&recalada=" + item.fechaRecalada + "&embarcacion=" + item.embarcacion).success(function(response) {
                    $scope.guiasOC = response;

                    angular.forEach($scope.guiasOC, function(v, k) {

                        v.planta = $scope.getPlanta(v.planta);

                    })
                    //console.log($scope.guiasOC);
                    $scope.showM = 'modal show';
                    $scope.listaguias = $scope.guiasOC;
                    $scope.configPages(false);
                })
            } else {
                $http.get(IPSERVICIOSBD + "guia/getGuiasByOC?oc=" + item.oc).success(function(response) {
                    $scope.guiasOC = response;

                    angular.forEach($scope.guiasOC, function(v, k) {

                        v.planta = $scope.getPlanta(v.planta);

                    })
                    //console.log($scope.guiasOC);
                    $scope.showM = 'modal show';
                    $scope.configPages(false);
                })
            }
        }

        $scope.nuevaDescarga = function() {
            $location.path('/descarga');
        }

        $scope.closeModal = function() {
            $scope.showM = "modal fade";
        }

        $scope.cerrarDescarga = function(item) {

            $rootScope.seleccionCierre = item;
            $location.path('/cierreDescarga');

        }

        /*PAGINACION*/
        $scope.currentPage = [0, 0];
        $scope.pageSize = [10, 10];
        $scope.pages = [];
        $scope.configPages = function(x) {
            //$scope.Paginacion();
            if (x) {
                $scope.stop = $interval(function() {
                    if ($scope.DATOS && $scope.DATOS.length > 0) {
                        $interval.cancel($scope.stop);
                        $scope.stop = null;
                        $scope.Paginacion($scope.DATOS, 0);
                    }
                }, 500);
            } else {
                $scope.Paginacion($scope.guiasOC, 1)
            }
        };
        $scope.Paginacion = function(data, i) {
            $scope.pages[i] = [];
            var ini = $scope.currentPage[i] - 4;
            var fin = $scope.currentPage[i] + 5;
            if (ini < 1) {
                ini = 1;
                fin = Math.ceil(data.length / $scope.pageSize[i]);
            } else if (ini >= Math.ceil(data.length / $scope.pageSize[i]) - 15) {
                ini = Math.ceil(data.length / $scope.pageSize[i]) - 15;
                fin = Math.ceil(data.length / $scope.pageSize[i]);

            }
            $scope.va11 = 1;
            $scope.val2 = (fin > 7) ? 7 : fin;
            $scope.FIN = fin;
            if (ini < 1)
                ini = 1;
            for (var x = ini; x <= fin; x++) {
                $scope.pages[i].push({
                    no: x,
                    vsbl: ((x < 9) ? false : true),
                    tresP: '...',
                    tresPV: false
                });
            }
            angular.forEach($scope.pages[i], function(val, key) {
                if (val.no < $scope.va11 || val.no > $scope.val2) {
                    val.tresPV = true;
                }
                if (val.no === fin) {
                    val.vsbl = false;
                    val.tresPV = false;
                }
            })
            if ($scope.currentPage[i] >= $scope.pages[i].length) {
                $scope.currentPage[i] = $scope.pages[i].length - 1;
            }
        }
        $scope.setPage = function(pg, i) {
            if (pg === $scope.val2) {
                $scope.val2++;
                $scope.va11++;
            } else if (pg === $scope.FIN) {
                $scope.val2 = $scope.FIN;
                $scope.va11 = $scope.FIN - 7;
            } else if (pg === $scope.va11) {
                $scope.val2--;
                $scope.va11--;
            } else if (pg === 1) {
                $scope.val2 = 7;
                $scope.va11 = 1;
            }
            angular.forEach($scope.pages[i], function(val, key) {
                if (val.no < $scope.va11 || val.no > $scope.val2) {
                    val.tresPV = true;
                    val.vsbl = true;
                } else {
                    val.tresPV = false;
                    val.vsbl = false;
                }
                if (val.no === $scope.FIN) {
                    val.vsbl = false;
                    val.tresPV = false;
                }
                if (val.no === $scope.val2) {
                    val.vsbl = false;
                    val.tresPV = false;
                }
                if (val.no === $scope.va11) {
                    val.vsbl = false;
                    val.tresPV = false;
                }
                if (val.no === ($scope.va11 - 1) || val.no === ($scope.val2 + 1)) {
                    val.vsbl = false;
                }
            });
            $scope.currentPage[i] = pg - 1;
        };
    }
]).filter('startFromGrid', function() {
    return function(input, start) {
        if (input === undefined) return;
        ////console.log(input, start);
        try {
            start = +start;
            // //console.log(start, input);
            return input.slice(start);
        } catch (e) {
            //console.log(e)
        }
    };
}).filter('formatFecha', function() {
    return function(input) {
        //console.log(input);
        var fechaProc = input.split(' ')[0];
        var hora = input.split(' ')[1];
        var dd = fechaProc.split('-')[2];
        var mm = fechaProc.split('-')[1];
        var yy = fechaProc.split('-')[0];
        hora = hora.replace(':00.0', '');
        return dd + "-" + mm + "-" + yy + " " + hora;
        // do some bounds checking here to ensure it has that index
        // return input.split(splitChar)[splitIndex];
    }
});