/* Setup blank page controller */
angular.module('MetronicApp').controller('recepcionMP', ['$rootScope', '$scope', 'settings', '$http', '$sce', '$location',
        function($rootScope, $scope, settings, $http, $sce, $location) {

            $scope.redirectToDirecta = function() {
                $rootScope.recepcionDirecta = {};
                $rootScope.recepcionCamion = undefined;
                $rootScope.titutoRecepcion = "RECEPCIÓN MP DIRECTA";
                $location.path('/listarRecepciones');
            }

            $scope.redirectToCamion = function() {
                $rootScope.recepcionCamion = {};
                $rootScope.recepcionDirecta = undefined;
                $rootScope.titutoRecepcion = "RECEPCIÓN MP CAMIÓN";
                $location.path('/listarRecepciones');
            }

        }
    ]

);