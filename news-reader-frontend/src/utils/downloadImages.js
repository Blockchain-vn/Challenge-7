import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

// Tạo đường dẫn tương đương với __dirname trong ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tạo thư mục images nếu chưa tồn tại
const imagesDir = path.join(__dirname, '../../public/images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Danh sách URL hình ảnh mẫu
const imageUrls = [
  {
    url: 'https://i1-vnexpress.vnecdn.net/2023/05/20/cao-toc-1-9296-1684580207.jpg',
    filename: 'thoi-su-1.jpg'
  },
  {
    url: 'https://i1-vnexpress.vnecdn.net/2023/05/21/thu-tuong-nhat-ban-9915-1684667204.jpg',
    filename: 'the-gioi-1.jpg'
  },
  {
    url: 'https://i1-kinhdoanh.vnecdn.net/2023/05/22/chung-khoan-7359-1684753204.jpg',
    filename: 'kinh-doanh-1.jpg'
  },
  {
    url: 'https://i1-giaitri.vnecdn.net/2023/05/23/son-tung-mtp-8294-1684839604.jpg',
    filename: 'giai-tri-1.jpg'
  },
  {
    url: 'https://i1-thethao.vnecdn.net/2023/05/24/doi-tuyen-viet-nam-5839-1684926004.jpg',
    filename: 'the-thao-1.jpg'
  },
  {
    url: 'https://i1-phapluat.vnecdn.net/2023/05/25/toa-an-4728-1685012404.jpg',
    filename: 'phap-luat-1.jpg'
  },
  {
    url: 'https://i1-vnexpress.vnecdn.net/2023/05/26/giao-thong-ha-noi-2957-1685098804.jpg',
    filename: 'thoi-su-2.jpg'
  },
  {
    url: 'https://i1-vnexpress.vnecdn.net/2023/05/27/viet-nam-hoa-ky-1947-1685185204.jpg',
    filename: 'the-gioi-2.jpg'
  },
  {
    url: 'https://i1-kinhdoanh.vnecdn.net/2023/05/28/xuat-khau-3619-1685271604.jpg',
    filename: 'kinh-doanh-2.jpg'
  },
  {
    url: 'https://i1-giaitri.vnecdn.net/2023/05/29/lien-hoan-phim-7294-1685358004.jpg',
    filename: 'giai-tri-2.jpg'
  }
];

// Hàm tải hình ảnh
const downloadImage = (url, filename) => {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const filePath = path.join(imagesDir, filename);
    const file = fs.createWriteStream(filePath);

    protocol.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${filename}`);
        resolve(filePath);
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {}); // Xóa file nếu tải thất bại
      reject(err);
    });
  });
};

// Tải tất cả hình ảnh
const downloadAllImages = async () => {
  console.log('Bắt đầu tải hình ảnh...');
  
  try {
    // Tạo placeholder image
    const placeholderPath = path.join(imagesDir, 'placeholder.jpg');
    if (!fs.existsSync(placeholderPath)) {
      await downloadImage('https://via.placeholder.com/600x400?text=News+Image', 'placeholder.jpg');
    }
    
    // Tải các hình ảnh khác
    const promises = imageUrls.map(img => downloadImage(img.url, img.filename));
    await Promise.all(promises);
    
    console.log('Tải hình ảnh hoàn tất!');
  } catch (error) {
    console.error('Lỗi khi tải hình ảnh:', error);
  }
};

downloadAllImages();
