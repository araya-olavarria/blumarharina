/* Setup blank page controller */
angular.module('MetronicApp').controller('descargaMP', ['$rootScope', '$scope', 'settings', '$http', '$sce', '$location', '$timeout',
        function($rootScope, $scope, settings, $http, $sce, $location, $timeout) {


            $rootScope.loader = true;
            $rootScope.infoDescarga = {};
            $scope.errores = [];

            $scope.embarcaciones = [];
            angular.forEach($rootScope.dataProcedencia, function(v, k) {

                if (v[3] == "A")
                    $scope.embarcaciones.push({ value: [v[2].trim(), v[1].trim()], text: v[2].trim() });

            })


            $scope.formulario = [

                { ngModel: '', key: 'propia', label: 'PROPIA', type: 'radio', validado: true, placeholder: '', value: '0', separador: true, immybox: false, name: 'tipo', json: 'tipoDescarga', error: { class: 'fa fa-exclamation-circle', show: false } },
                { ngModel: '1', key: 'terceros', label: 'TERCEROS', type: 'radio', validado: true, placeholder: '', value: '1', separador: true, immybox: false, name: 'tipo', json: 'tipoDescarga', error: { class: 'fa fa-exclamation-circle', show: false } },
                { ngModel: $('#embarcacion').immybox('getValue'), key: 'embarcacion', label: 'Nombre Embarcación', type: 'text', validado: true, placeholder: '', id: 'embarcacion', immybox: true, json: 'embarcacion', ngChange: 'getDataByEmbarcacion()', error: { class: 'fa fa-exclamation-circle', show: false } },
                { ngModel: '', key: 'proveedor', label: 'Armador', type: 'text', validado: true, placeholder: '', id: 'proveedores', immybox: true, disabled: false, json: 'proveedor', error: { class: 'fa fa-exclamation-circle', show: false } },
                { ngModel: '', key: 'Fecha Zarpe', label: 'Fecha Zarpe', type: 'date', validado: true, immybox: false, json: 'fechaZarpe', time: { ngModel: $rootScope.getTimeFormat(), key: 'tiempoZarpe', label: 'Hora Zarpe', type: 'time', validado: true }, error: { class: 'fa fa-exclamation-circle', show: false } },
                { ngModel: '', key: 'Comercializadora', label: 'Comercializadora', type: 'text', id: "comercializadora", validado: true, immybox: true, disabled: false, json: 'comercializadora', error: { class: 'fa fa-exclamation-circle', show: false } },
                { ngModel: '', key: 'Fecha Recalada', label: 'Fecha Recalada', type: 'date', validado: true, immybox: false, json: 'fechaRecalada', time: { ngModel: $rootScope.getTimeFormat(), key: 'tiempoRecalada', label: 'Hora Recalada', type: 'time', validado: true }, error: { class: 'fa fa-exclamation-circle', show: false } },
                { ngModel: '', key: 'Fecha Descarga', label: 'Fecha Descarga', type: 'date', validado: true, immybox: false, json: 'fechaDescarga', time: { ngModel: $rootScope.getTimeFormat(), key: 'tiempoDescarga', label: 'Hora Descarga', type: 'time', validado: true }, error: { class: 'fa fa-exclamation-circle', show: false } },
                { ngModel: '', key: 'muelle', label: 'Muelle Descarga', type: 'text', validado: true, placeholder: '', immybox: true, id: 'muelles', json: 'muelle', error: { class: 'fa fa-exclamation-circle', show: false } },
                { ngModel: '', key: 'nActivacion', label: 'N° Activación', type: 'text', validado: false, placeholder: '', immybox: false, id: 'nActivacion', json: 'nActivacion', error: { class: 'fa fa-exclamation-circle', show: false } },
                { ngModel: '', key: 'Material', label: 'Material', type: 'text', validado: true, placeholder: '', immybox: true, id: 'materiales', json: 'material', error: { class: 'fa fa-exclamation-circle', show: false } },
                { ngModel: '', key: 'kilos', label: 'Kilos Anunciados', type: 'text', validado: true, placeholder: '', id: 'kilos', immybox: false, json: 'toneladas', error: { class: 'fa fa-exclamation-circle', show: false } },
                { ngModel: '', key: 'planta', label: 'Planta', type: 'text', validado: true, placeholder: '', id: 'plantas', immybox: true, json: 'planta', error: { class: 'fa fa-exclamation-circle', show: false } },

            ];


            $scope.materialesJson = [];
            $scope.proveedores = [{ value: '01', text: 'Blumar S.A' }];
            $scope.plantas = [];


            $timeout(function() {

                $('#plantas').immybox({
                    choices: $rootScope.plantas
                });

                $('#materiales').immybox({
                    choices: $rootScope.materialesMP
                })

                $('#proveedores').immybox({
                    choices: $rootScope.proveedores
                });

                $('#muelles').immybox({
                    choices: $rootScope.muelles
                })

                $('#embarcacion').immybox({
                    choices: $scope.embarcaciones
                })

                /** */
                var input = $('#embarcacion');
                input.on('update', function(element, newValue) {
                    var choices = input.immybox('getChoices');

                    var filteredChoices = choices[0].filter(function(choice) {
                        return choice.value === newValue;
                    });
                    var choiceObject = filteredChoices.length > 0 ? filteredChoices[0] : null;


                    $http.get(IPSERVICIOSAPX + "JSON_RFC_READ_TABLE.aspx?TABLA=ZMOV_50001&SEPARADOR=;").then(function(response) {

                        var codArmador = 0;

                        var jsonForm = $rootScope.formToJSON($scope.formulario);
                        console.log(jsonForm);


                        if (jsonForm.tipoDescarga == 0) {

                            comercializadora = [{ value: '01', text: 'Blumar S.A' }]
                            $('#comercializadora').immybox('destroy');
                            $('#comercializadora').immybox({
                                choices: comercializadora
                            })
                            $('#proveedores').immybox('setValue', '01');
                            $('#comercializadora').immybox('setValue', '01');

                        } else {

                            comercializadora = [];
                            angular.forEach(response.data.DATA, function(val, key) {

                                console.log(choiceObject.value);

                                if (choiceObject.value[1] == val.WA[3]) {

                                    comercializadora.push({ value: val.WA[5].trim(), text: val.WA[7].trim() })
                                    codArmador = val.WA[5];

                                }

                            })
                            $('#comercializadora').immybox('destroy');
                            $('#comercializadora').immybox({
                                choices: comercializadora
                            })
                            $('#proveedores').immybox('setValue', codArmador);
                            $('#comercializadora').immybox('setValue', choiceObject.value[1]);
                        }

                    })



                });

                $rootScope.loader = false;

            }, 2000)

            $scope.tipoDescarga = function(tipo) {

                $scope.embarcaciones = [];
                $('#embarcacion').immybox('destroy');
                if (tipo == 0) {

                    $scope.formulario[1].ngModel = '';
                    $('#proveedores').immybox('setValue', 001);

                    angular.forEach($rootScope.dataProcedencia, function(v, k) {

                        if (v[3] == "P")
                            $scope.embarcaciones.push({ value: [v[2].trim(), v[1].trim()], text: v[2].trim() });

                    })


                    $('#embarcacion').immybox({
                        choices: $scope.embarcaciones
                    });
                    angular.forEach($scope.formulario, function(val, key) {

                        if (val.json == "comercializadora") {

                            val.ngModel = "BLUMAR S.A";
                            val.disabled = true;

                        }

                        if (val.json == "proveedor") {

                            val.disabled = true;

                        }

                    })

                    var propias = [];
                    angular.forEach($rootScope.materialesMP, function(v, k) {


                        if (v.text.includes('PROPIA') || v.text.includes('PROPIO')) {

                            propias.push({ value: v.value, text: v.text });

                        }


                    })

                    $('#materiales').immybox('destroy');
                    $('#materiales').immybox({
                        choices: propias
                    })


                } else {

                    $scope.formulario[0].ngModel = '';
                    $('#proveedores').immybox('setValue', '');
                    angular.forEach($rootScope.dataProcedencia, function(v, k) {

                        if (v[3] == "A")
                            $scope.embarcaciones.push({ value: [v[2].trim(), v[1].trim()], text: v[2].trim() });

                    })

                    $('#embarcacion').immybox({
                        choices: $scope.embarcaciones
                    });
                    angular.forEach($scope.formulario, function(val, key) {

                        if (val.json == "comercializadora") {

                            val.ngModel = "";
                            val.disabled = false;

                        }

                        if (val.json == "proveedor") {

                            val.disabled = false;

                        }

                    })


                    var comprado = [];
                    angular.forEach($rootScope.materialesMP, function(v, k) {


                        if (v.text.includes('COMPRADA') || v.text.includes('COMPRADO')) {

                            comprado.push({ value: v.value, text: v.text });

                        }


                    })

                    $('#materiales').immybox('destroy');
                    $('#materiales').immybox({
                        choices: comprado
                    })


                }

            }



            $scope.crearDescarga = function() {

                $rootScope.infoDescarga = {};
                $rootScope.loader = true;
                var validado = false;
                var mensaje = '';
                var json = {};
                angular.forEach($scope.formulario, function(v, k) {
                    if (v.validado) {

                        if (v.immybox) {

                            if ($('#' + v.id).immybox('getValue')[0]) {

                                if (Array.isArray($('#' + v.id).immybox('getValue')[0]))
                                    json[v.json] = $('#' + v.id).immybox('getValue')[0][0]
                                else
                                    json[v.json] = $('#' + v.id).immybox('getValue')[0]

                            }

                        } else {

                            if (v.ngModel != '') {

                                if (v.type == 'date') {

                                    json[v.json] = $rootScope.formatFechaDB(v.ngModel, v.time.ngModel);

                                } else {

                                    json[v.json] = v.ngModel;

                                }

                            } else {

                                if (!validado && v.json != "tipoDescarga") {

                                    mensaje = v.label;
                                    v.error.show = true;
                                    validado = true;

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

                    console.log(json);

                    $http.get(IPSERVICIOSBD + "descarga/getCorrelativo").then(function(correlativo) {


                        switch (json.tipoDescarga) {
                            case '0': //propia

                                json.estado = 0;
                                json.oc = 0;

                                var almacen = "";
                                var version = "";
                                angular.forEach($rootScope.dataProcedencia, function(v, k) {

                                    if (v[2].trim() == json.embarcacion) {
                                        almacen = v[7];
                                        version = v[8];
                                    }

                                })
                                json.lote = "RE" + $rootScope.pad(correlativo.data, 8, 0);
                                json.almacenEmbarcacion = almacen;
                                json.versionF = version;
                                $rootScope.infoDescarga = json;

                                $http.get(IPSERVICIOSBD + "descarga/insert?desc=" + JSON.stringify(json)).success(function(data) {

                                    if (data) {

                                        $scope.loader = false;
                                        $location.path('/guiaDespacho');

                                    } else {

                                        $rootScope.tipoMsg = 'Error';
                                        $rootScope.msg = [{ titulo: "Error al GUARDAR", descripcion: "Al guardar los datos, favor asegurese de haber completado todos los datos" }]
                                        $rootScope.showM = true;

                                    }

                                })

                                break;

                            case '1': //comprada

                                $http.get("json/JSON_CREATE_OC.json", { headers: { 'Content-Type': 'application/json; charset=UTF-8' } }).then(function(response) {

                                    var envio = response.data;
                                    envio.OBJETOENTRADA[0].PARAMETROS.FECHA = $rootScope.getFechaBapi(json.fechaRecalada);
                                    envio.OBJETOENTRADA[0].PARAMETROS.MATERIALES.push({ COD: json.material, CANTIDAD: json.toneladas });
                                    envio.OBJETOENTRADA[0].PARAMETROS.PRODUCTOR = json.proveedor;
                                    envio.OBJETOENTRADA[0].PARAMETROS.BATCH = "RE" + $rootScope.pad(correlativo.data, 8, 0);
                                    envio.OBJETOENTRADA[0].PARAMETROS.CENTRO = json.planta;

                                    $http.get(IPSERVICIOSAPX + "JSON_BAPI_PO_CREATE1.aspx?PARAMETRO=" + JSON.stringify(envio)).then(function(response) {

                                        $scope.errores = [];
                                        var errorPedido = [];
                                        var conErr = 0;
                                        try {
                                            var result1 = JSON.parse(response.data.MENSAJES[0].MENSAJES);
                                            var EXPPURCHASEORDER = result1.EXPPURCHASEORDER;

                                            if (response.data.MENSAJES[0].RESULTADO == false) {
                                                angular.forEach(result1.RETURN, function(val, key) {
                                                    if (val.TYPE == "E") {
                                                        $scope.errores.push({ tipo: "ERROR PEDIDO", descripcion: val.MESSAGE });
                                                        errorPedido.push([{ type: "label", value: "ERROR PEDIDO" }, { type: "label", value: val.MESSAGE }]);
                                                        conErr++;
                                                    }
                                                })
                                            }
                                        } catch (e) {
                                            conErr++;
                                        }

                                        try {

                                            var result = JSON.parse(response.data.MENSAJES[1].MENSAJES);
                                            var MATERIALDOCUMENT = result.MATERIALDOCUMENT;

                                            if (response.data.MENSAJES[1].RESULTADO == false) {
                                                angular.forEach(result.RETURN, function(val, key) {
                                                    if (val.TYPE == "E") {
                                                        $scope.errores.push({ tipo: "ERROR PEDIDO", descripcion: val.MESSAGE });
                                                        errorPedido.push([{ type: "label", value: "ERROR RECEPCIÓN CONTRA PEDIDO" }, { type: "label", value: val.MESSAGE }]);
                                                        conErr++;
                                                    }
                                                })
                                            }

                                        } catch (e) {
                                            conErr++;
                                        }

                                        if ($scope.errores.length > 0) {

                                            $rootScope.loader = false;
                                            $rootScope.tipoMsg = "ERROR";
                                            //$rootScope.msg = [];
                                            $rootScope.msg = $scope.errores;
                                            $rootScope.showM = true;


                                        } else {

                                            var respuesta = JSON.parse(response.data.MENSAJES[0].MENSAJES);

                                            if (respuesta.RESULTADO_BAPI) {

                                                json.estado = 0;
                                                json.oc = respuesta.EXPPURCHASEORDER;

                                                json.lote = "RE" + $rootScope.pad(correlativo.data, 8, 0);
                                                $rootScope.infoDescarga = json;

                                                $http.get(IPSERVICIOSBD + "descarga/insert?desc=" + JSON.stringify(json)).success(function(data) {

                                                    $rootScope.loader = false;
                                                    $location.path('/guiaDespacho');

                                                })

                                            }

                                        }

                                    }, function(error) {

                                        $rootScope.loader = false;
                                        $rootScope.tipoMsg = 'Error';
                                        $rootScope.msg = [{ tipo: "Error Servicio ASP", descripcion: error.statusText }]
                                        $rootScope.showM = true;

                                    })


                                }, function(error) {

                                    $rootScope.loader = false;
                                    $rootScope.tipoMsg = 'Error';
                                    $rootScope.msg = [{ tipo: "Error al cargar archivo JSLM_CREATE_OC.json", descripcion: error.statusText }]
                                    $rootScope.showM = true;


                                })

                                break;
                            default:
                                break;
                        }

                    }, function(error) {

                        console.log(error);

                    })
                }

            }

        }


    ]

);