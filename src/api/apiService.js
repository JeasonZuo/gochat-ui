import axios from 'axios';

const apiUrl = 'http://127.0.0.1:8001/api/v1';

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

