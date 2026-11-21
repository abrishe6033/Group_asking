import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/signin';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    signup: (userData) => api.post('/auth/signup', userData),
    signin: (credentials) => api.post('/auth/signin', credentials),
    getMe: () => api.get('/auth/me')
};

// Questions API
export const questionAPI = {
    getQuestions: (page = 1) => api.get(`/questions?page=${page}`),
    getQuestion: (id) => api.get(`/questions/${id}`),
    createQuestion: (data) => api.post('/questions', data),
    updateQuestion: (id, data) => api.put(`/questions/${id}`, data),
    deleteQuestion: (id) => api.delete(`/questions/${id}`),
    searchQuestions: (query) => api.get(`/questions/search?q=${query}`)
};

// Answers API
export const answerAPI = {
    createAnswer: (data) => api.post('/answers', data),
    updateAnswer: (id, data) => api.put(`/answers/${id}`, data),
    deleteAnswer: (id) => api.delete(`/answers/${id}`),
    acceptAnswer: (id) => api.put(`/answers/${id}/accept`)
};

export default api;
