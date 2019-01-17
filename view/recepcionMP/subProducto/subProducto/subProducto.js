/* Setup blank page controller */
angular.module('MetronicApp').controller('subproducto', ['$rootScope', '$scope', 'settings', '$http', '$sce', '$location', '$timeout',
    function($rootScope, $scope, settings, $http, $sce, $location, $timeout) {

        var lote = "";
        var centro = 0;
        var datosOC = {};
        $scope.oc = 0;
        $scope.nGuia;
        $rootScope.msg = [];
        $rootScope.loader = true;
        var pozos = [];
        var almacenesd = [];
        var subPropio = [{ value: '000000000005000191', text: 'SUB-PRODUCTO JUREL PROPIO' }];

        var matsubs = [
            { value: '000000000002000068', text: 'SUBPRODUCTO COMPRADO' },
            { value: '000000000002000076', text: 'SUBPRODUCTO JUREL COMPRADO' }
        ];
        angular.forEach($rootScope.pozos, function(v, k) {

            if (v.planta == 1060)
                pozos.push(v);
            else if (v.planta == 1050)
                almacenesd.push(v);

        })



        $scope.formulario = [

            { ngModel: '', key: 'comprada', label: 'Comprada', type: 'checkbox', validado: true, id: 'comprada', json: 'tipoMP', ngChange: 'TipoRecepcion()', show: true },
            { ngModel: '', key: 'descarte', label: 'DESCARTE', type: 'checkbox', validado: true, id: 'producto', json: 'tipoProd', ngChange: 'TipoProducto(item)', show: true },
            { ngModel: '', key: 'nGuia', label: 'N° Guía', type: 'text', validado: true, immybox: false, cabecera: true, disabled: false, json: 'nGuia', tabla: false, show: true },
            { ngModel: '', id: 'proveedores', key: 'proveedor', label: 'Proveedor', type: 'text', validado: true, immybox: true, cabecera: true, json: 'proveedor', tabla: false, show: true },
            { ngModel: '', key: 'oc', label: 'Orden de Compra', type: 'text', validado: true, immybox: false, cabecera: true, disabled: false, ngChange: 'getDataOC()', json: 'oc', tabla: false, show: false, mensaje: '' },
            { ngModel: '', id: 'material', key: 'material', label: 'Material', type: 'text', validado: true, immybox: true, name: 'material', cabecera: true, tabla: true, json: 'material', show: true, style: 'width:100%;' },
            { ngModel: '', id: 'almacenes', key: 'planta', label: 'Planta Origen', type: 'text', validado: true, immybox: true, name: 'planta', cabecera: true, tabla: true, json: 'almacenD', show: true },
            { ngModel: 0, id: 'kilos', key: 'kilos', label: 'Kilos', type: 'number', validado: true, immybox: false, name: 'kilos', cabecera: true, tabla: true, json: 'kilos' },
            { ngModel: new Date(), id: 'fecha', key: 'fecha', label: 'Fecha', type: 'date', validado: true, immybox: false, name: 'Fecha', cabecera: true, tabla: true, json: 'fecha' },
            { ngModel: $rootScope.getTimeFormat(), id: 'hora', key: 'hora', label: 'Hora', type: 'time', validado: true, immybox: false, name: 'hora', cabecera: true, tabla: true },
            { ngModel: '', id: 'plantas', key: 'planta', label: 'Planta Origen', type: 'text', validado: true, immybox: true, cabecera: true, json: 'planta', tabla: false, show: true },
            { ngModel: '', disabled: false, id: 'almacenO', key: 'almacenO', label: 'Almacen Origen', type: 'text', validado: true, immybox: true, name: 'almacenO', cabecera: true, tabla: false, json: 'almacenO', show: true },
            { ngModel: '', id: 'lote', key: 'lote', label: 'Lote', type: 'text', validado: true, immybox: false, name: 'lote', cabecera: true, tabla: false, json: 'lote', show: true },

        ];

        $timeout(function() {

            console.log(matsubs);


            $('#material').immybox({
                choices: subPropio
            })

            $('#almacenes').immybox({
                choices: almacenesd
            })

            $('#almacenO').immybox({
                choices: pozos
            })

            $('#plantas').immybox({
                choices: $rootScope.plantas
            })

            $('#proveedores').immybox({
                choices: $rootScope.proveedores
            });

            $('#proveedores').immybox('setValue', 01);
            $('#almacenO').immybox('setValue', 03);
            $rootScope.loader = false;

        }, 2000)


        $scope.getDataOC = function() {

            var oc = 0;
            angular.forEach($scope.formulario, function(val, key) {

                if (val.key == "oc")
                    oc = val.ngModel;

            })
            $http.get(IPSERVICIOSAPX + "JSON_BAPI_PO_GETDETAIL.ASPX?PEDIDO=" + oc).then(function(response) {

                datosOC = response.data;
                console.log(response.data);

                if (response.data.RETURN.length > 0) {

                    angular.forEach(response.data.RETURN, function(v, k) {

                        $scope.formulario[4].mensaje = v.MESSAGE;

                    })

                } else {

                    $scope.formulario[4].mensaje = '';

                    $('#material').immybox('setValue', response.data.PO_ITEMS[0].MATERIAL);
                    centro = response.data.PO_ITEMS[0].PLANT;
                    //$('#proveedores').immybox('setValue', response.data.PO_HEADER.VENDOR);
                    $scope.formulario[3].ngModel = response.data.PO_HEADER.VENDOR_NAME;
                    lote = response.data.PO_ITEM_SCHEDULES[0].BATCH;
                    /*angular.forEach($scope.formulario, function(val, key) {

                        if (val.key == "kilos")
                            val.ngModel = 0;

                    })*/
                }

            })

        }

        $scope.TipoRecepcion = function() {

            if ($scope.formulario[0].ngModel) {

                $scope.formulario[4].show = true;
                $scope.formulario[3].disabled = true;
                $scope.formulario[5].disabled = true;
                $scope.formulario[10].show = false;
                $scope.formulario[11].show = false;
                $scope.formulario[12].show = false;
                $('#proveedores').immybox('setValue', '');
                $('#almacenO').immybox('setValue', 03);
                $('#material').immybox('destroy');
                $('#material').immybox({
                    choices: matsubs
                })




            } else {

                $scope.formulario[4].show = false;
                $scope.formulario[3].disabled = false;
                $scope.formulario[5].disabled = false;
                $scope.formulario[10].show = true;
                $scope.formulario[11].show = true;
                $scope.formulario[12].show = true;
                $('#proveedores').immybox('setValue', 01);
                $('#material').immybox('destroy');
                $('#material').immybox({
                    choices: subPropio
                })


            }

        }

        $scope.TipoProducto = function(item) {

            console.log(item);
            if (item.ngModel) {


                var prodsDescarte = [{ value: '000000000002000036', text: 'JUREL PROPIO' }]
                $('#material').immybox('destroy');
                $('#material').immybox({
                    choices: prodsDescarte
                })

                $('#almacenO').immybox('setValue', '01');
                $scope.formulario[0].show = false;
                $scope.formulario[11].disabled = true;

            } else {

                $scope.formulario[0].show = true;
                $scope.formulario[0].ngModel = false;
                $('#material').immybox('destroy');
                $('#material').immybox({
                    choices: subPropio
                })

                $scope.formulario[11].disabled = false;
                $('#almacenO').immybox('setValue', '');


            }


        }

        $scope.cerrarModal = function() {

            $scope.showModal = false;
            $location.path('/recepcion');

        }

        $scope.recepcionar = function() {

            var json = {};
            var validado = false;
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

                        } else {

                            mensaje = v.label;
                            //v.error.show = true;
                            validado = true;

                        }

                    }



                }

            })


            if (json.tipoMP) {

                /*Subproducto comprado */
                $http.get("json/JSON_ENVIO_MP_COMPRADA.json", {
                    headers: { 'Content-Type': 'application/json; charset=UTF-8' }
                }).then(function(resp) {
                    var jsonEnvio = resp.data;

                    jsonEnvio.OBJETOENTRADA[0].PARAMETROS.FECHA = $rootScope.getFechaBapi();
                    jsonEnvio.OBJETOENTRADA[0].PARAMETROS.MATERIALES.push({ COD: json.material, CANTIDAD: json.kilos });
                    jsonEnvio.OBJETOENTRADA[0].PARAMETROS.PEDIDO = json.oc;
                    jsonEnvio.OBJETOENTRADA[0].PARAMETROS.CENTRO = centro;
                    jsonEnvio.OBJETOENTRADA[0].PARAMETROS.ALMACEN = $('#almacenes').immybox('getValue')[0];
                    jsonEnvio.OBJETOENTRADA[0].PARAMETROS.GUIA = json.nGuia;

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
                            var res = JSON.parse(data.data.MENSAJES[0].MENSAJES);
                            console.log(res);


                            //$scope.responses.push({ nDoc: data.data.DOCUMENTO, nGuia: json.nGuia, estado: "OK" });
                            $scope.nDoc = res.DOCUMENTO;
                            $scope.nGuia = json.nGuia;
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

                    console.log(json);

                    jsonNot.PARAMETROS.ALMACEN = json.almacenO;
                    jsonNot.PARAMETROS.ALMACENDESTINO = json.almacenD;
                    jsonNot.PARAMETROS.FECHA = $rootScope.getFechaBapi();
                    jsonNot.PARAMETROS.CENTRO = json.planta;
                    jsonNot.PARAMETROS.CENTRO_DESTINO = "1050";
                    jsonNot.PARAMETROS.MATERIALES.push({ COD: $rootScope.pad(json.material, 18, 0), CANTIDAD: json.kilos, LOTE: json.lote, ALMACENDESTINO: json.almacenD });
                    jsonNot.GUIA = json.nGuia;

                    // return;
                    $http.get(IPSERVICIOSAPX + "JSON_BAPI_301.aspx?PARAMETROS=" + JSON.stringify(jsonNot)).then(function(res) {

                        $rootScope.msg = [];
                        var errorPedido = [];
                        var conErr = 0;

                        console.log(res.data);

                        angular.forEach(res.data.RETURN, function(v, k) {

                            if (v.TYPE == "E") {
                                $rootScope.msg.push({ tipo: "ERROR PEDIDO", descripcion: v.MESSAGE });
                                errorPedido.push([{ type: "label", value: "ERROR RECEPCIÓN CONTRA PEDIDO" }, { type: "label", value: v.MESSAGE }]);
                                conErr++;
                            }

                        })

                        if ($rootScope.msg.length == 0) {

                            $scope.nDoc = res.data.DOCUMENTO;
                            $scope.nGuia = json.nGuia;
                            $rootScope.loader = false;
                            $scope.showModal = true;

                        } else {

                            $rootScope.loader = false;
                            $rootScope.tipoMsg = 'Error';
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
]);