import React, { useState, useEffect, useContext } from 'react';
import { Config } from '../config/config';
import { Table, Thead, Tbody, Tr, Th, Td, Select, useToast, Stack, Box, Flex } from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import { AuthContext } from '../context';
import { useHistory } from 'react-router-dom';
import SpinnerComponent from '../components/Spinner';
import ButtonComponent from '../components/ButtonComponent';
import NoDataMsg from '../components/NoDataMsg';

const Nominations = () => {
  const [nominations, setNominations] = useState([]);
  const [competitors, setCompetitors] = useState([]);
  const [selectedCompetitor, setSelectedCompetitor] = useState('all');
  const [nominationsDownloaded, setNominationsDownloaded] = useState(false);
  const authContext = useContext(AuthContext);
  const history = useHistory();
  const toast = useToast();

  useEffect(() => {
    fetchAllNominations();
    fetchAllCompetitors();
  }, []);

  const fetchAllCompetitors = async () => {
    try {
      const response = await fetch(`${Config.API_URL}competitor/all`, {
        headers: { authorization: authContext.token },
      });
      const competitors = await response.json();
      setCompetitors(competitors);
    } catch (err) {
      toast({
        title: 'Błąd pobrania listy zawodników.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.log(`Competitors fetch error: ${err}`);
    }
  };

  const fetchAllNominations = async () => {
    try {
      const response = await fetch(`${Config.API_URL}nomination/all`, {
        headers: { authorization: localStorage.getItem('token') },
      });
      const nominations = await response.json();
      setNominations(nominations);
      setNominationsDownloaded(true);
    } catch (err) {
      toast({
        title: 'Błąd pobrania listy nominacji.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const fetchNominationsByCompetitor = async competitorId => {
    try {
      const response = await fetch(`${Config.API_URL}nomination/by-competitor/${competitorId}`, {
        headers: { authorization: localStorage.getItem('token') },
      });
      const nominationsByCompetitor = await response.json();
      setNominations(nominationsByCompetitor);
    } catch (err) {
      toast({
        title: 'Błąd pobrania listy nominacji.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleNominationPerson = async event => {
    setSelectedCompetitor(event.target.value);
    if (event.target.value === 'all') {
      await fetchAllNominations();
    } else {
      await fetchNominationsByCompetitor(event.target.value);
    }
  };

  const deletePreviousNomination = async () => {
    try {
      const res = await fetch(`${Config.API_URL}nomination/previous/${selectedCompetitor}`, {
        method: 'DELETE',
        headers: { authorization: localStorage.getItem('token') },
      });
      if (res.status === 200) {
        toast({
          title: 'Poprawnie usunięto ostatnią nominacje.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: (await res?.json())?.errorMsg || 'Błąd usunięcia ostatniej nominacji.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err) {
      toast({
        title: 'Błąd usunięcia ostatniej nominacji.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
    fetchAllNominations();
  };

  const nominationList = nominations.map((nom, index) => (
    <Tr>
      <Td>{index + 1}</Td>
      <Td>{nom.person}</Td>
      <Td>{nom.nomination}</Td>
      <Td>{new Date(nom.date).toLocaleDateString()}</Td>
      <Td>
        <Flex justifyItems="center">
          {nom.description}
          <EditIcon ml={5} w={5} h={5} />
        </Flex>
      </Td>
    </Tr>
  ));

  return (
    <Box>
      <Stack direction="row" align="center" justify="center" mt={10} mb={10}>
        <Select name="person" value={selectedCompetitor} onChange={handleNominationPerson}>
          <option value="all">Wszystkie</option>
          {competitors.map(person => (
            <option key={person.id} value={person.id}>
              {`${person.firstname} ${person.lastname}`}
            </option>
          ))}
        </Select>
        {selectedCompetitor === 'all' ? (
          <Box></Box>
        ) : (
          <Box>
            <ButtonComponent
              type="common"
              msg="Dodaj nominacje"
              onClick={() => history.push(`/add-nomination/${selectedCompetitor}`)}
            />
          </Box>
        )}
        {selectedCompetitor === 'all' || competitors.length === 0 ? (
          <Box></Box>
        ) : (
          <Box>
            <ButtonComponent type="common" msg="Usuń ostatnią nominacje" onClick={deletePreviousNomination} />
          </Box>
        )}
      </Stack>
      <Box>
        {!nominationsDownloaded ? (
          <SpinnerComponent />
        ) : nominations.length === 0 ? (
          <NoDataMsg msg="Brak nominacji" />
        ) : (
          <Table>
            <Thead>
              <Tr>
                <Th>Lp.</Th>
                <Th>Osoba nominowana</Th>
                <Th>Nominacja</Th>
                <Th>Data</Th>
                <Th>Opis</Th>
              </Tr>
            </Thead>
            <Tbody>{nominationList}</Tbody>
          </Table>
        )}
      </Box>
    </Box>
  );
};

export default Nominations;
