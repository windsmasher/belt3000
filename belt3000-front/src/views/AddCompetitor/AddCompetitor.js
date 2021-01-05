import React, { useState, useEffect } from 'react';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import SuccessMessage from '../../components/SuccessMessage/SuccessMessage';
import { Config } from '../../config/config';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router';

const AddCompetitor = () => {
  const [competitor, setCompetitor] = useState({
    firstname: '',
    lastname: '',
    isAdult: 'true',
    belt: 'biały',
    stripes: '0',
  });
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const { competitorId } = useParams();

  useEffect(() => {
    if (competitorId) {
      fetchCompetitor();
    }
  }, [competitorId]);

  const fetchCompetitor = async () => {
    const response = await fetch(`${Config.API_URL}competitor/one/${competitorId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', authorization: localStorage.getItem('token') },
    });
    const competitorJson = await response.json();

    let competitorTemp = {
      firstname: competitorJson.firstname,
      lastname: competitorJson.lastname,
      isAdult: competitorJson.isAdult.toString(),
      belt: competitorJson.belt,
      stripes: competitorJson.stripes.toString(),
    };

    setCompetitor(competitorTemp);
  };

  const handleSubmit = async event => {
    event.preventDefault();
    try {
      let competitorTemp = competitor;
      competitorTemp.isAdult = competitor.isAdult === 'true' ? true : false;

      const res = competitorId
        ? await fetch(`${Config.API_URL}competitor/${competitorId}`, {
            method: 'PATCH',
            body: JSON.stringify(competitorTemp),
            headers: { 'Content-Type': 'application/json', authorization: localStorage.getItem('token') },
          })
        : await fetch(`${Config.API_URL}competitor/add`, {
            method: 'POST',
            body: JSON.stringify(competitorTemp),
            headers: { 'Content-Type': 'application/json', authorization: localStorage.getItem('token') },
          });

      if (res.status !== 201) {
        setErrorMsg('Wystąpił błąd. Niepoprawne dane.');
        setSuccessMsg(null);
      } else {
        setSuccessMsg(competitorId ? 'Poprawnie zaktualizowano zawodnika.' : 'Poprawnie dodano zawodnika.');
        setErrorMsg(null);
      }
    } catch (err) {
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
            <Form.Group controlId="firstname">
              <Form.Label>Imię</Form.Label>
              <Form.Control
                name="firstname"
                defaultValue={competitor.firstname}
                onChange={e => setCompetitor({ ...competitor, firstname: e.target.value })}
                placeholder="Jan"
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="lastname">
              <Form.Label>Nazwisko</Form.Label>
              <Form.Control
                name="lastname"
                defaultValue={competitor.lastname}
                onChange={e => setCompetitor({ ...competitor, lastname: e.target.value })}
                placeholder="Kowalski"
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group controlId="isAdult">
              <Form.Label>Grupa wiekowa</Form.Label>
              <Form.Control
                as="select"
                name="isAdult"
                defaultValue={competitor.isAdult}
                onChange={e => setCompetitor({ ...competitor, isAdult: e.target.value })}
              >
                <option value={false}>U18</option>
                <option value={true}>Senior</option>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col>
            {competitor.isAdult === 'true' ? (
              <Form.Group controlId="belt">
                <Form.Label>Kolor pasa</Form.Label>
                <Form.Control
                  as="select"
                  name="belt"
                  defaultValue={competitor.belt}
                  onChange={e => setCompetitor({ ...competitor, belt: e.target.value })}
                >
                  <option value="biały">Biały</option>
                  <option value="niebieski">Niebieski</option>
                  <option value="purpurowy">Purpurowy</option>
                  <option value="brązowy">Brązowy</option>
                  <option value="czarny">Czarny</option>
                </Form.Control>
              </Form.Group>
            ) : (
              <Form.Group controlId="belt">
                <Form.Label>Kolor pasa</Form.Label>
                <Form.Control
                  as="select"
                  name="belt"
                  defaultValue={competitor.belt}
                  onChange={e => setCompetitor({ ...competitor, belt: e.target.value })}
                >
                  <option value="biały">Biały</option>
                  <option value="żółty">Żółty</option>
                  <option value="pomarańczowy">Pomarańczowy</option>
                  <option value="zielony">Zielony</option>
                </Form.Control>
              </Form.Group>
            )}
          </Col>
          <Col>
            <Form.Group controlId="stripes">
              <Form.Label>Ilość belek</Form.Label>
              <Form.Control
                as="select"
                name="stripes"
                defaultValue={competitor.stripes}
                onChange={e => setCompetitor({ ...competitor, stripes: e.target.value })}
              >
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button variant="outline-success" type="submit">
              {competitorId ? 'Aktualizuj zawodnika' : 'Dodaj zawodnika'}
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default AddCompetitor;
