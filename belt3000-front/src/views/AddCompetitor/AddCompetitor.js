import React from 'react';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import SuccessMessage from '../../components/SuccessMessage/SuccessMessage';
import { Config } from '../../config/config';

class AddCompetitor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      competitor: { firstname: '', lastname: '', isAdult: false, belt: 'biały', stripes: '0' },
      errorMsg: null,
      successMsg: null,
    };
  }

  handleChange = event => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({ competitor: { ...this.state.competitor, [name]: value } });
  };

  handleCheckbox = event => {
    this.setState({ competitor: { ...this.state.competitor, isAdult: event.target.checked } });
  };

  handleSubmit = async event => {
    event.preventDefault();
    try {
      const res = await fetch(`${Config.API_URL}competitor/add`, {
        method: 'POST',
        body: JSON.stringify(this.state.competitor),
        headers: { 'Content-Type': 'application/json', authorization: localStorage.getItem('token') },
      });

      if (res.status !== 201) {
        this.setState({ errorMsg: 'Wystąpił błąd. Niepoprawne dane.', successMsg: null });
      } else {
        this.setState({ successMsg: 'Poprawnie dodano zawodnika.', errorMsg: null });
      }
    } catch (err) {
      this.setState({ errorMsg: 'Wystąpił błąd.' });
    }
  };

  render() {
    return (
      <div>
        {this.state.errorMsg && <ErrorMessage message={this.state.errorMsg} />}
        {this.state.successMsg && <SuccessMessage message={this.state.successMsg} />}
        Dodaj zawodnika
        <form onSubmit={e => this.handleSubmit(e)}>
          <label>
            Imię:
            <input
              type="text"
              name="firstname"
              value={this.state.competitor.firstname}
              onChange={e => this.handleChange(e)}
            />
          </label>
          <label>
            Nazwisko:
            <input
              type="text"
              name="lastname"
              value={this.state.competitor.lastname}
              onChange={e => this.handleChange(e)}
            />
          </label>
          <label>
            Czy jest dorosły:
            <input
              type="checkbox"
              name="isAdult"
              onChange={e => this.handleCheckbox(e)}
              checked={this.state.competitor.isAdult}
            />
          </label>
          {this.state.competitor.isAdult === true ? (
            <label>
              Kolor pasa:
              <select name="belt" id="belt" value={this.state.competitor.belt} onChange={e => this.handleChange(e)}>
                <option value="biały">biały</option>
                <option value="niebieski">niebieski</option>
                <option value="purpurowy">purpurowy</option>
                <option value="brązowy">brązowy</option>
                <option value="czarny">czarny</option>
              </select>
            </label>
          ) : (
            <label>
              Kolor pasa:
              <select name="belt" id="belt" value={this.state.competitor.belt} onChange={e => this.handleChange(e)}>
                <option value="biały">biały</option>
                <option value="żółty">żółty</option>
                <option value="pomarańczowy">pomarańczowy</option>
                <option value="brązowy">brązowy</option>
              </select>
            </label>
          )}
          <label>
            Ilość belek:
            <select
              name="stripes"
              id="stripes"
              value={this.state.competitor.stripes}
              onChange={e => this.handleChange(e)}
            >
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </label>
          <input type="submit" value="Wyślij" />
        </form>
      </div>
    );
  }
}

export default AddCompetitor;
