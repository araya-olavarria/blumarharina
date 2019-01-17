angular.module('MetronicApp').controller('aceiteController', ['$rootScope', '$scope', 'settings', '$http', '$sce', '$location',
    function($rootScope, $scope, settings, $http, $sce, $location) {

        $scope.redirect =function(ruta) {
            $location.path(ruta);
        }

        $scope.redirectToAguita = function() {
            $location.path("/aguaColaCl");
        }

        $scope.redirectToConcentrado = function() {
            $location.path("/concentradoCl");
        }

    }
]);