/* Setup blank page controller */
angular.module('MetronicApp').controller('recepcion', ['$rootScope', '$scope', 'settings', '$http', '$sce', '$location',
        function($rootScope, $scope, settings, $http, $sce, $location) {

            $scope.redirectMP = function() {

                $location.path('/recepcionMP');

            }

            $scope.redirectToDescarteSub = function() {

                $location.path('/subproducto');

            }

        }
    ]

);