angular.module('whacApp').controller('ListCards', function ($scope, $http, cardsService) {

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

    $scope.modelTypesSorting = {
        "all":{"sort": -1, "innerType":"all", "name":"All"},
        "warcaster": {"sort": 0, "innerType":"warcaster", "name":"Warcasters"}, 
        "warlock":{"sort": 1, "innerType":"warlock", "name":"Warlocks"}, 
        "warjack":{"sort": 2, "innerType":"warjack", "name":"Warjacks"},  
        "colossal":{"sort": 3, "innerType":"colossal", "name":"Colossals"}, 
        "warbeast":{"sort": 4, "innerType":"warbeast", "name":"Warbeasts"}, 
        "battle engine":{"sort": 9, "innerType":"battle engine", "name":"Battle engines"}, 
        "unit":{"sort": 5, "innerType":"unit", "name":"Units"}, 
        "CA":{"sort": 6, "innerType":"CA", "name":"Command Attachments"}, 
        "WA":{"sort": 7, "innerType":"WA", "name":"Weapon Attachments"}, 
        "solo":{"sort": 8, "innerType":"solo", "name":"Solos"} 
    };

    $scope.meleeRanges = ["0.5", "1", "2"];
    $scope.weaponLocations = ["-", "L", "R", "H", "S"];


    $scope.selectedSystem=$scope.warmachine;
    $scope.selectedFaction=$scope.cryx;
    $scope.selectedType=$scope.modelTypesSorting['all'];




    $scope.faDefinitions = ["C", "1", "2", "3", "4","U"];


    $scope.isGrey = function(index) {
        if (index %2 == 0) {
            return "greyBg";
        } else {
            return "whiteBg"
        }
    }



    $scope.addMeleeWeapon = function(model) {
        if (model.weapons == undefined) {
            model.weapons = {"melee_weapon" : [], "ranged_weapon" : []};
        }
        if (model.weapons.melee_weapon == undefined) {
            model.weapons.melee_weapon = [{"_rng":"0.5", "_pow":"0","_p_plus_s":"0", "_location":"", "_count":""}];
        } else {
            var newWeapon = {"_rng":"0.5", "_pow":"0","_p_plus_s":"0", "_location":"", "_count":""};
            model.weapons.melee_weapon.push(newWeapon);
        }
    }

    $scope.addRangedWeapon = function(model) {
        if (model.weapons == undefined) {
            model.weapons = {"melee_weapon" : [], "ranged_weapon" : []};
        }
        if (model.weapons.ranged_weapon == undefined) {
            model.weapons.ranged_weapon = [{"_rng":"0", "_rof":"1","_pow":"0","_p_plus_s":"0", "_location":"", "_count":""}];
        } else {
            var newWeapon = {"_rng":"0", "_rof":"1","_pow":"0","_p_plus_s":"0", "_location":"", "_count":""};
            model.weapons.ranged_weapon.push(newWeapon);
        }
    }


    $scope.removeMeleeWeapon = function(model, index) {
        if (window.confirm("Are you sure to remove this weapon?")) { 
            model.weapons.melee_weapon.splice(index, 1);
        }
    }

    $scope.removeRangedWeapon = function(model, index) {
        if (window.confirm("Are you sure to remove this weapon?")) { 
            model.weapons.ranged_weapon.splice(index, 1);
        }
    }

    $scope.removeWeaponCapacity = function(weapon, index) {
        if (window.confirm("Are you sure to remove this capacity?")) { 
            weapon.capacities.splice(index, 1);
        }
    }    


    $scope.removeCapacity = function(model, index) {
        if (window.confirm("Are you sure to remove this capacity?")) { 
            model.capacities.splice(index, 1);
        }
    }    


    $scope.retrieveTypeLabel = function(type) {
        return $scope.modelTypesSorting[type].name;
     }


    $scope.getCards = function() {
        cardsService.getCards().then(
            function( cards ) {
                $scope.cards = cards;
                $scope.cards.map( function(card) {
                        var sortName = $scope.modelTypesSorting[card.type].sort;
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


}).directive('myCard', function() {
  return {
    template: 'Name: {{editedCard.name}} Type: {{editedCard.type}}'
  };
}).directive('header', function() {
  return {
    templateUrl: 'resources/js/cards/cards.header.html'
  };
}).directive('basestats', function() {
  return {
    templateUrl: 'resources/js/cards/cards.basestats.html'
  };
}).directive('spells', function() {
  return {
    templateUrl: function(elem, attr) {
      return 'resources/js/cards/cards.spells.html';
    }
  };
});

