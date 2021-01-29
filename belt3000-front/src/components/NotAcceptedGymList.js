import React, { useContext } from 'react';
import { Box, Heading, List, ListItem, Link, useToast } from '@chakra-ui/react';
import { Config } from '../config/config';
import { AuthContext } from '../AuthContext';

const NotAcceptedGymList = ({ gymsNotAccepted, fetchGyms }) => {
  const authContext = useContext(AuthContext);
  const toast = useToast();

  const deleteGym = async gymId => {
    try {
      const res = await fetch(`${Config.API_URL}gym/remove-not-accepted/${gymId}`, {
        method: 'DELETE',
        headers: { auThorization: authContext.token },
      });
      if (res.status !== 200) {
        toast({
          title: (await res?.json())?.errorMsg || 'Błąd usunięcia wniosku.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Poprawnie usunięto wniosek.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchGyms();
      }
    } catch (e) {
      toast({
        title: 'Błąd usunięcia wniosku.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return gymsNotAccepted && gymsNotAccepted.length > 0 ? (
    <Box textAlign="center">
      <Heading>Kluby oczekujące </Heading>
      <Heading>na akceptacje</Heading>
      <List mt={5}>
        {gymsNotAccepted.map(gym => (
          <ListItem>
            {gym.name}
            <Link onClick={() => deleteGym(gym.id)} ml={5}>
              Usuń
            </Link>
          </ListItem>
        ))}
      </List>
    </Box>
  ) : null;
};

export default NotAcceptedGymList;
