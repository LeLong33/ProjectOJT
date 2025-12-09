CREATE DATABASE IF NOT EXISTS TechStore;
USE TechStore;


CREATE TABLE accounts (
    account_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    phone_number VARCHAR(20),
    role ENUM('user', 'staff', 'admin')
);

ALTER TABLE accounts
    ADD COLUMN  date_of_birth DATE NULL,
    ADD COLUMN  avatar_url VARCHAR(512) NULL;

CREATE TABLE addresses (
    address_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    account_id INT,
    recipient_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    address VARCHAR(255) NOT NULL,
    district VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    is_default BOOLEAN,
    FOREIGN KEY (account_id) REFERENCES accounts(account_id)
);

CREATE TABLE categories (
	category_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    parent_id INT,
    FOREIGN KEY (parent_id) REFERENCES categories(category_id)
);

CREATE TABLE brands (
	brand_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100)
);

CREATE TABLE products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    code VARCHAR(100) UNIQUE,
    price DECIMAL(10,2),
    quantity INT,
    brand_id INT,
    category_id INT,
    description TEXT,
    short_description	VARCHAR(500),
    is_active BOOLEAN,
    rating FLOAT,
    numReviews INT,
    createdAt DATETIME,
    FOREIGN KEY (brand_id) REFERENCES brands(brand_id),
	FOREIGN KEY (category_id) REFERENCES categories(category_id)

);


CREATE TABLE productDetails (
    pd_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    CPU VARCHAR(100),
    GPU VARCHAR(100),
    RAM VARCHAR(50),
    Storage VARCHAR(100),
    Display VARCHAR(100),
    Battery VARCHAR(50),
    Weight VARCHAR(50),
    OS VARCHAR(50),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);


CREATE TABLE productImages (
	image_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT,
    url VARCHAR(255),
    is_main BOOLEAN,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

CREATE TABLE product_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    account_id INT,
    rating INT,
    comment TEXT,
    FOREIGN KEY (product_id) REFERENCES products(product_id),
    FOREIGN KEY (account_id) REFERENCES accounts(account_id)
);


CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    account_id INT,
    guest_name VARCHAR(100),
    guest_phone VARCHAR(20),
    address_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    final_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Chờ xác nhận',
    payment_method VARCHAR(50) NOT NULL,
    isPaid BOOLEAN,
    paidAt DATETIME NULL,
    isDelivered BOOLEAN,
    deliveredAt DATETIME NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES accounts(account_id) ON DELETE SET NULL,
    FOREIGN KEY (address_id) REFERENCES addresses(address_id)
);



CREATE TABLE payment_result (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orderId INT,
    payId VARCHAR(100),
    status VARCHAR(50),
    update_time DATETIME,
    email_address VARCHAR(100),
    FOREIGN KEY (orderId) REFERENCES orders(order_id)
);


CREATE TABLE order_items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price_at_order DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (`order_id`) REFERENCES `orders`(`order_id`) ON DELETE CASCADE,
    FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE RESTRICT
);


