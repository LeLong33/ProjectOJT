# LUỒNG ĐIỀU HƯỚNG WEBSITE BÁN MÁY TÍNH

## CÁC TRANG TRONG HỆ THỐNG

1. **Trang chủ** (`home`)
2. **Danh sách sản phẩm** (`list`)
3. **Chi tiết sản phẩm** (`detail`)
4. **Giỏ hàng** (`cart`)
5. **Thanh toán** (`checkout`)
6. **Xác nhận đơn hàng** (`order-confirmation`)
7. **Tài khoản người dùng** (`account`)
8. **Đăng nhập** (`login`)
9. **Admin** (`admin`)

---

## LUỒNG CHÍNH

### 1. LUỒNG MUA HÀNG CƠ BẢN (Chưa đăng nhập)
```
Trang chủ → Danh sách sản phẩm → Chi tiết sản phẩm → Giỏ hàng → Thanh toán → Xác nhận đơn hàng
```

#### Chi tiết:
- **Trang chủ**: Click vào danh mục (Laptop, Màn Hình, PC, Phụ Kiện)
- **Danh sách sản phẩm**: Click "Chi tiết" hoặc "Thêm vào giỏ"
- **Chi tiết sản phẩm**: Click "Thêm vào giỏ" hoặc "Mua ngay"
- **Giỏ hàng**: Click "Tiến hành thanh toán"
- **Thanh toán**: Điền thông tin → Click "Đặt hàng"
- **Xác nhận đơn hàng**: Click "Xem đơn hàng" hoặc "Tiếp tục mua sắm"

### 2. LUỒNG MUA HÀNG (Đã đăng nhập)
```
Đăng nhập → Trang chủ → Danh sách sản phẩm → Chi tiết sản phẩm → Giỏ hàng → Thanh toán (tự động điền địa chỉ) → Xác nhận đơn hàng
```

---

## CÁC NÚT ĐIỀU HƯỚNG

### Thanh điều hướng (Navbar) - Có trên tất cả các trang
| Nút/Link | Chức năng |
|----------|-----------|
| **Logo TechStore** | Về trang chủ |
| **Danh Mục** (hover) | Hiện menu 2 cấp → Click vào danh mục → Trang danh sách sản phẩm |
| **Icon Giỏ hàng** | → Trang giỏ hàng |
| **Icon User** | → Trang đăng nhập (nếu chưa login) hoặc Trang tài khoản (đã login) |

### Trang chủ
| Nút/Link | Điều hướng đến |
|----------|----------------|
| **Danh mục (4 cards)** | → Trang danh sách sản phẩm (theo danh mục) |
| **Flash Sale - Sản phẩm** | Hover → Mũi tên trái/phải để xem thêm |
| **Flash Sale - Thêm vào giỏ** | → Thêm vào giỏ hàng (cart count +1) |
| **Sản phẩm - Chi tiết** | → Trang chi tiết sản phẩm |
| **Sản phẩm - Thêm vào giỏ** | → Thêm vào giỏ hàng (cart count +1) |

### Trang danh sách sản phẩm
| Nút/Link | Điều hướng đến |
|----------|----------------|
| **← Quay lại** (Breadcrumb) | → Trang chủ |
| **Sidebar Filter** | Lọc sản phẩm theo: Thương hiệu, Giá, CPU, RAM, Ổ cứng, Màu sắc |
| **Chi tiết** | → Trang chi tiết sản phẩm |
| **Giỏ hàng** | → Thêm vào giỏ hàng (cart count +1) |
| **Pagination** | Chuyển trang |

### Trang chi tiết sản phẩm
| Nút/Link | Điều hướng đến |
|----------|----------------|
| **← Quay lại danh sách** | → Trang danh sách sản phẩm |
| **Thumbnail ảnh** | Đổi ảnh hiển thị chính |
| **Mũi tên trái/phải** | Xem ảnh khác |
| **Thêm vào giỏ** | → Thêm vào giỏ hàng (cart count +1) |
| **Mua ngay** | → Trang thanh toán |
| **Tabs (Mô tả/Specs/Đánh giá)** | Đổi nội dung hiển thị |
| **Sản phẩm tương tự** | → Trang chi tiết sản phẩm khác |

### Trang giỏ hàng
| Nút/Link | Điều hướng đến |
|----------|----------------|
| **Xóa sản phẩm (icon thùng rác)** | Xóa sản phẩm khỏi giỏ |
| **+/- Số lượng** | Tăng/giảm số lượng |
| **Tiến hành thanh toán** | → Trang thanh toán |
| **Tiếp tục mua sắm** | → Trang chủ |

