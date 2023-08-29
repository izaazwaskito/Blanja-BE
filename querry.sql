CREATE TABLE category
(
    id_category INT PRIMARY KEY,
    name_category VARCHAR(255)
);

CREATE TABLE product
(
    id_product INT PRIMARY KEY,
    id_category INT,
    name_product TEXT,
    price_product INT,
    description_product TEXT,
    stock_product INT,
    image_product VARCHAR(255)
);

CREATE TABLE users
(
    id_user VARCHAR(255),
    email_user VARCHAR(255),
    password_user VARCHAR(255),
    fullname_user VARCHAR(255),
    role_user VARCHAR(255)
);

CREATE TABLE address
(
    id_address SERIAL PRIMARY KEY,
    name_address VARCHAR(255),
    street_address TEXT,
    phone_address VARCHAR(255),
    postal_address VARCHAR(255),
    city_address VARCHAR(255),
    place_address VARCHAR(255),
    id_user VARCHAR(255)
);

CREATE TABLE seller
(
    id_seller VARCHAR(255),
    email_seller VARCHAR(255),
    phone_seller VARCHAR(255),
    name_seller VARCHAR(255),
    password_seller VARCHAR(255),
    description_seller TEXT,
    store_seller VARCHAR(255)
)

CREATE TABLE order_list
(
    id_order INT PRIMARY KEY,
    id_product INT,
    quantity_order INT,
    id_user VARCHAR(255)
);