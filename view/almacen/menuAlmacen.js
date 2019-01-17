angular.module('MetronicApp').controller('menuAlmacenCTR', ['$rootScope', '$scope', 'settings', '$http', '$sce', '$location',
    function($rootScope, $scope, settings, $http, $sce, $location) {
        $scope.redirectTomezcla = function(path) {
            $location.path(path);
        }

    }
]);