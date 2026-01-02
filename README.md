# Restaurant QR Ordering System

Hệ thống quản lý order nhà hàng cho phép **khách tự gọi món bằng điện thoại** thông qua việc quét **mã QR tại bàn**. Order của khách sẽ được gửi trực tiếp đến hệ thống bếp và thu ngân, giúp giảm thời gian chờ và hạn chế sai sót trong quá trình gọi món.

---

## 1. 🎯 Mục tiêu hệ thống

- Khách không cần gọi nhân viên để order
- Mỗi bàn có một mã QR riêng
- Order tự động chuyển đến:
  - Kitchen Display (bếp/barista)
  - Cashier (thu ngân)
- Giảm thao tác ghi tay và nhầm lẫn món
- Hỗ trợ quản lý menu và báo cáo doanh thu cơ bản

---

## 2. 👥 Đối tượng sử dụng

- Khách hàng
- Nhân viên phục vụ
- Nhân viên bếp
- Thu ngân
- Quản lý nhà hàng (Admin)

---

## 3. 🧩 Chức năng chính

### Khách hàng
- Quét mã QR tại bàn
- Xem menu theo danh mục
- Chọn món và ghi chú
- Gửi order
- Theo dõi trạng thái món
- Gọi nhân viên hỗ trợ

### Bếp / Kitchen
- Nhận danh sách món mới order
- Cập nhật trạng thái:
  - Pending
  - Preparing
  - Completed

### Thu ngân
- Xem hóa đơn theo bàn
- Tính tổng tiền
- Thanh toán (tiền mặt/chuyển khoản)
- Đóng order

### Admin / Manager
- Quản lý món ăn và danh mục
- Cập nhật giá, trạng thái bán
- Quản lý bàn và mã QR
- Xem báo cáo cơ bản

---

## 4. 🏗️ Kiến trúc hệ thống (định hướng)

- Web-based application
- QR link theo bàn:
  - `https://domain/order?table={table_id}`

### Thành phần
- Customer Web App
- Admin Dashboard
- Kitchen Display System
- Backend API
- Database

---

## 5. 🗄️ Thiết kế cơ sở dữ liệu (tóm tắt bảng)

- `Users`
- `Tables`
- `MenuCategories`
- `MenuItems`
- `Orders`
- `OrderItems`
- `Payments`

Chi tiết ERD được trình bày trong thư mục `/docs`.

---

## 6. 📂 Cấu trúc thư mục dự án

```text
docs/                     # Requirement, Specification, Design
  SRS.md
  UseCaseDiagram.png
  ERD.png
  ClassDiagram.png
  SequenceDiagrams/

backend/                  # Source code backend

frontend/                 # Web/mobile client

sql/                      # Script tạo database

README.md
