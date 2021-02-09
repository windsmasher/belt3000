import React, { useState } from 'react';
import { useParams } from 'react-router';
import { useHistory } from 'react-router-dom';
import { useToast, Box, Stack, FormLabel, FormControl, Input, Select } from '@chakra-ui/react';
import Subtitle from '../components/Subtitle';
import ButtonComponent from '../components/ButtonComponent';
import { useSelector, useDispatch } from 'react-redux';
import { addNomination } from '../actions/nomination-actions';

const AddNomination = () => {
  const [nomination, setNomination] = useState({ date: new Date(), nominationType: 0, description: null });
  const { competitorId } = useParams();
  const toast = useToast();
  const history = useHistory();
  const dispatch = useDispatch();

  const handleSubmit = async e => {
    e.preventDefault();
    dispatch(addNomination(nomination, competitorId, toast));
    history.push('/nominations');
  };

  return (
    <Box>
      <Subtitle msg="Dodaj nominacje" />
      <Stack
        justify={['center', 'space-around', 'space-around', 'space-around']}
        direction={['column', 'row', 'row', 'row']}
        mt={5}
      >
        <Box w="100%">
          <FormControl id="date">
            <FormLabel>Data</FormLabel>
            <Input
              type="date"
              name="date"
              value={nomination.date}
              onChange={e => setNomination({ ...nomination, date: e.target.value })}
            />
          </FormControl>
        </Box>
        <Box w="100%">
          <FormControl id="nominationType">
            <FormLabel>Rodzaj nominacji</FormLabel>
            <Select
              name="nominationType"
              value={nomination.nominationType}
              onChange={e => setNomination({ ...nomination, nominationType: Number(e.target.value) })}
            >
              <option value={0}>Pas</option>
              <option value={1}>1 belka</option>
              <option value={2}>2 belki</option>
              <option value={3}>3 belki</option>
              <option value={4}>4 belki</option>
            </Select>
          </FormControl>
        </Box>
      </Stack>
      <Box mt={5} mb={5}>
        <FormControl id="description">
          <FormLabel>Opis</FormLabel>
          <Input
            as="textarea"
            rows={3}
            value={nomination.description}
            onChange={e => setNomination({ ...nomination, description: e.target.value })}
          />
        </FormControl>
      </Box>
      <ButtonComponent type="success" msg="Dodaj" onClick={handleSubmit} />
    </Box>
  );
};

export default AddNomination;
