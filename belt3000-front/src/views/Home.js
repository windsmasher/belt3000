import React, { useState, useEffect, useContext } from 'react';
import { Config } from '../config/config';
import { AuthContext } from '../context';
import { useToast, Box, Stat, StatNumber, StatLabel, Heading, Stack, Text } from '@chakra-ui/react';

const Home = () => {
  const [competitors, setCompetitors] = useState([]);
  const [gymDetails, setGymDetails] = useState({ name: '', city: '' });
  const authContext = useContext(AuthContext);
  const toast = useToast();

  useEffect(() => {
    console.log(authContext.token);
    // fetchAllCompetitors();
    fetchGymDetails();
  }, []);

  const fetchAllCompetitors = async () => {
    try {
      const response = await fetch(`${Config.API_URL}competitor/all`, {
        headers: { authorization: authContext.token },
      });
      const competitors = await response.json();
      console.log('competitors => ', competitors);
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
      console.log('gym details => ', gymDetails);
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

  return (
    <Stack
      justify={['center', 'space-between', 'flex-end', 'flex-end']}
      direction={['column', 'row', 'row', 'row']}
      spacing="15%"
      p={20}
    >
      <Box>
        <Box>
          <Heading mb={8}>
            Aktywny klub: <Text color="blue.500">{gymDetails.name}</Text>
          </Heading>
        </Box>
        <Box>
          <Heading mb={8}>Aktualności</Heading>
        </Box>
        <Box textAlign="justify">
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem
          aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
          Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni
          dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit
          amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam
          aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit
          laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea
          voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla
          pariatur
        </Box>
      </Box>
      <Box textAlign="right">
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
    </Stack>
  );
};

export default Home;
