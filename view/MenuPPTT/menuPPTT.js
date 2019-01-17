/* Setup blank page controller */
angular.module('MetronicApp').controller('menuPPTT', ['$rootScope', '$scope', 'settings', '$http', '$sce', '$location',
    function($rootScope, $scope, settings, $http, $sce, $location) {

        $scope.redirectTomezcla = function() {
            $location.path('/mezcla');
        }

    }
]);