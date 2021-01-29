import React from 'react';
import { Box, Input, Link } from '@chakra-ui/react';

const EditDescription = ({
  nom,
  index,
  setIsEditDescriptionId,
  isEditDescriptionId,
  nominations,
  tempDescriptions,
  setTempDescriptions,
  updateDescription,
}) => (
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

export default EditDescription;
