import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Alert, Badge, ListGroup } from 'react-bootstrap';
import { getArticleById, getArticles } from '../services/api';
import { FaBookmark, FaRegBookmark, FaClock, FaEye, FaFacebookF, FaTwitter, FaEnvelope, FaPrint, FaLink } from 'react-icons/fa';

interface Article {
    id: number;
    title: string;
    summary: string;
    content: string;
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

const ArticleDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState<Article | null>(null);
    const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const fetchArticle = async () => {
            if (!id) return;

            try {
                setLoading(true);
                setError(null);
                const data = await getArticleById(id);
                setArticle(data);
                
                // Kiểm tra xem bài viết có được lưu không
                const savedArticles = JSON.parse(localStorage.getItem('savedArticles') || '[]');
                setIsSaved(savedArticles.some((savedArticle: any) => savedArticle.id === Number(id)));
                
                // Lấy các bài viết liên quan
                if (data.categoryId) {
                    const relatedData = await getArticles(1, 4, data.categoryId);
                    if (relatedData.success) {
                        // Loại bỏ bài viết hiện tại khỏi danh sách bài viết liên quan
                        const filteredRelated = relatedData.articles.filter((a: Article) => a.id !== Number(id));
                        setRelatedArticles(filteredRelated.slice(0, 3));
                    }
                }
            } catch (err) {
                setError('Error fetching article. Please try again later.');
                console.error('Error fetching article:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
        // Cuộn lên đầu trang khi chuyển bài viết
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) {
        return (
            <Container className="d-flex justify-content-center my-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="my-5">
                <Alert variant="danger">
                    {error}
                </Alert>
                <Button variant="primary" onClick={() => navigate('/')}>
                    Quay lại trang chủ
                </Button>
            </Container>
        );
    }

    if (!article) {
        return (
            <Container className="my-5">
                <Alert variant="warning">
                    Không tìm thấy bài viết
                </Alert>
                <Button variant="primary" onClick={() => navigate('/')}>
                    Quay lại trang chủ
                </Button>
            </Container>
        );
    }

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    
    // Lưu hoặc bỏ lưu bài viết
    const toggleSave = () => {
        if (!article) return;
        
        const savedArticles = JSON.parse(localStorage.getItem('savedArticles') || '[]');
        
        if (isSaved) {
            // Bỏ lưu bài viết
            const updatedSavedArticles = savedArticles.filter(
                (savedArticle: any) => savedArticle.id !== article.id
            );
            localStorage.setItem('savedArticles', JSON.stringify(updatedSavedArticles));
            setIsSaved(false);
        } else {
            // Lưu bài viết
            savedArticles.push({
                id: article.id,
                title: article.title,
                description: article.summary,
                imageUrl: article.imageUrl,
                publishedAt: article.publishedAt,
                categoryName: article.category?.name
            });
            localStorage.setItem('savedArticles', JSON.stringify(savedArticles));
            setIsSaved(true);
        }
    };
    
    // Chia sẻ bài viết
    const shareArticle = (platform: string) => {
        if (!article) return;
        
        const url = window.location.href;
        const title = article.title;
        
        switch (platform) {
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                break;
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
                break;
            case 'email':
                window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`, '_blank');
                break;
            case 'print':
                window.print();
                break;
            case 'copy':
                navigator.clipboard.writeText(url)
                    .then(() => alert('Đã sao chép liên kết bài viết vào clipboard!'))
                    .catch(err => console.error('Không thể sao chép: ', err));
                break;
            default:
                if (navigator.share) {
                    navigator.share({
                        title: title,
                        text: article.summary,
                        url: url,
                    }).catch((error) => console.log('Lỗi chia sẻ:', error));
                } else {
                    navigator.clipboard.writeText(url)
                        .then(() => alert('Đã sao chép liên kết bài viết vào clipboard!'))
                        .catch(err => console.error('Không thể sao chép: ', err));
                }
        }
    };

    return (
        <Container className="my-5">
            <Row>
                <Col lg={8}>
                    <nav aria-label="breadcrumb" className="mb-3">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
                            {article?.category && (
                                <li className="breadcrumb-item">
                                    <Link to={`/category/${article.category.slug}`}>{article.category.name}</Link>
                                </li>
                            )}
                            <li className="breadcrumb-item active" aria-current="page">Bài viết</li>
                        </ol>
                    </nav>

                    <Card className="border-0 shadow-sm mb-4">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                {article?.category && (
                                    <Badge bg="danger" className="py-2 px-3">
                                        {article.category.name}
                                    </Badge>
                                )}
                                <div className="d-flex align-items-center">
                                    <small className="text-muted me-3">
                                        <FaClock className="me-1" size={12} />
                                        {article?.publishedAt && formatDate(article.publishedAt)}
                                    </small>
                                    <small className="text-muted">
                                        <FaEye className="me-1" size={12} />
                                        {Math.floor(Math.random() * 1000) + 500} lượt xem
                                    </small>
                                </div>
                            </div>

                            <h1 className="article-title fw-bold mb-3" style={{ fontSize: '2rem' }}>{article?.title}</h1>

                            {article?.summary && (
                                <div className="article-summary mb-4 p-3 bg-light border-start border-danger border-4">
                                    <p className="fw-bold mb-0" style={{ fontSize: '1.1rem' }}>
                                        {article.summary}
                                    </p>
                                </div>
                            )}
                            
                            <div className="article-actions d-flex justify-content-between align-items-center mb-4 p-2 border-top border-bottom">
                                <div className="d-flex">
                                    <Button 
                                        variant={isSaved ? "danger" : "outline-danger"} 
                                        size="sm" 
                                        className="me-2"
                                        onClick={toggleSave}
                                    >
                                        {isSaved ? <FaBookmark className="me-1" /> : <FaRegBookmark className="me-1" />}
                                        {isSaved ? 'Đã lưu' : 'Lưu bài viết'}
                                    </Button>
                                </div>
                                <div className="d-flex">
                                    <Button variant="outline-primary" size="sm" className="me-1" onClick={() => shareArticle('facebook')}>
                                        <FaFacebookF />
                                    </Button>
                                    <Button variant="outline-info" size="sm" className="me-1" onClick={() => shareArticle('twitter')}>
                                        <FaTwitter />
                                    </Button>
                                    <Button variant="outline-secondary" size="sm" className="me-1" onClick={() => shareArticle('email')}>
                                        <FaEnvelope />
                                    </Button>
                                    <Button variant="outline-secondary" size="sm" className="me-1" onClick={() => shareArticle('print')}>
                                        <FaPrint />
                                    </Button>
                                    <Button variant="outline-secondary" size="sm" onClick={() => shareArticle('copy')}>
                                        <FaLink />
                                    </Button>
                                </div>
                            </div>

                            {article?.imageUrl && (
                                <div className="article-main-image mb-4 text-center">
                                    <img
                                        src={article.imageUrl}
                                        alt={article.title}
                                        className="img-fluid rounded"
                                        style={{ maxHeight: '500px', width: 'auto' }}
                                    />
                                </div>
                            )}

                            <div className="article-content mt-4 fs-5">
                                {article?.content ? (
                                    article.content.split('\\n\\n').map((paragraph, index) => (
                                        <p key={index} className="mb-4">{paragraph}</p>
                                    ))
                                ) : (
                                    <p>Không có nội dung chi tiết cho bài viết này.</p>
                                )}
                            </div>

                            {article?.sourceUrl && (
                                <div className="mt-4 text-end">
                                    <a
                                        href={article.sourceUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-outline-danger"
                                    >
                                        Xem bài viết gốc
                                    </a>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
                
                <Col lg={4}>
                    <div className="sidebar-section mb-4">
                        <div className="section-header d-flex justify-content-between align-items-center mb-3">
                            <h2 className="section-title-tuoi-tre border-start border-danger border-4 ps-2" style={{ fontSize: '1.3rem' }}>BÀI VIẾT LIÊN QUAN</h2>
                        </div>
                        <ListGroup variant="flush">
                            {relatedArticles.map(article => (
                                <ListGroup.Item key={article.id} className="border-0 border-bottom py-3">
                                    <Link to={`/article/${article.id}`} className="text-decoration-none">
                                        <div className="d-flex">
                                            <div className="flex-shrink-0 me-3">
                                                <img 
                                                    src={article.imageUrl} 
                                                    alt={article.title} 
                                                    style={{ width: '80px', height: '60px', objectFit: 'cover' }}
                                                    className="rounded"
                                                />
                                            </div>
                                            <div>
                                                <h6 className="mb-1 text-dark">{article.title}</h6>
                                                <small className="text-muted">
                                                    <FaClock className="me-1" size={10} />
                                                    {new Date(article.publishedAt).toLocaleDateString('vi-VN')}
                                                </small>
                                            </div>
                                        </div>
                                    </Link>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </div>
                    
                    <div className="sidebar-section mb-4">
                        <div className="section-header d-flex justify-content-between align-items-center mb-3">
                            <h2 className="section-title-tuoi-tre border-start border-danger border-4 ps-2" style={{ fontSize: '1.3rem' }}>TIN MỚI NHẤT</h2>
                        </div>
                        <Card className="border-0 bg-light p-3">
                            <Card.Body>
                                <p className="text-center">Đăng ký nhận tin mới nhất từ Tuổi Trẻ</p>
                                <div className="d-flex">
                                    <input type="email" className="form-control me-2" placeholder="Email của bạn" />
                                    <Button variant="danger">Đăng ký</Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default ArticleDetail;
