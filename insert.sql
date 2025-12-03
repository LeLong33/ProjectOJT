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

INSERT INTO categories (category_id, name, parent_id)
VALUES 
(1, 'Laptop', NULL),
(2, 'PC', NULL),
(3, 'Màn hình', NULL),
(4, 'Phụ kiện', NULL),
(5, 'Laptop Văn phòng', 1),
(6, 'Laptop Gaming', 1),
(7, 'Laptop Mỏng nhẹ', 1),
(8, 'Laptop Học sinh - sinh viên', 1),
(9, 'Laptop Đồ họa', 1),
(10, 'PC Văn phòng', 2),
(11, 'PC Gaming', 2),
(12, 'PC Đồ họa', 2),
(13, 'Màn hình Gaming', 3),
(14, 'Màn hình Đồ họa', 3),
(15, 'Màn hình Văn phòng', 3),
(16, 'Màn hình Lập trình', 3),
(17, 'Màn hình Di động', 3),
(18, 'Chuột', 4),
(19, 'Bàn phím', 4),
(20, 'Tai nghe', 4),
(21, 'Card đồ họa', 4),
(22, 'RAM', 4);

INSERT INTO products (name, code, price, quantity, brand_id, category_id, description, short_description, is_active, rating, numReviews, createdAt) VALUES
-- 1. Laptop Văn phòng (category_id = 5) --
('Laptop HP Pavilion 15s-fq5160TU', 'HPP15S5160', 12990000.00, 50, 1, 5, 'Laptop văn phòng mỏng nhẹ, Core i5, RAM 8GB.', 'Mỏng nhẹ, Core i5-12th, 8GB RAM, 512GB SSD.', TRUE, 4.5, 30, NOW()),
('Laptop Dell Vostro 3520', 'DV3520', 10500000.00, 60, 2, 5, 'Dòng Vostro bền bỉ, cấu hình đủ dùng cho tác vụ văn phòng.', 'Core i3-12th, 8GB RAM, 256GB SSD.', TRUE, 4.2, 45, NOW()),
('Laptop Acer Aspire 5 A515', 'AA515', 14200000.00, 55, 4, 5, 'Cấu hình mạnh mẽ trong tầm giá, thiết kế hiện đại.', 'Core i5-13th, 16GB RAM, 512GB SSD.', TRUE, 4.4, 35, NOW()),

-- 2. Laptop Gaming (category_id = 6) --
('Laptop Gaming Asus ROG Strix G15', 'ROGGSG15IE', 25490000.00, 20, 3, 6, 'Laptop gaming hiệu năng cao, chuyên trị các game AAA.', 'Ryzen 7, RTX 3050Ti, Màn 144Hz.', TRUE, 4.7, 80, NOW()),
('Laptop Gaming MSI Katana GF66', 'MSIKATGF66', 21990000.00, 25, 6, 6, 'Hiệu năng mạnh mẽ với thiết kế ấn tượng.', 'Core i7-12th, RTX 3060, 16GB RAM.', TRUE, 4.6, 55, NOW()),
('Laptop Gaming Dell G15 5520', 'DG155520', 28990000.00, 18, 2, 6, 'Thiết kế hầm hố, tản nhiệt hiệu quả, cấu hình mạnh.', 'Core i9-12th, RTX 3070, 32GB RAM.', TRUE, 4.8, 40, NOW()),

-- 3. Laptop Mỏng nhẹ (category_id = 7) --
('Laptop Apple MacBook Air M2 2022', 'MBAIRM2', 30990000.00, 40, 12, 7, 'Laptop mỏng nhẹ, hiệu năng vượt trội với chip Apple M2.', 'Chip M2, Mỏng nhẹ, Pin khủng.', TRUE, 4.9, 120, NOW()),
('Laptop Dell XPS 13 9315', 'DXPS139315', 29500000.00, 28, 2, 7, 'Thiết kế không viền InfinityEdge đẳng cấp, cực kỳ mỏng nhẹ.', 'Core i7-12th, 16GB RAM, Màn 3.5K OLED.', TRUE, 4.8, 50, NOW()),
('Laptop Lenovo Yoga Slim 7 Carbon', 'LYS7CARBON', 24990000.00, 27, 5, 7, 'Siêu nhẹ với vỏ carbon, màn hình OLED độ phân giải cao.', 'Ryzen 7, 16GB RAM, Vỏ Carbon.', TRUE, 4.7, 33, NOW()),

-- 4. Laptop Học sinh - sinh viên (category_id = 8) --
('Laptop Acer Swift 3 SF314', 'ASWIFT3', 13500000.00, 70, 4, 8, 'Cấu hình ổn định, thiết kế thanh lịch cho học sinh sinh viên.', 'Core i5-12th, 8GB RAM, SSD 512GB.', TRUE, 4.3, 65, NOW()),
('Laptop Asus Vivobook Go 15', 'AVG15', 8900000.00, 80, 3, 8, 'Giá thành phải chăng, đáp ứng tốt nhu cầu học tập cơ bản.', 'Ryzen 3, 4GB RAM, 256GB SSD.', TRUE, 4.1, 90, NOW()),
('Laptop HP 14s-dq5114TU', 'HPDQ5114', 10990000.00, 75, 1, 8, 'Thiết kế gọn gàng, phù hợp mang đi học.', 'Core i3-12th, 8GB RAM, 512GB SSD.', TRUE, 4.4, 50, NOW()),

