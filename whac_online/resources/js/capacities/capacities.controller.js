angular.module('whacApp').controller('ListCapacities', function ($scope, $http, capacitiesService) {

    $scope.selectedCapacity={};
    $scope.capacities = [];
    $scope.filteredCapacities = [];
    $scope.editedCapacity={}

    $scope.filterCapacity = {"name":"", "text":""};


	$scope.getCapacities = function() {
        capacitiesService.getCapacities().then(
            function( capacities ) {
                $scope.capacities = capacities;

                $scope.filteredCapacities = capacitiesService.filterCapacities($scope.capacities, $scope.filterCapacity.name, $scope.filterCapacity.text);
            }
        );
    }

    $scope.filterCapacities = function() {
        // $scope.filteredCards = cardsService.filterCards( $scope.cards, $scope.selectedFaction,  $scope.selectedType);
        $scope.filteredCapacities = capacitiesService.filterCapacities($scope.capacities, $scope.filterCapacity.name, $scope.filterCapacity.text);
    }

	$scope.getCapacities();

});
