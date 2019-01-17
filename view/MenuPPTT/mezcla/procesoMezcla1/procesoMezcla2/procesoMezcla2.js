/* Setup blank page controller */
angular.module('MetronicApp').controller('procesoMezcla2', ['$rootScope', '$scope', 'settings', '$http', '$sce', '$location',
    function ($rootScope, $scope, settings, $http, $sce, $location) {

        $scope.bloqueado = true;
        $scope.mostrarCheckbox = false;
        $scope.bloqueoLote = false;
        $scope.revisarsipasa = true;
        $scope.listaLote = [];
 
        $scope.formulario = [

            { ngModel: '', id: 'hu', key: 'numeroFolio', label: 'numeroFolio', type: 'number', validado: true, immybox: true, cabecera: true, json: 'numeroFolio', tabla: false, show: true },
            { ngModel: '', id: 'lote', key: 'codigoLote', label: 'codigoLote', type: 'text', validado: true, immybox: true, cabecera: true, json: 'codigoLote', tabla: false, show: true },
            { ngModel: '', id: 'porcion', key: 'porcion', label: 'porcion', type: 'text', validado: true, immybox: true, cabecera: true, json: 'porcion', tabla: false, show: true },
            { ngModel: '', id: 'Empaque', key: 'Empaque', label: 'Empaque', type: 'text', validado: true, immybox: true, cabecera: true, json: 'Empaque', tabla: false, show: true },
            { ngModel: '', id: 'material', key: 'material', label: 'Material', type: 'text', validado: true, immybox: true, name: 'material', cabecera: true, tabla: true, json: 'material', show: true }

        ];

        // $scope.clickCargarLote = function () {
        //     $scope.errores = [];
        //     angular.forEach($scope.formulario,function (v,k) {
        //         if ( v.ngModel=='' ) {
                  
        //             $scope.errores.push(v.label);

        //         }                
            
                
        //     });
        
        //    console.log($scope.errores);
           
        // }

        $scope.btnGuardarPag3 = function () {
            
            
        }
        $scope.btnAceptar3 = function () {
            $location.path('/menuPPTT')
        }




    }
]);