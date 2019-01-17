/* Setup blank page controller */
angular.module('MetronicApp').controller('guiaDespacho', ['$rootScope', '$scope', 'settings', '$http', '$sce', '$location',
        function($rootScope, $scope, settings, $http, $sce, $location) {

            var paso = false;
            $scope.showM = "modal fade";
            $scope.showAceptar = true;
            $scope.infoDespacho = false;
            $scope.loader = true;
            $scope.tipo = "electronica";
            $scope.conductores = [];

            /*$scope.formulario = [
                {ngModel:'',key:'manual',label:"Manual",type:"radio", validado: true, placeholder:'',},
                {ngModel:'',key:'electronica',label:"Electronica",type:"radio", validado: true, placeholder:'',},
                {ngModel:'',key:'nGuia',label:"N° Guía",type:"text", validado: true, placeholder:'',},
                {ngModel:'',key:'manual',label:"Manual",type:"radio", validado: true, placeholder:'',},
            ];*/

            $scope.fechaGuia = new Date();

            if ($rootScope.ocSeleccionada != undefined) {

                $rootScope.infoDescarga = $rootScope.ocSeleccionada;
                $rootScope.ocSeleccionada = undefined;


            }
            console.log($rootScope.infoDescarga);


            if ($rootScope.infoDescarga.transporte == "camion") {

                $scope.infoDespacho = true;

            }

            $scope.plantas = [];
            $scope.materialesJson = [];

            $http.get(IPSERVICIOSAPX + "JSON_ZMOV_10012.aspx?MTART=ZMP&WERKS=1020").then(function(response) {

                angular.forEach(response.data.LT_DETALLE, function(val, key) {

                    if (val.WRKST != "")
                        $scope.materialesJson.push({ value: val.MATNR, text: val.MAKTX, especie: val.EXTWG });

                })

                $('#material').immybox({
                    choices: $scope.materialesJson,
                    defaultSelectedValue: $rootScope.infoDescarga.material
                });

                $('#material').immybox('setValue', $rootScope.infoDescarga.material);
                $scope.loader = false;
            });
            /*$http.get("json/JSON_MATERIALES.json").then(function(response) {
                angular.forEach(response.data, function(val, key) {

                    $scope.materialesJson.push({ id: val.ITM_IDENT, material: val.ITEM_TEXT1 });

                });
            });*/

            $http.get(IPSERVICIOSAPX + "JSON_ZMOV_10008.aspx?SOCIEDAD=1000").then(function(data) {

                var aux = [];
                angular.forEach(data.data.LT_DETALLE, function(val, key) {
                    if (aux.indexOf(val.NAME_WERKS) === -1) {

                        aux.push(val.NAME_WERKS);
                        $scope.plantas.push({ value: val.WERKS, text: val.NAME_WERKS });

                    }

                })
            })

            $(function() {
                $('#plantas').immybox({
                    choices: $scope.plantas,
                    defaultSelectedValue: 1010
                });

            });

            $http.get(IPSERVICIOSAPX + "JSON_RFC_READ_TABLE.aspx?TABLA=ZMOV_50004&SEPARADOR=;").then(function(response) {

                angular.forEach(response.data.DATA, function(val, key) {

                    $scope.conductores.push({ value: val.WA[2], text: val.WA[3], patente: val.WA[4] });

                })

                $('#choferes').immybox({
                    choices: $scope.conductores
                })

            })


            $scope.materiales = [{

                material: '',
                toneladas: '',
                valor: '',
                total: ''

            }]


            $('#choferes').change(function() {

                console.log("hola");

                angular.forEach($scope.conductores, function(val, key) {

                    if (val.value == $('#choferes').immybox('getValue')[0]) {

                        $scope.rutChofer = val.value;
                        $scope.patente = val.patente;

                    }

                })
            })

            $scope.getDatosChofer = function() {

                console.log("hola");

                angular.forEach($scope.conductores, function(val, key) {

                    if (val.value == $('#choferes').immybox('getValue')[0]) {

                        $scope.rutChofer = val.value;
                        $scope.patente = val.patente;

                    }

                })


            }

            $scope.addMaterial = function() {
                $scope.materiales.push({
                    material: '',
                    toneladas: '',
                    valor: '',
                    total: ''
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

            $scope.generaGuia = function() {

                $scope.loader = true;
                var detalleGuia = [];
                var totalEstimado = 0;

                /*angular.forEach($scope.materiales, function(val, key) {

                    var line = {};
                    line.material = val.material.material;
                    line.toneladas = val.toneladas;
                    line.valorUnitario = 0;
                    line.total = val.total;

                    detalleGuia.push(line);
                    totalEstimado += val.toneladas;

                })*/

                detalleGuia.push({ material: $('#material').immybox('getValue')[0], kilos: $scope.kilos, pozo: '', fecha: $rootScope.formatFechaDB(new Date(), new Date()) });

                var guia = {

                    id: 0,
                    nGuia: $scope.nGuia,
                    rut: $rootScope.infoDescarga.rutDestino,
                    nombre: $('#plantas').immybox('getValue')[0],
                    planta: $('#plantas').immybox('getValue')[0],
                    fechaGuia: $rootScope.formatFechaDB(new Date(), new Date()),
                    fechaRecalada: $rootScope.formatFechaDB($rootScope.infoDescarga.fechaRecalada, new Date()),
                    embarcacion: $rootScope.infoDescarga.embarcacion,
                    romana: $scope.romana,
                    detalleGuia: detalleGuia,
                    oc: $rootScope.infoDescarga.oc,
                    kilosEstimados: $scope.kilos,
                    fechaDescarga: $scope.infoDescarga.fechaDescarga

                }

                if ($rootScope.infoDescarga.transporte == "directa") {

                    $http.get(IPSERVICIOSBD + "guia/insertGuia?guia=" + JSON.stringify(guia)).success(function(data) {

                        $scope.loader = false;
                        //$scope.mensajeModal = "Guía de despacho N°: " + $scope.nGuia + " realizada con éxito.";
                        $scope.showAceptar = false;
                        $scope.ocAsociada = $rootScope.infoDescarga.oc;
                        $scope.showM = 'modal show';

                    })


                } else {


                    $http.get(IPSERVICIOSBD + "guia/insertGuia?guia=" + JSON.stringify(guia)).success(function(res) {

                        if (res) {
                            $http.get(IPSERVICIOSBD + "guia/getToneladasByOC?oc=" + $rootScope.infoDescarga.oc).success(function(toneladas) {

                                var total = toneladas;
                                var estado = 0;
                                if (toneladas > $rootScope.infoDescarga.toneladas) {

                                    var jsonChange = {};
                                    $http.get("json/JSON_CHANGE_PO.json", {
                                        headers: { 'Content-Type': 'application/json; charset=UTF-8' }
                                    }).success(function(data) {
                                        jsonChage = data;
                                    }).error($rootScope.dialog.httpRequest.error);

                                    var descarga = {

                                        id: 0,
                                        fechaRecalada: $rootScope.formatFechaDB($rootScope.infoDescarga.fechaRecalada, new Date()),
                                        fechaDescarga: $rootScope.formatFechaDB($rootScope.infoDescarga.fechaDescarga, new Date()),
                                        proveedor: $rootScope.infoDescarga.proveedor,
                                        embarcacion: $rootScope.infoDescarga.embarcacion,
                                        rutDestino: $rootScope.infoDescarga.rutDestino,
                                        planta: $rootScope.infoDescarga.planta,
                                        folioSerna: $rootScope.infoDescarga.folioSerna,
                                        material: $rootScope.infoDescarga.material,
                                        toneladas: total,
                                        estado: estado,
                                        oc: $rootScope.infoDescarga.oc

                                    };

                                    $http.get(IPSERVICIOSAPX + "JSON_BAPI_PO_GETDETAIL.ASPX?PEDIDO=" + $rootScope.infoDescarga.oc).success(function(data) {

                                        jsonChage.PARAMETROS.PEDIDO = $rootScope.infoDescarga.oc;


                                        angular.forEach(data.PO_ITEMS, function(val, key) {

                                            if (val.MATERIAL == $rootScope.infoDescarga.material) {

                                                jsonChage.PARAMETROS.MATERIALES.push({ ITEM: val.PO_ITEM, COD: val.MATERIAL, CANTIDAD: total });
                                            }

                                        })


                                        $http.get(IPSERVICIOSAPX + "JSON_BAPI_PO_CHANGE.ASPX?PARAMETRO=" + JSON.stringify(jsonChage)).success(function(data) {

                                            console.log(data);

                                        })

                                        $scope.mensajeModal = "Guía de despacho N°: " + $scope.nGuia + " \n Orden de compra N° " + $rootScope.infoDescarga.oc;
                                        $scope.showAceptar = true;
                                        $scope.ocAsociada = $rootScope.infoDescarga.oc;
                                        $scope.showM = 'modal show';
                                        $scope.loader = false;
                                        $rootScope.infoDescarga.toneladas = total;
                                        paso = true;

                                    })

                                }

                            })
                        } else {

                            $scope.mensajeModal = "No se puede ingresar la guía, favor comuniquese con su administrador";

                        }
                    })

                }

            }

            /*$scope.generaGuia = function() {

                var detalleGuia = [];
                var totalEstimado = 0;

                angular.forEach($scope.materiales, function(val, key) {

                    var line = {};
                    line.material = val.material.material;
                    line.toneladas = val.toneladas;
                    line.valorUnitario = val.valor;
                    line.total = val.total;

                    detalleGuia.push(line);
                    totalEstimado += val.toneladas;

                })


                var guia = {

                    id: 0,
                    nGuia: $scope.nGuia,
                    rut: $rootScope.infoDescarga.rutDestino,
                    nombre: $('#plantas').immybox('getValue')[0],
                    planta: $('#plantas').immybox('getValue')[0],
                    fechaGuia: $rootScope.formatFechaDB(new Date()),
                    fechaRecalada: $rootScope.formatFechaDB($rootScope.infoDescarga.fechaRecalada),
                    embarcacion: $rootScope.infoDescarga.embarcacion,
                    romana: $scope.romana,
                    detalleGuia: detalleGuia,
                    oc: $rootScope.infoDescarga.oc,
                    kilosEstimados: totalEstimado

                }



                $http.get(IPSERVICIOSBD + "guia/insertGuia?guia=" + JSON.stringify(guia)).success(function(data) {

                    if (data) {

                        $http.get(IPSERVICIOSBD + "guia/getToneladasByOC?oc=" + $rootScope.infoDescarga.oc).success(function(data) {

                            var total = data;
                            var estado = 0;

                            if (data > $rootScope.infoDescarga.toneladas && $rootScope.infoDescarga.transporte == "camion") {

                                var jsonChage = {};
                                $http.get("json/JSON_CHANGE_PO.json", {
                                    headers: { 'Content-Type': 'application/json; charset=UTF-8' }
                                }).success(function(data) {
                                    jsonChage = data;
                                }).error($rootScope.dialog.httpRequest.error);



                                var descarga = {

                                    id: 0,
                                    fechaRecalada: $rootScope.formatFechaDB($rootScope.infoDescarga.fechaRecalada),
                                    fechaDescarga: $rootScope.formatFechaDB($rootScope.infoDescarga.fechaDescarga),
                                    proveedor: $rootScope.infoDescarga.proveedor,
                                    embarcacion: $rootScope.infoDescarga.embarcacion,
                                    rutDestino: $rootScope.infoDescarga.rutDestino,
                                    planta: $rootScope.infoDescarga.planta,
                                    folioSerna: $rootScope.infoDescarga.folioSerna,
                                    material: $rootScope.infoDescarga.material,
                                    toneladas: data,
                                    estado: estado,
                                    oc: $rootScope.infoDescarga.oc

                                };


                                $http.get(IPSERVICIOSAPX + "JSON_BAPI_PO_GETDETAIL.ASPX?PEDIDO=" + $rootScope.infoDescarga.oc).success(function(data) {

                                    jsonChage.PARAMETROS.PEDIDO = $rootScope.infoDescarga.oc;


                                    angular.forEach(data.PO_ITEMS, function(val, key) {

                                        if (val.MATERIAL == $rootScope.infoDescarga.material) {

                                            jsonChage.PARAMETROS.MATERIALES.push({ ITEM: val.PO_ITEM, COD: val.MATERIAL, CANTIDAD: total });
                                        }

                                    })


                                    $http.get(IPSERVICIOSAPX + "JSON_BAPI_PO_CHANGE.ASPX?PARAMETRO=" + JSON.stringify(jsonChage)).success(function(data) {

                                        console.log(data);

                                    })

                                    $rootScope.infoDescarga.toneladas = total;
                                    paso = true;

                                })

                            }

                            setTimeout(function() {
                                if ($rootScope.infoDescarga.transporte == "directa" || $rootScope.infoDescarga.transporte == "terceros") {

                                    var jsonNotifica = {};
                                    $http.get("json/JSON_NOTIFICACION_MP.json", {
                                        headers: { 'Content-Type': 'application/json; charset=UTF-8' }
                                    }).success(function(response) {

                                        var totalEstimado = 0;
                                        var goodsmovements = {};

                                        angular.forEach($scope.materiales, function(val, key) {

                                            totalEstimado += val.toneladas;

                                        })

                                        jsonNotifica = response;
                                        jsonNotifica.PARAMETROS.DATAGEN.BACKFLQUANT = totalEstimado;
                                        jsonNotifica.PARAMETROS.DATAGEN.BATCH = "";
                                        jsonNotifica.PARAMETROS.DATAGEN.DOCDATE = $rootScope.getFechaBapi();
                                        jsonNotifica.PARAMETROS.DATAGEN.MATERIALNR = $rootScope.infoDescarga.material;
                                        jsonNotifica.PARAMETROS.DATAGEN.PLANPLANT = "1500";
                                        jsonNotifica.PARAMETROS.DATAGEN.POSTDATE = $rootScope.getFechaBapi();
                                        jsonNotifica.PARAMETROS.DATAGEN.PRODPLANT = "1500";
                                        jsonNotifica.PARAMETROS.DATAGEN.DOCHEADERTXT = $scope.nGuia;

                                        goodsmovements.MATERIAL = $rootScope.infoDescarga.material;
                                        goodsmovements.PLANT = "1500";
                                        goodsmovements.STGE_LOC = "104 ";
                                        goodsmovements.BATCH = "LOTE_UNICO";
                                        goodsmovements.MOVE_TYPE = "";
                                        goodsmovements.ENTRY_QNT = "0";
                                        goodsmovements.ENTRY_UOM = "KG";
                                        jsonNotifica.PARAMETROS.GOODSMOVEMENTS.push(goodsmovements);

                                        console.log(jsonNotifica);
                                        console.log(JSON.stringify(jsonNotifica));

                                        $http.get(IPSERVICIOSAPX + "JSON_BAPI_REPMANCONF1_CREATE_MTS.aspx?PARAMETRO=" + JSON.stringify(jsonNotifica)).success(function(response) {

                                            console.log(JSON.stringify(response));
                                            if (response.CONFIRMATION > 0) {

                                                $scope.mensajeModal = "Recepción N°: " + response.CONFIRMATION + " realizada con éxito.";
                                                $scope.ocAsociada = $rootScope.infoDescarga.oc;
                                                $scope.showM = 'modal show';


                                            }

                                        })



                                    })

                                } else {
                                    if ($scope.venta && $rootScope.infoDescarga.transporte == "camion") {

                                        var generaStock = {};
                                        $http.get("json/JSON_ENVIO_MP_COMPRADA.json", {
                                            headers: { 'Content-Type': 'application/json; charset=UTF-8' }
                                        }).success(function(data) {

                                            generaStock = data;

                                            console.log(generaStock);

                                            generaStock.OBJETOENTRADA[0].PARAMETROS.ALMACEN = 0100;
                                            //generaStock.OBJETOENTRADA[0].PARAMETROS.CENTRO = 1500;
                                            generaStock.OBJETOENTRADA[0].PARAMETROS.FECHA = $rootScope.getFechaBapi();
                                            generaStock.OBJETOENTRADA[0].PARAMETROS.PEDIDO = $rootScope.infoDescarga.oc;


                                            angular.forEach($scope.materiales, function(val, key) {

                                                generaStock.OBJETOENTRADA[0].PARAMETROS.MATERIALES.push({ COD: '000000000002000046', CANTIDAD: val.toneladas });

                                            })

                                            generaStock.OBJETOENTRADA[1].PARAMETROS.LOTES.push({ LOTE: 1 });
                                            generaStock.OBJETOENTRADA[1].PARAMETROS.CARACTERISTICAS.push({ LOTE: $scope.lote, CARACTERISTICA: 'ZPROCEDENMP', VALOR: 'COMP_ARTESANAL' });

                                            generaStock.OBJETOENTRADA[1].PARAMETROS.CARACTERISTICAS.push({ LOTE: $scope.lote, CARACTERISTICA: 'ZEMBARCACION', VALOR: $rootScope.infoDescarga.embarcacion });

                                            $http.get(IPSERVICIOSAPX + "JSON_RECEPCION_EX.aspx?PARAMETRO=" + JSON.stringify(generaStock)).success(function(data) {

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

                                            })
                                        })

                                    } else {

                                        var jsonChage = {};
                                        $http.get("json/JSON_CHANGE_PO.json", {
                                            headers: { 'Content-Type': 'application/json; charset=UTF-8' }
                                        }).success(function(res) {

                                            jsonChage = res;
                                            //jsonChage.PARAMETROS.FINAL = "X";
                                            jsonChage.PARAMETROS.PEDIDO = $rootScope.infoDescarga.oc;

                                            $http.get(IPSERVICIOSAPX + "JSON_BAPI_PO_CHANGE.ASPX?PARAMETRO=" + JSON.stringify(jsonChage)).success(function(data) {

                                                console.log(data);

                                            })
                                        }).error($rootScope.dialog.httpRequest.error);



                                        var descarga = {

                                            id: 0,
                                            fechaRecalada: $rootScope.formatFechaDB($rootScope.infoDescarga.fechaRecalada),
                                            fechaDescarga: $rootScope.formatFechaDB($rootScope.infoDescarga.fechaDescarga),
                                            proveedor: $rootScope.infoDescarga.proveedor,
                                            embarcacion: $rootScope.infoDescarga.embarcacion,
                                            rutDestino: $rootScope.infoDescarga.rutDestino,
                                            planta: $rootScope.infoDescarga.planta,
                                            folioSerna: $rootScope.infoDescarga.folioSerna,
                                            material: $rootScope.infoDescarga.material,
                                            toneladas: $rootScope.infoDescarga.toneladas,
                                            estado: 1,
                                            oc: $rootScope.infoDescarga.oc != null ? $rootScope.infoDescarga.oc : 0

                                        };


                                        /*$http.get(IPSERVICIOSBD + "descarga/update?desc=" + JSON.stringify(descarga)).success(function(data) {

                                            console.log(data);

                                        })

            }
            }
            }, 1000)



            })
            }

            })

            } */

            $scope.redirectToResumen = function() {

                $rootScope.infoDescarga.material = $scope.material;
                $rootScope.infoDescarga.planta = $scope.planta;

                $location.path('/mainMenu');

            }

            $scope.nuevaGuia = function() {

                $scope.showM = "modal fade";
                $scope.materiales = [{

                    material: '',
                    toneladas: '',
                    valor: '',
                    total: ''

                }]
                $scope.planta = "";
                $scope.nGuia = "";
                $scope.fechaGuia = "";

            }
        }
    ]

).filter('formatFecha', function() {
    return function(input) {
        console.log(input);
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
});