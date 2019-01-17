/* Setup blank page controller */
angular.module('MetronicApp').controller('resumenDescarga', ['$rootScope', '$scope', 'settings', '$http', '$sce', '$location',
        function($rootScope, $scope, settings, $http, $sce, $location) {


            $scope.folioSerna = $rootScope.infoDescarga.folioSerna;
            $scope.fechaRecalada = $rootScope.infoDescarga.fechaRecalada;
            $scope.fechaDescarga = $rootScope.infoDescarga.fechaDescarga;
            $scope.rutDestino = $rootScope.infoDescarga.rutDestino;
            $scope.proveedor = $rootScope.infoDescarga.proveedor.nombre;
            $scope.embarcacion = $rootScope.infoDescarga.embarcacion;
            $scope.material = $rootScope.infoDescarga.material;
            $scope.toneladas = $rootScope.infoDescarga.toneladas;
            $scope.romana = $rootScope.infoDescarga.romana;
            $scope.planta = $rootScope.infoDescarga.planta;



        }
    ]

);