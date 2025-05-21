import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

interface Article {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  imageUrl: string;
  sourceUrl: string;
  categoryId: number;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

const ArticleManagement: React.FC = () => {
  const { token } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<Partial<Article>>({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const API_URL = 'http://localhost:5000/api';

  // Lấy danh sách bài viết
  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/articles?page=${page}&limit=10`);
      if (response.data.success) {
        setArticles(response.data.articles);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách bài viết:', error);
      setError('Không thể tải danh sách bài viết. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Lấy danh sách danh mục
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      if (response.data.success) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách danh mục:', error);
    }
  };

  useEffect(() => {
    fetchArticles();
    fetchCategories();
  }, [page]);

  // Xử lý thay đổi trường của bài viết
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentArticle({ ...currentArticle, [name]: value });
  };

  // Mở modal để thêm bài viết mới
  const handleAddArticle = () => {
    setCurrentArticle({
      title: '',
      summary: '',
      content: '',
      imageUrl: '',
      sourceUrl: '',
      categoryId: categories[0]?.id || 0,
      publishedAt: new Date().toISOString().slice(0, 16)
    });
    setEditMode(false);
    setShowModal(true);
  };

  // Mở modal để chỉnh sửa bài viết
  const handleEditArticle = (article: Article) => {
    setCurrentArticle({
      ...article,
      publishedAt: new Date(article.publishedAt).toISOString().slice(0, 16)
    });
    setEditMode(true);
    setShowModal(true);
  };

  // Lưu bài viết (thêm mới hoặc cập nhật)
  const handleSaveArticle = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      if (editMode) {
        // Cập nhật bài viết
        const response = await axios.put(
          `${API_URL}/articles/${currentArticle.id}`,
          currentArticle,
          config
        );
        if (response.data.success) {
          setArticles(articles.map(article => 
            article.id === currentArticle.id ? response.data.article : article
          ));
          setShowModal(false);
          setError(null);
        }
      } else {
        // Thêm bài viết mới
        const response = await axios.post(
          `${API_URL}/articles`,
          currentArticle,
          config
        );
        if (response.data.success) {
          fetchArticles(); // Tải lại danh sách bài viết
          setShowModal(false);
          setError(null);
        }
      }
    } catch (error: any) {
      console.error('Lỗi khi lưu bài viết:', error);
      setError(error.response?.data?.message || 'Có lỗi xảy ra khi lưu bài viết. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Xóa bài viết
  const handleDeleteArticle = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) {
      try {
        setLoading(true);
        const response = await axios.delete(`${API_URL}/articles/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.data.success) {
          setArticles(articles.filter(article => article.id !== id));
          setError(null);
        }
      } catch (error: any) {
        console.error('Lỗi khi xóa bài viết:', error);
        setError(error.response?.data?.message || 'Có lỗi xảy ra khi xóa bài viết. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Quản lý Bài viết</h2>
        <Button variant="primary" onClick={handleAddArticle}>
          Thêm bài viết mới
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading && <Alert variant="info">Đang tải...</Alert>}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tiêu đề</th>
            <th>Danh mục</th>
            <th>Ngày đăng</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {articles.map(article => (
            <tr key={article.id}>
              <td>{article.id}</td>
              <td>{article.title}</td>
              <td>{article.category?.name || 'Không có danh mục'}</td>
              <td>{new Date(article.publishedAt).toLocaleDateString('vi-VN')}</td>
              <td>
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  className="me-2"
                  onClick={() => handleEditArticle(article)}
                >
                  Sửa
                </Button>
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  onClick={() => handleDeleteArticle(article.id)}
                >
                  Xóa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Phân trang */}
      <div className="d-flex justify-content-center mt-4">
        <Button 
          variant="outline-primary" 
          disabled={page === 1} 
          onClick={() => setPage(page - 1)}
          className="me-2"
        >
          Trang trước
        </Button>
        <span className="mx-3 pt-2">
          Trang {page} / {totalPages}
        </span>
        <Button 
          variant="outline-primary" 
          disabled={page === totalPages} 
          onClick={() => setPage(page + 1)}
        >
          Trang sau
        </Button>
      </div>

      {/* Modal thêm/sửa bài viết */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tiêu đề</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={currentArticle.title || ''}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Danh mục</Form.Label>
                  <Form.Select
                    name="categoryId"
                    value={currentArticle.categoryId || ''}
                    onChange={handleInputChange}
                    required
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ngày đăng</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="publishedAt"
                    value={currentArticle.publishedAt || ''}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Tóm tắt</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="summary"
                value={currentArticle.summary || ''}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nội dung</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="content"
                value={currentArticle.content || ''}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>URL hình ảnh</Form.Label>
                  <Form.Control
                    type="text"
                    name="imageUrl"
                    value={currentArticle.imageUrl || ''}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>URL nguồn</Form.Label>
                  <Form.Control
                    type="text"
                    name="sourceUrl"
                    value={currentArticle.sourceUrl || ''}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleSaveArticle} disabled={loading}>
            {loading ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ArticleManagement;
