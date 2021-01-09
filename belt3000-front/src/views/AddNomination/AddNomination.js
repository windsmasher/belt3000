import React, { useState, useContext } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router';
import { Config } from '../../config/config';
import { AuthContext } from '../../context';
import { useToast } from '@chakra-ui/react';

const AddNomination = () => {
  const [nomination, setNomination] = useState({ date: new Date(), nominationType: 0, description: null });
  const { competitorId } = useParams();
  const authContext = useContext(AuthContext);
  const toast = useToast();

  const handleSubmit = async e => {
    e.preventDefault();
    console.log(nomination);
    try {
      const res = await fetch(`${Config.API_URL}nomination/add/${competitorId}`, {
        method: 'POST',
        body: JSON.stringify(nomination),
        headers: { 'Content-Type': 'application/json', authorization: authContext.token },
      });
      if (res.status !== 201) {
        toast({
          title: 'Wystąpił błąd. Niepoprawne dane.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Poprawnie dodano nominacje.',
          status: 'success',
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
      <Form onSubmit={e => handleSubmit(e)}>
        <Row>
          <Col>
            <Form.Group controlId="date">
              <Form.Label>Data</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={nomination.date}
                onChange={e => setNomination({ ...nomination, date: e.target.value })}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="nominationType">
              <Form.Label>Rodzaj nominacji</Form.Label>
              <Form.Control
                as="select"
                name="nominationType"
                value={nomination.nominationType}
                onChange={e => setNomination({ ...nomination, nominationType: Number(e.target.value) })}
              >
                <option value={0}>Pas</option>
                <option value={1}>1 belka</option>
                <option value={2}>2 belki</option>
                <option value={3}>3 belki</option>
                <option value={4}>4 belki</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group controlId="description">
              <Form.Label>Opis</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={nomination.description}
                onChange={e => setNomination({ ...nomination, description: e.target.value })}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button variant="outline-success" type="submit">
              {'Dodaj nominacje'}
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default AddNomination;
