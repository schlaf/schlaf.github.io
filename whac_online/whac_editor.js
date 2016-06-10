
systems = ["Warmachine", "Hordes"];
factions = [];
factions[systems[0]] = ["Cryx", "Cygnar", "Cyriss", "Khador", "Mercenaries", "Protectorate", "Retribution"];
factions[systems[1]] = ["Everblight", "Orboros", "Minions", "Skorne", "Trollblood"];

faction_codes = [];
faction_codes[systems[0]] = ["faction_cryx", "faction_cygnar", "faction_cyriss", "faction_khador", "faction_mercs", "faction_menoth", "faction_retribution"];
faction_codes[systems[1]] = ["faction_everblight", "faction_orboros", "faction_minions", "faction_skorne", "faction_trollblood"];


model_types = ["all", "warcaster", "warlock", "warjack", "colossal", "warbeast", "battle engine", "unit", "CA", "WA","solo"];

MK_status = ["copy of MK2", "Mk3 in progress", "MK3 done"];

selected_model_id = "";
copied_capacity = {_title : "empty", __text : "empty"};
copied_spell = undefined;


var capacities; // all capacities, sorted alphab. asc. on title
var capacities_map = []; // map with oid as key.
var spells; // all spells, sorted alphab. asc. on title
var spells_map = []; // map with oid as key



function populateFactions(systemValue) {
	var options = '';
	var firstFaction = null;
	chosenSystem = systems[systemValue];
	for (var i = 0; i < factions[chosenSystem].length; i++) {
	    options += '<option value="' + i + '">' + factions[chosenSystem][i] + '</option>';
	    if (i == 0) {
	    	firstFaction = factions[chosenSystem][i];
	    }
	}
	$('#select_faction').empty();
	$('#select_faction').html(options);

	$('#select_modelType option[value="0"]').prop('selected', true);
	$('#select_model').empty();
	populateModels(systemValue, 0, 0);
}

function populateModelsChooseFaction(systemValue, factionValue) {
	$('#select_modelType option[value="0"]').prop('selected', true);
	populateModels(systemValue, factionValue, 0);
}

function populateModels(systemValue, factionValue, modeTypeValue) {
	refreshModels(systemValue, factionValue, modeTypeValue);


}


function saveCard(card) {
	$("body").css("cursor", "progress");
	$.ajax({ 
			url: "https://api.mlab.com/api/1/databases/whac/collections/models/" + card._id + "/?apiKey=wcadeCXsaFhH5G4__crfJpZBdloyTTAa" ,
		  	type: "PUT",
		  	contentType: "application/json",
		  	dataType: "json",
		  	data: JSON.stringify( card),
		  	success:   function( data, jqXHR, textStatus){
		  		alert("model updated");
		  	},
		  	error:   function( jqXHR, textStatus, errorThrown ){
	            alert("update failed : " + jqXHR.responseText);
	        },
	        complete : function( jqXHR, textStatus )  {
	        	$("body").css("cursor", "default");
	        }
	});
}

function updateCapacity() {
	$capa_id = $('#input_capa_id').val();
	$capa_name = $('#input_capa_title').val();
	$capa_type = $('#input_capa_type').val();
	$capa_text = $('#input_capa_text').val();
	$("body").css("cursor", "progress");
	$.ajax({ 
		url: "https://api.mlab.com/api/1/databases/whac/collections/capacities/" + $capa_id + "/?apiKey=wcadeCXsaFhH5G4__crfJpZBdloyTTAa" ,
	  	type: "PUT",
	  	contentType: "application/json",
	  	dataType: "json",
	  	data: JSON.stringify( { "_title" : $capa_name , "_type" : $capa_type, "__text" : $capa_text }),
	  	complete:   function( jqXHR, textStatus){
	  		$("body").css("cursor", "default");
	  		// $('#capa_filter').val("");
	  		var capacity_responded = jqXHR.responseJSON;
	  		alert("capacity updated");
	  		refreshCapacities();

	  		// search all cards for capacity to update
	  		pushCapacityInCards(capacity_responded);
	  	}
	});
}

