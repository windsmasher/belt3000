import './Competitors.css';
import React, { useState, useContext, useEffect } from 'react';
import { Config } from '../../config/config';
import { AuthContext } from '../../context';
import { useHistory } from 'react-router-dom';
import { Table, Thead, Tbody, Tr, Th, Td, Spinner, useToast, Button } from '@chakra-ui/react';

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
        meThod: 'DELETE',
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
        {' '}
        <a href={`/add-competitor/${comp._id}`}>Edytuj</a>
      </Td>
      <Td>
        {' '}
        <a href="#" onClick={() => handleDelete(comp._id)}>
          Usuń
        </a>
      </Td>
    </Tr>
  ));

  return (
    <div>
      <div className="container-center">
        <Button onClick={() => history.push('/add-competitor')}>Dodaj zawodnika</Button>
      </div>
      <div>
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
                <Th>Edytuj zawodnika</Th>
                <Th>Usuń zawodnika</Th>
              </Tr>
            </Thead>
            <Tbody>{competitorsList}</Tbody>
          </Table>
        ) : (
          <div className="container-spinner">
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          </div>
        )}
      </div>
    </div>
  );
};

export default Competitors;
