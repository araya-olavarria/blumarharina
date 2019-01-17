MetronicApp.directive("ag1Popup", function() {
    return {
        restrict: 'E',
        scope: {
            opopup: '='
        },
        templateUrl: 'js/components/ag1Popup/popup2.html',
        controller: ['$scope', '$http', '$interval', '$rootScope', function($scope, $http, $interval, $rootScope) {
            // console.log($scope.opopup);

            $scope.$watch('config', function(newValue, oldValue) {
                $scope.opopup = {
                    show: false
                }
            }, true);
        }]
    };
});