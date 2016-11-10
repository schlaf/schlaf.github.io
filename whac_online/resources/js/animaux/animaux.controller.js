angular.module('animauxApp').controller('ListAnimals', function ($scope, $http, animauxService) {
    $scope.name = "Cedric";

    $scope.currentAnimal = null;

    $scope.alimentationTypes = [{"id":"CARNIVORE",name:"carni"},{"id":"HERBIVORE", "name":"herbi"},{"id":"OMNIVORE", "name":"omni"}];

    $scope.animaux = [
        {
            "name": "bachi",
            "nature": "CARNIVORE",
            "previewUrl": "https://pixabay.com/static/uploads/photo/2016/06/27/22/14/man-1483479_150.jpg",
            "carnivore": true,
            "herbivore": false
        },
        {
            "name": "bouzouk",
            "nature": "HERBIVORE",
            "previewUrl": "https://pixabay.com/static/uploads/photo/2016/10/18/16/40/statue-1750690_150.jpg",
            "carnivore": false,
            "herbivore": true
        }
    ];

    $scope.getAnimaux = function() {
        animauxService.getAnimaux().then(
            function( animaux ) {
                $scope.animaux = animaux
            }
        );
    }

    $scope.editAnimal = function(id) {

        $scope.animaux.map(function(oneAnimal) {
            if (oneAnimal.id == id) {
                alert("animal found " + oneAnimal.id + " - " + oneAnimal.name);
                $scope.currentAnimal = {"id" : "still_empty"};
                angular.copy(oneAnimal, $scope.currentAnimal);
            }
        });
    }

    $scope.updateAnimal = function() {
        $scope.animaux.map(function(oneAnimal) {
           if (oneAnimal.id == $scope.currentAnimal.id) {
               oneAnimal.name = $scope.currentAnimal.name;
               oneAnimal.previewUrl = $scope.currentAnimal.previewUrl;
               oneAnimal.nature = $scope.currentAnimal.nature;
           }
        });
    }

    $scope.getAnimaux();


});

