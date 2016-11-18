angular.module('whacApp').controller('ListCapacities', function ($scope, $http, capacitiesService) {

    $scope.selectedCapacity={};
    $scope.capacities = [];
    $scope.filteredCapacities = [];
    $scope.editedCapacity={}


	$scope.getCapacities = function() {
        capacitiesService.getCapacities().then(
            function( capacities ) {
                $scope.capacities = capacities;
            }
        );
    }

	$scope.getCapacities();

});
