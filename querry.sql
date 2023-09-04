-- Active: 1692284831732@@147.139.210.135@5432@izaaz01@public
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
    role_user VARCHAR(255),
    verify text not null,
    updated_on timestamp default CURRENT_TIMESTAMP not null,
    primary key (id_user)
);

create table users_verification
(
    id text not null ,
    users_id text ,
    token text ,
    created_on timestamp default CURRENT_TIMESTAMP not null	,
    constraint 	users foreign key(users_id) 	references 	users(id_user) ON DELETE CASCADE,
    primary key (id)
)

CREATE  FUNCTION update_updated_on_users()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_on = now
();
RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_on
    BEFORE
UPDATE
    ON
        users
    FOR EACH ROW
EXECUTE PROCEDURE update_updated_on_users
();

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
    store_seller VARCHAR(255),
    verify TEXT NOT NULL,
    primary key (id_seller),
    updated_on timestamp default CURRENT_TIMESTAMP not null
)



CREATE  FUNCTION update_updated_on_seller()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_on = now
();
RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_seller_updated_on
    BEFORE
UPDATE
    ON
        seller
    FOR EACH ROW
EXECUTE PROCEDURE update_updated_on_seller
();

create table seller_verification
(
    id text not null ,
    seller_id text ,
    token text ,
    created_on timestamp default CURRENT_TIMESTAMP not null	,
    constraint 	seller foreign key(seller_id) 	references 	seller(id_seller) ON DELETE CASCADE,
    primary key (id)
)

CREATE TABLE order_list
(
    id_order INT PRIMARY KEY,
    id_product INT,
    quantity_order INT,
    id_user VARCHAR(255)
);