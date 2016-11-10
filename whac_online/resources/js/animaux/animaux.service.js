angular.module('animauxApp').service(
    "animauxService",
    function ($http, $q) {
        // Return public API.
        return ({
            getAnimaux: getAnimaux
        });

        function getAnimaux() {
            alert("getAnimaux called");

            //front/RU77q6xx
            $http.defaults.headers.common['Authorization'] = 'Basic ' + btoa('front' + ':' + 'RU77q6xx');

            var request = $http({
                method: "post",
                dataType: "json",
                headers: {
                    "Content-Type": "application/json"
                },
                //url: "http://xms-demo.4dcloud.fr/contentFactory/search/executeQuery?offset=1", //
                url: "http://presse-demo.4dcloud.fr/cf-demo/search/executeQuery?offset=1", //
                params: {
                    action: "post",
                    query:"info",
                    sort: {name: "last-modified", direction: "descending"},
                    "data":'tralala',
                    "facets":[],
                    "contentSearchConstraintIds":[]
                },
                data:{
                    test:'bidule',
                    query:"info",
                    // sort: {name: "last-modified", direction: "descending"},
                    "facets":[]}
            });



            var request = $http({
                method: "get",
                url: "/zoo/animaux/",
                params: {
                    action: "get"
                }
            });
            return( request.then( handleSuccess, handleError ) );

        };


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