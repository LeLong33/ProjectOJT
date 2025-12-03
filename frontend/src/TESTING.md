# HƯỚNG DẪN KIỂM TRA WEBSITE

## THANH ĐIỀU HƯỚNG DEV (Development Navigation Bar)

Ở cuối màn hình có thanh điều hướng màu đen với các nút để chuyển trang nhanh:

```
[Trang chủ] [Danh sách SP] [Chi tiết SP] [Giỏ hàng] [Thanh toán] [Xác nhận] [Tài khoản] [Đăng nhập] [Admin]
```

**Cách ẩn thanh Dev Nav:**
- Trong `/App.tsx`, dòng 21: Đổi `useState(true)` thành `useState(false)`

---

## CHECKLIST KIỂM TRA TỪNG TRANG

### ✅ 1. TRANG CHỦ
**Các thành phần cần kiểm tra:**
- [ ] Logo TechStore (top-left)
- [ ] Menu "Danh Mục Sản Phẩm" (hover để xem dropdown)
- [ ] Thanh tìm kiếm
- [ ] Icon User và Giỏ hàng (top-right)
- [ ] Hero Carousel (3 slides tự động chuyển)
- [ ] 4 thẻ Danh mục (Laptop, Màn Hình, PC, Phụ Kiện)
- [ ] Flash Sale với scroll ngang
- [ ] Grid sản phẩm công nghệ (3x4)
- [ ] Footer

**Các nút cần test:**
| Nút | Kết quả mong đợi |
|-----|------------------|
| Click vào card "Laptop" | → Trang danh sách sản phẩm |
| Click "Thêm vào giỏ" (Flash Sale) | Cart count +1 |
| Click "Chi tiết" (sản phẩm) | → Trang chi tiết sản phẩm |
| Hover Flash Sale → Click mũi tên phải | Scroll sang phải |
| Click Icon Giỏ hàng | → Trang giỏ hàng |
| Click Icon User | → Trang đăng nhập |

---

### ✅ 2. DANH SÁCH SẢN PHẨM
**Các thành phần:**
- [ ] Navbar (giống trang chủ)
- [ ] Hero Carousel mỏng (height: 264px)
- [ ] Sidebar Filter (bên trái)
- [ ] Grid sản phẩm 3 cột
- [ ] Dropdown sắp xếp
- [ ] Pagination

**Filter Sidebar:**
- [ ] Thương hiệu (ASUS, MSI, Dell, HP...)
- [ ] Khoảng giá (input từ-đến)
- [ ] CPU (Intel/AMD)
- [ ] RAM (8GB, 16GB, 32GB, 64GB)
- [ ] Ổ cứng (256GB, 512GB, 1TB, 2TB)
- [ ] Màu sắc
- [ ] Nút "Xóa tất cả"

**Test:**
| Action | Kết quả |
|--------|---------|
| Check "ASUS" trong filter | Chỉ hiện sản phẩm ASUS |
| Nhập giá từ 10tr - 50tr | Lọc theo giá |
| Click "Xóa tất cả" | Reset tất cả filter |
| Click "Chi tiết" | → Trang chi tiết |
| Click "Giỏ hàng" | Cart count +1 |
| Đổi sort thành "Giá thấp đến cao" | Sản phẩm sắp xếp lại |

---

### ✅ 3. CHI TIẾT SẢN PHẨM
**Các thành phần:**
- [ ] Breadcrumb "← Quay lại danh sách sản phẩm"
- [ ] Gallery ảnh (1 ảnh lớn + 3 thumbnail)
- [ ] Thông tin: Tên, Brand, Giá, Rating
- [ ] Specs box (CPU, GPU, RAM, SSD, Display)
- [ ] Chọn số lượng (+/-)
- [ ] Nút "Thêm vào giỏ" và "Mua ngay"
- [ ] 3 Tabs: Mô tả, Thông số kỹ thuật, Đánh giá
- [ ] 4 Sản phẩm tương tự (bottom)

**Test:**
| Action | Kết quả |
|--------|---------|
| Click thumbnail ảnh | Đổi ảnh chính |
| Click mũi tên trái/phải | Chuyển ảnh |
| Click số lượng "-" | Giảm số lượng (min: 1) |
| Click số lượng "+" | Tăng số lượng |
| Click "Thêm vào giỏ" | Cart count +1 |
| Click "Mua ngay" | → Trang checkout |
| Click tab "Thông số kỹ thuật" | Hiện bảng specs |
| Click tab "Đánh giá" | Hiện 3 review |
| Click sản phẩm tương tự | → Trang chi tiết SP khác |

