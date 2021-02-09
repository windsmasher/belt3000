import axios from 'axios';
import { baseURL } from '../axiosClient';
import history from '../history';

export const login = body => {
  return async dispatch => {
    let authData = JSON.parse(localStorage.getItem('authData'));
    if (!authData) {
      const response = await axios.post(`${baseURL}auth/login`, body, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log(response);
      authData = { token: response.data.token };
      localStorage.setItem('authData', JSON.stringify({ token: authData.token }));
    }
    dispatch({ type: 'LOGIN', payload: authData });
    history.push('/');
  };
};

export const logout = () => {
  return async dispatch => {
    localStorage.removeItem('authData');
    dispatch({ type: 'LOGOUT', payload: {} });
    history.push('/login-admin');
  };
};
