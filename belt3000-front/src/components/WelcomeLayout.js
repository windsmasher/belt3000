import React from 'react';
import { Box, Heading, Stack, Flex } from '@chakra-ui/react';

const WelcomeLayout = ({ children }) => {
  return (
    <Stack direction="row">
      <Flex bg="blue.900" w="50%" justify="center" align="center">
        <Heading>Witaj</Heading>
      </Flex>
      <Box>{children}</Box>
    </Stack>
  );
};

export default WelcomeLayout;
