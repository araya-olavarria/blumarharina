/* Setup blank page controller */
angular.module('MetronicApp').controller('descargaMP', ['$rootScope', '$scope', 'settings', '$http', '$sce', '$location',
        function($rootScope, $scope, settings, $http, $sce, $location) {

            var minDate = new Date();
            $scope.errores = [];
            $scope.directa = false;
            $scope.loader = false;
            $scope.showM = "modal fade";
            $scope.fecha = new Date();
            $scope.msg = [];

            $scope.formulario = [
                { ngModel: '', key: 'Rpesca', label: 'Región de Pesca', type: 'select', validado: true, placeholder: 'Seleccione', options: $scope.Rpesca }
            ];
            //$scope.plantas = [];

            minDate.setDate($scope.fecha.getDate() - 2);
            //console.log(minDate);
            $scope.minDate = minDate.getFullYear() + "-" + (minDate.getMonth() + 1) + "-" + (minDate.getDate() < 10 ? '0' : '') + minDate.getDate();
            $scope.tiempoZarpe = new Date(1970, 0, 1, 14, 57, 0);

            $scope.tiempoRecalada = new Date(1970, 0, 1, 14, 57, 0);

            $scope.tiempoDescarga = new Date(1970, 0, 1, 14, 57, 0);

            $scope.trans = "camion";

            $scope.fechaDescarga = $scope.fecha;
            $scope.fechaZarpe = $scope.fecha;
            $scope.fechaRecalada = $scope.fecha;

            $scope.materialesJson = [];
            $scope.proveedores = [{ value: '01', text: 'Blumar S.A' }];
            $scope.muelles = [];
            $scope.plantas = [];
            $scope.embarcaciones = [];

            $http.get(IPSERVICIOSAPX + "JSON_ZMOV_10008.aspx?SOCIEDAD=1000").then(function(data) {

                var aux = [];
                angular.forEach(data.data.LT_DETALLE, function(val, key) {
                    if (aux.indexOf(val.NAME_WERKS) === -1) {

                        aux.push(val.NAME_WERKS);
                        $scope.plantas.push({ value: val.WERKS, text: val.NAME_WERKS });

                    }

                })

                $('#plantas').immybox({
                    choices: $scope.plantas
                });

            })

            $http.get(IPSERVICIOSAPX + "JSON_ZMOV_10012.aspx?MTART=ZMP&WERKS=1020").then(function(response) {

                angular.forEach(response.data.LT_DETALLE, function(val, key) {

                    if (val.WRKST != "")
                        $scope.materialesJson.push({ id: val.MATNR, material: val.MAKTX, especie: val.EXTWG });

                });

            });

            $http.get(IPSERVICIOSAPX + "json_ZMOV_10036.aspx").then(function(response) {

                angular.forEach(response.data.ET_DATPROV, function(val, key) {

                    $scope.proveedores.push({ value: val.LIFNR, text: val.NAME1 });

                    $('#proveedores').immybox({
                        choices: $scope.proveedores
                    });

                });

            });


            $http.get(IPSERVICIOSAPX + "JSON_RFC_READ_TABLE.aspx?TABLA=ZMOV_50002&SEPARADOR=;").then(function(response) {


                console.log(response);

                angular.forEach(response.data.DATA, function(val, key) {

                    $scope.muelles.push({ value: val.WA[2], text: val.WA[5] });

                })

                console.log($scope.muelles);

                $('#muelleDescarga').immybox({
                    choices: $scope.muelles
                })

            })

            $http.get(IPSERVICIOSAPX + "JSON_RFC_READ_TABLE.aspx?TABLA=ZMOV_50003&SEPARADOR=;").then(function(response) {


                console.log(response);

                angular.forEach(response.data.DATA, function(val, key) {

                    $scope.embarcaciones.push({ value: val.WA[2], text: val.WA[1] });

                })

                console.log($scope.embarcaciones);

                $('#embarcaciones').immybox({
                    choices: $scope.embarcaciones
                })

            })

            $scope.tipoDescarga = function() {

                if ($scope.trans == "directa") {

                    $scope.directa = true;
                    $('#proveedores').immybox('setValue', 001);
                    $scope.comercializadora = "Blumar S.A";


                } else {

                    $scope.directa = false;
                    console.log("hola");
                    $('#proveedores').immybox('setValue', '');
                    $scope.comercializadora = "";
                    console.log("hola");


                }

            }

            $scope.redirectNext = function() {

                $scope.loader = true;
                if ($scope.trans == undefined || $scope.fechaRecalada == undefined || $scope.fechaDescarga == undefined || $('#proveedores').val() == undefined ||
                    $scope.embarcacion == undefined || $scope.nActivacion == undefined || $scope.material == undefined || $scope.toneladas == undefined) {

                    $scope.tipoMsg = "Error";

                    $scope.msg.push({ titulo: "ERROR DATOS OBLIGATORIOS", descripcion: "Debe completar todos los datos" });

                    $scope.showM = "modal show";

                } else {

                    if ($scope.fechaDescarga < $scope.fechaZarpe) {

                        $scope.tipoMsg = "Error";
                        $scope.msg.push({ titulo: "ERROR FECHAS", descripcion: "La fecha de Zarpe no puede ser mayor a la fecha de descarga" });
                        $scope.showM = "modal show";

                    } else {

                        console.log($rootScope.formatFechaDB($scope.fechaRecalada, $scope.tiempoRecalada));

                        var infoDescarga = {};
                        infoDescarga.fechaRecalada = $rootScope.formatFechaDB($scope.fechaRecalada, $scope.tiempoRecalada);
                        infoDescarga.fechaDescarga = $rootScope.formatFechaDB($scope.fechaDescarga, $scope.tiempoDescarga);
                        infoDescarga.fechaZarpe = $rootScope.formatFechaDB($scope.fechaZarpe, $scope.tiempoZarpe);
                        infoDescarga.proveedor = $('#proveedores').val();
                        infoDescarga.rutDestino = $scope.rutDestino;
                        infoDescarga.planta = $('#plantas').immybox('getValue')[0];
                        //infoDescarga.romana = $scope.romana;
                        infoDescarga.nActivacion = $scope.nActivacion;
                        infoDescarga.material = $scope.material.id;
                        infoDescarga.toneladas = $scope.toneladas;
                        infoDescarga.embarcacion = $scope.embarcacion;


                        var respuesta = {};
                        infoDescarga.transporte = "camion";

                        var jsonCreaOC = {};

                        $http.get(IPSERVICIOSBD + "descarga/getCorrelativo").success(function(correlativo) {

                            var lote = "RE" + $rootScope.pad(correlativo, 8, 0);
                            if ($scope.trans == "camion") {
                                $http.get("json/JSON_CREATE_OC.json", {
                                    headers: { 'Content-Type': 'application/json; charset=UTF-8' }
                                }).success(function(data) {

                                    jsonCreaOC = data;
                                    jsonCreaOC.OBJETOENTRADA[0].PARAMETROS.FECHA = $rootScope.getFechaBapi($scope.fechaRecalada);
                                    jsonCreaOC.OBJETOENTRADA[0].PARAMETROS.MATERIALES.push({ COD: $scope.material.id, CANTIDAD: $scope.toneladas });
                                    jsonCreaOC.OBJETOENTRADA[0].PARAMETROS.PRODUCTOR = $('#proveedores').immybox('getValue')[0];
                                    jsonCreaOC.OBJETOENTRADA[0].PARAMETROS.BATCH = lote;
                                    $http.get(IPSERVICIOSAPX + "JSON_BAPI_PO_CREATE1.aspx?PARAMETRO=" + JSON.stringify(jsonCreaOC)).success(function(data) {

                                        console.log(JSON.parse(data.MENSAJES[0].MENSAJES));

                                        var errorPedido = [];
                                        var conErr = 0;
                                        try {
                                            var result1 = JSON.parse(data.MENSAJES[0].MENSAJES);
                                            var EXPPURCHASEORDER = result1.EXPPURCHASEORDER;
                                            console.log(data.MENSAJES[0].RESULTADO);

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


                                        console.log(conErr);

                                        if ($scope.errores.length > 0) {

                                            $scope.tipoMsg = "ERROR";
                                            $scope.msg = [];
                                            $scope.msg = $scope.errores;
                                            $scope.showM = "modal show";


                                        } else {

                                            respuesta = JSON.parse(data.MENSAJES[0].MENSAJES);
                                            if (respuesta.RESULTADO_BAPI) {

                                                var descarga = {
                                                    id: 0,
                                                    fechaRecalada: $rootScope.formatFechaDB($scope.fechaRecalada, $scope.tiempoRecalada),
                                                    fechaDescarga: $rootScope.formatFechaDB($scope.fechaDescarga, $scope.tiempoDescarga),
                                                    fechaZarpe: $rootScope.formatFechaDB($scope.fechaZarpe, $scope.tiempoZarpe),
                                                    proveedor: $('#proveedores').immybox('getValue')[0],
                                                    embarcacion: $scope.embarcacion,
                                                    rutDestino: $scope.rutDestino,
                                                    planta: $('#plantas').immybox('getValue')[0],
                                                    nActivacion: $scope.nActivacion,
                                                    material: $scope.material.id,
                                                    toneladas: $scope.toneladas,
                                                    estado: 0,
                                                    oc: respuesta.EXPPURCHASEORDER,
                                                    lote: lote,
                                                    tipoDescarga: "1"

                                                };


                                                //$location.path('/guiaDespacho');
                                                $http.get(IPSERVICIOSBD + "descarga/insert?desc=" + JSON.stringify(descarga)).success(function(data) {

                                                    infoDescarga.oc = respuesta.EXPPURCHASEORDER;
                                                    infoDescarga.transporte = "camion";
                                                    $rootScope.infoDescarga = infoDescarga;

                                                    $scope.loader = false;
                                                    $location.path('/guiaDespacho');

                                                })


                                            }
                                        }


                                    })

                                }).error($rootScope.dialog.httpRequest.error);

                            } else {

                                var descarga = {

                                    id: 0,
                                    fechaRecalada: $rootScope.formatFechaDB($scope.fechaRecalada, $scope.tiempoRecalada),
                                    fechaDescarga: $rootScope.formatFechaDB($scope.fechaDescarga, $scope.tiempoDescarga),
                                    fechaZarpe: $rootScope.formatFechaDB($scope.fechaZarpe, $scope.tiempoZarpe),
                                    proveedor: $('#proveedores').immybox('getValue')[0],
                                    embarcacion: $scope.embarcacion,
                                    rutDestino: $scope.rutDestino,
                                    planta: $('#proveedores').immybox('getValue')[0],
                                    nActivacion: $scope.nActivacion,
                                    material: $scope.material.id,
                                    toneladas: $scope.toneladas,
                                    estado: 0,
                                    oc: '0',
                                    lote: lote,
                                    tipoDescarga: 0

                                };

                                //$location.path('/guiaDespacho');
                                $http.get(IPSERVICIOSBD + "descarga/insert?desc=" + JSON.stringify(descarga)).success(function(data) {

                                    if (data) {
                                        infoDescarga.oc = 0;
                                        infoDescarga.transporte = "directa";
                                        $rootScope.infoDescarga = infoDescarga;
                                        $scope.loader = false;
                                        $location.path('/guiaDespachoPropia');
                                    } else {

                                        $scope.tipoMsg = "Error";
                                        $scope.msg.push({ titulo: "Error al GUARDAR", descripcion: "Al guardar los datos, favor asegurese de haber completado todos los datos" });

                                        $scope.showM = "modal show";

                                    }

                                })


                            }

                        })


                    }
                }

            }

            $scope.cerrarModal = function() {

                $scope.showM = "modal fade";

            }

            $scope.formatRut = function(rut) {

                let valor = rut.replace('.', '');
                valor = valor.replace('-', '');

                let cuerpo = valor.slice(0, -1);
                let dv = valor.slice(-1).toUpperCase();

                rut = cuerpo + '-' + dv;

                let suma = 0;
                let multiplo = 2;

                $scope.rutDestino = rut;

            }

        }
    ]

);