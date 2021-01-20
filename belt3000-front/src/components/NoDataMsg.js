import { Box, Heading } from '@chakra-ui/react';

const NoDataMsg = ({ msg }) => (
  <Box p={30} textAlign="center">
    <Heading>{msg}</Heading>
  </Box>
);

export default NoDataMsg;
