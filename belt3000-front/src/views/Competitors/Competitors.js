import React from 'react';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import { Config } from '../../config/config';
import { Spinner, Table, Button } from 'react-bootstrap';
import './Competitors.css';

class Competitors extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      competitors: [],
      errorListFetch: false,
      errorDeleteCompetitor: false,
      competitorsDownloaded: false,
    };
  }

  fetchAllCompetitors = async () => {
    try {
      const response = await fetch(`${Config.API_URL}competitor/all`, {
        headers: { authorization: localStorage.getItem('token') },
      });
      const competitors = await response.json();
      this.setState({ competitors });
      this.setState({ competitorsDownloaded: true });
    } catch (err) {
      this.setState({ errorListFetch: true });
      console.log(`Competitors fetch error: ${err}`);
    }
  };

  componentDidMount = async () => {
    this.fetchAllCompetitors();
  };

  handleDelete = async id => {
    try {
      const res = await fetch(`${Config.API_URL}competitor/${id}`, {
        method: 'DELETE',
        headers: { authorization: localStorage.getItem('token') },
      });
      if (res.status !== 200) {
        this.setState({ errorDeleteCompetitor: true });
      }
    } catch (e) {
      this.setState({ errorDeleteCompetitor: true });
    }
    this.fetchAllCompetitors();
  };

  render = () => {
    const competitorsList = this.state.competitors.map((comp, index) => (
      <tr>
        <th>{index + 1}</th>
        <th>{comp.firstname}</th>
        <th>{comp.lastname}</th>
        <th>{Boolean(comp.isAdult) === true ? 'Dorosły' : 'U18'}</th>
        <th>{comp.belt}</th>
        <th>{comp.stripes}</th>
        <th>
          {' '}
          <a href="#" onClick={() => this.handleDelete(comp._id)}>
            Usuń
          </a>
        </th>
      </tr>
    ));
    return (
      <div>
        {this.state.errorListFetch && <ErrorMessage message={'Błąd pobrania listy zawodników.'} />}
        {this.state.errorDeleteCompetitor && <ErrorMessage message={'Usunięcie zawodnika nie powiodło się.'} />}
        <div className="container-center">
          <a href="/add-competitor">
            <Button className="btn-wide" variant="outline-info">
              Dodaj zawodnika
            </Button>
          </a>
        </div>
        <div>
          {this.state.competitorsDownloaded ? (
            <Table>
              <thead>
                <tr>
                  <th>Lp.</th>
                  <th>Imię</th>
                  <th>Nazwisko</th>
                  <th>Kategoria wiekowa</th>
                  <th>Kolor pasa</th>
                  <th>Ilość belek</th>
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
}

export default Competitors;
