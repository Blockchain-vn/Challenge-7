import User from '../models/User.js';
import logger from '../utils/logger.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Đăng ký người dùng mới
export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra xem email đã tồn tại chưa
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email đã được sử dụng'
      });
    }

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo người dùng mới
    const user = await User.create({
      email,
      password: hashedPassword,
      role: 'user',
      verified: false
    });

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      userId: user.id
    });
  } catch (error) {
    logger.error(`Lỗi đăng ký: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ',
      error: error.message
    });
  }
};

// Xác thực người dùng
export const verifyUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Người dùng không tồn tại'
      });
    }

    user.verified = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Xác thực người dùng thành công'
    });
  } catch (error) {
    logger.error(`Lỗi xác thực người dùng: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ',
      error: error.message
    });
  }
};

// Đăng nhập
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm người dùng theo email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Email chưa được đăng ký'
      });
    }

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu không đúng'
      });
    }

    // Kiểm tra xác thực
    if (!user.verified) {
      return res.status(401).json({
        success: false,
        message: 'Tài khoản chưa được xác thực',
        userId: user.id
      });
    }

    // Tạo JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    logger.error(`Lỗi đăng nhập: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ',
      error: error.message
    });
  }
};

// Lấy thông tin người dùng hiện tại
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Người dùng không tồn tại'
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    logger.error(`Lỗi lấy thông tin người dùng: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ',
      error: error.message
    });
  }
};

// Thăng cấp người dùng lên admin (chỉ admin hiện tại mới có thể thực hiện)
export const promoteToAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Kiểm tra xem người thực hiện có phải admin không
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền thực hiện hành động này'
      });
    }
    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Người dùng không tồn tại'
      });
    }

    user.role = 'admin';
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Thăng cấp người dùng lên admin thành công'
    });
  } catch (error) {
    logger.error(`Lỗi thăng cấp người dùng: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ',
      error: error.message
    });
  }
};

// Lấy danh sách tất cả người dùng (chỉ admin mới có thể thực hiện)
export const getAllUsers = async (req, res) => {
  try {
    // Kiểm tra xem người thực hiện có phải admin không
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền thực hiện hành động này'
      });
    }
    
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    logger.error(`Lỗi lấy danh sách người dùng: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ',
      error: error.message
    });
  }
};
