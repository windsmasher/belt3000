import React from 'react';
import { Config } from '../../config/config';
import './Competitors.css';

class Competitors extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      competitors: [],
    };
  }

  componentDidMount = async () => {
    const response = await fetch(`${Config.API_URL}competitors`);
    const competitors = await response.json();
    this.setState({
      competitors: competitors,
    });
  };

  handleDelete = async id => {
    await fetch(`${Config.API_URL}competitor/${id}`, {
      method: 'DELETE',
    });
  };

  render = () => {
    const competitorsList = this.state.competitors.map(comp => (
      <li>
        {`${comp.firstname} ${comp.lastname}`}{' '}
        <a href="#" onClick={() => this.handleDelete(comp._id)}>
          Usuń
        </a>
      </li>
    ));
    return (
      <div>
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
