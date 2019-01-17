angular.module('MetronicApp').controller('customerDataCTR', ['$rootScope', '$scope', 'settings', '$http', '$sce', '$location', function ($rootScope, $scope, settings, $http, $sce, $location) {
    $rootScope.Formulario = [];
    $scope.Customer_data = false;
    for (var i = 0; i < 10; i++) {
        $rootScope.Formulario.push({ ngModel: '', key: '', label: 'imput' + i, type: 'text', validado: true, placeholder: '', disabled: false })
    }
    $scope.RESUMEN = function () {
        $scope.Customer_data = true;
    }
    $scope.ENVIO = function () {
        $rootScope.showM = true;
        $rootScope.tipoMsg = 'MENSAJE';
        $rootScope.msg = [{ descripcion: 'NADA', tipo: 'AVISO' }];
        $rootScope.IR_MSG = '/menuAlmacen';
    }
}]);