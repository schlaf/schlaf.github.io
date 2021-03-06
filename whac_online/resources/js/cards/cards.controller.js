angular.module('whacApp').controller('ListCards', function ($scope, $http, $interval, $filter, cardsService, spellsService, capacitiesService) {

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
    $scope.grymkin = {"name":"Grymkin", "code":"faction_grymkin"} ;
    $scope.orboros = {"name":"Orboros", "code":"faction_orboros"} ;
    $scope.minions = {"name":"Minions", "code":"faction_minions"} ;
    $scope.skorne = {"name":"Skorne", "code":"faction_skorne"} ;
    $scope.trollblood = {"name":"Trollblood", "code":"faction_trollblood"} ;
    $scope.objectives = {"name":"Objectives SR 2016", "code":"faction_objectives_sr2016"} ;

    $scope.warmachine.factions = [$scope.cryx, $scope.cygnar, $scope.cyriss, $scope.khador, $scope.mercenaries, $scope.protectorate, $scope.retribution];
    $scope.hordes.factions = [$scope.everblight, $scope.grymkin, $scope.orboros, $scope.minions, $scope.skorne, $scope.trollblood];
    $scope.allFactions = [$scope.cryx, $scope.cygnar, $scope.cyriss, $scope.grymkin, $scope.khador, $scope.mercenaries, $scope.protectorate, $scope.retribution, $scope.everblight, $scope.orboros, $scope.minions, $scope.skorne, $scope.trollblood];
    $scope.objectivesSR2016.factions = [$scope.objectives];

    $scope.modelTypes = ["all", "warcaster", "warlock", "warjack", "colossal", "warbeast", "battle engine", "unit", "CA", "WA","solo"];

    $scope.modelTypesSorted = ["warcaster", "warlock", "warjack", "warbeast",  "unit","solo", "colossal","battle engine", "CA", "WA"];

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



    $scope.meleeRanges = ["0.5", "1", "2", "*"];
    $scope.weaponLocations = ["-", "L", "R", "H", "S"];

    $scope.capacityTypes = ["", "*Attack", "*Action", "Order"]

    $scope.selectedSystem=$scope.warmachine;
    $scope.selectedFaction=$scope.cryx;
    $scope.selectedType=$scope.modelTypesSorting['all'];

    $scope.proofReadingStatus = ["Yet to read", "Mainly not ok", "Mainly ok", "OK"];


    $scope.faDefinitions = ["C", "1", "2", "3", "4", "5", "6", "U"];




    $scope.isGrey = function(index) {
        if (index %2 == 0) {
            return "greyBg";
        } else {
            return "whiteBg"
        }
    }

    $scope.addModel = function() {
        var newModel = {};
        angular.copy($scope.emptyModel, newModel);
        $scope.editedCard.models.push(newModel);
    }

    $scope.addMeleeWeapon = function(model) {
        if (model.weapons == undefined) {
            model.weapons = {"melee_weapon" : [], "ranged_weapon" : [], "mount_weapon" : []};
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
            model.weapons = {"melee_weapon" : [], "ranged_weapon" : [], "mount_weapon" : []};
        }
        if (model.weapons.ranged_weapon == undefined) {
            model.weapons.ranged_weapon = [{"_rng":"0", "_rof":"1","_pow":"0","_p_plus_s":"0", "_location":"", "_count":""}];
        } else {
            var newWeapon = {"_rng":"0", "_rof":"1","_pow":"0","_p_plus_s":"0", "_location":"", "_count":""};
            model.weapons.ranged_weapon.push(newWeapon);
        }
    }

    $scope.addMountWeapon = function(model) {
        if (model.weapons == undefined) {
            model.weapons = {"melee_weapon" : [], "ranged_weapon" : [], "mount_weapon" : []};
        }
        if (model.weapons.mount_weapon == undefined) {
            model.weapons.mount_weapon = [{"_name":"Mount", "_rng":"0.5", "_pow":"0"}];
        } else {
            var newWeapon = {"_name":"Mount", "_rng":"0.5", "_pow":"0"};
            model.weapons.mount_weapon.push(newWeapon);
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

    $scope.removeWeaponCapacity = function(weapon, capacity) {
        if (window.confirm("Are you sure to remove this capacity?")) { 
            index = weapon.capacities.indexOf(capacity);
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


                        $scope.allFactions.map( function(a_faction) {

                            if (a_faction.code == card.faction) {
                                if ( a_faction[card.type] ){
                                    a_faction[card.type].push(card);
                                } else {
                                    a_faction[card.type] = [card]
                                }
                                
                            }
                        });
                        


                    });

            }
        );
    }

    $scope.copySpellToModel = function(model) {
        spell = spellsService.getCurrentSpell();
        if ( spell != undefined ) {
            model.spells.push(spell);
        }
    }

    $scope.copyCapacityToModel = function(model) {
        capacity = capacitiesService.getCurrentCapacity();
        if (capacity != undefined && capacity != {}) {
            model.capacities.push(capacity);
        } else {
            alert("first copy a capacity!")
        }
    }

    $scope.copyCapacityToWeapon = function(weapon) {
        capacity = capacitiesService.getCurrentCapacity();
        if (capacity != undefined && capacity != {}) {
            if (weapon.capacities == undefined) {
                weapon.capacities = [];
            }
            weapon.capacities.push(capacity);
        } else {
            alert("first copy a capacity!")
        }
    }
    

    $scope.removeSpell = function(model, spell) {
        if (confirm("are you sure to remove this spell from this model?")) {
            model.spells.splice(model.spells.indexOf(spell),1);    
        }
    }

    $scope.filterCards = function() {
        $scope.filteredCards = cardsService.filterCards( $scope.cards, $scope.selectedFaction,  $scope.selectedType);
    }

    $scope.editCard = function() {
        if ($scope.selectedCard != undefined && $scope.selectedCard._id != undefined) {
            angular.copy($scope.selectedCard, $scope.editedCard);    

            if (! $scope.editedCard.proofReadingStatus) {
                $scope.editedCard['proofReadingStatus'] = $scope.proofReadingStatus[0];
            }

            if (! $scope.editedCard.version) {
                $scope.editedCard['version'] = "2016v1";
            }


            if ($scope.selectedCard.type == "warjack") {


            }
        }
    }

    $scope.saveCard = function() {
        if ($scope.editedCard != undefined && $scope.editedCard._id != undefined) {
            cardsService.saveCard($scope.editedCard).then(function(card){
                alert("card saved");

                // update card in list
                $scope.cards.map(function(a_card){
                    if (a_card._id == card._id) {
                        angular.copy(card, a_card);
                    }
                });
                $scope.editedCard = {};
            })
        }
        
    }    

    $scope.$on('capacityUpdated', function (event, args) {
        $scope.pushCapacityInCards(args.capacity);
        console.log(args.capacity);
    });

    $scope.$on('spellUpdated', function (event, args) {
        $scope.pushSpellInCards(args.spell);
        console.log(args.spell);
    });


    /** search within all card for this capacity, and updates the card
    */
    $scope.pushCapacityInCards = function (capacity_responded) {

        $scope.cards.map(function(a_card){
            a_card.models.map(function(a_model) {
                copyCapacity(a_model, capacity_responded);
            });
        });

        $scope.editedCard.models.map(function(a_model) {
            copyCapacity(a_model, capacity_responded);
        });


    };

    function copyCapacity(a_model, capacity_responded) {
        a_model.capacities.map(function(a_capacity){
            if (capacity_responded._id.$oid == a_capacity._id.$oid) {
                angular.copy(capacity_responded, a_capacity);
            }
        });

        if (a_model.weapons.melee_weapon) {
            a_model.weapons.melee_weapon.map(function(a_weapon) {
                a_model.capacities.map(function(a_capacity){
                    if (capacity_responded._id.$oid == a_capacity._id.$oid) {
                        angular.copy(capacity_responded, a_capacity);
                    }
                });
            });
        }

        if (a_model.weapons.ranged_weapon) {
            a_model.weapons.ranged_weapon.map(function(a_weapon) {
                a_model.capacities.map(function(a_capacity){
                    if (capacity_responded._id.$oid == a_capacity._id.$oid) {
                        angular.copy(capacity_responded, a_capacity);
                    }
                });
            });
        }

        if (a_model.weapons.mount_weapon) {
            a_model.weapons.mount_weapon.map(function(a_weapon) {
                a_model.capacities.map(function(a_capacity){
                    if (capacity_responded._id.$oid == a_capacity._id.$oid) {
                        angular.copy(capacity_responded, a_capacity);
                    }
                });
            });
        }

    }

    /** search within all card for this capacity, and updates the card
    */
    $scope.pushSpellInCards = function (spell_responded) {

        $scope.cards.map(function(a_card){
            a_card.models.map(function(a_model) {
                copySpell(a_model, spell_responded);
            });
        });

        $scope.editedCard.models.map(function(a_model) {
            copySpell(a_model, spell_responded);
        });


    };


    function copySpell(a_model, spell_responded) {
        if (a_model.spells) {
            a_model.spells.map(function(a_spell){
                if (spell_responded._id.$oid == a_spell._id.$oid) {
                    angular.copy(spell_responded, a_spell);
                }
            });
        }
    }

    $interval($scope.testUpdateCapacity, 1000); 


    $scope.existingModels = [];
    $scope.selectedNewModelFaction = {};
    $scope.selectedNewModelType = {};
    $scope.newModelId = "";
    $scope.newModelShortName = "";
    $scope.newModelLongName = "";


    $scope.displayExistingModelsId = function() {
        
        $scope.existingModels = [];

        if ($scope.selectedNewModelFaction != null && $scope.selectedNewModelType) {


            $scope.cards.map(function (card) {

                if (card.faction == $scope.selectedNewModelFaction.code) {
                    if (card.type == $scope.selectedNewModelType.innerType) {
                        $scope.existingModels.push(card);
                    }
                }
            });
        } else {
            $scope.existingModels = [];
        }
    };

    $scope.createNewModel = function() {
        var isReallyNew = true;
        var newCard = {};
        $scope.cards.map(function (card) {
            if (card._id == $scope.newModelId) {
                isReallyNew = false;
                alert("i said choose a _new_ id!");
            }
        });

        if (isReallyNew) {
            if ( $scope.selectedNewModelType.innerType == 'warcaster') {
                angular.copy($scope.emptyCaster, newCard);
            }

            if ( $scope.selectedNewModelType.innerType == 'warlock') {
                angular.copy($scope.emptyWarlock, newCard);
            }

            if ( $scope.selectedNewModelType.innerType == 'warjack') {
                angular.copy($scope.emptyWarjack, newCard);
            }

            if ( $scope.selectedNewModelType.innerType == 'warbeast') {
                angular.copy($scope.emptyWarbeast, newCard);
            }

            if ( $scope.selectedNewModelType.innerType == 'colossal') {
                angular.copy($scope.emptyColossal, newCard);
            }

            if ( $scope.selectedNewModelType.innerType == 'unit') {
                angular.copy($scope.emptyUnit, newCard);
            }

            if ( $scope.selectedNewModelType.innerType == 'solo') {
                angular.copy($scope.emptySolo, newCard);
            }

            if ( $scope.selectedNewModelType.innerType == 'WA') {
                angular.copy($scope.emptyWA, newCard);
            }

            if ( $scope.selectedNewModelType.innerType == 'CA') {
                angular.copy($scope.emptyCA, newCard);
            }

            if ( $scope.selectedNewModelType.innerType == 'battle engine') {
                angular.copy($scope.emptyBE, newCard);
            }


            newCard._id = $scope.newModelId;
            newCard.faction = $scope.selectedNewModelFaction.code;
            newCard.name = $scope.newModelShortName;
            newCard.full_name = $scope.newModelLongName;

            if (newCard.faction == "faction_mercs") {
                newCard["works_for"] = $scope.worksForEveryBodyMerc;
            }

            if (newCard.faction == "faction_minions") {
                newCard["works_for"] = $scope.worksForEveryBodyMinion;
            }


            var sortName = $scope.modelTypesSorting[newCard.type].sort;
                        newCard.sortedLabel = sortName + newCard.name;


            cardsService.createCard(newCard).then(function(card){
                alert("card created");
                $scope.cards.push(newCard);
            });
        }
    }



    $scope.getCards();

$scope.worksForEveryBodyMerc = [{"_id": "faction_khador"}, {"_id": "faction_cygnar"}, {"_id": "faction_menoth"} , {"_id": "faction_cryx"}  ];
$scope.worksForEveryBodyMinion = [{"_id": "faction_everblight"}, {"_id": "faction_orboros"}, {"_id": "faction_skorne"} , {"_id": "faction_trollblood"}  ];


$scope.emptyModel = {
            "basestats": {
                "_name": "card name",
                "_spd": "0",
                "_str": "0",
                "_mat": "0",
                "_rat": "0",
                "_def": "0",
                "_arm": "0",
                "_cmd": "0",
                "_hitpoints": "1"
            },
            "weapons": {
                "melee_weapon": [],
                "ranged_weapon": [],
                "mount_weapon": []
            },
            "spells": [],
            "capacities": []
        };


$scope.emptyUnit = 
{
    "_id": "",
    "name": "short name",
    "status": "new model",
    "qualification": "please fill",
    "type": "unit",
    "faction": "faction_skorne",
    "full_name": "full name",
    "fa": "1",
    "variableSize": true,
    "minCost": "12",
    "maxCost": "18",
    "minSize": "4",
    "maxSize": "6",
    "works_for": [],
    "restricted_to": [],
    "models": [
        $scope.emptyModel
    ]
}


$scope.emptySolo = {
    "_id": "",
    "name": "short name",
    "status": "new model",
    "qualification": "please fill",
    "type": "solo",
    "faction": "faction_skorne",
    "full_name": "full name",
    "fa": "1",
    "cost": "4",
    "works_for": [],
    "restricted_to": [],
    "models": [
        $scope.emptyModel
    ]
}

$scope.emptyCA = {
    "_id": "",
    "name": "short name",
    "status": "new model",
    "qualification": "please fill",
    "type": "CA",
    "faction": "faction_skorne",
    "full_name": "full name",
    "fa": "1",
    "cost": "4",
    "works_for": [],
    "restricted_to": [],
    "models": [
        $scope.emptyModel
    ]
}

$scope.emptyWA = {
    "_id": "",
    "name": "short name",
    "status": "new model",
    "qualification": "please fill",
    "type": "WA",
    "faction": "faction_skorne",
    "full_name": "full name",
    "fa": "1",
    "cost": "4",
    "works_for": [],
    "restricted_to": [],
    "models": [
        $scope.emptyModel
    ]
}

$scope.emptyBE = {
    "_id": "",
    "name": "short name",
    "status": "new model",
    "qualification": "please fill",
    "type": "battle engine",
    "faction": "faction_skorne",
    "full_name": "full name",
    "fa": "1",
    "cost": "4",
    "works_for": [],
    "restricted_to": [],
    "models": [
        $scope.emptyModel
    ]
}


$scope.emptyCaster = {
    "_id": "",
    "name": "short name",
    "status": "new model",
    "qualification": "please fill",
    "type": "warcaster",
    "faction": "faction_cyriss",
    "full_name": "full name",
    "fa": "C",
    "wj_points": "29",
    "feat": {
        "title": "feat title",
        "text": "feat content"
    },
    "works_for": [],
    "restricted_to": [],
    "models": [
        $scope.emptyModel
    ]
}

$scope.emptyWarlock = {
    "_id": "",
    "name": "short name",
    "status": "new model",
    "qualification": "please fill",
    "type": "warlock",
    "faction": "faction_cyriss",
    "full_name": "full name",
    "fa": "C",
    "wb_points": "29",
    "feat": {
        "title": "feat title",
        "text": "feat content"
    },
    "works_for": [],
    "restricted_to": [],
    "models": [
        $scope.emptyModel
    ]
}

$scope.emptyColossal = {
    "_id": "",
    "name": "short name",
    "status": "new model",
    "qualification": "please fill",
    "type": "colossal",
    "faction": "faction_cyriss",
    "full_name": "full name",
    "fa": "C",
    "cost": "38",
    "works_for": [],
    "restricted_to": [],
    "models": [ {
            "basestats": {
                "_name": "COLOSSAL NAME",
                "_spd": "4",
                "_str": "19",
                "_mat": "6",
                "_rat": "4",
                "_def": "7",
                "_arm": "20",
                "_cmd": "0",
                "_damage_grid_right": "...xxx....xxSS....CSRRR.CCCCRRMMMMCR",
                "_damage_grid_left": "xxx...xx........SS.LLLSCLLCCCCLCMMMM",
                "_construct": true,
                "_pathfinder": true
            },
            "weapons": {
                "melee_weapon": [],
                "ranged_weapon": [],
                "mount_weapon": []
            },
            "spells": [],
            "capacities": []
        }
    ]
}

$scope.emptyWarjack = {
    "_id": "",
    "name": "short name",
    "status": "new model",
    "qualification": "please fill",
    "type": "warjack",
    "faction": "faction_cyriss",
    "full_name": "full name",
    "fa": "C",
    "cost": "15",
    "works_for": [],
    "restricted_to": [],
    "models": [ {
            "basestats": {
                "_name": "WARJACK NAME",
                "_spd": "4",
                "_str": "19",
                "_mat": "6",
                "_rat": "4",
                "_def": "7",
                "_arm": "20",
                "_cmd": "0",
                "_damage_grid": "...................L..R.LLMCRRxMMCCx",
                "_construct": true
            },
            "weapons": {
                "melee_weapon": [],
                "ranged_weapon": [],
                "mount_weapon": []
            },
            "spells": [],
            "capacities": []
        }
    ]
}

$scope.emptyWarbeast = {
    "_id": "",
    "name": "short name",
    "status": "new model",
    "qualification": "please fill",
    "type": "warbeast",
    "faction": "faction_everblight",
    "full_name": "full name",
    "fa": "C",
    "cost": "15",
    "works_for": [],
    "restricted_to": [],
    "models": [ {
            "basestats": {
                "_name": "WARBEAST NAME",
                "_spd": "4",
                "_str": "19",
                "_mat": "6",
                "_rat": "4",
                "_def": "7",
                "_arm": "20",
                "_cmd": "0",
                "_fur": "4",
                "_thr": "10",
                "_damage_spiral": "8-10-10"
            },
            "weapons": {
                "melee_weapon": [],
                "ranged_weapon": [],
                "mount_weapon": []
            },
            "spells": [],
            "capacities": []
        }
    ]
}



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

