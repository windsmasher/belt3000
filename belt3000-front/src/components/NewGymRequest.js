import React, { useState, useContext } from 'react';
import { Box, Link, Text, Input, useToast } from '@chakra-ui/react';
import { Config } from '../config/config';
import { AuthContext } from '../AuthContext';
import { apiCall } from '../apiCall';

const NewGymRequest = ({ fetchGyms }) => {
  const [showInputForNewGym, setShowInputForNewGym] = useState(false);
  const [newGymValue, setNewGymValue] = useState('');
  const toast = useToast();
  const authContext = useContext(AuthContext);

  const newGymRequest = async () => {
    apiCall(
      `${Config.API_URL}gym/request-for-new-gym`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', authorization: authContext.token },
        body: JSON.stringify({ name: newGymValue }),
      },
      toast,
      'Prośba o nowy klub wysłana',
      'Wystąpił błąd.',
      async res => {
        setNewGymValue('');
        fetchGyms();
      },
      () => {
        authContext.logout();
      },
    );
  };

  return (
    <Box>
      {!showInputForNewGym ? (
        <Link onClick={() => setShowInputForNewGym(!showInputForNewGym)}>
          <Text>Zawnioskuj o przypisanie</Text>
          <Text>nowego klubu do tego konta</Text>
        </Link>
      ) : null}
      {showInputForNewGym ? (
        <Box mt={5}>
          <Box>
            <Input width="300px" value={newGymValue} onChange={e => setNewGymValue(e.target.value)} />
          </Box>
          <Box mt={3}>
            <Link
              onClick={() => {
                newGymRequest();
                setShowInputForNewGym(!showInputForNewGym);
              }}
              mr={5}
            >
              Wyślij wniosek
            </Link>
            <Link onClick={() => setShowInputForNewGym(!showInputForNewGym)}>Anuluj</Link>
          </Box>
        </Box>
      ) : null}
    </Box>
  );
};

export default NewGymRequest;
