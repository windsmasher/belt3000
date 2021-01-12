import React from 'react';
import { Box, Text } from '@chakra-ui/react';

const Subtitle = ({ msg }) => (
  <Box textAlign="center" m={5} fontSize={30}>
    <Text size="xl">{msg}</Text>
  </Box>
);

export default Subtitle;
