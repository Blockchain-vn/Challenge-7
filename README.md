# News Reader Project

Ứng dụng đọc tin tức sử dụng React cho cả frontend và backend (Node.js/Express).

## Cấu trúc dự án

Dự án được chia thành hai phần chính:

- `news-reader-frontend`: Frontend sử dụng React, Bootstrap và React Router
- `news-reader-backend`: Backend sử dụng Node.js, Express, PostgreSQL và Swagger

## Yêu cầu hệ thống

- Node.js (v14 trở lên)
- npm hoặc yarn
- PostgreSQL

## Cài đặt và chạy dự án

### Backend

1. Di chuyển vào thư mục backend:

```bash
cd news-reader-project/news-reader-backend
```

2. Cài đặt các dependencies:

```bash
npm install
```

3. Cấu hình cơ sở dữ liệu PostgreSQL:
   - Tạo cơ sở dữ liệu PostgreSQL với tên `news_reader_dev`
   - Cập nhật thông tin kết nối trong file `.env.development`

4. Chạy backend ở chế độ development:

```bash
npm run dev
```

Backend sẽ chạy tại địa chỉ: http://localhost:5000
Swagger API docs: http://localhost:5000/api-docs

### Frontend

1. Di chuyển vào thư mục frontend:

```bash
cd news-reader-project/news-reader-frontend
```

2. Cài đặt các dependencies:

```bash
npm install
```

3. Chạy frontend ở chế độ development:

```bash
npm run dev
```

Frontend sẽ chạy tại địa chỉ: http://localhost:5173

## Tính năng

- Hiển thị danh sách tin tức với lazy loading
- Xem chi tiết bài viết
- Lọc bài viết theo danh mục
- Backend tự động thu thập tin tức từ tuoitre.vn mỗi 30 phút
- Ghi log các hoạt động và lỗi

## Công nghệ sử dụng

### Frontend
- React 19
- TypeScript
- React Router
- React Bootstrap
- Axios

### Backend
- Node.js
- Express
- PostgreSQL
- Sequelize ORM
- Swagger
- Winston (logging)
- Cheerio (web scraping)
- Node-cron (scheduling)

## Môi trường

Dự án hỗ trợ hai môi trường:
- Development: Sử dụng file `.env.development`
- Production: Sử dụng file `.env.production`