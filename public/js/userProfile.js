module.exports = function()
{
    var express = require("express");
    var router = express.Router();

    router.get("/", function(req, res)
    {
        res.send("In user Profile page");
    })

    router.post("/", function(req, res)
    {
        res.send("In user Profile page");
    })

    return router;
}();