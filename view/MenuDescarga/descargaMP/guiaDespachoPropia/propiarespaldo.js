/* Setup blank page controller */
angular.module('MetronicApp').controller('guiaDespachoPropia', ['$rootScope', '$scope', 'settings', '$http', '$sce', '$location', '$timeout', '$filter',
        function($rootScope, $scope, settings, $http, $sce, $location, $timeout, $filter) {

            $rootScope.loader = true;
            $scope.modalShow = false;
            var nombreEmbarcacion = "";

            if ($rootScope.ocSeleccionada) {

                $rootScope.infoDescarga = $rootScope.ocSeleccionada;

            }

            /*angular.forEach($rootScope.dataProcedencia, function(v, k) {

                if (v[1] == $rootScope.infoDescarga.embarcacion)
                    nombreEmbarcacion = v[2];

            })*/

            $scope.formulario = [

                { ngModel: '', key: 'directo', label: 'DIRECTA', type: 'radio', validado: true, placeholder: '', value: '0', separador: true, immybox: false, name: 'trans', json: 'tipoTransporte' },
                { ngModel: '', key: 'camion', label: 'CAMIÓN', type: 'radio', validado: true, placeholder: '', value: '1', separador: true, immybox: false, name: 'trans', json: 'tipoTransporte' },
                { ngModel: '', key: 'Venta', label: 'Venta', type: 'checkbox', validado: true, placeholder: '', id: 'ventar', json: 'venta' },
                { ngModel: '', key: 'embarcacion', label: 'Nombre Embarcación', type: 'label', validado: false, placeholder: '', value: $rootScope.infoDescarga.embarcacion, id: 'embarcacion' },
                { ngModel: '', key: 'fechaRecalada', label: 'Fecha Recalada', type: 'label', validado: false, placeholder: '', value: $filter('formatFecha')($rootScope.infoDescarga.fechaRecalada), id: 'fechaRecalada' },
                { ngModel: 'manual', key: 'manual', label: 'MANUAL', type: 'radio', validado: true, placeholder: '', value: 'manual', immybox: false, name: 'tipo', json: 'tipo' },
                { ngModel: 'electronica', key: 'electronica', label: 'ELECTRONICA', type: 'radio', validado: true, placeholder: '', value: 'electronica', immybox: false, name: 'tipo', json: 'tipo' },
                { ngModel: '', key: 'N° Guía', label: 'N° Guía', type: 'number', validado: true, placeholder: '', id: 'nGuia', immybox: false, show: false, json: 'nGuia' },
                { ngModel: '', key: 'planta', label: 'Planta', type: 'text', validado: true, placeholder: '', id: 'plantas', immybox: true, show: true, json: 'planta' },
                { ngModel: new Date(), key: 'fechaGuia', label: 'Fecha Guia', type: 'date', validado: true, placeholder: '', id: 'fechaGuia', immybox: false, json: 'fechaGuia' },
                { ngModel: '', key: 'material', label: 'Material', type: 'text', validado: true, placeholder: '', id: 'materiales', disabled: true, show: true, immybox: true, json: 'material' },
                { ngModel: parseFloat($rootScope.infoDescarga.toneladas), key: 'kilos', label: 'Kilos', type: 'number', validado: true, placeholder: '', id: 'kilos', immybox: false, show: true, json: 'kilosEstimados' },
                { ngModel: '', key: 'romana', label: 'Romana', type: 'text', validado: true, placeholder: '', id: 'romana', immybox: false, show: true, json: 'romana' },
                { ngModel: '', key: 'patente', label: 'Patente', type: 'text', validado: true, id: 'patente', immybox: true, json: 'patente', datosChofer: true, show: false },
                { ngModel: '', key: 'nombreChofer', label: 'Nombre chofer', type: 'text', validado: true, id: 'nombreChofer', immybox: true, json: 'nombreChofer', datosChofer: true, show: false },
                { ngModel: '', key: 'rutChofer', label: 'Rut Chofer', type: 'text', validado: true, id: 'rutChofer', immybox: true, json: 'rutChofer', datosChofer: true, show: false, disabled: true },

            ]


            $timeout(function() {

                console.log($rootScope.infoDescarga);

                $('#plantas').immybox({
                    choices: $rootScope.plantas
                });

                $('#materiales').immybox({
                    choices: $rootScope.materialesPT
                })

                $('#materiales').immybox('setValue', $rootScope.infoDescarga.material);
                $('#plantas').immybox('setValue', $rootScope.infoDescarga.planta);

                var patentes = [];
                var choferes = [];
                var ruts = [];
                angular.forEach($rootScope.dataConductores, function(v, k) {

                    patentes.push({ value: [v[3], v[2]], text: v[3] });
                    choferes.push({ value: [v[4], v[2]], text: v[4] });
                    ruts.push({ value: v[2], text: v[2] });

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

                var input = $('#patente');
                input.on('update', function(element, newValue) {
                    $('#nombreChofer').immybox('destroy');
                    var choices = input.immybox('getChoices');
                    var filteredChoices = choices[0].filter(function(choice) {
                        return choice.value === newValue;
                    });
                    choferes = [];
                    angular.forEach($rootScope.dataConductores, function(v, k) {


                        if (v[2] == filteredChoices[0].value[1])
                            choferes.push({ value: [v[4], v[2]], text: v[4] });

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

                    $('#rutChofer').immybox('setValue', filteredChoices[0].value[1]);

                })
                $rootScope.loader = false;

            }, 2000)

            $scope.changeTransporte = function(item) {

                if (item.value == "1") {

                    angular.forEach($scope.formulario, function(v, k) {

                        if (v.datosChofer) {

                            v.show = true;


                        }

                    })

                } else {

                    angular.forEach($scope.formulario, function(v, k) {

                        if (v.datosChofer) {

                            v.show = false;


                        }

                    })

                }

            }

            $scope.changeType = function(item) {

                if (item.value == "manual") {

                    angular.forEach($scope.formulario, function(val, key) {

                        if (val.id == "nGuia") {

                            val.show = true;

                        }

                    })

                } else {

                    angular.forEach($scope.formulario, function(val, key) {

                        if (val.id == "nGuia") {

                            val.show = false;

                        }

                    })

                }

            }

            $scope.generaGuia = function() {

                $rootScope.loader = true;
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

                                    json[v.json] = $rootScope.formatFechaDB(v.ngModel, new Date());

                                } else {

                                    json[v.json] = v.ngModel;

                                }

                            }

                        }



                    }
                })

                json.fechaRecalada = $rootScope.infoDescarga.fechaRecalada;
                json.embarcacion = $rootScope.infoDescarga.embarcacion;
                json.oc = 0;
                json.fechaDescarga = $rootScope.infoDescarga.fechaDescarga;
                json.detalleGuia = [];

                $http.get(IPSERVICIOSBD + "guia/insertGuia?guia=" + JSON.stringify(json)).then(function(res) {

                    if (res.data) {

                        $rootScope.tipoMsg = 'Guía de despacho emitida';
                        $scope.msg = [
                            { tipo: "Guía de despacho", descripcion: "N°: " + json.nGuia }
                        ]
                        $rootScope.loader = false;
                        $scope.modalShow = true;

                    }


                }, function(error) {

                    console.log(error);
                    $rootScope.loader = false;
                    $rootScope.tipoMsg = 'Error';
                    $rootScope.msg = [{ tipo: "Error al insertar Guía", descripcion: error.statusText }]
                    $rootScope.showM = true;

                })



            }

            $scope.nuevaGuia = function() {

                $scope.modalShow = false;

                $scope.formulario = [

                    { ngModel: '', key: 'directo', label: 'DIRECTA', type: 'radio', validado: true, placeholder: '', value: '0', separador: true, immybox: false, name: 'trans', json: 'tipoTransporte' },
                    { ngModel: '', key: 'camion', label: 'CAMIÓN', type: 'radio', validado: true, placeholder: '', value: '1', separador: true, immybox: false, name: 'trans', json: 'tipoTransporte' },
                    { ngModel: '', key: 'Venta', label: 'Venta', type: 'checkbox', validado: true, placeholder: '', id: 'ventar', json: 'venta' },
                    { ngModel: '', key: 'embarcacion', label: 'Nombre Embarcación', type: 'label', validado: false, placeholder: '', value: $rootScope.infoDescarga.embarcacion, id: 'embarcacion' },
                    { ngModel: '', key: 'fechaRecalada', label: 'Fecha Recalada', type: 'label', validado: false, placeholder: '', value: $filter('formatFecha')($rootScope.infoDescarga.fechaRecalada), id: 'fechaRecalada' },
                    { ngModel: '', key: 'manual', label: 'MANUAL', type: 'radio', validado: true, placeholder: '', value: 'manual', immybox: false, name: 'tipo', json: 'tipo' },
                    { ngModel: '', key: 'electronica', label: 'ELECTRONICA', type: 'radio', validado: true, placeholder: '', value: 'electronica', immybox: false, name: 'tipo', json: 'tipo' },
                    { ngModel: '', key: 'N° Guía', label: 'N° Guía', type: 'number', validado: true, placeholder: '', id: 'nGuia', immybox: false, show: false, json: 'nGuia' },
                    { ngModel: '', key: 'planta', label: 'Planta', type: 'text', validado: true, placeholder: '', id: 'plantas', immybox: true, show: true, json: 'planta' },
                    { ngModel: new Date(), key: 'fechaGuia', label: 'Fecha Guia', type: 'date', validado: true, placeholder: '', id: 'fechaGuia', immybox: false, json: 'fechaGuia' },
                    { ngModel: '', key: 'material', label: 'Material', type: 'text', validado: true, placeholder: '', id: 'materiales', disabled: true, show: true, immybox: true, json: 'material' },
                    { ngModel: '', key: 'kilos', label: 'Kilos', type: 'number', validado: true, placeholder: '', id: 'kilos', immybox: false, show: true, json: 'kilosEstimados' },
                    { ngModel: '', key: 'romana', label: 'Romana', type: 'text', validado: true, placeholder: '', id: 'romana', immybox: false, show: true, json: 'romana' },

                ]
                $('#plantas').immybox('setValue', '');

            }

            $scope.aceptar = function() {

                $location.path("/mainMenu");

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