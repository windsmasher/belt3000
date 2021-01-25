import React, { useState, useEffect, useContext } from 'react';
import { Config } from '../config/config';
import { Table, Thead, Tbody, Tr, Th, Td, Select, useToast, Stack, Box, Flex, Input, Link } from '@chakra-ui/react';
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
  const [isEditDescriptionId, setIsEditDescriptionId] = useState(null);
  const [tempDescriptions, setTempDescriptions] = useState([]);
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
      const nominationsRes = await response.json();
      setNominations(nominationsRes);
      setTempDescriptions(nominationsRes.map(nomination => nomination.description));
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
      setTempDescriptions(nominationsByCompetitor.map(nomination => nomination.description));
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

  const updateDescription = async (nominationId, description) => {
    try {
      const res = await fetch(`${Config.API_URL}nomination/edit-description/${nominationId}`, {
        method: 'PATCH',
        body: JSON.stringify({ description: description }),
        headers: { 'Content-Type': 'application/json', authorization: authContext.token },
      });
      if (res.status !== 200) {
        toast({
          title: (await res?.json())?.errorMsg || 'Wystąpił błąd.',
          status: 'error',
          isClosable: true,
          duration: 3000,
        });
      } else {
        toast({
          title: 'Poprawnie zaktualizowano opis.',
          status: 'success',
          isClosable: true,
          duration: 3000,
        });
        setIsEditDescriptionId(null);
        selectedCompetitor === 'all' ? fetchAllNominations() : fetchNominationsByCompetitor(selectedCompetitor);
      }
    } catch (err) {
      toast({
        title: 'Wystąpił błąd.',
        status: 'error',
        isClosable: true,
        duration: 3000,
      });
    }
  };

  const nominationList = nominations.map((nom, index) => (
    <Tr key={index}>
      <Td>{index + 1}</Td>
      <Td>{nom.person}</Td>
      <Td>{nom.nomination}</Td>
      <Td>{new Date(nom.date).toLocaleDateString()}</Td>
      <Td>
        <Box>
          <Box cursor="poiner" onClick={() => setIsEditDescriptionId(nom.id)}>
            <Input
              disabled={isEditDescriptionId !== nom.id}
              name="description"
              value={tempDescriptions[index]}
              onChange={e =>
                setTempDescriptions(tempDescriptions.map((desc, i) => (i === index ? e.target.value : desc)))
              }
            />
          </Box>
          {isEditDescriptionId === nom.id ? (
            <Box mt={5}>
              <Link onClick={() => updateDescription(nom.id, tempDescriptions[index])}>Zapisz</Link>
              <Link
                ml={5}
                onClick={() => {
                  setIsEditDescriptionId(null);
                  setTempDescriptions(nominations.map(n => n.description));
                }}
              >
                Anuluj
              </Link>
            </Box>
          ) : null}
        </Box>
      </Td>
    </Tr>
  ));

  return (
    <Box>
      <Stack
        justify={['center', 'center', 'space-around', 'space-around']}
        direction={['column', 'column', 'row', 'row']}
        mt={10}
        mb={10}
      >
        <Select name="person" value={selectedCompetitor} onChange={handleNominationPerson}>
          <option value="all">Wszystkie</option>
          {competitors.map(person => (
            <option key={person.id} value={person.id}>
              {`${person.firstname} ${person.lastname}`}
            </option>
          ))}
        </Select>
        <Stack justify={'space-around'} direction={'row'}>
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
