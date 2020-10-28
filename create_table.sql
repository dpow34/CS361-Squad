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
    total NUMERIC(10,2) NOT NULL,
    notes MEDIUMTEXT);

CREATE TABLE RepairDetails(
    RepairDetails_ID int AUTO_INCREMENT NOT NULL PRIMARY KEY,
    Reapir_ID int NOT NULL,
    Item_ID int NOT NULL,
    Item_Quantity int NOT NULL,
    Unit_Price NUMERIC(10,2) NOT NULL,
    Line_Total NUMERIC(10,2) NOT NULL
);

-- Set up foreign key realtionships
-- TODO: add the FK to items in RepairDetails
ALTER TABLE Repairs 
ADD CONSTRAINT FOREIGN KEY (customer_ID)
REFERENCES Customers(customer_ID) on DELETE CASCADE;

ALTER TABLE RepairDetails
ADD CONSTRAINT FOREIGN KEY 

-- Insert Sample Data
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

-- Insert Sample Repair Data
INSERT INTO Repairs(customer_ID, date_completed, total, notes)
VALUES
(
    1, "2020-05-13", 27.43, "oiled chain and tuned shifting"
);
