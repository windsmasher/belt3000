import { axiosClient } from '../axiosClient';
import { Config } from '../config/config';

export const getAllNominations = toast => {
  return async dispatch => {
    try {
      const response = await axiosClient.get(`${Config.API_URL}nomination/all`);
      if (response.status !== 200) {
        toast({
          title: 'Wystąpił błąd.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
      dispatch({ type: 'GET_ALL_NOMINATIONS', payload: response.data });
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

export const getNominationsByCompetitor = (id, toast) => {
  return async dispatch => {
    try {
      const response = await axiosClient.get(`${Config.API_URL}nomination/by-competitor/${id}`);
      if (response.status !== 200) {
        toast({
          title: 'Wystąpił błąd.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
      dispatch({ type: 'GET_NOMINATIONS_BY_COMPETITOR', payload: response.data });
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

export const deleteLastNomination = (selectedCompetitorId, toast) => {
  return async dispatch => {
    try {
      const response = await axiosClient.delete(`${Config.API_URL}nomination/previous/${selectedCompetitorId}`);
      console.log(response);
      if (response.status === 200) {
        toast({
          title: 'Poprawnie usunięto nominacje.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: response?.errorMsg || 'Błąd usunięcia nominacji.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }

      dispatch({ type: 'DELETE_LAST_NOMINATION', payload: Number(response.data) });
    } catch (e) {
      toast({
        title: 'Błąd usunięcia nominacji.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
};

export const updateDescription = (id, descr, toast) => {
  return async dispatch => {
    try {
      const response = await axiosClient.patch(`${Config.API_URL}nomination/edit-description/${id}`, {
        description: descr,
      });
      if (response.status === 200) {
        toast({
          title: 'Poprawnie zaktualizowano opis.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Błąd aktualizacji opisu.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
      dispatch({ type: 'UPDATE_DESCRIPTION', payload: response.data });
    } catch (e) {
      toast({
        title: 'Błąd aktualizacji opisu.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
};

export const addNomination = (body, competitorId, toast) => {
  return async dispatch => {
    try {
      const response = await axiosClient.post(`nomination/add/${competitorId}`, body);
      if (response.status === 201) {
        toast({
          title: 'Poprawnie dodano nominacje.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: response?.errorMsg || 'Błąd dodania nominacji.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
      dispatch({ type: 'ADD_NOMINATION', payload: response.data });
    } catch (e) {
      console.log(e);
      toast({
        title: 'Błąd dodania nominacji.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
};
