import React, { useContext, useState } from 'react';
import { Config } from '../config/config';
import { withRouter } from 'react-router-dom';
import { NavLink, useHistory } from 'react-router-dom';
import { AuthContext } from '../context';
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
import CommonButton from '../components/CommonButton';
import Subtitle from '../components/Subtitle';

const Login = () => {
  const authContext = useContext(AuthContext);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);
  const history = useHistory();
  const toast = useToast();

  const handleShowPassword = () => setShow(!show);

  const handleInputChange = event => {
    const { value, name } = event.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const onSubmit = async event => {
    event.preventDefault();
    console.log(loginData);
    try {
      const res = await fetch(`${Config.API_URL}auth/login`, {
        method: 'POST',
        body: JSON.stringify(loginData),
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.status === 200) {
        const data = await res.json();
        authContext.login(data.token);
        history.push('/');
      } else {
        toast({
          title: 'Wystąpił błąd.',
          status: 'error',
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
        <CommonButton msg="Zaloguj" onClick={onSubmit} />
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
