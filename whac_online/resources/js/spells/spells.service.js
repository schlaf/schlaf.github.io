angular.module('whacApp').service(
    "spellsService",
    function ($http, $q) {
        // Return public API.
        return ({
            getSpells: getSpells,
            getSpell: getSpell,
            filterSpells : filterSpells,
            saveSpell : saveSpell,
            removeSpell : removeSpell,
            copySpell : copySpell,
            createSpell : createSpell,
            getCurrentSpell : getCurrentSpell
        });

        var currentSpell = {};

        function copySpell(spell) {
            currentSpell = spell;
        }

        function getCurrentSpell() {
            return currentSpell;
        }

        function createSpell(spell) {
            var request = $http.post("https://api.mlab.com/api/1/databases/whac_v2/collections/spells/?apiKey=wcadeCXsaFhH5G4__crfJpZBdloyTTAa", spell);
            return( request.then( handleSuccess, handleError ) );
        }

        function saveSpell(spell) {
            var request = $http.put("https://api.mlab.com/api/1/databases/whac_v2/collections/spells/" + spell._id.$oid + "/?apiKey=wcadeCXsaFhH5G4__crfJpZBdloyTTAa", spell);
            return( request.then( handleSuccess, handleError ) );
        }

        function removeSpell(spell) {
            var request = $http.put("https://api.mlab.com/api/1/databases/whac_v2/collections/spells/" + spell._id.$oid + "/?apiKey=wcadeCXsaFhH5G4__crfJpZBdloyTTAa", spell);
            return( request.then( handleSuccess, handleError ) );
        }


        function getSpells() {

            var request = $http({
                method: "get",
                url: "https://api.mlab.com/api/1/databases/whac_v2/collections/spells?l=1000&s={'_name':1}&apiKey=wcadeCXsaFhH5G4__crfJpZBdloyTTAa",
                params: {
                    action: "get"
                }
            });
            return( request.then( handleSuccess, handleError ) );

        };

        /* return Spells that match title (start) & textcontent (contains) */
        function filterSpells(allSpells, title, textContent) {
            result = [];
            var i = 0;
            return allSpells.filter(matchTitleAndContent(title, textContent));
        }

        function matchTitleAndContent(title, textContent) {
            return function(element) { 
                if (title == "" || element._name.toUpperCase().startsWith(title.toUpperCase()) )  {
                    if (textContent == "") {
                        return true;
                    } else if (element.__text != undefined && element.__text.toUpperCase().indexOf(textContent.toUpperCase()) !== -1) {
                        return true;
                    }

                } 
                return false;
            }
        }


        function getSpell() {
            return {"_id":"empty","name":"unknown"};
        }


        // I transform the successful response, unwrapping the application data
        // from the API response payload.
        function handleSuccess( response ) {
            return( response.data );
        }

        // I transform the error response, unwrapping the application dta from
        // the API response payload.
        function handleError( response ) {
            // The API response from the server should be returned in a
            // nomralized format. However, if the request was not handled by the
            // server (or what not handles properly - ex. server error), then we
            // may have to normalize it on our end, as best we can.
            if (
                ! angular.isObject( response.data ) ||
                ! response.data.message
            ) {
                return( $q.reject( "An unknown error occurred." ) );
            }
            // Otherwise, use expected error message.
            return( $q.reject( response.data.message ) );
        }
    }
);