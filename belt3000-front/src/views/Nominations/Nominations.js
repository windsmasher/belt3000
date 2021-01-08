import React, { useState, useEffect, useContext } from 'react';
import { Config } from '../../config/config';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import SuccessMessage from '../../components/SuccessMessage/SuccessMessage';
import { Table, Spinner, Form, Button } from 'react-bootstrap';
import { AuthContext } from '../../context';

const Nominations = () => {
  const [nominations, setNominations] = useState([]);
  const [competitors, setCompetitors] = useState([]);
  const [selectedCompetitor, setSelectedCompetitor] = useState('all');
  const [nominationsDownloaded, setNominationsDownloaded] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const authContext = useContext(AuthContext);

  useEffect(() => {
    setError('');
    setSuccess('');
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
      setError('');
    } catch (err) {
      setError('Błąd pobrania listy zawodników.');
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
      setError('');
    } catch (err) {
      setSuccess('');
      setError('Błąd pobrania listy nominacji.');
    }
  };

  const fetchNominationsByCompetitor = async competitorId => {
    try {
      const response = await fetch(`${Config.API_URL}nomination/by-competitor/${competitorId}`, {
        headers: { authorization: localStorage.getItem('token') },
      });
      const nominationsByCompetitor = await response.json();
      setNominations(nominationsByCompetitor);
      setError('');
    } catch (err) {
      setSuccess('');
      setError('Błąd pobrania listy nominacji.');
    }
  };

  const handleNominationPerson = async event => {
    setError('');
    setSuccess('');
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
        setSuccess('Poprawnie usunięto ostatnią nominacje.');
        setError('');
      } else {
        setSuccess('');
        setError('Błąd usunięcia ostatniej nominacji.');
      }
    } catch (err) {
      setSuccess('');
      setError('Błąd usunięcia ostatniej nominacji.');
    }
    fetchAllNominations();
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
      {error && <ErrorMessage message={error} />}
      {success && <SuccessMessage message={success} />}
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
      {selectedCompetitor === 'all' || competitors.length === 0 ? (
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
