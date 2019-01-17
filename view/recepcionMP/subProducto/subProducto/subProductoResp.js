/* Setup blank page controller */
angular.module('MetronicApp').controller('subproducto', ['$rootScope', '$scope', 'settings', '$http', '$sce', '$location', '$timeout',
    function($rootScope, $scope, settings, $http, $sce, $location, $timeout) {

        var lote = "";
        var centro = 0;
        $scope.oc = 0;
        $scope.nGuia;
        $rootScope.msg = [];
        $rootScope.loader = true;
        $scope.formulario = [

            { ngModel: '', key: 'comprada', label: 'Comprada', type: 'checkbox', validado: true, id: 'comprada', json: 'tipoMP', ngChange: 'TipoRecepcion()' },
            { ngModel: '', key: 'nGuia', label: 'N° Guía', type: 'text', validado: true, immybox: false, cabecera: true, disabled: false, json: 'nGuia', tabla: false, show: true },
            { ngModel: '', id: 'proveedores', key: 'proveedor', label: 'Proveedor', type: 'text', validado: true, immybox: true, cabecera: true, json: 'proveedor', tabla: false, show: true },
            { ngModel: '', key: 'oc', label: 'Orden de Compra', type: 'text', validado: true, immybox: false, cabecera: true, disabled: false, ngChange: 'getDataOC()', json: 'oc', tabla: false, show: false },
            { ngModel: '', id: 'material', key: 'material', label: 'Material', type: 'text', validado: true, immybox: true, name: 'material', cabecera: true, tabla: true, json: 'material', show: true },
            { ngModel: '', id: 'almacenes', key: 'planta', label: 'Planta', type: 'text', validado: true, immybox: true, name: 'planta', cabecera: true, tabla: true, json: 'planta', show: true },
            { ngModel: '', id: 'kilos', key: 'kilos', label: 'Kilos', type: 'number', validado: true, immybox: false, name: 'kilos', cabecera: true, tabla: true, json: 'kilos' },
            { ngModel: new Date(), id: 'fecha', key: 'fecha', label: 'Fecha', type: 'date', validado: true, immybox: false, name: 'Fecha', cabecera: true, tabla: true, json: 'fecha' },
            { ngModel: $rootScope.getTimeFormat(), id: 'hora', key: 'hora', label: 'Hora', type: 'time', validado: true, immybox: false, name: 'hora', cabecera: true, tabla: true },
            { ngModel: '', id: 'plantas', key: 'planta', label: 'Planta', type: 'text', validado: true, immybox: true, cabecera: true, json: 'planta', tabla: false, show: true },

        ];

        $timeout(function() {

            $('#material').immybox({
                choices: $rootScope.materialesSUB
            })

            $('#almacenes').immybox({
                choices: $rootScope.pozos
            })

            $('#plantas').immybox({
                choices: $rootScope.plantas
            })

            $('#proveedores').immybox({
                choices: $rootScope.proveedores
            });

            $('#proveedores').immybox('setValue', 01);
            $rootScope.loader = false;

        }, 2000)


        $scope.getDataOC = function() {

            var oc = 0;
            angular.forEach($scope.formulario, function(val, key) {

                if (val.key == "oc")
                    oc = val.ngModel;

            })
            $http.get(IPSERVICIOSAPX + "JSON_BAPI_PO_GETDETAIL.ASPX?PEDIDO=" + oc).then(function(response) {

                $('#material').immybox('setValue', response.data.PO_ITEMS[0].MATERIAL);
                centro = response.data.PO_ITEMS[0].PLANT;
                //$('#proveedores').immybox('setValue', response.data.PO_HEADER.VENDOR);
                $scope.formulario[2].ngModel = response.data.PO_HEADER.VENDOR_NAME;
                lote = response.data.PO_ITEM_SCHEDULES[0].BATCH;
                angular.forEach($scope.formulario, function(val, key) {

                    if (val.key == "kilos")
                        val.ngModel = response.data.PO_ITEMS[0].QUANTITY;;

                })


            })

        }

        $scope.TipoRecepcion = function() {

            if ($scope.formulario[0].ngModel) {

                $scope.formulario[3].show = true;
                $scope.formulario[2].disabled = true;
                $scope.formulario[4].disabled = true;
                $scope.formulario[9].show = false;
                $('#proveedores').immybox('setValue', '');
                $('#material').immybox({
                    choices: $rootScope.materialesPT
                })


            } else {

                $scope.formulario[3].show = false;
                $scope.formulario[2].disabled = false;
                $scope.formulario[4].disabled = false;
                $scope.formulario[9].show = true;
                $('#proveedores').immybox('setValue', 01);
                $('#material').immybox({
                    choices: $rootScope.materialesSUB
                })


            }

            console.log($scope.formulario);



        }

        $scope.cerrarModal = function() {

            $scope.showModal = false;

        }

        $scope.recepcionar = function() {

            var json = {};
            $rootScope.loader = true;
            $scope.responses = [];
            angular.forEach($scope.formulario, function(v, k) {

                if (v.validado) {

                    if (v.immybox) {

                        if ($('#' + v.id).immybox('getValue').length > 0) {

                            json[v.json] = $('#' + v.id).immybox('getValue')[0]

                        }

                    } else {

                        if (v.ngModel != '') {

                            if (v.type == 'date') {

                                json[v.json] = $rootScope.formatFechaDB(v.ngModel, new Date());

                            } else {

                                json[v.json] = v.ngModel;

                            }

                        }

                    }



                }

            })

            if (json.tipoMP) {

                /*Subproducto comprado */
                $http.get("json/JSON_GOODSMOVEMENT.json", {
                    headers: { 'Content-Type': 'application/json; charset=UTF-8' }
                }).then(function(resp) {

                    var jsonEnvio = resp.data;

                    jsonEnvio.OBJETOENTRADA[0].PARAMETROS.FECHA = $rootScope.getFechaBapi();
                    jsonEnvio.OBJETOENTRADA[0].PARAMETROS.MATERIALES.push({ COD: json.material, CANTIDAD: json.kilos });
                    jsonEnvio.OBJETOENTRADA[0].PARAMETROS.PEDIDO = json.oc;
                    jsonEnvio.OBJETOENTRADA[0].PARAMETROS.CENTRO = centro;
                    jsonEnvio.OBJETOENTRADA[0].PARAMETROS.ALMACEN = $('#almacenes').immybox('getValue')[0];

                    jsonEnvio.OBJETOENTRADA[1].PARAMETROS.LOTES.push({ LOTE: lote });
                    jsonEnvio.OBJETOENTRADA[1].PARAMETROS.CARACTERISTICAS.push({ LOTE: lote, CARACTERISTICA: 'ZPROCEDENMP', VALOR: 'COMP_ARTESANAL' });

                    jsonEnvio.OBJETOENTRADA[1].PARAMETROS.CARACTERISTICAS.push({ LOTE: lote, CARACTERISTICA: 'ZEMBARCACION', VALOR: 'JJ22' });
                    jsonEnvio.OBJETOENTRADA[1].PARAMETROS.CARACTERISTICAS.push({ LOTE: lote, CARACTERISTICA: 'ZESPECIE', VALOR: 'especie' }); // ver como sacar la especie del immybox

                    $http.get(IPSERVICIOSAPX + "JSON_RECEPCION_EX.aspx?PARAMETRO=" + JSON.stringify(jsonEnvio)).then(function(data) {

                        $rootScope.msg = [];
                        var errorPedido = [];
                        var conErr = 0;
                        try {
                            var result1 = JSON.parse(data.data.MENSAJES[0].MENSAJES);
                            var EXPPURCHASEORDER = result1.EXPPURCHASEORDER;
                            if (data.data.MENSAJES[0].RESULTADO == false) {

                                console.log(data.data.MENSAJES[0].RESULTADO);

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

                        console.log($rootScope.msg);

                        if ($rootScope.msg.length == 0) {

                            $rootScope.loader = false;
                            console.log(data.data.MENSAJES[0].MENSAJES);

                            $scope.responses.push({ nDoc: response.data.DOCUMENTO, nGuia: json.nGuia, estado: "OK" });
                            $rootScope.loader = false;
                            $scope.showModal = true;

                        } else {

                            $rootScope.loader = false;
                            $rootScope.tipoMsg = 'Error';
                            $rootScope.showM = true;

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


                $http.get("json/JSON_GOODSMOVEMENT.json", {
                    headers: { 'Content-Type': 'application/json; charset=UTF-8' }
                }).then(function(resp) {

                    var jsonNot = resp.data;

                    console.log(jsonNot);

                    jsonNot.PARAMETROS.ALMACEN = "P01 ";
                    jsonNot.PARAMETROS.ALMACENDESTINO = "P01 "
                    jsonNot.PARAMETROS.CENTRO = "1020";
                    jsonNot.PARAMETROS.CENTRO_DESTINO = "1050";
                    jsonNot.PARAMETROS.MATERIALES.push({ COD: $rootScope.pad(json.material, 18, 0), CANTIDAD: json.kilos, LOTE: '1022590' });

                    // return;
                    $http.get(IPSERVICIOSAPX + "JSON_BAPI_301.aspx?PARAMETROS=" + JSON.stringify(jsonNot)).then(function(response) {

                        console.log(response.data);

                        if (response.data.DOCUMENTO > 0) {

                            $scope.responses.push({ nDoc: response.data.DOCUMENTO, nGuia: json.nGuia, estado: "OK" });

                        }

                        console.log($scope.responses);

                        $rootScope.loader = false;
                        $scope.showModal = true;


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
]);