-- 5. Laptop Đồ họa (category_id = 9) --
('Laptop Dell Precision 5570', 'DP5570', 45000000.00, 15, 2, 9, 'Máy trạm di động mạnh mẽ cho đồ họa 3D và render video.', 'Core i7, RTX A2000, 32GB RAM.', TRUE, 4.9, 15, NOW()),
('Laptop MSI Creator Z16P', 'MSICZ16P', 52000000.00, 12, 6, 9, 'Thiết kế sang trọng, hiệu năng đồ họa cực đỉnh.', 'Core i9, RTX 3070Ti, Màn 2K.', TRUE, 4.8, 10, NOW()),
('Laptop Asus ProArt StudioBook 16', 'APS16', 38990000.00, 18, 3, 9, 'Màn hình OLED chuẩn màu, tích hợp Dial vật lý độc quyền.', 'Ryzen 9, RTX 3060, Màn OLED.', TRUE, 4.7, 20, NOW()),

-- 6. PC Văn phòng (category_id = 10) --
('PC Dell OptiPlex 3000 SFF', 'DO3000SFF', 11500000.00, 40, 2, 10, 'Thiết kế nhỏ gọn, tiết kiệm không gian, hiệu năng ổn định.', 'Core i5-12th, 8GB RAM, 256GB SSD.', TRUE, 4.3, 35, NOW()),
('PC Lenovo ThinkCentre Neo 50s', 'LTCN50S', 9800000.00, 45, 5, 10, 'Đáng tin cậy, bảo mật cao, phù hợp cho môi trường doanh nghiệp.', 'Core i3-12th, 8GB RAM, 500GB HDD.', TRUE, 4.2, 40, NOW()),
('PC HP ProDesk 400 G9', 'HPPD400G9', 13200000.00, 38, 1, 10, 'Hiệu suất cao, dễ dàng nâng cấp.', 'Core i5-13th, 16GB RAM, 512GB SSD.', TRUE, 4.4, 30, NOW()),

-- 7. PC Gaming (category_id = 11) --
('PC Gaming MSI MAG Codex X5', 'MSICODEX5', 38500000.00, 15, 6, 11, 'Bộ PC Gaming mạnh mẽ, sẵn sàng chiến mọi tựa game.', 'Core i7-13th, RTX 4070, 32GB RAM.', TRUE, 4.6, 25, NOW()),
('PC Gaming Gigabyte AORUS', 'GIGAAORUS', 45000000.00, 10, 7, 11, 'Hiệu năng đỉnh cao, tản nhiệt nước.', 'Core i9-13th, RTX 4080, 64GB RAM.', TRUE, 4.9, 15, NOW()),
('PC Gaming Asus ROG G22', 'ASUSROG22', 32000000.00, 12, 3, 11, 'Thiết kế nhỏ gọn nhưng hiệu năng vượt trội.', 'Core i5-13th, RTX 4060, 16GB RAM.', TRUE, 4.5, 20, NOW()),

-- 8. PC Đồ họa (category_id = 12) --
('PC Workstation HP Z2 G9', 'HPZ2G9', 29000000.00, 15, 1, 12, 'Máy trạm chuyên nghiệp, card đồ họa Quadro cho công việc thiết kế và render.', 'Core i7, Quadro T1000, 32GB RAM.', TRUE, 4.7, 12, NOW()),
('PC Workstation Dell Precision 3660', 'DP3660', 35000000.00, 10, 2, 12, 'Hiệu suất cực cao cho các ứng dụng đồ họa nặng.', 'Core i9, RTX A4000, 64GB RAM.', TRUE, 4.8, 8, NOW()),
('PC Workstation MSI PRO DP21', 'MSIPDP21', 19500000.00, 18, 6, 12, 'Kích thước nhỏ, mạnh mẽ cho thiết kế 2D và 3D cơ bản.', 'Core i5, RTX 3050, 16GB RAM.', TRUE, 4.5, 15, NOW()),

-- 9. Màn hình Gaming (category_id = 13) --
('Màn hình Samsung Odyssey G7 27-inch', 'SSOG727', 12500000.00, 35, 11, 13, 'Màn hình cong 1000R, 240Hz, QHD.', '2K, 240Hz, Cong 1000R.', TRUE, 4.7, 55, NOW()),
('Màn hình BenQ MOBIUZ EX2710U', 'BMOBIUZ2710', 14900000.00, 28, 13, 13, 'Màn hình 4K 144Hz chuyên game, HDRi.', '4K, 144Hz, HDRi.', TRUE, 4.8, 30, NOW()),
('Màn hình ViewSonic XG2431', 'VSXG2431', 6500000.00, 45, 14, 13, 'Màn hình esports 24 inch, 240Hz.', 'FHD, 240Hz, Tốc độ phản hồi cực nhanh.', TRUE, 4.5, 70, NOW()),

