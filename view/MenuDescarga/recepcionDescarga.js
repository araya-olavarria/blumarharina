/* Setup blank page controller */
angular.module('MetronicApp').controller('recepcionDescarga', ['$rootScope', '$scope', 'settings', '$http', '$sce', '$location',
        function($rootScope, $scope, settings, $http, $sce, $location) {

            $scope.redirectToDescarga = function() {

                $location.path('/descarga');
                $rootScope.descarga = [];

            }

            $scope.redirectToModifica = function() {

                $location.path('/cierreDescarga');

            }

            $scope.redirectToDescargasPendientes = function() {

                $location.path("/descargasPendientes");

            }

        }
    ]

);