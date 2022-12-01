CREATE DATABASE webProjectdb;

\connect webProjectdb;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users(
    user_id UUID DEFAULT
    uuid_generate_v4()
    PRIMARY KEY,
    user_name VARCHAR(50),
    user_email VARCHAR(50),
    user_password VARCHAR(50),
    user_conf_password VARCHAR(50),
    user_role INT DEFAULT 0,
    score INT DEFAULT 0 NOT NULL,
    tokens INT DEFAULT 0 NOT NULL,
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS product(
    product_id INT NOT NULL AUTO_INCREMENT
    product_name VARCHAR(50),
    category VARCHAR(50),
    photo VARCHAR(100),
    PRIMARY KEY product_id,
    UNIQUE product_name,
    ON DELETE CASCADE ON UPDATE CASCADE
); 

CREATE TABLE IF NOT EXISTS reaction_history(
    offer_id INT NOT NULL AUTO_INCREMENT,
    userid INT NOT NULL,
    react_date DATE,
    type BOOLEAN,
    PRIMARY KEY offer_id,
    CONSTRAINT C1 FOREIGN KEY (userid) REFERENCES user(user_id)
); 

CREATE TABLE IF NOT EXISTS price_history(
    
    price_h_id INT NOT NULL AUTO_INCREMENT,
    price FLOAT(3,2),
    price_date DATE,
    product INT NOT NULL,
    PRIMARY KEY price_h_id,
    CONSTRAINT C2 FOREIGN KEY (productid) REFERENCES product(product_id)
    ON DELETE CASCADE ON UPDATE CASCADE
); 

CREATE TABLE IF NOT EXISTS category(
    category_name VARCHAR (50) NOT NULL,
    parent_category VARCHAR(50),
    PRIMARY KEY category_name
    CONSTRAINT C3 FOREIGN KEY (parent_category) REFERENCES category(category_name)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS offer(
    offer_id INT NOT NULL AUTO_INCREMENT,
    productID INT NOT NULL
    storeID INT NOT NULL 
    init_price FLOAT(3,2),
    new_price FLOAT(3,2),
    stock BOOLEAN,
    likes INT ,
    dislikes INT,
    entry_date DATE,
    PRIMARY KEY (offer_id),
    CONSTRAINT STRE
    FOREIGN KEY (storeID) REFERENCES store(store_id)
    ON DELETE CASCADE 
    ON UPDATE CASCADE
    FOREIGN KEY (productID) REFERENCES product(product_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS store(
    store_name VARCHAR(50) NOT NULL,
    store_id INT NOT NULL AUTO INCREMENT,
    store_category ENUM('super','convenience'),
    longtitude FLOAT(3,15),
    latitude FLOAT(2,15),
    PRIMARY KEY(store_id)
);
