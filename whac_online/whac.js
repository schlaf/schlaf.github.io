// data input

var army_points = 0;
var army_points_specialists = 0;
var army_points_selected = 0;
var army_points_specialists_selected = 0;
var show_specialists = false;
var nb_casters = 1;
var system = "Warmachine";
var faction = "Cryx";
var selectedFaction ;
var selectedFactionId ;
var tierId; // the name of the tier (from combobox)
var currentTier; // the tier object
var tierLevelComputed; // level of tier atteined


systems = ["Warmachine", "Hordes"];
factions = [];
factions[systems[0]] = ["Cryx", "Cygnar", "Cyriss", "Khador", "Mercenaries", "Protectorate", "Retribution"];
factions[systems[1]] = ["Everblight", "Orboros", "Minions", "Skorne", "Trollblood"];

faction_ids = [];
faction_ids["Cryx"] = "faction_cryx";
faction_ids["Cygnar"] = "faction_cygnar";
faction_ids["Cyriss"] = "faction_cyriss";
faction_ids["Khador"] = "faction_khador";
faction_ids["Retribution"] = "faction_retribution";
faction_ids["Protectorate"] = "faction_menoth";
faction_ids["Mercenaries"] = "faction_mercs";
faction_ids["Everblight"] = "faction_everblight";
faction_ids["Orboros"] = "faction_orboros";
faction_ids["Minions"] = "faction_minions";
faction_ids["Skorne"] = "faction_skorne";
faction_ids["Trollblood"] = "faction_trollblood";


groups = ["warcasters", "warlocks", "warjacks", "colossals", "warbeasts", "battleengine", "units", "UAs", "WAs", "solos"];

model_types = ["warcaster", "warlock", "warjack", "colossal", "warbeast", "battleengine", "unit", "unitMarshall", "UA", "UAMarshall", "WA", "RA", "solo", "soloMarshall", "soloDragoon", "soloAttachment", "soloJourneyMan", "soloLesserWarlock"];

// selection entry = { id: name: type: faction: fa: realFA: cost: realCost: countSelected:  } // selected entry = { id:
//name: realCost: full:<boolean> tiersAltered:<boolean> ruleAltered:<boolean>  //  free:<boolean> specialist:<boolean>
//attachment: warjacks: warbeasts: ua: ra: was:[]} // selected sub entry = { id: name: realCost: tiersAltered:<boolean>
// ruleAltered:<boolean> free:<boolean> specialist:<boolean>}


full_entries = {groups: []}; 

namesForEntries = {};


full_data = new Array();
full_data["Cygnar"] = faction_cygnar_entries;
full_data["Cryx"] = faction_cryx_entries;
full_data["Cyriss"] = faction_cyriss_entries;
full_data["Khador"] = faction_khador_entries;
full_data["Mercenaries"] = faction_mercs_entries;
full_data["Protectorate"] = faction_menoth_entries;
full_data["Retribution"] = faction_retribution_entries;

full_data["Everblight"] = faction_everblight_entries;
full_data["Minions"] = faction_minions_entries;
full_data["Orboros"] = faction_orboros_entries;
full_data["Skorne"] = faction_skorne_entries;
full_data["Trollblood"] = faction_trollblood_entries;



full_tiers = new Array();

full_tiers["Cryx"] = faction_cryx_tiers;
full_tiers["Cygnar"] = faction_cygnar_tiers;
full_tiers["Cyriss"] = faction_cyriss_tiers;
full_tiers["Khador"] = faction_khador_tiers;
full_tiers["Mercenaries"] = faction_mercs_tiers;
full_tiers["Protectorate"] = faction_menoth_tiers;
full_tiers["Retribution"] = faction_retribution_tiers;

full_tiers["Everblight"] = faction_everblight_tiers;
full_tiers["Orboros"] = faction_orboros_tiers;
full_tiers["Minions"] = faction_minions_tiers;
full_tiers["Skorne"] = faction_skorne_tiers;
full_tiers["Trollblood"] = faction_trollblood_tiers;


selected_entries = {entries : [ ]};


selected_entries_sample = {entries : [ 
{id : "Cw01", name:"Iron Lich Asphyxious",  type:"warcaster", faction:"faction_cryx", fa:"C", cost: "6",
attached:  {id : "Cw01", name:"Skarlock Thrall",  type:"soloAttachment", faction:"faction_cryx", fa:"1", cost: "2"},
warjacks: [{id : "CJ01", name:"warjackO1",  type:"warjack", faction:"faction_cryx", fa:"2", cost: "6"}, {id : "CJ02", name:"warjackO2",  type:"warjack", faction:"faction_cryx", fa:"U", cost: "4"}]
}, 
{id : "KU01", name:"Mc Thralls",  type:"units", faction:"faction_cryx", fa:"2", cost: "6",
	attached:  {id : "UA01", name:"Skarlock Commander",  type:"UAs", faction:"faction_cryx", fa:"1", cost: "2"},
	weapons: [{id : "WA01", name:"Brute Thrall",  type:"WAs", faction:"faction_cryx", fa:"1", cost: "2"},{id : "WA01", name:"Brute Thrall",  type:"WAs", faction:"faction_cryx", fa:"1", cost: "2"}] 
}, 
{id : "CJ02", name:"solo01",  type:"solos", faction:"faction_cryx", fa:"U", cost: "4"} ]};




/**
* remove a primary model (not a sub-model : attachement, jacks, ...)
*/
function tryRemoveModel(index, selectedModel) {
	$.observable(selected_entries.entries).remove(index);
	recomposeArmy();
}


/**
* remove the warjack from model. parentIndex is the index of the parent, index is the order of the warjack to delete among the other warjacks of parent
*/
function tryRemoveWarjack(parentIndex, index, selectedModel) {
	var index;
	var parentEntry = selected_entries.entries[parentIndex];
	$.observable(parentEntry.warjacks).remove(index);
	recomposeArmy();
}

/**
* remove the warbeast from model. parentIndex is the index of the parent, index is the order of the warbeast to delete among the other warbeasts of parent
*/
function tryRemoveWarbeast(parentIndex, index, selectedModel) {
	var index;
	var parentEntry = selected_entries.entries[parentIndex];
	$.observable(parentEntry.warbeasts).remove(index);
	recomposeArmy();
}

/**
* remove the WA from model. parentIndex is the index of the parent, index is the order of the WA to delete among the other WA of parent
*/
function tryRemoveWA(parentIndex, index, selectedModel) {
	var index;
	var parentEntry = selected_entries.entries[parentIndex];
	$.observable(parentEntry.weapons).remove(index);
	recomposeArmy();
}


/**
* remove the attachment from model. index is the index of the parent
*/
function tryRemoveAttachment(index, selectedModel) {
	var index;
	var parentEntry = selected_entries.entries[index];

	if (parentEntry.attachment.type == "UAMarshall") {
		// remove immediately warjacks
		$.observable(parentEntry.warjacks).remove(0, parentEntry.warjacks.length);
	}

	$.observable(parentEntry).setProperty("attachment", null);



	recomposeArmy();
}


