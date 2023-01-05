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
    user_role INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS store(
    store_name VARCHAR(50) NOT NULL,
    store_id SERIAL,
    store_description VARCHAR(100),
    store_lon DECIMAL,
    store_lat DECIMAL,
    PRIMARY KEY(store_id)
);

INSERT INTO store (store_name, store_description, store_lon, store_lat) VALUES ('Souvlatzidiko o lampros', 'Souvlatzidiko', 21.73954101364825, 38.248197856033116);
INSERT INTO store (store_name, store_description, store_lon, store_lat) VALUES ('Batter Buttlers', 'Crepery', 21.742813941259982, 38.257442706575986);
