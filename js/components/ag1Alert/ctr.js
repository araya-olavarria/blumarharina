MetronicApp.directive("ag1Alert",function(){
    return{
        restrict: 'E',
        scope:{
            oalert:'='
        },
        templateUrl: 'js/components/ag1Alert/template.html',
        controller: ['$scope','$http','$interval','$rootScope', function($scope) {
            //console.log($scope);//$scope refers to scope of this perticular directive instance.
            $scope.$watch('config', function(newValue, oldValue) {
                //console.log($scope.Forms);
                
            }, true);
        }]
    };
});