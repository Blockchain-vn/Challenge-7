import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Middleware xác thực token
export const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Không tìm thấy token xác thực'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Người dùng không tồn tại'
      });
    }

    req.token = token;
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    res.status(401).json({
      success: false,
      message: 'Vui lòng xác thực lại'
    });
  }
};

// Middleware kiểm tra quyền admin
export const adminAuth = async (req, res, next) => {
  try {
    // Sử dụng middleware auth trước
    await auth(req, res, async () => {
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Truy cập bị từ chối. Yêu cầu quyền admin.'
        });
      }
      next();
    });
  } catch (error) {
    console.error('Admin auth error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ'
    });
  }
};
