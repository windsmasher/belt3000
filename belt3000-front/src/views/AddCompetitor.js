import React, { useState, useEffect, useContext } from 'react';
import { Config } from '../config/config';
import { useParams } from 'react-router';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { useToast, Box, FormLabel, FormControl, Input, Stack, Select } from '@chakra-ui/react';
import ButtonComponent from '../components/ButtonComponent';
import Subtitle from '../components/Subtitle';
import { apiCall } from '../apiCall';
import { useSelector, useDispatch } from 'react-redux';
import { addCompetitor, updateCompetitor } from '../actions/competitor-actions';

const AddCompetitor = () => {
  const [competitor, setCompetitor] = useState({
    firstname: '',
    lastname: '',
    isAdult: 'true',
    belt: 'biały',
    stripes: '0',
  });
  const { competitorId } = useParams();
  const toast = useToast();
  const history = useHistory();
  const dispatch = useDispatch();
  const competitors = useSelector(state => state.competitors);

  useEffect(() => {
    getOneCompetitor();
  }, [competitorId]);

  const getOneCompetitor = () => {
    if (competitorId) {
      setCompetitor(competitors.find(competitor => competitor.id === Number(competitorId)));
    }
  };

  const handleSubmit = async event => {
    event.preventDefault();
    let body = competitor;
    body.isAdult = competitor.isAdult === 'true' ? true : false;
    competitorId ? dispatch(updateCompetitor(competitorId, body, toast)) : dispatch(addCompetitor(body, toast));
    history.push('/competitors');
  };

  return (
    <Box>
      <Subtitle msg={competitorId ? 'Aktualizuj zawodnika' : 'Dodaj zawodnika'} />
      <Stack
        justify={['center', 'space-around', 'space-around', 'space-around']}
        direction={['column', 'row', 'row', 'row']}
        mt={5}
      >
        <Box w="100%">
          <FormControl size="md" id="firstname">
            <FormLabel>Imię</FormLabel>
            <Input
              name="firstname"
              defaultValue={competitor.firstname}
              onChange={e => setCompetitor({ ...competitor, firstname: e.target.value })}
              placeholder="Jan"
            />
          </FormControl>
        </Box>
        <Box w="100%">
          <FormControl size="md" id="lastname">
            <FormLabel>Nazwisko</FormLabel>
            <Input
              name="lastname"
              defaultValue={competitor.lastname}
              onChange={e => setCompetitor({ ...competitor, lastname: e.target.value })}
              placeholder="Kowalski"
            />
          </FormControl>
        </Box>
      </Stack>
      <Stack
        justify={['center', 'space-around', 'space-around', 'space-around']}
        direction={['column', 'row', 'row', 'row']}
        mt={15}
        mb={15}
      >
        <Box w="100%">
          <FormControl id="isAdult">
            <FormLabel>Grupa wiekowa</FormLabel>
            <Select
              name="isAdult"
              value={competitor.isAdult}
              onChange={e => setCompetitor({ ...competitor, isAdult: e.target.value })}
            >
              <option value={false}>U18</option>
              <option value={true}>Senior</option>
            </Select>
          </FormControl>
        </Box>
        <Box w="100%">
          {competitor.isAdult === 'true' ? (
            <FormControl id="belt">
              <FormLabel>Kolor pasa</FormLabel>
              <Select
                name="belt"
                value={competitor.belt}
                onChange={e => setCompetitor({ ...competitor, belt: e.target.value })}
              >
                <option value="biały">Biały</option>
                <option value="niebieski">Niebieski</option>
                <option value="purpurowy">Purpurowy</option>
                <option value="brązowy">Brązowy</option>
                <option value="czarny">Czarny</option>
              </Select>
            </FormControl>
          ) : (
            <FormControl id="belt">
              <FormLabel>Kolor pasa</FormLabel>
              <Select
                name="belt"
                value={competitor.belt}
                onChange={e => setCompetitor({ ...competitor, belt: e.target.value })}
              >
                <option value="biały">Biały</option>
                <option value="żółty">Żółty</option>
                <option value="pomarańczowy">Pomarańczowy</option>
                <option value="zielony">Zielony</option>
              </Select>
            </FormControl>
          )}
        </Box>
        <Box w="100%">
          <FormControl id="stripes">
            <FormLabel>Ilość belek</FormLabel>
            <Select
              as="select"
              name="stripes"
              value={competitor.stripes}
              onChange={e => setCompetitor({ ...competitor, stripes: e.target.value })}
            >
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </Select>
          </FormControl>
        </Box>
      </Stack>
      <ButtonComponent msg={competitorId ? 'Aktualizuj' : 'Dodaj'} onClick={handleSubmit} type="success" />
    </Box>
  );
};

export default AddCompetitor;