function tryAddModel(modelId) {

	var model = findEntry(modelId);
	if (model.type == "warcaster") {
		console.log("adding a warcaster");
		addWarcaster(model);
	} else if (model.type == "warlock") {
		console.log("adding a warlock");
		addWarlock(model);
	} else if (model.type == "warjack") {
		// find model to attach
		var candidates = findWhoToAttachWarjack(model);
		if (candidates.length > 1) {
			// many models can have jacks
			$( "#unit-size-title").html("Add " + model.name);
			var title = "Attach " + model.name + " to ...";

			var buttons = new Array();

			candidates.map( function(candidate) {
				var button = {
					text: candidate.name ,
					click: function() {
						addWarjack(candidate, model);
						$( this ).dialog( "close" );
						}
					};
				buttons.push(button);
			});

			var minSizeButton = candidates[0].name;
			var maxSizeButton = candidates[1].name;
			$( "#dialog-confirm-unit-size" ).dialog({
				resizable: false,
				height:"auto",
				title:title,
				width:450,
				modal: true,
				buttons: buttons
			});
		} else if (candidates.length == 1) {
			addWarjack(candidates[0], model);
		} else {
			alert("No MODEL/UNIT to attach this warjack");
		}

		recomposeArmy();
		console.log("adding a warjack");
	} else if (model.type == "warbeast") {
		// find model to attach
		var candidates = findWhoToAttachWarbeast(model);
		if (candidates.length > 1) {
			// many models can have beasts
			$( "#unit-size-title").html("Add " + model.name);
			var title = "Attach " + model.name + " to ...";

			var buttons = new Array();

			candidates.map( function(candidate) {
				var button = {
					text: candidate.name ,
					click: function() {
						addWarbeast(candidate, model);
						$( this ).dialog( "close" );
						}
					};
				buttons.push(button);
			});

			var minSizeButton = candidates[0].name;
			var maxSizeButton = candidates[1].name;
			$( "#dialog-confirm-unit-size" ).dialog({
				resizable: false,
				height:"auto",
				title:title,
				width:450,
				modal: true,
				buttons: buttons
			});
		} else if (candidates.length == 1) {
			addWarbeast(candidates[0], model);
		} else {
			alert("No MODEL/UNIT to attach this warbeast");
		}

		recomposeArmy();
		console.log("adding a warbeast");
	} else if (model.type == "battleengine" ) {
		addBattleEngine(model)	;
		recomposeArmy();
	} else if (model.type == "solo" || model.type == "soloJourneyMan" || model.type == "soloLesserWarlock" || model.type == "soloMarshall") {
		addSolo(model)	;
		recomposeArmy();
	} else if (model.type == "soloAttachment") {
		var candidates = findWhoToAttachSolo(model);
		if (candidates.length > 1) {
			// many models can have this solo
			$( "#unit-size-title").html("Add " + model.name);
			var title = "Attach " + model.name + " to ...";

			var buttons = new Array();

			candidates.map( function(candidate) {
				var button = {
					text: candidate.name,
					click: function() {
						addSoloAttachment(candidate, model);
						$( this ).dialog( "close" );
						}
					};
				buttons.push(button);
			});

			$( "#dialog-confirm-unit-size" ).dialog({
				resizable: false,
				height:"auto",
				title:title,
				width:450,
				modal: true,
				buttons: buttons
			});
		} else if (candidates.length == 1) {
			addSoloAttachment(candidates[0], model)	;
		} else {
			alert("No Warcaster/Warlock to attach this attachment");
		}
		
		recomposeArmy();
	} else if (model.type == "unit" || model.type == "unitMarshall") {
		if (model.min != undefined) {
			// many different size
			$( "#unit-size-title").html("Add " + model.name);
			var title = "Choose unit size for " + model.name;
			var minSizeButton = "Min size = " + model.min;
			var maxSizeButton = "Max size = " + model.max
			$( "#dialog-confirm-unit-size" ).dialog({
				resizable: false,
				height:"auto",
				title:title,
				width:450,
				modal: true,
				buttons: [{
					text: minSizeButton ,
					click: function() {
						addUnitVariable(model.id, "min");
						$( this ).dialog( "close" );
						}
					},
					{ text:maxSizeButton  , 
						click: function() {
						addUnitVariable(model.id, "max");
						$( this ).dialog( "close" );
						}
					}
					]
			});
		} else {
			addUnitFixed(model.id);
		}
	} else if (model.type == "UA" || model.type == "UAMarshall") {
		var candidates = findWhoToAttachUA(model);
		if (candidates.length > 1) {
			// many units can have this UA
			$( "#unit-size-title").html("Add " + model.name);
			var title = "Attach " + model.name + " to ...";

			var buttons = new Array();

			candidates.map( function(candidate) {
				var button = {
					text: candidate.name,
					click: function() {
						addUA(candidate, model);
						$( this ).dialog( "close" );
						}
					};
				buttons.push(button);
			});

			$( "#dialog-confirm-unit-size" ).dialog({
				resizable: false,
				height:"auto",
				title:title,
				width:450,
				modal: true,
				buttons: buttons
			});
		} else if (candidates.length == 1) {
			addUA(candidates[0], model);
		} else {
			alert("No UNIT attach this unit attachment");
		}
	} else if (model.type == "RA") {
		var candidates = findWhoToAttachRA(model);
		if (candidates.length > 1) {
			// many units can have this UA
			$( "#unit-size-title").html("Add " + model.name);
			var title = "Attach " + model.name + " to ...";

			var buttons = new Array();

			candidates.map( function(candidate) {
				var button = {
					text: candidate.name,
					click: function() {
						addUA(candidate, model);
						$( this ).dialog( "close" );
						}
					};
				buttons.push(button);
			});

			$( "#dialog-confirm-unit-size" ).dialog({
				resizable: false,
				height:"auto",
				title:title,
				width:450,
				modal: true,
				buttons: buttons
			});
		} else if (candidates.length == 1) {
			addUA(candidates[0], model);
		} else {
			alert("No Unit to attach this Ranking Officer");
		}
	} else if (model.type == "WA") {
		var candidates = findWhoToAttachWA(model);
		if (candidates.length > 1) {
			// many units can have this WA
			$( "#unit-size-title").html("Add " + model.name);
			var title = "Attach " + model.name + " to ...";

			var buttons = new Array();

			candidates.map( function(candidate) {
				var button = {
					text: candidate.name,
					click: function() {
						addWA(candidate, model);
						$( this ).dialog( "close" );
						}
					};
				buttons.push(button);
			});

			$( "#dialog-confirm-unit-size" ).dialog({
				resizable: false,
				height:"auto",
				title:title,
				width:450,
				modal: true,
				buttons: buttons
			});
		} else if (candidates.length == 1) {
			addWA(candidates[0], model);
		} else {
			alert("No Unit to attach this Weapon Attachment");
		}
	} 

}

function addWarjack(candidate, model) {
	var selectedNewEntry = {id : "", name:"",  type:"", faction:"", fa:"", cost: "", alteredCost:-1};
	selectedNewEntry.id = model.id;
	selectedNewEntry.type = "warjack";
	selectedNewEntry.name = model.name;
	selectedNewEntry.faction = model.faction;
	selectedNewEntry.fa = model.fa;
	selectedNewEntry.cost = model.cost;
	selectedNewEntry.specialist = false;
	selectedNewEntry.canSpecialist = show_specialists;

	if (model.free == true) {
		selectedNewEntry.alteredCost = 0;
		selectedNewEntry.free = true;
	}

	$.observable(candidate.warjacks).insert(selectedNewEntry);
	recomposeArmy();
}

function addWarbeast(candidate, model) {
	var selectedNewEntry = {id : "", name:"",  type:"", faction:"", fa:"", cost: "", alteredCost:-1};
	selectedNewEntry.id = model.id;
	selectedNewEntry.type = "warbeast";
	selectedNewEntry.name = model.name;
	selectedNewEntry.faction = model.faction;
	selectedNewEntry.fa = model.fa;
	selectedNewEntry.cost = model.cost;
	selectedNewEntry.specialist = false;
	selectedNewEntry.canSpecialist = show_specialists;

	if (model.free == true) {
		selectedNewEntry.alteredCost = 0;
		selectedNewEntry.free = true;
	}

	$.observable(candidate.warbeasts).insert(selectedNewEntry);
	recomposeArmy();
}

