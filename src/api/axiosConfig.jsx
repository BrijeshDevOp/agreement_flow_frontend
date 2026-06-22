import axios from 'axios';
import { clearSession } from './authHelpers';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
});

// Attach the token to every outbound request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Token ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// On 401 responses, clear the session and redirect to login
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            clearSession();
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default api;