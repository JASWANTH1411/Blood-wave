CREATE DATABASE bloodwave;

USE bloodwave;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    email VARCHAR(100),
    password VARCHAR(255),
    role VARCHAR(20),
    blood VARCHAR(10),
    city VARCHAR(100),
    pincode VARCHAR(20),
    reset_token VARCHAR(255)
);
