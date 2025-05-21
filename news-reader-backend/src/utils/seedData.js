import { sequelize } from '../config/database.js';
import Category from '../models/Category.js';
import Article from '../models/Article.js';
import logger from './logger.js';

const seedCategories = [
  {
    name: 'Thời sự',
    slug: 'thoi-su',
    url: 'https://vnexpress.net/thoi-su'
  },
  {
    name: 'Thế giới',
    slug: 'the-gioi',
    url: 'https://vnexpress.net/the-gioi'
  },
  {
    name: 'Kinh doanh',
    slug: 'kinh-doanh',
    url: 'https://vnexpress.net/kinh-doanh'
  },
  {
    name: 'Giải trí',
    slug: 'giai-tri',
    url: 'https://vnexpress.net/giai-tri'
  },
  {
    name: 'Thể thao',
    slug: 'the-thao',
    url: 'https://vnexpress.net/the-thao'
  },
  {
    name: 'Pháp luật',
    slug: 'phap-luat',
    url: 'https://vnexpress.net/phap-luat'
  }
];

const seedArticles = [
  {
    title: 'Thủ tướng yêu cầu đẩy nhanh tiến độ các dự án giao thông trọng điểm',
    slug: 'thu-tuong-yeu-cau-day-nhanh-tien-do-cac-du-an-giao-thong-trong-diem',
    summary: 'Thủ tướng Phạm Minh Chính yêu cầu các bộ, ngành và địa phương đẩy nhanh tiến độ các dự án giao thông trọng điểm để phát triển kinh tế - xã hội.',
    content: 'Thủ tướng Phạm Minh Chính vừa có công điện yêu cầu các bộ, ngành và địa phương đẩy nhanh tiến độ các dự án giao thông trọng điểm để phát triển kinh tế - xã hội.\n\nTheo đó, Thủ tướng yêu cầu Bộ Giao thông Vận tải, Bộ Kế hoạch và Đầu tư, Bộ Tài chính và các địa phương liên quan tập trung nguồn lực, đẩy nhanh tiến độ các dự án đường bộ cao tốc, đường sắt đô thị và các cảng biển lớn.\n\nThủ tướng nhấn mạnh việc phát triển hạ tầng giao thông đồng bộ, hiện đại là một trong những đột phá chiến lược để phát triển kinh tế - xã hội nhanh và bền vững.',
    imageUrl: '/images/thutuongyeucau.jpg',
    sourceUrl: 'https://vnexpress.net/thoi-su',
    publishedAt: new Date(),
    categoryId: 1
  },
  {
    title: 'Việt Nam - Nhật Bản nâng cấp quan hệ lên Đối tác Chiến lược Toàn diện',
    slug: 'viet-nam-nhat-ban-nang-cap-quan-he-len-doi-tac-chien-luoc-toan-dien',
    summary: 'Việt Nam và Nhật Bản đã quyết định nâng cấp quan hệ lên Đối tác Chiến lược Toàn diện trong chuyến thăm của Thủ tướng Nhật Bản.',
    content: 'Trong chuyến thăm chính thức Việt Nam của Thủ tướng Nhật Bản, hai nước đã quyết định nâng cấp quan hệ lên Đối tác Chiến lược Toàn diện.\n\nThủ tướng Việt Nam và Thủ tướng Nhật Bản đã có cuộc hội đàm sâu rộng về các lĩnh vực hợp tác song phương và các vấn đề khu vực, quốc tế cùng quan tâm.\n\nHai bên nhất trí tăng cường hợp tác trên các lĩnh vực chính trị, an ninh quốc phòng, kinh tế, thương mại, đầu tư, khoa học công nghệ, giáo dục đào tạo, văn hóa, du lịch và giao lưu nhân dân.',
    imageUrl: '/images/VN-NB.jpg',
    sourceUrl: 'https://vnexpress.net/the-gioi',
    publishedAt: new Date(),
    categoryId: 2
  },
  {
    title: 'Thị trường chứng khoán khởi sắc, VN-Index tăng hơn 10 điểm',
    slug: 'thi-truong-chung-khoan-khoi-sac-vn-index-tang-hon-10-diem',
    summary: 'Thị trường chứng khoán Việt Nam khởi sắc trong phiên giao dịch hôm nay với VN-Index tăng hơn 10 điểm.',
    content: 'Thị trường chứng khoán Việt Nam khởi sắc trong phiên giao dịch hôm nay với VN-Index tăng hơn 10 điểm, đạt mức 1.180 điểm.\n\nCác cổ phiếu ngân hàng và bất động sản dẫn dắt thị trường với mức tăng ấn tượng. Khối ngoại tiếp tục mua ròng trên sàn HoSE với giá trị hơn 500 tỷ đồng.\n\nTheo các chuyên gia, thị trường đang trong xu hướng tích cực nhờ dòng tiền đầu tư mạnh và kỳ vọng vào kết quả kinh doanh quý II của các doanh nghiệp niêm yết.',
    imageUrl: '/images/chungkhoan.png',
    sourceUrl: 'https://vnexpress.net/kinh-doanh',
    publishedAt: new Date(),
    categoryId: 3
  },
  {
    title: 'Sơn Tùng M-TP ra mắt MV mới, lập kỷ lục lượt xem',
    slug: 'son-tung-m-tp-ra-mat-mv-moi-lap-ky-luc-luot-xem',
    summary: 'Ca sĩ Sơn Tùng M-TP vừa ra mắt MV mới và lập kỷ lục về lượt xem trên YouTube Việt Nam.',
    content: 'Ca sĩ Sơn Tùng M-TP vừa ra mắt MV mới và lập kỷ lục về lượt xem trên YouTube Việt Nam với hơn 5 triệu lượt xem chỉ sau 24 giờ.\n\nMV được đầu tư mạnh về mặt hình ảnh và âm nhạc, mang đến trải nghiệm thị giác và thính giác ấn tượng cho người xem.\n\nĐây là sản phẩm âm nhạc đánh dấu sự trở lại của Sơn Tùng M-TP sau thời gian dài vắng bóng trên thị trường nhạc Việt.',
    imageUrl: '/images/mtp.jpg',
    sourceUrl: 'https://vnexpress.net/giai-tri',
    publishedAt: new Date(),
    categoryId: 4
  },
  {
    title: 'Đội tuyển Việt Nam chuẩn bị cho vòng loại World Cup 2026',
    slug: 'doi-tuyen-viet-nam-chuan-bi-cho-vong-loai-world-cup-2026',
    summary: 'Đội tuyển Việt Nam đang tích cực chuẩn bị cho vòng loại World Cup 2026 với nhiều thay đổi về nhân sự.',
    content: 'Đội tuyển Việt Nam đang tích cực chuẩn bị cho vòng loại World Cup 2026 với nhiều thay đổi về nhân sự và chiến thuật.\n\nHLV Philippe Troussier đã công bố danh sách 30 cầu thủ được triệu tập cho đợt tập trung lần này. Đáng chú ý là sự trở lại của một số cầu thủ kỳ cựu và sự xuất hiện của nhiều gương mặt trẻ.\n\nĐội tuyển sẽ có hai trận giao hữu quốc tế trước khi bước vào các trận đấu chính thức tại vòng loại World Cup 2026 khu vực châu Á.',
    imageUrl: '/images/dabong.jpg',
    sourceUrl: 'https://vnexpress.net/the-thao',
    publishedAt: new Date(),
    categoryId: 5
  },
  {
    title: 'Xét xử vụ án tham nhũng nghiêm trọng tại dự án cao tốc',
    slug: 'xet-xu-vu-an-tham-nhung-nghiem-trong-tai-du-an-cao-toc',
    summary: 'Tòa án nhân dân cấp cao tại Hà Nội đang xét xử vụ án tham nhũng nghiêm trọng tại dự án đường cao tốc.',
    content: 'Tòa án nhân dân cấp cao tại Hà Nội đang xét xử vụ án tham nhũng nghiêm trọng tại dự án đường cao tốc với 15 bị cáo.\n\nTheo cáo trạng, các bị cáo đã lợi dụng chức vụ, quyền hạn trong quá trình thực hiện dự án, gây thiệt hại cho ngân sách nhà nước hàng trăm tỷ đồng.\n\nVụ án đang được dư luận đặc biệt quan tâm, thể hiện quyết tâm của Đảng và Nhà nước trong công tác phòng, chống tham nhũng, tiêu cực.',
    imageUrl: '/images/xetxuvuan.jpg',
    sourceUrl: 'https://vnexpress.net/phap-luat',
    publishedAt: new Date(),
    categoryId: 6
  },
  {
    title: 'Hà Nội triển khai nhiều giải pháp giảm ùn tắc giao thông',
    slug: 'ha-noi-trien-khai-nhieu-giai-phap-giam-un-tac-giao-thong',
    summary: 'UBND thành phố Hà Nội vừa ban hành kế hoạch triển khai nhiều giải pháp đồng bộ nhằm giảm ùn tắc giao thông trên địa bàn.',
    content: 'UBND thành phố Hà Nội vừa ban hành kế hoạch triển khai nhiều giải pháp đồng bộ nhằm giảm ùn tắc giao thông trên địa bàn.\n\nTheo đó, thành phố sẽ tập trung đầu tư xây dựng các công trình giao thông trọng điểm, phát triển hệ thống vận tải hành khách công cộng, tăng cường quản lý trật tự đô thị và xử lý nghiêm các vi phạm về trật tự an toàn giao thông.\n\nThành phố cũng sẽ đẩy mạnh ứng dụng công nghệ thông tin trong điều hành giao thông và nâng cao ý thức chấp hành pháp luật của người tham gia giao thông.',
    imageUrl: '/images/giaothong.jpg',
    sourceUrl: 'https://vnexpress.net/thoi-su',
    publishedAt: new Date(),
    categoryId: 1
  },
  {
    title: 'Quan hệ Việt Nam - Hoa Kỳ phát triển tích cực',
    slug: 'quan-he-viet-nam-hoa-ky-phat-trien-tich-cuc',
    summary: 'Quan hệ Việt Nam - Hoa Kỳ tiếp tục phát triển tích cực trên nhiều lĩnh vực sau 28 năm bình thường hóa quan hệ ngoại giao.',
    content: 'Quan hệ Việt Nam - Hoa Kỳ tiếp tục phát triển tích cực trên nhiều lĩnh vực sau 28 năm bình thường hóa quan hệ ngoại giao.\n\nHai nước đã tăng cường hợp tác trong các lĩnh vực kinh tế, thương mại, đầu tư, khoa học công nghệ, giáo dục đào tạo, quốc phòng an ninh và khắc phục hậu quả chiến tranh.\n\nHoa Kỳ hiện là một trong những đối tác thương mại hàng đầu của Việt Nam với kim ngạch thương mại song phương đạt gần 100 tỷ USD trong năm 2022.',
    imageUrl: '/images/VN-HK.jpg',
    sourceUrl: 'https://vnexpress.net/the-gioi',
    publishedAt: new Date(),
    categoryId: 2
  },
  {
    title: 'Doanh nghiệp Việt tăng cường xuất khẩu sang thị trường EU',
    slug: 'doanh-nghiep-viet-tang-cuong-xuat-khau-sang-thi-truong-eu',
    summary: 'Các doanh nghiệp Việt Nam đang tăng cường xuất khẩu sang thị trường EU, tận dụng hiệu quả Hiệp định EVFTA.',
    content: 'Các doanh nghiệp Việt Nam đang tăng cường xuất khẩu sang thị trường EU, tận dụng hiệu quả Hiệp định Thương mại tự do Việt Nam - EU (EVFTA).\n\nTheo số liệu của Tổng cục Hải quan, kim ngạch xuất khẩu của Việt Nam sang EU trong 5 tháng đầu năm 2023 đạt gần 20 tỷ USD, tăng 15% so với cùng kỳ năm ngoái.\n\nCác mặt hàng xuất khẩu chủ lực sang thị trường này bao gồm điện thoại và linh kiện, máy vi tính và sản phẩm điện tử, dệt may, giày dép, thủy sản, cà phê và đồ gỗ.',
    imageUrl: '/images/doanhnghiepvietnamtangmanh.webp',
    sourceUrl: 'https://vnexpress.net/kinh-doanh',
    publishedAt: new Date(),
    categoryId: 3
  },
  {
    title: 'Liên hoan phim Việt Nam lần thứ 23 sẽ diễn ra tại Huế',
    slug: 'lien-hoan-phim-viet-nam-lan-thu-23-se-dien-ra-tai-hue',
    summary: 'Liên hoan phim Việt Nam lần thứ 23 sẽ diễn ra tại thành phố Huế vào tháng 9 tới với sự tham gia của nhiều tác phẩm điện ảnh nổi bật.',
    content: 'Liên hoan phim Việt Nam lần thứ 23 sẽ diễn ra tại thành phố Huế vào tháng 9 tới với sự tham gia của nhiều tác phẩm điện ảnh nổi bật.\n\nSự kiện năm nay có chủ đề "Điện ảnh Việt Nam - Hội nhập và phát triển", quy tụ hơn 100 bộ phim thuộc các thể loại khác nhau.\n\nNgoài các hoạt động chính như chiếu phim, trao giải, liên hoan còn có nhiều hoạt động bên lề như tọa đàm về điện ảnh, triển lãm ảnh và giao lưu giữa các đạo diễn, diễn viên với khán giả.',
    imageUrl: '/images/LHVN.jpg',
    sourceUrl: 'https://vnexpress.net/giai-tri',
    publishedAt: new Date(),
    categoryId: 4
  }
];

const seedDatabase = async () => {
  try {
    // Sync database models
    await sequelize.sync({ force: true });
    logger.info('Database tables recreated successfully');

    // Seed categories
    const categories = await Category.bulkCreate(seedCategories);
    logger.info(`Seeded ${categories.length} categories successfully`);

    // Seed articles
    const articles = await Article.bulkCreate(seedArticles);
    logger.info(`Seeded ${articles.length} articles successfully`);

    logger.info('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    logger.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
