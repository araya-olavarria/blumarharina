/* Setup blank page controller */
angular.module('MetronicApp').controller('mpPropia', ['$rootScope', '$scope', 'settings', '$http', '$sce', '$location', '$timeout',
        function($rootScope, $scope, settings, $http, $sce, $location, $timeout) {

            $rootScope.loader = true;


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

                { ngModel: $rootScope.recepcionSeleccionada.nGuia, key: 'nGuia', label: 'N° Guía', type: 'text', validado: true, placeholder: '', immybox: false, name: 'nGuia', cabecera: true, disabled: true, class: 'input_small' },
                { ngModel: '', key: 'proveedor', label: 'Proveedor', type: 'text', validado: true, placeholder: '', immybox: true, name: 'proveedor', id: 'proveedores', cabecera: true, disabled: true, class: 'input_medium ' },
                { ngModel: '', key: 'material', label: 'Material', type: 'text', validado: true, placeholder: '', immybox: true, name: 'material', id: 'materiales', cabecera: false, disabled: true },
                { ngModel: $rootScope.recepcionSeleccionada.kilosEstimados, key: 'kilos', label: 'Kilos', type: 'text', validado: true, placeholder: '', immybox: false, name: 'kilos', id: 'kilos', cabecera: false, disabled: true }

            ]


            if ($rootScope.recepcionSeleccionada.detalleGuia.length > 0) {

                $scope.recepciones = [];
                angular.forEach($rootScope.recepcionSeleccionada.detalleGuia, function(val, key) {

                    $scope.recepciones.push({ material: val.material, pozo: val.pozo, kilos: val.kilos, fecha: new Date(val.fecha.split(' ')[0]), hora: new Date(val.fecha), nGuia: $rootScope.recepcionSeleccionada.nGuia, disabled: true });

                })

            } else {

                $scope.recepciones = [{
                    material: $rootScope.recepcionSeleccionada.ocInfo.material,
                    pozo: '',
                    kilos: '',
                    fecha: new Date(),
                    hora: $rootScope.getTimeFormat(),
                    nGuia: $rootScope.recepcionSeleccionada.nGuia,
                    disabled: false
                }];

            }

            $timeout(function() {

                $('#proveedores').immybox({
                    choices: $rootScope.proveedores
                });

                $('#materiales').immybox({
                    choices: $rootScope.materialesMP
                })

                $('.pozos').immybox({
                    choices: $scope.pozos
                })

                $('#materiales').immybox('setValue', $rootScope.recepcionSeleccionada.ocInfo.material);
                $('#proveedores').immybox('setValue', $rootScope.recepcionSeleccionada.ocInfo.proveedor);

                if ($scope.recepciones.length > 0 && $scope.recepciones[0].pozo != "") {

                    angular.forEach($scope.recepciones, function(val, key) {

                        $('#pozo' + key).immybox('setValue', val.pozo);

                    })

                }
                $rootScope.loader = false;

            }, 2000)

            $scope.addRecepcion = function() {

                $scope.recepciones.push({

                    material: $rootScope.recepcionSeleccionada.ocInfo.material,
                    pozo: '',
                    kilos: '',
                    fecha: new Date(),
                    hora: $rootScope.getTimeFormat(),
                    nGuia: $rootScope.recepcionSeleccionada.nGuia,
                    disabled: false

                });

                $timeout(function() {

                    $('.pozos').immybox({
                        choices: $scope.pozos
                    });

                }, 1000);

            };

            $scope.removeRecepcion = function(index) {

                if ($scope.recepciones.length > 1) {

                    $scope.recepciones.splice(index, 1);

                    angular.forEach($scope.recepciones, function(val, key) {

                        console.log(val.pozo);

                        $('#pozo' + key).immybox('setValue', val.pozo);

                    })

                } else {
                    alert("No puede eliminar la ultima linea");
                }

            }

            $scope.recepcionar = function() {


                $scope.responses = [];
                $rootScope.loader = true;
                var totalDistribucion = 0;
                var valida = false;
                angular.forEach($scope.recepciones, function(val, key) {

                    if (!$("#pozo" + key).immybox('getValue')[0]) {

                        valida = true;
                    }
                    totalDistribucion += val.kilos;

                })

                if (totalDistribucion < $rootScope.recepcionSeleccionada.kilosEstimados) {

                    $rootScope.tipoMsg = 'Precaución';
                    $rootScope.msg = [{ tipo: "Valor es menor", descripcion: "El total distribuido es menor al total de la recepción corrija esto antes de continuar" }]
                    $rootScope.showM = true;
                    $rootScope.loader = false;
                    return false;


                } else if (valida) {

                    $rootScope.tipoMsg = 'Precaución';
                    $rootScope.msg = [{ tipo: "CAMPO VACIO", descripcion: "Por favor complete todos los datos" }]
                    $rootScope.showM = true;
                    $rootScope.loader = false;
                    return false;

                } else if (totalDistribucion > $rootScope.recepcionSeleccionada.kilosEstimados) {

                    $rootScope.tipoMsg = 'Precaución';
                    $rootScope.msg = [{ tipo: "Valor es mayor", descripcion: "El total distribuido es mayor al total de la recepción corrija esto antes de continuar" }]
                    $rootScope.showM = true;
                    $rootScope.loader = false;
                    return false;

                } else {


                    if ($rootScope.recepcionSeleccionada.ocInfo.tipoDescarga == 1) {

                        $http.get("json/JSON_ENVIO_MP_COMPRADA.json", {
                            headers: { 'Content-Type': 'application/json; charset=UTF-8' }
                        }).then(function(resp) {

                            var jsonEnvio = resp.data;

                            jsonEnvio.OBJETOENTRADA[0].PARAMETROS.FECHA = $rootScope.getFechaBapi();
                            jsonEnvio.OBJETOENTRADA[0].PARAMETROS.MATERIALES.push({ COD: $rootScope.recepcionSeleccionada.ocInfo.material, CANTIDAD: $rootScope.recepcionSeleccionada.kilosEstimados });
                            jsonEnvio.OBJETOENTRADA[0].PARAMETROS.PEDIDO = $rootScope.recepcionSeleccionada.oc;
                            jsonEnvio.OBJETOENTRADA[0].PARAMETROS.CENTRO = $rootScope.recepcionSeleccionada.planta;
                            jsonEnvio.OBJETOENTRADA[0].PARAMETROS.GUIA = $rootScope.recepcionSeleccionada.nGuia;

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
                                    console.log(result);

                                    var MATERIALDOCUMENT = result.MATERIALDOCUMENT;
                                    $scope.respCP = $rootScope.recepcionSeleccionada.oc;

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
                                        $scope.guardar();

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
                            jsonNot.OBJETOENTRADA[0].PARAMETROS.DATAGEN.STORAGELOC = $rootScope.recepcionSeleccionada.ocInfo.almacenEmbarcacion;

                            goodsmovements2.MATERIAL = [];
                            goodsmovements.MATERIAL = "6000138";
                            goodsmovements.PLANT = "1050";
                            goodsmovements.STGE_LOC = $rootScope.recepcionSeleccionada.ocInfo.almacenEmbarcacion;
                            goodsmovements.BATCH = "LOTE_UNICO";
                            goodsmovements.MOVE_TYPE = "";
                            goodsmovements.ENTRY_QNT = "0 ";
                            goodsmovements.ENTRY_UOM = "KG";
                            jsonNot.OBJETOENTRADA[0].PARAMETROS.GOODSMOVEMENTS.push(goodsmovements);

                            angular.forEach($scope.recepciones, function(val, key) {


                                jsonNot.OBJETOENTRADA[1].PARAMETROS.CENTRO = "1500";
                                jsonNot.OBJETOENTRADA[1].PARAMETROS.CENTRO_DESTINO = $rootScope.recepcionSeleccionada.planta;
                                jsonNot.OBJETOENTRADA[1].PARAMETROS.FECHA = $rootScope.getFechaBapi();
                                jsonNot.OBJETOENTRADA[1].PARAMETROS.GUIA = $rootScope.recepcionSeleccionada.nGuia;
                                jsonNot.OBJETOENTRADA[1].PARAMETROS.ALMACEN = $rootScope.recepcionSeleccionada.ocInfo.almacenEmbarcacion;

                                jsonNot.OBJETOENTRADA[1].PARAMETROS.MATERIALES.push({
                                    CANTIDAD: val.kilos,
                                    COD: $rootScope.recepcionSeleccionada.ocInfo.material,
                                    LOTE: $rootScope.recepcionSeleccionada.ocInfo.lote,
                                    ALMACENDESTINO: $("#pozo" + key).immybox('getValue')[0] + " "
                                })


                                //jsonNot.OBJETOENTRADA[1].PARAMETROS.GOODSMOVEMENTS.push(goodsmovements2);
                            })


                            console.log(JSON.stringify(jsonNot));

                            // return;
                            $http.get(IPSERVICIOSAPX + "JSON_BAPI_REPMANCONF1_CREATE_MTS.aspx?PARAMETROS=" + JSON.stringify(jsonNot)).then(function(response) {

                                console.log(response.data);

                                var respuesta = JSON.parse(response.data.MENSAJES[1].MENSAJES);
                                console.log(respuesta);

                                if (respuesta.DOCUMENTO > 0) {
                                    $scope.respCP = respuesta.DOCUMENTO;


                                    var guia = {};
                                    guia.id = $rootScope.recepcionSeleccionada.id;
                                    guia.kilosReales = $rootScope.recepcionSeleccionada.kilosReales;

                                    $http.get(IPSERVICIOSBD + "guia/recepcionar?guia=" + JSON.stringify(guia)).then(function(respo) {

                                        $rootScope.loader = false;
                                        $scope.showModal = true;
                                        $scope.guardar();

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

            $scope.guardar = function() {

                var totalDistribucion = 0;
                var jsonEnvio = [];
                angular.forEach($scope.recepciones, function(val, key) {

                    var json = {};
                    json.material = val.material;
                    json.fecha = $rootScope.formatFechaDB(val.fecha, val.hora);
                    json.kilos = val.kilos;
                    json.nGuia = val.nGuia;
                    json.pozo = $('#pozo' + key).immybox('getValue')[0];
                    jsonEnvio.push(json);

                    totalDistribucion += val.kilos;

                })

                if (totalDistribucion > $rootScope.recepcionSeleccionada.kilosEstimados) {

                    $rootScope.tipoMsg = 'Precaución';
                    $rootScope.msg = [{ tipo: "Valor excedido", descripcion: "El total distribuido es mayor al total de la recepción corrija esto antes de continuar" }]
                    $rootScope.showM = true;
                    return false;

                } else {

                    $http.get(IPSERVICIOSBD + "guia/insertDetalle?det=" + JSON.stringify(jsonEnvio) + "&nGuia=" + $rootScope.recepcionSeleccionada.id).then(function(resp) {

                        angular.forEach($scope.recepciones, function(val, key) {

                            val.disabled = true;

                        })

                        $rootScope.tipoMsg = 'Recepción guardada';
                        $rootScope.msg = [{ tipo: "Recepción guardada", descripcion: "Se ha guardado la recepciónde N° Guía " + $rootScope.recepcionSeleccionada.nGuia }]
                        $rootScope.showM = true;
                        return true;

                    })

                }

            }

            $scope.cerrarModal = function() {

                $scope.showModal = false;
                $location.path("/listarRecepciones");

            }


        }
    ]

);