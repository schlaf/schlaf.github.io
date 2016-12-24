angular.module('whacApp').service(
    "capacitiesService",
    function ($http, $q) {
        // Return public API.
        return ({
            getCapacities: getCapacities,
            getCapacity: getCapacity,
            filterCapacities : filterCapacities, 
            copyCapacity : copyCapacity,
            getCurrentCapacity : getCurrentCapacity,
            saveCapacity : saveCapacity,
            removeCapacity : removeCapacity,
            updatedCapacity : updatedCapacity,
            createCapacity : createCapacity,
            getUpdatedCapacity : getUpdatedCapacity
        });


        var currentCapacity = {};
        var lastUpdatedCapacity = {};

        function copyCapacity(capacity) {
            currentCapacity = capacity;
        }

        function getCurrentCapacity() {
            return currentCapacity;
        }

        function updatedCapacity(capacity) {
            lastUpdatedCapacity = capacity;
        }

        function getUpdatedCapacity() {
            return lastUpdatedCapacity;
        }

        function getCapacities() {

            var request = $http({
                method: "get",
                url: "https://api.mlab.com/api/1/databases/whac_v2/collections/capacities?l=10000&s={'name':1}&apiKey=wcadeCXsaFhH5G4__crfJpZBdloyTTAa",
                params: {
                    action: "get"
                }
            });
            return( request.then( handleSuccess, handleError ) );

        };


        function createCapacity(capacity) {
            var request = $http.post("https://api.mlab.com/api/1/databases/whac_v2/collections/capacities/?apiKey=wcadeCXsaFhH5G4__crfJpZBdloyTTAa", capacity);
            return( request.then( handleSuccess, handleError ) );
        }

        function saveCapacity(capacity) {
            var request = $http.put("https://api.mlab.com/api/1/databases/whac_v2/collections/capacities/" + capacity._id.$oid + "/?apiKey=wcadeCXsaFhH5G4__crfJpZBdloyTTAa", capacity);
            return( request.then( handleSuccess, handleError ) );
        }

        function removeCapacity(capacity) {
            var request = $http.put("https://api.mlab.com/api/1/databases/whac_v2/collections/spells/" + capacity._id.$oid + "/?apiKey=wcadeCXsaFhH5G4__crfJpZBdloyTTAa", capacity);
            return( request.then( handleSuccess, handleError ) );
        }


        /* return capacities that match title (start) & textcontent (contains) */
        function filterCapacities(allCapacities, title, textContent) {
            result = [];
            var i = 0;
            return allCapacities.filter(matchTitleAndContent(title, textContent));
        }

        function matchTitleAndContent(title, textContent) {
            return function(element) { 
                if (title == "" || element._title.toUpperCase().startsWith(title.toUpperCase()) )  {
                    if (textContent == "") {
                        return true;
                    } else if (element.__text != undefined && element.__text.toUpperCase().indexOf(textContent.toUpperCase()) !== -1) {
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