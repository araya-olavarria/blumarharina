MetronicApp.directive("ag1Bluetooth",function(){
    return{
        restrict: 'E',
        scope:{
            obluetooth:'='
        },
        templateUrl: 'js/components/ag1Bluetooth/template.html',
        controller: ['$scope','$http','$interval','$rootScope', function($scope) {
            $scope.$watch('config', function(newValue, oldValue) {
                //console.log($scope.Forms);
                try{onDeviceReady();}catch(e){console.log(e.message);};
                $scope.btGetKilos= function(tipo){
                    $scope.displayBt="block";
                    //alert(appConfig.blueTooth.data);
                }
            }, true);
        }]
    };
});