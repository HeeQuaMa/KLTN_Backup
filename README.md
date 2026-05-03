<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# 💻 NetTech - Backend Core (NestJS Migration)

Dự án Hệ thống Quản lý và Kinh doanh Linh kiện PC (NetTech). Backend đã được chuyển đổi từ ExpressJS sang **NestJS Framework** với kiến trúc **Data-centered** chuẩn chỉnh.

## 🛠️ Công nghệ sử dụng

- **Framework:** NestJS (Node.js)
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Language:** TypeScript
- **Documentation:** Swagger (OpenAPI 3.0)
- **Validation:** Class-validator & Class-transformer
- **Security:** JWT Authentication
- **Tools:** Swagger UI, Postman, ESLint, Git

## ⚙️ Hướng dẫn cài đặt cho thành viên nhóm

Để chạy dự án sau khi clone về máy

1. **Clone dự án:**
   ```bash
   git clone https://github.com/TheBottomOfTheDeepDarkOcean/Castone_Project.git

2. **Cài đặt thư viện:**
npm install --legacy-peer-deps (thêm cái legacy để khỏi bị cảnh báo xàm)

3. **Cấu hình môi trường:**
Tạo file .env ở thư mục gốc.
Dán chuỗi "mongodb+srv://nettech_db:MOlezawS6Xhzggbd@nettechdatabase.z1l7rpg.mongodb.net/?appName=NettechDatabase"

4. **Khởi chạy Server:**
npm run start:dev

**Trạng thái phát triển:** 

[x] Khởi tạo kiến trúc NestJS.

[x] Kết nối Database Atlas.

[x] Hoàn thiện API Auth/Product/Sales.

[x] Hoàn thiện API Warehouse

---

## 🚀 Hướng dẫn sử dụng API (Dành cho Frontend)

Hệ thống đã được tích hợp **Swagger** để tra cứu và test API trực tiếp.

### 1. Cách truy cập tài liệu API
Sau khi khởi động server (`npm run start:dev`), thì vào localhost theo link:
- **URL:** `http://localhost:3001/api/docs`

### 2. Các chức năng chính đã hoàn thành
- **Quản lý Sản phẩm:**
    - `GET /products`: Lấy danh sách sản phẩm (hỗ trợ phân trang & lọc theo CPU, VGA, Giá).
    - `GET /products/:id`: Xem chi tiết 1 sản phẩm.
    - `POST /products`: Thêm sản phẩm mới.
    - `PATCH /products/:id/stock`: Điều chỉnh tồn kho (Dùng `quantityChange` âm để trừ kho khi bán hàng và dương để cập nhập/thêm/nhập kho cho sản phẩm đó nha) - (VD: `quantityChange :-1` có nghĩa là đã bán 1 ).
    - `DELETE /products/:id`: Xóa sản phẩm.

### 3. Lưu ý khi Test API
- Tại giao diện Swagger, nhấn nút **"Try it out"** để có thể nhập dữ liệu.
- Đối với các API `POST` và `PATCH`, hệ thống đã có sẵn **JSON mẫu (Example Value)**, chỉ cần đi theo mẫu sẵn có là được
- Nếu gặp lỗi **400**, hãy kiểm tra lại kiểu dữ liệu (ví dụ: `price` phải là số).

---