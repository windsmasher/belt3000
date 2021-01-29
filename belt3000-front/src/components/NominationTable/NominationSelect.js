import React from 'react';
import { Box, Select, Stack } from '@chakra-ui/react';
import ButtonComponent from '../ButtonComponent';
import { useHistory } from 'react-router-dom';

const NominationSelect = ({ selectedCompetitor, handleNominationPerson, competitors, deletePreviousNomination }) => {
  const history = useHistory();

  return (
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
};

export default NominationSelect;
