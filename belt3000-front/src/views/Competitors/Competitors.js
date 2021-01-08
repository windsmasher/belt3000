import React, { useState, useContext, useEffect } from 'react';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import { Config } from '../../config/config';
import { Spinner, Table, Button } from 'react-bootstrap';
import './Competitors.css';
import { AuthContext } from '../../context';

const Competitors = () => {
  const authContext = useContext(AuthContext);
  const [competitors, setCompetitors] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [competitorsDownloaded, setCompetitorsDownloaded] = useState(false);

  useEffect(() => {
    fetchAllCompetitors();
  }, []);

  const fetchAllCompetitors = async () => {
    try {
      const response = await fetch(`${Config.API_URL}competitor/all`, {
        headers: { authorization: authContext.token },
      });
      const competitors = await response.json();
      setCompetitors(competitors);
      setCompetitorsDownloaded(true);
    } catch (err) {
      setErrorMsg('Błąd pobrania listy zawodników.');
    }
  };

  const handleDelete = async id => {
    try {
      const res = await fetch(`${Config.API_URL}competitor/${id}`, {
        method: 'DELETE',
        headers: { authorization: authContext.token },
      });
      if (res.status !== 200) {
        setErrorMsg('Błąd usunięcia zawodnika.');
      }
    } catch (e) {
      setErrorMsg('Błąd usunięcia zawodnika.');
    }
    fetchAllCompetitors();
  };

  const competitorsList = competitors.map((comp, index) => (
    <tr>
      <th>{index + 1}</th>
      <th>{comp.firstname}</th>
      <th>{comp.lastname}</th>
      <th>{Boolean(comp.isAdult) === true ? 'Dorosły' : 'U18'}</th>
      <th>{comp.belt}</th>
      <th>{comp.stripes}</th>
      <th>
        {' '}
        <a href={`/add-competitor/${comp._id}`}>Edytuj</a>
      </th>
      <th>
        {' '}
        <a href="#" onClick={() => handleDelete(comp._id)}>
          Usuń
        </a>
      </th>
    </tr>
  ));

  return (
    <div>
      {errorMsg && <ErrorMessage message={errorMsg} />}
      <div className="container-center">
        <a href="/add-competitor">
          <Button className="btn-wide" variant="outline-info">
            Dodaj zawodnika
          </Button>
        </a>
      </div>
      <div>
        {competitorsDownloaded ? (
          <Table>
            <thead>
              <tr>
                <th>Lp.</th>
                <th>Imię</th>
                <th>Nazwisko</th>
                <th>Kategoria wiekowa</th>
                <th>Kolor pasa</th>
                <th>Ilość belek</th>
                <th>Edytuj zawodnika</th>
                <th>Usuń zawodnika</th>
              </tr>
            </thead>
            <tbody>{competitorsList}</tbody>
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
