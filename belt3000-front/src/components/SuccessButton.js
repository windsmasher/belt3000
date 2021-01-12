import React from 'react';
import { Button, Flex } from '@chakra-ui/react';

const SuccessButton = ({ msg, onClick }) => (
  <Flex justify="center">
    <Button
      bgGradient="linear(to-r, green.300, green.800)"
      _hover={{ bgGradient: 'linear(to-r, green.200, green.900)', color: 'white' }}
      onClick={onClick}
      border="none"
      w="20%"
    >
      {msg}
    </Button>
  </Flex>
);

export default SuccessButton;
