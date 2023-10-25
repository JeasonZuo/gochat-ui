import axios from 'axios';

const apiUrl = process.env.VUE_APP_API_BASE_URL;

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
  const response = await axios.get(`${apiUrl}/user_info`);
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

export const editUser = async (params) => {
  const response = await axios.post(`${apiUrl}/edit_user`, params);
  return response.data
}

