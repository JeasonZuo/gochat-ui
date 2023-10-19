import axios from 'axios';

const apiUrl = 'http://127.0.0.1:8001/api/v1';

// 添加请求拦截器，用于在请求头中添加JWT令牌
axios.interceptors.request.use(
  (config) => {
    // 获取JWT令牌（从localStorage或其他地方）
    const token = localStorage.getItem('token');

    if (token) {
      // 在请求头中添加Authorization字段，值为Bearer后加上空格和JWT令牌
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const login = async (credentials) => {
  const params = {
    'tt_number': parseInt(credentials.tt_number, 10),
    'password': credentials.password
  }
  const response = await axios.post(`${apiUrl}/sign_in`, params);
  return response.data;
};

export const register = async (credentials) => {
  const response = await axios.post(`${apiUrl}/sign_up`, credentials);
  return response.data;
};

export const getUserInfo = async () => {
  const response = await axios.get(`${apiUrl}/user_info`);
  return response.data;
};

export const getFriendList = async () => {
  const response = await axios.get(`${apiUrl}/get_friend_list`);
  return response.data;
};
