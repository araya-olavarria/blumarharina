MetronicApp.directive("ag1Form",function(){
    return{
        restrict: 'E',
        required:"",
        scope:{
            oform:'='
        },
        templateUrl: 'js/components/ag1Recepcion/template.html',
        controller: ['$scope','$http','$interval','$rootScope', function($scope,$http,$interval,$rootScope) {
            $scope.exit = function()
            {
               $rootScope.dialog.confirm({
                   title:"Alerta!!",
                   msje:"¿Esta seguro de cerrar sesión?",
                   ruta:"/login"
               }) 
            }
            $rootScope.fileData = [];
            $scope.uploadFile = function(files,item){
            	$rootScope.fileData=files[0];
            	console.log($rootScope.fileData);
            }
            function uploadFile(file,item){
        		console.log(file);
        	}
        }]
    };
});