module.exports = function()
{
    var express = require("express");
    var router = express.Router();

    function getItemsForSale(mysql, context)
    {
        return new Promise(function(resolve, reject)
        {
            for(var i=0; i<context.sales.length; i++)
            {
                ItemsPromise(mysql, context.sales[i], context.sales[i].sale_ID)
                .then(function(value, error)
                {
                    if (error)
                    {
                        console.log('error');
                        return reject(error);
                    }
                });
            }     
            resolve(context)
        })

    }

    function ItemsPromise(mysql, context_sale, sale_id)
    {
        return new Promise(function(resolve, reject)
        {
            let item_string = ""
            let query = "SELECT i.name, rd.item_quantity, rd.line_total, rd.item_ID from SaleDetails rd INNER JOIN Items i ON rd.item_ID = i.item_ID WHERE rd.sale_ID = " + sale_id;
            // console.log(sale_id);
            mysql.pool.query(query, [sale_id], function(error, results)
            {
                if (error)
                {
                    return reject(error);
                }
                // loop through results and build a string of items used
                for(var i = 0; i< results.length; i++)
                {
					context_sale.quantity = results[i].item_quantity;
					context_sale.total = results[i].line_total;
                    if (i != results.length - 1)
                    {
                        item_string += results[i].name + ", ";
                    }
                    else
                    {
                        item_string += results[i].name;
                    } 
                }
                // console.log(results);
                context_sale.items = item_string
                resolve(context_sale);
            })

        })
    }

    function getSales(mysql, context)
    {
        return new Promise(function(resolve, reject)
        {
            let query = "SELECT sale_ID, first_name, last_name, sale_date, sale_total from Sales INNER JOIN Customers on Sales.customer_ID = Customers.customer_ID"
            mysql.pool.query(query, function(error, results)
            {
                if (error)
                {
                    return reject(error);
                }
                context.sales = results;
                resolve(context);
            });
        });
    }

    function getAllCustomers(mysql, context)
    {
        return new Promise(function(resolve, reject)
        {
            let query = "SELECT first_name, last_name, customer_ID FROM Customers"
            mysql.pool.query(query, function(error, results)
            {
                if (error)
                {
                    return reject(error);
                }
                context.customers = results;
                resolve(context);
            });
        });
    }
    
    function getAllItems(mysql, context)
    {
        return new Promise(function(resolve, reject)
        {
            let query = "SELECT item_ID, name FROM Items"
            mysql.pool.query(query, function(error, results)
            {
                if (error)
                {
                    return reject(error);
                }
                context.items = results;
                resolve(context);
            });
        });
    }
    
    function insertSale(req, mysql, context)
    {
        return new Promise(function(resolve, reject)
        {
            let query = "INSERT INTO Sales (customer_ID, sale_date, sale_total) VALUES (?,?,?)";
            let insert_values = [req.body.input_customer, req.body.input_date_completed, 0];
            sql = mysql.pool.query(query, insert_values, function(error, result)
            {
                if (error)
                {
                    return reject(error);
                }
                context.sale_ID = result.insertId;
                context.customer = req.body.input_customer;
                resolve(context);
            })
        })
    }

    function insertSaleDetails(req, mysql, context)
    {
        return new Promise(function(resolve, reject)
        {
            // get the item_IDs from the form input named "input_sale_items"
            let item_array = req.body.input_sale_items.split(", ");
            let items = {}
            let item_id = 0;
            // This loop goes through each item in the items array and creates an object with the structure {item_ID: item_quantity}
            for(var i=0; i<item_array.length;i++)
            {
                item_id = item_array[i];
                if (item_id in items)
                {
                    items[item_id] += 1;
                }
                else
                {
                    items[item_id] = 1;
                }
            }
            
            context.item_array = items;
            // Loop through the items in the repair and add then to the RepairDetails page, here x is the item_ID
            let x;
            for (x in items)
            {
                // To compute the line total, we need to query the Items table to get the retail cost (use a promise)
                getItemCost(mysql, x)
                .then(function(item_cost)
                {
                    // compute the line total and insert
                    line_total = item_cost * items[x];
                    SaleDetailPromise(mysql, context, x, items[x], line_total);
                })
            }
            resolve(context)
        })
    }

    function getItemCost(mysql, item_id, context)
    {
        return new Promise(function(resolve, reject)
        {
            let query = "SELECT retail_price FROM Items where item_ID = ?"
            sql = mysql.pool.query(query, [item_id], function(error, result)
            {
                if (error)
                {
                    return reject(error);
                }
                // array of len 1 is returned, access first elem
                resolve(result[0].retail_price);
            });
        });
    }

    function SaleDetailPromise(mysql, context, item_id, item_quantity, line_total)
    {
        return new Promise(function(resolve, reject)
        {
            let query = "INSERT INTO SaleDetails (sale_ID, item_ID, item_quantity, line_total) VALUES (?,?,?,?)";
            let insert_values = [context.sale_ID, item_id, item_quantity, line_total];
            sql = mysql.pool.query(query, insert_values, function(error, result)
            {
                if (error)
                {
                    return reject(error);
                }
                resolve(context);
            })
        })
    }

    function getSale(mysql, context, id)
    {
        return new Promise(function(resolve, reject)
        {
            let query = "SELECT sale_ID, first_name, last_name, sale_date, sale_total from Sales INNER JOIN Customers on Sales.customer_ID = Customers.customer_ID WHERE sale_ID = ?";
            mysql.pool.query(query, id, function(error, results)
            {
                if (error)
                {
                    return reject(error);
                }
                context.update_sale = results[0]
                resolve(context);
            })
        })
    }
	
	function something(mysql)
    {
        return new Promise(function(resolve, reject)
        {
            mysql.pool.query(query, function(error, results)
            {
                if (error)
                {
                    return reject(error);
                }
            })
            resolve();
        })
    }

    function getItemsInSale(mysql, context, sale_ID)
    {
        return new Promise(function(resolve, reject)
        {
            query = "SELECT i.name, rd.item_quantity, rd.sale_details_ID, rd.item_ID from SaleDetails rd INNER JOIN Items i ON rd.item_ID = i.item_ID WHERE rd.sale_ID = ?";
            mysql.pool.query(query, sale_ID, function(error, results)
            {
                if (error)
                {
                    return reject(error);
                }
                context.update_sale.items = results;
				
                resolve(context);
            })
        })
    }
	
	// function used to update the items used in a sale 
    function updateSaleDetails(mysql, item_quantity_array, sale_details_id_array, sale_Item_id_array)
    {
        return new Promise(function(resolve, reject)
        {
            console.log(sale_details_id_array);
            for(var i=0; i<item_quantity_array.length; i++)
            {
				let total_cost;
				item_id = sale_Item_id_array[i];
                item_quantity = item_quantity_array[i];
                sale_detail_id = sale_details_id_array[i];
			
				getItemCost(mysql, item_id)
                .then(function(item_cost)
                {
                    // compute the line total and insert
                    total_cost = item_cost * item_quantity;
					// console.log("Content");
					// console.log(total_cost);
					// console.log(item_cost);
					// console.log(item_quantity);
                })
				.then(function(context)
                {
                    // console.log("HI");
					// console.log(total_cost);
					updateSaleDetail(mysql, item_quantity, sale_detail_id, total_cost)
                })
                .then(function(value, error)
                {
                    if (error)
                    {
                        console.log(error);
                        return reject(error);
                    }
                });
            }
			console.log("No Error?");
            resolve();
			
        })
    }
	
	function updateSaleDetail(mysql, item_quantity, sale_details_id, total_cost)
    {
		
        return new Promise(function(resolve, reject)
        {	
			
            query = "UPDATE SaleDetails SET item_quantity=?, line_total=? WHERE sale_details_ID=?";
			query = "UPDATE SaleDetails SET item_quantity='"+item_quantity+"', line_total='"+total_cost+"' WHERE sale_details_ID="+sale_details_id;
			values = [item_quantity, total_cost, sale_details_id];
			console.log("Update");
			console.log(item_quantity);
			console.log(total_cost);
            mysql.pool.query(query, function(error, results)
            {
                if (error)
                {
					console.log(error);
                    return reject(error);
                }
				console.log("Update Complete");
                resolve();
				
            })
        })
		
    }
	// special route for handeling the submitted update form
    router.get("/reload",function(req, res){
		
        res.redirect('/sales');
    })

    router.get("/", function(req, res)
    {
        var context = {};
        context.jsscripts = ["salesPage.js"];
        context.cssstyles = ["sales.css"]
        let mysql = req.app.get('mysql');
        getSales(mysql, context)
        .then(function(context)
        {
            return getItemsForSale(mysql, context)
        })
        .then(function(context)
        {
            return getAllCustomers(mysql, context)
        })
        .then(function(context)
        {
            return getAllItems(mysql, context)
        })
        .then(function(context)
        {
            res.render('sales', context);
        })
        .catch(function(err) {console.log(err)});
    })

    router.post("/", function(req, res)
    {
        let mysql = req.app.get("mysql");
        let context = {};
        
        insertSale(req, mysql, context)
        .then(function(context)
        {
            return insertSaleDetails(req, mysql, context)
        })
        .then(function()
        {
            res.redirect('/sales');
        })
        .catch(function (err) {console.log(err)});
    })

    router.delete("/:id", function(req, res)
    {
        let mysql = req.app.get("mysql");
        let query = "DELETE FROM Sales where sale_ID = ?";
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

    // route for showing one repair to update
    router.get('/:id', function(req, res)
    {
        let mysql = req.app.get("mysql");
        let context = {};
        context.jsscripts = ["updateSalePage.js"];
        context.cssstyles = ["sales.css"];
        getSale(mysql, context, req.params.id)
        .then(function(context)
        {
            return getItemsInSale(mysql, context, req.params.id)
        })
        .then(function(context)
        {
            // change the date to the correct format for the form YYYY-MM-DD
            res.render('updateSale', context);
        })
    })

    // route for updating a repair
    router.put('/:id', function(req, res)
    {
        
        let mysql = req.app.get("mysql");
        let item_quantity_array = JSON.parse(req.body.item_quantity_array);
        let sale_details_id_array = JSON.parse(req.body.sale_details_ID_array);
		let sale_Item_id_array = JSON.parse(req.body.sale_Item_ID_array);
        let sale_id = req.params.id;
		something(mysql)
        .then(function()
        {
            updateSaleDetails(mysql, item_quantity_array, sale_details_id_array, sale_Item_id_array)
        })
		// .then(function(context)
        // {
        //     res.render('sales', context);
		// 	//res.redirect('sales');
        // })
        .catch(function(err) {console.log(err)});
        //res.status(202).end();
        
    });
	
     

    return router;
}();

