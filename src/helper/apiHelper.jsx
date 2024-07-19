import axios from 'axios';
import { AppSettings } from '../utils/Settings';

const api = axios.create({
  baseURL: AppSettings.base_url,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const apiH = axios.create({
  baseURL: AppSettings.base_url,
  timeout: 10000,
  responseType: 'text',
  withCredentials: false,
  headers: {
    'Accept': 'text/plain',
  },
});

export const makeApiCall = async (endpoint, access_token, method = 'GET', data = null) => {
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
    return response?.data;
  } catch (error) {
    console.error('API Error:', JSON.stringify(error.response.data.message));
    console.error('API Status Code:', error.response.status);
    throw { data: error.response.data, status: error.response.status };
  } finally {
    // This block will always execute, regardless of whether the request succeeded or failed
    console.log('API call completed');
  }
};

export const makeApiCallWithHeader = async (endpoint, method = 'GET', data = null) => {
  try {
    const response = await apiH({
      method,
      url: endpoint,
      data,
      headers: {
        ...apiH.defaults.headers,
      },
    });
    return response?.data;
  } catch (error) {
    console.error('API Error:', error.response || error.request || error.message);
    throw error;
  } finally {
    // This block will always execute, regardless of whether the request succeeded or failed
    console.log('API call with header completed');
  }
};
