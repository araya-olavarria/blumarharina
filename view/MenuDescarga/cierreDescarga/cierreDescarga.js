/* Setup blank page controller */
angular.module('MetronicApp').controller('cierreDescarga', ['$rootScope', '$scope', 'settings', '$http', '$sce', '$location',
        function($rootScope, $scope, settings, $http, $sce, $location) {

            var pontones = [];
            if ($rootScope.seleccionCierre.muelle == null || $rootScope.seleccionCierre.muelle == undefined || $rootScope.seleccionCierre.muelle == '') {
                pontones = $rootScope.Ponton;
            } else {
                angular.forEach($rootScope.Ponton, function(v, k) {
                    if (v.muelle == $rootScope.seleccionCierre.muelle.trim()) {
                        pontones.push(v);
                    }
                })
            }
            $scope.HR = new Date();
            $scope.Rpesca = [
                { value: 'III REGION', key: 'III REGION' },
                { value: 'IV REGION', key: 'IV REGION' },
                { value: 'V REGION', key: 'V REGION' },
                { value: 'VI REGION', key: 'VI REGION' },
                { value: 'VII REGION', key: 'VII REGION' },
                { value: 'VIII REGION', key: 'VIII REGION' },
                { value: 'IX REGION', key: 'IX REGION' },
                { value: 'IX REGION', key: 'IX REGION' },
                { value: 'X REGION', key: 'X REGION' },
                { value: 'XIV REGION', key: 'XIV REGION' }
            ]
            $scope.Zpesca = [
                { value: '114', key: '114' },
                { value: '115', key: '115' },
                { value: '116', key: '116' }
            ]
            if ($rootScope.CierreNuevo) {
                $rootScope.Formulario = [
                    { ngModel: '', key: 'ZREGDEPESCA', label: 'Región de Pesca', type: 'select', validado: true, placeholder: 'Seleccione', options: $scope.Rpesca, json: 'PESCA' },
                    { ngModel: '', key: 'ZZONAPESCA', label: 'Zona de Pesca', type: 'select', validado: true, placeholder: 'Seleccione', options: $scope.Zpesca, json: 'ZONA' },
                    { ngModel: new Date(), key: '', label: 'Fecha término de Descarga', type: 'date', validado: true, placeholder: '' },
                    { ngModel: new Date(0, 0, 0, $scope.HR.getHours(), $scope.HR.getMinutes(), 0), key: 'ZHORATERDES', label: 'Hora término de Descarga', type: 'time', validado: true, placeholder: '' },
                    { ngModel: '', key: 'ZMODA', label: 'Moda', type: 'text', validado: false, placeholder: '', fn: 'Validate_num', max: 4, disabled: false },
                    { ngModel: $rootScope.seleccionCierre.toneladas, key: 'ZTONELADAS', label: 'Toneladas Anunciadas', type: 'text', validado: true, placeholder: '', max: 10, fn: 'Validate_num', disabled: true },
                    { ngModel: '', key: 'ZPONTON', label: 'Pontón', type: 'select', validado: true, placeholder: 'Seleccione', options: pontones },
                    { ngModel: '', key: 'ZUNIDLANCE', label: 'Unidades por Litro', type: 'text', validado: false, placeholder: '', max: 2, fn: 'Validate_num', disabled: false },
                    { ngModel: '', key: 'ZDA-DI', label: 'DA/DI', type: 'text', validado: true, placeholder: '', max: 10, fn: 'Validate_num', disabled: false },
                    { ngModel: $rootScope.seleccionCierre.nActivacion, key: 'ZNOACTIVACION', label: 'Número de Activación', type: 'text', validado: true, placeholder: '', disabled: false },
                    { ngModel: '', key: 'ZTVN', label: 'TVN', type: 'text', validado: true, placeholder: '', fn: 'Validate_num', max: 4, disabled: false },
                    { ngModel: '', key: 'ZTONELADASREALES', label: 'Toneladas Reales', type: 'text', validado: true, placeholder: '', max: 10, fn: 'Validate_num', disabled: false },
                    { ngModel: '', key: 'ZBODEGA', label: 'Bodega', type: 'text', validado: false, placeholder: '', max: 18, disabled: false },
                    { ngModel: '', key: 'ZFECHALANCE', label: 'Fecha Lance', type: 'date', validado: true, placeholder: '' },
                    { ngModel: '', key: 'ZHORALANCE', label: 'Hora Lance', type: 'time', validado: true, placeholder: '' },
                ];
                $rootScope.CierreNuevo = false;
            }

            $scope.fn_ = function(fn, dato) {
                if (fn == '') { return; }
                $scope[fn]((dato) ? dato : '');
            }
            $scope.Validate_num = function(i) {
                console.log($rootScope.Formulario[i].ngModel);
                $rootScope.Formulario[i].ngModel = $rootScope.Formulario[i].ngModel.replace(',', '.');
                if (isNaN($rootScope.Formulario[i].ngModel)) {
                    $rootScope.Formulario[i].ngModel = '';
                }
            }
            $scope.Validate_Form = function() {
                var auxMensaje = false;
                var mensaje = '';
                angular.forEach($scope.Formulario, function(v, k) {
                    if (v.validado) {
                        console.log(v.ngModel);
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
                $location.path('/migo');
            }
        }
    ]

).filter('formatFecha', function() {
    return function(input) {
        console.log(input);
        var fechaProc = input.split(' ')[0];
        var hora = input.split(' ')[1];
        var dd = fechaProc.split('-')[2];
        var mm = fechaProc.split('-')[1];
        var yy = fechaProc.split('-')[0];
        hora = hora.replace(':00.0', '');
        return dd + "-" + mm + "-" + yy + " " + hora;
    }
});;