/* Setup blank page controller */
angular.module('MetronicApp').controller('mezclaProcesoHUCTR', ['$rootScope', '$scope', 'settings', '$http', '$sce', '$location', function ($rootScope, $scope, settings, $http, $sce, $location) {
    console.log('ola ke ace')
    $scope.HU_GET = [];
    $scope.json_hu = '';
    $scope.JSON_=$rootScope.DATA_MEZCLA;
    if (!$rootScope.NEW) {
        var json_h = JSON.parse($scope.JSON_.json);
        $scope.HU_GET = json_h.item2;
    }
    $scope.VALIDATE_HU = function(hu){
        var bool = false;
        angular.forEach($scope.HU_GET,function(val,key){
            if(val.hu == hu){
                bool =true;
            }
        })

        return bool;
    }
    $scope.ADD_HU = function (item) {
        var json;
        json = JSON.parse(item)
        if($scope.VALIDATE_HU(json.lt + json.cr + json.pr + json.jl + json.an)){
            $rootScope.showM = true;
            $rootScope.tipoMsg = 'ALERTA';
            $rootScope.msg = [{ descripcion: 'YA SE ENCUENTRA LA HU', tipo: 'ERROR' }]
            $scope.json_hu = '';
            return;
        }
        $scope.HU_GET.push({
            id: $scope.HU_GET.length,
            lote: json.lt,
            cantidad: json.ct,
            correlativo: json.cr,
            porcion: json.pr,
            juliano: json.jl,
            anno: json.an,
            rechazo: json.rz,
            almacen: ((json.rz < 0) ? '03' : '04'),
            envase: json.ev,
            material: json.mt,
            hu: json.lt + json.cr + json.pr + json.jl + json.an
        })
        $scope.json_hu = '';
        console.log($scope.HU_GET);
    }
    $scope.scan = function () {
        $rootScope.loader = true;
        if (APPMOVIL) {
            cordova.plugins.barcodeScanner.scan(function (result) {
                try {
                    $scope.ADD_HU(result.text)
                } catch (error) {
                    alert(error);
                }
            }, function (error) {
                $rootScope.tipoMsg = 'Error';
                $rootScope.msg = [{ titulo: "Error", descripcion: "error" }]
                $rootScope.showM = true;
                //alert("Error: " + error);
            })

        } else {
            $rootScope.loader = false;
            $rootScope.tipoMsg = 'Error';
            $rootScope.msg = [{ titulo: "Funcionalidad de movilidad", descripcion: "La funcionalidad de escaner está disponible solamente en dispositivos moviles o pistolas" }]
            $rootScope.showM = true;

        }
    }
    $scope.DELETE_HU = function (x) {
        var idxAsignadoAux = 0;
        $scope.listaAsignadoAux = [];
        for (var aux = 0; aux < $scope.HU_GET.length; aux++) {
            if (x != $scope.HU_GET[aux].id) {
                $scope.listaAsignadoAux[idxAsignadoAux] = {
                    id: idxAsignadoAux,
                    lote: $scope.HU_GET[aux].lote,
                    cantidad: $scope.HU_GET[aux].cantidad,
                    correlativo: $scope.HU_GET[aux].correlativo,
                    porcion: $scope.HU_GET[aux].porcion,
                    juliano: $scope.HU_GET[aux].juliano,
                    anno: $scope.HU_GET[aux].anno,
                    rechazo: $scope.HU_GET[aux].rechazo,
                    almacen: $scope.HU_GET[aux].almacen,
                    envase: $scope.HU_GET[aux].envase,
                    material: $scope.HU_GET[aux].material,
                    hu: $scope.HU_GET[aux].hu
                };
                idxAsignadoAux++;
            }
        }
        $scope.HU_GET = [];
        $scope.HU_GET = $scope.listaAsignadoAux;
    }
    $scope.SAVE_HU = function(){
        if($scope.HU_GET.length==0){
            $rootScope.showM = true;
            $rootScope.tipoMsg = 'ALERTA';
            $rootScope.msg = [{ descripcion: 'AGREGAR AL MENOS UNA HU', tipo: 'ERROR' }]
            $scope.json_hu = '';
            return;
        }
        var json_2 = JSON.parse($scope.JSON_.json);
        json_2.item2 = $scope.HU_GET;
        $scope.JSON_.json = json_2;
        console.log($scope.JSON_);
        $rootScope.loader = true;
        var json_envio = { idmezclas: $scope.JSON_.idmezclas, centro: '1050', json: JSON.stringify($scope.JSON_.json), tipoConsulta: 'u' }
        $http.get(IPSERVICIOSBD + "mezclas/all?mezcla=" + JSON.stringify(json_envio)).then(function (resp) {
            $rootScope.loader = false;
            $location.path('/mezclaProcesoPT');
        })
    }
    $scope.MEZCLA_HU = function(){
        if($scope.HU_GET.length==0){
            $rootScope.showM = true;
            $rootScope.tipoMsg = 'ALERTA';
            $rootScope.msg = [{ descripcion: 'AGREGAR AL MENOS UNA HU', tipo: 'ERROR' }]
            $scope.json_hu = '';
            return;
        }
    }
}]);