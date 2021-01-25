import React from 'react';
import { Button, Flex } from '@chakra-ui/react';

const ButtonComponent = ({ msg, onClick, type }) => {
  const gradient = type === 'success' ? 'linear(to-r, green.300, green.800)' : 'linear(to-r, blue.300, pink.800)';
  const activeGradient = type === 'success' ? 'linear(to-r, green.200, green.900)' : 'linear(to-r, blue.200, pink.900)';

  return (
    <Flex justify="center" w="100%">
      <Button
        bgGradient={gradient}
        _hover={{ bgGradient: gradient, color: 'white' }}
        onClick={onClick}
        minWidth="100px"
        _focus={{ boxShadow: 'none', outline: 'none' }}
        _active={{ bgGradient: activeGradient, color: 'white', transform: 'scale(.98)' }}
        alignItems="center"
      >
        {msg}
      </Button>
    </Flex>
  );
};

export default ButtonComponent;
