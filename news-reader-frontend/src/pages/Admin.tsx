import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Nav, Tab, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ArticleManagement from '../components/admin/ArticleManagement';
import CategoryManagement from '../components/admin/CategoryManagement';
import UserManagement from '../components/admin/UserManagement';

const Admin: React.FC = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('articles');

  useEffect(() => {
    // Nếu không phải admin hoặc chưa đăng nhập, chuyển hướng về trang chủ
    if (!loading && (!isAuthenticated || !isAdmin)) {
      navigate('/');
    }
  }, [isAuthenticated, isAdmin, loading, navigate]);

  if (loading) {
    return (
      <Container className="py-5">
        <Alert variant="info">Đang tải...</Alert>
      </Container>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null; // Sẽ được chuyển hướng bởi useEffect
  }

  return (
    <Container className="py-4">
      <h1 className="mb-4">Trang Quản Trị</h1>
      
      <Tab.Container id="admin-tabs" activeKey={activeTab} onSelect={(k) => k && setActiveTab(k)}>
        <Row>
          <Col md={3}>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="articles">Quản lý Bài viết</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="categories">Quản lý Danh mục</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="users">Quản lý Người dùng</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col md={9}>
            <Tab.Content>
              <Tab.Pane eventKey="articles">
                <ArticleManagement />
              </Tab.Pane>
              <Tab.Pane eventKey="categories">
                <CategoryManagement />
              </Tab.Pane>
              <Tab.Pane eventKey="users">
                <UserManagement />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
};

export default Admin;
