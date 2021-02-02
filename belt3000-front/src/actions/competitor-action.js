import axios from 'axios';
import { Config } from '../config/config';

export const getAllCompetitors = () => {
  return dispatch => {
    return axios
      .get(`${Config.API_URL}competitor/all`)
      .then(response => {
        console.log(response.data);
        return response.data;
      })
      .then(data => dispatch({ type: 'GET_ALL_COMPETITORS', payload: data }));
  };
};