function updateSpell() {
	$spell_id = $('#input_spell_id').val();
	$spell_name = $('#input_spell_title').val();
	$spell_cost = $('#input_spell_cost').val();
	$spell_range = $('#input_spell_range').val();
	$spell_pow = $('#input_spell_pow').val();
	$spell_aoe = $('#input_spell_aoe').val();
	$spell_duration = $('#input_spell_duration').val();
	$spell_off = $('#input_spell_off').val();
	$spell_desc = $('#input_spell_desc').val();
	$("body").css("cursor", "progress");
	$.ajax({ 
		url: "https://api.mlab.com/api/1/databases/whac/collections/spells/" + $spell_id + "/?apiKey=wcadeCXsaFhH5G4__crfJpZBdloyTTAa" ,
	  	type: "PUT",
	  	contentType: "application/json",
	  	dataType: "json",
	  	data: JSON.stringify( { "_name" : $spell_name , "_cost" : $spell_cost, "_rng" : $spell_range, "_pow" : $spell_pow, "_aoe" : $spell_aoe, "_duration" : $spell_duration, "_off" : $spell_off, "__text" : $spell_desc }),
	  	complete:   function( jqXHR, textStatus){
	  		$("body").css("cursor", "default");
	  		$('#spell_filter').val("");
	  		var spell_responded = jqXHR.responseJSON;
	  		$('#input_spell_id').val(spell_responded._id.$oid);
	  		$('.new_spell_button').show()
			$('.create_spell_button').hide();
			$('.update_spell_button').show();

	  		alert("spell updated");
	  		refreshSpells();



	  		// search all cards for spell to update
	  		pushSpellInCards(spell_responded);
	  	}
	  });
}

/** search within all card for this capacity, and updates the card
*/
function pushCapacityInCards(capacity_responded) {
	for (var card_num = 0; card_num < models.length; card_num ++) {
		models_of_card = models[card_num];
		for (var model_number= 0;  model_number < models_of_card.models.length; model_number ++) {
			model = models_of_card.models[model_number];
			for (var model_capa_number = 0 ; model_capa_number <model.capacities.length; model_capa_number++ ) {
				model_capa =  model.capacities[model_capa_number];
				if (model_capa._id && model_capa._id.$oid == $capa_id) {
					$.observable(model_capa).setProperty("_title", capacity_responded._title);
					$.observable(model_capa).setProperty("_type", capacity_responded._type);
					$.observable(model_capa).setProperty("__text", capacity_responded.__text);
				}
			}
			for (var model_weapon_number = 0 ; model_weapon_number <model.weapons.melee_weapon.length; model_weapon_number++ ) {
				weapon =  model.weapons.melee_weapon[model_weapon_number];
				for (var model_capa_number = 0 ; model_capa_number <weapon.capacities.length; model_capa_number++ ) {
					model_capa =  weapon.capacities[model_capa_number];
					if (model_capa._id && model_capa._id.$oid == $capa_id) {
						$.observable(model_capa).setProperty("_title", capacity_responded._title);
						$.observable(model_capa).setProperty("_type", capacity_responded._type);
						$.observable(model_capa).setProperty("__text", capacity_responded.__text);
					}
				}
			}
			for (var model_weapon_number = 0 ; model_weapon_number <model.weapons.ranged_weapon.length; model_weapon_number++ ) {
				weapon =  model.weapons.ranged_weapon[model_weapon_number];
				for (var model_capa_number = 0 ; model_capa_number <weapon.capacities.length; model_capa_number++ ) {
					model_capa =  weapon.capacities[model_capa_number];
					if (model_capa._id && model_capa._id.$oid == $capa_id) {
						$.observable(model_capa).setProperty("_title", capacity_responded._title);
						$.observable(model_capa).setProperty("_type", capacity_responded._type);
						$.observable(model_capa).setProperty("__text", capacity_responded.__text);
					}
				}
			}
		}
	}
}


