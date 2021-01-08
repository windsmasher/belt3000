import React, { useState, useEffect } from 'react';
import { Config } from '../../config/config';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import { Table, Spinner, Form, Button } from 'react-bootstrap';

const Nominations = () => {
  const [nominations, setNominations] = useState([]);
  const [competitors, setCompetitors] = useState([]);
  const [selectedCompetitor, setSelectedCompetitor] = useState('all');
  const [nominationsDownloaded, setNominationsDownloaded] = useState(false);
  const [errorListFetch, setErrorListFetch] = useState(false);

  useEffect(() => {
    fetchAllNominations();
    fetchAllCompetitors();
  }, []);

  const fetchAllCompetitors = async () => {
    try {
      const response = await fetch(`${Config.API_URL}competitor/all`, {
        headers: { authorization: localStorage.getItem('token') },
      });
      const competitors = await response.json();
      setCompetitors(competitors);
    } catch (err) {
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
      setErrorListFetch(true);
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
      setErrorListFetch(true);
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
      const response = await fetch(`${Config.API_URL}nomination/previous/${selectedCompetitor}`, {
        method: 'DELETE',
        headers: { authorization: localStorage.getItem('token') },
      });
      console.log(response.status);
    } catch (err) {
      setErrorListFetch(true);
    }
  };

  const nominationList = nominations.map((nom, index) => (
    <tr>
      <th>{index + 1}</th>
      <th>{nom.person}</th>
      <th>{nom.nomination}</th>
      <th>{new Date(nom.date).toLocaleDateString()}</th>
      <th>{nom.description}</th>
    </tr>
  ));

  return (
    <div>
      {errorListFetch && <ErrorMessage message={'Błąd pobrania listy nominacji.'} />}
      {selectedCompetitor === 'all' ? (
        <div></div>
      ) : (
        <div className="container-center">
          <a href={`/add-nomination/${selectedCompetitor}`}>
            <Button className="btn-wide" variant="outline-info">
              Dodaj nominacje
            </Button>
          </a>
        </div>
      )}
      {selectedCompetitor === 'all' ? (
        <div></div>
      ) : (
        <div className="container-center">
          <Button className="btn-wide" variant="outline-info" onClick={deletePreviousNomination}>
            Usuń ostatnią nominacje
          </Button>
        </div>
      )}
      <Form>
        <Form.Group>
          <Form.Label>Osobowa nominowana</Form.Label>
          <Form.Control as="select" name="person" value={selectedCompetitor} onChange={handleNominationPerson}>
            <option value="all">Wszystkie</option>
            {competitors.map(person => (
              <option key={person._id} value={person._id}>
                {`${person.firstname} ${person.lastname}`}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
      </Form>
      <div>
        {nominationsDownloaded ? (
          <Table>
            <thead>
              <tr>
                <th>Lp.</th>
                <th>Osoba nominowana</th>
                <th>Nominacja</th>
                <th>Data</th>
                <th>Opis</th>
              </tr>
            </thead>
            <tbody>{nominationList}</tbody>
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

export default Nominations;
