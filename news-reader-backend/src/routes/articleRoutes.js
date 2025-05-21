import express from 'express';
import { getArticles, getArticleById, getArticleBySlug, createArticle, updateArticle, deleteArticle } from '../controllers/articleController.js';
import { adminAuth } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /api/articles:
 *   get:
 *     summary: Lấy tất cả bài viết với phân trang
 *     description: Lấy danh sách bài viết với hỗ trợ phân trang
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số lượng bài viết mỗi trang
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *         description: Lọc theo ID danh mục
 *     responses:
 *       200:
 *         description: Danh sách bài viết
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/', getArticles);

/**
 * @swagger
 * /api/articles/{id}:
 *   get:
 *     summary: Lấy bài viết theo ID
 *     description: Lấy một bài viết theo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID bài viết
 *     responses:
 *       200:
 *         description: Chi tiết bài viết
 *       404:
 *         description: Không tìm thấy bài viết
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/:id', getArticleById);

/**
 * @swagger
 * /api/articles/slug/{slug}:
 *   get:
 *     summary: Lấy bài viết theo slug
 *     description: Lấy một bài viết theo slug
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug bài viết
 *     responses:
 *       200:
 *         description: Chi tiết bài viết
 *       404:
 *         description: Không tìm thấy bài viết
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/slug/:slug', getArticleBySlug);

/**
 * @swagger
 * /api/articles:
 *   post:
 *     summary: Tạo bài viết mới
 *     description: Tạo một bài viết mới (chỉ dành cho admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - sourceUrl
 *               - categoryId
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               summary:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               sourceUrl:
 *                 type: string
 *               categoryId:
 *                 type: integer
 *               publishedAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Bài viết đã được tạo
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 *       403:
 *         description: Yêu cầu quyền admin
 *       500:
 *         description: Lỗi máy chủ
 */
router.post('/', adminAuth, createArticle);

/**
 * @swagger
 * /api/articles/{id}:
 *   put:
 *     summary: Cập nhật bài viết
 *     description: Cập nhật một bài viết (chỉ dành cho admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID bài viết
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               summary:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               sourceUrl:
 *                 type: string
 *               categoryId:
 *                 type: integer
 *               publishedAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Bài viết đã được cập nhật
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 *       403:
 *         description: Yêu cầu quyền admin
 *       404:
 *         description: Không tìm thấy bài viết
 *       500:
 *         description: Lỗi máy chủ
 */
router.put('/:id', adminAuth, updateArticle);

/**
 * @swagger
 * /api/articles/{id}:
 *   delete:
 *     summary: Xóa bài viết
 *     description: Xóa một bài viết (chỉ dành cho admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID bài viết
 *     responses:
 *       200:
 *         description: Bài viết đã được xóa
 *       401:
 *         description: Không có quyền truy cập
 *       403:
 *         description: Yêu cầu quyền admin
 *       404:
 *         description: Không tìm thấy bài viết
 *       500:
 *         description: Lỗi máy chủ
 */
router.delete('/:id', adminAuth, deleteArticle);

export default router;