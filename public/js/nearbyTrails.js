module.exports = function()
{
    var express = require("express");
    var router = express.Router();

    let context = {};
    context.jsscripts = ["nearbyTrailsPage.js"];
    context.css = ["userProfile.css"];

    context.trails = [{trail_name:"fun time trail", trail_length:"10", distance_to_trail:"15"},
                    {trail_name:"sad time trail", trail_length:"100", distance_to_trail:"1"}];

    router.get("/", function(req, res)
    {
        res.send("Not suppose to be here!")
    })

    router.post("/", function(req, res)
    {
        res.render('nearbyTrails', context);
    })

    return router;
}();