import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  withCredentials: true,
});

const refreshApi = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  err => Promise.reject(err)
);

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const rtInLocal = !!localStorage.getItem('refreshToken');
        const rt = rtInLocal ? localStorage.getItem('refreshToken') : sessionStorage.getItem('refreshToken');

        if (!rt) throw new Error('No refresh token');

        console.log('401 발생, 토큰 재발급 시도...');

        const res = await refreshApi.get(
          '/auth/refresh',
          {headers: { Authorization: `Bearer ${rt}` } }
        );
        console.log('토큰 재발급 성공:', res.data);

        const newAccessToken = res.data.accessToken;
        const newRefreshToken = res.data.refreshToken;

        if (rtInLocal) {
          localStorage.setItem('accessToken', newAccessToken);
          localStorage.setItem('refreshToken', newRefreshToken);
        } else {
          sessionStorage.setItem('accessToken', newAccessToken);
          sessionStorage.setItem('refreshToken', newRefreshToken);
        }

        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (e) {
        console.error('토큰 재발급 실패:', e);
        
      }
    }
    return Promise.reject(error);
  }
);

export default api;
