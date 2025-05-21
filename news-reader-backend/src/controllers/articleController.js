import Article from '../models/Article.js';
import Category from '../models/Category.js';
import logger from '../utils/logger.js';
import slugify from 'slugify';
import { Op } from 'sequelize';

// Lấy tất cả bài viết với phân trang và lazy loading
export const getArticles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const categoryId = req.query.categoryId;

    const whereClause = categoryId ? { categoryId } : {};

    const { count, rows } = await Article.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        }
      ],
      order: [['publishedAt', 'DESC']],
      limit,
      offset
    });

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      articles: rows
    });
  } catch (error) {
    logger.error(`Lỗi lấy danh sách bài viết: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ',
      error: error.message
    });
  }
};

// Lấy bài viết theo ID
export const getArticleById = async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id, {
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        }
      ]
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài viết'
      });
    }

    res.status(200).json({
      success: true,
      article
    });
  } catch (error) {
    logger.error(`Lỗi lấy bài viết theo ID: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ',
      error: error.message
    });
  }
};

// Lấy bài viết theo slug
export const getArticleBySlug = async (req, res) => {
  try {
    const article = await Article.findOne({
      where: { slug: req.params.slug },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        }
      ]
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài viết'
      });
    }

    res.status(200).json({
      success: true,
      article
    });
  } catch (error) {
    logger.error(`Lỗi lấy bài viết theo slug: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ',
      error: error.message
    });
  }
};

// Thêm bài viết mới (chỉ admin)
export const createArticle = async (req, res) => {
  try {
    const { title, content, summary, imageUrl, sourceUrl, categoryId, publishedAt } = req.body;

    // Tạo slug từ tiêu đề
    const slug = slugify(title, {
      lower: true,
      strict: true,
      locale: 'vi'
    });

    // Kiểm tra xem slug đã tồn tại chưa
    const existingArticle = await Article.findOne({ where: { slug } });
    if (existingArticle) {
      return res.status(400).json({
        success: false,
        message: 'Tiêu đề đã tồn tại, vui lòng chọn tiêu đề khác'
      });
    }

    // Kiểm tra xem category có tồn tại không
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy danh mục'
      });
    }

    // Tạo bài viết mới
    const article = await Article.create({
      title,
      slug,
      content,
      summary,
      imageUrl,
      sourceUrl,
      categoryId,
      publishedAt: publishedAt || new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Tạo bài viết thành công',
      article
    });
  } catch (error) {
    logger.error(`Lỗi tạo bài viết: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ',
      error: error.message
    });
  }
};

// Cập nhật bài viết (chỉ admin)
export const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, summary, imageUrl, sourceUrl, categoryId, publishedAt } = req.body;

    // Kiểm tra xem bài viết có tồn tại không
    const article = await Article.findByPk(id);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài viết'
      });
    }

    // Nếu tiêu đề thay đổi, tạo slug mới và kiểm tra trùng lặp
    let slug = article.slug;
    if (title && title !== article.title) {
      slug = slugify(title, {
        lower: true,
        strict: true,
        locale: 'vi'
      });

      // Kiểm tra xem slug mới đã tồn tại chưa (trừ bài viết hiện tại)
      const existingArticle = await Article.findOne({
        where: { slug, id: { [Op.ne]: id } }
      });
      
      if (existingArticle) {
        return res.status(400).json({
          success: false,
          message: 'Tiêu đề đã tồn tại, vui lòng chọn tiêu đề khác'
        });
      }
    }

    // Nếu categoryId được cung cấp, kiểm tra xem category có tồn tại không
    if (categoryId) {
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy danh mục'
        });
      }
    }

    // Cập nhật bài viết
    await article.update({
      title: title || article.title,
      slug,
      content: content || article.content,
      summary: summary || article.summary,
      imageUrl: imageUrl || article.imageUrl,
      sourceUrl: sourceUrl || article.sourceUrl,
      categoryId: categoryId || article.categoryId,
      publishedAt: publishedAt || article.publishedAt
    });

    res.status(200).json({
      success: true,
      message: 'Cập nhật bài viết thành công',
      article
    });
  } catch (error) {
    logger.error(`Lỗi cập nhật bài viết: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ',
      error: error.message
    });
  }
};

// Xóa bài viết (chỉ admin)
export const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra xem bài viết có tồn tại không
    const article = await Article.findByPk(id);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài viết'
      });
    }

    // Xóa bài viết
    await article.destroy();

    res.status(200).json({
      success: true,
      message: 'Xóa bài viết thành công'
    });
  } catch (error) {
    logger.error(`Lỗi xóa bài viết: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ',
      error: error.message
    });
  }
};