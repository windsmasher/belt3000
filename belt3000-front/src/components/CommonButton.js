import React from 'react';
import { Button, Flex } from '@chakra-ui/react';

const CommonButton = ({ msg, onClick }) => (
  <Flex justify="center" w="100%">
    <Button
      bgGradient="linear(to-r, blue.300, pink.900)"
      _hover={{ bgGradient: 'linear(to-r, blue.200, pink.800)', color: 'white' }}
      onClick={onClick}
      border="none"
      w="20%"
      minWidth="200px"
    >
      {msg}
    </Button>
  </Flex>
);

export default CommonButton;
