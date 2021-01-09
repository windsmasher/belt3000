import React, { useContext, useState } from 'react';
import { Config } from '../../config/config';
import { withRouter } from 'react-router-dom';
import { NavLink, useHistory } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { AuthContext } from '../../context';
import { useToast } from '@chakra-ui/react';

const Login = () => {
  const authContext = useContext(AuthContext);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const history = useHistory();
  const toast = useToast();

  const handleInputChange = event => {
    const { value, name } = event.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const onSubmit = async event => {
    event.preventDefault();
    try {
      const res = await fetch(`${Config.API_URL}auth/login`, {
        method: 'POST',
        body: JSON.stringify(loginData),
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.status === 200) {
        const data = await res.json();
        authContext.login(data.token);
        history.push('/');
      } else {
        toast({
          title: 'Wystąpił błąd.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (e) {
      toast({
        title: 'Wystąpił błąd.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <Form onSubmit={onSubmit}>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                defaultValue={loginData.email}
                onChange={handleInputChange}
                placeholder="jan.kowalski@gmail.com"
              />
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>Hasło</Form.Label>
              <Form.Control
                type="password"
                name="password"
                defaultValue={loginData.password}
                onChange={handleInputChange}
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
};

export default withRouter(Login);