-- 10. Màn hình Đồ họa (category_id = 14) --
('Màn hình Samsung ViewFinity S8 27-inch 4K', 'SS274KS8', 9500000.00, 60, 11, 14, 'Màn hình chuyên nghiệp cho đồ họa, 4K sắc nét.', '4K UHD, Tấm nền IPS, Chuyên đồ họa.', TRUE, 4.7, 40, NOW()),
('Màn hình Dell UltraSharp U2723QE', 'DUU2723QE', 11990000.00, 50, 2, 14, 'Độ chuẩn màu cao, USB-C Power Delivery 90W.', '4K, USB-C PD, Màu chuẩn.', TRUE, 4.8, 35, NOW()),
('Màn hình Asus ProArt PA279CV', 'APAP279CV', 8500000.00, 55, 3, 14, 'Màn hình ProArt cho công việc sáng tạo, 100% sRGB.', '4K, 100% sRGB, Calman Verified.', TRUE, 4.6, 45, NOW()),

-- 11. Màn hình Văn phòng (category_id = 15) --
('Màn hình HP P24v G4', 'HPP24VG4', 3200000.00, 80, 1, 15, 'Màn hình phổ thông 24 inch, đáp ứng nhu cầu văn phòng cơ bản.', 'FHD, 75Hz, Thiết kế đơn giản.', TRUE, 4.3, 75, NOW()),
('Màn hình Dell E2423H', 'DE2423H', 2800000.00, 90, 2, 15, 'Độ bền cao, hình ảnh rõ nét cho công việc.', 'FHD, 60Hz, Độ tin cậy cao.', TRUE, 4.1, 95, NOW()),
('Màn hình LG 27MP400', 'LG27MP400', 4500000.00, 70, 7, 15, 'Màn hình 27 inch lớn, tấm nền IPS góc nhìn rộng.', 'FHD, IPS, 27 inch.', TRUE, 4.4, 60, NOW()),

-- 12. Màn hình Lập trình (category_id = 16) --
('Màn hình Dell UltraSharp U2724D', 'DUU2724D', 8900000.00, 40, 2, 16, 'Màn hình QHD, chức năng xoay dọc (Pivot) lý tưởng cho code.', 'QHD, Xoay Pivot, USB-C.', TRUE, 4.7, 30, NOW()),
('Màn hình BenQ PD2705U', 'BPD2705U', 11500000.00, 35, 13, 16, 'Chế độ Darkroom và CAD/CAM, chuyên biệt cho lập trình và kỹ thuật.', '4K, Chế độ Code, KVM Switch.', TRUE, 4.8, 25, NOW()),
('Màn hình ViewSonic VP2768a', 'VSVP2768A', 7500000.00, 42, 14, 16, 'Độ chính xác màu cao, viền mỏng, hỗ trợ đa màn hình.', 'QHD, Viền mỏng, Ergonomic.', TRUE, 4.6, 33, NOW()),

-- 13. Màn hình Di động (category_id = 17) --
('Màn hình Di động Asus ZenScreen MB16AH', 'AZMB16AH', 5990000.00, 30, 3, 17, 'Màn hình di động 15.6 inch, kết nối USB-C và HDMI.', '15.6 inch, USB-C/HDMI, Siêu mỏng.', TRUE, 4.5, 22, NOW()),
('Màn hình Di động Lenovo ThinkVision M14', 'LTM14', 6800000.00, 25, 5, 17, 'Siêu nhẹ, thiết kế chân đứng linh hoạt, phù hợp cho công việc di chuyển.', '14 inch, Siêu nhẹ, Chân đứng.', TRUE, 4.6, 20, NOW()),
('Màn hình Di động Samsung ViewFinity M8', 'SSM8', 16900000.00, 18, 11, 17, 'Màn hình thông minh di động, tích hợp Smart TV và webcam SlimFit.', '32 inch, Smart Monitor, Di động.', TRUE, 4.7, 15, NOW()),

-- 14. Chuột (category_id = 18) --
('Chuột Gaming Logitech G Pro X Superlight', 'LGPROXSL', 2990000.00, 100, 9, 18, 'Chuột không dây siêu nhẹ, dành cho game thủ.', 'Không dây, Siêu nhẹ (63g), Sensor HERO.', TRUE, 4.9, 150, NOW()),
('Chuột Razer Viper V2 Pro', 'RVIPERV2PRO', 3200000.00, 90, 10, 18, 'Chuột không dây cực nhẹ, tốc độ phản hồi cực nhanh.', 'Không dây, 58g, Sensor Focus Pro 30K.', TRUE, 4.8, 110, NOW()),
('Chuột Không dây Logitech MX Master 3S', 'LMM3S', 2690000.00, 80, 9, 18, 'Chuột làm việc cao cấp, thiết kế công thái học.', 'Công thái học, Silent Clicks, 8K DPI.', TRUE, 4.7, 95, NOW()),

-- 15. Bàn phím (category_id = 19) --
('Bàn phím Cơ Logitech G Pro X TKL', 'LGPROXTKL', 3500000.00, 60, 9, 19, 'Bàn phím cơ Tenkeyless, Switch có thể thay nóng, dành cho Esports.', 'TKL, Switch có thể thay nóng, RGB.', TRUE, 4.8, 70, NOW()),
('Bàn phím Cơ Razer BlackWidow V3 Pro', 'RBWV3PRO', 4200000.00, 55, 10, 19, 'Bàn phím cơ không dây fullsize, Switch Green/Yellow.', 'Không dây, Fullsize, Razer Chroma RGB.', TRUE, 4.7, 65, NOW()),
('Bàn phím Cơ Asus ROG Azoth', 'AROGAZOTH', 5500000.00, 40, 3, 19, 'Bàn phím cơ 75%, màn hình OLED, gasket mount.', '75%, OLED, Gasket Mount.', TRUE, 4.9, 50, NOW()),