### Trang thanh toán (Multi-step: 4 bước)
| Bước | Nút | Điều hướng |
|------|-----|-----------|
| **1. Thông tin giao hàng** | Đăng nhập (link) | → Trang đăng nhập |
| | Tiếp tục | → Bước 2 |
| **2. Vận chuyển** | Quay lại | → Bước 1 |
| | Tiếp tục | → Bước 3 |
| **3. Thanh toán** | Quay lại | → Bước 2 |
| | Tiếp tục | → Bước 4 |
| **4. Xác nhận** | Quay lại | → Bước 3 |
| | Đặt hàng | → Trang xác nhận đơn hàng |

**Phương thức thanh toán:**
- COD (Thanh toán khi nhận hàng)
- Thẻ tín dụng/ghi nợ
- Ví MoMo
- Chuyển khoản ngân hàng

### Trang xác nhận đơn hàng
| Nút/Link | Điều hướng đến |
|----------|----------------|
| **Tải hóa đơn** | Download hóa đơn PDF |
| **Xem đơn hàng** | → Trang tài khoản (tab Đơn hàng) |
| **Tiếp tục mua sắm** | → Trang chủ |

### Trang tài khoản (7 tabs)
| Tab | Chức năng chính |
|-----|-----------------|
| **1. Thông tin cá nhân** | Cập nhật thông tin |
| **2. Đơn hàng** | Xem lịch sử, tracking, tải hóa đơn |
| **3. Địa chỉ** | Quản lý địa chỉ giao hàng |
| **4. Thanh toán** | Quản lý thẻ thanh toán |
| **5. Yêu thích** | Xem wishlist, thêm vào giỏ |
| **6. Bảo hành** | Yêu cầu bảo hành sản phẩm |
| **7. Cài đặt** | Đổi mật khẩu, xóa tài khoản |

### Trang đăng nhập/Đăng ký
| Nút/Link | Điều hướng đến |
|----------|----------------|
| **Tab Đăng nhập/Đăng ký** | Chuyển đổi form |
| **Đăng nhập** | → Trang chủ (isLoggedIn = true) |
| **Đăng ký** | → Trang chủ (isLoggedIn = true) |
| **Google/Facebook** | Social login → Trang chủ |
| **Quay về trang chủ** | → Trang chủ |

### Trang Admin
| Tab | Chức năng |
|-----|-----------|
| **Dashboard** | Thống kê doanh thu, đơn hàng |
| **Sản phẩm** | CRUD sản phẩm |
| **Đơn hàng** | Quản lý đơn hàng |
| **Khách hàng** | Quản lý khách hàng |
| **Mã giảm giá** | Tạo/quản lý coupon |
| **Nội dung** | Quản lý blog/content |
| **Về trang chủ** (header) | → Trang chủ |

---

## TRẠNG THÁI CART COUNT

- **Khởi tạo**: 2 (mặc định có 2 sản phẩm demo)
- **Khi thêm sản phẩm**: cart count +1
- **Khi xóa sản phẩm**: cart count -1
- **Sau khi đặt hàng**: cart count = 0

---

## TESTING FLOW

### Test 1: Mua hàng cơ bản
1. Mở trang chủ
2. Click vào "Laptop" (ở CategoryGrid)
3. Click "Chi tiết" ở sản phẩm đầu tiên
4. Click "Thêm vào giỏ"
5. Click icon giỏ hàng (Navbar)
6. Click "Tiến hành thanh toán"
7. Điền thông tin → Click "Tiếp tục" 3 lần
8. Check "Đồng ý điều khoản" → Click "Đặt hàng"
9. Kiểm tra trang xác nhận đơn hàng

### Test 2: Flow đăng nhập
1. Click icon User (Navbar)
2. Nhập email/password → Click "Đăng nhập"
3. Quay về trang chủ (đã đăng nhập)
4. Click icon User → Vào trang tài khoản

### Test 3: Filter sản phẩm
1. Vào trang danh sách sản phẩm
2. Chọn filter (Brand, Price, CPU, RAM)
3. Kiểm tra sản phẩm được lọc
4. Click "Xóa tất cả" → Reset filter

### Test 4: Flash Sale carousel
1. Ở trang chủ, di chuột vào khu vực Flash Sale
2. Click mũi tên phải/trái
3. Scroll ngang để xem thêm sản phẩm

---

## GHI CHÚ QUAN TRỌNG

✅ **Navbar xuất hiện trên TẤT CẢ các trang** (trừ Login)
✅ **Footer xuất hiện trên TẤT CẢ các trang** (trừ Login, Admin)
✅ **Cart count được đồng bộ trên tất cả các trang**
✅ **Scroll về đầu trang khi chuyển trang**
✅ **isLoggedIn xác định hiển thị Login hay Account**