---

### ✅ 4. GIỎ HÀNG
**Các thành phần:**
- [ ] Danh sách 2 sản phẩm (default)
- [ ] Ảnh, tên, specs, giá
- [ ] Nút +/- số lượng
- [ ] Icon thùng rác (xóa)
- [ ] Tóm tắt đơn hàng (sidebar)
- [ ] Phí vận chuyển
- [ ] Tổng cộng

**Test:**
| Action | Kết quả |
|--------|---------|
| Click "+" số lượng | Tăng số lượng, giá cập nhật |
| Click "-" số lượng | Giảm số lượng, giá cập nhật |
| Click icon thùng rác | Xóa sản phẩm, cart count -1 |
| Xóa hết sản phẩm | Hiện "Giỏ hàng trống" |
| Click "Tiến hành thanh toán" | → Trang checkout |
| Click "Tiếp tục mua sắm" | → Trang chủ |

---

### ✅ 5. THANH TOÁN (CHECKOUT)
**4 Bước:**

#### Bước 1: Thông tin giao hàng
- [ ] Form: Họ tên, SĐT, Email, Địa chỉ, Phường, Quận, Thành phố
- [ ] Link "Đăng nhập" (nếu chưa login)
- [ ] Nút "Tiếp tục"

#### Bước 2: Vận chuyển
- [ ] Radio: Giao hàng tiêu chuẩn (200k)
- [ ] Radio: Giao hàng nhanh (500k)
- [ ] Nút "Quay lại" và "Tiếp tục"

#### Bước 3: Thanh toán
- [ ] Radio: COD
- [ ] Radio: Thẻ tín dụng (hiện form thẻ)
- [ ] Radio: Ví MoMo
- [ ] Radio: Chuyển khoản
- [ ] Nút "Quay lại" và "Tiếp tục"

#### Bước 4: Xác nhận
- [ ] Review: Địa chỉ, Vận chuyển, Thanh toán
- [ ] Checkbox "Đồng ý điều khoản"
- [ ] Nút "Đặt hàng"

**Test:**
| Action | Kết quả |
|--------|---------|
| Bỏ trống thông tin → "Tiếp tục" | Không cho qua bước 2 |
| Chọn "Thẻ tín dụng" | Hiện form nhập thẻ |
| Click "Đặt hàng" (chưa check điều khoản) | Alert "Vui lòng đồng ý..." |
| Check điều khoản → "Đặt hàng" | → Trang xác nhận đơn |

---

### ✅ 6. XÁC NHẬN ĐƠN HÀNG
**Các thành phần:**
- [ ] Icon checkmark xanh lá
- [ ] Mã đơn hàng (ORD-XXXXX)
- [ ] Timeline 4 bước (chỉ bước 1 active)
- [ ] Danh sách sản phẩm
- [ ] Tóm tắt giá
- [ ] Địa chỉ giao hàng
- [ ] Phương thức thanh toán
- [ ] Nút "Tải hóa đơn"
- [ ] Nút "Xem đơn hàng" và "Tiếp tục mua sắm"

**Test:**
| Action | Kết quả |
|--------|---------|
| Click "Xem đơn hàng" | → Trang tài khoản (tab Đơn hàng) |
| Click "Tiếp tục mua sắm" | → Trang chủ |

---

### ✅ 7. TÀI KHOẢN NGƯỜI DÙNG
**7 Tabs:**
1. **Thông tin cá nhân** - Form: Tên, Email, SĐT, Ngày sinh
2. **Đơn hàng** - 2 đơn (Đang giao, Đã giao)
3. **Địa chỉ** - 2 địa chỉ (Nhà riêng, Văn phòng)
4. **Thanh toán** - "Chưa có phương thức..."
5. **Yêu thích** - 2 sản phẩm wishlist
6. **Bảo hành** - 1 sản phẩm
7. **Cài đặt** - Đổi mật khẩu, Xóa tài khoản

**Test:**
| Action | Kết quả |
|--------|---------|
| Click tab "Đơn hàng" | Hiện 2 đơn hàng |
| Click "Chi tiết" (đơn hàng) | (Chưa có page) |
| Click "Theo dõi" | (Chưa có tracking) |
| Click tab "Địa chỉ" → "Chỉnh sửa" | (Chưa có modal) |
| Click tab "Yêu thích" → "Thêm vào giỏ" | Cart count +1 |
| Click tab "Bảo hành" → "Yêu cầu bảo hành" | (Chưa có form) |

---

