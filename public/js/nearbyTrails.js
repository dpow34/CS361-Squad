module.exports = function()
{
    var express = require("express");
    var router = express.Router();

    router.get("/", function(req, res)
    {
        res.send("Not suppose to be here!")
    })

    router.post("/", function(req, res)
    {
        var scripts = [{script: '/public/js/nearbyTrails.js'}]
        res.render('nearbyTrails', scripts);
    })

    return router;
}();