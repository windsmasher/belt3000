import React, { useState, useEffect, useContext } from 'react';
import { Config } from '../config/config';
import { AuthContext } from '../AuthContext';
import { useToast, Box, Stat, StatNumber, StatLabel, Heading } from '@chakra-ui/react';
import { apiCall } from '../apiCall';

const Statistics = () => {
  const [competitors, setCompetitors] = useState([]);
  const authContext = useContext(AuthContext);
  const toast = useToast();

  useEffect(() => {
    fetchAllCompetitors();
  }, []);

  const fetchAllCompetitors = async () => {
    apiCall(
      `${Config.API_URL}competitor/all`,
      {
        headers: { authorization: authContext.token },
      },
      toast,
      '',
      'Wystąpił błąd.',
      async res => {
        const competitors = await res.json();
        setCompetitors(competitors);
      },
      () => {
        authContext.logout();
      },
    );
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
