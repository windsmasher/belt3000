import React from 'react';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import SuccessMessage from '../../components/SuccessMessage/SuccessMessage';
import { Config } from '../../config/config';

class RegisterAdmin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      register: { firstname: '', lastname: '', password: '', email: '' },
      errorMsg: null,
      successMsg: null,
    };
  }

  handleChange = event => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({ register: { ...this.state.register, [name]: value } });
  };

  handleSubmit = event => {
    event.preventDefault();
    console.log('before', this.state.register);
    fetch(`${Config.API_URL}admin/register-admin`, {
      method: 'POST',
      body: JSON.stringify(this.state.register),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        console.log(response.status);
        if (response.status !== 201) {
          this.setState({ errorMsg: 'Wystąpił błąd. Niepoprawne dane.', successMsg: null });
        } else {
          this.setState({ successMsg: 'Poprawnie zarejestrowano.', errorMsg: null });
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
        Zarejestruj się
        <form onSubmit={e => this.handleSubmit(e)}>
          <label>
            Email:
            <input type="text" name="email" value={this.state.register.email} onChange={e => this.handleChange(e)} />
          </label>
          <label>
            Hasło:
            <input
              type="password"
              name="password"
              value={this.state.register.password}
              onChange={e => this.handleChange(e)}
            />
          </label>
          <label>
            Imię:
            <input
              type="text"
              name="firstname"
              value={this.state.register.firstname}
              onChange={e => this.handleChange(e)}
            />
          </label>
          <label>
            Nazwisko:
            <input
              type="text"
              name="lastname"
              value={this.state.register.lastname}
              onChange={e => this.handleChange(e)}
            />
          </label>
          <input type="submit" value="OK" />
        </form>
      </div>
    );
  }
}

export default RegisterAdmin;
