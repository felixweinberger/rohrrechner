// define angular app
var app = angular.module('rohrrechner', []);

// directive to enable processing of German number formatting
app.directive('smartFloat', function ($filter) {
    var FLOAT_REGEXP_1 = /^\$?\d+.(\d{3})*(\,\d*)$/; 	//Numbers like: 1.123,56
    var FLOAT_REGEXP_2 = /^\$?\d+,(\d{3})*(\.\d*)$/; 	//Numbers like: 1,123.56
    var FLOAT_REGEXP_3 = /^\$?\d+(\.\d*)?$/; 					//Numbers like: 1123.56
    var FLOAT_REGEXP_4 = /^\$?\d+(\,\d*)?$/; 					//Numbers like: 1123,56

    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue) {
                if (FLOAT_REGEXP_1.test(viewValue)) {
                    ctrl.$setValidity('float', true);
                    return parseFloat(viewValue.replace('.', '').replace(',', '.'));
                } else if (FLOAT_REGEXP_2.test(viewValue)) {
                        ctrl.$setValidity('float', true);
                        return parseFloat(viewValue.replace(',', ''));
                } else if (FLOAT_REGEXP_3.test(viewValue)) {
                        ctrl.$setValidity('float', true);
                        return parseFloat(viewValue);
                } else if (FLOAT_REGEXP_4.test(viewValue)) {
                        ctrl.$setValidity('float', true);
                        return parseFloat(viewValue.replace(',', '.'));
                }else {
                    ctrl.$setValidity('float', false);
                    return undefined;
                }
            });

            ctrl.$formatters.unshift(
               function (modelValue) {
                   return $filter('number')(parseFloat(modelValue) , 3);
               }
           );
        }
    };
});

// calculate weight per meter, total length and total weight once user enters sufficient information
app.controller('rohrrechnerCtrl', function($scope) {
    // initialise vars for calculations
    $scope.diameter = "";
    $scope.thickness = "";
    $scope.length = "1.000";
    $scope.number = "1";
    
    // initialise outputs
    $scope.weight = "";
    $scope.totalLength = "";
    $scope.totalWeight = "";

    // calculate new values on change to any of the parameters 
    $scope.$watchGroup(['diameter', 'thickness', 'length', 'number'], function(newValues, oldValues, scope) {
		  if ($scope.diameter != "" && $scope.thickness != "") {
			  $scope.weight = ($scope.diameter - $scope.thickness) * $scope.thickness * 0.0246615;
			  $scope.totalLength = $scope.length * $scope.number;
			  $scope.totalWeight = $scope.weight * $scope.length * $scope.number;
		  }
		});
});