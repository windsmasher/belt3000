import React, { useState } from 'react';
import { Text, Stack, Box, FormControl, Input, List, ListItem, Link } from '@chakra-ui/react';
import Subtitle from '../components/Subtitle';
import ButtonComponent from '../components/ButtonComponent';

const AddAdmin = () => {
  const [newAdmin, setNewAdmin] = useState({ email: '' });
  const [adminsList, setAdminsList] = useState([
    { email: 'jan@op.pl', generatedPassword: '123' },
    { email: 'admin@op.pl', generatedPassword: '123' },
  ]);

  const handleAddAdmin = async () => {};

  return (
    <Box>
      <Subtitle msg="Dodaj trenera" />
      <Stack
        justify={['center', 'space-between', 'flex-end', 'flex-end']}
        direction={['column', 'row', 'row', 'row']}
        mb={5}
        mt={5}
      >
        <FormControl size="md" isRequired>
          <Input
            type="email"
            name="email"
            label="Email"
            defaultValue={newAdmin.email}
            onChange={e => setNewAdmin({ ...newAdmin, email: e.target.value })}
            placeholder="Tu wpisz email trenera"
          />
        </FormControl>
        <ButtonComponent msg="Dodaj" onClick={handleAddAdmin} />
      </Stack>
      <Subtitle msg="Lista trenerów" />
      <List>
        {adminsList.map(admin => (
          <ListItem mb={5}>
            <Text fontSize="2xl">E-MAIL: {admin.email}</Text>
            <Text fontSize="2xl">WYGENEROWANE HASŁO: {admin.generatedPassword}</Text>
            <Text fontSize="2xl" color="red.500">
              <Link>Usuń trenera</Link>
            </Text>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default AddAdmin;
