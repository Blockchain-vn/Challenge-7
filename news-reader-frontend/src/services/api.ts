import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Articles API
export const getArticles = async (page = 1, limit = 10, categoryId?: number) => {
    try {
        const params = { page, limit, ...(categoryId && { categoryId }) };
        const response = await api.get('/articles', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching articles:', error);
        throw error;
    }
};

export const getArticleById = async (id: string) => {
    try {
        const response = await api.get(`/articles/${id}`);
        return response.data.article;
    } catch (error) {
        console.error(`Error fetching article with ID ${id}:`, error);
        throw error;
    }
};

export const getArticleBySlug = async (slug: string) => {
    try {
        const response = await api.get(`/articles/slug/${slug}`);
        return response.data.article;
    } catch (error) {
        console.error(`Error fetching article with slug ${slug}:`, error);
        throw error;
    }
};

// Categories API
export const getCategories = async () => {
    try {
        const response = await api.get('/categories');
        return response.data.categories;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

export const getCategoryById = async (id: string) => {
    try {
        const response = await api.get(`/categories/${id}`);
        return response.data.category;
    } catch (error) {
        console.error(`Error fetching category with ID ${id}:`, error);
        throw error;
    }
};

export const getCategoryBySlug = async (slug: string) => {
    try {
        const response = await api.get(`/categories/slug/${slug}`);
        return response.data.category;
    } catch (error) {
        console.error(`Error fetching category with slug ${slug}:`, error);
        throw error;
    }
};

// Export the axios instance as default
export default api;