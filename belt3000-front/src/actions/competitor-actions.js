import { axiosClient } from '../axiosClient';
import { Config } from '../config/config';

export const getAllCompetitors = toast => {
  return async dispatch => {
    try {
      const response = await axiosClient.get(`${Config.API_URL}competitor/all`);
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

export const deleteCompetitor = (id, toast) => {
  return async dispatch => {
    try {
      const response = await axiosClient.delete(`${Config.API_URL}competitor/${id}`);
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

export const addCompetitor = (body, toast) => {
  return async dispatch => {
    try {
      const response = await axiosClient.post('competitor/add', body);
      if (response.status === 201) {
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

export const updateCompetitor = (id, body, toast) => {
  return async dispatch => {
    try {
      const response = await axiosClient.patch(`${Config.API_URL}competitor/${id}`, body);

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
