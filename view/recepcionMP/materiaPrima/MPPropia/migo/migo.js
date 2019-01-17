/* Setup blank page controller */
angular.module('MetronicApp').controller('migoMPPropia', ['$rootScope', '$scope', 'settings', '$http', '$sce', '$location',
        function($rootScope, $scope, settings, $http, $sce, $location) {

            $scope.proveedor = $rootScope.recepcionMPPropia.infoMP.proveedor.nombre;
            $scope.materialSel = $rootScope.recepcionMPPropia.infoMP.material.material;
            $scope.displayTable = false;
            //console.log($rootScope.recepcionMPPropia.infoMP.material);

            var kilosSelec = $rootScope.recepcionMPPropia.infoMP.kilos;
            console.log(kilosSelec);

            $scope.materialesJson = [];
            $scope.matAgregados = [];

            $http.get(IPSERVICIOSAPX + "JSON_BOM_MATERIAL.aspx?CENTRO=1020&MATERIAL=" + $rootScope.recepcionMPComprada.infoMP.material.material).then(function(response) {
                console.log(response);
                angular.forEach(response.data.T_STPO, function(val, key) {
                    if (val.WRKST != "")
                        $scope.materialesJson.push({ id: val.ITM_IDENT, material: val.ITEM_TEXT1 });
                });
            });

            $scope.materiales = [{
                codMaterial: '',
                material: '',
                porcentaje: '',
                kilos: ''
            }];

            $scope.mat = {};
            $scope.redirectToResumen = function() {
                if ($scope.proveedor == undefined || $scope.materialSel == undefined || $scope.embarcacion == undefined || $scope.lote == undefined) {

                    alert("Debe llenar todos los campos");

                } else {

                    var infoMigo = {};
                    infoMigo.proveedor = $scope.proveedor;
                    infoMigo.material = $scope.materialSel;
                    infoMigo.embarcacion = $scope.embarcacion;
                    infoMigo.procedencia = 'MP Propia';
                    infoMigo.materiales = $scope.materiales;
                    infoMigo.lote = $scope.lote;

                    $rootScope.recepcionMPPropia.infoMigo = infoMigo;

                    $location.path("/resumenMPPropia");
                }
            }

            $scope.addMaterial = function() {
                $scope.materiales.push({
                    codMaterial: '',
                    material: '',
                    porcentaje: '',
                    kilos: ''
                });
            };

            $scope.removeMaterial = function(index) {

                var auxId = $scope.materiales[index].material.id;
                if ($scope.materiales.length > 1) {

                    $scope.materiales.splice(index, 1);
                    angular.forEach($scope.matAgregados, function(val, key) {

                        if (val == auxId) {

                            $scope.matAgregados.splice(key, 1);

                        }

                    })

                } else {
                    alert("No puede eliminar la ultima linea");
                }
            };

            $scope.validaMaterial = function(material, index) {

                var valida = false;

                angular.forEach($scope.matAgregados, function(val, key) {

                    if (val == material.id) {
                        alert("no puede ingresar el mismo material");
                        $scope.materiales[index].material.material = "";
                        $scope.materiales[index].material.id = "";
                        console.log($scope.materiales[index]);
                        valida = true;
                    }

                })
                if (!valida)
                    $scope.matAgregados.push(material.id);

            };

            $scope.calculaKilos = function(material, index) {

                $scope.materiales[index].kilosedit = (kilosSelec * (material.porcentaje / 100));

            }
        }
    ]

);