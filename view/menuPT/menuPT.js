/* Setup blank page controller */
angular.module('MetronicApp').controller('menuTP', ['$rootScope', '$scope', 'settings', '$http', '$sce', '$location',
        function($rootScope, $scope, settings, $http, $sce, $location) {
            $scope.redirect = function(ruta) {
                $location.path(ruta);
                //mezclaPT
            }

            $scope.redirectToNotificar = function() {

                $location.path("/notificarPT");

            }

            $scope.redirectToAnular = function() {

                $location.path("/anularPT");

            }

            $scope.redirectToReproceso = function() {

                $location.path('/reprocesoPT');

            }

            $scope.redirectToAutorizar = function() {

                $location.path("/autorizar");

            }

        }
    ]

);