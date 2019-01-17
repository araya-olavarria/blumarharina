/* Setup blank page controller */
angular.module('MetronicApp').controller('resumenMP', ['$rootScope', '$scope', 'settings', '$http', '$sce', '$location',
        function($rootScope, $scope, settings, $http, $sce, $location) {

            var jsonEnvio = {};
            $scope.modalVisible = false;
            $scope.errores = [];
            $http.get("json/JSON_ENVIO_MP_COMPRADA.json", {
                headers: { 'Content-Type': 'application/json; charset=UTF-8' }
            }).success(function(data) {
                jsonEnvio = data;
            }).error($rootScope.dialog.httpRequest.error);

            console.log($rootScope.recepcionMPComprada);

            $scope.proveedor = $rootScope.recepcionMPComprada.infoMigo.proveedor;
            $scope.embarcacion = $rootScope.recepcionMPComprada.infoMigo.embarcacion;
            $scope.procedencia = $rootScope.recepcionMPComprada.infoMigo.procedencia;
            $scope.lote = $rootScope.recepcionMPComprada.infoMigo.lote;
            $scope.matSel = $rootScope.recepcionMPComprada.infoMP.material.material;
            $scope.kilosSel = $rootScope.recepcionMPComprada.infoMP.kilos;
            $scope.fechaRecepcion = $rootScope.recepcionMPComprada.infoMP.fechaRecepcion;
            $scope.fechaEntrega = $rootScope.recepcionMPComprada.infoMP.fechaEntrega;

            $scope.materiales = $rootScope.recepcionMPComprada.infoMigo.materiales;


            $scope.redirectToResumen = function() {
                //$location.path('/resumen');
            }

            $scope.enviar = function() {

                jsonEnvio.OBJETOENTRADA[0].PARAMETROS.FECHA = $rootScope.getFechaBapi($scope.fechaRecepcion);
                jsonEnvio.OBJETOENTRADA[0].PARAMETROS.MATERIALES.push({ COD: $rootScope.recepcionMPComprada.infoMP.material.id, CANTIDAD: $scope.kilosSel });
                jsonEnvio.OBJETOENTRADA[0].PARAMETROS.PRODUCTOR = $rootScope.recepcionMPComprada.infoMP.proveedor.id;

                jsonEnvio.OBJETOENTRADA[1].PARAMETROS.MATERIALES.push({ COD: $rootScope.recepcionMPComprada.infoMP.material.id, CANTIDAD: $scope.kilosSel, LOTE: $scope.lote });
                jsonEnvio.OBJETOENTRADA[1].PARAMETROS.FECHA = $rootScope.getFechaBapi($scope.fechaRecepcion);

                jsonEnvio.OBJETOENTRADA[2].PARAMETROS.LOTES.push({ LOTE: $scope.lote });
                jsonEnvio.OBJETOENTRADA[2].PARAMETROS.CARACTERISTICAS.push({ LOTE: $scope.lote, CARACTERISTICA: 'ZPROCEDENMP', VALOR: 'COMP_ARTESANAL' });

                jsonEnvio.OBJETOENTRADA[2].PARAMETROS.CARACTERISTICAS.push({ LOTE: $scope.lote, CARACTERISTICA: 'ZEMBARCACION', VALOR: $rootScope.recepcionMPComprada.infoMigo.embarcacion });
                jsonEnvio.OBJETOENTRADA[2].PARAMETROS.CARACTERISTICAS.push({ LOTE: $scope.lote, CARACTERISTICA: 'ZESPECIE', VALOR: $rootScope.recepcionMPComprada.infoMP.material.especie });

                angular.forEach($rootScope.recepcionMPComprada.infoMigo.materiales, function(val, key) {
                    console.log(val);
                    jsonEnvio.OBJETOENTRADA[2].PARAMETROS.CARACTERISTICAS.push({ LOTE: $scope.lote, CARACTERISTICA: val.material.id, VALOR: val.porcentaje });
                })

                $http.get(IPSERVICIOSAPX + "JSON_RECEPCION_EX.aspx?PARAMETRO=" + JSON.stringify(jsonEnvio)).success(function(data) {

                    var errorPedido = [];
                    var conErr = 0;
                    try {
                        var result1 = JSON.parse(data.MENSAJES[0].MENSAJES);
                        var EXPPURCHASEORDER = result1.EXPPURCHASEORDER;
                        console.log(EXPPURCHASEORDER);
                        $scope.respOC = EXPPURCHASEORDER;
                        if (data.MENSAJES[0].RESULTADO == false) {
                            angular.forEach(result1.RETURN, function(val, key) {
                                if (val.TYPE == "E") {
                                    $scope.errores.push({ titulo: "ERROR PEDIDO", descripcion: val.MESSAGE });
                                    errorPedido.push([{ type: "label", value: "ERROR PEDIDO" }, { type: "label", value: val.MESSAGE }]);
                                    conErr++;
                                }
                            })
                        }
                    } catch (e) {
                        conErr++;
                    }

                    try {

                        var result = JSON.parse(data.MENSAJES[1].MENSAJES);
                        var MATERIALDOCUMENT = result.MATERIALDOCUMENT;
                        console.log(MATERIALDOCUMENT);
                        $scope.respCP = MATERIALDOCUMENT;

                        if (data.MENSAJES[1].RESULTADO == false) {
                            angular.forEach(result.RETURN, function(val, key) {
                                if (val.TYPE == "E") {
                                    $scope.errores.push({ titulo: "ERROR PEDIDO", descripcion: val.MESSAGE });
                                    errorPedido.push([{ type: "label", value: "ERROR RECEPCIÓN CONTRA PEDIDO" }, { type: "label", value: val.MESSAGE }]);
                                    conErr++;
                                }
                            })
                        }

                    } catch (e) {
                        conErr++;
                    }

                    $rootScope.loading.off();
                    $scope.opopup = {
                        show: true,
                        titulo: "SAP",
                        iconPrint: "fa fa-print icon-print",
                        arrResumen: {
                            row: []
                        },
                        print: function() {
                            window.print();
                        }
                    }

                    if (conErr == 0) {
                        $scope.dataRecG = {
                            guia: "",
                            patente: "",
                            patenteCarro: "",
                            productor: ""
                        }
                    }

                    $scope.modalVisible = true;
                    var obj = document.getElementById("popup");
                    obj.style.display = "block";

                })



            }

            $scope.redirctToMenu = function() {

                $location.path('/mainMenu');

            }

        }
    ]

);