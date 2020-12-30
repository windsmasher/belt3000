import React from 'react';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import SuccessMessage from '../../components/SuccessMessage/SuccessMessage';
import { Config } from '../../config/config';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

class AddCompetitor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      competitor: { firstname: '', lastname: '', isAdult: true, belt: 'biały', stripes: '0' },
      errorMsg: null,
      successMsg: null,
    };
  }

  handleChange = event => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({ competitor: { ...this.state.competitor, [name]: value } });
    console.log(this.state.competitor);
    console.log(event.target.name);
    console.log(event.target.value);
  };

  handleIsAdult = event => {
    console.log(event.target.value);
    this.setState({ competitor: { ...this.state.competitor, isAdult: Boolean(event.target.value) } });
  };

  handleSubmit = async event => {
    event.preventDefault();
    try {
      const res = await fetch(`${Config.API_URL}competitor/add`, {
        method: 'POST',
        body: JSON.stringify(this.state.competitor),
        headers: { 'Content-Type': 'application/json', authorization: localStorage.getItem('token') },
      });

      if (res.status !== 201) {
        this.setState({ errorMsg: 'Wystąpił błąd. Niepoprawne dane.', successMsg: null });
      } else {
        this.setState({ successMsg: 'Poprawnie dodano zawodnika.', errorMsg: null });
      }
    } catch (err) {
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
              <Form.Group controlId="firstname">
                <Form.Label>Imię</Form.Label>
                <Form.Control
                  name="firstname"
                  defaultValue={this.state.competitor.firstname}
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
                  defaultValue={this.state.competitor.lastname}
                  onChange={this.handleChange}
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
                  defaultValue={this.state.competitor.isAdult}
                  onChange={this.handleIsAdult}
                >
                  <option value={false}>U18</option>
                  <option value={true}>Senior</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col>
              {this.state.competitor.isAdult === true ? (
                <Form.Group controlId="belt">
                  <Form.Label>Kolor pasa</Form.Label>
                  <Form.Control
                    as="select"
                    name="belt"
                    defaultValue={this.state.competitor.belt}
                    onChange={e => this.handleChange(e)}
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
                    defaultValue={this.state.competitor.belt}
                    onChange={e => this.handleChange(e)}
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
                  defaultValue={this.state.competitor.stripes}
                  onChange={e => this.handleChange(e)}
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
                Dodaj zawodnika
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    );
  }
}

export default AddCompetitor;
