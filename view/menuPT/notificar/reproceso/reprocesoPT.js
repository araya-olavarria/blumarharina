/* Setup blank page controller */
angular.module('MetronicApp').controller('reprocesoPT', ['$rootScope', '$scope', 'settings', '$http', '$sce', '$location', '$timeout',
        function($rootScope, $scope, settings, $http, $sce, $location, $timeout) {

            var pts = [];
            var json = {};
            angular.forEach($rootScope.materialesPT, function(v, k) {

                if (v.text.includes('SUBPRODUCTO')) {
                    pts.push(v);
                }

            })
            $scope.formulario = [
                { ngModel: '', type: 'text', label: 'Lote Reproceso', immybox: false, validate: true, json: 'loteReproceso' },
                { ngModel: '', type: 'text', label: 'SUBPRODUCTO', immybox: true, validate: true, id: 'materiales', json: 'material' }
            ];

            $scope.lotes = [];

            $timeout(function() {

                $('#materiales').immybox({
                    choices: pts
                });

            }, 500)


            $scope.scan = function() {

                $rootScope.loader = true;

                if (APPMOVIL) {

                    cordova.plugins.barcodeScanner.scan(function(result) {

                        try {
                            $timeout(function() {

                                var almacen = "";
                                json = JSON.parse(result.text);
                                if (json.rz != "") {
                                    almacen = "03";
                                } else {
                                    almacen = "04";
                                }
                                //$scope.envase = json.ev;
                                var hu = json.lt + json.cr + json.pr + json.jl + json.an;
                                // $('#envase').immybox('setValue', json.ev);
                                //$('#material').immybox('setValue', json.mt);
                                $scope.lotes.push({ lote: json.lt, porcion: json.pr, almacen: almacen, envase: json.ev, hu: hu, cantidad: json.ct, correlativo: json.cr, juliano: json.jl, anno: json.an, rechazo: json.rz, maerial: json.mt });
                                $rootScope.loader = false;




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

            $scope.UNPACK = function() {


                var form = {};
                $rootScope.tipoMsg = "ALERTA!";
                $rootScope.msg = [];
                angular.forEach($scope.formulario, function(v, k) {
                    if (v.json) {
                        if (v.validate) {
                            if (v.immybox) {
                                if ($('#' + v.id).immybox('getValue')[0] != "") {
                                    form[v.json] = $('#' + v.id).immybox('getValue')[0];
                                } else {
                                    $rootScope.msg.push({ tipo: 'CAMPO VACIO', descripcion: v.label });
                                }
                            } else {
                                if (v.ngModel != "") {
                                    form[v.json] = v.ngModel;
                                } else {
                                    $rootScope.msg.push({ tipo: 'CAMPO VACIO', descripcion: v.label });
                                }
                            }
                        }
                    }
                })

                if ($rootScope.msg.length > 0) {
                    $rootScope.showM = true;
                } else {

                    $http.get("json/JSON_UNPACK_HU.json").then(function(resp) {

                        var jsonEnvio = resp.data;
                        jsonEnvio.OBJETOENTRADA[0].PARAMETROS.HUKEY = json.lt + json.cr + json.pr + json.jl + json.an;
                        jsonEnvio.OBJETOENTRADA[0].PARAMETROS.MATERIAL = json.mt;
                        jsonEnvio.OBJETOENTRADA[0].PARAMETROS.LOTE = $scope.formulario[0].ngModel;
                        jsonEnvio.OBJETOENTRADA[0].PARAMETROS.CANTIDAD = json.ct;
                        jsonEnvio.OBJETOENTRADA[0].PARAMETROS.PLANT = "1050";
                        jsonEnvio.OBJETOENTRADA[0].PARAMETROS.STGE_LOC = "06";
                        jsonEnvio.OBJETOENTRADA[0].PARAMETROS.PORCION = json.pr;

                        jsonEnvio.OBJETOENTRADA[1].PARAMETROS.ALMACEN = "06";
                        jsonEnvio.OBJETOENTRADA[1].PARAMETROS.ALMACEN = ALMACENDESTINO = "03";
                        jsonEnvio.OBJETOENTRADA[1].PARAMETROS.CENTRO = "1050";
                        jsonEnvio.OBJETOENTRADA[1].PARAMETROS.CENTRO_DESTINO = "1050";
                        jsonEnvio.OBJETOENTRADA[1].PARAMETROS.FECHA = $rootScope.getFechaBapi();
                        jsonEnvio.OBJETOENTRADA[1].PARAMETROS.GUIA = json.pr;
                        jsonEnvio.OBJETOENTRADA[1].PARAMETROS.MATERIALES.push({
                            CANTIDAD: json.ct,
                            COD: json.mt,
                            LOTE: json.lt,
                            ALMACENDESTINO: "04"
                        });
                        jsonEnvio.OBJETOENTRADA[1].PARAMETROS.MOVIMIENTO = "309";

                        console.log(IPSERVICIOSAPX + "JSON_REPROCESO_HU.aspx?PARAMETROS=" + JSON.stringify(jsonEnvio));
                        $http.get(IPSERVICIOSAPX + "JSON_REPROCESO_HU.aspx?PARAMETROS=" + JSON.stringify(jsonEnvio)).then(function(dat) {


                            $rootScope.tipoMsg = 'Error';
                            $rootScope.msg = [];
                            var error = 0;
                            angular.forEach(dat.data.MENSAJES, function(v, k) {


                                if (dat.data.RESULTADO) {

                                    var resp = JSON.parse(data.data.MENSAJES[1]);
                                    $rootScope.msg({ titulo: 'DOCUMENTO MATERIAL', descripcion: resp.MATERIALDOCUMENT });

                                } else {
                                    if (v.MENSAJES != null) {
                                        var resp = JSON.parse(v.MENSAJES);
                                        angular.forEach(resp.RETURN, function(val, key) {

                                            $rootScope.msg.push({ tipo: val.TYPE, descripcion: val.MESSAGE });
                                            if (val.TYPE == "E")
                                                error++;

                                        })
                                    }
                                }


                            })

                            $rootScope.loader = false;
                            $rootScope.showM = true;

                        })

                    })
                }

            }

        }
    ]

);