/* Setup blank page controller */
angular.module('MetronicApp').controller('mezclaCTR', ['$rootScope', '$scope', 'settings', '$http', '$sce', '$location', function ($rootScope, $scope, settings, $http, $sce, $location) {

    $scope.loteconsumir = '';
    $scope.porcion = '';
    $scope.sumaKG = 0;
    $scope.lotesTabla = true;
    $scope.Mezcla;
    $scope.ActualizaKilos = function () {
        $scope.sumaKG = 0;
        angular.forEach($scope.Mezcla.item, function (v, k) {
            $scope.sumaKG = v.kg + $scope.sumaKG;
        })
    }
    if($rootScope.NEW){
        $scope.Mezcla = {
            cabecera: [
                { ngModel: '', key: '', label: 'Nº FOLIO', type: 'text', validado: true, placeholder: '', disabled: false },
                { ngModel: '', key: '', label: 'LOTE MEZCLA', type: 'text', validado: true, placeholder: '', fn: 'Get_Lote', disabled: false },
                { ngModel: '', key: '', label: 'PORCIÓN', type: 'text', validado: true, placeholder: '', disabled: false },
                { ngModel: '', key: '', label: 'MATERIAL', type: 'text', validado: false, placeholder: '', disabled: true },
                { ngModel: '', key: '', label: 'KG', type: 'text', validado: true, placeholder: '', disabled: false },
                { ngModel: '', key: '', label: 'EMPAQUE', type: 'text', validado: false, placeholder: '', disabled: true }
            ],
            item: []
        }
    }else{
        $scope.Mezcla = JSON.parse($rootScope.DATA_MEZCLA.json);
        if($scope.Mezcla.item.length > 0){$scope.lotesTabla = false;$scope.ActualizaKilos()}
    }
    
    $scope.fn = function (fn, datos) {
        if (fn == '') { return; }
        $scope[fn](datos);
    }
    $scope.Get_Lote = function (lote) {
        if (lote == '') { return; }
        $http.get("json/JSON_GET_DATA_MP.json").then(function (resp) {
            $rootScope.loader = true;
            var jsonEnvio = resp.data;
            jsonEnvio.PARAMETROS.PLANTA = "1050";
            jsonEnvio.PARAMETROS.LOTE = lote;
            $http.get(IPSERVICIOSAPX + "JSON_ZMOV_10001.aspx?PARAMETROS=" + JSON.stringify(jsonEnvio)).then(function (res) {
                //console.log(res.data)
                $rootScope.loader = false;
                if (res.data.STOCKLOTES.length > 0) {
                    $scope.Mezcla.cabecera[3].ngModel = res.data.STOCKLOTES[0].MATNR;
                    $http.get(IPSERVICIOSAPX + "JSON_ZMOV_10000.aspx?LOTE=" + lote + '&MAT=' + res.data.STOCKLOTES[0].MATNR).then(function (resChar) {
                        //console.log(resChar.data.CHAR_OF_BATCH)
                        angular.forEach(resChar.data.CHAR_OF_BATCH, function (ValCh, keyCh) {
                            if (ValCh.ATNAM == 'ZENVHU') {
                                $scope.Mezcla.cabecera[5].ngModel = ValCh.ATWTB
                            }
                        })
                    })
                } else {
                    $rootScope.showM = true;
                    $rootScope.tipoMsg = 'ALERTA';
                    $rootScope.msg = [{ descripcion: 'NO SE ENCONTRO LOTE', tipo: 'ERROR' }]
                }
            })
        })
    }
    $scope.AddLote = function (lote, porcion) {
        if (lote == '' || $scope.porcion == '') {
            $rootScope.showM = true;
            $rootScope.tipoMsg = 'ALERTA';
            $rootScope.msg = [{ descripcion: 'FAVOR DE INGRESAR LOTE Y PORCION', tipo: 'ERROR' }]
            return;
        }
        $http.get("json/JSON_GET_DATA_MP.json").then(function (resp) {
            $rootScope.loader = true;
            var jsonEnvio = resp.data;
            jsonEnvio.PARAMETROS.PLANTA = "1050";
            jsonEnvio.PARAMETROS.LOTE = lote;
            ////console.log(IPSERVICIOSAPX + "JSON_ZMOV_10001.aspx?PARAMETROS=" + JSON.stringify(jsonEnvio));
            $http.get(IPSERVICIOSAPX + "JSON_ZMOV_10001.aspx?PARAMETROS=" + JSON.stringify(jsonEnvio)).then(function (res) {
                //console.log(res.data)
                $rootScope.loader = false;
                if (res.data.STOCKLOTES.length > 0) {
                    $http.get(IPSERVICIOSAPX + "JSON_ZMOV_60001.aspx?LOTE=" + lote).then(function (respon) {
                        //console.log(respon);
                        $scope.loteconsumir = '';
                        //$scope.porcion = ''
                        var boolAux = false;
                        angular.forEach(respon.data.LT_DETALLES, function (val, key) {
                            console.log(val, $scope.porcion)
                            if (val.BKTXT == $scope.porcion) {
                                boolAux = true;
                            }
                        })
                        $scope.porcion = '';
                        if (boolAux) {
                            $scope.lotesTabla = false;
                            $scope.Mezcla.item.push({
                                idx: ($scope.Mezcla.item.length + 1),
                                lote: lote,
                                kg: res.data.STOCKLOTES[0].CLABS,
                                kg2: res.data.STOCKLOTES[0].CLABS,
                                porcion: porcion,
                            })
                            $scope.sumaKG = 0;
                            angular.forEach($scope.Mezcla.item, function (v, k) {
                                $scope.sumaKG = v.kg + $scope.sumaKG;
                            })
                        } else {
                            $rootScope.showM = true;
                            $rootScope.tipoMsg = 'ALERTA';
                            $rootScope.msg = [{ descripcion: 'LOTE NO POSEE PORCION', tipo: 'ERROR' }]
                        }
                    })
                } else {
                    $rootScope.showM = true;
                    $rootScope.tipoMsg = 'ALERTA';
                    $rootScope.msg = [{ descripcion: 'NO SE ENCONTRO LOTE', tipo: 'ERROR' }]
                }
            })
        })

    }
    $scope.deleteLotes = function (x) {
        //console.log(x)
        var idItem = 0;
        $scope.listaItem = [];
        for (var aux = 0; aux < $scope.Mezcla.item.length; aux++) {
            if (x != $scope.Mezcla.item[aux].idx) {
                $scope.listaItem[idItem] = {
                    idx: idItem,
                    lote: $scope.Mezcla.item[aux].lote,
                    kg: $scope.Mezcla.item[aux].kg,
                    porcion: '',
                    empaque: '',
                    material: ''
                };
                idItem++;
            }
        }
        $scope.Mezcla.item = [];
        $scope.Mezcla.item = $scope.listaItem;
        if ($scope.Mezcla.item.length == 0) { $scope.lotesTabla = true; }
    }
    $scope.SEND = function () {
        if ($scope.Mezcla.item.length == 0) {
            $rootScope.showM = true;
            $rootScope.tipoMsg = 'ALERTA';
            $rootScope.msg = [{ descripcion: 'Ingresar Lotes', tipo: 'CAMPO VACIO' }]
            return;
        }
        var auxMensaje = false;
        var mensaje = '';
        angular.forEach($scope.Mezcla.cabecera, function (v, k) {
            if (v.validado) {
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
        console.log($rootScope.DATA_MEZCLA)
        $rootScope.loader = true;
        var json_envio = { idmezclas: (($rootScope.NEW)?'':$rootScope.DATA_MEZCLA.idmezclas), centro: '1050', json: JSON.stringify($scope.Mezcla), tipoConsulta: (($rootScope.NEW)?'i':'u') }
        console.log(json_envio);
        console.log(IPSERVICIOSBD + "mezclas/all?mezcla=" + JSON.stringify(json_envio))
        $http.get(IPSERVICIOSBD + "mezclas/all?mezcla=" + JSON.stringify(json_envio)).then(function (resp) {
            console.log(resp.data)
            $rootScope.loader = false;
            $location.path('/mezclaProcesoPT');
        })

    }
}]);