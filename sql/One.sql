-- SQL Manipulation

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
SELECT retail_price FROM items

-- Display all necessary info --
-- Get the customers name from customers
SELECT customer_first_name, customer_last_name FROM customers

-- Get the items name from items
SELECT name FROM items

-- Get the item quantity of the sales item
SELECT item_Quantity FROM salesDetails

-- Get the date and total sales 
SELECT sale_date, sale_total FROM sales


-- Insert the info --

-- Insert customer ID --
INSERT INTO sales (customer_ID) 
VALUES (:customer_ID_Input)

-- Insert item ID --
INSERT INTO salesDetails (item_ID) 
VALUES (:item_ID_Input)

-- Insert Number of Item --
INSERT INTO salesDetails (item_quantity) 
VALUES (:item_quantity_Input) 

-- Insert date and total cost--
INSERT INTO sales (sale_date, sale_total) 
VALUES (:sale_date, :sale_total) 



-- Delete the Sales --
DELETE FROM sales WHERE sales_ID = :sales_ID



-- Update the sales info --
UPDATE sales SET customer_ID=:customer_ID, sale_date=:sale_date, sale_total=:sale_total
WHERE sales_ID=:sales_ID

-- Update the salesDetails --
UPDATE SaleDetails SET sale_ID=:sale_ID, item_ID=:item_ID, item_quantity=:item_quantity, line_total=:line_total
WHERE sale_details_ID=:sale_details_ID





