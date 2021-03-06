angular.module('whacApp').controller('ListSpells', function ($scope, $http, spellsService) {

    $scope.selectedSpell={};
    $scope.spells = [];
    $scope.filteredSpells = [];
    $scope.editedSpell={}

    $scope.filterSpell = {"name":"", "text":""};

    $scope.spellRanges = ["-", "*", "SELF", "CTRL", "CMD", "6","8","10","12","SP6", "SP8", "SP10"];
    $scope.spellAOEs = ["-", "*", "3", "4", "5", "CTRL", "CMD", "WALL"];
    $scope.spellDurations = ["-", "TURN", "RND", "UP", "*"];
    $scope.spellOffensiveness = ["YES", "NO", "*"];

    $scope.emptySpell = {

        "_id" : "new",
        "_name": "Spell name",
        "_cost": "0",
        "_rng": "SELF",
        "_pow": "-",
        "_aoe": "CTRL",
        "_duration": "TURN",
        "_off": "NO",
        "__text": "Text spell"
    }

	$scope.getSpells = function() {
        spellsService.getSpells().then(
            function( spells ) {
                $scope.spells = spells;

                $scope.filteredSpells = spellsService.filterSpells($scope.spells, $scope.filterSpell.name, $scope.filterSpell.text);
            }
        );
    }

    $scope.filterSpells = function() {
        // $scope.filteredCards = cardsService.filterCards( $scope.cards, $scope.selectedFaction,  $scope.selectedType);
        $scope.filteredSpells = spellsService.filterSpells($scope.spells, $scope.filterSpell.name, $scope.filterSpell.text);
    }

    $scope.editSpell = function(spell) {
        angular.copy(spell, $scope.editedSpell);
    }

    $scope.newSpell = function() {
        angular.copy($scope.emptySpell, $scope.editedSpell);
    }


    $scope.dismissSpell = function() {
        $scope.editedSpell = {};
    }

    $scope.saveSpell = function(spell) {

        if (spell._id == "new" ) {
            spell._id = null;
            spellsService.createSpell(spell).then(
                function(spell){
                    alert("spell created");

                    // update spell in list
                    $scope.spells.push(spell);
                    $scope.editedSpell = {};
                }
            );            
        } else {
            spellsService.saveSpell(spell).then(
                function(spell){
                    alert("spell saved");

                    // update spell in list
                    $scope.spells.map(function(a_spell){
                        if (a_spell._id.$oid == spell._id.$oid) {
                            angular.copy(spell, a_spell);
                        }
                    });

                    $scope.$emit('spellUpdated', { 'spell': spell });
                    $scope.editedSpell = {};
                }
            );
        }
    }

    $scope.removeSpell = function(spell) {
        if (confirm("are you sure to delete this spell?")) {
            spellsService.deleteSpell(spell).then(
                function(spell){
                    alert("spell deleted");

                    // remove spell from list
                    $scope.spells.slice(spell);

                    $scope.editedSpell = {};
                }
            );
        }
    }

    $scope.copySpell = function(spell, $event) {
        $event.stopPropagation();
        spellsService.copySpell(spell);
        alert(spell._name + " copied to clipboard")
    }

	$scope.getSpells();

});
