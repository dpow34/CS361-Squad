module.exports = function()
{
    var express = require("express");
    var axios = require("axios");
    var router = express.Router();

    let context = {};
    context.jsscripts = ["nearbyTrailsPage.js"];
    context.cssstyles = ["nearbyTrails.css"]

    router.get("/", function(req, res)
    {
        res.send("Not suppose to be here!")
    })

    router.post("/", function(req, res)
    {
        geocode().then(trailInfo => {
          // awaiting/fulfilling promise, calling geocode to create zipcode/retrieve trails
          context.trails = trailInfo;
          //TODO: replace this with cookie val of userFitness
          context.seperatedTrails = seperateTrails(trailInfo, req.cookies["fitLevel"]);
          // nearbytrails page is rendered and context is passed
          res.render('nearbyTrails', context);
        });

        function geocode(){
          // function to receive lon/lat information using zipcode from cookies
          var zipcode = req.cookies.zipCode;
          //submitting request to mapquest
          return axios.get('http://www.mapquestapi.com/geocoding/v1/address',{
            params:{
              key:'zFqc6WEQ0wFDfMKcyhV3pJJpkrxPV5bG',
              location:zipcode
            }
          })
          .then(function(response){
            // lat and long from response
            var lat = response.data.results[0].locations[0].latLng.lat;
            var lng = response.data.results[0].locations[0].latLng.lng;
            // to convert zipcode to lon/lat
            return trails(lat, lng);
          })
          .catch(function(error){
            console.log(error);
          });
        }

        function trails(lat, lng){
          //Retrieve trail info from hiking project
          return axios.get('https://www.hikingproject.com/data/get-trails',{
            params:{
              lat: lat,
              lon: lng,
              key:'200964084-38fe0d265a453ee01c59068d6f6d3ac9'
            }
          })
          .then(function(response){
            //Stores all the returned trail information
            let trailInfo = response.data.trails.map((trail) => {
                return {
                  // For selecting the required parameters
                    trail_name: trail.name,
                    trail_length: trail.length,
                    longitude: trail.longitude,
                    latitude: trail.latitude,
                    difficulty : trail.difficulty
                };
            });  
            return trailInfo
          })
          .catch(function(error){
            console.log(error);
          });
        }
        })

    return router;
}();

function seperateTrails(trailList, userFitnessLevel) 
{
    let intUserFitnessLevel = null;

    switch (userFitnessLevel) {
        case "beginner":
            intUserFitnessLevel = 1;
            break;
        case "intermediate":
            intUserFitnessLevel = 2;
            break;
        case "expert":
            intUserFitnessLevel = 3;
            break;
        default:
            intUserFitnessLevel = 2;
            break;
    }
    
    //iterate through the trails and add to correct list
    trailList.forEach(element => 
    {
        let intTrailDifficulty = null;
        switch (element.difficulty)
        {
            case "green":
                intTrailDifficulty = 1;
                break
            case "greenBlue":
                intTrailDifficulty = 1;
                break;
            case "blue":
                intTrailDifficulty = 2;
                break;
            case "blueBlack":
                intTrailDifficulty = 2;
                break;
            case "black":
                intTrailDifficulty = 3;
                break;
            default:
                intTrailDifficulty = "unknown";
        }

        if (intUserFitnessLevel > intTrailDifficulty)
        {
            //easy
            element.realitiveDifficulty = 1;
        }
        else if (intUserFitnessLevel == intTrailDifficulty)
        {
            //medium
            element.realitiveDifficulty = 2;
        }
        else
        {
            //hard
            element.realitiveDifficulty = 3;
        }

    });

    return seperatedTrails;
}