module.exports = function()
{
    var express = require("express");
    var router = express.Router();

    let context = {};
    context.jsscripts = ["userProfilePage.js"];
    context.css = ["userProfile.css"];

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