### ✅ 8. ĐĂNG NHẬP / ĐĂNG KÝ
**Các thành phần:**
- [ ] Logo TechStore
- [ ] 2 Tabs: Đăng nhập / Đăng ký
- [ ] Form đăng nhập: Email, Password
- [ ] Checkbox "Nhớ đăng nhập"
- [ ] Link "Quên mật khẩu?"
- [ ] Nút Google/Facebook
- [ ] Link "Quay về trang chủ"

**Test:**
| Action | Kết quả |
|--------|---------|
| Click tab "Đăng ký" | Hiện form đăng ký (thêm trường Họ tên) |
| Click icon mắt | Show/hide password |
| Click "Đăng nhập" | → Trang chủ, isLoggedIn = true |
| Click "Quay về trang chủ" | → Trang chủ |

---

### ✅ 9. ADMIN DASHBOARD
**6 Tabs:**
1. **Dashboard** - 4 stats card, bảng đơn hàng gần đây
2. **Sản phẩm** - Bảng 4 sản phẩm
3. **Đơn hàng** - Bảng 3 đơn hàng
4. **Khách hàng** - Bảng 3 khách hàng
5. **Mã giảm giá** - "Chưa có mã..."
6. **Nội dung** - "Chưa có bài viết..."

**Header:**
- [ ] Logo + "TechStore Admin"
- [ ] Nút "Về trang chủ"

**Test:**
| Action | Kết quả |
|--------|---------|
| Click tab "Sản phẩm" | Hiện bảng sản phẩm |
| Click icon Edit | (Chưa có modal) |
| Click icon Trash | (Chưa có confirm) |
| Click "Về trang chủ" | → Trang chủ |

---

## FLOW TEST CASES

### Test Case 1: Mua hàng hoàn chỉnh (Guest)
```
1. Trang chủ
2. Click "Laptop" (danh mục)
3. Click "Chi tiết" sản phẩm đầu
4. Click "Thêm vào giỏ" (cart count: 2→3)
5. Click icon Giỏ hàng
6. Click "Tiến hành thanh toán"
7. Điền form → "Tiếp tục" (4 lần)
8. Check "Đồng ý" → "Đặt hàng"
9. Click "Tiếp tục mua sắm"
✅ Quay về trang chủ, cart count = 0
```

### Test Case 2: Đăng nhập → Mua hàng
```
1. Click icon User → Trang login
2. Nhập email/pass → "Đăng nhập"
3. Click icon User → Trang account (đã login)
4. Click logo → Về trang chủ
5. Click sản phẩm → "Mua ngay"
6. Checkout (địa chỉ tự động điền)
7. "Đặt hàng"
✅ Xác nhận đơn hàng
```

### Test Case 3: Filter sản phẩm
```
1. Click "Màn Hình" (danh mục)
2. Check filter "Samsung"
3. Nhập giá: 10tr - 20tr
4. Check "Đen" (màu sắc)
5. Click "Xóa tất cả"
✅ Filter reset, hiện tất cả màn hình
```

### Test Case 4: Quản lý giỏ hàng
```
1. Click icon Giỏ hàng
2. Click "+" số lượng (laptop)
3. Click "-" số lượng (chuột)
4. Click icon Trash (xóa chuột)
5. Kiểm tra tổng tiền cập nhật
✅ Cart count giảm, giá đúng
```

---

## LƯU Ý QUAN TRỌNG

### ✅ Điều hướng hoạt động:
- Click Logo → Trang chủ
- Click Icon Giỏ hàng → Trang giỏ hàng
- Click Icon User → Login (nếu chưa đăng nhập) / Account (đã đăng nhập)
- Navbar menu dropdown (hover)

### ✅ Cart count đồng bộ:
- Hiển thị trên navbar tất cả các trang
- Tăng khi "Thêm vào giỏ"
- Giảm khi xóa sản phẩm
- Reset về 0 sau khi đặt hàng

### ✅ Scroll behavior:
- Tự động scroll về đầu trang khi chuyển trang
- Smooth scroll cho Flash Sale carousel

### ⚠️ Các chức năng chưa implement:
- Modal edit sản phẩm (Admin)
- Tracking đơn hàng chi tiết
- Tìm kiếm sản phẩm (search bar)
- Wishlist heart icon
- Social login thực tế
- Download hóa đơn PDF
- Form yêu cầu bảo hành

---

## CÁCH BẬT/TẮT DEV NAV

**Bật (mặc định):**
```typescript
// App.tsx, line 21
const [showDevNav, setShowDevNav] = useState(true);
```

**Tắt:**
```typescript
const [showDevNav, setShowDevNav] = useState(false);
```
