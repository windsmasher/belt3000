import React, { useState } from 'react';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import SuccessMessage from '../../components/SuccessMessage/SuccessMessage';
import { Config } from '../../config/config';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

const RegisterAdmin = () => {
  const [registerData, setRegisterData] = useState({ firstname: '', lastname: '', password: '', email: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = event => {
    const name = event.target.name;
    const value = event.target.value;
    setRegisterData({ ...registerData, [name]: value });
  };

  const handleSubmit = async event => {
    event.preventDefault();
    try {
      const res = await fetch(`${Config.API_URL}user/register-admin`, {
        method: 'POST',
        body: JSON.stringify(registerData),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (res.status !== 201) {
        setSuccessMsg('');
        setErrorMsg('Wystąpił błąd. Niepoprawne dane.');
      } else {
        setSuccessMsg('Poprawnie zarejestrowano.');
        setErrorMsg('');
      }
    } catch (e) {
      setSuccessMsg('');
      setErrorMsg('Wystąpił błąd.');
    }
  };

  return (
    <Container>
      {errorMsg && <ErrorMessage message={errorMsg} />}
      {successMsg && <SuccessMessage message={successMsg} />}
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                defaultValue={registerData.email}
                onChange={handleChange}
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
                defaultValue={registerData.password}
                onChange={handleChange}
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
                defaultValue={registerData.firstname}
                onChange={handleChange}
                placeholder="Jan"
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="lastname">
              <Form.Label>Nazwisko</Form.Label>
              <Form.Control
                name="lastname"
                defaultValue={registerData.lastname}
                onChange={handleChange}
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
};

export default RegisterAdmin;
