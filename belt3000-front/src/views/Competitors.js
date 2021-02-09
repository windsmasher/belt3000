import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../AuthContext';
import { useToast } from '@chakra-ui/react';
import CompetitorTable from '../components/CompetitorTable';
import { useSelector, useDispatch } from 'react-redux';
import { getAllCompetitors, deleteCompetitor } from '../actions/competitor-actions';

const Competitors = () => {
  const authContext = useContext(AuthContext);
  const [competitorsDownloaded, setCompetitorsDownloaded] = useState(true);
  const toast = useToast();
  const competitors = useSelector(state => state.competitors);
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
