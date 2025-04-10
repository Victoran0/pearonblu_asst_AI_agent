import axios from 'axios';
import { auth } from '@/auth'

const api = axios.create({
    baseURL: `${process.env.BASE_URL}/api`,
});

api.interceptors.request.use(async (config) => {
    const session = await auth()
    if (session) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
    return config;
});

export default api;
