/* Setup blank page controller */
angular.module('MetronicApp').controller('notMP', ['$rootScope', '$scope', 'settings', '$http', '$sce', '$location', '$timeout',
        function($rootScope, $scope, settings, $http, $sce, $location, $timeout) {
            $scope.dataLotes = [];
            $scope.horas = [];
            var pozos = $rootScope.FILTER_STORAGE("1050", $rootScope.pozos);
            $scope.formulario = [
                { ngModel: new Date(), label: 'Fecha', type: 'date', id: '', disabled: false, immybox: false, validate: true, onChange: 'getLotes(item)' },
                { ngModel: '', label: 'Lote PT', type: 'text', id: 'lotes', disabled: true, immybox: true, validate: true, fn: 'get_hours' },
                { ngModel: '', label: 'Hora', type: 'text', id: 'horas', disabled: false, immybox: false, validate: true, fn: 'Get_Kilos' },
                { ngModel: '', type: 'text', label: 'Producto Terminado', id: 'material', disabled: true, immybox: true, validate: true },
                { ngModel: '', type: 'text', label: 'Porcion', id: 'porcion', disabled: true, immybox: false, validate: true },
                { ngModel: '', type: 'text', label: 'Kilos', id: 'kilos', disabled: false, immybox: false, validate: true },
                { ngModel: '', type: 'text', label: 'MATERIAL', id: 'mp', disabled: false, immybox: true, validate: false, search: true },
                { ngModel: '', type: 'text', label: 'ALMACEN', id: 'almacen', disabled: false, immybox: true, validate: false, search: true },
            ];
            $scope.getLotes = function(item) {
                $rootScope.loader = true;
                $http.get(IPSERVICIOSAPX + "JSON_ZMOV_60001.aspx?FECHA=" + $rootScope.formatFechaBapi(item.ngModel)).then(function(respon) {
                    console.log(respon.data);
                    $scope.dataLotes = respon.data.LT_DETALLES;
                    var lotes = [];
                    var auxLotes = [];
                    angular.forEach($scope.dataLotes, function(v, k) {
                        if (v.VAART == 'B' && v.STORN == '') {
                            if (auxLotes.indexOf(v.ACHARG) == -1) {
                                lotes.push({ value: v.ACHARG, text: v.ACHARG });
                                auxLotes.push(v.ACHARG);
                            }
                        }
                    })
                    $('#lotes').immybox({
                        choices: lotes
                    })
                    if (lotes.length > 0) {
                        $scope.formulario[1].disabled = false;
                    }
                    $rootScope.loader = false;

                })

            }
            $scope.getLotes($scope.formulario[0])
            $scope.sumaKG = 0;
            /*$scope.detalle = [
                { id: 0, material: '', almacen: '', almacen_disabled: true, lote: '', stock: 0, kilos: 0, COD_MAT: '' }
            ];*/
            $scope.detalle = []

            $scope.fn = function(fn, data) {
                if (fn == '') { return; }
                $scope[fn](data)
            }
            $scope.get_hours = function(id) {
                $scope.formulario[1].ngModel = $('#lotes').val();
                $('#horas').immybox('destroy');
                $scope.horas = [];
                angular.forEach($scope.dataLotes, function(v, k) {
                    if ($scope.formulario[1].ngModel == v.ACHARG) {
                        $scope.horas.push({ value: v.UZEIT, text: v.UZEIT });
                    }
                });
                console.log($scope.horas);
                $('#horas').immybox({
                    choices: $scope.horas
                })
            }
            $scope.Get_Kilos = function() {
                $scope.formulario[2].ngModel = $('#horas').val();
                angular.forEach($scope.dataLotes, function(v, k) {
                    if ($scope.formulario[2].ngModel == v.UZEIT) {
                        console.log(v);
                        $scope.formulario[3].CODIGO = v.MATNR;
                        $scope.formulario[3].ngModel = v.MATNR;
                        $scope.formulario[4].ngModel = v.BKTXT;
                        $scope.formulario[5].ngModel = v.MENGE
                    }
                });
            }
            $scope.CHANGE_FOR_LGORT = function() {

            }
            $scope.Jquery_Solution = function(i, name) {
                $scope.detalle[i][name] = $('#' + name + i).val();
                if (name == 'material') {
                    angular.forEach($rootScope.materialesMP, function(v, k) {
                        if (v.text == $scope.detalle[i][name]) {
                            $scope.detalle[i].COD_MAT = v.value;
                        }
                    })
                } else if (name == 'almacen') {
                    $http.get("json/JSON_GET_DATA_MP.json").then(function(resp) {
                        $rootScope.loader = true;
                        var jsonEnvio = resp.data;
                        jsonEnvio.PARAMETROS.PLANTA = "1050";
                        jsonEnvio.PARAMETROS.LOTE = $scope.detalle[i].lote;
                        jsonEnvio.PARAMETROS.MATERIAL = $scope.detalle[i].COD_MAT;
                        $http.get(IPSERVICIOSAPX + "JSON_ZMOV_10001.aspx?PARAMETROS=" + JSON.stringify(jsonEnvio)).then(function(res) {
                            var jsonRes = res.data;
                            if (jsonRes.STOCKLOTES.length > 0) {
                                angular.forEach(jsonRes.STOCKLOTES, function(v, k) {
                                    //console.log(v.LGORT > $scope.detalle[i][name])
                                    if (v.LGORT == $scope.detalle[i][name]) {
                                        $scope.detalle[i].stock = v.CLABS;
                                    }
                                });
                            }
                            $rootScope.loader = false;
                        })
                    })
                }
            }
            $timeout(function() {
                $('#mp').immybox({
                    choices: $rootScope.materialesMP
                })
                $('#almacen').immybox({
                    choices: pozos
                })
            }, 500)

            $scope.SHOW_DET = function(item) {

                if (item.show) {
                    item.show = false;
                } else {
                    item.show = true;
                }

                console.log(item);


            }

            $scope.MARCAR_TODO = function(item) {
                if (item.totalLote) {
                    angular.forEach(item.lotesHijos, function(v, k) {
                        v.cantidad = v.stock;
                    })
                } else {
                    angular.forEach(item.lotesHijos, function(v, k) {
                        v.cantidad = 0;
                    })
                }
            }

            $scope.CALC_DIF = function(item) {

                console.log(item);

                if (parseInt(item.stock) < parseInt(item.cantidad)) {
                    item.cantidad = 0;
                    item.diferencia = 0;
                    $rootScope.tipoMsg = "ALERTA";
                    $rootScope.msg = [{ tipo: 'MONTO EXCEDIDO', descripcion: 'Los kilos a utilizar no pueden superar el stock disponible ' + item.stock }];
                    $rootScope.showM = true;
                } else {
                    item.diferencia = parseInt(item.stock) - parseInt(item.cantidad);
                }


            }

            $scope.addLine = function() {

                var hijos = []
                for (i = 0; i <= 6; i++) {

                    var hijo = {};
                    hijo.material = "MATERIAL " + i;
                    hijo.lote = "RE0001-" + Math.floor(Math.random() * 6) + 1;
                    hijo.stock = 1000;
                    hijo.cantidad = 0;
                    hijo.diferencia = 0;
                    hijos.push(hijo);

                }
                var lote = {};
                lote.lotePadre = 'RE000' + $scope.detalle.length;
                lote.lotesHijos = hijos;
                lote.show = false;
                lote.totalLote = false;
                $scope.detalle.push(lote);
                console.log($scope.detalle);

                /*$scope.detalle.push({ id: $scope.detalle.length, almacen_disabled: true, material: '', almacen: '', lote: '', stock: 0, kilos: 0, COD_MAT: '' });
                $timeout(function() {
                    $('.materialesMP').immybox({
                        choices: $rootScope.materialesMP
                    })
                    $('.almacenes').immybox({
                        choices: pozos
                    })
                }, 500)
                console.log($scope.detalle)*/
            };
            $scope.totalConsumo = function(kilos, i) {
                if ($scope.detalle[i].kilos > $scope.detalle[i].stock) {
                    $rootScope.showM = true;
                    $rootScope.tipoMsg = 'ALERTA';
                    $rootScope.msg = [{ descripcion: 'Los kilos no pueden sobrepasar al Stock', tipo: 'ERROR' }]
                    $scope.detalle[i].kilos = $scope.detalle[i].stock;
                } else if ($scope.detalle[i].kilos < 0) {
                    $rootScope.showM = true;
                    $rootScope.tipoMsg = 'ALERTA';
                    $rootScope.msg = [{ descripcion: 'Los kilos no pueden ser menor a 0', tipo: 'ERROR' }]
                    $scope.detalle[i].kilos = 0;
                }
                $scope.sumaKG = 0;
                angular.forEach($scope.detalle, function(v, k) {
                    $scope.sumaKG += v.kilos;
                })
            };
            $scope.removeLine = function(x) {
                //material: '', almacen: '', lote: '', stock: 0, kilos: 0 
                if ($scope.detalle.length == 1) {
                    $rootScope.showM = true;
                    $rootScope.tipoMsg = 'ALERTA';
                    $rootScope.msg = [{ descripcion: 'NO SE PUEDE ELIMINAR LA ULTIMA FILA ', tipo: 'ALERTA' }]
                }
                var idxAsignadoAux = 0;
                $scope.listaAsignadoAux = [];
                for (var aux = 0; aux < $scope.detalle.length; aux++) {
                    if (x != $scope.detalle[aux].id) {
                        $scope.listaAsignadoAux[idxAsignadoAux] = {
                            id: idxAsignadoAux,
                            material: $scope.detalle[aux].material,
                            almacen: $scope.detalle[aux].almacen,
                            stock: $scope.detalle[aux].stock,
                            kilos: $scope.detalle[aux].kilos,
                            COD_MAT: $scope.detalle[aux].COD_MAT,
                            almacen_disabled: $scope.detalle[aux].almacen_disabled,
                        };
                        idxAsignadoAux++;
                    }
                }
                $scope.detalle = [];
                $scope.detalle = $scope.listaAsignadoAux;
                $scope.totalConsumo();
            };
            $scope.getInfoMP = function(item, index) {
                console.log($scope.detalle)
                if (item.lote == '') { return; }
                $http.get("json/JSON_GET_DATA_MP.json").then(function(resp) {
                    $rootScope.loader = true;
                    var jsonEnvio = resp.data;
                    jsonEnvio.PARAMETROS.PLANTA = "1050";
                    jsonEnvio.PARAMETROS.LOTE = item.lote;
                    jsonEnvio.PARAMETROS.MATERIAL = $scope.detalle[index].COD_MAT;
                    $http.get(IPSERVICIOSAPX + "JSON_ZMOV_10001.aspx?PARAMETROS=" + JSON.stringify(jsonEnvio)).then(function(res) {
                        var jsonRes = res.data;
                        $rootScope.loader = false;
                        if (jsonRes.STOCKLOTES.length == 0) {
                            $rootScope.showM = true;
                            $rootScope.tipoMsg = 'ALERTA';
                            $rootScope.msg = [{ descripcion: 'NO SE ENCONTRO EL LOTE', tipo: 'ERROR' }]
                            $scope.detalle[index].lote = '';
                            return;
                        }
                        console.log(res.data);
                        //$('#almacen' + index).immybox('setValue', jsonRes.STOCKLOTES[0].LGORT);
                        $scope.detalle[index].almacen = jsonRes.STOCKLOTES[0].LGORT;
                        var almaceness = [];
                        if (jsonRes.STOCKLOTES.length > 0) {
                            angular.forEach(jsonRes.STOCKLOTES, function(v, k) {
                                if (v.CLABS > 0) {
                                    almaceness.push({ value: v.LGORT, text: v.LGORT })
                                }
                            });
                            $('#almacen' + index).immybox({
                                choices: almaceness
                            });
                            $scope.detalle[index].almacen_disabled = false;
                        }
                        $scope.detalle[index].stock = jsonRes.STOCKLOTES[0].CLABS;
                    })
                })
            }
            $scope.ConsumirMP = function() {
                var auxMensaje = false;
                var mensaje = '';
                angular.forEach($scope.formulario, function(v, k) {
                    if (v.validado) {
                        //console.log(v)
                        if (v.ngModel == '') {
                            if (!auxMensaje) {
                                mensaje = v.label;
                                auxMensaje = true;
                            }
                        }
                    }
                })
                if (auxMensaje) {
                    $rootScope.showM = true;
                    $rootScope.tipoMsg = 'ALERTA';
                    $rootScope.msg = [{ descripcion: mensaje, tipo: 'CAMPO VACIO' }]
                    return;
                }
                $http.get("json/JSON_NOTIFICACION_MP_PROPIO.json", { headers: { 'Content-Type': 'application/json; charset=UTF-8' } }).then(function(resp) {
                    var jsonNot = resp.data;
                    jsonNot.OBJETOENTRADA[0].PARAMETROS.DATAGEN = {
                        "BACKFLQUANT": $scope.formulario[5].ngModel,
                        "BATCH": $scope.formulario[1].ngModel,
                        "DOCDATE": $rootScope.formatFechaBapi($scope.formulario[0].ngModel),
                        "DOCHEADERTXT": $scope.formulario[4].ngModel,
                        "MATERIALNR": $scope.formulario[3].CODIGO,
                        "PDC_NUMBER": "",
                        "PLANPLANT": "1050",
                        "POSTDATE": $rootScope.formatFechaBapi($scope.formulario[0].ngModel),
                        "PRODLINE": "",
                        "PRODPLANT": "1050",
                        "PRODVERSION": "V0_0",
                        "SCRAPQUANT": "0,0000",
                        "STORAGELOC": '03',
                        "UNITOFMEASURE": "KG"
                    }
                    jsonNot.OBJETOENTRADA[0].PARAMETROS.FLAGS = {
                        "ACTIVITIES_TYPE": "",
                        "BCKFLTYPE": "11",
                        "COMPONENTS_TYPE": "1",
                        "RP_SCRAPTYPE": ""
                    }
                    jsonNot.OBJETOENTRADA[0].PARAMETROS.GOODSMOVEMENTS = [];
                    angular.forEach($scope.detalle, function(v, k) {
                            jsonNot.OBJETOENTRADA[0].PARAMETROS.GOODSMOVEMENTS.push({
                                "BATCH": v.lote,
                                "ENTRY_QNT": v.kilos,
                                "ENTRY_UOM": "KG",
                                "MATERIAL": v.COD_MAT,
                                "MOVE_TYPE": 261,
                                "PLANT": "1050",
                                "STGE_LOC": v.almacen
                            })
                        })
                        /*[0].MATERIAL = $scope.formulario[0].MATNR;
                        jsonNot.OBJETOENTRADA[0].PARAMETROS.GOODSMOVEMENTS[0].PLANT = "1050";
                        jsonNot.OBJETOENTRADA[0].PARAMETROS.GOODSMOVEMENTS[0].STGE_LOC = v.LGORT;
                        jsonNot.OBJETOENTRADA[0].PARAMETROS.GOODSMOVEMENTS[0].BATCH = $scope.formulario[2].ngModel;
                        jsonNot.OBJETOENTRADA[0].PARAMETROS.GOODSMOVEMENTS[0].MOVE_TYPE = "531";
                        jsonNot.OBJETOENTRADA[0].PARAMETROS.GOODSMOVEMENTS[0].ENTRY_QNT = $scope.formulario[3].ngModel;
                        jsonNot.OBJETOENTRADA[0].PARAMETROS.GOODSMOVEMENTS[0].ENTRY_UOM = "KG";*/
                        //jsonNot.OBJETOENTRADA[1].PARAMETROS = {};
                    jsonNot.OBJETOENTRADA[1].PARAMETROS.RESULTADO_BAPI = false;
                    console.log(jsonNot);

                    //console.log(JSON.stringify(jsonNot));
                    $http.get(IPSERVICIOSAPX + "JSON_BAPI_REPMANCONF1_CREATE_MTS.aspx?PARAMETROS=" + JSON.stringify(jsonNot)).then(function(response) {
                        console.log(response.data.MENSAJES[0]);
                        var json_Aux = JSON.parse(response.data.MENSAJES[0].MENSAJES);
                        $rootScope.showM = true;
                        $rootScope.tipoMsg = 'SAP';
                        $rootScope.IR_MSG = '/notificarPT';
                        $rootScope.msg = [{ descripcion: ((json_Aux.CONFIRMATION == 0) ? 'FALLO' : json_Aux.CONFIRMATION), tipo: 'Mensaje' }]
                        $rootScope.loader = false;

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
    ]

);