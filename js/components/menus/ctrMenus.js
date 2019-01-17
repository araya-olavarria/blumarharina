MetronicApp.directive("tgMenus",function(){
    return{
        restrict: 'E',
        scope:{
            omenus:'='
        },
        templateUrl: 'js/components/menus/menus.html',
        controller: ['$scope','$http','$interval','$rootScope', function($scope,$http,$interval,$rootScope) {
            $scope.exit = function()
            {
               $rootScope.dialog.confirm({
                   title:"Alerta!!",
                   msje:"¿Esta seguro de cerrar sesión?",
                   ruta:"/login"
               }) 
            }
            $scope.$watch('config', function(newValue, oldValue) {
                
            }, true);
        }]
    };
});