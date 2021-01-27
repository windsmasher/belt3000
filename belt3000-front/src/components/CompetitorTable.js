import React from 'react';
import { NavLink } from 'react-router-dom';
import { Stack, Box, Link, Flex, Table, Thead, Tbody, Tr, Th, Td, useMediaQuery, Text } from '@chakra-ui/react';
import SpinnerComponent from '../components/Spinner';
import ButtonComponent from '../components/ButtonComponent';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import NoDataMsg from '../components/NoDataMsg';
import { useHistory } from 'react-router-dom';

const CompetitorTable = ({ competitors, handleDelete, competitorsDownloaded }) => {
  const history = useHistory();
  const [isTable] = useMediaQuery('(min-width: 766px)');

  const competitorTableRows = competitors.map((comp, index) => (
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
      {!competitorsDownloaded ? (
        <SpinnerComponent />
      ) : competitors.length === 0 ? (
        <NoDataMsg msg="Brak dodanych zawodników" />
      ) : isTable ? (
        <Box>
          <Box>
            {!competitorsDownloaded ? (
              <SpinnerComponent />
            ) : competitors.length === 0 ? (
              <NoDataMsg msg="Brak dodanych zawodników" />
            ) : (
              <Table>
                <Thead>
                  <Tr>
                    <Th>Lp.</Th>
                    <Th>Imię</Th>
                    <Th>Nazwisko</Th>
                    <Th>Wiek</Th>
                    <Th>Kolor pasa</Th>
                    <Th>Ilość belek</Th>
                    <Th>Edytuj</Th>
                    <Th>Usuń</Th>
                  </Tr>
                </Thead>
                <Tbody>{competitorTableRows}</Tbody>
              </Table>
            )}
          </Box>
        </Box>
      ) : (
        <Flex direction="column" align="center" textAlign="center">
          {competitors.map((comp, index) => (
            <Box mb="15">
              <Text fontSize="xl">
                {comp.firstname} {comp.lastname}
              </Text>
              <Text>{Boolean(comp.isAdult) === true ? 'Dorosły' : 'U18'}</Text>
              <Text>
                {comp.belt} (belki: {comp.stripes})
              </Text>
              <Link as={NavLink} to={`/add-competitor/${comp.id}`}>
                <EditIcon w={5} h={5} />
              </Link>
              <Link href="#" onClick={() => handleDelete(comp.id)}>
                <DeleteIcon w={5} h={5} />
              </Link>
            </Box>
          ))}
        </Flex>
      )}
    </Box>
  );
};

export default CompetitorTable;
