--Διόρθωσα κάποια πράγματα για να τρέχει στο postgres //niklotios
CREATE DATABASE webProjectdb;

--connect webProjectdb;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION postgis WITH SCHEMA public;


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

CREATE TABLE IF NOT EXISTS tokens(
    token_entry_id SERIAL PRIMARY KEY,
    user_token UUID REFERENCES users(user_id)
    ON UPDATE CASCADE ON DELETE CASCADE ,
    num_tokens_entered INTEGER,
    entered_date date
);

CREATE TABLE IF NOT EXISTS reaction_history(
    offerid SERIAL PRIMARY KEY
    REFERENCES offer(offer_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
    userid UUID NOT NULL,
    react_date DATE,
    r_type BOOLEAN,
    CONSTRAINT C1 FOREIGN KEY (userid) REFERENCES users(user_id)
    ON DELETE CASCADE ON UPDATE CASCADE
); 



CREATE TABLE IF NOT EXISTS categories(
    category_id VARCHAR (50) NOT NULL PRIMARY KEY,
    category_name VARCHAR (50) NOT NULL,
    UNIQUE (category_name)
);



CREATE TABLE IF NOT EXISTS subcategories(
    subcategory_name VARCHAR (50) NOT NULL,
    subcategory_id VARCHAR (50) NOT NULL PRIMARY KEY,
    parent_category VARCHAR(50),
    CONSTRAINT C3 FOREIGN KEY (parent_category) REFERENCES categories(category_name)
    ON DELETE CASCADE ON UPDATE CASCADE
    parent_category_id VARCHAR(50)
    REFERENCES categories(category_id)
);

CREATE TABLE IF NOT EXISTS products(
    product_id SERIAL PRIMARY KEY,
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

CREATE TABLE IF NOT EXISTS price_history (
    price_id SERIAL PRIMARY KEY,
    price_log_id INTEGER REFERENCES products(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
    date DATE,
    price NUMERIC
);


CREATE TABLE IF NOT EXISTS store (
    id serial PRIMARY KEY,
    osm_id text NOT NULL,
    name text ,
    shop text ,
    location geometry NOT NULL
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
    userid uuid REFERENCES users(user_id)
    ON UPDATE CASCADE ON DELETE CASCADE,
    PRIMARY KEY (offer_id),
    CONSTRAINT STRE
    FOREIGN KEY (storeID) REFERENCES store(id)
    ON DELETE CASCADE 
    ON UPDATE CASCADE,
	FOREIGN KEY (productID) REFERENCES products(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
