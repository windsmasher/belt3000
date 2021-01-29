import React from 'react';
import SpinnerComponent from '../Spinner';
import NoDataMsg from '../NoDataMsg';
import { Table, Thead, Tbody, Tr, Th, Td, Box, useMediaQuery, Flex, Text } from '@chakra-ui/react';
import EditDescription from './EditDescription';
import NominationSelect from './NominationSelect';

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
  const [isTable] = useMediaQuery('(min-width: 766px)');

  return (
    <Box>
      <NominationSelect
        selectedCompetitor={selectedCompetitor}
        handleNominationPerson={handleNominationPerson}
        competitors={competitors}
        deletePreviousNomination={deletePreviousNomination}
      />
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
                    <EditDescription
                      nom={nom}
                      index={index}
                      setIsEditDescriptionId={setIsEditDescriptionId}
                      isEditDescriptionId={isEditDescriptionId}
                      nominations={nominations}
                      tempDescriptions={tempDescriptions}
                      setTempDescriptions={setTempDescriptions}
                      updateDescription={updateDescription}
                    />
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
