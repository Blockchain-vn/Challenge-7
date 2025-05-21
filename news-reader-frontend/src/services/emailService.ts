import { emailConfig } from '../utils/emailConfig';

// Trong môi trường thực tế, việc gửi email nên được thực hiện ở phía backend
// Đây là service giả lập việc gửi email OTP

/**
 * Tạo mã OTP ngẫu nhiên 6 chữ số
 */
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Giả lập việc gửi email OTP
 * Trong môi trường thực tế, hàm này sẽ gọi API backend để gửi email
 */
export const sendVerificationEmail = async (email: string, otp: string): Promise<boolean> => {
  try {
    // Log thông tin để kiểm tra
    console.log('Gửi email OTP:');
    console.log('- Từ:', emailConfig.EMAIL_USER);
    console.log('- Đến:', email);
    console.log('- Mã OTP:', otp);
    console.log('- Sử dụng SMTP:', emailConfig.EMAIL_HOST);

    // Giả lập việc gửi email thành công
    return true;
  } catch (error) {
    console.error('Lỗi khi gửi email:', error);
    return false;
  }
};

/**
 * Lưu OTP vào localStorage với thời gian hết hạn
 */
export const saveOTP = (userId: string, otp: string): void => {
  const expiryTime = new Date();
  expiryTime.setMinutes(expiryTime.getMinutes() + 5); // OTP hết hạn sau 5 phút
  
  const otpData = {
    otp,
    userId,
    expiry: expiryTime.getTime()
  };
  
  localStorage.setItem('otpData', JSON.stringify(otpData));
};

/**
 * Xác thực OTP từ localStorage
 */
export const verifyOTP = (userId: string, inputOTP: string): boolean => {
  const otpDataString = localStorage.getItem('otpData');
  
  if (!otpDataString) {
    return false;
  }
  
  const otpData = JSON.parse(otpDataString);
  
  // Kiểm tra userId, mã OTP và thời gian hết hạn
  if (
    otpData.userId === userId &&
    otpData.otp === inputOTP &&
    new Date().getTime() < otpData.expiry
  ) {
    // Xóa OTP sau khi xác thực thành công
    localStorage.removeItem('otpData');
    return true;
  }
  
  return false;
};