-- 16. Tai nghe (category_id = 20) --
('Tai nghe Gaming HyperX Cloud Alpha', 'HXCA', 1990000.00, 80, 7, 20, 'Tai nghe Gaming Driver Buồng đôi, âm thanh chi tiết.', 'Driver buồng đôi, Thoải mái, Mic khử ồn.', TRUE, 4.6, 120, NOW()),
('Tai nghe Không dây Sony WH-1000XM5', 'SW1000XM5', 7500000.00, 50, 11, 20, 'Tai nghe chống ồn hàng đầu, chất lượng âm thanh Hi-Res.', 'Chống ồn, Hi-Res, Pin 30h.', TRUE, 4.8, 85, NOW()),
('Tai nghe Gaming Razer BlackShark V2 Pro', 'RBV2PRO', 3990000.00, 65, 10, 20, 'Tai nghe không dây cho game thủ Esports, âm thanh vòm THX 7.1.', 'Không dây, THX Spatial Audio, Mic rõ ràng.', TRUE, 4.7, 90, NOW()),

-- 17. Card đồ họa (category_id = 21) --
('Card màn hình MSI RTX 4070 Ti VENTUS 3X', 'MSRTX4070TI', 22500000.00, 30, 6, 21, 'Card đồ họa hiệu năng cao cho Gaming 2K/4K và công việc đồ họa.', 'RTX 4070 Ti, 12GB GDDR6X, 3 Fan.', TRUE, 4.6, 20, NOW()),
('Card màn hình Asus ROG Strix RTX 4080', 'AROSRTX4080', 35000000.00, 25, 3, 21, 'Card đồ họa cao cấp, tản nhiệt ROG Strix hiệu quả.', 'RTX 4080, 16GB GDDR6X, ROG Strix.', TRUE, 4.8, 15, NOW()),
('Card màn hình Gigabyte RTX 4060 EAGLE OC', 'GRTX4060E', 9500000.00, 45, 7, 21, 'Hiệu năng tốt trong tầm giá, phù hợp cho Gaming FHD/2K.', 'RTX 4060, 8GB GDDR6, 2 Fan.', TRUE, 4.5, 30, NOW()),

-- 18. RAM (category_id = 22) --
('RAM Corsair Vengeance RGB Pro 16GB (2x8GB) DDR4 3200MHz', 'CVRP3200', 1800000.00, 150, 4, 22, 'RAM hiệu năng cao, tản nhiệt đẹp và LED RGB.', 'DDR4, 16GB (2x8GB), 3200MHz, RGB.', TRUE, 4.7, 180, NOW()),
('RAM Kingston Fury Beast RGB 32GB (2x16GB) DDR5 6000MHz', 'KFBRGB6000', 3500000.00, 120, 5, 22, 'RAM DDR5 tốc độ cao, lý tưởng cho các hệ thống mới.', 'DDR5, 32GB (2x16GB), 6000MHz, RGB.', TRUE, 4.8, 100, NOW()),
('RAM G.Skill Trident Z5 RGB 64GB (2x32GB) DDR5 6400MHz', 'GSTRZ56400', 6500000.00, 80, 7, 22, 'RAM hiệu năng cực đỉnh, dung lượng lớn cho đồ họa và gaming cao cấp.', 'DDR5, 64GB (2x32GB), 6400MHz, RGB.', TRUE, 4.9, 70, NOW());

INSERT INTO productDetails (product_id, CPU, GPU, RAM, Storage, Display, Battery, Weight, OS) VALUES
-- Laptop Văn phòng (1-3) --
(1, 'Intel Core i5-1235U', 'Intel Iris Xe', '8GB DDR4', '512GB SSD NVMe', '15.6 inch FHD', '41 Wh', '1.7 kg', 'Windows 11 Home'),
(2, 'Intel Core i3-1215U', 'Intel UHD Graphics', '8GB DDR4', '256GB SSD NVMe', '15.6 inch FHD', '41 Wh', '1.69 kg', 'Windows 11 Home'),
(3, 'Intel Core i5-1335U', 'NVIDIA GeForce MX550', '16GB DDR4', '512GB SSD NVMe', '15.6 inch FHD', '50 Wh', '1.78 kg', 'Windows 11 Home'),

-- Laptop Gaming (4-6) --
(4, 'AMD Ryzen 7 6800H', 'NVIDIA GeForce RTX 3050Ti 4GB', '16GB DDR5', '512GB SSD NVMe', '15.6 inch FHD 144Hz', '56 Wh', '2.3 kg', 'Windows 11 Home'),
(5, 'Intel Core i7-12700H', 'NVIDIA GeForce RTX 3060 6GB', '16GB DDR4', '1TB SSD NVMe', '15.6 inch FHD 144Hz', '53.5 Wh', '2.25 kg', 'Windows 11 Home'),
(6, 'Intel Core i9-12900H', 'NVIDIA GeForce RTX 3070 8GB', '32GB DDR5', '1TB SSD NVMe', '15.6 inch QHD 240Hz', '86 Wh', '2.65 kg', 'Windows 11 Pro'),

