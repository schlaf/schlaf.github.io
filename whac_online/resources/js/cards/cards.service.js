angular.module('whacApp').service(
    "cardsService",
    function ($http, $q) {
        // Return public API.
        return ({
            getCards: getCards,
            getCard: getCard,
            filterCards : filterCards,
            saveCard : saveCard,
            createCard : createCard
        });

        function getCards() {

            var request = $http.get("https://api.mlab.com/api/1/databases/whac_v2/collections/models?l=1500&s={'name':1}&apiKey=wcadeCXsaFhH5G4__crfJpZBdloyTTAa");
            return( request.then( handleSuccess, handleError ) );

        };

        function saveCard(card) {
            var request = $http.put("https://api.mlab.com/api/1/databases/whac_v2/collections/models/" + card._id + "/?apiKey=wcadeCXsaFhH5G4__crfJpZBdloyTTAa", card);
            return( request.then( handleSuccess, handleError ) );
        }

        function createCard(card) {
            var request = $http.put("https://api.mlab.com/api/1/databases/whac_v2/collections/models/" + card._id + "/?apiKey=wcadeCXsaFhH5G4__crfJpZBdloyTTAa", card);
            return( request.then( handleSuccess, handleError ) );
        }

        /* return cards that match faction & type */
        function filterCards(allCards, faction, modelType) {
            result = [];
            var i = 0;
            var passType = false;
            if ( modelType.innerType == "all") {passType = true;}
            return allCards.filter(matchFactionAndType(faction, modelType.innerType, passType));
        }

        function matchFactionAndType(faction, modelType, passType) {
            return function(element) { 
                if (element.faction == faction.code)  {
                    if ( passType ) {
                        return true;
                    } else if (element.type != undefined && element.type == modelType) {
                        return true;
                    }
                } 
                return false;
            }
        }


        function getCard() {
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
