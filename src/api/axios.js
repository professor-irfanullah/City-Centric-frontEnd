import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL, // uses .env or .env.development
    withCredentials: true // only if you need cookies (auth, sessions)
});
export default api;
