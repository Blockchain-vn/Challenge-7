import { useEffect, useState } from 'react';
import { Row, Col, Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getArticles } from '../services/api';
import ArticleCard from './ArticleCard';
import { FaClock } from 'react-icons/fa';

interface CategorySectionProps {
    categoryId: number;
    categoryName: string;
    categorySlug: string;
}

interface Article {
    id: number;
    title: string;
    summary: string;
    imageUrl: string;
    publishedAt: string;
}

const CategorySection = ({ categoryId, categoryName, categorySlug }: CategorySectionProps) => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                setLoading(true);
                const response = await getArticles(1, 3, categoryId);
                if (response.success) {
                    setArticles(response.articles);
                }
            } catch (error) {
                console.error(`Error fetching articles for category ${categoryName}:`, error);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, [categoryId, categoryName]);

    if (loading) {
        return <div className="my-3">Đang tải...</div>;
    }

    if (articles.length === 0) {
        return null;
    }

    return (
        <div className="category-section mb-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="section-title-tuoi-tre border-start border-danger border-4 ps-2">{categoryName.toUpperCase()}</h2>
                <Link to={`/category/${categorySlug}`} className="btn btn-outline-danger btn-sm">
                    Xem tất cả
                </Link>
            </div>
            
            <Row>
                {articles.length > 0 && (
                    <Col lg={6} className="mb-4">
                        <Card className="border-0 shadow-sm h-100">
                            <div className="position-relative">
                                <Link to={`/article/${articles[0].id}`}>
                                    <Card.Img 
                                        src={articles[0].imageUrl} 
                                        alt={articles[0].title}
                                        style={{ height: '300px', objectFit: 'cover' }}
                                    />
                                </Link>
                                <Badge 
                                    bg="danger" 
                                    className="position-absolute bottom-0 start-0 m-2"
                                >
                                    {categoryName}
                                </Badge>
                            </div>
                            <Card.Body>
                                <Link to={`/article/${articles[0].id}`} className="text-decoration-none">
                                    <Card.Title className="fw-bold text-dark">{articles[0].title}</Card.Title>
                                </Link>
                                <Card.Text className="text-muted">{articles[0].summary}</Card.Text>
                                <div className="d-flex justify-content-between align-items-center">
                                    <small className="text-muted">
                                        <FaClock className="me-1" size={12} />
                                        {new Date(articles[0].publishedAt).toLocaleDateString('vi-VN')}
                                    </small>
                                    <Link to={`/article/${articles[0].id}`} className="btn btn-outline-danger btn-sm">
                                        Đọc tiếp
                                    </Link>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                )}
                
                <Col lg={6}>
                    <Row>
                        {articles.slice(1).map(article => (
                            <Col key={article.id} md={6} className="mb-3">
                                <ArticleCard article={{
                                    id: article.id,
                                    title: article.title,
                                    description: article.summary,
                                    imageUrl: article.imageUrl,
                                    publishedAt: article.publishedAt,
                                    categoryName: categoryName
                                }} />
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row>
        </div>
    );
};

export default CategorySection;
