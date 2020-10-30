module.exports = function()
{
    var express = require("express");
    var router = express.Router();

    router.get("/", function(req, res)
    {
        var scripts = [{script: '/public/js/userProfilePage.js'}]
        res.render('userProfile', scripts);
    })

    router.post("/", function(req, res)
    {
        var scripts = [{script: '/public/js/userProfilePage.js'}]
        res.render('userProfile', scripts);
    })

    return router;
}();