CREATE TABLE Customers(
    customer_ID int AUTO_INCREMENT NOT NULL PRIMARY KEY,
	first_name varchar(255) NOT NULL,
	last_name varchar(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    zip_code VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL);

CREATE TABLE Repairs(
    repair_ID int AUTO_INCREMENT NOT NULL PRIMARY KEY,
    customer_ID int NOT NULL,
    date_completed DATE NOT NULL,
    total NUMERIC(18,2) NOT NULL,
    notes MEDIUMTEXT);

CREATE TABLE RepairDetails(
    repair_details_ID int AUTO_INCREMENT NOT NULL PRIMARY KEY,
    repair_ID int NOT NULL,
    item_ID int NOT NULL,
    item_quantity int NOT NULL,
    line_total NUMERIC(18,2) NOT NULL
);

Create TABLE Items(
    item_ID INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    quantity_in_stock INT NOT NULL,
    retail_price NUMERIC(18,2) NOT NULL
);

Create TABLE Sales(
    sale_ID INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    customer_ID INT NOT NULL,
    sale_date DATE NOT NULL,
    sale_total NUMERIC(18,2) NOT NULL
); 

Create TABLE SaleDetails(
    sale_details_ID INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    sale_ID INT NOT NULL,
    item_ID INT NOT NULL,
    item_quantity INT NOT NULL,
    line_total NUMERIC(18,2) NOT NULL
);

-- Remove all created tables
-- SET FOREIGN_KEY_CHECKS = 0;
-- DROP TABLE IF EXISTS Customers;
-- DROP TABLE IF EXISTS Items;
-- DROP TABLE IF EXISTS RepairDetails;
-- DROP TABLE IF EXISTS SaleDetails;
-- DROP TABLE IF EXISTS Sales;
-- DROP TABLE IF EXISTS Repairs;


-- Set up foreign key realtionships
-- TODO: add the FK to items in RepairDetails
ALTER TABLE Repairs 
ADD CONSTRAINT FOREIGN KEY (customer_ID)
REFERENCES Customers(customer_ID) on DELETE CASCADE;

ALTER TABLE RepairDetails
ADD CONSTRAINT FOREIGN KEY (repair_ID) REFERENCES Repairs(repair_ID) on DELETE CASCADE,
ADD CONSTRAINT FOREIGN KEY (item_ID) REFERENCES Items(item_ID) on DELETE CASCADE;

ALTER TABLE Sales
ADD CONSTRAINT FOREIGN KEY (customer_ID)
REFERENCES Customers(customer_ID) on DELETE CASCADE;

ALTER TABLE SaleDetails
ADD CONSTRAINT FOREIGN KEY (sale_ID) REFERENCES Sales(sale_ID) on DELETE CASCADE,
ADD CONSTRAINT FOREIGN KEY (item_ID) REFERENCES Items(item_ID) on DELETE CASCADE;

-- Insert Sample Customer Data
INSERT INTO Customers(first_name, last_name, city, state, zip_code, phone)
VALUES
(
   "Riley", "Joinnides", "Patchogue", "New York", "11719", "5555555555"
),
(
    "Bob", "Engles", "Astoria", "New York", "11101", "2222222222"
),
(
    "Jo", "Blow", "Manorville", "New York", "11940","6666666666"
);

-- Insert sample Repair data
INSERT INTO Repairs(customer_ID, date_completed, total, notes)
VALUES
(
    1, "2020-05-13", 27.43, "oiled chain and tuned shifting"
),
(
    1, "2020-05-01", 24.50, "changed flat"
),
(
    2, "2020-04-12", 150.12, "installed a new saddle"
);

-- Insert sample Items data
INSERT INTO Items(name, quantity_in_stock, retail_price)
VALUES 
(
    "26 "" inner tube", 10, 7.00
),
(
    "26 "" tire ", 7, 25.00
),
(
    "saddle", 3, 35.00
),
(
    "oil", 20, 7.25
);

-- Insert sample RepairDetails data
INSERT INTO RepairDetails(repair_ID, item_ID, item_quantity, line_total)
VALUES
-- inserting inner tubes to changed flat repair
(
    2, 1, 2, 14.00
),
-- inserting saddle to change saddle repair
(
    3, 3, 1, 35.00
);

INSERT INTO Sales(customer_ID, sale_date, sale_total)
VALUES
(
    1, "2020-05-15", 14.50
),
(
    3, "2020-04-30", 27.25
);

INSERT INTO SaleDetails(sale_ID, item_ID, item_quantity, line_total)
VALUES
-- Add 2x oil to the sale on 2020-05-15
(
    1, 4, 2, 14.50
),
-- Add 1x 26 " tire to the sale on 2020-04-30
(
    2, 2, 1, 25.00
);