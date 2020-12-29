CREATE TABLE "User"
(
   userId SERIAL,
   email TEXT NOT NULL,
   password TEXT NOT NULL,

   firstname TEXT,
   lastname TEXT,
   street TEXT,
   houseNumber INTEGER,
   postalCode TEXT,
   country TEXT,
   isAdmin BOOLEAN,
   PRIMARY KEY (userId)
);

-- CREATE TABLE AdminUser
-- (
--     adminUserId SERIAL,
--     userId SERIAL NOT NULL UNIQUE,

--     PRIMARY KEY (adminUserId),
--     FOREIGN KEY (userId) REFERENCES "User"(userId)
-- );

CREATE TABLE Product
(
    productId SERIAL,
    productName TEXT NOT NULL,
    productPrice NUMERIC(10, 2) NOT NULL,
    productDescription TEXT,
    productCategorie TEXT,
    productUrl TEXT,
    isActive BOOLEAN,
    PRIMARY KEY (productId)
);

CREATE TABLE "Order"
(
    orderId SERIAL,
    userId SERIAL,
    orderDate TIMESTAMP,
    orderStatus TEXT,
    PRIMARY KEY (orderId),
    FOREIGN KEY (userId) REFERENCES "User"(userId)
);

CREATE TABLE Orderdetail
(
    orderdetailId SERIAL,
    productId SERIAL,
    orderId SERIAL,
    quantityOrdered INTEGER NOT NULL,
    PRIMARY KEY (orderdetailId),
    FOREIGN KEY (productId) REFERENCES Product(productId),
    FOREIGN KEY (orderId) REFERENCES "Order"(orderId)
);

CREATE TABLE Payment
(
    paymentId SERIAL,
    userId SERIAL,
    paymentDate TIMESTAMP,
    amount NUMERIC(10, 2) NOT NULL,
    PRIMARY KEY (paymentId),
    FOREIGN KEY (userId) REFERENCES "User"(userId)
);