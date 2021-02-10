import React, { useState } from 'react';
import { Box, Input, Link, useToast } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { updateDescription } from '../../actions/nomination-actions';

const EditDescription = ({ description, id }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [tempDescription, setTempDescription] = useState(description);
  const dispatch = useDispatch();
  const toast = useToast();

  return (
    <Box>
      <Box cursor="poiner" onClick={() => setIsEdit(true)}>
        <Input
          disabled={!isEdit}
          name="description"
          defaultValue={description}
          value={tempDescription}
          onChange={e => setTempDescription(e.target.value)}
        />
      </Box>
      {isEdit ? (
        <Box mt={5}>
          <Link
            onClick={() => {
              dispatch(updateDescription(id, tempDescription, toast));
              setIsEdit(false);
            }}
          >
            Zapisz
          </Link>
          <Link
            ml={5}
            onClick={() => {
              setIsEdit(false);
              setTempDescription(description);
            }}
          >
            Anuluj
          </Link>
        </Box>
      ) : null}
    </Box>
  );
};

export default EditDescription;
