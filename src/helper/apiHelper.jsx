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
  // required for s3 presigned url to work
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
    ///console.log('response',response?.data);
    return response?.data;
  } catch (error) {
    console.error('API Error2:', JSON.stringify(error.response.data.message));
    throw JSON.parse(JSON.stringify(error.response.data));
  }
};
export const makeApiCallWithHeader = async (endpoint,  method = 'GET', data = null) => {
  try {
    const response = await apiH({
      method,
      url: endpoint,
      data,
      headers: {
        ...apiH.defaults.headers,
        
      },
    });
    ////console.log('response',response?.data);
    return response?.data;
  } catch (error) {
    //console.error('API Error2:', error.response || error.request || error.message);
    throw error;
  }
};


