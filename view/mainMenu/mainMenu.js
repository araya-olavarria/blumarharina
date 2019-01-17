/* Setup blank page controller */
angular.module('MetronicApp').controller('MainMenu', ['$rootScope', '$scope', 'settings', '$http', '$sce', '$location',
    function($rootScope, $scope, settings, $http, $sce, $location) {

        $scope.redirectToDescargaMP = function() {
            $location.path('/recepcionDescarga');
        }
        $scope.redirectToRecepcionMP = function() {
            $location.path('/recepcion');
        }
        $scope.redirectToPT = function() {
            $location.path('/menuPT');
        }
        $scope.redirectToAPP= function(path) {
            $location.path(path);
        }

        $scope.redirectToCalidad = function(path) {
            $location.path(path);
        }

    }
]);