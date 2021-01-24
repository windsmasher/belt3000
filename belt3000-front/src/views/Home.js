import React, { useState, useEffect, useContext } from 'react';
import { Config } from '../config/config';
import { AuthContext } from '../context';
import { useToast, Box, Stat, StatNumber, StatLabel, Heading, Stack, Text, Select, Flex } from '@chakra-ui/react';
import ButtonComponent from '../components/ButtonComponent';

const Home = () => {
  const [competitors, setCompetitors] = useState([]);
  const [gymDetails, setGymDetails] = useState({ id: '', name: '', city: '' });
  const [mineGyms, setMineGyms] = useState([]);
  const [gymToChangeId, setGymToChangeId] = useState(null);
  const authContext = useContext(AuthContext);
  const toast = useToast();

  useEffect(() => {
    fetchAllCompetitors();
    fetchGymDetails();
    fetchMineGyms();
    return () => {};
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
        title: 'Wystąpił błąd.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.log(`Competitors fetch error: ${err}`);
    }
  };

  const fetchGymDetails = async () => {
    try {
      const response = await fetch(`${Config.API_URL}gym/details`, {
        headers: { authorization: authContext.token },
      });
      const gymDetails = await response.json();
      setGymDetails(gymDetails);
    } catch (err) {
      toast({
        title: 'Wystąpił błąd.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const fetchMineGyms = async () => {
    try {
      const response = await fetch(`${Config.API_URL}gym/mine`, {
        headers: { authorization: authContext.token },
      });
      const gyms = await response.json();
      setMineGyms(gyms);
      setGymToChangeId(gyms.filter(gym => gym.id !== gymDetails.id)[0].id);
    } catch (err) {
      toast({
        title: 'Wystąpił błąd.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const updateCurrentGym = async () => {
    console.log(gymToChangeId);
    try {
      await fetch(`${Config.API_URL}user/currentGym/${gymToChangeId}`, {
        headers: { authorization: authContext.token },
        method: 'PATCH',
      });
      await fetchMineGyms();
      await fetchGymDetails();
    } catch (err) {
      toast({
        title: 'Wystąpił błąd.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  const restGymsLength = mineGyms.filter(gym => gym.id !== gymDetails.id).length;
  return (
    <Flex justify="space-around" mt={20}>
      <Box>
        <Box>
          <Heading mb={8}>
            Aktywny klub <Text color="blue.500">{gymDetails.name}</Text>
          </Heading>
          {restGymsLength === 0 ? null : restGymsLength === 1 ? (
            <Flex justify="start">
              <Box mb={8}>
                <ButtonComponent
                  msg={`Przełącz na ${mineGyms.find(gym => gym.id !== gymDetails.id).name}`}
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
                      <option value={gym.id}>{gym.name}</option>
                    ))}
                </Select>

                <ButtonComponent msg="Przełącz" onClick={updateCurrentGym} />
              </Stack>
            </Box>
          )}
        </Box>
      </Box>
      <Box textAlign="center">
        <Box>
          <Heading mb={8}>Statystyki</Heading>
        </Box>
        <Box>
          <Stat mb={5}>
            <StatLabel>Łączna liczba zawodników</StatLabel>
            <StatNumber>{competitors?.length || 0}</StatNumber>
          </Stat>
        </Box>
        <Box>
          <Stat>
            <StatLabel>Łączna liczba nominacji</StatLabel>
            <StatNumber>{competitors?.reduce((prev, curr) => prev + curr.nomination?.length, 0) || 0}</StatNumber>
          </Stat>
        </Box>
      </Box>
    </Flex>
  );
};

export default Home;
