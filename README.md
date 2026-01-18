# Restaurant Order Management System (QR Table Ordering)

## Giới thiệu

**Restaurant Order Management System** là hệ thống hỗ trợ khách hàng gọi món trực tiếp tại bàn bằng cách quét mã QR.  
Khách có thể xem menu và đặt món; Quản trị viên có thể quản lý menu và xử lý đơn hàng.

---

## Mục tiêu dự án

- Hỗ trợ khách tự gọi món tại bàn qua QR
- Giảm tải cho nhân viên phục vụ
- Chuẩn hóa quy trình tiếp nhận và xử lý đơn
- Ứng dụng quy trình phát triển phần mềm chuẩn

---

## Đối tượng người dùng

### Guest (Khách hàng)

- Quét QR để truy cập menu
- Xem danh sách món
- Thêm món vào giỏ hàng
- Gửi đơn hàng
- Xem trạng thái đơn

### Admin (Quản trị viên)

- Đăng nhập hệ thống
- Quản lý món ăn (thêm/sửa/xóa)
- Quản lý danh mục món
- Quản lý bàn
- Xem và xử lý đơn đặt món
- Cập nhật trạng thái đơn

---

## Chức năng hệ thống

### Guest

- Xem menu theo danh mục
- Xem chi tiết món ăn
- Chọn số lượng
- Thêm vào giỏ hàng
- Xác nhận đơn đặt món
- Theo dõi trạng thái:
  - Pending
  - Preparing
  - Completed
  - Cancelled

### Admin

- Đăng nhập / đăng xuất
- Quản lý thực đơn:
  - thêm món
  - sửa món
  - xóa món
- Quản lý đơn hàng:
  - xem chi tiết
  - cập nhật trạng thái
- Quản lý bàn ăn (QR mapping)

---

## Công nghệ sử dụng (dự kiến)

- Backend: Python / C++
- Database: MySQL 
- Frontend: HTML / CSS 
- Diagram: draw.io / diagrams.net
- Quản lý mã nguồn: GitHub
- Kiểm thử: Excel test cases
- Bug Tracking: Jira / GitHub Issues

---

## Cấu trúc thư mục dự án

```text
restaurant-order-system/
│
├── app/
│   ├── __init__.py
│   ├── app.py              # entry point
│   │
│   ├── models/             # DATA MODEL (map DB)
│   │   ├── table.py
│   │   ├── menu.py
│   │   ├── order.py
│   │   ├── member.py
│   │   └── admin.py
│   │
│   ├── services/           # BUSINESS LOGIC
│   │   ├── order_service.py
│   │   ├── payment_service.py
│   │   └── discount_service.py
│   │
│   ├── routes/             # CONTROLLER
│   │   ├── guest_routes.py
│   │   ├── member_routes.py
│   │   └── admin_routes.py
│   │
│   └── database.py         # DB connection
│
├── docs/
│   ├── SRS.docx / pdf
│   └── diagrams/
│
├── requirements.txt
└── README.md

