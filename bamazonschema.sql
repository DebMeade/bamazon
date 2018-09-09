DROP DATABASE IF EXISTS bamazondb;
CREATE DATABASE bamazondb;

USE bamazondb;

CREATE TABLE products (
    item_id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
    product_name VARCHAR (50) NOT NULL,
    department_name VARCHAR (50),
    price DECIMAL(5,2) NOT NULL,
    stock_quantity INTEGER (2) NOT NULL DEFAULT 0
);