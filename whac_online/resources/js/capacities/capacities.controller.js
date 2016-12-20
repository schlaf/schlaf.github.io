angular.module('whacApp').controller('ListCapacities', function ($scope, $http, capacitiesService) {

    $scope.selectedCapacity={};
    $scope.capacities = [];
    $scope.filteredCapacities = [];
    $scope.editedCapacity={}

    $scope.filterCapacity = {"name":"", "text":""};

    var currentCapacity = {};

    $scope.copyCapacity = function(capacity, $event) {
        $event.stopPropagation();
        capacitiesService.copyCapacity(capacity);
        alert(capacity._title + " copied to clipboard")
    }

    $scope.getCurrentCapacity = function () {
        return currentCapacity;
    }


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


    $scope.editCapacity = function(capacity) {
        angular.copy(capacity, $scope.editedCapacity);
    }

    $scope.dismissCapacity = function() {
        $scope.editedCapacity = {};
    }

    $scope.saveCapacity = function(capacity) {
        capacitiesService.saveCapacity(capacity).then(
            function(capacity){
                alert("capacity saved");

                // update capacity in list
                $scope.capacities.map(function(a_capacity){
                    if (a_capacity._id.$oid == capacity._id.$oid) {
                        angular.copy(capacity, a_capacity);
                    }
                });

                capacitiesService.updatedCapacity(capacity);
                $scope.editedCapacity = {};
            }
        );
    }


	$scope.getCapacities();

});
