---------------------- Customers --------------------

---- Create ----

INSERT INTO Ccustomers(first_name, last_name, city, state, zip_code, phone)
VALUES(:input_first_name, :input_last_name, :input_city, :input_zip_code, :input_phone);

---- Read ----

-- Query to get the data to build inital table of customers 
SELECT * FROM Customers;

-- Query to list details of a specific customer
SELECT * From Customers WHERE customer_ID = :input_customer_ID;

---- Update ----

-- Only update certain details about a customer, do not change name
UPDATE Customers
SET city = :new_input_city, state = :new_input_state, zip_code = :new_input_zip_code
WHERE Customer_ID = :input_customer_ID

---- Delete ----

DELETE from Customers WHERE customer_ID = :input_customer_ID

---------------------- Repairs --------------------

---- Create ----

-- Create a repair in Repairs table
INSERT INTO Repairs(customer_ID, date_completed, total, notes)
VALUES(:input_customer_ID, :input_date, :input_total, :input_nodes);

-- Add items used in the repair to the RepairDetails table
INSERT INTO RepairDetails(repair_ID, item_ID, item_quantity, line_total)
VALUES(:input_repair_ID, :input_item_ID, :input_item_quantity, input_line_total) 

---- Read ----

-- Get customer name, date total and notes for repairs
SELECT Repairs.repair_ID, first_name, last_name, date_completed, total, notes, repair_details_ID, Items.name
from Repairs 
INNER JOIN Customers on Repairs.customer_ID = Customers.customer_ID
INNER JOIN RepairDetails on RepairDetails.repair_ID = Repairs.repair_ID
INNER JOIN Items on Item.item_ID = RepairDetails.item_ID;

-- Repairs also need a list of items, this query selects indivdiual repairs and lists returns a table of items names used in the repair
SELECT i.name, rd.item_quantity from
RepairDetails rd INNER JOIN Items i ON rd.item_ID = i.item_ID 
WHERE rd.repair_ID = :input_repair_ID;

---- Update ----

-- Update a repair 
UPDATE Repairs
SET date_completed = :new_input_date, total = :new_input_total, notes = :new_input_notes
WHERE Repair_ID = :input_repair_ID

-- To update a repair, we might also need to add more items so need to interact with RepairDetails
-- TODO: write interaction with RepairDetials
UPDATE RepairDetails
SET item_quantity = :new_input_date, line_total = :new_input_line_total
WHERE RepairDetails_ID = :input_repair_details_ID;

---- Delete ----

DELETE FROM Repairs WHERE repair_ID = :input_repair_ID;

---------------------- Functionality for the ITEMS --------------------
-- Needed Functinality: Insert Item Name, Date, Number of Item, Individual Cost
-- display all item attributes
-- Delete the item
-- Update the item

-- Get all the current items info from items --
SELECT name, quantity_in_stock, retail_price FROM items

-- Insert new items --
-- No ID auto increment? --
INSERT INTO items (name, quantity_in_stock, retail_price) 
VALUES (:nameInput, :quantityInput, :priceInput)

-- Delete the Item --
DELETE FROM items WHERE items_ID = :items_ID

-- Update the item info --
UPDATE items SET name=:name, quantity_in_stock=:quantity_in_stock, retail_price=:retail_price
WHERE items_ID=:items_ID

---------------------- Functionality for the Sales ------------------------
-- Needed Functionality: Insert customer, date, number of item, total cost, item ID,
-- Get individual cost
-- Display all customer, item, quantity,date, total price
-- Delete sale

-- Individual cost --
-- Get the individual cost of the item from items
SELECT retail_price FROM Items

-- Display all necessary info --
-- Get the customers name from customers
SELECT customer_first_name, customer_last_name FROM customers

-- Get the items name from items
SELECT name FROM Items

-- Get the item quantity of the sales item
SELECT item_Quantity FROM salesDetails

-- Get the date and total sales 
SELECT sale_date, sale_total FROM sales


-- Insert the info --

-- Insert sales info --
INSERT INTO Sales (customer_ID, sale_date, sale_total) 
VALUES (:customer_ID_Input, :sale_date, :sale_total)

-- Insert salesDetails info --
INSERT INTO salesDetails (sale_ID, item_ID, item_quantity, line_total) 
VALUES (:sale_ID, :item_ID, :item_quantity, :line_total)


-- Delete the Sales --
DELETE FROM Sales WHERE sale_ID = :sale_ID



-- Update the sales info --
UPDATE Sales SET customer_ID=:customer_ID, sale_date=:sale_date, sale_total=:sale_total
WHERE sale_ID=:sale_ID

-- Update the salesDetails --
UPDATE SaleDetails SET sale_ID=:sale_ID, item_ID=:item_ID, item_quantity=:item_quantity, line_total=:line_total
WHERE sale_details_ID=:sale_details_ID
