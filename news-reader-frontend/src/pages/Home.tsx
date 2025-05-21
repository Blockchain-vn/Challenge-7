import { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Spinner, Alert, Carousel, Card, Badge } from 'react-bootstrap';
import ArticleCard from '../components/ArticleCard';
import CategorySection from '../components/CategorySection';
import { getArticles, getCategories } from '../services/api';
import { FaRegBookmark, FaShareAlt, FaClock, FaEye } from 'react-icons/fa';

interface Article {
    id: number;
    title: string;
    summary: string;
    content?: string;
    imageUrl: string;
    sourceUrl: string;
    publishedAt: string;
    categoryId: number;
    category?: {
        id: number;
        name: string;
        slug: string;
    };
}

interface ApiResponse {
    success: boolean;
    count: number;
    totalPages: number;
    currentPage: number;
    articles: Article[];
}

const Home = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
    const [categories, setCategories] = useState<{id: number; name: string; slug: string}[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);

    const fetchArticles = async (pageNum: number) => {
        try {
            setLoading(true);
            setError(null);

            // Use real API
            const response = await getArticles(pageNum, 10);
            const data = response as ApiResponse;

            if (data.success) {
                if (pageNum === 1) {
                    setArticles(data.articles);
                } else {
                    setArticles(prev => [...prev, ...data.articles]);
                }

                setHasMore(data.currentPage < data.totalPages);
            } else {
                setError('Failed to fetch articles');
            }
        } catch (err) {
            setError('Error fetching articles. Please try again later.');
            console.error('Error fetching articles:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles(page);
        fetchFeaturedArticles();
        fetchCategories();
    }, [page]);
    
    const fetchFeaturedArticles = async () => {
        try {
            const response = await getArticles(1, 5);
            const data = response as ApiResponse;
            
            if (data.success && data.articles.length > 0) {
                setFeaturedArticles(data.articles.slice(0, 5));
            }
        } catch (err) {
            console.error('Error fetching featured articles:', err);
        }
    };
    
    const fetchCategories = async () => {
        try {
            const categoriesData = await getCategories();
            setCategories(categoriesData);
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            setPage(prevPage => prevPage + 1);
        }
    };

    return (
        <Container className="mt-4">
            {error && (
                <Alert variant="danger" className="mb-4">
                    {error}
                </Alert>
            )}

            {/* Carousel for featured articles */}
            {featuredArticles.length > 0 && (
                <div className="mb-4">
                    <div className="section-header d-flex justify-content-between align-items-center mb-3">
                        <h2 className="section-title-tuoi-tre border-start border-danger border-4 ps-2">TIN NỔI BẬT</h2>
                    </div>
                    <Carousel 
                        className="featured-carousel" 
                        indicators={true} 
                        controls={true}
                        interval={5000}
                        pause="hover"
                    >
                        {featuredArticles.map(article => (
                            <Carousel.Item key={article.id}>
                                <div className="position-relative">
                                    <img
                                        className="d-block w-100"
                                        src={article.imageUrl}
                                        alt={article.title}
                                        style={{ height: '450px', objectFit: 'cover' }}
                                    />
                                    <div className="position-absolute bottom-0 start-0 w-100 p-3" 
                                        style={{ 
                                            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0) 100%)',
                                            padding: '30px 20px 20px'
                                        }}>
                                        <div className="d-flex mb-2">
                                            {article.category && (
                                                <Badge bg="danger" className="me-2">{article.category.name}</Badge>
                                            )}
                                            <small className="text-white">
                                                <FaClock className="me-1" size={12} />
                                                {new Date(article.publishedAt).toLocaleDateString('vi-VN')}
                                            </small>
                                        </div>
                                        <h2 className="text-white fw-bold mb-2" style={{ fontSize: '1.8rem' }}>{article.title}</h2>
                                        <p className="text-white-50 d-none d-md-block">{article.summary}</p>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <Button 
                                                variant="danger" 
                                                onClick={() => window.location.href = `/article/${article.id}`}
                                                size="sm"
                                                className="rounded-pill px-3"
                                            >
                                                Đọc tiếp
                                            </Button>
                                            <div>
                                                <Button 
                                                    variant="light" 
                                                    size="sm" 
                                                    className="rounded-circle me-2"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        const url = window.location.origin + `/article/${article.id}`;
                                                        navigator.clipboard.writeText(url)
                                                            .then(() => alert('Đã sao chép liên kết!'))
                                                            .catch(err => console.error('Không thể sao chép: ', err));
                                                    }}
                                                >
                                                    <FaShareAlt />
                                                </Button>
                                                <Button 
                                                    variant="light" 
                                                    size="sm" 
                                                    className="rounded-circle"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        const savedArticles = JSON.parse(localStorage.getItem('savedArticles') || '[]');
                                                        const isArticleSaved = savedArticles.some((saved: any) => saved.id === article.id);
                                                        
                                                        if (isArticleSaved) {
                                                            const filtered = savedArticles.filter((saved: any) => saved.id !== article.id);
                                                            localStorage.setItem('savedArticles', JSON.stringify(filtered));
                                                        } else {
                                                            savedArticles.push({
                                                                id: article.id,
                                                                title: article.title,
                                                                description: article.summary,
                                                                imageUrl: article.imageUrl,
                                                                publishedAt: article.publishedAt,
                                                                categoryName: article.category?.name
                                                            });
                                                            localStorage.setItem('savedArticles', JSON.stringify(savedArticles));
                                                        }
                                                        alert(isArticleSaved ? 'Đã bỏ lưu bài viết' : 'Đã lưu bài viết');
                                                    }}
                                                >
                                                    <FaRegBookmark />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </div>
            )}

            <Row className="mt-4">
                {/* Main content - 8 columns */}
                <Col lg={8}>
                    {/* Tin mới nhất - Latest news */}
                    <div className="latest-news mb-4">
                        <div className="section-header d-flex justify-content-between align-items-center mb-3">
                            <h2 className="section-title-tuoi-tre">TIN MỚI NHẤT</h2>
                        </div>
                        <Row>
                            {articles.length > 0 && articles.slice(0, 1).map(article => (
                                <Col key={article.id} xs={12} className="mb-4">
                                    <div className="main-article">
                                        <img 
                                            src={article.imageUrl || 'https://via.placeholder.com/600x300'}
                                            alt={article.title}
                                            className="w-100 mb-2"
                                            style={{ height: '350px', objectFit: 'cover' }}
                                        />
                                        <h3 className="main-article-title mt-2">
                                            <a href={`/article/${article.id}`} className="text-decoration-none text-dark">
                                                {article.title}
                                            </a>
                                        </h3>
                                        <p className="main-article-summary">{article.summary}</p>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                        <Row>
                            {articles.length > 0 && articles.slice(1, 5).map(article => (
                                <Col key={article.id} md={6} className="mb-3">
                                    <ArticleCard article={{
                                        id: article.id,
                                        title: article.title,
                                        description: article.summary,
                                        imageUrl: article.imageUrl || 'https://via.placeholder.com/300x150'
                                    }} />
                                </Col>
                            ))}
                        </Row>
                    </div>
                    
                    {/* Category sections */}
                    {categories.map(category => (
                        <CategorySection 
                            key={category.id}
                            categoryId={category.id}
                            categoryName={category.name}
                            categorySlug={category.slug}
                        />
                    ))}
                </Col>
                
                {/* Sidebar - 4 columns */}
                <Col lg={4}>
                    <div className="sidebar-section mb-4">
                        <div className="section-header d-flex justify-content-between align-items-center mb-3">
                            <h2 className="section-title-tuoi-tre border-start border-danger border-4 ps-2">TIN ĐỌC NHIỀU</h2>
                        </div>
                        <div className="most-read-articles">
                            {articles.slice(0, 5).map((article, index) => (
                                <Card key={article.id} className="mb-3 border-0 border-bottom pb-2">
                                    <div className="d-flex">
                                        <div className="flex-shrink-0 me-2 d-flex align-items-center">
                                            <span className="fw-bold text-danger" style={{ fontSize: '24px', width: '30px' }}>{index + 1}</span>
                                        </div>
                                        <div className="flex-grow-1">
                                            <a href={`/article/${article.id}`} className="text-decoration-none">
                                                <Card.Title className="fs-6 text-dark">{article.title}</Card.Title>
                                            </a>
                                            <div className="d-flex align-items-center mt-1">
                                                <small className="text-muted me-3">
                                                    <FaClock className="me-1" size={12} />
                                                    {new Date(article.publishedAt).toLocaleDateString('vi-VN')}
                                                </small>
                                                <small className="text-muted">
                                                    <FaEye className="me-1" size={12} />
                                                    {Math.floor(Math.random() * 1000) + 500}
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                        <div className="most-read-articles">
                            {articles.length > 0 && articles.slice(5, 10).map((article, index) => (
                                <div key={article.id} className="most-read-item d-flex mb-3 pb-3 border-bottom">
                                    <div className="most-read-number me-2">
                                        <span className="badge bg-danger">{index + 1}</span>
                                    </div>
                                    <div className="most-read-content">
                                        <h6 className="mb-1">
                                            <a href={`/article/${article.id}`} className="text-decoration-none text-dark">
                                                {article.title}
                                            </a>
                                        </h6>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="sidebar-section mb-4">
                        <div className="section-header d-flex justify-content-between align-items-center mb-3">
                            <h2 className="section-title-tuoi-tre">QUẢNG CÁO</h2>
                        </div>
                        <div className="advertisement-box p-2 border text-center mb-3">
                            <img src="/images/banner.webp" alt="Quảng cáo" className="img-fluid" />
                        </div>
                        <div className="advertisement-box p-2 border text-center mb-3">
                            <img src="/images/banner1.webp" alt="Quảng cáo" className="img-fluid" />
                        </div>
                        <div className="advertisement-box p-2 border text-center">
                            <img src="/images/banner2.webp" alt="Quảng cáo" className="img-fluid" />
                        </div>
                    </div>
                </Col>
            </Row>

            <div className="section-header d-flex justify-content-between align-items-center mb-3 mt-4">
                <h2 className="section-title-tuoi-tre">TẤT CẢ TIN TỨC</h2>
            </div>
            <Row>
                {articles.length > 0 ? (
                    articles.map(article => (
                        <Col key={article.id} md={4} className="mb-4">
                            <ArticleCard article={{
                                id: article.id,
                                title: article.title,
                                description: article.summary,
                                imageUrl: article.imageUrl || 'https://via.placeholder.com/300x150'
                            }} />
                        </Col>
                    ))
                ) : !loading && !error ? (
                    <Col xs={12} className="text-center py-5">
                        <p>Không tìm thấy bài viết nào. Vui lòng quay lại sau.</p>
                    </Col>
                ) : null}
            </Row>

            <div className="text-center mt-3 mb-5">
                {loading ? (
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Đang tải...</span>
                    </Spinner>
                ) : hasMore ? (
                    <Button
                        variant="danger"
                        onClick={handleLoadMore}
                        disabled={loading}
                    >
                        Tải thêm
                    </Button>
                ) : articles.length > 0 ? (
                    <p>Đã hiển thị tất cả bài viết</p>
                ) : null}
            </div>
        </Container>
    );
};

export default Home;
