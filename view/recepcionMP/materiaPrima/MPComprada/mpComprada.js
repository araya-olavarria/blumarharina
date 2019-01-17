/* Setup blank page controller */
angular.module('MetronicApp').controller('mpComprada', ['$rootScope', '$scope', 'settings', '$http', '$sce', '$location',
        function($rootScope, $scope, settings, $http, $sce, $location) {

            var fecha = new Date();
            $scope.showM = "modal fade";
            $scope.fechaRecep = fecha;
            $scope.horaRecep = fecha.getHours() + ":" + (fecha.getMinutes() < 10 ? '0' : '') + fecha.getMinutes();
            $scope.loader = true;

            //$scope.date = fecha.getFullYear() + "-" + fecha.getMonth() + "-" + fecha.getDate() + "T" + ;
            $scope.materialesJson = [];
            $scope.proveedores = [];




            $http.get(IPSERVICIOSAPX + "JSON_ZMOV_10012.aspx?MTART=ZMP&WERKS=1020").then(function(response) {
                var options = "<option value=''>Seleccione</option>";
                angular.forEach(response.data.LT_DETALLE, function(val, key) {

                    if (val.WRKST != "")
                        options += "<option value='" + val.MATNR + "' extwg='" + val.EXTWG + "'>" + val.MAKTX + "</option>";
                    // $scope.materialesJson.push({ id: val.MATNR, material: val.MAKTX, especie: val.EXTWG });

                });
                $('#materiales').html(options);

                $http.get(IPSERVICIOSBD + "descarga/getByOC?oc=" + $rootScope.recepcionSeleccionada.oc).success(function(resp) {

                    $rootScope.recepcionSeleccionada.ocInfo = resp;

                    if ($rootScope.recepcionSeleccionada != undefined) {

                        $scope.proveedor = $rootScope.recepcionSeleccionada.proveedor;
                        $scope.kilos = $rootScope.recepcionSeleccionada.kilosEstimados;
                        $('#materiales').val($rootScope.recepcionSeleccionada.ocInfo.material);

                    }

                    $http.get(IPSERVICIOSAPX + "json_ZMOV_10036.aspx").then(function(response) {

                        angular.forEach(response.data.ET_DATPROV, function(val, key) {

                            $scope.proveedores.push({ value: val.LIFNR, text: val.NAME1 });

                        });

                        $('#proveedores').immybox({
                            choices: $scope.proveedores,
                            defaultSelectedValue: $rootScope.recepcionSeleccionada.ocInfo.proveedor
                        });

                        $('#proveedores').immybox('setValue', $rootScope.recepcionSeleccionada.ocInfo.proveedor);
                        $scope.loader = false;

                    });

                })

            });



            $scope.recepcionarGD = function() {


                $scope.loader = true;
                var jsonEnvio = {};
                $scope.modalVisible = false;
                $scope.errores = [];
                $http.get("json/JSON_ENVIO_MP_COMPRADA.json", {
                    headers: { 'Content-Type': 'application/json; charset=UTF-8' }
                }).success(function(data) {

                    jsonEnvio = data;


                    jsonEnvio.OBJETOENTRADA[0].PARAMETROS.FECHA = $rootScope.getFechaBapi();
                    jsonEnvio.OBJETOENTRADA[0].PARAMETROS.MATERIALES.push({ COD: $rootScope.recepcionSeleccionada.ocInfo.material, CANTIDAD: $scope.kilos });
                    jsonEnvio.OBJETOENTRADA[0].PARAMETROS.PEDIDO = $rootScope.recepcionSeleccionada.oc;

                    //jsonEnvio.OBJETOENTRADA[1].PARAMETROS.MATERIALES.push({ COD: $rootScope.recepcionSeleccionada.ocInfo.material, CANTIDAD: $scope.kilos });
                    //jsonEnvio.OBJETOENTRADA[1].PARAMETROS.FECHA = $rootScope.getFechaBapi();

                    jsonEnvio.OBJETOENTRADA[1].PARAMETROS.LOTES.push({ LOTE: "" });
                    jsonEnvio.OBJETOENTRADA[1].PARAMETROS.CARACTERISTICAS.push({ LOTE: "", CARACTERISTICA: 'ZPROCEDENMP', VALOR: 'COMP_ARTESANAL' });

                    jsonEnvio.OBJETOENTRADA[1].PARAMETROS.CARACTERISTICAS.push({ LOTE: "", CARACTERISTICA: 'ZEMBARCACION', VALOR: $rootScope.recepcionSeleccionada.embarcacion });
                    jsonEnvio.OBJETOENTRADA[1].PARAMETROS.CARACTERISTICAS.push({ LOTE: "", CARACTERISTICA: 'ZESPECIE', VALOR: $('#materiales option:selected').attr('extwg') });

                    $http.get(IPSERVICIOSAPX + "JSON_RECEPCION_EX.aspx?PARAMETRO=" + JSON.stringify(jsonEnvio)).success(function(data) {

                        var errorPedido = [];
                        var conErr = 0;
                        try {
                            var result1 = JSON.parse(data.MENSAJES[0].MENSAJES);
                            var EXPPURCHASEORDER = result1.EXPPURCHASEORDER;
                            $scope.respOC = $rootScope.recepcionSeleccionada.oc;
                            $scope.nDoc = result1.DOCUMENTO;
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

                        if (errorPedido.length == 0) {

                            var guia = {

                                id: $rootScope.recepcionSeleccionada.id,
                                nGuia: $rootScope.recepcionSeleccionada.nGuia,
                                rut: $rootScope.recepcionSeleccionada.rut,
                                nombre: $rootScope.recepcionSeleccionada.nombre,
                                planta: $rootScope.recepcionSeleccionada.planta,
                                fechaGuia: $rootScope.recepcionSeleccionada.fechaGuia,
                                fechaRecalada: $rootScope.recepcionSeleccionada.fechaRecalada,
                                embarcacion: $rootScope.recepcionSeleccionada.embarcacion,
                                oc: $rootScope.recepcionSeleccionada.oc,
                                recepcionada: 1,
                                romana: $rootScope.recepcionSeleccionada.romana,
                                venta: 0,
                                kilosEstimados: $rootScope.recepcionSeleccionada.kilosEstimados,
                                kilosReales: $scope.kilos,
                                nTicket: $scope.nDA

                            }

                            $http.get(IPSERVICIOSBD + "guia/recepcionar?guia=" + JSON.stringify(guia)).success(function(response) {

                                console.log(response);


                            })

                        }
                        $scope.showM = 'modal show';
                        $scope.loader = false;

                    })

                }).error($rootScope.dialog.httpRequest.error);


            };

            $scope.cerrarModal = function() {

                $scope.showM = "modal fade";
                $location.path("/listarRecepciones");

            }

        }
    ]

);