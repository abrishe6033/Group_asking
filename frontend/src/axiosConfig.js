import axios from 'axios';

const axiosBase = axios.create({
    baseURL: 'https://group-asking.onrender.com/api/auth',
    headers: {
        'Content-Type': 'application/json'
    }
});

const axiosInstance = axios.create({
    baseURL: 'https://group-asking.onrender.com/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export { axiosBase };
export default axiosInstance;
