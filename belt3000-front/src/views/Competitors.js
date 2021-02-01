import React, { useState, useContext, useEffect } from 'react';
import { Config } from '../config/config';
import { AuthContext } from '../AuthContext';
import { useToast } from '@chakra-ui/react';
import CompetitorTable from '../components/CompetitorTable';
import { apiCall } from '../apiCall';

const Competitors = () => {
  const authContext = useContext(AuthContext);

  const [competitors, setCompetitors] = useState([]);
  const [competitorsDownloaded, setCompetitorsDownloaded] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchAllCompetitors();
  }, []);

  const fetchAllCompetitors = async () => {
    apiCall(
      `${Config.API_URL}competitor/all`,
      {
        method: 'GET',
        headers: { authorization: authContext.token },
      },
      toast,
      '',
      'Wystąpił błąd.',
      async res => {
        const body = await res.json();
        setCompetitors(body);
        setCompetitorsDownloaded(true);
      },
      () => {
        authContext.logout();
      },
    );
  };

  const handleDelete = async id => {
    await apiCall(
      `${Config.API_URL}competitor/${id}`,
      {
        method: 'DELETE',
        headers: { auThorization: authContext.token },
      },
      toast,
      'Poprawnie usunięto zawodnika.',
      'Błąd usunięcia zawodnika.',
      async res => {
        fetchAllCompetitors();
      },
      () => {
        authContext.logout();
      },
    );
  };

  return (
    <CompetitorTable
      competitors={competitors}
      handleDelete={handleDelete}
      competitorsDownloaded={competitorsDownloaded}
    />
  );
};

export default Competitors;
