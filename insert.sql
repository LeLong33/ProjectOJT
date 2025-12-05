INSERT INTO accounts (name, email, password, phone_number, role) VALUES
('User ', 'user@example.com', 123456, '0901112223', 'user'),
('Admin ', 'admin@example.com', 123456, '0904445556', 'admin'),
('Staff ', 'staff@example.com', 123456, '0907778889', 'staff');

-- -----------------------------------
-- 2. CHÈN DỮ LIỆU DANH MỤC (categories)
-- -----------------------------------
INSERT INTO categories (category_id, name, parent_id) VALUES
(1, 'Laptop', NULL),
(2, 'Laptop Gaming', 1),
(3, 'Laptop Văn Phòng', 1),
(4, 'PC', NULL),
(5, 'PC Gaming', 4);


-- -----------------------------------
-- 3. CHÈN DỮ LIỆU THƯƠNG HIỆU (brands)
-- -----------------------------------
INSERT INTO brands (brand_id, name) VALUES
(1, 'ASUS'),
(2, 'DELL'),
(3, 'ACER'),
(4, 'HP');


-- -----------------------------------
-- 4. CHÈN DỮ LIỆU SẢN PHẨM (products)
-- -----------------------------------
INSERT INTO products (product_id, name, code, price, quantity, brand_id, category_id, description, short_description, is_active, rating, numReviews, createdAt) VALUES
(1, 'Laptop Gaming ASUS ROG Zephyrus', 'A001ROGF', 35990000.00, 50, 1, 2, 'Mô tả chi tiết ASUS ROG Zephyrus...', 'Laptop Gaming cao cấp, RTX 4080', TRUE, 4.8, 120, NOW()),
(2, 'Laptop Văn Phòng DELL Inspiron 5520', 'D002INSP', 18500000.00, 120, 2, 3, 'Mô tả chi tiết DELL Inspiron...', 'Laptop mỏng nhẹ, Core i5 thế hệ 13', TRUE, 4.5, 80, NOW()),
(3, 'PC Gaming ACER Predator Orion', 'AC03PRED', 42000000.00, 30, 3, 5, 'Mô tả chi tiết PC ACER Predator...', 'PC Gaming mạnh mẽ, Core i9, RTX 4090', TRUE, 5.0, 50, NOW()),
(4, 'Laptop HP Pavilion Aero', 'HP04AERO', 15990000.00, 90, 4, 3, 'Mô tả chi tiết HP Pavilion...', 'Laptop siêu nhẹ 1kg, pin trâu', TRUE, 4.2, 35, NOW());


-- -----------------------------------
-- 5. CHÈN DỮ LIỆU CHI TIẾT SẢN PHẨM (productDetails)
-- -----------------------------------
INSERT INTO productDetails (product_id, CPU, GPU, RAM, Storage, Display, Battery, Weight, OS) VALUES
(1, 'Core i9-13900H', 'RTX 4080 12GB', '32GB DDR5', '1TB SSD', '16-inch QHD+ 165Hz', '90Wh', '2.0kg', 'Windows 11 Home'),
(2, 'Core i5-13500H', 'Intel Iris Xe', '16GB DDR4', '512GB SSD', '15.6-inch FHD', '54Wh', '1.8kg', 'Windows 11 Home'),
(3, 'Core i9-14900K', 'RTX 4090 24GB', '64GB DDR5', '2TB SSD + 4TB HDD', 'N/A', 'N/A', '15kg', 'Windows 11 Pro'),
(4, 'Ryzen 7 7735U', 'AMD Radeon', '16GB LPDDR5', '512GB SSD', '13.3-inch FHD', '43Wh', '0.97kg', 'Windows 11 Home');


-- -----------------------------------
-- 6. CHÈN DỮ LIỆU HÌNH ẢNH (productImages)
-- -----------------------------------
INSERT INTO productImages (product_id, url, is_main) VALUES
(1, 'https://example.com/images/rog_main.jpg', TRUE),
(1, 'https://example.com/images/rog_side.jpg', FALSE),
(2, 'https://example.com/images/dell_main.jpg', TRUE),
(3, 'https://example.com/images/acer_main.jpg', TRUE),
(4, 'https://example.com/images/hp_main.jpg', TRUE);

-- -----------------------------------
-- 7. CHÈN DỮ LIỆU ĐÁNH GIÁ (product_reviews)
-- -----------------------------------
INSERT INTO product_reviews (product_id, account_id, rating, comment) VALUES
(1, 1, 5, 'Máy chạy rất mạnh, chiến game không lag.'),
(1, 2, 5, 'Thiết kế đẹp, xứng đáng với giá tiền.'),
(2, 1, 4, 'Laptop văn phòng ổn, nhưng loa hơi nhỏ.'),
(3, 1, 5, 'Hiệu năng tuyệt vời cho công việc đồ họa.'),
(4, 3, 4, 'Máy nhẹ, dễ mang đi lại, pin dùng lâu.'),
(4, 1, 3, 'Hơi nóng khi dùng lâu.');