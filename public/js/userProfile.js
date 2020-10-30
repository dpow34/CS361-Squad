module.exports = function()
{
    var express = require("express");
    var router = express.Router();

    let context = {};
    context.jsscripts = ["userProfilePage.js"];
    context.css = ["userProfile.css"];

    router.get("/", function(req, res)
    {
        res.render('userProfile', context);
    })

    router.post("/", function(req, res)
    {
        res.render('userProfile', context);
    })

    return router;
}();