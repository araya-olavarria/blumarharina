MetronicApp.directive("ag1Loading",function(){
    return{
        restrict: 'E',
        scope:{
            oloading:'='
        },
        templateUrl: 'js/components/ag1Loading/template.html',
        controller: ['$scope','$http','$interval','$rootScope', function($scope) {
            //console.log($scope);//$scope refers to scope of this perticular directive instance.
            $scope.$watch('config', function(newValue, oldValue) {
                //console.log($scope.Forms);

            }, true);
        }]
    };
});