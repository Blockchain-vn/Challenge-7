import express from 'express';
import { register, login, verifyUser, getCurrentUser, promoteToAdmin, getAllUsers } from '../controllers/userController.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Đăng ký người dùng mới
 *     description: Tạo tài khoản người dùng mới
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *       400:
 *         description: Email đã tồn tại
 *       500:
 *         description: Lỗi máy chủ
 */
router.post('/register', register);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Đăng nhập
 *     description: Đăng nhập vào hệ thống
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *       400:
 *         description: Mật khẩu không đúng
 *       401:
 *         description: Tài khoản chưa được xác thực
 *       404:
 *         description: Email chưa được đăng ký
 *       500:
 *         description: Lỗi máy chủ
 */
router.post('/login', login);

/**
 * @swagger
 * /api/users/verify/{userId}:
 *   put:
 *     summary: Xác thực người dùng
 *     description: Xác thực tài khoản người dùng
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của người dùng
 *     responses:
 *       200:
 *         description: Xác thực thành công
 *       404:
 *         description: Người dùng không tồn tại
 *       500:
 *         description: Lỗi máy chủ
 */
router.put('/verify/:userId', verifyUser);

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Lấy thông tin người dùng hiện tại
 *     description: Lấy thông tin người dùng đã đăng nhập
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin người dùng
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Người dùng không tồn tại
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/me', auth, getCurrentUser);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Lấy danh sách tất cả người dùng
 *     description: Lấy danh sách tất cả người dùng (chỉ dành cho admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách người dùng
 *       401:
 *         description: Không có quyền truy cập
 *       403:
 *         description: Yêu cầu quyền admin
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/', adminAuth, getAllUsers);

/**
 * @swagger
 * /api/users/promote/{userId}:
 *   put:
 *     summary: Thăng cấp người dùng lên admin
 *     description: Thăng cấp người dùng lên admin (chỉ dành cho admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của người dùng
 *     responses:
 *       200:
 *         description: Thăng cấp thành công
 *       401:
 *         description: Không có quyền truy cập
 *       403:
 *         description: Yêu cầu quyền admin
 *       404:
 *         description: Người dùng không tồn tại
 *       500:
 *         description: Lỗi máy chủ
 */
router.put('/promote/:userId', adminAuth, promoteToAdmin);

export default router;
