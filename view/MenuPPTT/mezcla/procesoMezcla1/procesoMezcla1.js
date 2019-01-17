/* Setup blank page controller */
angular.module('MetronicApp').controller('procesoMezcla1', ['$rootScope', '$scope', 'settings', '$http', '$sce', '$location',
    function ($rootScope, $scope, settings, $http, $sce, $location) {

        $scope.bloqueado = true;
        $scope.mostrarCheckbox = false;
        $scope.bloqueoLote = false;
        $scope.revisarsipasa = true;
        $scope.listaLote = [];
 
        $scope.formulario = [

            { ngModel: '', id: 'folio', key: 'numeroFolio', label: 'numeroFolio', type: 'number', validado: true, immybox: true, cabecera: true, json: 'numeroFolio', tabla: true, show: true },
            { ngModel: '', id: 'lote', key: 'codigoLote', label: 'codigoLote', type: 'text', validado: true, immybox: true, cabecera: true, json: 'codigoLote', tabla: true, show: true },
            { ngModel: '', id: 'porcion', key: 'porcion', label: 'porcion', type: 'text', validado: true, immybox: true, cabecera: true, json: 'porcion', tabla: true, show: true },
            { ngModel: '', id: 'material', key: 'material', label: 'material', type: 'text', validado: true, immybox: true, name: 'material', cabecera: true, tabla: true, json: 'material', show: true },
            { ngModel: '', id: 'kiloG',key: 'kiloG', label: 'kiloG', type: 'number', validado: true, immybox: true, cabecera: true, json: 'kiloG', tabla: true, show: true },
            { ngModel: '', id: 'Empaque', key: 'Empaque', label: 'Empaque', type: 'text', validado: true, immybox: true, cabecera: true, json: 'Empaque', tabla: true, show: true }

        ];

        // $scope.clickCargarLote = function () {
        //     $scope.errores = [];
        //     angular.forEach($scope.formulario,function (v,k) {
        //         if ( v.ngModel=='' ) {
        //             $scope.errores.push(v.label);
        //         }                

        //     });
        // alert("FALTA LLENAR LOS SIGUIENTES CAMPOS ",$scope.errores)
        //    console.log($scope.errores);
           
        // }

        //  ===============================  BOTONES DE SALIDA =================================

        $scope.btnMezclarPag2 = function () {

        }
        $scope.btnModifPag2 = function () {
            $location.path('/mezcla')
        }
        $scope.btnAceptar2 = function () {
            $location.path('/procesoMezcla2')
        }





    }
]);
