/* Setup blank page controller */
angular.module('MetronicApp').controller('mpPropia', ['$rootScope', '$scope', 'settings', '$http', '$sce', '$location',
        function($rootScope, $scope, settings, $http, $sce, $location) {

            var fecha = new Date();
            $scope.pozos = [];
            $scope.showM = "modal fade";
            $scope.fechaRecep = fecha;
            $scope.horaRecep = fecha.getHours() + ":" + (fecha.getMinutes() < 10 ? '0' : '') + fecha.getMinutes();
            $scope.loader = true;
            $scope.responses = [];

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

                console.log($rootScope.recepcionSeleccionada);

                //if ($rootScope.recepcionSeleccionada.ocInfo.tipoDescarga == 0) {


                $http.get(IPSERVICIOSBD + "descarga/getPropia?descarga=" + $rootScope.recepcionSeleccionada.fechaDescarga + "&recalada=" + $rootScope.recepcionSeleccionada.fechaDescarga + "&embarcacion=" + $rootScope.recepcionSeleccionada.embarcacion).success(function(resp) {

                    $rootScope.recepcionSeleccionada.ocInfo = resp;
                    console.log($rootScope.recepcionSeleccionada);

                    if ($rootScope.recepcionSeleccionada != undefined) {

                        $scope.proveedor = $rootScope.recepcionSeleccionada.proveedor;
                        $scope.kilos = $rootScope.recepcionSeleccionada.kilosEstimados;
                        $('#materiales').val($rootScope.recepcionSeleccionada.ocInfo.material);

                    }

                    console.log($('#materiales').val());

                    $http.get(IPSERVICIOSAPX + "JSON_ZMOV_10008.aspx?SOCIEDAD=1000&WERKS=1050").then(function(data) {

                        //$scope.pozos = [];
                        angular.forEach(data.data.LT_DETALLE, function(val, key) {

                            $scope.pozos.push({ value: val.LGORT, text: val.LGOBE });

                        })

                        $(function() {
                            $('.pozos').immybox({
                                choices: $scope.pozos,
                                defaultSelectedValue: 1010
                            });

                        });
                        console.log($scope.pozos);

                    })

                    if ($rootScope.recepcionSeleccionada.detalleGuia.length > 0) {

                        $scope.recepciones = [];
                        angular.forEach($rootScope.recepcionSeleccionada.detalleGuia, function(val, key) {

                                $scope.recepciones.push({ material: val.material, pozo: val.pozo, kilos: val.kilos, fecha: new Date(val.fecha.split(' ')[0]), hora: new Date(val.fecha), nGuia: $rootScope.recepcionSeleccionada.nGuia });

                            })
                            //$scope.recepciones = $rootScope.recepcionSeleccionada.detalleGuia;
                        console.log($scope.recepciones);


                    } else {

                        $scope.recepciones = [{

                            material: $('#materiales').val(),
                            pozo: '',
                            kilos: '',
                            fecha: $scope.fechaRecep,
                            hora: $scope.horaRecep,
                            nGuia: $rootScope.recepcionSeleccionada.nGuia

                        }];

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

                /*} else {
                    $http.get(IPSERVICIOSBD + "descarga/getByOC?oc=" + $rootScope.recepcionSeleccionada.oc).success(function(resp) {

                        $rootScope.recepcionSeleccionada.ocInfo = resp;
                        console.log($rootScope.recepcionSeleccionada);

                        if ($rootScope.recepcionSeleccionada != undefined) {

                            $scope.proveedor = $rootScope.recepcionSeleccionada.proveedor;
                            $scope.kilos = $rootScope.recepcionSeleccionada.kilosEstimados;
                            $('#materiales').val($rootScope.recepcionSeleccionada.ocInfo.material);

                        }

                        console.log($('#materiales').val());

                        $http.get(IPSERVICIOSAPX + "JSON_ZMOV_10008.aspx?SOCIEDAD=1000&WERKS=1050").then(function(data) {

                            //$scope.pozos = [];
                            angular.forEach(data.data.LT_DETALLE, function(val, key) {

                                $scope.pozos.push({ value: val.LGORT, text: val.LGOBE });

                            })

                            $(function() {
                                $('.pozos').immybox({
                                    choices: $scope.pozos,
                                    defaultSelectedValue: 1010
                                });

                            });
                            console.log($scope.pozos);

                        })

                        if ($rootScope.recepcionSeleccionada.detalleGuia.length > 0) {

                            $scope.recepciones = [];
                            angular.forEach($rootScope.recepcionSeleccionada.detalleGuia, function(val, key) {

                                    $scope.recepciones.push({ material: val.material, pozo: val.pozo, kilos: val.kilos, fecha: new Date(val.fecha.split(' ')[0]), hora: new Date(val.fecha), nGuia: $rootScope.recepcionSeleccionada.nGuia });

                                })
                                //$scope.recepciones = $rootScope.recepcionSeleccionada.detalleGuia;
                            console.log($scope.recepciones);


                        } else {

                            $scope.recepciones = [{

                                material: $('#materiales').val(),
                                pozo: '',
                                kilos: '',
                                fecha: $scope.fechaRecep,
                                hora: $scope.horaRecep,
                                nGuia: $rootScope.recepcionSeleccionada.nGuia

                            }];

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
                }*/

            });



            $scope.recepcionarGD = function() {

                console.log($scope.recepciones);

                $scope.loader = true;

                var jsonNot = {};
                $http.get("json/JSON_NOTIFICACION_MP.json", {
                    headers: { 'Content-Type': 'application/json; charset=UTF-8' }
                }).success(function(json) {


                    jsonNot = json;

                    var goodsmovements = {};


                    jsonNot.PARAMETROS.DATAGEN.BACKFLQUANT = $scope.kilos;
                    jsonNot.PARAMETROS.DATAGEN.BATCH = "";
                    jsonNot.PARAMETROS.DATAGEN.DOCDATE = $rootScope.getFechaBapi();
                    jsonNot.PARAMETROS.DATAGEN.MATERIALNR = $('#materiales').val();
                    jsonNot.PARAMETROS.DATAGEN.PLANPLANT = "1500";
                    jsonNot.PARAMETROS.DATAGEN.POSTDATE = $rootScope.getFechaBapi();
                    jsonNot.PARAMETROS.DATAGEN.PRODPLANT = "1500";
                    jsonNot.PARAMETROS.DATAGEN.DOCHEADERTXT = $rootScope.recepcionSeleccionada.nGuia;

                    angular.forEach($scope.recepciones, function(val, key) {

                        goodsmovements.MATERIAL = "6000138";
                        goodsmovements.PLANT = "1050";
                        goodsmovements.STGE_LOC = $("#pozo" + key).immybox('getValue')[0] + " ";
                        goodsmovements.BATCH = "LOTE_UNICO";
                        goodsmovements.MOVE_TYPE = "";
                        goodsmovements.ENTRY_QNT = "0 ";
                        goodsmovements.ENTRY_UOM = "KG";
                        jsonNot.PARAMETROS.GOODSMOVEMENTS.push(goodsmovements);

                    })

                    //console.log(key);
                    //console.log(IPSERVICIOSAPX + "JSON_BAPI_REPMANCONF1_CREATE_MTS.aspx?PARAMETROS=" + JSON.stringify(jsonNot));

                    $http.get(IPSERVICIOSAPX + "JSON_BAPI_REPMANCONF1_CREATE_MTS.aspx?PARAMETROS=" + JSON.stringify(jsonNot)).success(function(response) {

                        console.log(response);
                        if (response.CONFIRMATION > 0) {

                            $scope.responses.push({ nDoc: response.CONFIRMATION, nGuia: $rootScope.recepcionSeleccionada.nGuia, estado: "OK" });

                        } else {

                            $scope.responses.push({ nDoc: response.CONFIRMATION, nGuia: $rootScope.recepcionSeleccionada.nGuia, estado: "NO DISTRIBUIDA" });

                        }

                        $scope.loader = false;
                        $scope.showM = "modal show";

                    })


                })



            };

            $scope.guardarGD = function() {

                angular.forEach($scope.recepciones, function(val, key) {

                    val.fecha = val.fecha.getFullYear() + "-" + (val.fecha.getMonth() + 1) + "-" + val.fecha.getDate() + " " + val.hora.getHours() + ":" + val.hora.getMinutes();

                })

                $http.get(IPSERVICIOSBD + "guia/insertDetalle?det=" + JSON.stringify($scope.recepciones) + "&nGuia=" + $rootScope.recepcionSeleccionada.nGuia).success(function(data) {

                    console.log(data);

                })

            }


            $scope.addRecepcion = function() {

                $scope.recepciones.push({

                    material: $('#materiales').val(),
                    pozo: '',
                    kilos: '',
                    fecha: new Date($scope.fechaRecep),
                    hora: new Date($scope.fechaRecep + " " + $scope.horaRecep),
                    nGuia: $rootScope.recepcionSeleccionada.nGuia

                });

                setTimeout(function() {

                    $('.pozos').immybox({
                        choices: $scope.pozos,
                        defaultSelectedValue: 1010
                    });

                }, 1000)


            };

            $scope.cerrarModal = function() {

                $scope.showM = "modal fade";
                $location.path("/listarRecepciones");

            }

        }
    ]

);