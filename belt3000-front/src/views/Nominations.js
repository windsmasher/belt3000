import React, { useState, useEffect, useContext } from 'react';
import { Config } from '../config/config';
import { useToast } from '@chakra-ui/react';
import { AuthContext } from '../AuthContext';
import NominationTable from '../components/NominationTable/NominationTable';
import { apiCall } from '../apiCall';

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
      },
      () => {
        authContext.logout();
      },
    );
  };

  const fetchAllNominations = async () => {
    apiCall(
      `${Config.API_URL}nomination/all`,
      {
        headers: { authorization: authContext.token },
      },
      toast,
      '',
      'Wystąpił błąd.',
      async res => {
        const body = await res.json();
        setNominations(body);
        setTempDescriptions(body.map(nomination => nomination.description));
        setNominationsDownloaded(true);
      },
      () => {
        authContext.logout();
      },
    );
  };

  const fetchNominationsByCompetitor = async competitorId => {
    apiCall(
      `${Config.API_URL}nomination/by-competitor/${competitorId}`,
      {
        headers: { authorization: authContext.token },
      },
      toast,
      '',
      'Błąd pobrania listy nominacji.',
      async res => {
        const body = await res.json();
        setNominations(body);
        setTempDescriptions(body.map(nomination => nomination.description));
      },
      () => {
        authContext.logout();
      },
    );
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
    apiCall(
      `${Config.API_URL}nomination/previous/${selectedCompetitor}`,
      {
        method: 'DELETE',
        headers: { authorization: authContext.token },
      },
      toast,
      'Poprawnie usunięto ostatnią nominacje.',
      'Błąd usunięcia ostatniej nominacji.',
      async res => {
        fetchAllNominations();
      },
      () => {
        authContext.logout();
      },
    );
  };

  const updateDescription = async (nominationId, description) => {
    apiCall(
      `${Config.API_URL}nomination/edit-description/${nominationId}`,
      {
        method: 'PATCH',
        body: JSON.stringify({ description: description }),
        headers: { 'Content-Type': 'application/json', authorization: authContext.token },
      },
      toast,
      'Poprawnie zaktualizowano opis.',
      'Wystąpił błąd.',
      async res => {
        setIsEditDescriptionId(null);
        selectedCompetitor === 'all' ? fetchAllNominations() : fetchNominationsByCompetitor(selectedCompetitor);
      },
      () => {
        authContext.logout();
      },
    );
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
