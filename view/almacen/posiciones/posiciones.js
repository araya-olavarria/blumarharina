angular.module('MetronicApp').controller('posicionesCTR', ['$rootScope', '$scope', 'settings', '$http', '$sce', '$location', function ($rootScope, $scope, settings, $http, $sce, $location) {
    $scope.Pedido_venta = false;
    $rootScope.POSICIONES_JSON=[];
    $scope.Buscar_Pedido_Venta = function(){
        $scope.Pedido_venta = true;
        for(var i=0;i<2;i++){
            $rootScope.POSICIONES_JSON.push({material:'mat'+i,cantidad:i,lote:'LOTE'+(i+2)*3})
        }
    }
    $scope.HU_GET = [];
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
    $scope.CONTINUAR = function(){
        $location.path('/customerData');
    }
}]);