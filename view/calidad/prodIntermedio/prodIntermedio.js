angular.module('MetronicApp').controller('prodIntermedioController', ['$rootScope', '$scope', 'settings', '$http', '$sce', '$location',
    function($rootScope, $scope, settings, $http, $sce, $location) {

        $rootScope.prodIntermedioName;
        $rootScope.prodIntermedioTipo;

        $scope.redirect =function(ruta) {
            $location.path(ruta);
        }

        $scope.redirectToHarina = function() {
            $rootScope.prodIntermedioName = "HARINA";
            $rootScope.prodIntermedioTipo = 'H';
            $location.path("/prodIntermBod");
        }

        $scope.redirectToTortaPrensa = function() {
            $rootScope.prodIntermedioName = "TORTA DE PRENSA";
            $rootScope.prodIntermedioTipo = 'P';
            $location.path("/prodIntermBod");
        }
        
        $scope.redirectToTortaDecanter = function() {
            $rootScope.prodIntermedioName = "TORTA DE DECANTER";
            $rootScope.prodIntermedioTipo = 'D';
            $location.path("/prodIntermBod");
        }

        $scope.redirectToSecadores = function() {
            $rootScope.prodIntermedioName = "SECADORES";
            $rootScope.prodIntermedioTipo = 'S';
            $location.path("/prodIntermBod");
        }
        
        $scope.redirectToEnfriadores = function() {
            $rootScope.prodIntermedioName = "ENFRIADORES";
            $rootScope.prodIntermedioTipo = 'E';
            $location.path("/prodIntermBod");
        }
        

    }
]);