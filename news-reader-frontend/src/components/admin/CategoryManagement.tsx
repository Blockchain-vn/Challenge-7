import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

interface Category {
  id: number;
  name: string;
  slug: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

const CategoryManagement: React.FC = () => {
  const { token } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Partial<Category>>({});
  const API_URL = 'http://localhost:5000/api';

  // Lấy danh sách danh mục
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/categories`);
      if (response.data.success) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách danh mục:', error);
      setError('Không thể tải danh sách danh mục. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Xử lý thay đổi trường của danh mục
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentCategory({ ...currentCategory, [name]: value });
  };

  // Mở modal để thêm danh mục mới
  const handleAddCategory = () => {
    setCurrentCategory({
      name: '',
      url: ''
    });
    setEditMode(false);
    setShowModal(true);
  };

  // Mở modal để chỉnh sửa danh mục
  const handleEditCategory = (category: Category) => {
    setCurrentCategory({ ...category });
    setEditMode(true);
    setShowModal(true);
  };

  // Lưu danh mục (thêm mới hoặc cập nhật)
  const handleSaveCategory = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      if (editMode) {
        // Cập nhật danh mục
        const response = await axios.put(
          `${API_URL}/categories/${currentCategory.id}`,
          currentCategory,
          config
        );
        if (response.data.success) {
          setCategories(categories.map(category => 
            category.id === currentCategory.id ? response.data.category : category
          ));
          setShowModal(false);
          setError(null);
        }
      } else {
        // Thêm danh mục mới
        const response = await axios.post(
          `${API_URL}/categories`,
          currentCategory,
          config
        );
        if (response.data.success) {
          fetchCategories(); // Tải lại danh sách danh mục
          setShowModal(false);
          setError(null);
        }
      }
    } catch (error: any) {
      console.error('Lỗi khi lưu danh mục:', error);
      setError(error.response?.data?.message || 'Có lỗi xảy ra khi lưu danh mục. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Xóa danh mục
  const handleDeleteCategory = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này không? Lưu ý: Không thể xóa danh mục đang có bài viết.')) {
      try {
        setLoading(true);
        const response = await axios.delete(`${API_URL}/categories/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.data.success) {
          setCategories(categories.filter(category => category.id !== id));
          setError(null);
        }
      } catch (error: any) {
        console.error('Lỗi khi xóa danh mục:', error);
        setError(error.response?.data?.message || 'Có lỗi xảy ra khi xóa danh mục. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Quản lý Danh mục</h2>
        <Button variant="primary" onClick={handleAddCategory}>
          Thêm danh mục mới
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading && <Alert variant="info">Đang tải...</Alert>}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên danh mục</th>
            <th>Slug</th>
            <th>URL</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(category => (
            <tr key={category.id}>
              <td>{category.id}</td>
              <td>{category.name}</td>
              <td>{category.slug}</td>
              <td>{category.url}</td>
              <td>
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  className="me-2"
                  onClick={() => handleEditCategory(category)}
                >
                  Sửa
                </Button>
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  onClick={() => handleDeleteCategory(category.id)}
                >
                  Xóa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal thêm/sửa danh mục */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tên danh mục</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={currentCategory.name || ''}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>URL</Form.Label>
              <Form.Control
                type="text"
                name="url"
                value={currentCategory.url || ''}
                onChange={handleInputChange}
                required
              />
              <Form.Text className="text-muted">
                URL nguồn để lấy bài viết (ví dụ: https://tuoitre.vn/thoi-su.htm)
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleSaveCategory} disabled={loading}>
            {loading ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CategoryManagement;
