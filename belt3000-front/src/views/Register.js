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
import CommonButton from '../components/CommonButton';
import { NavLink } from 'react-router-dom';

const RegisterAdmin = () => {
  const [registerData, setRegisterData] = useState({ firstname: '', lastname: '', password: '', email: '' });
  const toast = useToast();
  const [show, setShow] = useState(false);

  const handleShowPassword = () => setShow(!show);

  const handleChange = event => {
    const name = event.target.name;
    const value = event.target.value;
    setRegisterData({ ...registerData, [name]: value });
  };

  const handleSubmit = async event => {
    event.preventDefault();
    try {
      const res = await fetch(`${Config.API_URL}user/register-admin`, {
        method: 'POST',
        body: JSON.stringify(registerData),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (res.status !== 201) {
        toast({
          title: 'Wystąpił błąd. Niepoprawne dane.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Poprawnie zarejestrowano.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (e) {
      toast({
        title: 'Wystąpił błąd.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <Box textAlign="center" m={5} fontSize={30}>
        <Text size="">Rejestracja</Text>
      </Box>
      <Stack
        justify={['center', 'space-between', 'flex-end', 'flex-end']}
        direction={['column', 'row', 'row', 'row']}
        mt={10}
      >
        <FormControl size="md">
          <FormLabel>Imię</FormLabel>
          <Input
            type="text"
            name="firstname"
            defaultValue={registerData.firstname}
            onChange={handleChange}
            placeholder="Jan"
          />
        </FormControl>
        <FormControl size="md">
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
        mb={10}
        mt={5}
      >
        <FormControl size="md">
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
        <FormControl size="md">
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
      <Box mt={5}>
        <CommonButton msg="Zarejestruj" onClick={handleSubmit} />
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
