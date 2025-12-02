INSERT INTO accounts (name, email, password, phone_number, role) VALUES
('User ', 'user@example.com', 123456, '0901112223', 'user'),
('Admin ', 'admin@example.com', 123456, '0904445556', 'admin'),
('Staff ', 'staff@example.com', 123456, '0907778889', 'staff'),
('Admin ', 'admin@gmail.com', 123456, '0868778033', 'admin');

INSERT INTO brands (name)
VALUES 
('HP'),
('Dell'),
('Asus'),
('Acer'),
('Lenovo'),
('MSI'),
('Gigabyte'),
('MacBook'),
('Logitech'),
('Razer'),
('Samsung'),
('Apple'),
('BenQ'),
('ViewSonic');

INSERT INTO categories (name, parent_id)
VALUES 
('Laptop', NULL),
('PC', NULL),
('Màn hình', NULL),
('Phụ kiện', NULL),
('Laptop Văn phòng', 1),
('Laptop Gaming', 1),
('Laptop Mỏng nhẹ', 1),
('Laptop Học sinh - sinh viên', 1),
('Laptop Đồ họa', 1),
('PC Văn phòng', 2),
('PC Gaming', 2),
('PC Đồ họa', 2),
('Màn hình Gaming', 3),
('Màn hình Đồ họa', 3),
('Màn hình Văn phòng', 3),
('Màn hình Lập trình', 3),
('Màn hình Di động', 3),
('Chuột', 4),
('Bàn phím', 4),
('Tai nghe', 4),
('Card đồ họa', 4),
('RAM', 4);

