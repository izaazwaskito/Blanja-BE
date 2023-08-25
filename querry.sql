
CREATE TABLE category
(
    id_category SERIAL PRIMARY KEY,
    name_category VARCHAR NOT NULL
);

CREATE TABLE product
(
    id_product SERIAL PRIMARY KEY,
    id_category INT NOT NULL,
    name_product VARCHAR,
    price_product INT NOT NULL,
    description_product TEXT,
    stock_product INT NOT NULL,
    image_product VARCHAR(255)
);

CREATE TABLE users
(
    id_order SERIAL PRIMARY KEY,
    id_product INT ,
    quantity_order INT ,
    date_order DATE
);

CREATE TABLE address
(
    id_address SERIAL PRIMARY KEY,
    name_address VARCHAR(255),
    street_address VARCHAR(255),
    phone_address VARCHAR(255),
    postal_address VARCHAR(255),
    city_address VARCHAR(255),
    place_address VARCHAR(255)
);