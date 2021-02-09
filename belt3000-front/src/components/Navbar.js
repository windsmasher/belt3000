import React from 'react';
import { Stack, Flex } from '@chakra-ui/react';
import { useSelector, useDispatch } from 'react-redux';
import MenuItem from './MenuItem';
import { logout } from '../actions/auth-actions';

const Navbar = () => {
  const dispatch = useDispatch();
  const authData = useSelector(state => state.authData);

  return authData.token ? (
    <Flex
      bgGradient={['white', 'white', 'linear(to-r, blue.300, pink.900)', 'linear(to-r, blue.300, pink.900)']}
      color={['black', 'black', 'linear(to-r, blue.300, pink.900)', 'linear(to-r, blue.300, pink.900)']}
      p={5}
      mt={5}
      mb={5}
      borderRadius={6}
      justify="center"
    >
      <Stack
        spacing={[12, 12, 5, 12]}
        align="center"
        justify={['center', 'center', 'flex-end', 'flex-end']}
        direction={['column', 'column', 'row', 'row']}
        pt={[4, 4, 0, 0]}
      >
        <MenuItem isLink={true} to="/">
          Strona główna
        </MenuItem>
        <MenuItem isLink={true} to="/competitors">
          Zawodnicy
        </MenuItem>
        <MenuItem isLink={true} to="/nominations">
          Nominacje
        </MenuItem>
        <MenuItem isLink={true} to="/add-admin">
          Trenerzy
        </MenuItem>
        <MenuItem isLink={true} to="/new-password">
          Zmień hasło
        </MenuItem>
        <MenuItem
          isLink={false}
          onClick={() => {
            dispatch(logout());
          }}
        >
          Wyloguj się
        </MenuItem>
      </Stack>
    </Flex>
  ) : null;
};

export default Navbar;