function addUA(candidate, model) {
	var selectedNewEntry = {id : "", name:"",  type:"", faction:"", fa:"", cost: "", alteredCost:-1};
	selectedNewEntry.id = model.id;
	selectedNewEntry.type = model.type;
	selectedNewEntry.name = model.name;
	selectedNewEntry.faction = model.faction;
	selectedNewEntry.fa = model.fa;
	selectedNewEntry.cost = model.cost;
	selectedNewEntry.specialist = false;
	selectedNewEntry.canSpecialist = show_specialists;

	if (model.free == true) {
		selectedNewEntry.alteredCost = 0;
		selectedNewEntry.free = true;
	}


	$.observable(candidate).setProperty("attachment", selectedNewEntry);
	recomposeArmy();
}

function addWA(candidate, model) {
	var selectedNewEntry = {id : "", name:"",  type:"", faction:"", fa:"", cost: "", alteredCost:-1};
	selectedNewEntry.id = model.id;
	selectedNewEntry.type = model.type;
	selectedNewEntry.name = model.name;
	selectedNewEntry.faction = model.faction;
	selectedNewEntry.fa = model.fa;
	selectedNewEntry.cost = model.cost;
	selectedNewEntry.specialist = false;
	selectedNewEntry.canSpecialist = show_specialists;

	if (model.free == true) {
		selectedNewEntry.alteredCost = 0;
		selectedNewEntry.free = true;
	}


	$.observable(candidate.weapons).insert(selectedNewEntry);
	recomposeArmy();
}

function addSoloAttachment(candidate, model) {
	var selectedNewEntry = {id : "", name:"",  type:"", faction:"", fa:"", cost: "", alteredCost:-1};
	selectedNewEntry.id = model.id;
	selectedNewEntry.type = "soloAttachment";
	selectedNewEntry.name = model.name;
	selectedNewEntry.faction = model.faction;
	selectedNewEntry.fa = model.fa;
	selectedNewEntry.cost = model.cost;
	selectedNewEntry.specialist = false;
	selectedNewEntry.canSpecialist = show_specialists;

	if (model.free == true) {
		selectedNewEntry.alteredCost = 0;
		selectedNewEntry.free = true;
	}



	$.observable(candidate).setProperty("attachment", selectedNewEntry);
	recomposeArmy();
}

function findWhoToAttachUA(selectionUA) {
	var result = new Array();

	// find models who can have jacks
	selected_entries.entries.map( function(entry) {
		if (entry.type == "unit" || entry.type == "unitMarshall") {
			if (selectionUA.restricted_to && selectionUA.restricted_to instanceof Array) {
				selectionUA.restricted_to.map(function(restrictedId) {
					if (entry.id == restrictedId) {
						if (entry.attachment == null) { // do not add twice!
							result.push(entry);	
						}
					}
				});
			} else if (entry.id == selectionUA.restricted_to) {
				if (entry.attachment == null) { // do not add twice!
					result.push(entry);	
				}
			}
		}
	});

	return result;

}

function findWhoToAttachRA(selectionRA) {
	var result = new Array();

	// find models who can have jacks
	selected_entries.entries.map( function(entry) {
		if (entry.type == "unit" || entry.type == "unitMarshall" ) {
			if (entry.faction == "faction_mercs") {
				// ranking officer attach only to mercs
				if (entry.attachment == null) { // do not add twice!
					result.push(entry);	
				}
			}
		}
	});

	return result;

}

function findWhoToAttachWA(selectionWA) {
	var result = new Array();

	// find models who can have jacks
	selected_entries.entries.map( function(entry) {
		if (entry.type == "unit" || entry.type == "unitMarshall" ) {
			if ( entry.id == selectionWA.restricted_to) {
				if (entry.weapons.length < 3) {
					result.push(entry);		
				}
				
			}
		}
	});

	return result;

}



function findWhoToAttachSolo(selectionSolo) {
	var result = new Array();

	// find models who can have an attachment
	selected_entries.entries.map( function(entry) {
		if (entry.type == "warcaster" || entry.type == "warlock") {
			if (entry.attachment == null) { // do not add twice!
				result.push(entry);	
			}
		}
	});

	return result;	
}

function findWhoToAttachWarjack(selectionWarjack) {

	var result = new Array();

	// find models who can have jacks
	selected_entries.entries.map( function(entry) {

		var canAdd = false;

		if (entry.type == "warcaster") {
			canAdd = true;
		}
		if (entry.type == "soloMarshall") {
			if (selectionWarjack.fa != "C") { // marshall do not have character jacks
				if (entry.warjacks.length < 2) { // marshall have at most 2 jacks
					canAdd = true;
				}
			}
		}
		if (entry.type == "soloJourneyMan") {
			canAdd = true;
		}
		if (entry.type == "unitMarshall") {
			if (selectionWarjack.fa != "C") { // marshall do not have character jacks
				if (entry.warjacks.length < 2) { // marshall have at most 2 jacks
					canAdd = true;
				}
			}
		}
		if (entry.type == "unit") {
			if (entry.attachment != null &&  entry.attachment.type=="UAMarshall") {
				if (selectionWarjack.fa != "C") { // marshall do not have character jacks
					if (entry.warjacks.length < 2) { // marshall have at most 2 jacks
						canAdd = true;
					}
				}
			}
		}

		// filter upon faction
		if (selectionWarjack.faction != entry.faction) {
			// will only use faction warjacks
			canAdd = false;
		}

		// filter upon "restricted_to"
		if (selectionWarjack.restricted_to) {
			conserveUponRestriction = false;	
			selectionWarjack.restricted_to.map( function(restricted_to) {
				if (restricted_to == entry.id) {
					conserveUponRestriction = true;
				}
			});

			if (conserveUponRestriction == false) {
				canAdd = false;
			}
		}

		if (canAdd) {
			result.push(entry);
		}


	});

	return result;
}

function findWhoToAttachWarbeast(selectionWarbeast) {

	var result = new Array();

	// find models who can have jacks
	selected_entries.entries.map( function(entry) {

		var canAdd = false;

		if (entry.type == "warlock") {
			canAdd = true;
		}
		if (entry.type == "soloLesserWarlock") {
			canAdd = true;
		}

		// filter upon faction
		if (selectionWarbeast.faction != entry.faction) {
			// will only use faction warjacks
			canAdd = false;
		}

		// filter upon "restricted_to" on the beast
		if (selectionWarbeast.restricted_to) {
			conserveUponRestriction = false;	
			selectionWarbeast.restricted_to.map( function(restricted_to) {
				if (restricted_to == entry.id) {
					conserveUponRestriction = true;
				}
			});

			if (conserveUponRestriction == false) {
				canAdd = false;
			}
		}

		// filter upon "restricted_to" on the (lesser) warlock
		if (entry.restricted_to) {
			conserveUponRestriction = false;	
			entry.restricted_to.map( function(restricted_to) {
				if (restricted_to == selectionWarbeast.id) {
					conserveUponRestriction = true;
				}
			});

			if (conserveUponRestriction == false) {
				canAdd = false;
			}
		}

		if (canAdd) {
			result.push(entry);
		}


	});

	return result;
}

