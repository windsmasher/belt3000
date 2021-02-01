import React, { useContext, useState, useEffect } from 'react';
import { Config } from '../config/config';
import { NavLink, useHistory } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import {
  useToast,
  Input,
  Box,
  Stack,
  Button,
  Link,
  InputGroup,
  InputRightElement,
  FormLabel,
  FormControl,
  Text,
} from '@chakra-ui/react';
import ButtonComponent from '../components/ButtonComponent';
import Subtitle from '../components/Subtitle';
import { apiCall } from '../apiCall';

const Login = () => {
  const authContext = useContext(AuthContext);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);
  const history = useHistory();
  const toast = useToast();

  useEffect(() => {
    if (authContext.isLoggedIn) {
      history.push('/');
    }
  }, []);

  const handleShowPassword = () => setShow(!show);

  const handleInputChange = event => {
    const { value, name } = event.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const onSubmit = async event => {
    event.preventDefault();

    apiCall(
      `${Config.API_URL}auth/login`,
      {
        method: 'POST',
        body: JSON.stringify(loginData),
        headers: { 'Content-Type': 'application/json' },
      },
      toast,
      '',
      'Wystąpił błąd.',
      async res => {
        const body = await res.json();
        authContext.login({ token: body.token });
        history.push('/');
      },
      () => {},
    );
  };

  return (
    <Box>
      <Subtitle msg="Logowanie" />
      <Stack
        justify={['center', 'space-between', 'flex-end', 'flex-end']}
        direction={['column', 'row', 'row', 'row']}
        mt={10}
      >
        <FormControl size="md">
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            name="email"
            label="Email"
            defaultValue={loginData.email}
            onChange={handleInputChange}
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
              defaultValue={loginData.password}
              onChange={handleInputChange}
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
        <ButtonComponent msg="Zaloguj" onClick={onSubmit} type="success" />
        <Link as={NavLink} to="/register-admin">
          <Box mt={5} textAlign="center">
            <Text>Nie masz konta? Zarejestruj się.</Text>
          </Box>
        </Link>
      </Box>
    </Box>
  );
};

export default Login;
