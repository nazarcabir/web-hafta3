import axios from 'axios';

// Create basic axios instance
const api = axios.create({
    baseURL: '/api',
});

// Add a request interceptor to insert tokens
api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('userInfo'));

        if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
