import React, { Component } from 'react';
import { Config } from '../../config/config';
import { withRouter } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
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
      <Container>
        {this.state.errorLogin && <ErrorMessage message={'Błąd logowania.'} />}
        <Row>
          <Col>
            <Form onSubmit={this.onSubmit}>
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  defaultValue={this.state.login.email}
                  onChange={this.handleInputChange}
                  placeholder="jan.kowalski@gmail.com"
                />
              </Form.Group>

              <Form.Group controlId="password">
                <Form.Label>Hasło</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  defaultValue={this.state.login.password}
                  onChange={this.handleInputChange}
                />
              </Form.Group>
              <div className="container-center">
                <Button variant="outline-success" type="submit">
                  Zaloguj
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="container-center">
              <NavLink to="/register-admin">
                <Button variant="outline-info">Nie masz konta? Zarejestruj się.</Button>
              </NavLink>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default withRouter(Login);
