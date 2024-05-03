import axios from 'axios';
import { AppSettings } from '../utils/Settings';

const api = axios.create({
  baseURL: AppSettings.base_url,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const makeApiCall = async (endpoint, access_token, method = 'GET', data = null) => {
  try {
    const response = await api({
      method,
      url: endpoint,
      data,
      headers: {
        ...api.defaults.headers,
        'Authorization': `Bearer ${access_token}`,
      },
    });
    ////console.log('response',response?.data);
    return response?.data;
  } catch (error) {
    //console.error('API Error2:', error.response || error.request || error.message);
    throw error;
  }
};

export default makeApiCall;
