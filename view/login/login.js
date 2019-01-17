/* Setup blank page controller */
angular.module('MetronicApp').controller('Login', ['$rootScope', '$scope', 'settings', '$http', '$sce', '$location',
        function($rootScope, $scope, settings, $http, $sce, $location) {
            /*$scope.$on('$viewContentLoaded', function () {
                // initialize core components
                App.initAjax();
                //Ladda.bind( '#btnSave' );
            });*/
            //$scope.recuperarPass = "none";
            //$scope.login = "";
            $rootScope.plantas = [];
            $rootScope.materialesPT = [];
            $rootScope.materialesMP = [];
            $rootScope.proveedores = [{ value: '01', text: 'Blumar S.A' }];
            $rootScope.muelles = [];
            $rootScope.embarcaciones = [];
            $rootScope.pozos = [];
            $rootScope.materialesJson = [];
            $rootScope.materialesSUB = [];
            $rootScope.dataProcedencia = [];
            $rootScope.dataConductores = [];
            $rootScope.dataRomanas = [];
            $rootScope.dataClientes = [];
            $rootScope.romanas;
            $scope.acceder = function(user, pass) {
                $rootScope.loader = true;
                $scope.RFC_TOTAL = 0;
                $scope.getDataSAP();
                /*$rootScope.loading.on();
                $http.get("view/login/users.json",
                        {headers: {'Content-Type': 'application/json; charset=UTF-8'}
                        }).success(function (data) {
                    if (angular.uppercase(data.user) == angular.uppercase(user) && angular.uppercase(data.pass) == angular.uppercase(pass)) {
                        $location.path('/mainMenu');
                    } else {
                        $rootScope.loading.off();
                        $rootScope.dialog.alert({title: "Alerta!!", msje: "Datos Incorrectos"});
                    }
                }).error($rootScope.dialog.httpRequest.error);*/
            };

            $scope.getDataSAP = function() {


                $http.get(IPSERVICIOSAPX + "JSON_RFC_READ_TABLE.aspx?TABLA=ZMOV_50004&SEPARADOR=;").then(function(response) {

                    angular.forEach(response.data.DATA, function(val, key) {

                        $rootScope.dataConductores.push(val.WA);

                    })
                    $scope.RFC_TOTAL++;
                    $scope.Acceder_wea();

                })

                $http.get(IPSERVICIOSAPX + "JSON_ZMOV_10008.aspx?SOCIEDAD=1000").then(function(data) {

                    var aux = [];
                    auxPozos = [];
                    angular.forEach(data.data.LT_DETALLE, function(val, key) {
                        $rootScope.pozos.push({ value: val.LGORT, text: val.LGORT, planta: val.WERKS });
                        if (aux.indexOf(val.NAME_WERKS) === -1) {

                            aux.push(val.NAME_WERKS);
                            $rootScope.plantas.push({ value: val.WERKS, text: val.NAME_WERKS });

                        }

                    });
                    $scope.RFC_TOTAL++;
                    $scope.Acceder_wea();
                })

                $http.get(IPSERVICIOSAPX + "JSON_ZMOV_10012.aspx?MTART=ZPT&WERKS=1050").then(function(response) {

                    angular.forEach(response.data.LT_DETALLE, function(val, key) {

                        if (val.WRKST != "")
                            $rootScope.materialesPT.push({ value: val.MATNR, text: val.MAKTX, especie: val.EXTWG });

                    });
                    $scope.RFC_TOTAL++;
                    $scope.Acceder_wea();

                });

                $http.get(IPSERVICIOSAPX + "JSON_ZMOV_10012.aspx?MTART=ZMP&WERKS=1050").then(function(response) {

                    angular.forEach(response.data.LT_DETALLE, function(val, key) {

                        if (val.WRKST != "")
                            $rootScope.materialesMP.push({ value: val.MATNR, text: val.MAKTX, especie: val.EXTWG });

                    });
                    $scope.RFC_TOTAL++;
                    $scope.Acceder_wea();

                });

                $http.get(IPSERVICIOSAPX + "json_ZMOV_10036.aspx").then(function(response) {

                    angular.forEach(response.data.ET_DATPROV, function(val, key) {

                        $rootScope.proveedores.push({ value: val.LIFNR, text: val.NAME1 });

                    });
                    $scope.RFC_TOTAL++;
                    $scope.Acceder_wea();
                });
                $rootScope.Ponton = [];
                $http.get(IPSERVICIOSAPX + "JSON_RFC_READ_TABLE.aspx?TABLA=ZMOV_50002&SEPARADOR=;").then(function(response) {
                    var auxMuell = [];
                    var auxRomana = [];
                    angular.forEach(response.data.DATA, function(val, key) {
                        if (auxMuell.indexOf(val.WA[4]) == -1) {
                            $rootScope.muelles.push({ value: [val.WA[4], val.WA[2]], text: val.WA[4] });
                            auxMuell.push(val.WA[4]);
                        }
                        $rootScope.Ponton.push({ text: val.WA[4].trim() + ' - ' + val.WA[3].trim(), key: val.WA[3].trim(), muelle: val.WA[4].trim() })
                        if (auxRomana.indexOf(val.WA[3]) == -1) {
                            $rootScope.dataRomanas.push({ text: val.WA[3].trim(), value: val.WA[3].trim(), planta: val.WA[1] });
                            auxRomana.push(val.WA[3]);
                        }

                    });

                    $scope.RFC_TOTAL++;
                    $scope.Acceder_wea();
                })
                $http.get(IPSERVICIOSAPX + "JSON_RFC_READ_TABLE.aspx?TABLA=ZMOV_50003&SEPARADOR=;").then(function(response) {

                    angular.forEach(response.data.DATA, function(val, key) {
                        $rootScope.dataProcedencia.push(val.WA);
                        $rootScope.embarcaciones.push({ value: val.WA[2], text: val.WA[2] });
                    })
                    $scope.RFC_TOTAL++;
                    $scope.Acceder_wea();

                })
                $http.get("json/JSON_MATERIALES.json", {
                    headers: { 'Content-Type': 'application/json; charset=UTF-8' }
                }).then(function(response) {
                    angular.forEach(response.data, function(val, key) {
                        $rootScope.materialesJson.push({ id: val.ITM_IDENT, material: val.ITEM_TEXT1 });
                    });
                    $scope.RFC_TOTAL++;
                    $scope.Acceder_wea();
                });


                $http.get(IPSERVICIOSAPX + "JSON_ZMOV_10012.aspx?MTART=ZST&WERKS=1050").then(function(response) {

                    angular.forEach(response.data.LT_DETALLE, function(val, key) {

                        //if (val.WRKST != "")
                        $rootScope.materialesSUB.push({ value: val.MATNR, text: val.MAKTX, especie: val.EXTWG });

                    });
                    $scope.RFC_TOTAL++;
                    $scope.Acceder_wea();

                });

            }
            $scope.Acceder_wea = function() {
                if (9 == $scope.RFC_TOTAL) {
                    $rootScope.loader = false;
                    /*$scope.Netitrox = [1,2,3,4,5,6,7,8,9];
                    angular.forEach($scope.Netitrox,function(value,key){
                        if(value ==7){
                            break;
                        }
                    })*/
                    $location.path('/mainMenu');
                }
            }


        }
    ]

);