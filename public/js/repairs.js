module.exports = function()
{
    var express = require("express");
    var router = express.Router();

    function getItemsInRepairs(mysql, context)
    {
        return new Promise(function(resolve, reject)
        {
            for(var i=0; i<context.repairs.length; i++)
            {
                buildRepairItemsPromise(mysql, context.repairs[i], context.repairs[i].repair_ID)
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

    function buildRepairItemsPromise(mysql, context_repair, repair_id)
    {
        return new Promise(function(resolve, reject)
        {
            let item_string = ""
            let query = "SELECT i.name, rd.item_quantity from RepairDetails rd INNER JOIN Items i ON rd.item_ID = i.item_ID WHERE rd.repair_ID = " + repair_id;
            // console.log(repair_id);
            mysql.pool.query(query, [repair_id], function(error, results)
            {
                if (error)
                {
                    return reject(error);
                }
                // loop through results and build a string of items used
                for(var i = 0; i< results.length; i++)
                {
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
                context_repair.items = item_string
                resolve(context_repair);
            })

        })
    }

    function getRepairs(mysql, context)
    {
        return new Promise(function(resolve, reject)
        {
            let query = "SELECT repair_ID, first_name, last_name, date_completed, total, notes from Repairs INNER JOIN Customers on Repairs.customer_ID = Customers.customer_ID"
            mysql.pool.query(query, function(error, results)
            {
                if (error)
                {
                    return reject(error);
                }
                context.repairs = results;
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
    
    function insertRepair(req, mysql, context)
    {
        return new Promise(function(resolve, reject)
        {
            let query = "INSERT INTO Repairs (customer_ID, date_completed, total, notes) VALUES (?,?,?,?)";
            let insert_values = [req.body.input_customer, req.body.input_date_completed, req.body.input_total, req.body.input_notes];
            sql = mysql.pool.query(query, insert_values, function(error, result)
            {
                if (error)
                {
                    return reject(error);
                }
                context.repair_ID = result.insertId;
                context.customer = req.body.input_customer;
                resolve(context);
            })
        })
    }

    function insertRepairDetails(req, mysql, context)
    {
        return new Promise(function(resolve, reject)
        {
            // get the item_IDs from the form input named "input_repair_items"
            let item_array = req.body.input_repair_items.split(", ");
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
                    buildRepairDetailPromise(mysql, context, x, items[x], line_total);
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

    function buildRepairDetailPromise(mysql, context, item_id, item_quantity, line_total)
    {
        return new Promise(function(resolve, reject)
        {
            let query = "INSERT INTO RepairDetails (repair_ID, item_ID, item_quantity, line_total) VALUES (?,?,?,?)";
            let insert_values = [context.repair_ID, item_id, item_quantity, line_total];
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

    // function used to get a repair to update
    function getRepair(mysql, context, id)
    {
        return new Promise(function(resolve, reject)
        {
            let query = "SELECT repair_ID, first_name, last_name, date_completed, total, notes from Repairs INNER JOIN Customers on Repairs.customer_ID = Customers.customer_ID WHERE repair_ID = ?";
            mysql.pool.query(query, id, function(error, results)
            {
                if (error)
                {
                    return reject(error);
                }
                context.update_repair = results[0]
                resolve(context);
            })
        })
    }

    // function used to populate the items in the update page for a repair
    function getItemsInRepair(mysql, context, repair_ID)
    {
        return new Promise(function(resolve, reject)
        {
            query = "SELECT i.name, rd.item_quantity, rd.repair_details_ID, rd.item_ID from RepairDetails rd INNER JOIN Items i ON rd.item_ID = i.item_ID WHERE rd.repair_ID = ?";
            mysql.pool.query(query, repair_ID, function(error, results)
            {
                if (error)
                {
                    return reject(error);
                }
                context.update_repair.items = results;
                resolve(context);
            })
        })
    }

    // function used to update a repair (Repairs table)
    function updateRepair(mysql, repair_ID, date_completed, notes)
    {
        return new Promise(function(resolve, reject)
        {
            query = "UPDATE Repairs SET date_completed=?, notes=? WHERE repair_ID=?";
            // NOTE: need to turn things into strings for proper insertion
            query = "UPDATE Repairs SET date_completed='"+date_completed+"', notes='"+notes+"' WHERE repair_ID="+repair_ID;
            values = [date_completed, notes, repair_ID];
            // console.log(query);
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

    // function used to update the items used in a repair (using repairDetails table)
    function updateRepairDetails(mysql, item_quantity_array, repair_details_id_array)
    {
        return new Promise(function(resolve, reject)
        {
            // console.log(repair_details_id_array);
            for(var i=0; i<item_quantity_array.length; i++)
            {
                item_quantity = item_quantity_array[i];
                repair_detail_id = repair_details_id_array[i];
                // console.log("item quant: "+item_quantity+" id: "+repair_detail_id);
                updateRepairDetail(mysql, item_quantity, repair_detail_id)
                .then(function(value, error)
                {
                    if (error)
                    {
                        console.log(error);
                        return reject(error);
                    }
                });
            }
            resolve();
        })
    }

    function updateRepairDetail(mysql, item_quantity, repair_details_id)
    {
        return new Promise(function(resolve, reject)
        {
            query = "UPDATE RepairDetails SET item_quantity="+item_quantity+" WHERE repair_details_ID="+repair_details_id;
            mysql.pool.query(query, function(error, results)
            {
                if (error)
                {
                    return reject(error);
                }
                resolve();
            })
        })
    }

    // special route for handeling the submitted update form
    router.get("/reload",function(req, res){
        res.redirect('/repairs');
    })

    // route to display repairs in page
    router.get("/", function(req, res)
    {
        var context = {};
        context.jsscripts = ["repairsPage.js"];
        context.cssstyles = ["repairs.css"];
        let mysql = req.app.get('mysql');
        getRepairs(mysql, context)
        .then(function(context)
        {
            return getItemsInRepairs(mysql, context)
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
            res.render('repairs', context);
        })
        .catch(function(err) {console.log(err)});
    })

    // route to insert a repair 
    router.post("/", function(req, res)
    {
        let mysql = req.app.get("mysql");
        let context = {};
        
        insertRepair(req, mysql, context)
        // TODO : write the loop to insert items into repair details, will need promises (see build repair promises fcn for example)
        .then(function(context)
        {
            return insertRepairDetails(req, mysql, context)
        })
        .then(function()
        {
            res.redirect('/repairs');
        })
        .catch(function (err) {console.log(err)});
    })

    // route to delete a repair
    router.delete("/:id", function(req, res)
    {
        let mysql = req.app.get("mysql");
        let query = "DELETE FROM Repairs where repair_ID = ?";
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
        context.cssstyles = ["repairs.css"];
        context.jsscripts = ["updateRepairPage.js"];
        getRepair(mysql, context, req.params.id)
        .then(function(context)
        {
            // console.log(context);
            return getItemsInRepair(mysql, context, req.params.id)
        })
        .then(function(context)
        {
            // change the date to the correct format for the form YYYY-MM-DD
            context.update_repair.date_completed_form_friendly = context.update_repair.date_completed.toISOString().split('T')[0]
            res.render('updateRepair', context);
        })
    })

    // route for updating a repair
    router.put('/:id', function(req, res)
    {
        
        let mysql = req.app.get("mysql");
        let item_quantity_array = JSON.parse(req.body.item_quantity_array);
        let repair_details_id_array = JSON.parse(req.body.repair_details_ID_array)
        let repair_id = req.params.id;
        let date_completed = req.body.date_completed;
        let notes = req.body.notes;
        // console.log(req.body);
        // console.log(date_completed);
        // console.log(item_quantity_array);
        // console.log(repair_details_id_array);
        updateRepair(mysql, repair_id, date_completed, notes)
        .then(function()
        {
            updateRepairDetails(mysql, item_quantity_array, repair_details_id_array)
        })
        
    });
    return router;
}();