function recomposeArmy() {

	var commanderCount = 0;

	calculateSelectionCount();

	// count commanders
	for (var i = 0; i < full_entries.groups.length; i++) {
		var group = full_entries.groups[i];
		group.entries.map( function(entry) {
			if (entry.selectedFA == 1) {
				if (entry.type == "warcaster" || entry.type == "warlock") {
					commanderCount ++;
				}
			}
		});
	}

	// Calculate tier bonuses before the Compendium
	if (currentTier) {
		computeTiersLevel();
		computeTiersBonus();
	}

	calculateCompendium();

	for (var i = 0; i < full_entries.groups.length; i++) {
		var group = full_entries.groups[i];
		group.entries.map( function(entry) {

			var isAddable = true;
			if (entry.type == "warcaster" || entry.type == "warlock") {
				if (entry.selectedFA > 0) {
					isAddable = false;
				}
				if (commanderCount >= nb_casters) {
					isAddable = false;	
				}
			} else {
				if (commanderCount == 0) {
					isAddable = false;
				} else {
					if ( entry.fa == "C") {
						if (entry.selectedFA == 1) {
							isAddable = false;
						}
					} else if (entry.fa == "U") {
						// nothing
					} else {
						if (entry.alteredFA != 0) {
							if (entry.alteredFA == "U") {
								// nothing
							}
							if (entry.selectedFA == entry.alteredFA * commanderCount) {
								isAddable = false;

								// special case : Weapon attachments
								if (entry.type == "WA") {
									selected_entries.entries.map(function(unit){
										if (unit.id == entry.restricted_to) {
											if (unit.weapons.length < 3) { 
												// at least one unit with less than 3 WAs
												isAddable = true;
											}
										}
									});
								}

							}
						} else {
							if (entry.selectedFA == entry.fa * commanderCount) {
								isAddable = false;

								// special case : Weapon attachments
								if (entry.type == "WA") {
									selected_entries.entries.map(function(unit){
										if (unit.id == entry.restricted_to) {
											if (unit.weapons.length < 3) { 
												// at least one unit with less than 3 WAs
												isAddable = true;
											}
										}
									});
								}
							}
						}

						if (entry.free == true) { 
							// free models can be added regardless of FA.
							isAddable = true;
						}
					}
				}
			}
			$.observable(entry).setProperty("isAddable", isAddable );
		});
	}	
	

	displayThemeIcons();

}

/**
* re-calculate the FA for each selection entry depending on selected models
*/
function calculateSelectionCount() {
	
	for (var i = 0; i < full_entries.groups.length; i++) {
		var group = full_entries.groups[i];
		group.entries.map( function(entry) {
			$.observable(entry).setProperty("selectedFA", 0);
		});
	}

	selected_entries.entries.map(function(entry) {

		if (entry.free == true) {
			return; // free models do not count toward FA
		}
		addOne(entry);
		// treat attachments && warjacks && warbeasts
		if (entry.warjacks && entry.warjacks.length > 0) {
			for (var i = 0; i < entry.warjacks.length; i++) {
				if (entry.warjacks[i] == true) {
					return; // free models do not count toward FA
				}
				addOne(entry.warjacks[i]);
			}
		}

		if (entry.warbeasts && entry.warbeasts.length > 0) {
			for (var i = 0; i < entry.warbeasts.length; i++) {
				if (entry.warbeasts[i] == true) {
					return; // free models do not count toward FA
				}
				addOne(entry.warbeasts[i]);
			}
		}

		if (entry.attachment != null) {
			if (entry.attachment.free == true) {
				return; // free models do not count toward FA
			}
			addOne(entry.attachment);
		}

		if (entry.weapons && entry.weapons.length > 0) {
			// count only one for all WA of unit
			addOne(entry.weapons[0]);
		}

	});
}

function addOne(selectedEntry) {
	var selectionEntry = findSelection(selectedEntry.id);
	var oldFA = selectionEntry.selectedFA;
	oldFA ++;
	$.observable(selectionEntry).setProperty("selectedFA", oldFA);
}

/**
find the selection whose id is given
*/
function findSelection(entryId) {
	var result;
	for (var i = 0; i < full_entries.groups.length; i++) {
		var group = full_entries.groups[i];
		group.entries.map( function(entry) {
			if (entry.id == entryId) {
				result = entry;
			}
		});
	}
	return result;
}

function getRealCost(entry) {
	if (entry.free == true) {
		return 0;
	} else {
		if (entry.alteredCost != -1) {
			return entry.alteredCost;
		} else {
			return entry.cost;
		}
	}
}

function returnArmyPoints() {
	var result = army_points_selected + '/ ' + army_points ;
	if (army_points_specialists_selected > 0) {
		result += ' (SPE :' + army_points_specialists_selected + '/' + army_points_specialists + ')';
	}
	return result;
}

function calculateCompendium() {
	var WCCount = 0;
	var WLCount = 0;
	var WJCount = 0;
	var WBCount = 0;
	var BECount = 0;
	var UnitCount = 0;
	var SoloCount = 0;

	army_points_selected = 0;
	army_points_specialists_selected = 0;

	selected_entries.entries.map(function(entry) {
		if (entry.type == "warcaster" || entry.type == "warlock" ) {
			WCCount ++;
			army_points_selected -= entry.cost;
		} else {
			if (entry.specialist == true) {
				army_points_specialists_selected += getRealCost(entry);	
			} else {
				army_points_selected += getRealCost(entry);		
			}
		}
		if (entry.type == "unit" || entry.type == "unit_marshall") {
			UnitCount ++;
		}

		if (entry.warjacks && entry.warjacks.length > 0) {
			WJCount += entry.warjacks.length;
			for (var i = 0; i < entry.warjacks.length; i++) {
				if (entry.warjacks[i].specialist == true) {
					army_points_specialists_selected += getRealCost(entry.warjacks[i]);	
				} else {
					army_points_selected += getRealCost(entry.warjacks[i]);		
				}
			}
		}

		if (entry.warbeasts && entry.warbeasts.length > 0) {
			WBCount += entry.warbeasts.length;
			for (var i = 0; i < entry.warbeasts.length; i++) {
				if (entry.warbeasts[i].specialist == true) {
					army_points_specialists_selected += getRealCost(entry.warbeasts[i]);	
				} else {
					army_points_selected += getRealCost(entry.warbeasts[i]);		
				}
			}
		}

		if (entry.attachment != null) {
			if (entry.attachment.specialist == true) {
				army_points_specialists_selected += getRealCost(entry.attachment);
			} else {
				army_points_selected += getRealCost(entry.attachment);		
			}
		}

		if (entry.weapons && entry.weapons.length > 0) {
			for (var i = 0; i < entry.weapons.length; i++) {
				if (entry.weapons[i].specialist == true) {
					army_points_specialists_selected += getRealCost(entry.weapons[i]);	
				} else {
					army_points_selected += getRealCost(entry.weapons[i]);		
				}
			}
		}

// model_types = ["warcaster", "warlock", "warjack", "colossal", "warbeast", "unit", "unit_marshall", "UA", "UAMarshall", "WA", "RA", "solo", "soloMarshall", "soloDragoon", "soloAttachment", "soloJourneyMan", "soloLesserWarlock"];

		if (entry.type == "battleengine") {
			BECount ++;
		}
		if (entry.type == "solo" || entry.type == "soloJourneyMan" || entry.type == "soloLesserWarlock" ||  entry.type == "soloAttachment" ||  entry.type == "soloDragoon" ||  entry.type == "soloMarshall") {
			SoloCount ++;
		}		
	});

	var compendiumString = "";
	compendiumString += "Caster:" + WCCount 
	if (WJCount > 0) {
		compendiumString += " WJ:" + WJCount 
	} 
	if (WBCount > 0) {
		compendiumString += " WB:" + WBCount 
	}
	compendiumString += " U:" + UnitCount + " S:" + SoloCount;
	$("#compendium").html(compendiumString);
	
	var armyPointsFormated = army_points_selected;
	if (army_points_selected > army_points ) {
		armyPointsFormated = '<font color = "red">' + army_points_selected + '</font>';
	} else {
		armyPointsFormated = '<font color = "green">' + army_points_selected + '</font>';
	}

	var armyPointsSpecialistsFormated = army_points_specialists_selected;
	if (army_points_specialists_selected > army_points_specialists ) {
		armyPointsSpecialistsFormated = '<font color = "red">' + army_points_specialists_selected + '</font>';
	} else {
		armyPointsSpecialistsFormated = '<font color = "green">' + army_points_specialists_selected + '</font>';
	}

	var armyPointsString = WCCount + '/' + nb_casters + ' casters  [' + armyPointsFormated + '/' + army_points + ' PC]';
	if (show_specialists) {
		armyPointsString +=  ' [' + armyPointsSpecialistsFormated + '/' + army_points_specialists + ' Specialist]';
	}
	
	$("#army_points_div").html(armyPointsString) ;
}

