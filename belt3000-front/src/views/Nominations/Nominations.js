import React from 'react';
import { Config } from '../../config/config';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import { Table, Spinner, Form, Button } from 'react-bootstrap';
class Nominations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nominations: [],
      competitors: [],
      selectedCompetitor: 'all',
      nominationsDownloaded: false,
      errorListFetch: false,
    };
  }

  fetchAllCompetitors = async () => {
    try {
      const response = await fetch(`${Config.API_URL}competitor/all`, {
        headers: { authorization: localStorage.getItem('token') },
      });
      const competitors = await response.json();
      this.setState({ competitors });
    } catch (err) {
      console.log(`Competitors fetch error: ${err}`);
    }
  };

  fetchAllNominations = async () => {
    try {
      const response = await fetch(`${Config.API_URL}nomination/all`, {
        headers: { authorization: localStorage.getItem('token') },
      });
      const nominations = await response.json();
      this.setState({ nominations, nominationsDownloaded: true });
      console.log(this.state);
    } catch (err) {
      this.setState({ errorListFetch: true });
    }
  };

  fetchNominationsByCompetitor = async competitorId => {
    try {
      const response = await fetch(`${Config.API_URL}nomination/by-competitor/${competitorId}`, {
        headers: { authorization: localStorage.getItem('token') },
      });
      const nominationsByCompetitor = await response.json();
      this.setState({ nominations: nominationsByCompetitor });
    } catch (err) {
      this.setState({ errorListFetch: true });
    }
  };

  handleNominationPerson = async event => {
    this.setState({ selectedCompetitor: event.target.value });
    if (event.target.value === 'all') {
      await this.fetchAllNominations();
    } else {
      await this.fetchNominationsByCompetitor(event.target.value);
    }
    console.log(this.state);
  };

  componentDidMount = async () => {
    this.fetchAllNominations();
    this.fetchAllCompetitors();
  };

  render = () => {
    const nominationList = this.state.nominations.map((nom, index) => (
      <tr>
        <th>{index + 1}</th>
        <th>{nom.person}</th>
        <th>{nom.nomination}</th>
        <th>{nom.date}</th>
        <th>{nom.description}</th>
      </tr>
    ));
    return (
      <div>
        {this.state.errorListFetch && <ErrorMessage message={'Błąd pobrania listy nominacji.'} />}
        {this.state.selectedCompetitor === 'all' ? (
          <div></div>
        ) : (
          <div className="container-center">
            <a href="/add-nomination/">
              <Button className="btn-wide" variant="outline-info">
                Dodaj nominacje
              </Button>
            </a>
          </div>
        )}
        <Form>
          <Form.Group>
            <Form.Label>Osobowa nominowana</Form.Label>
            <Form.Control
              as="select"
              name="person"
              value={this.state.selectedCompetitor}
              onChange={this.handleNominationPerson}
            >
              <option value="all">Wszystkie</option>
              {this.state.competitors.map(person => (
                <option key={person._id} value={person._id}>
                  {`${person.firstname} ${person.lastname}`}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Form>
        <div>
          {this.state.nominationsDownloaded ? (
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
}

export default Nominations;
