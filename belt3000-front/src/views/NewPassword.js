import React, { useContext, useState } from 'react';
import { Config } from '../config/config';
import { useHistory } from 'react-router-dom';
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

const NewPassword = () => {
  const authContext = useContext(AuthContext);
  const [newPasswordData, setNewPasswordData] = useState({ oldPassword: '', newPassword1: '', newPassword2: '' });
  const history = useHistory();
  const toast = useToast();
  const [show, setShow] = useState(false);

  const handleShowPassword = () => setShow(!show);

  const onSubmit = async event => {
    event.preventDefault();
    try {
      const res = await fetch(`${Config.API_URL}user/new-password`, {
        method: 'PATCH',
        body: JSON.stringify(newPasswordData),
        headers: { 'Content-Type': 'application/json', authorization: authContext.token },
      });
      if (res.status === 200) {
        toast({
          title: 'Hasło zostało zmienione',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setNewPasswordData({ oldPassword: '', newPassword1: '', newPassword2: '' });
      } else {
        toast({
          title: (await res?.json())?.errorMsg || 'Wystąpił błąd.',
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
      <Subtitle msg="Zmiana hasła" />
      <Stack direction="column" mt={10}>
        <FormControl size="md">
          <FormLabel>Stare hasło</FormLabel>
          <InputGroup>
            <Input
              pr="4.5rem"
              type={show ? 'text' : 'password'}
              name="oldPassword"
              placeholder="Wpisz hasło"
              value={newPasswordData.oldPassword}
              onChange={e => setNewPasswordData({ ...newPasswordData, oldPassword: e.target.value })}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleShowPassword}>
                {show ? 'Ukryj' : 'Pokaż'}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <FormControl size="md">
          <FormLabel>Nowe hasło</FormLabel>
          <InputGroup>
            <Input
              pr="4.5rem"
              type={show ? 'text' : 'password'}
              name="newPassword1"
              placeholder="Wpisz nowe hasło"
              value={newPasswordData.newPassword1}
              onChange={e => setNewPasswordData({ ...newPasswordData, newPassword1: e.target.value })}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleShowPassword}>
                {show ? 'Ukryj' : 'Pokaż'}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <FormControl size="md">
          <FormLabel>Powtórz nowe hasło</FormLabel>
          <InputGroup>
            <Input
              pr="4.5rem"
              type={show ? 'text' : 'password'}
              name="newPassword2"
              placeholder="Powtórz nowe hasło"
              value={newPasswordData.newPassword2}
              onChange={e => setNewPasswordData({ ...newPasswordData, newPassword2: e.target.value })}
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
        <ButtonComponent msg="Zmień hasło" onClick={onSubmit} type="success" />
      </Box>
    </Box>
  );
};

export default NewPassword;
