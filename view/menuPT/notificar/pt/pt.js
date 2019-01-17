/* Setup blank page controller */
angular.module('MetronicApp').controller('notPT', ['$rootScope', '$scope', 'settings', '$http', '$sce', '$location', '$timeout',
        function($rootScope, $scope, settings, $http, $sce, $location, $timeout) {

            $scope.showM = "modal fade";
            $scope.loader = false;
            $scope.fechaNot = new Date();
            $scope.horaNot = $rootScope.getTimeFormat();
            $scope.materialesJson = [];
            var almacenes = [{ value: '03', text: '03' }, { value: '04', text: '04' }];

            /*angular.forEach($rootScope.pozos, function(v, k) {

                if (v.planta == 1050)
                    almacenes.push(v);

            })*/

            console.log($rootScope.pozos);

            var envaces = [
                { value: '7000003', text: 'JUMBO_1250KG' }, { value: '7000004', text: 'ESLINGA 40X25 KG' },
                { value: '7000010', text: 'JUMBO_650KG' }, { value: '7000006', text: 'SACO 25KG' }

            ];
            var jsonEnvio = {};
            var hu = "";
            var correlativo = "";
            var juliano = "";
            var anno = "";
            var rechazo = "";

            $scope.plantas = [];


            $('#material').immybox({
                choices: $rootScope.materialesPT
            })

            $('#almacen').immybox({
                choices: almacenes
            })

            $('#envase').immybox({
                choices: envaces
            })

            $scope.scan = function() {

                $rootScope.loader = true;

                if (APPMOVIL) {

                    cordova.plugins.barcodeScanner.scan(function(result) {

                        try {
                            $timeout(function() {
                                var json = JSON.parse(result.text);

                                $scope.lote = json.lt;
                                $scope.cantidad = json.ct;
                                correlativo = json.cr;
                                $scope.porcion = json.pr;
                                juliano = json.jl;
                                anno = json.an;
                                rechazo = json.rz;
                                if (rechazo > 0) {
                                    $('#almacen').immybox('setValue', '03');
                                } else {
                                    $('#almacen').immybox('setValue', '04');
                                }
                                //$scope.envase = json.ev;
                                $('#envase').immybox('setValue', json.ev);
                                $('#material').immybox('setValue', json.mt);
                                $rootScope.loader = false;
                                $scope.hu = json.lt + json.cr + json.pr + json.jl + json.an;

                            }, 2000);
                        } catch (error) {

                            alert(error);

                        }
                    }, function(error) {

                        alert("Error: " + error);

                    })

                } else {

                    $rootScope.loader = false;
                    $rootScope.tipoMsg = 'Error';
                    $rootScope.msg = [{ titulo: "Funcionalidad de movilidad", descripcion: "La funcionalidad de escaner está disponible solamente en dispositivos moviles o pistolas" }]
                    $rootScope.showM = true;

                }


            }

            $scope.guardarNot = function() {

                $rootScope.loader = true;
                jsonEnvio = {

                    id: 0,
                    material: $('#material').immybox('getValue')[0],
                    kilos: $scope.cantidad,
                    porcion: $scope.porcion,
                    envase: $('#envase').immybox('getValue')[0],
                    correlativo: correlativo,
                    almacen: $('#almacen').immybox('getValue')[0],
                    lote: $scope.lote,
                    nDte: 0,
                    anno: anno,
                    juliano: juliano,
                    rechazo: rechazo,
                    fechaNot: $scope.fechaNot.getFullYear() + "-" + ($scope.fechaNot.getMonth() + 1) + "-" + $scope.fechaNot.getDate(),
                    horaNot: $scope.horaNot,
                    hu: $scope.hu

                }


                $http.get(IPSERVICIOSBD + "notificacion/validaHU?hu=" + JSON.stringify(jsonEnvio)).success(function(rex) {

                    if (rex.data) {

                        $rootScope.loader = false;
                        $rootScope.tipoMsg = 'Error';
                        $rootScope.msg = [{ tipo: "Error al GUARDAR", descripcion: "La HU ingresada ya existe" }]
                        $rootScope.showM = true;

                    } else {

                        $http.get(IPSERVICIOSBD + "notificacion/insert?not=" + JSON.stringify(jsonEnvio)).success(function(response) {

                            if (response) {

                                $rootScope.loader = false;
                                $scope.showM = "modal show";
                                $scope.mensajeModal = "NOTIFICACION REALIZADA";

                            } else {

                                $rootScope.tipoMsg = 'Error';
                                $rootScope.msg = [{ tipo: "Error al GUARDAR", descripcion: "Al guardar los datos, favor asegurese de haber completado todos los datos" }]
                                $rootScope.showM = true;

                            }

                        })
                    }

                })



            }

            $scope.okNotif = function() {

                location.reload();

            }

            $scope.closeModal = function() {

                $scope.showM = "modal fade";

            }

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

            $http.get("json/JSON_NOTIFICACION.json", {
                headers: { 'Content-Type': 'application/json; charset=UTF-8' }
            }).success(function(data) {
                jsonEnvio = data;
            }).error($rootScope.dialog.httpRequest.error);

            /*$http.get(IPSERVICIOSAPX + "JSON_ZMOV_10012.aspx?MTART=ZPT&WERKS=1020").then(function(response) {

                var options = "<option value=''>SELECCIONE</option>";
                angular.forEach(response.data.LT_DETALLE, function(val, key) {

                    if (val.WRKST != "")
                        options += "<option value='" + val.MATNR + "'>" + val.MAKTX + "</option>";
                    //$scope.materialesJson.push({ id: val.MATNR, material: val.MAKTX, especie: val.EXTWG });

                });
                $('#material').html(options);
            });*/





            /*$scope.notificar = function() {

                $http.get(IPSERVICIOSBD + "notificacion/getCorrelativo").success(function(data) {

                    console.log(data);

                    var correlativo = correlativo;
                    jsonEnvio.PARAMETROS.DATAGEN.PDC_NUMBER = data;
                    jsonEnvio.PARAMETROS.DATAGEN.MATERIALNR = $scope.material.id;
                    jsonEnvio.PARAMETROS.DATAGEN.PLANPLANT = $('#plantas').immybox('getValue')[0];
                    jsonEnvio.PARAMETROS.DATAGEN.PRODPLANT = $('#plantas').immybox('getValue')[0];
                    jsonEnvio.PARAMETROS.DATAGEN.BATCH = $scope.lote;
                    jsonEnvio.PARAMETROS.DATAGEN.POSTDATE = $rootScope.getFechaBapi();
                    jsonEnvio.PARAMETROS.DATAGEN.DOCDATE = $rootScope.getFechaBapi();
                    jsonEnvio.PARAMETROS.DATAGEN.BACKFLQUANT = $scope.kilos;
                    jsonEnvio.PARAMETROS.DATAGEN.UNITOFMEASURE = 'KG';




                    $http.get(IPSERVICIOSAPX + "JSON_BOM_MATERIAL.aspx?CENTRO=1020&MATERIAL=" + $scope.material.id).success(function(data) {

                        console.log(data);


                        angular.forEach(data.T_STPO, function(val, key) {

                            if (val.COMPONENT = '4001211') {

                                var goodMovements = {};

                                goodMovements.MATERIAL = $rootScope.pad(val.COMPONENT, 18, 0);
                                goodMovements.PLANT = $('#plantas').immybox('getValue')[0];
                                goodMovements.STGE_LOC = "03";
                                goodMovements.BATCH = $scope.lote;
                                goodMovements.MOVE_TYPE = "261";
                                goodMovements.ENTRY_QNT = 0;
                                goodMovements.ENTRY_UOM = "KG";

                                jsonEnvio.PARAMETROS.GOODSMOVEMENTS.push(goodMovements);

                            }
                            //$scope.materiales.push({ material: { id: $rootScope.pad(val.COMPONENT, 18, 0), material: '' }, kilos: val.COMP_QTY.replace(".", ""), almacen: '', lote: '' });

                        })

                        jsonEnvio.PARAMETROS.CHARACTERISTICS_BATCH[0].CHAR_VALUE = $scope.material.id;

                        var notificacion = {

                            id: 0,
                            material: $scope.material.id,
                            kilos: $scope.kilos,
                            porcion: $scope.porcion,
                            fechaContabilidad: $rootScope.formatFechaDB($scope.fechaContabilidad),
                            fechaFabricacion: $rootScope.formatFechaDB($scope.fechaFabricacion),
                            almacen: $('#plantas').immybox('getValue')[0],
                            lote: $scope.lote,
                            nDte: correlativo

                        }


                        console.log(JSON.stringify(jsonEnvio));

                        $http.get(IPSERVICIOSAPX + "JSON_BAPI_REPMANCONF1_CREATE_MTS.aspx?PARAMETRO=" + JSON.stringify(jsonEnvio)).success(function(data) {

                            console.log(data);

                            $http.get(IPSERVICIOSBD + "notificacion/insert?not=" + JSON.stringify(notificacion)).success(function(data) {

                                console.log(data);


                            })

                            $scope.nDoc = data.CONFIRMATION;
                            $scope.modalVi = "modal show";

                        })

                    })




                })


            }*/
        }
    ]

);