function pushSpellInCards(spell_responded) {
	for (var card_num = 0; card_num < models.length; card_num ++) {
		models_of_card = models[card_num];
		for (var model_number= 0;  model_number < models_of_card.models.length; model_number ++) {
			model = models_of_card.models[model_number];
			for (var model_spell_number = 0 ; model_spell_number <model.spells.length; model_spell_number++ ) {
				model_spell =  model.spells[model_spell_number];
				if (model_spell._id && model_spell._id.$oid == $spell_id) {
					$.observable(model_spell).setProperty("_name", spell_responded._name);
					$.observable(model_spell).setProperty("_cost", spell_responded._cost);
					$.observable(model_spell).setProperty("_rng", spell_responded._rng);
					$.observable(model_spell).setProperty("_pow", spell_responded._pow);
					$.observable(model_spell).setProperty("_aoe", spell_responded._aoe);
					$.observable(model_spell).setProperty("_duration", spell_responded._duration);
					$.observable(model_spell).setProperty("_off", spell_responded._off);
					$.observable(model_spell).setProperty("__text", spell_responded.__text);
				}
			}
		}
	}
}


/** for the current card, update the capacities texts from the capacities list. done when loading a model (make sur the capas are ok)
*/
function updateCapacitiesForCard(card) {

	for (var model_number= 0; model_number<card.models.length; model_number++ ) {
		model = card.models[model_number];
		for (var i=0; i<model.capacities.length; i++ ) {
			model_capa =  model.capacities[i];
			// search in capacities
			if (model_capa._id) { // case model_capa is bad data
				var $capa = capacities_map[model_capa._id.$oid];
				model_capa._title = $capa._title;
				model_capa._type = $capa._type;
				model_capa.__text = $capa.__text;
			}
		}
	}
	
}


/** for the current card, update the spells texts from the spells list. done when loading a model (make sur the spells are ok)
*/
function updateSpellsForCard(card) {

	for (var model_number= 0; model_number<card.models.length; model_number++ ) {
		model = card.models[model_number];
		for (var i=0; i<model.spells.length; i++ ) {
			model_spell =  model.spells[i];
			// search in capacities
			if (model_spell._id) { // case model_capa is bad data
				var $spell = spells_map[model_spell._id.$oid];
				model_spell._name =  $spell._name ; 
				model_spell._cost =  $spell._cost ; 
				model_spell._rng =  $spell._rng ; 
				model_spell._pow =  $spell._pow ; 
				model_spell._aoe =  $spell._aoe ; 
				model_spell._duration =  $spell._duration ; 
				model_spell._off =  $spell._off ; 
				model_spell.__text =  $spell.__text ; 
			}
		}
	}
	
}


function loadModels() {
	$.ajax({ 
			url: "https://api.mlab.com/api/1/databases/whac/collections/models?s={'name':1}&apiKey=wcadeCXsaFhH5G4__crfJpZBdloyTTAa" ,
		  	type: "GET",
		  	contentType: "application/json",
		  	dataType: "json",
		  	success:   function( data, jqXHR, textStatus){
		  		$("body").css("cursor", "default");
		  		response = JSON.stringify(jqXHR.responseText);
		  		models = data;
		  		populateFactions(0,0);
		  		refreshModels(0, 0, 0);
		  	}
	});
}

function refreshModels(systemValue, faction, modeTypeValue) {
	// filtering
	var options = '';
	var passType = true;
	if (modeTypeValue != 0) {
		passType = false;
	}
	var firstModelId = "0";
	var modelType = model_types[modeTypeValue];
		models.map(function(model){
			if (model.faction == faction_codes[systems[systemValue]][faction])  {
				if ( passType || model.type == modelType) {
					if (firstModelId == "0") {
						firstModelId = model._id;
					}
					options += '<option value="' + model._id + '" class="' + model.status.replace(/[ ]/g, "_") + '">' + model.name + '</option>';		
				}
			}
		}) ;
	$('#select_model').empty();
	$('#select_model').html(options);
	$('#select_model').val(firstModelId);
	selected_model_id = firstModelId;
}


