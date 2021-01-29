import React, { useState, useContext } from 'react';
import { Box, Link, Text, Input, useToast } from '@chakra-ui/react';
import { Config } from '../config/config';
import { AuthContext } from '../AuthContext';

const NewGymRequest = ({ fetchGyms }) => {
  const [showInputForNewGym, setShowInputForNewGym] = useState(false);
  const [newGymValue, setNewGymValue] = useState('');
  const toast = useToast();
  const authContext = useContext(AuthContext);

  const newGymRequest = async () => {
    try {
      const res = await fetch(`${Config.API_URL}gym/request-for-new-gym`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', authorization: authContext.token },
        body: JSON.stringify({ name: newGymValue }),
      });
      if (res.status !== 200) {
        toast({
          title: (await res?.json())?.errorMsg || 'Wystąpił błąd. Niepoprawne dane.',
          status: 'error',
          isClosable: true,
          duration: 3000,
        });
      } else {
        toast({
          title: 'Prośba o nowy klub wysłana',
          status: 'success',
          isClosable: true,
          duration: 3000,
        });
        setNewGymValue('');
        fetchGyms();
      }
    } catch (e) {
      toast({
        title: 'Wystąpił błąd.',
        status: 'error',
        isClosable: true,
        duration: 3000,
      });
    }
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
