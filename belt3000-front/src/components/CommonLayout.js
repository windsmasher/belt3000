import React from 'react';
import Navbar from './Navbar';
import Header from './Header';
import { Box } from '@chakra-ui/react';

const CommonLayout = ({ children }) => {
  return (
    <Box>
      <Header />
      <Navbar />
      <Box>{children}</Box>
    </Box>
  );
};

export default CommonLayout;
