import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import SuccessMessage from '../../components/SuccessMessage/SuccessMessage';
import { useParams } from 'react-router';
import { Config } from '../../config/config';

const AddNomination = () => {
  const [nomination, setNomination] = useState({ date: new Date(), nominationType: 0, description: null });
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const { competitorId } = useParams();

  const handleSubmit = async e => {
    e.preventDefault();
    console.log(nomination);
    try {
      const res = await fetch(`${Config.API_URL}nomination/add/${competitorId}`, {
        method: 'POST',
        body: JSON.stringify(nomination),
        headers: { 'Content-Type': 'application/json', authorization: localStorage.getItem('token') },
      });
      if (res.status !== 201) {
        setErrorMsg('Wystąpił błąd. Niepoprawne dane.');
        setSuccessMsg(null);
      } else {
        setSuccessMsg('Poprawnie dodano nominacje.');
        setErrorMsg(null);
      }
    } catch (e) {
      setErrorMsg('Wystąpił błąd.');
    }
  };

  return (
    <Container>
      {errorMsg && <ErrorMessage message={errorMsg} />}
      {successMsg && <SuccessMessage message={successMsg} />}
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