function addWarcaster(model) {
	// create a warcaster
	var selectedNewEntry = {id : "", name:"",  type:"", faction:"", fa:"", cost: "", alteredCost:-1};
	selectedNewEntry.id = model.id;
	selectedNewEntry.type = "warcaster";
	selectedNewEntry.name = model.name;
	selectedNewEntry.faction = model.faction;
	selectedNewEntry.fa = model.fa;
	selectedNewEntry.cost = model.cost;
	selectedNewEntry.warjacks = new Array();
	selectedNewEntry.canSpecialist = false;

	//$.observable(model).setProperty("selectedFA", 1 );
	//$.observable(model).setProperty("isAddable", false);
	// model.selectedFA = 1;

	$.observable(selected_entries.entries).insert(selectedNewEntry);

	recomposeArmy();
}

function addWarlock(model) {
	// create a warcaster
	var selectedNewEntry = {id : "", name:"",  type:"", faction:"", fa:"", cost: "", alteredCost:-1};
	selectedNewEntry.id = model.id;
	selectedNewEntry.type = "warlock";
	selectedNewEntry.name = model.name;
	selectedNewEntry.faction = model.faction;
	selectedNewEntry.fa = model.fa;
	selectedNewEntry.cost = model.cost;
	selectedNewEntry.warbeasts = new Array();
	selectedNewEntry.canSpecialist = false;

	//$.observable(model).setProperty("selectedFA", 1 );
	//$.observable(model).setProperty("isAddable", false);
	// model.selectedFA = 1;

	$.observable(selected_entries.entries).insert(selectedNewEntry);

	recomposeArmy();
}

function addBattleEngine(model) {
	var selectedNewEntry = {id : "", name:"",  type:"", faction:"", fa:"", cost: "", alteredCost:-1};
	selectedNewEntry.id = model.id;
	selectedNewEntry.type = model.type;
	selectedNewEntry.name = model.name;
	selectedNewEntry.faction = model.faction;
	selectedNewEntry.fa = model.fa;
	selectedNewEntry.cost = model.cost;
	selectedNewEntry.specialist = false;
	selectedNewEntry.canSpecialist = show_specialists;

	if (model.free == true) {
		selectedNewEntry.alteredCost = 0;
		selectedNewEntry.free = true;
	}

	$.observable(model).setProperty("selectedFA", 1 );
	$.observable(selected_entries.entries).insert(selectedNewEntry);

	recomposeArmy();
}

function addSolo(model)	 {
	var selectedNewEntry = {id : "", name:"",  type:"", faction:"", fa:"", cost: "", alteredCost:-1};
	selectedNewEntry.id = model.id;
	selectedNewEntry.type = model.type;
	selectedNewEntry.name = model.name;
	selectedNewEntry.faction = model.faction;
	selectedNewEntry.fa = model.fa;
	selectedNewEntry.cost = model.cost;
	selectedNewEntry.warjacks = new Array();
	selectedNewEntry.warbeasts = new Array();
	selectedNewEntry.specialist = false;
	selectedNewEntry.canSpecialist = show_specialists;

	if (model.free == true) {
		selectedNewEntry.alteredCost = 0;
		selectedNewEntry.free = true;
	}

	if (model.restricted_to != undefined) {
		selectedNewEntry.restricted_to = model.restricted_to;
	}


	$.observable(model).setProperty("selectedFA", 1 );
	$.observable(selected_entries.entries).insert(selectedNewEntry);

	recomposeArmy();

}

function addUnitVariable(modelId, minOrMax) {
	var model = findEntry(modelId);

	var selectedNewEntry = {id : "", name:"",  type:"", faction:"", fa:"", cost: "", alteredCost:-1};
	selectedNewEntry.id = modelId;
	selectedNewEntry.type = model.type;
	selectedNewEntry.name = model.name;
	selectedNewEntry.warjacks = new Array();
	selectedNewEntry.weapons = new Array();
	selectedNewEntry.specialist = false;
	selectedNewEntry.canSpecialist = show_specialists;


	if (minOrMax == "min") {
		selectedNewEntry.name += ' (' + model.min + ' models)';
		selectedNewEntry.cost = model.costMin;
	} else {
		selectedNewEntry.name += ' (' + model.max + ' models)';
		selectedNewEntry.cost = model.costMax;
	}
	selectedNewEntry.faction = model.faction;
	selectedNewEntry.fa = model.fa;
	
	selectedNewEntry.attachment = null;

/*	var oldFaValue = model.selectedFA;
	$.observable(model).setProperty("selectedFA", oldFaValue + 1 );
*/	$.observable(selected_entries.entries).insert(selectedNewEntry);
	console.log("adding unit : " + model.name + " at size " + minOrMax);
	recomposeArmy();
}

function addUnitFixed(modelId) {
	var model = findEntry(modelId)
	var selectedNewEntry = {id : "", name:"",  type:"", faction:"", fa:"", cost: "", warjacks:"", alteredCost:-1};
	selectedNewEntry.id = modelId;
	selectedNewEntry.type = "unit";
	selectedNewEntry.name = model.name;
	selectedNewEntry.warjacks = new Array();
	selectedNewEntry.weapons = new Array();
	selectedNewEntry.specialist = false;
	selectedNewEntry.canSpecialist = show_specialists;

	selectedNewEntry.faction = model.faction;
	selectedNewEntry.fa = model.fa;
	selectedNewEntry.cost = model.cost;
	selectedNewEntry.attachment = null;

	var oldFaValue = model.selectedFA;
/*	$.observable(model).setProperty("selectedFA", oldFaValue + 1 );
*/	$.observable(selected_entries.entries).insert(selectedNewEntry);

	console.log("adding unit : " + model.name + " with fixed size ");
	recomposeArmy();
}

function findEntry(modelId) {

	var result;
	for (var i = 0; i < full_entries.groups.length; i++) {
		var group = full_entries.groups[i];
		group.entries.map( function(entry) {
			if (entry.id == modelId) {
				console.log("entry found for modeId : " + modelId);
				result = entry;
			}
		});

	}
	return result;
}

