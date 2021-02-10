import React, { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import CompetitorTable from '../components/CompetitorTable';
import { useSelector, useDispatch } from 'react-redux';
import { getAllCompetitors, deleteCompetitor } from '../actions/competitor-actions';

const Competitors = () => {
  const [competitorsDownloaded, setCompetitorsDownloaded] = useState(true);
  const competitors = useSelector(state => state.competitors);
  const toast = useToast();
  const dispatch = useDispatch();

  useEffect(async () => {
    await dispatch(getAllCompetitors(toast));
    setCompetitorsDownloaded(true);
  }, []);

  const handleDelete = async id => {
    dispatch(deleteCompetitor(id, toast));
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
