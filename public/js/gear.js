module.exports = function()
{
    var express = require("express");
    var router = express.Router();

    let context = {};
    context.jsscripts = ["gear.js"];
    context.css = ["gear.css"];

    router.get("/", function(req, res)
    {
        res.render('gear', context);
    })

    router.post("/", function(req, res)
    {
        res.render('gear', context);
    })

    return router;
}();