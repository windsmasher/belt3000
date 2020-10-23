import React from 'react';
import { Config } from '../../config/config';

class AddCompetitor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { firstname: '', lastname: '', isadult: false };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({ [name]: value });
    console.log(this.state);
  }

  async handleSubmit(event) {
    console.log(JSON.stringify(this.state));
    await fetch(`${Config.API_URL}add-competitor`, {
      method: 'POST',
      body: JSON.stringify(this.state),
    });
    event.preventDefault();
  }

  render() {
    return (
      <div>
        Dodaj zawodnika
        <form onSubmit={this.handleSubmit}>
          <label>
            Imię:
            <input type="text" name="firstname" value={this.state.firstname} onChange={this.handleChange} />
          </label>
          <label>
            Nazwisko:
            <input type="text" name="lastname" value={this.state.lastname} onChange={this.handleChange} />
          </label>
          <label>
            Czy jest dorosły:
            <input type="checkbox" name="isadult" value={this.state.isadult} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Wyślij" />
        </form>
      </div>
    );
  }
}

export default AddCompetitor;
