/* Setup blank page controller */
angular.module('MetronicApp').controller('autorizar', ['$rootScope', '$scope', 'settings', '$http', '$sce', '$location', '$timeout',
        function($rootScope, $scope, settings, $http, $sce, $location, $timeout) {

            $scope.materialesJson = [];
            $scope.lotes = [];
            $scope.showM = "modal fade";
            $scope.fecha = new Date();

            $http.get(IPSERVICIOSAPX + "JSON_ZMOV_10012.aspx?MTART=ZPT&WERKS=1020").then(function(response) {

                angular.forEach(response.data.LT_DETALLE, function(val, key) {

                    if (val.WRKST != "")
                        $scope.materialesJson.push({ id: val.MATNR, material: val.MAKTX, especie: val.EXTWG });

                });

            });

            $scope.getNotificaciones = function() {
                $rootScope.loader = true;
                $scope.lotes = [];

                var fecha = $scope.fecha.getFullYear() + "-" + ($scope.fecha.getMonth() + 1) + "-" + $scope.fecha.getDate();
                $http.get(IPSERVICIOSBD + "notificacion/getByMaterialFecha?mat=" + $scope.material.id + "&fecha=" + fecha).success(function(respon) {


                    angular.forEach(respon, function(val, key) {

                        val.aprob = false;
                        $scope.lotes.push(val);

                    })

                    $rootScope.loader = false;

                })

            }

            $scope.verDetalle = function(item) {

                $scope.detalle = item.detalle;
                $scope.showM = "modal show";

            }

            $scope.autorizar = function() {

                $rootScope.loader = true;
                var jsonRepMan = {};
                var totalRepMan = 0;
                var jsonHUNot = [];

                angular.forEach($scope.lotes, function(v, k) {

                    console.log(v);
                    if (v.aprob) {
                        jsonRepMan = v;

                        angular.forEach(v.detalle, function(val, key) {

                            totalRepMan += val.kilos;
                            jsonHUNot.push({
                                "BATCH": val.lote,
                                "HU_EXID": val.hu,
                                "MATERIAL": val.material,
                                "PACK_MAT": val.envase,
                                "PACK_QTY": val.kilos,
                                "PLANT": "1050",
                                "STGE_LOC": "03  "
                            })

                        })
                    }

                })
                $http.get("json/JSON_NOT_PT.json", { headers: { 'Content-Type': 'application/json; charset=UTF-8' } }).then(function(rspJson) {

                    var jsonEnvio = rspJson.data;
                    jsonEnvio.OBJETOENTRADA[0].PARAMETROS.DATAGEN.BACKFLQUANT = totalRepMan;
                    jsonEnvio.OBJETOENTRADA[0].PARAMETROS.DATAGEN.BATCH = jsonRepMan.lote;
                    jsonEnvio.OBJETOENTRADA[0].PARAMETROS.DATAGEN.DOCDATE = $rootScope.getFechaBapi();
                    jsonEnvio.OBJETOENTRADA[0].PARAMETROS.DATAGEN.MATERIALNR = jsonRepMan.material;
                    jsonEnvio.OBJETOENTRADA[0].PARAMETROS.DATAGEN.PLANTPLANT = '1050';
                    jsonEnvio.OBJETOENTRADA[0].PARAMETROS.DATAGEN.POSTDATE = $rootScope.getFechaBapi();
                    jsonEnvio.OBJETOENTRADA[0].PARAMETROS.DATAGEN.PRODPLANT = "1050";
                    jsonEnvio.OBJETOENTRADA[0].PARAMETROS.DATAGEN.STORAGELOC = '03';
                    jsonEnvio.OBJETOENTRADA[0].PARAMETROS.DATAGEN.DOCHEADERTXT = jsonRepMan.porcion;

                    jsonEnvio.OBJETOENTRADA[1].PARAMETROS = jsonHUNot;

                    console.log(IPSERVICIOSAPX + "JSON_NOT_HU.aspx?PARAMETROS=" + JSON.stringify(jsonEnvio));

                    $http.get(IPSERVICIOSAPX + "JSON_NOT_HU.aspx?PARAMETROS=" + JSON.stringify(jsonEnvio)).then(function(response) {

                        $rootScope.msg = [];
                        angular.forEach(response.data.MENSAJES, function(val, key) {


                            //var mesaje = JSON.parse(val.MENSAJES);
                            if (val) {
                                if (key == 0) {
                                    var mesaje = JSON.parse(val.MENSAJES);
                                    if (mesaje.CONFIRMATION > 0) {

                                        $rootScope.tipoMsg = 'NOTIFICACIÓN';
                                        $rootScope.msg.push({ tipo: "NOTIFICACIÓN RELIZADA", descripcion: "N° de confirmacion " + mesaje.CONFIRMATION });

                                    } else {

                                        $rootScope.tipoMsg = 'NOTIFICACIÓN';
                                        $rootScope.msg.push({ tipo: "error", descripcion: "ERROR AL NOTIFICAR" });

                                    }

                                } else {
                                    var mesaje = JSON.parse(val.MENSAJES);
                                    if (mesaje.RETURN.length > 0) {
                                        angular.forEach(mesaje.RETURN, function(v, k) {

                                            if (v.TYPE == "E") {
                                                $rootScope.tipoMsg = 'NOTIFICACIÓN';
                                                $rootScope.msg.push({ tipo: "error", descripcion: v.MESSAGE });
                                            }

                                        })

                                    } else {

                                        var huM = JSON.parse(val.MENSAJES);
                                        $rootScope.tipoMsg = 'NOTIFICACIÓN';
                                        $rootScope.msg.push({ tipo: "HU CREADA", descripcion: "HU " + huM.HUKEY });
                                        var not = { hu: huM.HUKEY };
                                        $http.get(IPSERVICIOSBD + "/notificacion/update?not=" + JSON.stringify(not)).then(function(rsx) {

                                            console.log(rsx.data);


                                        })
                                    }

                                }
                            }

                        })
                        $rootScope.loader = false;
                        $rootScope.showM = true;
                    })
                })
            }

            $scope.closeModal = function() {

                $scope.showM = "modal fade";

            }

        }
    ]

);