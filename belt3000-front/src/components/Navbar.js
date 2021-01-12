import React, { useContext } from 'react';
import { AuthContext } from '../context';
import { Stack, Flex } from '@chakra-ui/react';
import MenuItem from './MenuItem';

const Navbar = () => {
  const authContext = useContext(AuthContext);

  return (
    <Flex
      bgGradient={[
        'white',
        'linear(to-b, blue.300, pink.900)',
        'linear(to-r, blue.300, pink.900)',
        'linear(to-r, blue.300, pink.900)',
      ]}
      color={[
        'black',
        'linear(to-b, blue.300, pink.900)',
        'linear(to-r, blue.300, pink.900)',
        'linear(to-r, blue.300, pink.900)',
      ]}
      p={5}
      mt={5}
      mb={5}
      borderRadius={6}
      justify="center"
    >
      <Stack
        spacing={12}
        align="center"
        justify={['center', 'space-between', 'flex-end', 'flex-end']}
        direction={['column', 'row', 'row', 'row']}
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
        <MenuItem isLink={false} onClick={() => authContext.logout()}>
          Wyloguj się
        </MenuItem>
      </Stack>
    </Flex>
  );
};

export default Navbar;
