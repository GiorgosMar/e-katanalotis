--Διόρθωσα κάποια πράγματα για να τρέχει στο postgres //niklotios
CREATE DATABASE webProjectdb;

--connect webProjectdb;

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
    tokens INT DEFAULT 0 NOT NULL
); 

CREATE TABLE IF NOT EXISTS reaction_history(
    offer_id SERIAL PRIMARY KEY,
    userid UUID NOT NULL,
    react_date DATE,
    type BOOLEAN,
    CONSTRAINT C1 FOREIGN KEY (userid) REFERENCES users(user_id)
    ON DELETE CASCADE ON UPDATE CASCADE
); 



CREATE TABLE IF NOT EXISTS categories(
    category_id VARCHAR (50) NOT NULL PRIMARY KEY,
    category_name VARCHAR (50) NOT NULL
);



CREATE TABLE IF NOT EXISTS subcategories(
    subcategory_name VARCHAR (50) NOT NULL,
    subcategory_id VARCHAR (50) NOT NULL PRIMARY KEY,
    parent_category VARCHAR(50),
    CONSTRAINT C3 FOREIGN KEY (parent_category) REFERENCES categories(category_name)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS products(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    category VARCHAR(50) ,
    subcategory	 VARCHAR(50),
    photo VARCHAR(100),
    UNIQUE (name),
    CONSTRAINT C7 FOREIGN KEY (category) REFERENCES categories(category_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT C8 FOREIGN KEY (subcategory) REFERENCES subcategories(subcategory_id)
    ON DELETE CASCADE ON UPDATE CASCADE	
);

CREATE TABLE IF NOT EXISTS price_history(
    
    price_h_id SERIAL PRIMARY KEY,
    price NUMERIC(3,2),
    price_date DATE,
    productid INT NOT NULL,
    CONSTRAINT C2 FOREIGN KEY (productid) REFERENCES products(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TYPE classification AS ENUM ('super','convenience');

CREATE TABLE IF NOT EXISTS store(
    store_name VARCHAR(50) NOT NULL,
    store_id SERIAL,
    store_category classification ,
    longtitude NUMERIC(18,15),
    latitude NUMERIC(17,15),
    PRIMARY KEY(store_id)
);


CREATE TABLE IF NOT EXISTS offer(
    offer_id SERIAL,
    productID INT NOT NULL,
    storeID INT NOT NULL ,
    init_price NUMERIC(5,2),
    new_price NUMERIC(5,2),
    stock BOOLEAN,
    likes INT,
    dislikes INT,
    entry_date DATE,
    PRIMARY KEY (offer_id),
    CONSTRAINT STRE
    FOREIGN KEY (storeID) REFERENCES store(store_id)
    ON DELETE CASCADE 
    ON UPDATE CASCADE,
	FOREIGN KEY (productID) REFERENCES products(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
