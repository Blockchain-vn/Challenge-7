import express from 'express';
import { getCategories, getCategoryById, getCategoryBySlug, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js';
import { adminAuth } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Lấy tất cả danh mục
 *     description: Lấy danh sách tất cả danh mục
 *     responses:
 *       200:
 *         description: Danh sách danh mục
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/', getCategories);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Lấy danh mục theo ID
 *     description: Lấy một danh mục theo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID danh mục
 *     responses:
 *       200:
 *         description: Chi tiết danh mục
 *       404:
 *         description: Không tìm thấy danh mục
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/:id', getCategoryById);

/**
 * @swagger
 * /api/categories/slug/{slug}:
 *   get:
 *     summary: Lấy danh mục theo slug
 *     description: Lấy một danh mục theo slug
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug danh mục
 *     responses:
 *       200:
 *         description: Chi tiết danh mục
 *       404:
 *         description: Không tìm thấy danh mục
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/slug/:slug', getCategoryBySlug);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Tạo danh mục mới
 *     description: Tạo một danh mục mới (chỉ dành cho admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - url
 *             properties:
 *               name:
 *                 type: string
 *               url:
 *                 type: string
 *     responses:
 *       201:
 *         description: Danh mục đã được tạo
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 *       403:
 *         description: Yêu cầu quyền admin
 *       500:
 *         description: Lỗi máy chủ
 */
router.post('/', adminAuth, createCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Cập nhật danh mục
 *     description: Cập nhật một danh mục (chỉ dành cho admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID danh mục
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Danh mục đã được cập nhật
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 *       403:
 *         description: Yêu cầu quyền admin
 *       404:
 *         description: Không tìm thấy danh mục
 *       500:
 *         description: Lỗi máy chủ
 */
router.put('/:id', adminAuth, updateCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Xóa danh mục
 *     description: Xóa một danh mục (chỉ dành cho admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID danh mục
 *     responses:
 *       200:
 *         description: Danh mục đã được xóa
 *       400:
 *         description: Không thể xóa danh mục có bài viết
 *       401:
 *         description: Không có quyền truy cập
 *       403:
 *         description: Yêu cầu quyền admin
 *       404:
 *         description: Không tìm thấy danh mục
 *       500:
 *         description: Lỗi máy chủ
 */
router.delete('/:id', adminAuth, deleteCategory);

export default router;