function changeFaction() {
	selectedFaction = $('#select-native-faction').val();
	selectedFactionId = faction_ids[selectedFaction];
	var selectedTier = $('#select-native-tierOrContract').val();
	tierId = selectedTier;


	// completely clean group, and repopulate from faction.
	var groups = new Array();
	

	currentTier = null;
	full_tiers[selectedFaction].tiers.map(function (tier) {
		if (tier.name == tierId) {
			currentTier = tier;
		}
	});


	// add properties for tier to each entry ..
	full_data[selectedFaction].groups.map(function(group) {
		group.entries.map(function(entry) {
			entry.selectedFA = 0;
			entry.alteredFA = 0;
			entry.free = false;
			entry.alteredCost = -1;
			entry.isTierModified = false;
		});
	});


	if (currentTier) {
		// filter upon "only" models
		full_data[selectedFaction].groups.map(function(initialGroup) {

			var keepEntries = initialGroup.entries.filter(function(initialEntry){
				if ( $.inArray(initialEntry.id, currentTier.levels[0].onlyModels.ids) != -1) {
					return true;
				}
				return false;
			});


			var newGroup = {id:initialGroup.id, label:initialGroup.label, logo:initialGroup.logo, entries : keepEntries};
			groups.push(newGroup);
		});

	} else {
		// take all models from faction
		full_data[selectedFaction].groups.map(function(initialGroup) {
			groups.push(initialGroup);
		});
	}


	if (chosenSystem == systems[0]) { // warmachine
		// include mercs
		var merc_groups = full_data["Mercenaries"].groups;

		var mercs_casters_marshall_warlocks = [];

// first step : count caster, journeyman, ... to allow for warjacks filtering.
		merc_groups.map( function(group) {
			group.entries.map(function (entry) {
				var conserveEntry = false;
				if (entry.works_for && entry.works_for.length > 0) {
					entry.works_for.map( function(faction_for) {
						if (faction_for == selectedFactionId) {
							conserveEntry = true;
						}
					});
				}

				if (currentTier) {
					if ( $.inArray(entry.id, currentTier.levels[0].onlyModels.ids) == -1) {
						conserveEntry = false; // model not included in tier
					}
				}

				// find model that can have warjacks/warbeasts
				if (conserveEntry && (entry.type == "warcaster" || entry.type == "warlock" 
					|| entry.type == "unitMarshall" || entry.type == "soloMarshall"
					|| entry.type == "UAMarshall" 
					|| entry.type == "soloJourneyMan" || entry.type == "soloLesserWarlock")) {

					if (entry.type == "warcaster" || entry.type == "warlock") {
						if ( nb_casters > 1) {
							// count merc casters ONLY if more than 1 caster in army...
							mercs_casters_marshall_warlocks.push(entry.id);		
						}
					} else {
						mercs_casters_marshall_warlocks.push(entry.id);		
					}
				}
			});
		});

		merc_groups.map( function(group) {
			// filter entries upon faction work for
			var entries_remaining = group.entries.filter(function (entry) {
				var conserveEntry = false;
				if (entry.works_for && entry.works_for.length > 0) {
					entry.works_for.map( function(faction_for) {
						if (faction_for == selectedFactionId) {
							conserveEntry = true;
						}
					});
				}

				if (currentTier) {
					if ( $.inArray(entry.id, currentTier.levels[0].onlyModels.ids) == -1) {
						conserveEntry = false; // model not included in tier
					}
				}


				if (entry.type == "warcaster" || entry.type == "warlock") {
					if ( nb_casters < 2) {
						// count merc casters ONLY if more than 1 caster in army...
						conserveEntry = false;		
					}
				}

				// treat warjacks / beast depending on model restriction, not faction.
				if (entry.type == "warjack" || entry.type == "warbeast" ) {
					// warjacks & warbeasts are affiliated to caster/warlock, not faction
					if (entry.restricted_to) {
						entry.restricted_to.map( function(restricted_to) {
							mercs_casters_marshall_warlocks.map(function (wannabeOwnerId) {
								if (restricted_to == wannabeOwnerId) {
									conserveEntry = true;	
								}
							});
						});
					}
				}

				return conserveEntry;
			});
		
			entries_remaining.map(function(entry){
				// dynamically add properties needed
				entry.selectedFA = 0;
				entry.alteredFA = 0;
				entry.free = false;
				entry.alteredCost = -1;
				entry.isTierModified = false;
			});


			if (entries_remaining != null && entries_remaining.length > 0) {
				var newGroup = {id:group.id, label:group.label, logo:group.logo, entries : entries_remaining};
				groups.push(newGroup);
			}
		});

		// treat warjacks / beast depending on model restriction, not faction.

	} else {
		// include minions

		var minion_groups = full_data["Minions"].groups;

		var minions_casters_marshall_warlocks = [];

// first step : count caster, journeyman, ... to allow for warjacks filtering.
		minion_groups.map( function(group) {
			group.entries.map(function (entry) {
				var conserveEntry = false;
				if (entry.works_for && entry.works_for.length > 0) {
					entry.works_for.map( function(faction_for) {
						if (faction_for == selectedFactionId) {
							conserveEntry = true;
						}
					});
				}

				if (currentTier) {
					if ( $.inArray(entry.id, currentTier.levels[0].onlyModels.ids) == -1) {
						conserveEntry = false; // model not included in tier
					}
				}

				// find model that can have warjacks/warbeasts
				if (conserveEntry && (entry.type == "warcaster" || entry.type == "warlock" 
					|| entry.type == "unitMarshall" || entry.type == "soloMarshall"
					|| entry.type == "UAMarshall" 
					|| entry.type == "soloJourneyMan" || entry.type == "soloLesserWarlock")) {

					if (entry.type == "warcaster" || entry.type == "warlock") {
						if ( nb_casters > 1) {
							// count minion casters ONLY if more than 1 caster in army...
							minions_casters_marshall_warlocks.push(entry.id);		
						}
					} else {
						minions_casters_marshall_warlocks.push(entry.id);		
					}
				}
			});
		});

		minion_groups.map( function(group) {
			// filter entries upon faction work for
			var entries_remaining = group.entries.filter(function (entry) {
				var conserveEntry = false;
				if (entry.works_for && entry.works_for.length > 0) {
					entry.works_for.map( function(faction_for) {
						if (faction_for == selectedFactionId) {
							conserveEntry = true;
						}
					});
				}

				if (currentTier) {
					if ( $.inArray(entry.id, currentTier.levels[0].onlyModels.ids) == -1) {
						conserveEntry = false; // model not included in tier
					}
				}


				if (entry.type == "warcaster" || entry.type == "warlock") {
					if ( nb_casters < 2) {
						// count minion casters ONLY if more than 1 caster in army...
						conserveEntry = false;		
					}
				}

				// treat warjacks / beast depending on model restriction, not faction.
				if (entry.type == "warjack" || entry.type == "warbeast" ) {
					// warjacks & warbeasts are affiliated to caster/warlock, not faction
					if (entry.restricted_to) {
						entry.restricted_to.map( function(restricted_to) {
							minions_casters_marshall_warlocks.map(function (wannabeOwnerId) {
								if (restricted_to == wannabeOwnerId) {
									conserveEntry = true;	
								}
							});
						});
					}
				}

				return conserveEntry;
			});
		
			entries_remaining.map(function(entry){
				// dynamically add properties needed
				entry.selectedFA = 0;
				entry.alteredFA = 0;
				entry.free = false;
				entry.alteredCost = -1;
				entry.isTierModified = false;
			});


			if (entries_remaining != null && entries_remaining.length > 0) {
				var newGroup = {id:group.id, label:group.label, logo:group.logo, entries : entries_remaining};
				groups.push(newGroup);
			}
		});		
	}


	// sort models in each group based on name alphabetically
	groups.map( function(group) {
		group.entries.sort(function(a, b) {
			var x = a.name.toLowerCase(), y = b.name.toLowerCase();
	        return x < y ? -1 : x > y ? 1 : 0;
		});
	});


	// map all entries id/name
	groups.map( function(group) {
		group.entries.map(function(entry) {
			namesForEntries[entry.id] = entry.name;
		});
	});


	if (currentTier) {
		currentTier.levels.map(function(level) {
			level.mustHave.map(function(must) {
				var models = "";
				for (var i = 0; i < must.ids.length; i++) {
					if (i == 0 && must.ids.length > 1) {
						models += "(";
					}
					if (i > 0) {
						models += "; ";
					}
					models += namesForEntries[must.ids[i]];
					if (i == must.ids.length - 1 && must.ids.length > 1) {
						models += ")";
					}
				}
				must.mustHaveString = models;
			});

			level.faAlterations.map(function(alteration){
				var faAlterString;
				var modelName = namesForEntries[alteration.id];
				if (alteration.bonus == 512) {
					faAlterString = modelName + " become FA:U";
				} else {
					faAlterString = "The FA of " + modelName + " increases by +" + alteration.bonus ;

					if (alteration.forEach) {
						faAlterString += " for each ";
						if (alteration.forEach.length > 1) {
							faAlterString += "(";
						}
						for (var i = 0; i < alteration.forEach.length; i++) {
							if (i > 0) {
								faAlterString += "; ";
							}
							faAlterString += namesForEntries[alteration.forEach[i]];
						}
						if (alteration.forEach.length > 1) {
							faAlterString += ")";
						}
					}


				}
				alteration.faAlterString = faAlterString;
			});

			level.costAlterations.map(function(alteration){
				var modelName = namesForEntries[alteration.id];
				var costAlterString = "Reduce the point cost of " + modelName + " by " + alteration.bonus ;

				if (alteration.restricted_to) {
					costAlterString += " if it is attached to " + namesForEntries[alteration.restricted_to];
				}
				alteration.costAlterString = costAlterString;
			});

			level.freeModels.map(function(freeModel){
				var freeModelString = "Add ";
				
				if (freeModel.id instanceof Array) {
					freeModelString += " one of ("
					for (var i = 0 ; i < freeModel.id.length; i++) {
						if (i>0) {
							freeModelString += ";";
						}
						freeModelString += namesForEntries[freeModel.id[i]];
					}
					freeModelString += ")"
				} else {
				 	freeModelString += "a " + namesForEntries[freeModel.id];
				}
				freeModelString += " free of cost";
				if (freeModel.forEach && freeModel.forEach.length > 0) {
					freeModelString += " for each ";
						if (freeModel.forEach.length > 1) {
							freeModelString += "(";
						}
						for (var i = 0; i < freeModel.forEach.length; i++) {
							if (i > 0) {
								freeModelString += "; ";
							}
							freeModelString += namesForEntries[freeModel.forEach[i]];
						}
						if (freeModel.forEach.length > 1) {
							freeModelString += ")";
						}
				}
				freeModelString += ". This entry ignores FA restrictions." ;
				freeModel.freeModelString = freeModelString;
			});

// Reduce the point cost ofStormclad warjacks by 1.
// Arcane Tempest Gun Mage units in this army
// Stormsmith Stormcaller solos increases by + 1 for every heavy warjack included

// Add a unit attachment to one Arcane Tempest Gun Mage unit free of cost. This unit attachment ignores FA restrictions.


		});
	}




	$.observable(full_entries).setProperty("groups", groups);
	$.observable(selected_entries.entries).remove(0,selected_entries.entries.length);
	buildResume();
	recomposeArmy();
	$("#army_options").accordion( "option", "active", 2 );
}

