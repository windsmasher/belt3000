import React, { useState, useEffect, useContext } from 'react';
import { Text, Stack, Box, FormControl, Input, List, ListItem, Link, useToast, Divider } from '@chakra-ui/react';
import Subtitle from '../components/Subtitle';
import ButtonComponent from '../components/ButtonComponent';
import { Config } from '../config/config';
import { AuthContext } from '../AuthContext';

const AddAdmin = () => {
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [adminsList, setAdminsList] = useState([]);
  const authContext = useContext(AuthContext);
  const toast = useToast();

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await fetch(`${Config.API_URL}user/list-from-gym-except-me/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', authorization: authContext.token },
      });
      const admins = await response.json();
      setAdminsList(admins);
    } catch (e) {
      toast({
        title: 'Wystąpił błąd.',
        status: 'error',
        isClosable: true,
        duration: 3000,
      });
    }
  };

  const handleAddAdmin = async () => {
    try {
      const res = await fetch(`${Config.API_URL}user/add-admin/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', authorization: authContext.token },
        body: JSON.stringify({ email: newAdminEmail }),
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
          title: 'Zaproszono nowego trenera',
          status: 'success',
          isClosable: true,
          duration: 3000,
        });
        setNewAdminEmail('');
        await fetchAdmins();
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