-- Laptop Mỏng nhẹ (7-9) --
(7, 'Apple M2 chip', '8-core GPU', '8GB Unified Memory', '256GB SSD', '13.6 inch Liquid Retina', '52.6 Wh', '1.24 kg', 'macOS'),
(8, 'Intel Core i7-1250U', 'Intel Iris Xe', '16GB LPDDR5', '512GB SSD NVMe', '13.4 inch 3.5K OLED', '55 Wh', '1.2 kg', 'Windows 11 Home'),
(9, 'AMD Ryzen 7 6800U', 'AMD Radeon Graphics', '16GB LPDDR5', '1TB SSD NVMe', '13.3 inch 2.8K OLED', '63.4 Wh', '0.97 kg', 'Windows 11 Home'),

-- Laptop Học sinh - sinh viên (10-12) --
(10, 'Intel Core i5-1240P', 'Intel Iris Xe', '8GB DDR4', '512GB SSD NVMe', '14.0 inch FHD', '54 Wh', '1.25 kg', 'Windows 11 Home'),
(11, 'AMD Ryzen 3 7320U', 'AMD Radeon 610M', '4GB LPDDR5', '256GB SSD NVMe', '15.6 inch FHD', '42 Wh', '1.6 kg', 'Windows 11 Home'),
(12, 'Intel Core i3-1215U', 'Intel UHD Graphics', '8GB DDR4', '512GB SSD NVMe', '14.0 inch FHD', '41 Wh', '1.47 kg', 'Windows 11 Home'),

-- Laptop Đồ họa (13-15) --
(13, 'Intel Core i7-12800H', 'NVIDIA RTX A2000 8GB', '32GB DDR5', '1TB SSD NVMe', '15.6 inch OLED 4K', '86 Wh', '1.8 kg', 'Windows 11 Pro'),
(14, 'Intel Core i9-12900H', 'NVIDIA RTX 3070Ti 8GB', '32GB DDR5', '1TB SSD NVMe', '16.0 inch QHD+', '90 Wh', '2.3 kg', 'Windows 11 Pro'),
(15, 'AMD Ryzen 9 6900HX', 'NVIDIA RTX 3060 6GB', '16GB DDR5', '1TB SSD NVMe', '16.0 inch 4K OLED', '90 Wh', '2.4 kg', 'Windows 11 Home'),

-- PC Văn phòng (16-18) --
(16, 'Intel Core i5-12500', 'Intel UHD Graphics 770', '8GB DDR4', '256GB SSD NVMe', 'N/A', 'N/A', '5.0 kg', 'Windows 11 Pro'),
(17, 'Intel Core i3-12100', 'Intel UHD Graphics 730', '8GB DDR4', '500GB HDD', 'N/A', 'N/A', '4.5 kg', 'Windows 11 Home'),
(18, 'Intel Core i5-13400', 'Intel UHD Graphics 730', '16GB DDR4', '512GB SSD NVMe', 'N/A', 'N/A', '6.0 kg', 'Windows 11 Pro'),

-- PC Gaming (19-21) --
(19, 'Intel Core i7-13700KF', 'NVIDIA GeForce RTX 4070 12GB', '32GB DDR5', '1TB SSD + 2TB HDD', 'N/A', 'N/A', '10 kg', 'Windows 11 Home'),
(20, 'Intel Core i9-13900K', 'NVIDIA GeForce RTX 4080 16GB', '64GB DDR5', '2TB SSD NVMe', 'N/A', 'N/A', '15 kg', 'Windows 11 Pro'),
(21, 'Intel Core i5-13400F', 'NVIDIA GeForce RTX 4060 8GB', '16GB DDR4', '512GB SSD NVMe', 'N/A', 'N/A', '6 kg', 'Windows 11 Home'),

-- PC Đồ họa (22-24) --
(22, 'Intel Core i7-12700K', 'NVIDIA Quadro T1000 8GB', '32GB DDR5', '1TB SSD NVMe', 'N/A', 'N/A', '12 kg', 'Windows 11 Pro'),
(23, 'Intel Core i9-13900K', 'NVIDIA RTX A4000 16GB', '64GB DDR5', '2TB SSD NVMe', 'N/A', 'N/A', '18 kg', 'Windows 11 Pro'),
(24, 'Intel Core i5-12400', 'NVIDIA RTX 3050 8GB', '16GB DDR4', '512GB SSD NVMe', 'N/A', 'N/A', '7 kg', 'Windows 11 Home'),

-- Màn hình Gaming (25-27) --
(25, 'N/A', 'N/A', 'N/A', 'N/A', '27 inch QHD Cong 1000R, 240Hz', 'N/A', '7.4 kg', 'N/A'),
(26, 'N/A', 'N/A', 'N/A', 'N/A', '27 inch 4K UHD IPS, 144Hz', 'N/A', '8.0 kg', 'N/A'),
(27, 'N/A', 'N/A', 'N/A', 'N/A', '24 inch FHD IPS, 240Hz', 'N/A', '5.2 kg', 'N/A'),

