Restaurant Order Management System
📌 Giới thiệu

Restaurant Order Management System là hệ thống quản lý gọi món cho nhà hàng. Khách (Guest) có thể xem menu và đặt món; Quản trị viên (Admin) có thể quản lý menu và đơn hàng.

Dự án được thực hiện nhằm phục vụ mục tiêu học tập và thực hành phân tích – thiết kế hệ thống thông tin.

🎯 Mục tiêu dự án

Xây dựng hệ thống gọi món đơn giản cho nhà hàng

Hỗ trợ khách đặt món trực tuyến

Hỗ trợ quản trị viên quản lý menu và đơn hàng

Áp dụng quy trình phát triển phần mềm:

phân tích yêu cầu

thiết kế

cài đặt

kiểm thử

👥 Đối tượng người dùng
1. Guest (Khách hàng)

Xem menu món ăn

Xem thông tin chi tiết món

Thêm món vào giỏ hàng

Tạo đơn đặt món

Theo dõi trạng thái đơn hàng

2. Admin (Quản trị viên)

Đăng nhập hệ thống

Quản lý món ăn (thêm/sửa/xóa)

Quản lý danh mục món

Xem danh sách đơn đặt món

Cập nhật trạng thái đơn hàng

Xem thống kê đơn hàng cơ bản

🏗️ Chức năng chính của hệ thống
Guest

Xem danh sách món ăn theo danh mục

Thêm món vào giỏ hàng

Cập nhật số lượng món

Gửi đơn hàng

Nhập thông tin liên hệ/bàn

Xem trạng thái đơn:

Pending

Preparing

Completed

Cancelled

Admin

Đăng nhập và đăng xuất

Quản lý người dùng (tùy chọn)

Quản lý menu:

thêm món

sửa món

xóa món

Quản lý đơn hàng:

xem chi tiết đơn

cập nhật trạng thái

đánh dấu đã thanh toán

🛠️ Công nghệ dự kiến sử dụng

Ngôn ngữ lập trình: Python / Java / C++ (tùy nhóm chọn)

IDE: VS Code, PyCharm, Eclipse, NetBeans

Cơ sở dữ liệu: MySQL / PostgreSQL / SQLite

Vẽ sơ đồ: diagrams.net (draw.io)

Quản lý mã nguồn: GitHub / GitLab

Viết tài liệu: Markdown / Word

Kiểm thử: Excel test cases

🗂️ Cấu trúc thư mục dự án (dự kiến)
Restaurant-Order-Management-System/
│
├── docs/
│   ├── Requirement-Analysis.md
│   ├── SRS.md
│   ├── System-Design.md
│   └── diagrams/
│
├── src/
│   ├── backend/
│   ├── frontend/
│   └── database/
│
├── sql/
│   └── schema.sql
│
├── README.md
└── LICENSE

📑 Các giai đoạn thực hiện dự án
Stage 1 – Phân tích và đặc tả yêu cầu

Functional Requirements

Non-functional Requirements

Data Flow Diagram (DFD)

Use Case Diagram

Class Diagram

Stage 2 – Thiết kế

Thiết kế giao diện người dùng

Thiết kế cơ sở dữ liệu

bảng

khóa chính

khóa ngoại

Stage 3 – Cài đặt

Xây dựng chương trình

Kết nối cơ sở dữ liệu

Triển khai chức năng chính

Stage 4 – Kiểm thử

Viết test case

Thực hiện kiểm thử

Ghi nhận lỗi và sửa lỗi

✔️ Phạm vi hệ thống (Scope)

Để đơn giản hóa mô hình, hệ thống hiện chỉ bao gồm:

Guest

Admin

Các vai trò sau đây không triển khai riêng biệt:

nhân viên phục vụ

thu ngân

bếp

Chức năng của các vai trò này được gộp vào Admin.
