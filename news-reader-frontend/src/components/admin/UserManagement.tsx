import React, { useState, useEffect } from 'react';
import { Table, Button, Alert, Modal } from 'react-bootstrap';
import axios from 'axios';
import { API_URL } from '../../utils/constants.ts';
import { useAuth } from '../../context/AuthContext';

interface User {
  id: number;
  email: string;
  role: string;
  verified: boolean;
  createdAt: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsers(response.data.users);
      setError(null);
    } catch (err: any) {
      console.error('Lỗi khi lấy danh sách người dùng:', err);
      setError(err.response?.data?.message || 'Đã xảy ra lỗi khi lấy danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handlePromoteClick = (userId: number) => {
    setSelectedUserId(userId);
    setShowPromoteModal(true);
  };

  const handlePromoteConfirm = async () => {
    if (!selectedUserId) return;
    
    try {
      await axios.put(`${API_URL}/api/users/promote/${selectedUserId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Cập nhật danh sách người dùng sau khi thăng cấp
      fetchUsers();
      setShowPromoteModal(false);
      setSelectedUserId(null);
    } catch (err: any) {
      console.error('Lỗi khi thăng cấp người dùng:', err);
      setError(err.response?.data?.message || 'Đã xảy ra lỗi khi thăng cấp người dùng');
    }
  };

  if (loading) {
    return <Alert variant="info">Đang tải danh sách người dùng...</Alert>;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div>
      <h2 className="mb-4">Quản lý Người dùng</h2>
      
      {users.length === 0 ? (
        <Alert variant="info">Không có người dùng nào.</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.email}</td>
                <td>{user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}</td>
                <td>{user.verified ? 'Đã xác thực' : 'Chưa xác thực'}</td>
                <td>{new Date(user.createdAt).toLocaleDateString('vi-VN')}</td>
                <td>
                  {user.role !== 'admin' && (
                    <Button 
                      variant="warning" 
                      size="sm" 
                      onClick={() => handlePromoteClick(user.id)}
                    >
                      Thăng cấp Admin
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modal xác nhận thăng cấp */}
      <Modal show={showPromoteModal} onHide={() => setShowPromoteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận thăng cấp</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Bạn có chắc chắn muốn thăng cấp người dùng này lên quyền Admin?</p>
          <p>Hành động này không thể hoàn tác.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPromoteModal(false)}>
            Hủy
          </Button>
          <Button variant="warning" onClick={handlePromoteConfirm}>
            Thăng cấp
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserManagement;
