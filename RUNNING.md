# Hướng dẫn chạy dự án News Reader

## Chuẩn bị môi trường

1. **Cài đặt Node.js và npm**:
   - Tải và cài đặt Node.js từ [nodejs.org](https://nodejs.org/) (phiên bản LTS được khuyến nghị)
   - npm sẽ được cài đặt cùng với Node.js

2. **Cài đặt PostgreSQL**:
   - Tải và cài đặt PostgreSQL từ [postgresql.org](https://www.postgresql.org/download/)
   - Tạo một cơ sở dữ liệu mới với tên `news_reader_dev`
   - Ghi nhớ thông tin đăng nhập (username, password) để cấu hình trong file .env

## Chạy Backend

1. **Cài đặt dependencies**:
   ```bash
   cd news-reader-project/news-reader-backend
   npm install
   ```

2. **Cấu hình môi trường**:
   - Kiểm tra file `.env.development` và cập nhật thông tin kết nối PostgreSQL:
     ```
     DB_HOST=localhost
     DB_PORT=5432
     DB_NAME=news_reader_dev
     DB_USER=postgres
     DB_PASSWORD=your_password_here
     ```

3. **Chạy backend**:
   ```bash
   npm run dev
   ```
   
   Backend sẽ chạy tại địa chỉ: http://localhost:5000
   
   Bạn có thể kiểm tra API docs tại: http://localhost:5000/api-docs

## Chạy Frontend

1. **Cài đặt dependencies**:
   ```bash
   cd news-reader-project/news-reader-frontend
   npm install
   ```

2. **Chạy frontend**:
   ```bash
   npm run dev
   ```
   
   Frontend sẽ chạy tại địa chỉ: http://localhost:5173

## Kiểm tra ứng dụng

1. Mở trình duyệt và truy cập: http://localhost:5173
2. Ứng dụng sẽ tự động kết nối với backend và hiển thị dữ liệu

## Xử lý sự cố

### Backend không kết nối được với PostgreSQL

- Kiểm tra PostgreSQL đã chạy chưa
- Kiểm tra thông tin kết nối trong file `.env.development`
- Kiểm tra cơ sở dữ liệu `news_reader_dev` đã được tạo chưa

### Frontend không hiển thị dữ liệu

- Kiểm tra backend đã chạy chưa (http://localhost:5000/health)
- Kiểm tra console trong DevTools của trình duyệt để xem lỗi
- Kiểm tra file `.env.development` trong thư mục frontend có đúng URL API không

### Lỗi CORS

Nếu gặp lỗi CORS, hãy kiểm tra:
- Cấu hình CORS trong backend (file `index.js`)
- URL API trong frontend có đúng không

## Ghi chú

- Backend sẽ tự động thu thập dữ liệu từ tuoitre.vn mỗi 30 phút
- Logs được lưu trong thư mục `logs` của backend
- Swagger API docs giúp bạn hiểu và test các API