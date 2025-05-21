import { useEffect, useState } from 'react';
import { Navbar, Container, Nav, Row, Col, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getCategories } from '../services/api';
import { FaSearch, FaUserCircle, FaLock } from 'react-icons/fa';
import AuthModal from './AuthModal';
import { useAuth } from '../context/AuthContext';

interface Category {
    id: number;
    name: string;
    slug: string;
}

const Header = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState('');
    const [currentTemp] = useState('26\u00b0 - 35\u00b0C');
    const [currentLocation] = useState('TP. H\u1ed3 Ch\u00ed Minh');
    const [showAuthModal, setShowAuthModal] = useState(false);
    
    // Sử dụng AuthContext thay vì state local
    const { isAuthenticated, isAdmin, user, logout } = useAuth();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const data = await getCategories();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
        
        // Format current date in Vietnamese
        const now = new Date();
        const formattedDate = `Thứ ${now.getDay() === 0 ? 'Chủ nhật' : now.getDay() + 1}, ngày ${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
        setCurrentDate(formattedDate);
    }, []);
    
    const handleLogout = () => {
        logout();
    };

    return (
        <header className="tuoi-tre-header">
            {/* Auth Modal */}
            <AuthModal show={showAuthModal} onHide={() => setShowAuthModal(false)} />
            {/* Top info bar */}
            <div className="top-info-bar">
                <Container>
                    <Row className="align-items-center py-2">
                        <Col xs={12} md={6} className="d-flex align-items-center">
                            <div className="date-info me-3">
                                <span>Tìm từ, ngày {currentDate}</span>
                            </div>
                            <div className="weather-info">
                                <span>{currentLocation} - {currentTemp}</span>
                            </div>
                        </Col>
                        <Col xs={12} md={6} className="d-flex justify-content-end">
                            <div className="d-flex align-items-center">
                                <a href="#" className="me-3 text-decoration-none">Podcast</a>
                                <a href="#" className="me-3 text-decoration-none">YouTube</a>
                                <a href="#" className="me-3 text-decoration-none">Cần biết</a>
                                <a href="#" className="me-3 text-decoration-none">Báo viết</a>
                                {isAuthenticated ? (
                                    <div className="d-flex align-items-center">
                                        <span className="me-2">{user?.email}</span>
                                        {isAdmin && (
                                            <Link to="/admin" className="btn btn-sm btn-success me-2">
                                                <FaLock className="me-1" /> Quản trị
                                            </Link>
                                        )}
                                        <Button variant="outline-danger" size="sm" className="me-2" onClick={handleLogout}>
                                            Đăng xuất
                                        </Button>
                                        <FaUserCircle size={20} />
                                    </div>
                                ) : (
                                    <div className="d-flex align-items-center">
                                        <Button variant="danger" size="sm" className="me-2" onClick={() => setShowAuthModal(true)}>
                                            Đăng nhập / Đăng ký
                                        </Button>
                                        <FaUserCircle size={20} />
                                    </div>
                                )}
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Logo and search */}
            <Container className="py-2">
                <Row className="align-items-center">
                    <Col xs={12} md={3}>
                        <Link to="/" className="d-block">
                            <img src="/images/tuoitre-online-logo.png" alt="Tuổi Trẻ" className="tuoi-tre-logo" height={50}/>
                        </Link>
                    </Col>
                    <Col xs={12} md={9} className="d-flex justify-content-end">
                        <Form className="d-flex">
                            <Form.Control
                                type="search"
                                placeholder="Tìm kiếm"
                                className="me-2"
                                aria-label="Search"
                            />
                            <Button variant="outline-danger"><FaSearch /></Button>
                        </Form>
                    </Col>
                </Row>
            </Container>

            {/* Main navigation */}
            <Navbar bg="danger" variant="dark" expand="lg" sticky="top" className="py-0">
                <Container>
                    <Navbar.Toggle aria-controls="main-navbar-nav" />
                    <Navbar.Collapse id="main-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/" className="nav-link-tuoi-tre">TRANG CHỦ</Nav.Link>
                            {!loading && categories.length > 0 && (
                                categories.map(category => (
                                    <Nav.Link 
                                        key={category.id}
                                        as={Link}
                                        to={`/category/${category.slug}`}
                                        className="nav-link-tuoi-tre"
                                    >
                                        {category.name.toUpperCase()}
                                    </Nav.Link>
                                ))
                            )}
                            <Nav.Link as={Link} to="/" className="nav-link-tuoi-tre">VIDEO</Nav.Link>
                            <Nav.Link as={Link} to="/" className="nav-link-tuoi-tre">THỜI SỰ</Nav.Link>
                            <Nav.Link as={Link} to="/" className="nav-link-tuoi-tre">THẾ GIỚI</Nav.Link>
                            <Nav.Link as={Link} to="/" className="nav-link-tuoi-tre">PHÁP LUẬT</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
};

export default Header;
