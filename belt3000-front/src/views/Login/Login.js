import React, { Component } from 'react';
import { Config } from '../../config/config';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }
  handleInputChange = event => {
    const { value, name } = event.target;
    this.setState({
      [name]: value,
    });
  };
  onSubmit = event => {
    event.preventDefault();
    axios
      .post(`${Config.API_URL}auth/login`, this.state)
      .then(async res => {
        if (res.status === 200) {
          console.log(res);
          localStorage.setItem('token', res.data.token);
          this.props.history.push('/');
        } else {
          const error = new Error(res.error);
          throw error;
        }
      })
      .catch(err => {
        console.log(err);
        console.error(err);
      });
  };
  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <h1>Login Below!</h1>
        <input
          type="email"
          name="email"
          placeholder="jan.kowalski@gmail.com"
          value={this.state.email}
          onChange={this.handleInputChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Wpisz hasło"
          value={this.state.password}
          onChange={this.handleInputChange}
          required
        />
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default withRouter(Login);