-- Màn hình Đồ họa (28-30) --
(28, 'N/A', 'N/A', 'N/A', 'N/A', '27 inch 4K UHD IPS, 60Hz', 'N/A', '6.7 kg', 'N/A'),
(29, 'N/A', 'N/A', 'N/A', 'N/A', '27 inch 4K UHD IPS, USB-C PD 90W', 'N/A', '6.6 kg', 'N/A'),
(30, 'N/A', 'N/A', 'N/A', 'N/A', '27 inch 4K UHD IPS, Calman Verified', 'N/A', '7.2 kg', 'N/A'),

-- Màn hình Văn phòng (31-33) --
(31, 'N/A', 'N/A', 'N/A', 'N/A', '24 inch FHD IPS, 75Hz', 'N/A', '4.5 kg', 'N/A'),
(32, 'N/A', 'N/A', 'N/A', 'N/A', '24 inch FHD VA, 60Hz', 'N/A', '4.2 kg', 'N/A'),
(33, 'N/A', 'N/A', 'N/A', 'N/A', '27 inch FHD IPS, 75Hz', 'N/A', '5.5 kg', 'N/A'),

-- Màn hình Lập trình (34-36) --
(34, 'N/A', 'N/A', 'N/A', 'N/A', '27 inch QHD IPS, Pivot, USB-C', 'N/A', '7.0 kg', 'N/A'),
(35, 'N/A', 'N/A', 'N/A', 'N/A', '27 inch 4K UHD IPS, Chế độ Darkroom', 'N/A', '8.5 kg', 'N/A'),
(36, 'N/A', 'N/A', 'N/A', 'N/A', '27 inch QHD IPS, Viền mỏng, Pivot', 'N/A', '6.9 kg', 'N/A'),

-- Màn hình Di động (37-39) --
(37, 'N/A', 'N/A', 'N/A', 'N/A', '15.6 inch FHD IPS, USB-C/HDMI', 'N/A', '0.78 kg', 'N/A'),
(38, 'N/A', 'N/A', 'N/A', 'N/A', '14 inch FHD IPS, USB-C', 'N/A', '0.57 kg', 'N/A'),
(39, 'N/A', 'N/A', 'N/A', 'N/A', '32 inch 4K Smart Monitor, Di động', 'N/A', '6.5 kg', 'N/A'),