function showSpecialists(show) {
	if (show) {
		show_specialists = true;
	} else {
		show_specialists = false;
	}

	selected_entries.entries.map(function (entry) {
		// entry.canSpecialist = show;
		if (entry.type == "warcaster" || entry.type == "warlock") {
			$.observable(entry).setProperty("canSpecialist", false); // caster/lock are never specialists.
		} else {
			$.observable(entry).setProperty("canSpecialist", show);	
			if (!show) {
				$.observable(entry).setProperty("specialist", false);
			}
		}
		if (entry.attachment) {
			$.observable(entry.attachment).setProperty("canSpecialist", show);	
			if (!show) {
				$.observable(entry.attachment).setProperty("specialist", false);
			}
		}
		if (entry.warjacks instanceof Array) {
			entry.warjacks.map(function(warjack) {
				$.observable(warjack).setProperty("canSpecialist", show);	
				if (!show) {
					$.observable(warjack).setProperty("specialist", false);
				}
			});
		}
	});

	calculateCompendium();
}

function flipSpecialist(selectedModel) {
	if (selectedModel.specialist == true) {
		$.observable(selectedModel).setProperty("specialist", false);
	} else {
		$.observable(selectedModel).setProperty("specialist", true);
	}
	calculateCompendium();
}

function flipSpecialistAttachment(index, selectedParent) {
	if (selectedParent.attachment.specialist == true) {
		$.observable(selectedParent.attachment).setProperty("specialist", false);
	} else {
		$.observable(selectedParent.attachment).setProperty("specialist", true);
	}
	calculateCompendium();
}

function showThemeLevel(event, levelValue) {

	var currentTier;
	full_tiers[selectedFaction].tiers.map(function (tier) {
		if (tier.name == tierId) {
			currentTier = tier;
		}
	});

	var title = "Theme data for level " + levelValue;
	var tier1Models = $.templates("#tierLevelTemplate").render(currentTier);
	$("#theme_groups_available").html(tier1Models);
	var tierBenefits = $.templates("#tierBenefitsTemplate").render(currentTier.levels[levelValue-1]);
	$("#theme_benefits").html(tierBenefits);
	var tierMustHave = $.templates("#tierMustHaveTemplate").render(currentTier.levels[levelValue-1]);
	$("#theme_must_have").html(tierMustHave);
	

	$( "#dialog-theme-display" ).dialog({
					resizable: false,
					height:"auto",
					title:title,
					width:450,
					modal: true
				});	
}

function displayThemeIcons() {
	if (tierId == null || tierId == "None") {
		$("#tiers_div").hide();
	} else {
		$("#tiers_div").show();
		$("#theme_title").html(tierId);

		for (var i = 1; i <= 4; i++) {
			if (i > tierLevelComputed) {
				$("#tier" + i).addClass("halfTransparent");
			} else {
				$("#tier" + i).removeClass("halfTransparent");	
			}
		}
		
		$("#tier1").data({ level: 1 });
		$("#tier2").data({ level: 2 });
		$("#tier3").data({ level: 3 });
		$("#tier4").data({ level: 4 });
	}

}

function buildResume() {
	army_points = $("#range-army-points").slider("option", "value");
	army_points_specialists = $("#range-specialits-points").slider("option", "value");
	faction = $('#select-native-faction').val();
	if ( $('#flip-specialists').val() == 'off') {
		army_points_specialists = 0
	}
	var sResume =  army_points + '+' + army_points_specialists  + ' points (' + faction + ')';
	$("#resume").html(sResume);
}

function computeTiersLevel() {

	tierLevelComputed = 0;

	currentTier.levels.map(function(level) {

		var failedLevel = false;
		if (level.level > tierLevelComputed + 1 ) {
			// close immediately
			return;
		}

		level.mustHave.map(function(must) {
			var count = 0; // must attein must.min;
			must.ids.map(function(id){
				selected_entries.entries.map(function (entry) {
					if (entry.id == id) {
						count ++;
					}
					if (entry.attachment) {
						if (entry.attachment.id == id) {
							count ++;		
						}
					}
					
					if (must.inBG == true) {
						if (entry.type == "warcaster" && entry.warjacks) {
							for (var i = 0; i< entry.warjacks.length; i++) {
								if (entry.warjacks[i].id == id) {
									count++;
								}
							}
						}
						if (entry.type == "warlock" && entry.warbeasts) {
							for (var i = 0; i< entry.warbeasts.length; i++) {
								if (entry.warbeasts[i].id == id) {
									count++;
								}
							}
						}

					} else if (entry.type == "unit" && must.inMarshal == true) {
						if (entry.attachment && entry.attachment.type == "UAMarshall") {
							if (entry.warjacks) {
								for (var i = 0; i< entry.warjacks.length; i++) {
									if (entry.warjacks[i].id == id) {
										count++;
									}
								}
							}
						}
					}
					else if ((entry.type == "unitMarshall" || entry.type == "soloMarshall") && (must.inMarshal == true)) {
						if (entry.warjacks) {
							for (var i = 0; i< entry.warjacks.length; i++) {
								if (entry.warjacks[i].id == id) {
									count++;
								}
							}
						}
					} else {
						if (entry.warjacks) {
							for (var i = 0; i< entry.warjacks.length; i++) {
								if (entry.warjacks[i].id == id) {
									count++;
								}
							}
						}
						if (entry.warbeasts) {
							for (var i = 0; i< entry.warbeasts.length; i++) {
								if (entry.warbeasts[i].id == id) {
									count++;
								}
							}
						}
					}
				});
			});
			if (count >= must.min) {
				// ok
			} else {
				failedLevel = true;
			}
		});

		if (!failedLevel) {
			tierLevelComputed = level.level;
		}
	});
}

