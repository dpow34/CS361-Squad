module.exports = function()
{
    var express = require("express");
    var axios = require("axios");
    var router = express.Router();

    let context = {};
    context.jsscripts = ["nearbyTrailsPage.js"];
    context.css = ["nearbyTrails.css"];

    context.trails = [{trail_name:"fun time trail", trail_length:"10", distance_to_trail:"15"},
                    {trail_name:"sad time trail", trail_length:"100", distance_to_trail:"1"}];

    router.get("/", function(req, res)
    {
        res.send("Not suppose to be here!")
    })

    router.post("/", function(req, res)
    {
        res.render('nearbyTrails', context);
        function geocode(){
            // function to receive lon/lat information using zipcode from cookies
            var zipcode = req.cookies.userData.zipCode;
            axios.get('http://www.mapquestapi.com/geocoding/v1/address',{
              params:{
                key:'zFqc6WEQ0wFDfMKcyhV3pJJpkrxPV5bG',
                location:zipcode
              }
            })
            .then(function(response){
              // lat and long from response
              var lat = response.data.results[0].locations[0].latLng.lat;
              var lng = response.data.results[0].locations[0].latLng.lng;
            })
            .catch(function(error){
              console.log(error);
            });
          }
    })

    return router;
}();