/* Setup blank page controller */
angular.module('MetronicApp').controller('notificarPT', ['$rootScope', '$scope', 'settings', '$http', '$sce', '$location',
        function($rootScope, $scope, settings, $http, $sce, $location) {

            $scope.redirectToPT = function() {

                //cordova.plugins.barcodeScanner.scan(function(result) {

                // alert(JSON.stringify(result));
                $location.path("/notificacionPT");

                //}, function(error) {

                // alert("Error: " + error);

                // })

            }

            $scope.redirectToMP = function() {

                $location.path("notificacionMP");

            }

            $scope.redirectToAceite = function() {

                $location.path("notificacionAceite");

            }

            $scope.redirectToSubproceso = function() {

                $location.path("/subprocesoPT");

            }

        }
    ]

);