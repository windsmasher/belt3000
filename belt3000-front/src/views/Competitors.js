import React, { useState, useContext, useEffect } from 'react';
import { Config } from '../config/config';
import { AuthContext } from '../context';
import { useToast } from '@chakra-ui/react';
import CompetitorTable from '../components/CompetitorTable';

const Competitors = () => {
  const authContext = useContext(AuthContext);

  const [competitors, setCompetitors] = useState([]);
  const [competitorsDownloaded, setCompetitorsDownloaded] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchAllCompetitors();
  }, []);

  const fetchAllCompetitors = async () => {
    try {
      const response = await fetch(`${Config.API_URL}competitor/all`, {
        headers: { authorization: authContext.token },
      });
      const competitors = await response.json();
      setCompetitors(competitors);
      setCompetitorsDownloaded(true);
    } catch (err) {
      toast({
        title: 'Błąd pobrania listy zawodników.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async id => {
    try {
      const res = await fetch(`${Config.API_URL}competitor/${id}`, {
        method: 'DELETE',
        headers: { auThorization: authContext.token },
      });
      if (res.status !== 200) {
        toast({
          title: (await res?.json())?.errorMsg || 'Błąd usunięcia zawodnika.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Poprawnie usunięto zawodnika.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (e) {
      toast({
        title: 'Błąd usunięcia zawodnika.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
    fetchAllCompetitors();
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
