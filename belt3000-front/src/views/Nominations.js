import React, { useState, useEffect, useContext } from 'react';
import { Config } from '../config/config';
import { useToast } from '@chakra-ui/react';
import { AuthContext } from '../AuthContext';
import NominationTable from '../components/NominationTable';

const Nominations = () => {
  const [nominations, setNominations] = useState([]);
  const [competitors, setCompetitors] = useState([]);
  const [selectedCompetitor, setSelectedCompetitor] = useState('all');
  const [nominationsDownloaded, setNominationsDownloaded] = useState(false);
  const [isEditDescriptionId, setIsEditDescriptionId] = useState(null);
  const [tempDescriptions, setTempDescriptions] = useState([]);
  const authContext = useContext(AuthContext);
  const toast = useToast();

  useEffect(() => {
    fetchAllNominations();
    fetchAllCompetitors();
  }, []);

  const fetchAllCompetitors = async () => {
    try {
      const response = await fetch(`${Config.API_URL}competitor/all`, {
        headers: { authorization: authContext.token },
      });
      const competitors = await response.json();
      setCompetitors(competitors);
    } catch (err) {
      toast({
        title: 'Błąd pobrania listy zawodników.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.log(`Competitors fetch error: ${err}`);
    }
  };

  const fetchAllNominations = async () => {
    try {
      const response = await fetch(`${Config.API_URL}nomination/all`, {
        headers: { authorization: authContext.token },
      });
      const nominationsRes = await response.json();
      setNominations(nominationsRes);
      setTempDescriptions(nominationsRes.map(nomination => nomination.description));
      setNominationsDownloaded(true);
    } catch (err) {
      toast({
        title: 'Błąd pobrania listy nominacji.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const fetchNominationsByCompetitor = async competitorId => {
    try {
      const response = await fetch(`${Config.API_URL}nomination/by-competitor/${competitorId}`, {
        headers: { authorization: authContext.token },
      });
      const nominationsByCompetitor = await response.json();
      setNominations(nominationsByCompetitor);
      setTempDescriptions(nominationsByCompetitor.map(nomination => nomination.description));
    } catch (err) {
      toast({
        title: 'Błąd pobrania listy nominacji.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleNominationPerson = async event => {
    setSelectedCompetitor(event.target.value);
    if (event.target.value === 'all') {
      await fetchAllNominations();
    } else {
      await fetchNominationsByCompetitor(event.target.value);
    }
  };

  const deletePreviousNomination = async () => {
    try {
      const res = await fetch(`${Config.API_URL}nomination/previous/${selectedCompetitor}`, {
        method: 'DELETE',
        headers: { authorization: authContext.token },
      });
      if (res.status === 200) {
        toast({
          title: 'Poprawnie usunięto ostatnią nominacje.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: (await res?.json())?.errorMsg || 'Błąd usunięcia ostatniej nominacji.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err) {
      toast({
        title: 'Błąd usunięcia ostatniej nominacji.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
    fetchAllNominations();
  };

  const updateDescription = async (nominationId, description) => {
    try {
      const res = await fetch(`${Config.API_URL}nomination/edit-description/${nominationId}`, {
        method: 'PATCH',
        body: JSON.stringify({ description: description }),
        headers: { 'Content-Type': 'application/json', authorization: authContext.token },
      });
      if (res.status !== 200) {
        toast({
          title: (await res?.json())?.errorMsg || 'Wystąpił błąd.',
          status: 'error',
          isClosable: true,
          duration: 3000,
        });
      } else {
        toast({
          title: 'Poprawnie zaktualizowano opis.',
          status: 'success',
          isClosable: true,
          duration: 3000,
        });
        setIsEditDescriptionId(null);
        selectedCompetitor === 'all' ? fetchAllNominations() : fetchNominationsByCompetitor(selectedCompetitor);
      }
    } catch (err) {
      toast({
        title: 'Wystąpił błąd.',
        status: 'error',
        isClosable: true,
        duration: 3000,
      });
    }
  };

  return (
    <NominationTable
      nominations={nominations}
      competitors={competitors}
      setIsEditDescriptionId={setIsEditDescriptionId}
      isEditDescriptionId={isEditDescriptionId}
      tempDescriptions={tempDescriptions}
      setTempDescriptions={setTempDescriptions}
      selectedCompetitor={selectedCompetitor}
      handleNominationPerson={handleNominationPerson}
      updateDescription={updateDescription}
      deletePreviousNomination={deletePreviousNomination}
      nominationsDownloaded={nominationsDownloaded}
    />
  );
};

export default Nominations;
