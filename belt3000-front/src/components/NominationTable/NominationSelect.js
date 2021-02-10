import React from 'react';
import { Box, Select, Stack, useToast } from '@chakra-ui/react';
import ButtonComponent from '../ButtonComponent';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { deleteLastNomination } from '../../actions/nomination-actions';

const NominationSelect = ({ selectedCompetitor, handleNominationPerson, competitors }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const toast = useToast();

  const deletePreviousNomination = async () => {
    dispatch(deleteLastNomination(selectedCompetitor, toast));
  };

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
