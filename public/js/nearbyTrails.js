module.exports = function()
{
    var express = require("express");
    var router = express.Router();

    router.get("/", function(req, res)
    {
        res.redirect("Nearby trails get handler")
    })

    router.post("/", function(req, res)
    {
        console.log(req.cookies);
        res.send(req.cookies);
        // res.send("In the nearby trails page, the zipcode is " + req.cookies.userData.zipCode);
        // res.send("In the nearby trails page, the zipcode is " + req.body.userZip);
    })

    return router;
}();