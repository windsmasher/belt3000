import { Container, Row } from 'react-bootstrap';
import React, { useState, useEffect, useContext } from 'react';
import { Config } from '../../config/config';
import { AuthContext } from '../../context';
import Login from '../Login/Login';

const Home = () => {
  const [competitors, setCompetitors] = useState([]);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchAllCompetitors();
    console.log(competitors.map(competitor => competitor.nomination));
  }, []);

  const fetchAllCompetitors = async () => {
    try {
      const response = await fetch(`${Config.API_URL}competitor/all`, {
        headers: { authorization: authContext.token },
      });
      const competitors = await response.json();
      setCompetitors(competitors);
    } catch (err) {
      console.log(`Competitors fetch error: ${err}`);
    }
  };

  return (
    <Container>
      <Row>
        <h3>Statystyki</h3>
      </Row>
      <Row>Łączna liczba zawodników: {competitors.length}</Row>
      <Row>Łączna liczba nominacji: {competitors.reduce((prev, curr) => prev + curr.nomination.length, 0)}</Row>
    </Container>
  );
};

export default Home;
