import Category from '../models/Category.js';
import Article from '../models/Article.js';
import logger from '../utils/logger.js';
import slugify from 'slugify';
import { Op } from 'sequelize';

// Lấy tất cả danh mục
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({
            order: [['name', 'ASC']]
        });

        res.status(200).json({
            success: true,
            count: categories.length,
            categories
        });
    } catch (error) {
        logger.error(`Lỗi lấy danh sách danh mục: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ',
            error: error.message
        });
    }
};

// Lấy danh mục theo ID
export const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy danh mục'
            });
        }

        res.status(200).json({
            success: true,
            category
        });
    } catch (error) {
        logger.error(`Lỗi lấy danh mục theo ID: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ',
            error: error.message
        });
    }
};

// Lấy danh mục theo slug
export const getCategoryBySlug = async (req, res) => {
    try {
        const category = await Category.findOne({
            where: { slug: req.params.slug }
        });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy danh mục'
            });
        }

        res.status(200).json({
            success: true,
            category
        });
    } catch (error) {
        logger.error(`Lỗi lấy danh mục theo slug: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ',
            error: error.message
        });
    }
};

// Tạo danh mục mới (chỉ admin)
export const createCategory = async (req, res) => {
    try {
        const { name, url } = req.body;

        // Tạo slug từ tên danh mục
        const slug = slugify(name, {
            lower: true,
            strict: true,
            locale: 'vi'
        });

        // Kiểm tra xem slug đã tồn tại chưa
        const existingCategory = await Category.findOne({ where: { slug } });
        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: 'Tên danh mục đã tồn tại, vui lòng chọn tên khác'
            });
        }

        // Tạo danh mục mới
        const category = await Category.create({
            name,
            slug,
            url
        });

        res.status(201).json({
            success: true,
            message: 'Tạo danh mục thành công',
            category
        });
    } catch (error) {
        logger.error(`Lỗi tạo danh mục: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ',
            error: error.message
        });
    }
};

// Cập nhật danh mục (chỉ admin)
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, url } = req.body;

        // Kiểm tra xem danh mục có tồn tại không
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy danh mục'
            });
        }

        // Nếu tên thay đổi, tạo slug mới và kiểm tra trùng lặp
        let slug = category.slug;
        if (name && name !== category.name) {
            slug = slugify(name, {
                lower: true,
                strict: true,
                locale: 'vi'
            });

            // Kiểm tra xem slug mới đã tồn tại chưa (trừ danh mục hiện tại)
            const existingCategory = await Category.findOne({
                where: { slug, id: { [Op.ne]: id } }
            });
            
            if (existingCategory) {
                return res.status(400).json({
                    success: false,
                    message: 'Tên danh mục đã tồn tại, vui lòng chọn tên khác'
                });
            }
        }

        // Cập nhật danh mục
        await category.update({
            name: name || category.name,
            slug,
            url: url || category.url
        });

        res.status(200).json({
            success: true,
            message: 'Cập nhật danh mục thành công',
            category
        });
    } catch (error) {
        logger.error(`Lỗi cập nhật danh mục: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ',
            error: error.message
        });
    }
};

// Xóa danh mục (chỉ admin)
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        // Kiểm tra xem danh mục có tồn tại không
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy danh mục'
            });
        }

        // Kiểm tra xem danh mục có bài viết không
        const articlesCount = await Article.count({ where: { categoryId: id } });
        if (articlesCount > 0) {
            return res.status(400).json({
                success: false,
                message: 'Không thể xóa danh mục này vì đang có bài viết thuộc danh mục. Vui lòng chuyển hoặc xóa các bài viết trước.'
            });
        }

        // Xóa danh mục
        await category.destroy();

        res.status(200).json({
            success: true,
            message: 'Xóa danh mục thành công'
        });
    } catch (error) {
        logger.error(`Lỗi xóa danh mục: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ',
            error: error.message
        });
    }
};