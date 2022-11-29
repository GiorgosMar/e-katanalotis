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