module.exports = function()
{
    var express = require("express");
    var router = express.Router();

    function getCustomers(res, mysql, context, complete)
    {
        
        mysql.pool.query("SELECT first_name, last_name, city, customer_ID FROM Customers", function(error, results)
        {
            if (error)
            {
                res.write(JSON.stringify(error));
                res.end()
            }
            context.customers = results;
            complete();
        });
    }

    function getCustomer(mysql, context, customer_ID)
    {
        return new Promise(function(resolve, reject)
        {
            let query = "SELECT first_name, last_name, city, state, zip_code, phone FROM Customers where customer_ID = ?"
            sql = mysql.pool.query(query, [customer_ID], function(error, results)
            {
                if(error)
                {
                    return reject(error)
                }
                context.update_customer = {}
                context.update_customer.customer_ID = customer_ID
                context.update_customer.first_name = results[0].first_name
                context.update_customer.last_name = results[0].last_name
                context.update_customer.city = results[0].city
                context.update_customer.state = results[0].state
                context.update_customer.zip_code = results[0].zip_code
                context.update_customer.phone = results[0].phone
                resolve(context)
            })
        })
    }

    router.get("/", function(req, res)
    {
        let callbackCount = 0;
        let context = {};
        let mysql = req.app.get('mysql');
        context.jsscripts = ["customersPage.js"];
        context.cssstyles = ["customers.css"];
        getCustomers(res, mysql, context, complete);
        function complete()
        {
            callbackCount++;
            if(callbackCount >= 1)
            {
                res.render('customers', context)
            }
        }

    })

    router.post("/", function(req, res)
    {
        let mysql = req.app.get("mysql");
        let query = "INSERT INTO Customers (first_name, last_name, city, state, zip_code, phone) VALUES (?,?,?,?,?,?)";
        let insert_values = [req.body.input_first_name, req.body.input_last_name, req.body.input_city, req.body.input_state, req.body.input_zip_code, req.body.input_phone];
        sql = mysql.pool.query(query, insert_values, function(error, results, fields)
        {
            if (error)
            {
                console.log(error);
                res.write(JSON.stringify(error));
                res.end();

            }
            else
            {
                res.redirect('/customers')
            }
        });
    });

    router.delete('/:id', function(req, res)
    {
        let mysql = req.app.get("mysql");
        let query = "DELETE FROM Customers where customer_ID = ?";
        // params.id accesses parameters passed in by url
        let value = [req.params.id]
        sql = mysql.pool.query(query, value, function(error)
        {
            if (error)
            {
                console.log(error);
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }
            else
            {
                res.status(202).end();
            }
        })
    })

    // route for displaying one customer to update
    router.get('/:id', function(req, res)
    {
        let context = {}
        let mysql = req.app.get('mysql');
        context.cssstyles=["customers.css"]
        context.jsscripts=["updateCustomerPage.js"];
        getCustomer(mysql, context, req.params.id)
        .then(function(context)
        {
            res.render("updateCustomer", context);
        });
    })
    
    //route to update a customer
    router.put('/:id', function(req, res)
    {
        let mysql = req.app.get("mysql");
        let query = "UPDATE Customers SET city=?, state=?, zip_code=?, phone=? WHERE customer_id=?";
        let inserts = [req.body.city, req.body.state, req.body.zip_code, req.body.phone, req.params.id];
        console.log(req.params);
        console.log(req.body);
        // console.log(inserts);
        sql = mysql.pool.query(query, inserts, function(error)
        {
            if (error)
            {
                res.write(JSON.stringify(error));
                res.end();
            }
            else
            {
                res.status(200);
                res.end();
            }
        });
    });
    
    return router;
}();