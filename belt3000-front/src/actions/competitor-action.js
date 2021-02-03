import axios from 'axios';
import { Config } from '../config/config';

export const getAllCompetitors = (authContext, toast) => {
  return async dispatch => {
    try {
      const response = await axios.get(`${Config.API_URL}competitor/all`, {
        headers: { authorization: authContext.token },
      });

      if (response.status === 401) {
        authContext.logout();
      }
      if (response.status !== 200) {
        toast({
          title: 'Wystąpił błąd.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }

      dispatch({ type: 'GET_ALL_COMPETITORS', payload: response.data });
    } catch (e) {
      toast({
        title: 'Wystąpił błąd.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
};

export const deleteCompetitor = (id, authContext, toast) => {
  return async dispatch => {
    try {
      const response = await axios.delete(`${Config.API_URL}competitor/${id}`, {
        headers: { authorization: authContext.token },
      });

      if (response.status === 401) {
        authContext.logout();
      }
      if (response.status === 200) {
        toast({
          title: 'Poprawnie usunięto zawodnika.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Błąd usunięcia zawodnika.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }

      dispatch({ type: 'DELETE_COMPETITOR', payload: Number(response.data) });
    } catch (e) {
      toast({
        title: 'Błąd usunięcia zawodnika.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
};

export const addCompetitor = (body, authContext, toast) => {
  return async dispatch => {
    try {
      const response = await axios.post(`${Config.API_URL}competitor/add`, {
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json', authorization: authContext.token },
      });

      if (response.status === 401) {
        authContext.logout();
      }
      if (response.status === 200) {
        toast({
          title: 'Poprawnie dodano zawodnika.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Błąd dodania zawodnika.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }

      dispatch({ type: 'ADD_COMPETITOR', payload: response.data });
    } catch (e) {
      toast({
        title: 'Błąd dodania zawodnika.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
};

export const updateCompetitor = (id, body, authContext, toast) => {
  return async dispatch => {
    try {
      const response = await axios.patch(`${Config.API_URL}competitor/${id}`, {
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json', authorization: authContext.token },
      });

      if (response.status === 401) {
        authContext.logout();
      }
      if (response.status === 200) {
        toast({
          title: 'Poprawnie zaktualizowano zawodnika.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Błąd edycji zawodnika.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }

      dispatch({ type: 'UPDATE_COMPETITOR', payload: response.data });
    } catch (e) {
      toast({
        title: 'Błąd edycji.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
};
