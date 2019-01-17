/* Setup blank page controller */
angular.module('MetronicApp').controller('migo', ['$rootScope', '$scope', 'settings', '$http', '$sce', '$location', function($rootScope, $scope, settings, $http, $sce, $location) {
    //var kilosSelec = $rootScope.seleccionCierre.toneladas;
    var prefijosPlant = [
        { planta: 1000, pref: 'TA', descripcion: 'Talcahuano' }, { planta: 1010, pref: 'CH', descripcion: 'Chonchi' },
        { planta: 1020, pref: 'CO', descripcion: 'Coronel' }, { planta: 1030, pref: 'CR', descripcion: 'Coronel' },
        { planta: 1040, pref: 'RO', descripcion: 'Rocuant' }, { planta: 1050, pref: 'SV', descripcion: 'San Vicente' },
        { planta: 1060, pref: 'CG', descripcion: 'Congelado' }, { planta: 1070, pref: 'MR', descripcion: 'Merluza' },
        { planta: 1080, pref: 'SR', descripcion: 'SALMON ROCUANT' }, { planta: 1090, pref: 'SC', descripcion: 'Salmon SV' },
        { planta: 1100, pref: 'MQ', descripcion: 'MAQUILAS' }, { planta: 1200, pref: 'PT', descripcion: 'PT' },
        { planta: 1300, pref: 'PC', descripcion: 'PT CONGELADO' }, { planta: 1350, pref: 'R1', descripcion: 'REFINACION 1' },
        { planta: 1360, pref: 'R2', descripcion: 'REFINACION 2' }, { planta: 1370, pref: 'RT', descripcion: 'REFINACION TALCAHUANO' },
        { planta: 1400, pref: 'PU', descripcion: 'PUERTOS' }, { planta: 1500, pref: 'FL', descripcion: 'FLOTAS' },
        { planta: 1525, pref: 'AR', descripcion: 'ARTESANAL' }, { planta: 1550, pref: 'FA', descripcion: 'F ARRASTRE' },
        { planta: 1580, pref: 'CB', descripcion: 'CABOTAJE' }, { planta: 1600, pref: 'AP', descripcion: 'BCM APANADOS' },
        { planta: 1610, pref: 'CH', descripcion: 'BCM CHONCHI' }, { planta: 1620, pref: 'BC', descripcion: 'BCM COLON' },
        { planta: 1630, pref: 'CC', descripcion: 'BMCCORONEL' }, { planta: 1640, pref: 'MC', descripcion: 'BCMCORRAL' },
        { planta: 1650, pref: 'IS', descripcion: 'BMC ISLA ROCUAN' }, { planta: 1660, pref: 'SM', descripcion: 'BCM SAN VICENTE' },
        { planta: 1700, pref: 'AD', descripcion: 'ADMINISTRACION' }

    ];
    var caractPadre = {};
    var nAcomp = [];
    var kilosSelec = $rootScope.Formulario[11].ngModel;

    $scope.materiales = [];
    angular.forEach($rootScope.materialesJson, function(val, key) {
        $scope.materiales.push({
            codMaterial: val.id,
            material: val,
            porcentaje: 0,
            kilos: 0
        })
    })
    $scope.Porsentaje = 0;
    $scope.calculaKilos = function(material, index) {
        if ($scope.materiales[index].porcentaje > 0) {
            $scope.materiales[index].kilosedit = (kilosSelec * (material.porcentaje / 100));
            $scope.Porsentaje = 0;
            angular.forEach($scope.materiales, function(v, k) {
                    $scope.Porsentaje = v.porcentaje + $scope.Porsentaje;
                })
                //$scope.Porsentaje = $scope.materiales[index].porcentaje + $scope.Porsentaje;
            console.log($scope.Porsentaje)
            if ($scope.Porsentaje > 100 || $scope.Porsentaje < 0) {
                $rootScope.showM = true;
                $rootScope.tipoMsg = 'ALERTA';
                $rootScope.msg = [{ descripcion: 'El porcentaje esta fuera de los rangos', tipo: 'ERROR' }];
                $scope.materiales[index].porcentaje = 0;
                $scope.materiales[index].kilosedit = 0;
                $scope.Porsentaje = 0;
                angular.forEach($scope.materiales, function(v, k) {
                    $scope.Porsentaje = v.porcentaje + $scope.Porsentaje;
                })
            }
        } else {
            $rootScope.showM = true;
            $rootScope.tipoMsg = 'ALERTA';
            $rootScope.msg = [{ descripcion: 'Porcentaje debe ser mayor a 0', tipo: 'ERROR' }];
            $scope.materiales[index].porcentaje = 0;
            $scope.materiales[index].kilosedit = 0;
        }
    }
    $scope.getData = function(x) {
            var dato = '';
            console.log(x.type);
            if (x.type == 'date' || x.type == 'time') { var item = new Date(x.ngModel); }
            switch (x.type) {
                case 'text':
                    dato = x.ngModel;
                    break;
                case 'number':
                    dato = x.ngModel;
                    break;
                case 'select':
                    dato = x.ngModel.key;
                    break;
                case 'date':
                    //132855
                    var year = item.getFullYear().toString();
                    var month = ((item.getMonth() + 1) < 10) ? '0' + (item.getMonth() + 1).toString() : (item.getMonth() + 1).toString();
                    var day = (item.getDate() < 10) ? '0' + item.getDate().toString() : item.getDate().toString();
                    dato = day + month + year;
                    break;
                case 'time':
                    var hh = (item.getHours() < 10) ? '0' + item.getHours().toString() : item.getHours().toString();
                    var mm = (item.getMinutes() < 10) ? '0' + item.getMinutes().toString() : item.getMinutes().toString();
                    var ss = (item.getSeconds() < 10) ? '0' + item.getSeconds().toString() : item.getSeconds().toString();
                    dato = hh + mm + ss
                    break;
            }
            return dato;
        }
        //JSON_RECEPCION_EX movimiento 101 ->
    $scope.redirectToResumen = function() {
        if ($scope.Porsentaje != 100) {
            $rootScope.showM = true;
            $rootScope.tipoMsg = 'ALERTA';
            $rootScope.msg = [{ descripcion: 'Asignar el 100% de los kilos', tipo: 'ERROR' }];
            return;
        }
        $scope.ESPECIE = '';
        angular.forEach($rootScope.materialesMP, function(v, k) {
            if ($rootScope.seleccionCierre.material == v.value) {
                $scope.ESPECIE = v.especie;
            }
        })
        var json = {
            "BAPI": "BAPI_ACTUALIZA_LOTE",
            "RUNTEST": "false",
            "PARAMETROS": {
                "LOTES": [{
                    "LOTE": $rootScope.seleccionCierre.lote,
                    "MATERIAL": $rootScope.seleccionCierre.material
                }],
                "CARACTERISTICAS": [{
                        "LOTE": $rootScope.seleccionCierre.lote,
                        "CARACTERISTICA": 'ZESPECIE',
                        "VALOR": $scope.ESPECIE
                    },
                    {
                        "LOTE": $rootScope.seleccionCierre.lote,
                        "CARACTERISTICA": 'ZEMBARCACION',
                        "VALOR": $rootScope.seleccionCierre.embarcacion
                    },
                    {
                        "LOTE": $rootScope.seleccionCierre.lote,
                        "CARACTERISTICA": 'ZFECHARECAL',
                        "VALOR": $scope.getData({ type: 'date', ngModel: $rootScope.seleccionCierre.fechaRecalada })
                    },
                    {
                        "LOTE": $rootScope.seleccionCierre.lote,
                        "CARACTERISTICA": 'ZHORARECAL',
                        "VALOR": $scope.getData({ type: 'time', ngModel: $rootScope.seleccionCierre.fechaRecalada })
                    },
                    {
                        "LOTE": $rootScope.seleccionCierre.lote,
                        "CARACTERISTICA": 'ZHORAINICIODES',
                        "VALOR": $scope.getData({ type: 'time', ngModel: $rootScope.seleccionCierre.fechaDescarga })
                    }
                ]
            }
        }
        angular.forEach($rootScope.Formulario, function(v, k) {
            if (v.key != '') {
                json.PARAMETROS.CARACTERISTICAS.push({
                    "LOTE": $rootScope.seleccionCierre.lote,
                    "CARACTERISTICA": v.key,
                    "VALOR": $scope.getData(v)
                })
            }
        })
        angular.forEach($scope.materiales, function(v, key) {

            json.PARAMETROS.CARACTERISTICAS.push({
                "LOTE": $rootScope.seleccionCierre.lote,
                "CARACTERISTICA": v.codMaterial,
                "VALOR": v.porcentaje
            })

            caractPadre.push({
                "LOTE": $rootScope.seleccionCierre.lote,
                "CARACTERISTICA": v.codMaterial,
                "VALOR": v.porcentaje
            })
            if (v.porcentaje > 0) {
                nAcomp[v.codMaterial] = v.porcentaje;
            }
        })
        console.log(json);
        $rootScope.loader = true;
        $http.get(IPSERVICIOSAPX + "JSON_ZMOV_40003.aspx?PARAMETRO=" + JSON.stringify(json)).success(function(data) {
            $rootScope.loader = false;
            console.log(data);
            if (data.RETURN_MODCARACT.length > 0) {
                $rootScope.showM = true;
                $rootScope.tipoMsg = 'ALERTA';
                $rootScope.msg = [];
                var error = 0;
                angular.forEach(data.RETURN_MODCARACT, function(v, k) {
                    $rootScope.msg.push({ descripcion: v.MESSAGE, tipo: 'Type: ' + v.TYPE })
                    if (v.TYPE == "E")
                        error++;
                })

                if (error == 0) {

                    if (nAcomp > 0) {
                        angular.forEach(json, function(val, key) {

                        })
                    }

                }
                //$scope.Other_Mov();
            }
        })
    }
    $scope.Other_Mov = function() {
            if ($rootScope.Formulario[11].ngModel < $rootScope.seleccionCierre.toneladas) {
                console.log('Real es menor D: ' + $rootScope.Formulario[11].ngModel + ' < ' + $rootScope.seleccionCierre.toneladas);
            }
        }
        // $scope.Other_Mov();
}]);