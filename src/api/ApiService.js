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

export const login = async (params) => {
  const newParams = {
    'tt_number': parseInt(params.tt_number, 10),
    'password': params.password
  }
  const response = await axios.post(`${apiUrl}/sign_in`, newParams);
  return response.data;
};

export const register = async (params) => {
  const response = await axios.post(`${apiUrl}/sign_up`, params);
  return response.data;
};

export const getUserInfo = async () => {
  let now = new Date().getTime()
  const response = await axios.get(`${apiUrl}/user_info`);
  console.log(now, new Date().getTime() - now)
  return response.data;
};

export const getFriendList = async () => {
  const response = await axios.get(`${apiUrl}/get_friend_list`);
  return response.data;
};

export const getMessageList = async (params) => {
  const response = await axios.get(`${apiUrl}/get_message_list?to_user_id=${params.toUserId}`);
  return response.data
}

export const addFriend = async (params) => {
  const newParams = {
    'tt_number': parseInt(params.tt_number, 10),
  }
  const response = await axios.post(`${apiUrl}/add_friend`, newParams);
  return response.data
}
