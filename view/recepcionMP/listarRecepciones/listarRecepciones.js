/* Setup blank page controller */
angular.module('MetronicApp').controller('listarRecepciones', ['$rootScope', '$scope', 'settings', '$http', '$sce', '$location', '$timeout',
            function($rootScope, $scope, settings, $http, $sce, $location, $timeout) {

                $scope.descargas;
                $scope.DATOS = [];



                if ($rootScope.recepcionDirecta != undefined) {

                    $http.get(IPSERVICIOSBD + "guia/getGuiasRecepcionPropia").success(function(data) {

                        $scope.descargas = data;
                        $scope.DATOS = $scope.descargas;

                    })


                } else {

                    $http.get(IPSERVICIOSBD + "guia/getGuiasRecepcion").success(function(data) {

                        $scope.descargas = data;
                        $scope.DATOS = $scope.descargas;
                        //              console.log($scope.descargas.length);
                        console.log($scope.DATOS.length);
                    })

                }

                $scope.selectDescarga = function(descarga) {

                    console.log(descarga);
                    //return;

                    if (descarga.oc == 0) {

                        $rootScope.recepcionSeleccionada = descarga;
                        $http.get(IPSERVICIOSBD + "descarga/getPropia?descarga=" +
                            $rootScope.recepcionSeleccionada.fechaDescarga + "&recalada=" +
                            $rootScope.recepcionSeleccionada.fechaRecalada + "&embarcacion=" +
                            $rootScope.recepcionSeleccionada.embarcacion).then(function(resp) {

                            $rootScope.recepcionSeleccionada.ocInfo = resp.data;

                            if (descarga.tipoTransporte == 0) {
                                $location.path("/mpPropia");
                            } else {
                                $location.path("/mpComprada");
                            }

                        }, function(error) {

                            $rootScope.loader = false;
                            $rootScope.tipoMsg = 'Error';
                            $rootScope.msg = [{ tipo: "Error en servicio JAVA descarga/getPropia", descripcion: error.statusText }]
                            $rootScope.showM = true;

                        })


                    } else {

                        $http.get(IPSERVICIOSBD + "descarga/getByOC?oc=" + descarga.oc).then(function(resp) {

                            descarga.ocInfo = resp.data;
                            $rootScope.recepcionSeleccionada = descarga;
                            if (descarga.tipoTransporte == 0) {
                                $location.path("/mpPropia");
                            } else {
                                $location.path("/mpComprada");
                            }

                        }, function(error) {

                            $rootScope.loader = false;
                            $rootScope.tipoMsg = 'Error';
                            $rootScope.msg = [{ tipo: "Error en servicio JAVA descarga/getByOC", descripcion: error.statusText }]
                            $rootScope.showM = true;


                        })


                    }

                }

                $timeout(function() {

                    //================================= INICIO PAGINACION ==========================
                    /*PAGINACION*/
                    console.log("LARGO DE CAPACIDAD DE LA VARIABLE DATOS");
                    console.log($scope.DATOS.length);
                    $scope.currentPage = [0, 0];
                    $scope.pageSize = [10, 10];
                    $scope.pages = [];
                    // $scope.configPages = function (x) {
                    //     console.log(x)
                    //     //$scope.Paginacion();
                    //     if (x) {
                    //         $scope.stop = $interval(function () {
                    //             if ($scope.DATOS && $scope.DATOS.length > 0) {
                    //                 $interval.cancel($scope.stop);
                    //                 $scope.stop = null;
                    //                 $scope.Paginacion($scope.DATOS, 0);
                    //             }
                    //         }, 500);
                    //         console.log('entra en el if $scope.DATOS && $scope.DATOS.length > 0');
                    //     } else {
                    //         console.log('paginacion guias');
                    //         $scope.Paginacion($scope.guiasOC, 1)
                    //     }
                    // };
                    $scope.Paginacion = function(data, i) {
                        $scope.pages[i] = [];
                        console.log($scope.pages);
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
                        console.log(pg, i)
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

                    //================================= FIN PAGINACION ==========================


                }, 1000)


            }
        ]

    )
    .filter('formatFecha', function() {
        return function(input) {
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
    })
    .filter('startFromGrid', function() {
        return function(input, start) {
            if (input === undefined) return;
            //console.log(input, start);
            try {
                start = +start;
                // console.log(start, input);
                return input.slice(start);
            } catch (e) {
                console.log(e)
            }
        }
    });