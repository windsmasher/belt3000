import React, { useState } from 'react';
import { Config } from '../config/config';
import {
  Input,
  Box,
  Stack,
  Button,
  InputGroup,
  InputRightElement,
  FormLabel,
  FormControl,
  Text,
  useToast,
  Link,
} from '@chakra-ui/react';
import ButtonComponent from '../components/ButtonComponent';
import { NavLink } from 'react-router-dom';
import { apiCall } from '../apiCall';

const RegisterAdmin = () => {
  const [registerData, setRegisterData] = useState({
    firstname: '',
    lastname: '',
    password: '',
    email: '',
    newGymName: '',
  });
  const [show, setShow] = useState(false);
  const toast = useToast();

  const handleShowPassword = () => setShow(!show);

  const handleChange = event => {
    const name = event.target.name;
    const value = event.target.value;
    setRegisterData({ ...registerData, [name]: value });
  };

  const handleSubmit = async event => {
    event.preventDefault();
    apiCall(
      `${Config.API_URL}gym/new-gym-with-new-account`,
      {
        method: 'POST',
        body: JSON.stringify(registerData),
        headers: {
          'Content-Type': 'application/json',
        },
      },
      toast,
      'Poprawnie zarejestrowano.',
      'Wystąpił błąd.',
      async res => {},
      () => {},
    );
  };

  return (
    <Box>
      <Box textAlign="center" m={5} fontSize={30}>
        <Text size="">Rejestracja nowego klubu</Text>
      </Box>
      <Stack
        justify={['center', 'space-between', 'flex-end', 'flex-end']}
        direction={['column', 'row', 'row', 'row']}
        mt={10}
      >
        <FormControl size="md" isRequired>
          <FormLabel>Imię</FormLabel>
          <Input
            type="text"
            name="firstname"
            defaultValue={registerData.firstname}
            onChange={handleChange}
            placeholder="Jan"
          />
        </FormControl>
        <FormControl size="md" isRequired>
          <FormLabel>Nazwisko</FormLabel>
          <Input
            type="text"
            name="lastname"
            placeholder="Kowalski"
            defaultValue={registerData.lastname}
            onChange={handleChange}
          />
        </FormControl>
      </Stack>
      <Stack
        justify={['center', 'space-between', 'flex-end', 'flex-end']}
        direction={['column', 'row', 'row', 'row']}
        mb={5}
        mt={5}
      >
        <FormControl size="md" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            name="email"
            label="Email"
            defaultValue={registerData.email}
            onChange={handleChange}
            placeholder="jan.kowalski@gmail.com"
          />
        </FormControl>
        <FormControl size="md" isRequired>
          <FormLabel>Hasło</FormLabel>
          <InputGroup>
            <Input
              pr="4.5rem"
              type={show ? 'text' : 'password'}
              name="password"
              placeholder="Wpisz hasło"
              defaultValue={registerData.password}
              onChange={handleChange}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleShowPassword}>
                {show ? 'Ukryj' : 'Pokaż'}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
      </Stack>
      <FormControl size="md" id="newGymName">
        <FormLabel>Nazwa Twojego klubu</FormLabel>
        <Input
          type="text"
          name="newGymName"
          label="Nazwa nowego klubu"
          defaultValue={registerData.newGym}
          onChange={e => setRegisterData({ ...registerData, newGymName: e.target.value })}
          placeholder="Tu wpisz nazwę nowego klubu"
        />
      </FormControl>
      <Box mt={5}>
        <ButtonComponent type="success" msg="Zarejestruj" onClick={handleSubmit} />
        <Link as={NavLink} to="/login-admin">
          <Box mt={5} textAlign="center">
            <Text>Masz konto? Zaloguj się.</Text>
          </Box>
        </Link>
      </Box>
    </Box>
  );
};

export default RegisterAdmin;
