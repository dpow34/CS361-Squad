module.exports = function()
{
    var express = require("express");
    var router = express.Router();

    function getItems(res, mysql, context, complete)
    {
        
        mysql.pool.query("SELECT name, quantity_in_stock, retail_price, item_ID FROM Items", function(error, results)
        {
            if (error)
            {
                res.write(JSON.stringify(error));
                res.end()
            }
            context.items = results;
            complete();
        });
    }

	function displayUpdate(mysql, context, item_ID)
    {
        return new Promise(function(resolve, reject)
        {
            let query = "SELECT name, quantity_in_stock, retail_price FROM Items where item_ID = ?"
            sql = mysql.pool.query(query, [item_ID], function(error, results)
            {
                if(error)
                {
                    return reject(error)
                }
                context.update_item = {}
                context.update_item.item_ID = item_ID
                context.update_item.name = results[0].name
                context.update_item.quantity_in_stock = results[0].quantity_in_stock
                context.update_item.retail_price = results[0].retail_price
                resolve(context)
            })
        })
    }

    router.get("/", function(req, res)
    {
        let callbackCount = 0;
        let context = {};
        let mysql = req.app.get('mysql');
        context.jsscripts = ["itemsPage.js"];
        context.cssstyles = ["items.css"];
        getItems(res, mysql, context, complete);
        function complete()
        {
            callbackCount++;
            if(callbackCount >= 1)
            {
                res.render('items', context)
            }
        }

    })

    router.post("/", function(req, res)
    {
        let mysql = req.app.get("mysql");
        let query = "INSERT INTO Items (name, quantity_in_stock, retail_price) VALUES (?,?,?)";
        let insert_values = [req.body.input_name, req.body.input_quantity, req.body.input_retail];
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
                res.redirect('/items')
            }
        });
    });

    router.delete('/:id', function(req, res)
    {
		
        let mysql = req.app.get("mysql");
        let query = "DELETE FROM Items where item_ID = ?";
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
	

    
    router.get('/:id', function(req, res)
    {
        let context = {}
        let mysql = req.app.get('mysql');
        context.jsscripts=["updateItemPage.js"];
        displayUpdate(mysql, context, req.params.id)
        .then(function(context)
        {
			
            res.render("updateItem", context);
        });
    })
    
   
    router.put('/:id', function(req, res)
    {
        let mysql = req.app.get("mysql");
        let query = "UPDATE Items SET name=?, quantity_in_stock=?, retail_price=? WHERE item_ID=?";
        let inserts = [req.body.name, req.body.quantity_in_stock, req.body.retail_price, req.params.id];
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