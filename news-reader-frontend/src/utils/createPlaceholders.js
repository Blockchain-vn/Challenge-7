import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

// Tạo đường dẫn tương đương với __dirname trong ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tạo thư mục images nếu chưa tồn tại
const imagesDir = path.join(__dirname, '../../public/images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Danh sách các placeholder images cần tạo
const placeholders = [
  { name: 'thoi-su-1.jpg', text: 'Thời sự', color: '007bff' },
  { name: 'the-gioi-1.jpg', text: 'Thế giới', color: '28a745' },
  { name: 'kinh-doanh-1.jpg', text: 'Kinh doanh', color: 'ffc107' },
  { name: 'giai-tri-1.jpg', text: 'Giải trí', color: 'dc3545' },
  { name: 'the-thao-1.jpg', text: 'Thể thao', color: '17a2b8' },
  { name: 'phap-luat-1.jpg', text: 'Pháp luật', color: '6c757d' },
  { name: 'thoi-su-2.jpg', text: 'Thời sự 2', color: '007bff' },
  { name: 'the-gioi-2.jpg', text: 'Thế giới 2', color: '28a745' },
  { name: 'kinh-doanh-2.jpg', text: 'Kinh doanh 2', color: 'ffc107' },
  { name: 'giai-tri-2.jpg', text: 'Giải trí 2', color: 'dc3545' },
  { name: 'placeholder.jpg', text: 'News Image', color: '6c757d' }
];

// Hàm tải hình ảnh từ placeholder.com
const downloadPlaceholder = (name, text, color) => {
  return new Promise((resolve, reject) => {
    const url = `https://via.placeholder.com/600x400/${color}/FFFFFF?text=${encodeURIComponent(text)}`;
    const filePath = path.join(imagesDir, name);
    const file = fs.createWriteStream(filePath);

    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        console.log(`Đã tạo: ${name}`);
        resolve(filePath);
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {}); // Xóa file nếu tải thất bại
      reject(err);
    });
  });
};

// Tạo tất cả hình ảnh placeholder
const createAllPlaceholders = async () => {
  console.log('Bắt đầu tạo hình ảnh placeholder...');
  
  try {
    const promises = placeholders.map(p => downloadPlaceholder(p.name, p.text, p.color));
    await Promise.all(promises);
    
    console.log('Tạo hình ảnh placeholder hoàn tất!');
  } catch (error) {
    console.error('Lỗi khi tạo hình ảnh placeholder:', error);
  }
};

createAllPlaceholders();
