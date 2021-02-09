import axios from 'axios';
import { createBrowserHistory } from 'history';
import { store } from './store/store';

const history = createBrowserHistory();
export const baseURL = 'http://localhost:5001/';

export const axiosClient = axios.create({
  baseURL,
  headers: {},
});

axiosClient.interceptors.request.use(config => {
  const token = store.getState().authData.token;
  config.headers.authorization = token;
  return config;
});

axiosClient.interceptors.response.use(undefined, error => {
  if (error?.response?.status === 401) {
    console.log('asdas');
    history.push('/login-admin');
  }
  return Promise.reject(error);
});
