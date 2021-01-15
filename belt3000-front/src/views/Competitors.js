import React, { useState, useContext, useEffect } from 'react';
import { Config } from '../config/config';
import { AuthContext } from '../context';
import { useHistory, NavLink } from 'react-router-dom';
import { Table, Thead, Tbody, Tr, Th, Td, useToast, Stack, Box, Link, Flex } from '@chakra-ui/react';
import SpinnerComponent from '../components/Spinner';
import ButtonComponent from '../components/ButtonComponent';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';

const Competitors = () => {
  const authContext = useContext(AuthContext);
  const history = useHistory();
  const [competitors, setCompetitors] = useState([]);
  const [competitorsDownloaded, setCompetitorsDownloaded] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchAllCompetitors();
  }, []);

  const fetchAllCompetitors = async () => {
    try {
      const response = await fetch(`${Config.API_URL}competitor/all`, {
        headers: { auThorization: authContext.token },
      });
      const competitors = await response.json();
      setCompetitors(competitors);
      setCompetitorsDownloaded(true);
    } catch (err) {
      toast({
        title: 'Błąd pobrania listy zawodników.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async id => {
    try {
      const res = await fetch(`${Config.API_URL}competitor/${id}`, {
        method: 'DELETE',
        headers: { auThorization: authContext.token },
      });
      if (res.status !== 200) {
        toast({
          title: 'Błąd usunięcia zawodnika.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Poprawnie usunięto zawodnika.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (e) {
      toast({
        title: 'Błąd usunięcia zawodnika.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
    fetchAllCompetitors();
  };

  const competitorsList = competitors.map((comp, index) => (
    <Tr>
      <Td>{index + 1}</Td>
      <Td>{comp.firstname}</Td>
      <Td>{comp.lastname}</Td>
      <Td>{Boolean(comp.isAdult) === true ? 'Dorosły' : 'U18'}</Td>
      <Td>{comp.belt}</Td>
      <Td>{comp.stripes}</Td>
      <Td>
        <Flex justifyItems="center">
          <Link as={NavLink} to={`/add-competitor/${comp.id}`}>
            <EditIcon w={5} h={5} />
          </Link>
        </Flex>
      </Td>
      <Td>
        <Flex justifyItems="center">
          <Link href="#" onClick={() => handleDelete(comp.id)}>
            <DeleteIcon w={5} h={5} />
          </Link>
        </Flex>
      </Td>
    </Tr>
  ));

  return (
    <Box>
      <Stack justify="center" mt={10} mb={10}>
        <ButtonComponent type="common" msg="Dodaj zawodnika" onClick={() => history.push('/add-competitor')} />
      </Stack>
      <Box>
        {competitorsDownloaded ? (
          <Table>
            <Thead>
              <Tr>
                <Th>Lp.</Th>
                <Th>Imię</Th>
                <Th>Nazwisko</Th>
                <Th>Kategoria wiekowa</Th>
                <Th>Kolor pasa</Th>
                <Th>Ilość belek</Th>
                <Th>Edytuj</Th>
                <Th>Usuń</Th>
              </Tr>
            </Thead>
            <Tbody>{competitorsList}</Tbody>
          </Table>
        ) : (
          <SpinnerComponent />
        )}
      </Box>
    </Box>
  );
};

export default Competitors;