function computeTiersBonus() {

	if (tierLevelComputed == 0) {
		return;
	}

	for (var i = 0 ; i < tierLevelComputed; i++) {
		currentTier.levels[i].faAlterations.map(function(faAlteration){

			for (var i = 0; i < full_entries.groups.length; i++) {
				var group = full_entries.groups[i];
				for (var j = 0; j < group.entries.length; j++) {
					var entry = group.entries[j];
					if (entry.id == faAlteration.id) {
						var newFA;
						if ( faAlteration.bonus == 512) {
							newFA = "U";	
						} else {
							if (faAlteration.forEach) {	
								// count models already selected
								var count = 0;
								selected_entries.entries.map(function(selected) {
									if ( $.inArray(selected.id, faAlteration.forEach)>=0) {
										count++;
									}
									if (selected.warjacks) {
										selected.warjacks.map(function(warjack){
											if ( $.inArray(warjack.id, faAlteration.forEach)>=0) {
												count++;
											}
										});
									}
									if (selected.warbeasts) {
										selected.warbeasts.map(function(warbeast){
											if ( $.inArray(warbeast.id, faAlteration.forEach)>=0) {
												count++;
											}
										});
									}
									if (selected.attachment != null) {
										if ( $.inArray(selected.attachment.id, faAlteration.forEach)>=0) {
											count++;
										}
									}
								});
								newFA = parseInt(entry.fa) + (faAlteration.bonus * count);
							} else {
								// direct bonus
								newFA = parseInt(entry.fa) + faAlteration.bonus;	
							}
						}
						$.observable(entry).setProperty("alteredFA", newFA);
					}
				}
			}
			
		});

		currentTier.levels[i].costAlterations.map(function(costAlteration){

			// apply cost on "selection models"
			for (var i = 0; i < full_entries.groups.length; i++) {
				var group = full_entries.groups[i];
				for (var j = 0; j < group.entries.length; j++) {
					var entry = group.entries[j];
					if (entry.id == costAlteration.id) {
						if (entry.type == "unit" || entry.type == "unitMarshall") {
							if (entry.min) {
								var newCostMin = entry.costMin - costAlteration.bonus;
								var newCostMax = entry.costMax - costAlteration.bonus;
								$.observable(entry).setProperty("alteredCost", costAlteration.bonus); // just to notify the "if" in template
								$.observable(entry).setProperty("alteredCostMin", newCostMin);
								$.observable(entry).setProperty("alteredCostMax", newCostMax);
							} else {
								var newCost = entry.cost - costAlteration.bonus;
								$.observable(entry).setProperty("alteredCost", newCost);
							}

						} else {
							var newCost = entry.cost - costAlteration.bonus;
							$.observable(entry).setProperty("alteredCost", newCost);
						}
					}
				}
			}

			// apply cost on "selected models"
			selected_entries.entries.map(function (entry) {
				// entry.canSpecialist = show;
				if (entry.type == "warcaster" || entry.type == "warlock") {
					// rien!
				} else {
					if (entry.id == costAlteration.id) {
						var newCost = entry.cost - costAlteration.bonus;
						$.observable(entry).setProperty("alteredCost", newCost);	
					}
				}
				if (entry.attachment) {
					if (entry.attachment.id == costAlteration.id) {
						var newCost = entry.attachment.cost - costAlteration.bonus;
						$.observable(entry.attachment).setProperty("alteredCost", newCost);	
					}

				}
				if (entry.warjacks instanceof Array) {
					entry.warjacks.map(function(warjack) {
						if (warjack.id == costAlteration.id) {
							var newCost = warjack.cost - costAlteration.bonus;
							$.observable(warjack).setProperty("alteredCost", newCost);	
						}
					});
				}
				if (entry.warbeasts instanceof Array) {
					entry.warbeasts.map(function(warbeast) {
						if (warbeast.id == costAlteration.id) {
							var newCost = warbeast.cost - costAlteration.bonus;
							$.observable(warbeast).setProperty("alteredCost", newCost);	
						}
					});
				}

				if (entry.weapons instanceof Array) {
					entry.weapons.map(function(WA) {
						if (WA.id == costAlteration.id) {
							var newCost = WA.cost - costAlteration.bonus;
							$.observable(WA).setProperty("alteredCost", newCost);	
						}
					});
				}
			});



		});


		currentTier.levels[i].freeModels.map(function(freeModel) {
			var alreadyCountedBonus = 0; // count all items for same "bonus" entry

			if (freeModel.id instanceof Array) {
				for (var k = 0 ; k < freeModel.id.length; k++) {
					alreadyCountedBonus = calculateFreeModelCount(freeModel.id[k], alreadyCountedBonus) ;
				}
			} else {
				alreadyCountedBonus = calculateFreeModelCount(freeModel.id, 0) ;
			}


			var bonusCount = 0; // number of time we can apply "free"
			if (freeModel.forEach) {	
				// count models already selected
				var count = 0;
				selected_entries.entries.map(function(selected) {
					if ( $.inArray(selected.id, freeModel.forEach)>=0) {
						count++;
					}
					if (selected.warjacks) {
						selected.warjacks.map(function(warjack){
							if ( $.inArray(warjack.id, freeModel.forEach)>=0) {
								count++;
							}
						});
					}
					if (selected.warbeasts) {
						selected.warbeasts.map(function(warbeast){
							if ( $.inArray(warbeast.id, freeModel.forEach)>=0) {
								count++;
							}
						});
					}
					if (selected.attachment != null) {
						if ( $.inArray(selected.attachment.id, freeModel.forEach)>=0) {
							count++;
						}
					}
				});
				bonusCount = count;
			} else {
				// direct bonus
				bonusCount = 1;
			}

			// apply free on "selection models"
			for (var i = 0; i < full_entries.groups.length; i++) {
				var group = full_entries.groups[i];
				for (var j = 0; j < group.entries.length; j++) {
					var entry = group.entries[j];
					var matchFreeModel = false; // check if this model is included in a free-model-rule

					if (freeModel.id instanceof Array) {
						for (var k = 0 ; k < freeModel.id.length; k++) {
							if (entry.id == freeModel.id[k]) {
								matchFreeModel = true;
							}
						}
					} else {
						if (entry.id == freeModel.id) {
								matchFreeModel = true;
						}
					}

					if (matchFreeModel) {
						if (alreadyCountedBonus < bonusCount ) {
							$.observable(entry).setProperty("free", true);	
							alreadyCountedBonus ++;
						} else {
							$.observable(entry).setProperty("free", false);	
						}
					}
				}
			}
		});

	}

}

function calculateFreeModelCount(entryId, alreadyCountedBonus) {
	// count already existent bonus
	selected_entries.entries.map(function (selected) {
		if (selected.id == entryId && selected.free == true) {
			alreadyCountedBonus++;
		}
		if (selected.attachment) {
			if (selected.attachment.id == entryId && selected.attachment.free == true) {
				alreadyCountedBonus++;
			}
		}

		if (selected.weapons instanceof Array) {
			selected.weapons.map(function(WA) {
				if (WA.id == entryId && WA.free == true) {
					alreadyCountedBonus++;
				}
			});
		}
	});

	return alreadyCountedBonus;

}


