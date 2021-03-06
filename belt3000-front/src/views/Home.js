import React, { useState, useEffect, useContext } from 'react';
import { Config } from '../config/config';
import { AuthContext } from '../AuthContext';
import { useToast, Box, Heading, Stack, Text, Select, Flex } from '@chakra-ui/react';
import ButtonComponent from '../components/ButtonComponent';
import NewGymRequest from '../components/NewGymRequest';
import Statistics from '../components/Statistics';
import NotAcceptedGymList from '../components/NotAcceptedGymList';
import { apiCall } from '../apiCall';

const Home = () => {
  const [gymDetails, setGymDetails] = useState({ id: '', name: '', city: '' });
  const [mineGyms, setMineGyms] = useState([]);
  const [gymToChangeId, setGymToChangeId] = useState(null);
  const authContext = useContext(AuthContext);
  const toast = useToast();

  useEffect(() => {
    fetchGymDetails();
    fetchMineGyms();
    return () => {};
  }, []);

  const fetchGymDetails = async () => {
    apiCall(
      `${Config.API_URL}gym/details`,
      {
        headers: { authorization: authContext.token },
      },
      toast,
      '',
      'Wystąpił błąd.',
      async res => {
        const gymDetails = await res.json();
        setGymDetails(gymDetails);
      },
      () => {
        authContext.logout();
      },
    );
  };

  const fetchMineGyms = async () => {
    apiCall(
      `${Config.API_URL}gym/mine`,
      {
        headers: { authorization: authContext.token },
      },
      toast,
      '',
      'Wystąpił błąd.',
      async res => {
        const gyms = await res.json();
        setMineGyms(gyms);
        setGymToChangeId(gyms.filter(gym => gym.id !== gymDetails.id)[0].id);
      },
      () => {
        authContext.logout();
      },
    );
  };

  const updateCurrentGym = async () => {
    apiCall(
      `${Config.API_URL}user/currentGym/${gymToChangeId}`,
      {
        headers: { authorization: authContext.token },
        method: 'PATCH',
      },
      toast,
      '',
      'Wystąpił błąd.',
      async res => {
        await fetchMineGyms();
        await fetchGymDetails();
      },
      () => {
        authContext.logout();
      },
    );
  };

  const restGymsLength = mineGyms.filter(gym => gym.id !== gymDetails.id && gym.isAccepted === true).length;
  const gymsNotAccepted = mineGyms.filter(gym => gym.isAccepted === false);
  return (
    <Stack
      justify={['center', 'center', 'space-around', 'space-around']}
      direction={['column', 'column', 'row', 'row']}
      mt={20}
    >
      <NotAcceptedGymList gymsNotAccepted={gymsNotAccepted} fetchGyms={fetchMineGyms} />
      <Box textAlign="center">
        <Box>
          <Heading mb={8}>
            Aktywny klub <Text color="blue.500">{gymDetails.name?.toUpperCase()}</Text>
          </Heading>
          {restGymsLength === 0 ? null : restGymsLength === 1 ? (
            <Flex justify="center">
              <Box mb={8}>
                <ButtonComponent
                  msg={`Przełącz na ${mineGyms.find(gym => gym.id !== gymDetails.id).name?.toUpperCase()}`}
                  onClick={updateCurrentGym}
                />
              </Box>
            </Flex>
          ) : (
            <Box mb={8}>
              <Heading mb={8}>Przełącz na inny klub</Heading>
              <Stack
                justify={['center', 'space-between', 'flex-end', 'flex-end']}
                direction={['column', 'row', 'row', 'row']}
                spacing="5%"
              >
                <Select color="blue.500" value={gymToChangeId} onChange={e => setGymToChangeId(e.target.value)}>
                  {mineGyms
                    .filter(gym => gym.id !== gymDetails.id)
                    .map(gym => (
                      <option value={gym.id}>{gym.name?.toUpperCase()}</option>
                    ))}
                </Select>

                <ButtonComponent msg="Przełącz" onClick={updateCurrentGym} />
              </Stack>
            </Box>
          )}
          <NewGymRequest fetchGyms={fetchMineGyms} />
        </Box>
      </Box>
      <Statistics />
    </Stack>
  );
};

export default Home;
