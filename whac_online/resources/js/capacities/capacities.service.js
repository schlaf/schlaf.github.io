angular.module('whacApp').service(
    "capacitiesService",
    function ($http, $q) {
        // Return public API.
        return ({
            getCapacities: getCapacities,
            getCapacity: getCapacity,
            filterCapacities : filterCapacities
        });

        function getCapacities() {

            var request = $http({
                method: "get",
                url: "https://api.mlab.com/api/1/databases/whac/collections/capacities?l=100&s={'name':1}&apiKey=wcadeCXsaFhH5G4__crfJpZBdloyTTAa",
                params: {
                    action: "get"
                }
            });
            return( request.then( handleSuccess, handleError ) );

        };

        /* return cards that match faction & type */
        function filterCapacities(allCards, faction, modelType) {
            result = [];
            var i = 0;
            var passType = false;
            if ( modelType.innerType == "all") {passType = true;}
            return allCards.filter(matchFactionAndType(faction, modelType.innerType, passType));
        }

        function matchFactionAndType(faction, modelType, passType) {
            return function(element) { 
                if (element.faction == faction.code)  {
                    if ( passType || element.type == modelType) {
                        return true;
                    }
                } 
                return false;
            }
        }


        function getCapacity() {
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