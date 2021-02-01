import React, { useState, useEffect, useContext } from 'react';
import { Text, Stack, Box, FormControl, Input, List, ListItem, Link, useToast, Divider } from '@chakra-ui/react';
import Subtitle from '../components/Subtitle';
import ButtonComponent from '../components/ButtonComponent';
import { Config } from '../config/config';
import { AuthContext } from '../AuthContext';
import { apiCall } from '../apiCall';

const AddAdmin = () => {
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [adminsList, setAdminsList] = useState([]);
  const authContext = useContext(AuthContext);
  const toast = useToast();

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    await apiCall(
      `${Config.API_URL}user/list-from-gym-except-me/`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', authorization: authContext.token },
      },
      toast,
      '',
      'Wystąpił błąd.',
      async res => {
        const body = await res.json();
        console.log(body);
        setAdminsList(body);
      },
      () => {
        authContext.logout();
      },
    );
  };

  const handleAddAdmin = async () => {
    apiCall(
      `${Config.API_URL}user/add-admin/`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', authorization: authContext.token },
        body: JSON.stringify({ email: newAdminEmail }),
      },
      toast,
      'Zaproszono nowego trenera',
      'Wystąpił błąd.',
      async res => {
        setNewAdminEmail('');
        await fetchAdmins();
      },
      () => {
        authContext.logout();
      },
    );
  };

  return (
    <Box>
      <Subtitle msg="Dodaj trenera" />
      <Stack
        justify={['center', 'space-between', 'flex-end', 'flex-end']}
        direction={['column', 'row', 'row', 'row']}
        mb={10}
        mt={5}
      >
        <FormControl mb={5} size="md" isRequired>
          <Input
            type="email"
            name="email"
            label="Email"
            value={newAdminEmail}
            onChange={e => setNewAdminEmail(e.target.value)}
            placeholder="Tu wpisz email trenera"
          />
        </FormControl>
        <ButtonComponent msg="Dodaj" onClick={handleAddAdmin} />
      </Stack>
      <Subtitle msg="Lista trenerów" />
      <List>
        <Divider mb={5} />
        {adminsList.map(admin => (
          <ListItem mb={5}>
            <Box fontSize="xl">
              <Text fontWeight="bold">E-MAIL:</Text>
              <Text fontStyle="italic"> {admin.email}</Text>
            </Box>
            <Box fontSize="xl">
              <Text fontWeight="bold">WYGENEROWANE HASŁO:</Text>
              <Text fontStyle="italic">{admin.generatedPassword ?? 'Użytkownik zmienił hasło'}</Text>
            </Box>
            <Divider mb={5} mt={5} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default AddAdmin;
