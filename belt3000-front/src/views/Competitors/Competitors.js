import React from 'react';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import { Config } from '../../config/config';
import './Competitors.css';

class Competitors extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      competitors: [],
      errorListFetch: false,
      errorDeleteCompetitor: false,
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
    const competitorsList = this.state.competitors.map(comp => (
      <li>
        {`${comp.firstname} ${comp.lastname}`}
        {Boolean(comp.isAdult) === true ? ' (dorosły)' : ' (U18)'}
        {` - pas ${comp.belt}${comp.stripes === 0 ? ' ' : ', ' + comp.stripes + ' belki '}`}
        <a href="#" onClick={() => this.handleDelete(comp._id)}>
          Usuń
        </a>
      </li>
    ));
    return (
      <div>
        {this.state.errorListFetch && <ErrorMessage message={'Błąd pobrania listy zawodników.'} />}
        {this.state.errorDeleteCompetitor && <ErrorMessage message={'Usunięcie zawodnika nie powiodło się.'} />}
        <a href="/add-competitor">Dodaj zawodnika</a>
        <div>
          <p>Zawodnicy</p>
          <ul className="list">{competitorsList}</ul>
        </div>
      </div>
    );
  };
}

export default Competitors;
