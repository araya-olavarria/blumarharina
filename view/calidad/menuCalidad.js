angular.module('MetronicApp').controller('calidadController', ['$rootScope', '$scope', 'settings', '$http', '$sce', '$location',
    function($rootScope, $scope, settings, $http, $sce, $location) {

        $scope.redirect =function(ruta) {
            $location.path(ruta);
        }

        $scope.redirectToAceite = function() {
            $location.path("/aceiteCalidad");
        }

        $scope.redirectToProdInter = function() {
            $location.path("/prodIntermedioCl");
        }

    }
]);