-- Chuột (40-42) --
(40, 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', '63 g', 'N/A'),
(41, 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', '58 g', 'N/A'),
(42, 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', '141 g', 'N/A'),

-- Bàn phím (43-45) --
(43, 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', '0.96 kg', 'N/A'),
(44, 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', '1.42 kg', 'N/A'),
(45, 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', '1.18 kg', 'N/A'),

-- Tai nghe (46-48) --
(46, 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', '0.34 kg', 'N/A'),
(47, 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', '0.25 kg', 'N/A'),
(48, 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', '0.32 kg', 'N/A'),

-- Card đồ họa (49-51) --
(49, 'N/A', 'N/A', '12GB GDDR6X', 'N/A', 'N/A', 'N/A', '1.5 kg', 'N/A'),
(50, 'N/A', 'N/A', '16GB GDDR6X', 'N/A', 'N/A', 'N/A', '2.0 kg', 'N/A'),
(51, 'N/A', 'N/A', '8GB GDDR6', 'N/A', 'N/A', 'N/A', '1.0 kg', 'N/A'),

-- RAM (52-54) --
(52, 'N/A', 'N/A', '16GB (2x8GB) DDR4', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'),
(53, 'N/A', 'N/A', '32GB (2x16GB) DDR5', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'),
(54, 'N/A', 'N/A', '64GB (2x32GB) DDR5', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A');

INSERT INTO productImages (product_id, url, is_main) VALUES
-- LAPTOP (category_id 5-9, product_id 1-15) --
-- 1. Laptop Văn phòng (id 1-3)
(1, 'https://product.hstatic.net/200000722513/product/ava_77563131fc2b48acb9a41ec545d9ed7d_master.png', TRUE),
(2, 'https://product.hstatic.net/200000722513/product/ava_77563131fc2b48acb9a41ec545d9ed7d_master.png', TRUE),
(3, 'https://product.hstatic.net/200000722513/product/ava_77563131fc2b48acb9a41ec545d9ed7d_master.png', TRUE),
-- 2. Laptop Gaming (id 4-6)
(4, 'https://product.hstatic.net/200000722513/product/ava_77563131fc2b48acb9a41ec545d9ed7d_master.png', TRUE),
(5, 'https://product.hstatic.net/200000722513/product/ava_77563131fc2b48acb9a41ec545d9ed7d_master.png', TRUE),
(6, 'https://product.hstatic.net/200000722513/product/ava_77563131fc2b48acb9a41ec545d9ed7d_master.png', TRUE),
-- 3. Laptop Mỏng nhẹ (id 7-9)
(7, 'https://product.hstatic.net/200000722513/product/ava_77563131fc2b48acb9a41ec545d9ed7d_master.png', TRUE),
(8, 'https://product.hstatic.net/200000722513/product/ava_77563131fc2b48acb9a41ec545d9ed7d_master.png', TRUE),
(9, 'https://product.hstatic.net/200000722513/product/ava_77563131fc2b48acb9a41ec545d9ed7d_master.png', TRUE),
-- 4. Laptop Học sinh - sinh viên (id 10-12)
(10, 'https://product.hstatic.net/200000722513/product/ava_77563131fc2b48acb9a41ec545d9ed7d_master.png', TRUE),
(11, 'https://product.hstatic.net/200000722513/product/ava_77563131fc2b48acb9a41ec545d9ed7d_master.png', TRUE),
(12, 'https://product.hstatic.net/200000722513/product/ava_77563131fc2b48acb9a41ec545d9ed7d_master.png', TRUE),
-- 5. Laptop Đồ họa (id 13-15)
(13, 'https://product.hstatic.net/200000722513/product/ava_77563131fc2b48acb9a41ec545d9ed7d_master.png', TRUE),
(14, 'https://product.hstatic.net/200000722513/product/ava_77563131fc2b48acb9a41ec545d9ed7d_master.png', TRUE),
(15, 'https://product.hstatic.net/200000722513/product/ava_77563131fc2b48acb9a41ec545d9ed7d_master.png', TRUE),

-- PC (category_id 10-12, product_id 16-24) --
-- 6. PC Văn phòng (id 16-18)
(16, 'https://cdn.hstatic.net/products/200000722513/pc_gvn_coolermaster_nen_trang_web_7_c77222a9c8d84675b9620540ddf23484_master.jpg', TRUE),
(17, 'https://cdn.hstatic.net/products/200000722513/pc_gvn_coolermaster_nen_trang_web_7_c77222a9c8d84675b9620540ddf23484_master.jpg', TRUE),
(18, 'https://cdn.hstatic.net/products/200000722513/pc_gvn_coolermaster_nen_trang_web_7_c77222a9c8d84675b9620540ddf23484_master.jpg', TRUE),
-- 7. PC Gaming (id 19-21)
(19, 'https://cdn.hstatic.net/products/200000722513/pc_gvn_coolermaster_nen_trang_web_7_c77222a9c8d84675b9620540ddf23484_master.jpg', TRUE),
(20, 'https://cdn.hstatic.net/products/200000722513/pc_gvn_coolermaster_nen_trang_web_7_c77222a9c8d84675b9620540ddf23484_master.jpg', TRUE),
(21, 'https://cdn.hstatic.net/products/200000722513/pc_gvn_coolermaster_nen_trang_web_7_c77222a9c8d84675b9620540ddf23484_master.jpg', TRUE),
-- 8. PC Đồ họa (id 22-24)
(22, 'https://cdn.hstatic.net/products/200000722513/pc_gvn_coolermaster_nen_trang_web_7_c77222a9c8d84675b9620540ddf23484_master.jpg', TRUE),
(23, 'https://cdn.hstatic.net/products/200000722513/pc_gvn_coolermaster_nen_trang_web_7_c77222a9c8d84675b9620540ddf23484_master.jpg', TRUE),
(24, 'https://cdn.hstatic.net/products/200000722513/pc_gvn_coolermaster_nen_trang_web_7_c77222a9c8d84675b9620540ddf23484_master.jpg', TRUE),

-- MÀN HÌNH (category_id 13-17, product_id 25-39) --
-- 9. Màn hình Gaming (id 25-27)
(25, 'https://product.hstatic.net/200000722513/product/-4kp-28inch-ips-4k-150hz-hdr10-usbc-1_a1b9884e45a74248938d6d5f8ef446d5_3b525a832e714ad187a32425edc9cede_master.jpg', TRUE),
(26, 'https://product.hstatic.net/200000722513/product/-4kp-28inch-ips-4k-150hz-hdr10-usbc-1_a1b9884e45a74248938d6d5f8ef446d5_3b525a832e714ad187a32425edc9cede_master.jpg', TRUE),
(27, 'https://product.hstatic.net/200000722513/product/-4kp-28inch-ips-4k-150hz-hdr10-usbc-1_a1b9884e45a74248938d6d5f8ef446d5_3b525a832e714ad187a32425edc9cede_master.jpg', TRUE),
-- 10. Màn hình Đồ họa (id 28-30)
(28, 'https://product.hstatic.net/200000722513/product/-4kp-28inch-ips-4k-150hz-hdr10-usbc-1_a1b9884e45a74248938d6d5f8ef446d5_3b525a832e714ad187a32425edc9cede_master.jpg', TRUE),
(29, 'https://product.hstatic.net/200000722513/product/-4kp-28inch-ips-4k-150hz-hdr10-usbc-1_a1b9884e45a74248938d6d5f8ef446d5_3b525a832e714ad187a32425edc9cede_master.jpg', TRUE),
(30, 'https://product.hstatic.net/200000722513/product/-4kp-28inch-ips-4k-150hz-hdr10-usbc-1_a1b9884e45a74248938d6d5f8ef446d5_3b525a832e714ad187a32425edc9cede_master.jpg', TRUE),
-- 11. Màn hình Văn phòng (id 31-33)
(31, 'https://product.hstatic.net/200000722513/product/-4kp-28inch-ips-4k-150hz-hdr10-usbc-1_a1b9884e45a74248938d6d5f8ef446d5_3b525a832e714ad187a32425edc9cede_master.jpg', TRUE),
(32, 'https://product.hstatic.net/200000722513/product/-4kp-28inch-ips-4k-150hz-hdr10-usbc-1_a1b9884e45a74248938d6d5f8ef446d5_3b525a832e714ad187a32425edc9cede_master.jpg', TRUE),
(33, 'https://product.hstatic.net/200000722513/product/-4kp-28inch-ips-4k-150hz-hdr10-usbc-1_a1b9884e45a74248938d6d5f8ef446d5_3b525a832e714ad187a32425edc9cede_master.jpg', TRUE),
-- 12. Màn hình Lập trình (id 34-36)
(34, 'https://product.hstatic.net/200000722513/product/-4kp-28inch-ips-4k-150hz-hdr10-usbc-1_a1b9884e45a74248938d6d5f8ef446d5_3b525a832e714ad187a32425edc9cede_master.jpg', TRUE),
(35, 'https://product.hstatic.net/200000722513/product/-4kp-28inch-ips-4k-150hz-hdr10-usbc-1_a1b9884e45a74248938d6d5f8ef446d5_3b525a832e714ad187a32425edc9cede_master.jpg', TRUE),
(36, 'https://product.hstatic.net/200000722513/product/-4kp-28inch-ips-4k-150hz-hdr10-usbc-1_a1b9884e45a74248938d6d5f8ef446d5_3b525a832e714ad187a32425edc9cede_master.jpg', TRUE),
-- 13. Màn hình Di động (id 37-39)
(37, 'https://product.hstatic.net/200000722513/product/-4kp-28inch-ips-4k-150hz-hdr10-usbc-1_a1b9884e45a74248938d6d5f8ef446d5_3b525a832e714ad187a32425edc9cede_master.jpg', TRUE),
(38, 'https://product.hstatic.net/200000722513/product/-4kp-28inch-ips-4k-150hz-hdr10-usbc-1_a1b9884e45a74248938d6d5f8ef446d5_3b525a832e714ad187a32425edc9cede_master.jpg', TRUE),
(39, 'https://product.hstatic.net/200000722513/product/-4kp-28inch-ips-4k-150hz-hdr10-usbc-1_a1b9884e45a74248938d6d5f8ef446d5_3b525a832e714ad187a32425edc9cede_master.jpg', TRUE),

-- PHỤ KIỆN (category_id 18-22, product_id 40-54) --
-- 14. Chuột (id 40-42)
(40, 'https://cdn2.cellphones.com.vn/x,webp,q100/media/wysiwyg/linh-kien-may-tinh/linh-kien-may-tinh-1.jpg', TRUE),
(41, 'https://cdn2.cellphones.com.vn/x,webp,q100/media/wysiwyg/linh-kien-may-tinh/linh-kien-may-tinh-1.jpg', TRUE),
(42, 'https://cdn2.cellphones.com.vn/x,webp,q100/media/wysiwyg/linh-kien-may-tinh/linh-kien-may-tinh-1.jpg', TRUE),
-- 15. Bàn phím (id 43-45)
(43, 'https://cdn2.cellphones.com.vn/x,webp,q100/media/wysiwyg/linh-kien-may-tinh/linh-kien-may-tinh-1.jpg', TRUE),
(44, 'https://cdn2.cellphones.com.vn/x,webp,q100/media/wysiwyg/linh-kien-may-tinh/linh-kien-may-tinh-1.jpg', TRUE),
(45, 'https://cdn2.cellphones.com.vn/x,webp,q100/media/wysiwyg/linh-kien-may-tinh/linh-kien-may-tinh-1.jpg', TRUE),
-- 16. Tai nghe (id 46-48)
(46, 'https://cdn2.cellphones.com.vn/x,webp,q100/media/wysiwyg/linh-kien-may-tinh/linh-kien-may-tinh-1.jpg', TRUE),
(47, 'https://cdn2.cellphones.com.vn/x,webp,q100/media/wysiwyg/linh-kien-may-tinh/linh-kien-may-tinh-1.jpg', TRUE),
(48, 'https://cdn2.cellphones.com.vn/x,webp,q100/media/wysiwyg/linh-kien-may-tinh/linh-kien-may-tinh-1.jpg', TRUE),
-- 17. Card đồ họa (id 49-51)
(49, 'https://cdn2.cellphones.com.vn/x,webp,q100/media/wysiwyg/linh-kien-may-tinh/linh-kien-may-tinh-1.jpg', TRUE),
(50, 'https://cdn2.cellphones.com.vn/x,webp,q100/media/wysiwyg/linh-kien-may-tinh/linh-kien-may-tinh-1.jpg', TRUE),
(51, 'https://cdn2.cellphones.com.vn/x,webp,q100/media/wysiwyg/linh-kien-may-tinh/linh-kien-may-tinh-1.jpg', TRUE),
-- 18. RAM (id 52-54)
(52, 'https://cdn2.cellphones.com.vn/x,webp,q100/media/wysiwyg/linh-kien-may-tinh/linh-kien-may-tinh-1.jpg', TRUE),
(53, 'https://cdn2.cellphones.com.vn/x,webp,q100/media/wysiwyg/linh-kien-may-tinh/linh-kien-may-tinh-1.jpg', TRUE),
(54, 'https://cdn2.cellphones.com.vn/x,webp,q100/media/wysiwyg/linh-kien-may-tinh/linh-kien-may-tinh-1.jpg', TRUE);