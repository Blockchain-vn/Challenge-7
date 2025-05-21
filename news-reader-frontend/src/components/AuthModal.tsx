import { useState } from 'react';
import { Modal, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaKey, FaRedo } from 'react-icons/fa';
import { generateOTP, sendVerificationEmail, saveOTP, verifyOTP } from '../services/emailService.ts';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

interface AuthModalProps {
  show: boolean;
  onHide: () => void;
}

const AuthModal = ({ show, onHide }: AuthModalProps) => {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'danger' | 'warning'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setMessage(null);
    setShowOtpForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsLoading(true);

    // Kiểm tra dữ liệu đầu vào
    if (!email || !password) {
      setMessage({ type: 'danger', text: 'Vui lòng nhập đầy đủ email và mật khẩu' });
      setIsLoading(false);
      return;
    }

    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage({ type: 'danger', text: 'Email không đúng định dạng' });
      setIsLoading(false);
      return;
    }

    // Kiểm tra mật khẩu
    if (password.length < 6) {
      setMessage({ type: 'danger', text: 'Mật khẩu phải có ít nhất 6 ký tự' });
      setIsLoading(false);
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setMessage({ type: 'danger', text: 'Mật khẩu không khớp' });
      setIsLoading(false);
      return;
    }

    try {
      const API_URL = 'http://localhost:5000/api';
      
      if (isLogin) {
        // Đăng nhập
        const response = await axios.post(`${API_URL}/users/login`, { email, password });
        
        if (response.data.success) {
          // Đăng nhập thành công
          login(response.data.token, response.data.user);
          setMessage({ type: 'success', text: 'Đăng nhập thành công!' });
          setTimeout(() => {
            onHide();
          }, 1500);
        }
      } else {
        // Đăng ký
        const response = await axios.post(`${API_URL}/users/register`, { email, password });
        
        if (response.data.success) {
          // Tạo mã OTP
          const otp = generateOTP();
          setUserId(response.data.userId.toString());
          
          // Lưu OTP
          saveOTP(response.data.userId.toString(), otp);
          
          // Gửi email OTP
          const emailSent = await sendVerificationEmail(email, otp);
          
          if (emailSent) {
            setShowOtpForm(true);
            setMessage({ type: 'success', text: 'Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản.' });
          } else {
            setMessage({ type: 'danger', text: 'Không thể gửi email xác thực. Vui lòng thử lại sau.' });
          }
        }
      }
    } catch (error: any) {
      console.error('Error:', error);
      if (error.response && error.response.data) {
        setMessage({ type: 'danger', text: error.response.data.message || 'Đã xảy ra lỗi. Vui lòng thử lại sau.' });
      } else {
        setMessage({ type: 'danger', text: 'Đã xảy ra lỗi. Vui lòng thử lại sau.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsLoading(true);

    if (!otp || !userId) {
      setMessage({ type: 'danger', text: 'Vui lòng nhập mã OTP' });
      setIsLoading(false);
      return;
    }

    try {
      const API_URL = 'http://localhost:5000/api';
      
      // Xác thực OTP
      const isValid = verifyOTP(userId, otp);
      
      if (isValid) {
        // Gọi API để xác thực người dùng
        const response = await axios.put(`${API_URL}/users/verify/${userId}`);
        
        if (response.data.success) {
          // Đăng nhập người dùng sau khi xác thực
          const loginResponse = await axios.post(`${API_URL}/users/login`, { email, password });
          
          if (loginResponse.data.success) {
            login(loginResponse.data.token, loginResponse.data.user);
            setMessage({ type: 'success', text: 'Xác thực thành công!' });
            setTimeout(() => {
              onHide();
            }, 1500);
          }
        }
      } else {
        setMessage({ type: 'danger', text: 'Mã OTP không đúng hoặc đã hết hạn. Vui lòng thử lại.' });
      }
    } catch (error: any) {
      console.error('OTP verification error:', error);
      if (error.response && error.response.data) {
        setMessage({ type: 'danger', text: error.response.data.message || 'Đã xảy ra lỗi khi xác thực OTP. Vui lòng thử lại sau.' });
      } else {
        setMessage({ type: 'danger', text: 'Đã xảy ra lỗi khi xác thực OTP. Vui lòng thử lại sau.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      if (!email) {
        setMessage({ type: 'danger', text: 'Không có thông tin email để gửi lại OTP.' });
        return;
      }
      
      // Tạo mã OTP mới
      const newOtp = generateOTP();
      const newUserId = userId || `user_${Date.now()}`;
      setUserId(newUserId);
      
      // Lưu OTP mới
      saveOTP(newUserId, newOtp);
      
      // Gửi email OTP
      const emailSent = await sendVerificationEmail(email, newOtp);
      
      if (emailSent) {
        setMessage({ type: 'success', text: 'Đã gửi lại mã OTP. Vui lòng kiểm tra email của bạn.' });
      } else {
        setMessage({ type: 'danger', text: 'Không thể gửi lại mã OTP. Vui lòng thử lại sau.' });
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      setMessage({ type: 'danger', text: 'Đã xảy ra lỗi khi gửi lại mã OTP. Vui lòng thử lại sau.' });
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className="border-0">
        <Modal.Title>{isLogin ? 'Đăng nhập' : 'Đăng ký'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {message && <Alert variant={message.type}>{message.text}</Alert>}
        
        {!showOtpForm ? (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <FaEnvelope />
                </InputGroup.Text>
                <Form.Control
                  type="email"
                  placeholder="Nhập email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <FaLock />
                </InputGroup.Text>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </InputGroup>
              <Form.Text className="text-muted">
                Mật khẩu phải có ít nhất 6 ký tự.
              </Form.Text>
            </Form.Group>

            {!isLogin && (
              <Form.Group className="mb-3">
                <Form.Label>Xác nhận mật khẩu</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <FaLock />
                  </InputGroup.Text>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </InputGroup>
              </Form.Group>
            )}

            <div className="d-grid gap-2">
              <Button variant="primary" type="submit" disabled={isLoading}>
                {isLoading ? "Đang xử lý..." : (isLogin ? "Đăng nhập" : "Đăng ký")}
              </Button>
            </div>
          </Form>
        ) : (
          <Form onSubmit={handleOtpSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Mã xác thực OTP</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <FaKey />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Nhập mã OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </InputGroup>
              <Form.Text className="text-muted">
                Mã OTP đã được gửi đến email của bạn.
              </Form.Text>
            </Form.Group>

            <div className="d-grid gap-2 mb-2">
              <Button variant="primary" type="submit" disabled={isLoading}>
                {isLoading ? "Đang xử lý..." : "Xác thực"}
              </Button>
            </div>
            <div className="d-flex justify-content-center">
              <Button 
                variant="link" 
                onClick={resendOtp} 
                disabled={isLoading}
                className="d-flex align-items-center"
              >
                <FaRedo className="me-1" /> Gửi lại mã OTP
              </Button>
            </div>
          </Form>
        )}

        <div className="text-center mt-3">
          <p>
            {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}{' '}
            <Button variant="link" onClick={toggleForm} className="p-0">
              {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
            </Button>
          </p>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default AuthModal;
