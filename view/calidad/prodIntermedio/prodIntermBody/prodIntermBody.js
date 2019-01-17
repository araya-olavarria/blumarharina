angular.module('MetronicApp').controller('prdoBodyController', ['$rootScope', '$scope', 'settings', '$http', '$sce', '$location',
    function($rootScope, $scope, settings, $http, $sce, $location) {

        $scope.productoInt;


        $scope.productoInt = {
            cabecera: [
                { ngModel: '', key: '', label: '% de Humedad', type: 'number', validado: true, placeholder: '', disabled: false, ngBlur:'porcentajeHumedad(item.ngModel)' },
                { ngModel: '', key: '', label: '% de Grasa', type: 'number', validado: true, placeholder: '', disabled: false, ngBlur:'porcentajeGrasa(item.ngModel)' },
                { ngModel: '', key: '', label: '% de Solidos', type: 'number', validado: true, placeholder: '', disabled: false, ngBlur:'porcentajeSolidos(item.ngModel)' },
                { ngModel: '', key: '', label: 'TVN', type: 'text', validado: true, placeholder: '', disabled: false },
                { ngModel: '', key: '', label: '% de Sal', type: 'number', validado: true, placeholder: '', disabled: false, ngBlur:'porcentajeSal(item.ngModel)' },
                { ngModel: '', key: '', label: '% de Proteína', type: 'number', validado: true, placeholder: '', disabled: false, ngBlur:'porcentajeProteina(item.ngModel)' },
                { ngModel: '', key: '', label: 'Temperatura', type: 'number', validado: true, placeholder: '', disabled: false, ngBlur:'temperaturaVali(item.ngModel)' },
            ],
            item: []
        };

        $scope.SEND = function () {
            var auxMensaje = false;
            var mensaje = '';
            angular.forEach($scope.productoInt.cabecera, function (v, k) {
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
            var json_envio = { humedad: $scope.productoInt.cabecera[0].ngModel, 
                                grasa: $scope.productoInt.cabecera[1].ngModel,
                                solidos: $scope.productoInt.cabecera[2].ngModel,
                                tvn: $scope.productoInt.cabecera[3].ngModel,
                                sal: $scope.productoInt.cabecera[4].ngModel,
                                proteina: $scope.productoInt.cabecera[5].ngModel,
                                temperatura: $scope.productoInt.cabecera[6].ngModel,
                                tipoProdIntermedio: $rootScope.prodIntermedioTipo }
            console.log(json_envio);
            console.log(IPSERVICIOSBD + "/insertProdInterm?prodInterJSON=" + JSON.stringify(json_envio))
            $http.get(IPSERVICIOSBD + "/insertProdInterm?prodInterJSON=" + JSON.stringify(json_envio)).then(function (resp) {
                console.log(resp.data)
                $rootScope.loader = false;
                $location.path('/mezclaProcesoPT');
            })
        };

        $scope.porcentajeHumedad = function(x) {
            if(isNaN(x) || x > 100 || x < 0){
                $scope.productoInt.cabecera[0].ngModel = 0;
            }
        };

        $scope.porcentajeGrasa = function(x) {
            if(isNaN(x) || x > 100 || x < 0){
                $scope.productoInt.cabecera[1].ngModel = 0;
            }
        };

        $scope.porcentajeSolidos = function(x) {
            if(isNaN(x) || x > 100 || x < 0){
                $scope.productoInt.cabecera[2].ngModel = 0;
            }
        };

        $scope.porcentajeSal = function(x) {
            if(isNaN(x) || x > 100 || x < 0){
                $scope.productoInt.cabecera[4].ngModel = 0;
            }
        };

        $scope.porcentajeProteina = function(x) {
            if(isNaN(x) || x > 100 || x < 0){
                $scope.productoInt.cabecera[5].ngModel = 0;
            }
        };

        $scope.temperaturaVali = function(x) {
            if(isNaN(x)){
                $scope.productoInt.cabecera[6].ngModel = 0;
            }
        };
    }
]);