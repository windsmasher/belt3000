import React, { useContext } from 'react';
import { Box, Heading, List, ListItem, Link, useToast } from '@chakra-ui/react';
import { Config } from '../config/config';
import { AuthContext } from '../AuthContext';
import { apiCall } from '../apiCall';

const NotAcceptedGymList = ({ gymsNotAccepted, fetchGyms }) => {
  const authContext = useContext(AuthContext);
  const toast = useToast();

  const deleteGym = async gymId => {
    await apiCall(
      `${Config.API_URL}gym/remove-not-accepted/${gymId}`,
      {
        method: 'DELETE',
        headers: { authorization: authContext.token },
      },
      toast,
      'Poprawnie usunięto wniosek',
      'Błąd usunięcia wniosku.',
      async res => {
        await fetchGyms();
      },
      () => {
        authContext.logout();
      },
    );
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
