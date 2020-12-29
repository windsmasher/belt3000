import React, { Component } from 'react';
import { Config } from '../../config/config';
import { withRouter } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: {
        email: '',
        password: '',
      },
      errorLogin: false,
    };
  }
  handleInputChange = event => {
    const { value, name } = event.target;
    this.setState({
      login: { ...this.state.login, [name]: value },
    });
  };
  onSubmit = async event => {
    event.preventDefault();
    try {
      const res = await fetch(`${Config.API_URL}auth/login`, {
        method: 'POST',
        body: JSON.stringify(this.state.login),
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.status === 200) {
        const data = await res.json();
        localStorage.setItem('token', data.token);
        this.props.history.push('/');
      } else {
        this.setState({ errorLogin: true });
      }
    } catch (e) {
      this.setState({ errorLogin: true });
    }
  };
  render() {
    return (
      <div>
        {this.state.errorLogin && <ErrorMessage message={'Błąd logowania.'} />}
        <form onSubmit={this.onSubmit}>
          <input
            type="email"
            name="email"
            placeholder="jan.kowalski@gmail.com"
            value={this.state.login.email}
            onChange={this.handleInputChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Wpisz hasło"
            value={this.state.login.password}
            onChange={this.handleInputChange}
            required
          />
          <input type="submit" value="Zaloguj" />
        </form>
        <p>Nie masz konta?</p>
        <NavLink to="/register-admin">
          <div className="navbar__pill">Zarejestruj się</div>
        </NavLink>
      </div>
    );
  }
}

export default withRouter(Login);
