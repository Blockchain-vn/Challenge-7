import React from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';

const mockNews = [
    {
        id: 1,
        title: "Tin tức số 1",
        summary: "Tóm tắt ngắn gọn của tin tức số 1.",
        image: "https://via.placeholder.com/150"
    },
    {
        id: 2,
        title: "Tin tức số 2",
        summary: "Tóm tắt ngắn gọn của tin tức số 2.",
        image: "https://via.placeholder.com/150"
    },
    {
        id: 3,
        title: "Tin tức số 3",
        summary: "Tóm tắt ngắn gọn của tin tức số 3.",
        image: "https://via.placeholder.com/150"
    }
];

const NewsList: React.FC = () => {
    return (
        <Container className="mt-4">
            <Row>
                {mockNews.map(news => (
                    <Col md={4} sm={6} xs={12} key={news.id} className="mb-4">
                        <Card>
                            <Card.Img variant="top" src={news.image} />
                            <Card.Body>
                                <Card.Title>{news.title}</Card.Title>
                                <Card.Text>{news.summary}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default NewsList;
