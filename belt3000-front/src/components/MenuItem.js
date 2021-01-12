import { Text, Box, Link } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';

const MenuItem = ({ children, to = '/', onClick, isLink }) => {
  const TextOfMenuItem = (
    <Text display="block" fontWeight="bold" _hover={{ textDecoration: 'none' }}>
      {children}
    </Text>
  );

  return isLink ? (
    <Link as={NavLink} to={to} _hover={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
      <Box _hover={{ color: 'white', textDecoration: 'none' }} p={3} borderRadius={10}>
        {TextOfMenuItem}
      </Box>
    </Link>
  ) : (
    <Box _hover={{ color: 'white', textDecoration: 'none' }} p={3} borderRadius={10} onClick={onClick} cursor="pointer">
      {TextOfMenuItem}
    </Box>
  );
};

export default MenuItem;
