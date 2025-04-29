-- Drop tables if they already exist

DROP TABLE IF EXISTS CanDrive;
DROP TABLE IF EXISTS Rent;
DROP TABLE IF EXISTS Review;
DROP TABLE IF EXISTS CreditCard;
DROP TABLE IF EXISTS ClientAddress;
DROP TABLE IF EXISTS Driver;
DROP TABLE IF EXISTS Client;
DROP TABLE IF EXISTS Manager;
DROP TABLE IF EXISTS Model;
DROP TABLE IF EXISTS Car;
DROP TABLE IF EXISTS Address;

-- 1. Address
CREATE TABLE Address (
    address_id SERIAL PRIMARY KEY,
    road_name VARCHAR(100) NOT NULL,
    number VARCHAR(10) NOT NULL,
    city VARCHAR(50) NOT NULL
);

-- 2. Manager
CREATE TABLE Manager (
    ssn VARCHAR(9) PRIMARY KEY, -- 9 digits only
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL
);

-- 3. Client
CREATE TABLE Client (
    client_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);

-- 4. Driver
CREATE TABLE Driver (
    driver_id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    address_id INTEGER NOT NULL REFERENCES Address(address_id)
);

-- 5. ClientAddress (linking Client and Address)
CREATE TABLE ClientAddress (
    client_id INTEGER NOT NULL REFERENCES Client(client_id),
    address_id INTEGER NOT NULL REFERENCES Address(address_id),
    PRIMARY KEY (client_id, address_id)
);

-- 6. CreditCard (includes payment address directly)
CREATE TABLE CreditCard (
    card_number VARCHAR(20) PRIMARY KEY,
    client_id INTEGER NOT NULL REFERENCES Client(client_id),
    address_id INTEGER NOT NULL REFERENCES Address(address_id)
);

-- 7. Review (corrected PK)
CREATE TABLE Review (
    review_id SERIAL,
    message TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 0 AND 5),
    driver_id INTEGER NOT NULL REFERENCES Driver(driver_id),
    client_id INTEGER REFERENCES Client(client_id), -- Optional for anonymous
    PRIMARY KEY (driver_id, review_id)
);

-- 8. Car
CREATE TABLE Car (
    car_id SERIAL PRIMARY KEY,
    brand VARCHAR(100) NOT NULL
);

-- 9. Model (weak entity with composite PK)
CREATE TABLE Model (
    model_id SERIAL,
    color VARCHAR(50) NOT NULL,
    transmission VARCHAR(20) NOT NULL,
    year INT NOT NULL,
    car_id INTEGER NOT NULL REFERENCES Car(car_id),
    PRIMARY KEY (model_id, car_id)
);

-- 10. Rent (everything together)
CREATE TABLE Rent (
    rent_id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    client_id INTEGER NOT NULL REFERENCES Client(client_id),
    driver_id INTEGER NOT NULL REFERENCES Driver(driver_id),
    model_id INTEGER NOT NULL,
    car_id INTEGER NOT NULL,
    FOREIGN KEY (model_id, car_id) REFERENCES Model(model_id, car_id)
);

-- 11. CanDrive (driver drives models)
CREATE TABLE CanDrive (
    driver_id INTEGER NOT NULL REFERENCES Driver(driver_id),
    model_id INTEGER NOT NULL,
    car_id INTEGER NOT NULL,
    PRIMARY KEY (driver_id, model_id, car_id),
    FOREIGN KEY (model_id, car_id) REFERENCES Model(model_id, car_id)
);
