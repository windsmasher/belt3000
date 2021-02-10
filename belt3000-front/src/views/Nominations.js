import React, { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import NominationTable from '../components/NominationTable/NominationTable';
import { useSelector, useDispatch } from 'react-redux';
import { getAllCompetitors } from '../actions/competitor-actions';
import { getAllNominations, getNominationsByCompetitor, deleteLastNomination } from '../actions/nomination-actions';

const Nominations = () => {
  const [selectedCompetitor, setSelectedCompetitor] = useState('all');
  const [nominationsDownloaded, setNominationsDownloaded] = useState(false);
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
  };

  const handleNominationPerson = async event => {
    setSelectedCompetitor(event.target.value);
    if (event.target.value === 'all') {
      await fetchAllNominations();
    } else {
      await dispatch(getNominationsByCompetitor(event.target.value, toast));
    }
  };

  return (
    <NominationTable
      nominations={nominations}
      competitors={competitors}
      selectedCompetitor={selectedCompetitor}
      handleNominationPerson={handleNominationPerson}
      nominationsDownloaded={nominationsDownloaded}
    />
  );
};

export default Nominations;
