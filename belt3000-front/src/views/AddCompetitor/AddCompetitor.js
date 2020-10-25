import React from 'react';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import SuccessMessage from '../../components/SuccessMessage/SuccessMessage';
import { Config } from '../../config/config';

class AddCompetitor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      competitor: { firstname: '', lastname: '', isAdult: false },
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
    // console.log(event.target.checked);
    this.setState({ competitor: { ...this.state.competitor, isAdult: event.target.checked } });
    console.log(this.state.competitor.isAdult);
  };

  handleSubmit = event => {
    event.preventDefault();
    console.log('before', this.state.competitor);
    fetch(`${Config.API_URL}add-competitor`, {
      method: 'POST',
      body: JSON.stringify(this.state.competitor),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        console.log(response.status);
        if (response.status !== 201) {
          this.setState({ errorMsg: 'Wystąpił błąd. Niepoprawne dane.', successMsg: null });
        } else {
          this.setState({ successMsg: 'Poprawnie dodano zawodnika.', errorMsg: null });
        }
      })
      .catch(e => {
        console.log(e);
        this.setState({ errorMsg: 'Wystąpił błąd.' });
      });
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
          <input type="submit" value="Wyślij" />
        </form>
      </div>
    );
  }
}

export default AddCompetitor;
