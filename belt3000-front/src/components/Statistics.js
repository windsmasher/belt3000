import React, { useState, useEffect, useContext } from 'react';
import { Config } from '../config/config';
import { AuthContext } from '../AuthContext';
import { useToast, Box, Stat, StatNumber, StatLabel, Heading } from '@chakra-ui/react';

const Statistics = () => {
  const [competitors, setCompetitors] = useState([]);
  const authContext = useContext(AuthContext);
  const toast = useToast();

  useEffect(() => {
    fetchAllCompetitors();
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

  return (
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
  );
};

export default Statistics;