function updateCapacities(response, updateCapacitiesList) {
	if (updateCapacitiesList) {
		capacities = response;

		// fill capacity map with oid as key
		capacities.map(function (capacity) {
			capacities_map[capacity._id.$oid] = capacity;
			capacity.visible = true	;
		});
	}

	if (updateCapacitiesList) {
		$panel = $('#capas_list_panel');
		$panel.empty();

		$odd = true;

		var template_capacities = $.templates("#capacities_display");
		var all_capas = {capacities : response};
		linked_template_capas = template_capacities.link($("#capas_list_panel"), all_capas);

	    $('.capa_copy').on("click", function() {
	    	var m_capa = $.view(this).data; // data is the current "model"
	    	copied_capacity = m_capa;
	    });

	    $('.capa_edit').on("click", function() {
	    	var m_capa = $.view(this).data; // data is the current "model"
	    	$('#input_capa_id').val(m_capa._id.$oid);
			$('#input_capa_title').val(m_capa._title);
			$('#input_capa_type').val(m_capa._type);
			$('#input_capa_text').val(m_capa.__text);


	    	$('.create_capa_button').hide();
	    	$('.new_capa_button').show();
	    	$('.update_capa_button').show();

	    });
	} 

	// apply filtering
	refreshCapacitiesWithFilter($('#capa_filter').val());

}

function refreshCapacities() {
	$("body").css("cursor", "progress");
	$.ajax({ 
			url: "https://api.mlab.com/api/1/databases/whac/collections/capacities?s={'_title':1}&l=10000&apiKey=wcadeCXsaFhH5G4__crfJpZBdloyTTAa" ,
		  	type: "GET",
		  	contentType: "application/json",
		  	dataType: "json",
		  	success:   function( data, jqXHR, textStatus){
		  		$("body").css("cursor", "default");
		  		response = JSON.stringify(jqXHR.responseText);
		  		updateCapacities(data, true);
		  	}
	});
}

function refreshCapacitiesWithFilter(filterValue) {
	capacities.map(function(capacity) {
		if (filterValue == null || filterValue.length == 0 ) {
			$.observable(capacity).setProperty('visible', true);
		} else {
			if (capacity._title.toUpperCase().indexOf(filterValue.toUpperCase()) >= 0) {
				$.observable(capacity).setProperty('visible', true);
			} else {
				$.observable(capacity).setProperty('visible', false);
			}
		}
	});
}








function createNewCapacity() {
	$capa_name = $('#input_capa_title').val();
	$capa_type = $('#input_capa_type').val();
	$capa_text = $('#input_capa_text').val();

	if ($capa_name==null || $capa_name=="" || $capa_text==null || $capa_text=="") {
	    alert("Please Fill at least name and description");
    	return false;
    }

	$("body").css("cursor", "progress");
	$.ajax({ 
	url: "https://api.mlab.com/api/1/databases/whac/collections/capacities?apiKey=wcadeCXsaFhH5G4__crfJpZBdloyTTAa" ,
		type: "POST",
		contentType: "application/json",
		dataType: "json",
		data: JSON.stringify( {"_title" : $capa_name , "_type" : $capa_type, "__text" : $capa_text }),
		complete:   function( jqXHR, textStatus){
			$("body").css("cursor", "default");
			response = jqXHR.responseJSON;

	  		$('#input_capa_id').val(response._id.$oid);
	  		$('.new_capa_button').show()
			$('.create_capa_button').hide();
			$('.update_capa_button').show();

			alert("capacity created");
			// $('#capa_filter').val("");
			refreshCapacities();
		}
	});
}





var spells;

