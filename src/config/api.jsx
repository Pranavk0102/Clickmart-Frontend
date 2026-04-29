import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

const refreshClient = axios.create({
  baseURL: API_BASE_URL,
});

export const requestTokenRefresh = async (refreshToken) => {
  const response = await refreshClient.post('/auth/refresh-token', { refreshToken });
  const data = response.data.data;
  return {
    accessToken: data.token || data.accessToken,
    refreshToken: data.refreshToken,
  };
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const url = originalRequest?.url || '';
    const isAuthEndpoint =
      url.includes('/auth/login') ||
      url.includes('/auth/register') ||
      url.includes('/auth/logout') ||
      url.includes('/auth/refresh-token');

    if (status !== 401 || originalRequest._retry || isAuthEndpoint) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const storedRefresh = localStorage.getItem('refreshToken');
      if (!storedRefresh) throw new Error('No refresh token');

      const { accessToken, refreshToken: newRefresh } = await requestTokenRefresh(storedRefresh);

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', newRefresh);

      originalRequest.headers = {
        ...(originalRequest.headers || {}),
        Authorization: `Bearer ${accessToken}`,
      };

      return api(originalRequest);
    } catch {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      import('../store/store.jsx').then(({ default: store }) => {
        store.dispatch({ type: 'auth/forceLogout' });
      });
      return Promise.reject(error);
    }
  }
);

export default api;
