/* Setup blank page controller */
angular.module('MetronicApp').controller('notAceite', ['$rootScope', '$scope', 'settings', '$http', '$sce', '$location', '$timeout',
    function ($rootScope, $scope, settings, $http, $sce, $location, $timeout) {
        console.log($rootScope.pozos);
        var aceites = [];
        $scope.lotes = [];
        var estanques = [];
        angular.forEach($rootScope.pozos, function (v, k) {
            if (v.planta == 1200)
                estanques.push(v);
        })
        angular.forEach($rootScope.materialesPT, function (v, k) {
            if (v.text.includes('ACEITE')) {
                aceites.push(v);
            }
        })
        $scope.formulario = [
            { ngModel: '', id: 'aceites', type: 'text', label: 'Aceite', immybox: true, json: 'aceite', cabecera: true, validado: true, fn: 'Jquery_data' },
            { ngModel: '', id: 'estanques', type: 'text', label: 'Estanque', immybox: true, json: 'estanque', cabecera: true, validado: true, fn: 'Jquery_data' },
            { ngModel: '', id: '', type: 'text', label: 'Lote Aceite', immybox: false, json: 'loteAceite', cabecera: true, validado: true, fn: 'Get_Lote' },
            { ngModel: '', id: '', type: 'text', label: 'Cantidad', immybox: false, json: 'kilos', cabecera: true, validado: true },
            { ngModel: 0, id: '', type: 'number', label: 'Total', disabled: true, immybox: false, json: '', cabecera: true, validado: true },
            { ngModel: new Date(), id: '', type: 'date', label: 'FECHA PT', disabled: false, immybox: false, json: '', cabecera: false, ngChange: '', validado: false },
        ];
        $timeout(function () {
            $('#aceites').immybox({
                choices: aceites
            })
            $('#estanques').immybox({
                choices: estanques
            })
        }, 500);
        $scope.fn = function (fn, data) {
            if (fn == '') { return; }
            $scope[fn](data);
        }
        $scope.Jquery_data = function (id) {
            $scope.formulario[id].ngModel = $('#' + $scope.formulario[id].id).val();
            if (id == 0) {
                angular.forEach($rootScope.materialesPT, function (v, k) {
                    if (v.text == $scope.formulario[0].ngModel) {
                        $scope.formulario[0].MATNR = v.value;
                    }
                })
            } else {
                angular.forEach($rootScope.pozos, function (v, k) {
                    if (v.text == $scope.formulario[id].ngModel) {
                        $scope.formulario[id].DATO = v.value;
                    }
                })
            }
        }
        $scope.Get_Lote = function (id) {
            //console.log($scope.formulario[0]);
            if ($scope.formulario[id].ngModel == '') { return; }
            $http.get("json/JSON_GET_DATA_MP.json").then(function (resp) {
                $rootScope.loader = true;
                var jsonEnvio = resp.data;
                jsonEnvio.PARAMETROS.PLANTA = "1050";
                jsonEnvio.PARAMETROS.LOTE = $scope.formulario[id].ngModel;
                $http.get(IPSERVICIOSAPX + "JSON_ZMOV_10001.aspx?PARAMETROS=" + JSON.stringify(jsonEnvio)).then(function (res) {
                    //console.log(res);
                    $rootScope.loader = false;
                    if (res.data.STOCKLOTES.length == 0) {
                        $rootScope.showM = true;
                        $rootScope.tipoMsg = 'ALERTA';
                        $rootScope.msg = [{ descripcion: 'NO SE ENCONTRO LOTE', tipo: 'ALERTA' }]
                        $scope.formulario[id].ngModel = '';
                        return;
                    }

                })
            })
        }
        $scope.Get_Material = function (id) {
            var json = 0;
            angular.forEach($rootScope.materialesPT, function (vMateriales, kMateriales) {
                //console.log(vMateriales.value , id)
                if (vMateriales.value == id) {
                    json = vMateriales;
                }
            });
            if (json == 0) { json = { value: '' } }
            return json
        }
        $scope.Complete_Lotes = function (lotes) {
            if (lotes.length > 0) {
                angular.forEach(lotes, function (v, k) {
                    $http.get("json/JSON_GET_DATA_MP.json").then(function (resp) {
                        var jsonEnvio = resp.data;
                        jsonEnvio.PARAMETROS.PLANTA = "1050";
                        jsonEnvio.PARAMETROS.LOTE = v.lote;
                        $http.get(IPSERVICIOSAPX + "JSON_ZMOV_10001.aspx?PARAMETROS=" + JSON.stringify(jsonEnvio)).then(function (res) {
                            //console.log(res);
                            if (res.data.STOCKLOTES.length > 0) {
                                console.log(res.data);
                                v.LGORT = res.data.STOCKLOTES[0].LGORT;
                            }
                        })
                    })
                })
            }
            console.log(lotes)
            return lotes;
        }
        $scope.getLotes = function () {
            $rootScope.loader = true;
            $http.get(IPSERVICIOSAPX + "JSON_ZMOV_60001.aspx?FECHA=" + $rootScope.formatFechaBapi($scope.formulario[5].ngModel)).then(function (respon) {
                $scope.dataLotes = respon.data.LT_DETALLES;
                $scope.lotes = [];
                var lotesAux = [];
                var other_lote = [];
                angular.forEach($scope.dataLotes, function (v, k) {
                    if (v.VAART=='B' && v.STORN =='') {
                        $scope.lotes.push({ lote: v.ACHARG, porcion: v.BKTXT, kilos: v.MENGE, material: $scope.Get_Material(v.MATNR), cantAceite: 0 });
                        if (lotesAux.indexOf(v.ACHARG + '-' + v.BKTXT) == -1) {
                            lotesAux.push(v.ACHARG + '-' + v.BKTXT);
                            other_lote.push({ lote: v.ACHARG, porcion: v.BKTXT, kilos: 0, material: $scope.Get_Material(v.MATNR), cantAceite: 0, fecha: v.BUDAT, LGORT: '' })
                        }
                    }
                })
                angular.forEach(other_lote, function (val, key) {
                    angular.forEach($scope.lotes, function (v, k) {
                        if (val.lote + '-' + val.porcion == v.lote + '-' + v.porcion) {
                            val.kilos = (v.kilos + val.kilos);
                        }
                    })
                })
                $scope.lotes = $scope.Complete_Lotes(other_lote);
                $rootScope.loader = false;
            })

        }
        $scope.Mensaje_resp = [];
        $scope.Mensaje_Respuesta = function (mensajes) {
            console.log(mensajes);
            $rootScope.loader = false;
            $rootScope.showM = true;
            $rootScope.tipoMsg = 'RESPUESTA';
            $rootScope.IR_MSG = '/notificarPT';
            $rootScope.msg = [];
            try {
                angular.forEach(mensajes, function (v, k) {
                    angular.forEach(v.msj, function (val, key) {
                        var json_Aux = JSON.parse(val.MENSAJES);
                        $rootScope.msg.push({ descripcion: ((key == 0) ? ((json_Aux.CONFIRMATION == 0) ? 'FALLO' : json_Aux.CONFIRMATION) : ((json_Aux.DOCUMENTO == null) ? '-' : json_Aux.DOCUMENTO)), tipo: ((key == 0) ? 'CONFIRMACION (' + v.batch + ')' : 'DOCUMENTO') })
                    })
                })
            } catch (e) {
                $rootScope.msg.push({ descripcion: e, tipo: 'ERROR' })
            }

            //$rootScope.msg = [{ descripcion: 'EL TOTAL DEBE SER IGUAL A LA CANTIDAD', tipo: 'ERROR' }]

        }
        $scope.consumir = function () {
            if ($scope.lotes.length == 0) {
                $rootScope.showM = true;
                $rootScope.tipoMsg = 'ALERTA';
                $rootScope.msg = [{ descripcion: 'Ingresar Lotes', tipo: 'CAMPO VACIO' }]
                return;
            }
            var auxMensaje = false;
            var mensaje = '';
            angular.forEach($scope.formulario, function (v, k) {
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
            if ($scope.formulario[4].ngModel != $scope.formulario[3].ngModel) {
                $rootScope.showM = true;
                $rootScope.tipoMsg = 'ALERTA';
                $rootScope.msg = [{ descripcion: 'EL TOTAL DEBE SER IGUAL A LA CANTIDAD', tipo: 'ERROR' }]
                return;
            }
            $scope.Count = 0;

            $scope.Count2 = 0;
            angular.forEach($scope.lotes, function (v, k) {
                if (v.cantAceite > 0) {
                    $scope.Count2++;
                }
            });
            $rootScope.loader = true;
            angular.forEach($scope.lotes, function (v, k) {
                if (v.cantAceite > 0) {
                    $http.get("json/JSON_NOTIFICACION_MP_PROPIO.json", { headers: { 'Content-Type': 'application/json; charset=UTF-8' } }).then(function (resp) {
                        var jsonNot = resp.data;
                        console.log(v)
                        jsonNot.OBJETOENTRADA[0].PARAMETROS.DATAGEN = {
                            "BACKFLQUANT": v.cantAceite,
                            "BATCH": v.lote,
                            "DOCDATE": $rootScope.formatFechaBapi(v.fecha),
                            "DOCHEADERTXT": v.porcion,
                            "MATERIALNR": v.material.value,
                            "PDC_NUMBER": "",
                            "PLANPLANT": "1050",
                            "POSTDATE": $rootScope.formatFechaBapi(v.fecha),
                            "PRODLINE": "",
                            "PRODPLANT": "1050",
                            "PRODVERSION": "V0_0",
                            "SCRAPQUANT": "0,0000",
                            "STORAGELOC": v.LGORT,
                            "UNITOFMEASURE": "KG"
                        }
                        jsonNot.OBJETOENTRADA[0].PARAMETROS.FLAGS = {
                            "ACTIVITIES_TYPE": "",
                            "BCKFLTYPE": "11",
                            "COMPONENTS_TYPE": "1",
                            "RP_SCRAPTYPE": ""
                        }
                        jsonNot.OBJETOENTRADA[0].PARAMETROS.GOODSMOVEMENTS[0].MATERIAL = $scope.formulario[0].MATNR;
                        jsonNot.OBJETOENTRADA[0].PARAMETROS.GOODSMOVEMENTS[0].PLANT = "1050";
                        jsonNot.OBJETOENTRADA[0].PARAMETROS.GOODSMOVEMENTS[0].STGE_LOC = v.LGORT;
                        jsonNot.OBJETOENTRADA[0].PARAMETROS.GOODSMOVEMENTS[0].BATCH = $scope.formulario[2].ngModel;
                        jsonNot.OBJETOENTRADA[0].PARAMETROS.GOODSMOVEMENTS[0].MOVE_TYPE = "531";
                        jsonNot.OBJETOENTRADA[0].PARAMETROS.GOODSMOVEMENTS[0].ENTRY_QNT = $scope.formulario[3].ngModel;
                        jsonNot.OBJETOENTRADA[0].PARAMETROS.GOODSMOVEMENTS[0].ENTRY_UOM = "KG";
                        //jsonNot.OBJETOENTRADA[1].PARAMETROS = {};
                        jsonNot.OBJETOENTRADA[1].PARAMETROS = {
                            "ALMACEN": v.LGORT + '  ',
                            "ALMACENDESTINO": $scope.formulario[1].DATO,
                            "CENTRO": "1050",
                            "CENTRO_DESTINO": "1200",
                            "CODE": "04",
                            "CONTRAORDEN": "false",
                            "CONTRAPEDIDO": "false",
                            "FECHA": $rootScope.formatFechaBapi(v.fecha),
                            "GUIA": "",
                            "MATERIALES": [{
                                CANTIDAD: $scope.formulario[3].ngModel,
                                COD: $scope.formulario[0].MATNR,
                                LOTE: $scope.formulario[2].ngModel,
                                ALMACENDESTINO: $scope.formulario[1].DATO
                            }],
                            "MOVIMIENTO": 301,
                            "PEDIDO": "",
                            "RESULTADO_BAPI": true,
                            "TIPO_STOCK": ""
                        }
                        console.log(jsonNot);
                        //console.log(JSON.stringify(jsonNot));
                        $http.get(IPSERVICIOSAPX + "JSON_BAPI_REPMANCONF1_CREATE_MTS.aspx?PARAMETROS=" + JSON.stringify(jsonNot)).then(function (response) {
                            console.log(response);
                            $scope.Mensaje_resp.push({ msj: response.data.MENSAJES, batch: v.lote })
                            $scope.Count++
                            if ($scope.Count == $scope.Count2) {
                                $scope.Mensaje_Respuesta($scope.Mensaje_resp)
                            }
                        }, function (error) {
                            $rootScope.tipoMsg = 'Error';
                            $rootScope.msg = [{ tipo: "Carga de archvio", descripcion: " Archivo JSON_NOTIFICACION_MP.json no encontrado " + error.statusText }]
                            $rootScope.showM = true;

                        })

                    }, function (error) {

                        $rootScope.tipoMsg = 'Error';
                        $rootScope.msg = [{ tipo: "Carga de archvio", descripcion: " Archivo JSON_NOTIFICACION_MP.json no encontrado " + error.statusText }]
                        $rootScope.showM = true;

                    })
                }
            })
        }
        $scope.sumKilos = function (x) {
            if (!isNaN(x)) {
                $scope.formulario[4].ngModel = 0;
                angular.forEach($scope.lotes, function (v, k) {
                    ////console.log(v.cantAceite,$scope.formulario[4].ngModel)
                    $scope.formulario[4].ngModel = $scope.formulario[4].ngModel + v.cantAceite;
                })
            }
        }
    }
]

);