function createNewSpell() {

	$spell_id = $('#input_spell_id').val();
	$spell_name = $('#input_spell_title').val();
	$spell_cost = $('#input_spell_cost').val();
	$spell_range = $('#input_spell_range').val();
	$spell_pow = $('#input_spell_pow').val();
	$spell_aoe = $('#input_spell_aoe').val();
	$spell_duration = $('#input_spell_duration').val();
	$spell_off = $('#input_spell_off').val();
	$spell_desc = $('#input_spell_desc').val();

	if ($spell_name==null || $spell_name=="" || $spell_desc==null || $spell_desc=="") {
	    alert("Please Fill at least name and description");
    	return false;
    }


	$("body").css("cursor", "progress");
	$.ajax({ 
		url: "https://api.mlab.com/api/1/databases/whac/collections/spells/?apiKey=wcadeCXsaFhH5G4__crfJpZBdloyTTAa" ,
	  	type: "POST",
	  	contentType: "application/json",
	  	dataType: "json",
	  	data: JSON.stringify( { "_name" : $spell_name , "_cost" : $spell_cost, "_rng" : $spell_range, "_pow" : $spell_pow, "_aoe" : $spell_aoe, "_duration" : $spell_duration, "_off" : $spell_off, "__text" : $spell_desc }),
	  	complete:   function( jqXHR, textStatus){
	  		$("body").css("cursor", "default");
	  		$('#spell_filter').val("");
	  		var spell_responded = jqXHR.responseJSON;

	  		$('#input_spell_id').val(spell_responded._id.$oid);
	  		$('.new_spell_button').show()
			$('.create_spell_button').hide();
			$('.update_spell_button').show();

	  		alert("spell created");
	  		refreshSpells();
	  	}
	});
}

function updateSpells(response, updateSpellsList) {

	if (updateSpellsList) {
		spells = response;

		// fill spell map with oid as key
		spells.map(function (spell) {
			spells_map[spell._id.$oid] = spell;	
		});
	}

	var template_spells = $.templates("#spells_display");
	var all_spells = {spells : response};
	linked_template_spells = template_spells.link($("#spells_list_panel"), all_spells);


    $('.spell_copy').on("click", function() {
    	var m_spell = $.view(this).data; // data is the current "model"
    	copied_spell = m_spell;
    });

    linkNewSpellButton();

    $('.spell_edit').on("click", function() {

    	$('.create_spell_button').hide();
    	$('.new_spell_button').show();
    	$('.update_spell_button').show();


    	var m_spell = $.view(this).data; // data is the current "model"
    	$('#input_spell_id').val(m_spell._id.$oid);
    	$('#input_spell_title').val(m_spell._name);
		$('#input_spell_cost').val(m_spell._cost);
		$('#input_spell_range').val(m_spell._rng);
		$('#input_spell_pow').val(m_spell._pow);
		$('#input_spell_aoe').val(m_spell._aoe);
		$('#input_spell_duration').val(m_spell._duration);
		$('#input_spell_off').val(m_spell._off);
		$('#input_spell_desc').val(m_spell.__text);
    });
    

}

function linkNewCapacityButton() {
	$('.new_capa_button').on("click", function() {
    	$('#input_capa_id').val("");
    	$('#input_capa_title').val("");
		$('#input_capa_type').val("");
		$('#input_capa_text').val("");
		$('.new_capa_button').hide();
		$('.create_capa_button').show();
		$('.update_capa_button').hide();
    });
}

function linkNewSpellButton() {
	$('.new_spell_button').on("click", function() {
    	$('#input_spell_id').val("");
    	$('#input_spell_title').val("");
		$('#input_spell_cost').val("");
		$('#input_spell_range').val("");
		$('#input_spell_pow').val("");
		$('#input_spell_aoe').val("");
		$('#input_spell_duration').val("");
		$('#input_spell_off').val("");
		$('#input_spell_desc').val("complete...");
		$('.new_spell_button').hide();
		$('.create_spell_button').show();
		$('.update_spell_button').hide();
    });
}



function refreshSpells() {
	$.ajax({ 
			url: "https://api.mlab.com/api/1/databases/whac/collections/spells?s={'_name':1}&apiKey=wcadeCXsaFhH5G4__crfJpZBdloyTTAa" ,
		  	type: "GET",
		  	contentType: "application/json",
		  	dataType: "json",
		  	success:   function( data, jqXHR, textStatus){
		  		response = JSON.stringify(jqXHR.responseText);
		  		updateSpells(data, true);
		  	}
	});
}

function refreshSpellsWithFilter(filterValue) {
	filteredSpells = spells.filter(function(spell) {
		if (filterValue == null || filterValue.length == 0 ) {
			return true;
		}
		return (spell._name.toUpperCase().indexOf(filterValue.toUpperCase()) >= 0);
	});

	updateSpells(filteredSpells, false);

}
