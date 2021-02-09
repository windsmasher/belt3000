import React, { useState, useEffect, useContext } from 'react';
import { useToast } from '@chakra-ui/react';
import { AuthContext } from '../AuthContext';
import NominationTable from '../components/NominationTable/NominationTable';
import { useSelector, useDispatch } from 'react-redux';
import { getAllCompetitors } from '../actions/competitor-actions';
import { getAllNominations, getNominationsByCompetitor, deleteLastNomination } from '../actions/nomination-actions';

const Nominations = () => {
  const [selectedCompetitor, setSelectedCompetitor] = useState('all');
  const [nominationsDownloaded, setNominationsDownloaded] = useState(false);
  const [isEditDescriptionId, setIsEditDescriptionId] = useState(null);
  const [tempDescriptions, setTempDescriptions] = useState([]);
  const authContext = useContext(AuthContext);
  const toast = useToast();
  const dispatch = useDispatch();
  const { competitors, nominations } = useSelector(state => state);

  useEffect(() => {
    fetchAllNominations();
    dispatch(getAllCompetitors(toast));
  }, []);

  const fetchAllNominations = async () => {
    await dispatch(getAllNominations(toast));
    setNominationsDownloaded(true);
    setTempDescriptions(nominations.map(nomination => nomination.description));
  };

  const fetchNominationsByCompetitor = async competitorId => {
    await dispatch(getNominationsByCompetitor(competitorId, toast));
    setTempDescriptions(nominations.map(nomination => nomination.description));
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
    dispatch(deleteLastNomination(selectedCompetitor, toast));
  };

  const updateDescription = async (nominationId, description) => {
    dispatch(updateDescription(nominationId, description, toast));
    setIsEditDescriptionId(null);
    selectedCompetitor === 'all' ? fetchAllNominations() : fetchNominationsByCompetitor(selectedCompetitor);
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
