/* Setup blank page controller */
angular.module('MetronicApp').controller('notMP', ['$rootScope', '$scope', 'settings', '$http', '$sce', '$location',
        function($rootScope, $scope, settings, $http, $sce, $location) {

            $scope.fecha = new Date();
            $scope.fechaNot = new Date();
            $scope.horaNot = $scope.fecha.getHours() + ":" + ($scope.fecha.getMinutes() < 10 ? '0' : '') + $scope.fecha.getMinutes();
            $scope.modalVi = "modal fade";
            $scope.materialesJson = [];
            $scope.componentes = [];
            $scope.plantas = [];
            $scope.plantas2 = []; //borrar y mejorar

            var jsonEnvio = {};

            $scope.okNotif = function() {

                location.reload();

            }
            $http.get("json/JSON_NOTIFICACION_MP.json", {
                headers: { 'Content-Type': 'application/json; charset=UTF-8' }
            }).success(function(data) {
                jsonEnvio = data;
            }).error($rootScope.dialog.httpRequest.error);



            $http.get(IPSERVICIOSAPX + "JSON_ZMOV_10008.aspx?SOCIEDAD=1000").then(function(data) {

                var aux = [];
                angular.forEach(data.data.LT_DETALLE, function(val, key) {
                    if (aux.indexOf(val.NAME_WERKS) === -1) {

                        aux.push(val.NAME_WERKS);
                        $scope.plantas.push({ id: val.WERKS, nombre: val.NAME_WERKS });

                    }

                })

            })



            $http.get(IPSERVICIOSAPX + "JSON_ZMOV_10008.aspx?SOCIEDAD=1000").then(function(data) {

                var aux = [];
                angular.forEach(data.data.LT_DETALLE, function(val, key) {
                    if (aux.indexOf(val.NAME_WERKS) === -1) {

                        aux.push(val.NAME_WERKS);
                        $scope.plantas2.push({ value: val.WERKS, text: val.NAME_WERKS });

                    }

                })

                $('#plantas').immybox({
                    choices: $scope.plantas2
                });

            })


            $scope.materiales = [{
                material: '',
                kilos: '',
                almacen: '',
                lote: ''
            }];

            $http.get(IPSERVICIOSAPX + "JSON_ZMOV_10012.aspx?MTART=ZPT&WERKS=1020").then(function(response) {

                angular.forEach(response.data.LT_DETALLE, function(val, key) {

                    if (val.WRKST != "")
                        $scope.materialesJson.push({ id: val.MATNR, material: val.MAKTX, especie: val.EXTWG });

                });

            });

            $http.get(IPSERVICIOSAPX + "JSON_ZMOV_10012.aspx?MTART=ZMP&WERKS=1020").then(function(response) {

                angular.forEach(response.data.LT_DETALLE, function(val, key) {

                    if (val.WRKST != "")
                        $scope.componentes.push({ id: val.MATNR, material: val.MAKTX, especie: val.EXTWG });

                });
            });

            $scope.getComponents = function() {

                $http.get(IPSERVICIOSAPX + "JSON_BOM_MATERIAL.aspx?CENTRO=1020&MATERIAL=" + $scope.material.id).success(function(data) {

                    $scope.materiales = [];

                    angular.forEach(data.T_STPO, function(val, key) {

                        if (val.COMPONENT != '4001211')
                            $scope.materiales.push({ material: { id: $rootScope.pad(val.COMPONENT, 18, 0), material: '' }, kilos: val.COMP_QTY.replace(".", ""), almacen: '', lote: '' });

                    })
                })

            }

            $scope.addMaterial = function() {
                $scope.materiales.push({
                    codMaterial: '',
                    material: '',
                    porcentaje: '',
                    kilos: ''
                });
            };

            $scope.removeMaterial = function(index) {

                var auxId = $scope.materiales[index].material.id;
                if ($scope.materiales.length > 1) {

                    $scope.materiales.splice(index, 1);
                    angular.forEach($scope.matAgregados, function(val, key) {

                        if (val == auxId) {

                            $scope.matAgregados.splice(key, 1);

                        }

                    })

                } else {
                    alert("No puede eliminar la ultima linea");
                }
            };

            $scope.notificar = function() {

                $http.get(IPSERVICIOSBD + "notificacion/getCorrelativo").success(function(data) {

                    var correlativo = correlativo;
                    jsonEnvio.PARAMETROS.DATAGEN.PDC_NUMBER = data;
                    jsonEnvio.PARAMETROS.DATAGEN.MATERIALNR = $scope.material.id;
                    jsonEnvio.PARAMETROS.DATAGEN.PLANPLANT = $('#plantas').immybox('getValue')[0];
                    jsonEnvio.PARAMETROS.DATAGEN.PRODPLANT = $('#plantas').immybox('getValue')[0];
                    jsonEnvio.PARAMETROS.DATAGEN.BATCH = $scope.lote;
                    jsonEnvio.PARAMETROS.DATAGEN.POSTDATE = $rootScope.getFechaBapi();
                    jsonEnvio.PARAMETROS.DATAGEN.DOCDATE = $rootScope.getFechaBapi();
                    jsonEnvio.PARAMETROS.DATAGEN.BACKFLQUANT = $scope.kilos;
                    jsonEnvio.PARAMETROS.DATAGEN.UNITOFMEASURE = 'KG';




                    angular.forEach($scope.materiales, function(val, key) {

                        var goodMovements = {};

                        goodMovements.MATERIAL = val.material.id;
                        goodMovements.PLANT = $('#plantas').immybox('getValue')[0];
                        goodMovements.STGE_LOC = "02";
                        goodMovements.BATCH = val.lote;
                        goodMovements.MOVE_TYPE = "261";
                        goodMovements.ENTRY_QNT = 0;
                        goodMovements.ENTRY_UOM = "KG";

                        jsonEnvio.PARAMETROS.GOODSMOVEMENTS.push(goodMovements);

                    })


                    jsonEnvio.PARAMETROS.CHARACTERISTICS_BATCH[0].CHAR_VALUE = "12";

                    var notificacion = {

                        id: 0,
                        material: $scope.material.id,
                        kilos: $scope.kilos,
                        porcion: $scope.porcion,
                        fechaContabilidad: $rootScope.formatFechaDB($scope.fechaFabricacion),
                        fechaFabricacion: $rootScope.formatFechaDB($scope.fechaFabricacion),
                        almacen: $('#plantas').immybox('getValue')[0],
                        lote: $scope.lote,
                        nDte: correlativo

                    }

                    $http.get(IPSERVICIOSAPX + "JSON_BAPI_REPMANCONF1_CREATE_MTS.aspx?PARAMETRO=" + JSON.stringify(jsonEnvio)).success(function(data) {

                        $http.get(IPSERVICIOSBD + "notificacion/insert?not=" + JSON.stringify(notificacion)).success(function(data) {

                            console.log(data);


                        })

                        $scope.nDoc = data.CONFIRMATION;
                        $scope.modalVi = "modal show";

                    })
                })


            }
        }
    ]

);