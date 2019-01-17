/* Setup blank page controller */
angular.module('MetronicApp').controller('mezcla', ['$rootScope', '$scope', 'settings', '$http', '$sce', '$location',
    function ($rootScope, $scope, settings, $http, $sce, $location) {

        $scope.bloqueado = true;
        $scope.mostrarCheckbox = false;
        $scope.bloqueoLote = false;
        $scope.revisarsipasa = true;
        $scope.sumatodo = 0;

        $scope.listaLote = [];

        $scope.formulario = [
            { ngModel: '', id: 'numeroFolio', key: 'numeroFolio', label: 'numeroFolio', type: 'number', validado: true, immybox: true, cabecera: true, json: 'numeroFolio', tabla: true, show: true },
            { ngModel: '', id: 'codigoLote', key: 'codigoLote', placeholder: 'lote', label: 'codigoLote', type: 'text', validado: true, immybox: true, cabecera: true, json: 'codigoLote', tabla: true, show: true },
            { ngModel: '', id: 'porcion', key: 'porcion', label: 'porcion', type: 'text', validado: true, immybox: true, cabecera: true, json: 'porcion', tabla: true, show: true },
            { ngModel: '', id: 'material', key: 'material', label: 'material', type: 'text', validado: true, immybox: true, name: 'material', cabecera: true, tabla: true, json: 'material', show: true },
            { ngModel: '', id: 'kiloG', key: 'kiloG', placeholder: 'KG', label: 'kiloG', type: 'number', validado: true, immybox: true, cabecera: true, json: 'kiloG', tabla: true, show: true },
            { ngModel: '', id: 'Empaque', key: 'Empaque', label: 'Empaque', type: 'text', validado: true, immybox: true, cabecera: true, json: 'Empaque', tabla: true, show: true },
            { ngModel: '', id: 'lote', key: 'lote', label: 'LOTE A CONSUMIR', type: 'number', validado: true, immybox: true, cabecera: false, json: 'lote', tabla: true, show: true, otroLote: true, bloke2: true },
            { ngModel: '', id: 'kilolote', key: 'kilolote', label: 'Kilo', type: 'number', validado: true, immybox: true, cabecera: false, json: 'lote', tabla: true, show: true, otroLote: true, bloke2: true },
            { ngModel: '', id: 'sumaKilos', key: 'sumaKilos', label: 'sumaKilos', type: 'number', validado: true, immybox: false, cabecera: false, json: 'sumaKilos', tabla: false, sumatoria: true, bloke2: true, show: true },
        ];
        // ================================ BOTON PARA CARGAR LOTE ============================
        $scope.clickCargarLote = function () {
            $scope.errores = [];
            var pasa = true;
            angular.forEach($scope.formulario, function (v, k) {

                if ((v.ngModel == '' || v.ngModel == null) && v.immybox == true) {
                    $scope.errores.push(v.label);
                    pasa = false;
                }
            });
            if (pasa == false) {
                console.log($scope.errores);
                alert("falta ingresar los siguiente campos", $scope.errores);
                return;
            }
            var lote1 = 0;
            var peso1 = 0;
            angular.forEach($scope.formulario, function (vFormulario, kFormulario) {
                if (vFormulario.key == "lote") {
                    lote1 = vFormulario.ngModel;
                    console.log(lote1);
                    // $scope.listaLote.push({ loteS: vFormulario.ngModel});
                }
                if (vFormulario.key == "kilolote") {
                    peso1 = vFormulario.ngModel;
                    console.log(peso1);
                    // $scope.listaLote.push({valorS: vFormulario.ngModel });
                }
            });
            $scope.listaLote.push({ valorS: lote1, pesoS: peso1 });
            console.log($scope.listaLote);
        };

        console.log($scope.listaLote);
        console.log($scope.sumatodo);

        $scope.sumando = function () {

            angular.forEach($scope.listaLote, function (v, k) {
                $scope.sumatodo = ($scope.sumatodo + v);
                console.log($scope.sumatodo);

            });

        };

        console.log($scope.listaLote);
        console.log($scope.sumatodo);


        // ================================ BOTONES DE SALIDA ============================
        $scope.btnImprimirPag1 = function () {

        }
        $scope.btnEliminarPag1 = function () {

        }
        $scope.btnAceptarPag1 = function () {
            $location.path('/procesoMezcla1')
        }

    }

]);