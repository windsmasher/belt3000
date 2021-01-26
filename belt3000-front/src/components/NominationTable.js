import React from 'react';
import SpinnerComponent from '../components/Spinner';
import ButtonComponent from '../components/ButtonComponent';
import NoDataMsg from '../components/NoDataMsg';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Select,
  Stack,
  Box,
  Input,
  Link,
  useMediaQuery,
  Flex,
  Text,
} from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';

const NominationTable = ({
  nominations,
  competitors,
  setIsEditDescriptionId,
  isEditDescriptionId,
  tempDescriptions,
  setTempDescriptions,
  selectedCompetitor,
  handleNominationPerson,
  updateDescription,
  deletePreviousNomination,
  nominationsDownloaded,
}) => {
  const history = useHistory();
  const [isTable] = useMediaQuery('(min-width: 766px)');

  const NominationSelect = () => (
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
      {selectedCompetitor === 'all' ? (
        <Box></Box>
      ) : (
        <Box>
          <ButtonComponent
            type="common"
            msg="Dodaj nominacje"
            onClick={() => history.push(`/add-nomination/${selectedCompetitor}`)}
            min="220px"
          />
        </Box>
      )}
      {selectedCompetitor === 'all' || competitors.length === 0 ? (
        <Box></Box>
      ) : (
        <Box>
          <ButtonComponent type="common" msg="Usuń ostatnią nominacje" onClick={deletePreviousNomination} min="220px" />
        </Box>
      )}
    </Stack>
  );

  const EditDescription = ({ nom, index }) => (
    <Box>
      <Box cursor="poiner" onClick={() => setIsEditDescriptionId(nom.id)}>
        <Input
          disabled={isEditDescriptionId !== nom.id}
          name="description"
          value={tempDescriptions[index]}
          onChange={e => setTempDescriptions(tempDescriptions.map((desc, i) => (i === index ? e.target.value : desc)))}
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
  );

  return (
    <Box>
      <NominationSelect />
      {!nominationsDownloaded ? (
        <SpinnerComponent />
      ) : nominations.length === 0 ? (
        <NoDataMsg msg="Brak nominacji" />
      ) : isTable ? (
        <Box>
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
            <Tbody>
              {nominations.map((nom, index) => (
                <Tr key={index}>
                  <Td>{index + 1}</Td>
                  <Td>{nom.person}</Td>
                  <Td>{nom.nomination}</Td>
                  <Td>{new Date(nom.date).toLocaleDateString()}</Td>
                  <Td>
                    <EditDescription nom={nom} index={index} />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      ) : (
        <Flex direction="column" align="center" textAlign="center">
          {nominations.map((nom, index) => (
            <Box mb="15" key={index}>
              <Text fontSize="xl">{nom.person}</Text>
              <Text>{nom.nomination}</Text>
              <Text>{new Date(nom.date).toLocaleDateString()}</Text>
            </Box>
          ))}
        </Flex>
      )}
    </Box>
  );
};

export default NominationTable;
