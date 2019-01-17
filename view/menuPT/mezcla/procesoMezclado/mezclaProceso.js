/* Setup blank page controller */
angular.module('MetronicApp').controller('mezclaProcesoCTR', ['$rootScope', '$scope', 'settings', '$http', '$sce', '$location', function ($rootScope, $scope, settings, $http, $sce, $location) {
    $scope.Mezcla = [];
    $scope.Datos_Mezclas = [];
    $scope.Request_mezclas = function () {
        $http.get(IPSERVICIOSBD + "mezclas/all?mezcla={idmezclas: '',centro: '1050',json: '',tipoConsulta: 's' }").then(function (resp) {
            $scope.Mezcla = [];
            $scope.Datos_Mezclas = [];
            angular.forEach(resp.data.data, function (v, k) {
                $scope.Mezcla.push(JSON.parse(v.json));
            })
            $scope.Datos_Mezclas = resp.data.data;
        });
    }
    $scope.Request_mezclas();
    $scope.DELETE = function (i) {

        $rootScope.loader = true;
        $http.get(IPSERVICIOSBD + "mezclas/all?mezcla={idmezclas: '" + $scope.Datos_Mezclas[i].idmezclas + "',centro: '1050',json: '',tipoConsulta: 'd' }").then(function (resp) {
            $rootScope.loader = false;
            $rootScope.showM = true;
            $rootScope.tipoMsg = 'ALERTA';
            $rootScope.msg = [{ descripcion: resp.data.mensaje, tipo: 'MENSAJE' }]
            $scope.Request_mezclas();
        });
    }
    $scope.UPDATE = function (i) {
        $rootScope.NEW = false;
        $rootScope.DATA_MEZCLA = $scope.Datos_Mezclas[i];
        $location.path('/mezclaPT');
    }
    $scope.MEZCLA_GO = function (i) {
        if ($scope.Mezcla[i].item2) {
            $rootScope.NEW = false;
        } else {
            $rootScope.NEW = true;
        }
        $rootScope.DATA_MEZCLA = $scope.Datos_Mezclas[i];
        $location.path('/mezclaProcesoHUPT');
    }
    $scope.addMezcla = function (ruta) {
        $rootScope.NEW = true;
        $location.path(ruta);
    }
}]);