/* Setup blank page controller */
angular.module('MetronicApp').controller('recepcionSubp', ['$rootScope', '$scope', 'settings', '$http', '$sce', '$location',
        function($rootScope, $scope, settings, $http, $sce, $location) {

            $scope.redirectDescarte = function() {

                $location.path('/descarte');

            }

            $scope.redirectToSubproducto = function() {

                $location.path('/subproducto');

            }

        }
    ]

);