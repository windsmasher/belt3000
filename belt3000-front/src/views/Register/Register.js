import React from 'react';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import SuccessMessage from '../../components/SuccessMessage/SuccessMessage';
import { Config } from '../../config/config';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

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

  handleSubmit = async event => {
    event.preventDefault();
    try {
      const res = await fetch(`${Config.API_URL}user/register-admin`, {
        method: 'POST',
        body: JSON.stringify(this.state.register),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (res.status !== 201) {
        this.setState({ errorMsg: 'Wystąpił błąd. Niepoprawne dane.', successMsg: null });
      } else {
        this.setState({ successMsg: 'Poprawnie zarejestrowano.', errorMsg: null });
      }
    } catch (e) {
      this.setState({ errorMsg: 'Wystąpił błąd.' });
    }
  };

  render() {
    return (
      <Container>
        {this.state.errorMsg && <ErrorMessage message={this.state.errorMsg} />}
        {this.state.successMsg && <SuccessMessage message={this.state.successMsg} />}
        <Form onSubmit={e => this.handleSubmit(e)}>
          <Row>
            <Col>
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  defaultValue={this.state.register.email}
                  onChange={this.handleChange}
                  placeholder="jan.kowalski@gmail.com"
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="password">
                <Form.Label>Hasło</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  defaultValue={this.state.register.password}
                  onChange={this.handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="firstname">
                <Form.Label>Imię</Form.Label>
                <Form.Control
                  name="firstname"
                  defaultValue={this.state.register.firstname}
                  onChange={this.handleChange}
                  placeholder="Jan"
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="lastname">
                <Form.Label>Nazwisko</Form.Label>
                <Form.Control
                  name="lastname"
                  defaultValue={this.state.register.lastname}
                  onChange={this.handleChange}
                  placeholder="Kowalski"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="container-center">
                <Button className="btn-wide" variant="outline-success" type="submit" value="OK">
                  Zarejestruj się
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </Container>
    );
  }
}

export default RegisterAdmin;
