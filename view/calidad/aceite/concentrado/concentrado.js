angular.module('MetronicApp').controller('concentradoController', ['$rootScope', '$scope', 'settings', '$http', '$sce', '$location',
    function($rootScope, $scope, settings, $http, $sce, $location) {

        $scope.concentrado;


        $scope.concentrado = {
            cabecera: [
                { ngModel: '', key: '', label: '% de Solidos', type: 'number', validado: true, placeholder: '', disabled: false,ngBlur:'porcenVali(item.ngModel)' },
                { ngModel: '', key: '', label: 'TVN', type: 'text', validado: true, placeholder: '', disabled: false },
            ],
            item: []
        };

        $scope.SEND = function () {
            var auxMensaje = false;
            var mensaje = '';
            angular.forEach($scope.concentrado.cabecera, function (v, k) {
                if (v.validado) {
                    if (v.ngModel == '') {
                        if (!auxMensaje) {
                            mensaje = v.label;
                            auxMensaje = true;
                        }
                    }
                }
            })
            if (auxMensaje) {
                $rootScope.showM = true;
                $rootScope.tipoMsg = 'ALERTA';
                $rootScope.msg = [{ descripcion: mensaje, tipo: 'CAMPO VACIO' }]
                return;
            }

            $rootScope.loader = true;
            var json_envio = { porcentaje: $scope.concentrado.cabecera[0].ngModel, tvn: $scope.concentrado.cabecera[1].ngModel, tipoAceite: 'c' }
            console.log(json_envio);
            console.log(IPSERVICIOSBD + "/aceites/insertAceite?aceite=" + JSON.stringify(json_envio))
            $http.get(IPSERVICIOSBD + "/aceites/insertAceite?aceite=" + JSON.stringify(json_envio)).then(function (resp) {
                console.log(resp.data)
                $rootScope.loader = false;
                $location.path('/mezclaProcesoPT');
            })
        };

        $scope.porcenVali = function(x) {
            console.log(isNaN(x));
            if(isNaN(x) || x > 100 || x < 0){
                $scope.concentrado.cabecera[0].ngModel = 0;
            }
        };
    }
]);