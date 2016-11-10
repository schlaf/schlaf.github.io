angular.module('whacApp').controller('ListCards', function ($scope, $http, cardsService) {

    $scope.selectedSystem={};
    $scope.selectedFaction={};
    $scope.selectedType="";
    $scope.selectedCard={};
    $scope.cards = [];
    $scope.filteredCards = [];
    $scope.editedCard={}

    $scope.warmachine = {"name":"Warmachine", "factions":[]};
    $scope.hordes = {"name":"Hordes", "factions":[]};
    $scope.objectivesSR2016 = {"name":"Objectives", "factions":[]};

    $scope.systems = [];
    $scope.systems[0] = $scope.warmachine;
    $scope.systems[1] = $scope.hordes;
    $scope.systems[2] = $scope.objectivesSR2016;

    $scope.cryx = {"name":"Cryx", "code":"faction_cryx"} ;
    $scope.cygnar = {"name":"Cygnar", "code":"faction_cygnar"} ;
    $scope.cyriss = {"name":"Cyriss", "code":"faction_cyriss"} ;
    $scope.khador = {"name":"Khador", "code":"faction_khador"} ;
    $scope.mercenaries = {"name":"Mercenaries", "code":"faction_mercs"} ;
    $scope.protectorate = {"name":"Protectorate", "code":"faction_menoth"} ;
    $scope.retribution = {"name":"Retribution", "code":"faction_retribution"} ;
    $scope.everblight = {"name":"Everblight", "code":"faction_everblight"} ;
    $scope.orboros = {"name":"Orboros", "code":"faction_orboros"} ;
    $scope.minions = {"name":"Minions", "code":"faction_minions"} ;
    $scope.skorne = {"name":"Skorne", "code":"faction_skorne"} ;
    $scope.trollblood = {"name":"Trollblood", "code":"faction_trollblood"} ;
    $scope.objectives = {"name":"Objectives SR 2016", "code":"faction_objectives_sr2016"} ;

    $scope.warmachine.factions = [$scope.cryx, $scope.cygnar, $scope.cyriss, $scope.khador, $scope.mercenaries, $scope.protectorate, $scope.retribution];
    $scope.hordes.factions = [$scope.everblight, $scope.orboros, $scope.minions, $scope.skorne, $scope.trollblood];
    $scope.objectivesSR2016.factions = [$scope.objectives];

    $scope.modelTypes = ["all", "warcaster", "warlock", "warjack", "colossal", "warbeast", "battle engine", "unit", "CA", "WA","solo"];

    $scope.modelTypesLabels = ["All", "Warcasters", "Warlocks", "Warjacks", "Colossals", "Warbeasts", "Battle engines", "Units", "Command Attachments", "Weapon Attachments","Solos"];

    $scope.modelTypesSorting = {"warcaster":0, "warlock":1, "warjack":2, "colossal":3, "warbeast":4, "battle engine":9, "unit":5, "CA":6, "WA":7,"solo":8};

    $scope.faDefinitions = ["C", "1", "2", "3", "4","U"];


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

    $scope.retrieveTypeLabel = function(type) {
        var i= 0;
        var result = 0;
        $scope.modelTypes.map(function(modelType) {
            if (modelType == type) {
                result = i;
            }
            i++;
        });
        return $scope.modelTypesLabels[result];
    }



    $scope.getCards = function() {
        cardsService.getCards().then(
            function( cards ) {
                $scope.cards = cards;
                $scope.cards.map( function(card) {
                        var sortName = $scope.modelTypesSorting[card.type];
                        card.sortedLabel = sortName + card.name;
                    });

            }
        );
    }

    $scope.filterCards = function() {
        $scope.filteredCards = cardsService.filterCards( $scope.cards, $scope.selectedFaction,  $scope.selectedType);
    }

    $scope.editCard = function() {
        if ($scope.selectedCard != undefined && $scope.selectedCard._id != undefined) {
            angular.copy($scope.selectedCard, $scope.editedCard);    
        }
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

    $scope.getCards();


});

