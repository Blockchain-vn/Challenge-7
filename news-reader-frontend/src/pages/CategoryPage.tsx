import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import ArticleCard from '../components/ArticleCard';
import { getArticles, getCategoryBySlug } from '../services/api';

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

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface ApiResponse {
    success: boolean;
    count: number;
    totalPages: number;
    currentPage: number;
    articles: Article[];
}

const CategoryPage = () => {
    const { slug } = useParams<{ slug: string }>();
    const [articles, setArticles] = useState<Article[]>([]);
    const [category, setCategory] = useState<Category | null>(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);

    const fetchCategory = async () => {
        if (!slug) return;
        
        try {
            const categoryData = await getCategoryBySlug(slug);
            setCategory(categoryData);
            return categoryData?.id;
        } catch (err) {
            console.error('Error fetching category:', err);
            setError('Không thể tải thông tin danh mục');
            return null;
        }
    };

    const fetchArticles = async (pageNum: number, categoryId?: number) => {
        try {
            setLoading(true);
            setError(null);

            // Use real API
            const response = await getArticles(pageNum, 10, categoryId);
            const data = response as ApiResponse;

            if (data.success) {
                if (pageNum === 1) {
                    setArticles(data.articles);
                } else {
                    setArticles(prev => [...prev, ...data.articles]);
                }

                setHasMore(data.currentPage < data.totalPages);
            } else {
                setError('Không thể tải bài viết');
            }
        } catch (err) {
            setError('Đã xảy ra lỗi khi tải bài viết. Vui lòng thử lại sau.');
            console.error('Error fetching articles:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            const categoryId = await fetchCategory();
            if (categoryId) {
                fetchArticles(1, categoryId);
            }
        };
        
        loadData();
        // Reset page when slug changes
        setPage(1);
    }, [slug]);

    const handleLoadMore = () => {
        if (!loading && hasMore && category) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchArticles(nextPage, category.id);
        }
    };

    return (
        <Container className="mt-4">
            {category && (
                <div className="mb-4">
                    <h1 className="category-title">{category.name}</h1>
                    <hr />
                </div>
            )}

            {error && (
                <Alert variant="danger" className="mb-4">
                    {error}
                </Alert>
            )}

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
                        <p>Không có bài viết nào trong danh mục này.</p>
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

export default CategoryPage;
