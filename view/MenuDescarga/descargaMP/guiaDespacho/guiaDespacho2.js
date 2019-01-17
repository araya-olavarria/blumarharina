/* Setup blank page controller */
angular.module('MetronicApp').controller('guiaDespacho', ['$rootScope', '$scope', 'settings', '$http', '$sce', '$location', '$timeout', '$filter',
        function($rootScope, $scope, settings, $http, $sce, $location, $timeout, $filter) {

            $rootScope.loader = true;
            $scope.modalShow = false;
            var nombreEmbarcacion = "";

            if ($rootScope.ocSeleccionada) {

                $rootScope.infoDescarga = $rootScope.ocSeleccionada;

            }

            console.log($rootScope.infoDescarga);

            $scope.formulario = [

                { ngModel: '', key: 'directo', label: 'DIRECTA', type: 'radio', validado: false, placeholder: '', value: '0', cabecera: true, immybox: false, name: 'trans', json: 'tipoTransporte' },
                { ngModel: '1', key: 'camion', label: 'CAMIÓN', type: 'radio', validado: true, placeholder: '', value: '1', cabecera: true, immybox: false, name: 'trans', json: 'tipoTransporte' },
                { ngModel: false, key: 'Venta', label: 'Venta', type: 'checkbox', validado: false, placeholder: '', id: 'ventar', json: 'venta' },
                { ngModel: '', key: 'embarcacion', label: 'Nombre Embarcación', type: 'label', validado: false, placeholder: '', value: $rootScope.infoDescarga.embarcacion, id: 'embarcacion' },
                { ngModel: '', key: 'fechaRecalada', label: 'Fecha Recalada', type: 'label', validado: false, placeholder: '', value: $filter('formatFecha')($rootScope.infoDescarga.fechaRecalada), id: 'fechaRecalada' },
                { ngModel: 'manual', key: 'manual', label: 'MANUAL', type: 'radio', validado: true, placeholder: '', value: 'manual', immybox: false, name: 'tipo', json: 'tipo' },
                { ngModel: 'electronica', key: 'electronica', label: 'ELECTRONICA', type: 'radio', validado: true, placeholder: '', value: 'electronica', immybox: false, name: 'tipo', json: 'tipo' },
                { ngModel: '', key: 'N° Guía', label: 'N° Guía', type: 'number', validado: false, placeholder: '', id: 'nGuia', immybox: false, show: false, json: 'nGuia' },
                { ngModel: '', key: 'planta', label: 'Planta', type: 'text', validado: true, placeholder: '', id: 'plantas', immybox: true, show: true, json: 'planta' },
                { ngModel: new Date(), key: 'fechaGuia', label: 'Fecha Guia', type: 'date', validado: true, placeholder: '', id: 'fechaGuia', immybox: false, json: 'fechaGuia' },
                { ngModel: '', key: 'material', label: 'Material', type: 'text', validado: true, placeholder: '', id: 'materiales', disabled: true, show: true, immybox: true, json: 'material' },
                { ngModel: parseFloat($rootScope.infoDescarga.toneladas), key: 'kilos', label: 'Kilos', type: 'number', validado: true, placeholder: '', id: 'kilos', immybox: false, show: true, json: 'kilosEstimados' },
                { ngModel: '', key: 'romana', label: 'Romana', type: 'text', validado: true, placeholder: '', id: 'romana', immybox: true, show: true, json: 'romana' },
                { ngModel: '', key: 'patente', label: 'Patente', type: 'text', validado: true, id: 'patente', immybox: true, json: 'patente', datosChofer: true, show: true },
                { ngModel: '', key: 'nombreChofer', label: 'Nombre chofer', type: 'text', validado: true, id: 'nombreChofer', immybox: true, json: 'nombreChofer', datosChofer: true, show: true },
                { ngModel: '', key: 'rutChofer', label: 'Rut Chofer', type: 'text', validado: true, id: 'rutChofer', immybox: true, json: 'rutChofer', datosChofer: true, show: true, disabled: true },

            ]

            $scope.formVenta = [
                { ngModel: '', key: 'RUT CLIENTE', label: 'RUT CLIENTE', type: 'text', validado: false, placeholder: '', id: '', immybox: false, show: false, ngChange: 'formatRut(item.ngModel)', buton: true, class: 'input-sm', json: 'rutCl' },
                { ngModel: '', key: 'RAZONSOCIAL', label: 'RAZÓN SOCIAL', type: 'text', validado: false, placeholder: '', id: '', immybox: false, show: false, buton: false, class: "input_calendar", disabled: true, json: 'nombreCl' },
            ];


            $timeout(function() {
                var romanas = [];

                angular.forEach($rootScope.dataRomanas, function(v, k) {

                    console.log(v);

                    if (v.planta == $rootScope.infoDescarga.planta)
                        romanas.push({ value: v.value, text: v.text });

                })

                console.log(JSON.stringify($rootScope.plantas));


                $('#plantas').immybox({
                    choices: $rootScope.plantas
                });

                $('#materiales').immybox({
                    choices: $rootScope.materialesMP
                })

                $('#materiales').immybox('setValue', $rootScope.infoDescarga.material);

                $('#plantas').immybox('setValue', $rootScope.infoDescarga.planta);

                var patentes = [];
                var choferes = [];
                var ruts = [];
                angular.forEach($rootScope.dataConductores, function(v, k) {

                    patentes.push({ value: [v[3].trim(), v[2]], text: v[3].trim() });
                    choferes.push({ value: [v[4].trim(), v[2]], text: v[4].trim() });
                    ruts.push({ value: v[2].trim(), text: v[2].trim() });

                })

                $('#patente').immybox({
                    choices: patentes
                })
                $('#nombreChofer').immybox({
                    choices: choferes
                })
                $('#rutChofer').immybox({
                    choices: ruts
                })

                $('#romana').immybox({
                    choices: romanas
                })

                var input = $('#patente');
                input.on('update', function(element, newValue) {
                    $('#nombreChofer').immybox('destroy');
                    var choices = input.immybox('getChoices');
                    var filteredChoices = choices[0].filter(function(choice) {
                        return choice.value === newValue;
                    });
                    choferes = [];
                    angular.forEach($rootScope.dataConductores, function(v, k) {


                        if (v[2].trim() == filteredChoices[0].value[1].trim())
                            choferes.push({ value: [v[4].trim(), v[2].trim()], text: v[4].trim() });

                    })

                    $('#nombreChofer').immybox({
                        choices: choferes
                    })

                });

                $('#nombreChofer').on('update', function(element, newValue) {

                    var choices = $('#nombreChofer').immybox('getChoices');
                    var filteredChoices = choices[0].filter(function(choice) {
                        return choice.value === newValue;
                    });
                    console.log(filteredChoices);

                    $('#rutChofer').immybox('setValue', filteredChoices[0].value[1].trim());

                })
                $rootScope.loader = false;

            }, 2000)

            $scope.changeTransporte = function(item) {

                if (item.value == "1") {

                    $scope.formulario[0].validado = false;
                    $scope.formulario[1].validado = true;
                    $scope.formulario[0].ngModel = '1';
                    $scope.formulario[1].ngModel = '1';
                    angular.forEach($scope.formulario, function(v, k) {

                        if (v.datosChofer) {

                            v.show = true;
                            v.validado = true;

                        }

                    })

                } else {

                    $scope.formulario[1].ngModel = '0';
                    $scope.formulario[0].ngModel = '0';
                    $scope.formulario[0].validado = true;
                    $scope.formulario[1].validado = false;
                    angular.forEach($scope.formulario, function(v, k) {

                        if (v.datosChofer) {

                            v.show = false;
                            v.validado = false;

                        }

                    })

                }

            }

            $scope.changeType = function(item) {

                $scope.formulario[5].validado = true;
                $scope.formulario[6].validado = false;
                // $scope.formulario[7].validado = true;
                if (item.value == "manual") {

                    angular.forEach($scope.formulario, function(val, key) {

                        if (val.id == "nGuia") {

                            val.show = true;
                            val.validado = true;

                        }

                    })

                } else {

                    $scope.formulario[6].validado = true;
                    $scope.formulario[5].validado = false;
                    // $scope.formulario[7].validado = false;
                    angular.forEach($scope.formulario, function(val, key) {

                        if (val.id == "nGuia") {

                            val.show = false;
                            val.validado = false;

                        }

                    })

                }

            }



            $scope.generaGuia = function() {

                $rootScope.loader = true;
                var validado = false;
                var json = {};
                angular.forEach($scope.formulario, function(v, k) {

                    if (v.json) {

                        if (v.immybox) {

                            if ($('#' + v.id).immybox('getValue')[0]) {

                                if (Array.isArray($('#' + v.id).immybox('getValue')[0]))
                                    json[v.json] = $('#' + v.id).immybox('getValue')[0][0]
                                else
                                    json[v.json] = $('#' + v.id).immybox('getValue')[0]

                            } else if (v.validado) {

                                mensaje = v.label;
                                validado = true;

                            }

                        } else {

                            if (v.ngModel == '' && v.validado) {

                                mensaje = v.label;
                                validado = true;

                            } else {

                                if (v.type == 'date') {

                                    json[v.json] = $rootScope.formatFechaDB(v.ngModel, new Date());

                                } else {

                                    json[v.json] = v.ngModel;

                                }

                            }

                        }

                    }
                })

                if (validado) {

                    $rootScope.loader = false;
                    $rootScope.showM = true;
                    $rootScope.tipoMsg = 'ALERTA';
                    $rootScope.msg = [{ descripcion: mensaje, tipo: 'CAMPO VACIO' }]

                } else {

                    json.fechaRecalada = $rootScope.infoDescarga.fechaRecalada;
                    json.embarcacion = $rootScope.infoDescarga.embarcacion;
                    json.oc = $rootScope.infoDescarga.oc;
                    json.fechaDescarga = $rootScope.infoDescarga.fechaDescarga;
                    json.detalleGuia = [];

                    if (json.venta) {
                        json.venta = 1;
                        json.recepcionada = 1;
                        json.rutCliente = $scope.formVenta[0].ngModel;
                        json.nombreCliente = $scope.formVenta[1].ngModel;
                    } else {
                        json.venta = 0;
                    }

                    var dataPO_ITEMS = [];
                    if ($rootScope.infoDescarga.tipoDescarga == 1) {
                        var plantasAux = [];
                        var maxPosition = 0;

                        $http.get(IPSERVICIOSAPX + "JSON_BAPI_PO_GETDETAIL.ASPX?PEDIDO=" + $rootScope.infoDescarga.oc).then(function(data) {

                            dataPO_ITEMS = data.data.PO_ITEMS;
                            angular.forEach(data.data.PO_ITEMS, function(v, k) {

                                plantasAux.push(v.PLANT);
                                maxPosition = v.PO_ITEM;

                            })

                            if (plantasAux.indexOf(json.planta) == -1) {

                                $http.get("json/JSON_CHANGE_PO.json", { headers: { 'Content-Type': 'application/json; charset=UTF-8' } }).then(function(jsonResp) {

                                    var jsonChange = jsonResp.data;
                                    jsonChange.PARAMETROS.PEDIDO = $rootScope.infoDescarga.oc;
                                    jsonChange.PARAMETROS.MATERIALES.push({ ITEM: maxPosition + 10, COD: json.material, CANTIDAD: json.kilosEstimados, PLANTA: json.planta, LOTE: $rootScope.infoDescarga.lote });

                                    //console.log(JSON.stringify(jsonChange));

                                    $http.get(IPSERVICIOSAPX + "JSON_BAPI_PO_CHANGENewLine.aspx?PARAMETRO=" + JSON.stringify(jsonChange)).then(function(respChange) {

                                        if (respChange.data.RESULTADO_BAPI) {

                                            if (json.venta == 1) {
                                                $scope.RECEP_VENTA(json, dataPO_ITEMS);
                                            }
                                            $http.get(IPSERVICIOSBD + "guia/insertGuia?guia=" + JSON.stringify(json)).then(function(res) {

                                                if (res.data) {

                                                    $rootScope.tipoMsg = 'Guía de despacho emitida';
                                                    $scope.msg = [
                                                        { tipo: "Guía de despacho", descripcion: "N°: " + json.nGuia },
                                                        { tipo: "OC", descripcion: "N°: " + $rootScope.infoDescarga.oc }
                                                    ];
                                                    $scope.modalShow = true;


                                                } else {

                                                    $rootScope.loader = false;
                                                    $rootScope.tipoMsg = 'Error';
                                                    $rootScope.msg = [{ tipo: "Error en servicio JSON_BAPI_PO_GETDETAIL.ASPX", descripcion: error.statusText }]
                                                    $rootScope.showM = true;

                                                }
                                                $rootScope.loader = false;


                                            })

                                        }
                                        $rootScope.loader = false;


                                    })

                                })

                            } else {

                                $http.get(IPSERVICIOSBD + "guia/getToneladasByOC?oc=" + $rootScope.infoDescarga.oc).then(function(toneladas) {

                                    $http.get("json/JSON_CHANGE_PO.json", { headers: { 'Content-Type': 'application/json; charset=UTF-8' } }).then(function(jsonResp) {

                                        var jsonChange = jsonResp.data;
                                        jsonChange.PARAMETROS.PEDIDO = $rootScope.infoDescarga.oc;
                                        var item = 0;
                                        var totalPlanta = 0;
                                        var totalBD = 0;

                                        angular.forEach(dataPO_ITEMS, function(v, k) {

                                            if (v.PLANT == json.planta) {
                                                item = v.PO_ITEM;
                                                totalPlanta = v.QUANTITY;
                                            }

                                        })
                                        angular.forEach(toneladas.data, function(v, k) {

                                            if (v.planta == json.planta)
                                                totalBD = v.total;

                                        })
                                        if ((totalBD + json.kilosEstimados) > totalPlanta) {
                                            jsonChange.PARAMETROS.MATERIALES.push({ ITEM: item, COD: json.material, CANTIDAD: (totalBD + json.kilosEstimados), PLANTA: json.planta, LOTE: $rootScope.infoDescarga.lote });
                                        }
                                        //console.log(JSON.stringify(jsonChange));

                                        $http.get(IPSERVICIOSAPX + "JSON_BAPI_PO_CHANGENewLine.aspx?PARAMETRO=" + JSON.stringify(jsonChange)).then(function(respChange) {

                                            if (respChange.data.RESULTADO_BAPI) {

                                                if (json.venta == 1) {
                                                    $scope.RECEP_VENTA(json, dataPO_ITEMS);
                                                }
                                                $http.get(IPSERVICIOSBD + "guia/insertGuia?guia=" + JSON.stringify(json)).then(function(res) {

                                                    if (res.data) {

                                                        $rootScope.tipoMsg = 'Guía de despacho emitida';
                                                        $scope.msg = [
                                                            { tipo: "Guía de despacho", descripcion: "N°: " + json.nGuia },
                                                            { tipo: "OC", descripcion: "N°: " + $rootScope.infoDescarga.oc }
                                                        ];
                                                        $scope.modalShow = true;


                                                    } else {

                                                        $rootScope.loader = false;
                                                        $rootScope.tipoMsg = 'Error';
                                                        $rootScope.msg = [{ tipo: "Error en servicio JSON_BAPI_PO_GETDETAIL.ASPX", descripcion: error.statusText }]
                                                        $rootScope.showM = true;

                                                    }
                                                    $rootScope.loader = false;


                                                })

                                            }

                                        })

                                    })
                                })
                            }


                        })
                    } else {

                        $http.get(IPSERVICIOSBD + "guia/insertGuia?guia=" + JSON.stringify(json)).then(function(res) {

                            if (res.data) {

                                $rootScope.tipoMsg = 'Guía de despacho emitida';
                                $scope.msg = [
                                    { tipo: "Guía de despacho", descripcion: "N°: " + json.nGuia },
                                    { tipo: "OC", descripcion: "N°: " + $rootScope.infoDescarga.oc }
                                ];
                                $scope.modalShow = true;


                            } else {

                                $rootScope.loader = false;
                                $rootScope.tipoMsg = 'Error';
                                $rootScope.msg = [{ tipo: "Error en servicio JSON_BAPI_PO_GETDETAIL.ASPX", descripcion: error.statusText }]
                                $rootScope.showM = true;

                            }
                            $rootScope.loader = false;


                        })

                    }

                    /*if (json.venta == 1) {
                        if ($rootScope.infoDescarga.tipoDescarga == 1) {

                        } else {

                            $http.get("json/JSON_NOTIFICACION_MP_PROPIO.json", {
                                headers: { 'Content-Type': 'application/json; charset=UTF-8' }
                            }).then(function(resp) {

                                var jsonNot = resp.data;
                                var almacen = "";
                                var version = "";
                                angular.forEach($rootScope.dataProcedencia, function(v, k) {

                                    if (v[2].trim() == $rootScope.recepcionSeleccionada.embarcacion) {
                                        almacen = v[7];
                                        version = v[8];
                                    }

                                })
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
                                jsonNot.OBJETOENTRADA[0].PARAMETROS.DATAGEN.STORAGELOC = almacen;
                                jsonNot.OBJETOENTRADA[0].PARAMETROS.DATAGEN.PRODVERSION = version;

                                goodsmovements2.MATERIAL = [];
                                goodsmovements.MATERIAL = "6000138";
                                goodsmovements.PLANT = "1050";
                                goodsmovements.STGE_LOC = almacen;
                                goodsmovements.BATCH = "LOTE_UNICO";
                                goodsmovements.MOVE_TYPE = "";
                                goodsmovements.ENTRY_QNT = "0 ";
                                goodsmovements.ENTRY_UOM = "KG";
                                jsonNot.OBJETOENTRADA[0].PARAMETROS.GOODSMOVEMENTS.push(goodsmovements);

                                // angular.forEach($scope.recepciones, function(val, key) {


                                jsonNot.OBJETOENTRADA[1].PARAMETROS.CENTRO = "1500";
                                jsonNot.OBJETOENTRADA[1].PARAMETROS.CENTRO_DESTINO = "1050";
                                jsonNot.OBJETOENTRADA[1].PARAMETROS.FECHA = $rootScope.getFechaBapi();
                                jsonNot.OBJETOENTRADA[1].PARAMETROS.GUIA = $rootScope.recepcionSeleccionada.nGuia;
                                jsonNot.OBJETOENTRADA[1].PARAMETROS.ALMACEN = almacen;

                                jsonNot.OBJETOENTRADA[1].PARAMETROS.MATERIALES.push({
                                    CANTIDAD: $rootScope.recepcionSeleccionada.kilosEstimados,
                                    COD: $rootScope.recepcionSeleccionada.ocInfo.material,
                                    LOTE: $rootScope.recepcionSeleccionada.ocInfo.lote,
                                    ALMACENDESTINO: $("#pozos").immybox('getValue')[0] + " "
                                })


                                //jsonNot.OBJETOENTRADA[1].PARAMETROS.GOODSMOVEMENTS.push(goodsmovements2);
                                //})


                                //console.log(JSON.stringify(jsonNot));

                                // return;
                                $http.get(IPSERVICIOSAPX + "JSON_BAPI_REPMANCONF1_CREATE_MTS.aspx?PARAMETROS=" + JSON.stringify(jsonNot)).then(function(response) {

                                    var respuesta = JSON.parse(response.data.MENSAJES[1].MENSAJES);



                                    if (respuesta.DOCUMENTO > 0) {

                                        $scope.respCP = respuesta.DOCUMENTO;
                                        var guia = {};
                                        guia.id = $rootScope.recepcionSeleccionada.id;
                                        guia.kilosReales = $rootScope.recepcionSeleccionada.kilosReales;

                                        $http.get(IPSERVICIOSBD + "guia/recepcionar?guia=" + JSON.stringify(guia)).then(function(respo) {

                                            $rootScope.loader = false;
                                            $scope.showModal = true;

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
                    }*/
                }
            }

            $scope.venta = function() {

                if ($scope.formulario[2].ngModel) {

                    $scope.formVenta[0].show = true;
                    $scope.formVenta[1].show = true;
                    $scope.formulario[8].disabled = true;
                    $('#plantas').immybox('setValue', "1525");

                } else {
                    $scope.formVenta[0].show = false;
                    $scope.formVenta[1].show = false;
                    $scope.formulario[8].disabled = false;
                    $('#plantas').immybox('setValue', "");
                }

            }

            $scope.getDataCL = function() {
                $rootScope.loader = true;
                var rut = $scope.formVenta[0].ngModel;
                rut = rut.replace('.', '');
                $http.get(IPSERVICIOSAPX + "JSON_ZMOV_10009.aspx?RUT=" + rut).then(function(resp) {
                    console.log(resp);
                    angular.forEach(resp.data.LT_DETALLE, function(v, k) {
                        $scope.formVenta[1].ngModel = v.NAME1;
                    })
                    $rootScope.loader = false;
                })


            }
            $scope.RECEP_VENTA = function(json, dataPO_ITEMS) {

                $http.get("json/JSON_ENVIO_MP_COMPRADA.json", {
                    headers: { 'Content-Type': 'application/json; charset=UTF-8' }
                }).then(function(resp) {

                    var itemPO = 0;
                    angular.forEach(dataPO_ITEMS, function(v, k) {
                        if (v.PLANT == json.planta)
                            itemPO = v.PO_ITEM;
                    })
                    var jsonEnvio = resp.data;

                    jsonEnvio.OBJETOENTRADA[0].PARAMETROS.FECHA = $rootScope.getFechaBapi();
                    jsonEnvio.OBJETOENTRADA[0].PARAMETROS.MATERIALES.push({ COD: $rootScope.infoDescarga.material, CANTIDAD: json.kilosEstimados, POSICION: itemPO });
                    jsonEnvio.OBJETOENTRADA[0].PARAMETROS.PEDIDO = $rootScope.infoDescarga.oc;
                    jsonEnvio.OBJETOENTRADA[0].PARAMETROS.CENTRO = json.planta;
                    jsonEnvio.OBJETOENTRADA[0].PARAMETROS.ALMACEN = '01 ';
                    jsonEnvio.OBJETOENTRADA[0].PARAMETROS.GUIA = json.nGuia;

                    jsonEnvio.OBJETOENTRADA[1].PARAMETROS.LOTES.push({ LOTE: $rootScope.infoDescarga.lote });
                    jsonEnvio.OBJETOENTRADA[1].PARAMETROS.CARACTERISTICAS.push({ LOTE: $rootScope.infoDescarga.lote, CARACTERISTICA: 'ZPROCEDENMP', VALOR: 'COMP_ARTESANAL' });

                    jsonEnvio.OBJETOENTRADA[1].PARAMETROS.CARACTERISTICAS.push({ LOTE: $rootScope.infoDescarga.lote, CARACTERISTICA: 'ZEMBARCACION', VALOR: $rootScope.infoDescarga.embarcacion });
                    jsonEnvio.OBJETOENTRADA[1].PARAMETROS.CARACTERISTICAS.push({ LOTE: $rootScope.infoDescarga.lote, CARACTERISTICA: 'ZESPECIE', VALOR: 'especie' }); // ver como sacar la especie del immybox

                    console.log(IPSERVICIOSAPX + "JSON_RECEPCION_EX.aspx?PARAMETRO=" + JSON.stringify(jsonEnvio));


                    $http.get(IPSERVICIOSAPX + "JSON_RECEPCION_EX.aspx?PARAMETRO=" + JSON.stringify(jsonEnvio)).then(function(data) {

                        $rootScope.msg = [];
                        var errorPedido = [];
                        var conErr = 0;
                        try {
                            var result1 = JSON.parse(data.data.MENSAJES[0].MENSAJES);
                            var EXPPURCHASEORDER = result1.EXPPURCHASEORDER;
                            $scope.respCP = $rootScope.recepcionSeleccionada.oc;
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
                            var MATERIALDOCUMENT = result.MATERIALDOCUMENT;
                            //$scope.respCP = MATERIALDOCUMENT;

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
            }

            $scope.nuevaGuia = function() {

                $scope.modalShow = false;

                $scope.formulario = [

                    { ngModel: '', key: 'directo', label: 'DIRECTA', type: 'radio', validado: false, placeholder: '', value: '0', cabecera: true, immybox: false, name: 'trans', json: 'tipoTransporte' },
                    { ngModel: '1', key: 'camion', label: 'CAMIÓN', type: 'radio', validado: true, placeholder: '', value: '1', cabecera: true, immybox: false, name: 'trans', json: 'tipoTransporte' },
                    { ngModel: '0', key: 'Venta', label: 'Venta', type: 'checkbox', validado: false, placeholder: '', id: 'ventar', json: 'venta' },
                    { ngModel: '', key: 'embarcacion', label: 'Nombre Embarcación', type: 'label', validado: false, placeholder: '', value: $rootScope.infoDescarga.embarcacion, id: 'embarcacion' },
                    { ngModel: '', key: 'fechaRecalada', label: 'Fecha Recalada', type: 'label', validado: false, placeholder: '', value: $filter('formatFecha')($rootScope.infoDescarga.fechaRecalada), id: 'fechaRecalada' },
                    { ngModel: 'manual', key: 'manual', label: 'MANUAL', type: 'radio', validado: true, placeholder: '', value: 'manual', immybox: false, name: 'tipo', json: 'tipo' },
                    { ngModel: 'electronica', key: 'electronica', label: 'ELECTRONICA', type: 'radio', validado: true, placeholder: '', value: 'electronica', immybox: false, name: 'tipo', json: 'tipo' },
                    { ngModel: '', key: 'N° Guía', label: 'N° Guía', type: 'number', validado: false, placeholder: '', id: 'nGuia', immybox: false, show: false, json: 'nGuia' },
                    { ngModel: '', key: 'planta', label: 'Planta', type: 'text', validado: true, placeholder: '', id: 'plantas', immybox: true, show: true, json: 'planta' },
                    { ngModel: new Date(), key: 'fechaGuia', label: 'Fecha Guia', type: 'date', validado: true, placeholder: '', id: 'fechaGuia', immybox: false, json: 'fechaGuia' },
                    { ngModel: '', key: 'material', label: 'Material', type: 'text', validado: true, placeholder: '', id: 'materiales', disabled: true, show: true, immybox: true, json: 'material' },
                    { ngModel: parseFloat($rootScope.infoDescarga.toneladas), key: 'kilos', label: 'Kilos', type: 'number', validado: true, placeholder: '', id: 'kilos', immybox: false, show: true, json: 'kilosEstimados' },
                    { ngModel: '', key: 'romana', label: 'Romana', type: 'text', validado: true, placeholder: '', id: 'romana', immybox: true, show: true, json: 'romana' },
                    { ngModel: '', key: 'patente', label: 'Patente', type: 'text', validado: true, id: 'patente', immybox: true, json: 'patente', datosChofer: true, show: true },
                    { ngModel: '', key: 'nombreChofer', label: 'Nombre chofer', type: 'text', validado: true, id: 'nombreChofer', immybox: true, json: 'nombreChofer', datosChofer: true, show: true },
                    { ngModel: '', key: 'rutChofer', label: 'Rut Chofer', type: 'text', validado: true, id: 'rutChofer', immybox: true, json: 'rutChofer', datosChofer: true, show: true, disabled: true },

                ]
                $('#plantas').immybox('setValue', '');

            }

            $scope.aceptar = function() {

                $location.path("/descargasPendientes");

            }


        }
    ]

).filter('formatFecha', function() {
    return function(input) {
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