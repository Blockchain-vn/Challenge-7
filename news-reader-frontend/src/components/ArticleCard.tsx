import { Card, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaBookmark, FaRegBookmark, FaShareAlt } from 'react-icons/fa';

interface ArticleProps {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    publishedAt?: string;
    categoryName?: string;
}

const ArticleCard = ({ article }: { article: ArticleProps }) => {
    const navigate = useNavigate();
    const [isSaved, setIsSaved] = useState(false);
    
    // Kiểm tra xem bài viết có được lưu không khi component mount
    useEffect(() => {
        const savedArticles = JSON.parse(localStorage.getItem('savedArticles') || '[]');
        setIsSaved(savedArticles.some((savedArticle: any) => savedArticle.id === article.id));
    }, [article.id]);
    
    // Format date
    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };
    
    // Lưu hoặc bỏ lưu bài viết
    const toggleSave = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
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
            savedArticles.push(article);
            localStorage.setItem('savedArticles', JSON.stringify(savedArticles));
            setIsSaved(true);
        }
    };
    
    // Chia sẻ bài viết
    const shareArticle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (navigator.share) {
            navigator.share({
                title: article.title,
                text: article.description,
                url: window.location.origin + `/article/${article.id}`,
            })
            .catch((error) => console.log('Lỗi chia sẻ:', error));
        } else {
            // Fallback cho trình duyệt không hỗ trợ Web Share API
            const url = window.location.origin + `/article/${article.id}`;
            navigator.clipboard.writeText(url)
                .then(() => alert('Đã sao chép liên kết bài viết vào clipboard!'))
                .catch(err => console.error('Không thể sao chép: ', err));
        }
    };

    return (
        <Card className="tuoi-tre-card h-100 border-0 shadow-sm">
            <div className="position-relative">
                <Link to={`/article/${article.id}`} className="text-decoration-none">
                    <Card.Img 
                        variant="top" 
                        src={article.imageUrl} 
                        className="article-image" 
                        style={{ height: '180px', objectFit: 'cover' }} 
                    />
                </Link>
                <div className="position-absolute top-0 end-0 p-2 d-flex">
                    <Button 
                        variant="light" 
                        size="sm" 
                        className="me-1 rounded-circle" 
                        onClick={toggleSave}
                    >
                        {isSaved ? <FaBookmark color="#dc3545" /> : <FaRegBookmark />}
                    </Button>
                    <Button 
                        variant="light" 
                        size="sm" 
                        className="rounded-circle" 
                        onClick={shareArticle}
                    >
                        <FaShareAlt />
                    </Button>
                </div>
                {article.categoryName && (
                    <Badge 
                        bg="danger" 
                        className="position-absolute bottom-0 start-0 m-2"
                    >
                        {article.categoryName}
                    </Badge>
                )}
            </div>
            <Card.Body className="d-flex flex-column">
                <Link to={`/article/${article.id}`} className="text-decoration-none text-dark">
                    <Card.Title className="fw-bold" style={{ fontSize: '1.1rem' }}>{article.title}</Card.Title>
                    <Card.Text className="text-muted" style={{ fontSize: '0.9rem' }}>{article.description}</Card.Text>
                </Link>
                <div className="mt-auto d-flex justify-content-between align-items-center">
                    {article.publishedAt && (
                        <small className="text-muted">{formatDate(article.publishedAt)}</small>
                    )}
                    <Button 
                        variant="outline-danger" 
                        size="sm" 
                        onClick={() => navigate(`/article/${article.id}`)}
                    >
                        Đọc tiếp
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default ArticleCard;
