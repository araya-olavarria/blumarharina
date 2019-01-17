/* Setup blank page controller */
angular.module('MetronicApp').controller('resumenMPPropia', ['$rootScope', '$scope', 'settings', '$http', '$sce', '$location',
        function($rootScope, $scope, settings, $http, $sce, $location) {

            var jsonEnvio = {};

            $http.get("json/JSON_ENVIO_MP_COMPRADA.json", {
                headers: { 'Content-Type': 'application/json; charset=UTF-8' }
            }).success(function(data) {
                jsonEnvio = data;
            }).error($rootScope.dialog.httpRequest.error);

            console.log($rootScope.recepcionMPPropia);

            $scope.proveedor = $rootScope.recepcionMPPropia.infoMigo.proveedor;
            $scope.embarcacion = $rootScope.recepcionMPPropia.infoMigo.embarcacion;
            $scope.procedencia = $rootScope.recepcionMPPropia.infoMigo.procedencia;
            $scope.lote = $rootScope.recepcionMPPropia.infoMigo.lote;
            $scope.matSel = $rootScope.recepcionMPPropia.infoMP.material.material;
            $scope.kilosSel = $rootScope.recepcionMPPropia.infoMP.kilos;
            $scope.fechaRecepcion = $rootScope.recepcionMPPropia.infoMP.fechaRecepcion;
            $scope.fechaEntrega = $rootScope.recepcionMPPropia.infoMP.fechaEntrega;

            $scope.materiales = $rootScope.recepcionMPPropia.infoMigo.materiales;;


            $scope.redirectToResumen = function() {
                //$location.path('/resumen');
            }

            $scope.enviar = function() {
                console.log(jsonEnvio);

                jsonEnvio.OBJETOENTRADA[0].PARAMETROS.FECHA = $rootScope.getFechaBapi($scope.fechaRecepcion);
                jsonEnvio.OBJETOENTRADA[0].PARAMETROS.MATERIALES.push({ COD: $rootScope.recepcionMPPropia.infoMP.material.id, CANTIDAD: $scope.kilos });
                jsonEnvio.OBJETOENTRADA[0].PARAMETROS.PRODUCTOR = $rootScope.recepcionMPPropia.infoMP.proveedor.id;

                jsonEnvio.OBJETOENTRADA[1].PARAMETROS.MATERIALES.push({ COD: $rootScope.recepcionMPPropia.infoMP.material.id, CANTIDAD: $scope.kilos, LOTE: $scope.lote });
                jsonEnvio.OBJETOENTRADA[1].PARAMETROS.FECHA = $rootScope.getFechaBapi($scope.fechaRecepcion);

                jsonEnvio.OBJETOENTRADA[2].PARAMETROS.LOTES.push({ LOTE: $scope.lote });
                jsonEnvio.OBJETOENTRADA[2].PARAMETROS.CARACTERISTICAS.push({ LOTE: $scope.lote, CARACTERISTICA: 'ZPROCEDENMP', VALOR: 'COMP_ARTESANAL' });
                console.log(JSON.stringify(jsonEnvio));

                //$scope.pop = { show: true }

            }



        }
    ]

);