/* Setup blank page controller */
angular.module('MetronicApp').controller('mpComprada', ['$rootScope', '$scope', 'settings', '$http', '$sce', '$location', '$timeout',
        function($rootScope, $scope, settings, $http, $sce, $location, $timeout) {

            $rootScope.loader = true;
            $scope.showModal = false;
            $scope.pozos = [];


            console.log($rootScope.recepcionSeleccionada);


            $http.get(IPSERVICIOSAPX + "JSON_ZMOV_10008.aspx?SOCIEDAD=1000").then(function(data) {

                var aux = [];
                angular.forEach(data.data.LT_DETALLE, function(val, key) {
                    //console.log(val.NAME_WERKS)
                    if (val.WERKS == $rootScope.recepcionSeleccionada.planta)
                        $scope.pozos.push({ value: val.LGORT, text: val.LGORT });


                });
            })

            $scope.formulario = [

                { ngModel: $rootScope.recepcionSeleccionada.nGuia, key: 'nGuia', label: 'N° Guía', type: 'text', validado: true, placeholder: '', immybox: false, name: 'nGuia', cabecera: true, disabled: true },
                { ngModel: new Date(), key: 'fechaRecepcion', label: 'Fecha Recepción', type: 'date', validado: true, placeholder: '', immybox: false, name: 'fechaRecepcion', cabecera: true },
                { ngModel: $rootScope.getTimeFormat(), key: 'horaRecepcion', label: 'Hora Recepción', type: 'time', validado: true, placeholder: '', immybox: false, name: 'horaRecepcion', cabecera: true },
                { ngModel: '', key: 'proveedor', label: 'Proveedor', type: 'text', validado: true, placeholder: '', immybox: true, name: 'proveedor', id: 'proveedores', cabecera: false, disabled: true },
                { ngModel: '', key: 'material', label: 'Material', type: 'text', validado: true, placeholder: '', immybox: true, name: 'material', id: 'materiales', cabecera: false, disabled: true },
                { ngModel: $rootScope.recepcionSeleccionada.kilosEstimados, key: 'kilos', label: 'Kilos', type: 'text', validado: true, placeholder: '', immybox: false, name: 'kilos', id: 'kilos', cabecera: false, disabled: true },
                { ngModel: '', key: 'pozo', label: 'Pozo', type: 'text', validado: true, placeholder: '', immybox: true, name: 'false', id: 'pozos', cabecera: false, disabled: false, json: 'pozo' },
                { ngModel: '', key: 'nTicket', label: 'N° Ticket', type: 'text', validado: true, placeholder: '', immybox: false, name: 'nTicket', id: 'nTicket', cabecera: false, disabled: false, json: 'nTicket' }

            ]

            $timeout(function() {

                $('#proveedores').immybox({
                    choices: $rootScope.proveedores
                });

                $('#materiales').immybox({
                    choices: $rootScope.materialesMP
                })



                $('#pozos').immybox({
                    choices: $scope.pozos
                })

                console.log($scope.pozos);



                $('#materiales').immybox('setValue', $rootScope.recepcionSeleccionada.ocInfo.material);
                $('#proveedores').immybox('setValue', $rootScope.recepcionSeleccionada.ocInfo.proveedor);
                $rootScope.loader = false;

            }, 2000)


            $scope.recepcionar = function() {



                $scope.responses = [];
                $rootScope.loader = true;
                var valida = false;

                var json = {};

                angular.forEach($scope.formulario, function(v, k) {

                    if (v.json) {

                        if (v.immybox) {

                            console.log($('#' + v.id).immybox('getValue')[0]);

                            if ($('#' + v.id).immybox('getValue')[0]) {

                                json[v.json] = $('#' + v.id).immybox('getValue')[0];

                            } else {

                                $rootScope.loader = false;
                                $rootScope.tipoMsg = 'AVISO';
                                $rootScope.msg = [{ tipo: "CAMPO VACIO", descripcion: v.label }]
                                $rootScope.showM = true;
                                valida = true;

                            }

                        } else {

                            if (v.ngModel != '') {

                                json[v.json] = v.ngModel;

                            } else {

                                $rootScope.loader = false;
                                $rootScope.tipoMsg = 'AVISO';
                                $rootScope.msg = [{ tipo: "CAMPO VACIO", descripcion: v.label }]
                                $rootScope.showM = true;
                                valida = true;

                            }

                        }

                    }

                })

                //return;
                if (!valida) {
                    if ($rootScope.recepcionSeleccionada.ocInfo.tipoDescarga == 1) {

                        $http.get("json/JSON_ENVIO_MP_COMPRADA.json", {
                            headers: { 'Content-Type': 'application/json; charset=UTF-8' }
                        }).then(function(resp) {

                            var jsonEnvio = resp.data;

                            jsonEnvio.OBJETOENTRADA[0].PARAMETROS.FECHA = $rootScope.getFechaBapi();
                            jsonEnvio.OBJETOENTRADA[0].PARAMETROS.MATERIALES.push({ COD: $rootScope.recepcionSeleccionada.ocInfo.material, CANTIDAD: $rootScope.recepcionSeleccionada.kilosEstimados });
                            jsonEnvio.OBJETOENTRADA[0].PARAMETROS.PEDIDO = $rootScope.recepcionSeleccionada.oc;
                            jsonEnvio.OBJETOENTRADA[0].PARAMETROS.CENTRO = $rootScope.recepcionSeleccionada.planta;
                            jsonEnvio.OBJETOENTRADA[0].PARAMETROS.ALMACEN = $('#pozos').immybox('getValue')[0];
                            jsonEnvio.OBJETOENTRADA[0].PARAMETROS.GUIA = $rootScope.recepcionSeleccionada.nGuia;

                            jsonEnvio.OBJETOENTRADA[1].PARAMETROS.LOTES.push({ LOTE: $rootScope.recepcionSeleccionada.ocInfo.lote });
                            jsonEnvio.OBJETOENTRADA[1].PARAMETROS.CARACTERISTICAS.push({ LOTE: $rootScope.recepcionSeleccionada.ocInfo.lote, CARACTERISTICA: 'ZPROCEDENMP', VALOR: 'COMP_ARTESANAL' });

                            jsonEnvio.OBJETOENTRADA[1].PARAMETROS.CARACTERISTICAS.push({ LOTE: $rootScope.recepcionSeleccionada.ocInfo.lote, CARACTERISTICA: 'ZEMBARCACION', VALOR: $rootScope.recepcionSeleccionada.embarcacion });
                            jsonEnvio.OBJETOENTRADA[1].PARAMETROS.CARACTERISTICAS.push({ LOTE: $rootScope.recepcionSeleccionada.ocInfo.lote, CARACTERISTICA: 'ZESPECIE', VALOR: 'especie' }); // ver como sacar la especie del immybox

                            console.log(IPSERVICIOSAPX + "JSON_RECEPCION_EX.aspx?PARAMETRO=" + JSON.stringify(jsonEnvio));


                            $http.get(IPSERVICIOSAPX + "JSON_RECEPCION_EX.aspx?PARAMETRO=" + JSON.stringify(jsonEnvio)).then(function(data) {

                                $rootScope.msg = [];
                                var errorPedido = [];
                                var conErr = 0;
                                try {
                                    var result1 = JSON.parse(data.data.MENSAJES[0].MENSAJES);
                                    var EXPPURCHASEORDER = result1.EXPPURCHASEORDER;
                                    $scope.respCP = $rootScope.recepcionSeleccionada.oc;
                                    $scope.nDoc = result1.DOCUMENTO;
                                    if (data.data.MENSAJES[0].RESULTADO == false) {
                                        angular.forEach(result1.RETURN, function(val, key) {
                                            if (val.TYPE == "E") {
                                                $rootScope.msg.push({ tipo: "ERROR PEDIDO", descripcion: val.MESSAGE });
                                                errorPedido.push([{ type: "label", value: "ERROR PEDIDO" }, { type: "label", value: val.MESSAGE }]);
                                                conErr++;
                                            }
                                        })
                                    }
                                } catch (e) {
                                    conErr++;
                                }

                                try {

                                    var result = JSON.parse(data.data.MENSAJES[1].MENSAJES);
                                    var MATERIALDOCUMENT = result.MATERIALDOCUMENT;
                                    //$scope.respCP = MATERIALDOCUMENT;

                                    if (data.data.MENSAJES[1].RESULTADO == false) {
                                        angular.forEach(result.RETURN, function(val, key) {
                                            if (val.TYPE == "E") {
                                                $rootScope.msg.push({ tipo: "ERROR PEDIDO", descripcion: val.MESSAGE });
                                                errorPedido.push([{ type: "label", value: "ERROR RECEPCIÓN CONTRA PEDIDO" }, { type: "label", value: val.MESSAGE }]);
                                                conErr++;
                                            }
                                        })
                                    }

                                } catch (e) {
                                    conErr++;
                                }

                                if ($rootScope.msg.length > 0) {

                                    $rootScope.loader = false;
                                    $rootScope.tipoMsg = 'Error';
                                    $rootScope.showM = true;

                                } else {

                                    var guia = {};
                                    guia.id = $rootScope.recepcionSeleccionada.id;
                                    guia.kilosReales = $rootScope.recepcionSeleccionada.kilosReales;

                                    $http.get(IPSERVICIOSBD + "guia/recepcionar?guia=" + JSON.stringify(guia)).success(function(response) {

                                        console.log(response);
                                        $rootScope.loader = false;
                                        $scope.showModal = true;

                                    })

                                }

                            }, function(error) {

                                $rootScope.loader = false;
                                $rootScope.tipoMsg = 'Error';
                                $rootScope.msg = [{ tipo: "Error en servicio JSON_RECEPCION_EX.aspx", descripcion: error.statusText }]
                                $rootScope.showM = true;

                            })

                        }, function(error) {

                            $rootScope.loader = false;
                            $rootScope.tipoMsg = 'Error';
                            $rootScope.msg = [{ tipo: "Error al cargar archivo JSON_ENVIO_MP_COMPRADA ", descripcion: error.statusText }]
                            $rootScope.showM = true;

                        })

                    } else {

                        $http.get("json/JSON_NOTIFICACION_MP_PROPIO.json", {
                            headers: { 'Content-Type': 'application/json; charset=UTF-8' }
                        }).then(function(resp) {

                            var jsonNot = resp.data;
                            var almacen = "";
                            var version = "";
                            angular.forEach($rootScope.dataProcedencia, function(v, k) {

                                if (v[2].trim() == $rootScope.recepcionSeleccionada.embarcacion) {
                                    almacen = v[7];
                                    version = v[8];
                                }

                            })
                            console.log(jsonNot);

                            var goodsmovements = {};
                            var goodsmovements2 = {};

                            jsonNot.OBJETOENTRADA[0].PARAMETROS.DATAGEN.BACKFLQUANT = $rootScope.recepcionSeleccionada.kilosEstimados;
                            jsonNot.OBJETOENTRADA[0].PARAMETROS.DATAGEN.BATCH = $rootScope.recepcionSeleccionada.ocInfo.lote;
                            jsonNot.OBJETOENTRADA[0].PARAMETROS.DATAGEN.DOCDATE = $rootScope.getFechaBapi();
                            jsonNot.OBJETOENTRADA[0].PARAMETROS.DATAGEN.MATERIALNR = $rootScope.recepcionSeleccionada.ocInfo.material;
                            jsonNot.OBJETOENTRADA[0].PARAMETROS.DATAGEN.PLANPLANT = "1500";
                            jsonNot.OBJETOENTRADA[0].PARAMETROS.DATAGEN.POSTDATE = $rootScope.getFechaBapi();
                            jsonNot.OBJETOENTRADA[0].PARAMETROS.DATAGEN.PRODPLANT = "1500";
                            jsonNot.OBJETOENTRADA[0].PARAMETROS.DATAGEN.DOCHEADERTXT = $rootScope.recepcionSeleccionada.nGuia;
                            jsonNot.OBJETOENTRADA[0].PARAMETROS.DATAGEN.STORAGELOC = almacen;
                            jsonNot.OBJETOENTRADA[0].PARAMETROS.DATAGEN.PRODVERSION = version;

                            goodsmovements2.MATERIAL = [];
                            goodsmovements.MATERIAL = "6000138";
                            goodsmovements.PLANT = "1050";
                            goodsmovements.STGE_LOC = almacen;
                            goodsmovements.BATCH = "LOTE_UNICO";
                            goodsmovements.MOVE_TYPE = "";
                            goodsmovements.ENTRY_QNT = "0 ";
                            goodsmovements.ENTRY_UOM = "KG";
                            jsonNot.OBJETOENTRADA[0].PARAMETROS.GOODSMOVEMENTS.push(goodsmovements);

                            // angular.forEach($scope.recepciones, function(val, key) {


                            jsonNot.OBJETOENTRADA[1].PARAMETROS.CENTRO = "1500";
                            jsonNot.OBJETOENTRADA[1].PARAMETROS.CENTRO_DESTINO = "1050";
                            jsonNot.OBJETOENTRADA[1].PARAMETROS.FECHA = $rootScope.getFechaBapi();
                            jsonNot.OBJETOENTRADA[1].PARAMETROS.GUIA = $rootScope.recepcionSeleccionada.nGuia;
                            jsonNot.OBJETOENTRADA[1].PARAMETROS.ALMACEN = almacen;

                            jsonNot.OBJETOENTRADA[1].PARAMETROS.MATERIALES.push({
                                CANTIDAD: $rootScope.recepcionSeleccionada.kilosEstimados,
                                COD: $rootScope.recepcionSeleccionada.ocInfo.material,
                                LOTE: $rootScope.recepcionSeleccionada.ocInfo.lote,
                                ALMACENDESTINO: $("#pozos").immybox('getValue')[0] + " "
                            })


                            //jsonNot.OBJETOENTRADA[1].PARAMETROS.GOODSMOVEMENTS.push(goodsmovements2);
                            //})


                            //console.log(JSON.stringify(jsonNot));

                            // return;
                            $http.get(IPSERVICIOSAPX + "JSON_BAPI_REPMANCONF1_CREATE_MTS.aspx?PARAMETROS=" + JSON.stringify(jsonNot)).then(function(response) {

                                var respuesta = JSON.parse(response.data.MENSAJES[1].MENSAJES);



                                if (respuesta.DOCUMENTO > 0) {

                                    $scope.respCP = respuesta.DOCUMENTO;
                                    var guia = {};
                                    guia.id = $rootScope.recepcionSeleccionada.id;
                                    guia.kilosReales = $rootScope.recepcionSeleccionada.kilosReales;

                                    $http.get(IPSERVICIOSBD + "guia/recepcionar?guia=" + JSON.stringify(guia)).then(function(respo) {

                                        $rootScope.loader = false;
                                        $scope.showModal = true;

                                    })

                                } else {

                                    $rootScope.tipoMsg = 'Error';
                                    $rootScope.msg = [{ tipo: "Recepción cancelada", descripcion: " No se ha llevado a cabo la recepción" }]
                                    $rootScope.showM = true;

                                }

                            }, function(error) {

                                $rootScope.tipoMsg = 'Error';
                                $rootScope.msg = [{ tipo: "Carga de archvio", descripcion: " Archivo JSON_NOTIFICACION_MP.json no encontrado " + error.statusText }]
                                $rootScope.showM = true;

                            })

                        }, function(error) {

                            $rootScope.tipoMsg = 'Error';
                            $rootScope.msg = [{ tipo: "Carga de archvio", descripcion: " Archivo JSON_NOTIFICACION_MP.json no encontrado " + error.statusText }]
                            $rootScope.showM = true;

                        })
                    }

                }
            }

            /*$scope.recepcionar = function() {

                $rootScope.loader = true;
                $http.get("json/JSON_ENVIO_MP_COMPRADA.json", {
                    headers: { 'Content-Type': 'application/json; charset=UTF-8' }
                }).then(function(resp) {

                    var jsonEnvio = resp.data;

                    jsonEnvio.OBJETOENTRADA[0].PARAMETROS.FECHA = $rootScope.getFechaBapi();
                    jsonEnvio.OBJETOENTRADA[0].PARAMETROS.MATERIALES.push({ COD: $rootScope.recepcionSeleccionada.ocInfo.material, CANTIDAD: $rootScope.recepcionSeleccionada.kilosEstimados });
                    jsonEnvio.OBJETOENTRADA[0].PARAMETROS.PEDIDO = $rootScope.recepcionSeleccionada.oc;

                    jsonEnvio.OBJETOENTRADA[1].PARAMETROS.LOTES.push({ LOTE: $rootScope.recepcionSeleccionada.ocInfo.lote });
                    jsonEnvio.OBJETOENTRADA[1].PARAMETROS.CARACTERISTICAS.push({ LOTE: $rootScope.recepcionSeleccionada.ocInfo.lote, CARACTERISTICA: 'ZPROCEDENMP', VALOR: 'COMP_ARTESANAL' });

                    jsonEnvio.OBJETOENTRADA[1].PARAMETROS.CARACTERISTICAS.push({ LOTE: $rootScope.recepcionSeleccionada.ocInfo.lote, CARACTERISTICA: 'ZEMBARCACION', VALOR: $rootScope.recepcionSeleccionada.embarcacion });
                    jsonEnvio.OBJETOENTRADA[1].PARAMETROS.CARACTERISTICAS.push({ LOTE: $rootScope.recepcionSeleccionada.ocInfo.lote, CARACTERISTICA: 'ZESPECIE', VALOR: 'especie' }); // ver como sacar la especie del immybox

                    $http.get(IPSERVICIOSAPX + "JSON_RECEPCION_EX.aspx?PARAMETRO=" + JSON.stringify(jsonEnvio)).then(function(data) {

                        $rootScope.msg = [];
                        var errorPedido = [];
                        var conErr = 0;
                        try {
                            var result1 = JSON.parse(data.data.MENSAJES[0].MENSAJES);
                            var EXPPURCHASEORDER = result1.EXPPURCHASEORDER;
                            $scope.respOC = $rootScope.recepcionSeleccionada.oc;
                            $scope.nDoc = result1.DOCUMENTO;
                            if (data.data.MENSAJES[0].RESULTADO == false) {
                                angular.forEach(result1.RETURN, function(val, key) {
                                    if (val.TYPE == "E") {
                                        $rootScope.msg.push({ tipo: "ERROR PEDIDO", descripcion: val.MESSAGE });
                                        errorPedido.push([{ type: "label", value: "ERROR PEDIDO" }, { type: "label", value: val.MESSAGE }]);
                                        conErr++;
                                    }
                                })
                            }
                        } catch (e) {
                            conErr++;
                        }

                        try {

                            var result = JSON.parse(data.data.MENSAJES[1].MENSAJES);
                            var MATERIALDOCUMENT = result.MATERIALDOCUMENT;
                            $scope.respCP = MATERIALDOCUMENT;

                            if (data.data.MENSAJES[1].RESULTADO == false) {
                                angular.forEach(result.RETURN, function(val, key) {
                                    if (val.TYPE == "E") {
                                        $rootScope.msg.push({ tipo: "ERROR PEDIDO", descripcion: val.MESSAGE });
                                        errorPedido.push([{ type: "label", value: "ERROR RECEPCIÓN CONTRA PEDIDO" }, { type: "label", value: val.MESSAGE }]);
                                        conErr++;
                                    }
                                })
                            }

                        } catch (e) {
                            conErr++;
                        }

                        if ($rootScope.msg.length > 0) {

                            $rootScope.loader = false;
                            $rootScope.tipoMsg = 'Error';
                            $rootScope.showM = true;

                        } else {

                            var guia = {};
                            guia.id = $rootScope.recepcionSeleccionada.id;
                            guia.kilosReales = $rootScope.recepcionSeleccionada.kilosReales;

                            $http.get(IPSERVICIOSBD + "guia/recepcionar?guia=" + JSON.stringify(guia)).success(function(response) {

                                console.log(response);
                                $rootScope.loader = false;
                                $scope.showModal = true;

                            })

                        }

                    }, function(error) {

                        $rootScope.loader = false;
                        $rootScope.tipoMsg = 'Error';
                        $rootScope.msg = [{ tipo: "Error en servicio JSON_RECEPCION_EX.aspx", descripcion: error.statusText }]
                        $rootScope.showM = true;

                    })

                }, function(error) {

                    $rootScope.loader = false;
                    $rootScope.tipoMsg = 'Error';
                    $rootScope.msg = [{ tipo: "Error al cargar archivo JSON_ENVIO_MP_COMPRADA ", descripcion: error.statusText }]
                    $rootScope.showM = true;

                })

            }*/

            $scope.cerrarModal = function() {

                $scope.showModal = false;
                $location.path("/listarRecepciones");

            }


        }
    ]

);